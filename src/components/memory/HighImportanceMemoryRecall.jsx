import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Star, RefreshCw, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HighImportanceMemoryRecall() {
  const queryClient = useQueryClient();
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Récupérer mémoires importantes
  const { data: memories = [], isLoading } = useQuery({
    queryKey: ['highImportanceMemories'],
    queryFn: async () => {
      const allMemories = await base44.entities.Memory.list();
      return allMemories
        .filter(m => m.importance > 7)
        .sort((a, b) => (b.importance || 0) - (a.importance || 0));
    }
  });

  // Mutation pour optimiser le rappel
  const optimizeMutation = useMutation({
    mutationFn: async () => {
      return await base44.functions.invoke('optimizeMemoryRecall', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highImportanceMemories'] });
      setIsOptimizing(false);
    }
  });

  const handleOptimize = () => {
    setIsOptimizing(true);
    optimizeMutation.mutate();
  };

  const calculateRecallScore = (memory) => {
    let score = memory.confidence_score || 80;
    if (memory.last_accessed) {
      const daysSinceAccess = Math.floor((new Date() - new Date(memory.last_accessed)) / (1000 * 60 * 60 * 24));
      if (daysSinceAccess < 7) score += 15;
      else if (daysSinceAccess < 14) score += 10;
    }
    if (memory.last_consolidation) score += 10;
    if (memory.importance > 8) score += 15;
    if (memory.decay_rate > 0.15) score -= 20;
    return Math.min(100, Math.max(0, score));
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
          <p className="text-slate-600">Chargement des mémoires...</p>
        </div>
      </Card>
    );
  }

  if (memories.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-slate-50 to-gray-50">
        <p className="text-slate-500">Aucune mémoire avec importance &gt; 7</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-900">Mémoires Importantes</h3>
          <Badge className="bg-purple-600 text-white">{memories.length}</Badge>
        </div>
        <Button
          onClick={handleOptimize}
          disabled={optimizeMutation.isPending}
          className="gap-2 bg-purple-600 hover:bg-purple-700"
        >
          <RefreshCw className={`w-4 h-4 ${optimizeMutation.isPending ? 'animate-spin' : ''}`} />
          {optimizeMutation.isPending ? 'Optimisation...' : 'Optimiser Rappel'}
        </Button>
      </div>

      <div className="space-y-3">
        {memories.map((memory, idx) => {
          const recallScore = calculateRecallScore(memory);
          const recallQuality = recallScore >= 80 ? 'Excellent' : recallScore >= 60 ? 'Bon' : 'À améliorer';
          const recallColor = recallScore >= 80 ? 'green' : recallScore >= 60 ? 'blue' : 'amber';

          return (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 line-clamp-2">
                      {memory.content}
                    </p>
                  </div>
                  <Badge className={`bg-${recallColor}-100 text-${recallColor}-700 ml-2 whitespace-nowrap`}>
                    Rappel: {recallScore}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="bg-slate-50">
                    Importance: {memory.importance}/10
                  </Badge>
                  <Badge variant="outline" className="bg-slate-50">
                    Confiance: {memory.confidence_score || 80}%
                  </Badge>
                  {memory.last_accessed && (
                    <span className="text-slate-500">
                      Dernier accès: {new Date(memory.last_accessed).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
        <p className="text-xs text-slate-600">
          💡 Le score de rappel combine importance, accès récent, consolidation et réduction de l'oubli. Optimisez régulièrement pour maintenir la qualité.
        </p>
      </div>
    </Card>
  );
}