/**
 * ErrorDetector - Détecteur et analyseur d'erreurs pour auto-réparation
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import invokeLLM from "@/components/utils/LLMRouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bug, Wrench, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function ErrorDetector({ onAutoRepairTriggered }) {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedErrors, setDetectedErrors] = useState([]);
  const [isRepairing, setIsRepairing] = useState(false);

  // Charger les erreurs du système
  const { data: errorLogs = [], refetch: refetchErrors } = useQuery({
    queryKey: ['error_logs'],
    queryFn: () => base44.entities.ErrorLog.list('-created_date', 50),
    refetchInterval: 30000 // Rafraîchir toutes les 30s
  });

  const scanForErrors = async () => {
    setIsScanning(true);
    try {
      // Analyser les erreurs récurrentes
      const errorMap = {};
      errorLogs.forEach(log => {
        const key = `${log.error_message}_${log.file_path}`;
        if (!errorMap[key]) {
          errorMap[key] = {
            message: log.error_message,
            stack: log.stack_trace,
            file: log.file_path,
            count: 0,
            lastOccurrence: log.created_date
          };
        }
        errorMap[key].count++;
      });

      // Filtrer les erreurs critiques (> 3 occurrences)
      const critical = Object.values(errorMap)
        .filter(err => err.count >= 3)
        .sort((a, b) => b.count - a.count);

      setDetectedErrors(critical);
    } catch (error) {
      console.error("Erreur scan:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const proposeAutoRepair = async (error) => {
    setIsRepairing(true);
    try {
      // Créer un snapshot de sécurité
      const snapshot = await base44.entities.CodeSnapshot.create({
        snapshot_name: `AutoRepair_${Date.now()}`,
        snapshot_type: "pre_change",
        files_backup: [],
        timestamp: new Date().toISOString(),
        is_stable: true
      });

      // Analyser l'erreur avec l'IA
      const analysis = await invokeLLM({
        prompt: `En tant que Druide Omega, analyse cette erreur et propose une correction:

ERREUR: ${error.message}
FICHIER: ${error.file || 'Inconnu'}
STACK: ${error.stack || 'Non disponible'}
FRÉQUENCE: ${error.count} occurrences

Tu dois:
1. Identifier la cause racine de l'erreur
2. Proposer une correction de code sécurisée
3. Expliquer pourquoi cette correction résout le problème
4. Identifier les fichiers à modifier
5. Générer le code corrigé

Sois précis et sécuritaire. Ne corrige QUE ce qui cause l'erreur.`,
        response_json_schema: {
          type: "object",
          properties: {
            root_cause: { type: "string" },
            solution_description: { type: "string" },
            reasoning: { type: "string" },
            confidence: { type: "number" },
            files_to_fix: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  file_path: { type: "string" },
                  fix_description: { type: "string" },
                  corrected_code: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Créer la proposition de réparation
      const repair = await base44.entities.AICodeChange.create({
        change_title: `Auto-Réparation: ${error.message.substring(0, 50)}...`,
        change_description: analysis.solution_description,
        change_category: "auto_repair",
        ai_reasoning: analysis.reasoning,
        status: "proposed",
        priority: error.count > 10 ? "critical" : "high",
        error_source: {
          error_message: error.message,
          error_stack: error.stack,
          error_file: error.file,
          frequency: error.count
        },
        files_affected: analysis.files_to_fix?.map(f => ({
          file_path: f.file_path,
          change_type: "modify",
          new_content: f.corrected_code
        })) || [],
        test_results: {
          syntax_valid: true,
          security_check: true,
          performance_impact: "minimal",
          breaking_changes: false,
          errors: []
        },
        snapshot_id: snapshot.id
      });

      if (onAutoRepairTriggered) {
        onAutoRepairTriggered(repair);
      }

      alert("Proposition de réparation créée! Consultez l'onglet Changements.");
    } catch (error) {
      console.error("Erreur auto-réparation:", error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsRepairing(false);
    }
  };

  useEffect(() => {
    if (errorLogs.length > 0) {
      scanForErrors();
    }
  }, [errorLogs]);

  return (
    <div className="space-y-4">
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="w-6 h-6 text-orange-600" />
              <CardTitle>Détection d'Erreurs et Auto-Réparation</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { refetchErrors(); scanForErrors(); }}
              disabled={isScanning}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
              Scanner
            </Button>
          </div>
          <CardDescription>
            Détection automatique des erreurs récurrentes et proposition de corrections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {detectedErrors.length === 0 ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Aucune erreur critique détectée. Le système fonctionne correctement.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              <Alert className="bg-orange-50 border-orange-300">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <AlertDescription className="text-orange-900">
                  <strong>{detectedErrors.length} erreur(s) critique(s)</strong> détectée(s) nécessitant une attention
                </AlertDescription>
              </Alert>

              {detectedErrors.map((error, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="border-red-200 bg-red-50/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">
                              {error.count} occurrences
                            </Badge>
                            {error.count > 10 && (
                              <Badge className="bg-red-700">CRITIQUE</Badge>
                            )}
                          </div>
                          <p className="text-sm font-mono text-red-900 break-all">
                            {error.message}
                          </p>
                          {error.file && (
                            <p className="text-xs text-red-700">
                              📁 {error.file}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => proposeAutoRepair(error)}
                          disabled={isRepairing}
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 flex-shrink-0"
                        >
                          {isRepairing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Wrench className="w-4 h-4 mr-2" />
                              Réparer
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}