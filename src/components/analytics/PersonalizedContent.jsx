/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Personalized Content Widget                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PersonalizedContent({ compact = false }) {
  const { data: recommendations = [], refetch } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const recs = await base44.entities.PersonalizedRecommendation.list("-relevance_score", 5);
      return recs.filter(r => !r.dismissed && !r.clicked);
    },
    initialData: []
  });

  const handleClick = async (rec) => {
    await base44.entities.PersonalizedRecommendation.update(rec.id, { 
      clicked: true,
      shown: true 
    });
    window.location.href = createPageUrl(rec.action_url);
  };

  const handleDismiss = async (rec) => {
    await base44.entities.PersonalizedRecommendation.update(rec.id, { 
      dismissed: true 
    });
    refetch();
  };

  if (recommendations.length === 0) return null;

  if (compact) {
    const topRec = recommendations[0];
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-slate-900">{topRec.title}</h4>
                <Badge variant="outline" className="text-xs">{topRec.relevance_score}%</Badge>
              </div>
              <p className="text-xs text-slate-600 mb-2">{topRec.description}</p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleClick(topRec)}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs h-7"
                >
                  Découvrir
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => handleDismiss(topRec)}
                  className="text-xs h-7"
                >
                  Plus tard
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-slate-900">Recommandations personnalisées</h3>
      </div>

      <AnimatePresence>
        {recommendations.map((rec, idx) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-base font-semibold text-slate-900">{rec.title}</h4>
                    <Badge variant="secondary">{rec.relevance_score}% pertinent</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{rec.description}</p>
                  <p className="text-xs text-slate-500 italic">💡 {rec.reasoning}</p>
                  
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      onClick={() => handleClick(rec)}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600"
                    >
                      Explorer
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDismiss(rec)}
                    >
                      Ignorer
                    </Button>
                  </div>
                </div>
                
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDismiss(rec)}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}