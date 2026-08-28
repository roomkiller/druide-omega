/**
 * Sélecteur de préréglages de Conscience — DruideControl
 * © 2025 AMG+A.L
 * Affiche les deux familles (Capacités + Personnalités) et
 * applique un préréglage complet dans pendingChanges via onApply.
 */
import React from "react";
import {
  Rocket, Calculator, Sparkles, Heart, Scale, Leaf,
  Mountain, Compass, HeartHandshake, Building2, Moon,
  Target, Smile, Infinity
} from "lucide-react";
import { capacityPresets, personalityPresets } from "./consciousnessPresets";

const ICONS = {
  Rocket, Calculator, Sparkles, Heart, Scale, Leaf,
  Mountain, Compass, HeartHandshake, Building2, Moon,
  Target, Smile, Infinity
};

function PresetCard({ preset, isEn, onApply }) {
  const Icon = ICONS[preset.icon] || Sparkles;
  return (
    <button
      type="button"
      onClick={() => onApply(preset)}
      className="group text-left rounded-xl border border-slate-200 bg-white hover:border-purple-300 hover:shadow-md transition-all p-3 flex flex-col gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <div className="flex items-center gap-2">
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${preset.accent} flex items-center justify-center text-white shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-semibold text-sm text-slate-800 leading-tight">
          {isEn ? preset.labelEn : preset.label}
        </span>
      </div>
      <p className="text-xs text-slate-500 leading-snug">
        {isEn ? preset.descriptionEn : preset.description}
      </p>
    </button>
  );
}

function PresetSection({ title, presets, isEn, onApply }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-700 mb-3">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {presets.map(p => (
          <PresetCard key={p.id} preset={p} isEn={isEn} onApply={onApply} />
        ))}
      </div>
    </div>
  );
}

export default function PresetSelector({ isEn, onApply }) {
  return (
    <div className="space-y-6">
      <PresetSection
        title={isEn ? "Capacity Presets" : "Préréglages de Capacité"}
        presets={capacityPresets}
        isEn={isEn}
        onApply={onApply}
      />
      <div className="border-t border-slate-100" />
      <PresetSection
        title={isEn ? "Personality Presets (functional mixes)" : "Préréglages de Personnalité (mix fonctionnels)"}
        presets={personalityPresets}
        isEn={isEn}
        onApply={onApply}
      />
    </div>
  );
}