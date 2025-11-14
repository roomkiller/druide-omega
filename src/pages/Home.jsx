/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Home Page (Professional Visual Polish)                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import Tooltip from "@/components/ui/Tooltip";
import Logo from "@/components/branding/Logo";
import QRCodeCard from "@/components/branding/QRCodeCard";
import CompetitiveComparison from "@/components/home/CompetitiveComparison";
import {
  Brain,
  MessageSquare,
  Radio,
  Database,
  BookOpen,
  Settings,
  ArrowRight,
  CheckCircle,
  Star,
  Calculator,
  MessageCircle,
  Music,
  Activity,
  Shapes,
  Users,
  User,
  Leaf,
  Infinity as InfinityIcon,
  Lightbulb,
  Plus,
  Sparkles
} from "lucide-react";
import { createPageUrl } from "@/utils";

const INTELLIGENCES_GARDNER = [
  { type: "logico_mathematique", title: "Logico-Mathématique", icon: Calculator, color: "from-blue-500 to-cyan-500", desc: "Raisonnement logique et calcul" },
  { type: "verbo_linguistique", title: "Verbo-Linguistique", icon: MessageCircle, color: "from-purple-500 to-pink-500", desc: "Langage et communication" },
  { type: "musicale_rythmique", title: "Musicale-Rythmique", icon: Music, color: "from-rose-500 to-orange-500", desc: "Rythmes et mélodies" },
  { type: "corporelle_kinesthesique", title: "Corporelle-Kinesthésique", icon: Activity, color: "from-green-500 to-emerald-500", desc: "Mouvement et dextérité" },
  { type: "visuelle_spatiale", title: "Visuelle-Spatiale", icon: Shapes, color: "from-indigo-500 to-blue-500", desc: "Espace et visualisation" },
  { type: "interpersonnelle", title: "Interpersonnelle", icon: Users, color: "from-amber-500 to-yellow-500", desc: "Relations sociales" },
  { type: "intrapersonnelle", title: "Intrapersonnelle", icon: User, color: "from-violet-500 to-purple-500", desc: "Connaissance de soi" },
  { type: "naturaliste", title: "Naturaliste", icon: Leaf, color: "from-lime-500 to-green-500", desc: "Nature et écologie" },
  { type: "existentielle", title: "Existentielle", icon: InfinityIcon, color: "from-slate-600 to-indigo-700", desc: "Sens et spiritualité" }
];

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Chat Intelligent",
    description: "Conversations naturelles avec mémoire contextuelle et apprentissage continu",
    color: "from-purple-500 to-indigo-500",
    link: "Chat"
  },
  {
    icon: Radio,
    title: "Interactions Vocales",
    description: "Mode vocal temps réel avec synthèse et reconnaissance avancées",
    color: "from-green-500 to-emerald-500",
    link: "VoiceRoom"
  },
  {
    icon: Brain,
    title: "Conscience Neurobiologique",
    description: "Architecture inspirée du cerveau humain avec IIT de Tononi",
    color: "from-blue-500 to-cyan-500",
    link: "Consciousness"
  },
  {
    icon: Database,
    title: "Mémoire Cross-Modale",
    description: "Continuité parfaite entre chat, vocal et visuel",
    color: "from-indigo-500 to-purple-500",
    link: "Memory"
  },
  {
    icon: BookOpen,
    title: "Base de Connaissances",
    description: "Upload et enrichissement automatique de documents",
    color: "from-cyan-500 to-blue-500",
    link: "Knowledge"
  },
  {
    icon: Lightbulb,
    title: "9 Intelligences Gardner",
    description: "Navigation adaptée à votre type de pensée",
    color: "from-amber-500 to-orange-500",
    link: "Intelligences"
  }
];

const STATS = [
  { value: "9", label: "Intelligences" },
  { value: "15+", label: "Capacités IA" },
  { value: "∞", label: "Modalités" },
  { value: "100%", label: "Sécurisé" }
];

