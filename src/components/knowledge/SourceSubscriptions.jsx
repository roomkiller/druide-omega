/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Source Subscriptions Manager                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, Plus, Trash2, RefreshCw, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SourceSubscriptions() {
  const queryClient = useQueryClient();
  const [newSubQuery, setNewSubQuery] = useState("");
  const [newSubSource, setNewSubSource] = useState("wikipedia");

  const { data: subscriptions = [] } = useQuery({
    queryKey: ['sourceSubscriptions'],
    queryFn: async () => {
      const user = await base44.auth.me();
      const subs = await base44.entities.KnowledgeBase.filter({
        category: "subscription",
        created_by: user.email
      });
      return subs;
    }
  });

  const createSubMutation = useMutation({
    mutationFn: async ({ source, query, frequency }) => {
      return await base44.entities.KnowledgeBase.create({
        name: `Subscription: ${source} - ${query}`,
        description: `Auto-update subscription`,
        content: JSON.stringify({ source, query, frequency, active: true }),
        category: "subscription",
        tags: ["subscription", source, query],
        active: true,
        metadata: {
          subscription: true,
          source,
          query,
          frequency,
          last_update: new Date().toISOString(),
          next_update: new Date(Date.now() + frequency * 60 * 60 * 1000).toISOString()
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sourceSubscriptions'] });
      setNewSubQuery("");
    }
  });

  const deleteSubMutation = useMutation({
    mutationFn: (id) => base44.entities.KnowledgeBase.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sourceSubscriptions'] });
    }
  });

  const toggleSubMutation = useMutation({
    mutationFn: async ({ id, active }) => {
      const sub = subscriptions.find(s => s.id === id);
      const content = JSON.parse(sub.content);
      return await base44.entities.KnowledgeBase.update(id, {
        content: JSON.stringify({ ...content, active }),
        active
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sourceSubscriptions'] });
    }
  });

  const refreshSubMutation = useMutation({
    mutationFn: async (id) => {
      const sub = subscriptions.find(s => s.id === id);
      const metadata = sub.metadata;
      
      return await base44.entities.KnowledgeBase.update(id, {
        metadata: {
          ...metadata,
          last_update: new Date().toISOString(),
          next_update: new Date(Date.now() + (metadata.frequency || 24) * 60 * 60 * 1000).toISOString()
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sourceSubscriptions'] });
    }
  });

  const handleCreateSubscription = () => {
    if (!newSubQuery.trim()) return;
    
    createSubMutation.mutate({
      source: newSubSource,
      query: newSubQuery,
      frequency: 24 // hours
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-purple-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">Abonnements aux Sources</h2>
            <p className="text-sm text-slate-600">Mises à jour automatiques de vos recherches favorites</p>
          </div>
        </div>

        {/* Create new subscription */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Nouvel Abonnement</h3>
          <div className="flex gap-2">
            <select
              value={newSubSource}
              onChange={(e) => setNewSubSource(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="wikipedia">Wikipedia</option>
              <option value="arxiv">arXiv</option>
              <option value="pubmed">PubMed</option>
              <option value="openstreetmap">OpenStreetMap</option>
              <option value="gutenberg">Project Gutenberg</option>
            </select>
            <Input
              placeholder="Recherche (ex: Quantum Computing)"
              value={newSubQuery}
              onChange={(e) => setNewSubQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleCreateSubscription}
              disabled={!newSubQuery.trim() || createSubMutation.isPending}
              className="bg-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              S'abonner
            </Button>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Mise à jour automatique toutes les 24h
          </p>
        </div>

        {/* Subscriptions list */}
        <div className="space-y-3">
          <AnimatePresence>
            {subscriptions.map((sub) => {
              const metadata = sub.metadata || {};
              const content = JSON.parse(sub.content || '{}');
              
              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <Card className={`p-4 ${content.active ? 'border-green-200 bg-green-50/20' : 'border-slate-200'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-purple-600 text-white">
                            {metadata.source || 'Unknown'}
                          </Badge>
                          <span className="font-semibold text-slate-900">
                            {metadata.query || 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Dernière MAJ: {metadata.last_update ? new Date(metadata.last_update).toLocaleString('fr-CA') : 'Jamais'}
                          </div>
                          <div>
                            Fréquence: {metadata.frequency || 24}h
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={content.active}
                          onCheckedChange={(checked) => 
                            toggleSubMutation.mutate({ id: sub.id, active: checked })
                          }
                        />
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => refreshSubMutation.mutate(sub.id)}
                          disabled={refreshSubMutation.isPending}
                        >
                          <RefreshCw className={`w-4 h-4 ${refreshSubMutation.isPending ? 'animate-spin' : ''}`} />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSubMutation.mutate(sub.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {subscriptions.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <BellOff className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun abonnement actif</p>
              <p className="text-xs mt-1">Créez votre premier abonnement ci-dessus</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}