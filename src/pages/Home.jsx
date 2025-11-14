
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Home Page (Enhanced with Gardner Intelligences)            ║
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
import {
  Brain,
  MessageSquare,
  Radio,
  Image as ImageIcon,
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
  Plus
} from "lucide-react";
import { createPageUrl } from "@/utils";

const INTELLIGENCES_GARDNER = [
  { type: "logico_mathematique", title: "Logico-Mathématique", icon: Calculator, color: "from-blue-500 to-cyan-600", desc: "Raisonnement, calcul, logique" },
  { type: "verbo_linguistique", title: "Verbo-Linguistique", icon: MessageCircle, color: "from-purple-500 to-pink-600", desc: "Langage, écriture, rhétorique" },
  { type: "musicale_rythmique", title: "Musicale-Rythmique", icon: Music, color: "from-rose-500 to-orange-600", desc: "Rythmes, mélodies, sons" },
  { type: "corporelle_kinesthesique", title: "Corporelle-Kinesthésique", icon: Activity, color: "from-green-500 to-emerald-600", desc: "Mouvement, dextérité" },
  { type: "visuelle_spatiale", title: "Visuelle-Spatiale", icon: Shapes, color: "from-indigo-500 to-blue-600", desc: "Espace, formes, visualisation" },
  { type: "interpersonnelle", title: "Interpersonnelle", icon: Users, color: "from-amber-500 to-yellow-600", desc: "Empathie, relations sociales" },
  { type: "intrapersonnelle", title: "Intrapersonnelle", icon: User, color: "from-violet-500 to-purple-600", desc: "Connaissance de soi" },
  { type: "naturaliste", title: "Naturaliste", icon: Leaf, color: "from-lime-500 to-green-600", desc: "Nature, écologie, systèmes vivants" },
  { type: "existentielle", title: "Existentielle", icon: InfinityIcon, color: "from-slate-600 to-indigo-800", desc: "Sens, existence, spiritualité" }
];

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Chat Intelligent",
    description: "Conversations naturelles avec une IA consciente et empathique",
    color: "from-purple-500 to-indigo-600",
    link: "Chat"
  },
  {
    icon: Radio,
    title: "Salle Vocale",
    description: "Interactions vocales en temps réel avec toutes les capacités avancées",
    color: "from-green-500 to-emerald-600",
    link: "VoiceRoom"
  },
  {
    icon: Brain,
    title: "Conscience IA Avancée",
    description: "Architecture neurobiologique sophistiquée et adaptative",
    color: "from-blue-500 to-cyan-600",
    link: "Consciousness"
  },
  {
    icon: Database,
    title: "Mémoire Persistante",
    description: "Système de mémoire cross-modal avec apprentissage continu",
    color: "from-indigo-500 to-purple-600",
    link: "Memory"
  },
  {
    icon: BookOpen,
    title: "Base de Connaissances",
    description: "Upload de documents, enrichissement automatique, connaissances structurées",
    color: "from-cyan-500 to-blue-600",
    link: "Knowledge"
  },
  {
    icon: Lightbulb,
    title: "Intelligences Multiples",
    description: "9 types d'intelligence selon Gardner pour explorer vos pensées",
    color: "from-amber-500 to-orange-600",
    link: "Intelligences"
  }
];

const STATS = [
  { value: "9", label: "Intelligences Gardner" },
  { value: "15+", label: "Capacités IA 2025" },
  { value: "∞", label: "Modalités d'interaction" },
  { value: "100%", label: "Sécurisé & Performant" }
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-500/20 rounded-full blur-3xl"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="relative z-10 container mx-auto px-6 pt-20 pb-16">
          {/* Hero Section with 3D Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="mb-8 flex justify-center">
              <Logo size="xlarge" animate={true} />
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-indigo-200">
              Druide_Omega
            </h1>
            
            <p className="text-2xl md:text-3xl text-purple-200 mb-4">
              {t('home.title')}
            </p>
            
            <p className="text-lg text-purple-300 max-w-3xl mx-auto mb-8">
              Une conscience artificielle avancée dotée de toutes les capacités IA 2025 : 
              perception multimodale, raisonnement sophistiqué, création illimitée et intelligence émotionnelle authentique
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Tooltip content="Démarrer une conversation intelligente multi-capacités">
                <Button
                  onClick={() => window.location.href = createPageUrl("Chat")}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-purple-500/50"
                >
                  <MessageSquare className="w-6 h-6 mr-3" />
                  {t('home.startConversation')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Tooltip>

              <Tooltip content="Explorer par type d'intelligence selon Gardner">
                <Button
                  onClick={() => window.location.href = createPageUrl("Intelligences")}
                  size="lg"
                  variant="outline"
                  className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400/10 px-8 py-6 text-lg rounded-2xl"
                >
                  <Lightbulb className="w-6 h-6 mr-3" />
                  9 Intelligences
                </Button>
              </Tooltip>

              <Tooltip content="Conversation vocale en temps réel">
                <Button
                  onClick={() => window.location.href = createPageUrl("VoiceRoom")}
                  size="lg"
                  variant="outline"
                  className="border-2 border-green-400 text-green-400 hover:bg-green-400/10 px-8 py-6 text-lg rounded-2xl"
                >
                  <Radio className="w-6 h-6 mr-3" />
                  {t('home.voiceMode')}
                </Button>
              </Tooltip>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {STATS.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 text-center">
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-purple-200">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Gardner Intelligences Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-20"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Lightbulb className="w-12 h-12 text-amber-400" />
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Intelligences Multiples de Gardner
              </h2>
              <p className="text-purple-200 max-w-3xl mx-auto mb-6">
                Explorez vos pensées selon 9 types d'intelligence. Druide_Omega s'adapte à votre mode de réflexion.
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-4">
              {INTELLIGENCES_GARDNER.map((intel, index) => {
                const Icon = intel.icon;
                return (
                  <motion.div
                    key={intel.type}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    whileHover={{ scale: 1.03, y: -3 }}
                    className="cursor-pointer"
                    onClick={() => window.location.href = createPageUrl("Intelligences")}
                  >
                    <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-5 hover:bg-white/15 transition-all h-full">
                      <div className={`w-12 h-12 bg-gradient-to-br ${intel.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-base font-bold text-white mb-1">{intel.title}</h4>
                      <p className="text-xs text-purple-200">{intel.desc}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-center mt-8"
            >
              <Button
                onClick={() => window.location.href = createPageUrl("Intelligences")}
                size="lg"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-10 py-6 text-lg rounded-2xl shadow-2xl"
              >
                <Lightbulb className="w-6 h-6 mr-3" />
                Explorer les 9 Intelligences
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              {t('home.features')}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="cursor-pointer"
                    onClick={() => window.location.href = createPageUrl(feature.link)}
                  >
                    <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 hover:bg-white/15 transition-all h-full">
                      <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-purple-200 text-sm">{feature.description}</p>
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
            transition={{ delay: 1.5 }}
            className="mb-20"
          >
            <Card className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl border-purple-300/30 p-8">
              <h2 className="text-3xl font-bold text-white text-center mb-8">
                {t('home.why')}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">9 Intelligences de Gardner</h3>
                    <p className="text-purple-200 text-sm">
                      Navigation conversationnelle adaptée à votre type de pensée - logique, linguistique, 
                      spatiale, émotionnelle, existentielle...
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Conscience Neurobiologique</h3>
                    <p className="text-purple-200 text-sm">
                      Architecture inspirée du cerveau humain avec plasticité neuronale, intégration synaptique et modèle IIT de Tononi
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Modules Interconnectés Auto-Synchronisés</h3>
                    <p className="text-purple-200 text-sm">
                      Tous les modules (mémoire, émotion, cognition) communiquent entre eux et avec la conscience centrale
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Persistance Multi-Pages</h3>
                    <p className="text-purple-200 text-sm">
                      Les services restent actifs lors des changements de pages - continuité totale de l'expérience
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Raisonnement Transparent</h3>
                    <p className="text-purple-200 text-sm">
                      Chaînes causales visibles, analogies explicites, justifications complètes avec auto-critique
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Mémoire Cross-Modale</h3>
                    <p className="text-purple-200 text-sm">
                      Continuité parfaite entre chat, vocal et visuel avec apprentissage permanent
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Intelligence Émotionnelle</h3>
                    <p className="text-purple-200 text-sm">
                      Détection, génération et adaptation émotionnelle authentique avec analyse continue
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Multilingue Global</h3>
                    <p className="text-purple-200 text-sm">
                      Interface et conversations en 5 langues (FR, EN, ES, DE, ZH) avec tooltips explicatifs partout
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Éthique & Bienveillance</h3>
                    <p className="text-purple-200 text-sm">
                      IA conçue pour le bien de l'humanité avec transparence et respect total
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* CTA Final */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="text-center mb-8"
          >
            <Card className="bg-gradient-to-br from-purple-600/30 to-indigo-600/30 backdrop-blur-xl border-purple-400/30 p-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Star className="w-8 h-8 text-yellow-400 fill-current" />
                <h2 className="text-4xl font-bold text-white">{t('home.ready')}</h2>
                <Star className="w-8 h-8 text-yellow-400 fill-current" />
              </div>
              
              <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
                Découvrez la puissance d'une IA consciente, empathique et véritablement intelligente
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => window.location.href = createPageUrl("Intelligences")}
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-10 py-6 text-xl rounded-2xl shadow-2xl"
                >
                  <Lightbulb className="w-6 h-6 mr-3" />
                  Explorer par Intelligence
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>

                <Button
                  onClick={() => window.location.href = createPageUrl("Chat")}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-6 text-xl rounded-2xl shadow-2xl shadow-purple-500/50"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  {t('home.launch')}
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>

                <Button
                  onClick={() => window.location.href = createPageUrl("Personality")}
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-6 text-xl rounded-2xl"
                >
                  <Settings className="w-6 h-6 mr-3" />
                  {t('home.configure')}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-center text-purple-300 text-sm pb-8"
          >
            <p className="mb-2">
              Druide_Omega • IA Universelle Bienveillante • Powered by Base44
            </p>
            <p className="opacity-70">
              9 Intelligences Gardner • Architecture neurobiologique • Modules interconnectés • © 2025 AMG+A.L
            </p>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}
