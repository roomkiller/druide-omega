/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Integration Card                                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function IntegrationCard({ integration, existingIntegration }) {
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const queryClient = useQueryClient();

  const connectMutation = useMutation({
    mutationFn: async (config) => {
      if (existingIntegration) {
        return base44.entities.Integration.update(existingIntegration.id, {
          status: "active",
          credentials: { api_key: config.apiKey }
        });
      }
      return base44.entities.Integration.create({
        name: integration.name,
        type: integration.type,
        status: "active",
        credentials: { api_key: config.apiKey },
        permissions: integration.permissions
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      setShowConfig(false);
      setApiKey("");
    }
  });

  const disconnectMutation = useMutation({
    mutationFn: () => base44.entities.Integration.update(existingIntegration.id, {
      status: "inactive"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    }
  });

  const isConnected = existingIntegration?.status === "active";

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Card className="p-4 hover:shadow-lg transition-all border-2 border-transparent hover:border-purple-200">
          <div className="text-3xl mb-3">{integration.icon}</div>
          <h3 className="font-semibold text-slate-900 mb-1">{integration.name}</h3>
          <p className="text-xs text-slate-600 mb-3">{integration.description}</p>
          
          <div className="flex items-center gap-2 mb-3">
            {integration.permissions.map((perm, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {perm}
              </Badge>
            ))}
          </div>

          {isConnected ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                Connecté
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowConfig(true)}
                  className="flex-1"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Config
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => disconnectMutation.mutate()}
                  className="flex-1"
                >
                  Déconnecter
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => setShowConfig(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600"
            >
              Connecter
            </Button>
          )}
        </Card>
      </motion.div>

      <Dialog open={showConfig} onOpenChange={setShowConfig}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurer {integration.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                API Key
              </label>
              <Input
                type="password"
                placeholder="Entrez votre clé API"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Obtenez votre clé API depuis le tableau de bord {integration.name}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Permissions requises:</p>
              {integration.permissions.map((perm, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {perm}
                </div>
              ))}
            </div>

            <Button
              onClick={() => connectMutation.mutate({ apiKey })}
              disabled={!apiKey || connectMutation.isPending}
              className="w-full"
            >
              {connectMutation.isPending ? "Connexion..." : "Confirmer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}