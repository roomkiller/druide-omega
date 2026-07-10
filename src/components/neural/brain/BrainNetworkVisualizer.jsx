/**
 * DRUIDE_OMEGA - Cerveau cognitif 3D
 * Réseau de corrélations organisé en régions cérébrales, navigable à la souris.
 */
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RotateCw, Pause, Crosshair, Zap } from 'lucide-react';
import { buildGraph } from './brainGraph';
import BrainSceneManager from './BrainSceneManager';
import NodeDetailPanel from './NodeDetailPanel';
import RegionLegend from './RegionLegend';

// Trajet de l'information entre lobes pour chaque phase de réflexion du DruideCore
const PHASE_ROUTES = {
  tensions: { from: 'system', to: 'memory', label: 'Tensions émergentes' },
  analysis: { from: 'memory', to: 'knowledge', label: 'Analyse cognitive' },
  knowledge: { from: 'knowledge', to: 'memory', label: 'Rappel de connaissances' },
  reflection: { from: 'knowledge', to: 'system', label: 'Auto-réflexion' },
  filaments: { from: 'knowledge', to: 'visual', label: 'Filaments parallèles' },
  generation: { from: 'knowledge', to: 'chat', label: 'Génération de réponse' },
  ratio: { from: 'system', to: 'knowledge', label: 'Validation du ratio' }
};

export default function BrainNetworkVisualizer({ correlations = [] }) {
  const containerRef = useRef(null);
  const managerRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [hover, setHover] = useState(null);
  const [hiddenRegions, setHiddenRegions] = useState([]);
  const [minStrength, setMinStrength] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [liveActivity, setLiveActivity] = useState(null);

  const graph = useMemo(() => buildGraph(correlations), [correlations]);

  useEffect(() => {
    if (!containerRef.current || graph.nodes.length === 0) return;
    const manager = new BrainSceneManager(containerRef.current, graph, {
      onSelect: setSelected,
      onHover: (data, pos) => setHover(data ? { data, pos } : null)
    });
    managerRef.current = manager;
    return () => { manager.dispose(); managerRef.current = null; };
  }, [graph]);

  useEffect(() => {
    managerRef.current?.applyFilters({ hiddenRegions, minStrength });
  }, [hiddenRegions, minStrength, graph]);

  // Temps réel : chaque phase de réflexion du DruideCore anime le trajet inter-lobes correspondant
  useEffect(() => {
    const unsubscribe = base44.entities.CorePhaseEvent.subscribe((event) => {
      if (event.type !== 'create') return;
      const route = PHASE_ROUTES[event.data?.phase_key];
      if (!route) return;
      managerRef.current?.triggerActivity(route.from, route.to);
      setLiveActivity({ label: event.data?.label || route.label, at: Date.now() });
    });
    return unsubscribe;
  }, []);

  // Efface le badge d'activité après 4 secondes
  useEffect(() => {
    if (!liveActivity) return;
    const timer = setTimeout(() => setLiveActivity(null), 4000);
    return () => clearTimeout(timer);
  }, [liveActivity]);

  const toggleRegion = (key) =>
    setHiddenRegions(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const toggleRotate = () => {
    const next = !autoRotate;
    setAutoRotate(next);
    managerRef.current?.setAutoRotate(next);
  };

  if (graph.nodes.length === 0) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center text-center gap-3">
        <Brain className="w-12 h-12 text-slate-300" />
        <p className="text-slate-500">Aucune corrélation cognitive à modéliser pour l'instant.</p>
      </Card>
    );
  }

  const density = ((graph.edges.length * 2) / (graph.nodes.length * Math.max(1, graph.nodes.length - 1)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Nœuds', value: graph.nodes.length, cls: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Connexions', value: graph.edges.length, cls: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
          { label: 'Densité', value: `${density}%`, cls: 'bg-purple-50 border-purple-200 text-purple-700' },
          { label: 'Régions actives', value: graph.regionStats.filter(r => r.nodeCount > 0).length, cls: 'bg-amber-50 border-amber-200 text-amber-700' }
        ].map(s => (
          <Card key={s.label} className={`p-3 ${s.cls.split(' ').slice(0, 2).join(' ')}`}>
            <div className={`text-xs ${s.cls.split(' ')[2]}`}>{s.label}</div>
            <div className={`text-xl font-bold ${s.cls.split(' ')[2]}`}>{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Scène 3D */}
        <div className="relative">
          <div
            ref={containerRef}
            className="w-full h-[560px] rounded-xl border border-slate-800 overflow-hidden bg-slate-950"
          />
          {/* Activité DruideCore en direct */}
          {liveActivity && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-900/85 text-amber-300 rounded-lg px-3 py-1.5 text-xs font-medium animate-pulse">
              <Zap className="w-3.5 h-3.5" />
              DruideCore : {liveActivity.label}
            </div>
          )}
          {/* Contrôles */}
          <div className="absolute top-3 right-3 flex gap-2">
            <Button size="sm" variant="secondary" onClick={toggleRotate} title={autoRotate ? 'Arrêter la rotation' : 'Rotation automatique'}>
              {autoRotate ? <Pause className="w-4 h-4" /> : <RotateCw className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => managerRef.current?.resetView()} title="Recentrer la vue">
              <Crosshair className="w-4 h-4" />
            </Button>
          </div>
          {/* Aide navigation */}
          <div className="absolute bottom-3 left-3 text-[11px] text-slate-400 bg-slate-900/70 rounded-lg px-3 py-1.5">
            Glisser : rotation · Molette : zoom · Clic droit : déplacer · Clic sur un nœud : détails
          </div>
          {/* Infobulle survol */}
          {hover && (
            <div
              className="absolute pointer-events-none z-10 bg-slate-900/95 text-white rounded-lg px-3 py-2 max-w-[260px] shadow-xl"
              style={{ left: Math.min(hover.pos.x + 14, 600), top: hover.pos.y + 14 }}
            >
              <p className="text-xs font-medium break-words">{hover.data.id}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {hover.data.connections} connexion{hover.data.connections > 1 ? 's' : ''} · force {hover.data.strength?.toFixed(1)}
              </p>
            </div>
          )}
        </div>

        {/* Panneau latéral */}
        <div className="space-y-4">
          <RegionLegend
            regionStats={graph.regionStats}
            hiddenRegions={hiddenRegions}
            onToggle={toggleRegion}
            minStrength={minStrength}
            onMinStrength={setMinStrength}
          />
          {selected ? (
            <NodeDetailPanel
              node={selected}
              onNavigate={(id) => managerRef.current?.select(id)}
              onClose={() => managerRef.current?.select(null)}
            />
          ) : (
            <Card className="p-5 text-center text-sm text-slate-500">
              Cliquer sur un nœud pour explorer ses connexions.
              <br />
              <span className="text-xs text-amber-600">✦ Les halos dorés marquent les 3 super-hubs de la pensée de Druide.</span>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}