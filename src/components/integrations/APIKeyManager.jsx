/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - API Key Manager                                            ║
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
import { Plus, Copy, Trash2, Eye, EyeOff } from "lucide-react";

const PERMISSIONS = [
  { value: "read:conversations", label: "Lire conversations" },
  { value: "write:conversations", label: "Écrire conversations" },
  { value: "read:knowledge", label: "Lire connaissances" },
  { value: "write:knowledge", label: "Écrire connaissances" },
  { value: "read:memories", label: "Lire mémoires" },
  { value: "write:memories", label: "Écrire mémoires" },
  { value: "admin", label: "Admin (toutes permissions)" }
];

export default function APIKeyManager() {
  const [showCreate, setShowCreate] = useState(false);
  const [showKeys, setShowKeys] = useState({});
  const [formData, setFormData] = useState({ name: "", permissions: [] });
  const queryClient = useQueryClient();

  const { data: apiKeys = [] } = useQuery({
    queryKey: ["api-keys"],
    queryFn: () => base44.entities.APIKey.list("-created_date", 50),
    initialData: []
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.APIKey.create({
      ...data,
      key: `do_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      setShowCreate(false);
      setFormData({ name: "", permissions: [] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.APIKey.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["api-keys"] })
  });

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
  };

  const togglePermission = (perm) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Clés API</h2>
            <p className="text-sm text-slate-600">
              Gérez vos clés d'accès pour les intégrations externes
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="bg-gradient-to-r from-purple-500 to-indigo-600">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle clé
          </Button>
        </div>

        {apiKeys.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p>Aucune clé API créée</p>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-slate-900">{apiKey.name}</h3>
                      {apiKey.active ? (
                        <Badge>Actif</Badge>
                      ) : (
                        <Badge variant="secondary">Inactif</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">
                        {showKeys[apiKey.id] ? apiKey.key : "do_••••••••••••••••"}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowKeys({ ...showKeys, [apiKey.id]: !showKeys[apiKey.id] })}
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyKey(apiKey.key)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {apiKey.permissions.map((perm, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {PERMISSIONS.find(p => p.value === perm)?.label || perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(apiKey.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-4 text-xs text-slate-500 mt-2">
                  <span>Utilisé {apiKey.usage_count || 0} fois</span>
                  {apiKey.last_used && (
                    <span>Dernier usage: {new Date(apiKey.last_used).toLocaleDateString("fr-FR")}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-slate-900 mb-2">Documentation API</h3>
        <p className="text-sm text-slate-600 mb-3">
          Utilisez vos clés API pour intégrer Druide Omega dans vos applications.
        </p>
        <code className="text-xs bg-white p-3 rounded block mb-2">
          curl -H "Authorization: Bearer YOUR_API_KEY" \<br/>
          &nbsp;&nbsp;https://api.druideomega.com/v1/chat
        </code>
        <Button variant="outline" size="sm">
          Voir la documentation complète
        </Button>
      </Card>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une clé API</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nom</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ma clé API"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Permissions</label>
              <div className="space-y-2">
                {PERMISSIONS.map((perm) => (
                  <label key={perm.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(perm.value)}
                      onChange={() => togglePermission(perm.value)}
                      className="rounded"
                    />
                    <span className="text-sm">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button
              onClick={() => createMutation.mutate(formData)}
              disabled={!formData.name || formData.permissions.length === 0}
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