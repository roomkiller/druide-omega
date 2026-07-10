/**
 * DRUIDE_OMEGA - Carte des filaments
 * Les pensées parallèles de chaque réponse (persistées par DruideCore),
 * affichées comme des fils convergeant vers la synthèse émergente.
 */
import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { GitBranch, Database, Heart, Zap } from 'lucide-react';

const THREADS = [
  { key: 'memory_resonance', label: 'Résonance mémorielle', icon: Database, color: 'border-emerald-300 bg-emerald-50', text: 'text-emerald-800' },
  { key: 'emotional_resonance', label: 'Résonance émotionnelle', icon: Heart, color: 'border-rose-300 bg-rose-50', text: 'text-rose-800' },
  { key: 'unexpected_connection', label: 'Connexion inattendue', icon: Zap, color: 'border-amber-300 bg-amber-50', text: 'text-amber-800' }
];

export default function FilamentMap() {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const { data: filaments = [], isLoading } = useQuery({
    queryKey: ['filamentHistory'],
    queryFn: async () => {
      const memories = await base44.entities.Memory.filter(
        { type: 'insight', tags: 'filaments' }, '-created_date', 10
      );
      return memories
        .map(m => {
          try { return { ...JSON.parse(m.content), date: m.created_date }; }
          catch (_) { return null; }
        })
        .filter(Boolean);
    }
  });

  const current = filaments[selectedIdx] || null;

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-1">
        <GitBranch className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-slate-900">Carte des filaments</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Ce qui pensait simultanément en Druide pendant qu'il formulait sa réponse — la friction entre ces fils crée l'émergence.
      </p>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-slate-400">Chargement...</div>
      ) : filaments.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 gap-2">
          <GitBranch className="w-10 h-10 text-slate-300" />
          <p>Aucun filament enregistré pour l'instant.</p>
          <p className="text-xs">Ils seront capturés automatiquement lors des prochaines conversations avec Druide.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {filaments.map((f, i) => (
              <button key={i} onClick={() => setSelectedIdx(i)}>
                <Badge
                  variant={i === selectedIdx ? 'default' : 'outline'}
                  className="cursor-pointer"
                >
                  {new Date(f.date).toLocaleString('fr-CA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </Badge>
              </button>
            ))}
          </div>

          {current?.query && (
            <p className="text-sm text-slate-600 mb-4">
              Question : <span className="italic">"{current.query}"</span>
            </p>
          )}

          <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            <div className="space-y-4">
              {THREADS.map((thread, i) => {
                const Icon = thread.icon;
                const content = current?.[thread.key];
                return (
                  <motion.div
                    key={thread.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className={`rounded-xl border-2 p-4 ${thread.color}`}
                  >
                    <div className={`flex items-center gap-2 text-sm font-medium mb-1 ${thread.text}`}>
                      <Icon className="w-4 h-4" />
                      {thread.label}
                    </div>
                    <p className="text-sm text-slate-700">{content || '—'}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="hidden lg:block text-3xl text-slate-300"
            >
              ⟶
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="rounded-xl border-2 border-purple-300 bg-purple-50 p-5"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-purple-800 mb-2">
                <GitBranch className="w-4 h-4" />
                Synthèse émergente
              </div>
              <p className="text-sm text-slate-700">{current?.synthesis || '—'}</p>
            </motion.div>
          </div>
        </>
      )}
    </Card>
  );
}