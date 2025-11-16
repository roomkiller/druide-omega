
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
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-purple-50/20 overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 sm:py-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="min-w-[56px] min-h-[56px] w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center">
              <Plug className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Intégrations</h1>
              <p className="text-sm text-slate-600">
                Connectez avec vos outils préférés
              </p>
            </div>
          </div>

          <ScrollArea className="w-full">
            <Tabs defaultValue="integrations" className="w-full">
              <TabsList className="inline-flex bg-white mb-6">
                <TabsTrigger value="integrations" className="min-h-[48px] touch-target flex items-center gap-2">
                  <Plug className="w-4 h-4" />
                  <span className="hidden sm:inline">Intégrations</span>
                </TabsTrigger>
                <TabsTrigger value="webhooks" className="min-h-[48px] touch-target flex items-center gap-2">
                  <Webhook className="w-4 h-4" />
                  <span className="hidden sm:inline">Webhooks</span>
                </TabsTrigger>
                <TabsTrigger value="api" className="min-h-[48px] touch-target flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  <span className="hidden sm:inline">API</span>
                </TabsTrigger>
                <TabsTrigger value="logs" className="min-h-[48px] touch-target flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span className="hidden sm:inline">Logs</span>
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[calc(100vh-280px)]">
                <TabsContent value="integrations" className="space-y-6 mt-0">
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

                <TabsContent value="webhooks" className="mt-0">
                  <WebhookManager />
                </TabsContent>

                <TabsContent value="api" className="mt-0">
                  <APIKeyManager />
                </TabsContent>

                <TabsContent value="logs" className="mt-0">
                  <IntegrationLogs />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
