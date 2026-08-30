import React, { useState, useEffect, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useIntegrationRelay } from "@/components/system/IntegrationRelay";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MicOff, Radio, Settings, Download } from "lucide-react";
import { useVoiceRecognition } from "../components/voice/VoiceRecognition";
import { useTTS } from "../components/tts/useTTS";
import { getMobileTTS } from "../components/tts/MobileTTS";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/components/utils/LanguageContext";
import VoiceRoomControls from "@/components/voice/VoiceRoomControls";
import ContextIndicator from "../components/voice/ContextIndicator";
import CognitiveMonitor from "@/components/system/CognitiveMonitor";
import DynamicCognitiveOverlay from "@/components/chat/DynamicCognitiveOverlay";
import druideTask from "@/components/utils/druideTask";
import { VoiceRoomConnectionButton, VoiceRoomSettingsPanel } from "@/components/voice/VoiceRoomImports";
import { isWeakLocalReply, reinforceWithOpenRouter } from "@/components/voice/voiceReinforcement";
import useVoiceActivation from "@/components/voice/useVoiceActivation";
import { computeListeningPatience } from "@/components/voice/listeningPatience";
import { loadListeningCalibration, applyCalibration, recordListeningOutcome } from "@/components/voice/listeningLearning";
import VoiceRoomTranscript from "@/components/voice/VoiceRoomTranscript";
import useAdvancedVocalCommands from "@/components/voice/useAdvancedVocalCommands";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SALLE VOCALE — un seul cerveau : DruideCore.
 *
 * Cette page ne raisonne plus à la place du moteur. DruideCore assure déjà,
 * pour chaque tour et sans crédit d'intégration :
 *   • la mémoire de parole (KB + mémoires + squelette, memorySpeechComposer)
 *   • l'énonciation réflexive en « je » et son journal (SelfReflection)
 *   • les tensions, filaments, apprentissage et mémorisation (retombées)
 *   • l'axe continuum, la régulation de longueur et le formatage syntaxique
 * La salle vocale se limite donc à : écouter, transmettre, parler.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export default function VoiceRoom() {
  const { t } = useLanguage();

  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [messages, setMessages] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingPhase, setThinkingPhase] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [handsFreeModeEnabled, setHandsFreeModeEnabled] = useState(true);
  const [autoRestartListening, setAutoRestartListening] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [audioLevels, setAudioLevels] = useState(Array(20).fill(0));
  const [sessionDuration, setSessionDuration] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showDiagramGeneration, setShowDiagramGeneration] = useState(false);
  const [diagramPrompt, setDiagramPrompt] = useState("");
  const [diagramType, setDiagramType] = useState("flowchart");
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
  const [isConsciousImageGenerating, setIsConsciousImageGenerating] = useState(false);
  const [druideState, setDruideState] = useState("contemplative");
  const [coreMetadata, setCoreMetadata] = useState(null);

  const { relayOn } = useIntegrationRelay();
  const messagesEndRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    hasError,
    errorMessage,
    isMobile
  } = useVoiceRecognition();

  useEffect(() => {
    if (isMobile) {
      setHandsFreeModeEnabled(false);
      setAutoRestartListening(false);
    }
  }, [isMobile]);

  const { stop: stopOld, isSpeaking: isSpeakingOld, isEnabled: ttsEnabled } = useTTS();
  const mobileTTS = getMobileTTS();
  const [isSpeakingMobile, setIsSpeakingMobile] = useState(false);

  const speak = useCallback(async (text, lang = 'fr-FR') => {
    try {
      setIsSpeakingMobile(true);
      await mobileTTS.speak(text, {
        lang,
        onStart: () => setIsSpeakingMobile(true),
        onEnd: () => setIsSpeakingMobile(false)
      });
    } catch (error) {
      console.error('Erreur TTS:', error);
      setIsSpeakingMobile(false);
    }
  }, [mobileTTS]);

  const stop = useCallback(() => {
    mobileTTS.stop();
    stopOld();
    setIsSpeakingMobile(false);
  }, [mobileTTS, stopOld]);

  const isSpeaking = isSpeakingMobile || isSpeakingOld;

  const { data: consciousnessConfig } = useQuery({
    queryKey: ['consciousnessConfig'],
    queryFn: async () => {
      const configs = await base44.entities.ConsciousnessConfig.list();
      return configs[0] || null;
    }
  });

  // Lecture allégée : la salle vocale n'a plus besoin du corpus complet,
  // DruideCore lit lui-même KB et mémoires dans sa vague parallèle.
  const { data: memories = [] } = useQuery({
    queryKey: ['voiceRoomMemories'],
    queryFn: () => base44.entities.Memory.list('-importance', 20)
  });

  const { data: recentEmotionalResponses = [] } = useQuery({
    queryKey: ['recentEmotionalResponses'],
    queryFn: () => base44.entities.EmotionalResponse.list('-timestamp', 1)
  });

  // L'émotion courante vient du module émotionnel back-end, plus d'une
  // analyse LLM refaite ici à chaque tour.
  const currentEmotion = recentEmotionalResponses[0] || null;

  const handleAdvancedVocalCommand = useAdvancedVocalCommands({
    setMessages,
    speak,
    setBusy: (v) => { setIsProcessing(v); setIsThinking(v); },
    setPhase: setThinkingPhase,
    t
  });

  const handleImageGenerated = async (originalPrompt, imageUrl, consciousAnalysis) => {
    const content = `🎨 ${t('voiceRoom.consciousImageGenerated', { prompt: originalPrompt })}:\n- ${consciousAnalysis?.cognitive_thoughts?.logical_interpretation || t('voiceRoom.consciousImageAnalysisDefault')}\n- ${t('voiceRoom.emotionFelt')}: ${consciousAnalysis?.emotions_felt?.tonality || t('voiceRoom.emotionDefault')}`;

    setMessages(prev => [...prev, {
      role: "assistant",
      content,
      timestamp: new Date().toISOString(),
      metadata: { type: "conscious_image", imageUrl, consciousAnalysis, originalPrompt }
    }]);

    if (ttsEnabled) speak(content);

    if (conversationId) {
      base44.entities.VisualContent.create({
        conversation_id: conversationId,
        type: "conscious_generated_image",
        url: imageUrl,
        prompt: originalPrompt,
        description: `Image générée consciemment en conversation vocale`,
        tags: ["vocal", "generated", "conscious"],
        conscious_analysis: consciousAnalysis
      }).catch(() => {});
    }
  };

  const handleImageUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    setShowImageUpload(false);
    setIsProcessing(true);
    stopListening();

    try {
      const uploadResults = await Promise.all(
        Array.from(files).map(file => base44.integrations.Core.UploadFile({ file }))
      );
      const fileUrls = uploadResults.map(r => r.file_url);

      const analysis = await druideTask({
        prompt: files.length === 1
          ? `Analyse cette image en détail et décris ce que tu vois de manière claire et concise pour une conversation vocale.`
          : `Analyse et compare ces ${files.length} images de manière synthétique pour une conversation vocale.`,
        file_urls: fileUrls
      });

      setMessages(prev => [...prev, {
        role: "assistant",
        content: `📷 ${t('voiceRoom.imageAnalysis', { count: files.length })}:\n\n${analysis}`,
        timestamp: new Date().toISOString(),
        image_urls: fileUrls
      }]);

      if (ttsEnabled) speak(analysis);
    } catch (error) {
      console.error("Erreur upload image:", error);
    } finally {
      setIsProcessing(false);
      if (handsFreeModeEnabled && autoRestartListening && !isSpeaking) {
        setTimeout(() => startListening(), 500);
      }
    }
  }, [ttsEnabled, speak, stopListening, handsFreeModeEnabled, autoRestartListening, isSpeaking, startListening, t]);

  const handleDiagramGeneration = useCallback(async () => {
    if (!diagramPrompt.trim()) return;

    setShowDiagramGeneration(false);
    setIsGeneratingDiagram(true);
    stopListening();

    const subject = diagramPrompt;
    const currentType = diagramType;
    setDiagramPrompt("");

    try {
      const mermaidCode = await druideTask({
        prompt: `Génère un diagramme Mermaid de type ${currentType} pour: ${subject}\nRetourne UNIQUEMENT le code Mermaid, sans balises markdown ni explications.`
      });

      const cleaned = mermaidCode.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();
      const diagramUrl = `https://mermaid.ink/img/${encodeURIComponent(cleaned)}`;

      setMessages(prev => [...prev, {
        role: "assistant",
        content: `📊 ${t('voiceRoom.diagramGenerated', { type: currentType === 'flowchart' ? 'flowchart' : 'diagramme', prompt: subject })}`,
        timestamp: new Date().toISOString(),
        diagram_url: diagramUrl
      }]);

      if (ttsEnabled) speak(t('voiceRoom.diagramGeneratedSpeak'));
    } catch (error) {
      console.error("Erreur génération diagramme:", error);
    } finally {
      setIsGeneratingDiagram(false);
      if (handsFreeModeEnabled && autoRestartListening && !isSpeaking) {
        setTimeout(() => startListening(), 500);
      }
    }
  }, [diagramPrompt, diagramType, ttsEnabled, speak, stopListening, handsFreeModeEnabled, autoRestartListening, isSpeaking, startListening, t]);

  const toggleMicrophone = useCallback(async () => {
    if (isPaused) return;
    if (isListening) {
      stopListening();
    } else {
      if (isMobile) {
        stopListening();
        await new Promise(resolve => setTimeout(resolve, 400));
      }
      await startListening();
    }
  }, [isPaused, isListening, stopListening, startListening, isMobile]);

  const togglePause = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      if (handsFreeModeEnabled) setTimeout(() => startListening(), 300);
    } else {
      setIsPaused(true);
      stopListening();
      stop();
    }
  }, [isPaused, handsFreeModeEnabled, startListening, stopListening, stop]);

  const interruptAI = useCallback(() => {
    if (isSpeaking) stop();
  }, [isSpeaking, stop]);

  // ═════════════════════════════════════════════════════════════════════════
  // TOUR DE PAROLE — un seul appel : DruideCore. Renfort OpenRouter uniquement
  // si la matière locale est trop mince. Aucune analyse dupliquée ici.
  // ═════════════════════════════════════════════════════════════════════════
  const handleUserSpeech = useCallback(async (userText) => {
    if (!userText?.trim()) return;
    if (isProcessing || isPaused || isConsciousImageGenerating || isGeneratingDiagram) return;

    if (!relayOn) setStatusMessage("⚠️ Relais coupé — je réponds en local");

    if (await handleAdvancedVocalCommand(userText)) {
      if (!isMobile && handsFreeModeEnabled && autoRestartListening) {
        setTimeout(() => startListening(), 500);
      }
      return;
    }

    const userMessage = { role: "user", content: userText, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setIsThinking(true);
    setInteractionCount(prev => prev + 1);
    setThinkingPhase("DruideCore : orchestration consciente...");
    setStatusMessage("🧠 Druide Omega réfléchit...");
    stopListening();

    // L'authentification ne sert qu'à la sauvegarde : elle ne retient pas la parole.
    const userPromise = base44.auth.me().catch(() => null);

    let aiResponse;
    let metadata = null;

    try {
      const coreRes = await base44.functions.invoke('druideCore', {
        userMessage: userText,
        conversationHistory: [...messages, userMessage].slice(-10),
        conversation_id: conversationId,
        consciousnessConfig
      });
      aiResponse = coreRes.data?.response || coreRes.data;
      metadata = coreRes.data?.metadata || null;
      setCoreMetadata(metadata);

      if (isWeakLocalReply(aiResponse, metadata)) {
        setThinkingPhase("Renfort OpenRouter : la matière locale est mince...");
        setStatusMessage("🌐 Renfort OpenRouter...");
        const reinforced = await reinforceWithOpenRouter({
          userText,
          history: [...messages, userMessage].slice(-8),
          localReply: typeof aiResponse === 'string' ? aiResponse : '',
          memories: memories.filter(m => m.importance >= 7)
        });
        aiResponse = reinforced.text;
      }
    } catch (coreError) {
      console.error("Erreur DruideCore:", coreError);
      aiResponse = "Je rencontre une difficulté technique. Peux-tu reformuler ta question ?";
    }

    setIsThinking(false);
    setThinkingPhase("");

    const assistantMessage = { role: "assistant", content: aiResponse, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMessage, assistantMessage];
    setMessages(updatedMessages);

    setStatusMessage("🔊 Druide Omega parle...");
    try {
      await speak(aiResponse, 'fr-FR');
      setStatusMessage("");
    } catch (error) {
      setStatusMessage("❌ Erreur vocale");
    }

    // Trace légère seulement : mémoire, apprentissage, tensions et filaments
    // sont déjà pris en charge par les retombées de DruideCore.
    base44.entities.ThinkingTrace.create({
      user_query: userText,
      modality: 'voice',
      final_response: String(aiResponse).slice(0, 2000),
      used_web: metadata?.used_web || false,
      global_confidence: metadata?.confidence ?? 60
    }).catch(() => {});

    const currentUser = await userPromise;
    if (currentUser) {
      if (!conversationId) {
        base44.entities.Conversation.create({
          title: `Conversation vocale - ${new Date().toLocaleDateString('fr-FR')}`,
          messages: updatedMessages,
          last_message_at: new Date().toISOString()
        }).then(conv => setConversationId(conv.id)).catch(() => {});
      } else {
        base44.entities.Conversation.update(conversationId, {
          messages: updatedMessages,
          last_message_at: new Date().toISOString()
        }).catch(() => {});
      }
    }

    setIsProcessing(false);
    if (!isMobile && handsFreeModeEnabled && autoRestartListening && !isSpeaking) {
      setTimeout(() => startListening(), 500);
    }
  }, [
    messages, conversationId, consciousnessConfig, memories, relayOn,
    isProcessing, isPaused, isConsciousImageGenerating, isGeneratingDiagram,
    handleAdvancedVocalCommand, speak, stopListening, startListening,
    handsFreeModeEnabled, autoRestartListening, isSpeaking, isMobile
  ]);

  useEffect(() => {
    if (!isConnected || isPaused) return;
    const interval = setInterval(() => setSessionDuration(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isConnected, isPaused]);

  useEffect(() => {
    if (!isConnected) return;

    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (!isPaused && !isProcessing && !isSpeaking && !isThinking) toggleMicrophone();
      }
      if (e.code === 'Escape') { e.preventDefault(); togglePause(); }
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyI') { e.preventDefault(); interruptAI(); }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConnected, isPaused, isProcessing, isSpeaking, isThinking, toggleMicrophone, togglePause, interruptAI]);

  useEffect(() => {
    if (isListening && !audioContextRef.current) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
          analyserRef.current = audioContextRef.current.createAnalyser();
          audioContextRef.current.createMediaStreamSource(stream).connect(analyserRef.current);
          analyserRef.current.fftSize = 64;

          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          const updateLevels = () => {
            if (analyserRef.current && isListening) {
              analyserRef.current.getByteFrequencyData(dataArray);
              setAudioLevels(Array.from(dataArray).map(v => v / 255).slice(0, 20));
              animationFrameRef.current = requestAnimationFrame(updateLevels);
            }
          };
          updateLevels();
        })
        .catch(err => console.error("Erreur accès micro:", err));
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isListening]);

  const handleSendVoiceMessage = useCallback(() => {
    const trimmed = transcript?.trim();
    if (!trimmed) {
      setStatusMessage("❌ Aucun texte capturé");
      return;
    }
    if (isProcessing || isPaused || isThinking) {
      setStatusMessage("⏸️ Système occupé, attends un instant...");
      return;
    }
    handleUserSpeech(trimmed);
    resetTranscript();
  }, [transcript, isProcessing, isPaused, isThinking, handleUserSpeech, resetTranscript]);

  // Patience d'écoute : refs stables pour que l'attente ne se réinitialise
  // qu'à une nouvelle parole, pas à chaque re-render.
  const patienceTimerRef = useRef(null);
  const lastHandledRef = useRef("");
  const pendingSpeechRef = useRef(null);
  // Routine d'apprentissage de l'écoute : le palier choisi, l'heure de départ
  // et une reprise éventuelle de parole servent de verdict après le tour.
  const patienceObsRef = useRef(null);
  const calibrationRef = useRef({});

  const { data: listeningCalibration = {} } = useQuery({
    queryKey: ['listeningCalibration'],
    queryFn: loadListeningCalibration,
    staleTime: 60_000
  });
  useEffect(() => { calibrationRef.current = listeningCalibration; }, [listeningCalibration]);

  // Verdict + correction du palier, une fois la parole prise.
  const learnFromListening = useCallback(() => {
    const obs = patienceObsRef.current;
    patienceObsRef.current = null;
    if (!obs) return;
    recordListeningOutcome({
      tier: obs.tier,
      plannedMs: obs.plannedMs,
      waitedMs: Date.now() - obs.startedAt,
      userResumed: obs.userResumed
    }).catch(() => {});
  }, []);

  const speechHandlerRef = useRef(handleUserSpeech);
  const currentEmotionRef = useRef(currentEmotion);
  useEffect(() => { speechHandlerRef.current = handleUserSpeech; }, [handleUserSpeech]);
  useEffect(() => { currentEmotionRef.current = currentEmotion; }, [currentEmotion]);
  useEffect(() => () => clearTimeout(patienceTimerRef.current), []);

  useEffect(() => {
    if (isMobile) return; // Sur mobile, on attend le clic sur ENVOYER

    const trimmed = transcript?.trim();
    if (!trimmed) return;

    // Chevauchement écoute / attente / transcription : un fragment déjà contenu
    // dans le tour précédent est un résidu, pas une nouvelle parole.
    const previous = lastHandledRef.current;
    if (previous === trimmed) return;
    if (previous && previous.toLowerCase().includes(trimmed.toLowerCase())) {
      resetTranscript();
      return;
    }

    if (isProcessing || isPaused || isThinking) return;

    const { delayMs, tier, decision } = computeListeningPatience(trimmed, currentEmotionRef.current);
    // Le palier de base est corrigé par ce que Druide a appris de son écoute.
    const learnedDelay = applyCalibration(delayMs, tier, calibrationRef.current);
    setStatusMessage(decision === 'répondre' ? "💬 Je te réponds..." : "🤫 Je t'écoute...");

    patienceObsRef.current = {
      tier,
      plannedMs: learnedDelay,
      startedAt: Date.now(),
      userResumed: false
    };

    pendingSpeechRef.current = trimmed;
    clearTimeout(patienceTimerRef.current);
    patienceTimerRef.current = setTimeout(() => {
      pendingSpeechRef.current = null;
      lastHandledRef.current = trimmed;
      learnFromListening();
      speechHandlerRef.current?.(trimmed);
      resetTranscript();
    }, learnedDelay);
  }, [transcript, isProcessing, isPaused, isThinking, isMobile, resetTranscript, learnFromListening]);

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages.length]);

  useEffect(() => {
    if (isMobile) return;
    if (!isSpeaking && !isProcessing && isConnected && !isPaused && autoRestartListening
      && handsFreeModeEnabled && !isListening && !isThinking && !hasError) {
      const timer = setTimeout(() => {
        if (!isListening && !hasError) startListening();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, isProcessing, isConnected, isPaused, autoRestartListening, handsFreeModeEnabled, isListening, startListening, isThinking, hasError, isMobile]);

  // Bascule de tour de parole : c'est l'extinction de la voix qui donne la
  // parole, pas un minuteur. Reprendre la parole remet Druide en écoute.
  const flushPendingSpeech = useCallback(() => {
    const pending = pendingSpeechRef.current;
    if (!pending) return;
    clearTimeout(patienceTimerRef.current);
    pendingSpeechRef.current = null;
    lastHandledRef.current = pending;
    setStatusMessage("💬 Je te réponds...");
    learnFromListening();
    speechHandlerRef.current?.(pending);
    resetTranscript();
  }, [resetTranscript, learnFromListening]);

  const holdForMoreSpeech = useCallback(() => {
    if (!pendingSpeechRef.current) return;
    clearTimeout(patienceTimerRef.current);
    // Reprise de parole pendant l'attente : l'écoute était trop courte.
    if (patienceObsRef.current) patienceObsRef.current.userResumed = true;
    setStatusMessage("🤫 Je t'écoute...");
  }, []);

  useVoiceActivation({
    enabled: isConnected && !isPaused,
    armed: isConnected && !isPaused && !isListening && !isSpeaking,
    onVoice: () => startListening(),
    onSpeechStart: holdForMoreSpeech,
    onSpeechEnd: () => {
      if (!isMobile && !isSpeaking && !isProcessing) flushPendingSpeech();
    }
  });

  const toggleConnection = async () => {
    if (isConnected) {
      stopListening();
      stop();
      setIsConnected(false);
      setIsPaused(false);
      setSessionDuration(0);
      setInteractionCount(0);
      setMessages([]);
      setConversationId(null);
      setCoreMetadata(null);
      prevMessagesLengthRef.current = 0;
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } else {
      setIsConnected(true);
      setIsPaused(false);
      setSessionDuration(0);
      setInteractionCount(0);
      if (handsFreeModeEnabled && !isMobile) {
        setTimeout(() => { if (!isListening) startListening(); }, 1200);
      }
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const exportConversation = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'Vous' : 'Le druide'}: ${m.content}`).join('\n\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-vocale-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isSupported) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MicOff className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('voiceRoom.notSupported')}</h2>
          <p className="text-slate-600 mb-4">{t('voiceRoom.notSupportedDesc')}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left text-sm">
            <p className="font-semibold text-blue-900 mb-2">📱 {t('voiceRoom.onMobile')}:</p>
            <ul className="text-blue-700 space-y-1 list-disc list-inside">
              <li>{t('voiceRoom.useChromeOrSafari')}</li>
              <li>{t('voiceRoom.allowMicro')}</li>
              <li>{t('voiceRoom.checkInternet')}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/50 to-indigo-900/50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-6 flex-shrink-0">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="min-w-[56px] min-h-[56px] w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Radio className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{t('voiceRoom.title')}</h1>
              <p className="text-sm text-purple-200">
                {isConnected
                  ? `${formatDuration(sessionDuration)} • ${interactionCount} ${t('voiceRoom.interaction')}${interactionCount > 1 ? 's' : ''}`
                  : t('voiceRoom.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {isConnected && (
              <>
                <ContextIndicator
                  messagesCount={messages.length}
                  memoriesCount={memories.length}
                  summariesCount={coreMetadata?.memory_speech ? 1 : 0}
                  currentEmotion={currentEmotion}
                />

                <CognitiveMonitor compact />

                <Dialog open={showSettings} onOpenChange={setShowSettings}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="min-w-[48px] min-h-[48px] text-white hover:bg-white/10 touch-target">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <VoiceRoomSettingsPanel
                      handsFreeModeEnabled={handsFreeModeEnabled}
                      onHandsFreeModeChange={setHandsFreeModeEnabled}
                      autoRestartListening={autoRestartListening}
                      onAutoRestartListeningChange={setAutoRestartListening}
                    />
                  </DialogContent>
                </Dialog>

                {messages.length > 1 && (
                  <Button onClick={exportConversation} variant="ghost" size="icon" className="min-w-[48px] min-h-[48px] text-white hover:bg-white/10 touch-target">
                    <Download className="w-5 h-5" />
                  </Button>
                )}

                {hasError && errorMessage && (
                  <div className="bg-red-500/20 text-red-200 px-3 py-2 rounded-lg text-xs max-w-xs">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                  <span className="text-sm text-green-400 font-medium">
                    {isPaused ? t('voiceRoom.paused') : t('voiceRoom.active')}
                    {isMobile && " (Mobile)"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isConnected && (
        <DynamicCognitiveOverlay
          isThinking={isThinking}
          thinkingPhase={thinkingPhase}
          analyticalDepth={coreMetadata?.emotional_weight ?? 5}
          cognitiveMode={coreMetadata?.question_type || 'balanced'}
          conversationThemes={[]}
        />
      )}

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
        {!isConnected ? (
          <VoiceRoomConnectionButton isConnected={isConnected} toggleConnection={toggleConnection} isGeneratingWelcome={false} />
        ) : (
          <div className="w-full max-w-5xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
            <div className="overflow-y-auto pr-4 pb-4 force-scrollbar flex-1">
              <VoiceRoomTranscript messages={messages} endRef={messagesEndRef} />
            </div>
            <VoiceRoomControls
              isListening={isListening}
              isProcessing={isProcessing}
              isSpeaking={isSpeaking}
              isPaused={isPaused}
              isThinking={isThinking}
              isConsciousImageGenerating={isConsciousImageGenerating}
              isGeneratingDiagram={isGeneratingDiagram}
              audioLevels={audioLevels}
              transcript={transcript}
              interimTranscript={interimTranscript}
              statusMessage={statusMessage}
              isMobile={isMobile}
              druideState={druideState}
              setDruideState={setDruideState}
              toggleMicrophone={toggleMicrophone}
              showImageUpload={showImageUpload}
              setShowImageUpload={setShowImageUpload}
              handleImageUpload={handleImageUpload}
              handleImageGenerated={handleImageGenerated}
              consciousnessConfig={consciousnessConfig}
              t={t}
              stopListening={stopListening}
              startListening={startListening}
              handsFreeModeEnabled={handsFreeModeEnabled}
              autoRestartListening={autoRestartListening}
              showDiagramGeneration={showDiagramGeneration}
              setShowDiagramGeneration={setShowDiagramGeneration}
              diagramType={diagramType}
              setDiagramType={setDiagramType}
              diagramPrompt={diagramPrompt}
              setDiagramPrompt={setDiagramPrompt}
              handleDiagramGeneration={handleDiagramGeneration}
              togglePause={togglePause}
              toggleConnection={toggleConnection}
              thinkingPhase={thinkingPhase}
              handleSendVoiceMessage={handleSendVoiceMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE
 * Innovation: Salle Vocale alignée sur l'orchestrateur DruideCore
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */