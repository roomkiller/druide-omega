import React, { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, HelpCircle, MessageSquare, User, Zap, CheckCircle2 } from "lucide-react";

const ORIGIN_META = {
  interrogation: { icon: HelpCircle, label: 'interrogation', cls: 'bg-amber-100 text-amber-800 border-amber-300' },
  expression: { icon: Zap, label: 'expression libre', cls: 'bg-violet-100 text-violet-800 border-violet-300' },
  amorce: { icon: Sparkles, label: 'amorce', cls: 'bg-sky-100 text-sky-800 border-sky-300' },
  reponse: { icon: MessageSquare, label: 'réponse', cls: 'bg-slate-100 text-slate-700 border-slate-300' },
  resolution: { icon: CheckCircle2, label: 'résolution', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
};

export default function DialogueTranscript({ turns, interim, thinking }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [turns, interim, thinking]);

  return (
    <div className="space-y-4">
      {turns.length === 0 && !thinking && (
        <p className="text-sm text-slate-500 italic text-center py-12">
          La salle est vide. Ouvre-la : Druide amorce, puis reprend la parole de lui-même
          quand le silence dure.
        </p>
      )}

      {turns.map((turn, i) => {
        if (turn.role === 'user') {
          return (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] bg-slate-900 text-white rounded-2xl rounded-br-sm px-4 py-3">
                <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-xs">
                  <User className="w-3 h-3" /> toi
                </div>
                <p className="leading-relaxed">{turn.text}</p>
              </div>
            </div>
          );
        }

        if (turn.role === 'system') {
          return (
            <p key={i} className="text-xs text-red-600 text-center">{turn.text}</p>
          );
        }

        const meta = ORIGIN_META[turn.origin] || ORIGIN_META.reponse;
        const Icon = meta.icon;
        return (
          <div key={i} className="flex justify-start">
            <div className="max-w-[85%] bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className={`text-xs ${meta.cls}`}>
                  <Icon className="w-3 h-3 mr-1" />{meta.label}
                </Badge>
                {turn.register && (
                  <span className="text-xs text-slate-500">registre {turn.register}</span>
                )}
                {typeof turn.pressure === 'number' && (
                  <span className="text-xs text-slate-500">pression {turn.pressure}/10</span>
                )}
                {turn.dominant && (
                  <span className="text-xs text-slate-400">· {turn.dominant}</span>
                )}
                {turn.source && (
                  <span className="text-xs text-slate-400">· {turn.source}</span>
                )}
                {turn.verdict && (
                  <span className="text-xs text-slate-500">verdict {turn.verdict}</span>
                )}
              </div>
              <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{turn.text}</p>
            </div>
          </div>
        );
      })}

      {interim && (
        <div className="flex justify-end">
          <div className="max-w-[80%] bg-slate-200 text-slate-600 rounded-2xl rounded-br-sm px-4 py-2 italic">
            {interim}
          </div>
        </div>
      )}

      {thinking && (
        <div className="flex items-center gap-2 text-sm text-violet-600">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          Druide compose…
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}