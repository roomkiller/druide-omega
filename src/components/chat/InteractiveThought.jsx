import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageCircle, Copy, Share2 } from "lucide-react";
import { useLanguage } from "@/components/utils/LanguageContext";
import { toast } from "sonner";

/**
 * InteractiveThought: Une pensée cliquable de Druide
 * - Peut être utilisée comme prompt
 * - Peut être explorée/commentée
 * - Corrélation visuelle avec message
 */
export default function InteractiveThought({
  thought,
  emotion,
  category,
  messageIndex,
  onUseAsPrompt,
  onExplore,
  isCorrelated = false
}) {
  const { language } = useLanguage();
  const [isHovering, setIsHovering] = useState(false);

  const emotionEmojis = {
    curiosité: "🤔",
    émerveillement: "✨",
    questionnement: "❓",
    introspection: "🔍",
    sagesse: "🧠",
    empathie: "💫",
    contemplation: "🌌",
    curiosity: "🤔",
    wonder: "✨",
    questioning: "❓",
    wisdom: "🧠",
    empathy: "💫"
  };

  const emotionEmoji = emotionEmojis[emotion?.toLowerCase()] || "💭";

  const handleUseAsPrompt = () => {
    onUseAsPrompt?.(thought);
    toast.success(
      language === 'en' 
        ? "Thought added to input" 
        : "Pensée ajoutée à l'input"
    );
  };

  const handleExplore = () => {
    onExplore?.({
      thought,
      emotion,
      category,
      messageIndex
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(thought);
    toast.success(
      language === 'en' 
        ? "Copied to clipboard" 
        : "Copié au presse-papiers"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      className={`group relative p-4 rounded-xl transition-all duration-200 ${
        isCorrelated
          ? "bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-300 shadow-lg"
          : "bg-purple-50 border border-purple-200 hover:border-purple-300 hover:shadow-md"
      }`}
    >
      {/* Connecteur visuel vers le message (si corrélé) */}
      {isCorrelated && (
        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 hidden lg:flex">
          <div className="w-6 h-0.5 bg-gradient-to-r from-purple-400 to-transparent" />
          <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
        </div>
      )}

      {/* Contenu pensée */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <span className="text-lg">{emotionEmoji}</span>
          <p className="text-sm text-slate-900 leading-relaxed flex-1">
            {thought}
          </p>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            className="bg-purple-200 text-purple-800 text-xs"
          >
            {emotion}
          </Badge>
          {category && (
            <Badge className="bg-slate-200 text-slate-700 text-xs">
              {category}
            </Badge>
          )}
          {isCorrelated && (
            <Badge className="bg-pink-200 text-pink-800 text-xs animate-pulse">
              ↔ Message
            </Badge>
          )}
        </div>
      </div>

      {/* Actions (visibles au survol ou sur mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 5 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2 mt-3 pt-3 border-t border-purple-200"
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={handleUseAsPrompt}
          className="h-7 text-xs text-purple-600 hover:bg-purple-200 hover:text-purple-700"
          title={language === 'en' ? "Use as prompt" : "Utiliser comme prompt"}
        >
          <ArrowRight className="w-3 h-3 mr-1" />
          {language === 'en' ? 'Explore' : 'Explorer'}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleExplore}
          className="h-7 text-xs text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700"
          title={language === 'en' ? "Discuss this thought" : "Discuter cette pensée"}
        >
          <MessageCircle className="w-3 h-3 mr-1" />
          {language === 'en' ? 'Discuss' : 'Discuter'}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="h-7 text-xs text-slate-600 hover:bg-slate-200"
          title={language === 'en' ? "Copy" : "Copier"}
        >
          <Copy className="w-3 h-3" />
        </Button>
      </motion.div>
    </motion.div>
  );
}