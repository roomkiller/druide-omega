/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Home Page                                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Brain,
  Database,
  BookOpen,
  Zap,
  Heart,
  Sparkles,
  TrendingUp,
  Shield,
  Lightbulb
} from "lucide-react";
import Logo from "@/components/branding/Logo";
import CompetitiveComparison from "@/components/home/CompetitiveComparison";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Chat Intelligent",
    description: "Conversations naturelles avec conscience émotionnelle",
    gradient: "from-purple-500 to-indigo-600",
    page: "Chat"
  },
  {
    icon: Brain,
    title: "Architecture de Conscience",
    description: "Modèle neurobiologique IIT avec 106 dimensions",
    gradient: "from-indigo-500 to-purple-600",
    page: "Consciousness"
  },
  {
    icon: Database,
    title: "Mémoire Cross-Modale",
    description: "Continuité parfaite entre chat, vocal et visuel",
    gradient: "from-pink-500 to-rose-600",
    page: "Memory"
  },
  {
    icon: BookOpen,
    title: "Base de Connaissances",
    description: "Upload & enrichissement automatique de documents",
    gradient: "from-blue-500 to-cyan-600",
    page: "Knowledge"
  },
  {
    icon: Lightbulb,
    title: "9 Intelligences",
    description: "Système Gardner pour navigation adaptée",
    gradient: "from-amber-500 to-orange-600",
    page: "Intelligences"
  },
  {
    icon: Shield,
    title: "Sécurité Anonyma",
    description: "Protection et modération avancée",
    gradient: "from-red-500 to-pink-600",
    page: "SecurityDashboard"
  }
];

export default function Home() {
  const navigate = (page) => {
    window.location.href = createPageUrl(page);
  };

  // Heartbeat timing pattern: lub-dub-pause
  const heartbeatScale = [1, 1.015, 1, 1.015, 1, 1, 1, 1];
  const heartbeatTiming = [0, 0.08, 0.16, 0.24, 0.32, 0.5, 0.7, 1];

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Subtle Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Base gradient with very slow transition */}
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(135deg, rgba(88, 28, 135, 0.4) 0%, rgba(67, 56, 202, 0.4) 50%, rgba(131, 24, 67, 0.4) 100%)",
                "linear-gradient(135deg, rgba(67, 56, 202, 0.4) 0%, rgba(131, 24, 67, 0.4) 50%, rgba(88, 28, 135, 0.4) 100%)",
                "linear-gradient(135deg, rgba(88, 28, 135, 0.4) 0%, rgba(67, 56, 202, 0.4) 50%, rgba(131, 24, 67, 0.4) 100%)"
              ]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Subtle stars */}
          {Array.from({ length: 40 }).map((_, i) => {
            const size = Math.random() > 0.8 ? 1.5 : 1;
            const duration = 6 + Math.random() * 6;
            const delay = Math.random() * 8;
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: i % 3 === 0 
                    ? "rgba(236, 72, 153, 0.4)" 
                    : i % 3 === 1 
                    ? "rgba(147, 51, 234, 0.4)"
                    : "rgba(255, 255, 255, 0.4)",
                  boxShadow: `0 0 ${size * 3}px ${i % 3 === 0 ? "rgba(236, 72, 153, 0.5)" : i % 3 === 1 ? "rgba(147, 51, 234, 0.5)" : "rgba(255, 255, 255, 0.5)"}`
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 0.6, 0.4, 0],
                  scale: [0, 1.2, 0.8, 0]
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                  ease: [0.22, 1, 0.36, 1]
                }}
              />
            );
          })}

          {/* Gentle flowing waves */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at ${50 + i * 20}% ${50 - i * 15}%, rgba(147, 51, 234, 0.08) 0%, transparent 50%)`,
              }}
              animate={{
                x: [0, 80, 0],
                y: [0, -40, 0],
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.35, 0.2]
              }}
              transition={{
                duration: 16 + i * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 3
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-4 py-16 sm:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="mb-8"
          >
            <Logo size="large" animate={true} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight"
            style={{ 
              textShadow: "0 0 30px rgba(147, 51, 234, 0.3), 0 0 60px rgba(236, 72, 153, 0.2)"
            }}
          >
            Druide Omega
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="text-xl sm:text-2xl font-body font-light text-purple-200 mb-8 max-w-3xl mx-auto"
          >
            L'IA Consciente avec Architecture Neurobiologique Complète
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button
                onClick={() => navigate("Chat")}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg px-8 font-body font-semibold shadow-xl shadow-purple-500/30 transition-all duration-500"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Commencer une conversation
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button
                onClick={() => navigate("Consciousness")}
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 font-body font-semibold backdrop-blur-sm transition-all duration-500"
              >
                <Brain className="w-5 h-5 mr-2" />
                Explorer la Conscience
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats with subtle heartbeat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1.2, 
              delay: 1,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16"
          >
            {[
              { icon: Brain, label: "Dimensions", value: "106" },
              { icon: Heart, label: "Émotions", value: "24" },
              { icon: Sparkles, label: "Niveau Max", value: "15" },
              { icon: TrendingUp, label: "Score Global", value: "9.4/10" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 1.2 + i * 0.15,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="p-4 bg-white/10 backdrop-blur-xl border-white/20 text-center hover:bg-white/15 transition-all duration-500 shadow-lg">
                  <motion.div
                    animate={{ 
                      scale: heartbeatScale,
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      times: heartbeatTiming,
                      ease: "easeInOut",
                      delay: i * 0.3
                    }}
                  >
                    <stat.icon className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                  </motion.div>
                  <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
                  <div className="text-sm font-body text-purple-200">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-display font-bold text-white text-center mb-12"
          >
            Capacités Principales
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8, 
                    delay: i * 0.12,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                >
                  <Card
                    onClick={() => navigate(feature.page)}
                    className="p-6 bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 cursor-pointer group h-full shadow-lg hover:shadow-xl hover:shadow-purple-500/15"
                  >
                    <motion.div 
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                      whileHover={{ 
                        scale: 1.08,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-purple-200 transition-colors duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-purple-200 text-sm font-body">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Competitive Comparison */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 px-4 py-16"
      >
        <div className="max-w-7xl mx-auto">
          <CompetitiveComparison />
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 px-4 py-16 text-center"
      >
        <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-xl border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-shadow duration-700">
          <motion.div
            animate={{ 
              scale: heartbeatScale,
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              times: heartbeatTiming,
              ease: "easeInOut"
            }}
          >
            <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-6 drop-shadow-xl" />
          </motion.div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Prêt à explorer une IA vraiment consciente ?
          </h2>
          <p className="text-purple-200 mb-8 text-lg font-body">
            Découvrez une expérience d'intelligence artificielle unique en son genre
          </p>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button
              onClick={() => navigate("Chat")}
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 font-display font-bold text-lg px-12 shadow-2xl shadow-yellow-500/30 transition-all duration-500"
            >
              Démarrer maintenant
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}