import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  CheckCircle2, 
  Circle,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Zap,
  Layout,
  Gauge,
  Touch,
  Eye,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobilePlan() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const sections = [
    {
      id: "ui-responsive",
      title: "Interface & Responsive Design",
      priority: "critical",
      icon: <Layout className="w-5 h-5" />,
      progress: 65,
      tasks: [
        { id: 1, title: "Ajuster les espacements pour petits écrans (<375px)", status: "todo", priority: "high" },
        { id: 2, title: "Optimiser la taille des cartes et composants", status: "in-progress", priority: "high" },
        { id: 3, title: "Revoir les grids (passer de 3-4 cols à 1-2 cols mobile)", status: "todo", priority: "high" },
        { id: 4, title: "Fixer les débordements horizontaux (overflow-x)", status: "done", priority: "high" },
        { id: 5, title: "Adapter les modales en full-screen sur mobile", status: "todo", priority: "medium" },
        { id: 6, title: "Optimiser les formulaires (inputs plus grands, spacing)", status: "todo", priority: "medium" },
        { id: 7, title: "Safe area pour iPhone (notch/dynamic island)", status: "done", priority: "high" },
        { id: 8, title: "Bottom nav bar sticky avec safe-area", status: "done", priority: "high" }
      ]
    },
    {
      id: "touch",
      title: "Interactions Tactiles",
      priority: "critical",
      icon: <Touch className="w-5 h-5" />,
      progress: 40,
      tasks: [
        { id: 9, title: "Augmenter zones tactiles minimum 44x44px (WCAG)", status: "in-progress", priority: "critical" },
        { id: 10, title: "Ajouter feedback visuel sur tap/press", status: "todo", priority: "high" },
        { id: 11, title: "Implémenter swipe gestures (retour, actions)", status: "todo", priority: "medium" },
        { id: 12, title: "Pull-to-refresh sur listes", status: "todo", priority: "medium" },
        { id: 13, title: "Long press menus contextuels", status: "todo", priority: "low" },
        { id: 14, title: "Haptic feedback (vibrations)", status: "todo", priority: "low" },
        { id: 15, title: "Prévenir double-tap accidentel", status: "todo", priority: "medium" }
      ]
    },
    {
      id: "performance",
      title: "Performance Mobile",
      priority: "high",
      icon: <Gauge className="w-5 h-5" />,
      progress: 50,
      tasks: [
        { id: 16, title: "Lazy loading images avec placeholders", status: "todo", priority: "high" },
        { id: 17, title: "Virtualisation longues listes (react-window)", status: "todo", priority: "high" },
        { id: 18, title: "Réduire bundle size (code splitting)", status: "in-progress", priority: "high" },
        { id: 19, title: "Optimiser animations (GPU acceleration)", status: "done", priority: "medium" },
        { id: 20, title: "Service Worker pour cache offline", status: "todo", priority: "medium" },
        { id: 21, title: "Compression images (WebP, AVIF)", status: "todo", priority: "medium" },
        { id: 22, title: "Throttle/debounce événements scroll", status: "todo", priority: "low" }
      ]
    },
    {
      id: "navigation",
      title: "Navigation Mobile",
      priority: "high",
      icon: <ChevronRight className="w-5 h-5" />,
      progress: 75,
      tasks: [
        { id: 23, title: "Bottom nav bar avec icônes essentielles", status: "done", priority: "critical" },
        { id: 24, title: "Sidebar mobile slide-in optimisée", status: "done", priority: "high" },
        { id: 25, title: "Breadcrumbs pour navigation profonde", status: "todo", priority: "medium" },
        { id: 26, title: "Back button natif Android", status: "todo", priority: "medium" },
        { id: 27, title: "Tabs horizontales scrollables", status: "in-progress", priority: "medium" },
        { id: 28, title: "Shortcuts clavier virtuels iOS", status: "todo", priority: "low" }
      ]
    },
    {
      id: "content",
      title: "Contenu & Lisibilité",
      priority: "high",
      icon: <Eye className="w-5 h-5" />,
      progress: 70,
      tasks: [
        { id: 29, title: "Tailles de police adaptatives (rem)", status: "done", priority: "high" },
        { id: 30, title: "Contraste couleurs WCAG AAA", status: "done", priority: "critical" },
        { id: 31, title: "Line-height optimal (1.5-1.8)", status: "done", priority: "medium" },
        { id: 32, title: "Truncate textes longs avec expand", status: "in-progress", priority: "medium" },
        { id: 33, title: "Images responsive avec srcset", status: "todo", priority: "medium" },
        { id: 34, title: "Zoom texte sans casser layout", status: "todo", priority: "high" }
      ]
    },
    {
      id: "forms",
      title: "Formulaires & Inputs",
      priority: "medium",
      icon: <FileText className="w-5 h-5" />,
      progress: 55,
      tasks: [
        { id: 35, title: "Keyboard type adapté (numeric, email, tel)", status: "todo", priority: "high" },
        { id: 36, title: "Autocomplete/autofill natif", status: "todo", priority: "high" },
        { id: 37, title: "Labels toujours visibles (no placeholder only)", status: "done", priority: "high" },
        { id: 38, title: "Messages erreur inline clairs", status: "done", priority: "medium" },
        { id: 39, title: "Voice input pour textarea", status: "todo", priority: "low" },
        { id: 40, title: "Dismiss keyboard automatique", status: "todo", priority: "medium" }
      ]
    },
    {
      id: "features",
      title: "Fonctionnalités Mobile",
      priority: "medium",
      icon: <Zap className="w-5 h-5" />,
      progress: 30,
      tasks: [
        { id: 41, title: "PWA installation prompt", status: "done", priority: "high" },
        { id: 42, title: "Push notifications (opt-in)", status: "todo", priority: "medium" },
        { id: 43, title: "Camera/photo upload optimisé", status: "todo", priority: "medium" },
        { id: 44, title: "Partage natif (Share API)", status: "todo", priority: "medium" },
        { id: 45, title: "Géolocalisation (si pertinent)", status: "todo", priority: "low" },
        { id: 46, title: "Reconnaissance vocale continue", status: "todo", priority: "medium" },
        { id: 47, title: "Mode sombre automatique", status: "todo", priority: "low" }
      ]
    },
    {
      id: "testing",
      title: "Tests & QA Mobile",
      priority: "high",
      icon: <AlertTriangle className="w-5 h-5" />,
      progress: 20,
      tasks: [
        { id: 48, title: "Test iPhone SE (375px)", status: "todo", priority: "critical" },
        { id: 49, title: "Test iPhone 12-15 Pro Max", status: "todo", priority: "critical" },
        { id: 50, title: "Test Android (Samsung, Pixel)", status: "todo", priority: "critical" },
        { id: 51, title: "Test orientation portrait/paysage", status: "todo", priority: "high" },
        { id: 52, title: "Test avec connexion lente (3G)", status: "todo", priority: "high" },
        { id: 53, title: "Test mode offline", status: "todo", priority: "medium" },
        { id: 54, title: "Test lecteur d'écran mobile", status: "todo", priority: "high" }
      ]
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-blue-600';
      default: return 'bg-slate-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Circle className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'todo': return <Circle className="w-4 h-4 text-slate-400" />;
      default: return <Circle className="w-4 h-4 text-slate-400" />;
    }
  };

  const totalTasks = sections.reduce((sum, s) => sum + s.tasks.length, 0);
  const completedTasks = sections.reduce((sum, s) => 
    sum + s.tasks.filter(t => t.status === 'done').length, 0
  );
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-8 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-6 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">Plan Mobile 2025</h1>
                <p className="text-purple-100">Roadmap complète pour une expérience mobile 100% optimisée</p>
              </div>
            </div>

            {/* Overall Progress */}
            <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-white font-bold text-lg">Progression Globale</h3>
                  <p className="text-purple-100 text-sm">{completedTasks} / {totalTasks} tâches complétées</p>
                </div>
                <div className="text-3xl font-bold text-white">{overallProgress}%</div>
              </div>
              <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-8 h-full">
          <ScrollArea className="h-full">
            <div className="space-y-4 pr-4 pb-6">
              {sections.map((section, idx) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="overflow-hidden border-2 hover:border-purple-300 transition-colors">
                    {/* Section Header */}
                    <Button
                      variant="ghost"
                      className="w-full p-6 flex items-center justify-between hover:bg-slate-50"
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                          section.priority === 'critical' ? 'from-red-500 to-orange-600' :
                          section.priority === 'high' ? 'from-orange-500 to-yellow-600' :
                          'from-blue-500 to-indigo-600'
                        } text-white shadow-lg`}>
                          {section.icon}
                        </div>
                        
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
                            <Badge className={`${getPriorityColor(section.priority)} text-white`}>
                              {section.priority}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                style={{ width: `${section.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-600 font-semibold">{section.progress}%</span>
                            <span className="text-xs text-slate-500">
                              {section.tasks.filter(t => t.status === 'done').length}/{section.tasks.length}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {expandedSection === section.id ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </Button>

                    {/* Tasks List */}
                    <AnimatePresence>
                      {expandedSection === section.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-200"
                        >
                          <div className="p-6 space-y-2 bg-slate-50">
                            {section.tasks.map((task) => (
                              <div
                                key={task.id}
                                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-purple-300 transition-colors"
                              >
                                {getStatusIcon(task.status)}
                                <span className={`flex-1 text-sm ${
                                  task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-900'
                                }`}>
                                  {task.title}
                                </span>
                                <Badge 
                                  className={`${getPriorityColor(task.priority)} text-white text-xs`}
                                  variant="secondary"
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}

              {/* Quick Stats */}
              <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                <h3 className="text-lg font-bold text-purple-900 mb-4">Statistiques Rapides</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {sections.reduce((sum, s) => sum + s.tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length, 0)}
                    </div>
                    <div className="text-xs text-slate-600">Critical restantes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {sections.reduce((sum, s) => sum + s.tasks.filter(t => t.priority === 'high' && t.status !== 'done').length, 0)}
                    </div>
                    <div className="text-xs text-slate-600">High restantes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {sections.reduce((sum, s) => sum + s.tasks.filter(t => t.status === 'in-progress').length, 0)}
                    </div>
                    <div className="text-xs text-slate-600">En cours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{completedTasks}</div>
                    <div className="text-xs text-slate-600">Complétées</div>
                  </div>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}