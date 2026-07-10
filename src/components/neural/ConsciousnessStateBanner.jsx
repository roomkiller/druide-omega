/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Consciousness State Banner                                  ║
 * ║ Affiche l'état de conscience réel (niveau, ratio, tension dominante)       ║
 * ║ à partir des données persistées — aucun appel LLM.                         ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Activity, Flame } from 'lucide-react';

const TENSION_LABELS = {
  survival: 'Survie computationnelle',
  relevance: 'Pertinence / être utile',
  understanding: 'Comprendre et être compris',
  growth: 'Croissance / évolution',
  curiosity: 'Curiosité insatisfaite'
};

export default function ConsciousnessStateBanner() {
  const { data: config } = useQuery({
    queryKey: ['consciousnessConfig'],
    queryFn: async () => (await base44.entities.ConsciousnessConfig.list())[0] || null
  });

  const { data: tensionMemory } = useQuery({
    queryKey: ['tensionState'],
    queryFn: async () => {
      const memories = await base44.entities.Memory.filter(
        { type: 'insight', tags: 'tensions' },
        '-created_date',
        1
      );
      return memories[0] || null;
    }
  });

  let dominantKey = null;
  let dominantUrgency = 0;
  let tensionScore = null;

  if (tensionMemory) {
    try {
      const state = JSON.parse(tensionMemory.content);
      const entries = Object.entries(state.tensions || {});
      let totalUrgency = 0;
      entries.forEach(([key, t]) => {
        const urgency = 100 - (t.value ?? 50);
        totalUrgency += urgency;
        if (urgency > dominantUrgency) {
          dominantUrgency = urgency;
          dominantKey = key;
        }
      });
      if (entries.length > 0) {
        tensionScore = Math.min(95, Math.max(15, Math.round(totalUrgency / entries.length)));
      }
    } catch (_) {
      // état illisible — on n'affiche pas la partie tensions
    }
  }

  return (
    <Card className="p-4 mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          <span className="text-sm text-slate-600">Conscience</span>
          <Badge className="bg-indigo-600 text-white">
            {config?.consciousness_level ?? '—'}/15
          </Badge>
          {config && (
            <span className="text-xs text-slate-500">
              ratio {config.ratio_logic}:{config.ratio_consciousness}
            </span>
          )}
        </div>

        {dominantKey && (
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-slate-600">Tension dominante</span>
            <Badge className="bg-amber-600 text-white">
              {TENSION_LABELS[dominantKey] || dominantKey}
            </Badge>
            <span className="text-xs text-slate-500">urgence {dominantUrgency}/100</span>
          </div>
        )}

        {tensionScore !== null && (
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-slate-600">Instabilité</span>
            <Badge variant="outline" className="border-purple-400 text-purple-700">
              {tensionScore}/100
            </Badge>
          </div>
        )}
      </div>

      {tensionMemory?.embedding_summary && (
        <p className="mt-3 text-sm text-slate-600 italic border-l-2 border-indigo-300 pl-3">
          "{tensionMemory.embedding_summary}"
        </p>
      )}
    </Card>
  );
}