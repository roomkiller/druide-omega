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
  Plug,
  GraduationCap,
  Check,
  Star,
  Sparkles,
  AlertTriangle,
  FileText
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
    price: 250000000000,
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
    price: 79,
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
    price: 69,
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
    price: 89,
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
    price: 59,
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
    price: 49,
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
    price: 39,
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
    price: 49,
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
    price: 59,
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
    price: 29,
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
    price: 39,
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
    price: 49,
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
    price: 69,
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
    price: 39,
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
    price: 49,
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
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function Shop() {
  const [selectedTab, setSelectedTab] = useState("core");

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

      {/* Content */}
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
            </TabsList>

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
                          <div className="text-3xl font-bold text-slate-900 mb-1">
                            {module.priceDisplay}
                          </div>
                          {module.priceAnnual && (
                            <div className="text-xs text-slate-500">{module.priceAnnual} CAD/an</div>
                          )}
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
                          Acheter
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
                          <div className="text-3xl font-bold text-slate-900 mb-1">
                            {module.priceDisplay}
                          </div>
                          {module.priceAnnual && (
                            <div className="text-xs text-slate-500">{module.priceAnnual} CAD/an</div>
                          )}
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
                          Acheter
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
                  Applicable à tous les modules principaux et modules secondaires - Juridiquement contraignant
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-700 bg-white rounded-lg p-6 border border-red-200">
              <div className="font-bold text-red-700 text-base mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                CLAUSE DE RÉVOCATION GLOBALE
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-slate-900">1. DROIT DE RÉVOCATION UNILATÉRAL (Modules Principaux et Modules Secondaires)</p>
                <p>
                  AMG+A.L se réserve le droit exclusif et unilatéral de révoquer, suspendre ou annuler tout accès, 
                  licence ou abonnement aux <strong>modules principaux</strong> et aux <strong>modules secondaires</strong> de la plateforme Druide Omega, 
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
                  <li>Tout accès aux modules payants (principaux et secondaires) sera immédiatement suspendu</li>
                  <li>Aucun remboursement ne sera accordé pour la période non utilisée</li>
                  <li>Toutes les données et configurations pourront être supprimées après 30 jours</li>
                  <li>L'utilisateur devra cesser toute utilisation des modules achetés</li>
                </ul>

                <p className="font-semibold text-slate-900 mt-4">3. POURSUITES LÉGALES</p>
                <p className="font-bold text-red-700">
                  Toute utilisation continue de modules Druide Omega (principaux ou secondaires) après révocation constitue une 
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
    </div>
  );
}