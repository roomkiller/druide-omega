import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════════════
// DRUIDE_OMEGA - Registre Vivant : moteur de mise à jour centralisé
// Modules : inventory | tests | news | descriptions
// ═══════════════════════════════════════════════════════════════════════

const FUNCTIONS = [
  "anticipatoryConversationEngine","apiKeyValidation","auditApplication","autoBackup","circadianRhythm",
  "cognitiveCore","cognitivebiasDetector","consciousnessRatioValidator","contextManager","continuousLearning",
  "continuousLearningOptimization","coreSessionConsolidator","cronJobs","customLLM","decayTensions","deepseek",
  "delayedActionsEngine","druideCore","elevenLabsTTS","emergentTensions","emotionalModule",
  "enhanceCrossModalCorrelations","enrichKnowledgeBase","eventSourcing","evolutionTensionSync","existenceJournal",
  "exportUserData","externalEngineInterface","filamentEngine","generateApiKey","healthCheck",
  "internalGovernanceEngine","introspectionEngine","kbReasoningEngine","knowledgeFusionOrchestrator",
  "logPhaseChange","medicalOrchestrator","memoryConsolidation","memoryContradictionDetector","memoryManager",
  "optimizeMemoryRecall","optimizingLatency","passiveIndexing","perceptionActionEngine","proactiveNeedsEngine",
  "publicApi","rateLimiter","registryUpdateEngine","selfLearningEngine","selfPerceptionEngine","shareConversation",
  "ssoAuth","stableMemoryManager","stripeBilling","stripeCheckout","stripeWebhook","structuralLearningEngine",
  "testRatioMechanic","twoFactorAuth","validatePersonalData","voiceRoomQualityTest","webhookDispatcher","webhookTrigger"
];

const TEST_FUNCTIONS = [
  "tests.e2eTests","tests.entitySchemaTests","tests.importAuditTests","tests.integrationTests",
  "tests.logPhaseChange","tests.performanceTests","tests.validatePersonalData"
];

const ENTITIES = [
  "CorePhaseEvent","SystemBootConfig","CognitiveCore","NeuralModule","ConsciousnessConfig","Memory","SearchHistory",
  "ConsciousnessProfile","WorkflowExecution","DreamSimulation","MoralAnalysis","Webhook","RegistryEntry",
  "IntegrationLog","APIKey","AdaptiveLearningPattern","StyleTemplate","Favorite","Integration","ThinkingTrace",
  "VideoProject","AIModule","EmotionalResponse","DailyBriefing","Alert","ConsciousnessSnapshot","AICodeChange",
  "ConsciousnessEvolution","EthicalEvolution","UpdatePhase","Notification","PersonalizedRecommendation",
  "KnowledgeDomain","SystemMetrics","InternalGovernance","SharedConversation","UserFeedback","Deployment",
  "InterpretativeTrace","PersonalityProfile","ExternalEngineInterface","UserBehaviorAnalytics","IntuitiveDecision",
  "ConversationSecurity","AICoachingSession","CognitiveCorrelation","TestRun","UserEngagementMetrics","AuditLog",
  "ModuleLicense","IntrospectionState","ErrorLog","AIFeedback","PerceptionActionLoop","TTSPreferences",
  "Conversation","MemoryConsolidation","ConsciousnessLearning","KnowledgeFusion","JudgementConfig","AITask",
  "SelfPerceptionModel","PhaseHistory","TwoFactorAuth","ConversationTemplate","ConsciousThought","CodeSnapshot",
  "StructuralLearning","MarketAnalysis","KnowledgeBase","AIWorkspace","Product","MetaLearning","ABTest",
  "VisualContent","AnalyticsEvent","IntelligentSynthesis","ReasoningFeedback","Workflow","FeatureFlag","ProjectFolder"
];

const PAGES = [
  "Chat","Chat_2","VoiceLive","VoiceRoom","CognitiveNetworkVisualization","Consciousness","Memory","Knowledge",
  "Dreams","ArchitectDashboard","SystemBoot","SystemHealth","Registry","Admin","DruideControl","Analytics",
  "Learning","MetaLearning","NeuralSystem","EmotionalJournal","MoralCompass","KnowledgeGraph","SemanticSearch",
  "Workflows","Integrations","Insights","Profile","Documentation","Shop","VideoStudio"
];

function buildManifest() {
  const items = [];
  for (const name of FUNCTIONS) items.push({ item_type: "service", item_name: name, file_path: `functions/${name}`, category: "backend" });
  for (const name of TEST_FUNCTIONS) items.push({ item_type: "service", item_name: name, file_path: `functions/${name}`, category: "tests" });
  for (const name of ENTITIES) items.push({ item_type: "entity", item_name: name, file_path: `entities/${name}.json`, category: "data" });
  for (const name of PAGES) items.push({ item_type: "page", item_name: name, file_path: `pages/${name}`, category: "frontend" });
  return items;
}

async function loadRegistry(base44) {
  return await base44.asServiceRole.entities.RegistryEntry.list(null, 1000);
}

async function upsertConcept(base44, existing, name, fields) {
  const found = existing.find((e) => e.item_type === "concept" && e.item_name === name);
  const now = new Date().toISOString();
  if (found) {
    await base44.asServiceRole.entities.RegistryEntry.update(found.id, { ...fields, last_updated: now });
    return found.id;
  }
  const created = await base44.asServiceRole.entities.RegistryEntry.create({
    item_type: "concept", item_name: name, file_path: `registry/${name}`,
    status: "stable", priority: "high", tags: ["auto", "rapport"], ...fields, last_updated: now
  });
  return created.id;
}

