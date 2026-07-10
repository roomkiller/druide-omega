import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Activity, Newspaper, FileText, Rocket } from 'lucide-react';

const ACTIONS = [
  { key: 'inventory_tests', label: 'Inventaire + Tests', icon: Activity, modules: ['inventory', 'tests'], hint: '0 crédit' },
  { key: 'news', label: 'Actualité & Marché', icon: Newspaper, modules: ['news'], hint: 'crédits IA' },
  { key: 'descriptions', label: 'Descriptions manquantes', icon: FileText, modules: ['descriptions'], hint: 'crédits IA' },
  { key: 'all', label: 'Tout mettre à jour', icon: Rocket, modules: ['inventory', 'tests', 'news', 'descriptions'], hint: 'complet' }
];

export default function RegistryUpdatePanel({ onUpdated }) {
  const [running, setRunning] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const run = async (action) => {
    setRunning(action.key);
    setError(null);
    try {
      const res = await base44.functions.invoke('registryUpdateEngine', { modules: action.modules });
      setReport(res.data);
      onUpdated?.();
    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    } finally {
      setRunning(null);
    }
  };

  return (
    <Card className="p-4 mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
      <div className="flex items-center gap-2 mb-3">
        <RefreshCw className="w-4 h-4 text-indigo-600" />
        <h3 className="font-semibold text-slate-900 text-sm">Moteur de Mise à Jour du Registre</h3>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {ACTIONS.map(action => {
          const Icon = action.icon;
          const isRunning = running === action.key;
          return (
            <Button
              key={action.key}
              size="sm"
              variant={action.key === 'all' ? 'default' : 'outline'}
              disabled={!!running}
              onClick={() => run(action)}
              className={`min-h-[44px] ${action.key === 'all' ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-white'}`}
            >
              {isRunning
                ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                : <Icon className="w-4 h-4 mr-2" />}
              {action.label}
              <Badge variant="outline" className="ml-2 text-[10px]">{action.hint}</Badge>
            </Button>
          );
        })}
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-2">Erreur : {error}</p>
      )}

      {report && (
        <div className="text-xs text-slate-700 space-y-1 bg-white/70 rounded-lg p-3 border border-slate-200">
          <div className="font-medium text-slate-900">Dernier rapport ({new Date(report.finished_at).toLocaleString('fr-CA')})</div>
          {report.modules?.inventory && (
            <div>• Inventaire : {report.modules.inventory.created} créés, {report.modules.inventory.orphans_deprecated} obsolètes marqués ({report.modules.inventory.total_manifest} éléments suivis)</div>
          )}
          {report.modules?.tests && (
            <div>• Tests : contrôle de santé {report.modules.tests.healthCheck?.status === 'success' ? '✓ réussi' : '✗ échec — ' + (report.modules.tests.healthCheck?.error || '')}</div>
          )}
          {report.modules?.news && (
            <div>• Actualité & marché : {report.modules.news.status === 'success' ? '✓ mis à jour' : '✗ ' + report.modules.news.error}</div>
          )}
          {report.modules?.descriptions && (
            <div>• Descriptions : {report.modules.descriptions.status === 'success' ? `✓ ${report.modules.descriptions.updated} générées` : '✗ ' + report.modules.descriptions.error}</div>
          )}
        </div>
      )}
    </Card>
  );
}