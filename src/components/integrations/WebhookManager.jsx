/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Webhook Manager                                            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const EVENT_TYPES = [
  { value: "message.sent", label: "Message envoyé" },
  { value: "conversation.created", label: "Conversation créée" },
  { value: "memory.created", label: "Mémoire créée" },
  { value: "knowledge.added", label: "Connaissance ajoutée" },
  { value: "thought.generated", label: "Pensée générée" },
  { value: "all", label: "Tous les événements" }
];

export default function WebhookManager() {
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ name: "", url: "", events: [] });
  const queryClient = useQueryClient();

  const { data: webhooks = [] } = useQuery({
    queryKey: ["webhooks"],
    queryFn: () => base44.entities.Webhook.list("-created_date", 50),
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Webhook.create({
      ...data,
      secret: Math.random().toString(36).substring(2, 15)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      setShowCreate(false);
      setFormData({ name: "", url: "", events: [] });
    }
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }) => base44.entities.Webhook.update(id, { active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["webhooks"] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Webhook.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["webhooks"] })
  });

  const toggleEvent = (event) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Webhooks</h2>
            <p className="text-sm text-slate-600">
              Recevez des notifications sur vos endpoints
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="bg-gradient-to-r from-purple-500 to-indigo-600">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau
          </Button>
        </div>

        {webhooks.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p>Aucun webhook configuré</p>
          </div>
        ) : (
          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-900">{webhook.name}</h3>
                      <Badge variant={webhook.active ? "default" : "secondary"}>
                        {webhook.active ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 font-mono mb-2">{webhook.url}</p>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {EVENT_TYPES.find(e => e.value === event)?.label || event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleMutation.mutate({ id: webhook.id, active: !webhook.active })}
                    >
                      {webhook.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(webhook.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-slate-500 mt-2">
                  <span>✓ {webhook.success_count || 0} succès</span>
                  <span>✗ {webhook.failure_count || 0} échecs</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nom</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Mon webhook"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">URL</label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/webhook"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Événements</label>
              <div className="space-y-2">
                {EVENT_TYPES.map((event) => (
                  <label key={event.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.events.includes(event.value)}
                      onChange={() => toggleEvent(event.value)}
                      className="rounded"
                    />
                    <span className="text-sm">{event.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button
              onClick={() => createMutation.mutate(formData)}
              disabled={!formData.name || !formData.url || formData.events.length === 0}
              className="w-full"
            >
              Créer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}