import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { product_sku, license_type } = await req.json();

    // Pour le moment, retourner une URL de test
    // TODO: Intégrer Stripe Checkout avec clé API
    return Response.json({ 
      url: `https://example.com/checkout?sku=${product_sku}&type=${license_type}`,
      message: 'Checkout temporaire - Configuration Stripe requise'
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});