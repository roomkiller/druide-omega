/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Security Monitor (Anonyma Integration)                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Lock, Eye, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import { navigateTo } from "@/lib/spaNavigate";

export default function SecurityMonitor({ conversationId, messages = [] }) {
  const [securityStatus, setSecurityStatus] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (conversationId && messages.length > 0) {
      analyzeSecurity();
    }
  }, [conversationId, messages]);

  const analyzeSecurity = async () => {
    setScanning(true);
    
    try {
      // Analyse du contenu des messages
      const analysis = await analyzeMessages(messages);
      
      // Créer ou mettre à jour le profil de sécurité
      const existing = await base44.entities.ConversationSecurity.filter(
        { conversation_id: conversationId },
        "-created_date",
        1
      );

      if (existing.length > 0) {
        await base44.entities.ConversationSecurity.update(existing[0].id, {
          content_analysis: analysis,
          security_score: calculateSecurityScore(analysis),
          last_security_audit: new Date().toISOString()
        });
        const updated = await base44.entities.ConversationSecurity.filter(
          { conversation_id: conversationId },
          "-created_date",
          1
        );
        setSecurityStatus(updated[0]);
      } else {
        const newSecurity = await base44.entities.ConversationSecurity.create({
          conversation_id: conversationId,
          security_level: "medium",
          encryption_enabled: true,
          content_analysis: analysis,
          security_score: calculateSecurityScore(analysis),
          anonyma_config: {
            enabled: true,
            auto_moderate: true,
            alert_threshold: "medium"
          }
        });
        setSecurityStatus(newSecurity);
      }

      // Générer des alertes si nécessaire
      if (analysis.risk_level !== "none") {
        setAlerts([{
          type: analysis.risk_level,
          message: `Contenu sensible détecté: ${analysis.detected_categories.join(", ")}`,
          timestamp: new Date()
        }]);
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error("Erreur analyse sécurité:", error);
    } finally {
      setScanning(false);
    }
  };

  const analyzeMessages = async (messages) => {
    const sensitivePatterns = {
      personal_info: /\b(?:email|téléphone|adresse|numéro|carte|identité)\b/gi,
      financial_data: /\b(?:banque|compte|iban|swift|carte bancaire|crypto)\b/gi,
      health_info: /\b(?:maladie|médical|santé|traitement|médicament)\b/gi,
      credentials: /\b(?:mot de passe|password|token|api key|secret)\b/gi,
      malicious_content: /\b(?:hack|exploit|injection|malware|virus)\b/gi
    };

    const detected = [];
    const flagged = [];
    let highestRisk = "none";

    messages.forEach((msg, idx) => {
      if (!msg.content) return;
      
      const content = msg.content.toLowerCase();
      
      Object.entries(sensitivePatterns).forEach(([category, pattern]) => {
        if (pattern.test(content)) {
          if (!detected.includes(category)) {
            detected.push(category);
          }
          
          flagged.push({
            message_index: idx,
            category,
            severity: getSeverity(category),
            auto_redacted: false
          });

          const severity = getSeverity(category);
          if (getRiskLevel(severity) > getRiskLevel(highestRisk)) {
            highestRisk = severity;
          }
        }
      });
    });

    return {
      sensitive_data_detected: detected.length > 0,
      risk_level: highestRisk,
      detected_categories: detected,
      flagged_messages: flagged
    };
  };

  const getSeverity = (category) => {
    const severityMap = {
      credentials: "critical",
      financial_data: "high",
      health_info: "high",
      malicious_content: "high",
      personal_info: "medium",
      inappropriate_content: "medium"
    };
    return severityMap[category] || "low";
  };

  const getRiskLevel = (severity) => {
    const levels = { none: 0, low: 1, medium: 2, high: 3, critical: 4 };
    return levels[severity] || 0;
  };

  const calculateSecurityScore = (analysis) => {
    let score = 100;
    
    if (analysis.risk_level === "critical") score -= 50;
    else if (analysis.risk_level === "high") score -= 30;
    else if (analysis.risk_level === "medium") score -= 15;
    else if (analysis.risk_level === "low") score -= 5;

    score -= analysis.detected_categories.length * 5;
    
    return Math.max(0, Math.min(100, score));
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

  const getRiskIcon = (level) => {
    if (level === "none") return CheckCircle;
    if (level === "low" || level === "medium") return AlertTriangle;
    return XCircle;
  };

  if (!conversationId || messages.length === 0) {
    return null;
  }

  if (!securityStatus) {
    return (
      <Card className="p-4 bg-gradient-to-br from-slate-50 to-purple-50/20 border border-slate-200">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-purple-600 animate-pulse" />
          <span className="text-sm text-slate-600">Initialisation Anonyma Security...</span>
        </div>
      </Card>
    );
  }

  const riskLevel = securityStatus.content_analysis?.risk_level || "none";
  const RiskIcon = getRiskIcon(riskLevel);

  return (
    <div className="space-y-3">
      {/* Status Card */}
      <Card className="p-4 bg-gradient-to-br from-slate-50 to-purple-50/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 bg-gradient-to-br ${getRiskColor(riskLevel)} rounded-xl flex items-center justify-center shadow-lg`}>
              <RiskIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Anonyma Security</h3>
              <p className="text-xs text-slate-600">Surveillance active</p>
            </div>
          </div>

          {scanning && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Eye className="w-5 h-5 text-purple-600" />
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{securityStatus.security_score}</div>
            <div className="text-xs text-slate-600">Score</div>
          </div>
          <div className="text-center">
            <Badge variant={riskLevel === "none" ? "default" : "destructive"} className="uppercase">
              {riskLevel}
            </Badge>
            <div className="text-xs text-slate-600 mt-1">Risque</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Lock className="w-4 h-4 text-green-600" />
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-xs text-slate-600 mt-1">Chiffré</div>
          </div>
        </div>

        {securityStatus.content_analysis?.detected_categories?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {securityStatus.content_analysis.detected_categories.map((cat, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {cat.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Alerts */}
      <AnimatePresence>
        {alerts.map((alert, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="p-3 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{alert.message}</p>
                  <p className="text-xs text-slate-600 mt-1">
                    {alert.timestamp.toLocaleTimeString("fr-FR")}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={analyzeSecurity}
          disabled={scanning}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          {scanning ? "Analyse..." : "Ré-analyser"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigateTo("SecurityDashboard")}
          className="flex-1"
        >
          <Shield className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
      </div>
    </div>
  );
}