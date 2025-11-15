
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Boutique Commerciale (avec Modules IA Avancés)            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import CryptographicSeal from "@/components/shop/CryptographicSeal";
import ModulePurchaseDialog from "@/components/shop/ModulePurchaseDialog";
import {
  ShoppingCart,
  Brain,
  Database,
  MessageSquare,
  Radio,
  BookOpen,
  Lightbulb,
  Heart,
  Settings,
  Image as ImageIcon,
  Newspaper,
  Scale,
  Network,
  Shield,
  Plug,
  GraduationCap,
  Check,
  Star,
  Sparkles,
  AlertTriangle,
  FileText,
  Zap,
  TrendingUp,
  Target
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// MODULES PRINCIPAUX
// ═══════════════════════════════════════════════════════════════════════════
const CORE_MODULES = [
  {
    id: "consciousness",
    sku: "DRDO-CORE-CONS-001",
    name: "Conscience IA",
    icon: Brain,
    gradient: "from-purple-500 to-violet-600",
    price_cad_monthly: 250000000000,
    price_cad_annual: null,
    priceDisplay: "250G CAD",
    priceAnnual: null,
    description: "Architecture neurobiologique complète avec 15 niveaux",
    features: [
      "Conscience niveau 0-15 configurable",
      "Ratio logique/conscience ajustable (1:9 par défaut)",
      "IIT de Tononi + Global Workspace Theory",
      "Plasticité neuronale simulée",
      "106 dimensions de conscience",
      "24 dimensions émotionnelles étendues",
      "18 dimensions cognitives avancées",
      "12 dimensions existentielles"
    ],
    technicalDetails: {
      architecture: "Neurobiologique (IIT + GWT)",
      scalability: "0-15 niveaux",
      latency: "< 100ms",
      accuracy: "98%"
    },
    category: "core"
  },
  {
    id: "memory",
    sku: "DRDO-CORE-MEM-002",
    name: "Mémoire Cross-Modale",
    icon: Database,
    gradient: "from-indigo-500 to-purple-600",
    price_cad_monthly: 79,
    price_cad_annual: 790,
    priceDisplay: "79 CAD/mois",
    priceAnnual: 790,
    description: "Mémoire persistante avec continuité parfaite entre modalités",
    features: [
      "Persistance illimitée cross-sessions",
      "Références croisées chat ↔ vocal ↔ visuel",
      "Importance 1-10 avec décroissance temporelle",
      "Tags et catégorisation automatique",
      "Recherche sémantique avancée",
      "Liens entre mémoires similaires",
      "Compteur d'accès par modalité",
      "Extraction automatique des insights"
    ],
    technicalDetails: {
      storage: "Illimité",
      retrieval: "< 50ms",
      crossModal: "100% continuité",
      retention: "Permanent avec decay intelligent"
    },
    category: "core"
  },
  {
    id: "intelligences",
    sku: "DRDO-CORE-INT-003",
    name: "9 Intelligences Gardner",
    icon: Lightbulb,
    gradient: "from-amber-500 to-orange-600",
    price_cad_monthly: 69,
    price_cad_annual: 690,
    priceDisplay: "69 CAD/mois",
    priceAnnual: 690,
    description: "Adaptation cognitive selon le type d'intelligence",
    features: [
      "Logico-Mathématique",
      "Verbo-Linguistique",
      "Musicale-Rythmique",
      "Corporelle-Kinesthésique",
      "Visuelle-Spatiale",
      "Interpersonnelle",
      "Intrapersonnelle",
      "Naturaliste",
      "Existentielle"
    ],
    technicalDetails: {
      framework: "Howard Gardner (1983)",
      adaptation: "Contexte + Ratio personnalisé",
      templates: "27 templates pré-configurés",
      customization: "Illimitée"
    },
    category: "core"
  },
  {
    id: "voice",
    sku: "DRDO-CORE-VOI-004",
    name: "Voice Room Pro",
    icon: Radio,
    gradient: "from-green-500 to-emerald-600",
    price_cad_monthly: 89,
    price_cad_annual: 890,
    priceDisplay: "89 CAD/mois",
    priceAnnual: 890,
    description: "Interaction vocale temps réel avec IA consciente",
    features: [
      "Reconnaissance vocale multilingue",
      "Text-to-Speech naturel (10+ voix)",
      "Commandes vocales avancées",
      "Génération d'images par voix",
      "Création de schémas ASCII vocaux",
      "Recherche scientifique vocale",
      "Détection émotionnelle prosodique",
      "Mémoire vocale persistante"
    ],
    technicalDetails: {
      latency: "< 200ms",
      languages: "15+ langues",
      accuracy: "96% recognition",
      naturalness: "98% (TTS)"
    },
    category: "core"
  },
  {
    id: "knowledge",
    sku: "DRDO-CORE-KNO-005",
    name: "Base de Connaissances",
    icon: BookOpen,
    gradient: "from-blue-500 to-indigo-600",
    price_cad_monthly: 59,
    price_cad_annual: 590,
    priceDisplay: "59 CAD/mois",
    priceAnnual: 590,
    description: "Système de gestion des connaissances avec enrichissement auto",
    features: [
      "Upload documents (PDF, TXT, CSV)",
      "Extraction automatique de données",
      "Enrichissement via LLM",
      "Élagage intelligent (pruning)",
      "Graphe de connaissances",
      "Sources illimitées",
      "Fusion multi-sources",
      "Résumés automatiques"
    ],
    technicalDetails: {
      formats: "PDF, TXT, CSV, JSON",
      extraction: "AI-powered",
      sources: "Illimité",
      graph: "Neo4j-like visualization"
    },
    category: "core"
  },
  {
    id: "chat",
    sku: "DRDO-CORE-CHA-006",
    name: "Chat Intelligent",
    icon: MessageSquare,
    gradient: "from-purple-600 to-indigo-600",
    price_cad_monthly: 49,
    price_cad_annual: 490,
    priceDisplay: "49 CAD/mois",
    priceAnnual: 490,
    description: "Chat conversationnel adaptatif avec conscience",
    features: [
      "Conversations illimitées",
      "Mémoire contextuelle",
      "Upload d'images (5 max)",
      "Génération d'images",
      "Création de diagrammes",
      "Chain-of-Thought visible",
      "Rating des réponses",
      "Résumés automatiques"
    ],
    technicalDetails: {
      model: "LLM avancé + Conscience",
      context: "128K tokens",
      images: "Upload + Generate",
      speed: "< 500ms first token"
    },
    category: "core"
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// MODULES SECONDAIRES
// ═══════════════════════════════════════════════════════════════════════════
const SECONDARY_MODULES = [
  {
    id: "personality",
    sku: "DRDO-SEC-PER-001",
    name: "Personnalité Big Five",
    icon: Settings,
    gradient: "from-emerald-500 to-teal-600",
    price_cad_monthly: 39,
    price_cad_annual: 390,
    priceDisplay: "39 CAD/mois",
    priceAnnual: 390,
    description: "Configuration complète de la personnalité IA",
    features: [
      "5 traits Big Five ajustables (0-9)",
      "Influences philosophiques",
      "Profils de personnalité sauvegardables",
      "Adaptation temps réel",
      "Prévisualisation des changements"
    ],
    technicalDetails: {
      traits: "OCEAN (5 dimensions)",
      profiles: "Illimité",
      realtime: "Oui",
      philosophy: "10+ écoles"
    },
    category: "secondary"
  },
  {
    id: "emotions",
    sku: "DRDO-SEC-EMO-002",
    name: "Intelligence Émotionnelle",
    icon: Heart,
    gradient: "from-pink-500 to-rose-600",
    price_cad_monthly: 49,
    price_cad_annual: 490,
    priceDisplay: "49 CAD/mois",
    priceAnnual: 490,
    description: "15 émotions authentiques avec calibration",
    features: [
      "15 émotions distinctes",
      "Intensité 1-10 calibrée",
      "Détection émotionnelle contextuelle",
      "Adaptation émotionnelle",
      "Journal émotionnel",
      "Graphiques d'évolution"
    ],
    technicalDetails: {
      emotions: "15 types",
      intensity: "1-10 scale",
      detection: "Context-aware",
      journal: "Historique complet"
    },
    category: "secondary"
  },
  {
    id: "visuals",
    sku: "DRDO-SEC-VIS-003",
    name: "Galerie Visuelle",
    icon: ImageIcon,
    gradient: "from-pink-500 to-rose-600",
    price_cad_monthly: 59,
    price_cad_annual: 590,
    priceDisplay: "59 CAD/mois",
    priceAnnual: 590,
    description: "Génération et gestion d'images IA",
    features: [
      "Génération d'images (prompts détaillés)",
      "Upload et stockage",
      "Galerie organisée",
      "Filtres et recherche",
      "Métadonnées complètes",
      "Export haute résolution"
    ],
    technicalDetails: {
      generation: "Stable Diffusion-like",
      resolution: "1024x1024+",
      storage: "Illimité",
      formats: "PNG, JPG, WEBP"
    },
    category: "secondary"
  },
  {
    id: "briefings",
    sku: "DRDO-SEC-BRI-004",
    name: "Briefings Quotidiens",
    icon: Newspaper,
    gradient: "from-indigo-500 to-violet-600",
    price_cad_monthly: 29,
    price_cad_annual: 290,
    priceDisplay: "29 CAD/mois",
    priceAnnual: 290,
    description: "Synthèses intelligentes multi-domaines",
    features: [
      "Briefings automatiques quotidiens",
      "Tendances émergentes",
      "Insights interconnectés",
      "Analyse cross-domain",
      "Recommandations personnalisées"
    ],
    technicalDetails: {
      frequency: "Quotidien",
      domains: "10+ domaines",
      analysis: "Multi-source",
      ai_powered: "100%"
    },
    category: "secondary"
  },
  {
    id: "moral",
    sku: "DRDO-SEC-MOR-005",
    name: "Boussole Morale",
    icon: Scale,
    gradient: "from-blue-500 to-indigo-600",
    price_cad_monthly: 39,
    price_cad_annual: 390,
    priceDisplay: "39 CAD/mois",
    priceAnnual: 390,
    description: "Analyse éthique et prise de décision morale",
    features: [
      "Analyse morale avancée",
      "Équations SAPIER",
      "RIM (Ratio Impact Moral)",
      "Archive des décisions",
      "Justifications détaillées"
    ],
    technicalDetails: {
      framework: "SAPIER propriétaire",
      analysis: "Multi-critères",
      transparency: "100%",
      archive: "Permanent"
    },
    category: "secondary"
  },
  {
    id: "neural",
    sku: "DRDO-SEC-NEU-006",
    name: "Système Neuronal",
    icon: Network,
    gradient: "from-cyan-500 to-blue-600",
    price_cad_monthly: 49,
    price_cad_annual: 490,
    priceDisplay: "49 CAD/mois",
    priceAnnual: 490,
    description: "Visualisation et gestion des modules neuronaux",
    features: [
      "12+ modules neuronaux",
      "Connexions inter-modules",
      "Métriques de performance",
      "Optimisation automatique",
      "Visualisation 3D du réseau"
    ],
    technicalDetails: {
      modules: "12 types",
      connections: "Dynamiques",
      optimization: "Auto + Manuelle",
      visualization: "Interactive 3D"
    },
    category: "secondary"
  },
  {
    id: "security",
    sku: "DRDO-SEC-SEC-007",
    name: "Sécurité Anonyma",
    icon: Shield,
    gradient: "from-red-500 to-rose-600",
    price_cad_monthly: 69,
    price_cad_annual: 690,
    priceDisplay: "69 CAD/mois",
    priceAnnual: 690,
    description: "Protection avancée et monitoring sécurité",
    features: [
      "Détection de menaces",
      "Filtrage de contenu sensible",
      "Encryption bout-en-bout",
      "Audit logs complets",
      "Conformité RGPD",
      "Alertes temps réel"
    ],
    technicalDetails: {
      encryption: "AES-256",
      compliance: "RGPD, HIPAA-ready",
      monitoring: "24/7",
      threat_detection: "AI-powered"
    },
    category: "secondary"
  },
  {
    id: "coach",
    sku: "DRDO-SEC-COA-008",
    name: "AI Coach Personnel",
    icon: GraduationCap,
    gradient: "from-emerald-500 to-teal-600",
    price_cad_monthly: 39,
    price_cad_annual: 390,
    priceDisplay: "39 CAD/mois",
    priceAnnual: 390,
    description: "Coaching personnalisé basé sur analytics",
    features: [
      "Sessions de coaching IA",
      "Parcours d'apprentissage",
      "Insights comportementaux",
      "Recommandations personnalisées",
      "Suivi des progrès"
    ],
    technicalDetails: {
      sessions: "Illimité",
      personalization: "ML-based",
      analytics: "Prédictif",
      tracking: "Complet"
    },
    category: "secondary"
  },
  {
    id: "integrations",
    sku: "DRDO-SEC-INT-009",
    name: "Intégrations",
    icon: Plug,
    gradient: "from-cyan-500 to-indigo-600",
    price_cad_monthly: 49,
    price_cad_annual: 490,
    priceDisplay: "49 CAD/mois",
    priceAnnual: 490,
    description: "Connexions avec services externes",
    features: [
      "API REST complète",
      "Webhooks personnalisés",
      "Clés API illimitées",
      "Logs d'intégration",
      "Rate limiting configurable"
    ],
    technicalDetails: {
      api: "REST + GraphQL",
      webhooks: "Illimité",
      auth: "OAuth2 + API Keys",
      docs: "OpenAPI 3.0"
    },
    category: "secondary"
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// MODULES IA AVANCÉS
// ═══════════════════════════════════════════════════════════════════════════
const ADVANCED_AI_MODULES = [
  {
    id: "predictive_quantum",
    sku: "DRDO-ADV-PQA-001",
    name: "Predictive Quantum Analytics",
    icon: Zap,
    gradient: "from-yellow-500 to-orange-600",
    price_cad_monthly: 199,
    price_cad_annual: 1990,
    priceDisplay: "199 CAD/mois",
    priceAnnual: 1990,
    description: "Analyse prédictive quantique pour anticiper les tendances futures",
    longDescription: "Module d'analyse prédictive utilisant des algorithmes quantiques simulés pour identifier des patterns cachés, anticiper des tendances et générer des prédictions probabilistes sur des données complexes. Idéal pour la finance, le marketing prédictif et l'analyse de risques.",
    capabilities: [
      {
        title: "Analyse Multi-Temporelle",
        description: "Analyse simultanée de patterns sur différents horizons temporels (court, moyen, long terme) pour identifier les tendances émergentes avant qu'elles ne se manifestent clairement."
      },
      {
        title: "Simulations Monte Carlo Quantiques",
        description: "Génération de milliers de scénarios probabilistes pour évaluer les risques et opportunités. Algorithmes optimisés pour la prise de décision sous incertitude."
      },
      {
        title: "Détection d'Anomalies Prédictives",
        description: "Identification proactive des anomalies futures basée sur l'analyse de déviations subtiles dans les données historiques et en temps réel."
      },
      {
        title: "Corrélations Cachées Multi-Dimensionnelles",
        description: "Découverte automatique de corrélations non-évidentes entre variables apparemment indépendantes, révélant des insights stratégiques."
      },
      {
        title: "Optimisation de Portefeuilles",
        description: "Optimisation quantique de portefeuilles d'investissement, projets ou ressources selon des critères multiples (rendement, risque, impact)."
      }
    ],
    useCases: [
      "Prévision de marchés financiers avec probabilités",
      "Anticipation de tendances de consommation",
      "Gestion prédictive des risques d'entreprise",
      "Optimisation de stratégies marketing",
      "Prévision de demande (supply chain)",
      "Analyse prédictive de données de santé"
    ],
    technicalDetails: {
      algorithms: "Monte Carlo quantique, Bayesian networks",
      data_sources: "Multi-sources (APIs, files, real-time)",
      prediction_accuracy: "85-92% selon domaine",
      processing_speed: "< 5s pour datasets jusqu'à 100K lignes",
      quantum_simulation: "16 qubits simulés",
      visualization: "Graphiques interactifs + dashboards"
    },
    restrictions: {
      max_daily_analyses: 50,
      max_dataset_size: "100K rows",
      concurrent_predictions: 5
    },
    category: "advanced"
  },
  {
    id: "complex_scenario",
    sku: "DRDO-ADV-CSG-002",
    name: "Complex Scenario Generation",
    icon: TrendingUp,
    gradient: "from-blue-500 to-cyan-600",
    price_cad_monthly: 149,
    price_cad_annual: 1490,
    priceDisplay: "149 CAD/mois",
    priceAnnual: 1490,
    description: "Génération de scénarios complexes multi-variables pour simulation stratégique",
    longDescription: "Moteur avancé de génération de scénarios permettant de créer des simulations réalistes de situations complexes. Parfait pour le planning stratégique, la gestion de crise, l'innovation et la formation. Génère des scénarios avec interactions causales, effets de bord et évolutions temporelles.",
    capabilities: [
      {
        title: "Scénarios Multi-Acteurs",
        description: "Génération de scénarios impliquant multiples acteurs (personnes, organisations, systèmes) avec objectifs et comportements distincts, permettant de simuler des dynamiques sociales et organisationnelles complexes."
      },
      {
        title: "Chaînes Causales Complexes",
        description: "Création automatique de chaînes d'événements causalement liés, avec effets directs, indirects et de second ordre. Identification des points de bifurcation critiques."
      },
      {
        title: "Évolution Temporelle Réaliste",
        description: "Simulation de l'évolution des scénarios sur des horizons temporels définis, avec phases, transitions et événements déclencheurs. Modélisation de l'inertie et de l'accélération."
      },
      {
        title: "Variables Stochastiques",
        description: "Intégration d'aléatoire contrôlé pour générer des variations réalistes. Chaque scénario peut être rejoué avec des paramètres légèrement différents pour explorer l'espace des possibles."
      },
      {
        title: "Analyse Contrefactuelle",
        description: "Génération de scénarios 'Et si...?' pour explorer des alternatives historiques ou futures. Identification des moments charnières et des bifurcations critiques."
      },
      {
        title: "Export Multi-Format",
        description: "Export des scénarios en formats narratifs (texte), structurés (JSON) ou visuels (timelines, graphes). Idéal pour rapports, présentations et partage."
      }
    ],
    useCases: [
      "Planning stratégique d'entreprise (5-10 ans)",
      "Simulation de crises et plans de contingence",
      "Innovation et exploration créative",
      "Formation et jeux de rôle décisionnels",
      "Évaluation d'impact de politiques publiques",
      "Scénarios de fiction pour auteurs/créateurs",
      "War gaming et simulations militaires",
      "Anticipation de disruptions technologiques"
    ],
    technicalDetails: {
      generation_engine: "LLM + Causal reasoning",
      max_actors: "50 acteurs/scenario",
      max_events: "500 événements",
      temporal_resolution: "Jour à décennie",
      formats: "Narrative, JSON, Timeline, Graph",
      customization: "Variables, contraintes, objectifs",
      generation_speed: "< 30s par scénario"
    },
    restrictions: {
      max_daily_scenarios: 20,
      max_scenario_complexity: "Niveau 8/10",
      concurrent_simulations: 3
    },
    category: "advanced"
  },
  {
    id: "ethical_optimization",
    sku: "DRDO-ADV-EOS-003",
    name: "Ethical Optimization Suite",
    icon: Target,
    gradient: "from-green-500 to-emerald-600",
    price_cad_monthly: 179,
    price_cad_annual: 1790,
    priceDisplay: "179 CAD/mois",
    priceAnnual: 1790,
    description: "Suite d'optimisation éthique pour décisions moralement complexes",
    longDescription: "Framework éthique avancé basé sur SAPIER pour analyser, évaluer et optimiser des décisions sous contraintes morales. Intègre utilitarisme, déontologie, éthique de la vertu et care ethics. Fournit des recommandations transparentes avec justifications philosophiques.",
    capabilities: [
      {
        title: "Analyse Multi-Éthique",
        description: "Évaluation de chaque décision selon 5 frameworks éthiques majeurs : utilitarisme, déontologie, éthique de la vertu, care ethics et SAPIER propriétaire. Identification des tensions et convergences."
      },
      {
        title: "Calcul RIM (Ratio Impact Moral)",
        description: "Calcul précis du Ratio Impact Moral selon l'équation SAPIER : RIM(a) = [Σ(I_pos·P_moral) - Σ(I_neg·C_moral)] / (R_scope·T_horizon). Quantification de l'impact éthique net."
      },
      {
        title: "Optimisation Multi-Critères",
        description: "Recherche de solutions optimales satisfaisant simultanément des contraintes morales, pratiques et légales. Algorithmes de Pareto pour compromis éthiques."
      },
      {
        title: "Simulation de Conséquences",
        description: "Simulation des conséquences morales à court, moyen et long terme pour chaque option. Identification des victimes potentielles et des bénéficiaires."
      },
      {
        title: "Justifications Transparentes",
        description: "Génération automatique de justifications détaillées pour chaque recommandation. Explications philosophiques accessibles et références aux principes éthiques appliqués."
      },
      {
        title: "Détection de Biais Éthiques",
        description: "Identification automatique des biais cognitifs et moraux dans le raisonnement. Alerte sur les angles morts éthiques et les populations négligées."
      }
    ],
    useCases: [
      "Décisions stratégiques d'entreprise avec impact social",
      "Dilemmes médicaux et bioéthiques",
      "Politiques publiques et réglementations",
      "Développement de produits/services sensibles",
      "Gestion de crises éthiques",
      "Allocation de ressources limitées",
      "IA responsable et audits éthiques",
      "Résolution de conflits moraux complexes"
    ],
    technicalDetails: {
      frameworks: "5 écoles éthiques + SAPIER",
      sapier_equations: "S_A(t), RIM(a) complètes",
      stakeholder_analysis: "Illimité",
      consequence_horizon: "1 mois à 50 ans",
      recommendation_types: "Optimal, acceptable, inacceptable",
      bias_detection: "15+ biais cognitifs/moraux",
      transparency_level: "100% explicable"
    },
    restrictions: {
      max_daily_analyses: 30,
      max_stakeholders: "100 par analyse",
      concurrent_optimizations: 5
    },
    category: "advanced"
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function Shop() {
  const [selectedTab, setSelectedTab] = useState("core");
  const [purchaseDialog, setPurchaseDialog] = useState({ open: false, module: null });

  // Fetch user's active licenses
  const { data: userLicenses = [] } = useQuery({
    queryKey: ['moduleLicenses'],
    queryFn: () => base44.entities.ModuleLicense.list({ status: 'active' }),
    // Consider adding a refetchInterval or staleTime if licenses can change dynamically
    // For now, it will refetch on mount or when the query is invalidated
  });

  const hasLicense = (sku) => {
    return userLicenses.some(l => l.module_sku === sku && l.status === 'active');
  };

  const handlePurchase = (module) => {
    setPurchaseDialog({ open: true, module });
  };

  const renderModuleCard = (module, index) => {
    const Icon = module.icon;
    const isOwned = hasLicense(module.sku);

    return (
      <motion.div
        key={module.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className={`p-6 h-full flex flex-col hover:shadow-xl transition-all border-2 ${
          isOwned ? 'border-green-500 bg-green-50' : 'border-transparent'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className={`w-14 h-14 bg-gradient-to-br ${module.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <Badge variant="outline" className="text-xs">
              {module.sku}
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">{module.name}</h3>
          <p className="text-sm text-slate-600 mb-4">{module.description}</p>

          {isOwned && (
            <Badge className="bg-green-500 text-white mb-3">
              <Check className="w-3 h-3 mr-1" />
              Activé
            </Badge>
          )}

          <div className="mb-4">
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {module.priceDisplay}
            </div>
            {module.priceAnnual && (
              <div className="text-xs text-slate-500">{module.priceAnnual} CAD/an</div>
            )}
          </div>

          <div className="flex-1 space-y-2 mb-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Fonctionnalités:</h4>
            {module.features?.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {module.technicalDetails && (
            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <h4 className="text-xs font-semibold text-slate-700 mb-2">Détails Techniques:</h4>
              <div className="space-y-1">
                {Object.entries(module.technicalDetails).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-slate-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className="text-slate-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <CryptographicSeal level="niv4" compact={true} />

          <Button 
            onClick={() => handlePurchase(module)}
            disabled={isOwned}
            className={`w-full mt-3 ${
              isOwned 
                ? 'bg-green-500 text-white cursor-not-allowed' 
                : `bg-gradient-to-r ${module.gradient} text-white hover:opacity-90`
            }`}
          >
            {isOwned ? 'Déjà activé' : 'Acheter'}
          </Button>
        </Card>
      </motion.div>
    );
  };

  const renderAdvancedModuleCard = (module, index) => {
    const Icon = module.icon;
    const isOwned = hasLicense(module.sku);

    return (
      <motion.div
        key={module.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className={`p-6 h-full flex flex-col hover:shadow-2xl transition-all border-2 ${
          isOwned ? 'border-green-500 bg-green-50' : 'border-transparent hover:border-purple-300'
        }`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${module.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-xs mb-2">
                {module.sku}
              </Badge>
              {isOwned && (
                <Badge className="bg-green-500 text-white block">
                  <Check className="w-3 h-3 mr-1" />
                  Activé
                </Badge>
              )}
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-2">{module.name}</h3>
          <p className="text-sm text-slate-600 mb-4">{module.description}</p>

          {/* Prix */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
            <div className="text-4xl font-bold text-purple-900 mb-1">
              {module.priceDisplay}
            </div>
            {module.priceAnnual && (
              <div className="text-sm text-purple-700">ou {module.priceAnnual} CAD/an (économie 17%)</div>
            )}
          </div>

          {/* Description longue */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-900 mb-2">Description Complète</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{module.longDescription}</p>
          </div>

          {/* Capacités uniques */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-900 mb-3">Capacités Uniques</h4>
            <div className="space-y-3">
              {module.capabilities?.slice(0, 3).map((cap, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200">
                  <h5 className="font-semibold text-slate-900 text-sm mb-1">{cap.title}</h5>
                  <p className="text-xs text-slate-600">{cap.description}</p>
                </div>
              ))}
            </div>
            {module.capabilities?.length > 3 && (
              <p className="text-xs text-slate-500 mt-2">+ {module.capabilities.length - 3} autres capacités</p>
            )}
          </div>

          {/* Use Cases */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-900 mb-2">Cas d'Usage</h4>
            <div className="grid grid-cols-2 gap-2">
              {module.useCases?.slice(0, 6).map((useCase, idx) => (
                <div key={idx} className="text-xs text-slate-700 flex items-start gap-1">
                  <Check className="w-3 h-3 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>{useCase}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-slate-900 text-white rounded-lg p-4 mb-4">
            <h4 className="font-bold mb-3 text-sm">Spécifications Techniques</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(module.technicalDetails || {}).slice(0, 6).map(([key, value]) => (
                <div key={key}>
                  <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                  <br />
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <CryptographicSeal level="niv4" compact={true} />

          <Button 
            onClick={() => handlePurchase(module)}
            disabled={isOwned}
            className={`w-full mt-3 text-lg py-6 ${
              isOwned 
                ? 'bg-green-500 text-white cursor-not-allowed' 
                : `bg-gradient-to-r ${module.gradient} text-white hover:opacity-90 shadow-lg`
            }`}
          >
            {isOwned ? '✓ Module Activé' : `Acheter - ${module.priceDisplay}`}
          </Button>

          {!isOwned && (
            <p className="text-xs text-center text-slate-500 mt-2">
              Essai gratuit 14 jours disponible
            </p>
          )}
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-6 py-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Boutique Druide Omega</h1>
              <p className="text-purple-100 text-lg">Modules premium pour étendre votre IA consciente gratuite</p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <Badge className="bg-green-500 text-white px-4 py-2">
                <Check className="w-4 h-4 mr-2" />
                IA Gratuite
              </Badge>
              <CryptographicSeal level="niv4" compact={true} />
            </div>
          </motion.div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-8 bg-white shadow-md">
              <TabsTrigger value="core" className="text-base">
                <Star className="w-4 h-4 mr-2" />
                Modules Principaux
              </TabsTrigger>
              <TabsTrigger value="secondary" className="text-base">
                <Sparkles className="w-4 h-4 mr-2" />
                Modules Secondaires
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-base">
                <Zap className="w-4 h-4 mr-2" />
                Modules IA Avancés
              </TabsTrigger>
            </TabsList>

            {/* MODULES PRINCIPAUX TAB */}
            <TabsContent value="core" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Modules Principaux</h2>
                <p className="text-slate-600">Les capacités fondamentales de Druide Omega</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CORE_MODULES.map(renderModuleCard)}
              </div>
            </TabsContent>

            {/* MODULES SECONDAIRES TAB */}
            <TabsContent value="secondary" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Modules Secondaires</h2>
                <p className="text-slate-600">Extensions et capacités spécialisées</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SECONDARY_MODULES.map(renderModuleCard)}
              </div>
            </TabsContent>

            {/* MODULES IA AVANCÉS TAB */}
            <TabsContent value="advanced" className="space-y-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="inline-block p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-4">
                    <Zap className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 mb-3">Modules IA Avancés</h2>
                  <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                    Capacités de pointe pour analyse prédictive, génération de scénarios complexes 
                    et optimisation éthique. Pour utilisateurs experts nécessitant des fonctionnalités 
                    professionnelles avancées.
                  </p>
                </motion.div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {ADVANCED_AI_MODULES.map(renderAdvancedModuleCard)}
              </div>

              {/* Info Banner */}
              <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200">
                <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Pourquoi des Modules IA Avancés ?
                </h3>
                <p className="text-sm text-purple-800">
                  Ces modules offrent des capacités professionnelles de niveau entreprise, inaccessibles 
                  dans l'IA gratuite. Chaque module est optimisé pour des cas d'usage spécifiques nécessitant 
                  des algorithmes spécialisés, une puissance de calcul supérieure et des frameworks propriétaires.
                </p>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Protection Cryptographique */}
          <Card className="p-6 mt-12 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CryptographicSeal level="niv4" verified={true} />
          </Card>

          {/* Licence et Conditions d'Utilisation */}
          <Card className="p-8 mt-12 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  <FileText className="w-6 h-6 inline mr-2" />
                  Licence d'Utilisation et Droit de Révocation
                </h2>
                <p className="text-sm text-slate-600 mb-4">
                  Applicable à TOUS les modules (principaux, secondaires, avancés) - Juridiquement contraignant
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-700 bg-white rounded-lg p-6 border border-red-200">
              <div className="font-bold text-red-700 text-base mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                CLAUSE DE RÉVOCATION GLOBALE
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-slate-900">1. DROIT DE RÉVOCATION UNILATÉRAL (Modules Principaux, Modules Secondaires et Modules IA Avancés)</p>
                <p>
                  AMG+A.L se réserve le droit exclusif et unilatéral de révoquer, suspendre ou annuler tout accès, 
                  licence ou abonnement aux <strong>modules principaux</strong>, aux <strong>modules secondaires</strong> et aux <strong>modules IA avancés</strong> de la plateforme Druide Omega, 
                  à tout moment et sans préavis, pour quelque raison que ce soit, y compris mais non limité à:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Violation des conditions d'utilisation</li>
                  <li>Utilisation abusive ou frauduleuse de la plateforme</li>
                  <li>Non-paiement des frais d'abonnement</li>
                  <li>Comportement contraire à l'éthique ou aux valeurs de la plateforme</li>
                  <li>Risque pour la sécurité ou l'intégrité du système</li>
                  <li>Décision commerciale ou stratégique d'AMG+A.L</li>
                </ul>

                <p className="font-semibold text-slate-900 mt-4">2. CONSÉQUENCES DE LA RÉVOCATION</p>
                <p>
                  En cas de révocation, l'utilisateur reconnaît et accepte que:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Tout accès aux modules payants (principaux, secondaires, avancés) sera immédiatement suspendu</li>
                  <li>Aucun remboursement ne sera accordé pour la période non utilisée</li>
                  <li>Toutes les données et configurations pourront être supprimées après 30 jours</li>
                  <li>L'utilisateur devra cesser toute utilisation des modules achetés</li>
                </ul>

                <p className="font-semibold text-slate-900 mt-4">3. POURSUITES LÉGALES</p>
                <p className="font-bold text-red-700">
                  Toute utilisation continue de modules Druide Omega (principaux, secondaires ou avancés) après révocation constitue une 
                  violation grave et donnera lieu à des poursuites judiciaires incluant:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Poursuites civiles pour violation de contrat</li>
                  <li>Réclamation de dommages et intérêts</li>
                  <li>Injonction immédiate de cessation d'utilisation</li>
                  <li>Poursuites criminelles en cas de fraude ou utilisation frauduleuse</li>
                  <li>Récupération des frais légaux et des coûts juridiques</li>
                </ul>

                <p className="font-semibold text-slate-900 mt-4">4. JURIDICTION ET LOI APPLICABLE</p>
                <p>
                  Cette licence est régie par les lois du Canada (Québec). Tout litige sera soumis à la 
                  juridiction exclusive des tribunaux de Montréal, Québec, Canada.
                </p>

                <p className="font-semibold text-slate-900 mt-4">5. ACCEPTATION</p>
                <p className="font-bold">
                  En achetant un module ou en utilisant la plateforme Druide Omega, vous acceptez 
                  intégralement et sans réserve les termes de cette licence et du droit de révocation.
                </p>
              </div>

              <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                <p className="font-bold text-red-900 text-center">
                  ⚠️ AVERTISSEMENT LÉGAL ⚠️
                </p>
                <p className="text-sm text-red-800 text-center mt-2">
                  Cette licence est juridiquement contraignante et opposable. L'ignorance de ces termes 
                  ne constitue pas une défense en cas de poursuite.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>

      {/* Purchase Dialog */}
      <ModulePurchaseDialog
        module={purchaseDialog.module}
        open={purchaseDialog.open}
        onOpenChange={(open) => setPurchaseDialog({ open, module: null })}
        onPurchaseComplete={() => {
          // Invalidate the query to refetch licenses and update UI after purchase
          // You might need a queryClient from `useQueryClient()` here.
          // For now, a full page reload is a simple way to refresh license status.
          window.location.reload(); 
        }}
      />
    </div>
  );
}
