import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingDown, Clock, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LatencyOptimizer() {
  const [config, setConfig] = useState(null);
  const [avgLatency, setAvgLatency] = useState(0);

  const optimizeMutation = useMutation({
    mutationFn: async () => {
      const result = await base44.functions.invoke('optimizingLatency', {});
      setConfig(result);
      return result;
    }
  });

  const handleOptimize = () => {
    optimizeMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Gauge className="w-8 h-8 text-cyan-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">Optimiseur de Latence</h3>
              <p className="text-sm text-slate-600">Réduction des temps de réponse et optimisation</p>
            </div>
          </div>
          <Button
            onClick={handleOptimize}
            disabled={optimizeMutation.isPending}
            className="gap-2 bg-cyan-600 hover:bg-cyan-700"
          >
            <Zap className={`w-4 h-4 ${optimizeMutation.isPending ? 'animate-spin' : ''}`} />
            {optimizeMutation.isPending ? 'Optimisation...' : 'Analyser'}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-white rounded-lg border border-cyan-200">
            <div className="text-sm text-slate-600 mb-1">Avg Latency</div>
            <div className="text-2xl font-bold text-cyan-600">{avgLatency}ms</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-cyan-200">
            <div className="text-sm text-slate-600 mb-1">Status</div>
            <div className="text-lg font-bold text-slate-700">
              {config ? '✓' : '⏳'}
            </div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-cyan-200">
            <div className="text-sm text-slate-600 mb-1">Cache</div>
            <div className="text-lg font-bold text-green-600">Enabled</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-cyan-200">
            <div className="text-sm text-slate-600 mb-1">Mode</div>
            <div className="text-lg font-bold text-blue-600">Fast</div>
          </div>
        </div>
      </Card>

      {/* Results */}
      {config ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Bottlenecks */}
          {config.bottlenecks?.length > 0 && (
            <Card className="p-4 border-l-4 border-red-500">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                Goulots d'étranglement
              </h4>
              <ul className="space-y-2">
                {config.bottlenecks.map((bn, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-red-600">•</span>
                    {bn}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Caching Strategies */}
          {config.strategies?.length > 0 && (
            <Card className="p-4 border-l-4 border-green-500">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-600" />
                Stratégies de Cache
              </h4>
              <div className="space-y-3">
                {config.strategies.map((s, i) => (
                  <div key={i} className="p-3 bg-green-50 rounded border border-green-200">
                    <div className="text-sm font-medium text-green-900">{s.pattern}</div>
                    <div className="text-xs text-green-700">
                      TTL: {s.ttl_seconds}s ({Math.round(s.ttl_seconds / 60)}min)
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Fast Approximation */}
          {config.fast_approximation && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">Réponse Rapide</h4>
              <p className="text-sm text-blue-800">{config.fast_approximation}</p>
            </Card>
          )}
        </motion.div>
      ) : (
        <Card className="p-8 text-center bg-slate-50 border-slate-200">
          <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600">Lancez l'analyse pour identifier les optimisations</p>
        </Card>
      )}

      {/* Best Practices */}
      <Card className="p-4 bg-slate-50 border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-2">Techniques d'Optimisation</h4>
        <ul className="space-y-2 text-xs text-slate-600">
          <li>• <strong>Caching intelligent:</strong> Réutiliser les réponses pour requêtes identiques</li>
          <li>• <strong>Streaming:</strong> Commencer à envoyer les résultats avant la fin du calcul</li>
          <li>• <strong>Approximations rapides:</strong> Réponse préliminaire pendant calcul complet</li>
          <li>• <strong>Batching:</strong> Regrouper les appels API pour réduire les latences réseau</li>
        </ul>
      </Card>
    </div>
  );
}