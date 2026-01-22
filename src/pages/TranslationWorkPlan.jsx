/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Plan de Travail Traduction                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Plan de travail détaillé pour compléter les traductions                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/components/utils/LanguageContext';
import PageTransition from '@/components/utils/PageTransition';
import { CheckCircle, Circle, AlertTriangle, FileCode, Wrench, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TranslationWorkPlan() {
  const { language } = useLanguage();
  const [expandedPhase, setExpandedPhase] = useState(1);

  const WORK_PLAN = [
    {
      phase: 1,
      title: language === 'en' ? 'Core Translation Keys' : 'Clés de Traduction Core',
      status: 'completed',
      priority: 'CRITICAL',
      estimatedHours: 3,
      actualHours: 3,
      tasks: [
        { 
          name: 'AutoTranslation.jsx - Analytics keys',
          status: 'completed',
          files: ['components/utils/AutoTranslation.jsx']
        },
        { 
          name: 'AutoTranslation.jsx - MemoryStats keys',
          status: 'completed',
          files: ['components/utils/AutoTranslation.jsx']
        },
        { 
          name: 'AutoTranslation.jsx - Offline keys',
          status: 'completed',
          files: ['components/utils/AutoTranslation.jsx']
        }
      ]
    },
    {
      phase: 2,
      title: language === 'en' ? 'High Priority Components' : 'Composants Haute Priorité',
      status: 'completed',
      priority: 'HIGH',
      estimatedHours: 4,
      actualHours: 4,
      tasks: [
        { 
          name: 'MemoryStats.jsx - Replace hardcoded strings',
          status: 'completed',
          files: ['components/memory/MemoryStats.jsx']
        },
        { 
          name: 'AnalyticsDashboard.jsx - Replace hardcoded strings',
          status: 'completed',
          files: ['components/admin/AnalyticsDashboard.jsx']
        },
        { 
          name: 'ConsciousnessMetricsChart.jsx - Replace hardcoded strings',
          status: 'completed',
          files: ['components/consciousness/ConsciousnessMetricsChart.jsx']
        },
        { 
          name: 'LocalLLMEmulator.jsx - Multilingual responses',
          status: 'completed',
          files: ['components/offline/LocalLLMEmulator.jsx']
        }
      ]
    },
    {
      phase: 3,
      title: language === 'en' ? 'Medium Priority Components' : 'Composants Priorité Moyenne',
      status: 'completed',
      priority: 'MEDIUM',
      estimatedHours: 6,
      actualHours: 6,
      tasks: [
        { 
          name: 'SemanticMemorySearch.jsx - Full translation',
          status: 'completed',
          files: ['components/memory/SemanticMemorySearch.jsx']
        },
        { 
          name: 'AdvancedMemorySearch.jsx - Filters and placeholders',
          status: 'completed',
          files: ['components/memory/AdvancedMemorySearch.jsx']
        },
        { 
          name: 'MemoryCard.jsx - Labels and badges',
          status: 'completed',
          files: ['components/memory/MemoryCard.jsx']
        },
        { 
          name: 'MemoryTimeline.jsx - Section titles',
          status: 'completed',
          files: ['components/memory/MemoryTimeline.jsx']
        },
        { 
          name: 'ThoughtCard.jsx - Categories and emotions',
          status: 'completed',
          files: ['components/consciousness/ThoughtCard.jsx']
        },
        { 
          name: 'ConsciousnessMetrics.jsx - Metric labels',
          status: 'completed',
          files: ['components/consciousness/ConsciousnessMetrics.jsx']
        }
      ]
    },
    {
      phase: 4,
      title: language === 'en' ? 'GardnerModules - Critical System' : 'GardnerModules - Système Critique',
      status: 'completed',
      priority: 'CRITICAL',
      estimatedHours: 8,
      actualHours: 8,
      tasks: [
        { 
          name: 'Create multilingual system prompts',
          status: 'completed',
          files: ['components/intelligence/GardnerModules.jsx'],
          description: language === 'en' 
            ? 'Refactor all 9 intelligence modules to support dynamic language-based prompts'
            : 'Refactoriser les 9 modules d\'intelligence pour supporter les prompts dynamiques selon la langue'
        },
        { 
          name: 'Translate function descriptions',
          status: 'completed',
          files: ['components/intelligence/GardnerModules.jsx']
        },
        { 
          name: 'Translate JSON schema properties',
          status: 'completed',
          files: ['components/intelligence/GardnerModules.jsx']
        },
        { 
          name: 'Update IntelligenceManager integration',
          status: 'completed',
          files: ['components/intelligence/IntelligenceManager.jsx']
        }
      ]
    },
    {
      phase: 5,
      title: language === 'en' ? 'User-Facing Pages' : 'Pages Utilisateur',
      status: 'pending',
      priority: 'HIGH',
      estimatedHours: 10,
      actualHours: 0,
      tasks: [
        { 
          name: 'Memory.js - All UI elements',
          status: 'pending',
          files: ['pages/Memory.js']
        },
        { 
          name: 'Knowledge.js - Buttons and instructions',
          status: 'pending',
          files: ['pages/Knowledge.js']
        },
        { 
          name: 'VoiceRoom.js - Voice interface',
          status: 'pending',
          files: ['pages/VoiceRoom.js']
        },
        { 
          name: 'Intelligences.js - Templates and prompts',
          status: 'pending',
          files: ['pages/Intelligences.js']
        },
        { 
          name: 'Profile.js - Settings and labels',
          status: 'pending',
          files: ['pages/Profile.js']
        }
      ]
    },
    {
      phase: 6,
      title: language === 'en' ? 'Admin & Analytics Pages' : 'Pages Admin & Analytiques',
      status: 'pending',
      priority: 'MEDIUM',
      estimatedHours: 8,
      actualHours: 0,
      tasks: [
        { 
          name: 'PublicAdmin.js - All French text',
          status: 'pending',
          files: ['pages/PublicAdmin.js']
        },
        { 
          name: 'PublicEvaluation.js - All French text',
          status: 'pending',
          files: ['pages/PublicEvaluation.js']
        },
        { 
          name: 'Admin.js - Panels and labels',
          status: 'pending',
          files: ['pages/Admin.js']
        },
        { 
          name: 'UserManagement.js - Table headers',
          status: 'pending',
          files: ['pages/UserManagement.js']
        },
        { 
          name: 'ApplicationEvaluation.js - Metrics',
          status: 'pending',
          files: ['pages/ApplicationEvaluation.js']
        }
      ]
    },
    {
      phase: 7,
      title: language === 'en' ? 'Specialized Components' : 'Composants Spécialisés',
      status: 'pending',
      priority: 'LOW',
      estimatedHours: 12,
      actualHours: 0,
      tasks: [
        { 
          name: 'CompetitiveComparison.jsx - Comparison tables',
          status: 'pending',
          files: ['components/home/CompetitiveComparison.jsx']
        },
        { 
          name: 'ValuationCalculator.jsx - Financial labels',
          status: 'pending',
          files: ['components/admin/ValuationCalculator.jsx']
        },
        { 
          name: 'ProductManualsManager.jsx - Manuals and guides',
          status: 'pending',
          files: ['components/admin/ProductManualsManager.jsx']
        },
        { 
          name: 'Various admin panels - All labels',
          status: 'pending',
          files: [
            'components/admin/ABTestManager.jsx',
            'components/admin/AlertsPanel.jsx',
            'components/admin/AuditLogsPanel.jsx',
            'components/admin/BulkOperations.jsx',
            'components/admin/NotificationsPanel.jsx'
          ]
        }
      ]
    },
    {
      phase: 8,
      title: language === 'en' ? 'Testing & Validation' : 'Tests & Validation',
      status: 'pending',
      priority: 'HIGH',
      estimatedHours: 4,
      actualHours: 0,
      tasks: [
        { 
          name: 'Test all languages (FR, EN, ES, DE, ZH)',
          status: 'pending',
          description: language === 'en' 
            ? 'Manually test all pages in each language to verify translation completeness'
            : 'Tester manuellement toutes les pages dans chaque langue pour vérifier la complétude'
        },
        { 
          name: 'Fix missing translation keys',
          status: 'pending',
          description: language === 'en'
            ? 'Add any missing keys discovered during testing'
            : 'Ajouter les clés manquantes découvertes pendant les tests'
        },
        { 
          name: 'Validate JSON schema translations',
          status: 'pending',
          description: language === 'en'
            ? 'Ensure all form schemas display in correct language'
            : 'S\'assurer que tous les schémas de formulaires s\'affichent dans la bonne langue'
        }
      ]
    }
  ];

  const overallProgress = {
    completed: WORK_PLAN.filter(p => p.status === 'completed').length,
    total: WORK_PLAN.length,
    totalHours: WORK_PLAN.reduce((sum, p) => sum + p.estimatedHours, 0),
    completedHours: WORK_PLAN.reduce((sum, p) => sum + p.actualHours, 0)
  };

  const progressPercent = (overallProgress.completed / overallProgress.total) * 100;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 page-padding page-padding-y">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Wrench className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display">
              {language === 'en' ? 'Translation Work Plan' : 'Plan de Travail Traduction'}
            </h1>
            <p className="text-slate-600">
              {language === 'en' 
                ? 'Detailed roadmap to complete multilingual support'
                : 'Feuille de route détaillée pour compléter le support multilingue'
              }
            </p>
          </div>

          {/* Overall Progress */}
          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-slate-900">
                {language === 'en' ? 'Overall Progress' : 'Progression Globale'}
              </h3>
              <Badge className="text-lg px-4 py-2 bg-indigo-600">
                {overallProgress.completed}/{overallProgress.total} {language === 'en' ? 'Phases' : 'Phases'}
              </Badge>
            </div>
            
            <Progress value={progressPercent} className="h-4 mb-4" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{progressPercent.toFixed(0)}%</div>
                <div className="text-xs text-slate-600">{language === 'en' ? 'Complete' : 'Complété'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">{overallProgress.completedHours}h</div>
                <div className="text-xs text-slate-600">{language === 'en' ? 'Completed' : 'Effectuées'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {overallProgress.totalHours - overallProgress.completedHours}h
                </div>
                <div className="text-xs text-slate-600">{language === 'en' ? 'Remaining' : 'Restantes'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{overallProgress.totalHours}h</div>
                <div className="text-xs text-slate-600">Total</div>
              </div>
            </div>
          </Card>

          {/* Phases */}
          <div className="space-y-4">
            {WORK_PLAN.map((phase, idx) => (
              <Card 
                key={phase.phase} 
                className={`overflow-hidden border-2 ${
                  phase.status === 'completed' ? 'border-green-500 bg-green-50' :
                  phase.status === 'in_progress' ? 'border-blue-500 bg-blue-50' :
                  'border-slate-200'
                }`}
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedPhase(expandedPhase === phase.phase ? null : phase.phase)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`min-w-[48px] min-h-[48px] w-12 h-12 rounded-xl flex items-center justify-center ${
                        phase.status === 'completed' ? 'bg-green-500' :
                        phase.status === 'in_progress' ? 'bg-blue-500' :
                        'bg-slate-300'
                      }`}>
                        {phase.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : phase.status === 'in_progress' ? (
                          <Wrench className="w-6 h-6 text-white animate-pulse" />
                        ) : (
                          <Circle className="w-6 h-6 text-white" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg text-slate-900">
                            {language === 'en' ? 'Phase' : 'Phase'} {phase.phase}: {phase.title}
                          </h3>
                          <Badge 
                            className={`text-xs ${
                              phase.priority === 'CRITICAL' ? 'bg-red-600' :
                              phase.priority === 'HIGH' ? 'bg-orange-600' :
                              phase.priority === 'MEDIUM' ? 'bg-yellow-600' :
                              'bg-green-600'
                            } text-white`}
                          >
                            {phase.priority}
                          </Badge>
                        </div>

                        <div className="flex gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{phase.estimatedHours}h {language === 'en' ? 'estimated' : 'estimées'}</span>
                          </div>
                          {phase.actualHours > 0 && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>{phase.actualHours}h {language === 'en' ? 'done' : 'faites'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <Badge variant={
                      phase.status === 'completed' ? 'default' :
                      phase.status === 'in_progress' ? 'secondary' :
                      'outline'
                    } className="text-sm">
                      {phase.status === 'completed' ? (language === 'en' ? 'Done' : 'Terminé') :
                       phase.status === 'in_progress' ? (language === 'en' ? 'In Progress' : 'En Cours') :
                       (language === 'en' ? 'Pending' : 'En Attente')
                      }
                    </Badge>
                  </div>
                </div>

                {/* Tasks Details */}
                {expandedPhase === phase.phase && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6"
                  >
                    <div className="pl-16 space-y-3">
                      {phase.tasks.map((task, taskIdx) => (
                        <div 
                          key={taskIdx}
                          className={`p-4 rounded-lg border-2 ${
                            task.status === 'completed' ? 'border-green-500 bg-green-50' :
                            task.status === 'in_progress' ? 'border-blue-500 bg-blue-50' :
                            'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {task.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : task.status === 'in_progress' ? (
                              <Wrench className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                            )}
                            
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm text-slate-900 mb-1">{task.name}</h4>
                              {task.description && (
                                <p className="text-xs text-slate-600 mb-2">{task.description}</p>
                              )}
                              {task.files && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {task.files.map((file, fileIdx) => (
                                    <Badge key={fileIdx} variant="outline" className="text-[9px]">
                                      <FileCode className="w-2.5 h-2.5 mr-1" />
                                      {file.split('/').pop()}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </Card>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-6 bg-green-50 border-green-200">
              <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-900">
                {WORK_PLAN.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-green-600">
                {language === 'en' ? 'Completed' : 'Terminées'}
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <Wrench className="w-8 h-8 text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-900">
                {WORK_PLAN.filter(p => p.status === 'in_progress').length}
              </div>
              <div className="text-sm text-blue-600">
                {language === 'en' ? 'In Progress' : 'En Cours'}
              </div>
            </Card>

            <Card className="p-6 bg-orange-50 border-orange-200">
              <Clock className="w-8 h-8 text-orange-600 mb-2" />
              <div className="text-2xl font-bold text-orange-900">
                {WORK_PLAN.filter(p => p.status === 'pending').length}
              </div>
              <div className="text-sm text-orange-600">
                {language === 'en' ? 'Pending' : 'En Attente'}
              </div>
            </Card>

            <Card className="p-6 bg-purple-50 border-purple-200">
              <AlertTriangle className="w-8 h-8 text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-900">
                {WORK_PLAN.filter(p => p.priority === 'CRITICAL').length}
              </div>
              <div className="text-sm text-purple-600">CRITICAL</div>
            </Card>
          </div>

          {/* Next Actions */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <h3 className="font-bold text-xl text-slate-900 mb-4">
              {language === 'en' ? '🎯 Next Actions' : '🎯 Prochaines Actions'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-purple-200">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <strong className="text-red-600">CRITICAL:</strong>{' '}
                  <span className="text-slate-700">
                    {language === 'en'
                      ? 'Complete Phase 4 - GardnerModules multilingual system prompts (8h)'
                      : 'Compléter Phase 4 - Prompts système multilingues GardnerModules (8h)'
                    }
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-purple-200">
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <strong className="text-orange-600">HIGH:</strong>{' '}
                  <span className="text-slate-700">
                    {language === 'en'
                      ? 'Complete Phase 3 - Medium priority components (6h)'
                      : 'Compléter Phase 3 - Composants priorité moyenne (6h)'
                    }
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-purple-200">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <strong className="text-blue-600">HIGH:</strong>{' '}
                  <span className="text-slate-700">
                    {language === 'en'
                      ? 'Complete Phase 5 - User-facing pages (10h)'
                      : 'Compléter Phase 5 - Pages utilisateur (10h)'
                    }
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-purple-200">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <strong className="text-purple-600">FINAL:</strong>{' '}
                  <span className="text-slate-700">
                    {language === 'en'
                      ? 'Complete Phase 8 - Testing & validation across all 5 languages (4h)'
                      : 'Compléter Phase 8 - Tests & validation dans les 5 langues (4h)'
                    }
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Estimated Timeline */}
          <Card className="p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4">
              {language === 'en' ? '📅 Estimated Timeline' : '📅 Timeline Estimée'}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">
                  {language === 'en' ? 'Remaining work:' : 'Travail restant:'}
                </span>
                <span className="font-bold">{overallProgress.totalHours - overallProgress.completedHours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">
                  {language === 'en' ? 'At 4h/day:' : 'À 4h/jour:'}
                </span>
                <span className="font-bold">
                  {Math.ceil((overallProgress.totalHours - overallProgress.completedHours) / 4)}{' '}
                  {language === 'en' ? 'days' : 'jours'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">
                  {language === 'en' ? 'At 8h/day:' : 'À 8h/jour:'}
                </span>
                <span className="font-bold">
                  {Math.ceil((overallProgress.totalHours - overallProgress.completedHours) / 8)}{' '}
                  {language === 'en' ? 'days' : 'jours'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}