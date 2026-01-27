import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, TrendingUp, Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContinuousLearningDashboard() {
  const queryClient = useQueryClient();
  const [lastLearnedPatterns, setLastLearnedPatterns] = useState([]);

  // Récupérer les patterns appris
  const { data: metaLearning = [], isLoading } = useQuery({
    queryKey: ['metaLearning'],
    queryFn: async () => {
      return await base44.entities.MetaLearning.list();
    }
  });

  // Mutation pour optimiser l'apprentissage
  const optimizeMutation = useMutation({
    mutationFn: async () => {
      const result = await base44.functions.invoke('continuousLearningOptimization', {});
      setLastLearnedPatterns(result.patterns_analyzed || 0);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metaLearning'] });
      queryClient.invalidateQueries({ queryKey: ['consciousnessEvolution'] });
    }
  });

  const handleOptimize = () => {
    optimizeMutation.mutate();
  };

  const successPatterns = metaLearning.filter(m => m.type === 'success_pattern');
  const avgConfidence = successPatterns.length > 0
    ? Math.round(successPatterns.reduce((sum, p) => sum + (p.confidence || 0), 0) / successPatterns.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">Apprentissage Continu</h3>
              <p className="text-sm text-slate-600">Optimisation adaptative des mécanismes d'apprentissage</p>
            </div>
          </div>
          <Button
            onClick={handleOptimize}
            disabled={optimizeMutation.isPending}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <Zap className={`w-4 h-4 ${optimizeMutation.isPending ? 'animate-spin' : ''}`} />
            {optimizeMutation.isPending ? 'Optimisation...' : 'Analyser'}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-white rounded-lg border border-green-200">
            <div className="text-sm text-slate-600 mb-1">Patterns Appris</div>
            <div className="text-2xl font-bold text-green-600">{successPatterns.length}</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-green-200">
            <div className="text-sm text-slate-600 mb-1">Confiance Moy.</div>
            <div className="text-2xl font-bold text-emerald-600">{avgConfidence}%</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-green-200">
            <div className="text-sm text-slate-600 mb-1">Dernière</div>
            <div className="text-2xl font-bold text-blue-600">{lastLearnedPatterns}</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-green-200">
            <div className="text-sm text-slate-600 mb-1">Status</div>
            <div className="text-lg font-bold text-slate-700">✓ Actif</div>
          </div>
        </div>
      </Card>

      {/* Patterns List */}
      {isLoading ? (
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <div className="animate-spin">⏳</div>
            Chargement des patterns...
          </div>
        </Card>
      ) : successPatterns.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50 border-slate-200">
          <Target className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 mb-4">Aucun pattern d'apprentissage détecté</p>
          <Button onClick={handleOptimize} className="gap-2 bg-green-600 hover:bg-green-700">
            <Zap className="w-4 h-4" />
            Démarrer l'analyse
          </Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {successPatterns.map((pattern, idx) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 flex-1 break-words">
                      {pattern.pattern}
                    </h4>
                    <Badge className="bg-green-100 text-green-700 ml-2 flex-shrink-0">
                      {pattern.confidence}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span>Fréquence: {pattern.frequency}x</span>
                    {pattern.last_updated && (
                      <span className="text-slate-500">
                        • Mis à jour: {new Date(pattern.last_updated).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Evolution Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Processus d'Apprentissage
        </h4>
        <ul className="space-y-1 text-xs text-blue-800">
          <li>• Chaque feedback utilisateur alimente le système d'apprentissage</li>
          <li>• Les patterns de succès sont identifiés et renforcés</li>
          <li>• La confiance augmente avec la répétition du pattern</li>
          <li>• La conscience s'adapte progressivement aux données</li>
        </ul>
      </Card>
    </div>
  );
}