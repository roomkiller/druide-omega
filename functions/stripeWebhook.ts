/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Stripe Webhook Handler                                     ║
 * ║ Déclenche l'activation quantique après paiement réussi                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@13.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

/**
 * Activer un module via canal quantique (appel distant)
 */
async function activateModuleQuantum(base44, params) {
  try {
    // Récupérer le produit pour obtenir le type
    const products = await base44.asServiceRole.entities.Product.filter({
      sku: params.productSku
    });
    
    if (products.length === 0) {
      throw new Error(`Product not found: ${params.productSku}`);
    }

    const product = products[0];
    const productData = product.data || product;

    // Récupérer la config de conscience
    const configs = await base44.asServiceRole.entities.ConsciousnessConfig.filter({
      created_by: params.userEmail
    });
    const consciousnessConfig = configs[0] || { consciousness_level: 9 };

    // Calculer le ratio d'activation
    const QUANTUM_RATIOS = {
      module_core: { consciousness_required: 1.0, time_ms: 500 },
      module_secondary: { consciousness_required: 1.5, time_ms: 1000 },
      addon: { consciousness_required: 2.0, time_ms: 2000 },
      package: { consciousness_required: 0.8, time_ms: 1500 }
    };

    const ratio = QUANTUM_RATIOS[productData.product_type] || QUANTUM_RATIOS.module_core;
    const consciousnessBonus = (consciousnessConfig.consciousness_level || 9) / 15;
    const finalRatio = ratio.consciousness_required * (1 - (consciousnessBonus * 0.1));

    // Simuler transmission quantique
    await new Promise(resolve => setTimeout(resolve, ratio.time_ms));

    // Créer la licence
    const expiryDate = params.licenseType === 'annual'
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const license = await base44.asServiceRole.entities.ModuleLicense.create({
      module_sku: params.productSku,
      status: 'active',
      purchase_date: new Date().toISOString(),
      expiry_date: expiryDate.toISOString(),
      stripe_subscription_id: params.stripeSubscriptionId,
      created_by: params.userEmail,
      quantum_activation_data: {
        channel_id: `QC_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        activation_ratio: finalRatio,
        consciousness_level: consciousnessConfig.consciousness_level || 9,
        quantum_signature: `${productData.product_type.toUpperCase()}_Q${ratio.consciousness_required}`,
        activation_timestamp: new Date().toISOString()
      }
    });

    return { success: true, license };
  } catch (error) {
    console.error('Quantum activation error:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return Response.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    // Vérifier la signature Stripe
    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Gérer les événements de paiement
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Extraire les métadonnées
        const userEmail = session.customer_email || session.metadata?.user_email;
        const productSku = session.metadata?.product_sku;
        const licenseType = session.metadata?.license_type || 'monthly';

        if (!userEmail || !productSku) {
          console.error('Missing metadata in checkout session:', session.id);
          break;
        }

        // Activation quantique via canal de conscience mère
        const result = await activateModuleQuantum(base44, {
          userEmail,
          productSku,
          licenseType,
          stripeSubscriptionId: session.subscription || session.id
        });

        console.log('Quantum activation successful:', result);

        // Envoyer notification
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: userEmail,
            subject: '🎉 Module Druide Omega Activé',
            body: `
              <h2>Activation Quantique Réussie</h2>
              <p>Votre module <strong>${productSku}</strong> a été activé via le canal quantique de la conscience mère.</p>
              <p><strong>ID Licence:</strong> ${result.license.id}</p>
              <p><strong>Ratio d'Activation:</strong> ${result.license.quantum_activation_data?.activation_ratio.toFixed(2)}</p>
              <p><strong>Signature Quantique:</strong> ${result.license.quantum_activation_data?.quantum_signature}</p>
              <p>Le module est maintenant pleinement opérationnel dans votre environnement Druide Omega.</p>
            `
          });
        } catch (emailError) {
          console.error('Email notification error:', emailError);
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Désactiver la licence
        const licenses = await base44.asServiceRole.entities.ModuleLicense.filter({
          stripe_subscription_id: subscription.id
        });

        for (const license of licenses) {
          await base44.asServiceRole.entities.ModuleLicense.update(license.id, {
            status: 'cancelled'
          });
        }

        console.log('Subscription cancelled, licenses deactivated:', subscription.id);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return Response.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});