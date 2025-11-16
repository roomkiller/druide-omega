/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Global Search                                              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Search, MessageSquare, Database, BookOpen, Brain, Image, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: results, isLoading } = useQuery({
    queryKey: ['globalSearch', query],
    queryFn: async () => {
      if (!query || query.length < 2) return null;

      const [conversations, memories, knowledge, visuals] = await Promise.all([
        base44.entities.Conversation.list('-created_date', 10).then(items =>
          items.filter(c => c.title?.toLowerCase().includes(query.toLowerCase()))
        ),
        base44.entities.Memory.list('-created_date', 10).then(items =>
          items.filter(m => m.content?.toLowerCase().includes(query.toLowerCase()))
        ),
        base44.entities.KnowledgeBase.list('-created_date', 10).then(items =>
          items.filter(kb => 
            kb.title?.toLowerCase().includes(query.toLowerCase()) ||
            kb.content?.toLowerCase().includes(query.toLowerCase())
          )
        ),
        base44.entities.VisualContent.list('-created_date', 10).then(items =>
          items.filter(v => v.description?.toLowerCase().includes(query.toLowerCase()))
        )
      ]);

      return { conversations, memories, knowledge, visuals };
    },
    enabled: query.length >= 2
  });

  const sections = [
    { 
      title: 'Conversations', 
      items: results?.conversations || [], 
      icon: MessageSquare,
      color: 'text-purple-600',
      navigate: (id) => window.location.href = createPageUrl(`Chat?id=${id}`)
    },
    { 
      title: 'Mémoires', 
      items: results?.memories || [], 
      icon: Database,
      color: 'text-indigo-600',
      navigate: () => window.location.href = createPageUrl('Memory')
    },
    { 
      title: 'Connaissances', 
      items: results?.knowledge || [], 
      icon: BookOpen,
      color: 'text-blue-600',
      navigate: () => window.location.href = createPageUrl('Knowledge')
    },
    { 
      title: 'Visuels', 
      items: results?.visuals || [], 
      icon: Image,
      color: 'text-pink-600',
      navigate: () => window.location.href = createPageUrl('VisualGallery')
    }
  ];

  const totalResults = sections.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-64 justify-start text-slate-500">
          <Search className="w-4 h-4 mr-2" />
          Rechercher...
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[600px] p-0">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Rechercher conversations, mémoires, connaissances..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
        </div>

        <ScrollArea className="h-[450px]">
          {isLoading && query.length >= 2 && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          )}

          {!isLoading && query.length >= 2 && totalResults === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Aucun résultat trouvé</p>
            </div>
          )}

          {!isLoading && query.length >= 2 && totalResults > 0 && (
            <div className="p-4 space-y-6">
              {sections.map((section) => {
                const Icon = section.icon;
                if (section.items.length === 0) return null;

                return (
                  <div key={section.title}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`w-5 h-5 ${section.color}`} />
                      <h3 className="font-bold text-slate-900">{section.title}</h3>
                      <Badge variant="outline">{section.items.length}</Badge>
                    </div>

                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            section.navigate(item.id);
                            setOpen(false);
                          }}
                          className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <h4 className="font-semibold text-sm text-slate-900">
                            {item.title || item.content?.slice(0, 50)}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {item.content?.slice(0, 100) || item.description?.slice(0, 100)}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(item.created_date).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {query.length < 2 && (
            <div className="text-center py-12 text-slate-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Tapez au moins 2 caractères pour rechercher</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}