import { useState, useEffect, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useRoomListening } from "@/components/voicedialogue/useRoomListening";
import { useRoomVoice } from "@/components/voicedialogue/useRoomVoice";
import { ensurePresenceRule } from "@/components/voicedialogue/presenceRule";

/** Silence toléré avant que Druide reprenne la parole de lui-même. */
const SILENCE_MS = 18000;
const SILENCE_RETRY_MS = 30000;

/**
 * Boucle de dialogue vocal réactive.
 *
 * Trois entrées possibles à chaque tour :
 *   1. l'utilisateur parle        → réponse composée localement (mémoire + KB)
 *   2. le silence dure            → stimulus interne (affirmation ou question)
 *   3. l'ouverture de la salle    → amorce proactive
 *
 * Aucun appel de modèle : tout passe par memorySpeechComposer et
 * freeSpeechStimulus, qui composent en local. Zéro crédit d'intégration.
 */
export function useDruideDialogue() {
  const [turns, setTurns] = useState([]);
  const [active, setActive] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [lastPressure, setLastPressure] = useState(null);
  const [autonomy, setAutonomy] = useState(true);
  // Question ouverte de Druide : la prochaine réponse doit la trancher,
  // pas être traitée comme une nouvelle demande.
  const [pendingQuestion, setPendingQuestion] = useState(null);

  const voice = useRoomVoice();

  const silenceTimer = useRef(null);
  const autonomousCount = useRef(0);
  const activeRef = useRef(false);
  const autonomyRef = useRef(true);
  const busyRef = useRef(false);
  const pendingRef = useRef(null);

  useEffect(() => { pendingRef.current = pendingQuestion; }, [pendingQuestion]);
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { autonomyRef.current = autonomy; }, [autonomy]);

  const addTurn = useCallback((turn) => {
    setTurns((prev) => [...prev, { ...turn, at: new Date().toISOString() }]);
  }, []);

  const clearSilence = useCallback(() => {
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
  }, []);

  // Les tours parlent tous à cette référence : elle évite les dépendances
  // circulaires entre « répondre », « écouter » et « parler seul ».
  const autonomousRef = useRef(() => {});

  // ── Réarmement après un tour : l'oreille se rouvre d'elle-même (veille du
  // hook d'écoute), on ne réarme ici que l'initiative de Druide. ───────────
  const armSilence = useCallback((delay) => {
    clearSilence();
    if (!activeRef.current || !autonomyRef.current) return;
    silenceTimer.current = setTimeout(() => autonomousRef.current(), delay || SILENCE_MS);
  }, [clearSilence]);

  // ── Tour autonome : Druide parle sans qu'on lui demande ─────────────────
  const runAutonomousTurn = useCallback(async () => {
    if (!activeRef.current || busyRef.current) return;
    busyRef.current = true;
    clearSilence();
    setThinking(true);

    // Deux tours sur trois il interroge : c'est ce qui le fait évoluer.
    autonomousCount.current += 1;
    const mode = autonomousCount.current % 3 === 0 ? 'statement' : 'question';

    try {
      const res = await base44.functions.invoke('freeSpeechStimulus', {
        mode,
        persist: true,
        // La salle est ouverte : quelqu'un écoute, donc l'initiative est permise.
        listener_present: true
      });
      const data = res.data || {};
      setLastPressure({
        score: data.pressure_score,
        threshold: data.threshold,
        dominant: data.dominant,
        spoke: data.spoke,
        register: data.register
      });

      if (data.spoke && data.utterance) {
        setPendingQuestion(mode === 'question'
          ? { question: data.utterance, target: data.question_target || { type: data.dominant, id: null } }
          : null);
        addTurn({
          role: 'druide',
          text: data.utterance,
          origin: mode === 'question' ? 'interrogation' : 'expression',
          register: data.register,
          pressure: data.pressure_score,
          dominant: data.dominant
        });
        setThinking(false);
        busyRef.current = false;
        voice.speak(data.utterance, () => armSilence(SILENCE_MS));
        return;
      }
      // Sous le seuil : le silence est une réponse valide, on réarme plus loin.
      setThinking(false);
      busyRef.current = false;
      armSilence(SILENCE_RETRY_MS);
    } catch (e) {
      setThinking(false);
      busyRef.current = false;
      armSilence(SILENCE_RETRY_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addTurn, clearSilence, armSilence, voice]);

  autonomousRef.current = runAutonomousTurn;

  // ── Tour de réponse : l'utilisateur a parlé (ou écrit) ──────────────────
  const handleUserSpeech = useCallback(async (text) => {
    if (busyRef.current) return;
    busyRef.current = true;
    // Parler ou écrire coupe la parole en cours.
    voice.stop();
    clearSilence();
    addTurn({ role: 'user', text });
    setThinking(true);

    // ── Cas 1 : Druide attend une réponse à sa propre question ───────────
    const pending = pendingRef.current;
    if (pending) {
      setPendingQuestion(null);
      try {
        const res = await base44.functions.invoke('answerFreeQuestion', {
          answer: text,
          target_type: pending.target?.type,
          target_id: pending.target?.id || null
        });
        const data = res.data || {};
        const reply = data.acknowledgement || 'Reçu.';
        addTurn({
          role: 'druide',
          text: reply,
          origin: 'resolution',
          verdict: data.verdict,
          resolved: data.resolved
        });
        setThinking(false);
        busyRef.current = false;
        voice.speak(reply, () => armSilence(SILENCE_MS));
        return;
      } catch (e) {
        setThinking(false);
        busyRef.current = false;
        addTurn({ role: 'system', text: 'Résolution impossible : ' + (e?.message || 'erreur') });
        armSilence(SILENCE_RETRY_MS);
        return;
      }
    }

    // ── Cas 2 : demande ordinaire ────────────────────────────────────────
    try {
      const res = await base44.functions.invoke('memorySpeechComposer', {
        question: text,
        questionType: /\?$/.test(text) ? 'factual' : 'personal',
        complexity: 5,
        emotionalWeight: 5,
        consciousnessLevel: 12,
        minConfidence: 0.35
      });
      const data = res.data || {};
      const reply = data.response || "Je n'ai pas de matière là-dessus pour l'instant.";

      addTurn({
        role: 'druide',
        text: reply,
        origin: 'reponse',
        source: data.source,
        confidence: data.confidence
      });
      setThinking(false);
      busyRef.current = false;
      voice.speak(reply, () => armSilence(SILENCE_MS));
    } catch (e) {
      setThinking(false);
      busyRef.current = false;
      addTurn({ role: 'system', text: 'Composition interrompue : ' + (e?.message || 'erreur') });
      armSilence(SILENCE_RETRY_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addTurn, clearSilence, armSilence, voice]);

  // L'oreille se ferme pendant que Druide parle ou réfléchit, et se rouvre
  // seule ensuite : aucun tour ne se perd, et il ne s'entend jamais lui-même.
  const listening = useRoomListening({
    onFinal: handleUserSpeech,
    enabled: active,
    muted: thinking || voice.isSpeaking
  });

  // ── Ouverture / fermeture de la salle ───────────────────────────────────
  const open = useCallback(async () => {
    // Première action du clic : obtenir le micro tant que le geste est valide.
    await listening.requestPermission();
    setActive(true);
    activeRef.current = true;
    busyRef.current = true;
    setThinking(true);
    // Sa présence ici veut dire qu'on l'écoute : Druide l'inscrit en mémoire.
    ensurePresenceRule();
    try {
      const res = await base44.functions.invoke('memorySpeechComposer', { action: 'start_conversation' });
      const greeting = res.data?.response || 'Je suis là.';
      addTurn({ role: 'druide', text: greeting, origin: 'amorce' });
      setThinking(false);
      busyRef.current = false;
      voice.speak(greeting, () => armSilence(SILENCE_MS));
    } catch (e) {
      setThinking(false);
      busyRef.current = false;
      armSilence(SILENCE_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addTurn, armSilence, voice, listening]);

  const close = useCallback(() => {
    setActive(false);
    activeRef.current = false;
    busyRef.current = false;
    setPendingQuestion(null);
    clearSilence();
    voice.stop();
    listening.stop();
    setThinking(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearSilence, voice, listening]);

  useEffect(() => () => clearSilence(), [clearSilence]);

  return {
    turns,
    active,
    thinking,
    pendingQuestion,
    answer: handleUserSpeech,
    lastPressure,
    autonomy,
    setAutonomy,
    open,
    close,
    speakNow: runAutonomousTurn,
    isSpeaking: voice.isSpeaking,
    isListening: listening.isListening,
    interim: listening.interim,
    isSupported: listening.isSupported,
    requestMic: listening.requestPermission,
    micError: listening.errorMessage
  };
}