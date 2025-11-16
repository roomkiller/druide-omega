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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import {
  BookOpen,
  FileText,
  Scale,
  ShoppingCart,
  Code,
  Users,
  Shield,
  Zap,
  Globe,
  Lock,
  FileCheck,
  BookMarked,
  Briefcase,
  Settings,
  HelpCircle,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Layers,
  Database,
  Brain
} from "lucide-react";

export default function Documentation() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("overview");

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
          status: "planned",
          languages: ["fr", "en"]
        },
        {
          id: "api-reference",
          icon: Code,
          title: language === 'en' ? "API Reference" : "Référence API",
          description: language === 'en'
            ? "Complete API documentation for developers"
            : "Documentation API complète pour développeurs",
          status: "planned",
          languages: ["fr", "en"]
        },
        {
          id: "consciousness-engine",
          icon: Brain,
          title: language === 'en' ? "Consciousness Engine" : "Moteur de Conscience",
          description: language === 'en'
            ? "How the 106-dimensional consciousness system works"
            : "Fonctionnement du système de conscience à 106 dimensions",
          status: "planned",
          languages: ["fr", "en"]
        },
        {
          id: "data-models",
          icon: Database,
          title: language === 'en' ? "Data Models" : "Modèles de Données",
          description: language === 'en'
            ? "Complete entity schemas and relationships"
            : "Schémas d'entités et relations complètes",
          status: "planned",
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
          status: "planned",
          languages: ["fr", "en", "es", "de", "zh"]
        },
        {
          id: "features",
          icon: Zap,
          title: language === 'en' ? "Features Overview" : "Aperçu des Fonctionnalités",
          description: language === 'en'
            ? "Detailed description of all AI capabilities"
            : "Description détaillée de toutes les capacités IA",
          status: "planned",
          languages: ["fr", "en", "es", "de", "zh"]
        },
        {
          id: "best-practices",
          icon: CheckCircle,
          title: language === 'en' ? "Best Practices" : "Meilleures Pratiques",
          description: language === 'en'
            ? "How to get the most out of Druide Omega"
            : "Comment tirer le meilleur parti de Druide Omega",
          status: "planned",
          languages: ["fr", "en"]
        },
        {
          id: "faq",
          icon: HelpCircle,
          title: language === 'en' ? "FAQ" : "Questions Fréquentes",
          description: language === 'en'
            ? "Frequently asked questions and answers"
            : "Questions fréquentes et réponses",
          status: "planned",
          languages: ["fr", "en", "es", "de", "zh"]
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
          status: "planned",
          languages: ["fr", "en", "es", "de", "zh"]
        },
        {
          id: "compliance",
          icon: FileCheck,
          title: language === 'en' ? "Regulatory Compliance" : "Conformité Réglementaire",
          description: language === 'en'
            ? "GDPR, CCPA, Loi 25 compliance details"
            : "Détails de conformité RGPD, CCPA, Loi 25",
          status: "planned",
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
          status: "planned",
          languages: ["fr", "en", "es", "de", "zh"]
        },
        {
          id: "business-case",
          icon: Briefcase,
          title: language === 'en' ? "Business Use Cases" : "Cas d'Usage Entreprise",
          description: language === 'en'
            ? "How businesses can leverage Druide Omega"
            : "Comment les entreprises peuvent utiliser Druide Omega",
          status: "planned",
          languages: ["fr", "en"]
        },
        {
          id: "partner-program",
          icon: Users,
          title: language === 'en' ? "Partner Program" : "Programme Partenaires",
          description: language === 'en'
            ? "Information for partners and resellers"
            : "Informations pour partenaires et revendeurs",
          status: "planned",
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
      window.location.href = createPageUrl(doc.url);
    }
  };

  const totalDocs = Object.values(DOCUMENTATION_SECTIONS).reduce((sum, section) => sum + section.docs.length, 0);
  const completedDocs = Object.values(DOCUMENTATION_SECTIONS).flatMap(s => s.docs).filter(d => d.status === "exists").length;
  const completionRate = Math.round((completedDocs / totalDocs) * 100);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
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
                className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40"
              >
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
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
                {completedDocs}/{totalDocs} {language === 'en' ? "docs" : "docs"}
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

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Overview Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                >
                  <Card 
                    className="p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-200"
                    onClick={() => setSelectedCategory(key)}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{section.title}</h3>
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

          {/* Selected Category Details */}
          {selectedCategory && DOCUMENTATION_SECTIONS[selectedCategory] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 sm:p-8 mb-8 bg-gradient-to-br from-white to-purple-50/30 border-purple-200">
                <div className="flex items-center gap-4 mb-6">
                  {React.createElement(DOCUMENTATION_SECTIONS[selectedCategory].icon, {
                    className: "w-8 h-8 sm:w-10 sm:h-10 text-purple-600"
                  })}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {DOCUMENTATION_SECTIONS[selectedCategory].title}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {DOCUMENTATION_SECTIONS[selectedCategory].docs.length} {language === 'en' ? "documents" : "documents"}
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
                          className={`p-4 sm:p-6 ${doc.status === "exists" ? "cursor-pointer hover:shadow-lg border-2 hover:border-purple-300" : "opacity-75"} transition-all`}
                          onClick={() => handleDocClick(doc)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <DocIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
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
                                  <ExternalLink className="w-3 h-3 text-purple-600 ml-auto" />
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

          {/* Documentation Roadmap */}
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BookMarked className="w-6 h-6 text-indigo-600" />
              {language === 'en' ? "Documentation Roadmap" : "Feuille de Route Documentation"}
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-indigo-200">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {language === 'en' ? "Phase 1: Legal Foundation (Completed)" : "Phase 1 : Fondation Légale (Complétée)"}
                  </h4>
                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                    <li>{language === 'en' ? "Terms of Service (FR, EN, ES)" : "Conditions d'utilisation (FR, EN, ES)"}</li>
                    <li>{language === 'en' ? "Privacy Policy (FR, EN, ES)" : "Politique de confidentialité (FR, EN, ES)"}</li>
                    <li>{language === 'en' ? "Legal Information (FR, EN)" : "Informations légales (FR, EN)"}</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-orange-200">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {language === 'en' ? "Phase 2: User Documentation (In Progress)" : "Phase 2 : Documentation Utilisateur (En Cours)"}
                  </h4>
                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                    <li>{language === 'en' ? "User Guide (5 languages)" : "Guide utilisateur (5 langues)"}</li>
                    <li>{language === 'en' ? "Features Overview" : "Aperçu des fonctionnalités"}</li>
                    <li>{language === 'en' ? "FAQ (5 languages)" : "FAQ (5 langues)"}</li>
                    <li>{language === 'en' ? "Best Practices" : "Meilleures pratiques"}</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {language === 'en' ? "Phase 3: Technical Documentation (Planned)" : "Phase 3 : Documentation Technique (Planifiée)"}
                  </h4>
                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                    <li>{language === 'en' ? "System Architecture" : "Architecture système"}</li>
                    <li>{language === 'en' ? "API Reference" : "Référence API"}</li>
                    <li>{language === 'en' ? "Consciousness Engine Details" : "Détails du moteur de conscience"}</li>
                    <li>{language === 'en' ? "Data Models" : "Modèles de données"}</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-amber-200">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {language === 'en' ? "Phase 4: Commercial & Ethics (Planned)" : "Phase 4 : Commercial & Éthique (Planifiée)"}
                  </h4>
                  <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                    <li>{language === 'en' ? "AI Ethics Charter" : "Charte éthique IA"}</li>
                    <li>{language === 'en' ? "Pricing & Licensing" : "Tarifs et licences"}</li>
                    <li>{language === 'en' ? "Business Use Cases" : "Cas d'usage entreprise"}</li>
                    <li>{language === 'en' ? "Partner Program" : "Programme partenaires"}</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Help Section */}
          <Card className="p-6 sm:p-8 mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
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
                    onClick={() => window.location.href = createPageUrl("Chat")}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {language === 'en' ? "Ask Druide Omega" : "Demander à Druide Omega"}
                  </Button>
                  <Button 
                    onClick={() => window.location.href = createPageUrl("Guide")}
                    variant="outline"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {language === 'en' ? "Quick Start Guide" : "Guide de Démarrage Rapide"}
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