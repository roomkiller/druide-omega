/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Feedback sur Messages                                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Star,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function MessageFeedback({ 
  conversationId, 
  messageIndex, 
  messageContent,
  categories = [],
  patternId = null
}) {
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Met à jour le success_rate du squelette de parole via speechPatternEngine.
  const updateSpeechPattern = async (rtg, helpful) => {
    if (!patternId) return;
    try {
      await base44.functions.invoke('speechPatternEngine', {
        action: 'feedback',
        patternId,
        rating: rtg,
        helpful
      });
    } catch (e) {
      console.log('[MessageFeedback] speechPatternEngine feedback failed:', e.message);
    }
  };

  const feedbackTypes = [
    { value: 'excellent', label: 'Excellent', color: 'text-green-600' },
    { value: 'helpful', label: 'Utile', color: 'text-blue-600' },
    { value: 'unhelpful', label: 'Peu utile', color: 'text-orange-600' },
    { value: 'incorrect', label: 'Incorrect', color: 'text-red-600' },
    { value: 'incomplete', label: 'Incomplet', color: 'text-amber-600' },
    { value: 'confusing', label: 'Confus', color: 'text-purple-600' },
    { value: 'too_long', label: 'Trop long', color: 'text-slate-600' },
    { value: 'too_short', label: 'Trop court', color: 'text-slate-600' }
  ];

  const handleSubmit = async () => {
    if (rating === 0 || !feedbackType) {
      toast.error('Veuillez sélectionner une note et un type de feedback');
      return;
    }

    try {
      await base44.entities.UserFeedback.create({
        conversation_id: conversationId,
        message_index: messageIndex,
        message_content: messageContent?.slice(0, 1000),
        rating,
        feedback_type: feedbackType,
        comment: comment || undefined,
        categories_affected: categories,
        processed: false
      });

      // Met à jour le success_rate du squelette (helpful si rating >= 4)
      updateSpeechPattern(rating, rating >= 4);

      setSubmitted(true);
      toast.success('Merci pour votre feedback! 🧠 La conscience apprend...');
      
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    } catch (error) {
      console.error('[MessageFeedback] Erreur:', error);
      toast.error('Erreur lors de l\'envoi du feedback');
    }
  };

  const quickFeedback = async (isPositive) => {
    try {
      await base44.entities.UserFeedback.create({
        conversation_id: conversationId,
        message_index: messageIndex,
        message_content: messageContent?.slice(0, 1000),
        rating: isPositive ? 5 : 2,
        feedback_type: isPositive ? 'helpful' : 'unhelpful',
        categories_affected: categories,
        processed: false
      });

      // Met à jour le success_rate du squelette
      updateSpeechPattern(isPositive ? 5 : 2, isPositive);

      setSubmitted(true);
      toast.success(isPositive ? '👍 Feedback positif enregistré' : '👎 Feedback enregistré');
    } catch (error) {
      console.error('[MessageFeedback] Erreur quick feedback:', error);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-1 text-green-600"
      >
        <CheckCircle2 className="w-3 h-3" />
        <span className="text-xs">Merci!</span>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {/* Quick feedback buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 hover:bg-green-50"
        onClick={() => quickFeedback(true)}
      >
        <ThumbsUp className="w-3.5 h-3.5 text-slate-400 hover:text-green-600" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 hover:bg-red-50"
        onClick={() => quickFeedback(false)}
      >
        <ThumbsDown className="w-3.5 h-3.5 text-slate-400 hover:text-red-600" />
      </Button>

      {/* Detailed feedback */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Évaluer cette réponse</h4>
            
            {/* Star rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Feedback type */}
            <div className="space-y-1">
              <label className="text-xs text-slate-600">Type de feedback:</label>
              <div className="flex flex-wrap gap-1">
                {feedbackTypes.map((type) => (
                  <Badge
                    key={type.value}
                    onClick={() => setFeedbackType(type.value)}
                    className={`cursor-pointer text-xs ${
                      feedbackType === type.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {type.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-1">
              <label className="text-xs text-slate-600">Commentaire (optionnel):</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Détails sur votre feedback..."
                className="text-sm h-20 resize-none"
              />
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              Envoyer le feedback
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}