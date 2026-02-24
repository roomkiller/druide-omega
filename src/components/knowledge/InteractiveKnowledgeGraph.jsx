/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA — Neural Brain Map  v4  (Medical / Anatomical style)         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, Cpu, Brain, Zap, Eye, Database, MessageSquare, Lightbulb, Heart, RefreshCw, Users } from "lucide-react";

// ─── Module type → brain region layout & color ────────────────────────────
// Positions are % of SVG canvas, inspired by human brain anatomy
const MODULE_CONFIG = {
  reasoning: {
    label: "Raisonnement",
    region: "Cortex préfrontal",
    color: "#38bdf8",        // ice blue
    glow: "rgba(56,189,248,0.35)",
    x: 50, y: 22,            // top-center (prefrontal)
    icon: "⚡",
  },
  language: {
    label: "Langage",
    region: "Aire de Broca / Wernicke",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.35)",
    x: 28, y: 38,
    icon: "💬",
  },
  memory: {
    label: "Mémoire",
    region: "Hippocampe",
    color: "#34d399",
    glow: "rgba(52,211,153,0.35)",
    x: 72, y: 52,
    icon: "🧬",
  },
  emotion: {
    label: "Émotion",
    region: "Amygdale / Système limbique",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.35)",
    x: 30, y: 60,
    icon: "❤",
  },
  perception: {
    label: "Perception",
    region: "Cortex sensoriel",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.35)",
    x: 72, y: 28,
    icon: "👁",
  },
  attention: {
    label: "Attention",
    region: "Cortex cingulaire",
    color: "#fb923c",
    glow: "rgba(251,146,60,0.35)",
    x: 50, y: 42,            // center
    icon: "🎯",
  },
  creativity: {
    label: "Créativité",
    region: "Réseau mode par défaut",
    color: "#e879f9",
    glow: "rgba(232,121,249,0.35)",
    x: 20, y: 50,
    icon: "✦",
  },
  social: {
    label: "Social",
    region: "Jonction temporo-pariétale",
    color: "#4ade80",
    glow: "rgba(74,222,128,0.35)",
    x: 80, y: 42,
    icon: "🤝",
  },
  motivation: {
    label: "Motivation",
    region: "Noyau accumbens",
    color: "#f87171",
    glow: "rgba(248,113,113,0.35)",
    x: 62, y: 68,
    icon: "▲",
  },
  executive: {
    label: "Exécutif",
    region: "Lobe frontal dorsolatéral",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.35)",
    x: 38, y: 24,
    icon: "◈",
  },
  integration: {
    label: "Intégration",
    region: "Corps calleux",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.35)",
    x: 50, y: 58,
    icon: "∞",
  },
  learning: {
    label: "Apprentissage",
    region: "Cervelet / Plasticité",
    color: "#2dd4bf",
    glow: "rgba(45,212,191,0.35)",
    x: 50, y: 76,
    icon: "◎",
  },
};

const DEFAULT_CONFIG = {
  label: "Module", region: "Cortex associatif",
  color: "#94a3b8", glow: "rgba(148,163,184,0.3)",
  x: 50, y: 50, icon: "◉",
};

function getConfig(type) {
  return MODULE_CONFIG[type] || { ...DEFAULT_CONFIG };
}

// ─── Synapse connection — drawn between two modules ────────────────────────
function Synapse({ x1, y1, x2, y2, strength, color1, color2, active, id }) {
  const mx = (x1 + x2) / 2 + (y2 - y1) * 0.18;
  const my = (y1 + y2) / 2 - (x2 - x1) * 0.18;
  const path = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
  const opacity = active ? 0.65 : Math.max(0.08, (strength / 10) * 0.3);
  const strokeW = active ? 1.8 : 0.8;
  const dur = `${3.5 + (strength * 0.4)}s`;

  return (
    <g opacity={opacity} style={{ transition: 'opacity 0.5s' }}>
      <defs>
        <linearGradient id={`syn-${id}`} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke={`url(#syn-${id})`} strokeWidth={strokeW} />
      {/* Impulse dot traveling along synapse when active */}
      {active && (
        <circle r="2.2" fill={color1} opacity="0.9">
          <animateMotion dur={dur} repeatCount="indefinite">
            <mpath href={`#syp-${id}`} />
          </animateMotion>
        </circle>
      )}
      <path id={`syp-${id}`} d={path} fill="none" stroke="none" />
    </g>
  );
}

