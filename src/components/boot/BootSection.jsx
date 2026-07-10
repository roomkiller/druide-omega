import React, { useState } from 'react';
import { ChevronDown, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import GlowSwitch from './GlowSwitch';
import ParamRow from './ParamRow';

export default function BootSection({ section, params, statuses, onToggleParam, onToggleSection }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;
  const activeCount = section.params.filter((p) => params[p.id] !== false).length;
  const allOn = activeCount === section.params.length;

  return (
    <div className={`rounded-xl border-2 bg-slate-900/80 overflow-hidden transition-colors ${
      activeCount === 0 ? 'border-red-500/40' : 'border-cyan-500/25'
    }`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-800/60 transition-colors"
      >
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 text-sm">{section.title}</span>
            {section.creditWarning && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
          </div>
          <div className="text-[11px] text-slate-400 truncate">{section.description}</div>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 ${
          activeCount === 0
            ? 'bg-red-500/15 text-red-300 border-red-500/30'
            : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
        }`}>
          {activeCount}/{section.params.length}
        </span>
        <GlowSwitch checked={allOn} onChange={(v) => onToggleSection(section, v)} />
        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-3 pb-3 space-y-2">
              {section.params.map((p) => (
                <ParamRow
                  key={p.id}
                  param={p}
                  status={statuses[p.id]}
                  checked={params[p.id] !== false}
                  onChange={(v) => onToggleParam(p.id, v)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}