import React from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Brain, Star, Tag, Calendar, Eye, MessageSquare, Lightbulb, Heart,
  BookOpen, Sparkles, Mic, Link2, Clock,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLanguage } from "@/components/utils/LanguageContext";

const typeIcons = {
  interaction: MessageSquare,
  fact: Lightbulb,
  preference: Heart,
  insight: Sparkles,
  conversation_summary: BookOpen,
};

const typeColors = {
  interaction: "from-blue-500 to-cyan-500",
  fact: "from-yellow-500 to-orange-500",
  preference: "from-pink-500 to-rose-500",
  insight: "from-purple-500 to-indigo-500",
  conversation_summary: "from-green-500 to-emerald-500",
};

const modalityIcons = { chat: MessageSquare, voice: Mic, visual: Sparkles, system: Brain };
const modalityColors = {
  chat: "bg-blue-100 text-blue-700 border-blue-300",
  voice: "bg-green-100 text-green-700 border-green-300",
  visual: "bg-pink-100 text-pink-700 border-pink-300",
  system: "bg-purple-100 text-purple-700 border-purple-300",
};

/** Tente de parser du JSON ; retourne null si ce n'est pas du JSON. */
function tryParseJSON(str) {
  if (typeof str !== "string") return null;
  const trimmed = str.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

/** Transforme un objet JSON en texte lisible, ligne par ligne. */
function jsonToReadable(obj, depth = 0) {
  const indent = "  ".repeat(depth);
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  if (typeof obj === "number" || typeof obj === "boolean") return String(obj);
  if (Array.isArray(obj)) {
    return obj
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          const inner = jsonToReadable(item, depth + 1);
          return inner ? `${indent}• ${inner}` : "";
        }
        return item ? `${indent}• ${item}` : "";
      })
      .filter(Boolean)
      .join("\n");
  }
  if (typeof obj === "object") {
    return Object.entries(obj)
      .map(([key, val]) => {
        if (val && typeof val === "object") {
          const inner = jsonToReadable(val, depth + 1);
          return inner ? `${indent}${key}:\n${inner}` : `${indent}${key}:`;
        }
        const v = val == null ? "" : String(val);
        return v ? `${indent}${key}: ${v}` : "";
      })
      .filter(Boolean)
      .join("\n");
  }
  return "";
}

