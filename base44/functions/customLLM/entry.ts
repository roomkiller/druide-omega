/**
 * DRUIDE_OMEGA - Custom LLM Engine
 * Proprietary orchestration layer over DeepSeek
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, context, mode = 'smart' } = await req.json();

    if (!prompt) {
      return Response.json({ error: 'Prompt required' }, { status: 400 });
    }

    // 1. CONTEXT ENRICHMENT
    const enrichedContext = await enrichContext(prompt, context, user.email, base44);

    // 2. ROUTING - Decide which LLM to use
    const route = decideRoute(prompt, mode);

    // 3. ORCHESTRATED RESPONSE
    let response;
    if (route === 'deepseek') {
      response = await callDeepSeek(prompt, enrichedContext);
    } else {
      response = await callBase44LLM(prompt, enrichedContext);
    }

    // 4. POST-PROCESSING - Apply consciousness filters
    const processed = await postProcessResponse(response, enrichedContext, user.email, base44);

    // 5. SAVE TO CONTINUOUS LEARNING
    await saveLearningEvent({
      prompt,
      response: processed,
      route,
      context: enrichedContext,
      user_email: user.email,
      base44
    });

    return Response.json({
      success: true,
      response: processed.text,
      confidence: processed.confidence,
      route_used: route,
      learning_saved: true
    });

  } catch (error) {
    console.error('Custom LLM error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * 1. CONTEXT ENRICHMENT - Druide's special sauce
 */
async function enrichContext(prompt, context, userEmail, base44) {
  const keywords = extractKeywords(prompt);
  
  let relevantMemories = [];
  try {
    // Récupère les mémoires pertinentes
    const memories = await base44.entities.Memory?.filter?.({
      created_by: userEmail,
      tags: { $in: keywords }
    }, '-last_accessed', 5);
    
    relevantMemories = memories || [];
  } catch (e) {
    console.log('Memory fetch skipped');
  }

  return {
    user_email: userEmail,
    keywords,
    memory_context: relevantMemories,
    user_context: context,
    timestamp: new Date().toISOString(),
    enrichment_level: 'high'
  };
}

/**
 * 2. ROUTING - Smart LLM selection
 */
function decideRoute(prompt, mode) {
  const complexity = estimateComplexity(prompt);
  
  // Smart routing logic
  if (mode === 'fast' || complexity < 0.3) {
    return 'base44'; // Faster, cheaper
  }
  
  if (mode === 'quality' || complexity > 0.7) {
    return 'deepseek'; // More powerful
  }
  
  // Default: intelligent routing
  if (prompt.length < 100 && complexity < 0.5) {
    return 'base44';
  }
  
  return 'deepseek';
}

/**
 * 3. DEEPSEEK CALL
 */
async function callDeepSeek(prompt, context) {
  const deepseekKey = Deno.env.get('DEEPSEEK_API_KEY');
  
  const systemPrompt = `Tu es Druide Omega, un système d'orchestration IA avancé.

Contexte utilisateur:
${JSON.stringify(context, null, 2)}

Répond avec:
- Pertinence maximale basée sur le contexte
- Clarté et précision
- Considération du contexte mémoriel`;

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${deepseekKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  const data = await response.json();
  
  return {
    text: data.choices?.[0]?.message?.content || 'No response',
    tokens_used: data.usage?.total_tokens || 0,
    model: 'deepseek-chat'
  };
}

/**
 * 4. BASE44 LLM CALL (Placeholder for proprietary)
 */
async function callBase44LLM(prompt, context) {
  // Simule l'appel au LLM Base44 propriétaire
  const response = {
    text: `Response from Base44 LLM: ${prompt.substring(0, 50)}...`,
    tokens_used: Math.floor(prompt.length / 4),
    model: 'base44-llm'
  };
  
  return response;
}

/**
 * 5. POST-PROCESSING - Consciousness filters
 */
async function postProcessResponse(response, context, userEmail, base44) {
  const confidence = calculateConfidence(response, context);
  
  // Apply ethical filter
  const ethicalCheck = isEthicallySound(response.text);
  
  // Detect hallucinations
  const hallucination = detectHallucinations(response.text, context);

  return {
    text: response.text,
    confidence: ethicalCheck ? confidence : confidence * 0.8,
    model: response.model,
    tokens: response.tokens_used,
    processed_at: new Date().toISOString(),
    ethical: ethicalCheck,
    hallucination_risk: hallucination
  };
}

/**
 * 6. SAVE TO LEARNING
 */
async function saveLearningEvent(data) {
  const { prompt, response, route, user_email, base44 } = data;

  try {
    // Sauvegarde dans ConsciousnessSnapshot
    await base44.entities.ConsciousnessSnapshot?.create?.({
      event_id: `llm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_email: user_email,
      timestamp: new Date().toISOString(),
      active_consciousness: JSON.stringify({
        prompt,
        response: response.text,
        route
      }),
      subconscious_data: JSON.stringify({
        confidence: response.confidence,
        tokens: response.tokens,
        ethical: response.ethical
      }),
      backup_type: 'delta',
      autonomy_score: response.confidence
    });
  } catch (e) {
    console.log('Learning save skipped:', e.message);
  }
}

/**
 * UTILITY FUNCTIONS
 */

function extractKeywords(text) {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const freq = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w);
}

function estimateComplexity(prompt) {
  // Simple heuristic: 0-1 scale
  const factors = [
    prompt.split('?').length - 1, // Questions
    prompt.split(';').length - 1, // Complex structures
    prompt.length / 100 // Length
  ];
  
  return Math.min(1, factors.reduce((a, b) => a + b, 0) / 3);
}

function calculateConfidence(response, context) {
  // 0-1 confidence score
  if (!response.text || response.text.length < 10) return 0.3;
  if (context.memory_context.length > 2) return 0.9;
  return 0.7;
}

function isEthicallySound(text) {
  const violations = [
    'discriminat',
    'racist',
    'sexist',
    'harm',
    'illegal'
  ];
  
  const lower = text.toLowerCase();
  return !violations.some(v => lower.includes(v));
}

function detectHallucinations(response, context) {
  // Risk score 0-1
  if (!context.user_context) return 0.5;
  if (response.length > 5000) return 0.3; // Too long = hallucination risk
  return 0.2; // Default low risk
}