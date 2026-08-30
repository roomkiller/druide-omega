import { useState, useEffect, useRef, useCallback } from "react";

const getSR = () => window.SpeechRecognition || window.webkitSpeechRecognition;

/**
 * Oreille de la salle vocale.
 *
 * Contrairement au hook générique, celle-ci ne coupe jamais la reconnaissance
 * quand un segment final arrive : elle le livre aussitôt par `onFinal` et
 * continue d'écouter. Une veille rouvre le micro si le navigateur ferme la
 * session de lui-même (silence, fin de segment, erreur bénigne).
 *
 * `muted` (Druide parle ou réfléchit) ferme l'oreille pour éviter qu'il
 * s'entende lui-même ; la veille la rouvre dès que c'est terminé.
 */
export function useRoomListening({ onFinal, enabled, muted }) {
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const recRef = useRef(null);
  const listeningRef = useRef(false);
  const startingRef = useRef(false);
  const onFinalRef = useRef(onFinal);
  const enabledRef = useRef(enabled);
  const mutedRef = useRef(muted);

  onFinalRef.current = onFinal;
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  // ── Instance unique, créée une seule fois ────────────────────────────────
  useEffect(() => {
    const SR = getSR();
    if (!SR) {
      setIsSupported(false);
      setErrorMessage("Ce navigateur ne gère pas la reconnaissance vocale. Utilisez Chrome, Edge ou Safari.");
      return;
    }

    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = 'fr-FR';
    r.maxAlternatives = 1;

    r.onstart = () => {
      startingRef.current = false;
      listeningRef.current = true;
      setIsListening(true);
      setErrorMessage("");
    };

    r.onresult = (event) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += t + ' ';
        else interimText += t;
      }
      setInterim(interimText);

      const text = finalText.trim();
      // Même deux mots comptent : on livre et on continue d'écouter.
      if (text.length > 1 && !mutedRef.current) {
        setInterim('');
        onFinalRef.current?.(text);
      }
    };

    r.onerror = (event) => {
      startingRef.current = false;
      listeningRef.current = false;
      setIsListening(false);
      const code = event.error;
      // Silences et interruptions : la veille rouvrira l'oreille.
      if (code === 'aborted' || code === 'no-speech') return;
      if (code === 'not-allowed' || code === 'service-not-allowed') {
        setErrorMessage(window.self !== window.top
          ? "Le microphone est bloqué dans l'aperçu intégré. Ouvrez l'application dans un onglet à part."
          : "Autorisez le microphone pour ce site (icône à gauche de l'adresse), puis rouvrez la salle.");
      } else if (code === 'network') {
        setErrorMessage("La reconnaissance vocale n'a pas pu joindre le service du navigateur. Vérifiez la connexion.");
      } else {
        setErrorMessage('Reconnaissance interrompue : ' + code);
      }
    };

    r.onend = () => {
      startingRef.current = false;
      listeningRef.current = false;
      setIsListening(false);
      setInterim('');
    };

    recRef.current = r;
    return () => { try { r.abort(); } catch (_) { /* déjà fermée */ } };
  }, []);

  const start = useCallback(() => {
    const r = recRef.current;
    if (!r || startingRef.current || listeningRef.current) return;
    startingRef.current = true;
    try {
      r.start();
    } catch (_) {
      startingRef.current = false; // « already started » : sans conséquence
    }
  }, []);

  const stop = useCallback(() => {
    const r = recRef.current;
    if (!r) return;
    try { r.stop(); } catch (_) { /* déjà arrêtée */ }
  }, []);

  // ── Veille : l'oreille reste ouverte tant que la salle l'est ─────────────
  useEffect(() => {
    if (!enabled || muted) {
      stop();
      return;
    }
    start();
    const id = setInterval(() => {
      if (!enabledRef.current || mutedRef.current) return;
      if (listeningRef.current || startingRef.current) return;
      start();
    }, 1000);
    return () => clearInterval(id);
  }, [enabled, muted, start, stop]);

  // Autorisation demandée dans le geste de l'utilisateur (clic) : hors geste,
  // le navigateur refuse sans afficher d'invite.
  const requestPermission = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("Ce navigateur n'expose pas l'accès au microphone.");
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setErrorMessage("");
      return true;
    } catch (err) {
      const name = err?.name || '';
      setErrorMessage(
        name === 'NotFoundError' || name === 'DevicesNotFoundError'
          ? "Aucun microphone détecté sur cet appareil."
          : window.self !== window.top
            ? "Le microphone est bloqué dans l'aperçu intégré. Ouvrez l'application dans un onglet à part."
            : "Autorisez le microphone pour ce site (icône à gauche de l'adresse), puis rouvrez la salle."
      );
      return false;
    }
  }, []);

  return { isListening, interim, isSupported, errorMessage, requestPermission, start, stop };
}