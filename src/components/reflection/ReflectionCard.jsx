import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Layers, Gauge } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { READING_LABELS, READING_STYLES, PATH_LABELS } from "./reflectionLabels";

export default function ReflectionCard({ reflection }) {
  const r = reflection;
  return (
    <Card className="rounded-xl border-slate-200 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <CardContent className="p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={READING_STYLES[r.reading] || READING_STYLES.enonce}>
            {READING_LABELS[r.reading] || r.reading}
          </Badge>
          {r.speech_path && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-600">
              {PATH_LABELS[r.speech_path] || r.speech_path}
            </Badge>
          )}
          {r.admitted_doubt && (
            <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200">
              Doute reconnu
            </Badge>
          )}
          <span className="ml-auto text-xs text-slate-400">
            {r.created_date ? format(new Date(r.created_date), "d MMM yyyy, HH:mm", { locale: fr }) : ""}
          </span>
        </div>

        <p className="flex gap-2 text-slate-800 leading-relaxed">
          <Quote className="w-4 h-4 mt-1 shrink-0 text-indigo-400" />
          <span className="italic">{r.analysis}</span>
        </p>

        {r.question && (
          <p className="text-sm text-slate-500 border-l-2 border-slate-200 pl-3">
            {r.question}
          </p>
        )}

        <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            {r.support || 0} appui{(r.support || 0) === 1 ? "" : "s"}
            {" "}({r.fact_count || 0} de la base, {r.memory_count || 0} en mémoire)
          </span>
          {typeof r.confidence === "number" && (
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" />
              confiance {r.confidence}%
            </span>
          )}
          {r.lead && <span className="text-slate-400">amorce : « {r.lead} »</span>}
        </div>
      </CardContent>
    </Card>
  );
}