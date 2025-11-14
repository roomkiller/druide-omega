import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, X, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MemoryRecap({ memories = [], summary = null, isLoading = false, onDismiss }) {
  if (!isLoading && (!memories || memories.length === 0) && !summary) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="px-3 sm:px-4 pt-3 sm:pt-4"
      >
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 p-3 sm:p-4 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="absolute top-1 right-1 sm:top-2 sm:right-2 h-7 w-7 sm:h-8 sm:w-8"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4 pr-8">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-purple-900 mb-1">Contexte Mémoriel</h3>
              <p className="text-xs text-purple-700">Mémoires cross-modales pertinentes</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <>
              {summary && (
                <div className="bg-white/60 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{summary}</p>
                </div>
              )}

              {memories.length > 0 && (
                <div className="space-y-2">
                  {memories.map((memory, index) => (
                    <motion.div
                      key={memory.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/80 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-purple-100"
                    >
                      <div className="flex items-start gap-2 mb-1.5">
                        <Badge className="bg-purple-100 text-purple-700 text-xs px-1.5 sm:px-2 py-0.5 flex-shrink-0">
                          {memory.modality === 'voice' ? '🎙️' : memory.modality === 'visual' ? '🖼️' : '💬'}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-1.5 sm:px-2 py-0.5 flex-shrink-0">
                          {memory.importance}/10
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 line-clamp-2">{memory.content}</p>
                      {memory.tags && memory.tags.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {memory.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}