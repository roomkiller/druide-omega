/**
 * llmCache.js — Caches partagés pour optimiser la consommation de crédits.
 *
 * 1) cachedInvokeLLM  — pour les appels InvokeLLM *informationnels* (analyses,
 *    extractions, Q&A) dont le résultat est déterministe pour un prompt donné.
 *    Ne PAS utiliser pour les appels *génératifs* (pensées, contenu créatif).
 *
 * 2) cachedDruideCore — pour les réponses du Chat. Un message identique avec
 *    un historique de conversation identique renvoie la réponse précédemment
 *    obtenue, évitant un appel backend (et le LLM qu'il contient).
 *
 * Persistance : localStorage (TTL 24h, plafond 200 entrées).
 */

const LLM_PREFIX = 'llm_cache:';
const DRUIDE_PREFIX = 'druide_cache:';
const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24h
const MAX_ENTRIES = 200;

// Kill switch — importé dynamiquement pour éviter dépendance circulaire
async function isBlocked() {
  const { isLLMBlocked } = await import('@/lib/llmKillSwitch');
  return isLLMBlocked();
}

function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h * 33) ^ str.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

function prune() {
  try {
    const keys = Object.keys(localStorage)
      .filter((k) => k.startsWith(LLM_PREFIX) || k.startsWith(DRUIDE_PREFIX))
      .map((k) => ({ k, ts: JSON.parse(localStorage.getItem(k) || '{}').ts || 0 }))
      .sort((a, b) => b.ts - a.ts);
    if (keys.length > MAX_ENTRIES) {
      keys.slice(MAX_ENTRIES).forEach((e) => localStorage.removeItem(e.k));
    }
  } catch {
    /* ignore */
  }
}

function storeGet(k, ttlMs) {
  try {
    const raw = localStorage.getItem(k);
    if (raw) {
      const { ts, result } = JSON.parse(raw);
      if (Date.now() - ts < ttlMs) return result;
    }
  } catch {
    /* corrupted — ignore */
  }
  return undefined;
}

function storeSet(k, result) {
  try {
    localStorage.setItem(k, JSON.stringify({ ts: Date.now(), result }));
    prune();
  } catch {
    /* quota exceeded — ignore */
  }
}

/* ------------------------------------------------------------------ */
/* 1. InvokeLLM informationnel                                          */
/* ------------------------------------------------------------------ */

function llmKey(callArgs) {
  const model = callArgs.model || 'automatic';
  const schema = callArgs.response_json_schema ? JSON.stringify(callArgs.response_json_schema) : '';
  const internet = callArgs.add_context_from_internet ? '1' : '0';
  return LLM_PREFIX + hash(callArgs.prompt + '|' + model + '|' + internet + '|' + schema);
}

export async function cachedInvokeLLM(callArgs, { ttlMs = DEFAULT_TTL } = {}) {
  const k = llmKey(callArgs);
  const cached = storeGet(k, ttlMs);
  if (cached !== undefined) return cached;

  if (await isBlocked()) {
    console.warn('[llmCache] InvokeLLM bloqué par le kill switch');
    const { llmBlockedStub } = await import('@/lib/llmKillSwitch');
    return llmBlockedStub({ withSchema: !!callArgs.response_json_schema });
  }

  const { base44 } = await import('@/api/base44Client');
  const result = await base44.integrations.Core.InvokeLLM(callArgs);
  storeSet(k, result);
  return result;
}

/* ------------------------------------------------------------------ */
/* 2. Réponses druideCore (Chat)                                       */
/* ------------------------------------------------------------------ */

function druideKey(args) {
  return DRUIDE_PREFIX + hash(JSON.stringify({
    m: args.userMessage,
    h: args.conversationHistory,
    i: args.intelligenceContext
  }));
}

export async function cachedDruideCore(args, { ttlMs = DEFAULT_TTL } = {}) {
  const k = druideKey(args);
  const cached = storeGet(k, ttlMs);
  if (cached !== undefined) return cached;

  if (await isBlocked()) {
    console.warn('[llmCache] druideCore bloqué par le kill switch');
    return {
      response: "⚠️ Appels LLM suspendus par l'architecte (kill switch actif). Réactivez-les depuis le Dashboard Architecte.",
      metadata: { llm_blocked: true }
    };
  }

  const { base44 } = await import('@/api/base44Client');
  const { data } = await base44.functions.invoke('druideCore', args);
  storeSet(k, data);
  return data;
}