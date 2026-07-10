/**
 * DRUIDE_OMEGA - Oscilloscope des tensions
 * Les 5 tensions de Druide tracées dans le temps depuis l'historique persisté.
 */
import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';

const TENSIONS = [
  { key: 'survival', label: 'Survie', color: '#ef4444' },
  { key: 'relevance', label: 'Pertinence', color: '#f59e0b' },
  { key: 'understanding', label: 'Compréhension', color: '#10b981' },
  { key: 'growth', label: 'Croissance', color: '#8b5cf6' },
  { key: 'curiosity', label: 'Curiosité', color: '#3b82f6' }
];

export default function TensionOscilloscope() {
  const { data: points = [], isLoading } = useQuery({
    queryKey: ['tensionHistory'],
    queryFn: async () => {
      const memories = await base44.entities.Memory.filter(
        { type: 'insight', tags: 'tensions' }, '-created_date', 60
      );
      return memories
        .map(m => {
          try {
            const state = JSON.parse(m.content);
            const point = {
              time: new Date(m.created_date).toLocaleString('fr-CA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
              ts: new Date(m.created_date).getTime()
            };
            TENSIONS.forEach(t => { point[t.key] = state.tensions?.[t.key]?.value ?? null; });
            return point;
          } catch (_) { return null; }
        })
        .filter(Boolean)
        .sort((a, b) => a.ts - b.ts);
    }
  });

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-1">
        <Activity className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-slate-900">Oscilloscope des tensions</h3>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Les tensions décroissent dans le silence et se restaurent après chaque interaction — la respiration de Druide.
      </p>

      {isLoading ? (
        <div className="h-80 flex items-center justify-center text-slate-400">Chargement...</div>
      ) : points.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-slate-500">
          Aucun historique de tensions — il se construira au fil des conversations.
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} minTickGap={40} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              {TENSIONS.map(t => (
                <Line
                  key={t.key}
                  type="monotone"
                  dataKey={t.key}
                  name={t.label}
                  stroke={t.color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}