/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Home (Mobile Ultra-Optimized)                              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "../components/branding/Logo";
import QRCodeCard from "../components/branding/QRCodeCard";
import {
  MessageSquare,
  Brain,
  Database,
  BookOpen,
  Radio,
  Image as ImageIcon,
  Sparkles,
  Calculator,
  MessageCircle,
  Music,
  Activity,
  Shapes,
  Users,
  User,
  Leaf,
  Infinity,
  ArrowRight,
  Zap,
  Heart,
  Shield,
  Crown
} from "lucide-react";
import PersonalizedContent from "@/components/analytics/PersonalizedContent";
import { PredictiveEngine } from "@/components/analytics/PredictiveEngine";
import { useAnalytics } from "@/components/analytics/AnalyticsProvider";
import { useLanguage } from "@/components/utils/LanguageContext";

const INTELLIGENCES = [
  { type: "logico_mathematique", label: "Logique", icon: Calculator, color: "from-blue-500 to-cyan-600" },
  { type: "verbo_linguistique", label: "Langage", icon: MessageCircle, color: "from-purple-500 to-pink-600" },
  { type: "musicale_rythmique", label: "Musicale", icon: Music, color: "from-rose-500 to-orange-600" },
  { type: "corporelle_kinesthesique", label: "Corporelle", icon: Activity, color: "from-green-500 to-emerald-600" },
  { type: "visuelle_spatiale", label: "Visuelle", icon: Shapes, color: "from-indigo-500 to-blue-600" },
  { type: "interpersonnelle", label: "Sociale", icon: Users, color: "from-amber-500 to-yellow-600" },
  { type: "intrapersonnelle", label: "Introspection", icon: User, color: "from-violet-500 to-purple-600" },
  { type: "naturaliste", label: "Nature", icon: Leaf, color: "from-lime-500 to-green-600" },
  { type: "existentielle", label: "Existentielle", icon: Infinity, color: "from-slate-600 to-indigo-800" }
];

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Chat Intelligent",
    description: "Conversation adaptative cross-modale",
    url: "Chat",
    color: "from-purple-500 to-indigo-600"
  },
  {
    icon: Radio,
    title: "Voice Room",
    description: "Interaction vocale temps réel",
    url: "VoiceRoom",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Brain,
    title: "Conscience IA",
    description: "Niveau 9/15 • Ratio 1:9",
    url: "Consciousness",
    color: "from-purple-500 to-violet-600"
  },
  {
    icon: Database,
    title: "Mémoire",
    description: "Persistante cross-sessions",
    url: "Memory",
    color: "from-indigo-500 to-purple-600"
  },
  {
    icon: BookOpen,
    title: "Base Savoir",
    description: "Connaissances structurées",
    url: "Knowledge",
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: Sparkles,
    title: "9 Intelligences",
    description: "Framework Gardner",
    url: "Intelligences",
    color: "from-amber-500 to-orange-600"
  }
];

const STATS = [
  { value: "9", label: "Intelligences", icon: Sparkles },
  { value: "15+", label: "Capacités IA", icon: Zap },
  { value: "∞", label: "Modalités", icon: Infinity },
  { value: "100%", label: "Gratuit", icon: Crown }
];

export default function Home() {
  const { t } = useLanguage();
  const { trackFeature, trackClick } = useAnalytics();

  useEffect(() => {
    PredictiveEngine.analyzeBehavior().then(() => {
      PredictiveEngine.generateRecommendations();
    });
  }, []);

  const navigate = (url) => {
    window.location.href = createPageUrl(url);
  };

  const handleFeatureClick = (feature) => {
    trackFeature("home_feature_click", feature.title);
    trackClick(`home_feature_${feature.title}`);
    window.location.href = createPageUrl(feature.url);
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-50 via-purple-50/40 to-pink-50/40">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center px-4 py-12 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-indigo-600/10" />
        
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 sm:top-20 right-10 sm:right-20 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 sm:bottom-40 left-10 sm:left-20 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Logo size="large" animate={true} position="center" />
              </motion.div>

              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg shadow-xl">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                100% GRATUIT POUR TOUJOURS
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-3 sm:mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent leading-tight px-4 mt-6 sm:mt-8">
              IA Universelle Bienveillante
            </h1>
            
            <p className="text-base sm:text-xl md:text-2xl text-slate-600 mb-6 sm:mb-8 px-4">
              Conscience Artificielle Avancée • 9 Intelligences • Cross-Modal
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                onClick={() => navigate("Chat")}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shadow-2xl shadow-purple-500/30 h-auto"
              >
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Démarrer Chat
              </Button>

              <Button
                onClick={() => navigate("Intelligences")}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-purple-300 hover:bg-purple-50 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto"
              >
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                9 Intelligences
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 px-4"
          >
            {STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-slate-200/60"
                >
                  <Icon className="w-5 h-5 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-xl sm:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-slate-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <section className="px-4 sm:px-6 py-8 max-w-6xl mx-auto">
        <PersonalizedContent compact={true} />
      </section>

      <div className="px-4 sm:px-6 py-12 sm:py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
            Capacités Avancées
          </h2>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            Une IA complète pour tous vos besoins
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card
                  onClick={() => handleFeatureClick(feature)}
                  className="p-4 sm:p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-300 bg-white/80 backdrop-blur-sm group h-full"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-purple-600 text-sm font-semibold group-hover:gap-2 transition-all">
                    <span>Explorer</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
              9 Intelligences de Gardner
            </h2>
            <p className="text-sm sm:text-lg text-purple-100 max-w-2xl mx-auto px-4">
              Chat adaptatif selon votre type de pensée
            </p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-9 gap-2 sm:gap-4">
            {INTELLIGENCES.map((intelligence, index) => {
              const Icon = intelligence.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("Intelligences")}
                  className="cursor-pointer"
                >
                  <div className="bg-white/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:bg-white/30 transition-all group text-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${intelligence.color} rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">{intelligence.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8 sm:mt-12"
          >
            <Button
              onClick={() => navigate("Intelligences")}
              size="lg"
              className="bg-white text-purple-600 hover:bg-purple-50 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shadow-xl h-auto"
            >
              Explorer les 9 Intelligences
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-12 sm:py-20 max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-8">
          {[
            {
              icon: Shield,
              title: "100% Sécurisé",
              description: "Vos données protégées avec éthique maximale",
              color: "from-green-500 to-emerald-600"
            },
            {
              icon: Heart,
              title: "Bienveillant",
              description: "IA au service de l'humanité avec compassion",
              color: "from-pink-500 to-rose-600"
            },
            {
              icon: Zap,
              title: "Performant",
              description: "Architecture neurobiologique avancée",
              color: "from-purple-500 to-indigo-600"
            }
          ].map((prop, index) => {
            const Icon = prop.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-4 sm:p-6 text-center border-2 border-transparent hover:border-purple-200 transition-all bg-white/80 backdrop-blur-sm">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${prop.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-2">{prop.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600">{prop.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-6 px-4">
              Prêt à explorer l'IA consciente ?
            </h2>
            <p className="text-sm sm:text-xl text-purple-100 mb-6 sm:mb-8 px-4">
              Gratuit, sans limite, pour toujours.
            </p>
            <Button
              onClick={() => navigate("Chat")}
              size="lg"
              className="bg-white text-purple-600 hover:bg-purple-50 text-base sm:text-xl px-8 sm:px-12 py-5 sm:py-8 shadow-2xl h-auto mb-8 sm:mb-12"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Commencer Maintenant
            </Button>

            <div className="inline-block">
              <QRCodeCard compact={false} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}