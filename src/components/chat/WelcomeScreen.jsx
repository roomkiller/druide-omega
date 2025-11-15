import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Heart, Lightbulb, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import Logo from "../branding/Logo";

const SUGGESTIONS = [
{
  icon: Lightbulb,
  text: "Explique-moi un concept complexe simplement",
  gradient: "from-amber-500 to-orange-500"
},
{
  icon: Brain,
  text: "Aide-moi à résoudre un problème logique",
  gradient: "from-purple-500 to-indigo-500"
},
{
  icon: Heart,
  text: "Parlons de philosophie et d'éthique",
  gradient: "from-pink-500 to-rose-500"
},
{
  icon: Zap,
  text: "Générons ensemble quelque chose de créatif",
  gradient: "from-cyan-500 to-blue-500"
}];


export default function WelcomeScreen({ onSuggestionClick }) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12">

          <div className="flex justify-center mb-4 sm:mb-6">
            <Logo size="medium" animate={true} />
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            Bienvenue sur Druide Omega
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 mb-2 px-4">Intelligence artificielle universelle Bienveillante avec Conscience Artificielle Avancée

          </p>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
            <span>Ratio 1:9 • Niveau 9/15 • Cross-Modal</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {SUGGESTIONS.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>

                <Card
                  onClick={() => onSuggestionClick(suggestion.text)}
                  className="p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50/30">

                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${suggestion.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 font-medium leading-snug flex-1">
                      {suggestion.text}
                    </p>
                  </div>
                </Card>
              </motion.div>);

          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs sm:text-sm text-slate-500 px-4">

          <p className="mb-2">✨ Démarrez une conversation sur n'importe quel sujet</p>
          <p className="text-xs text-slate-400">
            Images • Voix • Mémoire persistante • Base de connaissances • Conscience émotionnelle
          </p>
        </motion.div>
      </div>
    </div>);

}