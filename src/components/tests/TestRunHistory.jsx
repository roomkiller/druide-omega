/**
 * Historique des journaux de tests (entité TestRun) — statut + % en continu
 */

import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { History, Loader2 } from 'lucide-react';

const STATUS_STYLE = {
  running: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700'
};

export default function TestRunHistory() {
  const { data: runs = [], isLoading } = useQuery({
    queryKey: ['testRuns'],
    queryFn: () => base44.entities.TestRun.list('-created_date', 10),
    refetchInterval: 5000
  });

  return (
    <Card className="p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-bold text-slate-900">Journal des exécutions</h3>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
      </div>

      {runs.length === 0 ? (
        <p className="text-sm text-slate-500">Aucune exécution enregistrée pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => {
            const completion = Math.round(((run.total_tests || 0) / 70) * 100);
            return (
              <div key={run.id} className="rounded-lg border border-slate-200 p-3 bg-white">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-semibold text-slate-900">{run.run_name}</span>
                  <Badge className={STATUS_STYLE[run.status] || 'bg-slate-100 text-slate-700'}>
                    {run.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <Progress value={completion} className="h-2 flex-1" />
                  <span className="text-xs text-slate-600 w-28 text-right">
                    {run.total_tests || 0}/70 · {completion}%
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                  <span>Score : <strong className="text-slate-900">{run.overall_score || 0}%</strong></span>
                  <span>Réussis : {run.tests_passed || 0}</span>
                  <span>Échoués : {run.tests_failed || 0}</span>
                  {run.duration_ms ? <span>Durée : {Math.round(run.duration_ms / 1000)}s</span> : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}