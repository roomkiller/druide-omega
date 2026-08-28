/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - OpenRouter LLM Integration                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Permet d'utiliser n'importe quel modèle via OpenRouter (compatible OpenAI) ║
 * ║ https://openrouter.ai/docs                                                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Auth optionnelle — l'app étant publique, les visiteurs anonymes doivent pouvoir converser
    try {
      await base44.auth.me();
    } catch (e) {
      // Accès anonyme autorisé
    }

    // Récupérer paramètres
    const {
      prompt,
      system_prompt = null,
      response_json_schema = null,
      temperature = 0.7,
      max_tokens = 4000,
      // Exemples: "anthropic/claude-3.5-sonnet", "openai/gpt-4o", "google/gemini-2.0-flash-exp:free"
      model = "openai/gpt-4o-mini"
    } = await req.json();

    if (!prompt) {
      return Response.json({ error: 'Prompt required' }, { status: 400 });
    }

    // Clé API OpenRouter
    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) {
      return Response.json({
        error: 'OPENROUTER_API_KEY not configured. Please add it in dashboard settings.',
        fallback_to_invokellm: true
      }, { status: 400 });
    }

    // Appel API OpenRouter (compatible OpenAI)
    const openrouterUrl = 'https://openrouter.ai/api/v1/chat/completions';

    const messages = [];

    // Prompt système (fourni OU généré pour JSON schema)
    let systemContent = system_prompt;
    if (response_json_schema && !systemContent) {
      systemContent = `Tu dois répondre UNIQUEMENT avec un JSON valide suivant ce schéma:\n${JSON.stringify(response_json_schema, null, 2)}\n\nPas de texte avant ou après le JSON.`;
    }
    if (systemContent) {
      messages.push({ role: "system", content: systemContent });
    }

    messages.push({ role: "user", content: prompt });

    const orResponse = await fetch(openrouterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        // OpenRouter recommande ces en-têtes pour le classement d'usage
        'HTTP-Referer': 'https://druideomega.base44.app',
        'X-Title': 'Druide Omega'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream: false
      })
    });

    if (!orResponse.ok) {
      const errorText = await orResponse.text();
      console.error('[OpenRouter] API Error:', errorText);
      return Response.json({
        error: `OpenRouter API error: ${orResponse.status}`,
        details: errorText,
        fallback_to_invokellm: true
      }, { status: 500 });
    }

    const data = await orResponse.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.log('[OpenRouter] No content in response, attempting fallback to InvokeLLM');
      return Response.json({
        error: 'No response from OpenRouter',
        fallback_to_invokellm: true
      }, { status: 500 });
    }

    // Si JSON attendu, parser
    if (response_json_schema) {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return Response.json(parsed);
        } else {
          return Response.json({ error: 'Invalid JSON response', raw: content }, { status: 500 });
        }
      } catch (parseError) {
        console.error('[OpenRouter] JSON Parse Error:', parseError);
        return Response.json({ error: 'Failed to parse JSON', raw: content }, { status: 500 });
      }
    }

    // Réponse texte
    return Response.json({
      response: content,
      model: data.model,
      usage: data.usage,
      provider: 'openrouter'
    });

  } catch (error) {
    console.error('[OpenRouter] Error:', error);
    return Response.json({
      error: error.message,
      fallback_to_invokellm: true
    }, { status: 500 });
  }
});