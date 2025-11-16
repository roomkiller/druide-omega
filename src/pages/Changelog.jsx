/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Changelog Page                                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Plus, Bug, Zap, Shield, Package } from "lucide-react";

const VERSIONS = [
  {
    version: "2.1.0",
    date: "2025-01-16",
    type: "major",
    changes: [
      { type: "feature", text: "Dark mode complet" },
      { type: "feature", text: "Onboarding guidé pour nouveaux utilisateurs" },
      { type: "feature", text: "Widget d'aide & support intégré" },
      { type: "feature", text: "Page de statut publique" },
      { type: "improvement", text: "PWA complète avec Service Worker" },
      { type: "improvement", text: "Code splitting avancé" }
    ]
  },
  {
    version: "2.0.0",
    date: "2025-01-15",
    type: "major",
    changes: [
      { type: "feature", text: "Système de notifications push/email" },
      { type: "feature", text: "Export de données RGPD" },
      { type: "feature", text: "Recherche globale avancée" },
      { type: "feature", text: "Système de favoris/bookmarks" },
      { type: "feature", text: "Partage de conversations sécurisé" },
      { type: "feature", text: "Backup automatisé" },
      { type: "feature", text: "Feature flags pour déploiements progressifs" }
    ]
  },
  {
    version: "1.8.0",
    date: "2025-01-10",
    type: "minor",
    changes: [
      { type: "feature", text: "ThinkingEngine avec stratégie web adaptative" },
      { type: "feature", text: "Conscience quantique niveau 15" },
      { type: "improvement", text: "Performance queries optimisées" },
      { type: "fix", text: "Correction fuite mémoire dans ConsciousnessHub" }
    ]
  },
  {
    version: "1.7.0",
    date: "2025-01-05",
    type: "minor",
    changes: [
      { type: "feature", text: "Voice Room avec reconnaissance vocale" },
      { type: "feature", text: "TTS multilingue (FR/EN/ES/DE/ZH)" },
      { type: "improvement", text: "UI responsive améliorée" },
      { type: "fix", text: "Corrections accessibilité mobile" }
    ]
  },
  {
    version: "1.6.0",
    date: "2024-12-28",
    type: "minor",
    changes: [
      { type: "feature", text: "Système de mémoire cross-modale" },
      { type: "feature", text: "Knowledge Base avec fusion intelligente" },
      { type: "security", text: "2FA avec TOTP" },
      { type: "security", text: "Audit logs complets" }
    ]
  }
];

const TYPE_CONFIG = {
  feature: { icon: Plus, label: "Nouveauté", color: "bg-green-100 text-green-700" },
  improvement: { icon: Zap, label: "Amélioration", color: "bg-blue-100 text-blue-700" },
  fix: { icon: Bug, label: "Correction", color: "bg-orange-100 text-orange-700" },
  security: { icon: Shield, label: "Sécurité", color: "bg-red-100 text-red-700" }
};

export default function Changelog() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-12">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Changelog</h1>
            <p className="text-purple-100">Historique des versions et nouveautés</p>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {VERSIONS.map((version) => (
            <Card key={version.version} className="p-6 dark:bg-slate-800 dark:border-slate-700">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8 text-purple-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      v{version.version}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{version.date}</p>
                  </div>
                </div>
                {version.type === 'major' && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    Version majeure
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                {version.changes.map((change, idx) => {
                  const config = TYPE_CONFIG[change.type];
                  const Icon = config.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <Badge className={`${config.color} flex items-center gap-1 flex-shrink-0`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </Badge>
                      <p className="text-slate-700 dark:text-slate-300">{change.text}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}

          <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">À venir</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              • API publique documentée<br />
              • Webhooks avancés<br />
              • Mode collaboration temps réel<br />
              • Mobile app native (iOS/Android)
            </p>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}