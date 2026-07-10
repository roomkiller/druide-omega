/**
 * DRUIDE_OMEGA - Légende des régions cérébrales + filtres
 */
import React from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

export default function RegionLegend({ regionStats, hiddenRegions, onToggle, minStrength, onMinStrength }) {
  const activeStats = regionStats.filter(r => r.nodeCount > 0);
  const maxStrength = Math.max(1, ...activeStats.map(r => r.totalStrength));

  return (
    <Card className="p-5">
      <h4 className="text-xs font-medium text-slate-500 uppercase mb-3">Régions cérébrales — cliquer pour masquer/afficher</h4>
      <div className="space-y-2 mb-5">
        {activeStats.map(region => {
          const hidden = hiddenRegions.includes(region.key);
          return (
            <button
              key={region.key}
              onClick={() => onToggle(region.key)}
              className={`w-full flex items-center gap-3 rounded-lg p-2 text-left transition-all ${hidden ? 'opacity-35' : 'hover:bg-slate-50'}`}
            >
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: region.hex }} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-800">{region.label}</span>
                  <span className="text-slate-500">{region.nodeCount} nœud{region.nodeCount > 1 ? 's' : ''}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ backgroundColor: region.hex, width: `${(region.totalStrength / maxStrength) * 100}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Force minimale des connexions : {minStrength}/10</h4>
      <Slider
        value={[minStrength]}
        onValueChange={([v]) => onMinStrength(v)}
        min={0}
        max={10}
        step={1}
      />
    </Card>
  );
}