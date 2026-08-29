/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - AI Coach Dashboard                                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useIntegrationRelay } from "@/components/system/IntegrationRelay";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoachingEngine } from "@/components/coaching/CoachingEngine";
import IntelligenceCoachingSession from "@/components/coaching/IntelligenceCoachingSession";
import {
  GraduationCap,
  TrendingUp,
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  Zap,
  Brain,
  RefreshCw,
  Calculator,
  MessageCircle,
  Music,
  Activity,
  Shapes,
  Users,
  User,
  Leaf,
  Infinity as InfinityIcon,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { navigateTo } from "@/lib/spaNavigate";

const INTELLIGENCE_TYPES = [
  { type: "logico_mathematique", label: "Logico-Math", icon: Calculator, color: "from-blue-500 to-cyan-600" },
  { type: "verbo_linguistique", label: "Verbo-Ling", icon: MessageCircle, color: "from-purple-500 to-pink-600" },
  { type: "musicale_rythmique", label: "Musicale", icon: Music, color: "from-rose-500 to-orange-600" },
  { type: "corporelle_kinesthesique", label: "Corporelle", icon: Activity, color: "from-green-500 to-emerald-600" },
  { type: "visuelle_spatiale", label: "Visuelle", icon: Shapes, color: "from-indigo-500 to-blue-600" },
  { type: "interpersonnelle", label: "Interpersonnelle", icon: Users, color: "from-amber-500 to-yellow-600" },
  { type: "intrapersonnelle", label: "Intrapersonnelle", icon: User, color: "from-violet-500 to-purple-600" },
  { type: "naturaliste", label: "Naturaliste", icon: Leaf, color: "from-lime-500 to-green-600" },
  { type: "existentielle", label: "Existentielle", icon: InfinityIcon, color: "from-slate-600 to-indigo-800" }
];

export default function AICoach() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIntelligence, setSelectedIntelligence] = useState(null);
  const queryClient = useQueryClient();
  const { relayOn } = useIntegrationRelay();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["coaching-sessions"],
    queryFn: () => base44.entities.AICoachingSession.list("-session_date", 10),
    initialData: []
  });

  const latestSession = sessions[0];

  const generateSession = async () => {
    if (!relayOn) { alert("Arrêt interne — relais d'intégration désactivé. Activez le relais (bouton vert en bas à gauche) pour générer une session."); return; }
    setIsGenerating(true);
    await CoachingEngine.generateCoachingSession();
    queryClient.invalidateQueries({ queryKey: ["coaching-sessions"] });
    setIsGenerating(false);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: "bg-red-500",
      high: "bg-orange-500",
      medium: "bg-blue-500",
      low: "bg-slate-500"
    };
    return colors[priority] || colors.low;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-purple-50/20 overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 sm:py-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <Button
            onClick={() => navigateTo('ArchitectDashboard')}
            variant="ghost"
            className="mb-4 text-purple-600 hover:text-purple-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour Dashboard
          </Button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="min-w-[56px] min-h-[56px] w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Coach IA Personnel</h1>
                <p className="text-sm text-slate-600">
                  Guidance basée sur vos objectifs
                </p>
              </div>
            </div>
            <Button
              onClick={generateSession}
              disabled={isGenerating}
              className="min-h-[48px] w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 touch-target"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              <span className="hidden sm:inline">Nouvelle Session</span>
              <span className="sm:hidden">Nouveau</span>
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Tabs defaultValue="general">
            <ScrollArea className="w-full mb-6">
              <TabsList className="inline-flex bg-white">
                <TabsTrigger value="general" className="min-h-[48px] touch-target">Coaching Général</TabsTrigger>
                <TabsTrigger value="intelligence" className="min-h-[48px] touch-target">Par Intelligence</TabsTrigger>
              </TabsList>
            </ScrollArea>

            <TabsContent value="general" className="space-y-6 mt-0">
              {!latestSession ? (
                <Card className="p-12 text-center">
                  <GraduationCap className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Démarrez votre coaching
                  </h2>
                  <p className="text-slate-600 mb-6">
                    Générez votre première session personnalisée
                  </p>
                  <Button
                    onClick={generateSession}
                    disabled={isGenerating}
                    size="lg"
                    className="min-h-[48px] bg-gradient-to-r from-purple-600 to-indigo-600 touch-target"
                  >
                    {isGenerating ? "Génération..." : "Commencer"}
                  </Button>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Engagement Score */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        Score d'Engagement
                      </h3>
                      <Badge
                        variant={latestSession.engagement_score > 70 ? "default" : "secondary"}
                        className="text-lg px-4 py-2"
                      >
                        {latestSession.engagement_score}%
                      </Badge>
                    </div>
                    <Progress value={latestSession.engagement_score} className="h-3 mb-2" />
                    <p className="text-sm text-slate-600">
                      {latestSession.engagement_score > 70
                        ? "Excellent ! Vous êtes très actif."
                        : latestSession.engagement_score > 40
                        ? "Bien ! Continuez sur cette lancée."
                        : "Vous pouvez progresser davantage."}
                    </p>
                  </Card>

                  {/* Progress Metrics */}
                  {latestSession.progress_metrics && (
                    <div className="grid sm:grid-cols-3 gap-4">
                      <MetricCard
                        icon={CheckCircle2}
                        label="Sessions complétées"
                        value={latestSession.progress_metrics.sessions_completed}
                        color="from-green-500 to-emerald-600"
                      />
                      <MetricCard
                        icon={Award}
                        label="Fonctionnalités maîtrisées"
                        value={latestSession.progress_metrics.features_mastered?.length || 0}
                        color="from-purple-500 to-indigo-600"
                      />
                      <MetricCard
                        icon={Zap}
                        label="Jours consécutifs"
                        value={latestSession.progress_metrics.consistency_streak || 0}
                        color="from-orange-500 to-yellow-600"
                      />
                    </div>
                  )}

                  {/* Insights */}
                  {latestSession.insights && latestSession.insights.length > 0 && (
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        Insights Personnalisés
                      </h3>
                      <div className="space-y-4">
                        {latestSession.insights.map((insight, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="border-l-4 pl-4 py-2"
                            style={{
                              borderColor:
                                insight.priority === "high" || insight.priority === "urgent"
                                  ? "#f97316"
                                  : "#8b5cf6"
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-slate-900">{insight.title}</h4>
                              <Badge className={getPriorityColor(insight.priority)}>
                                {insight.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                            {insight.action_items && insight.action_items.length > 0 && (
                              <div className="space-y-1">
                                {insight.action_items.map((action, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    {action}
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Learning Path */}
                  {latestSession.learning_path && (
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        Parcours d'Apprentissage
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600">Focus</p>
                            <p className="font-semibold text-slate-900">
                              {latestSession.learning_path.intelligence_focus}
                            </p>
                          </div>
                          <Badge variant="outline">{latestSession.learning_path.current_level}</Badge>
                        </div>

                        {latestSession.learning_path.recommended_activities && (
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-2">
                              Activités recommandées:
                            </p>
                            <div className="space-y-2">
                              {latestSession.learning_path.recommended_activities.map((activity, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                  <Sparkles className="w-4 h-4 text-purple-500" />
                                  {activity}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {latestSession.learning_path.milestones && (
                          <div>
                            <p className="text-sm font-medium text-slate-700 mb-3">Jalons:</p>
                            <div className="space-y-3">
                              {latestSession.learning_path.milestones.map((milestone, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  {milestone.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                  ) : (
                                    <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                  )}
                                  <div className="flex-1">
                                    <p className={`text-sm font-medium ${milestone.completed ? "text-green-700" : "text-slate-900"}`}>
                                      {milestone.title}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {new Date(milestone.target_date).toLocaleDateString("fr-FR")}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Next Steps */}
                  {latestSession.next_steps && latestSession.next_steps.length > 0 && (
                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        Prochaines Étapes
                      </h3>
                      <div className="space-y-2">
                        {latestSession.next_steps.map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0 }}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg"
                          >
                            <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {i + 1}
                            </div>
                            <p className="text-sm text-slate-700">{step}</p>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Session History */}
                  {sessions.length > 1 && (
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Historique</h3>
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {sessions.slice(1).map((session, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                              <div>
                                <p className="text-sm font-medium text-slate-900 capitalize">
                                  {session.coaching_type.replace("_", " ")}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {new Date(session.session_date).toLocaleDateString("fr-FR")}
                                </p>
                              </div>
                              <Badge variant="outline">{session.engagement_score}%</Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="intelligence" className="mt-0">
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Choisissez une intelligence à développer
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INTELLIGENCE_TYPES.map((intel) => {
                    const Icon = intel.icon;
                    return (
                      <motion.button
                        key={intel.type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedIntelligence(intel.type)}
                        className={`p-4 rounded-xl border-2 transition-all min-h-[88px] touch-target ${
                          selectedIntelligence === intel.type
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-10 h-10 bg-gradient-to-br ${intel.color} rounded-lg flex items-center justify-center mb-2 mx-auto`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xs font-medium text-slate-700 text-center">{intel.label}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </Card>

              {selectedIntelligence && (
                <IntelligenceCoachingSession
                  intelligenceType={selectedIntelligence}
                  onComplete={() => queryClient.invalidateQueries({ queryKey: ["coaching-sessions"] })}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card className="p-4">
        <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-3`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-600">{label}</div>
      </Card>
    </motion.div>
  );
}