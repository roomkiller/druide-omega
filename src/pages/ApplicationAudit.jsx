import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Download, Filter, AlertCircle as AlertIcon, Zap } from "lucide-react";
import { toast } from "sonner";

export default function ApplicationAudit() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [creatingPhases, setCreatingPhases] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [previousData, setPreviousData] = useState(null);
  const queryClient = useQueryClient();

  const { data: auditResults, isLoading, error, refetch } = useQuery({
    queryKey: ["applicationAudit"],
    queryFn: async () => {
      const response = await base44.functions.invoke("auditApplication", {});
      return response.data;
    },
  });

  const handleRefresh = async () => {
    setPreviousData(auditResults);
    setLastRefresh(new Date());
    await refetch();
    toast.success("Audit actualisé");
  };

  const generateUpdatePhases = async () => {
    if (!auditResults) return;

    try {
      setCreatingPhases(true);
      let phaseNumber = 13;

      for (const section of auditResults.sections) {
        const highPriorityItems = section.items.filter(
          (item) => item.severity === "high" || item.severity === "medium"
        );

        if (highPriorityItems.length > 0) {
          await base44.entities.UpdatePhase.create({
            phase_number: phaseNumber,
            title: `Audit: ${section.category}`,
            description: `Audit et corrections pour ${section.category}. Comprend ${highPriorityItems.length} items critiques.`,
            status: "pending",
            progress: 0,
            duration_weeks: 2,
            deliverables: highPriorityItems.map((item) => item.issue),
            blockers: highPriorityItems
              .filter((item) => item.severity === "high")
              .map((item) => ({
                issue: item.issue,
                severity: "high",
                status: "open",
              })),
            color: "from-amber-500 to-orange-600",
            icon: "CheckCircle2",
          });

          phaseNumber++;
        }
      }

      queryClient.invalidateQueries({ queryKey: ["updatePhases"] });
      toast.success(`${phaseNumber - 13} phases d'audit créées`);
    } catch (error) {
      toast.error("Erreur lors de la création des phases");
      console.error(error);
    } finally {
      setCreatingPhases(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-900/30 text-red-300 border-red-700";
      case "medium":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-700";
      default:
        return "bg-blue-900/30 text-blue-300 border-blue-700";
    }
  };

  const filteredSections = auditResults?.sections.map((section) => ({
    ...section,
    items:
      severityFilter === "all"
        ? section.items
        : section.items.filter((item) => item.severity === severityFilter),
  }));

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
        <Card className="bg-red-900/20 border-red-700 max-w-md">
          <CardContent className="p-6">
            <p className="text-red-300">Erreur lors du chargement de l'audit</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">🔍 Audit Approfondi de l'Application</h1>
              <p className="text-gray-400">Analyse complète de tous les aspects de l'application</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Actualisation..." : "Actualiser"}
              </Button>
              <span className="text-sm text-gray-400">
                Dernière mise à jour: {lastRefresh.toLocaleTimeString("fr-FR")}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Change Indicator */}
        {previousData && auditResults && previousData.summary.totalIssues !== auditResults.summary.totalIssues && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg"
          >
            <p className="text-blue-300 text-sm">
              ✓ {Math.abs(auditResults.summary.totalIssues - previousData.summary.totalIssues)} problème(s) {auditResults.summary.totalIssues < previousData.summary.totalIssues ? "résolu(s)" : "identifié(s)"}
            </p>
          </motion.div>
        )}

        {/* Summary Cards */}
        {auditResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8"
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-white">{auditResults.summary.totalIssues}</div>
                <div className="text-gray-400 text-sm">Problèmes détectés</div>
              </CardContent>
            </Card>
            <Card className="bg-red-900/30 border-red-700">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-red-400">{auditResults.summary.highSeverity}</div>
                <div className="text-gray-400 text-sm">Haute priorité</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-900/30 border-yellow-700">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-yellow-400">{auditResults.summary.mediumSeverity}</div>
                <div className="text-gray-400 text-sm">Moyenne priorité</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-900/30 border-blue-700">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-400">{auditResults.summary.lowSeverity}</div>
                <div className="text-gray-400 text-sm">Basse priorité</div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filter & Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-6 flex gap-4 flex-wrap"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded text-sm"
            >
              <option value="all">Tous les niveaux</option>
              <option value="high">Haute priorité</option>
              <option value="medium">Moyenne priorité</option>
              <option value="low">Basse priorité</option>
            </select>
          </div>

          <Button
            onClick={generateUpdatePhases}
            disabled={creatingPhases || !auditResults}
            className="bg-green-600 hover:bg-green-700 gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            {creatingPhases ? "Création en cours..." : "Créer les phases d'audit"}
          </Button>
        </motion.div>

        {/* Sections */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-slate-800 border-slate-700 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-slate-700 rounded w-1/2 mb-4" />
                  <div className="space-y-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-4 bg-slate-700 rounded w-3/4" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSections?.map((section, idx) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card
                  className={`bg-slate-800 border-slate-700 transition-all cursor-pointer ${
                    expandedSection === section.category ? "ring-2 ring-purple-500 border-purple-500" : ""
                  }`}
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === section.category ? null : section.category
                    )
                  }
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">📋</div>
                        <div>
                          <CardTitle className="text-white">{section.category}</CardTitle>
                          <p className="text-sm text-gray-400 mt-1">
                            {section.items.length} problème{section.items.length > 1 ? "s" : ""} détecté
                            {section.items.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl">
                        {expandedSection === section.category ? "▼" : "▶"}
                      </div>
                    </div>
                  </CardHeader>

                  {expandedSection === section.category && (
                    <CardContent className="border-t border-slate-700 pt-4 space-y-3">
                      {section.items.length === 0 ? (
                        <p className="text-gray-400 text-sm">Aucun problème pour ce filtre</p>
                      ) : (
                        section.items.map((item, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`p-3 rounded border flex items-start gap-3 ${getSeverityColor(
                              item.severity
                            )}`}
                          >
                            {getSeverityIcon(item.severity)}
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{item.issue}</div>
                              <div className="text-xs mt-1 opacity-75">
                                Statut: {item.status === "pending" ? "⏳ À faire" : "✓ Complété"}
                              </div>
                            </div>
                            <Badge className={`text-xs whitespace-nowrap ${getSeverityColor(item.severity)}`}>
                              {item.severity === "high"
                                ? "Critique"
                                : item.severity === "medium"
                                ? "Moyen"
                                : "Bas"}
                            </Badge>
                          </motion.div>
                        ))
                      )}
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 bg-slate-800 border border-slate-700 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold mb-1">Exporter le rapport</h3>
              <p className="text-gray-400 text-sm">
                Télécharger l'audit complet en format JSON pour analyse approfondie
              </p>
            </div>
            <Button
              onClick={() => {
                const element = document.createElement("a");
                element.setAttribute(
                  "href",
                  `data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(auditResults, null, 2)
                  )}`
                );
                element.setAttribute("download", `audit-${new Date().toISOString().split("T")[0]}.json`);
                element.style.display = "none";
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}