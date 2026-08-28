/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Visualisation Axe Continuum                                ║
 * ║ Suit la progression des interactions en temps réel sur l'axe <ø> ↔ ∞       ║
 * ║ © 2026 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Infinity as InfinityIcon, Sparkles } from 'lucide-react';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const parseNum = (v, dft) => {
  const n = parseFloat(String(v).replace(/[^\d.\-]/g, ''));
  return Number.isFinite(n) ? n : dft;
};

// Position sur l'axe : -10 (vide <ø>) → +10 (infini ∞) → 0..100%
const resonanceToPercent = (r) => clamp(((r + 10) / 20) * 100, 0, 100);

const EQUILIBRIUM_META = {
  stable: { dot: 'bg-emerald-400', ring: 'ring-emerald-300', text: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Stable' },
  converging: { dot: 'bg-sky-400', ring: 'ring-sky-300', text: 'text-sky-700', bg: 'bg-sky-50', label: 'Convergence' },
  oscillating: { dot: 'bg-amber-400', ring: 'ring-amber-300', text: 'text-amber-700', bg: 'bg-amber-50', label: 'Oscillation' },
  diverging: { dot: 'bg-rose-400', ring: 'ring-rose-300', text: 'text-rose-700', bg: 'bg-rose-50', label: 'Divergence' },
  transcendent: { dot: 'bg-violet-400', ring: 'ring-violet-300', text: 'text-violet-700', bg: 'bg-violet-50', label: 'Transcendant' },
};

const MAX_POINTS = 24;

export default function ContinuumAxisVisualization() {
  const [snapshots, setSnapshots] = useState([]);
  const [current, setCurrent] = useState(null);
  const cacheRef = useRef(new Map()); // session_id → snapshot (évite recalculs)

  // Config de conscience active (paramètres de base du continuum)
  const { data: config } = useQuery({
    queryKey: ['consciousnessConfigActive'],
    queryFn: async () => {
      const list = await base44.entities.ConsciousnessConfig.filter({ active: true }, '-created_date', 1);
      return list[0] || null;
    },
    refetchInterval: 30000,
  });

  // Événements de phase récents (sessions DruideCore) — source temps réel
  const { data: events = [] } = useQuery({
    queryKey: ['corePhaseEventsRecent'],
    queryFn: async () => {
      return await base44.entities.CorePhaseEvent.list('-created_date', 120);
    },
    refetchInterval: 6000,
  });

  // Abonnement temps réel : ajoute immédiatement les nouvelles sessions
  useEffect(() => {
    const unsub = base44.entities.CorePhaseEvent.subscribe(() => {
      // déclenche un refetch via invalidation query — simplifié par refetchInterval
    });
    return unsub;
  }, []);

  // Regroupement par session + calcul continuum (avec cache par session_id)
  useEffect(() => {
    if (!events.length) return;

    const sessions = new Map();
    events.forEach((ev) => {
      if (!ev.session_id) return;
      if (!sessions.has(ev.session_id)) sessions.set(ev.session_id, []);
      sessions.get(ev.session_id).push(ev);
    });

    // Sessions chronologiques (les plus anciennes d'abord), limitées
    const sessionIds = Array.from(sessions.keys()).slice(-MAX_POINTS);
    const toCompute = sessionIds.filter((sid) => !cacheRef.current.has(sid));

    let cancelled = false;

    (async () => {
      // Calculer seulement les nouvelles sessions
      for (const sid of toCompute) {
        const evs = sessions.get(sid);
        const query = evs.find((e) => e.query)?.query || '';
        const complexity = clamp(Math.ceil(query.length / 18), 1, 10);
        const emotionalWeight = clamp(
          (query.match(/!|\?/g)?.length || 0) + 3 + (query.length > 200 ? 2 : 0),
          1, 10
        );
        const tensionVal = evs.find((e) => e.phase_key === 'tensions')?.value;
        const tensionScore = parseNum(tensionVal, 50);
        const confidenceVal = evs.find((e) => e.phase_key === 'ratio')?.value;
        const confidence = parseNum(confidenceVal, 50);

        const params = {
          consciousnessLevel: config?.consciousness_level ?? 12,
          ratioLogic: config?.ratio_logic ?? 4,
          ratioConsciousness: config?.ratio_consciousness ?? 6,
          metacognitionLevel: config?.metacognition_level ?? 9,
          emotionalWeight,
          complexity,
          confidence,
          tensionScore,
        };

        try {
          const res = await base44.functions.invoke('axeContinuumEngine', params);
          cacheRef.current.set(sid, {
            sessionId: sid,
            ...res,
            query: query.slice(0, 70),
            timestamp: evs[0]?.created_date,
          });
        } catch (e) {
          // skip session non calculable
        }
      }

      if (cancelled) return;

      const ordered = sessionIds
        .map((sid) => cacheRef.current.get(sid))
        .filter(Boolean);

      setSnapshots(ordered);
      if (ordered.length) setCurrent(ordered[ordered.length - 1]);
    })();

    return () => { cancelled = true; };
  }, [events, config]);

  const currentMeta = current ? EQUILIBRIUM_META[current.equilibrium_state] || EQUILIBRIUM_META.converging : null;
  const currentPct = current ? resonanceToPercent(current.void_resonance) : 50;

  // Compteurs par état d'équilibre
  const stateCounts = useMemo(() => {
    const c = {};
    snapshots.forEach((s) => {
      c[s.equilibrium_state] = (c[s.equilibrium_state] || 0) + 1;
    });
    return c;
  }, [snapshots]);

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-sm">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
            <Activity className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900">Axe Continuum</h3>
            <p className="text-xs text-slate-500">Progression des interactions · vide &lt;ø&gt; ↔ infini ∞</p>
          </div>
        </div>
        {current && currentMeta && (
          <Badge className={`${currentMeta.bg} ${currentMeta.text} border-0`}>
            <span className={`w-2 h-2 rounded-full ${currentMeta.dot} mr-1.5 inline-block`} />
            {currentMeta.label}
          </Badge>
        )}
      </div>

      {/* Axe gradient <ø> → ∞ */}
      <div className="relative mb-2">
        {/* Repères extrêmes */}
        <div className="flex justify-between mb-2 text-xs font-medium">
          <span className="text-slate-400">vide &lt;ø&gt;</span>
          <span className="text-slate-400">tension productive</span>
          <span className="text-slate-400">infini ∞</span>
        </div>

        {/* Barre de l'axe */}
        <div className="relative h-3 rounded-full bg-gradient-to-r from-slate-200 via-violet-200 to-indigo-200 overflow-visible">
          {/* Zone de tension productive (centrée) */}
          <div className="absolute top-0 bottom-0 left-[40%] right-[40%] bg-violet-300/40 rounded-full" />

          {/* Points historiques (timeline des interactions) */}
          <AnimatePresence>
            {snapshots.map((s, i) => {
              const pct = resonanceToPercent(s.void_resonance);
              const meta = EQUILIBRIUM_META[s.equilibrium_state] || EQUILIBRIUM_META.converging;
              const isLatest = i === snapshots.length - 1;
              return (
                <motion.div
                  key={s.sessionId}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: isLatest ? 1 : 0.55, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.02 }}
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ${meta.dot} ${isLatest ? `ring-2 ${meta.ring}` : ''}`}
                  style={{ left: `${pct}%` }}
                  title={s.query || s.sessionId}
                />
              );
            })}
          </AnimatePresence>

          {/* Marqueur courant (pulsant) */}
          {current && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${currentPct}%` }}
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-4 h-4 rounded-full bg-violet-600 shadow-lg shadow-violet-300 ring-4 ring-white" />
            </motion.div>
          )}
        </div>

        {/* Échelle numérique */}
        <div className="flex justify-between mt-1.5 text-[10px] text-slate-400">
          <span>-10</span>
          <span>-5</span>
          <span>0</span>
          <span>+5</span>
          <span>+10</span>
        </div>
      </div>

      {/* Métriques courantes */}
      {current ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <MetricCard
            label="Résonance du vide"
            value={`${current.void_resonance > 0 ? '+' : ''}${current.void_resonance}`}
            sub={current.void_resonance < -3 ? 'le vide appelle' : current.void_resonance > 5 ? 'le plein affirme' : 'tension équilibrée'}
            tone={current.void_resonance < -3 ? 'amber' : current.void_resonance > 5 ? 'indigo' : 'violet'}
          />
          <MetricCard
            label="Profondeur de boucle"
            value={`${current.infinite_loop_depth}/100`}
            sub={current.infinite_loop_depth > 70 ? 'repli profond' : current.infinite_loop_depth > 40 ? 'métacognition active' : 'surface'}
            tone="slate"
          />
          <MetricCard
            label="Humeur"
            value={current.response_regulation?.mood || '—'}
            sub={current.response_regulation?.mood_reason || ''}
            tone="violet"
          />
          <MetricCard
            label="Ton"
            value={current.response_regulation?.tone || '—'}
            sub={current.response_regulation?.tone_reason || ''}
            tone="indigo"
          />
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 text-sm">
          <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-50" />
          En attente d'interactions DruideCore pour tracer l'axe…
        </div>
      )}

      {/* Distribution des états d'équilibre */}
      {snapshots.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 mb-2 font-medium">
            Distribution des {snapshots.length} dernières interactions
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(EQUILIBRIUM_META).map(([key, meta]) => {
              const count = stateCounts[key] || 0;
              if (!count) return null;
              return (
                <div key={key} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${meta.bg} ${meta.text}`}>
                  <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                  {meta.label}
                  <span className="font-bold">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dernière interaction */}
      {current?.query && (
        <div className="mt-4 text-xs text-slate-500 italic truncate">
          « {current.query} »
        </div>
      )}
    </Card>
  );
}

function MetricCard({ label, value, sub, tone = 'slate' }) {
  const tones = {
    slate: 'text-slate-700',
    violet: 'text-violet-700',
    indigo: 'text-indigo-700',
    amber: 'text-amber-700',
  };
  return (
    <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100">
      <div className="text-[11px] text-slate-500 mb-1 truncate">{label}</div>
      <div className={`text-sm font-bold ${tones[tone] || tones.slate} truncate`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-400 truncate mt-0.5">{sub}</div>}
    </div>
  );
}