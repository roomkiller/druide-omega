/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Stripe Billing Management                                  ║
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

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // === PORTAL CLIENT STRIPE ===
    if (action === 'portal') {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1
      });

      let customerId;
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { user_id: user.id }
        });
        customerId = customer.id;
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${req.headers.get('origin')}/Shop`
      });

      return Response.json({ url: session.url });
    }

    // === LISTE FACTURES ===
    if (action === 'invoices') {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1
      });

      if (customers.data.length === 0) {
        return Response.json({ invoices: [] });
      }

      const invoices = await stripe.invoices.list({
        customer: customers.data[0].id,
        limit: 50
      });

      return Response.json({ 
        invoices: invoices.data.map(inv => ({
          id: inv.id,
          amount: inv.amount_paid / 100,
          currency: inv.currency,
          status: inv.status,
          date: new Date(inv.created * 1000).toISOString(),
          pdf_url: inv.invoice_pdf
        }))
      });
    }

    // === ANNULER ABONNEMENT ===
    if (action === 'cancel' && req.method === 'POST') {
      const { subscription_id } = await req.json();
      
      await stripe.subscriptions.update(subscription_id, {
        cancel_at_period_end: true
      });

      return Response.json({ success: true, message: 'Subscription will cancel at period end' });
    }

    // === RÉACTIVER ABONNEMENT ===
    if (action === 'reactivate' && req.method === 'POST') {
      const { subscription_id } = await req.json();
      
      await stripe.subscriptions.update(subscription_id, {
        cancel_at_period_end: false
      });

      return Response.json({ success: true, message: 'Subscription reactivated' });
    }

    // === REMBOURSEMENT ===
    if (action === 'refund' && req.method === 'POST') {
      const { payment_intent_id, amount, reason } = await req.json();
      
      const refund = await stripe.refunds.create({
        payment_intent: payment_intent_id,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason || 'requested_by_customer'
      });

      return Response.json({ 
        success: true, 
        refund_id: refund.id,
        amount: refund.amount / 100
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Stripe billing error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});