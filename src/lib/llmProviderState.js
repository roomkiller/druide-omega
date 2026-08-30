/**
 * État temps réel du LLM actif + catalogue des LLM installés / compatibles.
 * © 2025 AMG+A.L
 */

const STORAGE_KEY = 'druide_active_llm';

let state = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { provider: null, model: null, at: null };
})();

const listeners = new Set();

export function getActiveLLM() {
  return state;
}

export function setActiveLLM(provider, model = null) {
  state = { provider, model, at: new Date().toISOString() };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  listeners.forEach((fn) => fn(state));
}

export function subscribeActiveLLM(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export const PROVIDER_LABELS = {
  openrouter: 'OpenRouter',
  platform_credits: 'Crédits plateforme',
  deepseek: 'DeepSeek',
  disabled: 'LLM coupé',
  memory: 'Mémoire locale'
};

/** LLM installés (clé/API configurée dans l'application). */
export const INSTALLED_LLMS = [
  { id: 'openrouter', name: 'OpenRouter — openai/gpt-4o-mini', note: 'Passerelle principale (clé propre)' },
  { id: 'deepseek', name: 'DeepSeek', note: 'Secours dédié' },
  { id: 'platform_credits', name: 'Crédits plateforme (InvokeLLM)', note: 'Repli natif Base44' }
];

/** LLM compatibles avec la passerelle mais non installés. */
export const COMPATIBLE_LLMS = [
  { id: 'claude', name: 'Anthropic Claude 3.5 / 4', note: 'Via OpenRouter — clé à activer' },
  { id: 'gemini', name: 'Google Gemini 2.x', note: 'Via OpenRouter — clé à activer' },
  { id: 'gpt4o', name: 'OpenAI GPT-4o / o-series', note: 'Via OpenRouter — clé à activer' },
  { id: 'mistral', name: 'Mistral Large', note: 'Compatible OpenAI — non configuré' },
  { id: 'llama', name: 'Meta Llama 3.x', note: 'Compatible OpenAI — non configuré' },
  { id: 'qwen', name: 'Qwen 2.5', note: 'Compatible OpenAI — non configuré' }
];