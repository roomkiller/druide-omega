import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Zap, X, ChevronDown, CheckCircle2, Circle } from 'lucide-react';
import {
  getActiveLLM,
  subscribeActiveLLM,
  PROVIDER_LABELS,
  INSTALLED_LLMS,
  COMPATIBLE_LLMS
} from '@/lib/llmProviderState';
import { isLLMBlocked, subscribeLLMKillSwitch } from '@/lib/llmKillSwitch';

/** Carte Provider — LLM réellement actif en temps réel + liste dépliable des LLM. */
export default function ActiveProviderCard() {
  const [active, setActive] = useState(getActiveLLM());
  const [blocked, setBlocked] = useState(isLLMBlocked());
  const [open, setOpen] = useState(false);

  useEffect(() => subscribeActiveLLM(setActive), []);
  useEffect(() => subscribeLLMKillSwitch(setBlocked), []);

  const providerKey = blocked ? 'disabled' : (active.provider || 'memory');
  const label = PROVIDER_LABELS[providerKey] || providerKey;

  return (
    <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <div className="text-xs text-orange-700 mb-1 flex items-center gap-1">
            Provider {open ? <X className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </div>
          <div className="text-lg font-bold text-orange-700">{label}</div>
          <div className="text-xs text-orange-600 mt-0.5 truncate max-w-[180px]">
            {active.model || (blocked ? 'Appels bloqués' : 'En attente d\'appel')}
          </div>
        </div>
        <Zap className="w-8 h-8 text-orange-600" />
      </button>

      {open && (
        <div className="mt-3 pt-3 border-t border-orange-200 space-y-3">
          <div>
            <div className="text-[11px] font-semibold text-orange-800 mb-1">LLM installés</div>
            {INSTALLED_LLMS.map((m) => (
              <div key={m.id} className="flex items-start gap-2 text-xs text-slate-700 py-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>{m.name}</strong> — {m.note}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[11px] font-semibold text-orange-800 mb-1">Compatibles non installés</div>
            {COMPATIBLE_LLMS.map((m) => (
              <div key={m.id} className="flex items-start gap-2 text-xs text-slate-500 py-0.5">
                <Circle className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>{m.name} — {m.note}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}