/**
 * DRUIDE_OMEGA - Flux de pensée en direct
 * S'abonne aux événements de phase émis par DruideCore pendant qu'il pense.
 * Les phases s'illuminent en temps réel, avec les valeurs réellement mesurées.
 */
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Brain, Flame, Database, Eye, GitBranch, MessageSquare, Scale, Radio } from 'lucide-react';

const PHASES = [
  { key: 'tensions', label: 'Tensions émergentes', icon: Flame, color: 'bg-amber-500', ring: 'ring-amber-300' },
  { key: 'analysis', label: 'Analyse cognitive', icon: Brain, color: 'bg-blue-500', ring: 'ring-blue-300' },
  { key: 'knowledge', label: 'Mémoires & savoirs', icon: Database, color: 'bg-emerald-500', ring: 'ring-emerald-300' },
  { key: 'reflection', label: 'Auto-réflexion', icon: Eye, color: 'bg-cyan-500', ring: 'ring-cyan-300' },
  { key: 'filaments', label: 'Filaments parallèles', icon: GitBranch, color: 'bg-purple-500', ring: 'ring-purple-300' },
  { key: 'generation', label: 'Génération', icon: MessageSquare, color: 'bg-indigo-500', ring: 'ring-indigo-300' },
  { key: 'ratio', label: 'Validation ratio', icon: Scale, color: 'bg-pink-500', ring: 'ring-pink-300' }
];

export default function LivePhaseStream() {
  const [events, setEvents] = useState({});
  const [query, setQuery] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [lastDate, setLastDate] = useState(null);

  // Charger la dernière session enregistrée
  useEffect(() => {
    base44.entities.CorePhaseEvent.list('-created_date', 25).then(recent => {
      if (recent.length > 0) {
        const lastSession = recent[0].session_id;
        const map = {};
        recent.filter(e => e.session_id === lastSession).forEach(e => { map[e.phase_key] = e; });
        setEvents(map);
        setQuery(recent[0].query);
        setLastDate(recent[0].created_date);
      }
    }).catch(() => {});
  }, []);

  // Abonnement temps réel : les phases s'illuminent pendant que Druide pense
  useEffect(() => {
    const unsubscribe = base44.entities.CorePhaseEvent.subscribe((event) => {
      if (event.type !== 'create' || !event.data) return;
      const e = event.data;
      setIsLive(true);
      setQuery(e.query);
      setLastDate(e.created_date);
      setEvents(old => {
        const sameSession = Object.values(old).some(ev => ev.session_id === e.session_id);
        return sameSession ? { ...old, [e.phase_key]: e } : { [e.phase_key]: e };
      });
      if (e.phase_key === 'ratio') setTimeout(() => setIsLive(false), 6000);
    });
    return unsubscribe;
  }, []);

  const completedCount = PHASES.filter(p => events[p.key]).length;
  const nextPhaseIdx = PHASES.findIndex(p => !events[p.key]);

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Radio className={`w-5 h-5 ${isLive ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
          <h3 className="font-semibold text-slate-900">Pensées en direct</h3>
        </div>
        <Badge variant={isLive ? 'destructive' : 'secondary'}>
          {isLive ? '● EN DIRECT' : 'En veille'}
        </Badge>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        {isLive
          ? 'Druide est en train de penser — les phases s\'illuminent en temps réel.'
          : lastDate
            ? `Dernière réflexion : ${new Date(lastDate).toLocaleString('fr-CA')} — ouvre le Chat pour voir la prochaine en direct.`
            : 'Aucune réflexion enregistrée — lance une conversation avec Druide pour voir sa pensée en direct.'}
      </p>

      {query && (
        <p className="text-sm text-slate-600 mb-6">
          Question : <span className="italic">"{query}"</span>
        </p>
      )}

      {/* Barre de progression */}
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-8">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          animate={{ width: `${(completedCount / PHASES.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="space-y-3">
        {PHASES.map((phase, i) => {
          const Icon = phase.icon;
          const event = events[phase.key];
          const isNext = isLive && i === nextPhaseIdx;
          return (
            <motion.div
              key={phase.key}
              initial={false}
              animate={{ opacity: event ? 1 : isNext ? 0.9 : 0.4 }}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                event ? 'border-slate-200 bg-white shadow-sm' : isNext ? `border-slate-300 bg-slate-50 ring-2 ${phase.ring}` : 'border-slate-100 bg-slate-50'
              }`}
            >
              <motion.div
                animate={isNext ? { scale: [1, 1.15, 1] } : event ? { scale: 1 } : {}}
                transition={isNext ? { repeat: Infinity, duration: 1.2 } : {}}
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${event || isNext ? phase.color : 'bg-slate-200'}`}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-slate-900">{phase.label}</div>
                <div className="text-xs text-slate-500 truncate">
                  {event ? event.value : isNext ? 'En cours...' : 'En attente'}
                </div>
              </div>
              {event && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-emerald-500 text-lg flex-shrink-0"
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}