import React from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Link as LinkIcon, Type } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const sourceIcons = {
  file: FileText,
  url: LinkIcon,
  text: Type
};

export default function ActiveKnowledgeIndicator({ knowledgeBases }) {
  const activeKBs = knowledgeBases.filter(kb => kb.active && kb.status === 'ready');

  if (activeKBs.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition-colors"
        >
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-medium text-blue-700">
            {activeKBs.length} {activeKBs.length === 1 ? 'source' : 'sources'}
          </span>
        </motion.button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-slate-900">Sources Actives</h4>
          </div>
          <div className="space-y-2">
            {activeKBs.map((kb) => {
              const SourceIcon = sourceIcons[kb.source_type] || FileText;
              return (
                <div key={kb.id} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <SourceIcon className="w-4 h-4 text-slate-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{kb.title}</p>
                    {kb.summary && (
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                        {kb.summary}
                      </p>
                    )}
                    {kb.tags && kb.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {kb.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 italic text-center">
            L'IA peut se référer à ces sources dans ses réponses
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}