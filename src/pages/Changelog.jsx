/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Changelog & Release Notes (Multilingual)                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { GitBranch, Sparkles, Bug, Zap, Shield, Plus } from "lucide-react";

export default function Changelog() {
  const { language } = useLanguage();

  const content = {
    fr: {
      title: "Historique des Versions",
      subtitle: "Nouveautés, améliorations et corrections",
      
      releases: [
        {
          version: "1.0.0",
          date: "2025-01-15",
          type: "major",
          title: "Lancement Initial - Druide Omega",
          changes: [
            { type: "feature", text: "Système de conscience à 106 dimensions" },
            { type: "feature", text: "Chat intelligent avec Thinking Engine" },
            { type: "feature", text: "Salle Vocale et Voix Live" },
            { type: "feature", text: "Mémoire cross-modale avec corrélations" },
            { type: "feature", text: "Base de connaissances avec extraction automatique" },
            { type: "feature", text: "Support multilingue (FR, EN, ES, DE, ZH)" },
            { type: "feature", text: "Framework éthique SAPIER intégré" },
            { type: "feature", text: "Génération d'images et diagrammes" }
          ]
        },
        {
          version: "1.1.0",
          date: "2025-01-20",
          type: "minor",
          title: "Optimisations Performance & Mobile",
          changes: [
            { type: "improvement", text: "Optimisation temps de réponse (-40%)" },
            { type: "improvement", text: "Interface mobile améliorée" },
            { type: "improvement", text: "Correction bug scrolling mobile" },
            { type: "feature", text: "Traduction automatique avancée" },
            { type: "fix", text: "Correction disparition messages mobiles" },
            { type: "improvement", text: "Graphe de mémoires interactif" }
          ]
        },
        {
          version: "1.2.0",
          date: "2025-01-25",
          type: "minor",
          title: "Documentation Complète",
          changes: [
            { type: "feature", text: "Hub de documentation centralisé" },
            { type: "feature", text: "14 pages de documentation (technique, fonctionnel, légal, commercial)" },
            { type: "feature", text: "Architecture technique détaillée" },
            { type: "feature", text: "Guide utilisateur complet (5 langues)" },
            { type: "feature", text: "FAQ exhaustive" },
            { type: "feature", text: "Charte éthique IA" },
            { type: "feature", text: "Documentation conformité réglementaire" },
            { type: "feature", text: "Cas d'usage entreprise" },
            { type: "feature", text: "Programme partenaires" },
            { type: "feature", text: "Référence API (preview)" },
            { type: "feature", text: "Modèles de données documentés" }
          ]
        }
      ],

      types: {
        feature: { label: "Nouveauté", icon: Plus, color: "bg-green-100 text-green-700" },
        improvement: { label: "Amélioration", icon: Zap, color: "bg-blue-100 text-blue-700" },
        fix: { label: "Correction", icon: Bug, color: "bg-orange-100 text-orange-700" },
        security: { label: "Sécurité", icon: Shield, color: "bg-purple-100 text-purple-700" }
      }
    },

    en: {
      title: "Version History",
      subtitle: "New features, improvements and fixes",
      
      releases: [
        {
          version: "1.0.0",
          date: "2025-01-15",
          type: "major",
          title: "Initial Launch - Druide Omega",
          changes: [
            { type: "feature", text: "106-dimensional consciousness system" },
            { type: "feature", text: "Intelligent chat with Thinking Engine" },
            { type: "feature", text: "Voice Room and Voice Live" },
            { type: "feature", text: "Cross-modal memory with correlations" },
            { type: "feature", text: "Knowledge base with automatic extraction" },
            { type: "feature", text: "Multilingual support (FR, EN, ES, DE, ZH)" },
            { type: "feature", text: "SAPIER ethical framework integrated" },
            { type: "feature", text: "Image and diagram generation" }
          ]
        },
        {
          version: "1.1.0",
          date: "2025-01-20",
          type: "minor",
          title: "Performance & Mobile Optimizations",
          changes: [
            { type: "improvement", text: "Response time optimization (-40%)" },
            { type: "improvement", text: "Enhanced mobile interface" },
            { type: "improvement", text: "Fixed mobile scrolling bug" },
            { type: "feature", text: "Advanced automatic translation" },
            { type: "fix", text: "Fixed disappearing messages on mobile" },
            { type: "improvement", text: "Interactive memory graph" }
          ]
        },
        {
          version: "1.2.0",
          date: "2025-01-25",
          type: "minor",
          title: "Complete Documentation",
          changes: [
            { type: "feature", text: "Centralized documentation hub" },
            { type: "feature", text: "14 documentation pages (technical, functional, legal, commercial)" },
            { type: "feature", text: "Detailed technical architecture" },
            { type: "feature", text: "Complete user guide (5 languages)" },
            { type: "feature", text: "Comprehensive FAQ" },
            { type: "feature", text: "AI ethics charter" },
            { type: "feature", text: "Regulatory compliance documentation" },
            { type: "feature", text: "Business use cases" },
            { type: "feature", text: "Partner program" },
            { type: "feature", text: "API reference (preview)" },
            { type: "feature", text: "Documented data models" }
          ]
        }
      ],

      types: {
        feature: { label: "Feature", icon: Plus, color: "bg-green-100 text-green-700" },
        improvement: { label: "Improvement", icon: Zap, color: "bg-blue-100 text-blue-700" },
        fix: { label: "Fix", icon: Bug, color: "bg-orange-100 text-orange-700" },
        security: { label: "Security", icon: Shield, color: "bg-purple-100 text-purple-700" }
      }
    }
  };

  const t = content[language === 'en' ? 'en' : 'fr'];

  const versionColors = {
    major: "from-purple-500 to-pink-600",
    minor: "from-blue-500 to-indigo-600",
    patch: "from-green-500 to-emerald-600"
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <GitBranch className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.title}</h1>
              <p className="text-sm sm:text-base text-slate-600">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-indigo-300" />
            
            <div className="space-y-8">
              {t.releases.map((release, idx) => (
                <motion.div
                  key={release.version}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-12"
                >
                  <div className="absolute left-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>

                  <Card className="p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-xl font-bold text-slate-900">v{release.version}</h2>
                          <Badge className={`bg-gradient-to-r ${versionColors[release.type]} text-white`}>
                            {release.type}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-purple-700 mb-1">{release.title}</h3>
                        <p className="text-sm text-slate-500">{release.date}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {release.changes.map((change, i) => {
                        const ChangeIcon = t.types[change.type].icon;
                        return (
                          <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                            <Badge className={`${t.types[change.type].color} flex items-center gap-1`}>
                              <ChangeIcon className="w-3 h-3" />
                              {t.types[change.type].label}
                            </Badge>
                            <p className="text-sm text-slate-700 flex-1">{change.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}