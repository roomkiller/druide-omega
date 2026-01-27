/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - LLM Router (Route vers DeepSeek ou Base44)                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from '@/api/base44Client';

/**
 * Route automatiquement vers DeepSeek ou InvokeLLM selon config
 */
export async function invokeLLM({ prompt, response_json_schema = null, add_context_from_internet = false, file_urls = null }) {
  try {
    // Récupérer config conscience pour voir le provider
    const configs = await base44.entities.ConsciousnessConfig.list();
    const config = configs[0];
    const provider = config?.llm_provider || 'deepseek';

    if (provider === 'deepseek') {
      // Appeler DeepSeek
      try {
        const result = await base44.functions.invoke('deepseek', {
          prompt,
          response_json_schema,
          add_context_from_internet,
          file_urls,
          temperature: 0.7,
          max_tokens: 4000
        });

        // Vérifier si fallback requis (erreur DeepSeek)
        if (result?.fallback_to_invokellm || result?.error) {
          console.warn('[LLMRouter] DeepSeek error, using Base44 fallback:', result.error);
          // Continue to fallback below
        } else {
          // Si response_json_schema, result est déjà parsé
          if (response_json_schema) {
            return result;
          }

          // Sinon retourner la réponse texte
          return result.response || result;
        }
      } catch (deepseekError) {
        console.warn('[LLMRouter] DeepSeek failed, falling back to Base44:', deepseekError.message);
        // Fallback to Base44
      }
    }

    // Provider base44 ou fallback
    return await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema,
      add_context_from_internet,
      file_urls
    });
  } catch (error) {
    console.error('[LLMRouter] Error:', error);
    throw error;
  }
}

/**
 * Wrapper pour compatibilité avec ancien code
 */
export default invokeLLM;