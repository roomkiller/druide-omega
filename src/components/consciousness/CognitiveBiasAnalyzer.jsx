import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Zap, CheckCircle2, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const BIAS_COLORS = {
  confirmation: 'red',
  anchoring: 'orange',
  availability: 'amber',
  recency: 'yellow',
  sunk_cost: 'red',
  overconfidence: 'pink',
  hindsight: 'purple',
  groupthink: 'blue'
};

export default function CognitiveBiasAnalyzer() {
  const [biases, setBiases] = useState([]);
  const queryClient = useQueryClient();

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      return await base44.functions.invoke('cognitivebiasDetector', {});
    },
    onSuccess: (data) => {
      setBiases(data.biases || []);
      queryClient.invalidateQueries({ queryKey: ['cognitiveCorrelations'] });
    }
  });

  const handleAnalyze = () => {
    analyzeMutation.mutate();
  };

  const highSeverity = biases.filter(b => (b.severity || 0) >= 7).length;
  const correctionRate = biases.length > 0 ? Math.round(((biases.length - highSeverity) / biases.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">Détecteur de Biais Cognitifs</h3>
              <p className="text-sm text-slate-600">Identification et neutralisation des biais décisionnels</p>
            </div>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={analyzeMutation.isPending}
            className="gap-2 bg-red-600 hover:bg-red-700"
          >
            <Zap className={`w-4 h-4 ${analyzeMutation.isPending ? 'animate-spin' : ''}`} />
            {analyzeMutation.isPending ? 'Analyse...' : 'Analyser'}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-white rounded-lg border border-red-200">
            <div className="text-sm text-slate-600 mb-1">Biais Détectés</div>
            <div className="text-2xl font-bold text-red-600">{biases.length}</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-red-200">
            <div className="text-sm text-slate-600 mb-1">Sévérité Haute</div>
            <div className="text-2xl font-bold text-orange-600">{highSeverity}</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-red-200">
            <div className="text-sm text-slate-600 mb-1">Contrôlés</div>
            <div className="text-2xl font-bold text-green-600">{correctionRate}%</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-red-200">
            <div className="text-sm text-slate-600 mb-1">Status</div>
            <div className="text-lg font-bold text-slate-700">
              {biases.length === 0 ? '✓' : '⚠'}
            </div>
          </div>
        </div>
      </Card>

      {/* Biases List */}
      {biases.length === 0 ? (
        <Card className="p-8 text-center bg-green-50 border-green-200">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-slate-600 mb-4">Aucun biais détecté pour le moment</p>
          <Button onClick={handleAnalyze} className="gap-2 bg-green-600 hover:bg-green-700">
            <Zap className="w-4 h-4" />
            Lancer une analyse
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {biases.map((bias, idx) => {
            const color = BIAS_COLORS[bias.type?.toLowerCase().replace(/\s+/g, '_')] || 'slate';
            const severity = bias.severity || 5;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`p-5 border-l-4 border-${color}-500 hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-slate-900 capitalize">{bias.type}</h4>
                        <Badge className={`bg-${color}-100 text-${color}-700`}>
                          Sévérité: {severity}/10
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">{bias.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3 p-3 bg-slate-50 rounded border border-slate-200">
                    <div>
                      <div className="text-xs font-semibold text-slate-600 mb-1">Évidence:</div>
                      <p className="text-xs text-slate-600">{bias.evidence}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-green-700 mb-1">Correction:</div>
                        <p className="text-xs text-green-700">{bias.correction}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Best Practices */}
      <Card className="p-5 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3">Stratégies de Neutralisation</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex gap-2">
            <span>🔍</span>
            <span><strong>Audit décisionnel:</strong> Examinex chaque décision importante avec scepticisme</span>
          </li>
          <li className="flex gap-2">
            <span>⚖️</span>
            <span><strong>Arguments opposés:</strong> Considérez activement les perspectives contraires</span>
          </li>
          <li className="flex gap-2">
            <span>⏸️</span>
            <span><strong>Pause réflexive:</strong> Ralentissez le raisonnement lors des décisions critiques</span>
          </li>
          <li className="flex gap-2">
            <span>📊</span>
            <span><strong>Données objectives:</strong> Privilégiez les données aux intuitions</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}