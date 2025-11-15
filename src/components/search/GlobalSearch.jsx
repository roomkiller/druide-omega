/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Global Search (Ctrl+K / Cmd+K)                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MessageSquare, 
  BookOpen, 
  Database, 
  Settings,
  Clock,
  TrendingUp,
  Brain,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_ICONS = {
  conversations: MessageSquare,
  knowledge: BookOpen,
  memories: Database,
  settings: Settings,
  thoughts: Brain,
  decisions: FileText
};

const CATEGORY_COLORS = {
  conversations: "bg-purple-500",
  knowledge: "bg-blue-500",
  memories: "bg-indigo-500",
  settings: "bg-emerald-500",
  thoughts: "bg-pink-500",
  decisions: "bg-violet-500"
};

export default function GlobalSearch({ open, onOpenChange }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const searchResults = await performSearch(query);
        setResults(searchResults);
        setSelectedIndex(0);
        
        // Track search
        await base44.entities.SearchHistory.create({
          query,
          results_count: searchResults.length,
          search_context: "global"
        });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const performSearch = async (searchQuery) => {
    const lowerQuery = searchQuery.toLowerCase();
    const allResults = [];

    // Search Conversations
    try {
      const conversations = await base44.entities.Conversation.list("-updated_date", 50);
      conversations.forEach(conv => {
        const titleMatch = conv.title?.toLowerCase().includes(lowerQuery);
        const messageMatch = conv.messages?.some(m => 
          m.content?.toLowerCase().includes(lowerQuery)
        );
        
        if (titleMatch || messageMatch) {
          allResults.push({
            id: conv.id,
            title: conv.title || "Sans titre",
            category: "conversations",
            snippet: conv.messages?.[conv.messages.length - 1]?.content?.substring(0, 100) || "",
            url: `Chat?conversation=${conv.id}`,
            score: titleMatch ? 100 : 50
          });
        }
      });
    } catch (e) {}

    // Search Knowledge Base
    try {
      const kb = await base44.entities.KnowledgeBase.list("-updated_date", 50);
      kb.forEach(doc => {
        if (doc.title?.toLowerCase().includes(lowerQuery) || 
            doc.content?.toLowerCase().includes(lowerQuery)) {
          allResults.push({
            id: doc.id,
            title: doc.title,
            category: "knowledge",
            snippet: doc.summary || doc.content?.substring(0, 100) || "",
            url: "Knowledge",
            score: doc.title?.toLowerCase().includes(lowerQuery) ? 90 : 60
          });
        }
      });
    } catch (e) {}

    // Search Memories
    try {
      const memories = await base44.entities.Memory.list("-updated_date", 50);
      memories.forEach(mem => {
        if (mem.content?.toLowerCase().includes(lowerQuery)) {
          allResults.push({
            id: mem.id,
            title: mem.type || "Memory",
            category: "memories",
            snippet: mem.content?.substring(0, 100) || "",
            url: "Memory",
            score: 70
          });
        }
      });
    } catch (e) {}

    // Search Conscious Thoughts
    try {
      const thoughts = await base44.entities.ConsciousThought.list("-created_date", 30);
      thoughts.forEach(thought => {
        if (thought.thought?.toLowerCase().includes(lowerQuery)) {
          allResults.push({
            id: thought.id,
            title: thought.category || "Thought",
            category: "thoughts",
            snippet: thought.thought?.substring(0, 100) || "",
            url: "Consciousness",
            score: 65
          });
        }
      });
    } catch (e) {}

    // Search Decisions
    try {
      const decisions = await base44.entities.IntuitiveDecision.list("-created_date", 30);
      decisions.forEach(dec => {
        if (dec.decision_context?.toLowerCase().includes(lowerQuery) ||
            dec.final_response?.toLowerCase().includes(lowerQuery)) {
          allResults.push({
            id: dec.id,
            title: dec.decision_type || "Decision",
            category: "decisions",
            snippet: dec.final_response?.substring(0, 100) || "",
            url: "DecisionArchive",
            score: 65
          });
        }
      });
    } catch (e) {}

    return allResults.sort((a, b) => b.score - a.score).slice(0, 20);
  };

  const handleSelect = (result) => {
    window.location.href = createPageUrl(result.url);
    onOpenChange(false);
    
    base44.entities.SearchHistory.create({
      query,
      results_count: results.length,
      clicked_result: result.title,
      search_context: "global"
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher dans toute l'application..."
            className="border-0 focus-visible:ring-0 text-base"
          />
          <Badge variant="outline" className="text-xs">
            {navigator.platform.includes("Mac") ? "⌘K" : "Ctrl+K"}
          </Badge>
        </div>

        <ScrollArea className="max-h-96">
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full" />
            </div>
          )}

          {!isSearching && results.length === 0 && query.length >= 2 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Search className="w-12 h-12 mb-2 opacity-30" />
              <p className="text-sm">Aucun résultat trouvé</p>
            </div>
          )}

          {!isSearching && query.length < 2 && (
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-500 font-medium mb-2">SUGGESTIONS</p>
              {[
                { icon: TrendingUp, text: "Mes conversations récentes", url: "Chat" },
                { icon: BookOpen, text: "Explorer la base de connaissances", url: "Knowledge" },
                { icon: Database, text: "Parcourir mes mémoires", url: "Memory" },
                { icon: Brain, text: "Voir les pensées conscientes", url: "Consciousness" }
              ].map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    window.location.href = createPageUrl(item.url);
                    onOpenChange(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                >
                  <item.icon className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700">{item.text}</span>
                </motion.button>
              ))}
            </div>
          )}

          <AnimatePresence>
            {!isSearching && results.length > 0 && (
              <div className="p-2">
                {results.map((result, idx) => {
                  const Icon = CATEGORY_ICONS[result.category];
                  const isSelected = idx === selectedIndex;
                  
                  return (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full p-3 rounded-lg transition-all text-left ${
                        isSelected ? "bg-purple-50 border-2 border-purple-200" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 ${CATEGORY_COLORS[result.category]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-slate-900 truncate">
                              {result.title}
                            </h4>
                            <Badge variant="outline" className="text-xs capitalize">
                              {result.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{result.snippet}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>

        {results.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
            <div className="flex gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs">↓</kbd>
                Naviguer
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs">↵</kbd>
                Sélectionner
              </span>
            </div>
            <span>{results.length} résultat(s)</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}