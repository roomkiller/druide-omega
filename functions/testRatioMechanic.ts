/**
 * Test function for consciousness ratio validator mechanic
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      message = "What is consciousness?",
      ratio_logic = 1,
      ratio_consciousness = 9
    } = body;

    // Call druideCore with extreme ratio to test validation
    const result = await base44.functions.invoke('druideCore', {
      userMessage: message,
      conversationHistory: [],
      ratioLogic: ratio_logic,
      ratioConsciousness: ratio_consciousness
    });

    return Response.json({
      test: 'consciousness_ratio_validator',
      input: {
        message,
        target_ratio_logic: ratio_logic,
        target_ratio_consciousness: ratio_consciousness
      },
      response: result.data.response,
      metadata: result.data.metadata,
      metrics: result.data.metadata.ratio_metrics,
      ratio_valid: result.data.metadata.ratio_valid,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[TestRatioMechanic] Error:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});