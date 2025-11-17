/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Global Druid Companion (Cross-Modal Integration)           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { useDruidCompanion } from "./DruidCompanionProvider";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Heart, Lightbulb, Shield, Eye, Zap } from "lucide-react";

export default function GlobalDruidCompanion() {
  const { druidState, globalInput } = useDruidCompanion();
  const hub = useConsciousnessHub();
  const [thoughts, setThoughts] = useState([]);
  const [speechBubble, setSpeechBubble] = useState(null);

  // Écouter les synthèses cross-modales depuis le hub
  useEffect(() => {
    const handleCrossModalSynthesis = (event) => {
      if (event.type === 'CROSS_MODAL_SYNTHESIS' && event.data?.synthesis) {
        displayCrossModalThoughts(event.data.synthesis);
      }
    };

    // S'abonner aux événements du hub
    const unsubscribe = hub.subscribeToEvents(
      { type: 'CROSS_MODAL_SYNTHESIS' },
      handleCrossModalSynthesis
    );

    return () => unsubscribe?.();
  }, [hub]);

  const displayCrossModalThoughts = (synthesis) => {
    // Préparer les 7 pensées à partir de la synthèse
    const connections = synthesis.key_connections || [];
    const insights = synthesis.emergent_insights || [];
    
    setSpeechBubble(synthesis.contextual_enrichment?.slice(0, 80) || "Analyse cross-modale...");
    
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
        icon: Shield, 
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

  if (!druidState.isVisible && thoughts.length === 0) return null;

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

      {/* Speech Bubble */}
      <AnimatePresence>
        {speechBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-none"
          >
            <div className="bg-white rounded-xl px-3 py-2 shadow-lg border border-purple-200 max-w-xs">
              <p className="text-xs text-slate-800 font-medium">{speechBubble}</p>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thought Bubbles (7 pensées cross-modales en cercle) */}
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

            {/* Tooltip on hover */}
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