/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Knowledge Management Page                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdvancedKnowledgeManager from "../components/knowledge/AdvancedKnowledgeManager";
import ProactiveSuggestionsPanel from "../components/ai/ProactiveSuggestionsPanel";
import { Database, Brain, Network } from "lucide-react";

export default function KnowledgeManagement() {
  const [activeSection, setActiveSection] = useState("search");

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Gestion des Connaissances</h1>
                <p className="text-sm text-slate-600">Organisation, recherche et interconnexion</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-indigo-50 to-white">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-indigo-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">∞</div>
                  <div className="text-xs text-slate-600">Total</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-white">
              <div className="flex items-center gap-3">
                <Network className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">∞</div>
                  <div className="text-xs text-slate-600">Connexions</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-pink-50 to-white">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-pink-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">∞</div>
                  <div className="text-xs text-slate-600">Tags</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Suggestions Proactives */}
          <ProactiveSuggestionsPanel />

          {/* Gestionnaire Avancé */}
          <AdvancedKnowledgeManager />
        </div>
      </ScrollArea>
    </div>
  );
}