export default function MemoryDetailModal({ memory, onClose }) {
  const { t } = useLanguage();
  if (!memory) return null;

  const TypeIcon = typeIcons[memory.type] || Brain;
  const typeColor = typeColors[memory.type] || "from-purple-500 to-indigo-500";
  const typeLabels = {
    interaction: t("memoryCard.interaction"),
    fact: t("memoryCard.fact"),
    preference: t("memoryCard.preference"),
    insight: t("memoryCard.insight"),
    conversation_summary: t("memoryCard.conversationSummary"),
  };
  const typeLabel = typeLabels[memory.type] || memory.type;
  const ModalityIcon = modalityIcons[memory.modality] || MessageSquare;
  const modalityColor = modalityColors[memory.modality] || "bg-blue-100 text-blue-700";
  const modalityLabels = {
    chat: t("memoryCard.chat"),
    voice: t("memoryCard.voice"),
    visual: t("memoryCard.visual"),
    system: t("memoryCard.system"),
  };
  const modalityLabel = modalityLabels[memory.modality] || memory.modality;

  // Contenu lisible intégral
  const contentParsed = tryParseJSON(memory.content);
  const contentReadable = contentParsed
    ? jsonToReadable(contentParsed)
    : memory.content || "";

  const contextParsed = tryParseJSON(memory.context);
  const contextReadable = contextParsed
    ? jsonToReadable(contextParsed)
    : memory.context || "";

  return (
    <Dialog open={!!memory} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        {/* En-tête coloré */}
        <div className={`bg-gradient-to-br ${typeColor} px-6 py-5 flex items-start gap-4`}>
          <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <TypeIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge className="bg-white/20 text-white border-white/30">{typeLabel}</Badge>
              <Badge className={`${modalityColor} border-white/30`}>
                <ModalityIcon className="w-3 h-3 mr-1" />
                {modalityLabel}
              </Badge>
              {memory.importance != null && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium bg-white/20 text-white">
                  <Star className="w-3 h-3" />
                  <span>{memory.importance}/10</span>
                </div>
              )}
            </div>
            <DialogTitle className="text-white text-lg font-semibold leading-tight">
              {t("memoryDetail.title", "Mémoire complète")}
            </DialogTitle>
            <DialogDescription className="text-white/80 text-xs mt-0.5">
              {memory.created_date &&
                format(new Date(memory.created_date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </DialogDescription>
          </div>
        </div>

        {/* Corps défilant */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-5">
          {/* Contenu intégral */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-violet-500" />
              <h3 className="text-sm font-semibold text-slate-700">
                {t("memoryDetail.fullContent", "Contenu intégral")}
              </h3>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3">
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
                {contentReadable || (
                  <span className="italic text-slate-400">
                    {t("memoryDetail.empty", "Aucun contenu")}
                  </span>
                )}
              </p>
            </div>
          </section>

          {/* Contexte intégral */}
          {memory.context && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-semibold text-slate-700">
                  {t("memoryCard.context", "Contexte")}
                </h3>
              </div>
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 px-4 py-3">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                  {contextReadable}
                </p>
              </div>
            </section>
          )}

          {/* Contexte émotionnel */}
          {memory.emotional_context && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <h3 className="text-sm font-semibold text-slate-700">
                  {t("memoryCard.emotion", "Émotion")}
                </h3>
              </div>
              <div className="rounded-xl border border-pink-100 bg-pink-50/40 px-4 py-3">
                <p className="text-sm text-slate-700">
                  😊 {memory.emotional_context.emotion} ({memory.emotional_context.intensity}/10)
                  {memory.user_sentiment && ` • ${t("memoryCard.userSentiment", "Sentiment utilisateur")}: ${memory.user_sentiment}`}
                </p>
              </div>
            </section>
          )}

          {/* Références cross-modales */}
          {memory.cross_modal_references && memory.cross_modal_references.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-semibold text-slate-700">
                  {t("memoryCard.crossModalRefs", "Références cross-modales")}
                </h3>
              </div>
              <div className="space-y-1.5">
                {memory.cross_modal_references.map((ref, idx) => {
                  const RefIcon = modalityIcons[ref.modality] || Brain;
                  return (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-600 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2">
                      <RefIcon className="w-3.5 h-3.5 mt-0.5 text-indigo-500 flex-shrink-0" />
                      <span className="flex-1">{ref.reference}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Mémoires liées */}
          {memory.linked_memory_ids && memory.linked_memory_ids.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-semibold text-slate-700">
                  {t("memoryCard.linked", "Mémoires liées")} ({memory.linked_memory_ids.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {memory.linked_memory_ids.map((id, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs text-indigo-600 border-indigo-200">
                    <Link2 className="w-3 h-3 mr-1" />
                    {id.slice(0, 8)}…
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          {memory.tags && memory.tags.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-700">
                  {t("memoryCard.tagsLabel", "Tags")}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {memory.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Métadonnées d'accès */}
          <section className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {t("memoryDetail.created", "Créée le")}{" "}
                {memory.created_date && format(new Date(memory.created_date), "d MMM yyyy", { locale: fr })}
              </span>
            </div>
            {memory.last_accessed && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {t("memoryCard.accessed", "Accédée")}{" "}
                  {format(new Date(memory.last_accessed), "d MMM yyyy", { locale: fr })}
                </span>
              </div>
            )}
            {memory.access_count > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {memory.access_count} {t("memoryDetail.accesses", "accès")}
                </span>
              </div>
            )}
            {memory.importance != null && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Star className="w-3.5 h-3.5" />
                <span>
                  {t("memoryDetail.importance", "Importance")}: {memory.importance}/10
                </span>
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}