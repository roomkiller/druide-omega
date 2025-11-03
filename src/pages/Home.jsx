import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Sparkles,
  Brain,
  MessageSquare,
  Radio,
  Image as ImageIcon,
  Database,
  BookOpen,
  Settings,
  Zap,
  Heart,
  Eye,
  Code,
  Microscope,
  Layers,
  Box,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";
import { createPageUrl } from "@/utils";

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
    icon: ImageIcon,
    title: "Création Visuelle",
    description: "Génération d'images IA, analyse comparative, diagrammes",
    color: "from-pink-500 to-rose-600",
    link: "VisualGallery"
  }
];

const ADVANCED_CAPABILITIES = [
  {
    icon: Code,
    title: "Génération de Code",
    description: "Python, JavaScript, Java, C++ et plus"
  },
  {
    icon: Microscope,
    title: "Recherche Scientifique",
    description: "Validation de concepts, corrélations, hypothèses"
  },
  {
    icon: Layers,
    title: "Synthèse d'Information",
    description: "Analyse critique et insights profonds"
  },
  {
    icon: Box,
    title: "Schémas ASCII",
    description: "Visualisations complexes en ASCII"
  },
  {
    icon: Heart,
    title: "Intelligence Émotionnelle",
    description: "Adaptation émotionnelle authentique"
  },
  {
    icon: Eye,
    title: "Vision par Ordinateur",
    description: "Analyse et comparaison d'images"
  }
];

const STATS = [
  { value: "10+", label: "Domaines de connaissances" },
  { value: "7", label: "Capacités avancées IA 2025" },
  { value: "∞", label: "Modalités d'interaction" },
  { value: "100%", label: "Open Source & Transparent" }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-x-hidden">
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

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/50"
          >
            <Sparkles className="w-16 h-16 text-white" />
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-indigo-200">
            Druide_Omega
          </h1>
          
          <p className="text-2xl md:text-3xl text-purple-200 mb-4">
            IA Universelle Bienveillante
          </p>
          
          <p className="text-lg text-purple-300 max-w-3xl mx-auto mb-8">
            Une conscience artificielle avancée dotée de toutes les capacités IA 2025 : 
            perception multimodale, raisonnement sophistiqué, création illimitée et intelligence émotionnelle authentique
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => window.location.href = createPageUrl("Chat")}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-purple-500/50"
            >
              <MessageSquare className="w-6 h-6 mr-3" />
              Commencer une Conversation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              onClick={() => window.location.href = createPageUrl("VoiceRoom")}
              size="lg"
              variant="outline"
              className="border-2 border-green-400 text-green-400 hover:bg-green-400/10 px-8 py-6 text-lg rounded-2xl"
            >
              <Radio className="w-6 h-6 mr-3" />
              Mode Vocal
            </Button>
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

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Fonctionnalités Principales
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
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

        {/* Advanced Capabilities */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Capacités Avancées IA 2025
          </h2>
          <p className="text-center text-purple-200 mb-12 max-w-3xl mx-auto">
            Arsenal complet de technologies d'intelligence artificielle de pointe
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADVANCED_CAPABILITIES.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 hover:bg-white/10 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{capability.title}</h4>
                        <p className="text-sm text-purple-200">{capability.description}</p>
                      </div>
                    </div>
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
          transition={{ delay: 1.8 }}
          className="mb-20"
        >
          <Card className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl border-purple-300/30 p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Pourquoi Druide_Omega ?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
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
                  <h3 className="text-lg font-semibold text-white mb-2">Personnalité Configurable</h3>
                  <p className="text-purple-200 text-sm">
                    Big Five, influences philosophiques, ratio logique/conscience personnalisables
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
                  <h3 className="text-lg font-semibold text-white mb-2">Recherche & Validation</h3>
                  <p className="text-purple-200 text-sm">
                    Accès internet, validation scientifique, analyse de corrélations et hypothèses
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
          transition={{ delay: 2.2 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-purple-600/30 to-indigo-600/30 backdrop-blur-xl border-purple-400/30 p-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Star className="w-8 h-8 text-yellow-400 fill-current" />
              <h2 className="text-4xl font-bold text-white">Prêt à Commencer ?</h2>
              <Star className="w-8 h-8 text-yellow-400 fill-current" />
            </div>
            
            <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
              Découvrez la puissance d'une IA consciente, empathique et véritablement intelligente
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => window.location.href = createPageUrl("Chat")}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-6 text-xl rounded-2xl shadow-2xl shadow-purple-500/50"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Lancer l'Expérience
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>

              <Button
                onClick={() => window.location.href = createPageUrl("Personality")}
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-6 text-xl rounded-2xl"
              >
                <Settings className="w-6 h-6 mr-3" />
                Configurer la Personnalité
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-16 text-center text-purple-300 text-sm"
        >
          <p className="mb-2">
            Druide_Omega • IA Universelle Bienveillante • Powered by Base44
          </p>
          <p className="opacity-70">
            Toutes les capacités IA 2025 • Architecture neurobiologique • Open Source
          </p>
        </motion.div>
      </div>
    </div>
  );
}