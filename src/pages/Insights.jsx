/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Proactive Insights Dashboard                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb, TrendingUp, AlertCircle, Sparkles, Target, Loader2, ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { generateProactiveInsights } from "@/components/insights/InsightGenerator";
import { useIntegrationRelay } from "@/components/system/IntegrationRelay";

export default function Insights() {
  const [insights, setInsights] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { relayOn } = useIntegrationRelay();

  const handleGenerate = async () => {
    if (!relayOn) { alert("Arrêt interne — relais d'intégration désactivé. Activez le relais (bouton vert en bas à gauche) pour générer des insights."); return; }
    setIsGenerating(true);
    try {
      const data = await generateProactiveInsights();
      setInsights(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const categoryColors = {
    pattern: "bg-blue-100 text-blue-700",
    trend: "bg-purple-100 text-purple-700",
    opportunity: "bg-green-100 text-green-700",
    warning: "bg-orange-100 text-orange-700",
    connection: "bg-pink-100 text-pink-700"
  };

  const categoryIcons = {
    pattern: Target,
    trend: TrendingUp,
    opportunity: Sparkles,
    warning: AlertCircle,
    connection: Lightbulb
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="ghost"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour Dashboard
          </Button>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Insights Proactifs</h1>
                <p className="text-sm text-slate-600">Tendances et patterns détectés automatiquement</p>
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-purple-600">
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {isGenerating ? "Analyse..." : "Générer Insights"}
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {!insights ? (
            <Card className="p-12 text-center">
              <Lightbulb className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun insight généré</h3>
              <p className="text-slate-600 mb-6">Cliquez sur "Générer Insights" pour analyser vos données</p>
            </Card>
          ) : (
            <>
              {/* Main Insights */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Insights Principaux</h2>
                <div className="grid gap-4">
                  {insights.insights?.map((insight, idx) => {
                    const Icon = categoryIcons[insight.category];
                    return (
                      <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                        <Card className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                              {Icon && <Icon className="w-6 h-6 text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-slate-900">{insight.title}</h3>
                                <Badge className={categoryColors[insight.category]}>{insight.category}</Badge>
                                <Badge variant="outline">Priorité: {insight.priority}%</Badge>
                                <Badge variant="secondary">Confiance: {insight.confidence}%</Badge>
                              </div>
                              <p className="text-sm text-slate-700 mb-3">{insight.description}</p>
                              {insight.actionable_steps?.length > 0 && (
                                <div className="p-3 bg-green-50 rounded-lg">
                                  <p className="text-xs font-semibold text-green-900 mb-2">Actions Recommandées:</p>
                                  {insight.actionable_steps.map((step, i) => (
                                    <p key={i} className="text-xs text-green-700">• {step}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Emerging Trends */}
              {insights.emerging_trends?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Tendances Émergentes</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {insights.emerging_trends.map((trend, idx) => (
                      <Card key={idx} className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                          <Badge className="bg-purple-500 text-white">Force: {trend.strength}%</Badge>
                          <Badge variant="outline">{trend.growth_rate}</Badge>
                        </div>
                        <p className="text-sm font-medium text-slate-900 mb-2">{trend.trend}</p>
                        <div className="text-xs text-slate-600">
                          {trend.supporting_evidence?.map((ev, i) => (
                            <p key={i}>✓ {ev}</p>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Knowledge Gaps */}
              {insights.knowledge_gaps?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Lacunes de Connaissance</h2>
                  <div className="space-y-3">
                    {insights.knowledge_gaps.map((gap, idx) => (
                      <Card key={idx} className="p-4 bg-orange-50 border-orange-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900 mb-1">{gap.gap}</p>
                            <p className="text-xs text-slate-600">{gap.recommended_action}</p>
                          </div>
                          <Badge className="bg-orange-500 text-white">
                            Importance: {gap.importance}%
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Predictive Insights */}
              {insights.predictive_insights?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Prédictions</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {insights.predictive_insights.map((pred, idx) => (
                      <Card key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <Badge className="bg-blue-500 text-white">Probabilité: {pred.probability}%</Badge>
                          <Badge variant="outline">{pred.impact}</Badge>
                        </div>
                        <p className="text-sm text-slate-900 mb-1">{pred.prediction}</p>
                        <p className="text-xs text-slate-600">Horizon: {pred.timeframe}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}