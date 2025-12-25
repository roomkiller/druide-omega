/**
 * ChangeValidator - Interface de validation des changements proposés par l'IA
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, FileCode, AlertTriangle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ChangeValidator({ change, onApprove, onReject, onRollback }) {
  const [feedback, setFeedback] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await base44.entities.AICodeChange.update(change.id, {
        status: "approved",
        admin_feedback: feedback
      });
      if (onApprove) onApprove(change);
    } catch (error) {
      console.error("Erreur approbation:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await base44.entities.AICodeChange.update(change.id, {
        status: "rejected",
        admin_feedback: feedback
      });
      if (onReject) onReject(change);
    } catch (error) {
      console.error("Erreur rejet:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRollback = async () => {
    if (!confirm("Êtes-vous sûr de vouloir annuler ce changement?")) return;
    
    setIsProcessing(true);
    try {
      // Restaurer le snapshot
      if (change.snapshot_id) {
        const snapshot = await base44.entities.CodeSnapshot.list();
        const targetSnapshot = snapshot.find(s => s.id === change.snapshot_id);
        
        if (targetSnapshot) {
          await base44.entities.CodeSnapshot.update(targetSnapshot.id, {
            restore_count: (targetSnapshot.restore_count || 0) + 1
          });
        }
      }
      
      await base44.entities.AICodeChange.update(change.id, {
        status: "rolled_back",
        rollback_reason: feedback
      });
      
      if (onRollback) onRollback(change);
    } catch (error) {
      console.error("Erreur rollback:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800"
  };

  const statusColors = {
    proposed: "bg-gray-100 text-gray-800",
    analyzing: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    implemented: "bg-purple-100 text-purple-800",
    rolled_back: "bg-orange-100 text-orange-800"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="w-5 h-5" />
                {change.change_title}
              </CardTitle>
              <CardDescription className="mt-2">
                {change.change_description}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Badge className={priorityColors[change.priority]}>
                {change.priority}
              </Badge>
              <Badge className={statusColors[change.status]}>
                {change.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Raisonnement de l'IA */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">🧠 Raisonnement de l'IA</h4>
            <p className="text-sm text-purple-800">{change.ai_reasoning}</p>
          </div>

          {/* Fichiers affectés */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900">📁 Fichiers affectés ({change.files_affected?.length || 0})</h4>
            <div className="space-y-1">
              {change.files_affected?.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm bg-slate-50 p-2 rounded">
                  <Badge variant="outline" className="text-xs">
                    {file.change_type}
                  </Badge>
                  <code className="text-slate-700">{file.file_path}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Tests de sécurité */}
          {change.test_results && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">🛡️ Validation de sécurité</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  {change.test_results.syntax_valid ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span>Syntaxe valide</span>
                </div>
                <div className="flex items-center gap-2">
                  {change.test_results.security_check ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  )}
                  <span>Sécurité vérifiée</span>
                </div>
                <div className="flex items-center gap-2">
                  {!change.test_results.breaking_changes ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  )}
                  <span>Pas de breaking changes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">Impact: {change.test_results.performance_impact}</span>
                </div>
              </div>
            </div>
          )}

          {/* Feedback admin */}
          <div>
            <label className="block text-sm font-semibold mb-2">💬 Votre feedback</label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Ajoutez vos commentaires..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {change.status === "proposed" && (
              <>
                <Button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approuver
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isProcessing}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rejeter
                </Button>
              </>
            )}
            
            {change.status === "implemented" && (
              <Button
                onClick={handleRollback}
                disabled={isProcessing}
                variant="outline"
                className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Rollback
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}