
import React from "react";
import { motion } from "framer-motion";
import { FileText, Link as LinkIcon, Type, Eye, Tag, Calendar, Trash2, Power, CheckCircle, AlertCircle, Loader2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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

const sourceIcons = {
  file: FileText,
  url: LinkIcon,
  text: Type
};

const sourceColors = {
  file: "from-blue-500 to-cyan-500",
  url: "from-green-500 to-emerald-500",
  text: "from-purple-500 to-indigo-500"
};

const sourceLabels = {
  file: "Fichier",
  url: "URL",
  text: "Texte"
};

const statusIcons = {
  processing: Loader2,
  ready: CheckCircle,
  error: AlertCircle
};

const statusColors = {
  processing: "text-blue-600 bg-blue-50",
  ready: "text-green-600 bg-green-50",
  error: "text-red-600 bg-red-50"
};

export default function KnowledgeCard({ knowledge, onDelete, onToggleActive }) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const SourceIcon = sourceIcons[knowledge.source_type] || FileText;
  const sourceColor = sourceColors[knowledge.source_type] || "from-purple-500 to-indigo-500";
  const sourceLabel = sourceLabels[knowledge.source_type] || knowledge.source_type;
  const StatusIcon = statusIcons[knowledge.status] || CheckCircle;
  const statusColor = statusColors[knowledge.status] || "text-gray-600 bg-gray-50";

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(knowledge.id);
  };

  const getRelevanceColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    if (score >= 40) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative"
    >
      <div className={`relative bg-white border-2 rounded-2xl p-5 transition-all duration-300 ${
        knowledge.active ? "border-purple-200 shadow-lg shadow-purple-100" : "border-slate-200 opacity-60"
      }`}>
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${sourceColor} rounded-xl flex items-center justify-center shadow-md`}>
            <SourceIcon className="w-7 h-7 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-2">{knowledge.title}</h3>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {sourceLabel}
                  </Badge>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${statusColor}`}>
                    <StatusIcon className={`w-3 h-3 ${knowledge.status === 'processing' ? 'animate-spin' : ''}`} />
                    <span className="capitalize">{knowledge.status}</span>
                  </div>
                  {knowledge.relevance_score !== undefined && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getRelevanceColor(knowledge.relevance_score)}`}>
                      <Zap className="w-3 h-3" />
                      <span>{knowledge.relevance_score}% pertinent</span>
                    </div>
                  )}
                  {knowledge.access_count > 0 && (
                    <Badge variant="outline" className="text-slate-600">
                      <Eye className="w-3 h-3 mr-1" />
                      {knowledge.access_count} références
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg">
                  <Power className={`w-4 h-4 ${knowledge.active ? 'text-green-600' : 'text-slate-400'}`} />
                  <Switch
                    checked={knowledge.active}
                    onCheckedChange={() => onToggleActive(knowledge.id, !knowledge.active)}
                  />
                </div>
              </div>
            </div>

            {knowledge.summary && (
              <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                {knowledge.summary}
              </p>
            )}

            {knowledge.last_reviewed && (
              <p className="text-xs text-slate-500 italic mb-2">
                Dernière révision: {format(new Date(knowledge.last_reviewed), "d MMM yyyy 'à' HH:mm", { locale: fr })}
              </p>
            )}

            {knowledge.source_url && (
              <a
                href={knowledge.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-600 hover:text-purple-700 underline mb-2 inline-block"
              >
                {knowledge.source_url}
              </a>
            )}

            {knowledge.extracted_facts && knowledge.extracted_facts.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-700 mb-2">Faits extraits:</p>
                <ul className="space-y-1">
                  {knowledge.extracted_facts.slice(0, 3).map((fact, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-purple-500 mt-0.5">•</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                  {knowledge.extracted_facts.length > 3 && (
                    <li className="text-xs text-slate-400 italic ml-4">
                      +{knowledge.extracted_facts.length - 3} autres faits...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {knowledge.tags && knowledge.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <Tag className="w-3 h-3 text-slate-400" />
                {knowledge.tags.map((tag, idx) => (
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
                  {knowledge.created_date && format(new Date(knowledge.created_date), "d MMM yyyy", { locale: fr })}
                </div>
                {knowledge.last_accessed && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Consulté {format(new Date(knowledge.last_accessed), "d MMM", { locale: fr })}
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
                    <AlertDialogTitle>Supprimer cette source ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action supprimera définitivement cette source de connaissance. Les mémoires associées seront conservées.
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
