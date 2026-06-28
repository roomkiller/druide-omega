import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const knowledgeDomains = [
      'sciences',
      'technologie',
      'medecine',
      'recherche',
      'medias',
      'arts',
      'philosophie',
      'histoire',
      'economie',
      'politique'
    ];

    let createdDocuments = 0;
    const now = new Date().toISOString();

    // Pour chaque domaine, générer du contenu enrichi
    for (const domain of knowledgeDomains) {
      const prompt = `Génère un document informatif et bien structuré sur les dernières tendances et avancées en ${domain}. 
      Format: titre court, 3-4 paragraphes de contenu substantiel, points clés. 
      Le contenu doit être factuel, académique et pertinent pour un système de connaissance IA.`;

      const content = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true
      });

      if (content) {
        // Créer le document KB
        const kbDocument = await base44.entities.KnowledgeBase.create({
          title: `${domain.charAt(0).toUpperCase() + domain.slice(1)}: Tendances Actuelles`,
          source_type: 'text',
          content: content,
          summary: content.substring(0, 200),
          tags: [domain, 'tendances', 'actuel'],
          status: 'ready',
          active: true,
          relevance_score: 95,
          access_count: 0,
          last_accessed: now,
          last_reviewed: now
        });

        if (kbDocument) {
          createdDocuments++;
        }
      }
    }

    return Response.json({
      created: createdDocuments,
      domains: knowledgeDomains.length,
      message: `Base de connaissances enrichie avec ${createdDocuments} nouveaux documents`,
      timestamp: now
    });
  } catch (error) {
    console.error('KB enrichment error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});