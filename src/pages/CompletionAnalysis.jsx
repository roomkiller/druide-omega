/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Analyse de Complétion à 100%                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Code,
  Smartphone,
  FileText,
  Zap,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { createPageUrl } from "@/utils";

export default function CompletionAnalysis() {
  const { language } = useLanguage();
  const [expandedCategory, setExpandedCategory] = useState(null);

  const completionData = {
    overall: {
      total_features: 158,
      completed: 143,
      in_progress: 8,
      planned: 7,
      percentage: 91
    },
    categories: [
      {
        id: "mobile",
        name: language === 'en' ? "Mobile Optimization" : "Optimisation Mobile",
        icon: Smartphone,
        color: "from-blue-500 to-indigo-600",
        priority: "high",
        progress: 85,
        total_tasks: 54,
        completed_tasks: 46,
        estimated_hours: 25,
        tasks: [
          {
            title: language === 'en' ? "Touch Target Optimization (44x44px WCAG)" : "Optimisation zones tactiles (44x44px WCAG)",
            status: "in-progress",
            priority: "critical",
            hours: 12
          },
          {
            title: language === 'en' ? "Pull-to-refresh on lists" : "Pull-to-refresh sur les listes",
            status: "todo",
            priority: "high",
            hours: 8
          },
          {
            title: language === 'en' ? "Swipe gestures (back, actions)" : "Gestes swipe (retour, actions)",
            status: "todo",
            priority: "high",
            hours: 16
          },
          {
            title: language === 'en' ? "Visual Regression Testing (iPhone SE to 14 Pro)" : "Tests visuels (iPhone SE à 14 Pro)",
            status: "todo",
            priority: "critical",
            hours: 24
          },
          {
            title: language === 'en' ? "Lazy loading images with placeholders" : "Lazy loading images avec placeholders",
            status: "todo",
            priority: "high",
            hours: 8
          },
          {
            title: language === 'en' ? "Long list virtualization (react-window)" : "Virtualisation longues listes (react-window)",
            status: "todo",
            priority: "high",
            hours: 12
          }
        ]
      },
      {
        id: "visual",
        name: language === 'en' ? "Visual Alignment & Centering" : "Alignement & Centrage Visuel",
        icon: Target,
        color: "from-purple-500 to-pink-600",
        priority: "medium",
        progress: 92,
        total_tasks: 42,
        completed_tasks: 39,
        estimated_hours: 10,
        tasks: [
          {
            title: language === 'en' ? "Chat page - WelcomeScreen centering" : "Page Chat - Centrage WelcomeScreen",
            status: "todo",
            priority: "high",
            hours: 3
          },
          {
            title: language === 'en' ? "Consciousness page - cards alignment" : "Page Conscience - alignement cartes",
            status: "todo",
            priority: "medium",
            hours: 4
          },
          {
            title: language === 'en' ? "Memory page - grid responsive" : "Page Mémoire - grid responsive",
            status: "todo",
            priority: "medium",
            hours: 4
          },
          {
            title: language === 'en' ? "VoiceRoom - controls centering" : "Salle Vocale - centrage contrôles",
            status: "todo",
            priority: "medium",
            hours: 3
          },
          {
            title: language === 'en' ? "All dialogs - consistent padding" : "Tous dialogs - padding cohérent",
            status: "todo",
            priority: "low",
            hours: 6
          },
          {
            title: language === 'en' ? "Forms - label & button alignment" : "Formulaires - alignement labels & boutons",
            status: "in-progress",
            priority: "medium",
            hours: 8
          }
        ]
      },
      {
        id: "documentation",
        name: language === 'en' ? "Documentation" : "Documentation",
        icon: FileText,
        color: "from-green-500 to-emerald-600",
        priority: "medium",
        progress: 95,
        total_tasks: 28,
        completed_tasks: 27,
        estimated_hours: 8,
        tasks: [
          {
            title: language === 'en' ? "API Documentation - complete all endpoints" : "Documentation API - compléter tous les endpoints",
            status: "in-progress",
            priority: "high",
            hours: 8
          },
          {
            title: language === 'en' ? "Architecture diagrams" : "Diagrammes d'architecture",
            status: "todo",
            priority: "medium",
            hours: 6
          },
          {
            title: language === 'en' ? "Mobile best practices guide" : "Guide bonnes pratiques mobile",
            status: "todo",
            priority: "medium",
            hours: 6
          }
        ]
      },
      {
        id: "features",
        name: language === 'en' ? "Advanced Features" : "Fonctionnalités Avancées",
        icon: Zap,
        color: "from-orange-500 to-red-600",
        priority: "low",
        progress: 88,
        total_tasks: 22,
        completed_tasks: 19,
        estimated_hours: 20,
        tasks: [
          {
            title: language === 'en' ? "Push notifications (opt-in)" : "Push notifications (opt-in)",
            status: "todo",
            priority: "medium",
            hours: 16
          },
          {
            title: language === 'en' ? "Native Share API integration" : "Intégration Share API native",
            status: "todo",
            priority: "medium",
            hours: 8
          },
          {
            title: language === 'en' ? "Camera/photo upload optimization" : "Optimisation upload caméra/photos",
            status: "todo",
            priority: "medium",
            hours: 12
          },
          {
            title: language === 'en' ? "Voice input for textarea" : "Saisie vocale pour textarea",
            status: "todo",
            priority: "low",
            hours: 10
          },
          {
            title: language === 'en' ? "Auto dark mode" : "Mode sombre automatique",
            status: "todo",
            priority: "low",
            hours: 14
          }
        ]
      },
      {
        id: "performance",
        name: language === 'en' ? "Performance & Optimization" : "Performance & Optimisation",
        icon: TrendingUp,
        color: "from-cyan-500 to-blue-600",
        priority: "medium",
        progress: 80,
        total_tasks: 18,
        completed_tasks: 14,
        estimated_hours: 18,
        tasks: [
          {
            title: language === 'en' ? "Code splitting & bundle optimization" : "Code splitting & optimisation bundle",
            status: "in-progress",
            priority: "high",
            hours: 12
          },
          {
            title: language === 'en' ? "Service Worker for offline cache" : "Service Worker pour cache offline",
            status: "todo",
            priority: "high",
            hours: 16
          },
          {
            title: language === 'en' ? "Image compression (WebP, AVIF)" : "Compression images (WebP, AVIF)",
            status: "todo",
            priority: "medium",
            hours: 8
          }
        ]
      },
      {
        id: "testing",
        name: language === 'en' ? "Testing & QA" : "Tests & QA",
        icon: CheckCircle,
        color: "from-emerald-500 to-green-600",
        priority: "high",
        progress: 45,
        total_tasks: 32,
        completed_tasks: 14,
        estimated_hours: 40,
        tasks: [
          {
            title: language === 'en' ? "E2E tests (Playwright/Cypress)" : "Tests E2E (Playwright/Cypress)",
            status: "todo",
            priority: "critical",
            hours: 20
          },
          {
            title: language === 'en' ? "Unit tests - components coverage > 70%" : "Tests unitaires - couverture composants > 70%",
            status: "todo",
            priority: "high",
            hours: 24
          },
          {
            title: language === 'en' ? "Mobile screen reader testing" : "Test lecteur d'écran mobile",
            status: "todo",
            priority: "critical",
            hours: 6
          }
        ]
      }
    ],
    roadmap: {
      immediate: [
        {
          title: language === 'en' ? "Complete mobile touch targets" : "Finaliser zones tactiles mobile",
          priority: "critical",
          hours: 12,
          impact: "high"
        },
        {
          title: language === 'en' ? "Visual regression testing suite" : "Suite tests visuels régression",
          priority: "critical",
          hours: 24,
          impact: "high"
        },
        {
          title: language === 'en' ? "Chat page centering & alignment" : "Centrage & alignement page Chat",
          priority: "high",
          hours: 8,
          impact: "medium"
        }
      ],
      short_term: [
        {
          title: language === 'en' ? "Complete API documentation" : "Finaliser documentation API",
          priority: "high",
          hours: 8,
          impact: "medium"
        },
        {
          title: language === 'en' ? "Service Worker offline mode" : "Mode offline Service Worker",
          priority: "high",
          hours: 16,
          impact: "high"
        },
        {
          title: language === 'en' ? "E2E testing infrastructure" : "Infrastructure tests E2E",
          priority: "critical",
          hours: 20,
          impact: "high"
        }
      ],
      medium_term: [
        {
          title: language === 'en' ? "Push notifications system" : "Système push notifications",
          priority: "medium",
          hours: 16,
          impact: "medium"
        },
        {
          title: language === 'en' ? "Unit tests coverage > 70%" : "Couverture tests unitaires > 70%",
          priority: "high",
          hours: 24,
          impact: "high"
        },
        {
          title: language === 'en' ? "Auto dark mode" : "Mode sombre automatique",
          priority: "low",
          hours: 14,
          impact: "low"
        }
      ]
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-blue-600';
      default: return 'bg-slate-600';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'done':
        return <Badge className="bg-green-600 text-white">✓ {language === 'en' ? 'Done' : 'Fait'}</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-600 text-white animate-pulse">⟳ {language === 'en' ? 'In Progress' : 'En cours'}</Badge>;
      case 'todo':
        return <Badge className="bg-slate-400 text-white">○ {language === 'en' ? 'To Do' : 'À faire'}</Badge>;
      default:
        return null;
    }
  };

  const totalHours = completionData.categories.reduce((sum, cat) => sum + cat.estimated_hours, 0);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            variant="ghost"
            size="sm"
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour Dashboard
          </Button>
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">
                {language === 'en' ? 'Path to 100% Completion' : 'Chemin vers 100% de Complétion'}
              </h1>
              <p className="text-purple-100">
                {language === 'en' ? 'Complete roadmap and work analysis' : 'Analyse complète et feuille de route'}
              </p>
            </div>
          </div>

          {/* Global Progress Card */}
          <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-white font-bold text-lg">
                  {language === 'en' ? 'Global Progress' : 'Progression Globale'}
                </h3>
                <p className="text-purple-100 text-sm">
                  {completionData.overall.completed}/{completionData.overall.total_features} {language === 'en' ? 'features completed' : 'fonctionnalités complétées'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white">{completionData.overall.percentage}%</div>
                <div className="text-sm text-purple-100">{totalHours}h {language === 'en' ? 'remaining' : 'restantes'}</div>
              </div>
            </div>
            <Progress value={completionData.overall.percentage} className="h-4 bg-white/20" />
          </Card>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Categories */}
          <div className="space-y-4">
            {completionData.categories.map((category, idx) => {
              const Icon = category.icon;
              const isExpanded = expandedCategory === category.id;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="overflow-hidden border-2 hover:border-purple-300 transition-colors">
                    <Button
                      variant="ghost"
                      className="w-full p-6 flex items-center justify-between hover:bg-slate-50"
                      onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${category.color} text-white shadow-lg`}>
                          <Icon className="w-7 h-7" />
                        </div>

                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{category.name}</h3>
                            <Badge className={getPriorityColor(category.priority)}>
                              {category.priority}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${category.color}`}
                                style={{ width: `${category.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-600 font-semibold">{category.progress}%</span>
                            <span className="text-xs text-slate-500">
                              {category.completed_tasks}/{category.total_tasks}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {category.estimated_hours}h
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </Button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-200"
                        >
                          <div className="p-6 space-y-2 bg-slate-50">
                            {category.tasks.map((task, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-purple-300 transition-colors"
                              >
                                <div className="flex-1">
                                  <p className="text-sm text-slate-900 mb-1">{task.title}</p>
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(task.status)}
                                    <Badge className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                                      {task.priority}
                                    </Badge>
                                  </div>
                                </div>
                                <Badge variant="outline" className="ml-4">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {task.hours}h
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Nouveautés Janvier 2026 */}
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                ⭐ {language === 'en' ? 'NEW JANUARY 2026' : 'NOUVEAU JANVIER 2026'}
              </Badge>
              <h2 className="text-xl font-bold text-slate-900">
                {language === 'en' ? '+8 Advanced Features Delivered' : '+8 Fonctionnalités Avancées Livrées'}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-slate-900">✅ Module Émotionnel Backend (30 états)</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-slate-900">✅ Chat_2 Orchestration Cascade</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-slate-900">✅ RichQueryDetector + InstinctiveEngine</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-slate-900">✅ SearchResults Optimisés</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-slate-900">✅ 7 Automations Backend 24/7</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-slate-900">✅ Sync ConsciousnessConfig 106D</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-slate-900">✅ Analyse Morale Multi-Cadres</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-amber-200">
                <p className="text-sm font-medium text-slate-900">✅ +8% Performance Backend</p>
              </div>
            </div>
          </Card>

          {/* Roadmap */}
          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              {language === 'en' ? 'Strategic Roadmap' : 'Feuille de Route Stratégique'}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Immediate */}
              <div>
                <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {language === 'en' ? 'Immediate (Now)' : 'Immédiat (Maintenant)'}
                </h3>
                <div className="space-y-2">
                  {completionData.roadmap.immediate.map((item, i) => (
                    <Card key={i} className="p-3 border-l-4 border-red-500">
                      <p className="text-sm text-slate-900 mb-2">{item.title}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <span className="text-xs text-slate-600">{item.hours}h</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Short Term */}
              <div>
                <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {language === 'en' ? 'Short Term (1-2 weeks)' : 'Court Terme (1-2 semaines)'}
                </h3>
                <div className="space-y-2">
                  {completionData.roadmap.short_term.map((item, i) => (
                    <Card key={i} className="p-3 border-l-4 border-orange-500">
                      <p className="text-sm text-slate-900 mb-2">{item.title}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <span className="text-xs text-slate-600">{item.hours}h</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Medium Term */}
              <div>
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  {language === 'en' ? 'Medium Term (3-4 weeks)' : 'Moyen Terme (3-4 semaines)'}
                </h3>
                <div className="space-y-2">
                  {completionData.roadmap.medium_term.map((item, i) => (
                    <Card key={i} className="p-3 border-l-4 border-blue-500">
                      <p className="text-sm text-slate-900 mb-2">{item.title}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <span className="text-xs text-slate-600">{item.hours}h</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Links */}
          <Card className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600">
            <h3 className="text-xl font-bold text-white mb-4">
              {language === 'en' ? 'Related Pages' : 'Pages Connexes'}
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              <Button
                onClick={() => window.location.href = createPageUrl("MobilePlan")}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Mobile Plan' : 'Plan Mobile'}
              </Button>
              <Button
                onClick={() => window.location.href = createPageUrl("ProjectProgress")}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Project Progress' : 'Progrès Projet'}
              </Button>
              <Button
                onClick={() => window.location.href = createPageUrl("Documentation")}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Documentation
              </Button>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}