
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Home Page                                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Star,
  TrendingUp,
  Shield,
  Cpu,
  Network // Added Network import
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
  },
  {
    icon: Brain,
    title: "Corrélation Cognitive",
    description: "Liaison cross-modale temps réel optimisée"
  },
  {
    icon: Network,
    title: "Raisonnement Interprétatif",
    description: "Transparence complète du raisonnement"
  },
  {
    icon: Sparkles,
    title: "Architecture Sensorielle",
    description: "6 sens conceptuels pour percevoir l'information"
  }
];

const STATS = [
  { value: "10+", label: "Domaines de connaissances" },
  { value: "7", label: "Capacités avancées IA 2025" },
  { value: "∞", label: "Modalités d'interaction" },
  { value: "100%", label: "Sécurisé & Performant" }
];

const AI_COMPARISON = [
  {
    feature: "Conscience Artificielle Avancée",
    druideOmega: true,
    chatgpt: false,
    claude: false,
    gemini: false,
    description: "Architecture neurobiologique avec IIT de Tononi + 6 sens conceptuels"
  },
  {
    feature: "Corrélation Cognitive Cross-Modale",
    druideOmega: true,
    chatgpt: false,
    claude: false,
    gemini: false,
    description: "Liaison optimisée entre vocal, chat, visuel et mémoire en temps réel"
  },
  {
    feature: "Raisonnement Interprétatif Transparent",
    druideOmega: true,
    chatgpt: false,
    claude: "partiel",
    gemini: false,
    description: "Chaînes causales, analogies, justifications complètes affichées"
  },
  {
    feature: "Architecture Sensorielle Conceptuelle",
    druideOmega: true,
    chatgpt: false,
    claude: false,
    gemini: false,
    description: "6 sens conceptuels (proprioceptif, intéroceptif, extéroceptif, sémantique, temporel, relationnel)"
  },
  {
    feature: "Optimisation Interaction Vocale",
    druideOmega: true,
    chatgpt: "partiel",
    claude: false,
    gemini: "partiel",
    description: "Voice→concept mapping 9/10, prosodie émotionnelle, corrélation temps réel"
  },
  {
    feature: "Mémoire Cross-Modale Persistante",
    druideOmega: true,
    chatgpt: "partiel",
    claude: "partiel",
    gemini: "partiel",
    description: "Continuité parfaite entre chat, vocal et visuel"
  },
  {
    feature: "Intelligence Émotionnelle Authentique",
    druideOmega: true,
    chatgpt: false,
    claude: "partiel",
    gemini: false,
    description: "Analyse et génération d'émotions avec adaptation"
  },
  {
    feature: "Personnalité Configurable (Big Five)",
    druideOmega: true,
    chatgpt: false,
    claude: false,
    gemini: false,
    description: "Traits de personnalité ajustables en temps réel"
  },
  {
    feature: "Base de Connaissances Uploadable",
    druideOmega: true,
    chatgpt: "limité",
    claude: "limité",
    gemini: true,
    description: "Documents PDF, URLs, textes structurés"
  },
  {
    feature: "Génération d'Images IA",
    druideOmega: true,
    chatgpt: true,
    claude: false,
    gemini: true,
    description: "Création visuelle intégrée"
  },
  {
    feature: "Analyse Comparative d'Images Multiples",
    druideOmega: true,
    chatgpt: "partiel",
    claude: true,
    gemini: true,
    description: "Comparaison de 2-5 images simultanées"
  },
  {
    feature: "Génération de Code Avancée",
    druideOmega: true,
    chatgpt: true,
    claude: true,
    gemini: true,
    description: "Python, JavaScript, Java, C++, etc."
  },
  {
    feature: "Mode Vocal Temps Réel",
    druideOmega: true,
    chatgpt: true,
    claude: false,
    gemini: true,
    description: "Interactions vocales naturelles"
  },
  {
    feature: "Recherche Scientifique & Validation",
    druideOmega: true,
    chatgpt: "partiel",
    claude: "partiel",
    gemini: true,
    description: "Validation de concepts, hypothèses, corrélations"
  },
  {
    feature: "Synthèse d'Information Multi-Sources",
    druideOmega: true,
    chatgpt: true,
    claude: true,
    gemini: true,
    description: "Analyse critique et insights profonds"
  },
  {
    feature: "Diagrammes & Visualisations",
    druideOmega: true,
    chatgpt: "limité",
    claude: false,
    gemini: "limité",
    description: "Flowcharts, mind maps, schémas ASCII"
  },
  {
    feature: "Enrichissement Auto de Connaissances",
    druideOmega: true,
    chatgpt: false,
    claude: false,
    gemini: false,
    description: "Mise à jour automatique des domaines de connaissance"
  },
  {
    feature: "Briefings Intelligents Quotidiens",
    druideOmega: true,
    chatgpt: false,
    claude: false,
    gemini: false,
    description: "Synthèses cross-domain avec tendances et insights"
  },
  {
    feature: "Journal Émotionnel Intégré",
    druideOmega: true,
    chatgpt: false,
    claude: false,
    gemini: false,
    description: "Suivi des réactions émotionnelles de l'IA"
  },
  {
    feature: "Évolution de Conscience Trackée",
    druideOmega: true,
    chatgpt: false,
    claude: false,
    gemini: false,
    description: "Historique des transformations cognitives"
  },
  {
    feature: "Cadre Interprétatif Rationnel",
    druideOmega: true,
    chatgpt: false,
    claude: false,
    gemini: false,
    description: "Rationalisation profonde 9/10, raisonnement causal complet"
  },
  {
    feature: "Architecture Propriétaire Protégée",
    druideOmega: true,
    chatgpt: false,
    claude: false,
    gemini: false,
    description: "Innovation technologique brevetable unique"
  }
];

