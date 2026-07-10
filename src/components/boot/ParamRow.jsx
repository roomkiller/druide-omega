import React from 'react';
import GlowSwitch from './GlowSwitch';
import { Zap } from 'lucide-react';

const STATUS_BADGES = {
  active: ['Déjà actif', 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'],
  inactive: ['Inactif', 'bg-red-500/15 text-red-300 border-red-500/30'],
  missing: ['Non initialisé', 'bg-slate-500/15 text-slate-400 border-slate-500/40']
};

export default function ParamRow({ param, status, checked, onChange }) {
  const badge = STATUS_BADGES[status];
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 hover:border-slate-600 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-medium text-slate-100">{param.name}</span>
          {param.credits && (
            <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Zap className="w-2.5 h-2.5" /> Crédits
            </span>
          )}
          {badge && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${badge[1]}`}>
              {badge[0]}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{param.description}</p>
      </div>
      <GlowSwitch checked={checked} onChange={onChange} />
    </div>
  );
}