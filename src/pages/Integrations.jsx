/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Integrations Management                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntegrationCard from "@/components/integrations/IntegrationCard";
import WebhookManager from "@/components/integrations/WebhookManager";
import APIKeyManager from "@/components/integrations/APIKeyManager";
import IntegrationLogs from "@/components/integrations/IntegrationLogs";
import { Plug, Webhook, Key, Activity } from "lucide-react";

const AVAILABLE_INTEGRATIONS = [
  {
    type: "slack",
    name: "Slack",
    description: "Envoyez des messages et notifications vers vos canaux Slack",
    icon: "💬",
    permissions: ["send_messages", "read_channels"]
  },
  {
    type: "google_workspace",
    name: "Google Workspace",
    description: "Synchronisez avec Gmail, Calendar, Drive",
    icon: "📧",
    permissions: ["read_calendar", "send_email", "access_drive"]
  },
  {
    type: "github",
    name: "GitHub",
    description: "Créez des issues, commentez sur les PRs",
    icon: "🐙",
    permissions: ["read_repos", "write_issues"]
  },
  {
    type: "discord",
    name: "Discord",
    description: "Envoyez des messages sur vos serveurs Discord",
    icon: "🎮",
    permissions: ["send_messages", "manage_webhooks"]
  },
  {
    type: "zapier",
    name: "Zapier",
    description: "Connectez avec 5000+ applications",
    icon: "⚡",
    permissions: ["trigger_zaps"]
  }
];

export default function Integrations() {
  const queryClient = useQueryClient();
  
  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ["integrations"],
    queryFn: () => base44.entities.Integration.list("-created_date", 50),
    initialData: []
  });

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-50 to-purple-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Plug className="w-8 h-8 text-purple-600" />
            Intégrations
          </h1>
          <p className="text-sm text-slate-600">
            Connectez Druide Omega avec vos outils et plateformes préférés
          </p>
        </div>

        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Plug className="w-4 h-4" />
              <span className="hidden sm:inline">Intégrations</span>
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Webhook className="w-4 h-4" />
              <span className="hidden sm:inline">Webhooks</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Intégrations disponibles
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {AVAILABLE_INTEGRATIONS.map((integration) => (
                  <IntegrationCard
                    key={integration.type}
                    integration={integration}
                    existingIntegration={integrations.find(i => i.type === integration.type)}
                  />
                ))}
              </div>
            </Card>

            {integrations.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Intégrations actives ({integrations.filter(i => i.status === "active").length})
                </h2>
                <div className="space-y-3">
                  {integrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {AVAILABLE_INTEGRATIONS.find(i => i.type === integration.type)?.icon || "🔌"}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{integration.name}</p>
                          <p className="text-xs text-slate-500">
                            {integration.last_sync 
                              ? `Dernière sync: ${new Date(integration.last_sync).toLocaleString("fr-FR")}`
                              : "Jamais synchronisé"}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={integration.status === "active" ? "default" : "secondary"}
                      >
                        {integration.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="webhooks">
            <WebhookManager />
          </TabsContent>

          <TabsContent value="api">
            <APIKeyManager />
          </TabsContent>

          <TabsContent value="logs">
            <IntegrationLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}