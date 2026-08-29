/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Semantic Search Page                                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import GlobalSemanticSearch from "../components/search/GlobalSemanticSearch";
import { useBehaviorTracking } from "../components/analytics/BehaviorTracker";
import { Search, Sparkles, ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { navigateTo } from "@/lib/spaNavigate";

export default function SemanticSearch() {
  const { trackAction } = useBehaviorTracking('semantic_search');

  useEffect(() => {
    trackAction('page_view');
  }, []);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6 flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          <Button
            onClick={() => navigateTo('ArchitectDashboard')}
            variant="ghost"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Recherche Sémantique</h1>
              <p className="text-sm text-slate-600">Compréhension contextuelle et questions naturelles</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <GlobalSemanticSearch />
        </div>
      </ScrollArea>
    </div>
  );
}