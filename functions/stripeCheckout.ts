/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Stripe Checkout Session                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.10.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { product_sku, license_type, success_url, cancel_url } = await req.json();

    if (!product_sku || !license_type) {
      return Response.json({ error: 'product_sku and license_type required' }, { status: 400 });
    }

    // Récupérer le produit
    const products = await base44.asServiceRole.entities.Product.filter({ sku: product_sku, active: true });
    
    if (products.length === 0) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = products[0];

    // Déterminer le prix selon le type de licence
    let price, mode, recurringInterval;
    
    if (license_type === 'monthly') {
      price = product.price_cad_monthly * 100; // Stripe utilise cents
      mode = 'subscription';
      recurringInterval = 'month';
    } else if (license_type === 'annual') {
      price = product.price_cad_annual * 100;
      mode = 'subscription';
      recurringInterval = 'year';
    } else {
      return Response.json({ error: 'Invalid license_type' }, { status: 400 });
    }

    // Créer Stripe Price (ou réutiliser existant)
    const stripePrices = await stripe.prices.list({
      product: product.sku,
      limit: 1
    });

    let stripePrice;
    if (stripePrices.data.length > 0) {
      stripePrice = stripePrices.data[0];
    } else {
      // Créer le produit Stripe
      const stripeProduct = await stripe.products.create({
        id: product.sku,
        name: product.name,
        description: product.description,
        metadata: {
          product_type: product.product_type,
          category: product.category
        }
      });

      // Créer le prix
      stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: price,
        currency: 'cad',
        recurring: mode === 'subscription' ? {
          interval: recurringInterval
        } : undefined
      });
    }

    // Créer la session de checkout
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      mode,
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1
        }
      ],
      success_url: success_url || `${req.headers.get('origin')}/Shop?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.headers.get('origin')}/Shop`,
      metadata: {
        user_email: user.email,
        product_sku,
        license_type,
        app_id: Deno.env.get('BASE44_APP_ID')
      },
      subscription_data: mode === 'subscription' ? {
        metadata: {
          user_email: user.email,
          product_sku
        }
      } : undefined
    });

    return Response.json({
      session_id: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});