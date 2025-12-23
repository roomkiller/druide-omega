import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Heart, Lightbulb, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import Logo from "../branding/Logo";
import { useLanguage } from "@/components/utils/LanguageContext";

export default function WelcomeScreen({ onSuggestionClick, chatInput }) {
  const { t } = useLanguage();

  const SUGGESTIONS = [
    {
      icon: Lightbulb,
      text: t('suggestions.explain'),
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: Brain,
      text: t('suggestions.solve'),
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Heart,
      text: t('suggestions.philosophy'),
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Zap,
      text: t('suggestions.creative'),
      gradient: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-6 sm:p-8 overflow-auto">
      <div className="max-w-3xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <Logo size="large" animate={true} />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            {t('welcome.chatTitle')}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mb-3 px-4 max-w-2xl mx-auto">
            {t('welcome.chatSubtitle')}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>{t('welcome.chatRatio')}</span>
          </div>
        </motion.div>

        {/* Champ de saisie au centre */}
        {chatInput && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            {chatInput}
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {SUGGESTIONS.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  onClick={() => onSuggestionClick(suggestion.text)}
                  className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50/30 min-h-[80px] flex items-center touch-target"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className={`min-w-[48px] min-h-[48px] w-12 h-12 bg-gradient-to-br ${suggestion.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-base text-slate-700 font-medium leading-relaxed flex-1">
                      {suggestion.text}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-slate-500 px-4"
        >
          <p className="mb-2">✨ {t('welcome.startConversation')}</p>
          <p className="text-xs text-slate-400">
            {t('welcome.features')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}