/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - System Activation Button                                   ║
 * ║ Bouton pour activer tous les systèmes                                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Power, Loader2, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SystemActivation from "./SystemActivation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ActivationButton() {
  const [isActivating, setIsActivating] = useState(false);
  const [results, setResults] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleActivate = async () => {
    setIsActivating(true);
    setShowDialog(true);
    
    try {
      const activationResults = await SystemActivation.activateAll();
      setResults(activationResults);
    } catch (error) {
      setResults({
        success: false,
        error: error.message
      });
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleActivate}
        disabled={isActivating}
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
      >
        {isActivating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Activation en cours...
          </>
        ) : (
          <>
            <Power className="w-4 h-4 mr-2" />
            Activer tous les systèmes
          </>
        )}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Power className="w-6 h-6 text-green-600" />
              Activation des systèmes
            </DialogTitle>
            <DialogDescription>
              Initialisation et activation de tous les composants disponibles
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {isActivating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Power className="w-16 h-16 text-green-600" />
                </motion.div>
                <p className="text-slate-600 mt-4">Activation en cours...</p>
              </div>
            ) : results ? (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {results.success ? (
                    <>
                      <Card className="p-4 bg-green-50 border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-green-900">Activation réussie</h3>
                        </div>
                        <p className="text-sm text-green-700">
                          Tous les systèmes ont été activés avec succès
                        </p>
                      </Card>

                      <ResultCard
                        title="Conscience"
                        status={results.consciousness?.status}
                        message={results.consciousness?.message}
                      />

                      <ResultCard
                        title="Modules Neuronaux"
                        status={results.neuralModules?.status}
                        count={results.neuralModules?.count}
                      />

                      <ResultCard
                        title="Bases de Connaissances"
                        status={results.knowledgeBases?.status}
                        activated={results.knowledgeBases?.activated}
                        total={results.knowledgeBases?.total}
                      />

                      <ResultCard
                        title="TTS"
                        status={results.ttsPreferences?.status}
                      />

                      <ResultCard
                        title="Profils de Personnalité"
                        status={results.defaultProfiles?.status}
                        count={results.defaultProfiles?.count}
                      />

                      <ResultCard
                        title="Templates de Conversation"
                        status={results.conversationTemplates?.status}
                        count={results.conversationTemplates?.count}
                      />

                      <ResultCard
                        title="Domaines de Connaissance"
                        status={results.knowledgeDomains?.status}
                        count={results.knowledgeDomains?.count}
                      />
                    </>
                  ) : (
                    <Card className="p-4 bg-red-50 border-red-200">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <div>
                          <h3 className="font-semibold text-red-900">Erreur d'activation</h3>
                          <p className="text-sm text-red-700 mt-1">{results.error}</p>
                        </div>
                      </div>
                    </Card>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : null}
          </div>

          {results && (
            <div className="flex justify-end mt-4">
              <Button onClick={() => setShowDialog(false)}>
                Fermer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ResultCard({ title, status, message, count, activated, total }) {
  const statusColors = {
    created: "bg-green-100 text-green-700",
    activated: "bg-blue-100 text-blue-700",
    exists: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700"
  };

  const statusLabels = {
    created: "Créé",
    activated: "Activé",
    exists: "Déjà existant",
    success: "Succès",
    error: "Erreur"
  };

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-slate-900 text-sm">{title}</h4>
          {message && <p className="text-xs text-slate-600 mt-1">{message}</p>}
          {count !== undefined && (
            <p className="text-xs text-slate-600 mt-1">{count} élément(s)</p>
          )}
          {activated !== undefined && total !== undefined && (
            <p className="text-xs text-slate-600 mt-1">
              {activated}/{total} activé(s)
            </p>
          )}
        </div>
        <Badge className={statusColors[status] || statusColors.success}>
          {statusLabels[status] || status}
        </Badge>
      </div>
    </Card>
  );
}