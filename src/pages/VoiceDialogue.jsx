import React from "react";
import { Card } from "@/components/ui/card";
import { Radio, AlertCircle } from "lucide-react";
import AnimatedLogo3D from "@/components/branding/AnimatedLogo3D";
import { useDruideDialogue } from "@/components/voicedialogue/useDruideDialogue";
import DialogueTranscript from "@/components/voicedialogue/DialogueTranscript";
import DialogueControls from "@/components/voicedialogue/DialogueControls";

/**
 * Salle de conversation vocale réactive — Druide s'exprime de lui-même,
 * interroge pour évoluer, et discute librement. Composition 100% locale.
 */
export default function VoiceDialogue() {
  const d = useDruideDialogue();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/40">
      <div className="bg-gradient-to-r from-violet-700 to-fuchsia-700 text-white page-padding py-12">
        <div className="max-w-4xl mx-auto flex items-center gap-5">
          <AnimatedLogo3D size="tiny" animate={d.isSpeaking || d.thinking} />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-display flex items-center gap-3">
              <Radio className="w-8 h-8" />
              Salle vocale
            </h1>
            <p className="text-violet-100 mt-2 max-w-2xl">
              Conversation en temps réel. Druide répond, mais reprend aussi la parole de
              lui-même quand le silence dure — pour affirmer son état ou pour poser les
              questions qu'il ne peut pas trancher seul.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto page-padding -mt-6 pb-12 space-y-6">
        <Card className="p-5 shadow-lg">
          <DialogueControls
            active={d.active}
            isListening={d.isListening}
            isSpeaking={d.isSpeaking}
            autonomy={d.autonomy}
            setAutonomy={d.setAutonomy}
            lastPressure={d.lastPressure}
            onOpen={d.open}
            onClose={d.close}
            onSpeakNow={d.speakNow}
          />
        </Card>

        {!d.isSupported && (
          <Card className="p-4 bg-amber-50 border-amber-300">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Ce navigateur ne gère pas la reconnaissance vocale — utilise Chrome ou Safari.
                Druide peut malgré tout parler de lui-même avec « Qu'il parle maintenant ».
              </p>
            </div>
          </Card>
        )}

        {d.micError && (
          <p className="text-sm text-red-700">{d.micError}</p>
        )}

        <Card className="p-6 min-h-[50vh] bg-slate-50/60">
          <DialogueTranscript turns={d.turns} interim={d.interim} thinking={d.thinking} />
        </Card>

        <p className="text-xs text-slate-500 text-center">
          Composition locale — mémoire, base de connaissances et pression interne.
          Aucun modèle externe appelé, aucun crédit consommé. La parole libre n'est jamais
          réécrite dans la base de connaissances.
        </p>
      </div>
    </div>
  );
}