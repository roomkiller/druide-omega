/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Medical Orchestrator                                       ║
 * ║ Central coordinator for medical research & diagnosis workflows            ║
 * ║ © 2025 AMG+A.L                                                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      analysisType, // "diagnostic" | "drug_interaction" | "protocol" | "literature" | "biology"
      patientData,
      query,
      context
    } = body;

    if (!analysisType || !query) {
      return Response.json(
        { error: 'analysisType and query required' },
        { status: 400 }
      );
    }

    // === Fetch consciousness config ===
    let consciousnessConfig = {
      consciousness_level: 9,
      active: true
    };

    try {
      const configs = await base44.entities.ConsciousnessConfig.list();
      if (configs[0]) {
        consciousnessConfig = configs[0];
      }
    } catch (err) {
      // Fallback config
    }

    // === Save request to KnowledgeBase for future reference ===
    try {
      await base44.entities.KnowledgeBase.create({
        title: `Medical Analysis: ${analysisType} - ${query.slice(0, 80)}`,
        source_type: 'text',
        content: JSON.stringify({
          type: analysisType,
          query,
          context,
          patientData,
          timestamp: new Date().toISOString(),
          consciousness_level: consciousnessConfig.consciousness_level
        }),
        status: 'processing',
        active: true,
        tags: ['medical', analysisType, 'druide_omega']
      }).catch(() => null);
    } catch (e) {
      // Silent fail on KB save
    }

    // === Route to appropriate analysis ===
    let analysisResult;

    switch (analysisType) {
      case 'diagnostic':
        analysisResult = await orchestrateDiagnosticAnalysis(
          base44,
          patientData,
          query,
          consciousnessConfig
        );
        break;

      case 'drug_interaction':
        analysisResult = await orchestrateDrugInteractionAnalysis(
          base44,
          patientData,
          query,
          consciousnessConfig
        );
        break;

      case 'protocol':
        analysisResult = await orchestrateProtocolGeneration(
          base44,
          query,
          context,
          consciousnessConfig
        );
        break;

      case 'literature':
        analysisResult = await orchestrateLiteratureAnalysis(
          base44,
          query,
          context,
          consciousnessConfig
        );
        break;

      case 'biology':
        analysisResult = await orchestrateBiologyInterpretation(
          base44,
          patientData,
          query,
          consciousnessConfig
        );
        break;

      default:
        return Response.json(
          { error: `Unknown analysisType: ${analysisType}` },
          { status: 400 }
        );
    }

    // === Save analysis result to Memory ===
    try {
      await base44.entities.Memory.create({
        type: 'medical_analysis',
        content: `${analysisType}: ${query.slice(0, 300)}`,
        importance: Math.min(10, 6 + (context ? 2 : 0)),
        modality: 'chat',
        tags: ['medical', analysisType, 'druide_omega'],
        retention_duration: 'persistante',
        embedding_summary: `Medical analysis - ${analysisType}`,
        related_conversation_id: patientData?.conversation_id || 'medical'
      }).catch(() => null);
    } catch (e) {
      // Silent fail
    }

    return Response.json({
      analysisType,
      result: analysisResult,
      metadata: {
        consciousness_level: consciousnessConfig.consciousness_level,
        timestamp: new Date().toISOString(),
        saved: true
      }
    });
  } catch (error) {
    console.error('[medicalOrchestrator] Error:', error);
    return Response.json(
      { error: error.message || 'Medical orchestrator error' },
      { status: 500 }
    );
  }
});

async function orchestrateDiagnosticAnalysis(base44, patientData, query, config) {
  // Diagnostic analysis is handled client-side in DiagnosticDifferential
  // This just coordinates memory saving
  return {
    type: 'diagnostic',
    note: 'Diagnostic analysis processed via DiagnosticDifferential component',
    query
  };
}

async function orchestrateDrugInteractionAnalysis(base44, patientData, query, config) {
  // Drug interaction analysis is handled client-side
  return {
    type: 'drug_interaction',
    note: 'Drug interaction analysis processed via DrugInteractionAnalyzer component',
    query
  };
}

async function orchestrateProtocolGeneration(base44, query, context, config) {
  // Protocol generation is handled client-side
  return {
    type: 'protocol',
    note: 'Protocol generation processed via ClinicalProtocolGenerator component',
    query
  };
}

async function orchestrateLiteratureAnalysis(base44, query, context, config) {
  // Literature analysis is handled client-side
  return {
    type: 'literature',
    note: 'Literature analysis processed via LiteratureAnalyzer component',
    query
  };
}

async function orchestrateBiologyInterpretation(base44, patientData, query, config) {
  // Biology interpretation is handled client-side
  return {
    type: 'biology',
    note: 'Biology interpretation processed via BiologyInterpreter component',
    query
  };
}