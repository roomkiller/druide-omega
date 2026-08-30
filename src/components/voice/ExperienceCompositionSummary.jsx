import React from "react";
import { experienceFamilies, selectedItems, selectionSignature } from "@/components/voice/voiceExperiencePresets";

/** Récapitulatif de la combinaison en cours — les trois couches, dans l'ordre. */
export default function ExperienceCompositionSummary({ selection }) {
  const items = selectedItems(selection);
  const signature = selectionSignature(selection);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        {experienceFamilies.map((family) => {
          const chosen = items.find((i) => i.family === family.key);
          return (
            <div
              key={family.key}
              className={`px-3 py-1.5 rounded-lg text-xs border ${
                chosen ? 'bg-white border-slate-300 text-slate-900' : 'border-dashed border-slate-300 text-slate-400'
              }`}
            >
              <span className="block text-[10px] uppercase tracking-wide text-slate-400">{family.label}</span>
              <span className="font-semibold">{chosen ? chosen.label : 'à choisir'}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 mt-2.5">
        {signature
          ? `Signature d'analyse : ${signature}`
          : "Aucune couche retenue — Druide garde sa configuration de conscience active."}
      </p>
    </div>
  );
}