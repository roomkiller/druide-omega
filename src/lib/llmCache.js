/**
 * llmCache.js — Cache partagé pour les appels InvokeLLM *informationnels*.
 *
 * Les appels au LLM dont le résultat est déterministe pour un prompt donné
 * (analyses, extractions, synthèses, Q&A) sont mis en cache dans localStorage
 * avec un TTL. Un prompt identique renvoie le résultat mis en cache → 0 crédit.
 *
 * Ne PAS utiliser pour les appels *génératifs* (pensées spontanées, contenu
 * créatif) dont l'unicité est attendue — le cache y trahirait la variabilité.
 *
 * Signature identique à base44.integrations.Core.InvokeLLM :
 *   cachedInvokeLLM({ prompt, model, response_json_schema, ... }, { ttlMs })
 */

const PREFIX = 'llm_cache:';
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24h
const MAX_ENTRIES = 200;

function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h * 33) ^ str.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

function cacheKey(callArgs) {
  const model = callArgs.model || 'automatic';
  const schema = callArgs.response_json_schema ? JSON.stringify(callArgs.response_json_schema) : '';
  const internet = callArgs.add_context_from_internet ? '1' : '0';
  return PREFIX + hash(callArgs.prompt + '|' + model + '|' + internet + '|' + schema);
}

function prune() {
  try {
    const keys = Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .map((k) => ({ k, ts: JSON.parse(localStorage.getItem(k) || '{}').ts || 0 }))
      .sort((a, b) => b.ts - a.ts);
    if (keys.length > MAX_ENTRIES) {
      keys.slice(MAX_ENTRIES).forEach((e) => localStorage.removeItem(e.k));
    }
  } catch {
    /* ignore quota errors */
  }
}

export async function cachedInvokeLLM(callArgs, { ttlMs = DEFAULT_TTL } = {}) {
  const k = cacheKey(callArgs);
  try {
    const raw = localStorage.getItem(k);
    if (raw) {
      const { ts, result } = JSON.parse(raw);
      if (Date.now() - ts < ttlMs) return result;
    }
  } catch {
    /* corrupted entry — ignore */
  }

  const { base44 } = await import('@/api/base44Client');
  const result = await base44.integrations.Core.InvokeLLM(callArgs);

  try {
    localStorage.setItem(k, JSON.stringify({ ts: Date.now(), result }));
    prune();
  } catch {
    /* quota exceeded — ignore */
  }
  return result;
}