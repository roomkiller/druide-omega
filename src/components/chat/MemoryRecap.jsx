
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, X, ChevronDown, ChevronUp, MessageSquare, Mic, Image as ImageIcon, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const modalityIcons = {
  chat: MessageSquare,
  voice: Mic,
  visual: ImageIcon,
  system: Brain
};

export default function MemoryRecap({ memories, summary, isLoading, onDismiss }) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  if (!memories || memories.length === 0) return null;

  // Group memories by modality for better visualization
  const memoriesByModality = memories.reduce((acc, mem) => {
    const modality = mem.modality || 'chat';
    if (!acc[modality]) acc[modality] = [];
    acc[modality].push(mem);
    return acc;
  }, {});

  const hasMultipleModalities = Object.keys(memoriesByModality).length > 1;

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          className="px-4 md:px-8 pt-6"
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-purple-200/50 p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        Rappel de Mémoire Cross-Modale
                      </h3>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                        {memories.length} {memories.length === 1 ? 'mémoire' : 'mémoires'}
                      </Badge>
                      {hasMultipleModalities && (
                        <Badge variant="outline" className="border-indigo-300 text-indigo-700">
                          <Link2 className="w-3 h-3 mr-1" />
                          Multi-modal
                        </Badge>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onDismiss}
                      className="text-slate-400 hover:text-slate-600 hover:bg-white/50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center gap-2 text-slate-600">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4 text-purple-600" />
                      </motion.div>
                      <span className="text-sm">Analyse des mémoires pertinentes...</span>
                    </div>
                  ) : (
                    <>
                      {summary && (
                        <div className="mb-4 p-4 bg-white/60 rounded-xl border border-purple-100">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {summary}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        {memories.map((memory, idx) => {
                          const ModalityIcon = modalityIcons[memory.modality] || MessageSquare;
                          const hasLinkedMemories = memory.linked_memory_ids?.length > 0;
                          
                          return (
                            <motion.div
                              key={memory.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-2 p-3 bg-white/60 rounded-lg border border-purple-100/50 hover:bg-white/80 transition-colors"
                            >
                              <ModalityIcon className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm text-slate-700">{memory.content}</p>
                                </div>
                                {(memory.tags && memory.tags.length > 0) || hasLinkedMemories && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {memory.tags?.map((tag, tagIdx) => (
                                      <Badge key={tagIdx} variant="outline" className="text-xs bg-white/50">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {hasLinkedMemories && (
                                      <Badge variant="outline" className="text-xs bg-indigo-50 border-indigo-200 text-indigo-700">
                                        <Link2 className="w-3 h-3 mr-1" />
                                        {memory.linked_memory_ids.length} liée{memory.linked_memory_ids.length > 1 ? 's' : ''}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {hasMultipleModalities && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 border border-indigo-100 rounded-lg">
                          <p className="text-xs text-indigo-700 flex flex-wrap items-center gap-2">
                            <Link2 className="w-4 h-4 flex-shrink-0" />
                            Ces mémoires proviennent de différentes interactions : 
                            {Object.keys(memoriesByModality).map((mod, idx) => {
                              const Icon = modalityIcons[mod];
                              return (
                                <span key={mod} className="inline-flex items-center gap-1 ml-1">
                                  {Icon && <Icon className="w-3 h-3" />}
                                  {mod} ({memoriesByModality[mod].length})
                                  {idx < Object.keys(memoriesByModality).length - 1 ? ',' : ''}
                                </span>
                              );
                            })}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center mt-4 pt-4 border-t border-purple-200/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="text-slate-500 hover:text-slate-700 text-xs"
                >
                  <ChevronUp className="w-3 h-3 mr-1" />
                  Masquer
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 md:px-8 pt-4"
        >
          <div className="max-w-4xl mx-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="w-full border-purple-200 hover:bg-purple-50 text-purple-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              Afficher le rappel de mémoire ({memories.length})
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
