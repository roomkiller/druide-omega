import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Clock, AlertCircle, Search, Lock, History, Users, Package, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import PhaseHistoryPanel from "@/components/phases/PhaseHistoryPanel";
import PhaseEditModal from "@/components/phases/PhaseEditModal";
import PhaseDetailsSkeleton from "@/components/phases/PhaseDetailsSkeleton";

export default function UpdatePhases() {
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [showHistory, setShowHistory] = useState(null);
  const [editingPhase, setEditingPhase] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: phases = [], isLoading, error } = useQuery({
    queryKey: ["updatePhases"],
    queryFn: () => base44.entities.UpdatePhase.list(),
  });

  // Check if phase dependencies are met
  const areDependenciesMet = (phase) => {
    if (!phase.dependencies || phase.dependencies.length === 0) return true;
    return phase.dependencies.every((depId) => {
      const depPhase = phases.find((p) => p.id === depId);
      return depPhase?.status === "completed";
    });
  };

  const getBlockingPhases = (phase) => {
    if (!phase.dependencies || phase.dependencies.length === 0) return [];
    return phase.dependencies
      .map((depId) => phases.find((p) => p.id === depId))
      .filter((p) => p && p.status !== "completed");
  };

  const handleStatusChange = async (phase, newStatus) => {
    if (newStatus === "in-progress" && !areDependenciesMet(phase)) {
      const blocking = getBlockingPhases(phase);
      toast.error(`Phase bloquée par: ${blocking.map((p) => p.title).join(", ")}`);
      return;
    }

    try {
      setLoading(true);
      const oldStatus = phase.status;
      await base44.entities.UpdatePhase.update(phase.id, { status: newStatus });

      await base44.functions.invoke("logPhaseChange", {
        phase_id: phase.id,
        change_type: "status",
        change_description: `Statut modifié de ${oldStatus} à ${newStatus}`,
        old_value: oldStatus,
        new_value: newStatus,
      });

      queryClient.invalidateQueries({ queryKey: ["updatePhases"] });
      toast.success("Phase mise à jour");
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPhases = phases.filter((p) => {
    const matchesFilter = filter === "all" || p.status === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case "blocked":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-900/30 text-green-300 border-green-700";
      case "in-progress":
        return "bg-blue-900/30 text-blue-300 border-blue-700";
      case "blocked":
        return "bg-orange-900/30 text-orange-300 border-orange-700";
      default:
        return "bg-slate-700/30 text-slate-300 border-slate-700";
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <Card className="bg-red-900/20 border-red-700">
          <CardContent className="p-6">
            <p className="text-red-300">Erreur de chargement des phases</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <NotificationCenter />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📋 Phases de Mise à Jour</h1>
          <p className="text-gray-400">Feuille de route intégrale - Druide Omega</p>
        </motion.div>

        {/* Stats Card */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Progression globale: {overallProgress}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={overallProgress} className="mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-green-500/10 p-3 rounded border border-green-700/50">
                  <div className="text-green-400 font-bold">{stats.completed}</div>
                  <div className="text-gray-400 text-xs">Complétées</div>
                </div>
                <div className="bg-blue-500/10 p-3 rounded border border-blue-700/50">
                  <div className="text-blue-400 font-bold">{stats.inProgress}</div>
                  <div className="text-gray-400 text-xs">En cours</div>
                </div>
                <div className="bg-slate-500/10 p-3 rounded border border-slate-700/50">
                  <div className="text-slate-300 font-bold">{stats.pending}</div>
                  <div className="text-gray-400 text-xs">À venir</div>
                </div>
                <div className="bg-orange-500/10 p-3 rounded border border-orange-700/50">
                  <div className="text-orange-400 font-bold">{stats.blocked}</div>
                  <div className="text-gray-400 text-xs">Bloquées</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search & Filter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher par titre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les phases</SelectItem>
              <SelectItem value="completed">✓ Complétées</SelectItem>
              <SelectItem value="in-progress">⏱ En cours</SelectItem>
              <SelectItem value="pending">⏳ À venir</SelectItem>
              <SelectItem value="blocked">🚫 Bloquées</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Phases List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <PhaseDetailsSkeleton key={i} />
            ))}
          </div>
        ) : filteredPhases.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                {phases.length === 0 ? "Aucune phase créée" : "Aucune phase ne correspond aux filtres"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPhases.map((phase, idx) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card
                  className={`bg-slate-800 border-slate-700 transition-all ${
                    expandedPhase === phase.id ? "ring-2 ring-purple-500 border-purple-500" : "hover:border-purple-500/50"
                  }`}
                >
                  <CardHeader className="cursor-pointer" onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-gray-500 text-sm font-mono">Phase {phase.phase_number}</span>
                          <Badge className={`border ${getStatusColor(phase.status)}`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(phase.status)}
                              {phase.status === "in-progress"
                                ? "En cours"
                                : phase.status === "completed"
                                ? "✓ Complétée"
                                : phase.status === "blocked"
                                ? "🚫 Bloquée"
                                : "À venir"}
                            </div>
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                        {phase.description && (
                          <p className="text-sm text-gray-400 mt-1 line-clamp-1">{phase.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-400">{phase.progress}%</div>
                        <div className="text-xs text-gray-500 flex items-center justify-end gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {phase.duration_weeks} sem
                        </div>
                      </div>
                    </div>
                    <Progress value={phase.progress} className="mt-3 h-2" />
                  </CardHeader>

                  {/* Expanded Content */}
                  {expandedPhase === phase.id && (
                    <CardContent className="border-t border-slate-700 pt-6 space-y-6">
                      {/* Dependencies Section */}
                      {phase.dependencies && phase.dependencies.length > 0 && (
                        <div className="bg-slate-700/20 p-4 rounded border border-slate-700">
                          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Lock className="w-4 h-4" /> Dépendances ({phase.dependencies.length})
                          </h4>
                          <div className="space-y-2">
                            {getBlockingPhases(phase).map((blocking) => (
                              <div key={blocking.id} className="text-sm text-orange-300 bg-orange-500/10 p-2 rounded border border-orange-600/50">
                                🔗 Phase {blocking.phase_number}: {blocking.title}
                                <span className="text-orange-400 ml-2 font-semibold">⏳ En attente</span>
                              </div>
                            ))}
                            {areDependenciesMet(phase) && phase.dependencies.length > 0 && (
                              <div className="text-sm text-green-300 bg-green-500/10 p-2 rounded border border-green-600/50">
                                ✅ Toutes les dépendances sont complétées
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Dates Section */}
                      {(phase.start_date || phase.actual_start_date) && (
                        <div className="grid grid-cols-2 gap-4">
                          {phase.start_date && (
                            <div className="bg-slate-700/20 p-3 rounded">
                              <div className="text-xs text-gray-500">Début prévu</div>
                              <div className="text-white font-semibold">{new Date(phase.start_date).toLocaleDateString("fr-FR")}</div>
                            </div>
                          )}
                          {phase.actual_start_date && (
                            <div className="bg-slate-700/20 p-3 rounded">
                              <div className="text-xs text-gray-500">Début réel</div>
                              <div className="text-green-400 font-semibold">
                                {new Date(phase.actual_start_date).toLocaleDateString("fr-FR")}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Milestones Section */}
                      {phase.milestones && phase.milestones.length > 0 && (
                        <div className="bg-slate-700/20 p-4 rounded border border-slate-700">
                          <h4 className="text-sm font-semibold text-white mb-3">🎯 Jalons ({phase.milestones.length})</h4>
                          <div className="space-y-2">
                            {phase.milestones.map((m) => (
                              <div
                                key={m.id}
                                className="text-sm text-gray-300 flex items-center gap-2 p-2 bg-slate-700/30 rounded"
                              >
                                {getStatusIcon(m.status)}
                                <span className="flex-1">{m.task}</span>
                                {m.due_date && <span className="text-xs text-gray-500">{new Date(m.due_date).toLocaleDateString("fr-FR")}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Deliverables Section */}
                      {phase.deliverables && phase.deliverables.length > 0 && (
                        <div className="bg-slate-700/20 p-4 rounded border border-slate-700">
                          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4" /> Livrables ({phase.deliverables.length})
                          </h4>
                          <ul className="space-y-1">
                            {phase.deliverables.map((deliverable, i) => (
                              <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                {deliverable}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Team Section */}
                      {(phase.owner || (phase.team_members && phase.team_members.length > 0)) && (
                        <div className="bg-slate-700/20 p-4 rounded border border-slate-700">
                          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" /> Équipe
                          </h4>
                          {phase.owner && (
                            <div className="text-sm text-gray-300 mb-2">
                              <span className="text-gray-500">Responsable:</span> {phase.owner}
                            </div>
                          )}
                          {phase.team_members && phase.team_members.length > 0 && (
                            <div className="text-sm text-gray-300">
                              <span className="text-gray-500">Équipe:</span> {phase.team_members.join(", ")}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Blockers Section */}
                      {phase.blockers && phase.blockers.length > 0 && (
                        <div className="bg-red-900/10 p-4 rounded border border-red-700/50">
                          <h4 className="text-sm font-semibold text-red-300 mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Obstacles ({phase.blockers.length})
                          </h4>
                          <div className="space-y-2">
                            {phase.blockers.map((blocker, i) => (
                              <div key={i} className="text-sm text-red-200 bg-red-900/20 p-2 rounded">
                                <div className="font-semibold">{blocker.issue}</div>
                                <div className="text-xs text-red-300">Sévérité: {blocker.severity}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* History Section */}
                      <div className="border-t border-slate-700 pt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHistory(showHistory === phase.id ? null : phase.id);
                          }}
                          className="flex items-center gap-2 text-sm font-semibold text-white hover:text-purple-300 transition"
                        >
                          <History className="w-4 h-4" /> Historique ({phase.id})
                        </button>
                        {showHistory === phase.id && (
                          <div className="mt-3">
                            <PhaseHistoryPanel phaseId={phase.id} />
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-slate-700">
                        {phase.status !== "completed" && (
                          <>
                            {phase.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(phase, "in-progress")}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                ▶ Commencer
                              </Button>
                            )}
                            {phase.status === "in-progress" && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(phase, "completed")}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                ✓ Compléter
                              </Button>
                            )}
                          </>
                        )}
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPhase(phase);
                          }}
                          variant="outline"
                          className="border-slate-600 text-gray-300"
                        >
                          ✏ Éditer
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPhase && (
        <PhaseEditModal
          phase={editingPhase}
          onClose={() => setEditingPhase(null)}
          onSave={() => {
            queryClient.invalidateQueries({ queryKey: ["updatePhases"] });
            setEditingPhase(null);
          }}
        />
      )}
    </div>
  );
}