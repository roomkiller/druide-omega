/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ LLM AVEC FALLBACK EN CASCADE + BUDGET DE LATENCE                      ║
 * ║ OpenRouter (clé propre) → InvokeLLM (crédits) → DeepSeek (secours).   ║
 * ║ Respecte le contrat InvokeLLM : dict si response_json_schema, sinon    ║
 * ║ string.                                                               ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

// HARD SWITCH LLM — coupe TOUS les appels de raisonnement.
// false = LLM éteint : les fonctions retombent sur leurs heuristiques locales
//         (débloque l'interaction, empêche les 500 quand les crédits manquent).
// true  = LLM rallumé : comportement complet avec raisonnement LLM.
export const LLM_ENABLED = true;

/**
 * Budget de latence — tout module qui dépasse son budget est abandonné et
 * retombe sur son fallback. C'est ce qui rend la fluidité HOMOGÈNE : la
 * variance d'un module lent ne se propage plus à tout le cœur.
 */
export function withBudget(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`budget dépassé (${ms}ms) — ${label}`)), ms)
    )
  ]);
}

async function callProvider(url, apiKey, model, params, extraHeaders = {}) {
  const messages = [];
  if (params.response_json_schema) {
    messages.push({
      role: 'system',
      content: `Tu dois répondre UNIQUEMENT avec un JSON valide suivant ce schéma:\n${JSON.stringify(params.response_json_schema, null, 2)}\n\nPas de texte avant ou après le JSON.`
    });
  }
  messages.push({ role: 'user', content: params.prompt });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...extraHeaders
    },
    body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 4000, stream: false })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${model} API error: ${res.status} ${errText.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error(`${model}: réponse vide`);
  if (params.response_json_schema) {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error(`${model}: JSON invalide`);
  }
  return content;
}

export function callOpenRouter(params) {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY');
  if (!apiKey) throw new Error('OPENROUTER_API_KEY manquant');
  return callProvider('https://openrouter.ai/api/v1/chat/completions', apiKey, 'openai/gpt-4o-mini', params, {
    'HTTP-Referer': 'https://druideomega.base44.app',
    'X-Title': 'Druide Omega'
  });
}

export function callDeepSeek(params) {
  const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
  if (!apiKey) throw new Error('InvokeLLM bloqué et DEEPSEEK_API_KEY manquant');
  return callProvider('https://api.deepseek.com/v1/chat/completions', apiKey, 'deepseek-chat', params);
}

/**
 * Cascade complète. `trace` (optionnel) reçoit provider / calls / failures pour
 * que l'appelant puisse exposer le fournisseur réellement utilisé.
 */
export async function llmWithFallback(base44, params, trace = null) {
  const mark = (provider) => {
    if (!trace) return;
    trace.provider = provider;
    trace.calls = (trace.calls || 0) + 1;
  };
  const noteFailure = (label, e) => {
    const msg = String(e?.message || e);
    console.log(`[LLM] ${label} indisponible:`, msg.slice(0, 120));
    if (trace) (trace.failures = trace.failures || []).push(`${label}: ${msg.slice(0, 140)}`);
  };

  if (!LLM_ENABLED) {
    if (trace) trace.provider = 'disabled';
    throw new Error('LLM désactivé par hard switch (LLM_ENABLED=false)');
  }

  try {
    const r = await callOpenRouter(params);
    mark('openrouter');
    return r;
  } catch (e) { noteFailure('openrouter', e); }

  try {
    const r = await base44.integrations.Core.InvokeLLM(params);
    mark('platform_credits');
    return r;
  } catch (e) { noteFailure('platform_credits', e); }

  const r = await callDeepSeek(params);
  mark('deepseek');
  return r;
}