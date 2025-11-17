/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Advanced Proactive Memory Recall                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { Brain, ThumbsUp, ThumbsDown, TrendingUp, Eye, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SentimentAnalyzer } from "./SentimentAnalyzer";
import { NavigationTracker } from "./NavigationTracker";

export default function ProactiveMemoryRecall({ 
  currentInput, 
  currentModality = "chat",
  memories = [],
  onMemoriesRecalled 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState({});

  useEffect(() => {
    if (currentInput && currentInput.length > 15) {
      analyzAndRecall();
    } else {
      setSuggestions([]);
    }
  }, [currentInput, memories]);

  const calculateRelevanceScore = (memory, sentiment, navigation) => {
    let score = 0;

    // 1. Similarité textuelle basique
    const inputLower = currentInput.toLowerCase();
    const contentLower = memory.content?.toLowerCase() || "";
    const tags = memory.tags || [];
    
    if (tags.some(tag => inputLower.includes(tag.toLowerCase()))) {
      score += 0.3;
    }

    const words = inputLower.split(' ').filter(w => w.length > 3);
    const matchingWords = words.filter(w => contentLower.includes(w));
    score += (matchingWords.length / Math.max(words.length, 1)) * 0.2;

    // 2. Sentiment matching
    if (sentiment && memory.context?.sentiment) {
      const sentimentMatch = sentiment.sentiment === memory.context.sentiment;
      score += sentimentMatch ? 0.2 : 0;
      
      const scoreDiff = Math.abs((sentiment.score || 0) - (memory.context.sentiment_score || 0));
      score += (1 - scoreDiff) * 0.1;
    }

    // 3. Navigation context
    const navRelevance = NavigationTracker.getContextualRelevance(memory, currentModality);
    score += navRelevance * 0.15;

    // 4. Importance & recency
    score += (memory.importance || 5) / 100;
    
    const daysSinceCreation = (Date.now() - new Date(memory.created_date).getTime()) / (1000 * 60 * 60 * 24);
    const recencyBoost = Math.max(0, 1 - (daysSinceCreation / 30)) * 0.1;
    score += recencyBoost;

    // 5. Feedback historique
    const feedback = memory.context?.feedback || {};
    const likes = feedback.likes || 0;
    const dislikes = feedback.dislikes || 0;
    const feedbackScore = (likes - dislikes) / Math.max(likes + dislikes, 1);
    score += feedbackScore * 0.15;

    // 6. Cross-modal bonus
    if (memory.modality && memory.modality !== currentModality) {
      score += 0.1;
    }

    return Math.min(score, 1);
  };

  const analyzAndRecall = async () => {
    setLoading(true);

    try {
      // Analyse sentiment
      const sentimentResult = await SentimentAnalyzer.analyzeText(currentInput);
      setSentiment(sentimentResult);
      await SentimentAnalyzer.trackSentimentHistory("current_user", sentimentResult);

      // Score et trie les mémoires
      const scored = memories.map(memory => ({
        memory,
        score: calculateRelevanceScore(memory, sentimentResult, NavigationTracker.currentContext)
      }));

      scored.sort((a, b) => b.score - a.score);

      // Top suggestions avec IA pour enrichissement
      const topMemories = scored.slice(0, 5).filter(s => s.score > 0.3);

      if (topMemories.length > 0) {
        const enriched = await base44.integrations.Core.InvokeLLM({
          prompt: `Contexte utilisateur:
- Input: "${currentInput}"
- Sentiment: ${sentimentResult.sentiment} (${sentimentResult.score})
- Émotions: ${sentimentResult.emotions?.join(', ')}
- Navigation: ${NavigationTracker.currentContext.page}

Mémoires pertinentes:
${topMemories.map((s, i) => `${i + 1}. [Score: ${s.score.toFixed(2)}] ${s.memory.content?.slice(0, 100)}`).join('\n')}

Génère des suggestions intelligentes et contextuelles pour enrichir l'interaction.`,
          response_json_schema: {
            type: "object",
            properties: {
              suggestions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    memory_id: { type: "string" },
                    suggestion_text: { type: "string" },
                    reasoning: { type: "string" },
                    relevance_boost: { type: "number" }
                  }
                }
              },
              recommended_context: { type: "string" },
              emotional_insight: { type: "string" }
            }
          }
        });

        const finalSuggestions = topMemories.map((scored, idx) => ({
          ...scored.memory,
          score: scored.score + (enriched.suggestions[idx]?.relevance_boost || 0),
          suggestion: enriched.suggestions[idx]?.suggestion_text || scored.memory.content?.slice(0, 100),
          reasoning: enriched.suggestions[idx]?.reasoning
        }));

        setSuggestions(finalSuggestions);
        onMemoriesRecalled?.({
          memories: finalSuggestions,
          sentiment: sentimentResult,
          insights: {
            recommended_context: enriched.recommended_context,
            emotional_insight: enriched.emotional_insight
          }
        });
      }
    } catch (error) {
      console.error("Erreur rappel proactif:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (memoryId, isPositive) => {
    setFeedbackGiven(prev => ({ ...prev, [memoryId]: isPositive }));

    try {
      const memory = memories.find(m => m.id === memoryId);
      if (!memory) return;

      const feedback = memory.context?.feedback || { likes: 0, dislikes: 0 };
      
      if (isPositive) {
        feedback.likes = (feedback.likes || 0) + 1;
      } else {
        feedback.dislikes = (feedback.dislikes || 0) + 1;
      }

      await base44.entities.Memory.update(memoryId, {
        context: {
          ...memory.context,
          feedback,
          last_feedback: {
            type: isPositive ? 'like' : 'dislike',
            timestamp: new Date().toISOString(),
            input_context: currentInput.slice(0, 50)
          }
        },
        importance: Math.min(10, memory.importance + (isPositive ? 0.5 : -0.2))
      });

      // Apprentissage: enregistrer pattern
      await base44.entities.Memory.create({
        memory_type: "feedback_pattern",
        content: `Feedback ${isPositive ? 'positif' : 'négatif'} pour suggestion`,
        importance: 3,
        tags: ["feedback", "learning", memory.memory_type || "general"],
        context: {
          memory_id: memoryId,
          input: currentInput,
          sentiment: sentiment?.sentiment,
          feedback_type: isPositive ? 'like' : 'dislike',
          memory_tags: memory.tags,
          relevance_score: suggestions.find(s => s.id === memoryId)?.score
        }
      });

    } catch (error) {
      console.error("Erreur feedback:", error);
    }
  };

  if (!suggestions.length && !loading) return null;

  return (
    <AnimatePresence>
      {(suggestions.length > 0 || loading) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card className="p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-slate-900">
                Rappel Proactif
              </span>
              {sentiment && (
                <Badge className={`ml-auto text-xs ${
                  sentiment.score > 0.3 ? 'bg-green-100 text-green-700' :
                  sentiment.score < -0.3 ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {sentiment.sentiment}
                </Badge>
              )}
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Analyse contextuelle...
              </div>
            ) : (
              <div className="space-y-2">
                {suggestions.slice(0, 3).map((suggestion, idx) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-lg p-3 border border-purple-200"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            Score: {(suggestion.score * 100).toFixed(0)}%
                          </Badge>
                          {suggestion.modality && (
                            <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                              {suggestion.modality}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 mb-1">
                          {suggestion.suggestion || suggestion.content?.slice(0, 120)}
                        </p>
                        {suggestion.reasoning && (
                          <p className="text-xs text-slate-500 italic">
                            💡 {suggestion.reasoning}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant={feedbackGiven[suggestion.id] === true ? "default" : "ghost"}
                          onClick={() => handleFeedback(suggestion.id, true)}
                          className="h-7 w-7 p-0"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant={feedbackGiven[suggestion.id] === false ? "default" : "ghost"}
                          onClick={() => handleFeedback(suggestion.id, false)}
                          className="h-7 w-7 p-0"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-purple-200 flex items-center gap-2 text-xs text-slate-600">
                <TrendingUp className="w-3 h-3" />
                {suggestions.length} suggestions · Basées sur {sentiment?.emotions?.join(', ') || 'contexte'}
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}