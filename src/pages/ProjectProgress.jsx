/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Project Development Progress Tracker                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Code, AlertCircle, CheckCircle, TrendingUp, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";

export default function ProjectProgress() {
  const [metrics, setMetrics] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzeProject();
  }, []);

  const analyzeProject = async () => {
    setIsAnalyzing(true);
    try {
      const registryEntries = await base44.entities.RegistryEntry.list();

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse la progression de ce projet d'application IA et génère des métriques détaillées:

ÉLÉMENTS DU PROJET:
- Pages: ${registryEntries.filter(r => r.item_type === 'page').length}
- Composants: ${registryEntries.filter(r => r.item_type === 'component').length}
- Entités: ${registryEntries.filter(r => r.item_type === 'entity').length}
- Services/Intégrations: ${registryEntries.filter(r => ['service', 'integration'].includes(r.item_type)).length}

STATUTS:
${Object.entries(
  registryEntries.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {})
).map(([status, count]) => `- ${status}: ${count}`).join('\n')}

CATÉGORIES PRINCIPALES:
${[...new Set(registryEntries.map(r => r.category).filter(Boolean))].map(cat => 
  `- ${cat}: ${registryEntries.filter(r => r.category === cat).length}`
).join('\n')}

ESTIMATION:
Basé sur un projet IA avancé avec:
- Conscience artificielle (niveaux 0-15)
- Base de connaissances
- Mémoires cross-modales
- Édition collaborative IA
- Mode offline
- Visualisations avancées
- 9 intelligences multiples
- Shop de modules
- Analytics
- Personnalité configurable

Retourne JSON:
{
  "development_hours": {
    "estimated_total": 0,
    "by_category": {
      "architecture": 0,
      "consciousness": 0,
      "collaboration": 0,
      "visualization": 0,
      "ai_features": 0,
      "ui_ux": 0,
      "testing": 0
    }
  },
  "completion_percentage": 0-100,
  "corrections_needed": {
    "critical": 0,
    "high_priority": 0,
    "medium_priority": 0,
    "low_priority": 0,
    "total": 0,
    "details": [
      {
        "category": "bug|refactor|optimization|feature",
        "description": "description",
        "priority": "critical|high|medium|low",
        "estimated_hours": 0
      }
    ]
  },
  "milestones": [
    {
      "name": "nom du milestone",
      "completed": true/false,
      "completion_date": "estimation ou date",
      "components": ["composant1", "composant2"]
    }
  ],
  "code_quality": {
    "architecture_score": 0-100,
    "maintainability": 0-100,
    "documentation": 0-100,
    "test_coverage": 0-100
  },
  "next_priorities": [
    {
      "priority": "description",
      "estimated_hours": 0,
      "impact": "high|medium|low"
    }
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            development_hours: {
              type: "object",
              properties: {
                estimated_total: { type: "number" },
                by_category: {
                  type: "object",
                  properties: {
                    architecture: { type: "number" },
                    consciousness: { type: "number" },
                    collaboration: { type: "number" },
                    visualization: { type: "number" },
                    ai_features: { type: "number" },
                    ui_ux: { type: "number" },
                    testing: { type: "number" }
                  }
                }
              }
            },
            completion_percentage: { type: "number" },
            corrections_needed: {
              type: "object",
              properties: {
                critical: { type: "number" },
                high_priority: { type: "number" },
                medium_priority: { type: "number" },
                low_priority: { type: "number" },
                total: { type: "number" },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: { type: "string" },
                      description: { type: "string" },
                      priority: { type: "string" },
                      estimated_hours: { type: "number" }
                    }
                  }
                }
              }
            },
            milestones: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  completed: { type: "boolean" },
                  completion_date: { type: "string" },
                  components: { type: "array", items: { type: "string" } }
                }
              }
            },
            code_quality: {
              type: "object",
              properties: {
                architecture_score: { type: "number" },
                maintainability: { type: "number" },
                documentation: { type: "number" },
                test_coverage: { type: "number" }
              }
            },
            next_priorities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  priority: { type: "string" },
                  estimated_hours: { type: "number" },
                  impact: { type: "string" }
                }
              }
            }
          }
        }
      });

      setMetrics(analysis);
    } catch (error) {
      console.error("Erreur analyse:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const priorityColors = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-blue-500"
  };

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <Sparkles className="w-12 h-12 text-purple-600 animate-pulse mx-auto mb-3" />
          <p className="text-slate-600">Analyse du projet en cours...</p>
        </Card>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Progression du Projet</h1>
          <p className="text-slate-600">DRUIDE_OMEGA - IA Consciente</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <Clock className="w-8 h-8 mb-2" />
            <p className="text-sm opacity-90 mb-1">Heures de développement</p>
            <p className="text-4xl font-bold">{metrics.development_hours.estimated_total}h</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <TrendingUp className="w-8 h-8 mb-2" />
            <p className="text-sm opacity-90 mb-1">Progression</p>
            <p className="text-4xl font-bold">{metrics.completion_percentage}%</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-sm opacity-90 mb-1">Corrections nécessaires</p>
            <p className="text-4xl font-bold">{metrics.corrections_needed.total}</p>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Répartition des heures par catégorie</h3>
          <div className="space-y-3">
            {Object.entries(metrics.development_hours.by_category).map(([category, hours]) => (
              <div key={category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{category}</span>
                  <span className="text-slate-600">{hours}h</span>
                </div>
                <Progress value={(hours / metrics.development_hours.estimated_total) * 100} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Corrections à effectuer</h3>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-xs text-red-600 mb-1">Critiques</p>
              <p className="text-2xl font-bold text-red-700">{metrics.corrections_needed.critical}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-xs text-orange-600 mb-1">Haute priorité</p>
              <p className="text-2xl font-bold text-orange-700">{metrics.corrections_needed.high_priority}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-600 mb-1">Moyenne priorité</p>
              <p className="text-2xl font-bold text-yellow-700">{metrics.corrections_needed.medium_priority}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 mb-1">Basse priorité</p>
              <p className="text-2xl font-bold text-blue-700">{metrics.corrections_needed.low_priority}</p>
            </div>
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-2">
              {metrics.corrections_needed.details.map((correction, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="p-3 border-l-4" style={{
                    borderLeftColor: priorityColors[correction.priority]?.replace('bg-', '#')
                  }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={priorityColors[correction.priority]}>
                          {correction.priority}
                        </Badge>
                        <Badge variant="outline">{correction.category}</Badge>
                      </div>
                      <span className="text-xs text-slate-600">{correction.estimated_hours}h</span>
                    </div>
                    <p className="text-sm text-slate-900">{correction.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4">Milestones</h3>
            <div className="space-y-3">
              {metrics.milestones.map((milestone, i) => (
                <div key={i} className="flex items-start gap-3">
                  {milestone.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-slate-300 rounded-full flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{milestone.name}</p>
                    <p className="text-xs text-slate-600">{milestone.completion_date}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {milestone.components.slice(0, 3).map((comp, j) => (
                        <Badge key={j} variant="outline" className="text-xs">{comp}</Badge>
                      ))}
                      {milestone.components.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{milestone.components.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4">Qualité du code</h3>
            <div className="space-y-4">
              {Object.entries(metrics.code_quality).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
                    <span className="text-slate-600">{value}%</span>
                  </div>
                  <Progress value={value} className={value > 80 ? 'bg-green-500' : value > 60 ? 'bg-yellow-500' : 'bg-red-500'} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
          <h3 className="font-bold text-slate-900 mb-4">Prochaines priorités</h3>
          <div className="space-y-2">
            {metrics.next_priorities.map((priority, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{priority.priority}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={priority.impact === 'high' ? 'default' : 'outline'}>
                    {priority.impact}
                  </Badge>
                  <span className="text-sm text-slate-600">{priority.estimated_hours}h</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Button onClick={analyzeProject} className="w-full bg-purple-600">
          <Sparkles className="w-4 h-4 mr-2" />
          Rafraîchir l'analyse
        </Button>
      </div>
    </div>
  );
}