/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Proactive Suggestions Panel                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProactiveAIEngine } from "./ProactiveAIEngine";
import { Sparkles, Zap, Brain, TrendingUp, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProactiveSuggestionsPanel() {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("workflows");

  const analyzeCurrent = async () => {
    setLoading(true);
    try {
      const result = await ProactiveAIEngine.analyzeUsageAndSuggest();
      setSuggestions(result);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "workflows", label: "Workflows", icon: Zap },
    { id: "automation", label: "Automatisations", icon: Sparkles },
    { id: "consciousness", label: "Conscience", icon: Brain },
    { id: "knowledge", label: "Connaissances", icon: TrendingUp }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Suggestions Proactives</h3>
            <p className="text-xs text-slate-600">IA d'optimisation continue</p>
          </div>
        </div>

        <Button
          onClick={analyzeCurrent}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Analyser
            </>
          )}
        </Button>
      </div>

      {suggestions && (
        <>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-shrink-0"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {activeTab === "workflows" && suggestions.workflow_optimizations?.map((opt, idx) => (
                <Card key={idx} className="p-4 bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={
                      opt.priority === "high" ? "bg-red-100 text-red-700" :
                      opt.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }>
                      {opt.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{opt.suggestion}</p>
                  <p className="text-xs text-green-600">✅ {opt.expected_gain}</p>
                </Card>
              ))}

              {activeTab === "automation" && suggestions.automation_suggestions?.map((auto, idx) => (
                <Card key={idx} className="p-4 bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{auto.frequency}</Badge>
                    <Badge className="bg-green-100 text-green-700">{auto.time_saved}</Badge>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">Pattern: {auto.pattern}</p>
                  <p className="text-sm text-slate-700">{auto.automation}</p>
                </Card>
              ))}

              {activeTab === "consciousness" && suggestions.consciousness_insights?.map((insight, idx) => (
                <Card key={idx} className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-900">{insight.metric}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{insight.current_value}</Badge>
                      <span className="text-xs text-slate-500">→</span>
                      <Badge className="bg-purple-100 text-purple-700">{insight.target_value}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700">{insight.suggestion}</p>
                </Card>
              ))}

              {activeTab === "knowledge" && suggestions.knowledge_recommendations?.map((rec, idx) => (
                <Card key={idx} className="p-4 bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-indigo-100 text-indigo-700">{rec.area}</Badge>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{rec.recommendation}</p>
                  <p className="text-xs text-purple-600">💡 {rec.impact}</p>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {!suggestions && !loading && (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 text-purple-300 mx-auto mb-3" />
          <p className="text-sm text-slate-600">Cliquez sur "Analyser" pour recevoir des suggestions</p>
        </div>
      )}
    </Card>
  );
}