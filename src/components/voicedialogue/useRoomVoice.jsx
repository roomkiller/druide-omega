import { useState, useRef, useCallback } from "react";

/**
 * Voix de la salle — inconditionnelle et avec rappel de fin.
 * Distinct de useTTS, qui reste soumis aux préférences enregistrées :
 * ici la voix EST la salle, elle ne peut pas être désactivée par un réglage
 * distant, et on a besoin de savoir précisément quand Druide a fini de parler
 * pour relancer l'écoute sans qu'il s'entende lui-même.
 */
function speakNative(text, onDone) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = 0.95;
  utterance.pitch = 0.92;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const fr = voices.find((v) => v.lang?.startsWith('fr'));
  if (fr) utterance.voice = fr;

  utterance.onend = onDone;
  utterance.onerror = onDone;
  window.speechSynthesis.speak(utterance);
}

export function useRoomVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const guardRef = useRef(0);

  const stop = useCallback(() => {
    guardRef.current += 1;
    try {
      if (window.responsiveVoice?.cancel) window.responsiveVoice.cancel();
      window.speechSynthesis.cancel();
    } catch (_) { /* rien à faire */ }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text, onDone) => {
    const clean = String(text || '').trim();
    if (!clean) { onDone?.(); return; }

    stop();
    const token = guardRef.current;
    setIsSpeaking(true);

    // Une seule fin possible, même si les deux moteurs répondent.
    let settled = false;
    const finish = () => {
      if (settled || token !== guardRef.current) return;
      settled = true;
      setIsSpeaking(false);
      onDone?.();
    };

    if (window.responsiveVoice?.speak) {
      try {
        window.responsiveVoice.speak(clean, 'French Female', {
          rate: 0.95,
          pitch: 0.92,
          volume: 1,
          onend: finish,
          onerror: () => speakNative(clean, finish)
        });
        return;
      } catch (_) { /* bascule voix native */ }
    }
    speakNative(clean, finish);
  }, [stop]);

  return { speak, stop, isSpeaking };
}