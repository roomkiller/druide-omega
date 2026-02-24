/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Knowledge Graph — Clean & Readable v3                      ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  Network, Search, ZoomIn, ZoomOut, Sparkles,
  Database, Brain, Link2, Eye, EyeOff, RefreshCw, Lightbulb, X, BookOpen, Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Physics — gentle, slow to settle ──────────────────────────────────────
const REPULSION  = 7000;
const ATTRACTION = 0.015;
const DAMPING    = 0.65;   // strong damping = settles quickly without bouncing
const GRAVITY    = 0.004;
const TICK_MS    = 40;     // 25fps — smooth but not jittery
const IDLE_TICKS = 60;

const PALETTE = {
  knowledge: {
    external_data: { fill: '#7c3aed', border: '#c4b5fd', light: '#f5f3ff' },
    auto_enriched: { fill: '#0891b2', border: '#a5f3fc', light: '#ecfeff' },
    subscription:  { fill: '#d97706', border: '#fde68a', light: '#fffbeb' },
    general:       { fill: '#4f46e5', border: '#c7d2fe', light: '#eef2ff' },
  },
  memory: [
    { fill: '#6b7280', border: '#e5e7eb', light: '#f9fafb' },
    { fill: '#059669', border: '#a7f3d0', light: '#ecfdf5' },
    { fill: '#d97706', border: '#fde68a', light: '#fffbeb' },
    { fill: '#dc2626', border: '#fca5a5', light: '#fef2f2' },
  ]
};

function getPalette(node) {
  if (node.type === 'knowledge') {
    return PALETTE.knowledge[node.category] || PALETTE.knowledge.general;
  }
  const imp = node.importance || 5;
  if (imp >= 8) return PALETTE.memory[3];
  if (imp >= 6) return PALETTE.memory[2];
  if (imp >= 4) return PALETTE.memory[1];
  return PALETTE.memory[0];
}

// ─── Physics engine ──────────────────────────────────────────────────────────
function initNodes(rawNodes, W, H) {
  const kbs  = rawNodes.filter(n => n.type === 'knowledge');
  const mems = rawNodes.filter(n => n.type === 'memory');
  const out  = [];
  kbs.forEach((n, i) => {
    const angle = (i / Math.max(kbs.length, 1)) * 2 * Math.PI - Math.PI / 2;
    const r = Math.min(W, H) * 0.33;
    out.push({ ...n, px: W/2 + Math.cos(angle)*r, py: H/2 + Math.sin(angle)*r, vx: 0, vy: 0 });
  });
  mems.forEach((n, i) => {
    const angle = (i / Math.max(mems.length, 1)) * 2 * Math.PI + Math.PI / 4;
    const r = Math.min(W, H) * 0.14;
    out.push({ ...n, px: W/2 + Math.cos(angle)*r, py: H/2 + Math.sin(angle)*r, vx: 0, vy: 0 });
  });
  return out;
}

function tick(nodes, edges, W, H) {
  const n = nodes.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = nodes[i].px - nodes[j].px;
      const dy = nodes[i].py - nodes[j].py;
      const d2 = dx*dx + dy*dy + 1;
      const f  = REPULSION / d2;
      nodes[i].vx += dx * f; nodes[i].vy += dy * f;
      nodes[j].vx -= dx * f; nodes[j].vy -= dy * f;
    }
  }
  edges.forEach(({ source, target, weight }) => {
    const a = nodes.find(x => x.id === source);
    const b = nodes.find(x => x.id === target);
    if (!a || !b) return;
    const dx = b.px - a.px, dy = b.py - a.py;
    const f = ATTRACTION * (weight || 1);
    a.vx += dx*f; a.vy += dy*f;
    b.vx -= dx*f; b.vy -= dy*f;
  });
  nodes.forEach(nd => {
    nd.vx += (W/2 - nd.px) * GRAVITY;
    nd.vy += (H/2 - nd.py) * GRAVITY;
    nd.vx *= DAMPING; nd.vy *= DAMPING;
    nd.px += nd.vx;   nd.py += nd.vy;
    nd.px = Math.max(nd.r+8, Math.min(W - nd.r - 8, nd.px));
    nd.py = Math.max(nd.r+8, Math.min(H - nd.r - 8, nd.py));
  });
  return nodes;
}

