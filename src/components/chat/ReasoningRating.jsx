/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Reasoning Quality Rating Component                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, ThumbsDown, Send, CheckCircle2 } from "lucide-react";

export default function ReasoningRating({ reasoningId, onRate }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [helpful, setHelpful] = useState(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      await onRate({
        reasoningId,
        rating,
        helpful,
        comment: comment.trim() || null
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Erreur soumission feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-4"
      >
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-900">Merci pour votre retour !</p>
              <p className="text-xs text-green-700">Votre évaluation aide à améliorer le raisonnement de l'IA.</p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="mb-4">
      <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 p-4">
        <p className="text-sm font-semibold text-slate-900 mb-3">
          💭 Évaluez la qualité du raisonnement
        </p>

        {/* Star Rating */}
        <div className="flex items-center gap-4 mb-4">
          <p className="text-xs text-slate-600">Note:</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-slate-300'
                  }`}
                />
              </motion.button>
            ))}
          </div>
          {rating > 0 && (
            <span className="text-xs text-slate-600">
              {rating === 5 ? "Excellent" : rating === 4 ? "Bon" : rating === 3 ? "Correct" : rating === 2 ? "Faible" : "Insuffisant"}
            </span>
          )}
        </div>

        {/* Helpful/Not Helpful */}
        <div className="flex items-center gap-4 mb-4">
          <p className="text-xs text-slate-600">Utile?</p>
          <div className="flex gap-2">
            <Button
              variant={helpful === true ? "default" : "outline"}
              size="sm"
              onClick={() => setHelpful(true)}
              className={helpful === true ? "bg-green-600" : ""}
            >
              <ThumbsUp className="w-4 h-4 mr-1" />
              Oui
            </Button>
            <Button
              variant={helpful === false ? "default" : "outline"}
              size="sm"
              onClick={() => setHelpful(false)}
              className={helpful === false ? "bg-red-600" : ""}
            >
              <ThumbsDown className="w-4 h-4 mr-1" />
              Non
            </Button>
          </div>
        </div>

        {/* Optional Comment */}
        <AnimatePresence>
          {rating > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Commentaire optionnel sur le raisonnement..."
                rows={2}
                className="text-sm"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || rating === 0}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  {isSubmitting ? (
                    "Envoi..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer l'évaluation
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}