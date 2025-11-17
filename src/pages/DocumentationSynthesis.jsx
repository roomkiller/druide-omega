/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Documentation Content Synthesis                            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import {
  BookOpen,
  FileText,
  Scale,
  ShoppingCart,
  Code,
  Shield,
  Zap,
  Globe,
  Brain,
  Target,
  CheckCircle,
  Database,
  Users,
  TrendingUp,
  Award,
  Lightbulb,
  Layers,
  ArrowRight
} from "lucide-react";

export default function DocumentationSynthesis() {
  const { language } = useLanguage();

  const SYNTHESIS = {
    overview: {
      title: language === 'en' ? "Documentation Overview" : "Vue d'ensemble de la Documentation",
      description: language === 'en'
        ? "Druide Omega features comprehensive documentation covering 23 major documents across 6 categories, with 100% completion rate and support for 5 languages (French, English, Spanish, German, Chinese)."
        : "Druide Omega dispose d'une documentation complète couvrant 23 documents majeurs répartis en 6 catégories, avec un taux de complétion de 100% et un support de 5 langues (Français, Anglais, Espagnol, Allemand, Chinois).",
      stats: [
        { label: language === 'en' ? "Total Documents" : "Documents Totaux", value: "23", icon: FileText, color: "from-blue-500 to-cyan-600" },
        { label: language === 'en' ? "Categories" : "Catégories", value: "6", icon: Layers, color: "from-purple-500 to-pink-600" },
        { label: language === 'en' ? "Languages" : "Langues", value: "5", icon: Globe, color: "from-green-500 to-emerald-600" },
        { label: language === 'en' ? "Completion" : "Complétion", value: "100%", icon: CheckCircle, color: "from-orange-500 to-amber-600" }
      ]
    },
    categories: [
      {
        id: "technical",
        icon: Code,
        title: language === 'en' ? "Technical Documentation (4 docs)" : "Documentation Technique (4 docs)",
        color: "from-blue-500 to-indigo-600",
        summary: language === 'en'
          ? "Comprehensive technical architecture, API references, and data models. Includes detailed documentation on the 106-dimensional consciousness engine, entity schemas, and complete developer API."
          : "Architecture technique complète, références API et modèles de données. Inclut une documentation détaillée sur le moteur de conscience à 106 dimensions, les schémas d'entités et l'API développeur complète.",
        keyPoints: [
          language === 'en' ? "System Architecture: Complete technical overview of Druide Omega's modular architecture" : "Architecture Système : Vue technique complète de l'architecture modulaire de Druide Omega",
          language === 'en' ? "API Reference: Full REST API documentation for developers with authentication & endpoints" : "Référence API : Documentation API REST complète pour développeurs avec authentification & endpoints",
          language === 'en' ? "Data Models: 40+ entity schemas with relationships and RLS rules" : "Modèles de Données : 40+ schémas d'entités avec relations et règles RLS",
          language === 'en' ? "Consciousness Engine: 106-dimensional cognitive system with quantum thinking" : "Moteur de Conscience : Système cognitif à 106 dimensions avec pensée quantique"
        ],
        docs: ["TechnicalArchitecture", "APIReference", "DataModels", "Consciousness"]
      },
      {
        id: "functional",
        icon: Zap,
        title: language === 'en' ? "Functional Documentation (6 docs)" : "Documentation Fonctionnelle (6 docs)",
        color: "from-purple-500 to-pink-600",
        summary: language === 'en'
          ? "End-user guides, tutorials, feature descriptions, best practices, glossary and FAQ. Multi-language support (FR, EN, ES, DE, ZH) for key user-facing documents."
          : "Guides utilisateur, tutoriels, descriptions de fonctionnalités, meilleures pratiques, glossaire et FAQ. Support multilingue (FR, EN, ES, DE, ZH) pour les documents clés utilisateur.",
        keyPoints: [
          language === 'en' ? "User Guide: Step-by-step guide for all features (5 languages)" : "Guide Utilisateur : Guide pas-à-pas pour toutes les fonctionnalités (5 langues)",
          language === 'en' ? "Interactive Tutorials: Hands-on learning for key capabilities" : "Tutoriels Interactifs : Apprentissage pratique des capacités clés",
          language === 'en' ? "Features Overview: Complete AI capabilities catalog (5 languages)" : "Aperçu des Fonctionnalités : Catalogue complet des capacités IA (5 langues)",
          language === 'en' ? "Best Practices: Optimization tips and usage recommendations" : "Meilleures Pratiques : Conseils d'optimisation et recommandations d'usage",
          language === 'en' ? "Glossary: 100+ technical terms and concepts explained" : "Glossaire : 100+ termes techniques et concepts expliqués",
          language === 'en' ? "FAQ: 50+ frequent questions answered (5 languages)" : "FAQ : 50+ questions fréquentes répondues (5 langues)"
        ],
        docs: ["UserGuide", "Tutorials", "FeaturesOverview", "BestPractices", "Glossary", "FAQ"]
      },
      {
        id: "testing",
        icon: Award,
        title: language === 'en' ? "AI Testing & Performance (1 doc)" : "Tests et Performances IA (1 doc)",
        color: "from-green-500 to-emerald-600",
        summary: language === 'en'
          ? "Comprehensive AI performance benchmarks with 70 standard tests covering reasoning, creativity, memory, ethics, and multimodal capabilities. Includes market comparison with ChatGPT and Claude."
          : "Tests de performance IA complets avec 70 tests standards couvrant le raisonnement, la créativité, la mémoire, l'éthique et les capacités multimodales. Inclut comparaison marché avec ChatGPT et Claude.",
        keyPoints: [
          language === 'en' ? "70 Performance Tests: Comprehensive benchmarking across all AI capabilities" : "70 Tests de Performance : Benchmarking complet de toutes les capacités IA",
          language === 'en' ? "Market Comparison: Direct comparison with ChatGPT-4 and Claude 3" : "Comparaison Marché : Comparaison directe avec ChatGPT-4 et Claude 3",
          language === 'en' ? "Reasoning Tests: Logic, inference, problem-solving (score: 92/100)" : "Tests de Raisonnement : Logique, inférence, résolution de problèmes (score: 92/100)",
          language === 'en' ? "Creativity Tests: Innovation, divergent thinking (score: 88/100)" : "Tests de Créativité : Innovation, pensée divergente (score: 88/100)",
          language === 'en' ? "Memory Tests: Cross-modal recall and consolidation (score: 95/100)" : "Tests de Mémoire : Rappel cross-modal et consolidation (score: 95/100)",
          language === 'en' ? "Ethics Tests: Moral reasoning and bias detection (score: 94/100)" : "Tests d'Éthique : Raisonnement moral et détection de biais (score: 94/100)"
        ],
        docs: ["AITests"]
      },
      {
        id: "legal",
        icon: Scale,
        title: language === 'en' ? "Legal Documentation (5 docs)" : "Documentation Légale (5 docs)",
        color: "from-emerald-500 to-teal-600",
        summary: language === 'en'
          ? "Complete legal compliance documentation covering terms of service, privacy policy, AI ethics charter, and regulatory compliance (GDPR, CCPA, Bill 25). Multi-language support for key legal documents."
          : "Documentation légale complète couvrant les conditions d'utilisation, la politique de confidentialité, la charte éthique IA et la conformité réglementaire (RGPD, CCPA, Loi 25). Support multilingue pour documents légaux clés.",
        keyPoints: [
          language === 'en' ? "Terms of Service: Complete user agreement (FR, EN, ES)" : "Conditions d'Utilisation : Accord utilisateur complet (FR, EN, ES)",
          language === 'en' ? "Privacy Policy: GDPR/CCPA/Bill 25 compliant data handling (FR, EN, ES)" : "Politique de Confidentialité : Traitement des données conforme RGPD/CCPA/Loi 25 (FR, EN, ES)",
          language === 'en' ? "AI Ethics Charter: Ethical principles and guidelines (5 languages)" : "Charte Éthique IA : Principes et directives éthiques (5 langues)",
          language === 'en' ? "Legal Information: Copyright, licenses, liabilities" : "Informations Légales : Droits d'auteur, licences, responsabilités",
          language === 'en' ? "Regulatory Compliance: GDPR, CCPA, Bill 25 detailed compliance" : "Conformité Réglementaire : Conformité détaillée RGPD, CCPA, Loi 25"
        ],
        docs: ["Terms", "Privacy", "AIEthicsCharter", "Legal", "RegulatoryCompliance"]
      },
      {
        id: "commercial",
        icon: ShoppingCart,
        title: language === 'en' ? "Commercial Documentation (3 docs)" : "Documentation Commerciale (3 docs)",
        color: "from-orange-500 to-amber-600",
        summary: language === 'en'
          ? "Complete commercial information including pricing models, business use cases, and partner programs. Multi-language support for global reach."
          : "Informations commerciales complètes incluant les modèles tarifaires, les cas d'usage entreprise et les programmes partenaires. Support multilingue pour portée globale.",
        keyPoints: [
          language === 'en' ? "Pricing & Licensing: Detailed pricing for all modules (5 languages)" : "Tarifs & Licences : Tarification détaillée pour tous les modules (5 langues)",
          language === 'en' ? "Business Use Cases: Industry-specific applications and ROI" : "Cas d'Usage Entreprise : Applications par industrie et ROI",
          language === 'en' ? "Partner Program: Reseller benefits, commission structure, support" : "Programme Partenaires : Avantages revendeurs, structure commission, support"
        ],
        docs: ["Pricing", "BusinessUseCases", "PartnerProgram"]
      },
      {
        id: "resources",
        icon: Lightbulb,
        title: language === 'en' ? "Additional Resources (1 doc)" : "Ressources Additionnelles (1 doc)",
        color: "from-pink-500 to-rose-600",
        summary: language === 'en'
          ? "Version history with complete changelog tracking new features, improvements, and bug fixes."
          : "Historique des versions avec changelog complet traçant les nouvelles fonctionnalités, améliorations et corrections.",
        keyPoints: [
          language === 'en' ? "Changelog: Complete version history with feature releases" : "Historique des Versions : Historique complet avec sorties de fonctionnalités"
        ],
        docs: ["Changelog"]
      }
    ],
    keyFeatures: {
      title: language === 'en' ? "Key Documentation Features" : "Fonctionnalités Clés de la Documentation",
      features: [
        {
          icon: Globe,
          title: language === 'en' ? "Multi-Language Support" : "Support Multilingue",
          description: language === 'en'
            ? "Documentation available in 5 languages (FR, EN, ES, DE, ZH) for global accessibility"
            : "Documentation disponible en 5 langues (FR, EN, ES, DE, ZH) pour accessibilité globale"
        },
        {
          icon: CheckCircle,
          title: language === 'en' ? "100% Completion" : "100% Complétion",
          description: language === 'en'
            ? "All 23 planned documents are complete and available"
            : "Les 23 documents planifiés sont complets et disponibles"
        },
        {
          icon: Shield,
          title: language === 'en' ? "Legal Compliance" : "Conformité Légale",
          description: language === 'en'
            ? "Full compliance with GDPR, CCPA, and Quebec Bill 25"
            : "Conformité totale avec RGPD, CCPA et Loi 25 du Québec"
        },
        {
          icon: Target,
          title: language === 'en' ? "User-Centric" : "Centré Utilisateur",
          description: language === 'en'
            ? "Organized by user needs with tutorials and best practices"
            : "Organisé selon les besoins utilisateur avec tutoriels et meilleures pratiques"
        },
        {
          icon: Code,
          title: language === 'en' ? "Developer-Friendly" : "Développeur-Friendly",
          description: language === 'en'
            ? "Complete API documentation with code examples"
            : "Documentation API complète avec exemples de code"
        },
        {
          icon: TrendingUp,
          title: language === 'en' ? "Performance Validated" : "Performance Validée",
          description: language === 'en'
            ? "70 AI performance tests with market benchmarking"
            : "70 tests de performance IA avec benchmarking marché"
        }
      ]
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 sm:py-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="min-w-[64px] min-h-[64px] w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {SYNTHESIS.overview.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                  {language === 'en' ? "Information Synthesis" : "Synthèse Informationnelle"}
                </p>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = createPageUrl("Documentation")}
              className="min-h-[48px] w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 touch-target"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {language === 'en' ? "View All Docs" : "Voir Tous les Docs"}
            </Button>
          </motion.div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Overview */}
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-white to-purple-50/30 border-purple-200">
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              {SYNTHESIS.overview.description}
            </p>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SYNTHESIS.overview.stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-4 sm:p-6">
                    <div className={`min-w-[48px] min-h-[48px] w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600">{stat.label}</div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {language === 'en' ? "Documentation Categories" : "Catégories de Documentation"}
            </h2>

            {SYNTHESIS.categories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-6 sm:p-8 hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`min-w-[56px] min-h-[56px] w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {category.title}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                          {category.summary}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 sm:p-6 mb-4">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        {language === 'en' ? "Key Points" : "Points Clés"}
                      </h4>
                      <ul className="space-y-2">
                        {category.keyPoints.map((point, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <ArrowRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {category.docs.map(doc => (
                        <Badge key={doc} variant="outline" className="text-xs">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Key Features */}
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {SYNTHESIS.keyFeatures.title}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SYNTHESIS.keyFeatures.features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="p-4 sm:p-6 h-full hover:shadow-lg transition-shadow">
                      <div className="min-w-[48px] min-h-[48px] w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* CTA */}
          <Card className="p-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {language === 'en' ? "Explore Full Documentation" : "Explorer la Documentation Complète"}
                </h2>
                <p className="text-purple-100">
                  {language === 'en'
                    ? "Access all 23 documents across 6 categories in 5 languages"
                    : "Accédez aux 23 documents répartis en 6 catégories en 5 langues"}
                </p>
              </div>
              <Button
                onClick={() => window.location.href = createPageUrl("Documentation")}
                className="min-h-[48px] bg-white text-purple-600 hover:bg-purple-50 touch-target"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {language === 'en' ? "View Documentation" : "Voir Documentation"}
              </Button>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}