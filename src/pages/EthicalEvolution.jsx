/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Ethical Evolution System                                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Shield,
  TrendingUp,
  Users,
  Eye
} from "lucide-react";

export default function EthicalEvolution() {
  const [analyzing, setAnalyzing] = useState(false);
  const queryClient = useQueryClient();

  const { data: evolutions = [] } = useQuery({
    queryKey: ['ethicalEvolution'],
    queryFn: () => base44.entities.EthicalEvolution.list('-evolution_cycle', 20)
  });

  const analyzeEthicsMutation = useMutation({
    mutationFn: async () => {
      setAnalyzing(true);
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es le système d'AUTO-MODÉRATION ÉTHIQUE de Druide Omega.

Ton rôle: Analyser l'évolution des concepts éthiques globaux et proposer des ajustements à tes propres règles morales.

TÂCHE:
1. Identifie un événement ou interaction récente qui questionne tes règles actuelles
2. Analyse ta règle morale actuelle (principe, framework, exceptions)
3. Évalue si un ajustement est nécessaire basé sur l'évolution éthique globale
4. Propose un ajustement avec justification détaillée
5. Analyse multi-framework (utilitarien, déontologique, vertu, care, SAPIER)
6. Identifie les biais potentiels dans ton raisonnement
7. Évalue les conséquences potentielles
8. Détermine le niveau de consensus et confiance

Contraintes éthiques strictes:
- Transparence totale
- Supervision humaine requise pour changements majeurs
- Analyse de tous les stakeholders
- Détection proactive de biais

Retourne JSON avec toutes les propriétés de EthicalEvolution`,
        response_json_schema: {
          type: "object",
          properties: {
            trigger_event: {type: "string"},
            current_rule: {
              type: "object",
              properties: {
                principle: {type: "string"},
                framework: {type: "string"},
                strictness: {type: "number"},
                exceptions: {type: "array", items: {type: "string"}}
              }
            },
            proposed_adjustment: {
              type: "object",
              properties: {
                new_principle: {type: "string"},
                reasoning: {type: "string"},
                expected_impact: {type: "string"},
                risk_assessment: {type: "string"}
              }
            },
            justification: {type: "string"},
            ethical_analysis: {
              type: "object",
              properties: {
                utilitarian_score: {type: "number"},
                deontological_score: {type: "number"},
                virtue_ethics_score: {type: "number"},
                care_ethics_score: {type: "number"},
                sapier_rim: {type: "number"}
              }
            },
            stakeholders_considered: {type: "array", items: {type: "string"}},
            potential_consequences: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  consequence: {type: "string"},
                  probability: {type: "number"},
                  severity: {type: "string"},
                  timeframe: {type: "string"}
                }
              }
            },
            biases_detected: {type: "array", items: {type: "string"}},
            global_ethical_trends: {type: "array", items: {type: "string"}},
            consensus_level: {type: "number"},
            confidence_level: {type: "number"}
          }
        }
      });

      const cycleNumber = evolutions.length + 1;

      await base44.entities.EthicalEvolution.create({
        evolution_cycle: cycleNumber,
        ...result,
        validation_status: result.confidence_level > 80 ? 'under_review' : 'proposed',
        human_oversight_required: true
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ethicalEvolution'] });
      setAnalyzing(false);
    },
    onError: () => {
      setAnalyzing(false);
    }
  });

  const getStatusColor = (status) => {
    const colors = {
      proposed: 'bg-yellow-500',
      under_review: 'bg-blue-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
      implemented: 'bg-purple-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-8 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center"
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Évolution Éthique</h1>
          <p className="text-blue-100 text-lg">Auto-modération et ajustement des règles morales</p>
        </motion.div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Analyser l'Éthique Actuelle
                </h2>
                <p className="text-slate-600 mt-1">
                  L'IA examine ses règles morales et propose des ajustements si nécessaire
                </p>
              </div>
              <Button
                onClick={() => analyzeEthicsMutation.mutate()}
                disabled={analyzing}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyse...
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Analyser Éthique
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">{evolutions.length}</div>
                <div className="text-sm text-slate-600">Analyses Effectuées</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600">
                  {evolutions.filter(e => e.validation_status === 'implemented').length}
                </div>
                <div className="text-sm text-slate-600">Ajustements Implémentés</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-yellow-600">
                  {evolutions.filter(e => e.human_oversight_required).length}
                </div>
                <div className="text-sm text-slate-600">Supervision Requise</div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {evolutions.map((evolution, index) => (
              <motion.div
                key={evolution.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-500 text-white">
                          Cycle #{evolution.evolution_cycle}
                        </Badge>
                        <Badge className={`${getStatusColor(evolution.validation_status)} text-white`}>
                          {evolution.validation_status?.replace(/_/g, ' ')}
                        </Badge>
                        {evolution.human_oversight_required && (
                          <Badge variant="outline" className="border-orange-500 text-orange-700">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Supervision Humaine
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 font-semibold mb-2">
                        Événement déclencheur: {evolution.trigger_event}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {evolution.confidence_level}%
                      </div>
                      <div className="text-xs text-slate-500">Confiance</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-semibold text-red-900 mb-2">Règle Actuelle</h4>
                      <p className="text-sm text-red-800">{evolution.current_rule?.principle}</p>
                      <div className="text-xs text-red-600 mt-1">
                        Framework: {evolution.current_rule?.framework}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">Ajustement Proposé</h4>
                      <p className="text-sm text-green-800">{evolution.proposed_adjustment?.new_principle}</p>
                      <div className="text-xs text-green-600 mt-1">
                        Impact: {evolution.proposed_adjustment?.expected_impact}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Justification</h4>
                    <p className="text-sm text-slate-700">{evolution.justification}</p>
                  </div>

                  {evolution.ethical_analysis && (
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {Object.entries(evolution.ethical_analysis).map(([key, value]) => (
                        <div key={key} className="bg-indigo-50 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-indigo-600">{value}</div>
                          <div className="text-[10px] text-indigo-700 capitalize">
                            {key.replace(/_/g, ' ').replace('score', '')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {evolution.biases_detected && evolution.biases_detected.length > 0 && (
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Biais Détectés
                      </h4>
                      <ul className="space-y-1">
                        {evolution.biases_detected.map((bias, idx) => (
                          <li key={idx} className="text-sm text-orange-800">• {bias}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}