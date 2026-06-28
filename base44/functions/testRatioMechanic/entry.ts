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

    // Test ratio validation directly with consciousnessRatioValidator
    const testResponse = "Consciousness is fundamentally the subjective experience of awareness and perception. It is the quale of internal mental states and the capacity to self-reflect.";

    const validationResult = await base44.functions.invoke('consciousnessRatioValidator', {
      response: testResponse,
      targetRatioLogic: ratio_logic,
      targetRatioConsciousness: ratio_consciousness,
      maxRetries: 2
    });

    return Response.json({
      test: 'consciousness_ratio_validator',
      input: {
        message,
        test_response: testResponse,
        target_ratio_logic: ratio_logic,
        target_ratio_consciousness: ratio_consciousness
      },
      result: validationResult.data,
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