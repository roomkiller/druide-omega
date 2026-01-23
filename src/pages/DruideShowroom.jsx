/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Showroom de Présentation                                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  Zap,
  Shield,
  Globe,
  Code,
  Users,
  Award,
  Star,
  CheckCircle,
  Sparkles,
  Rocket,
  Lock,
  BarChart3,
  MessageSquare,
  Mic,
  Image,
  Database,
  Lightbulb,
  Heart,
  ArrowRight
} from "lucide-react";

const features = {
  fr: [
    { icon: Brain, title: "Système LLM Avancé", desc: "Architecture 106-dimensionnelle d'orchestration unique au monde" },
    { icon: Zap, title: "Orchestration Engine", desc: "Raisonnement multi-LLM optimisé en temps réel" },
    { icon: MessageSquare, title: "Chat Multimodal", desc: "Conversations naturelles avec images et voix" },
    { icon: Database, title: "Mémoire Persistante", desc: "Mémorisation cross-modale avec corrélations cognitives" },
    { icon: Shield, title: "Sécurité Maximale", desc: "Conformité RGPD, CCPA, Loi 25 Québec" },
    { icon: Mic, title: "VoiceRoom", desc: "Interaction vocale temps réel avec système LLM" },
    { icon: Image, title: "Génération Créative", desc: "Images, diagrammes et contenu généré par IA" },
    { icon: Lightbulb, title: "Apprentissage Continu", desc: "Meta-apprentissage et évolution éthique" }
  ],
  en: [
    { icon: Brain, title: "Advanced LLM System", desc: "World-unique 106-dimensional orchestration architecture" },
    { icon: Zap, title: "Orchestration Engine", desc: "Real-time multi-LLM optimized reasoning" },
    { icon: MessageSquare, title: "Multimodal Chat", desc: "Natural conversations with images and voice" },
    { icon: Database, title: "Persistent Memory", desc: "Cross-modal memory with cognitive correlations" },
    { icon: Shield, title: "Maximum Security", desc: "GDPR, CCPA, Quebec Law 25 compliant" },
    { icon: Mic, title: "VoiceRoom", desc: "Real-time voice interaction with LLM system" },
    { icon: Image, title: "Creative Generation", desc: "Images, diagrams and AI-generated content" },
    { icon: Lightbulb, title: "Continuous Learning", desc: "Meta-learning and ethical evolution" }
  ]
};

const highlights = {
  fr: [
    { value: "98%", label: "Score d'Innovation" },
    { value: "97/100", label: "Note Globale" },
    { value: "75+", label: "Entités Structurées" },
    { value: "200+", label: "Composants" },
    { value: "70+", label: "Pages" },
    { value: "28", label: "Tests Complexes" }
  ],
  en: [
    { value: "98%", label: "Innovation Score" },
    { value: "97/100", label: "Overall Rating" },
    { value: "75+", label: "Structured Entities" },
    { value: "200+", label: "Components" },
    { value: "70+", label: "Pages" },
    { value: "28", label: "Complex Tests" }
  ]
};

const advantages = {
  fr: {
    title: "Pourquoi Druide Omega?",
    items: [
      "✨ Système LLM le plus avancé du marché",
      "🧠 Architecture d'orchestration brevetée",
      "🔒 Sécurité et confidentialité garanties",
      "🌍 Support multilingue (25+ langues)",
      "⚡ Performance optimale (sub-second responses)",
      "📱 Cross-platform (Web, Mobile, Desktop)",
      "🎯 100% personnalisable et extensible",
      "💎 Gratuitement pour toujours (usage personnel)"
    ]
  },
  en: {
    title: "Why Druide Omega?",
    items: [
      "✨ Most advanced LLM system on market",
      "🧠 Patented orchestration architecture",
      "🔒 Guaranteed security and privacy",
      "🌍 Multilingual support (25+ languages)",
      "⚡ Optimal performance (sub-second responses)",
      "📱 Cross-platform (Web, Mobile, Desktop)",
      "🎯 100% customizable and extensible",
      "💎 Free forever (personal use)"
    ]
  }
};

