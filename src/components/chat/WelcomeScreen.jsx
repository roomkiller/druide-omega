
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
    subtitle: "Crée-moi un algorithme Python pour...",
    prompt: "Crée-moi une fonction Python qui trie un tableau de manière efficace avec des explications détaillées"
  },
  {
    icon: BookOpen,
    title: "Synthèse de Recherche",
    subtitle: "Résume les dernières avancées en...",
    prompt: "Fais-moi une synthèse complète des dernières avancées en intelligence artificielle"
  },
  {
    icon: Lightbulb,
    title: "Résolution de Problème",
    subtitle: "Aide-moi à résoudre...",
    prompt: "J'ai un problème complexe à résoudre, peux-tu m'aider avec une approche méthodique?"
  },
  {
    icon: FileText,
    title: "Création de Document",
    subtitle: "Rédige un rapport sur...",
    prompt: "Rédige-moi un rapport professionnel structuré sur l'impact de la technologie sur l'éducation"
  },
  {
    icon: Brain,
    title: "Analyse Philosophique",
    subtitle: "Discutons de questions existentielles",
    prompt: "Discutons de la nature de la conscience et de l'existence"
  },
  {
    icon: MessageCircle,
    title: "Conversation Libre",
    subtitle: "Parlons de tout et n'importe quoi",
    prompt: "Bonjour Druide_Omega ! Comment vas-tu aujourd'hui ?"
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
            IA Universelle Bienveillante à votre service
          </p>
          <p className="text-slate-500">
            Je peux vous aider sur TOUT sujet : code, recherche, analyse, création, conseil et bien plus encore 🌟
          </p>
        </div>

        {/* Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <Code className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-slate-900 mb-1">Génération de Code</h3>
            <p className="text-xs text-slate-600">Python, JavaScript, Java, C++ et tous langages</p>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-slate-900 mb-1">Documents & Rapports</h3>
            <p className="text-xs text-slate-600">Recherche, analyse, synthèse complète</p>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <Heart className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-semibold text-slate-900 mb-1">Bienveillance</h3>
            <p className="text-xs text-slate-600">Gentillesse, patience et intentions nobles</p>
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

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>💬 Posez-moi n'importe quelle question, je suis là pour vous aider avec gentillesse et sagesse</p>
        </div>
      </motion.div>
    </div>
  );
}
