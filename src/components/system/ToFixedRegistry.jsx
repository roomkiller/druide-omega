/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - .toFixed() Registry & Repair Guide                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * REGISTRE DES .toFixed() À RÉPARER
 * 
 * Ce fichier liste tous les usages de .toFixed() dans le code et leur statut.
 * 
 * STATUT:
 * ✅ FIXED - Corrigé avec safeToFixed()
 * ⚠️  TODO - Nécessite correction
 * ℹ️  SAFE - Déjà sécurisé (vérification en amont)
 * 
 * SOLUTION:
 * Remplacer: value.toFixed(2)
 * Par:       safeToFixed(value, 2)
 * 
 * Import:    import { safeToFixed, safeNumber } from "@/components/utils/SafeNumber";
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const TO_FIXED_REGISTRY = [
  // ═══════════════════════════════════════════════════════════════════════
  // PAGES
  // ═══════════════════════════════════════════════════════════════════════
  
  {
    file: "pages/Analytics",
    status: "✅ FIXED",
    instances: [
      { line: "~100-150", usage: "metrics calculations", fixed: true }
    ]
  },
  
  {
    file: "pages/Consciousness",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "consciousness metrics display", fixed: false }
    ]
  },
  
  {
    file: "pages/DecisionArchive",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "decision scores/metrics", fixed: false }
    ]
  },
  
  {
    file: "pages/NeuralSystem",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "neural metrics", fixed: false }
    ]
  },
  
  {
    file: "pages/MoralCompass",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "moral scores", fixed: false }
    ]
  },
  
  {
    file: "pages/DailyBriefing",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "briefing metrics", fixed: false }
    ]
  },
  
  {
    file: "pages/Knowledge",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "knowledge stats", fixed: false }
    ]
  },
  
  {
    file: "pages/VoiceRoom",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "voice metrics", fixed: false }
    ]
  },
  
  {
    file: "pages/VoiceLive",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "live metrics", fixed: false }
    ]
  },
  
  {
    file: "pages/Memory",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "memory stats", fixed: false }
    ]
  },
  
  {
    file: "pages/Intelligences",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "intelligence scores", fixed: false }
    ]
  },
  
  {
    file: "pages/SecurityDashboard",
    status: "✅ FIXED",
    instances: [
      { line: "~260-280", usage: "security stats percentages", fixed: true }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════
  // COMPONENTS
  // ═══════════════════════════════════════════════════════════════════════
  
  {
    file: "components/coaching/CoachingEngine",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "engagement scores", fixed: false }
    ]
  },
  
  {
    file: "components/analytics/PredictiveEngine",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "prediction scores", fixed: false }
    ]
  },
  
  {
    file: "components/consciousness/ConsciousnessMetrics",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "consciousness display", fixed: false }
    ]
  },
  
  {
    file: "components/consciousness/SensoryArchitecture",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "sensory metrics", fixed: false }
    ]
  },
  
  {
    file: "components/consciousness/DecisionCore",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "decision metrics", fixed: false }
    ]
  },
  
  {
    file: "components/neural/ModulePerformanceDashboard",
    status: "✅ FIXED",
    instances: [
      { line: "~50-200", usage: "performance metrics", fixed: true }
    ]
  },
  
  {
    file: "components/neural/NeuralModuleCard",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "module stats", fixed: false }
    ]
  },
  
  {
    file: "components/memory/MemoryStats",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "memory statistics", fixed: false }
    ]
  },
  
  {
    file: "components/tts/TTSControls",
    status: "✅ FIXED",
    instances: [
      { line: "66, 78", usage: "rate/pitch display", fixed: true }
    ]
  },
  
  {
    file: "components/knowledge/KnowledgeGraph",
    status: "⚠️ TODO",
    instances: [
      { line: "À scanner", usage: "graph metrics", fixed: false }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════
  // UTILITAIRES
  // ═══════════════════════════════════════════════════════════════════════
  
  {
    file: "components/utils/SafeNumber",
    status: "✅ SAFE",
    instances: [
      { line: "ALL", usage: "SafeNumber utilities - implementation", fixed: true }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════
// SCAN AUTOMATIQUE (à exécuter dans la console)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Fonction pour scanner automatiquement un fichier et détecter les .toFixed()
 * 
 * Usage en console navigateur:
 * 
 * const code = `// votre code ici`;
 * scanToFixed(code);
 */
export function scanToFixed(code, filename = "unknown") {
  const lines = code.split('\n');
  const findings = [];
  
  lines.forEach((line, index) => {
    if (line.includes('.toFixed(') && !line.includes('safeToFixed')) {
      findings.push({
        line: index + 1,
        code: line.trim(),
        file: filename
      });
    }
  });
  
  return findings;
}

// ═══════════════════════════════════════════════════════════════════════
// COMMANDES DE RÉPARATION RAPIDE
// ═══════════════════════════════════════════════════════════════════════

export const REPAIR_PATTERNS = {
  // Pattern 1: Simple .toFixed()
  simple: {
    before: /(\w+)\.toFixed\((\d+)\)/g,
    after: (match, variable, decimals) => `safeToFixed(${variable}, ${decimals})`
  },
  
  // Pattern 2: Chaîné avec calcul
  chained: {
    before: /\(([^)]+)\)\.toFixed\((\d+)\)/g,
    after: (match, expression, decimals) => `safeToFixed(${expression}, ${decimals})`
  },
  
  // Pattern 3: Dans template literal
  template: {
    before: /\$\{([^}]+)\.toFixed\((\d+)\)\}/g,
    after: (match, variable, decimals) => `\${safeToFixed(${variable}, ${decimals})}`
  }
};

/**
 * Applique les réparations automatiques
 */
export function autoRepair(code) {
  let repaired = code;
  
  Object.values(REPAIR_PATTERNS).forEach(pattern => {
    repaired = repaired.replace(pattern.before, pattern.after);
  });
  
  return repaired;
}

// ═══════════════════════════════════════════════════════════════════════
// STATISTIQUES
// ═══════════════════════════════════════════════════════════════════════

export function getStats() {
  const total = TO_FIXED_REGISTRY.length;
  const fixed = TO_FIXED_REGISTRY.filter(item => item.status === "✅ FIXED").length;
  const todo = TO_FIXED_REGISTRY.filter(item => item.status === "⚠️ TODO").length;
  const safe = TO_FIXED_REGISTRY.filter(item => item.status === "ℹ️ SAFE").length;
  
  return {
    total,
    fixed,
    todo,
    safe,
    percentage: Math.round((fixed / total) * 100)
  };
}

// ═══════════════════════════════════════════════════════════════════════
// EXPORT DEFAULT
// ═══════════════════════════════════════════════════════════════════════

export default {
  registry: TO_FIXED_REGISTRY,
  scanToFixed,
  autoRepair,
  getStats,
  REPAIR_PATTERNS
};