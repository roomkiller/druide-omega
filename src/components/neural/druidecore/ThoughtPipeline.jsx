/**
 * DRUIDE_OMEGA - Pipeline de pensée du DruideCore
 * Les 7 phases du moteur, animées avec les valeurs réelles de la dernière interaction.
 */
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Brain, Flame, Database, Eye, GitBranch, MessageSquare, Scale, RotateCcw } from 'lucide-react';

const TENSION_LABELS = {
  survival: 'Survie', relevance: 'Pertinence', understanding: 'Compréhension',
  growth: 'Croissance', curiosity: 'Curiosité'
};

export default function ThoughtPipeline() {
  const [replayKey, setReplayKey] = useState(0);

  const { data } = useQuery({
    queryKey: ['pipelineData'],
    queryFn: async () => {
      const [interactions, configs, tensions] = await Promise.all([
        base44.entities.Memory.filter({ type: 'interaction' }, '-created_date', 1),
        base44.entities.ConsciousnessConfig.list(),
        base44.entities.Memory.filter({ type: 'insight', tags: 'tensions' }, '-created_date', 1)
      ]);
      return { last: interactions[0] || null, config: configs[0] || null, tension: tensions[0] || null };
    }
  });

  const last = data?.last;
  const config = data?.config;

  let dominant = null;
  if (data?.tension) {
    try {
      const s = JSON.parse(data.tension.content);
      let maxU = 0;
      Object.entries(s.tensions || {}).forEach(([k, t]) => {
        const u = 100 - (t.value ?? 50);
        if (u > maxU) { maxU = u; dominant = k; }
      });
    } catch (_) { /* état illisible */ }
  }

  const phases = [
    { icon: Brain, label: 'Analyse cognitive', value: last ? `Intensité ${last.importance}/10` : '—', color: 'bg-blue-500' },
    { icon: Flame, label: 'Tensions émergentes', value: dominant ? TENSION_LABELS[dominant] || dominant : '—', color: 'bg-amber-500' },
    { icon: Database, label: 'Mémoires & savoirs', value: last?.tags?.length ? last.tags.slice(0, 2).join(', ') : '—', color: 'bg-emerald-500' },
    { icon: Eye, label: 'Auto-réflexion', value: last?.confidence_score != null ? `Confiance ${last.confidence_score}%` : '—', color: 'bg-cyan-500' },
    { icon: GitBranch, label: 'Filaments parallèles', value: 'Pensées simultanées', color: 'bg-purple-500' },
    { icon: MessageSquare, label: 'Génération', value: config ? (config.ratio_consciousness > config.ratio_logic ? 'Intuitive' : 'Logique') : '—', color: 'bg-indigo-500' },
    { icon: Scale, label: 'Validation ratio', value: config ? `${config.ratio_logic}:${config.ratio_consciousness}` : '—', color: 'bg-pink-500' }
  ];

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-slate-900">Pipeline de pensée</h3>
          <p className="text-sm text-slate-500">
            {last ? `Dernière interaction : ${new Date(last.created_date).toLocaleString('fr-CA')}` : 'Aucune interaction enregistrée'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setReplayKey(k => k + 1)}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Rejouer
        </Button>
      </div>

      <div key={replayKey} className="flex flex-col lg:flex-row lg:items-stretch gap-3">
        {phases.map((phase, i) => {
          const Icon = phase.icon;
          return (
            <React.Fragment key={phase.label}>
              <motion.div
                initial={{ opacity: 0.2, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.35, duration: 0.4 }}
                className="flex-1 min-w-0"
              >
                <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-center hover:shadow-md transition-shadow">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ delay: i * 0.35 + 0.2, duration: 0.6 }}
                    className={`w-10 h-10 ${phase.color} rounded-lg flex items-center justify-center mx-auto mb-2`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <div className="text-xs font-medium text-slate-900 mb-1">{phase.label}</div>
                  <div className="text-xs text-slate-500 truncate" title={phase.value}>{phase.value}</div>
                </div>
              </motion.div>
              {i < phases.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.35 + 0.3 }}
                  className="hidden lg:flex items-center text-slate-300 text-lg"
                >
                  →
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
}