import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Loader2,
  AlertCircle,
  Database
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

export default function Knowledge() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: knowledgeBases = [], isLoading } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list('-created_date', 50),
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
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40"
              >
                <BookOpen className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">
                  Base de Connaissances
                </h1>
                <p className="text-slate-600">
                  Documents et sources externes pour enrichir l'IA
                </p>
              </div>
            </div>

            <UploadKnowledgeDialog onSuccess={handleUploadSuccess} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher dans les sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200"
              />
            </div>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white">
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
              <SelectTrigger className="w-full md:w-48 bg-white">
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
      </div>

      {/* Knowledge Bases List */}
      <ScrollArea className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
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
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
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
        </div>
      </ScrollArea>
    </div>
  );
}