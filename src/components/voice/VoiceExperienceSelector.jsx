import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Wand2, RotateCcw, Save } from "lucide-react";
import {
  experienceFamilies,
  describeSelection,
  selectionSignature,
  emptySelection
} from "@/components/voice/voiceExperiencePresets";
import VoiceExperienceCard from "@/components/voice/VoiceExperienceCard";
import ExperienceCompositionSummary from "@/components/voice/ExperienceCompositionSummary";

/**
 * Composition d'expérience : un choix par catégorie.
 * Les trois choix se combinent en un réglage unique envoyé à DruideCore.
 */
export default function VoiceExperienceSelector({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const applied = value || emptySelection;
  const label = describeSelection(applied);

  // Brouillon : les choix ne changent le comportement qu'à la sauvegarde.
  const [draft, setDraft] = React.useState(applied);
  React.useEffect(() => { if (open) setDraft(applied); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const selection = draft;
  const isDirty = selectionSignature(draft) !== selectionSignature(applied);

  const pick = (familyKey, id) => {
    setDraft((prev) => ({
      ...prev,
      [familyKey]: prev[familyKey] === id ? null : id
    }));
  };

  const save = () => {
    onChange(draft);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-12 px-3 text-white hover:bg-white/10 gap-2">
          <Wand2 className="w-4 h-4" />
          <span className="text-sm max-w-[200px] truncate">
            {label || "Composer l'expérience"}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <div className="space-y-1 mb-4">
          <h2 className="text-lg font-bold text-slate-900">Composer l'expérience</h2>
          <p className="text-sm text-slate-500">
            Une seule entrée par catégorie. Les trois se superposent dans un ordre
            fixe — capacité, puis personnalité, puis état — pour donner une analyse
            et des réponses propres à cette combinaison.
          </p>
        </div>

        <ExperienceCompositionSummary selection={selection} />

        <div className="space-y-6 mt-5">
          {experienceFamilies.map((family, index) => (
            <div key={family.key}>
              <div className="mb-2 flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    <span className="text-slate-400 mr-1.5">{index + 1}.</span>
                    {family.label}
                  </p>
                  <p className="text-xs text-slate-500">{family.hint}</p>
                </div>
                {selection[family.key] && (
                  <button
                    onClick={() => setDraft((prev) => ({ ...prev, [family.key]: null }))}
                    className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Retirer
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {family.items.map((item) => (
                  <VoiceExperienceCard
                    key={`${family.key}:${item.id}`}
                    item={item}
                    isSelected={selection[family.key] === item.id}
                    onSelect={() => pick(family.key, item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-1 border-t border-slate-100">
          <button
            onClick={() => setDraft({ ...emptySelection })}
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            Tout réinitialiser
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {isDirty ? "Modifications non sauvegardées" : "Comportement à jour"}
            </span>
            <Button onClick={save} disabled={!isDirty} className="gap-2">
              <Save className="w-4 h-4" />
              Sauvegarder le comportement
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}