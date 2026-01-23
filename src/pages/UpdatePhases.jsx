import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2, Clock, AlertCircle, Zap, Database, Shield, 
  Brain, Code, Gauge, Lock, BookOpen, Rocket, Search, Filter, TrendingUp
} from "lucide-react";
import PhaseCard from "@/components/phases/PhaseCard";
import PhaseGantt from "@/components/phases/PhaseGantt";

export default function UpdatePhases() {
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("cards");
  const queryClient = useQueryClient();

  // Charger les phases depuis la BD
  const { data: phases = [], isLoading } = useQuery({
    queryKey: ["updatePhases"],
    queryFn: async () => {
      const result = await base44.entities.UpdatePhase.list();
      // Si vide, charger les données par défaut
      if (result.length === 0) {
        return getDefaultPhases();
      }
      return result.sort((a, b) => a.phase_number - b.phase_number);
    },
  });

  // Mettre à jour une phase
  const updatePhaseMutation = useMutation({
    mutationFn: (phaseData) =>
      base44.entities.UpdatePhase.update(phaseData.id, phaseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["updatePhases"] });
    },
  });

  // Filtrer les phases
  const filteredPhases = phases.filter((phase) => {
    const matchesFilter = filter === "all" || phase.status === filter;
    const matchesSearch = phase.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const overallProgress = Math.round(
    phases.reduce((sum, p) => sum + (p.progress || 0), 0) / (phases.length || 1)
  );

  const stats = {
    completed: phases.filter((p) => p.status === "completed").length,
    inProgress: phases.filter((p) => p.status === "in-progress").length,
    pending: phases.filter((p) => p.status === "pending").length,
    blocked: phases.filter((p) => p.status === "blocked").length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Clock className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-gray-300">Chargement des phases...</p>
          </div>
        </div>
      </div>
    );
  }

  const defaultPhases = [
      {
        phase_number: 1,
        title: "Infrastructure de Base",
        status: "completed",
        progress: 100,
        icon: "Database",
        color: "from-blue-500 to-blue-600",
        duration_weeks: 3,
        milestones: [
          { id: "1-1", task: "Entités core (User, Memory, Conversation)", status: "completed" },
          { id: "1-2", task: "Système de mémoire multi-modal (chat, voice, visual)", status: "completed" },
          { id: "1-3", task: "Storage & caching layer", status: "completed" },
          { id: "1-4", task: "API authentication & security basics", status: "completed" }
        ],
        deliverables: [
          "Base de données complète",
          "Système de mémoire fonctionnel",
          "Authentication de base"
        ]
      },
      {
        phase_number: 2,
        title: "Consciousness Layer",
        status: "completed",
        progress: 100,
        icon: "Brain",
        color: "from-purple-500 to-purple-600",
        duration_weeks: 4,
        milestones: [
          { id: "2-1", task: "Architecture 106-dimensionnelle", status: "completed" },
          { id: "2-2", task: "ConsciousnessConfig & ConsciousnessSnapshot", status: "completed" },
          { id: "2-3", task: "Emotional analysis engine", status: "completed" },
          { id: "2-4", task: "Ethical judgment module", status: "completed" },
          { id: "2-5", task: "Thought visualization dashboard", status: "completed" }
        ],
        deliverables: [
          "Architecture conscience complète",
          "Dashboard de conscience",
          "Module de jugement éthique"
        ]
      },
      {
        phase_number: 3,
        title: "Event Sourcing & Temporal Chain",
        status: "in-progress",
        progress: 85,
        icon: "Clock",
        color: "from-indigo-500 to-indigo-600",
        duration_weeks: 3,
        milestones: [
          { id: "3-1", task: "Event sourcing backend function", status: "completed" },
          { id: "3-2", task: "Temporal chain management", status: "completed" },
          { id: "3-3", task: "Causal pattern detection", status: "completed" },
          { id: "3-4", task: "Timeline visualization", status: "in-progress" },
          { id: "3-5", task: "Integration avec Memory system", status: "pending" }
        ],
        deliverables: [
          "Event sourcing engine",
          "Timeline persistence",
          "Causal analysis"
        ]
      },
      {
        phase_number: 4,
        title: "Passive Indexing & Knowledge Fusion",
        status: "in-progress",
        progress: 70,
        icon: "Gauge",
        color: "from-teal-500 to-teal-600",
        duration_weeks: 3,
        milestones: [
          { id: "4-1", task: "Passive indexing engine (zero-LLM cost)", status: "completed" },
          { id: "4-2", task: "Keyword extraction & semantic tagging", status: "completed" },
          { id: "4-3", task: "Knowledge base entities", status: "completed" },
          { id: "4-4", task: "Knowledge fusion analysis", status: "in-progress" },
          { id: "4-5", task: "Cross-modal synthesis", status: "pending" }
        ],
        deliverables: [
          "Passive indexing system",
          "Knowledge graph",
          "Fusion analytics"
        ]
      },
      {
        phase_number: 5,
        title: "Continuous Learning System",
        status: "in-progress",
        progress: 65,
        icon: "Zap",
        color: "from-yellow-500 to-yellow-600",
        duration_weeks: 4,
        milestones: [
          { id: "5-1", task: "Continuous learning backend function", status: "completed" },
          { id: "5-2", task: "Pattern extraction & autonomy scores", status: "completed" },
          { id: "5-3", task: "Meta-learning cycles (every 30 min)", status: "completed" },
          { id: "5-4", task: "ArchitectureDashboard monitoring", status: "completed" },
          { id: "5-5", task: "Autonomous decision making (advanced)", status: "in-progress" },
          { id: "5-6", task: "Evolution tracking & consciousness growth", status: "pending" }
        ],
        deliverables: [
          "Continuous learning engine",
          "Architecture dashboard",
          "Meta-learning system"
        ]
      },
      {
        phase_number: 6,
        title: "Multi-Intelligence System (Gardner)",
        status: "pending",
        progress: 40,
        icon: "Brain",
        color: "from-pink-500 to-pink-600",
        duration_weeks: 3,
        milestones: [
          { id: "6-1", task: "12 modules d'intelligence spécialisés", status: "in-progress" },
          { id: "6-2", task: "Switching & adaptation dynamique", status: "pending" },
          { id: "6-3", task: "Intelligence-specific prompting", status: "pending" },
          { id: "6-4", task: "Performance metrics par intelligence", status: "pending" }
        ],
        deliverables: [
          "12 modules d'intelligence",
          "Adaptive routing system",
          "Intelligence switching UI"
        ]
      },
      {
        phase_number: 7,
        title: "Advanced Security & Compliance",
        status: "pending",
        progress: 30,
        icon: "Shield",
        color: "from-red-500 to-red-600",
        duration_weeks: 3,
        milestones: [
          { id: "7-1", task: "Encryption layer avancée (quantum-ready)", status: "pending" },
          { id: "7-2", task: "RGPD & CCPA compliance", status: "pending" },
          { id: "7-3", task: "Data isolation par utilisateur", status: "pending" },
          { id: "7-4", task: "Security audit & penetration testing", status: "pending" },
          { id: "7-5", task: "Compliance certification", status: "pending" }
        ],
        deliverables: [
          "Quantum-ready encryption",
          "Compliance certifications",
          "Security audit reports"
        ]
      },
      {
        phase_number: 8,
        title: "Advanced LLM Integration",
        status: "pending",
        progress: 25,
        icon: "Code",
        color: "from-green-500 to-green-600",
        duration_weeks: 3,
        milestones: [
          { id: "8-1", task: "Multi-LLM routing (DeepSeek, Base44, Claude, GPT)", status: "pending" },
          { id: "8-2", task: "Cost optimization engine", status: "pending" },
          { id: "8-3", task: "Quality-speed tradeoff logic", status: "pending" },
          { id: "8-4", task: "Fallback mechanisms", status: "pending" },
          { id: "8-5", task: "LLM provider abstraction layer", status: "pending" }
        ],
        deliverables: [
          "Multi-LLM orchestration",
          "Cost optimization",
          "Provider abstraction"
        ]
      },
      {
        phase_number: 9,
        title: "Multimodal & Sensory Integration",
        status: "pending",
        progress: 20,
        icon: "BookOpen",
        color: "from-cyan-500 to-cyan-600",
        duration_weeks: 3,
        milestones: [
          { id: "9-1", task: "Voice processing & understanding", status: "pending" },
          { id: "9-2", task: "Image analysis & generation", status: "pending" },
          { id: "9-3", task: "Visual memory integration", status: "pending" },
          { id: "9-4", task: "Cross-modal context enrichment", status: "pending" },
          { id: "9-5", task: "Sensory stream synchronization", status: "pending" }
        ],
        deliverables: [
          "Voice processing",
          "Image generation",
          "Multimodal synthesis"
        ]
      },
      {
        id: "phase-10",
        phase: 10,
        title: "Scalability & Performance",
        status: "pending",
        progress: 15,
        icon: Rocket,
        color: "from-orange-500 to-orange-600",
        duration: "2-3 semaines",
        milestones: [
          { task: "Horizontal scaling architecture", status: "pending" },
          { task: "Load balancing & distribution", status: "pending" },
          { task: "Database optimization (sharding, caching)", status: "pending" },
          { task: "CDN & edge computing", status: "pending" },
          { task: "Performance benchmarking", status: "pending" }
        ],
        deliverables: [
          "Scalable architecture",
          "Performance benchmarks",
          "Deployment automation"
        ]
      },
      {
        id: "phase-11",
        phase: 11,
        title: "Mobile & Offline Support",
        status: "pending",
        progress: 10,
        icon: Lock,
        color: "from-violet-500 to-violet-600",
        duration: "2 semaines",
        milestones: [
          { task: "Mobile-optimized UI", status: "pending" },
          { task: "Offline-first architecture", status: "pending" },
          { task: "Sync mechanisms", status: "pending" },
          { task: "Native app wrappers", status: "pending" }
        ],
        deliverables: [
          "Mobile app",
          "Offline support",
          "Native integration"
        ]
      },
      {
        id: "phase-12",
        phase: 12,
        title: "Production Launch & Monitoring",
        status: "pending",
        progress: 0,
        icon: Rocket,
        color: "from-emerald-500 to-emerald-600",
        duration: "1-2 semaines",
        milestones: [
          { task: "Full system testing", status: "pending" },
          { task: "Monitoring & alerting setup", status: "pending" },
          { task: "Documentation complète", status: "pending" },
          { task: "User onboarding flow", status: "pending" },
          { task: "Launch & rollout graduel", status: "pending" }
        ],
        deliverables: [
          "Production system",
          "Monitoring dashboards",
          "User documentation"
        ]
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4 animate-spin" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getMilestoneStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "in-progress":
        return "bg-blue-50 border-blue-200";
      case "pending":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const overallProgress = Math.round(
    phases.reduce((sum, p) => sum + p.progress, 0) / phases.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Phases de Mise à Jour - Druide Omega
          </h1>
          <p className="text-gray-300 text-lg">
            Feuille de route complète pour la mise à jour intégrale du système
          </p>
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Progression Globale</CardTitle>
                <Badge className="bg-purple-600 text-white text-lg px-3 py-1">
                  {overallProgress}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={overallProgress} className="h-3" />
              <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
                <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                  <div className="text-green-400 font-bold">
                    {phases.filter(p => p.status === "completed").length}
                  </div>
                  <div className="text-gray-300">Complétées</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                  <div className="text-blue-400 font-bold">
                    {phases.filter(p => p.status === "in-progress").length}
                  </div>
                  <div className="text-gray-300">En cours</div>
                </div>
                <div className="bg-gray-500/10 border border-gray-500/20 rounded p-3">
                  <div className="text-gray-300 font-bold">
                    {phases.filter(p => p.status === "pending").length}
                  </div>
                  <div className="text-gray-400">À venir</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Phases Grid */}
        <div className="space-y-4">
          <AnimatePresence>
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              const isExpanded = expandedPhase === phase.id;

              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card
                    className={`bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition-all ${
                      isExpanded ? "ring-2 ring-purple-500" : ""
                    }`}
                    onClick={() =>
                      setExpandedPhase(isExpanded ? null : phase.id)
                    }
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`bg-gradient-to-br ${phase.color} p-3 rounded-lg`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-gray-400 text-sm">
                                Phase {phase.phase}
                              </span>
                              <Badge
                                className={`${getStatusColor(phase.status)}`}
                              >
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(phase.status)}
                                  <span className="capitalize">
                                    {phase.status === "in-progress"
                                      ? "En cours"
                                      : phase.status === "completed"
                                      ? "Complétée"
                                      : "À venir"}
                                  </span>
                                </div>
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-white">
                              {phase.title}
                            </h3>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-400">
                            {phase.progress}%
                          </div>
                          <div className="text-xs text-gray-400">
                            {phase.duration}
                          </div>
                        </div>
                      </div>
                      <Progress value={phase.progress} className="mt-3 h-2" />
                    </CardHeader>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="border-t border-slate-700 pt-4">
                            {/* Milestones */}
                            <div className="mb-6">
                              <h4 className="text-sm font-semibold text-gray-300 mb-3">
                                Jalons
                              </h4>
                              <div className="space-y-2">
                                {phase.milestones.map((milestone, idx) => (
                                  <div
                                    key={idx}
                                    className={`p-3 rounded border ${getMilestoneStatusColor(
                                      milestone.status
                                    )}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {milestone.status === "completed" ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                      ) : milestone.status === "in-progress" ? (
                                        <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                                      ) : (
                                        <Clock className="w-4 h-4 text-gray-400" />
                                      )}
                                      <span className="text-sm text-gray-200">
                                        {milestone.task}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Deliverables */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-300 mb-3">
                                Livrables
                              </h4>
                              <ul className="space-y-2">
                                {phase.deliverables.map((deliverable, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-gray-300 flex items-center gap-2"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                                    {deliverable}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Timeline Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Timeline Estimée</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-purple-500 to-orange-500" />

                {/* Timeline Items */}
                <div className="space-y-6 pl-24">
                  {phases.map((phase, index) => (
                    <div key={phase.id} className="relative">
                      <div className="absolute -left-16 top-1 w-4 h-4 rounded-full bg-slate-700 border-2 border-purple-500" />
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-white">
                          {phase.title}
                        </span>
                        <span className="text-xs text-gray-400">
                          {phase.duration}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        Semainesしました {2 + Math.floor(index / 2)}-{3 + Math.floor(index / 2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}