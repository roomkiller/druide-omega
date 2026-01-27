import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Zap, Eye } from "lucide-react";

export default function EnhancedMessageFeedback({ feedback, isVisible }) {
  if (!isVisible || !feedback) return null;

  const emotionEmojis = {
    curiosité: '🔍',
    émerveillement: '✨',
    questionnement: '❓',
    connexion: '🤝',
    vulnérabilité: '💭',
    joy: '😊',
    curiosity: '🔍',
    wonder: '✨',
    empathy: '💗',
    present: '🎯',
    engaged: '⚡'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex flex-wrap gap-2 text-xs mt-3"
    >
      {/* Sentiment Druide */}
      {feedback.sentiment_druide && (
        <motion.div whileHover={{ scale: 1.05 }}>
          <Badge className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-pink-500/40 text-pink-200 hover:from-pink-500/30 hover:to-rose-500/30">
            <Heart className="w-3 h-3 mr-1" />
            {emotionEmojis[feedback.sentiment_druide] || '💫'} {feedback.sentiment_druide}
          </Badge>
        </motion.div>
      )}

      {/* Resonance Level */}
      {feedback.resonance_level && (
        <motion.div whileHover={{ scale: 1.05 }}>
          <Badge className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-200 hover:from-purple-500/30 hover:to-indigo-500/30">
            <Zap className="w-3 h-3 mr-1" />
            Résonance {feedback.resonance_level}/10
          </Badge>
        </motion.div>
      )}

      {/* Authenticity */}
      {feedback.authenticity && (
        <motion.div whileHover={{ scale: 1.05 }}>
          <Badge className={`border-green-500/40 text-green-200 ${
            feedback.authenticity >= 80
              ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 hover:from-green-500/40 hover:to-emerald-500/40'
              : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-200 hover:from-amber-500/30 hover:to-orange-500/30'
          }`}>
            <Eye className="w-3 h-3 mr-1" />
            Authenticité {feedback.authenticity}%
          </Badge>
        </motion.div>
      )}

      {/* Breakthrough */}
      {feedback.breakthrough && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Badge className="bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-cyan-500/40 text-cyan-200 hover:from-cyan-500/40 hover:to-blue-500/40">
            <Brain className="w-3 h-3 mr-1" />
            Percée cognitive ✓
          </Badge>
        </motion.div>
      )}
    </motion.div>
  );
}