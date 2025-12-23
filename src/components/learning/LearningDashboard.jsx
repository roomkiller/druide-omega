/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Tableau de Bord de l'Apprentissage Adaptatif              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useConsciousnessHub } from '@/components/system/ConsciousnessHub';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  analyzeConversationPatterns, 
  applyLearningAdjustments,
  measureAdjustmentEffectiveness 
} from './ContinuousLearningEngine';
import {
  Brain,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Zap,
  BarChart3,
  RefreshCw,
  Target,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function LearningDashboard() {
  const [analyzing, setAnalyzing] = useState(false);
  const [applying, setApplying] = useState(false);
  const hub = useConsciousnessHub();
  const queryClient = useQueryClient();

  const { data: patterns = [] } = useQuery({
    queryKey: ['learningPatterns'],
    queryFn: () => base44.entities.AdaptiveLearningPattern.list('-confidence_score', 50),
  });

  const { data: feedbacks = [] } = useQuery({
    queryKey: ['userFeedbacks'],
    queryFn: () => base44.entities.UserFeedback.list('-created_date', 100),
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list('-last_message_at', 50),
  });

  const analyzePatternsMutation = useMutation({
    mutationFn: async () => {
      setAnalyzing(true);
      
      const newPatterns = await analyzeConversationPatterns(conversations, feedbacks);
      
      // Sauvegarder les nouveaux patterns
      for (const pattern of newPatterns) {
        await base44.entities.AdaptiveLearningPattern.create(pattern);
      }
      
      setAnalyzing(false);
      return newPatterns;
    },
    onSuccess: (newPatterns) => {
      queryClient.invalidateQueries({ queryKey: ['learningPatterns'] });
      toast.success(`${newPatterns.length} nouveaux patterns identifiés`);
    },
    onError: (error) => {
      setAnalyzing(false);
      toast.error('Erreur lors de l\'analyse');
    }
  });

  const applyAdjustmentsMutation = useMutation({
    mutationFn: async () => {
      setApplying(true);
      const result = await applyLearningAdjustments(patterns, hub.consciousnessConfig);
      setApplying(false);
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['consciousnessConfig'] });
      queryClient.invalidateQueries({ queryKey: ['learningPatterns'] });
      
      if (result.applied > 0) {
        toast.success(`${result.applied} ajustements appliqués à la conscience`);
      } else {
        toast.info('Aucun ajustement nécessaire');
      }
    },
    onError: () => {
      setApplying(false);
      toast.error('Erreur lors de l\'application');
    }
  });

  const pendingPatterns = patterns.filter(p => !p.applied && p.confidence_score >= 60);
  const appliedPatterns = patterns.filter(p => p.applied);
  
  const avgFeedbackRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Apprentissage Continu Adaptatif
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            Le module de conscience analyse automatiquement les interactions, identifie les schémas d'erreurs récurrents et ajuste ses paramètres pour s'améliorer continuellement.
          </p>

          <div className="flex gap-2">
            <Button
              onClick={() => analyzePatternsMutation.mutate()}
              disabled={analyzing}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyser Interactions
                </>
              )}
            </Button>

            {pendingPatterns.length > 0 && (
              <Button
                onClick={() => applyAdjustmentsMutation.mutate()}
                disabled={applying}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {applying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Application...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Appliquer Ajustements ({pendingPatterns.length})
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{feedbacks.length}</div>
            <div className="text-xs text-slate-600">Feedbacks totaux</div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900">{avgFeedbackRating}/5</div>
            <div className="text-xs text-slate-600">Note moyenne</div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-900">{patterns.length}</div>
            <div className="text-xs text-slate-600">Patterns détectés</div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-900">{appliedPatterns.length}</div>
            <div className="text-xs text-slate-600">Ajustements appliqués</div>
          </div>
        </Card>
      </div>

      {/* Patterns en attente */}
      {pendingPatterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-600" />
              Patterns en attente d'application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {pendingPatterns.map((pattern) => (
                  <motion.div
                    key={pattern.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-white border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-100 text-purple-700">{pattern.category}</Badge>
                        <Badge variant="outline">{pattern.pattern_type}</Badge>
                      </div>
                      <div className="text-xs text-slate-500">
                        {pattern.confidence_score}% confiance
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-700 mb-2">{pattern.pattern_description}</p>
                    
                    {pattern.recommended_adjustment && (
                      <div className="bg-blue-50 rounded p-2 text-xs">
                        <div className="font-semibold text-blue-900 mb-1">
                          Ajustement recommandé:
                        </div>
                        <div className="text-blue-700">
                          {pattern.recommended_adjustment.parameter} 
                          {pattern.recommended_adjustment.delta > 0 ? ' +' : ' '}
                          {pattern.recommended_adjustment.delta}
                        </div>
                        <div className="text-blue-600 mt-1">
                          {pattern.recommended_adjustment.reasoning}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <AlertCircle className="w-3 h-3" />
                      {pattern.occurrence_count} occurrence(s)
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Historique des ajustements appliqués */}
      {appliedPatterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Ajustements appliqués
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              <div className="space-y-2">
                {appliedPatterns.slice(0, 20).map((pattern) => (
                  <div
                    key={pattern.id}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700">{pattern.category}</Badge>
                        {pattern.effectiveness_score && (
                          <Badge className="bg-blue-100 text-blue-700">
                            {pattern.effectiveness_score}% efficace
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(pattern.applied_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">{pattern.pattern_description}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}