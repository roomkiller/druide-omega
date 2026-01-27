import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network, RefreshCw, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const CORRELATION_TYPES = {
  semantic: { label: 'Sémantique', color: 'blue' },
  causal: { label: 'Causal', color: 'red' },
  associative: { label: 'Associatif', color: 'purple' },
  analogical: { label: 'Analogique', color: 'indigo' },
  temporal: { label: 'Temporel', color: 'amber' },
  cross_modal: { label: 'Cross-modal', color: 'pink' }
};

export default function CrossModalCorrelationBuilder() {
  const queryClient = useQueryClient();

  // Récupérer les corrélations existantes
  const { data: correlations = [], isLoading } = useQuery({
    queryKey: ['cognitiveCorrelations'],
    queryFn: async () => {
      return await base44.entities.CognitiveCorrelation.list();
    }
  });

  // Mutation pour générer nouvelles corrélations
  const enhanceMutation = useMutation({
    mutationFn: async () => {
      return await base44.functions.invoke('enhanceCrossModalCorrelations', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cognitiveCorrelations'] });
    }
  });

  const handleEnhance = () => {
    enhanceMutation.mutate();
  };

  const avgStrength = correlations.length > 0
    ? Math.round(correlations.reduce((sum, c) => sum + (c.correlation_strength || 0), 0) / correlations.length)
    : 0;

  const strengthDistribution = {
    strong: correlations.filter(c => (c.correlation_strength || 0) >= 7).length,
    medium: correlations.filter(c => (c.correlation_strength || 0) >= 4 && (c.correlation_strength || 0) < 7).length,
    weak: correlations.filter(c => (c.correlation_strength || 0) < 4).length
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Network className="w-8 h-8 text-indigo-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">Corrélations Cross-Modales</h3>
              <p className="text-sm text-slate-600">Connexions intelligentes entre concepts</p>
            </div>
          </div>
          <Button
            onClick={handleEnhance}
            disabled={enhanceMutation.isPending}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <Zap className={`w-4 h-4 ${enhanceMutation.isPending ? 'animate-spin' : ''}`} />
            {enhanceMutation.isPending ? 'Génération...' : 'Générer'}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-white rounded-lg border border-indigo-200">
            <div className="text-sm text-slate-600 mb-1">Total</div>
            <div className="text-2xl font-bold text-indigo-600">{correlations.length}</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-indigo-200">
            <div className="text-sm text-slate-600 mb-1">Moyenne</div>
            <div className="text-2xl font-bold text-purple-600">{avgStrength}/10</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-indigo-200">
            <div className="text-sm text-slate-600 mb-1">Fortes</div>
            <div className="text-2xl font-bold text-green-600">{strengthDistribution.strong}</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-indigo-200">
            <div className="text-sm text-slate-600 mb-1">Faibles</div>
            <div className="text-2xl font-bold text-amber-600">{strengthDistribution.weak}</div>
          </div>
        </div>
      </Card>

      {/* Correlations List */}
      {isLoading ? (
        <Card className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-600">
            <div className="animate-spin">⏳</div>
            Chargement des corrélations...
          </div>
        </Card>
      ) : correlations.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50 border-slate-200">
          <Network className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 mb-4">Aucune corrélation trouvée</p>
          <Button onClick={handleEnhance} className="gap-2">
            <Zap className="w-4 h-4" />
            Créer les premières corrélations
          </Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          {correlations.map((corr, idx) => {
            const typeInfo = CORRELATION_TYPES[corr.correlation_type] || CORRELATION_TYPES.semantic;
            const strength = corr.correlation_strength || 5;

            return (
              <motion.div
                key={corr.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-4 hover:shadow-md transition-all border-l-4" style={{ borderLeftColor: `var(--color-${typeInfo.color}-600)` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Badge className={`bg-${typeInfo.color}-100 text-${typeInfo.color}-700`}>
                        {typeInfo.label}
                      </Badge>
                      <div className="text-sm font-medium text-slate-900 flex-1">
                        <span className="text-slate-700">{corr.source_content}</span>
                        <ArrowRight className="w-3 h-3 inline mx-2 text-slate-400" />
                        <span className="text-slate-700">{corr.target_content}</span>
                      </div>
                    </div>
                    <Badge className={`bg-${strength >= 7 ? 'green' : strength >= 4 ? 'blue' : 'amber'}-100 text-${strength >= 7 ? 'green' : strength >= 4 ? 'blue' : 'amber'}-700`}>
                      Force: {strength}/10
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 mb-2">{corr.interpretation || corr.justification}</p>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Confiance: {corr.confidence_level || 0}%</span>
                    {corr.cognitive_layer && (
                      <Badge variant="outline" className="bg-slate-50 text-slate-600">
                        {corr.cognitive_layer}
                      </Badge>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Info */}
      <Card className="p-4 bg-slate-50 border-slate-200">
        <p className="text-xs text-slate-600">
          💡 Les corrélations cross-modales connectent mémoires, connaissances et conversations pour une contextualisation plus riche et intelligente.
        </p>
      </Card>
    </div>
  );
}