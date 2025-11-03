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
  Loader2
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

    return matchesSearch && matchesType && matchesImportance;
  });

  const handleDeleteMemory = async (id) => {
    await deleteMemoryMutation.mutateAsync(id);
  };

  const handlePruneMemories = async () => {
    await pruneMemoriesMutation.mutateAsync();
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