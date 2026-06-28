/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Stripe Checkout Session Creator                            ║
 * ║ Crée une session de paiement Stripe pour l'achat de modules               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@13.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Authentifier l'utilisateur
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parser les données
    const { product_sku, license_type } = await req.json();

    if (!product_sku || !license_type) {
      return Response.json({ 
        error: 'Missing required fields: product_sku, license_type' 
      }, { status: 400 });
    }

    // Récupérer le produit
    const products = await base44.entities.Product.filter({ sku: product_sku });
    if (products.length === 0) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = products[0];
    const productData = product.data || product;

    // Calculer le prix selon le type de licence
    let price, interval;
    if (license_type === 'monthly') {
      price = productData.price_cad_monthly;
      interval = 'month';
    } else if (license_type === 'annual') {
      price = productData.price_cad_annual;
      interval = 'year';
    } else {
      return Response.json({ error: 'Invalid license_type' }, { status: 400 });
    }

    if (!price) {
      return Response.json({ error: 'Price not available for this license type' }, { status: 400 });
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: productData.name,
              description: productData.description,
              metadata: {
                sku: product_sku,
                product_type: productData.product_type
              }
            },
            recurring: {
              interval: interval
            },
            unit_amount: Math.round(price * 100), // Convertir en cents
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        user_email: user.email,
        product_sku: product_sku,
        license_type: license_type,
        product_type: productData.product_type
      },
      success_url: `${req.headers.get('origin') || 'https://druide-omega.base44.app'}/Shop?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin') || 'https://druide-omega.base44.app'}/Shop?cancelled=true`,
    });

    return Response.json({ 
      url: session.url,
      sessionId: session.id 
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ 
      error: error.message,
      details: 'Stripe checkout failed' 
    }, { status: 500 });
  }
});