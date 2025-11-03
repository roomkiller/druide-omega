import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Power, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function GlobalKBToggle({ knowledgeBases, onToggle, isLoading }) {
  const activeCount = knowledgeBases.filter(kb => kb.active && kb.status === 'ready').length;
  const totalCount = knowledgeBases.filter(kb => kb.status === 'ready').length;

  if (totalCount === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-blue-200 hover:bg-blue-50"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          <span className="text-xs">
            {activeCount}/{totalCount} sources actives
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900">Gestion Globale</h4>
            <Badge variant="outline">
              {activeCount} actives
            </Badge>
          </div>

          <ScrollArea className="h-64">
            <div className="space-y-2 pr-4">
              {knowledgeBases
                .filter(kb => kb.status === 'ready')
                .map((kb) => (
                  <div
                    key={kb.id}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {kb.title}
                      </p>
                      {kb.tags && kb.tags.length > 0 && (
                        <p className="text-xs text-slate-500 truncate">
                          {kb.tags.slice(0, 2).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {kb.relevance_score !== undefined && kb.relevance_score < 50 && (
                        <Badge variant="outline" className="text-xs text-orange-600">
                          Faible
                        </Badge>
                      )}
                      <Switch
                        checked={kb.active}
                        onCheckedChange={() => onToggle(kb.id, !kb.active)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>

          <div className="pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Activez/désactivez les sources pour le contexte global de l'IA
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}