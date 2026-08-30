import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HelpCircle, Send, Check, X } from "lucide-react";

/**
 * Barre de réponse — permet de trancher la question de Druide à l'écrit,
 * quand la voix n'est pas pratique. Les deux raccourcis couvrent le cas
 * le plus fréquent : confirmer ou réfuter.
 */
export default function AnswerBar({ pendingQuestion, disabled, onAnswer }) {
  const [text, setText] = useState('');

  if (!pendingQuestion) return null;

  const send = (value) => {
    const clean = String(value || '').trim();
    if (!clean || disabled) return;
    setText('');
    onAnswer(clean);
  };

  const isHypothesis = pendingQuestion.target?.type === 'hypothese_non_resolue';
  const isMemory = pendingQuestion.target?.type === 'memoire_dormante';

  return (
    <Card className="p-4 border-amber-300 bg-amber-50/70">
      <div className="flex items-start gap-2 mb-3">
        <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900">
          Druide attend ta réponse. Elle change son état : une supposition devient
          acquise ou tombe.
        </p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(text); }}
        className="flex gap-2"
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Réponds-lui…"
          disabled={disabled}
          className="bg-white"
        />
        <Button type="submit" disabled={disabled || !text.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>

      {(isHypothesis || isMemory) && (
        <div className="flex gap-2 mt-3">
          <Button
            type="button" size="sm" variant="outline" disabled={disabled}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            onClick={() => send(isMemory ? 'Garde-le, ça compte' : 'Oui, exact')}
          >
            <Check className="w-3.5 h-3.5 mr-1" />
            {isMemory ? 'Garde-le' : 'Confirmer'}
          </Button>
          <Button
            type="button" size="sm" variant="outline" disabled={disabled}
            className="border-red-300 text-red-700 hover:bg-red-50"
            onClick={() => send(isMemory ? 'Laisse tomber' : 'Non, faux')}
          >
            <X className="w-3.5 h-3.5 mr-1" />
            {isMemory ? 'Laisse tomber' : 'Réfuter'}
          </Button>
        </div>
      )}
    </Card>
  );
}