import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Brain, Sparkles, X, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function MemoryRecallSearch({ memories, knowledgeBases, onRecall }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      await onRecall(searchQuery.trim());
      setSearchQuery("");
      setIsOpen(false);
    } catch (error) {
      console.error("Erreur rappel mémoire:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  // Quick search preview (local)
  const quickResults = searchQuery.trim() 
    ? {
        memories: memories.filter(m => 
          m.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        ).slice(0, 3),
        knowledgeBases: knowledgeBases.filter(kb => 
          kb.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kb.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          kb.summary?.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 2)
      }
    : { memories: [], knowledgeBases: [] };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-purple-200 hover:bg-purple-50 text-purple-700"
        >
          <Search className="w-4 h-4 mr-2" />
          Rappel de Mémoire
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-slate-900">Recherche de Mémoire</h4>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Mots-clés ou sujet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
              autoFocus
            />
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          {searchQuery.trim() && (quickResults.memories.length > 0 || quickResults.knowledgeBases.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <p className="text-xs text-slate-500 font-medium">Aperçu rapide:</p>
              
              {quickResults.memories.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-600 font-medium flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    Mémoires ({quickResults.memories.length})
                  </p>
                  {quickResults.memories.map((mem, idx) => (
                    <div key={idx} className="p-2 bg-purple-50 rounded-lg border border-purple-100">
                      <p className="text-xs text-slate-700 line-clamp-2">{mem.content}</p>
                      {mem.tags && mem.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {mem.tags.slice(0, 3).map((tag, tagIdx) => (
                            <Badge key={tagIdx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {quickResults.knowledgeBases.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-600 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Sources ({quickResults.knowledgeBases.length})
                  </p>
                  {quickResults.knowledgeBases.map((kb, idx) => (
                    <div key={idx} className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs font-medium text-slate-800">{kb.title}</p>
                      {kb.summary && (
                        <p className="text-xs text-slate-600 line-clamp-1 mt-1">{kb.summary}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              L'IA analysera ces mémoires et sources pour répondre avec contexte
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}