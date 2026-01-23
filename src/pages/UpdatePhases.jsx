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
import { CheckCircle2, Clock, AlertCircle, Search, Lock, History } from "lucide-react";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import PhaseHistoryPanel from "@/components/phases/PhaseHistoryPanel";

export default function UpdatePhases() {
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: phases = [] } = useQuery({
    queryKey: ["updatePhases"],
    queryFn: () => base44.entities.UpdatePhase.list(),
  });

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
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "in-progress": return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Phases de Mise à Jour</h1>
          <p className="text-gray-300">Feuille de route complète - Druide Omega</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Progression: {overallProgress}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={overallProgress} className="mb-6" />
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-500/10 p-3 rounded">
                  <div className="text-green-400 font-bold">{stats.completed}</div>
                  <div className="text-gray-300 text-sm">Complétées</div>
                </div>
                <div className="bg-blue-500/10 p-3 rounded">
                  <div className="text-blue-400 font-bold">{stats.inProgress}</div>
                  <div className="text-gray-300 text-sm">En cours</div>
                </div>
                <div className="bg-gray-500/10 p-3 rounded">
                  <div className="text-gray-300 font-bold">{stats.pending}</div>
                  <div className="text-gray-400 text-sm">À venir</div>
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
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="completed">Complétées</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="pending">À venir</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Phases */}
        <div className="space-y-4">
          {filteredPhases.map((phase, idx) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                className={`bg-slate-800 border-slate-700 cursor-pointer hover:border-purple-500 transition-all ${
                  expandedPhase === phase.id ? "ring-2 ring-purple-500" : ""
                }`}
                onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-400 text-sm">Phase {phase.phase_number}</span>
                        <Badge className={getStatusColor(phase.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(phase.status)}
                            {phase.status === "in-progress" ? "En cours" : phase.status === "completed" ? "✓ Complétée" : "À venir"}
                          </div>
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-400">{phase.progress}%</div>
                      <div className="text-xs text-gray-400">{phase.duration_weeks} semaines</div>
                    </div>
                  </div>
                  <Progress value={phase.progress} className="mt-3 h-2" />
                </CardHeader>

                {expandedPhase === phase.id && phase.milestones && (
                  <CardContent className="border-t border-slate-700 pt-4">
                    <div className="space-y-2">
                      {phase.milestones.map((m) => (
                        <div key={m.id} className="text-sm text-gray-300 flex items-center gap-2">
                          {getStatusIcon(m.status)}
                          <span>{m.task}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}