// ─── Edge component — static line, highlight only ──────────────────────────
function Edge({ edge, nodes, focusId }) {
  const a = nodes.find(n => n.id === edge.source);
  const b = nodes.find(n => n.id === edge.target);
  if (!a || !b) return null;

  const connected = a.id === focusId || b.id === focusId;
  const dimmed    = focusId && !connected;

  return (
    <line
      x1={a.px} y1={a.py} x2={b.px} y2={b.py}
      stroke={connected ? a.palette.fill : '#cbd5e1'}
      strokeWidth={connected ? 2 : 1}
      strokeDasharray={edge.style === 'dashed' ? '6 4' : undefined}
      opacity={dimmed ? 0.06 : connected ? 0.7 : 0.35}
      style={{ transition: 'opacity 0.3s, stroke 0.3s, stroke-width 0.3s' }}
    />
  );
}

// ─── Node component — clean circles, no SVG animation clutter ──────────────
function Node({ node, focusId, onSelect, onHover }) {
  const isSelected = focusId === node.id;
  const isDimmed   = focusId && !isSelected;
  const r          = node.r;
  const p          = node.palette;

  return (
    <g
      className="cursor-pointer"
      onClick={() => onSelect(node)}
      onMouseEnter={() => onHover(node)}
      onMouseLeave={() => onHover(null)}
      style={{
        transform: `translate(${node.px}px,${node.py}px)`,
        opacity: isDimmed ? 0.2 : 1,
        transition: 'opacity 0.35s',
      }}
    >
      {/* Selection ring */}
      {isSelected && (
        <circle r={r + 7} fill="none" stroke={p.border} strokeWidth="2.5" opacity="0.9" />
      )}

      {/* Main circle — white fill with colored border */}
      <circle r={r} fill={isSelected ? p.fill : 'white'} stroke={p.fill} strokeWidth={isSelected ? 0 : 2} />

      {/* Colored dot center when not selected */}
      {!isSelected && <circle r={r * 0.38} fill={p.fill} opacity="0.85" />}

      {/* Label below node */}
      <text
        y={r + 13}
        textAnchor="middle"
        fontSize="10"
        fontWeight={isSelected ? '700' : '500'}
        fill={isSelected ? p.fill : '#475569'}
        style={{ userSelect: 'none' }}
      >
        {node.label.length > 20 ? node.label.slice(0, 18) + '…' : node.label}
      </text>

      {/* Type indicator — small text above */}
      <text
        y={-r - 5}
        textAnchor="middle"
        fontSize="8"
        fill={p.fill}
        opacity="0.7"
        style={{ userSelect: 'none' }}
      >
        {node.type === 'memory' ? '● mémoire' : '■ connaissance'}
      </text>
    </g>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function InteractiveKnowledgeGraph() {
  const containerRef = useRef(null);
  const simRef       = useRef(null);
  const physRef      = useRef([]);
  const idleRef      = useRef(0);

  const [size, setSize]         = useState({ W: 800, H: 520 });
  const [display, setDisplay]   = useState([]);
  const [rawNodes, setRawNodes] = useState([]);
  const [edges, setEdges]       = useState([]);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered]   = useState(null);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [zoom, setZoom]         = useState(1);
  const [showEdges, setShowEdges] = useState(true);
  const [simRunning, setSimRunning] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [analyzing, setAnalyzing]   = useState(false);

  const focusId = selected?.id || hovered?.id || null;

  const { data: kbs = [] }  = useQuery({ queryKey: ['knowledgeBases'], queryFn: () => base44.entities.KnowledgeBase.list('-created_date', 500) });
  const { data: mems = [] } = useQuery({ queryKey: ['memories'],       queryFn: () => base44.entities.Memory.list('-importance', 200) });

  // Responsive size
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      setSize({ W: Math.max(400, e.contentRect.width), H: Math.max(380, e.contentRect.height) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Build graph
  useEffect(() => {
    const { W, H } = size;
    const nodes = [], edgeList = [], seen = new Set();

    const match = (item, type) => {
      const typeOk =
        filter === 'all' ||
        (filter === 'knowledge' && type === 'knowledge') ||
        (filter === 'memory'    && type === 'memory') ||
        (filter === 'external'  && item.category === 'external_data');
      const q = search.toLowerCase();
      const searchOk = !q ||
        (item.title || item.name || item.content || '')?.toLowerCase().includes(q) ||
        item.tags?.some(t => t.toLowerCase().includes(q));
      return typeOk && searchOk;
    };

    kbs.forEach(kb => {
      if (!match(kb, 'knowledge')) return;
      const palette = getPalette({ type: 'knowledge', category: kb.category });
      nodes.push({
        id: `kb-${kb.id}`,
        label: kb.title || kb.name || 'Sans titre',
        type: 'knowledge', category: kb.category || 'general',
        data: kb, palette,
        r: 20 + Math.min((kb.tags?.length || 0) * 1.2, 10),
        connections: 0,
      });
    });

    mems.forEach(mem => {
      if (!match(mem, 'memory')) return;
      const palette = getPalette({ type: 'memory', importance: mem.importance });
      nodes.push({
        id: `mem-${mem.id}`,
        label: mem.content?.slice(0, 32) || 'Mémoire',
        type: 'memory', importance: mem.importance || 5,
        data: mem, palette,
        r: 15 + Math.min((mem.importance || 5) * 1.5, 10),
        connections: 0,
      });
    });

    nodes.forEach(a => {
      nodes.forEach(b => {
        if (a.id >= b.id) return;
        const key = `${a.id}|${b.id}`;
        if (seen.has(key)) return;
        const common = (a.data.tags || []).filter(t => (b.data.tags || []).includes(t));
        if (common.length > 0) {
          seen.add(key);
          edgeList.push({ source: a.id, target: b.id, weight: common.length });
          a.connections++; b.connections++;
        }
      });
    });

    setRawNodes(nodes);
    setEdges(edgeList);

    const pn = initNodes(nodes, W, H);
    physRef.current = pn;
    setDisplay([...pn]);
    idleRef.current = 0;
    setSimRunning(true);
  }, [kbs, mems, filter, search, size]);

  // Physics loop
  useEffect(() => {
    if (!simRunning) return;
    const { W, H } = size;
    simRef.current = setInterval(() => {
      physRef.current = tick(physRef.current, edges, W, H);
      setDisplay([...physRef.current]);
      const maxV = Math.max(...physRef.current.map(n => Math.abs(n.vx) + Math.abs(n.vy)), 0);
      if (maxV < 0.3) {
        if (++idleRef.current > IDLE_TICKS) { setSimRunning(false); clearInterval(simRef.current); }
      } else { idleRef.current = 0; }
    }, TICK_MS);
    return () => clearInterval(simRef.current);
  }, [simRunning, edges, size]);

  const reheat = () => {
    physRef.current.forEach(n => { n.vx += (Math.random()-0.5)*2; n.vy += (Math.random()-0.5)*2; });
    idleRef.current = 0;
    setSimRunning(true);
  };

  // Merge positions
  const nodes = useMemo(() =>
    display.map(pn => {
      const raw = rawNodes.find(r => r.id === pn.id);
      return raw ? { ...raw, px: pn.px, py: pn.py } : pn;
    }), [display, rawNodes]
  );

  const selectedFull = selected ? nodes.find(n => n.id === selected.id) : null;
  const connectedEdges = selectedFull ? edges.filter(e => e.source === selectedFull.id || e.target === selectedFull.id) : [];
  const connectedNodeIds = connectedEdges.map(e => e.source === selectedFull?.id ? e.target : e.source);
  const connectedNodes = connectedNodeIds.map(id => nodes.find(n => n.id === id)).filter(Boolean);

  const analyze = async () => {
    setAnalyzing(true);
    try {
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es le Druide Omega. Analyse ce graphe de connaissances:
- ${nodes.filter(n=>n.type==='knowledge').length} bases de connaissance, ${nodes.filter(n=>n.type==='memory').length} mémoires, ${edges.length} connexions
- Tags principaux: ${[...new Set(nodes.flatMap(n => n.data.tags||[]))].slice(0,8).join(', ')}

Fournis des insights courts et actionnables en JSON.`,
        response_json_schema: {
          type: "object",
          properties: {
            key_insights: { type: "array", items: { type: "string" } },
            recommended_actions: { type: "array", items: { type: "object", properties: { action: { type: "string" }, priority: { type: "string" } } } }
          }
        }
      });
      setAiInsights(analysis);
    } catch(e) { console.error(e); }
    finally { setAnalyzing(false); }
  };

  const { W, H } = size;

  return (
    <div className="space-y-3">

      {/* ── Controls ── */}
      <Card className="p-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-9" />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <select value={filter} onChange={e => setFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white h-9">
              <option value="all">Tout afficher</option>
              <option value="knowledge">Connaissances</option>
              <option value="memory">Mémoires</option>
              <option value="external">Sources externes</option>
            </select>
            <Button size="sm" variant="outline" onClick={() => setShowEdges(v => !v)} title={showEdges ? 'Masquer les liens' : 'Afficher les liens'}>
              {showEdges ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setZoom(z => Math.min(z+0.2, 2.5))}><ZoomIn className="w-4 h-4" /></Button>
            <Button size="sm" variant="outline" onClick={() => setZoom(z => Math.max(z-0.2, 0.4))}><ZoomOut className="w-4 h-4" /></Button>
            <Button size="sm" variant="outline" onClick={() => { setSearch(''); setFilter('all'); setZoom(1); setSelected(null); setAiInsights(null); reheat(); }}>
              <RefreshCw className={`w-4 h-4 ${simRunning ? 'animate-spin text-indigo-500' : ''}`} />
            </Button>
            <Button size="sm" onClick={analyze} disabled={analyzing || nodes.length === 0}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
              {analyzing ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
              Analyser (IA)
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-2 mt-3 flex-wrap items-center">
          <Badge variant="outline" className="gap-1 text-xs"><Network className="w-3 h-3" />{nodes.length} nœuds</Badge>
          <Badge variant="outline" className="gap-1 text-xs"><Link2 className="w-3 h-3" />{edges.length} liens</Badge>
          <Badge variant="outline" className="gap-1 text-xs"><BookOpen className="w-3 h-3" />{nodes.filter(n=>n.type==='knowledge').length} KB</Badge>
          <Badge variant="outline" className="gap-1 text-xs"><Brain className="w-3 h-3" />{nodes.filter(n=>n.type==='memory').length} mémoires</Badge>

          {/* Legend */}
          <div className="ml-auto flex gap-3 text-xs text-slate-500 items-center">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border-2 border-indigo-500 inline-block" />Connaissance</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border-2 border-emerald-500 inline-block" />Mémoire</span>
            <span className="flex items-center gap-1"><span className="w-4 border-t-2 border-dashed border-slate-400 inline-block" />Lien contextuel</span>
          </div>
        </div>
      </Card>

      {/* ── AI Insights ── */}
      <AnimatePresence>
        {aiInsights && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <Card className="p-4 bg-violet-50 border-violet-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-violet-600" />
                  <span className="font-semibold text-slate-800 text-sm">Insights IA</span>
                </div>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setAiInsights(null)}><X className="w-3 h-3" /></Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <ul className="space-y-1.5">
                  {aiInsights.key_insights?.map((ins, i) => (
                    <li key={i} className="flex gap-2 text-slate-700 text-xs leading-relaxed">
                      <span className="text-violet-500 flex-shrink-0 mt-0.5">◆</span>{ins}
                    </li>
                  ))}
                </ul>
                <div className="space-y-1.5">
                  {aiInsights.recommended_actions?.map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${a.priority==='high'?'bg-red-100 text-red-700':a.priority==='medium'?'bg-amber-100 text-amber-700':'bg-green-100 text-green-700'}`}>
                        {a.priority}
                      </span>
                      <span className="text-xs text-slate-600">{a.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Graph + Side panel ── */}
      <div className="flex gap-3 items-start">
        {/* SVG canvas */}
        <Card className="flex-1 overflow-hidden border border-slate-200 bg-slate-50" style={{ height: 520 }}>
          <div ref={containerRef} className="w-full h-full relative">
            {nodes.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <Network className="w-14 h-14 mb-3 opacity-25" />
                <p className="font-medium text-slate-500">Aucun nœud à afficher</p>
                <p className="text-sm mt-1 text-slate-400">Ajoutez des connaissances ou des mémoires</p>
              </div>
            ) : (
              <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
                <defs>
                  {/* Subtle dot grid */}
                  <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="#e2e8f0" />
                  </pattern>
                  {/* Node gradients */}
                  {nodes.map(n => (
                    <radialGradient key={n.id} id={`g-${n.id}`} cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor={n.palette.border} />
                      <stop offset="100%" stopColor={n.palette.fill} />
                    </radialGradient>
                  ))}
                </defs>

                <rect width={W} height={H} fill="url(#dots)" />

                <g transform={`translate(${W/2*(1-zoom)} ${H/2*(1-zoom)}) scale(${zoom})`}>
                  {/* Edges first (below nodes) */}
                  {showEdges && edges.map((e, i) => (
                    <Edge key={i} edge={e} nodes={nodes} focusId={focusId} />
                  ))}

                  {/* Nodes */}
                  {nodes.map(node => (
                    <Node
                      key={node.id}
                      node={node}
                      focusId={focusId}
                      onSelect={n => setSelected(prev => prev?.id === n.id ? null : n)}
                      onHover={setHovered}
                    />
                  ))}
                </g>

                {/* Hover tooltip — anchored outside zoom group, simple */}
                {hovered && !selected && (() => {
                  const nx = hovered.px * zoom + W/2*(1-zoom);
                  const ny = hovered.py * zoom + H/2*(1-zoom);
                  const tx = Math.min(nx + hovered.r*zoom + 10, W - 180);
                  const ty = Math.max(ny - 36, 8);
                  return (
                    <g transform={`translate(${tx},${ty})`}>
                      <rect rx="6" width="168" height="48" fill="white" stroke={hovered.palette.fill} strokeWidth="1.5"
                        style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }} />
                      <text x="10" y="18" fill="#1e293b" fontSize="11" fontWeight="600">
                        {hovered.label.slice(0, 22)}
                      </text>
                      <text x="10" y="34" fill="#64748b" fontSize="10">
                        {hovered.type === 'memory' ? 'Mémoire' : 'Connaissance'} · {hovered.connections} lien(s)
                      </text>
                    </g>
                  );
                })()}
              </svg>
            )}

            {/* Simulation indicator — minimal */}
            {simRunning && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs text-indigo-500 bg-white/90 border border-indigo-100 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Organisation…
              </div>
            )}
          </div>
        </Card>

        {/* ── Side panel — selected node detail ── */}
        <AnimatePresence>
          {selectedFull && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-72 flex-shrink-0"
            >
              <Card className="border-2 overflow-hidden" style={{ borderColor: selectedFull.palette.fill + '50' }}>
                {/* Header strip */}
                <div className="px-4 py-3 flex items-start justify-between"
                  style={{ backgroundColor: selectedFull.palette.light }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: selectedFull.palette.fill }}>
                      {selectedFull.type === 'memory' ? '🧠' : '📚'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm leading-tight">{selectedFull.label}</p>
                      <span className="text-xs" style={{ color: selectedFull.palette.fill }}>
                        {selectedFull.type === 'memory' ? 'Mémoire' : selectedFull.category || 'Connaissance'}
                      </span>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-7 w-7 -mt-0.5 -mr-1"
                    onClick={() => setSelected(null)}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Content preview */}
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Contenu</p>
                    <p className="text-sm text-slate-700 leading-relaxed line-clamp-4">
                      {selectedFull.data.content?.slice(0, 250) || selectedFull.data.summary || 'Aucun contenu disponible.'}
                    </p>
                  </div>

                  {/* Tags */}
                  {selectedFull.data.tags?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Tags
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedFull.data.tags.map(tag => (
                          <button key={tag} onClick={() => setSearch(tag)}
                            className="text-xs px-2 py-0.5 rounded-full border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-slate-600">
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Connected nodes */}
                  {connectedNodes.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                        <Link2 className="w-3 h-3" /> Connecté à ({connectedNodes.length})
                      </p>
                      <div className="space-y-1">
                        {connectedNodes.slice(0, 5).map(cn => (
                          <button key={cn.id} onClick={() => setSelected(cn)}
                            className="w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cn.palette.fill }} />
                            <span className="text-xs text-slate-700 truncate">{cn.label}</span>
                          </button>
                        ))}
                        {connectedNodes.length > 5 && (
                          <p className="text-xs text-slate-400 px-2">+{connectedNodes.length - 5} autres</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}