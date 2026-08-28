/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - LLM Router (Route vers DeepSeek ou Base44)                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from '@/api/base44Client';
import { LLMRelayTransition } from './LLMRelayTransition';
import { isLLMBlocked, llmBlockedStub } from '@/lib/llmKillSwitch';

/**
 * Route automatiquement vers DeepSeek ou InvokeLLM avec relais intelligent
 */
export async function invokeLLM({ prompt, response_json_schema = null, add_context_from_internet = false, file_urls = null }) {
  // Kill switch — stoppe immédiatement la consommation de crédits
  if (isLLMBlocked()) {
    console.warn('[LLMRouter] Appel bloqué par le kill switch architecte');
    return llmBlockedStub({ withSchema: !!response_json_schema });
  }
  try {
    // Invoquer via relais de transition (gère timeouts + basculement automatique)
    return await LLMRelayTransition.invokeWithRelay(
      async (providerName) => {
        if (providerName === 'openrouter') {
          const result = await base44.functions.invoke('openrouterLLM', {
            prompt,
            response_json_schema,
            temperature: 0.7,
            max_tokens: 4000
          });

          if (response_json_schema) {
            return result;
          }
          return result.response || result;
        } else if (providerName === 'deepseek') {
          const result = await base44.functions.invoke('deepseek', {
            prompt,
            response_json_schema,
            add_context_from_internet,
            file_urls,
            temperature: 0.7,
            max_tokens: 4000
          });

          if (response_json_schema) {
            return result;
          }
          return result.response || result;
        } else {
          // Base44 provider
          return await base44.integrations.Core.InvokeLLM({
            prompt,
            response_json_schema,
            add_context_from_internet,
            file_urls
          });
        }
      },
      prompt,
      { schema: response_json_schema }
    );
  } catch (error) {
    console.error('[LLMRouter] Error:', error);
    throw error;
  }
}

/**
 * Wrapper pour compatibilité avec ancien code
 */
export default invokeLLM;