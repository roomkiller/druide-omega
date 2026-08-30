import { useEffect, useRef } from 'react';

/**
 * Détection de voix (VAD léger) — le micro s'ouvre AU SON de la voix.
 * Le flux audio reste acquis pendant toute la session : seul le droit de
 * déclencher (armed) s'ouvre et se ferme, donc aucune re-demande de permission.
 *
 * En plus de l'ouverture du micro, le flux sert de repère de tour de parole :
 * on sait quand la voix commence et quand elle s'éteint franchement. C'est ce
 * repère — et non un simple minuteur — qui fait basculer l'écoute vers la
 * formulation d'une réponse, et inversement.
 *
 * @param enabled       session vocale en cours (acquisition du flux)
 * @param armed         autorisé à déclencher maintenant (Druide ne parle pas, etc.)
 * @param onVoice       appelé une fois quand une voix est détectée (ouverture micro)
 * @param onSpeechStart appelé à chaque reprise de parole (même micro déjà ouvert)
 * @param onSpeechEnd   appelé quand la voix s'éteint franchement (fin de tour)
 */
export default function useVoiceActivation({
  enabled,
  armed,
  onVoice,
  onSpeechStart,
  onSpeechEnd,
  // Seuil haut : seule une voix adressée de près dépasse ce niveau. Un
  // ventilateur, un clavier ou une télévision restent sous la barre.
  threshold = 0.32,
  // ~600 ms de parole soutenue avant d'ouvrir : un bruit sec n'y arrive pas.
  requiredFrames = 36,
  // ~700 ms de silence franc : la respiration entre deux mots ne suffit pas,
  // mais une phrase terminée se reconnaît tout de suite.
  silenceFrames = 42
}) {
  const armedRef = useRef(armed);
  const callbackRef = useRef(onVoice);
  const startRef = useRef(onSpeechStart);
  const endRef = useRef(onSpeechEnd);
  const firedRef = useRef(false);

  armedRef.current = armed;
  callbackRef.current = onVoice;
  startRef.current = onSpeechStart;
  endRef.current = onSpeechEnd;

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
    // Tour de parole en cours : sert à ne signaler la fin qu'après un vrai début.
    let speaking = false;

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
            // Reprise de parole : le tour appartient encore à l'autre.
            if (!speaking && loudFrames >= 6) {
              speaking = true;
              startRef.current?.();
            }
          } else {
            quietFrames++;
            if (quietFrames > 4) loudFrames = 0;
            // Silence franc après une parole : le tour se rend.
            if (speaking && quietFrames >= silenceFrames) {
              speaking = false;
              endRef.current?.();
            }
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
  }, [enabled, threshold, requiredFrames, silenceFrames]);
}