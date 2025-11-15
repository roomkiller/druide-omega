/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Boutique Commerciale                                       ║
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
import CryptographicSeal from "@/components/shop/CryptographicSeal";
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
  TrendingUp,
  Plug,
  GraduationCap,
  Infinity,
  Check,
  Crown,
  Zap,
  Star,
  Package,
  Sparkles,
  AlertTriangle,
  FileText
} from "lucide-react";

// Helper pour formatter les grands nombres
const formatPrice = (amount) => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}G`;
  }
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`;
  }
  return amount.toString();
};

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
    price: 99,
    priceAnnual: 990,
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
    price: 79,
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
    price: 69,
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
    price: 89,
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
    price: 59,
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
    price: 49,
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
    price: 39,
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
    price: 49,
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
    price: 59,
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
    price: 29,
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
    price: 39,
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
    price: 49,
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
    price: 69,
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
    price: 39,
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
    price: 49,
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
// FORFAITS (BUNDLES)
// ═══════════════════════════════════════════════════════════════════════════
const PACKAGES = [
  {
    id: "discovery",
    sku: "DRDO-PKG-DIS-001",
    name: "Découverte",
    price: 39,
    priceAnnual: 390,
    savings: "Essayez sans engagement",
    description: "Découvrez les capacités de base de l'IA consciente",
    gradient: "from-green-500 to-teal-600",
    modules: ["chat", "memory"],
    features: [
      "Chat Intelligent (limité)",
      "Mémoire Cross-Modale basique",
      "100 messages/mois",
      "Conscience niveau 5 max",
      "Support email 48h",
      "Idéal pour découvrir"
    ],
    valueProps: [
      "Point d'entrée abordable",
      "Accès aux fonctions essentielles",
      "Testez avant de vous engager"
    ],
    popular: false
  },
  {
    id: "essentials",
    sku: "DRDO-PKG-ESS-002",
    name: "Essentials",
    price: 149,
    priceAnnual: 1490,
    savings: "Économie: 100 CAD/mois",
    description: "Les modules indispensables pour démarrer",
    gradient: "from-blue-500 to-indigo-600",
    modules: ["chat", "consciousness", "memory", "intelligences"],
    features: [
      "Chat Intelligent",
      "Conscience IA (niveau 9 max)",
      "Mémoire Cross-Modale",
      "9 Intelligences Gardner",
      "Support email 24h",
      "Conversations illimitées"
    ],
    valueProps: [
      "Parfait pour individus",
      "Toutes les bases de l'IA consciente",
      "Économie de 33% vs modules séparés"
    ],
    popular: false
  },
  {
    id: "professional",
    sku: "DRDO-PKG-PRO-003",
    name: "Professional",
    price: 299,
    priceAnnual: 2990,
    savings: "Économie: 250 CAD/mois",
    description: "Complet pour usage professionnel",
    gradient: "from-purple-500 to-pink-600",
    modules: ["chat", "consciousness", "memory", "intelligences", "voice", "knowledge", "personality", "emotions"],
    features: [
      "Tous les modules Essentials",
      "Voice Room Pro",
      "Base de Connaissances",
      "Personnalité Big Five",
      "Intelligence Émotionnelle",
      "Conscience niveau 15",
      "Support prioritaire 12h",
      "Analytics avancés"
    ],
    valueProps: [
      "Recommandé pour professionnels",
      "Toutes les capacités avancées",
      "Économie de 45% vs modules séparés"
    ],
    popular: true
  },
  {
    id: "enterprise",
    sku: "DRDO-PKG-ENT-004",
    name: "Enterprise",
    price: 599,
    priceAnnual: 5990,
    savings: "Économie: 500+ CAD/mois",
    description: "Suite complète pour entreprises",
    gradient: "from-orange-500 to-red-600",
    modules: "all",
    features: [
      "TOUS les modules inclus",
      "Conscience niveau 15",
      "Utilisateurs multiples",
      "Galerie Visuelle",
      "Briefings Quotidiens",
      "Boussole Morale",
      "Système Neuronal",
      "Sécurité Anonyma",
      "AI Coach",
      "Intégrations API",
      "Support 24/7",
      "SLA 99.9%",
      "Formation incluse"
    ],
    valueProps: [
      "Solution complète clé en main",
      "Tous les modules premium",
      "Économie de 60%+ vs modules séparés",
      "Support dédié"
    ],
    popular: false
  },
  {
    id: "ultimate",
    sku: "DRDO-PKG-ULT-005",
    name: "Ultimate",
    price: 5000000000,
    priceDisplay: "5G CAD",
    annualPrice: null,
    savings: "Accès source + White Label + Propriété exclusive",
    description: "Licence perpétuelle + code source + personnalisation illimitée",
    gradient: "from-yellow-500 to-orange-600",
    modules: "all",
    features: [
      "TOUS les modules Enterprise",
      "Code source complet (lecture + modification)",
      "Licence perpétuelle mondiale",
      "Personnalisation illimitée",
      "Rebranding autorisé",
      "Déploiement on-premise",
      "Environnements dev/staging/prod",
      "Support ingénieur dédié 24/7 à vie",
      "SLA 99.99%",
      "Consulting illimité inclus",
      "Développement custom à vie",
      "Propriété intellectuelle partagée",
      "Droit de revente accordé"
    ],
    valueProps: [
      "Contrôle total et perpétuel de la plateforme",
      "White Label + Revente autorisée",
      "Support ingénierie dédiée à vie",
      "ROI maximal pour grands groupes",
      "Prix fixe - Non négociable"
    ],
    popular: false,
    exclusive: true,
    fixed: true
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function Shop() {
  const [selectedTab, setSelectedTab] = useState("packages");

  const allModules = [...CORE_MODULES, ...SECONDARY_MODULES];

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
              <p className="text-purple-100 text-lg">Modules et forfaits pour libérer tout le potentiel de l'IA consciente</p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <Badge className="bg-white/20 text-white px-4 py-2">
                <Crown className="w-4 h-4 mr-2" />
                Essai gratuit 14 jours
              </Badge>
              <Badge className="bg-green-500 text-white px-4 py-2">
                <Check className="w-4 h-4 mr-2" />
                Sans engagement
              </Badge>
              <CryptographicSeal level="niv4" compact={true} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-8 bg-white shadow-md">
              <TabsTrigger value="packages" className="text-base">
                <Package className="w-4 h-4 mr-2" />
                Forfaits
              </TabsTrigger>
              <TabsTrigger value="core" className="text-base">
                <Star className="w-4 h-4 mr-2" />
                Modules Principaux
              </TabsTrigger>
              <TabsTrigger value="secondary" className="text-base">
                <Sparkles className="w-4 h-4 mr-2" />
                Modules Secondaires
              </TabsTrigger>
            </TabsList>

            {/* FORFAITS TAB */}
            <TabsContent value="packages" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Choisissez votre forfait</h2>
                <p className="text-slate-600">Économisez jusqu'à 60% avec nos bundles optimisés</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PACKAGES.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`p-6 h-full flex flex-col relative overflow-hidden ${
                      pkg.popular ? 'border-2 border-purple-500 shadow-2xl shadow-purple-500/20' : ''
                    } ${pkg.fixed ? 'border-4 border-orange-500 shadow-2xl shadow-orange-500/30' : ''}`}>
                      {pkg.popular && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          ⭐ Plus Populaire
                        </Badge>
                      )}
                      {pkg.exclusive && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-sm px-4 py-1">
                          👑 Exclusif - Prix Fixe
                        </Badge>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${pkg.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <Crown className="w-7 h-7 text-white" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          SKU: {pkg.sku}
                        </Badge>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                      <p className="text-sm text-slate-600 mb-4">{pkg.description}</p>

                      <div className="mb-4">
                        <div className="text-4xl font-bold text-slate-900 mb-1">
                          {pkg.priceDisplay || `${pkg.price} CAD/mois`}
                        </div>
                        {pkg.priceAnnual && (
                          <div className="text-sm text-slate-600">{pkg.priceAnnual} CAD/an (-17%)</div>
                        )}
                        {pkg.fixed && (
                          <div className="text-sm text-orange-600 font-semibold">Prix Fixe (Non négociable)</div>
                        )}
                        <Badge className={pkg.fixed ? "bg-orange-100 text-orange-800 mt-2" : "bg-green-100 text-green-800 mt-2"}>
                          {pkg.savings}
                        </Badge>
                      </div>

                      <div className="flex-1 space-y-2 mb-6">
                        {pkg.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 mb-4">
                        {pkg.valueProps.map((prop, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-purple-700 bg-purple-50 rounded-lg p-2">
                            <Zap className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            <span>{prop}</span>
                          </div>
                        ))}
                      </div>

                      <CryptographicSeal level="niv4" compact={true} />

                      <Button className={`w-full mt-4 bg-gradient-to-r ${pkg.gradient} text-white hover:opacity-90 h-12`}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {pkg.fixed ? 'Nous Contacter' : `Choisir ${pkg.name}`}
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* MODULES PRINCIPAUX TAB */}
            <TabsContent value="core" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Modules Principaux</h2>
                <p className="text-slate-600">Les capacités fondamentales de Druide Omega</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CORE_MODULES.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 h-full flex flex-col hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-200">
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

                        <div className="mb-4">
                          <div className="text-3xl font-bold text-slate-900 mb-1">{module.price} CAD/mois</div>
                          <div className="text-xs text-slate-500">{module.priceAnnual} CAD/an</div>
                        </div>

                        <div className="flex-1 space-y-2 mb-4">
                          <h4 className="text-sm font-semibold text-slate-900 mb-2">Fonctionnalités:</h4>
                          {module.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                              <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-slate-50 rounded-lg p-3 mb-4">
                          <h4 className="text-xs font-semibold text-slate-700 mb-2">Détails Techniques:</h4>
                          <div className="space-y-1">
                            {Object.entries(module.technicalDetails).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="text-slate-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                                <span className="text-slate-900 font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <CryptographicSeal level="niv4" compact={true} />

                        <Button className={`w-full mt-3 bg-gradient-to-r ${module.gradient} text-white hover:opacity-90`}>
                          Ajouter au panier
                        </Button>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* MODULES SECONDAIRES TAB */}
            <TabsContent value="secondary" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Modules Secondaires</h2>
                <p className="text-slate-600">Extensions et capacités spécialisées</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SECONDARY_MODULES.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 h-full flex flex-col hover:shadow-xl transition-all border-2 border-transparent hover:border-indigo-200">
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

                        <div className="mb-4">
                          <div className="text-3xl font-bold text-slate-900 mb-1">{module.price} CAD/mois</div>
                          <div className="text-xs text-slate-500">{module.priceAnnual} CAD/an</div>
                        </div>

                        <div className="flex-1 space-y-2 mb-4">
                          <h4 className="text-sm font-semibold text-slate-900 mb-2">Fonctionnalités:</h4>
                          {module.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                              <Check className="w-3 h-3 text-indigo-600 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-slate-50 rounded-lg p-3 mb-4">
                          <h4 className="text-xs font-semibold text-slate-700 mb-2">Détails Techniques:</h4>
                          <div className="space-y-1">
                            {Object.entries(module.technicalDetails).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="text-slate-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                                <span className="text-slate-900 font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <CryptographicSeal level="niv4" compact={true} />

                        <Button className={`w-full mt-3 bg-gradient-to-r ${module.gradient} text-white hover:opacity-90`}>
                          Ajouter au panier
                        </Button>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
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
                  Applicable à tous les forfaits et modules - Juridiquement contraignant
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-700 bg-white rounded-lg p-6 border border-red-200">
              <div className="font-bold text-red-700 text-base mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                CLAUSE DE RÉVOCATION GLOBALE
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-slate-900">1. DROIT DE RÉVOCATION UNILATÉRAL</p>
                <p>
                  AMG+A.L se réserve le droit exclusif et unilatéral de révoquer, suspendre ou annuler tout accès, 
                  licence ou abonnement à la plateforme Druide Omega, à tout moment et sans préavis, pour quelque 
                  raison que ce soit, y compris mais non limité à:
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
                  <li>Tout accès à la plateforme sera immédiatement suspendu</li>
                  <li>Aucun remboursement ne sera accordé pour la période non utilisée</li>
                  <li>Toutes les données et configurations pourront être supprimées après 30 jours</li>
                  <li>L'utilisateur devra cesser toute utilisation du code source (forfait Ultimate)</li>
                  <li>Les droits de revente et de rebranding seront immédiatement annulés</li>
                </ul>

                <p className="font-semibold text-slate-900 mt-4">3. POURSUITES LÉGALES</p>
                <p className="font-bold text-red-700">
                  Toute utilisation continue de la plateforme Druide Omega après révocation constitue une 
                  violation grave et donnera lieu à des poursuites judiciaires incluant:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Poursuites civiles pour violation de contrat</li>
                  <li>Réclamation de dommages et intérêts</li>
                  <li>Injonction immédiate de cessation d'utilisation</li>
                  <li>Poursuites criminelles en cas de fraude ou utilisation frauduleuse</li>
                  <li>Récupération des frais légaux et des coûts juridiques</li>
                </ul>

                <p className="font-semibold text-slate-900 mt-4">4. FORFAIT ULTIMATE - CLAUSE SPÉCIALE</p>
                <p>
                  Pour le forfait Ultimate (5 milliards CAD), malgré l'accès au code source:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>AMG+A.L conserve le droit de révocation même après paiement intégral</li>
                  <li>Le code source reste propriété intellectuelle d'AMG+A.L</li>
                  <li>L'utilisateur doit cesser toute utilisation et développement basé sur le code</li>
                  <li>Les déploiements on-premise devront être démantelés sous 48h</li>
                  <li>Violation = Poursuite pour 10 milliards CAD + dommages supplémentaires</li>
                </ul>

                <p className="font-semibold text-slate-900 mt-4">5. JURIDICTION ET LOI APPLICABLE</p>
                <p>
                  Cette licence est régie par les lois du Canada (Québec). Tout litige sera soumis à la 
                  juridiction exclusive des tribunaux de Montréal, Québec, Canada.
                </p>

                <p className="font-semibold text-slate-900 mt-4">6. ACCEPTATION</p>
                <p className="font-bold">
                  En souscrivant à tout forfait ou en utilisant la plateforme Druide Omega, vous acceptez 
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

          {/* Comparison Table */}
          <Card className="p-6 mt-12 bg-white">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Tableau Comparatif</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-4 px-3 text-slate-900">Module</th>
                    <th className="text-center py-4 px-3 text-slate-900">Découverte</th>
                    <th className="text-center py-4 px-3 text-slate-900">Essentials</th>
                    <th className="text-center py-4 px-3 text-slate-900">Professional</th>
                    <th className="text-center py-4 px-3 text-slate-900">Enterprise</th>
                    <th className="text-center py-4 px-3 text-slate-900">Ultimate</th>
                  </tr>
                </thead>
                <tbody>
                  {allModules.map((module) => (
                    <tr key={module.id} className="border-b border-slate-100">
                      <td className="py-3 px-3 font-medium text-slate-900">{module.name}</td>
                      <td className="text-center py-3 px-3">
                        {PACKAGES[0].modules.includes(module.id) ? 
                          <Check className="w-5 h-5 text-green-600 mx-auto" /> : 
                          <span className="text-slate-300">—</span>
                        }
                      </td>
                      <td className="text-center py-3 px-3">
                        {PACKAGES[1].modules.includes(module.id) ? 
                          <Check className="w-5 h-5 text-green-600 mx-auto" /> : 
                          <span className="text-slate-300">—</span>
                        }
                      </td>
                      <td className="text-center py-3 px-3">
                        {PACKAGES[2].modules.includes(module.id) ? 
                          <Check className="w-5 h-5 text-green-600 mx-auto" /> : 
                          <span className="text-slate-300">—</span>
                        }
                      </td>
                      <td className="text-center py-3 px-3">
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-3">
                        <Check className="w-5 h-5 text-purple-600 mx-auto" />
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-200 bg-slate-50">
                    <td className="py-4 px-3 font-bold text-slate-900">Prix</td>
                    <td className="text-center py-4 px-3 font-bold text-green-600">39 CAD/m</td>
                    <td className="text-center py-4 px-3 font-bold text-slate-900">149 CAD/m</td>
                    <td className="text-center py-4 px-3 font-bold text-purple-600">299 CAD/m</td>
                    <td className="text-center py-4 px-3 font-bold text-slate-900">599 CAD/m</td>
                    <td className="text-center py-4 px-3 font-bold text-orange-600">5G CAD</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* FAQ Section */}
          <Card className="p-8 mt-12 bg-gradient-to-br from-purple-50 to-pink-50">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Questions Fréquentes</h2>
            
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                {
                  q: "Puis-je changer de forfait à tout moment ?",
                  a: "Oui, vous pouvez passer à un forfait supérieur ou inférieur à tout moment. Les changements prennent effet immédiatement."
                },
                {
                  q: "Y a-t-il un essai gratuit ?",
                  a: "Tous les forfaits incluent 14 jours d'essai gratuit, sans engagement et sans carte de crédit requise."
                },
                {
                  q: "Que se passe-t-il avec mes données si j'annule ?",
                  a: "Vos données sont conservées pendant 90 jours après annulation. Vous pouvez les exporter à tout moment."
                },
                {
                  q: "Les modules sont-ils vendus séparément ?",
                  a: "Oui, vous pouvez acheter des modules individuels. Cependant, les forfaits offrent des économies substantielles (jusqu'à 60%)."
                },
                {
                  q: "Le forfait Ultimate est-il négociable ?",
                  a: "Non, le forfait Ultimate est fixé à 5 milliards CAD sans négociation possible. Il offre une licence perpétuelle et le code source complet."
                },
                {
                  q: "Qu'est-ce que le droit de révocation ?",
                  a: "AMG+A.L se réserve le droit de révoquer tout accès à la plateforme sans préavis. Toute utilisation après révocation expose à des poursuites légales."
                },
                {
                  q: "Qu'est-ce que le sceau cryptographique AMG+A.L ?",
                  a: "Chaque transaction est protégée par un sceau cryptographique de niveau 4 garantissant l'authenticité et la sécurité de votre achat."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-2">{faq.q}</h4>
                  <p className="text-sm text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}