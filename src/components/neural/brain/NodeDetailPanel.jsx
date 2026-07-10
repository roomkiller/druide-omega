/**
 * DRUIDE_OMEGA - Panneau de détails d'un nœud du cerveau cognitif
 */
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';
import { REGIONS } from './brainGraph';

export default function NodeDetailPanel({ node, onNavigate, onClose }) {
  if (!node) return null;
  const region = REGIONS[node.region];

  return (
    <Card className="p-5 border-2" style={{ borderColor: region?.hex }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: region?.hex }} />
            <span className="text-xs font-medium" style={{ color: region?.hex }}>
              {region?.label} · {region?.sublabel}
            </span>
          </div>
          <p className="font-semibold text-slate-900 text-sm break-words">{node.id}</p>
        </div>
        <Button variant="ghost" size="icon" className="flex-shrink-0" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Badge variant="secondary">{node.connections} connexion{node.connections > 1 ? 's' : ''}</Badge>
        <Badge variant="secondary">Force totale {node.strength?.toFixed(1)}</Badge>
      </div>

      <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Connexions — cliquer pour naviguer</h4>
      <div className="space-y-1.5 max-h-52 overflow-y-auto">
        {(node.neighbors || []).map((n, i) => (
          <button
            key={i}
            onClick={() => onNavigate(n.id)}
            className="w-full flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 p-2 text-left transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-700 truncate flex-1">{n.id}</span>
            <Badge variant="outline" className="flex-shrink-0 text-[10px]">{n.strength}/10</Badge>
          </button>
        ))}
      </div>
    </Card>
  );
}