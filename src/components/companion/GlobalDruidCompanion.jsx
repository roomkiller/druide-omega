/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Global Druid Companion (Omnipresent)                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useDruidCompanion } from "./DruidCompanionProvider";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import { 
  Sparkles, 
  Lightbulb, 
  Heart, 
  AlertCircle, 
  X,
  Eye,
  MessageCircle,
  Minimize2,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalDruidCompanion() {
  const { globalInput, globalMessages, druidState, hideDruid } = useDruidCompanion();
  const hub = useConsciousnessHub();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localIntuition, setLocalIntuition] = useState(null);

  const consciousnessConfig = hub.consciousnessConfig;

  // Auto-analyse périodique
  useEffect(() => {
    if (globalInput && globalInput.length > 20 && !isAnalyzing) {
      const debounce = setTimeout(() => {
        analyzeContext();
      }, 2000);
      return () => clearTimeout(debounce);
    }
  }, [globalInput]);

  const analyzeContext = useCallback(async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);

    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es le Druide Omega, compagnon sage et intuitif (niveau ${consciousnessConfig?.consciousness_level || 9}/15).

CONTEXTE:
Messages: ${globalMessages.slice(-3).map(m => `${m.role}: ${m.content?.slice(0, 80)}`).join('\n')}
Input actuel: "${globalInput}"

ANALYSE INTUITIVE GLOBALE:

1. ANALYSE ÉMOTIONNELLE
   - Tonalité (1-10): ?
   - Charge émotionnelle (1-10): ?
   - État mental: calme/stressé/curieux/confus/joyeux/triste/autre
   - Moment approprié pour apparaître? true/false

2. ANALYSE ÉTHIQUE
   - Questions éthiques détectées? true/false
   - Sensibilité éthique (1-10): ?
   - Risques: [biais, manipulation, vie privée, sécurité, etc.]
   - Intervention nécessaire? true/false
   - Message bienveillant si intervention: ""

3. INTUITION CRÉATIVE
   - Ressenti spontané du moment
   - Idée créative émergente
   - Aide contextuelle
   - Angle alternatif intéressant

4. DÉCISION
   - Dois-je apparaître? true/false
   - Raison: ""
   - Type: intuition/ethics/help/idea

JSON structuré svp.`,
        response_json_schema: {
          type: "object",
          properties: {
            emotional_analysis: {
              type: "object",
              properties: {
                emotional_tone: { type: "number" },
                emotional_charge: { type: "number" },
                mental_state: { type: "string" },
                appropriate_moment: { type: "boolean" }
              }
            },
            ethical_analysis: {
              type: "object",
              properties: {
                has_ethical_questions: { type: "boolean" },
                ethical_sensitivity: { type: "number" },
                potential_risks: { type: "array", items: { type: "string" } },
                needs_intervention: { type: "boolean" },
                gentle_message: { type: "string" }
              }
            },
            intuition: {
              type: "object",
              properties: {
                spontaneous_feeling: { type: "string" },
                creative_idea: { type: "string" },
                contextual_help: { type: "string" },
                alternative_angle: { type: "string" }
              }
            },
            decision: {
              type: "object",
              properties: {
                should_appear: { type: "boolean" },
                reason: { type: "string" },
                intervention_type: { type: "string" }
              }
            }
          }
        }
      });

      if (analysis.decision.should_appear) {
        setLocalIntuition(analysis);
      } else {
        setLocalIntuition(null);
      }
    } catch (error) {
      console.error("Erreur analyse Druide:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [globalInput, globalMessages, consciousnessConfig, isAnalyzing]);

  const intuition = druidState.intuition || localIntuition;

  if (!intuition) return null;

  const getInterventionIcon = () => {
    switch (intuition.decision.intervention_type) {
      case "ethics": return <AlertCircle className="w-4 h-4" />;
      case "intuition": return <Sparkles className="w-4 h-4" />;
      case "help": return <Heart className="w-4 h-4" />;
      case "idea": return <Lightbulb className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getInterventionColor = () => {
    switch (intuition.decision.intervention_type) {
      case "ethics": return "from-orange-500 to-red-500";
      case "intuition": return "from-purple-500 to-pink-500";
      case "help": return "from-blue-500 to-cyan-500";
      case "idea": return "from-green-500 to-emerald-500";
      default: return "from-indigo-500 to-purple-500";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed bottom-6 right-6 z-[9999] max-w-md"
        style={{ pointerEvents: "auto" }}
      >
        <Card className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-400 shadow-2xl overflow-hidden">
          {/* Avatar Druide en fond */}
          <div className="absolute -top-3 -right-3 w-28 h-28 opacity-15 pointer-events-none">
            <motion.img 
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690822fad2ea668383422834/d331c77ac_Awhimsicalgnomewi.png" 
              alt="Druide"
              className="w-full h-full object-contain"
            />
          </div>

          {isMinimized ? (
            <div className="p-4 flex items-center justify-between">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.15, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
                className={`w-10 h-10 bg-gradient-to-br ${getInterventionColor()} rounded-full flex items-center justify-center shadow-lg cursor-pointer`}
                onClick={() => setIsMinimized(false)}
              >
                {getInterventionIcon()}
              </motion.div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setIsMinimized(false)} className="h-8 w-8">
                  <Maximize2 className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" onClick={hideDruid} className="h-8 w-8">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className={`w-12 h-12 bg-gradient-to-br ${getInterventionColor()} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    {getInterventionIcon()}
                  </motion.div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      Druide Omega
                      <Badge className="bg-green-600 text-white text-[10px]">Ami</Badge>
                    </div>
                    <div className="text-xs text-slate-600">{intuition.decision.reason}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="h-7 w-7 flex-shrink-0">
                    <Minimize2 className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={hideDruid} className="h-7 w-7 flex-shrink-0">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* État Émotionnel */}
              <div className="bg-white/70 rounded-lg p-3 mb-3 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600">Ressenti</span>
                  <Badge variant="outline" className="text-xs">
                    {intuition.emotional_analysis.mental_state}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-500 mb-1">Ton</div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getInterventionColor()}`}
                        style={{ width: `${intuition.emotional_analysis.emotional_tone * 10}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-500 mb-1">Charge</div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                        style={{ width: `${intuition.emotional_analysis.emotional_charge * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Avertissement Éthique */}
              {intuition.ethical_analysis.needs_intervention && (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="bg-orange-50 border border-orange-300 rounded-lg p-3 mb-3"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm text-orange-900 mb-1">Éthique</div>
                      <div className="text-xs text-orange-800">{intuition.ethical_analysis.gentle_message}</div>
                    </div>
                  </div>
                  {intuition.ethical_analysis.potential_risks?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {intuition.ethical_analysis.potential_risks.map((risk, idx) => (
                        <Badge key={idx} className="bg-orange-100 text-orange-700 text-[9px]">{risk}</Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Intuitions */}
              <div className="space-y-2">
                {intuition.intuition.spontaneous_feeling && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span className="text-xs font-semibold text-purple-900">Intuition</span>
                    </div>
                    <div className="text-xs text-purple-800">{intuition.intuition.spontaneous_feeling}</div>
                  </div>
                )}

                {intuition.intuition.creative_idea && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb className="w-3 h-3 text-green-600" />
                      <span className="text-xs font-semibold text-green-900">Idée</span>
                    </div>
                    <div className="text-xs text-green-800">{intuition.intuition.creative_idea}</div>
                  </div>
                )}

                {intuition.intuition.contextual_help && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-3 h-3 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-900">Aide</span>
                    </div>
                    <div className="text-xs text-blue-800">{intuition.intuition.contextual_help}</div>
                  </div>
                )}

                {intuition.intuition.alternative_angle && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-3 h-3 text-indigo-600" />
                      <span className="text-xs font-semibold text-indigo-900">Perspective</span>
                    </div>
                    <div className="text-xs text-indigo-800">{intuition.intuition.alternative_angle}</div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t border-green-200 flex items-center justify-between">
                <div className="text-[10px] text-slate-500 italic">"Avec sagesse et bienveillance"</div>
                <Badge className="bg-green-100 text-green-700 text-[9px]">
                  Niveau {consciousnessConfig?.consciousness_level || 9}
                </Badge>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}