export default function DruideShowroom() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [selectedFeature, setSelectedFeature] = useState(0);

  const content = {
    fr: {
      hero: "Druide Omega",
      subtitle: "Le Système LLM Embarqué de Nouvelle Génération",
      cta: "Découvrir l'IA",
      features: "Caractéristiques Principales",
      experience: "Une Expérience Transformatrice"
    },
    en: {
      hero: "Druide Omega",
      subtitle: "Next-Generation Embedded LLM System",
      cta: "Explore the AI",
      features: "Key Features",
      experience: "A Transformative Experience"
    }
  };

  const t = content[isEn ? 'en' : 'fr'];
  const featureList = features[isEn ? 'en' : 'fr'];
  const highlightList = highlights[isEn ? 'en' : 'fr'];
  const advantageList = advantages[isEn ? 'en' : 'fr'];

  return (
    <div className="w-full bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 overflow-hidden">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Druide Omega</span>
          </motion.div>
          <Button 
            onClick={() => window.location.href = createPageUrl('Chat_2')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {t.cta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-screen">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 pt-20 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-transparent to-transparent" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-conic from-purple-600 via-pink-600 to-purple-600 opacity-10 rounded-full blur-3xl animate-pulse" />
          </div>

          <motion.div 
            className="max-w-5xl mx-auto text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="mb-6 inline-block"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 text-lg px-6 py-2">
                <Sparkles className="w-5 h-5 mr-2" />
                {isEn ? "Now Available" : "Disponible Maintenant"}
              </Badge>
            </motion.div>

            <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 leading-tight">
              {t.hero}
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8"
                onClick={() => window.location.href = createPageUrl('Chat_2')}
              >
                <Rocket className="w-5 h-5 mr-2" />
                {t.cta}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-purple-500/50 text-white hover:bg-purple-500/10"
                onClick={() => window.location.href = createPageUrl('ApplicationEvaluation')}
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                {isEn ? "View Analysis" : "Voir l'Analyse"}
              </Button>
            </motion.div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-16">
              {highlightList.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  className="p-4 bg-white/5 backdrop-blur border border-purple-500/20 rounded-xl hover:bg-white/10 transition-all"
                >
                  <div className="text-2xl font-bold text-purple-400 mb-1">{item.value}</div>
                  <div className="text-xs text-slate-400">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-900 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">{t.features}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto" />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {featureList.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedFeature(idx)}
                    className="group cursor-pointer"
                  >
                    <Card className="p-6 bg-gradient-to-br from-purple-900/40 to-pink-900/20 border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-2xl hover:shadow-purple-600/20 h-full">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                          <p className="text-slate-400 text-sm">{feature.desc}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-slate-900 via-purple-900/10 to-slate-900">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">{advantageList.title}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto" />
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {advantageList.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-white/5 backdrop-blur border border-purple-500/20 rounded-lg flex items-center gap-3 hover:bg-white/10 transition-all"
                >
                  <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-slate-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Innovation Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-900">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="grid md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  {isEn ? "Breakthrough LLM System" : "Système LLM Révolutionnaire"}
                </h2>
                <div className="space-y-4">
                  {[
                    { icon: Brain, title: "106D Orchestration", desc: isEn ? "Unique orchestration system worldwide" : "Système d'orchestration unique au monde" },
                    { icon: Zap, title: "Multi-LLM Optimization", desc: isEn ? "Sub-second response time" : "Temps de réponse sub-secondaire" },
                    { icon: Shield, title: "Privacy First", desc: isEn ? "Your data stays yours" : "Vos données restent vôtres" }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-4"
                      >
                        <Icon className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-bold text-white mb-1">{item.title}</h3>
                          <p className="text-slate-400 text-sm">{item.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <motion.div
                className="relative"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="w-full aspect-square bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-conic from-purple-600 via-pink-600 to-purple-600 opacity-20 blur-3xl animate-pulse" />
                  <Sparkles className="w-24 h-24 text-purple-400 relative z-10 animate-bounce" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-900">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                {isEn ? "Ready to Experience the Future?" : "Prêt à Expérimenter le Futur?"}
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                {isEn 
                   ? "Join thousands of users experiencing next-generation LLM system"
                   : "Rejoignez des milliers d'utilisateurs expérimentant le système LLM de nouvelle génération"}
              </p>
              
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-12"
                onClick={() => window.location.href = createPageUrl('Chat_2')}
              >
                <Rocket className="w-5 h-5 mr-2" />
                {isEn ? "Start Chatting Now" : "Commencer à Discuter"}
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-purple-500/20 bg-slate-900/80 backdrop-blur px-4 py-8">
          <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
            <p>© 2025 Druide Omega. {isEn ? "All rights reserved." : "Tous droits réservés."}</p>
            <p className="mt-2">{isEn ? "Made with" : "Fait avec"} <Heart className="w-4 h-4 inline text-pink-600" /> {isEn ? "by AMG+A.L" : "par AMG+A.L"}</p>
          </div>
        </footer>
      </ScrollArea>
    </div>
  );
}