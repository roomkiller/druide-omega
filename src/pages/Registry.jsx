
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Application Registry & Documentation Hub                   ║
 * ║ Registre centralisé de tous les composants, pages, entités                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Search,
  Plus,
  FileCode,
  Database,
  Boxes,
  Zap,
  Wrench,
  Lightbulb,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Edit,
  Trash2,
  ExternalLink,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RegistryEditor from "@/components/registry/RegistryEditor";

const TYPE_ICONS = {
  page: FileCode,
  component: Boxes,
  entity: Database,
  integration: Zap,
  service: Wrench,
  utility: Lightbulb,
  concept: BookOpen
};

const STATUS_COLORS = {
  stable: "bg-green-100 text-green-700 border-green-300",
  beta: "bg-blue-100 text-blue-700 border-blue-300",
  experimental: "bg-yellow-100 text-yellow-700 border-yellow-300",
  deprecated: "bg-red-100 text-red-700 border-red-300",
  planned: "bg-purple-100 text-purple-700 border-purple-300"
};

const PRIORITY_COLORS = {
  critical: "bg-red-500 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-blue-500 text-white",
  low: "bg-gray-500 text-white"
};

export default function Registry() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['registryEntries'],
    queryFn: () => base44.entities.RegistryEntry.list('-created_date'),
  });

  const deleteEntryMutation = useMutation({
    mutationFn: (id) => base44.entities.RegistryEntry.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registryEntries'] });
      setSelectedEntry(null);
    },
  });

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === "all" || entry.item_type === selectedType;
    const matchesStatus = selectedStatus === "all" || entry.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const groupedByType = filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.item_type]) {
      acc[entry.item_type] = [];
    }
    acc[entry.item_type].push(entry);
    return acc;
  }, {});

  const stats = {
    total: entries.length,
    byType: entries.reduce((acc, e) => {
      acc[e.item_type] = (acc[e.item_type] || 0) + 1;
      return acc;
    }, {}),
    byStatus: entries.reduce((acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    }, {}),
    critical: entries.filter(e => e.priority === 'critical').length
  };

  const handleScanApp = async () => {
    // Auto-découverte basique - à compléter
    const appStructure = [
      { type: "page", name: "Home", path: "pages/Home.js" },
      { type: "page", name: "Chat", path: "pages/Chat.js" },
      { type: "page", name: "Consciousness", path: "pages/Consciousness.js" },
      { type: "page", name: "Memory", path: "pages/Memory.js" },
      { type: "page", name: "Knowledge", path: "pages/Knowledge.js" },
      { type: "component", name: "ConsciousnessMetrics", path: "components/consciousness/ConsciousnessMetrics" },
      { type: "entity", name: "ConsciousnessConfig", path: "entities/ConsciousnessConfig.json" },
    ];

    for (const item of appStructure) {
      const exists = entries.find(e => e.file_path === item.path);
      if (!exists) {
        await base44.entities.RegistryEntry.create({
          item_type: item.type,
          item_name: item.name,
          file_path: item.path,
          status: "stable",
          priority: "medium",
          last_updated: new Date().toISOString()
        });
      }
    }
    
    queryClient.invalidateQueries({ queryKey: ['registryEntries'] });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="min-w-[64px] min-h-[64px] w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40"
              >
                <BookOpen className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Registre Application</h1>
                <p className="text-sm sm:text-base text-slate-600">Documentation centralisée & organisation</p>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleScanApp}
                className="min-h-[48px] flex-1 sm:flex-initial touch-target"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Scanner
              </Button>
              
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button size="sm" className="min-h-[48px] flex-1 sm:flex-initial bg-gradient-to-r from-indigo-600 to-purple-600 touch-target">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Nouvelle Entrée</DialogTitle>
                  </DialogHeader>
                  <RegistryEditor
                    entry={null}
                    onSave={() => {
                      setIsEditing(false);
                      queryClient.invalidateQueries({ queryKey: ['registryEntries'] });
                    }}
                    onCancel={() => setIsEditing(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <Card className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
              <div className="text-xs text-blue-700">Total</div>
            </Card>
            
            {Object.entries(stats.byType).map(([type, count]) => {
              const Icon = TYPE_ICONS[type];
              return (
                <Card key={type} className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-purple-600" />
                    <div className="text-xl font-bold text-slate-900">{count}</div>
                  </div>
                  <div className="text-xs text-slate-600 capitalize">{type}s</div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 bg-white/60 backdrop-blur-sm border-b border-slate-200/60 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher dans le registre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 min-h-[48px] bg-white"
              />
            </div>

            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2">
                {["all", "page", "component", "entity", "integration"].map(type => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className="min-h-[44px] whitespace-nowrap touch-target"
                  >
                    {type === "all" ? "Tous" : type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </ScrollArea>

            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-2">
                {["all", "stable", "beta", "experimental"].map(status => (
                  <Badge
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    className={`cursor-pointer min-h-[44px] whitespace-nowrap ${selectedStatus === status ? '' : 'hover:bg-slate-100'}`}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status === "all" ? "Tous statuts" : status}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
              <p className="text-slate-600 mt-4">Chargement du registre...</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <Card className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune entrée</h3>
              <p className="text-slate-600 mb-6">
                {entries.length === 0 
                  ? "Commencez par scanner l'application"
                  : "Aucune entrée ne correspond aux filtres"}
              </p>
              {entries.length === 0 && (
                <Button onClick={handleScanApp} className="min-h-[48px] bg-gradient-to-r from-indigo-600 to-purple-600">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Scanner l'Application
                </Button>
              )}
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedByType).map(([type, typeEntries]) => {
                const Icon = TYPE_ICONS[type];
                
                return (
                  <div key={type}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="min-w-[56px] min-h-[56px] w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 capitalize">
                        {type}s ({typeEntries.length})
                      </h2>
                    </div>

                    <div className="grid gap-4">
                      {typeEntries.map((entry, idx) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Card className="p-4 hover:shadow-lg transition-all border-2 border-transparent hover:border-indigo-200">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <h3 className="text-lg font-bold text-slate-900">{entry.item_name}</h3>
                                  <Badge className={STATUS_COLORS[entry.status]}>
                                    {entry.status}
                                  </Badge>
                                  {entry.priority && (
                                    <Badge className={PRIORITY_COLORS[entry.priority]}>
                                      {entry.priority}
                                    </Badge>
                                  )}
                                  {entry.version && (
                                    <Badge variant="outline" className="text-xs">
                                      v{entry.version}
                                    </Badge>
                                  )}
                                </div>

                                <p className="text-sm text-slate-600 mb-2 font-mono bg-slate-50 px-2 py-1 rounded">
                                  {entry.file_path}
                                </p>

                                {entry.description && (
                                  <p className="text-sm text-slate-700 mb-3">{entry.description}</p>
                                )}

                                {entry.tags && entry.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {entry.tags.map((tag, i) => (
                                      <Badge key={i} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}

                                {entry.dependencies && entry.dependencies.length > 0 && (
                                  <div className="text-xs text-slate-500">
                                    <span className="font-medium">Dépendances:</span> {entry.dependencies.join(", ")}
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-1 flex-shrink-0">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedEntry(entry)} className="min-h-[44px] min-w-[44px] touch-target">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Éditer {entry.item_name}</DialogTitle>
                                    </DialogHeader>
                                    <RegistryEditor
                                      entry={entry}
                                      onSave={() => {
                                        setSelectedEntry(null);
                                        queryClient.invalidateQueries({ queryKey: ['registryEntries'] });
                                      }}
                                      onCancel={() => setSelectedEntry(null)}
                                    />
                                  </DialogContent>
                                </Dialog>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (confirm(`Supprimer "${entry.item_name}" ?`)) {
                                      deleteEntryMutation.mutate(entry.id);
                                    }
                                  }}
                                  className="min-h-[44px] min-w-[44px] touch-target"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
