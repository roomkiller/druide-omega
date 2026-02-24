/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Interactive Knowledge Graph — SVG Force-Directed v2        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  Network, Search, ZoomIn, ZoomOut, Sparkles,
  Database, Brain, Link2, Eye, EyeOff, RefreshCw, Lightbulb, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Physics constants ─────────────────────────────────────────────────────
const REPULSION    = 4500;
const ATTRACTION   = 0.04;
const DAMPING      = 0.82;
const CENTER_PULL  = 0.012;
const TICK_MS      = 16;
const IDLE_AFTER   = 120; // ticks before simulation rests

// ─── Color palette ─────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  external_data:  { fill: '#8b5cf6', glow: '#c4b5fd' },
  auto_enriched:  { fill: '#06b6d4', glow: '#a5f3fc' },
  subscription:   { fill: '#f59e0b', glow: '#fde68a' },
  general:        { fill: '#6366f1', glow: '#c7d2fe' },
};
const IMPORTANCE_COLORS = [
  { fill: '#6b7280', glow: '#d1d5db' },
  { fill: '#10b981', glow: '#a7f3d0' },
  { fill: '#f59e0b', glow: '#fde68a' },
  { fill: '#ef4444', glow: '#fca5a5' },
];

function getCategoryPalette(cat) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS.general;
}
function getImportancePalette(imp) {
  if (imp >= 8) return IMPORTANCE_COLORS[3];
  if (imp >= 6) return IMPORTANCE_COLORS[2];
  if (imp >= 4) return IMPORTANCE_COLORS[1];
  return IMPORTANCE_COLORS[0];
}

// ─── Force-directed layout engine (runs outside React render) ──────────────
function createPhysicsNodes(rawNodes, W, H) {
  return rawNodes.map((n, i) => {
    const angle = (i / rawNodes.length) * 2 * Math.PI;
    const r     = Math.min(W, H) * 0.32;
    return {
      ...n,
      px: W / 2 + Math.cos(angle) * r,
      py: H / 2 + Math.sin(angle) * r,
      vx: 0,
      vy: 0,
    };
  });
}

function tickPhysics(nodes, edges, W, H) {
  const len = nodes.length;

  // Repulsion
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      const dx  = nodes[i].px - nodes[j].px;
      const dy  = nodes[i].py - nodes[j].py;
      const d2  = dx * dx + dy * dy + 1;
      const f   = REPULSION / d2;
      nodes[i].vx += dx * f;
      nodes[i].vy += dy * f;
      nodes[j].vx -= dx * f;
      nodes[j].vy -= dy * f;
    }
  }

  // Attraction along edges
  edges.forEach(({ source, target, weight }) => {
    const a = nodes.find(n => n.id === source);
    const b = nodes.find(n => n.id === target);
    if (!a || !b) return;
    const dx = b.px - a.px;
    const dy = b.py - a.py;
    const f  = ATTRACTION * (weight || 1);
    a.vx += dx * f;
    a.vy += dy * f;
    b.vx -= dx * f;
    b.vy -= dy * f;
  });

  // Center gravity + damping + update
  nodes.forEach(n => {
    n.vx += (W / 2 - n.px) * CENTER_PULL;
    n.vy += (H / 2 - n.py) * CENTER_PULL;
    n.vx *= DAMPING;
    n.vy *= DAMPING;
    n.px += n.vx;
    n.py += n.vy;
    // clamp
    n.px = Math.max(n.radius + 10, Math.min(W - n.radius - 10, n.px));
    n.py = Math.max(n.radius + 10, Math.min(H - n.radius - 10, n.py));
  });

  return nodes;
}