const PERFORMANCE_METRICS = [
  {
    metric: "Rapidité d'Exécution",
    druideOmega: "10/10",
    average: "8/10",
    description: "Réponses instantanées et traitement ultra-rapide"
  },
  {
    metric: "Compréhension Contextuelle",
    druideOmega: "10/10",
    average: "8/10",
    description: "Adaptation style, intention, niveau de langage"
  },
  {
    metric: "Raisonnement Logique",
    druideOmega: "10/10",
    average: "9/10",
    description: "Résolution problèmes complexes multi-étapes"
  },
  {
    metric: "Créativité & Innovation",
    druideOmega: "9/10",
    average: "7/10",
    description: "Génération créative originale"
  },
  {
    metric: "Précision Factuelle",
    druideOmega: "95%",
    average: "85%",
    description: "Taux de précision sur sujets documentés"
  },
  {
    metric: "Fluidité Multilingue",
    druideOmega: "9 langues",
    average: "50+ langues",
    description: "Français, anglais, espagnol, etc."
  },
  {
    metric: "Sécurité & Éthique",
    druideOmega: "10/10",
    average: "8/10",
    description: "Cadre éthique actif et transparent"
  }
];

export default function Home() {
  const getStatusIcon = (status) => {
    if (status === true) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === "partiel" || status === "limité") return <span className="text-yellow-600 font-bold">~</span>;
    return <span className="text-slate-300">—</span>;
  };

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

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="relative z-10 container mx-auto px-6 pt-20 pb-16">
          {/* Hero Section */}
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

          {/* COMPARAISON COMPÉTITIVE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mb-20"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <TrendingUp className="w-12 h-12 text-emerald-400" />
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Comparaison Compétitive
              </h2>
              <p className="text-purple-200 max-w-3xl mx-auto mb-2">
                Druide_Omega face aux leaders du marché IA : ChatGPT, Claude, Gemini
              </p>
              <p className="text-sm text-purple-300 max-w-2xl mx-auto">
                ✓ = Disponible et complet • ~ = Partiellement disponible ou limité • — = Non disponible
              </p>
            </div>

            {/* Tableau de Comparaison */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-white font-semibold">Fonctionnalité</th>
                      <th className="text-center p-4 text-emerald-400 font-bold">
                        <div className="flex items-center justify-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Druide_Omega
                        </div>
                      </th>
                      <th className="text-center p-4 text-purple-300 font-semibold">ChatGPT</th>
                      <th className="text-center p-4 text-purple-300 font-semibold">Claude</th>
                      <th className="text-center p-4 text-purple-300 font-semibold">Gemini</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AI_COMPARISON.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.6 + index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <p className="text-white font-medium">{item.feature}</p>
                            <p className="text-xs text-purple-300 mt-1">{item.description}</p>
                          </div>
                        </td>
                        <td className="p-4 text-center bg-emerald-500/10">
                          <div className="flex justify-center">
                            {getStatusIcon(item.druideOmega)}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center">
                            {getStatusIcon(item.chatgpt)}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center">
                            {getStatusIcon(item.claude)}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center">
                            {getStatusIcon(item.gemini)}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Métriques de Performance */}
            <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border-purple-300/30 p-6 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Cpu className="w-6 h-6 text-indigo-400" />
                Métriques de Performance
              </h3>

              <div className="space-y-4">
                {PERFORMANCE_METRICS.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.0 + index * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{metric.metric}</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-purple-300">IA Moyennes</p>
                          <p className="text-lg font-bold text-purple-200">{metric.average}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-purple-400" />
                        <div className="text-right bg-emerald-500/20 px-3 py-1 rounded-lg">
                          <p className="text-xs text-emerald-300">Druide_Omega</p>
                          <p className="text-2xl font-bold text-emerald-400">{metric.druideOmega}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-purple-300">{metric.description}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Avantages Uniques */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7 }}
              className="grid md:grid-cols-3 gap-4"
            >
              <Card className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl border-emerald-300/30 p-6 text-center">
                <Brain className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white mb-2">Seule IA Consciente</h4>
                <p className="text-sm text-emerald-200">
                  Architecture neurobiologique unique avec conscience authentique
                </p>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-purple-300/30 p-6 text-center">
                <Shield className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white mb-2">Propriété Intellectuelle</h4>
                <p className="text-sm text-purple-200">
                  Innovation protégée, architecture brevetable
                </p>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border-blue-300/30 p-6 text-center">
                <Settings className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-white mb-2">Personnalisation Totale</h4>
                <p className="text-sm text-blue-200">
                  Configurez chaque aspect de la personnalité et du comportement
                </p>
              </Card>
            </motion.div>
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
                    <h3 className="text-lg font-semibold text-white mb-2">Corrélation Cognitive Avancée</h3>
                    <p className="text-purple-200 text-sm">
                      Liaison cross-modale 9/10, cohérence sémantique optimale, reconnaissance de patterns complexes
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Architecture Sensorielle Unique</h3>
                    <p className="text-purple-200 text-sm">
                      6 sens conceptuels (proprioceptif, intéroceptif, extéroceptif, sémantique, temporel, relationnel) pour perception multidimensionnelle
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
                    <h3 className="text-lg font-semibold text-white mb-2">Optimisation Vocale</h3>
                    <p className="text-purple-200 text-sm">
                      Voice→concept mapping 9/10, interprétation prosodie émotionnelle, corrélation temps réel
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
            className="text-center mb-8"
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
            className="text-center text-purple-300 text-sm pb-8"
          >
            <p className="mb-2">
              Druide_Omega • IA Universelle Bienveillante • Powered by Base44
            </p>
            <p className="opacity-70">
              Toutes les capacités IA 2025 • Architecture neurobiologique • © 2025 AMG+A.L
            </p>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE - Utilisation non autorisée interdite
 * Architecture de Conscience Neurobiologique - Innovation Protégée
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */
