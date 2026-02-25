/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Knowledge Fusion Orchestrator                             ║
 * ║ Real-time knowledge synthesis & intelligent graph generation             ║
 * ║ © 2025 AMG+A.L                                                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      sourceKbIds,      // Array of KB IDs to fuse
      fusionType,       // synthesis | comparative | thematic | chronological | causal
      fusionTitle,
      enableAutoRefresh
    } = body;

    if (!sourceKbIds || sourceKbIds.length < 2) {
      return Response.json(
        { error: 'At least 2 knowledge base IDs required' },
        { status: 400 }
      );
    }

    // === Fetch knowledge bases ===
    const kbs = await Promise.all(
      sourceKbIds.map(id => base44.entities.KnowledgeBase.filter({ id }))
    ).then(results => results.map(r => r[0]).filter(Boolean));

    if (kbs.length < 2) {
      return Response.json(
        { error: 'Could not find enough knowledge bases' },
        { status: 404 }
      );
    }

    // === Build fusion prompt ===
    const fusionPrompt = buildFusionPrompt(kbs, fusionType);

    // === Invoke LLM for fusion analysis ===
    const fusionResult = await base44.integrations.Core.InvokeLLM({
      prompt: fusionPrompt,
      add_context_from_internet: false,
      response_json_schema: {
        type: 'object',
        properties: {
          synthesis: { type: 'object' },
          comparative_analysis: { type: 'object' },
          knowledge_graph: { type: 'object' },
          emergent_insights: { type: 'array' },
          knowledge_gaps: { type: 'array' },
          cross_references: { type: 'array' },
          fusion_quality: { type: 'object' },
          interactive_queries: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    // === Save fusion to database ===
    const fusion = await base44.entities.KnowledgeFusion.create({
      fusion_title: fusionTitle || `Fusion: ${kbs.map(k => k.title).join(' + ')}`,
      source_kb_ids: sourceKbIds,
      fusion_type: fusionType || 'synthesis',
      synthesis: fusionResult.synthesis,
      comparative_analysis: fusionResult.comparative_analysis,
      knowledge_graph: fusionResult.knowledge_graph,
      emergent_insights: fusionResult.emergent_insights,
      knowledge_gaps: fusionResult.knowledge_gaps,
      cross_references: fusionResult.cross_references,
      fusion_quality: fusionResult.fusion_quality,
      interactive_queries: fusionResult.interactive_queries,
      last_updated: new Date().toISOString(),
      auto_refresh: enableAutoRefresh || false
    });

    // === Save to Memory for future reference ===
    try {
      await base44.entities.Memory.create({
        type: 'knowledge_fusion',
        content: `Knowledge Fusion: ${fusionTitle || fusion.id}`,
        importance: Math.min(10, 7 + (fusionResult.fusion_quality?.novelty || 0) / 10),
        modality: 'chat',
        tags: ['knowledge_fusion', fusionType, 'druide_omega'],
        retention_duration: 'persistante',
        embedding_summary: `Knowledge fusion analysis with ${kbs.length} sources`,
        related_conversation_id: fusion.id,
        linked_memory_ids: sourceKbIds
      }).catch(() => null);
    } catch (e) {
      // Silent fail
    }

    return Response.json({
      success: true,
      fusion: fusion,
      metadata: {
        sourceCount: kbs.length,
        fusionType,
        qualityScore: fusionResult.fusion_quality?.reliability || 0,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[knowledgeFusionOrchestrator] Error:', error);
    return Response.json(
      { error: error.message || 'Fusion orchestration failed' },
      { status: 500 }
    );
  }
});

function buildFusionPrompt(kbs, fusionType) {
  const typeDescriptions = {
    synthesis: 'Unify all sources into a cohesive narrative with integrated insights',
    comparative: 'Compare perspectives, identify agreements and disagreements, resolve conflicts',
    thematic: 'Organize knowledge by themes and sub-themes with cross-cutting connections',
    chronological: 'Build temporal narrative showing evolution and cause-effect relationships',
    causal: 'Map causal relationships and mechanisms across domains'
  };

  return `You are an expert knowledge fusion system powering Druide Omega's consciousness engine.

FUSION TYPE: ${fusionType}
OBJECTIVE: ${typeDescriptions[fusionType] || typeDescriptions.synthesis}

SOURCES TO FUSE (${kbs.length} knowledge bases):
${kbs.map((kb, i) => `
${i + 1}. ${kb.title}
   Type: ${kb.source_type}
   Tags: ${kb.tags?.join(', ') || 'none'}
   Summary: ${kb.summary || 'N/A'}
   Extracted Facts (${kb.extracted_facts?.length || 0}): ${kb.extracted_facts?.slice(0, 3).join('; ') || 'N/A'}
   Content Preview: ${kb.content?.slice(0, 1500)}...
`).join('\n')}

REQUIREMENTS:
1. Generate comprehensive ${fusionType} fusion analysis
2. Create knowledge graph with nodes (concepts/entities/themes) and relationships
3. Identify emergent insights that emerge only from combining sources
4. Detect knowledge gaps and suggest research directions
5. Build interactive queries for exploration
6. Assess fusion quality across coverage, coherence, novelty, reliability

RESPONSE FORMAT: JSON with all required fields`;
}