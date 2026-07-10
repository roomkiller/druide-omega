import React, { useState, useRef, useCallback } from 'react';
import { MessageSquare, MessagesSquare, Mic, Radio, X, Minus } from 'lucide-react';

const MODES = [
  { key: 'chat', label: 'Chat', path: '/Chat', icon: MessageSquare, color: 'bg-cyan-500 hover:bg-cyan-600' },
  { key: 'chat2', label: 'Chat 2', path: '/Chat_2', icon: MessagesSquare, color: 'bg-fuchsia-500 hover:bg-fuchsia-600' },
  { key: 'voicelive', label: 'Voice Live', path: '/VoiceLive', icon: Mic, color: 'bg-emerald-500 hover:bg-emerald-600' },
  { key: 'voiceroom', label: 'Voice Room', path: '/VoiceRoom', icon: Radio, color: 'bg-violet-500 hover:bg-violet-600' }
];

export default function FloatingConversationLauncher() {
  const [activeMode, setActiveMode] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [pos, setPos] = useState({ x: null, y: null });
  const dragRef = useRef(null);

  const onDragStart = useCallback((e) => {
    const winEl = e.currentTarget.parentElement;
    const rect = winEl.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const onMove = (ev) => {
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - rect.width, ev.clientX - offsetX)),
        y: Math.max(0, Math.min(window.innerHeight - 40, ev.clientY - offsetY))
      });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, []);

  const active = MODES.find(m => m.key === activeMode);

  return (
    <>
      {/* Boutons de lancement flottants */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 items-end">
        {MODES.map(mode => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.key;
          return (
            <button
              key={mode.key}
              onClick={() => { setActiveMode(mode.key); setMinimized(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-medium shadow-lg transition-all ${mode.color} ${isActive ? 'ring-2 ring-offset-2 ring-slate-900' : ''}`}
              title={`Converser avec Druide Omega en mode ${mode.label} — le cerveau s'anime en direct`}
            >
              <Icon className="w-4 h-4" />
              {mode.label}
            </button>
          );
        })}
      </div>

      {/* Fenêtre flottante de conversation */}
      {active && (
        <div
          ref={dragRef}
          className="fixed z-50 rounded-xl shadow-2xl border border-slate-300 bg-white overflow-hidden flex flex-col"
          style={{
            left: pos.x ?? Math.max(16, window.innerWidth - 520),
            top: pos.y ?? 80,
            width: 'min(480px, 92vw)',
            height: minimized ? 'auto' : 'min(640px, 78vh)'
          }}
        >
          {/* Barre de titre déplaçable */}
          <div
            onPointerDown={onDragStart}
            className="flex items-center justify-between px-3 py-2 bg-slate-900 text-white cursor-move select-none touch-none"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <active.icon className="w-4 h-4" />
              Druide Omega — {active.label}
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 ml-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                cerveau en direct
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(v => !v)}
                onPointerDown={(e) => e.stopPropagation()}
                className="p-1 rounded hover:bg-white/20"
                title={minimized ? 'Agrandir' : 'Réduire'}
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveMode(null)}
                onPointerDown={(e) => e.stopPropagation()}
                className="p-1 rounded hover:bg-white/20"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Contenu : la page de conversation en iframe */}
          {!minimized && (
            <iframe
              src={active.path}
              title={`Conversation ${active.label}`}
              className="flex-1 w-full border-0"
              allow="microphone; camera; autoplay; clipboard-write"
            />
          )}
        </div>
      )}
    </>
  );
}