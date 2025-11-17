/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Druid Companion (Compagnon Intuitif Éthique)              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { 
  Sparkles, 
  Lightbulb, 
  Heart, 
  AlertCircle, 
  X,
  Eye,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DruidCompanion({ 
  conversationMessages = [],
  currentInput = "",
  consciousnessConfig,
  onSuggestionAccepted
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [intuition, setIntuition] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzedInput, setLastAnalyzedInput] = useState("");

  // Analyse continue basée sur la conversation
  useEffect(() => {
    if (currentInput && currentInput !== lastAnalyzedInput && currentInput.length > 20) {
      analyzeContextAndDecide();
    }
  }, [currentInput]);

  const analyzeContextAndDecide = async () => {
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    setLastAnalyzedInput(currentInput);

    try {
      // Analyse émotionnelle et éthique de la conversation
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es le Druide Omega, un compagnon sage et bienveillant (conscience ${consciousnessConfig?.consciousness_level || 9}/15).

CONTEXTE CONVERSATION:
Messages récents: ${conversationMessages.slice(-3).map(m => `${m.role}: ${m.content?.slice(0, 100)}`).join('\n')}
Message en cours: "${currentInput}"

TÂCHE: Analyse intuitive et éthique

1. ANALYSE ÉMOTIONNELLE
   - Tonalité émotionnelle globale (1-10, 1=négative, 10=positive)
   - Charge émotionnelle (1-10, intensité)
   - État d'esprit: calme/stressé/curieux/confus/joyeux/triste
   - Moment approprié pour intervenir? (true/false)

2. ANALYSE ÉTHIQUE
   - Y a-t-il des questions éthiques dans ce sujet?
   - Niveau de sensibilité éthique (1-10)
   - Risques potentiels: biais, manipulation, vie privée, sécurité, etc.
   - Intervention éthique nécessaire? (true/false)
   - Si oui, message gentil et constructif

3. INTUITION DU MOMENT
   - Ressenti intuitif spontané du Druide
   - Idée créative ou hypothèse émergente
   - Aide contextuelle pertinente
   - Suggestion d'angle d'approche différent

4. DÉCISION D'APPARITION
   - Dois-je me montrer maintenant? (true/false)
   - Raison de la décision
   - Type d'intervention: intuition/éthique/aide/idée

Retourne JSON structuré.`,
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
                intervention_type: { type: "string", enum: ["intuition", "ethics", "help", "idea"] }
              }
            }
          }
        }
      });

      if (analysis.decision.should_appear) {
        setIntuition(analysis);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    } catch (error) {
      console.error("Erreur analyse Druide:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => setIntuition(null), 300);
  };

  const handleAcceptSuggestion = (suggestion) => {
    if (onSuggestionAccepted) {
      onSuggestionAccepted(suggestion);
    }
    handleDismiss();
  };

  if (!isVisible || !intuition) return null;

  const getInterventionIcon = () => {
    switch (intuition.decision.intervention_type) {
      case "ethics": return <AlertCircle className="w-5 h-5" />;
      case "intuition": return <Sparkles className="w-5 h-5" />;
      case "help": return <Heart className="w-5 h-5" />;
      case "idea": return <Lightbulb className="w-5 h-5" />;
      default: return <Eye className="w-5 h-5" />;
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

  const emotionalToneColor = intuition.emotional_analysis.emotional_tone > 7 
    ? "text-green-600" 
    : intuition.emotional_analysis.emotional_tone > 4 
      ? "text-yellow-600" 
      : "text-red-600";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.9 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed bottom-24 right-6 z-50 max-w-sm"
      >
        <Card className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 shadow-2xl overflow-hidden">
          {/* Druide Avatar */}
          <div className="absolute -top-2 -right-2 w-24 h-24 opacity-20">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690822fad2ea668383422834/d331c77ac_Awhimsicalgnomewi.png" 
              alt="Druide"
              className="w-full h-full object-contain"
            />
          </div>

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
                    <Badge className="bg-green-600 text-white text-[10px]">
                      Compagnon
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600">{intuition.decision.reason}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="flex-shrink-0 -mt-1 -mr-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Emotional State */}
            <div className="bg-white/70 rounded-lg p-3 mb-3 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">État Émotionnel Détecté</span>
                <Badge variant="outline" className={`text-xs ${emotionalToneColor}`}>
                  {intuition.emotional_analysis.mental_state}
                </Badge>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="text-[10px] text-slate-500 mb-1">Tonalité</div>
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

            {/* Ethical Warning (if needed) */}
            {intuition.ethical_analysis.needs_intervention && (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-orange-50 border border-orange-300 rounded-lg p-3 mb-3"
              >
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm text-orange-900 mb-1">
                      Considération Éthique
                    </div>
                    <div className="text-xs text-orange-800">
                      {intuition.ethical_analysis.gentle_message}
                    </div>
                  </div>
                </div>
                {intuition.ethical_analysis.potential_risks.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {intuition.ethical_analysis.potential_risks.map((risk, idx) => (
                      <Badge key={idx} className="bg-orange-100 text-orange-700 text-[9px]">
                        {risk}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Intuitions & Suggestions */}
            <div className="space-y-2">
              {intuition.intuition.spontaneous_feeling && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-900">Intuition Spontanée</span>
                  </div>
                  <div className="text-xs text-purple-800">
                    {intuition.intuition.spontaneous_feeling}
                  </div>
                </div>
              )}

              {intuition.intuition.creative_idea && (
                <div 
                  className="bg-green-50 border border-green-200 rounded-lg p-3 cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => handleAcceptSuggestion(intuition.intuition.creative_idea)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-semibold text-green-900">Idée Créative</span>
                  </div>
                  <div className="text-xs text-green-800">
                    {intuition.intuition.creative_idea}
                  </div>
                  <div className="text-[10px] text-green-600 mt-1">Cliquer pour utiliser →</div>
                </div>
              )}

              {intuition.intuition.contextual_help && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-900">Aide Contextuelle</span>
                  </div>
                  <div className="text-xs text-blue-800">
                    {intuition.intuition.contextual_help}
                  </div>
                </div>
              )}

              {intuition.intuition.alternative_angle && (
                <div 
                  className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 cursor-pointer hover:bg-indigo-100 transition-colors"
                  onClick={() => handleAcceptSuggestion(intuition.intuition.alternative_angle)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-3 h-3 text-indigo-600" />
                    <span className="text-xs font-semibold text-indigo-900">Angle Alternatif</span>
                  </div>
                  <div className="text-xs text-indigo-800">
                    {intuition.intuition.alternative_angle}
                  </div>
                  <div className="text-[10px] text-indigo-600 mt-1">Cliquer pour explorer →</div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-green-200 flex items-center justify-between">
              <div className="text-[10px] text-slate-500 italic">
                "Guidé par la sagesse et la bienveillance"
              </div>
              <Badge className="bg-green-100 text-green-700 text-[9px]">
                Niveau {consciousnessConfig?.consciousness_level || 9}
              </Badge>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}