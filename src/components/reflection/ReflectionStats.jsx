import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { READING_LABELS } from "./reflectionLabels";

function Stat({ label, value, hint }) {
  return (
    <Card className="rounded-xl border-slate-200 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
        {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export default function ReflectionStats({ reflections }) {
  const n = reflections.length;
  if (n === 0) return null;

  const avg = (get) => Math.round(reflections.reduce((s, r) => s + (get(r) || 0), 0) / n);
  const doubtShare = Math.round((reflections.filter((r) => r.admitted_doubt).length / n) * 100);

  const counts = reflections.reduce((acc, r) => {
    acc[r.reading] = (acc[r.reading] || 0) + 1;
    return acc;
  }, {});
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Stat label="Réflexions" value={n} hint="tours de parole consignés" />
      <Stat label="Appuis moyens" value={avg((r) => r.support)} hint="faits et mémoires mobilisés" />
      <Stat label="Confiance moyenne" value={`${avg((r) => r.confidence)}%`} hint="mesurée au moment de parler" />
      <Stat
        label="Doute reconnu"
        value={`${doubtShare}%`}
        hint={dominant ? `lecture dominante : ${READING_LABELS[dominant[0]] || dominant[0]}` : null}
      />
    </div>
  );
}