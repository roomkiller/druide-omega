/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Documentation Hub (Complete Resource Center)               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Conforme: Loi 25 (Québec), RGPD (UE), CCPA (USA)                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { navigateTo } from "@/lib/spaNavigate";
import {
  BookOpen,
  FileText,
  Scale,
  ShoppingCart,
  Code,
  Shield,
  Zap,
  Globe,
  Lock,
  FileCheck,
  BookMarked,
  Briefcase,
  Settings,
  HelpCircle,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Layers,
  Database,
  Brain,
  Target,
  Handshake,
  GitBranch,
  Book,
  PlayCircle,
  Award,
  Trophy,
  ArrowLeft,
  ChevronRight,
  Boxes
} from "lucide-react";

export default function Documentation() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("overview");
  const [selectedDoc, setSelectedDoc] = useState(null);

  const DOCUMENTATION_SECTIONS = {
    technical: {
      icon: Code,
      title: language === 'en' ? "Technical Documentation" : "Documentation Technique",
      color: "from-blue-500 to-indigo-600",
      docs: [
        {
          id: "architecture",
          icon: Layers,
          title: language === 'en' ? "System Architecture" : "Architecture Système",
          description: language === 'en'
            ? "Complete technical architecture, modules, and data flows"
            : "Architecture technique complète, modules et flux de données",
          status: "exists",
          url: "TechnicalArchitecture",
          languages: ["fr", "en"]
        },
        {
          id: "api-reference",
          icon: Code,
          title: language === 'en' ? "API Reference" : "Référence API",
          description: language === 'en'
            ? "Complete API documentation for developers"
            : "Documentation API complète pour développeurs",
          status: "exists",
          url: "APIReference",
          languages: ["fr", "en"]
        },
        {
          id: "data-models",
          icon: Database,
          title: language === 'en' ? "Data Models" : "Modèles de Données",
          description: language === 'en'
            ? "Complete entity schemas and relationships"
            : "Schémas d'entités et relations complètes",
          status: "exists",
          url: "DataModels",
          languages: ["fr", "en"]
        },
        {
          id: "consciousness-engine",
          icon: Brain,
          title: language === 'en' ? "Consciousness Engine" : "Moteur de Conscience",
          description: language === 'en'
            ? "How the 106-dimensional consciousness system works, with frontend-backend synchronization"
            : "Fonctionnement du système de conscience à 106 dimensions et synchronisation frontend-backend",
          status: "exists",
          url: "Consciousness",
          languages: ["fr", "en"]
        },
        {
          id: "application-extraction",
          icon: Boxes,
          title: language === 'en' ? "Application Extraction" : "Extraction Application",
          description: language === 'en'
            ? "Universal technical extraction: architecture, modules, flows, security, API, DevOps"
            : "Extraction technique universelle : architecture, modules, flux, sécurité, API, DevOps",
          status: "exists",
          url: "ApplicationExtraction",
          languages: ["fr", "en"]
        },
        {
          id: "druide-explained",
          icon: Brain,
          title: language === 'en' ? "Druide Omega Explained" : "Druide Omega Expliqué",
          description: language === 'en'
            ? "System embedded for LLMs: OpenRouter routing, 80+ backend functions, performance gains"
            : "Système embarqué pour LLMs : routing OpenRouter, 80+ fonctions backend, gains de performance",
          status: "exists",
          url: "DruideOmegaExplained",
          languages: ["fr", "en"]
        }
      ]
    },
    functional: {
      icon: Settings,
      title: language === 'en' ? "Functional Documentation" : "Documentation Fonctionnelle",
      color: "from-purple-500 to-pink-600",
      docs: [
        {
          id: "user-guide",
          icon: HelpCircle,
          title: language === 'en' ? "User Guide" : "Guide Utilisateur",
          description: language === 'en'
            ? "Complete guide for using all features"
            : "Guide complet d'utilisation de toutes les fonctionnalités",
          status: "exists",
          url: "UserGuide",
          languages: ["fr", "en", "es", "de", "zh"]
        },
        {
          id: "tutorials",
          icon: PlayCircle,
          title: language === 'en' ? "Interactive Tutorials" : "Tutoriels Interactifs",
          description: language === 'en'
            ? "Step-by-step guides for key features"
            : "Guides pas-à-pas pour les fonctionnalités principales",
          status: "exists",
          url: "Tutorials",
          languages: ["fr", "en"]
        },
        {
          id: "features",
          icon: Zap,
          title: language === 'en' ? "Features Overview" : "Aperçu des Fonctionnalités",
          description: language === 'en'
            ? "Detailed description of all AI capabilities (12 frontend modules, 80+ backend functions)"
            : "Description détaillée des capacités IA (12 modules frontend, 80+ fonctions backend)",
          status: "exists",
          url: "FeaturesOverview",
          languages: ["fr", "en", "es", "de", "zh"]
        },
        {
          id: "best-practices",
          icon: Target,
          title: language === 'en' ? "Best Practices" : "Meilleures Pratiques",
          description: language === 'en'
            ? "How to get the most out of Druide Omega"
            : "Comment tirer le meilleur parti de Druide Omega",
          status: "exists",
          url: "BestPractices",
          languages: ["fr", "en"]
        },
        {
          id: "glossary",
          icon: Book,
          title: language === 'en' ? "Technical Glossary" : "Glossaire Technique",
          description: language === 'en'
            ? "Definitions of key terms and concepts"
            : "Définitions des termes et concepts clés",
          status: "exists",
          url: "Glossary",
          languages: ["fr", "en"]
        },
        {
          id: "faq",
          icon: HelpCircle,
          title: language === 'en' ? "FAQ" : "Questions Fréquentes",
          description: language === 'en'
            ? "Frequently asked questions and answers"
            : "Questions fréquentes et réponses",
          status: "exists",
          url: "FAQ",
          languages: ["fr", "en", "es", "de", "zh"]
        }
      ]
    },
    testing: {
      icon: Award,
      title: language === 'en' ? "AI Testing & Performance" : "Tests et Performances IA",
      color: "from-green-500 to-emerald-600",
      docs: [
        {
          id: "ai-tests",
          icon: Trophy,
          title: language === 'en' ? "70 AI Performance Tests" : "70 Tests de Performance IA",
          description: language === 'en'
            ? "Complete results of 70 standard AI benchmarks with market comparison"
            : "Résultats complets des 70 tests standards avec comparaison marché",
          status: "exists",
          url: "AITests",
          languages: ["fr", "en"]
        }
      ]
    },
    legal: {
      icon: Scale,
      title: language === 'en' ? "Legal Documentation" : "Documentation Légale",
      color: "from-emerald-500 to-teal-600",
      docs: [
        {
          id: "terms",
          icon: FileCheck,
          title: language === 'en' ? "Terms of Service" : "Conditions d'Utilisation",
          description: language === 'en'
            ? "Complete terms and conditions"
            : "Conditions générales d'utilisation complètes",
          status: "exists",
          url: "Terms",
          languages: ["fr", "en", "es"]
        },
        {
          id: "privacy",
          icon: Lock,
          title: language === 'en' ? "Privacy Policy" : "Politique de Confidentialité",
          description: language === 'en'
            ? "How we protect and handle your data"
            : "Comment nous protégeons et traitons vos données",
          status: "exists",
          url: "Privacy",
          languages: ["fr", "en", "es"]
        },
        {
          id: "legal",
          icon: Scale,
          title: language === 'en' ? "Legal Information" : "Informations Légales",
          description: language === 'en'
            ? "Legal compliance and regulations"
            : "Conformité légale et réglementations",
          status: "exists",
          url: "Legal",
          languages: ["fr", "en"]
        },
        {
          id: "ai-ethics",
          icon: Shield,
          title: language === 'en' ? "AI Ethics Charter" : "Charte Éthique IA",
          description: language === 'en'
            ? "Ethical principles governing Druide Omega"
            : "Principes éthiques régissant Druide Omega",
          status: "exists",
          url: "AIEthicsCharter",
          languages: ["fr", "en", "es", "de", "zh"]
        },
        {
          id: "compliance",
          icon: FileCheck,
          title: language === 'en' ? "Regulatory Compliance" : "Conformité Réglementaire",
          description: language === 'en'
            ? "GDPR, CCPA, Bill 25 compliance details"
            : "Détails de conformité RGPD, CCPA, Loi 25",
          status: "exists",
          url: "RegulatoryCompliance",
          languages: ["fr", "en"]
        }
      ]
    },
    commercial: {
      icon: Briefcase,
      title: language === 'en' ? "Commercial Documentation" : "Documentation Commerciale",
      color: "from-orange-500 to-amber-600",
      docs: [
        {
          id: "pricing",
          icon: ShoppingCart,
          title: language === 'en' ? "Pricing & Licensing" : "Tarifs & Licences",
          description: language === 'en'
            ? "Detailed pricing for all modules and packages"
            : "Tarification détaillée pour tous les modules et forfaits",
          status: "exists",
          url: "Pricing",
          languages: ["fr", "en", "es", "de", "zh"]
        },
        {
          id: "business-case",
          icon: Briefcase,
          title: language === 'en' ? "Business Use Cases" : "Cas d'Usage Entreprise",
          description: language === 'en'
            ? "How businesses can leverage Druide Omega"
            : "Comment les entreprises peuvent utiliser Druide Omega",
          status: "exists",
          url: "BusinessUseCases",
          languages: ["fr", "en"]
        },
        {
          id: "partner-program",
          icon: Handshake,
          title: language === 'en' ? "Partner Program" : "Programme Partenaires",
          description: language === 'en'
            ? "Information for partners and resellers"
            : "Informations pour partenaires et revendeurs",
          status: "exists",
          url: "PartnerProgram",
          languages: ["fr", "en"]
        }
      ]
    },
    resources: {
      icon: GitBranch,
      title: language === 'en' ? "Additional Resources" : "Ressources Additionnelles",
      color: "from-pink-500 to-rose-600",
      docs: [
        {
          id: "changelog",
          icon: GitBranch,
          title: language === 'en' ? "Changelog" : "Historique des Versions",
          description: language === 'en'
            ? "Version history with new features and improvements"
            : "Historique des versions avec nouvelles fonctionnalités",
          status: "exists",
          url: "Changelog",
          languages: ["fr", "en"]
        }
      ]
    },
    acquisition: {
      icon: Briefcase,
      title: language === 'en' ? "Acquisition Documentation" : "Documentation Acquisition",
      color: "from-teal-500 to-cyan-600",
      docs: [
        {
          id: "project-overview",
          icon: Brain,
          title: language === 'en' ? "Complete Project Overview" : "Présentation Complète du Projet",
          description: language === 'en'
            ? "Vision, capabilities, innovation, and funding requirements explained"
            : "Vision, capacités, innovation et besoins de financement expliqués",
          status: "exists",
          url: "ProjectOverview",
          languages: ["fr", "en"]
        },
        {
          id: "modules-performance",
          icon: Award,
          title: language === 'en' ? "Modules & Performance Analysis" : "Analyse Modules & Performances",
          description: language === 'en'
            ? "Complete technical documentation with estimated 20-48% performance gains explained"
            : "Documentation technique complète avec gains estimés de 20-48% expliqués",
          status: "exists",
          url: "DocumentationSynthesis",
          languages: ["fr", "en"]
        },
        {
          id: "acquisition-approach",
          icon: Handshake,
          title: language === 'en' ? "Quebec Acquisition Approach" : "Dossier d'Approche Québec",
          description: language === 'en'
            ? "Strategic approach for Quebec tech companies and investors"
            : "Approche stratégique pour entreprises tech et investisseurs québécois",
          status: "exists",
          url: "DocumentationSynthesis",
          languages: ["fr", "en"]
        },
        {
          id: "pitch-deck",
          icon: Target,
          title: language === 'en' ? "Investment Pitch Deck" : "Pitch Deck Investisseurs",
          description: language === 'en'
            ? "Complete pitch deck with market analysis and competitive advantages"
            : "Pitch deck complet avec analyse de marché et avantages concurrentiels",
          status: "exists",
          url: "DocumentationSynthesis",
          languages: ["fr", "en"]
        }
      ]
    }
  };

  const STATUS_CONFIG = {
    exists: {
      label: language === 'en' ? "Available" : "Disponible",
      color: "bg-green-100 text-green-700 border-green-300",
      icon: CheckCircle
    },
    planned: {
      label: language === 'en' ? "Planned" : "Planifié",
      color: "bg-orange-100 text-orange-700 border-orange-300",
      icon: AlertCircle
    },
    draft: {
      label: language === 'en' ? "Draft" : "Brouillon",
      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
      icon: Info
    }
  };

  const handleDocClick = (doc) => {
    if (doc.status === "exists" && doc.url) {
      setSelectedDoc(doc);
    }
  };

  const handleBack = () => {
    setSelectedDoc(null);
  };

  const totalDocs = Object.values(DOCUMENTATION_SECTIONS).reduce((sum, section) => sum + section.docs.length, 0);
  const completedDocs = Object.values(DOCUMENTATION_SECTIONS).flatMap(s => s.docs).filter(d => d.status === "exists").length;
  const completionRate = Math.round((completedDocs / totalDocs) * 100);

  // Si un document est sélectionné, afficher son contenu
  if (selectedDoc) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <Button
              onClick={handleBack}
              variant="ghost"
              className="min-h-[44px] mb-4 text-purple-600 hover:text-purple-800 touch-target"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Back to documentation' : 'Retour à la documentation'}
            </Button>
            <div className="flex items-center gap-4">
              <div className="min-w-[64px] min-h-[64px] w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                {React.createElement(selectedDoc.icon, {
                  className: "w-8 h-8 text-white"
                })}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {selectedDoc.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                  {selectedDoc.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <Card className="p-8 bg-white shadow-lg border border-slate-200">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 mb-4">
                  {language === 'en'
                    ? `This document is available on a dedicated page. Click the button below to access the full content.`
                    : `Ce document est disponible sur une page dédiée. Cliquez sur le bouton ci-dessous pour accéder au contenu complet.`
                  }
                </p>
                <Button
                  onClick={() => window.location.href = createPageUrl(selectedDoc.url)}
                  className="min-h-[48px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 touch-target"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Open full document' : 'Ouvrir le document complet'}
                </Button>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 sm:py-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="min-w-[64px] min-h-[64px] w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40"
              >
                <BookOpen className="w-8 h-8 text-white" />
              </motion.div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {language === 'en' ? "Documentation" : "Documentation"}
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                  {language === 'en'
                    ? "Complete resource center for Druide Omega"
                    : "Centre de ressources complet pour Druide Omega"
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-300 px-3 py-1">
              {completedDocs}/{totalDocs} {language === 'en' ? "docs" : "documents"}
              </Badge>
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300 px-3 py-1">
                {completionRate}%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/60 backdrop-blur-sm px-4 sm:px-6 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <p className="text-xs sm:text-sm font-medium text-slate-700">
              {language === 'en' ? "Documentation Completion" : "Progression Documentation"}
            </p>
            <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"
              />
            </div>
            <span className="text-xs sm:text-sm font-bold text-purple-600">{completionRate}%</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {Object.entries(DOCUMENTATION_SECTIONS).map(([key, section], idx) => {
              const Icon = section.icon;
              const sectionDocs = section.docs.length;
              const completedSectionDocs = section.docs.filter(d => d.status === "exists").length;
              const sectionRate = Math.round((completedSectionDocs / sectionDocs) * 100);

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-6 cursor-pointer hover:shadow-xl transition-all border-2 min-h-[160px] touch-target ${
                      selectedCategory === key ? 'border-purple-400 bg-purple-50/50' : 'border-transparent hover:border-purple-200'
                    }`}
                    onClick={() => setSelectedCategory(key)}
                  >
                    <div className={`min-w-[48px] min-h-[48px] w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{section.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {completedSectionDocs}/{sectionDocs}
                      </Badge>
                      <span className="text-xs text-slate-500">{sectionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${section.color}`}
                        style={{ width: `${sectionRate}%` }}
                      />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Selected Category Documents */}
          {selectedCategory && DOCUMENTATION_SECTIONS[selectedCategory] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-8 mb-8 bg-gradient-to-br from-white to-purple-50/30 border-purple-200">
                <div className="flex items-center gap-4 mb-6">
                  {React.createElement(DOCUMENTATION_SECTIONS[selectedCategory].icon, {
                    className: "w-8 h-8 sm:w-10 sm:h-10 text-purple-600"
                  })}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {DOCUMENTATION_SECTIONS[selectedCategory].title}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {DOCUMENTATION_SECTIONS[selectedCategory].docs.length} {language === 'en' ? "documents" : "documents disponibles"}
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  {DOCUMENTATION_SECTIONS[selectedCategory].docs.map((doc, idx) => {
                    const DocIcon = doc.icon;
                    const StatusIcon = STATUS_CONFIG[doc.status].icon;

                    return (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: doc.status === "exists" ? 1.01 : 1 }}
                      >
                        <Card
                          className={`p-6 ${doc.status === "exists" ? "cursor-pointer hover:shadow-lg border-2 hover:border-purple-300 touch-target" : "opacity-75"} transition-all`}
                          onClick={() => handleDocClick(doc)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="min-w-[48px] min-h-[48px] w-12 h-12 bg-gradient-to-br from-slate-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <DocIcon className="w-6 h-6 text-purple-600" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                                  {doc.title}
                                </h3>
                                <Badge className={`${STATUS_CONFIG[doc.status].color} text-xs flex-shrink-0`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {STATUS_CONFIG[doc.status].label}
                                </Badge>
                              </div>

                              <p className="text-sm text-slate-600 mb-3">{doc.description}</p>

                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-slate-500">
                                  {language === 'en' ? "Available in:" : "Disponible en :"}
                                </span>
                                {doc.languages.map(lang => (
                                  <Badge key={lang} variant="outline" className="text-xs">
                                    {lang.toUpperCase()}
                                  </Badge>
                                ))}

                                {doc.status === "exists" && (
                                  <ChevronRight className="w-4 h-4 text-purple-600 ml-auto" />
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          <Card className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookMarked className="w-6 h-6 text-indigo-600" />
              {language === 'en' ? "Documentation Complete" : "Documentation Complète"}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">
                    {language === 'en' ? "Available Now" : "Disponible Maintenant"}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  {completedDocs} {language === 'en' ? "documents ready" : "documents prêts"}
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• {language === 'en' ? "All legal documents" : "Tous les documents légaux"}</li>
                  <li>• {language === 'en' ? "User guides & tutorials" : "Guides utilisateurs & tutoriels"}</li>
                  <li>• {language === 'en' ? "Technical documentation" : "Documentation technique"}</li>
                  <li>• {language === 'en' ? "AI performance tests" : "Tests de performance IA"}</li>
                  <li>• {language === 'en' ? "Commercial information" : "Informations commerciales"}</li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">
                    {language === 'en' ? "5 Languages" : "5 Langues"}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  {language === 'en' ? "Multi-language support" : "Support multilingue"}
                </p>
                <div className="flex flex-wrap gap-1">
                  {["FR", "EN", "ES", "DE", "ZH"].map(lang => (
                    <Badge key={lang} className="text-xs bg-purple-100 text-purple-700">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="min-w-[48px] min-h-[48px] w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {language === 'en' ? "Need Help?" : "Besoin d'aide ?"}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {language === 'en'
                    ? "Can't find what you're looking for? Contact our support team or explore the application to discover all features."
                    : "Vous ne trouvez pas ce que vous cherchez ? Contactez notre équipe de support ou explorez l'application pour découvrir toutes les fonctionnalités."
                  }
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => navigateTo("Chat")}
                    className="min-h-[44px] bg-purple-600 hover:bg-purple-700 touch-target"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {language === 'en' ? "Ask Druide Omega" : "Demander à Druide Omega"}
                  </Button>
                  <Button
                    onClick={() => navigateTo("UserGuide")}
                    variant="outline"
                    className="min-h-[44px] touch-target"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {language === 'en' ? "Quick Start Guide" : "Guide de Démarrage"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}