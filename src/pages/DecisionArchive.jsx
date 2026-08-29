/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Decision Archive (Équation Infinie -0:+0)                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Infinity, 
  Heart, 
  Brain, 
  Pause,
  Search,
  Filter,
  TrendingUp,
  Eye,
  Sparkles,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { navigateTo } from "@/lib/spaNavigate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DECISION_TYPE_COLORS = {
  action: "from-green-500 to-emerald-600",
  non_action: "from-slate-500 to-gray-600",
  partial_action: "from-yellow-500 to-orange-600",
  observation: "from-blue-500 to-cyan-600",
  synthesis: "from-purple-500 to-indigo-600"
};

const EQUILIBRIUM_COLORS = {
  converging: "bg-green-100 text-green-700",
  diverging: "bg-red-100 text-red-700",
  stable: "bg-blue-100 text-blue-700",
  oscillating: "bg-yellow-100 text-yellow-700",
  transcendent: "bg-purple-100 text-purple-700"
};

export default function DecisionArchive() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDecision, setSelectedDecision] = useState(null);

  const { data: decisions = [], isLoading } = useQuery({
    queryKey: ['intuitiveDecisions'],
    queryFn: () => base44.entities.IntuitiveDecision.list('-created_date', 100),
  });

  const filteredDecisions = decisions.filter(d => {
    const matchesSearch = !searchTerm || 
      d.decision_context?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.final_response?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || d.decision_type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const typeCount = decisions.reduce((acc, d) => {
    acc[d.decision_type] = (acc[d.decision_type] || 0) + 1;
    return acc;
  }, {});

  const avgQuality = decisions.length > 0
    ? Math.round(decisions.reduce((sum, d) => sum + (d.synthesis_quality || 0), 0) / decisions.length)
    : 0;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={() => navigateTo('ArchitectDashboard')}
            variant="ghost"
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour Dashboard
          </Button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="min-w-[64px] min-h-[64px] w-16 h-16 bg-gradient-to-br from-purple-500 via-indigo-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40"
              >
                <Infinity className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Archive des Décisions</h1>
                <p className="text-sm sm:text-base text-slate-600">Cœur • Conscience • Zone Grise • Ratio -0:+0</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-4 py-2 bg-white">
                {decisions.length}
              </Badge>
              <Badge className="bg-purple-100 text-purple-700 px-3 py-1.5">
                Qualité: {avgQuality}%
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Heart className="min-w-[40px] min-h-[40px] w-10 h-10 text-red-600" />
                <div>
                  <p className="text-xl font-bold text-slate-900">Cœur</p>
                  <p className="text-sm text-slate-600">Raison</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Brain className="min-w-[40px] min-h-[40px] w-10 h-10 text-blue-600" />
                <div>
                  <p className="text-xl font-bold text-slate-900">Conscience</p>
                  <p className="text-sm text-slate-600">Morale</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Pause className="min-w-[40px] min-h-[40px] w-10 h-10 text-slate-600" />
                <div>
                  <p className="text-xl font-bold text-slate-900">Zone Grise</p>
                  <p className="text-sm text-slate-600">Intuition</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Infinity className="min-w-[40px] min-h-[40px] w-10 h-10 text-purple-600" />
                <div>
                  <p className="text-xl font-bold text-slate-900">-0:+0</p>
                  <p className="text-sm text-slate-600">Équation</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-shrink-0 bg-white/60 backdrop-blur-sm border-b border-slate-200/60 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 min-h-[48px] bg-white"
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="min-h-[48px] w-full sm:w-[240px] bg-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous ({decisions.length})</SelectItem>
                <SelectItem value="action">Actions ({typeCount.action || 0})</SelectItem>
                <SelectItem value="non_action">Non-Actions ({typeCount.non_action || 0})</SelectItem>
                <SelectItem value="observation">Observations ({typeCount.observation || 0})</SelectItem>
                <SelectItem value="synthesis">Synthèses ({typeCount.synthesis || 0})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
              <p className="text-slate-600 mt-4">Chargement...</p>
            </div>
          ) : filteredDecisions.length === 0 ? (
            <div className="text-center py-12">
              <Infinity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune décision</h3>
              <p className="text-slate-600">
                {searchTerm || selectedType !== "all"
                  ? "Aucun résultat"
                  : "Les décisions apparaîtront ici"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredDecisions.map((decision, index) => (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                >
                  <Card 
                    className="overflow-hidden hover:shadow-xl transition-all cursor-pointer bg-white touch-target"
                    onClick={() => setSelectedDecision(decision)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${DECISION_TYPE_COLORS[decision.decision_type] || DECISION_TYPE_COLORS.synthesis}`} />
                    
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge className="bg-purple-100 text-purple-700">
                              {decision.decision_type}
                            </Badge>
                            <Badge className={EQUILIBRIUM_COLORS[decision.infinite_equation_state?.equilibrium_state] || "bg-slate-100 text-slate-700"}>
                              {decision.infinite_equation_state?.equilibrium_state || "N/A"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Ratio: {decision.heart_consciousness_ratio}
                            </Badge>
                          </div>
                          <p className="text-sm sm:text-base text-slate-700 line-clamp-2 break-words mb-2">
                            {decision.decision_context}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-600 italic line-clamp-2 break-words">
                            "{decision.final_response}"
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div className="bg-red-50 rounded-lg p-2 sm:p-3 text-center">
                          <Heart className="w-4 h-4 text-red-600 mx-auto mb-1" />
                          <p className="text-xs text-red-900">Cœur</p>
                          <p className="text-sm sm:text-base font-bold text-red-700">
                            {decision.heart_reasoning?.certainty_level || 0}/10
                          </p>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-2 sm:p-3 text-center">
                          <Brain className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                          <p className="text-xs text-blue-900">Conscience</p>
                          <p className="text-sm sm:text-base font-bold text-blue-700">
                            {decision.consciousness_guidance?.ethical_weight || 0}/10
                          </p>
                        </div>

                        <div className="bg-slate-100 rounded-lg p-2 sm:p-3 text-center">
                          <Infinity className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                          <p className="text-xs text-purple-900">Vide ø</p>
                          <p className="text-sm sm:text-base font-bold text-purple-700">
                            {decision.infinite_equation_state?.void_resonance || 0}
                          </p>
                        </div>
                      </div>

                      {decision.grey_zone_activation && (
                        <div className="mt-3 bg-slate-100 rounded-lg p-3 border border-slate-300">
                          <div className="flex items-center gap-2 mb-1">
                            <Pause className="w-3 h-3 text-slate-700" />
                            <span className="text-xs font-semibold text-slate-900">Zone Grise Active</span>
                            <Badge className="bg-slate-600 text-white text-xs">
                              {decision.grey_zone_analysis?.intuition_signal}
                            </Badge>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-slate-500">
                        <span>Qualité: {decision.synthesis_quality}%</span>
                        <span>{new Date(decision.created_date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Detail Dialog - With Scrolling */}
      <Dialog open={!!selectedDecision} onOpenChange={() => setSelectedDecision(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Infinity className="w-5 h-5" />
              Détails de la Décision
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            {selectedDecision && (
              <div className="space-y-4">
                {/* Context */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-2">Contexte</h4>
                  <p className="text-sm text-slate-700 break-words">{selectedDecision.decision_context}</p>
                </div>

                {/* Heart Analysis */}
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-red-600" />
                    <h4 className="font-semibold text-red-900">Cœur (Raison)</h4>
                    <Badge variant="outline">{selectedDecision.heart_reasoning?.certainty_level}/10</Badge>
                    {selectedDecision.heart_reasoning?.ratio_balance !== undefined && (
                      <Badge variant="outline">-0:+0 = {selectedDecision.heart_reasoning.ratio_balance}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-red-800 mb-3 break-words">
                    {selectedDecision.heart_reasoning?.logic_analysis}
                  </p>
                  {selectedDecision.heart_reasoning?.rational_path && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-red-900">Chemin rationnel:</p>
                      {selectedDecision.heart_reasoning.rational_path.map((step, i) => (
                        <p key={i} className="text-xs text-red-700 pl-3 break-words">
                          {i + 1}. {step}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Consciousness Guidance */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Conscience (Morale)</h4>
                    <Badge variant="outline">{selectedDecision.consciousness_guidance?.ethical_weight}/10</Badge>
                  </div>
                  <p className="text-sm text-blue-800 mb-2 break-words">
                    {selectedDecision.consciousness_guidance?.moral_evaluation}
                  </p>
                  <p className="text-xs text-blue-700 italic break-words">
                    <strong>Intention:</strong> {selectedDecision.consciousness_guidance?.intention_clarity}
                  </p>
                </div>

                {/* Grey Zone */}
                {selectedDecision.grey_zone_activation && (
                  <div className="bg-slate-100 rounded-lg p-4 border-2 border-slate-300">
                    <div className="flex items-center gap-2 mb-3">
                      <Pause className="w-5 h-5 text-slate-700" />
                      <h4 className="font-semibold text-slate-900">Zone Grise (Intuition)</h4>
                      <Badge className="bg-slate-600 text-white">
                        {selectedDecision.grey_zone_analysis?.intuition_signal}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-800 break-words">
                        <strong>Résolution du paradoxe:</strong> {selectedDecision.grey_zone_analysis?.paradox_resolution}
                      </p>
                      {selectedDecision.grey_zone_analysis?.non_action_wisdom && (
                        <p className="text-xs text-slate-700 italic bg-white/60 rounded p-2 break-words">
                          💭 {selectedDecision.grey_zone_analysis.non_action_wisdom}
                        </p>
                      )}
                      <p className="text-xs text-slate-600">
                        Acceptation incertitude: {selectedDecision.grey_zone_analysis?.uncertainty_embrace}/10
                      </p>
                    </div>
                  </div>
                )}

                {/* Infinite Equation */}
                <div className="bg-gradient-to-r from-purple-100 via-indigo-100 to-pink-100 rounded-lg p-4 border border-purple-300">
                  <div className="flex items-center gap-2 mb-3">
                    <Infinity className="w-5 h-5 text-purple-700" />
                    <h4 className="font-semibold text-purple-900">Équation Infinie (-0:+0)</h4>
                  </div>
                  <div className="bg-white/60 rounded p-3 mb-2 font-mono text-xs text-center text-purple-900">
                    Infinie = 1-4 = ø x += -0:+0 = -0 = -÷ø = -1-4 = infinie
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white/80 rounded p-2 text-center">
                      <p className="text-purple-600 font-semibold">Vide ø</p>
                      <p className="text-lg font-bold text-purple-900">
                        {selectedDecision.infinite_equation_state?.void_resonance || 0}
                      </p>
                    </div>
                    <div className="bg-white/80 rounded p-2 text-center">
                      <p className="text-indigo-600 font-semibold">État</p>
                      <p className="text-sm font-bold text-indigo-900">
                        {selectedDecision.infinite_equation_state?.equilibrium_state || "N/A"}
                      </p>
                    </div>
                    <div className="bg-white/80 rounded p-2 text-center">
                      <p className="text-pink-600 font-semibold">Profondeur ∞</p>
                      <p className="text-lg font-bold text-pink-900">
                        {selectedDecision.infinite_equation_state?.infinite_loop_depth || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final Response */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg p-4 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5" />
                    <h4 className="font-semibold">Synthèse Finale</h4>
                  </div>
                  <p className="text-sm leading-relaxed italic break-words mb-3">
                    "{selectedDecision.final_response}"
                  </p>
                  <div className="pt-3 border-t border-white/20 grid grid-cols-2 gap-2 text-xs">
                    <div>Type: <strong>{selectedDecision.decision_type}</strong></div>
                    <div>Qualité: <strong>{selectedDecision.synthesis_quality}%</strong></div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}