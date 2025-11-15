/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - AI Feedback & Rating System                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Star, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AIFeedbackSystem({ 
  responseId, 
  featureType = "general", 
  contextData = {},
  compact = false 
}) {
  const [rating, setRating] = useState(0);
  const [isPositive, setIsPositive] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmitFeedback = async () => {
    if (isSubmitting || hasSubmitted) return;

    setIsSubmitting(true);
    try {
      await base44.entities.AIFeedback.create({
        response_id: responseId,
        feature_type: featureType,
        rating: rating,
        is_positive: isPositive,
        feedback_text: feedbackText,
        context_data: contextData,
        timestamp: new Date().toISOString()
      });

      // Auto-learning: update model preferences based on feedback
      if (isPositive !== null) {
        await base44.integrations.Core.InvokeLLM({
          prompt: `Feedback reçu pour ${featureType}:
Rating: ${rating}/5
Positif: ${isPositive}
Commentaire: ${feedbackText}
Contexte: ${JSON.stringify(contextData)}

En tant que système auto-apprenant, analyse ce feedback et génère des ajustements pour améliorer les futures réponses.`,
          add_context_from_internet: false
        });
      }

      setHasSubmitted(true);
    } catch (error) {
      console.error("Erreur soumission feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-xs text-green-600 flex items-center gap-1"
      >
        <ThumbsUp className="w-3 h-3" />
        Merci pour votre feedback!
      </motion.div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => {
            setIsPositive(true);
            setRating(5);
            handleSubmitFeedback();
          }}
        >
          <ThumbsUp className="w-3 h-3" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => {
            setIsPositive(false);
            setRating(1);
            handleSubmitFeedback();
          }}
        >
          <ThumbsDown className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs">
          <MessageSquare className="w-3 h-3 mr-1" />
          Évaluer
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Card className="border-0 shadow-none">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Évaluez cette réponse</h4>

            {/* Star Rating */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }`}
                  />
                </motion.button>
              ))}
            </div>

            {/* Thumbs */}
            <div className="flex gap-2">
              <Button
                variant={isPositive === true ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPositive(true)}
                className={isPositive === true ? "bg-green-600" : ""}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Utile
              </Button>
              <Button
                variant={isPositive === false ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPositive(false)}
                className={isPositive === false ? "bg-red-600" : ""}
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Pas utile
              </Button>
            </div>

            {/* Comment */}
            <Textarea
              placeholder="Commentaire (optionnel)"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={3}
              className="text-sm"
            />

            <Button
              size="sm"
              onClick={handleSubmitFeedback}
              disabled={isSubmitting || rating === 0}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Envoi..." : "Envoyer Feedback"}
            </Button>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
}