// ─── SVG Defs (gradients + filters) ───────────────────────────────────────
function GraphDefs({ nodes }) {
  return (
    <defs>
      <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="glow-strong" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      {nodes.map(n => (
        <radialGradient key={n.id} id={`grad-${n.id}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%"   stopColor={n.palette.glow} />
          <stop offset="100%" stopColor={n.palette.fill} />
        </radialGradient>
      ))}
      {/* Particle gradient */}
      <radialGradient id="particle-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#a78bfa" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

// ─── Animated edge ─────────────────────────────────────────────────────────
function GraphEdge({ edge, nodes, selected, hovered }) {
  const a = nodes.find(n => n.id === edge.source);
  const b = nodes.find(n => n.id === edge.target);
  if (!a || !b) return null;

  const active = selected?.id === a.id || selected?.id === b.id ||
                 hovered?.id === a.id  || hovered?.id === b.id;

  const length = Math.hypot(b.px - a.px, b.py - a.py);
  const dash   = edge.style === 'dashed' ? '6,4' : undefined;
  const w      = active ? 2.5 : 1;
  const color  = active ? '#8b5cf6' : '#94a3b8';
  const op     = active ? 0.85 : 0.3;
  const id     = `edge-${edge.source}-${edge.target}`;

  return (
    <g opacity={op}>
      <defs>
        <linearGradient id={id} x1={a.px} y1={a.py} x2={b.px} y2={b.py} gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={a.palette.fill} stopOpacity="0.6" />
          <stop offset="100%" stopColor={b.palette.fill} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <line
        x1={a.px} y1={a.py} x2={b.px} y2={b.py}
        stroke={active ? `url(#${id})` : color}
        strokeWidth={w}
        strokeDasharray={dash}
        style={{ transition: 'stroke-width 0.2s, opacity 0.2s' }}
      />
      {/* Pulse dot traveling along edge when active */}
      {active && (
        <circle r="3" fill={a.palette.glow} opacity="0.9" filter="url(#glow)">
          <animateMotion dur="1.6s" repeatCount="indefinite" path={`M${a.px},${a.py} L${b.px},${b.py}`} />
        </circle>
      )}
    </g>
  );
}

// ─── Animated node ─────────────────────────────────────────────────────────
function GraphNode({ node, selected, hovered, onSelect, onHover }) {
  const isActive = selected?.id === node.id || hovered?.id === node.id;
  const r        = node.radius;

  return (
    <g
      className="cursor-pointer"
      onClick={() => onSelect(node)}
      onMouseEnter={() => onHover(node)}
      onMouseLeave={() => onHover(null)}
      style={{ transform: `translate(${node.px}px, ${node.py}px)` }}
    >
      {/* Outer glow ring — pulse when active */}
      <circle
        r={r + 10}
        fill="none"
        stroke={node.palette.glow}
        strokeWidth={isActive ? 2 : 0}
        opacity={isActive ? 0.6 : 0}
        filter="url(#glow)"
        style={{ transition: 'stroke-width 0.3s, opacity 0.3s' }}
      >
        {isActive && (
          <animate attributeName="r" values={`${r+8};${r+16};${r+8}`} dur="1.8s" repeatCount="indefinite" />
        )}
      </circle>

      {/* Main circle */}
      <circle
        r={r}
        fill={`url(#grad-${node.id})`}
        filter={isActive ? 'url(#glow-strong)' : 'url(#glow)'}
        style={{ transition: 'r 0.25s' }}
      />

      {/* Inner shimmer */}
      <circle
        r={r * 0.45}
        cx={-r * 0.22}
        cy={-r * 0.22}
        fill="white"
        opacity="0.25"
      />

      {/* Type icon text */}
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={r * 0.72}
        fill="white"
        opacity="0.9"
        style={{ userSelect: 'none' }}
      >
        {node.type === 'memory' ? '🧠' : '📚'}
      </text>

      {/* Label — always visible under node */}
      <text
        y={r + 14}
        textAnchor="middle"
        fontSize="10"
        fontWeight={isActive ? '700' : '500'}
        fill={isActive ? '#4f46e5' : '#64748b'}
        style={{ userSelect: 'none', transition: 'fill 0.2s' }}
      >
        {node.label.length > 20 ? node.label.slice(0, 18) + '…' : node.label}
      </text>

      {/* Connection count badge */}
      {node.connections > 0 && isActive && (
        <g transform={`translate(${r * 0.65}, ${-r * 0.65})`}>
          <circle r="9" fill="#6366f1" />
          <text textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="white" fontWeight="700">
            {node.connections}
          </text>
        </g>
      )}
    </g>
  );
}

// ─── Floating particles background ─────────────────────────────────────────
function BackgroundParticles({ W, H, count = 28 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      cx: Math.random() * W,
      cy: Math.random() * H,
      r: 1.5 + Math.random() * 3,
      dur: 3 + Math.random() * 5,
      dx: (Math.random() - 0.5) * 40,
      dy: (Math.random() - 0.5) * 40,
      delay: Math.random() * 4,
    })), [W, H]
  );

  return (
    <g opacity="0.35">
      {particles.map(p => (
        <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r} fill="url(#particle-grad)">
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0,0; ${p.dx},${p.dy}; 0,0`}
            dur={`${p.dur}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${p.dur}s`} begin={`${p.delay}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function InteractiveKnowledgeGraph() {
  const svgRef        = useRef(null);
  const containerRef  = useRef(null);
  const simRef        = useRef(null);
  const idleRef       = useRef(0);
  const nodesPhysRef  = useRef([]);

  const [svgSize, setSvgSize]         = useState({ W: 800, H: 580 });
  const [physNodes, setPhysNodes]     = useState([]);
  const [rawNodes, setRawNodes]       = useState([]);
  const [edges, setEdges]             = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode]   = useState(null);
  const [searchQuery, setSearchQuery]   = useState("");
  const [filterType, setFilterType]     = useState("all");
  const [zoom, setZoom]               = useState(1);
  const [showEdges, setShowEdges]     = useState(true);
  const [aiInsights, setAiInsights]   = useState(null);
  const [analyzingGraph, setAnalyzingGraph] = useState(false);
  const [simRunning, setSimRunning]   = useState(false);

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list('-created_date', 500)
  });
  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-importance', 200)
  });

  // Measure container
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setSvgSize({ W: Math.max(400, width), H: Math.max(380, height) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Build graph data
  useEffect(() => {
    const { W, H } = svgSize;
    const graphNodes = [];
    const graphEdges = [];
    const nodeMap    = new Map();

    const match = item => {
      const typeOk = filterType === 'all' ||
        (filterType === 'knowledge' && item._type !== 'memory') ||
        (filterType === 'memory'    && item._type === 'memory') ||
        (filterType === 'external'  && item.category === 'external_data');
      const searchOk = !searchQuery ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return typeOk && searchOk;
    };

    knowledgeBases.forEach(kb => {
      if (!match({ ...kb, _type: 'knowledge' })) return;
      const palette = getCategoryPalette(kb.category);
      const n = {
        id: `kb-${kb.id}`,
        label: kb.title || kb.name || 'Untitled',
        type: 'knowledge',
        category: kb.category || 'general',
        data: kb,
        palette,
        radius: 22 + Math.min((kb.tags?.length || 0) * 1.5, 14),
        connections: 0,
      };
      graphNodes.push(n);
      nodeMap.set(n.id, n);
    });

    memories.forEach(mem => {
      if (!match({ ...mem, _type: 'memory' })) return;
      const palette = getImportancePalette(mem.importance);
      const n = {
        id: `mem-${mem.id}`,
        label: mem.content?.slice(0, 35) || 'Memory',
        type: 'memory',
        importance: mem.importance || 5,
        data: mem,
        palette,
        radius: 16 + Math.min((mem.importance || 5) * 1.8, 12),
        connections: 0,
      };
      graphNodes.push(n);
      nodeMap.set(n.id, n);
    });

    // Edges
    const seen = new Set();
    graphNodes.forEach(a => {
      graphNodes.forEach(b => {
        if (a.id === b.id) return;
        const key = [a.id, b.id].sort().join('|');
        if (seen.has(key)) return;
        const tagsA = a.data.tags || [];
        const tagsB = b.data.tags || [];
        const common = tagsA.filter(t => tagsB.includes(t));
        if (common.length > 0) {
          seen.add(key);
          graphEdges.push({ source: a.id, target: b.id, weight: common.length });
          a.connections++;
          b.connections++;
        }
        if (a.type === 'memory' && b.type === 'knowledge') {
          const mc = a.data.content?.toLowerCase() || '';
          const kn = b.data.title?.toLowerCase() || b.data.name?.toLowerCase() || '';
          if (mc.includes(kn.slice(0, 10)) && kn.length > 3) {
            const key2 = [a.id, b.id].sort().join('|');
            if (!seen.has(key2)) {
              seen.add(key2);
              graphEdges.push({ source: a.id, target: b.id, weight: 1, style: 'dashed' });
              a.connections++;
              b.connections++;
            }
          }
        }
      });
    });

    setRawNodes(graphNodes);
    setEdges(graphEdges);

    // Init physics
    const pNodes = createPhysicsNodes(graphNodes, W, H);
    nodesPhysRef.current = pNodes;
    setPhysNodes([...pNodes]);
    idleRef.current = 0;
    setSimRunning(true);
  }, [knowledgeBases, memories, filterType, searchQuery, svgSize]);

  // Physics loop
  useEffect(() => {
    if (!simRunning) return;
    const { W, H } = svgSize;

    simRef.current = setInterval(() => {
      nodesPhysRef.current = tickPhysics(nodesPhysRef.current, edges, W, H);
      setPhysNodes([...nodesPhysRef.current]);

      const maxV = Math.max(...nodesPhysRef.current.map(n => Math.abs(n.vx) + Math.abs(n.vy)));
      if (maxV < 0.4) {
        idleRef.current++;
        if (idleRef.current > IDLE_AFTER) {
          setSimRunning(false);
          clearInterval(simRef.current);
        }
      } else {
        idleRef.current = 0;
      }
    }, TICK_MS);

    return () => clearInterval(simRef.current);
  }, [simRunning, edges, svgSize]);

  const reheat = () => {
    nodesPhysRef.current.forEach(n => {
      n.vx += (Math.random() - 0.5) * 6;
      n.vy += (Math.random() - 0.5) * 6;
    });
    idleRef.current = 0;
    setSimRunning(true);
  };

  const resetGraph = () => {
    setSearchQuery("");
    setFilterType("all");
    setZoom(1);
    setSelectedNode(null);
    setAiInsights(null);
    reheat();
  };

  const getTopTags = (ns, limit) => {
    const counts = {};
    ns.forEach(n => (n.data.tags || []).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([t]) => t);
  };

  const analyzeGraphWithAI = async () => {
    setAnalyzingGraph(true);
    try {
      const summary = {
        total_nodes: physNodes.length,
        knowledge_nodes: physNodes.filter(n => n.type === 'knowledge').length,
        memory_nodes: physNodes.filter(n => n.type === 'memory').length,
        total_edges: edges.length,
        avg_connections: (edges.length / (physNodes.length || 1)).toFixed(2),
        top_tags: getTopTags(physNodes, 10).join(', '),
      };

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es le Druide Omega. Analyse ce graphe de connaissances et fournis des insights stratégiques.

Statistiques:
- Nœuds: ${summary.total_nodes} (${summary.knowledge_nodes} KB, ${summary.memory_nodes} mémoires)
- Connexions: ${summary.total_edges} (moy: ${summary.avg_connections}/nœud)
- Top tags: ${summary.top_tags}

Retourne JSON avec key_insights, suggested_connections, underutilized_areas, recommended_actions.`,
        response_json_schema: {
          type: "object",
          properties: {
            key_insights: { type: "array", items: { type: "string" } },
            suggested_connections: { type: "array", items: { type: "object", properties: { from: { type: "string" }, to: { type: "string" }, reason: { type: "string" } } } },
            underutilized_areas: { type: "array", items: { type: "string" } },
            recommended_actions: { type: "array", items: { type: "object", properties: { action: { type: "string" }, priority: { type: "string" } } } }
          }
        }
      });
      setAiInsights(analysis);
    } catch (e) {
      console.error("Graph analysis error:", e);
    } finally {
      setAnalyzingGraph(false);
    }
  };

  const selectedConnections = selectedNode
    ? edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length
    : 0;

  // Merge physics positions into nodes for rendering
  const displayNodes = useMemo(() =>
    physNodes.map(pn => {
      const raw = rawNodes.find(r => r.id === pn.id);
      return raw ? { ...raw, px: pn.px, py: pn.py } : pn;
    }), [physNodes, rawNodes]
  );

  const { W, H } = svgSize;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Rechercher dans le graphe..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
            >
              <option value="all">Tous les nœuds</option>
              <option value="knowledge">Connaissances</option>
              <option value="memory">Mémoires</option>
              <option value="external">Sources externes</option>
            </select>
            <Button size="sm" variant="outline" onClick={() => setShowEdges(v => !v)} title="Connexions">
              {showEdges ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}><ZoomIn className="w-4 h-4" /></Button>
            <Button size="sm" variant="outline" onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))}><ZoomOut className="w-4 h-4" /></Button>
            <Button size="sm" variant="outline" onClick={resetGraph} title="Réinitialiser">
              <RefreshCw className={`w-4 h-4 ${simRunning ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              size="sm"
              onClick={analyzeGraphWithAI}
              disabled={analyzingGraph || displayNodes.length === 0}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
            >
              {analyzingGraph
                ? <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                : <Sparkles className="w-4 h-4 mr-1" />}
              Analyser (IA)
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-3 flex-wrap">
          {[
            { icon: Network,   label: `${displayNodes.length} nœuds` },
            { icon: Link2,     label: `${edges.length} connexions` },
            { icon: Database,  label: `${displayNodes.filter(n => n.type === 'knowledge').length} KB` },
            { icon: Brain,     label: `${displayNodes.filter(n => n.type === 'memory').length} mémoires` },
          ].map(({ icon: Icon, label }) => (
            <Badge key={label} variant="outline" className="gap-1 text-xs">
              <Icon className="w-3 h-3" />
              {label}
            </Badge>
          ))}
          {simRunning && (
            <Badge className="gap-1 text-xs bg-purple-100 text-purple-700 border-purple-200 animate-pulse">
              ⚡ Simulation active
            </Badge>
          )}
        </div>
      </Card>

      {/* AI Insights */}
      <AnimatePresence>
        {aiInsights && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-slate-900">Insights IA</h3>
                </div>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setAiInsights(null)}>
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-xs text-purple-700 mb-2 uppercase tracking-wide">Découvertes clés</p>
                  <ul className="space-y-1">
                    {aiInsights.key_insights?.map((ins, i) => (
                      <li key={i} className="flex gap-2 text-slate-700"><span className="text-purple-500 mt-0.5">•</span>{ins}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-xs text-indigo-700 mb-2 uppercase tracking-wide">Actions recommandées</p>
                  <div className="space-y-1">
                    {aiInsights.recommended_actions?.map((a, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Badge className={`text-xs flex-shrink-0 ${a.priority === 'high' ? 'bg-red-500' : a.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'} text-white`}>
                          {a.priority}
                        </Badge>
                        <span className="text-slate-700 text-xs">{a.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SVG Graph */}
      <Card className="overflow-hidden border-2 border-slate-100" style={{ height: 580 }}>
        <div ref={containerRef} className="w-full h-full relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
          {displayNodes.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
              <Network className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium">Aucun nœud à afficher</p>
              <p className="text-sm mt-1 opacity-70">Ajoutez des connaissances ou mémoires</p>
            </div>
          ) : (
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox={`0 0 ${W} ${H}`}
              style={{ display: 'block' }}
            >
              <GraphDefs nodes={displayNodes} />

              {/* Background grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(99,102,241,0.08)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width={W} height={H} fill="url(#grid)" />

              {/* Floating particles */}
              <BackgroundParticles W={W} H={H} />

              {/* Zoom group */}
              <g transform={`translate(${W/2*(1-zoom)}, ${H/2*(1-zoom)}) scale(${zoom})`}>
                {/* Edges */}
                {showEdges && edges.map((edge, i) => (
                  <GraphEdge
                    key={`${edge.source}-${edge.target}-${i}`}
                    edge={edge}
                    nodes={displayNodes}
                    selected={selectedNode}
                    hovered={hoveredNode}
                  />
                ))}

                {/* Nodes */}
                {displayNodes.map(node => (
                  <GraphNode
                    key={node.id}
                    node={node}
                    selected={selectedNode}
                    hovered={hoveredNode}
                    onSelect={n => setSelectedNode(prev => prev?.id === n.id ? null : n)}
                    onHover={setHoveredNode}
                  />
                ))}
              </g>

              {/* Tooltip overlay when hovering */}
              {hoveredNode && !selectedNode && (
                <g transform={`translate(${Math.min(hoveredNode.px + 20, W - 180)}, ${Math.max(hoveredNode.py - 50, 10)})`}>
                  <rect rx="8" ry="8" width="170" height="54" fill="rgba(15,23,42,0.9)" stroke="rgba(139,92,246,0.5)" strokeWidth="1" />
                  <text x="10" y="20" fill="white" fontSize="11" fontWeight="600">{hoveredNode.label.slice(0, 22)}</text>
                  <text x="10" y="36" fill="#94a3b8" fontSize="10">{hoveredNode.type} · {hoveredNode.connections || 0} connexions</text>
                  <text x="10" y="50" fill={hoveredNode.palette.glow} fontSize="10">Cliquer pour voir détails</text>
                </g>
              )}
            </svg>
          )}
        </div>
      </Card>

      {/* Selected Node Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <Card className="p-4 border-2" style={{ borderColor: selectedNode.palette.fill + '60' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `linear-gradient(135deg, ${selectedNode.palette.glow}, ${selectedNode.palette.fill})` }}>
                    {selectedNode.type === 'memory' ? '🧠' : '📚'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{selectedNode.label}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="text-xs" style={{ backgroundColor: selectedNode.palette.fill, color: 'white' }}>
                        {selectedNode.type}
                      </Badge>
                      {selectedNode.category && (
                        <Badge variant="outline" className="text-xs">{selectedNode.category}</Badge>
                      )}
                      <span className="text-xs text-slate-500">{selectedConnections} connexions</span>
                    </div>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSelectedNode(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                {selectedNode.data.content?.slice(0, 300) || selectedNode.data.summary || 'Aucun contenu disponible.'}
              </p>

              {selectedNode.data.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedNode.data.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs cursor-pointer hover:bg-purple-100"
                      onClick={() => setSearchQuery(tag)}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}