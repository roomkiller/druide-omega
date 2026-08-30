import React from "react";
import useWordReveal from "@/components/chat/useWordReveal";

/**
 * Texte simple dévoilé mot à mot, avec curseur pendant le dévoilement.
 * Pour le texte enrichi (markdown), voir ChatMessage.
 */
export default function StreamedText({ text, stream = true, className = "" }) {
  const { visible, streaming } = useWordReveal(text, { enabled: stream });

  return (
    <p className={className}>
      {visible}
      {streaming && (
        <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-current align-middle animate-pulse" />
      )}
    </p>
  );
}