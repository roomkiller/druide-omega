
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  Search, 
  Filter, 
  Trash2, 
  AlertCircle,
  Sparkles,
  Loader2,
  Link2,
  MessageSquare,
  Mic,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MemoryCard from "../components/memory/MemoryCard";
import MemoryStats from "../components/memory/MemoryStats";
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

export default function Memory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [importanceFilter, setImportanceFilter] = useState("all");
  const [modalityFilter, setModalityFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: memories = [], isLoading } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-importance', 100),
  });

  const deleteMemoryMutation = useMutation({
    mutationFn: (id) => base44.entities.Memory.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });

  const updateTagsMutation = useMutation({
    mutationFn: ({ id, tags }) => base44.entities.Memory.update(id, { tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });

  const pruneMemoriesMutation = useMutation({
    mutationFn: async () => {
      const lowImportanceMemories = memories.filter(m => m.importance <= 3);
      await Promise.all(lowImportanceMemories.map(m => base44.entities.Memory.delete(m.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });

  const filteredMemories = memories.filter(memory => {
    const matchesSearch = memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.context?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         memory.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === "all" || memory.type === typeFilter;
    
    const matchesImportance = importanceFilter === "all" || 
                             (importanceFilter === "high" && memory.importance >= 7) ||
                             (importanceFilter === "medium" && memory.importance >= 4 && memory.importance < 7) ||
                             (importanceFilter === "low" && memory.importance < 4);

    const matchesModality = modalityFilter === "all" || memory.modality === modalityFilter;

    return matchesSearch && matchesType && matchesImportance && matchesModality;
  });

  const handleDeleteMemory = async (id) => {
    await deleteMemoryMutation.mutateAsync(id);
  };

  const handleUpdateTags = async (id, tags) => {
    await updateTagsMutation.mutateAsync({ id, tags });
  };

  const handlePruneMemories = async () => {
    await pruneMemoriesMutation.mutateAsync();
  };

  // Statistics by modality
  const modalityStats = memories.reduce((acc, m) => {
    const mod = m.modality || 'chat'; // Default to 'chat' if modality is not set
    acc[mod] = (acc[mod] || 0) + 1;
    return acc;
  }, {});

  const linkedMemoriesCount = memories.filter(m => m.linked_memory_ids?.length > 0).length;

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
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1">
                  Système de Mémoire
                </h1>
                <p className="text-slate-600">
                  Base de connaissances et apprentissage continu de l'IA
                </p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  disabled={memories.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Élaguer les mémoires
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Élaguer les mémoires peu importantes ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action supprimera toutes les mémoires avec une importance de 3 ou moins. 
                    Cela permet d'optimiser la base de connaissances en ne conservant que l'essentiel.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handlePruneMemories}
                    disabled={pruneMemoriesMutation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {pruneMemoriesMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Élagage...
                      </>
                    ) : (
                      "Élaguer"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <MemoryStats memories={memories} />

          {/* Cross-modal stats */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <p className="text-xs text-blue-600 font-medium">Chat</p>
              </div>
              <p className="text-xl font-bold text-blue-900">{modalityStats.chat || 0}</p>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Mic className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-600 font-medium">Vocal</p>
              </div>
              <p className="text-xl font-bold text-green-900">{modalityStats.voice || 0}</p>
            </div>

            <div className="p-3 bg-pink-50 border border-pink-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <ImageIcon className="w-4 h-4 text-pink-600" />
                <p className="text-xs text-pink-600 font-medium">Visuel</p>
              </div>
              <p className="text-xl font-bold text-pink-900">{modalityStats.visual || 0}</p>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-purple-600" />
                <p className="text-xs text-purple-600 font-medium">Système</p>
              </div>
              <p className="text-xl font-bold text-purple-900">{modalityStats.system || 0}</p>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Link2 className="w-4 h-4 text-indigo-600" />
                <p className="text-xs text-indigo-600 font-medium">Liées</p>
              </div>
              <p className="text-xl font-bold text-indigo-900">{linkedMemoriesCount}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher dans les mémoires..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="interaction">Interactions</SelectItem>
                <SelectItem value="fact">Faits</SelectItem>
                <SelectItem value="preference">Préférences</SelectItem>
                <SelectItem value="insight">Intuitions</SelectItem>
                <SelectItem value="conversation_summary">Résumés</SelectItem>
              </SelectContent>
            </Select>

            <Select value={importanceFilter} onValueChange={setImportanceFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white">
                <SelectValue placeholder="Importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes importances</SelectItem>
                <SelectItem value="high">Haute (7-10)</SelectItem>
                <SelectItem value="medium">Moyenne (4-6)</SelectItem>
                <SelectItem value="low">Basse (1-3)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={modalityFilter} onValueChange={setModalityFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white">
                <SelectValue placeholder="Modalité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes modalités</SelectItem>
                <SelectItem value="chat">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </div>
                </SelectItem>
                <SelectItem value="voice">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    Vocal
                  </div>
                </SelectItem>
                <SelectItem value="visual">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Visuel
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Système
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Memories List */}
      <ScrollArea className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : filteredMemories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {memories.length === 0 ? (
                  <Brain className="w-10 h-10 text-purple-600" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-purple-600" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {memories.length === 0 ? "Aucune mémoire" : "Aucun résultat"}
              </h3>
              <p className="text-slate-600 mb-6">
                {memories.length === 0 
                  ? "L'IA n'a pas encore de mémoires. Elles seront créées automatiquement lors des conversations."
                  : "Essayez d'ajuster vos filtres de recherche."
                }
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {filteredMemories.map((memory) => (
                  <MemoryCard
                    key={memory.id}
                    memory={memory}
                    onDelete={handleDeleteMemory}
                    onUpdateTags={handleUpdateTags}
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
