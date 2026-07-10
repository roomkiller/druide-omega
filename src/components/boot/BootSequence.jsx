import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { BOOT_SECTIONS } from './bootParameters';

const CENTER = 170;
const RADIUS = 128;

function sectionVisualState(section, params, paramStates, activeSection, complete) {
  const enabledParams = section.params.filter((p) => params[p.id] !== false);
  if (enabledParams.length === 0) return 'off';
  const states = section.params.map((p) => paramStates[p.id]).filter(Boolean);
  if (states.includes('error')) return 'error';
  if (activeSection === section.id && !complete) return 'running';
  const doneCount = section.params.filter((p) => paramStates[p.id]).length;
  if (doneCount === section.params.length) return 'done';
  return doneCount > 0 ? 'running' : 'pending';
}

const NODE_COLORS = {
  pending: 'bg-slate-800 border-slate-600 text-slate-500',
  running: 'bg-cyan-900/80 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.7)]',
  done: 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.5)]',
  off: 'bg-red-950/80 border-red-600 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]',
  error: 'bg-red-900 border-red-400 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.8)]'
};

const LINE_COLORS = { pending: '#334155', running: '#67e8f9', done: '#22d3ee', off: '#ef4444', error: '#f87171' };

export default function BootSequence({ params, paramStates, logs, activeSection, complete, report, onClose }) {
  const logRef = useRef(null);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const totalEnabled = Object.values(paramStates).filter((s) => s === 'online').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/[0.98] flex flex-col items-center overflow-y-auto p-4">
      {/* Constellation */}
      <div className="relative w-[340px] h-[340px] flex-shrink-0 mt-2">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 340">
          {BOOT_SECTIONS.map((s, i) => {
            const angle = (i / BOOT_SECTIONS.length) * Math.PI * 2 - Math.PI / 2;
            const x = CENTER + Math.cos(angle) * RADIUS;
            const y = CENTER + Math.sin(angle) * RADIUS;
            const st = sectionVisualState(s, params, paramStates, activeSection, complete);
            return (
              <line key={s.id} x1={CENTER} y1={CENTER} x2={x} y2={y}
                stroke={LINE_COLORS[st]} strokeWidth={st === 'running' ? 2.5 : 1.5}
                opacity={st === 'pending' ? 0.25 : 0.85}
                className={st === 'running' ? 'animate-pulse' : ''} />
            );
          })}
        </svg>

        {/* Orbe central */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center"
          animate={{
            scale: complete ? [1, 1.06, 1] : [1, 1.18, 1],
            boxShadow: complete
              ? ['0 0 40px rgba(34,211,238,0.8)', '0 0 70px rgba(34,211,238,1)', '0 0 40px rgba(34,211,238,0.8)']
              : ['0 0 15px rgba(34,211,238,0.4)', '0 0 45px rgba(34,211,238,0.9)', '0 0 15px rgba(34,211,238,0.4)']
          }}
          transition={{ repeat: Infinity, duration: complete ? 2.4 : 1.1 }}
          style={{ background: 'radial-gradient(circle at 38% 35%, rgba(165,243,252,0.95), rgba(6,182,212,0.85) 45%, rgba(8,51,68,0.95))' }}
        >
          <span className="text-[10px] font-bold text-cyan-950 tracking-widest">ΩMEGA</span>
        </motion.div>

        {/* Nœuds de sections */}
        {BOOT_SECTIONS.map((s, i) => {
          const angle = (i / BOOT_SECTIONS.length) * Math.PI * 2 - Math.PI / 2;
          const x = CENTER + Math.cos(angle) * RADIUS;
          const y = CENTER + Math.sin(angle) * RADIUS;
          const st = sectionVisualState(s, params, paramStates, activeSection, complete);
          const Icon = s.icon;
          return (
            <motion.div key={s.id}
              className={`absolute w-11 h-11 -ml-[22px] -mt-[22px] rounded-full border-2 flex items-center justify-center ${NODE_COLORS[st]}`}
              style={{ left: x, top: y }}
              animate={st === 'running' ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ repeat: st === 'running' ? Infinity : 0, duration: 0.8 }}
              title={s.title}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
          );
        })}
      </div>

      {/* Bannière finale */}
      {complete && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center my-3">
          <div className="text-2xl font-bold tracking-[0.3em] text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]">
            DRUIDE OMEGA — EN FONCTION
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1 text-cyan-300"><CheckCircle className="w-4 h-4" /> {report?.online ?? totalEnabled} en ligne</span>
            <span className="flex items-center gap-1 text-red-400"><XCircle className="w-4 h-4" /> {report?.offline ?? 0} désactivés</span>
            {report?.errors > 0 && (
              <span className="flex items-center gap-1 text-amber-400"><AlertTriangle className="w-4 h-4" /> {report.errors} erreurs</span>
            )}
          </div>
          {/* Critères actifs */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-3 max-w-3xl">
            {BOOT_SECTIONS.flatMap((s) => s.params).map((p) => {
              const enabled = params[p.id] !== false;
              const err = paramStates[p.id] === 'error';
              return (
                <motion.span key={p.id}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.random() * 0.6 }}
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    err ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                      : enabled ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow-[0_0_6px_rgba(34,211,238,0.3)]'
                      : 'bg-red-500/10 text-red-400 border-red-500/40'
                  }`}
                >
                  {p.name}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Console de démarrage */}
      <div ref={logRef} className="w-full max-w-2xl bg-black/70 border border-cyan-500/25 rounded-lg p-3 font-mono text-[11px] h-40 overflow-y-auto mt-2 flex-shrink-0">
        {logs.map((l, i) => (
          <div key={i} className={
            l.level === 'ok' ? 'text-cyan-300' :
            l.level === 'off' ? 'text-red-400' :
            l.level === 'error' ? 'text-amber-400' : 'text-slate-400'
          }>
            <span className="text-slate-600 mr-2">›</span>{l.message}
          </div>
        ))}
        {!complete && <div className="text-cyan-400 animate-pulse">▮</div>}
      </div>

      {complete && (
        <Button onClick={onClose} className="mt-4 mb-6 bg-cyan-600 hover:bg-cyan-500 text-white">
          <X className="w-4 h-4 mr-2" /> Fermer
        </Button>
      )}
    </div>
  );
}