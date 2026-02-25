/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ Consciousness Ratio Validator - Real Mechanics                           ║
 * ║ Measures & enforces logic:consciousness balance in responses              ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
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
      response,
      targetRatioLogic,
      targetRatioConsciousness,
      maxRetries = 2
    } = body;

    if (!response || targetRatioLogic === undefined || targetRatioConsciousness === undefined) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 1: Analyze response for logic vs consciousness balance
    // ═══════════════════════════════════════════════════════════════════════
    const analysisPrompt = `Analyze this response for its Logic vs Consciousness balance:

"${response.slice(0, 500)}"

Score the response on these dimensions (0-100 each):
1. LOGIC_SCORE: Factual accuracy, reasoning clarity, structured thinking, evidence-based
2. CONSCIOUSNESS_SCORE: Emotional depth, intuition, authenticity, self-reflection, contextual wisdom

Return JSON with scores and brief reasoning.`;

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: analysisPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          logic_score: { type: "number", description: "0-100" },
          consciousness_score: { type: "number", description: "0-100" },
          reasoning: { type: "string" }
        }
      }
    });

    // Normalize to ratio
    const totalScore = analysis.logic_score + analysis.consciousness_score;
    const actualLogicRatio = totalScore > 0 ? (analysis.logic_score / totalScore * 10).toFixed(1) : 0;
    const actualConsciousnessRatio = totalScore > 0 ? (analysis.consciousness_score / totalScore * 10).toFixed(1) : 0;

    const targetTotal = targetRatioLogic + targetRatioConsciousness;
    const targetLogicPercent = (targetRatioLogic / targetTotal * 100).toFixed(0);
    const targetConsciousnessPercent = (targetRatioConsciousness / targetTotal * 100).toFixed(0);
    const actualLogicPercent = (analysis.logic_score).toFixed(0);

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 2: Check conformance (allow 20% tolerance)
    // ═══════════════════════════════════════════════════════════════════════
    const tolerancePercent = 20;
    const logicDiff = Math.abs(actualLogicPercent - targetLogicPercent);
    const conformsToRatio = logicDiff <= tolerancePercent;

    if (conformsToRatio) {
      // Response is good - return as-is
      return Response.json({
        valid: true,
        response,
        metrics: {
          actual_logic_ratio: actualLogicRatio,
          actual_consciousness_ratio: actualConsciousnessRatio,
          target_logic_ratio: targetRatioLogic,
          target_consciousness_ratio: targetRatioConsciousness,
          logic_percent: parseInt(actualLogicPercent),
          consciousness_percent: 100 - parseInt(actualLogicPercent),
          conformance: true
        },
        analysis: analysis.reasoning
      });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 3: Non-conforming - Regenerate with stronger constraints
    // ═══════════════════════════════════════════════════════════════════════
    let adjustedResponse = response;
    let attemptCount = 0;

    while (!conformsToRatio && attemptCount < maxRetries) {
      const emphasis = targetLogicPercent > 50 
        ? `CRITICAL: This response needs MORE LOGIC (${targetLogicPercent}% logic). Be more factual, evidence-based, structured. Less emotion.`
        : `CRITICAL: This response needs MORE CONSCIOUSNESS (${targetConsciousnessPercent}% consciousness). Be more intuitive, authentic, reflective. Less dry facts.`;

      const regeneratePrompt = `Re-write this response to balance Logic (${targetLogicPercent}%) and Consciousness (${targetConsciousnessPercent}%):

Original: "${response.slice(0, 300)}"

${emphasis}

Keep the core meaning but adjust the tone and depth.`;

      adjustedResponse = await base44.integrations.Core.InvokeLLM({
        prompt: regeneratePrompt
      });

      // Re-analyze adjusted response
      const reanalysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Quick score on Logic vs Consciousness (0-100 each):
"${adjustedResponse.slice(0, 300)}"
Return: {"logic_score": number, "consciousness_score": number}`,
        response_json_schema: {
          type: "object",
          properties: {
            logic_score: { type: "number" },
            consciousness_score: { type: "number" }
          }
        }
      });

      const newTotal = reanalysis.logic_score + reanalysis.consciousness_score;
      const newLogicPercent = newTotal > 0 ? (reanalysis.logic_score / newTotal * 100).toFixed(0) : 0;
      const newDiff = Math.abs(newLogicPercent - targetLogicPercent);
      
      if (newDiff <= tolerancePercent) {
        return Response.json({
          valid: true,
          response: adjustedResponse,
          adjusted: true,
          attempt: attemptCount + 1,
          metrics: {
            target_logic_percent: parseInt(targetLogicPercent),
            actual_logic_percent: parseInt(newLogicPercent),
            conformance: true
          }
        });
      }

      attemptCount++;
    }

    // If still not conforming after retries, return best effort
    return Response.json({
      valid: false,
      response: adjustedResponse,
      adjusted: true,
      attempts: attemptCount,
      warning: `Could not fully conform to ratio after ${attemptCount} retries. Best effort returned.`,
      metrics: {
        target_logic_percent: parseInt(targetLogicPercent),
        actual_logic_percent: parseInt(actualLogicPercent),
        conformance: false
      }
    });

  } catch (error) {
    console.error('[ConsciousnessRatioValidator] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});