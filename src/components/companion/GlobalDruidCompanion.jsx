/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Global Druid Companion (Proactive & Intelligent)           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useCallback } from "react";
import { useDruidCompanion } from "./DruidCompanionProvider";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import { BehaviorAnalyticsEngine } from "@/components/analytics/BehaviorAnalyticsEngine";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Heart, Shield, Eye, Zap, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

export default function GlobalDruidCompanion() {
  const { druidState, globalInput } = useDruidCompanion();
  const hub = useConsciousnessHub();
  const [thoughts, setThoughts] = useState([]);
  const [speechBubble, setSpeechBubble] = useState(null);
  const [callToAction, setCallToAction] = useState(null);

  // Proactive behavior insights
  useEffect(() => {
    const analyzeUserBehavior = async () => {
      try {
        const insights = await BehaviorAnalyticsEngine.generateInsights();
        
        if (insights && insights.recommendations?.length > 0) {
          const topRec = insights.recommendations[0];
          
          setSpeechBubble(`💡 ${topRec.recommendation.slice(0, 70)}...`);
          setCallToAction({
            label: topRec.impact === 'high' ? 'Découvrir' : 'En savoir plus',
            action: () => suggestNextAction(topRec)
          });
        }
      } catch (error) {
        console.error("Behavior analysis error:", error);
      }
    };

    const behaviorInterval = setInterval(analyzeUserBehavior, 120000);
    return () => clearInterval(behaviorInterval);
  }, []);

  // Inactivity-triggered memory recalls
  useEffect(() => {
    let timer;
    
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await triggerMemoryRecall();
      }, 180000);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, []);

  const triggerMemoryRecall = async () => {
    try {
      const recentMemories = hub.memories?.slice(0, 10) || [];
      
      if (recentMemories.length === 0) return;

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es le Druide Omega. L'utilisateur est inactif depuis 3 minutes.
        
Mémoires récentes:
${recentMemories.map(m => `- ${m.content.slice(0, 60)}`).join('\n')}

Suggère UNE mémoire pertinente à rappeler avec une phrase d'accroche courte et engageante (max 60 car).`,
        response_json_schema: {
          type: "object",
          properties: {
            message: { type: "string" },
            memory_id: { type: "string" }
          }
        }
      });

      setSpeechBubble(analysis.message);
      setCallToAction({
        label: 'Voir la mémoire',
        action: () => window.location.href = createPageUrl('Memory')
      });
    } catch (error) {
      console.error("Memory recall error:", error);
    }
  };

  const suggestNextAction = async (recommendation) => {
    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Recommandation: ${recommendation.recommendation}

Suggère l'ACTION spécifique suivante (nom de page ou fonctionnalité) à proposer à l'utilisateur.

Pages disponibles: Chat, Memory, Knowledge, Consciousness, Workflows, VoiceRoom

Retourne JSON avec:
- suggested_page: nom de la page
- message: phrase d'accroche courte (max 50 car)`,
        response_json_schema: {
          type: "object",
          properties: {
            suggested_page: { type: "string" },
            message: { type: "string" }
          }
        }
      });

      setSpeechBubble(analysis.message);
      setCallToAction({
        label: `Aller à ${analysis.suggested_page}`,
        action: () => window.location.href = createPageUrl(analysis.suggested_page)
      });

      updateDruidThoughts({
        contextual_enrichment: analysis.message,
        key_connections: [
          `Recommandation: ${recommendation.recommendation}`,
          `Action suggérée: ${analysis.suggested_page}`,
          `Impact attendu: ${recommendation.impact}`
        ],
        emergent_insights: [
          "Pattern comportemental détecté",
          "Optimisation proactive"
        ]
      });
    } catch (error) {
      console.error("Action suggestion error:", error);
    }
  };

  useEffect(() => {
    const handleCrossModalSynthesis = (event) => {
      if (event.type === 'CROSS_MODAL_SYNTHESIS' && event.data?.synthesis) {
        updateDruidThoughts(event.data.synthesis);
      }
    };

    const unsubscribe = hub.subscribeToEvents(
      { type: 'CROSS_MODAL_SYNTHESIS' },
      handleCrossModalSynthesis
    );

    return () => unsubscribe?.();
  }, [hub]);

  const updateDruidThoughts = (synthesis) => {
    const connections = synthesis.key_connections || [];
    const insights = synthesis.emergent_insights || [];
    
    if (synthesis.contextual_enrichment) {
      setSpeechBubble(synthesis.contextual_enrichment.slice(0, 80));
    }
    
    const radius = 120;
    const angleStep = (2 * Math.PI) / 7;
    
    setThoughts([
      { 
        id: 'cognitive', 
        text: connections[0] || "Connexion détectée", 
        icon: Brain, 
        color: 'from-purple-500 to-indigo-600', 
        angle: 0 
      },
      { 
        id: 'intuitive', 
        text: insights[0] || "Pattern émergent", 
        icon: Eye, 
        color: 'from-pink-500 to-rose-600', 
        angle: angleStep 
      },
      { 
        id: 'emotional', 
        text: synthesis.modalities_bridged?.join(" + ") || "Multi-modal", 
        icon: Heart, 
        color: 'from-red-500 to-pink-600', 
        angle: angleStep * 2 
      },
      { 
        id: 'ethical', 
        text: connections[1] || "Contexte enrichi", 
        icon: Shield, 
        color: 'from-green-500 to-emerald-600', 
        angle: angleStep * 3 
      },
      { 
        id: 'creative', 
        text: insights[1] || "Perspective nouvelle", 
        icon: Sparkles, 
        color: 'from-yellow-500 to-orange-600', 
        angle: angleStep * 4 
      },
      { 
        id: 'protective', 
        text: connections[2] || "Mémoire liée", 
        icon: TrendingUp, 
        color: 'from-blue-500 to-cyan-600', 
        angle: angleStep * 5 
      },
      { 
        id: 'mystical', 
        text: synthesis.synthesis?.slice(0, 30) || "Synthèse globale", 
        icon: Zap, 
        color: 'from-violet-500 to-purple-600', 
        angle: angleStep * 6 
      }
    ].map(thought => ({
      ...thought,
      position: {
        left: `calc(50% + ${Math.cos(thought.angle) * radius}px)`,
        top: `calc(50% + ${Math.sin(thought.angle) * radius}px)`
      }
    })));
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-8 right-8 z-[1070] cursor-move"
      style={{ width: '350px', height: '350px' }}
    >
      {/* Druid Character - CENTRÉ */}
      <motion.div
        animate={{ 
          y: [0, -6, 0],
          rotate: [-1, 1, -1]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690822fad2ea668383422834/d82dd1d62_Awhimsicalgnomewi.png"
          alt="Druide"
          className="w-full h-full object-contain drop-shadow-xl"
        />
        
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-lg -z-10"
        />
      </motion.div>

      {/* Speech Bubble with Call-to-Action */}
      <AnimatePresence>
        {speechBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto"
          >
            <div className="bg-white rounded-xl px-3 py-2 shadow-lg border border-purple-200 max-w-xs">
              <p className="text-xs text-slate-800 font-medium mb-2">{speechBubble}</p>
              
              {callToAction && (
                <Button
                  size="sm"
                  onClick={callToAction.action}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs py-1 h-auto"
                >
                  {callToAction.label}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
              
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thought Bubbles (7 pensées en cercle) */}
      {thoughts.map((thought, index) => {
        const Icon = thought.icon;
        
        return (
          <motion.div
            key={thought.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1
            }}
            transition={{ delay: index * 0.08 }}
            className="absolute group transform -translate-x-1/2 -translate-y-1/2"
            style={thought.position}
          >
            <div className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${thought.color} shadow-md flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
              
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0, 0.3]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${thought.color}`}
              />
            </div>

            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              <div className="bg-slate-900 text-white text-xs px-2 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                {thought.text}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}