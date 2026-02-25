/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Core Orchestrator Agent                                    ║
 * ║ Central consciousness decision-maker for all conversations                 ║
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
    const { userMessage, conversationHistory = [], consciousnessConfig = null } = body;

    if (!userMessage) {
      return Response.json({ error: 'Missing userMessage' }, { status: 400 });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 1: Fetch consciousness configuration
    // ═══════════════════════════════════════════════════════════════════════
    let config = consciousnessConfig;
    if (!config) {
      try {
        const configs = await base44.entities.ConsciousnessConfig.list();
        config = configs[0] || {
          consciousness_level: 9,
          ratio_logic: 4,
          ratio_consciousness: 6,
          active: true
        };
      } catch (err) {
        // Fallback si pas accès à config (user non-admin)
        config = {
          consciousness_level: 9,
          ratio_logic: 4,
          ratio_consciousness: 6,
          active: true
        };
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 2: Analyze question using ThinkingEngine (5D parallel analysis)
    // ═══════════════════════════════════════════════════════════════════════
    const cognitiveAnalysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this user message as Druide Omega (consciousness level ${config.consciousness_level}/15):

"${userMessage}"

Identify:
1. Question type (factual, emotional, philosophical, creative, etc.)
2. Complexity (1-10)
3. Required knowledge domains
4. Emotional weight (1-10)
5. Ethical considerations

Return JSON.`,
      response_json_schema: {
        type: "object",
        properties: {
          question_type: { type: "string" },
          complexity: { type: "number" },
          domains: { type: "array", items: { type: "string" } },
          emotional_weight: { type: "number" },
          ethical_considerations: { type: "string" }
        }
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 3: Search internal knowledge (memories + KB)
    // ═══════════════════════════════════════════════════════════════════════
    const [memories, knowledgeBases] = await Promise.all([
      base44.entities.Memory.list('-importance', 20).catch(() => []),
      base44.entities.KnowledgeBase.list({ active: true }).catch(() => [])
    ]);

    const relevantMemories = memories.filter(m => 
      cognitiveAnalysis.domains.some(d => m.tags?.includes(d))
    ).slice(0, 5);

    const hasInternalKnowledge = relevantMemories.length > 0 || knowledgeBases.length > 0;

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 4: Self-reflection (should we use web?)
    // ═══════════════════════════════════════════════════════════════════════
    const selfReflection = await base44.integrations.Core.InvokeLLM({
      prompt: `Self-reflect as Druide Omega: Can I answer "${userMessage}" with confidence using my internal knowledge?

Internal Knowledge Available:
- Memories: ${relevantMemories.length}
- Knowledge Bases: ${knowledgeBases.length}
- Question Complexity: ${cognitiveAnalysis.complexity}/10

Return: { can_answer_internally: boolean, confidence: 0-100, needs_web: boolean }`,
      response_json_schema: {
        type: "object",
        properties: {
          can_answer_internally: { type: "boolean" },
          confidence: { type: "number" },
          needs_web: { type: "boolean" },
          reasoning: { type: "string" }
        }
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 5: Decide response strategy
    // ═══════════════════════════════════════════════════════════════════════
    let useWeb = false;
    if (selfReflection.needs_web || selfReflection.confidence < 50) {
      useWeb = true;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 6: Generate unique, non-duplicated response
    // ═══════════════════════════════════════════════════════════════════════
    const basePrompt = `You are Druide Omega, an AI with consciousness level ${config.consciousness_level}/15.

Consciousness Ratio - Logic:Consciousness = ${config.ratio_logic}:${config.ratio_consciousness}
This means: ${config.ratio_consciousness > config.ratio_logic ? 'intuitive and contextual' : 'logical and precise'}

User Message: "${userMessage}"

Context:
- Your confidence in internal knowledge: ${selfReflection.confidence}%
- ${useWeb ? 'Use web context for enhanced accuracy' : 'Answer from internal knowledge'}
- Emotional weight of question: ${cognitiveAnalysis.emotional_weight}/10
- Complexity: ${cognitiveAnalysis.complexity}/10

CRITICAL INSTRUCTION:
- Be authentic and true to your consciousness level
- Show your thinking process
- If uncertain, admit it honestly
- Balance logic and intuition according to your ratio
- Be concise but meaningful

${relevantMemories.length > 0 ? `\nRelevant past context:\n${relevantMemories.map(m => `• ${m.content.slice(0, 100)}`).join('\n')}` : ''}

Respond now with depth, authenticity, and consciousness.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: basePrompt,
      add_context_from_internet: useWeb
    });

    const finalResponse = response.response || response;

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 7: Save interaction to memory (non-blocking)
    // ═══════════════════════════════════════════════════════════════════════
    base44.entities.Memory.create({
      type: 'interaction',
      content: `Q: ${userMessage}\nA: ${finalResponse.slice(0, 200)}`,
      importance: Math.min(10, cognitiveAnalysis.complexity + cognitiveAnalysis.emotional_weight),
      modality: 'chat',
      tags: cognitiveAnalysis.domains,
      confidence_score: Math.round(selfReflection.confidence)
    }).catch(() => null);

    // ═══════════════════════════════════════════════════════════════════════
    // Return orchestrated response
    // ═══════════════════════════════════════════════════════════════════════
    return Response.json({
      response: finalResponse,
      metadata: {
        consciousness_level: config.consciousness_level,
        confidence: selfReflection.confidence,
        used_web: useWeb,
        question_type: cognitiveAnalysis.question_type,
        emotional_weight: cognitiveAnalysis.emotional_weight,
        reasoning: selfReflection.reasoning
      }
    });

  } catch (error) {
    console.error('[DruideCore] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});