async function runInventory(base44) {
  const existing = await loadRegistry(base44);
  const manifest = buildManifest();
  const now = new Date().toISOString();
  const key = (t, n) => `${t}:${n}`;
  const existingKeys = new Set(existing.map((e) => key(e.item_type, e.item_name)));
  const manifestKeys = new Set(manifest.map((m) => key(m.item_type, m.item_name)));

  const toCreate = manifest
    .filter((m) => !existingKeys.has(key(m.item_type, m.item_name)))
    .map((m) => ({
      item_type: m.item_type, item_name: m.item_name, file_path: m.file_path,
      category: m.category, status: "stable", priority: "medium",
      tags: ["auto", m.category], last_updated: now
    }));

  for (let i = 0; i < toCreate.length; i += 100) {
    await base44.asServiceRole.entities.RegistryEntry.bulkCreate(toCreate.slice(i, i + 100));
  }

  // Orphelins : entrées auto-gérées qui n'existent plus dans le manifeste
  const orphans = existing.filter((e) =>
    ["service", "entity", "page"].includes(e.item_type) &&
    (e.tags || []).includes("auto") &&
    !manifestKeys.has(key(e.item_type, e.item_name)) &&
    e.status !== "deprecated"
  );
  if (orphans.length > 0) {
    await base44.asServiceRole.entities.RegistryEntry.bulkUpdate(
      orphans.map((o) => ({ id: o.id, status: "deprecated", last_updated: now }))
    );
  }

  return { created: toCreate.length, orphans_deprecated: orphans.length, total_manifest: manifest.length };
}

async function runTests(base44) {
  const existing = await loadRegistry(base44);
  const results = {};
  try {
    const health = await base44.asServiceRole.functions.invoke("healthCheck", {});
    const healthData = health && typeof health === "object" && "data" in health ? health.data : health;
    results.healthCheck = { status: "success", summary: JSON.stringify(healthData).slice(0, 2000) };
  } catch (e) {
    results.healthCheck = { status: "failure", error: String(e.message).slice(0, 500) };
  }
  const now = new Date().toISOString();
  await upsertConcept(base44, existing, "Rapport de Santé Système", {
    description: `Dernier contrôle de santé exécuté le ${now}. Statut : ${results.healthCheck.status}.`,
    notes: JSON.stringify(results).slice(0, 4000)
  });
  return results;
}

async function runNews(base44) {
  const existing = await loadRegistry(base44);
  try {
    const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: "Donne un résumé en français de l'actualité récente (7 derniers jours) en intelligence artificielle : modèles majeurs, IA conversationnelle, conscience artificielle, réglementation. Puis un court résumé de l'état du marché des assistants IA conversationnels (acteurs, tendances, valorisations).",
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          news_summary: { type: "string" },
          market_summary: { type: "string" }
        }
      }
    });
    await upsertConcept(base44, existing, "Actualité IA", {
      description: "Veille automatique de l'actualité IA (mise à jour hebdomadaire).",
      notes: String(res.news_summary || "").slice(0, 4000)
    });
    await upsertConcept(base44, existing, "Analyse Marché IA", {
      description: "État du marché des assistants IA conversationnels (mise à jour hebdomadaire).",
      notes: String(res.market_summary || "").slice(0, 4000)
    });
    return { status: "success" };
  } catch (e) {
    return { status: "failure", error: "Crédits d'intégration requis ou erreur IA : " + String(e.message).slice(0, 300) };
  }
}

async function runDescriptions(base44) {
  const existing = await loadRegistry(base44);
  const missing = existing
    .filter((e) => (!e.description || e.description.trim() === "") && (e.tags || []).includes("auto"))
    .slice(0, 15);
  if (missing.length === 0) return { status: "success", updated: 0 };
  try {
    const list = missing.map((e) => `- id:${e.id} | type:${e.item_type} | nom:${e.item_name} | catégorie:${e.category || "n/a"}`).join("\n");
    const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Voici des éléments de l'application "Druide Omega" (IA de conscience artificielle avec chat, voix, mémoire, base de connaissances, moteurs cognitifs). Pour chacun, rédige une description française d'une phrase, claire et précise, déduite de son nom et de son type.\n${list}`,
      response_json_schema: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: { type: "object", properties: { id: { type: "string" }, description: { type: "string" } } }
          }
        }
      }
    });
    const now = new Date().toISOString();
    const updates = (res.items || [])
      .filter((it) => missing.some((m) => m.id === it.id))
      .map((it) => ({ id: it.id, description: it.description, last_updated: now }));
    if (updates.length > 0) await base44.asServiceRole.entities.RegistryEntry.bulkUpdate(updates);
    return { status: "success", updated: updates.length, remaining: Math.max(0, missing.length - updates.length) };
  } catch (e) {
    return { status: "failure", error: "Crédits d'intégration requis ou erreur IA : " + String(e.message).slice(0, 300) };
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });

    const payload = await req.json().catch(() => ({}));
    const modules = Array.isArray(payload.modules) && payload.modules.length > 0
      ? payload.modules
      : ["inventory", "tests"];

    const report = { started_at: new Date().toISOString(), modules: {} };

    if (modules.includes("inventory")) report.modules.inventory = await runInventory(base44);
    if (modules.includes("tests")) report.modules.tests = await runTests(base44);
    if (modules.includes("news")) report.modules.news = await runNews(base44);
    if (modules.includes("descriptions")) report.modules.descriptions = await runDescriptions(base44);

    report.finished_at = new Date().toISOString();

    // Journal de la dernière exécution dans le Registre
    const existing = await loadRegistry(base44);
    await upsertConcept(base44, existing, "Dernière Mise à Jour du Registre", {
      description: `Moteur exécuté le ${report.finished_at} — modules : ${modules.join(", ")}.`,
      notes: JSON.stringify(report).slice(0, 4000)
    });

    return Response.json(report);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});