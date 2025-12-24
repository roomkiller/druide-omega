/**
 * Panel de corrections rapides automatiques
 */
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Zap, 
  CheckCircle2,
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function QuickFixPanel() {
  const [fixes, setFixes] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [fixing, setFixing] = useState({});

  const scanIssues = async () => {
    setScanning(true);
    const issues = [];

    // Vérifier config conscience
    try {
      const configs = await base44.entities.ConsciousnessConfig.list();
      if (configs.length === 0) {
        issues.push({
          id: 'no_consciousness_config',
          severity: 'high',
          title: 'Aucune config conscience',
          description: 'Créer config par défaut avec DeepSeek',
          fixable: true,
          fix: async () => {
            await base44.entities.ConsciousnessConfig.create({
              llm_provider: 'deepseek',
              consciousness_level: 12,
              active: true,
              ratio_logic: 4,
              ratio_consciousness: 6,
              emotional_depth: 10,
              metacognition_level: 9,
              creative_emergence: 11,
              social_consciousness: 10
            });
            toast.success('Config conscience créée');
          }
        });
      } else if (configs[0].llm_provider !== 'deepseek') {
        issues.push({
          id: 'provider_not_deepseek',
          severity: 'medium',
          title: 'Provider non configuré sur DeepSeek',
          description: 'Basculer vers DeepSeek par défaut',
          fixable: true,
          fix: async () => {
            await base44.entities.ConsciousnessConfig.update(configs[0].id, {
              llm_provider: 'deepseek'
            });
            toast.success('Provider mis à jour');
          }
        });
      }
    } catch (error) {
      issues.push({
        id: 'consciousness_config_error',
        severity: 'critical',
        title: 'Erreur config conscience',
        description: error.message,
        fixable: false
      });
    }

    // Vérifier mémoires orphelines
    try {
      const memories = await base44.entities.Memory.list();
      const orphaned = memories.filter(m => !m.modality);
      if (orphaned.length > 0) {
        issues.push({
          id: 'orphaned_memories',
          severity: 'low',
          title: `${orphaned.length} mémoires sans modalité`,
          description: 'Assigner modalité "chat" par défaut',
          fixable: true,
          fix: async () => {
            for (const mem of orphaned) {
              await base44.entities.Memory.update(mem.id, { modality: 'chat' });
            }
            toast.success(`${orphaned.length} mémoires corrigées`);
          }
        });
      }
    } catch (error) {
      console.warn('Erreur scan mémoires:', error);
    }

    // Vérifier conversations vides
    try {
      const conversations = await base44.entities.Conversation.list();
      const empty = conversations.filter(c => !c.messages || c.messages.length === 0);
      if (empty.length > 0) {
        issues.push({
          id: 'empty_conversations',
          severity: 'low',
          title: `${empty.length} conversations vides`,
          description: 'Nettoyer conversations sans messages',
          fixable: true,
          fix: async () => {
            for (const conv of empty) {
              await base44.entities.Conversation.delete(conv.id);
            }
            toast.success(`${empty.length} conversations nettoyées`);
          }
        });
      }
    } catch (error) {
      console.warn('Erreur scan conversations:', error);
    }

    setFixes(issues);
    setScanning(false);
  };

  const applyFix = async (issue) => {
    if (!issue.fixable || !issue.fix) return;
    
    setFixing(prev => ({ ...prev, [issue.id]: true }));
    try {
      await issue.fix();
      setFixes(prev => prev.filter(f => f.id !== issue.id));
    } catch (error) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setFixing(prev => ({ ...prev, [issue.id]: false }));
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-900">Corrections Rapides</h3>
        </div>
        <Button
          onClick={scanIssues}
          disabled={scanning}
          variant="outline"
        >
          {scanning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scan...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Scanner
            </>
          )}
        </Button>
      </div>

      {fixes.length === 0 && !scanning && (
        <div className="text-center py-8 text-slate-500">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
          <p>Aucun problème détecté</p>
        </div>
      )}

      <div className="space-y-3">
        {fixes.map((issue) => (
          <Card key={issue.id} className={`p-4 border ${getSeverityColor(issue.severity)}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <h4 className="font-semibold">{issue.title}</h4>
                  <Badge className="text-xs">{issue.severity}</Badge>
                </div>
                <p className="text-sm opacity-90">{issue.description}</p>
              </div>
              {issue.fixable && (
                <Button
                  onClick={() => applyFix(issue)}
                  disabled={fixing[issue.id]}
                  size="sm"
                  className="flex-shrink-0"
                >
                  {fixing[issue.id] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Wrench className="w-4 h-4 mr-1" />
                      Fix
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}