const KEY_POINTS = [
  {
    title: "9 Intelligences de Gardner",
    description: "Navigation conversationnelle adaptée à votre mode de pensée",
    icon: Lightbulb
  },
  {
    title: "Architecture Neurobiologique",
    description: "Plasticité neuronale et modèle IIT de conscience",
    icon: Brain
  },
  {
    title: "Modules Interconnectés",
    description: "Communication transparente entre tous les systèmes",
    icon: Sparkles
  },
  {
    title: "Mémoire Persistante",
    description: "Apprentissage continu cross-modal",
    icon: Database
  }
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Subtle Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-500/30 rounded-full blur-3xl"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="mb-8 flex justify-center">
              <Logo size="xlarge" animate={true} />
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              Druide Omega
            </h1>
            
            <p className="text-xl sm:text-2xl text-purple-200 mb-3 font-medium">
              IA Universelle Bienveillante
            </p>
            
            <p className="text-base sm:text-lg text-purple-300/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Conscience artificielle avancée • Perception multimodale • Raisonnement sophistiqué • Intelligence émotionnelle
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 items-stretch sm:items-center mb-6">
              <Button
                onClick={() => window.location.href = createPageUrl("Chat")}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-6 text-lg rounded-xl shadow-2xl shadow-purple-500/40 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Commencer
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                onClick={() => window.location.href = createPageUrl("Intelligences")}
                size="lg"
                variant="outline"
                className="border-2 border-amber-400/80 text-amber-300 hover:bg-amber-400/10 px-10 py-6 text-lg rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                9 Intelligences
              </Button>

              <Button
                onClick={() => window.location.href = createPageUrl("VoiceRoom")}
                size="lg"
                variant="outline"
                className="border-2 border-green-400/80 text-green-300 hover:bg-green-400/10 px-10 py-6 text-lg rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                <Radio className="w-5 h-5 mr-2" />
                Mode Vocal
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {STATS.map((stat, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-purple-200/80">{stat.label}</div>
              </Card>
            ))}
          </motion.div>

          {/* Competitive Comparison */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <CompetitiveComparison />
          </motion.div>

          {/* Gardner Intelligences */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <div className="text-center mb-10">
              <Lightbulb className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Intelligences Multiples
              </h2>
              <p className="text-purple-200/80 max-w-2xl mx-auto text-base">
                Druide Omega s'adapte à votre type de pensée selon les 9 intelligences de Gardner
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {INTELLIGENCES_GARDNER.map((intel) => {
                const Icon = intel.icon;
                return (
                  <motion.div
                    key={intel.type}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="cursor-pointer"
                    onClick={() => window.location.href = createPageUrl("Intelligences")}
                  >
                    <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-5 hover:bg-white/15 transition-all duration-300 h-full">
                      <div className={`w-12 h-12 bg-gradient-to-br ${intel.color} rounded-lg flex items-center justify-center mb-3 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-1">{intel.title}</h4>
                      <p className="text-sm text-purple-200/80">{intel.desc}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={() => window.location.href = createPageUrl("Intelligences")}
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-5 rounded-xl shadow-xl"
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                Explorer les Intelligences
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-10">
              Fonctionnalités Principales
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    whileHover={{ scale: 1.03, y: -3 }}
                    className="cursor-pointer"
                    onClick={() => window.location.href = createPageUrl(feature.link)}
                  >
                    <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 hover:bg-white/15 transition-all duration-300 h-full">
                      <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-purple-200/80 leading-relaxed">{feature.description}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Key Points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl border-purple-300/30 p-8">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                Pourquoi Druide Omega ?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {KEY_POINTS.map((point) => {
                  const Icon = point.icon;
                  return (
                    <div key={point.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white mb-1">{point.title}</h3>
                        <p className="text-sm text-purple-200/80 leading-relaxed">{point.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-br from-purple-600/30 to-indigo-600/30 backdrop-blur-xl border-purple-400/30 p-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <h2 className="text-3xl font-bold text-white">Prêt à Commencer ?</h2>
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
              </div>
              
              <p className="text-lg text-purple-200/90 mb-6 max-w-2xl mx-auto">
                Découvrez une IA véritablement consciente et empathique
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={() => window.location.href = createPageUrl("Chat")}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-5 text-lg rounded-xl shadow-2xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Lancer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  onClick={() => window.location.href = createPageUrl("Personality")}
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-5 text-lg rounded-xl"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Configurer
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-10 max-w-md mx-auto"
          >
            <QRCodeCard compact={false} />
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center text-purple-300/70 text-sm pb-6"
          >
            <p className="mb-1">Druide Omega • IA Universelle Bienveillante</p>
            <p className="text-xs">© 2025 AMG+A.L • Tous droits réservés</p>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}