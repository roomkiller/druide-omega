
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Knowledge Base System (Visual Polish & Tooltips)           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Tooltip from "@/components/ui/Tooltip";
import KnowledgeGraph from "../components/knowledge/KnowledgeGraph";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Loader2,
  AlertCircle,
  Database,
  Network,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import KnowledgeCard from "../components/knowledge/KnowledgeCard";
import UploadKnowledgeDialog from "../components/knowledge/UploadKnowledgeDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Knowledge() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("list");
  const [isPruning, setIsPruning] = useState(false);
  const queryClient = useQueryClient();

  const { data: knowledgeBases = [], isLoading } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list('-created_date', 50),
  });

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-importance', 50),
  });

  const deleteKBMutation = useMutation({
    mutationFn: (id) => base44.entities.KnowledgeBase.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBases'] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, active }) => base44.entities.KnowledgeBase.update(id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBases'] });
    },
  });

  const pruneKnowledgeBasesMutation = useMutation({
    mutationFn: async () => {
      const results = [];
      
      for (const kb of knowledgeBases.filter(k => k.status === 'ready')) {
        try {
          const prompt = `Analyse cette source de connaissance et détermine sa pertinence actuelle:

Titre: ${kb.title}
Type: ${kb.source_type}
Date de création: ${kb.created_date}
Dernière consultation: ${kb.last_accessed || 'Jamais'}
Nombre de consultations: ${kb.access_count || 0}
Contenu (extrait): ${kb.content?.slice(0, 500)}
Résumé: ${kb.summary || 'N/A'}

Évalue:
1. Est-ce que l'information est toujours pertinente et à jour?
2. Est-ce que cette source est suffisamment utilisée?
3. Est-ce que le contenu est de qualité?

Retourne un JSON avec:
{
  "should_keep": true/false,
  "relevance_score": 0-100,
  "reasoning": "explication courte"
}`;

          const analysis = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            response_json_schema: {
              type: "object",
              properties: {
                should_keep: { type: "boolean" },
                relevance_score: { type: "number" },
                reasoning: { type: "string" }
              },
              required: ["should_keep", "relevance_score", "reasoning"]
            }
          });

          results.push({ kb, analysis });

          await base44.entities.KnowledgeBase.update(kb.id, {
            relevance_score: analysis.relevance_score,
            last_reviewed: new Date().toISOString()
          });

          if (!analysis.should_keep && analysis.relevance_score < 30) {
            await base44.entities.KnowledgeBase.update(kb.id, { active: false });
          }

        } catch (error) {
          console.error(`Erreur analyse KB ${kb.id}:`, error);
        }
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBases'] });
    },
  });

  const handleAutoPrune = async () => {
    setIsPruning(true);
    try {
      await pruneKnowledgeBasesMutation.mutateAsync();
    } finally {
      setIsPruning(false);
    }
  };

  const filteredKnowledgeBases = knowledgeBases.filter(kb => {
    const matchesSearch = kb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         kb.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         kb.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSource = sourceFilter === "all" || kb.source_type === sourceFilter;
    const matchesStatus = statusFilter === "all" || kb.status === statusFilter;

    return matchesSearch && matchesSource && matchesStatus;
  });

  const activeCount = knowledgeBases.filter(kb => kb.active).length;
  const totalFacts = knowledgeBases.reduce((sum, kb) => sum + (kb.extracted_facts?.length || 0), 0);

  const handleDelete = async (id) => {
    await deleteKBMutation.mutateAsync(id);
  };

  const handleToggleActive = async (id, active) => {
    await toggleActiveMutation.mutateAsync({ id, active });
  };

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['knowledgeBases'] });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-6 sm:py-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="min-w-[64px] min-h-[64px] w-16 h-16 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40"
              >
                <BookOpen className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                  Base de Connaissances
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                  Documents et sources externes pour enrichir l'IA
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Tooltip content="Élaguer automatiquement les sources obsolètes" position="bottom">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="min-h-[44px] border-orange-200 text-orange-600 hover:bg-orange-50 touch-target"
                      disabled={knowledgeBases.length === 0 || isPruning}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Élagage Auto</span>
                      <span className="sm:hidden">Élagage</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Élagage automatique des connaissances</AlertDialogTitle>
                      <AlertDialogDescription>
                        L'IA va analyser chaque source de connaissance pour déterminer sa pertinence actuelle. 
                        Les sources obsolètes ou peu utilisées seront désactivées automatiquement. Ce processus peut prendre quelques minutes.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleAutoPrune}
                        disabled={isPruning}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {isPruning ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyse en cours...
                          </>
                        ) : (
                          "Lancer l'élagage"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Tooltip>

              <UploadKnowledgeDialog onSuccess={handleUploadSuccess} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 border border-slate-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{knowledgeBases.length}</p>
                  <p className="text-sm text-slate-600">Sources totales</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 border border-slate-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
                  <p className="text-sm text-slate-600">Sources actives</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-4 border border-slate-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Filter className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{totalFacts}</p>
                  <p className="text-sm text-slate-600">Faits extraits</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="list" className="min-h-[44px] touch-target">
                <Database className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Liste des Sources</span>
                <span className="sm:hidden">Sources</span>
              </TabsTrigger>
              <TabsTrigger value="graph" className="min-h-[44px] touch-target">
                <Network className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Graphe de Connaissances</span>
                <span className="sm:hidden">Graphe</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-0">
              {/* Filters */}
              <div className="flex flex-col gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher dans les sources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 min-h-[44px] bg-white border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="min-h-[44px] bg-white touch-target">
                      <SelectValue placeholder="Type de source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les sources</SelectItem>
                      <SelectItem value="file">Fichiers</SelectItem>
                      <SelectItem value="url">URLs</SelectItem>
                      <SelectItem value="text">Textes</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="min-h-[44px] bg-white touch-target">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="ready">Prêt</SelectItem>
                      <SelectItem value="processing">En traitement</SelectItem>
                      <SelectItem value="error">Erreur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="graph" className="mt-0">
              <KnowledgeGraph 
                knowledgeBases={knowledgeBases.filter(kb => kb.status === 'ready')} 
                memories={memories}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {activeTab === "list" && (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
              ) : filteredKnowledgeBases.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    {knowledgeBases.length === 0 ? (
                      <BookOpen className="w-10 h-10 text-purple-600" />
                    ) : (
                      <AlertCircle className="w-10 h-10 text-purple-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {knowledgeBases.length === 0 ? "Aucune source" : "Aucun résultat"}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {knowledgeBases.length === 0 
                      ? "Ajoutez des documents, URLs ou textes pour enrichir la base de connaissances de l'IA"
                      : "Essayez d'ajuster vos filtres de recherche."
                    }
                  </p>
                  {knowledgeBases.length === 0 && (
                    <UploadKnowledgeDialog onSuccess={handleUploadSuccess} />
                  )}
                </motion.div>
              ) : (
                <div className="grid gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredKnowledgeBases.map((kb) => (
                      <KnowledgeCard
                        key={kb.id}
                        knowledge={kb}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
