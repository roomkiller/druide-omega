/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - System Health & Diagnostics                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import invokeLLM from '@/components/utils/LLMRouter';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2,
  Database,
  Cpu,
  Zap,
  Brain,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SystemHealth() {
  const [tests, setTests] = useState([]);
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState(null);

  const runDiagnostics = async () => {
    setRunning(true);
    setTests([]);
    const results = [];

    // Test 1: Base44 Connection
    results.push(await testBase44Connection());
    setTests([...results]);

    // Test 2: DeepSeek Integration
    results.push(await testDeepSeek());
    setTests([...results]);

    // Test 3: LLM Router
    results.push(await testLLMRouter());
    setTests([...results]);

    // Test 4: Entities Schema
    results.push(await testEntities());
    setTests([...results]);

    // Test 5: Consciousness Config
    results.push(await testConsciousnessConfig());
    setTests([...results]);

    // Test 6: Memory System
    results.push(await testMemorySystem());
    setTests([...results]);

    // Test 7: Backend Functions
    results.push(await testBackendFunctions());
    setTests([...results]);

    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const warnings = results.filter(r => r.status === 'warning').length;

    setSummary({
      total: results.length,
      passed,
      failed,
      warnings,
      score: Math.round((passed / results.length) * 100)
    });

    setRunning(false);
  };

  const testBase44Connection = async () => {
    try {
      const user = await base44.auth.me();
      return {
        name: 'Base44 Connection',
        status: 'pass',
        message: `Connecté: ${user.email}`,
        icon: Database,
        details: { user_role: user.role }
      };
    } catch (error) {
      return {
        name: 'Base44 Connection',
        status: 'fail',
        message: error.message,
        icon: Database
      };
    }
  };

  const testDeepSeek = async () => {
    try {
      const result = await base44.functions.invoke('deepseek', {
        prompt: 'Test: réponds juste "OK"',
        max_tokens: 10
      });
      
      return {
        name: 'DeepSeek Integration',
        status: 'pass',
        message: 'DeepSeek fonctionne correctement',
        icon: Cpu,
        details: { response: result.response || result }
      };
    } catch (error) {
      return {
        name: 'DeepSeek Integration',
        status: 'warning',
        message: `Fallback Base44 actif: ${error.message}`,
        icon: Cpu
      };
    }
  };

  const testLLMRouter = async () => {
    try {
      const result = await invokeLLM({
        prompt: 'Test routing: dis juste "Router OK"',
        response_json_schema: {
          type: 'object',
          properties: {
            status: { type: 'string' }
          }
        }
      });
      
      return {
        name: 'LLM Router',
        status: 'pass',
        message: 'Router fonctionne (DeepSeek ou Base44)',
        icon: Zap,
        details: result
      };
    } catch (error) {
      return {
        name: 'LLM Router',
        status: 'fail',
        message: error.message,
        icon: Zap
      };
    }
  };

  const testEntities = async () => {
    try {
      const entities = [
        'ConsciousnessConfig',
        'Memory',
        'Conversation',
        'KnowledgeBase',
        'TestRun',
        'Deployment'
      ];

      const checks = await Promise.all(
        entities.map(async (e) => {
          try {
            await base44.entities[e].list();
            return { entity: e, ok: true };
          } catch (err) {
            return { entity: e, ok: false, error: err.message };
          }
        })
      );

      const failed = checks.filter(c => !c.ok);

      return {
        name: 'Entities Schema',
        status: failed.length === 0 ? 'pass' : 'warning',
        message: failed.length === 0 
          ? `${entities.length} entités OK` 
          : `${failed.length} entités avec erreurs`,
        icon: Database,
        details: { checks }
      };
    } catch (error) {
      return {
        name: 'Entities Schema',
        status: 'fail',
        message: error.message,
        icon: Database
      };
    }
  };

  const testConsciousnessConfig = async () => {
    try {
      const configs = await base44.entities.ConsciousnessConfig.list();
      const config = configs[0];

      if (!config) {
        return {
          name: 'Consciousness Config',
          status: 'warning',
          message: 'Aucune config trouvée (sera créée auto)',
          icon: Brain
        };
      }

      const provider = config.llm_provider || 'base44';

      return {
        name: 'Consciousness Config',
        status: 'pass',
        message: `Config OK - Provider: ${provider}`,
        icon: Brain,
        details: {
          level: config.consciousness_level,
          provider: config.llm_provider,
          ratio: `${config.ratio_logic}:${config.ratio_consciousness}`
        }
      };
    } catch (error) {
      return {
        name: 'Consciousness Config',
        status: 'fail',
        message: error.message,
        icon: Brain
      };
    }
  };

  const testMemorySystem = async () => {
    try {
      const memories = await base44.entities.Memory.list();
      
      return {
        name: 'Memory System',
        status: 'pass',
        message: `${memories.length} mémoires enregistrées`,
        icon: Database,
        details: { count: memories.length }
      };
    } catch (error) {
      return {
        name: 'Memory System',
        status: 'fail',
        message: error.message,
        icon: Database
      };
    }
  };

  const testBackendFunctions = async () => {
    try {
      // Test deepseek function exists
      const result = await base44.functions.invoke('deepseek', {
        prompt: 'ping',
        max_tokens: 5
      });

      return {
        name: 'Backend Functions',
        status: 'pass',
        message: 'Fonction deepseek accessible',
        icon: Activity,
        details: { deepseek_response: result }
      };
    } catch (error) {
      return {
        name: 'Backend Functions',
        status: 'warning',
        message: `DeepSeek non dispo: ${error.message}`,
        icon: Activity
      };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'fail': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default: return <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass': return 'from-green-50 to-emerald-50 border-green-200';
      case 'fail': return 'from-red-50 to-rose-50 border-red-200';
      case 'warning': return 'from-amber-50 to-orange-50 border-amber-200';
      default: return 'from-slate-50 to-gray-50 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 page-padding page-padding-y">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 font-display">
            System Health
          </h1>
          <p className="text-slate-600">
            Diagnostic complet de l'application Druide Omega
          </p>
        </div>

        {/* Run Button */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Lancer Diagnostics
              </h2>
              <p className="text-sm text-slate-600">
                Vérification complète de tous les systèmes
              </p>
            </div>
            <Button
              onClick={runDiagnostics}
              disabled={running}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
            >
              {running ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Tests en cours...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 mr-2" />
                  Lancer Tests
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Summary */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
          >
            <Card className="p-4 bg-gradient-to-br from-slate-50 to-gray-50">
              <div className="text-xs text-slate-600 mb-1">Tests Total</div>
              <div className="text-2xl font-bold text-slate-900">{summary.total}</div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="text-xs text-green-700 mb-1">Réussis</div>
              <div className="text-2xl font-bold text-green-700">{summary.passed}</div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-50">
              <div className="text-xs text-red-700 mb-1">Échecs</div>
              <div className="text-2xl font-bold text-red-700">{summary.failed}</div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="text-xs text-amber-700 mb-1">Warnings</div>
              <div className="text-2xl font-bold text-amber-700">{summary.warnings}</div>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="text-xs text-purple-700 mb-1">Score</div>
              <div className="text-2xl font-bold text-purple-700">{summary.score}%</div>
            </Card>
          </motion.div>
        )}

        {/* Tests Results */}
        <div className="space-y-4">
          {tests.map((test, idx) => {
            const Icon = test.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`p-6 bg-gradient-to-br ${getStatusColor(test.status)} border`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-slate-700" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          {test.name}
                        </h3>
                        {getStatusIcon(test.status)}
                        <Badge className={
                          test.status === 'pass' ? 'bg-green-100 text-green-700' :
                          test.status === 'fail' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }>
                          {test.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-slate-700 mb-2">{test.message}</p>
                      {test.details && (
                        <details className="text-xs text-slate-600">
                          <summary className="cursor-pointer hover:text-slate-900">
                            Détails techniques
                          </summary>
                          <pre className="mt-2 bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto">
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {tests.length === 0 && !running && (
          <Card className="p-12 text-center bg-gradient-to-br from-slate-50 to-gray-50">
            <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Aucun test lancé
            </h3>
            <p className="text-slate-600">
              Cliquez sur "Lancer Tests" pour démarrer le diagnostic
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}