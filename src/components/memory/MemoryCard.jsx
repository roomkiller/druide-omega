
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Star, Tag, Calendar, Eye, Trash2, MessageSquare, Lightbulb, Heart, BookOpen, Sparkles, Plus, X, Check, Mic, Image as ImageIcon, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const modalityIcons = {
  chat: MessageSquare,
  voice: Mic,
  visual: ImageIcon,
  system: Brain
};

const modalityColors = {
  chat: "bg-blue-100 text-blue-700 border-blue-300",
  voice: "bg-green-100 text-green-700 border-green-300",
  visual: "bg-pink-100 text-pink-700 border-pink-300",
  system: "bg-purple-100 text-purple-700 border-purple-300"
};

const modalityLabels = {
  chat: "Chat",
  voice: "Vocal",
  visual: "Visuel",
  system: "Système"
};

export default function MemoryCard({ memory, onDelete, onUpdateTags }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [localTags, setLocalTags] = useState(memory.tags || []);
  
  const TypeIcon = typeIcons[memory.type] || Brain;
  const typeColor = typeColors[memory.type] || "from-purple-500 to-indigo-500";
  const typeLabel = typeLabels[memory.type] || memory.type;

  const ModalityIcon = modalityIcons[memory.modality] || MessageSquare;
  const modalityColor = modalityColors[memory.modality] || "bg-blue-100 text-blue-700";
  const modalityLabel = modalityLabels[memory.modality] || memory.modality;

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(memory.id);
    setIsDeleting(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !localTags.includes(newTag.trim())) {
      const updatedTags = [...localTags, newTag.trim()];
      setLocalTags(updatedTags);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = localTags.filter(tag => tag !== tagToRemove);
    setLocalTags(updatedTags);
  };

  const handleSaveTags = async () => {
    await onUpdateTags(memory.id, localTags);
    setIsEditingTags(false);
  };

  const handleCancelEdit = () => {
    setLocalTags(memory.tags || []);
    setNewTag("");
    setIsEditingTags(false);
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

              <Badge className={modalityColor}>
                <ModalityIcon className="w-3 h-3 mr-1" />
                {modalityLabel}
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

              {memory.linked_memory_ids && memory.linked_memory_ids.length > 0 && (
                <Badge variant="outline" className="text-indigo-600 border-indigo-300">
                  <Link2 className="w-3 h-3 mr-1" />
                  {memory.linked_memory_ids.length} liée{memory.linked_memory_ids.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            {memory.emotional_context && (
              <div className="mb-2 p-2 bg-purple-50 border border-purple-100 rounded-lg">
                <p className="text-xs text-purple-700">
                  😊 Émotion: {memory.emotional_context.emotion} ({memory.emotional_context.intensity}/10)
                  {memory.user_sentiment && ` • Sentiment utilisateur: ${memory.user_sentiment}`}
                </p>
              </div>
            )}

            <p className="text-slate-700 leading-relaxed mb-3">
              {memory.content}
            </p>

            {memory.context && (
              <p className="text-sm text-slate-500 italic mb-3">
                Contexte: {memory.context}
              </p>
            )}

            {/* Cross-modal references */}
            {memory.cross_modal_references && memory.cross_modal_references.length > 0 && (
              <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="w-4 h-4 text-indigo-600" />
                  <p className="text-xs font-semibold text-indigo-900">Références cross-modales:</p>
                </div>
                <div className="space-y-1">
                  {memory.cross_modal_references.map((ref, idx) => {
                    const RefIcon = modalityIcons[ref.modality] || Brain;
                    return (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <RefIcon className="w-3 h-3 mt-0.5 text-indigo-600" />
                        <span className="flex-1">{ref.reference}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Access modalities breakdown */}
            {memory.access_modalities && Object.values(memory.access_modalities).some(v => v > 0) && (
              <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
                <span className="font-medium">Consultée via:</span>
                {memory.access_modalities.chat > 0 && (
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    💬 {memory.access_modalities.chat}
                  </Badge>
                )}
                {memory.access_modalities.voice > 0 && (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    🎙️ {memory.access_modalities.voice}
                  </Badge>
                )}
                {memory.access_modalities.visual > 0 && (
                  <Badge variant="outline" className="text-pink-600 border-pink-200">
                    🖼️ {memory.access_modalities.visual}
                  </Badge>
                )}
              </div>
            )}

            {/* Tags Section */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">Tags:</span>
                {!isEditingTags && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingTags(true)}
                    className="h-6 px-2 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Modifier
                  </Button>
                )}
              </div>

              {isEditingTags ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {localTags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs pl-2 pr-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nouveau tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="h-8 text-xs"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddTag}
                      className="h-8 px-3"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveTags}
                      className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Enregistrer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="h-7 px-3 text-xs"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {localTags.length > 0 ? (
                    localTags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">Aucun tag</span>
                  )}
                </div>
              )}
            </div>

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
