/**
 * Recherche web via OpenRouter (plugin "web") + composition de fiches sourcées.
 * Indépendant des crédits d'intégration de la plateforme : utilise la clé
 * OPENROUTER_API_KEY. Retourne toujours les citations pour traçabilité.
 */

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Appel OpenRouter avec recherche web activée.
 * @returns {{ content: string, citations: Array<{title,url}>, model: string, usage: object }}
 */
export async function webSearchLLM({
  prompt,
  system_prompt = null,
  model = 'openai/gpt-4o-mini',
  max_tokens = 2000,
  temperature = 0.3,
  max_results = 5
}) {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY');
  if (!apiKey) throw new Error('OPENROUTER_API_KEY absente');

  const messages = [];
  if (system_prompt) messages.push({ role: 'system', content: system_prompt });
  messages.push({ role: 'user', content: prompt });

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://druideomega.base44.app',
      'X-Title': 'Druide Omega'
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
      stream: false,
      plugins: [{ id: 'web', max_results }]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const message = data.choices?.[0]?.message;
  const content = message?.content;
  if (!content) throw new Error('OpenRouter: réponse vide');

  const citations = (message.annotations || [])
    .filter((a) => a?.type === 'url_citation' && a?.url_citation?.url)
    .map((a) => ({ title: a.url_citation.title || a.url_citation.url, url: a.url_citation.url }));

  return { content, citations, model: data.model, usage: data.usage };
}

/** Extrait le premier objet JSON valide d'une réponse texte. */
function parseJsonBlock(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Aucun JSON dans la réponse');
  return JSON.parse(match[0]);
}

/**
 * Recherche un sujet en ligne et compose une fiche prête pour la KnowledgeBase.
 * Les faits sont ancrés (le terme-clé en tête) pour la recherche lexicale locale.
 */
export async function researchFiche(topic, { model, max_results = 5 } = {}) {
  const system_prompt = `Tu documentes une base de connaissances francophone destinée à un système de raisonnement autonome.
Règles impératives:
- Utilise UNIQUEMENT des informations vérifiées par les sources web consultées.
- Privilégie le mécanisme, la méthode et les pièges de raisonnement plutôt que les chiffres seuls.
- Si une règle a une date d'entrée en vigueur, mentionne-la explicitement.
- Chaque fait commence par le terme-clé du sujet (fait autoportant, compréhensible hors contexte).
- Si les sources sont insuffisantes ou contradictoires, mets "insufficient_sources" à true.
Réponds UNIQUEMENT par un JSON valide, sans texte autour, au format:
{"title":"titre court et précis","summary":"1-2 phrases denses","content":"3 à 6 phrases substantielles","extracted_facts":["fait 1","fait 2","fait 3","fait 4"],"tags":["domaine","sous_domaine"],"insufficient_sources":false}`;

  const { content, citations, usage } = await webSearchLLM({
    prompt: `Documente ce sujet en t'appuyant sur des sources en ligne à jour: ${topic}`,
    system_prompt,
    model,
    max_results
  });

  const parsed = parseJsonBlock(content);

  return {
    fiche: parsed,
    citations,
    usage,
    valid:
      !parsed.insufficient_sources &&
      !!parsed.title &&
      !!parsed.content &&
      Array.isArray(parsed.extracted_facts) &&
      parsed.extracted_facts.length >= 2 &&
      citations.length > 0
  };
}

/** Transforme une fiche recherchée en enregistrement KnowledgeBase. */
export function toKnowledgeBaseRecord({ fiche, citations }, extraTags = []) {
  const now = new Date().toISOString();
  const sourcesList = citations
    .slice(0, 5)
    .map((c) => `- ${c.title}: ${c.url}`)
    .join('\n');

  return {
    title: fiche.title,
    source_type: 'url',
    source_url: citations[0]?.url || '',
    content: `${fiche.content}\n\nSources consultées:\n${sourcesList}`,
    summary: fiche.summary || '',
    extracted_facts: fiche.extracted_facts,
    tags: [...new Set([...(fiche.tags || []), ...extraTags, 'recherche_web'])],
    status: 'ready',
    active: true,
    relevance_score: 90,
    access_count: 0,
    last_reviewed: now
  };
}