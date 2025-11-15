/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Module Configuration Dialog                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function ModuleConfigDialog({ module, onClose }) {
  const [config, setConfig] = useState(module.config || {});
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.AIModule.update(module.id, { config });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiModules'] });
      onClose();
    }
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configuration: {module.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Sensibilité</Label>
            <Input
              type="range"
              min="0"
              max="100"
              value={config.sensitivity || 50}
              onChange={(e) => setConfig({ ...config, sensitivity: e.target.value })}
            />
            <p className="text-xs text-slate-600 mt-1">{config.sensitivity || 50}%</p>
          </div>

          <div>
            <Label>Mode d'exécution</Label>
            <select
              value={config.mode || "auto"}
              onChange={(e) => setConfig({ ...config, mode: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="auto">Automatique</option>
              <option value="manual">Manuel</option>
              <option value="scheduled">Programmé</option>
            </select>
          </div>

          <Button onClick={() => updateMutation.mutate()} className="w-full bg-purple-600">
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}