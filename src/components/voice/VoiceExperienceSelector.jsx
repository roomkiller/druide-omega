import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Wand2 } from "lucide-react";
import { experienceFamilies, findExperience } from "@/components/voice/voiceExperiencePresets";
import VoiceExperienceCard from "@/components/voice/VoiceExperienceCard";

/**
 * Sélecteur d'expérience de conversation.
 * Une seule expérience est active : choisir en désactive l'ancienne d'un bloc.
 */
export default function VoiceExperienceSelector({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const current = findExperience(value);

  const select = (key) => {
    onChange(key === value ? null : key);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-12 px-3 text-white hover:bg-white/10 gap-2">
          <Wand2 className="w-4 h-4" />
          <span className="text-sm max-w-[160px] truncate">
            {current ? current.label : "Expérience libre"}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <div className="space-y-1 mb-4">
          <h2 className="text-lg font-bold text-slate-900">Expérience de conversation</h2>
          <p className="text-sm text-slate-500">
            Une seule expérience à la fois : elle remplace entièrement la précédente,
            pour un raisonnement net et reconnaissable.
          </p>
        </div>

        <button
          onClick={() => select(null)}
          className={`w-full text-left p-3 mb-5 rounded-xl border transition-all ${
            !current ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <p className="text-sm font-semibold">Expérience libre</p>
          <p className={`text-xs mt-1 ${!current ? 'text-white/80' : 'text-slate-500'}`}>
            Druide garde sa configuration de conscience active, sans préréglage imposé.
          </p>
        </button>

        <div className="space-y-6">
          {experienceFamilies.map((family) => (
            <div key={family.key}>
              <div className="mb-2">
                <p className="text-sm font-semibold text-slate-800">{family.label}</p>
                <p className="text-xs text-slate-500">{family.hint}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {family.items.map((item) => {
                  const key = `${family.key}:${item.id}`;
                  return (
                    <VoiceExperienceCard
                      key={key}
                      item={item}
                      isSelected={value === key}
                      onSelect={() => select(key)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}