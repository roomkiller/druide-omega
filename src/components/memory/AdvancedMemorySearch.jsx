/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Advanced Memory Search Interface                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Filter, 
  Calendar,
  Tag,
  Brain,
  Mic,
  Eye,
  MessageCircle,
  X,
  SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function AdvancedMemorySearch({ memories = [], onMemorySelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedModality, setSelectedModality] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState([]);

  // Extract all unique tags
  const allTags = [...new Set(memories.flatMap(m => m.tags || []))];

  const modalityIcons = {
    chat: <MessageCircle className="w-4 h-4" />,
    voice: <Mic className="w-4 h-4" />,
    visual: <Eye className="w-4 h-4" />,
    all: <Brain className="w-4 h-4" />
  };

  const handleSearch = () => {
    let filtered = memories;

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.content?.toLowerCase().includes(query) ||
        m.context?.toLowerCase().includes(query) ||
        m.tags?.some(t => t.toLowerCase().includes(query))
      );
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(m => 
        selectedTags.some(tag => m.tags?.includes(tag))
      );
    }

    // Modality filter
    if (selectedModality !== "all") {
      filtered = filtered.filter(m => m.modality === selectedModality);
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(m => 
        new Date(m.created_date) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(m => 
        new Date(m.created_date) <= new Date(dateRange.end)
      );
    }

    // Sort by relevance (importance + recency)
    filtered.sort((a, b) => {
      const scoreA = (a.importance || 5) + (new Date(a.created_date).getTime() / 1000000000);
      const scoreB = (b.importance || 5) + (new Date(b.created_date).getTime() / 1000000000);
      return scoreB - scoreA;
    });

    setResults(filtered);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedModality("all");
    setDateRange({ start: "", end: "" });
    setResults([]);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Recherche Avancée</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="ml-auto"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher dans les mémoires..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} className="bg-gradient-to-r from-indigo-600 to-purple-600">
          <Search className="w-4 h-4 mr-2" />
          Chercher
        </Button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 rounded-lg p-4 mb-4 space-y-4">
              {/* Modality Filter */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Modalité
                </label>
                <div className="flex gap-2">
                  {['all', 'chat', 'voice', 'visual'].map((mod) => (
                    <Button
                      key={mod}
                      variant={selectedModality === mod ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedModality(mod)}
                      className="capitalize"
                    >
                      {modalityIcons[mod]}
                      <span className="ml-2">{mod === 'all' ? 'Toutes' : mod}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 15).map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date début
                  </label>
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date fin
                  </label>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  />
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                <X className="w-4 h-4 mr-2" />
                Réinitialiser les filtres
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {(selectedTags.length > 0 || selectedModality !== 'all' || dateRange.start || dateRange.end) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTags.map(tag => (
            <Badge key={tag} className="bg-purple-100 text-purple-700">
              {tag}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => toggleTag(tag)}
              />
            </Badge>
          ))}
          {selectedModality !== 'all' && (
            <Badge className="bg-blue-100 text-blue-700">
              Modalité: {selectedModality}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => setSelectedModality('all')}
              />
            </Badge>
          )}
          {dateRange.start && (
            <Badge className="bg-green-100 text-green-700">
              Depuis: {format(new Date(dateRange.start), 'dd/MM/yyyy')}
              <X 
                className="w-3 h-3 ml-1 cursor-pointer" 
                onClick={() => setDateRange({...dateRange, start: ''})}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Results */}
      {results.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700">
              {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
            </span>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {results.map((memory) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => onMemorySelect?.(memory)}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {modalityIcons[memory.modality]}
                      <Badge variant="outline" className="text-xs">
                        {memory.type}
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        Importance: {memory.importance || 5}/10
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-500">
                      {format(new Date(memory.created_date), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2 line-clamp-3">
                    {memory.content}
                  </p>
                  {memory.context && (
                    <p className="text-xs text-slate-500 italic mb-2">
                      Contexte: {memory.context}
                    </p>
                  )}
                  {memory.tags && memory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {memory.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : searchQuery || selectedTags.length > 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Aucun résultat trouvé</p>
        </div>
      ) : null}
    </Card>
  );
}