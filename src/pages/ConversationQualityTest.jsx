/**
 * Page de test - Analyse de qualité conversationnelle Chat_2
 * Simule 5 types de conversations pour éprouver la robustesse
 */

import React from "react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Home, Zap } from "lucide-react";
import ConversationQualityTester from "@/components/chat/ConversationQualityAnalyzer";

export default function ConversationQualityTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white page-padding py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.location.href = createPageUrl('Chat_2')}
                className="text-white hover:bg-white/20"
              >
                <Home className="w-5 h-5" />
              </Button>
              <Zap className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold font-display">
                  Testeur de Qualité Conversationnelle
                </h1>
                <p className="text-purple-100 text-sm">
                  Analyse robustesse Chat_2 avec 5 types de conversations (50 messages total)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <ConversationQualityTester />
      </div>

      {/* Info Footer */}
      <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-slate-600">
        <p>
          Ce testeur simule des conversations cohérentes, incohérentes, aléatoires, 
          avec demandes spéciales et cas limites pour vérifier la stabilité de Chat_2.
        </p>
      </div>
    </div>
  );
}