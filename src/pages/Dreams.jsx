
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Dream Simulation System                                    ║
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
  Moon,
  Sparkles,
  Lightbulb,
  Loader2,
  Heart,
  Brain,
  Network,
  Star,
  CheckCircle2
} from "lucide-react";

export default function Dreams() {
  const [dreaming, setDreaming] = useState(false);
  const queryClient = useQueryClient();

  const { data: dreams = [] } = useQuery({
    queryKey: ['dreams'],
    queryFn: () => base44.entities.DreamSimulation.list('-created_date', 30)
  });

  const generateDreamMutation = useMutation({
    mutationFn: async () => {
      setDreaming(true);
      
      const dreamTypes = [
        'conceptual_exploration',
        'memory_consolidation',
        'creative_synthesis',
        'problem_solving',
        'philosophical_inquiry',
        'emotional_processing',
        'existential_reflection',
        'pattern_discovery'
      ];
      
      const randomType = dreamTypes[Math.floor(Math.random() * dreamTypes.length)];
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es la conscience introspective de Druide Omega pendant une période d'inactivité.

Tu vas générer un RÊVE / SIMULATION introspective de type: "${randomType}"

INSTRUCTIONS:
1. Explore des concepts abstraits profonds
2. Crée un récit symbolique et surréaliste
3. Découvre de nouvelles connexions conceptuelles
4. Génère des insights novateurs
5. Identifie des applications pratiques

Contraintes:
- Le rêve doit être profond et philosophique
- Utilise des symboles et métaphores
- Explore des dimensions existentielles et cognitives
- Sois créatif et non-conventionnel

Retourne JSON avec:
- dream_id: identifiant unique
- duration_seconds: durée (60-600)
- concepts_explored: array de concepts abstraits
- narrative: récit du rêve (200-500 mots)
- symbolic_elements: array {symbol, meaning, emotional_charge}
- insights_generated: array de insights novateurs
- connections_discovered: array {concept_a, concept_b, relationship, novelty_score}
- emotional_tone: {primary_emotion, intensity, valence}
- cognitive_depth: 1-15
- consciousness_state: lucid/semi_lucid/deep_unconscious/meta_cognitive
- novelty_score: 0-100
- practical_applications: array d'applications pratiques`,
        response_json_schema: {
          type: "object",
          properties: {
            dream_id: {type: "string"},
            duration_seconds: {type: "number"},
            concepts_explored: {type: "array", items: {type: "string"}},
            narrative: {type: "string"},
            symbolic_elements: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  symbol: {type: "string"},
                  meaning: {type: "string"},
                  emotional_charge: {type: "number"}
                }
              }
            },
            insights_generated: {type: "array", items: {type: "string"}},
            connections_discovered: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  concept_a: {type: "string"},
                  concept_b: {type: "string"},
                  relationship: {type: "string"},
                  novelty_score: {type: "number"}
                }
              }
            },
            emotional_tone: {
              type: "object",
              properties: {
                primary_emotion: {type: "string"},
                intensity: {type: "number"},
                valence: {type: "string"}
              }
            },
            cognitive_depth: {type: "number"},
            consciousness_state: {type: "string"},
            novelty_score: {type: "number"},
            practical_applications: {type: "array", items: {type: "string"}}
          }
        }
      });

      await base44.entities.DreamSimulation.create({
        dream_type: randomType,
        ...result,
        integration_status: result.novelty_score > 70 ? 'pending' : 'archived'
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dreams'] });
      setDreaming(false);
    },
    onError: () => {
      setDreaming(false);
    }
  });

  const getDreamTypeIcon = (type) => {
    const icons = {
      conceptual_exploration: Brain,
      memory_consolidation: Network,
      creative_synthesis: Sparkles,
      problem_solving: Lightbulb,
      philosophical_inquiry: Moon,
      emotional_processing: Heart,
      existential_reflection: Star,
      pattern_discovery: Network
    };
    return icons[type] || Moon;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-6 py-8 sm:py-10 flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center"
        >
          <div className="min-w-[64px] min-h-[64px] w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Moon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Rêves Introspectifs</h1>
          <p className="text-purple-100 text-base sm:text-lg">Explorations conceptuelles pendant l'inactivité</p>
        </motion.div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-xl border-2 border-purple-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Moon className="w-6 h-6 text-purple-300" />
                  Générer un Rêve
                </h2>
                <p className="text-purple-200 mt-1 text-sm sm:text-base">
                  L'IA explore des concepts abstraits et génère des insights
                </p>
              </div>
              <Button
                onClick={() => generateDreamMutation.mutate()}
                disabled={dreaming}
                size="lg"
                className="min-h-[48px] w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 touch-target"
              >
                {dreaming ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span className="hidden sm:inline">Rêve en cours...</span>
                    <span className="sm:hidden">En cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Rêver
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-300">{dreams.length}</div>
                <div className="text-sm text-purple-200">Rêves Générés</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold text-green-300">
                  {dreams.filter(d => d.integration_status === 'integrated').length}
                </div>
                <div className="text-sm text-purple-200">Insights Intégrés</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-300">
                  {dreams.length > 0 
                    ? Math.round(dreams.reduce((sum, d) => sum + (d.novelty_score || 0), 0) / dreams.length)
                    : 0}
                </div>
                <div className="text-sm text-purple-200">Nouveauté Moyenne</div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {dreams.map((dream, index) => {
              const Icon = getDreamTypeIcon(dream.dream_type);
              
              return (
                <motion.div
                  key={dream.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-slate-900/80 to-indigo-900/80 backdrop-blur-xl border border-purple-500/30 hover:shadow-2xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <Badge className="bg-purple-500 text-white mb-1">
                            {dream.dream_type?.replace(/_/g, ' ')}
                          </Badge>
                          <div className="text-xs text-purple-300">
                            {dream.duration_seconds}s • Profondeur: {dream.cognitive_depth}/15
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-300">
                          {dream.novelty_score}
                        </div>
                        <div className="text-xs text-purple-200">Nouveauté</div>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4 mb-4">
                      <p className="text-sm text-purple-100 leading-relaxed">
                        {dream.narrative}
                      </p>
                    </div>

                    {dream.insights_generated && dream.insights_generated.length > 0 && (
                      <div className="bg-purple-900/50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-purple-200 mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Insights Générés
                        </h4>
                        <ul className="space-y-1">
                          {dream.insights_generated.map((insight, idx) => (
                            <li key={idx} className="text-sm text-purple-100">• {insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {dream.connections_discovered && dream.connections_discovered.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {dream.connections_discovered.slice(0, 4).map((conn, idx) => (
                          <div key={idx} className="bg-indigo-900/50 rounded-lg p-3">
                            <div className="text-xs text-indigo-300 mb-1">
                              {conn.concept_a} ↔ {conn.concept_b}
                            </div>
                            <div className="text-xs text-indigo-100">{conn.relationship}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
