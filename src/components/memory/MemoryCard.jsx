import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Star, Tag, Calendar, Eye, Trash2, MessageSquare, Lightbulb, Heart, BookOpen, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
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

const typeIcons = {
  interaction: MessageSquare,
  fact: Lightbulb,
  preference: Heart,
  insight: Sparkles,
  conversation_summary: BookOpen
};

const typeColors = {
  interaction: "from-blue-500 to-cyan-500",
  fact: "from-yellow-500 to-orange-500",
  preference: "from-pink-500 to-rose-500",
  insight: "from-purple-500 to-indigo-500",
  conversation_summary: "from-green-500 to-emerald-500"
};

const typeLabels = {
  interaction: "Interaction",
  fact: "Fait",
  preference: "Préférence",
  insight: "Intuition",
  conversation_summary: "Résumé"
};

export default function MemoryCard({ memory, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const TypeIcon = typeIcons[memory.type] || Brain;
  const typeColor = typeColors[memory.type] || "from-purple-500 to-indigo-500";
  const typeLabel = typeLabels[memory.type] || memory.type;

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(memory.id);
    setIsDeleting(false);
  };

  const getImportanceColor = (importance) => {
    if (importance >= 8) return "text-red-600 bg-red-50";
    if (importance >= 6) return "text-orange-600 bg-orange-50";
    if (importance >= 4) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative"
    >
      <div className="relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${typeColor} rounded-xl flex items-center justify-center shadow-md`}>
            <TypeIcon className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {typeLabel}
              </Badge>
              
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getImportanceColor(memory.importance)}`}>
                <Star className="w-3 h-3" />
                <span>{memory.importance}/10</span>
              </div>

              {memory.access_count > 0 && (
                <Badge variant="outline" className="text-slate-600">
                  <Eye className="w-3 h-3 mr-1" />
                  {memory.access_count}
                </Badge>
              )}
            </div>

            <p className="text-slate-700 leading-relaxed mb-3">
              {memory.content}
            </p>

            {memory.context && (
              <p className="text-sm text-slate-500 italic mb-3">
                Contexte: {memory.context}
              </p>
            )}

            {memory.tags && memory.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <Tag className="w-3 h-3 text-slate-400" />
                {memory.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {memory.created_date && format(new Date(memory.created_date), "d MMM yyyy", { locale: fr })}
                </div>
                {memory.last_accessed && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Consulté {format(new Date(memory.last_accessed), "d MMM", { locale: fr })}
                  </div>
                )}
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer cette mémoire ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. La mémoire sera définitivement supprimée de la base de connaissances de l'IA.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? "Suppression..." : "Supprimer"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}