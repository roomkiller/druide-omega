import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Heart, Lightbulb, Zap, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "../branding/Logo";
import { useLanguage } from "@/components/utils/LanguageContext";
import { createPageUrl } from "@/utils";

export default function WelcomeScreen({ onSuggestionClick, chatInput }) {
  const { t } = useLanguage();

  const STANDARD_SUGGESTIONS = [
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

  const AI_SUGGESTIONS = [
    {
      icon: Brain,
      text: t('suggestions.deepChat') || 'Deep Consciousness Chat',
      gradient: "from-purple-600 to-indigo-600",
      action: () => window.location.href = createPageUrl('Chat_2'),
      isExternal: true
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

        {/* Standard Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {STANDARD_SUGGESTIONS.map((suggestion, index) => {
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

        {/* AI Interaction Suggestions from Chat_2 */}
        <div className="space-y-4 mb-8">
          <p className="text-sm text-slate-600 text-center font-medium">✨ Interactions IA</p>
          <div className="grid grid-cols-1 gap-3">
            {AI_SUGGESTIONS.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={suggestion.action}
                    className={`w-full h-auto py-4 px-6 bg-gradient-to-r ${suggestion.gradient} text-white hover:shadow-xl transition-all duration-300 flex items-center justify-between touch-target`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="text-base font-medium">{suggestion.text}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 flex-shrink-0" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
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