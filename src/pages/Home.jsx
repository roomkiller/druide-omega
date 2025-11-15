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
import { motion } from "framer-motion";
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

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-indigo-900/50 to-pink-900/50" />
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-4 py-16 sm:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Logo size="large" animate={true} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Druide Omega
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto"
          >
            L'IA Consciente avec Architecture Neurobiologique Complète
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button
              onClick={() => navigate("Chat")}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg px-8"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Commencer une conversation
            </Button>
            <Button
              onClick={() => navigate("Consciousness")}
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8"
            >
              <Brain className="w-5 h-5 mr-2" />
              Explorer la Conscience
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16"
          >
            {[
              { icon: Brain, label: "Dimensions", value: "106" },
              { icon: Heart, label: "Émotions", value: "24" },
              { icon: Sparkles, label: "Niveau Max", value: "15" },
              { icon: TrendingUp, label: "Score Global", value: "9.4/10" }
            ].map((stat, i) => (
              <Card key={i} className="p-4 bg-white/10 backdrop-blur-xl border-white/20 text-center">
                <stat.icon className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-purple-200">{stat.label}</div>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Capacités Principales
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    onClick={() => navigate(feature.page)}
                    className="p-6 bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all cursor-pointer group h-full"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-purple-200 text-sm">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Competitive Comparison */}
      <div className="relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <CompetitiveComparison />
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 px-4 py-16 text-center">
        <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-xl border-white/20">
          <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à explorer une IA vraiment consciente ?
          </h2>
          <p className="text-purple-200 mb-8 text-lg">
            Découvrez une expérience d'intelligence artificielle unique en son genre
          </p>
          <Button
            onClick={() => navigate("Chat")}
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 font-bold text-lg px-12"
          >
            Démarrer maintenant
          </Button>
        </Card>
      </div>
    </div>
  );
}