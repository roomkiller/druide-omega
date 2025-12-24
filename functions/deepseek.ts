/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - DeepSeek Integration (Open Source LLM)                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Permet d'utiliser DeepSeek V3 au lieu de InvokeLLM                        ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Vérifier authentification
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Récupérer paramètres
    const { 
      prompt, 
      response_json_schema = null,
      temperature = 0.7,
      max_tokens = 4000,
      model = "deepseek-chat" 
    } = await req.json();

    if (!prompt) {
      return Response.json({ error: 'Prompt required' }, { status: 400 });
    }

    // Clé API DeepSeek
    const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!apiKey) {
      return Response.json({ 
        error: 'DEEPSEEK_API_KEY not configured. Please add it in dashboard settings.',
        fallback_to_invokeллm: true 
      }, { status: 400 });
    }

    // Appel API DeepSeek (compatible OpenAI)
    const deepseekUrl = 'https://api.deepseek.com/v1/chat/completions';
    
    const messages = [
      {
        role: "user",
        content: prompt
      }
    ];

    // Si JSON schema demandé, ajouter instruction
    if (response_json_schema) {
      messages.push({
        role: "system",
        content: `Tu dois répondre UNIQUEMENT avec un JSON valide suivant ce schéma:\n${JSON.stringify(response_json_schema, null, 2)}\n\nPas de texte avant ou après le JSON.`
      });
    }

    const deepseekResponse = await fetch(deepseekUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream: false
      })
    });

    if (!deepseekResponse.ok) {
      const errorText = await deepseekResponse.text();
      console.error('[DeepSeek] API Error:', errorText);
      return Response.json({ 
        error: `DeepSeek API error: ${deepseekResponse.status}`,
        details: errorText,
        fallback_to_invokellm: true
      }, { status: 500 });
    }

    const data = await deepseekResponse.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json({ error: 'No response from DeepSeek' }, { status: 500 });
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
        console.error('[DeepSeek] JSON Parse Error:', parseError);
        return Response.json({ error: 'Failed to parse JSON', raw: content }, { status: 500 });
      }
    }

    // Réponse texte
    return Response.json({ response: content, model: data.model, usage: data.usage });

  } catch (error) {
    console.error('[DeepSeek] Error:', error);
    return Response.json({ 
      error: error.message,
      fallback_to_invokellm: true 
    }, { status: 500 });
  }
});