// ─── Neural module node ────────────────────────────────────────────────────
function NeuronNode({ module, cfg, cx, cy, r, selected, onSelect, hovered, onHover }) {
  const isActive = selected?.id === module.id || hovered?.id === module.id;
  const activation = module.activation_level || 70;
  const breathDur = `${3 + (activation % 3)}s`;

  return (
    <g
      style={{ cursor: 'pointer', transform: `translate(${cx}px,${cy}px)` }}
      onClick={() => onSelect(module)}
      onMouseEnter={() => onHover(module)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Outer glow halo — always present, pulsing with activation */}
      <circle r={r + 8} fill={cfg.glow}>
        <animate attributeName="r"
          values={`${r+4};${r + 6 + activation/25};${r+4}`}
          dur={breathDur} repeatCount="indefinite" />
        <animate attributeName="opacity"
          values="0.5;0.9;0.5"
          dur={breathDur} repeatCount="indefinite" />
      </circle>

      {/* Selection ring */}
      {isActive && (
        <circle r={r + 14} fill="none" stroke={cfg.color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.8">
          <animateTransform attributeName="transform" type="rotate"
            from="0" to="360" dur="8s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Main node — dark with border */}
      <circle r={r} fill="rgba(8,12,28,0.92)" stroke={cfg.color} strokeWidth={isActive ? 2.5 : 1.5} />

      {/* Activation fill arc (like a gauge) */}
      <circle
        r={r * 0.72}
        fill="none"
        stroke={cfg.color}
        strokeWidth={r * 0.28}
        strokeDasharray={`${(activation / 100) * (2 * Math.PI * r * 0.72)} 999`}
        strokeLinecap="round"
        opacity="0.35"
        transform="rotate(-90)"
      />

      {/* Icon */}
      <text textAnchor="middle" dominantBaseline="middle" fontSize={r * 0.72}
        fill={cfg.color} style={{ userSelect: 'none', letterSpacing: 0 }}>
        {cfg.icon}
      </text>

      {/* Label beneath */}
      <text y={r + 14} textAnchor="middle" fontSize="10.5"
        fontFamily="'Inter', 'Space Grotesk', sans-serif"
        fontWeight={isActive ? '600' : '400'}
        fill={isActive ? cfg.color : 'rgba(203,213,225,0.75)'}
        style={{ userSelect: 'none', transition: 'fill 0.3s' }}>
        {cfg.label}
      </text>

      {/* Activation % — shown only on hover/select */}
      {isActive && (
        <text y={r + 26} textAnchor="middle" fontSize="9"
          fontFamily="'Inter', sans-serif"
          fill={cfg.color} opacity="0.8" style={{ userSelect: 'none' }}>
          {activation.toFixed(0)}% actif
        </text>
      )}
    </g>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function InteractiveKnowledgeGraph() {
  const svgRef      = useRef(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ W: 800, H: 560 });
  const [selected, setSelected]   = useState(null);
  const [hovered, setHovered]     = useState(null);
  const [tick, setTick]           = useState(0); // for live-ish animation

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['neuralModules'],
    queryFn: () => base44.entities.NeuralModule.list('-activation_level', 50),
    refetchInterval: 30000,
  });

  // Responsive sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      setSize({ W: e.contentRect.width || 800, H: Math.max(480, e.contentRect.height) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Slow tick to animate firing rates subtly
  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const { W, H } = size;

  // Place modules on canvas according to brain-region config
  const placedModules = useMemo(() => {
    const seen = new Set();
    return modules.map((m, i) => {
      const type = m.module_type || 'integration';
      let cfg = getConfig(type);
      // If two modules share same type, offset slightly
      const key = type;
      if (seen.has(key)) {
        cfg = { ...cfg, x: cfg.x + (i % 2 === 0 ? 5 : -5), y: cfg.y + (i % 3) * 4 };
      }
      seen.add(key);
      const cx = (cfg.x / 100) * W;
      const cy = (cfg.y / 100) * H;
      const r  = 18 + Math.min((m.consciousness_contribution || 10) * 0.6, 14);
      return { ...m, cfg, cx, cy, r };
    });
  }, [modules, W, H]);

  // Auto-connect modules that share type groups or are logically linked
  const synapses = useMemo(() => {
    const links = [];
    const pairs = new Set();
    const linkTypes = {
      reasoning: ['language','attention','executive','learning'],
      language: ['perception','memory','social'],
      memory: ['learning','emotion','perception'],
      emotion: ['social','motivation','creativity'],
      perception: ['attention','integration'],
      attention: ['executive','motivation'],
      creativity: ['emotion','learning','integration'],
      social: ['emotion','language'],
      motivation: ['executive','attention'],
      executive: ['reasoning','integration'],
      integration: ['memory','reasoning'],
      learning: ['memory','creativity'],
    };
    placedModules.forEach(a => {
      const targets = linkTypes[a.module_type] || [];
      placedModules.forEach(b => {
        if (a.id === b.id) return;
        const key = [a.id, b.id].sort().join('|');
        if (pairs.has(key)) return;
        if (targets.includes(b.module_type)) {
          pairs.add(key);
          links.push({
            id: key,
            x1: a.cx, y1: a.cy, x2: b.cx, y2: b.cy,
            color1: a.cfg.color, color2: b.cfg.color,
            strength: ((a.activation_level || 70) + (b.activation_level || 70)) / 20,
            active: (a.id === selected?.id || b.id === selected?.id ||
                     a.id === hovered?.id  || b.id === hovered?.id),
          });
        }
      });
    });
    return links;
  }, [placedModules, selected, hovered]);

  const selectedFull = selected ? placedModules.find(m => m.id === selected.id) : null;

  return (
    <div className="flex flex-col gap-0" style={{ fontFamily: "'Inter', 'Space Grotesk', sans-serif", height: '100%', minHeight: 600 }}>

      {/* ── Header strip ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800"
        style={{ background: 'rgba(8,12,28,0.97)' }}>
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-sky-400" />
          <span className="text-sm font-semibold text-slate-200 tracking-wide">Cartographie neurale — Druide Omega</span>
          <span className="text-xs text-slate-500 hidden md:block">· Visualisation anatomique des modules cognitifs</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            {placedModules.filter(m => m.active !== false).length} modules actifs
          </span>
          <span>{placedModules.length} total</span>
        </div>
      </div>

      {/* ── Brain canvas + detail panel ── */}
      <div className="flex flex-1 min-h-0" style={{ background: 'linear-gradient(160deg, #05080f 0%, #080c1e 60%, #0a0a18 100%)' }}>

        {/* SVG brain map */}
        <div ref={containerRef} className="flex-1 relative" style={{ minHeight: 480 }}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-sm">Initialisation des modules…</span>
            </div>
          ) : (
            <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
              <defs>
                {/* Subtle scanline overlay */}
                <pattern id="scan" width="100%" height="3" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="1" x2={W} y2="1" stroke="rgba(148,163,184,0.03)" strokeWidth="1" />
                </pattern>
                {/* Radial vignette */}
                <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
                </radialGradient>
                {/* Brain outline glow */}
                <filter id="soft-glow">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Scanline texture */}
              <rect width={W} height={H} fill="url(#scan)" />

              {/* Anatomical brain silhouette — SVG path approximation */}
              <g opacity="0.055" stroke="#94a3b8" strokeWidth="1" fill="none">
                <ellipse cx={W/2} cy={H*0.44} rx={W*0.38} ry={H*0.34} />
                {/* Left hemisphere */}
                <ellipse cx={W*0.33} cy={H*0.42} rx={W*0.19} ry={H*0.29} />
                {/* Right hemisphere */}
                <ellipse cx={W*0.67} cy={H*0.42} rx={W*0.19} ry={H*0.29} />
                {/* Cerebellum */}
                <ellipse cx={W/2} cy={H*0.73} rx={W*0.14} ry={H*0.09} />
                {/* Corpus callosum hint */}
                <line x1={W*0.35} y1={H*0.46} x2={W*0.65} y2={H*0.46} strokeDasharray="4 3" />
              </g>

              {/* Concentric rings — like a brain scan */}
              {[0.42, 0.32, 0.22].map((r, i) => (
                <ellipse key={i}
                  cx={W/2} cy={H*0.44}
                  rx={W*r} ry={H*(r*0.82)}
                  fill="none"
                  stroke={`rgba(56,189,248,${0.03 - i*0.007})`}
                  strokeWidth="1"
                />
              ))}

              {/* Vignette */}
              <rect width={W} height={H} fill="url(#vignette)" />

              {/* Synapses (behind nodes) */}
              {synapses.map(s => (
                <Synapse key={s.id} {...s} />
              ))}

              {/* Nodes */}
              {placedModules.map(m => (
                <NeuronNode
                  key={m.id}
                  module={m}
                  cfg={m.cfg}
                  cx={m.cx}
                  cy={m.cy}
                  r={m.r}
                  selected={selected}
                  hovered={hovered}
                  onSelect={n => setSelected(prev => prev?.id === n.id ? null : n)}
                  onHover={setHovered}
                />
              ))}

              {/* Hover tooltip */}
              {hovered && !selected && (() => {
                const tx = Math.min(hovered.cx + hovered.r + 12, W - 175);
                const ty = Math.max(hovered.cy - 28, 10);
                return (
                  <g transform={`translate(${tx},${ty})`}>
                    <rect rx="5" width="164" height="44"
                      fill="rgba(8,12,28,0.95)" stroke={hovered.cfg.color} strokeWidth="1" />
                    <text x="10" y="18" fill="white" fontSize="11" fontWeight="600"
                      fontFamily="'Inter',sans-serif">
                      {hovered.module_name || hovered.cfg.label}
                    </text>
                    <text x="10" y="33" fill={hovered.cfg.color} fontSize="9.5"
                      fontFamily="'Inter',sans-serif" opacity="0.85">
                      {hovered.cfg.region} · {(hovered.activation_level||70).toFixed(0)}% actif
                    </text>
                  </g>
                );
              })()}
            </svg>
          )}
        </div>

        {/* ── Detail panel — slides in from right ── */}
        <AnimatePresence>
          {selectedFull && (
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 32 }}
              transition={{ duration: 0.22 }}
              className="w-72 flex-shrink-0 border-l overflow-y-auto"
              style={{ borderColor: 'rgba(148,163,184,0.1)', background: 'rgba(8,12,28,0.98)' }}
            >
              {/* Module header */}
              <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: `${selectedFull.cfg.color}30` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedFull.cfg.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">
                        {selectedFull.module_name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: selectedFull.cfg.color }}>
                        {selectedFull.cfg.region}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)}
                    className="text-slate-500 hover:text-slate-300 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {selectedFull.description}
                </p>
              </div>

              {/* Activation meter */}
              <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-slate-500 uppercase tracking-widest">Activation</span>
                  <span className="text-sm font-semibold" style={{ color: selectedFull.cfg.color }}>
                    {(selectedFull.activation_level||70).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${selectedFull.activation_level||70}%`, background: selectedFull.cfg.color }} />
                </div>
              </div>

              {/* Metrics grid */}
              <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Métriques neuronales</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Neurones', value: ((selectedFull.neural_parameters?.neuron_count||0)/1000).toFixed(0) + 'k' },
                    { label: 'Synapses', value: ((selectedFull.neural_parameters?.synapse_count||0)/1000).toFixed(0) + 'k' },
                    { label: 'Décharge', value: (selectedFull.neural_parameters?.firing_rate||0) + ' Hz' },
                    { label: 'Plasticité', value: (selectedFull.neural_parameters?.plasticity||0) + '/10' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-900 rounded-lg p-2.5">
                      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-slate-100">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance */}
              {selectedFull.performance_metrics && (
                <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Performance</p>
                  {Object.entries(selectedFull.performance_metrics).map(([key, val]) => (
                    <div key={key} className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400 capitalize">{key.replace('_',' ')}</span>
                        <span className="text-slate-300">{val}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-slate-800">
                        <div className="h-full rounded-full" style={{ width: `${val}%`, background: selectedFull.cfg.color, opacity: 0.7 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contribution to consciousness */}
              <div className="px-5 py-4">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Contribution conscience</p>
                <p className="text-2xl font-bold" style={{ color: selectedFull.cfg.color }}>
                  {selectedFull.consciousness_contribution || 0}<span className="text-sm font-normal text-slate-500">%</span>
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Part de ce module dans la conscience globale de Druide Omega
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom legend strip ── */}
      <div className="flex items-center gap-4 px-5 py-2.5 border-t overflow-x-auto"
        style={{ background: 'rgba(8,12,28,0.97)', borderColor: 'rgba(148,163,184,0.1)' }}>
        <span className="text-xs text-slate-600 flex-shrink-0 uppercase tracking-widest">Régions</span>
        {Object.entries(MODULE_CONFIG).slice(0, 8).map(([type, cfg]) => (
          <span key={type} className="flex items-center gap-1.5 flex-shrink-0 text-xs"
            style={{ color: cfg.color }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
            {cfg.label}
          </span>
        ))}
        <span className="text-xs text-slate-700 flex-shrink-0 ml-auto hidden md:block">
          Cliquer sur un module pour explorer
        </span>
      </div>
    </div>
  );
}