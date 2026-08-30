/**
 * Cascade LLM partagée — OpenRouter (clé propre) → InvokeLLM (crédits
 * plateforme) → DeepSeek (secours). Respecte le contrat InvokeLLM :
 * retourne un objet si response_json_schema est fourni, une chaîne sinon.
 */

async function callOpenAICompatible(url, apiKey, model, params, extraHeaders = {}, options = {}) {
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
    body: JSON.stringify({
      model,
      messages,
      temperature: params.temperature ?? 0.7,
      max_tokens: params.max_tokens ?? 4000,
      stream: false,
      // Recherche web OpenRouter — activée seulement si demandée
      ...(options.webSearch ? { plugins: [{ id: 'web' }] } : {})
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`LLM API error: ${res.status} ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('LLM: réponse vide');

  if (params.response_json_schema) {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error('LLM: JSON invalide');
  }
  return content;
}

export async function callLLM(base44, params) {
  // 1. OpenRouter — clé propre, hors crédits d'intégration de la plateforme
  const orKey = Deno.env.get('OPENROUTER_API_KEY');
  if (orKey) {
    try {
      return await callOpenAICompatible(
        'https://openrouter.ai/api/v1/chat/completions',
        orKey,
        'openai/gpt-4o-mini',
        params,
        { 'HTTP-Referer': 'https://druideomega.base44.app', 'X-Title': 'Druide Omega' },
        { webSearch: !!params.add_context_from_internet }
      );
    } catch (e) {
      console.log('[LLMCascade] OpenRouter indisponible:', String(e?.message || e).slice(0, 120));
    }
  }

  // 2. InvokeLLM — crédits plateforme
  try {
    return await base44.integrations.Core.InvokeLLM(params);
  } catch (e) {
    console.log('[LLMCascade] InvokeLLM indisponible:', String(e?.message || e).slice(0, 120));
  }

  // 3. DeepSeek — dernier recours
  const dsKey = Deno.env.get('DEEPSEEK_API_KEY');
  if (!dsKey) throw new Error('Aucun fournisseur LLM disponible');
  return await callOpenAICompatible(
    'https://api.deepseek.com/v1/chat/completions',
    dsKey,
    'deepseek-chat',
    params
  );
}