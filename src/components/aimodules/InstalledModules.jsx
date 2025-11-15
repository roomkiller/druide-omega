/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Installed Modules Manager                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "@/components/utils/LanguageContext";
import ModuleConfigDialog from "./ModuleConfigDialog";

export default function InstalledModules({ modules }) {
  const { t } = useLanguage();
  const [configModule, setConfigModule] = useState(null);
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }) => {
      return await base44.entities.AIModule.update(id, { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiModules'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await base44.entities.AIModule.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiModules'] });
    }
  });

  if (modules.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-slate-600">{t('aiModuleStore.noModules')}</p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {modules.map(module => (
          <Card key={module.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold">{module.name}</h3>
                  <Badge variant="outline">{module.category}</Badge>
                  <Badge variant={module.enabled ? "default" : "secondary"}>
                    {module.enabled ? t('aiModuleStore.enabled') : t('aiModuleStore.disabled')}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">v{module.version}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={module.enabled}
                  onCheckedChange={(enabled) => 
                    toggleMutation.mutate({ id: module.id, enabled })
                  }
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConfigModule(module)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteMutation.mutate(module.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {configModule && (
        <ModuleConfigDialog
          module={configModule}
          onClose={() => setConfigModule(null)}
        />
      )}
    </>
  );
}