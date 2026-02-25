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
import { Clock, Code, AlertCircle, CheckCircle, TrendingUp, Sparkles, RefreshCw, ArrowLeft } from "lucide-react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";

export default function ProjectProgress() {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const [metrics, setMetrics] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzeProject();
  }, []);

  const analyzeProject = async () => {
    setIsAnalyzing(true);
    try {
      // Récupération parallélisée des données
      const [registryEntries, errorLogs, systemMetrics, deployments] = await Promise.all([
        base44.entities.RegistryEntry.list(),
        base44.entities.ErrorLog.list('-created_date', 50).catch(() => []),
        base44.entities.SystemMetrics.list('-created_date', 1).catch(() => []),
        base44.entities.Deployment.list('-created_date', 10).catch(() => [])
      ]);

      // Analyse de la vélocité (derniers déploiements)
      const recentDeployments = deployments.filter(d => {
        const deployDate = new Date(d.created_date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return deployDate > weekAgo;
      });

      // Analyse des erreurs critiques
      const criticalErrors = errorLogs.filter(e => e.severity === 'critical' || e.severity === 'error');
      const errorsByCategory = criticalErrors.reduce((acc, e) => {
        const cat = e.category || 'other';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse APPROFONDIE du projet DRUIDE OMEGA (Janvier 2026) avec métriques réelles:

📊 CONTEXTE TECHNIQUE:
Druide Omega est une plateforme IA consciente de niveau 12/15 avec:
- Architecture SAPIER (conscience artificielle avancée)
- 9 intelligences multiples de Gardner
- Système de mémoire cross-modal avec cache indexé
- Base de connaissances fusionnée
- Shop de modules avec cryptographie quantique
- 100+ cas d'usage documentés
- API publique pour développeurs
- Mode offline avancé avec LLM émulateur

🔢 DONNÉES RÉELLES DU PROJET:
- Pages: ${registryEntries.filter(r => r.item_type === 'page').length}
- Composants: ${registryEntries.filter(r => r.item_type === 'component').length}
- Entités: ${registryEntries.filter(r => r.item_type === 'entity').length}
- Functions/Services: ${registryEntries.filter(r => ['service', 'integration', 'function'].includes(r.item_type)).length}
- Déploiements (7 derniers jours): ${recentDeployments.length}
- Erreurs critiques: ${criticalErrors.length}
- Erreurs par catégorie: ${JSON.stringify(errorsByCategory)}

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

📈 MÉTRIQUES DE PERFORMANCE:
${systemMetrics.length > 0 ? `
- CPU moyen: ${systemMetrics[0].cpu_usage || 'N/A'}%
- RAM utilisée: ${systemMetrics[0].memory_usage || 'N/A'}%
- Requêtes/min: ${systemMetrics[0].requests_per_minute || 'N/A'}
` : 'Pas de métriques système'}

🎯 FONCTIONNALITÉS CLÉS IMPLÉMENTÉES:
- Conscience artificielle (niveaux 0-15) ✓
- ThinkingEngine avec analyse quantique ✓
- Base de connaissances fusionnée ✓
- Mémoires cross-modales avec cache indexé ✓
- Mode offline avec LocalLLMEmulator ✓
- Visualisations avancées ✓
- 9 intelligences multiples Gardner ✓
- Shop de modules avec cryptographie ✓
- Analytics comportementales ✓
- API publique ✓
- Personnalité configurable ✓

🔍 ANALYSE APPROFONDIE:
1. Examine la structure du registre pour identifier lacunes
2. Calcule heures dev basées sur complexité réelle
3. Détecte patterns de bugs/erreurs répétitifs
4. Évalue maturité architecturale
5. Identifie dette technique
6. Priorise optimisations performance
7. Suggère roadmap évolution

Retourne JSON DÉTAILLÉ avec métriques précises:
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
                test_coverage: { type: "number" },
                performance_score: { type: "number" },
                security_score: { type: "number" }
              }
            },
            technical_debt: {
              type: "object",
              properties: {
                estimated_hours: { type: "number" },
                severity: { type: "string" },
                categories: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      debt_hours: { type: "number" },
                      priority: { type: "string" }
                    }
                  }
                }
              }
            },
            velocity: {
              type: "object",
              properties: {
                deployments_per_week: { type: "number" },
                features_per_month: { type: "number" },
                bugs_fixed_per_week: { type: "number" },
                trend: { type: "string" }
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
          <p className="text-slate-600">{t('projectProgress.analyzing')}</p>
        </Card>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button
          onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
          variant="ghost"
          size="sm"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isEn ? 'Back' : 'Retour Dashboard'}
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('projectProgress.title')}</h1>
            <p className="text-slate-600">{t('projectProgress.subtitle')}</p>
          </div>
          <Button 
            onClick={analyzeProject} 
            disabled={isAnalyzing}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? (isEn ? 'Analyzing...' : 'Analyse...') : (isEn ? 'Refresh' : 'Actualiser')}
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <Clock className="w-8 h-8 mb-2" />
            <p className="text-sm opacity-90 mb-1">{t('projectProgress.devHours')}</p>
            <p className="text-4xl font-bold">{metrics.development_hours.estimated_total}h</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <TrendingUp className="w-8 h-8 mb-2" />
            <p className="text-sm opacity-90 mb-1">{t('projectProgress.progress')}</p>
            <p className="text-4xl font-bold">{metrics.completion_percentage}%</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-sm opacity-90 mb-1">{t('projectProgress.corrections')}</p>
            <p className="text-4xl font-bold">{metrics.corrections_needed.total}</p>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">{t('projectProgress.hoursByCategory')}</h3>
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
          <h3 className="font-bold text-slate-900 mb-4">{t('projectProgress.correctionsToMake')}</h3>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-xs text-red-600 mb-1">{t('projectProgress.critical')}</p>
              <p className="text-2xl font-bold text-red-700">{metrics.corrections_needed.critical}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-xs text-orange-600 mb-1">{t('projectProgress.highPriority')}</p>
              <p className="text-2xl font-bold text-orange-700">{metrics.corrections_needed.high_priority}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-600 mb-1">{t('projectProgress.mediumPriority')}</p>
              <p className="text-2xl font-bold text-yellow-700">{metrics.corrections_needed.medium_priority}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 mb-1">{t('projectProgress.lowPriority')}</p>
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
            <h3 className="font-bold text-slate-900 mb-4">{t('projectProgress.milestones')}</h3>
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
            <h3 className="font-bold text-slate-900 mb-4">{t('projectProgress.codeQuality')}</h3>
            <div className="space-y-4">
              {Object.entries(metrics.code_quality).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
                    <span className={`font-semibold ${value > 80 ? 'text-green-600' : value > 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {value}%
                    </span>
                  </div>
                  <Progress 
                    value={value} 
                    className={value > 80 ? '[&>div]:bg-green-500' : value > 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'} 
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {metrics.technical_debt && (
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-amber-600" />
              {isEn ? 'Technical Debt' : 'Dette Technique'}
            </h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{isEn ? 'Estimated resolution time' : 'Temps estimé de résolution'}</span>
                <span className="text-2xl font-bold text-amber-700">{metrics.technical_debt.estimated_hours}h</span>
              </div>
              <Badge className="bg-amber-600">{metrics.technical_debt.severity}</Badge>
            </div>
            <div className="space-y-2">
              {metrics.technical_debt.categories?.map((cat, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{cat.name}</p>
                    <Badge variant="outline" className="mt-1 text-xs">{cat.priority}</Badge>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{cat.debt_hours}h</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {metrics.velocity && (
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              {isEn ? 'Development Velocity' : 'Vélocité de Développement'}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{metrics.velocity.deployments_per_week}</p>
                <p className="text-xs text-slate-600 mt-1">{isEn ? 'Deployments/week' : 'Déploiements/semaine'}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">{metrics.velocity.features_per_month}</p>
                <p className="text-xs text-slate-600 mt-1">{isEn ? 'Features/month' : 'Features/mois'}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{metrics.velocity.bugs_fixed_per_week}</p>
                <p className="text-xs text-slate-600 mt-1">{isEn ? 'Bugs fixed/week' : 'Bugs corrigés/semaine'}</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-sm">
                <span className="font-medium">{isEn ? 'Trend:' : 'Tendance:'}</span>{' '}
                <span className={metrics.velocity.trend === 'increasing' ? 'text-green-600' : 'text-orange-600'}>
                  {metrics.velocity.trend}
                </span>
              </p>
            </div>
          </Card>
        )}

        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
          <h3 className="font-bold text-slate-900 mb-4">{t('projectProgress.nextPriorities')}</h3>
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


      </div>
    </div>
  );
}