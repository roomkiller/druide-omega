/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Proactive Assistant Widget                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, BookOpen, MessageSquare, TrendingUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { anticipateUserNeeds } from "@/components/ai/ProactiveNeedsEngine";

export default function ProactiveAssistant({ onStartConversation, onOpenDocument }) {
  const [anticipations, setAnticipations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    loadAnticipations();
    const interval = setInterval(loadAnticipations, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const loadAnticipations = async () => {
    setIsLoading(true);
    try {
      const data = await anticipateUserNeeds();
      setAnticipations(data);
    } catch (error) {
      console.error("Erreur chargement anticipations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = (type, index) => {
    setDismissed(prev => new Set([...prev, `${type}-${index}`]));
  };

  const isDismissed = (type, index) => dismissed.has(`${type}-${index}`);

  if (!anticipations || isLoading) return null;

  const hasAnticipations = 
    anticipations.anticipated_needs?.length > 0 ||
    anticipations.relevant_kb_suggestions?.length > 0 ||
    anticipations.proactive_conversations?.length > 0;

  if (!hasAnticipations) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold text-slate-900">Assistant Proactif</h3>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-3">
          {/* Anticipated Needs */}
          {anticipations.anticipated_needs?.map((need, idx) => {
            if (isDismissed('need', idx)) return null;
            return (
              <AnimatePresence key={idx}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="p-3 border-purple-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-500 text-white">{need.probability}%</Badge>
                        <Badge variant="outline">{need.urgency}</Badge>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleDismiss('need', idx)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm font-medium text-slate-900 mb-1">{need.need}</p>
                    <p className="text-xs text-slate-600 mb-2">{need.reasoning}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => onStartConversation?.(need.suggested_action)}
                    >
                      {need.suggested_action}
                    </Button>
                  </Card>
                </motion.div>
              </AnimatePresence>
            );
          })}

          {/* KB Suggestions */}
          {anticipations.relevant_kb_suggestions?.map((kb, idx) => {
            if (isDismissed('kb', idx)) return null;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-3 bg-blue-50 border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <Badge className="bg-blue-500 text-white">{kb.predicted_value}% pertinent</Badge>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => handleDismiss('kb', idx)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">{kb.kb_title}</p>
                  <p className="text-xs text-slate-600 mb-2">{kb.relevance_reason}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => onOpenDocument?.(kb.kb_title)}
                  >
                    Ouvrir ce document
                  </Button>
                </Card>
              </motion.div>
            );
          })}

          {/* Proactive Conversations */}
          {anticipations.proactive_conversations?.map((conv, idx) => {
            if (isDismissed('conv', idx)) return null;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-3 bg-green-50 border-green-200">
                  <div className="flex items-start justify-between mb-2">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => handleDismiss('conv', idx)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">{conv.topic}</p>
                  <p className="text-xs text-slate-600 mb-2 italic">"{conv.opening_message}"</p>
                  <p className="text-xs text-green-700 mb-2">✨ {conv.expected_benefit}</p>
                  <Button
                    size="sm"
                    className="w-full bg-green-600"
                    onClick={() => onStartConversation?.(conv.opening_message)}
                  >
                    Démarrer cette conversation
                  </Button>
                </Card>
              </motion.div>
            );
          })}

          {/* Detected Trends */}
          {anticipations.detected_trends?.map((trend, idx) => {
            if (isDismissed('trend', idx)) return null;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-3 bg-orange-50 border-orange-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                      <Badge className="bg-orange-500 text-white">{trend.strength}%</Badge>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => handleDismiss('trend', idx)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">{trend.trend}</p>
                  <p className="text-xs text-slate-600">{trend.implication}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}