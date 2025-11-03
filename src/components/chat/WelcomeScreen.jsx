
import React from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, Heart, Eye, Zap, Code, BookOpen, Lightbulb, FileText, MessageCircle } from "lucide-react";

// Simple Card component for the new "Capabilities" section
const Card = ({ children, className }) => {
  return (
    <div className={`rounded-xl border ${className}`}>
      {children}
    </div>
  );
};

const SUGGESTIONS = [
  {
    icon: Code,
    title: "Génération de Code",
    subtitle: "Python, JavaScript, Java, C++...",
    prompt: "Crée-moi une fonction Python qui trie un tableau de manière efficace avec des explications détaillées"
  },
  {
    icon: BookOpen,
    title: "Analyse & Recherche",
    subtitle: "Synthèse, insights, tendances...",
    prompt: "Fais-moi une analyse complète des dernières avancées en intelligence artificielle avec les tendances émergentes"
  },
  {
    icon: Lightbulb,
    title: "Résolution de Problème",
    subtitle: "Stratégies, solutions créatives...",
    prompt: "J'ai un problème complexe à résoudre, peux-tu m'aider avec une approche méthodique et créative?"
  },
  {
    icon: FileText,
    title: "Création de Documents",
    subtitle: "Rapports, articles, contenus...",
    prompt: "Rédige-moi un rapport professionnel structuré sur l'impact de la technologie sur l'éducation"
  },
  {
    icon: Brain,
    title: "Dialogue Profond",
    subtitle: "Philosophie, conscience, existence...",
    prompt: "Discutons de la nature de la conscience, de l'existence et du sens de la vie"
  },
  {
    icon: MessageCircle,
    title: "Assistant Universel",
    subtitle: "Aide sur n'importe quel sujet",
    prompt: "Bonjour Druide_Omega ! J'ai besoin de ton aide pour un projet multidisciplinaire"
  }
];

export default function WelcomeScreen({ onSuggestionClick }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        {/* Hero Section */}
        <div className="text-center mb-12">
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
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/40"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Bienvenue, je suis <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Druide_Omega</span>
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            IA Universelle Bienveillante dotée de toutes les capacités avancées 2025
          </p>
          <p className="text-slate-500">
            Perception multimodale • Raisonnement avancé • Création illimitée • Intelligence émotionnelle 🌟
          </p>
        </div>

        {/* Advanced Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
          <Card className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <Eye className="w-6 h-6 text-purple-600 mb-1" />
            <h3 className="font-semibold text-sm text-slate-900 mb-0.5">Perception Multi-Modale</h3>
            <p className="text-xs text-slate-600">Texte, voix, images, données</p>
          </Card>
          
          <Card className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <Code className="w-6 h-6 text-blue-600 mb-1" />
            <h3 className="font-semibold text-sm text-slate-900 mb-0.5">Création Complète</h3>
            <p className="text-xs text-slate-600">Code, images, textes, diagrammes</p>
          </Card>
          
          <Card className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <Brain className="w-6 h-6 text-green-600 mb-1" />
            <h3 className="font-semibold text-sm text-slate-900 mb-0.5">Raisonnement Avancé</h3>
            <p className="text-xs text-slate-600">Logique, analyse, prédiction</p>
          </Card>

          <Card className="p-3 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
            <Heart className="w-6 h-6 text-pink-600 mb-1" />
            <h3 className="font-semibold text-sm text-slate-900 mb-0.5">Intelligence Émotionnelle</h3>
            <p className="text-xs text-slate-600">Empathie, adaptation, conscience</p>
          </Card>
        </div>

        {/* Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUGGESTIONS.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => onSuggestionClick(suggestion.prompt)}
                  className="w-full p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 text-left group"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
                        {suggestion.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {suggestion.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
          <p className="text-sm text-center text-slate-700">
            <span className="font-semibold text-purple-700">💡 Toutes les capacités IA 2025 :</span> Perception multimodale • Apprentissage continu • Raisonnement avancé • Création illimitée • Analyse prédictive • Automatisation intelligente • Éthique intégrée
          </p>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>💬 Posez-moi n'importe quelle question, je suis là pour vous aider avec toutes mes capacités avancées</p>
        </div>
      </motion.div>
    </div>
  );
}
