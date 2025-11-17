/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Global Druid Companion (Animated)                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { useDruidCompanion } from "./DruidCompanionProvider";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Heart, Lightbulb, Shield, Eye, Zap } from "lucide-react";

export default function GlobalDruidCompanion() {
  const { druidState, globalInput, globalMessages } = useDruidCompanion();
  const hub = useConsciousnessHub();
  const [thoughts, setThoughts] = useState([]);
  const [speechBubble, setSpeechBubble] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (globalInput && globalInput.length > 20 && !isAnalyzing) {
      analyzeContext();
    }
  }, [globalInput]);

  const analyzeContext = async () => {
    setIsAnalyzing(true);
    
    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es le Druide Omega, compagnon sage et empathique de l'utilisateur.

CONTEXTE:
Input: "${globalInput}"
Messages: ${globalMessages.length} messages
Conscience: ${hub.consciousnessConfig?.consciousness_level || 9}/15

Génère:
1. Une réaction principale (speech_bubble) - courte et bienveillante
2. Sept pensées distinctes réparties autour de toi:
   - cognitive: analyse logique
   - intuitive: pressentiment
   - emotional: ressenti émotionnel
   - ethical: considération morale
   - creative: idée innovante
   - protective: conseil de sécurité
   - mystical: perspective spirituelle/cosmique

Chaque pensée max 40 caractères.`,
        response_json_schema: {
          type: "object",
          properties: {
            speech_bubble: { type: "string" },
            thoughts: {
              type: "object",
              properties: {
                cognitive: { type: "string" },
                intuitive: { type: "string" },
                emotional: { type: "string" },
                ethical: { type: "string" },
                creative: { type: "string" },
                protective: { type: "string" },
                mystical: { type: "string" }
              }
            }
          }
        }
      });

      setSpeechBubble(analysis.speech_bubble);
      
      // Positions en cercle autour du centre
      const radius = 140;
      const angleStep = (2 * Math.PI) / 7;
      
      setThoughts([
        { id: 'cognitive', text: analysis.thoughts.cognitive, icon: Brain, color: 'from-purple-500 to-indigo-600', angle: 0 },
        { id: 'intuitive', text: analysis.thoughts.intuitive, icon: Eye, color: 'from-pink-500 to-rose-600', angle: angleStep },
        { id: 'emotional', text: analysis.thoughts.emotional, icon: Heart, color: 'from-red-500 to-pink-600', angle: angleStep * 2 },
        { id: 'ethical', text: analysis.thoughts.ethical, icon: Shield, color: 'from-green-500 to-emerald-600', angle: angleStep * 3 },
        { id: 'creative', text: analysis.thoughts.creative, icon: Sparkles, color: 'from-yellow-500 to-orange-600', angle: angleStep * 4 },
        { id: 'protective', text: analysis.thoughts.protective, icon: Shield, color: 'from-blue-500 to-cyan-600', angle: angleStep * 5 },
        { id: 'mystical', text: analysis.thoughts.mystical, icon: Zap, color: 'from-violet-500 to-purple-600', angle: angleStep * 6 }
      ].map(thought => ({
        ...thought,
        position: {
          left: `calc(50% + ${Math.cos(thought.angle) * radius}px)`,
          top: `calc(50% + ${Math.sin(thought.angle) * radius}px)`
        }
      })));
    } catch (error) {
      console.error("Druid analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!druidState.isVisible && thoughts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed bottom-8 right-8 z-[1070] pointer-events-none"
        style={{ width: '400px', height: '400px' }}
      >
        {/* Druid Character - CENTRÉ */}
        <motion.div
          animate={{ 
            y: [0, -8, 0],
            rotate: [-1, 1, -1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 pointer-events-auto cursor-pointer"
          style={{ zIndex: 10 }}
        >
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690822fad2ea668383422834/d82dd1d62_Awhimsicalgnomewi.png"
            alt="Druide Omega"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
          
          {/* Glow effect */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-purple-500/30 to-blue-500/30 rounded-full blur-xl -z-10"
          />
        </motion.div>

        {/* Speech Bubble */}
        <AnimatePresence>
          {speechBubble && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto"
            >
              <div className="relative bg-white rounded-2xl px-4 py-3 shadow-2xl border-2 border-purple-200 max-w-xs">
                <p className="text-sm text-slate-800 font-medium">{speechBubble}</p>
                
                {/* Tail pointing down to druid */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-purple-200" />
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-px w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thought Bubbles (7 pensées en cercle) */}
        <AnimatePresence>
          {thoughts.map((thought, index) => {
            const Icon = thought.icon;
            
            return (
              <motion.div
                key={thought.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -8, 0]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  delay: index * 0.1,
                  y: {
                    duration: 2 + index * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                className="absolute pointer-events-auto cursor-pointer group transform -translate-x-1/2 -translate-y-1/2"
                style={thought.position}
              >
                {/* Thought Icon Circle */}
                <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${thought.color} shadow-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white drop-shadow" />
                  
                  {/* Pulse effect */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.4, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${thought.color}`}
                  />
                </div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                    {thought.text}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-900" />
                  </div>
                </div>

                {/* Connecting line to center */}
                <motion.div
                  animate={{ 
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                  className="absolute top-1/2 left-1/2 w-1 bg-gradient-to-r from-transparent via-white to-transparent"
                  style={{
                    height: '2px',
                    transformOrigin: 'center',
                    transform: `rotate(${thought.angle}rad)`,
                    width: `${140}px`,
                    left: '50%',
                    marginLeft: '-70px'
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Sparkle effects around druid */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut"
            }}
            className="absolute text-yellow-400"
            style={{
              left: `${40 + Math.random() * 20}%`,
              top: `${40 + Math.random() * 20}%`,
              fontSize: '20px'
            }}
          >
            ✨
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}