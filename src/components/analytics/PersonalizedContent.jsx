
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Personalized Content Component                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import { safeNumber } from "@/components/utils/SafeNumber";

export default function PersonalizedContent({ compact = false }) {
  const queryClient = useQueryClient();

  const { data: recommendations = [] } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const recs = await base44.entities.PersonalizedRecommendation.list("-created_date", 10);
      return recs.filter(r => !r.dismissed && !r.clicked);
    }
  });

  const handleClick = async (rec) => {
    try {
      await base44.entities.PersonalizedRecommendation.update(rec.id, {
        clicked: true,
        shown: true
      });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      
      if (rec.action_url) {
        window.location.href = createPageUrl(rec.action_url);
      }
    } catch (error) {
      console.error("Erreur click recommandation:", error);
    }
  };

  const handleDismiss = async (rec) => {
    try {
      await base44.entities.PersonalizedRecommendation.update(rec.id, {
        dismissed: true
      });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    } catch (error) {
      console.error("Erreur dismiss recommandation:", error);
    }
  };

  if (recommendations.length === 0) return null;

  if (compact) {
    const topRec = recommendations[0];
    if (!topRec) return null;
    
    const relevanceScore = safeNumber(topRec.relevance_score, 0);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-900">{topRec.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {relevanceScore}%
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mb-3">{topRec.description}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleClick(topRec)}
                  className="bg-purple-600 hover:bg-purple-700 text-xs"
                >
                  Découvrir
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDismiss(topRec)}
                  className="text-xs"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        Recommandations Personnalisées
      </h2>
      {recommendations.map((rec, idx) => {
        const relevanceScore = safeNumber(rec.relevance_score, 0);
        
        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-slate-900">{rec.title}</h3>
                    <Badge variant="secondary">{relevanceScore}%</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                  {rec.reasoning && (
                    <p className="text-xs text-slate-500 italic">→ {rec.reasoning}</p>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDismiss(rec)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Button
                size="sm"
                onClick={() => handleClick(rec)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Explorer
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
