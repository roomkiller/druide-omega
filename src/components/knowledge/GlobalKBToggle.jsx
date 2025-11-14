import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export default function GlobalKBToggle({ knowledgeBases = [], onToggle, isLoading }) {
  const activeCount = knowledgeBases.filter(kb => kb.active).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative h-8 sm:h-9 px-2 sm:px-3 hover:bg-blue-50 hover:border-blue-300"
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 mr-1 sm:mr-2" />
          <span className="hidden sm:inline text-xs sm:text-sm">KB</span>
          {activeCount > 0 && (
            <Badge className="ml-1 bg-blue-100 text-blue-700 text-xs px-1.5 py-0">
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 sm:w-80 p-0" align="end">
        <div className="p-3 sm:p-4 border-b border-slate-200">
          <h4 className="font-semibold text-sm sm:text-base text-slate-900">Bases de Connaissances</h4>
          <p className="text-xs text-slate-500 mt-1">Activer/Désactiver les sources</p>
        </div>
        
        <ScrollArea className="max-h-64 sm:max-h-96">
          <div className="p-2 sm:p-3 space-y-2">
            {knowledgeBases.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-500 text-center py-6">
                Aucune source disponible
              </p>
            ) : (
              knowledgeBases.map((kb, index) => (
                <motion.div
                  key={kb.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-2 sm:p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">{kb.title}</p>
                    <p className="text-xs text-slate-500 truncate">{kb.source_type}</p>
                  </div>
                  <Switch
                    checked={kb.active}
                    onCheckedChange={(checked) => onToggle(kb.id, checked)}
                    disabled={isLoading}
                  />
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}