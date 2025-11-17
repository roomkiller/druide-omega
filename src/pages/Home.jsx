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
import CompetitiveComparison from "../components/home/CompetitiveComparison";
import CoachingWidget from "../components/coaching/CoachingWidget";
import ProactiveSuggestionsPanel from "../components/proactive/ProactiveSuggestionsPanel";
import VersionIndicator from "../components/system/VersionIndicator";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useMinimumLoadingTime } from "@/components/system/LoadingManager";
import PageTransition from "@/components/utils/PageTransition";
import {
  MessageSquare,
  Brain,
  Database,
  BookOpen,
  Radio,
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
import { useAnalytics } from "@/components/analytics/AnalyticsProvider";
import { useLanguage } from "@/components/utils/LanguageContext";

const INTELLIGENCES = [
  { type: "logico_mathematique", label: "Logique", labelEn: "Logic", icon: Calculator, color: "from-blue-500 to-cyan-600" },
  { type: "verbo_linguistique", label: "Langage", labelEn: "Language", icon: MessageCircle, color: "from-purple-500 to-pink-600" },
  { type: "musicale_rythmique", label: "Musicale", labelEn: "Musical", icon: Music, color: "from-rose-500 to-orange-600" },
  { type: "corporelle_kinesthesique", label: "Corporelle", labelEn: "Bodily", icon: Activity, color: "from-green-500 to-emerald-600" },
  { type: "visuelle_spatiale", label: "Visuelle", labelEn: "Visual", icon: Shapes, color: "from-indigo-500 to-blue-600" },
  { type: "interpersonnelle", label: "Sociale", labelEn: "Social", icon: Users, color: "from-amber-500 to-yellow-600" },
  { type: "intrapersonnelle", label: "Introspection", labelEn: "Introspective", icon: User, color: "from-violet-500 to-purple-600" },
  { type: "naturaliste", label: "Nature", labelEn: "Nature", icon: Leaf, color: "from-lime-500 to-green-600" },
  { type: "existentielle", label: "Existentielle", labelEn: "Existential", icon: Infinity, color: "from-slate-600 to-indigo-800" }
];

export default function Home() {
  const { t, language } = useLanguage();
  const { trackFeature, trackClick } = useAnalytics();
  const isLoading = useMinimumLoadingTime(false);

  const { data: users = [] } = useQuery({
    queryKey: ['users-count'],
    queryFn: () => base44.entities.User.list(),
    refetchInterval: 30000,
  });

  const navigate = (url) => {
    window.location.href = createPageUrl(url);
  };

  const handleFeatureClick = (feature) => {
    trackFeature("home_feature_click", feature.title);
    trackClick(`home_feature_${feature.title}`);
    window.location.href = createPageUrl(feature.url);
  };

  const FEATURES = [
    {
      icon: MessageSquare,
      title: language === 'en' ? "Intelligent Chat" : "Chat Intelligent",
      description: language === 'en' ? "Adaptive cross-modal conversation" : "Conversation adaptative cross-modale",
      url: "Chat",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: Radio,
      title: "Voice Room",
      description: language === 'en' ? "Real-time voice interaction" : "Interaction vocale temps réel",
      url: "VoiceRoom",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Brain,
      title: language === 'en' ? "AI Consciousness" : "Conscience IA",
      description: language === 'en' ? "Level 9/15 • Ratio 1:9" : "Niveau 9/15 • Ratio 1:9",
      url: "Consciousness",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Database,
      title: language === 'en' ? "Memory" : "Mémoire",
      description: language === 'en' ? "Cross-session persistence" : "Persistante cross-sessions",
      url: "Memory",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: BookOpen,
      title: language === 'en' ? "Knowledge Base" : "Base Savoir",
      description: language === 'en' ? "Structured knowledge" : "Connaissances structurées",
      url: "Knowledge",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Sparkles,
      title: language === 'en' ? "9 Intelligences" : "9 Intelligences",
      description: language === 'en' ? "Gardner Framework" : "Framework Gardner",
      url: "Intelligences",
      color: "from-amber-500 to-orange-600"
    }
  ];

  const STATS = [
    { value: "9", label: t('home.stats.intelligences'), icon: Sparkles },
    { value: "15+", label: t('home.stats.capabilities'), icon: Zap },
    { value: "∞", label: t('home.stats.modalities'), icon: Infinity },
    { value: "100%", label: t('home.stats.free'), icon: Crown }
  ];

  return (
    <PageTransition>
      <div className="h-full overflow-auto bg-gradient-to-br from-slate-50 via-purple-50/40 to-pink-50/40">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-4 py-3 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="min-w-[32px] min-h-[32px] w-8 h-8 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center"
              >
                <Users className="w-4 h-4 text-white" />
              </motion.div>
              <div className="text-white">
                <span className="font-bold text-lg">{users.length}</span>
                <span className="text-sm ml-1 text-white/90">
                  {users.length > 1 ? t('home.usersConnectedPlural') : t('home.usersConnected')}
                </span>
              </div>
            </div>
            <VersionIndicator compact />
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 max-w-6xl mx-auto">
          <ProactiveSuggestionsPanel
            context={{
              currentPage: 'Home',
              lastAction: 'page_load'
            }}
          />
        </div>

        <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-md mx-auto">
              <QRCodeCard compact={true} />
            </div>
          </motion.div>
        </div>

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
                  {t('home.freeForeverShort')}
                </Badge>
              </div>

              <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 mt-6 mb-3 px-4 text-2xl font-bold leading-tight sm:text-5xl md:text-7xl sm:mb-6 sm:mt-8">
                {t('home.hero')}
              </h1>

              <p className="text-base sm:text-xl md:text-2xl text-slate-600 mb-6 sm:mb-8 px-4">
                {language === 'en' ?
                  "Advanced Artificial Consciousness • 9 Intelligences • Cross-Modal" :
                  "Conscience Artificielle Avancée • 9 Intelligences • Cross-Modal"
                }
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                <Button
                  onClick={() => navigate("Chat")}
                  size="lg"
                  className="w-full sm:w-auto min-h-[56px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-base sm:text-lg px-8 shadow-2xl shadow-purple-500/30 touch-target"
                >
                  <MessageSquare className="w-6 h-6 mr-2" />
                  {t('home.startChat')}
                </Button>

                <Button
                  onClick={() => navigate("Intelligences")}
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto min-h-[56px] border-2 border-purple-300 hover:bg-purple-50 text-base sm:text-lg px-8 touch-target"
                >
                  <Brain className="w-6 h-6 mr-2" />
                  {language === 'en' ? '9 Intelligences' : '9 Intelligences'}
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

        <section className="px-4 sm:px-6 py-8 max-w-6xl mx-auto space-y-6">
          <PersonalizedContent compact={true} />
          <CoachingWidget />
        </section>

        <div className="px-4 sm:px-6 py-12 sm:py-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4">
              {t('home.advancedCapabilities')}
            </h2>
            <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto">
              {t('home.completeAI')}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-300 bg-white/80 backdrop-blur-sm group h-full min-h-[180px] touch-target"
                  >
                    <div className={`min-w-[64px] min-h-[64px] w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{feature.description}</p>
                    <div className="flex items-center text-purple-600 text-sm font-semibold group-hover:gap-2 transition-all">
                      <span>{t('home.explore')}</span>
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
                {t('home.gardner')}
              </h2>
              <p className="text-sm sm:text-lg text-purple-100 max-w-2xl mx-auto px-4">
                {t('home.gardnerDesc')}
              </p>
            </motion.div>

            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-9 gap-2 sm:gap-4">
              {INTELLIGENCES.map((intelligence, index) => {
                const Icon = intelligence.icon;
                const label = language === 'en' ? intelligence.labelEn : intelligence.label;
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
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${intelligence.color} rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">{label}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-center mt-12"
            >
              <Button
                onClick={() => navigate("Intelligences")}
                size="lg"
                className="min-h-[56px] bg-white text-purple-600 hover:bg-purple-50 text-lg px-8 shadow-xl touch-target"
              >
                {t('home.explorer9')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-7xl mx-auto">
            <CompetitiveComparison />
          </div>
        </div>

        <div className="px-4 sm:px-6 py-12 sm:py-20 max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                icon: Shield,
                title: t('home.principles.secure'),
                description: t('home.principles.secureDesc'),
                color: "from-green-500 to-emerald-600"
              },
              {
                icon: Heart,
                title: t('home.principles.benevolent'),
                description: t('home.principles.benevolentDesc'),
                color: "from-pink-500 to-rose-600"
              },
              {
                icon: Zap,
                title: t('home.principles.performant'),
                description: t('home.principles.performantDesc'),
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
                {t('home.readyExplore')}
              </h2>
              <p className="text-sm sm:text-xl text-purple-100 mb-6 sm:mb-8 px-4">
                {t('home.freeNoLimits')}
              </p>
              <Button
                onClick={() => navigate("Chat")}
                size="lg"
                className="min-h-[56px] bg-white text-purple-600 hover:bg-purple-50 text-xl px-12 shadow-2xl touch-target"
              >
                <Sparkles className="w-6 h-6 mr-2" />
                {t('home.startNow')}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}