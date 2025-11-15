/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Security Dashboard (Anonyma)                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";

export default function SecurityDashboard() {
  const [timeRange, setTimeRange] = useState("24h");

  const { data: securityProfiles = [], isLoading, refetch } = useQuery({
    queryKey: ["security", timeRange],
    queryFn: async () => {
      return await base44.entities.ConversationSecurity.list("-created_date", 100);
    }
  });

  const { data: events = [] } = useQuery({
    queryKey: ["security_events"],
    queryFn: async () => {
      const allEvents = await base44.entities.AnalyticsEvent.list("-created_date", 500);
      return allEvents.filter(e => 
        e.event_type === "content_filter_violation" || 
        e.event_type === "error"
      );
    }
  });

  // Calcul des métriques
  const metrics = {
    totalProfiles: securityProfiles.length,
    activeMonitoring: securityProfiles.filter(p => p.active).length,
    highRiskConversations: securityProfiles.filter(p => 
      p.content_analysis?.risk_level === "high" || 
      p.content_analysis?.risk_level === "critical"
    ).length,
    averageSecurityScore: securityProfiles.length > 0 
      ? Math.round(
          securityProfiles.reduce((acc, p) => acc + (p.security_score || 0), 0) / 
          securityProfiles.length
        )
      : 0,
    totalThreatsBlocked: securityProfiles.reduce((acc, p) => 
      acc + (p.threat_detection?.blocked_attempts || 0), 0
    ),
    recentViolations: events.length
  };

  const getRiskColor = (level) => {
    const colors = {
      none: "from-green-500 to-emerald-600",
      low: "from-blue-500 to-cyan-600",
      medium: "from-yellow-500 to-orange-600",
      high: "from-orange-500 to-red-600",
      critical: "from-red-500 to-rose-700"
    };
    return colors[level] || colors.none;
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Anonyma Security Dashboard
                </h1>
                <p className="text-sm text-slate-600">
                  Surveillance et protection en temps réel
                </p>
              </div>
            </div>
            <Button onClick={() => refetch()} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={Shield}
            label="Conversations surveillées"
            value={metrics.activeMonitoring}
            color="from-purple-500 to-indigo-600"
          />
          <MetricCard
            icon={AlertTriangle}
            label="Risques détectés"
            value={metrics.highRiskConversations}
            color="from-orange-500 to-red-600"
          />
          <MetricCard
            icon={CheckCircle}
            label="Score moyen"
            value={metrics.averageSecurityScore}
            color="from-green-500 to-emerald-600"
          />
          <MetricCard
            icon={XCircle}
            label="Menaces bloquées"
            value={metrics.totalThreatsBlocked}
            color="from-red-500 to-rose-600"
          />
        </div>

        {/* Security Profiles */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Conversations à risque
            </h3>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {securityProfiles
                  .filter(p => p.content_analysis?.risk_level !== "none")
                  .slice(0, 10)
                  .map((profile) => (
                    <motion.div
                      key={profile.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-xl border border-slate-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className={`bg-gradient-to-r ${getRiskColor(profile.content_analysis?.risk_level)} text-white border-0`}
                            >
                              {profile.content_analysis?.risk_level}
                            </Badge>
                            <Badge variant="secondary">
                              Score: {profile.security_score}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 truncate">
                            ID: {profile.conversation_id}
                          </p>
                        </div>
                        {profile.encryption_enabled && (
                          <Lock className="w-4 h-4 text-green-600" />
                        )}
                      </div>

                      {profile.content_analysis?.detected_categories?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {profile.content_analysis.detected_categories.map((cat, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {cat.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-slate-500 mt-2">
                        Audit: {new Date(profile.last_security_audit).toLocaleString("fr-FR")}
                      </div>
                    </motion.div>
                  ))}
                
                {securityProfiles.filter(p => p.content_analysis?.risk_level !== "none").length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>Aucune conversation à risque détectée</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* Recent Security Events */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-600" />
              Événements récents
            </h3>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {events.slice(0, 20).map((event, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {event.event_type}
                          </Badge>
                          {event.metadata?.threat_level && (
                            <Badge
                              variant="destructive"
                              className="text-xs uppercase"
                            >
                              {event.metadata.threat_level}
                            </Badge>
                          )}
                        </div>
                        {event.metadata?.violations && (
                          <p className="text-xs text-slate-700">
                            {event.metadata.violations.length} violation(s) détectée(s)
                          </p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(event.created_date).toLocaleString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {events.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>Aucun événement de sécurité</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Security Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Statistiques de sécurité
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox
              label="Chiffrement actif"
              value={`${securityProfiles.filter(p => p.encryption_enabled).length}/${metrics.totalProfiles}`}
              percentage={metrics.totalProfiles > 0 ? Math.round((securityProfiles.filter(p => p.encryption_enabled).length / metrics.totalProfiles) * 100) : 0}
            />
            <StatBox
              label="Anonymisation"
              value={`${securityProfiles.filter(p => p.anonymization_enabled).length}/${metrics.totalProfiles}`}
              percentage={metrics.totalProfiles > 0 ? Math.round((securityProfiles.filter(p => p.anonymization_enabled).length / metrics.totalProfiles) * 100) : 0}
            />
            <StatBox
              label="Surveillance active"
              value={`${metrics.activeMonitoring}/${metrics.totalProfiles}`}
              percentage={metrics.totalProfiles > 0 ? Math.round((metrics.activeMonitoring / metrics.totalProfiles) * 100) : 0}
            />
            <StatBox
              label="Conformité RGPD"
              value={`${securityProfiles.filter(p => p.compliance?.gdpr_compliant).length}/${metrics.totalProfiles}`}
              percentage={metrics.totalProfiles > 0 ? Math.round((securityProfiles.filter(p => p.compliance?.gdpr_compliant).length / metrics.totalProfiles) * 100) : 0}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card className="p-4">
        <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-600">{label}</div>
      </Card>
    </motion.div>
  );
}

function StatBox({ label, value, percentage }) {
  return (
    <div className="p-4 bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-xl border border-slate-200">
      <div className="text-sm font-medium text-slate-700 mb-2">{label}</div>
      <div className="text-xl font-bold text-slate-900 mb-2">{value}</div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-slate-600 mt-1">{percentage}%</div>
    </div>
  );
}