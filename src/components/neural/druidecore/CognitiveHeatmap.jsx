/**
 * DRUIDE_OMEGA - Carte thermique cognitive
 * Intensité cognitive (complexité + poids émotionnel) par jour + domaines dominants.
 */
import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame } from 'lucide-react';

export default function CognitiveHeatmap() {
  const { data: interactions = [], isLoading } = useQuery({
    queryKey: ['cognitiveHeatmap'],
    queryFn: () => base44.entities.Memory.filter({ type: 'interaction' }, '-created_date', 300)
  });

  // Intensité par jour sur les 28 derniers jours
  const byDay = {};
  interactions.forEach(m => {
    const day = new Date(m.created_date).toISOString().slice(0, 10);
    if (!byDay[day]) byDay[day] = { total: 0, count: 0 };
    byDay[day].total += m.importance || 0;
    byDay[day].count += 1;
  });

  const days = [...Array(28)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const key = d.toISOString().slice(0, 10);
    const entry = byDay[key];
    return {
      key,
      label: d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' }),
      intensity: entry ? entry.total : 0,
      count: entry ? entry.count : 0
    };
  });

  const maxIntensity = Math.max(1, ...days.map(d => d.intensity));

  // Domaines dominants (tags)
  const tagCounts = {};
  interactions.forEach(m => (m.tags || []).forEach(t => {
    if (t !== 'tensions' && t !== 'filaments') tagCounts[t] = (tagCounts[t] || 0) + 1;
  }));
  const topTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a).slice(0, 10);

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-1">
        <Flame className="w-5 h-5 text-orange-600" />
        <h3 className="font-semibold text-slate-900">Carte thermique cognitive</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Intensité cognitive quotidienne (complexité + poids émotionnel des questions) — 28 derniers jours.
      </p>

      {isLoading ? (
        <div className="h-40 flex items-center justify-center text-slate-400">Chargement...</div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-2 mb-8">
            {days.map(d => (
              <div
                key={d.key}
                title={`${d.label} — ${d.count} interaction(s), intensité ${d.intensity}`}
                className="aspect-square rounded-lg border border-slate-200 flex items-center justify-center cursor-default transition-transform hover:scale-110"
                style={{ backgroundColor: `rgba(249, 115, 22, ${d.intensity > 0 ? 0.15 + 0.85 * (d.intensity / maxIntensity) : 0.03})` }}
              >
                <span className={`text-[10px] ${d.intensity / maxIntensity > 0.5 ? 'text-white font-medium' : 'text-slate-500'}`}>
                  {d.label.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          <h4 className="text-sm font-medium text-slate-700 mb-3">Domaines de connaissance sollicités</h4>
          {topTags.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun domaine identifié pour l'instant.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topTags.map(([tag, count]) => (
                <Badge key={tag} variant="outline" className="capitalize">
                  {tag} <span className="ml-1 text-slate-400">×{count}</span>
                </Badge>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
}