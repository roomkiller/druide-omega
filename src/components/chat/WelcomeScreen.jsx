import React from "react";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Lightbulb, Code, Palette } from "lucide-react";

const suggestions = [
  { icon: MessageSquare, text: "Aide-moi à rédiger un email professionnel", color: "from-blue-500 to-cyan-500" },
  { icon: Lightbulb, text: "Explique-moi un concept complexe simplement", color: "from-yellow-500 to-orange-500" },
  { icon: Code, text: "Aide-moi à résoudre un problème de code", color: "from-green-500 to-emerald-500" },
  { icon: Palette, text: "Donne-moi des idées créatives", color: "from-pink-500 to-rose-500" }
];

export default function WelcomeScreen({ onSuggestionClick }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl shadow-2xl shadow-purple-500/40 mb-6"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Bonjour, je suis votre
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Assistant Intelligent
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Posez-moi n'importe quelle question. Je suis là pour vous aider avec des réponses claires et précises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="group p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 text-left"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${suggestion.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <suggestion.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-700 font-medium leading-relaxed flex-1 pt-2">
                  {suggestion.text}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}