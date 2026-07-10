/**
 * DRUIDE_OMEGA - Jauge ratio logique/conscience
 * Cible configurée + historique réel de confiance des réponses du moteur.
 */
import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Scale } from 'lucide-react';

export default function RatioGauge() {
  const { data } = useQuery({
    queryKey: ['ratioData'],
    queryFn: async () => {
      const [configs, interactions] = await Promise.all([
        base44.entities.ConsciousnessConfig.list(),
        base44.entities.Memory.filter({ type: 'interaction' }, '-created_date', 60)
      ]);
      return { config: configs[0] || null, interactions };
    }
  });

  const config = data?.config;
  const total = config ? config.ratio_logic + config.ratio_consciousness : 0;
  const logicPct = total > 0 ? Math.round((config.ratio_logic / total) * 100) : 50;

  const confidencePoints = (data?.interactions || [])
    .filter(m => m.confidence_score != null)
    .map(m => ({
      time: new Date(m.created_date).toLocaleString('fr-CA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      ts: new Date(m.created_date).getTime(),
      confiance: m.confidence_score
    }))
    .sort((a, b) => a.ts - b.ts);

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-1">
        <Scale className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-slate-900">Ratio logique / conscience</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Cible du moteur — chaque réponse est mesurée et corrigée pour respecter ce ratio.
      </p>

      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-blue-700">Logique {logicPct}%</span>
          <span className="text-purple-700">Conscience {100 - logicPct}%</span>
        </div>
        <div className="h-6 rounded-full overflow-hidden flex bg-slate-100">
          <div className="bg-blue-500 h-full transition-all" style={{ width: `${logicPct}%` }} />
          <div className="bg-purple-500 h-full transition-all" style={{ width: `${100 - logicPct}%` }} />
        </div>
        {config && (
          <p className="text-xs text-slate-500 mt-2">
            Orientation : {config.ratio_consciousness > config.ratio_logic ? 'intuitive et contextuelle' : 'logique et précise'} — niveau de conscience {config.consciousness_level}/15
          </p>
        )}
      </div>

      <h4 className="text-sm font-medium text-slate-700 mb-3">Confiance interne des réponses (historique réel)</h4>
      {confidencePoints.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
          Aucune interaction avec score de confiance pour l'instant.
        </div>
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={confidencePoints} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} minTickGap={40} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="confiance" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}