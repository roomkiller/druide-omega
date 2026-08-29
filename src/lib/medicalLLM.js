/**
 * Appel LLM pour les modules médicaux — passe par la fonction backend
 * openrouterLLM (clé OpenRouter de l'app), donc indépendant des crédits
 * d'intégration de la plateforme.
 *
 * Contrat identique à InvokeLLM : retourne un objet si response_json_schema
 * est fourni, une chaîne sinon.
 */

import { base44 } from '@/api/base44Client';

export async function askLLM({ prompt, response_json_schema = null, temperature, max_tokens }) {
  const { data } = await base44.functions.invoke('openrouterLLM', {
    prompt,
    response_json_schema,
    ...(temperature !== undefined ? { temperature } : {}),
    ...(max_tokens !== undefined ? { max_tokens } : {})
  });

  if (!data || data.error) {
    throw new Error(data?.error || 'Réponse vide du moteur LLM');
  }

  return response_json_schema ? data : (data.response ?? '');
}