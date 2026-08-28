/**
 * llmKillSwitch.js — Coupe-circuit global des appels LLM.
 *
 * Quand le kill switch est ACTIF, tous les appels LLM (InvokeLLM, DeepSeek,
 * druideCore) sont court-circuités à la source pour stopper la consommation
 * de crédits d'intégration.
 *
 * Persistance : localStorage (clé `druide_llm_killswitch`).
 * Diffusion : évènement `llm-killswitch-change` pour réactivité UI.
 */

const STORAGE_KEY = 'druide_llm_killswitch';

export function isLLMBlocked() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function setLLMBlocked(blocked) {
  try {
    localStorage.setItem(STORAGE_KEY, blocked ? '1' : '0');
    window.dispatchEvent(new CustomEvent('llm-killswitch-change', { detail: { blocked } }));
  } catch {
    /* ignore */
  }
}

export function subscribeLLMKillSwitch(cb) {
  const handler = (e) => cb(e.detail.blocked);
  window.addEventListener('llm-killswitch-change', handler);
  return () => window.removeEventListener('llm-killswitch-change', handler);
}

/** Réponse de substitution renvoyée quand le kill switch est actif. */
export function llmBlockedStub({ withSchema = false } = {}) {
  if (withSchema) {
    return { llm_blocked: true };
  }
  return '⚠️ Appels LLM suspendus par l\'architecte (kill switch actif). Réactivez-les depuis le Dashboard Architecte.';
}