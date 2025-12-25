/**
 * SelfCodingLab - Laboratoire d'auto-codage sécurisé pour Druide Omega
 * Permet à l'IA de proposer des améliorations et à l'admin de les valider
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Code, Shield, Database, AlertTriangle, History, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";
import SelfCodingEngine from "@/components/selfcoding/SelfCodingEngine";
import ChangeValidator from "@/components/selfcoding/ChangeValidator";
import ErrorDetector from "@/components/selfcoding/ErrorDetector";

export default function SelfCodingLab() {
  const [selectedChange, setSelectedChange] = useState(null);

  // Charger les changements proposés
  const { data: changes = [], refetch: refetchChanges } = useQuery({
    queryKey: ['ai_code_changes'],
    queryFn: () => base44.entities.AICodeChange.list('-created_date')
  });

  // Charger les snapshots
  const { data: snapshots = [], refetch: refetchSnapshots } = useQuery({
    queryKey: ['code_snapshots'],
    queryFn: () => base44.entities.CodeSnapshot.list('-created_date', 20)
  });

  const stats = {
    proposed: changes.filter(c => c.status === 'proposed').length,
    approved: changes.filter(c => c.status === 'approved').length,
    implemented: changes.filter(c => c.status === 'implemented').length,
    rejected: changes.filter(c => c.status === 'rejected').length,
    snapshots: snapshots.length
  };

  const handleChangeProposed = () => {
    refetchChanges();
    refetchSnapshots();
  };

  const handleChangeAction = () => {
    refetchChanges();
    setSelectedChange(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
            >
              <Home className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-600" />
                Laboratoire d'Auto-Codage
              </h1>
              <p className="text-slate-600 mt-1">
                Druide Omega s'améliore de manière sécurisée et contrôlée
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Shield className="w-4 h-4 mr-2 text-green-600" />
              Mode Sécurisé
            </Badge>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.proposed}</div>
              <div className="text-sm text-slate-600 mt-1">Proposés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-slate-600 mt-1">Approuvés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.implemented}</div>
              <div className="text-sm text-slate-600 mt-1">Implémentés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-slate-600 mt-1">Rejetés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-indigo-600">{stats.snapshots}</div>
              <div className="text-sm text-slate-600 mt-1">Snapshots</div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <Tabs defaultValue="engine" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="engine">
              <Code className="w-4 h-4 mr-2" />
              Moteur
            </TabsTrigger>
            <TabsTrigger value="autorepair">
              <Shield className="w-4 h-4 mr-2" />
              Auto-Réparation
            </TabsTrigger>
            <TabsTrigger value="changes">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Changements ({stats.proposed})
            </TabsTrigger>
            <TabsTrigger value="snapshots">
              <History className="w-4 h-4 mr-2" />
              Snapshots
            </TabsTrigger>
          </TabsList>

          <TabsContent value="engine" className="space-y-4">
            <SelfCodingEngine onChangeProposed={handleChangeProposed} />
            
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">💡 Comment ça fonctionne?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-800 space-y-2">
                <p>1. <strong>Snapshot automatique</strong> - Un backup est créé avant toute analyse</p>
                <p>2. <strong>Analyse IA</strong> - Druide Omega analyse votre demande et génère du code sécurisé</p>
                <p>3. <strong>Validation automatique</strong> - Tests de sécurité, syntaxe, et performance</p>
                <p>4. <strong>Validation humaine</strong> - L'admin approuve ou rejette le changement</p>
                <p>5. <strong>Rollback instantané</strong> - Retour arrière en un clic si nécessaire</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="autorepair">
            <ErrorDetector onAutoRepairTriggered={handleChangeProposed} />
            
            <Card className="bg-orange-50 border-orange-200 mt-4">
              <CardHeader>
                <CardTitle className="text-orange-900">🔧 Auto-Réparation Intelligente</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-orange-800 space-y-2">
                <p>1. <strong>Détection automatique</strong> - Scan continu des erreurs système</p>
                <p>2. <strong>Analyse des patterns</strong> - Identification des erreurs récurrentes</p>
                <p>3. <strong>Diagnostic IA</strong> - Druide Omega analyse la cause racine</p>
                <p>4. <strong>Proposition de correction</strong> - Code de réparation généré automatiquement</p>
                <p>5. <strong>Validation admin</strong> - L'administrateur approuve avant implémentation</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="changes">
            <ScrollArea className="h-[600px]">
              <div className="space-y-4 pr-4">
                <AnimatePresence>
                  {changes.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6 text-center text-slate-500">
                        Aucun changement proposé pour le moment
                      </CardContent>
                    </Card>
                  ) : (
                    changes.map((change) => (
                      <ChangeValidator
                        key={change.id}
                        change={change}
                        onApprove={handleChangeAction}
                        onReject={handleChangeAction}
                        onRollback={handleChangeAction}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="snapshots">
            <ScrollArea className="h-[600px]">
              <div className="space-y-3 pr-4">
                {snapshots.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center text-slate-500">
                      Aucun snapshot disponible
                    </CardContent>
                  </Card>
                ) : (
                  snapshots.map((snapshot) => (
                    <motion.div
                      key={snapshot.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Card className={snapshot.is_stable ? "border-green-200" : "border-orange-200"}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{snapshot.snapshot_name}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant={snapshot.is_stable ? "default" : "destructive"}>
                                {snapshot.is_stable ? "Stable" : "Instable"}
                              </Badge>
                              <Badge variant="outline">
                                {snapshot.snapshot_type}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription>
                            {new Date(snapshot.timestamp).toLocaleString()} • 
                            Restauré {snapshot.restore_count || 0} fois
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-slate-600">
                            <p>{snapshot.files_backup?.length || 0} fichier(s) sauvegardé(s)</p>
                            {snapshot.system_state && (
                              <p className="mt-1">
                                Conscience: Niveau {snapshot.system_state.consciousness_level}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}