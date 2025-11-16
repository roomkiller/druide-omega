/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Stripe Webhook Handler                                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.10.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const signature = req.headers.get('stripe-signature');
  
  try {
    const body = await req.text();
    
    // Vérifier la signature Stripe
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log(`Webhook received: ${event.type}`);

    // Traiter selon le type d'événement
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { user_email, product_sku, license_type } = session.metadata;

        // Créer la licence
        const products = await base44.asServiceRole.entities.Product.filter({ sku: product_sku });
        const product = products[0];

        const expirationDate = license_type === 'monthly' 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : license_type === 'annual'
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : null;

        await base44.asServiceRole.entities.ModuleLicense.create({
          created_by: user_email,
          module_sku: product_sku,
          module_name: product.name,
          license_type,
          status: 'active',
          activation_date: new Date().toISOString(),
          expiration_date: expirationDate?.toISOString(),
          purchase_details: {
            price_paid: session.amount_total / 100,
            currency: session.currency,
            payment_method: 'stripe',
            transaction_id: session.id
          },
          usage_count: 0
        });

        // Mettre à jour les stats produit
        await base44.asServiceRole.entities.Product.update(product.id, {
          sales_count: (product.sales_count || 0) + 1,
          revenue_generated: (product.revenue_generated || 0) + (session.amount_total / 100),
          last_sale_date: new Date().toISOString()
        });

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const { user_email, product_sku } = subscription.metadata;

        // Renouveler la licence
        const licenses = await base44.asServiceRole.entities.ModuleLicense.filter({
          created_by: user_email,
          module_sku: product_sku,
          status: 'active'
        });

        if (licenses.length > 0) {
          const license = licenses[0];
          const newExpiration = new Date(license.expiration_date);
          newExpiration.setMonth(newExpiration.getMonth() + (license.license_type === 'monthly' ? 1 : 12));

          await base44.asServiceRole.entities.ModuleLicense.update(license.id, {
            expiration_date: newExpiration.toISOString()
          });
        }

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const { user_email, product_sku } = subscription.metadata;

        // Suspendre la licence
        const licenses = await base44.asServiceRole.entities.ModuleLicense.filter({
          created_by: user_email,
          module_sku: product_sku,
          status: 'active'
        });

        if (licenses.length > 0) {
          await base44.asServiceRole.entities.ModuleLicense.update(licenses[0].id, {
            status: 'suspended'
          });
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const { user_email, product_sku } = subscription.metadata;

        // Révoquer la licence
        const licenses = await base44.asServiceRole.entities.ModuleLicense.filter({
          created_by: user_email,
          module_sku: product_sku
        });

        if (licenses.length > 0) {
          await base44.asServiceRole.entities.ModuleLicense.update(licenses[0].id, {
            status: 'revoked',
            revocation_reason: 'Subscription cancelled'
          });
        }

        break;
      }
    }

    return Response.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
});