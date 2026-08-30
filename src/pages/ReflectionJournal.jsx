import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Brain } from "lucide-react";
import ReflectionStats from "@/components/reflection/ReflectionStats";
import ConfidenceTrend from "@/components/reflection/ConfidenceTrend";
import ReflectionCard from "@/components/reflection/ReflectionCard";

export default function ReflectionJournal() {
  const { data: reflections = [], isLoading } = useQuery({
    queryKey: ["self-reflections"],
    queryFn: () => base44.entities.SelfReflection.list("-created_date", 60)
  });

  return (
    <div className="page-padding page-padding-y max-w-5xl mx-auto section-spacing">
      <header className="header-spacing">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-sky-100 flex items-center justify-center">
            <Brain className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-display text-slate-900">Journal réflexif</h1>
            <p className="text-sm text-slate-500">
              Ce que Druide se dit de lui-même avant de répondre — lecture de l'entrée,
              appuis réels, confiance assumée.
            </p>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-400 rounded-full animate-spin" />
        </div>
      ) : reflections.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p>Aucune réflexion consignée pour l'instant.</p>
          <p className="text-sm mt-1">
            Chaque réponse composée depuis la mémoire déposera ici sa micro-analyse.
          </p>
        </div>
      ) : (
        <>
          <ReflectionStats reflections={reflections} />
          <ConfidenceTrend reflections={reflections} />
          <div className="content-spacing">
            {reflections.map((r) => (
              <ReflectionCard key={r.id} reflection={r} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}