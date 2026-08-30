/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Passerelle LLM unique (OpenRouter d'abord)                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * Tous les appels LLM de l'application — quel que soit le composant, l'élément
 * ou l'action — passent par ici. La passerelle respecte exactement le contrat
 * de InvokeLLM (chaîne sans schéma, objet avec schéma) afin qu'aucun appelant
 * existant n'ait à être modifié.
 *
 * Ordre : OpenRouter (clé propre, hors crédits d'intégration) → InvokeLLM natif
 * (seulement si OpenRouter est indisponible ou si la requête utilise une
 * capacité qu'OpenRouter ne couvre pas, comme les fichiers joints).
 */

export function installLLMGateway(client) {
  const nativeInvokeLLM = client.integrations.Core.InvokeLLM.bind(client.integrations.Core);

  const gateway = async (params = {}) => {
    const {
      prompt,
      response_json_schema = null,
      add_context_from_internet = false,
      file_urls = null,
      temperature = 0.7,
      max_tokens = 4000
    } = params;

    // Les pièces jointes (vision, PDF) ne sont pas couvertes par la passerelle :
    // on laisse ces requêtes à l'intégration native.
    if (file_urls) return await nativeInvokeLLM(params);

    try {
      const result = await client.functions.invoke('openrouterLLM', {
        prompt,
        response_json_schema,
        add_context_from_internet,
        temperature,
        max_tokens
      });

      const payload = result?.data ?? result;
      if (payload?.error) throw new Error(payload.error);

      if (response_json_schema) return payload;
      const text = payload?.response ?? payload;
      if (typeof text !== 'string' || !text.trim()) throw new Error('Réponse OpenRouter vide');
      return text;
    } catch (error) {
      console.warn('[LLMGateway] OpenRouter indisponible, repli natif:', String(error?.message || error).slice(0, 140));
      return await nativeInvokeLLM(params);
    }
  };

  client.integrations.Core.InvokeLLM = gateway;
  return client;
}