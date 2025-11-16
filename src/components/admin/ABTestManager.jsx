/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - A/B Test Manager                                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, Trophy, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export default function ABTestManager() {
  const queryClient = useQueryClient();

  const { data: tests = [] } = useQuery({
    queryKey: ['abTests'],
    queryFn: () => base44.entities.ABTest.list('-created_date')
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.ABTest.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abTests'] });
    }
  });

  const statusConfig = {
    draft: { color: "bg-slate-100 text-slate-700", label: "Brouillon" },
    active: { color: "bg-green-100 text-green-700", label: "Actif" },
    paused: { color: "bg-yellow-100 text-yellow-700", label: "Pausé" },
    completed: { color: "bg-blue-100 text-blue-700", label: "Terminé" }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-purple-600" />
          <h3 className="font-bold text-xl">A/B Tests</h3>
        </div>
        <Button>Créer un test</Button>
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
                  <div className="flex items-center gap-2 mb-2">
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
                      <Badge key={variant.id} variant="outline">
                        {variant.name} ({variant.traffic_percentage}%)
                      </Badge>
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
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {tests.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <BarChart3 className="w-16 h-16 mx-auto mb-3 text-slate-300" />
            <p>Aucun test A/B configuré</p>
          </div>
        )}
      </div>
    </Card>
  );
}