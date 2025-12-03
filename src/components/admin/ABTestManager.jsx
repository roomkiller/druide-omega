/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - A/B Test Manager                                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Play, Pause, Trophy, BarChart3, Plus, Trash2, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ABTestManager() {
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTest, setNewTest] = useState({
    test_name: '',
    description: '',
    variants: [
      { id: 'A', name: 'Contrôle', traffic_percentage: 50 },
      { id: 'B', name: 'Variante B', traffic_percentage: 50 }
    ]
  });

  const { data: tests = [] } = useQuery({
    queryKey: ['abTests'],
    queryFn: () => base44.entities.ABTest.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ABTest.create({
      ...data,
      status: 'draft',
      created_at: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abTests'] });
      setShowCreateDialog(false);
      setNewTest({ test_name: '', description: '', variants: [{ id: 'A', name: 'Contrôle', traffic_percentage: 50 }, { id: 'B', name: 'Variante B', traffic_percentage: 50 }] });
      toast.success('Test A/B créé avec succès');
    }
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.ABTest.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abTests'] });
      toast.success('Statut mis à jour');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ABTest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abTests'] });
      toast.success('Test supprimé');
    }
  });

  const declareWinnerMutation = useMutation({
    mutationFn: ({ id, winner }) => base44.entities.ABTest.update(id, { 
      status: 'completed', 
      winner_variant: winner,
      completed_at: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abTests'] });
      toast.success('Gagnant déclaré!');
    }
  });

  const addVariant = () => {
    const nextId = String.fromCharCode(65 + newTest.variants.length);
    const newPercentage = Math.floor(100 / (newTest.variants.length + 1));
    const updatedVariants = newTest.variants.map(v => ({ ...v, traffic_percentage: newPercentage }));
    setNewTest({
      ...newTest,
      variants: [...updatedVariants, { id: nextId, name: `Variante ${nextId}`, traffic_percentage: newPercentage }]
    });
  };

  const statusConfig = {
    draft: { color: "bg-slate-100 text-slate-700", label: "Brouillon" },
    active: { color: "bg-green-100 text-green-700", label: "Actif" },
    paused: { color: "bg-yellow-100 text-yellow-700", label: "Pausé" },
    completed: { color: "bg-blue-100 text-blue-700", label: "Terminé" }
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl">A/B Tests</h3>
              <p className="text-sm text-slate-600">{tests.length} test(s) configuré(s)</p>
            </div>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600">
            <Plus className="w-4 h-4 mr-2" />
            Créer un test
          </Button>
        </div>

        <div className="space-y-4">
          {tests.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="font-semibold">{test.test_name}</h4>
                      <Badge className={statusConfig[test.status]?.color}>
                        {statusConfig[test.status]?.label}
                      </Badge>
                      {test.winner_variant && (
                        <Badge className="bg-yellow-500 text-white">
                          <Trophy className="w-3 h-3 mr-1" />
                          Gagnant: {test.winner_variant}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 mb-3">{test.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {test.variants?.map(variant => (
                        <div key={variant.id} className="flex items-center gap-1">
                          <Badge variant="outline">
                            {variant.name} ({variant.traffic_percentage}%)
                          </Badge>
                          {test.status === 'active' && !test.winner_variant && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs text-green-600 hover:text-green-700"
                              onClick={() => declareWinnerMutation.mutate({ id: test.id, winner: variant.id })}
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {test.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleMutation.mutate({ id: test.id, status: 'paused' })}
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                    )}
                    {(test.status === 'draft' || test.status === 'paused') && (
                      <Button
                        size="sm"
                        onClick={() => toggleMutation.mutate({ id: test.id, status: 'active' })}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => deleteMutation.mutate(test.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {tests.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-3 text-slate-300" />
              <p className="mb-4">Aucun test A/B configuré</p>
              <Button variant="outline" onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer votre premier test
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Dialog de création */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Créer un nouveau test A/B</DialogTitle>
            <DialogDescription>
              Configurez les variantes et la répartition du trafic
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nom du test</label>
              <Input
                placeholder="Ex: Nouveau bouton CTA"
                value={newTest.test_name}
                onChange={(e) => setNewTest({ ...newTest, test_name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea
                placeholder="Décrivez l'objectif du test..."
                value={newTest.description}
                onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Variantes</label>
                <Button size="sm" variant="outline" onClick={addVariant}>
                  <Plus className="w-3 h-3 mr-1" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-2">
                {newTest.variants.map((variant, idx) => (
                  <div key={variant.id} className="flex items-center gap-2">
                    <Badge variant="outline" className="w-8">{variant.id}</Badge>
                    <Input
                      value={variant.name}
                      onChange={(e) => {
                        const updated = [...newTest.variants];
                        updated[idx].name = e.target.value;
                        setNewTest({ ...newTest, variants: updated });
                      }}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={variant.traffic_percentage}
                      onChange={(e) => {
                        const updated = [...newTest.variants];
                        updated[idx].traffic_percentage = parseInt(e.target.value) || 0;
                        setNewTest({ ...newTest, variants: updated });
                      }}
                      className="w-20"
                      min={0}
                      max={100}
                    />
                    <span className="text-sm text-slate-500">%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Annuler</Button>
            <Button
              onClick={() => createMutation.mutate(newTest)}
              disabled={!newTest.test_name || createMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Créer le test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}