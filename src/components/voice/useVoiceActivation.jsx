import { useEffect, useRef } from 'react';

/**
 * Détection de voix (VAD léger) — le micro s'ouvre AU SON de la voix.
 * Le flux audio reste acquis pendant toute la session : seul le droit de
 * déclencher (armed) s'ouvre et se ferme, donc aucune re-demande de permission.
 *
 * @param enabled  session vocale en cours (acquisition du flux)
 * @param armed    autorisé à déclencher maintenant (Druide ne parle pas, etc.)
 * @param onVoice  appelé une fois quand une voix est détectée
 */
export default function useVoiceActivation({
  enabled,
  armed,
  onVoice,
  // Seuil haut : seule une voix adressée de près dépasse ce niveau. Un
  // ventilateur, un clavier ou une télévision restent sous la barre.
  threshold = 0.32,
  // ~600 ms de parole soutenue avant d'ouvrir : un bruit sec n'y arrive pas.
  requiredFrames = 36
}) {
  const armedRef = useRef(armed);
  const callbackRef = useRef(onVoice);
  const firedRef = useRef(false);

  armedRef.current = armed;
  callbackRef.current = onVoice;

  // Réarmement : dès que le droit de déclencher revient, un nouveau son compte.
  useEffect(() => {
    if (armed) firedRef.current = false;
  }, [armed]);

  useEffect(() => {
    if (!enabled) return;

    let stream = null;
    let audioContext = null;
    let frame = null;
    let cancelled = false;
    let loudFrames = 0;
    let quietFrames = 0;

    // Nettoyage matériel du signal : bruit ambiant et écho écartés en amont.
    navigator.mediaDevices.getUserMedia({
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
        autoGainControl: false
      }
    })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        audioContext.createMediaStreamSource(stream).connect(analyser);
        const data = new Uint8Array(analyser.fftSize);

        const tick = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length);

          // Parole soutenue seulement : un creux bref (entre deux syllabes) ne
          // remet pas le compteur à zéro, mais un silence franc l'efface.
          if (rms > threshold) {
            loudFrames++;
            quietFrames = 0;
          } else if (++quietFrames > 4) {
            loudFrames = 0;
          }
          if (loudFrames >= requiredFrames && armedRef.current && !firedRef.current) {
            firedRef.current = true;
            loudFrames = 0;
            callbackRef.current?.();
          }
          frame = requestAnimationFrame(tick);
        };
        tick();
      })
      .catch((err) => console.log('[VoiceActivation] Micro indisponible:', err?.message));

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (audioContext) audioContext.close().catch(() => null);
    };
  }, [enabled, threshold, requiredFrames]);
}