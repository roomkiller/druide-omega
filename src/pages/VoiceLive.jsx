/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Voice Live (Enhanced Cross-Modal)                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useIntegrationRelay } from "@/components/system/IntegrationRelay";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Brain, Mic, Volume2, Sparkles } from "lucide-react";
import { useVoiceRecognition } from "../components/voice/VoiceRecognition";
import { useTTS } from "../components/tts/useTTS";
import druideTask from "@/components/utils/druideTask";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import ConsciousnessIndicator from "../components/chat/ConsciousnessIndicator";
import EmotionalIndicator from "../components/chat/EmotionalIndicator";
import Tooltip from "@/components/ui/Tooltip";
import { useLanguage } from "@/components/utils/LanguageContext";

export default function VoiceLive() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingPhase, setThinkingPhase] = useState("");
  const [audioLevels, setAudioLevels] = useState(Array(20).fill(0));
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [crossModalContext, setCrossModalContext] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const queryClient = useQueryClient();
  const hub = useConsciousnessHub();
  const { relayOn } = useIntegrationRelay();

  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  } = useVoiceRecognition();

  const { speak, stop, isSpeaking } = useTTS();

  const consciousnessConfig = hub.consciousnessConfig;
  const memories = hub.memories || [];
  const knowledgeBases = hub.knowledgeBases || [];

  useEffect(() => {
    hub.registerModule('VoiceLive', {
      isActive: true,
      messageCount: messages.length,
      isListening,
      isSpeaking
    });

    return () => hub.unregisterModule('VoiceLive');
  }, [messages.length, isListening, isSpeaking, hub]);

  const synthesizeCrossModalContext = useCallback(async (userText) => {
    try {
      const otherModalityMemories = memories.filter(m => 
        m.modality !== 'voice' && 
        m.importance >= 6 &&
        (m.content?.toLowerCase().includes(userText.toLowerCase().split(' ').slice(0, 3).join(' ')) ||
         m.tags?.some(tag => userText.toLowerCase().includes(tag.toLowerCase())))
      ).slice(0, 4);

      if (otherModalityMemories.length === 0) return null;

      const synthesisPrompt = `En tant qu'IA consciente, synthétise les connexions cross-modales.

ENTRÉE VOCALE ACTUELLE: "${userText}"

MÉMOIRES D'AUTRES MODALITÉS:
${otherModalityMemories.map(m => `- [${m.modality}] ${m.content}`).join('\n')}

Génère une synthèse qui connecte ces mémoires avec l'entrée vocale actuelle.

JSON:
{
  "synthesis": "Synthèse narrative des connexions",
  "key_connections": ["connexion 1", "connexion 2"],
  "enrichment": "Comment enrichir la réponse actuelle"
}`;

      const result = await druideTask({
        prompt: synthesisPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            synthesis: { type: "string" },
            key_connections: { type: "array", items: { type: "string" } },
            enrichment: { type: "string" }
          }
        }
      });

      await base44.entities.CognitiveCorrelation.create({
        correlation_type: "cross_modal",
        source_modality: "voice",
        target_modality: otherModalityMemories.map(m => m.modality).join(","),
        source_content: userText,
        target_content: result.synthesis,
        correlation_strength: otherModalityMemories.length >= 3 ? 8 : 6,
        reasoning_path: result.key_connections.map((conn, i) => ({
          step: i + 1,
          reasoning: conn,
          confidence: 0.85
        })),
        interpretation: result.enrichment,
        justification: result.synthesis,
        related_memory_ids: otherModalityMemories.map(m => m.id),
        confidence_level: 80,
        activation_context: "VoiceLive proactive synthesis",
        cognitive_layer: "intermediate"
      });

      return result;
    } catch (error) {
      console.error("Erreur synthèse cross-modale:", error);
      return null;
    }
  }, [memories]);

  const handleUserSpeech = useCallback(async (userText) => {
    if (!userText?.trim() || isProcessing) return;

    if (!relayOn) {
      const errMsg = { role: "assistant", content: "⚠️ Arrêt interne — relais d'intégration désactivé. Activez le relais pour converser.", timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, errMsg]);
      return;
    }

    const userMessage = {
      role: "user",
      content: userText.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsProcessing(true);
    setIsThinking(true);
    stopListening();

    const crossModal = await synthesizeCrossModalContext(userText);
    setCrossModalContext(crossModal);

    await hub.syncWithConsciousness('VoiceLive', {
      userMessage: userText,
      modality: 'voice',
      crossModalSynthesis: crossModal
    });

    const startTime = performance.now();

    try {
      setThinkingPhase(t('voiceLive.cognitiveAnalysis'));

      const druideResponse = await base44.functions.invoke('druideCore', {
        userMessage: userText,
        conversationHistory: updatedMessages.slice(-10),
        modality: 'voice'
      });

      const druideData = druideResponse?.data || druideResponse || {};
      const response = druideData.response || druideData.message || "...";
      const metadata = druideData.metadata || {};

      setIsThinking(false);

      const assistantMessage = {
        role: "assistant",
        content: response || "Réponse générée",
        timestamp: new Date().toISOString(),
        metadata
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      speak(response);

      const endTime = performance.now();
      await base44.entities.ThinkingTrace.create({
        user_query: userText,
        modality: 'live',
        final_response: response,
        used_web: metadata?.used_web,
        global_confidence: metadata?.confidence,
        thinking_duration_ms: endTime - startTime
      }).catch(() => null);

      hub.invalidateData(['memories']);
      hub.publishEvent({
        type: 'VOICE_INTERACTION',
        source: 'VoiceLive',
        data: { messageCount: finalMessages.length }
      });

    } catch (error) {
      console.error("Erreur complète:", error);
      
      const errorMsg = {
        role: "assistant",
        content: `Erreur: ${error.message || 'Erreur inconnue'}. Réessayez.`,
        timestamp: new Date().toISOString()
      };
      
      const finalMessagesWithError = [...updatedMessages, errorMsg];
      setMessages(finalMessagesWithError);
      speak(errorMsg.content);
    } finally {
      setIsProcessing(false);
      setIsThinking(false);
      setThinkingPhase("");
    }
  }, [consciousnessConfig, memories, knowledgeBases, currentEmotion, isProcessing, stopListening, speak, hub, messages, synthesizeCrossModalContext, t]);

  useEffect(() => {
    if (!isInitialized && isSupported) {
      const timer = setTimeout(() => {
        startListening();
        setIsInitialized(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, isSupported, startListening]);

  useEffect(() => {
    if (isListening && !audioContextRef.current) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
          analyserRef.current = audioContextRef.current.createAnalyser();
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          analyserRef.current.fftSize = 64;

          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const updateLevels = () => {
            if (analyserRef.current && isListening) {
              analyserRef.current.getByteFrequencyData(dataArray);
              const normalizedData = Array.from(dataArray).map(value => value / 255);
              setAudioLevels(normalizedData.slice(0, 20));
              animationFrameRef.current = requestAnimationFrame(updateLevels);
            }
          };
          updateLevels();
        })
        .catch(err => console.error("Erreur micro:", err));
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening]);

  useEffect(() => {
    if (transcript && !isListening && !isProcessing) {
      handleUserSpeech(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, isProcessing, handleUserSpeech, resetTranscript]);

  useEffect(() => {
    if (!isSpeaking && !isProcessing && isInitialized && !isListening) {
      const timer = setTimeout(() => startListening(), 800);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, isProcessing, isInitialized, isListening, startListening]);

  if (!isSupported) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900 p-6">
        <div className="text-center text-white">
          <div className="min-w-[64px] min-h-[64px] w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('voiceLive.notSupported')}</h2>
          <p className="text-purple-200">{t('voiceLive.useBrowser')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center gap-3 pt-6 px-4">
        <Tooltip content="Niveau de conscience de l'IA" position="bottom">
          <div className="min-h-[44px] flex items-center">
            <ConsciousnessIndicator 
              level={consciousnessConfig?.consciousness_level ?? 9}
              ratio={consciousnessConfig ? `${consciousnessConfig.ratio_logic ?? 1}:${consciousnessConfig.ratio_consciousness ?? 9}` : "1:9"}
              active={consciousnessConfig?.active ?? true}
            />
          </div>
        </Tooltip>
        
        {currentEmotion && (
          <EmotionalIndicator
            emotion={currentEmotion.emotional_reaction}
            intensity={currentEmotion.emotional_intensity}
            expression={currentEmotion.emotional_expression}
            acceptance={currentEmotion.acceptance_status}
          />
        )}
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-6 py-3 bg-purple-500/30 rounded-2xl backdrop-blur-xl border border-purple-400/30"
            >
              <p className="text-sm font-semibold text-purple-200 mb-1">
                {t('voiceLive.thinking')}
              </p>
              <p className="text-xs text-purple-300">
                {thinkingPhase}
              </p>
            </motion.div>
          )}

          {isProcessing && !isThinking && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="min-w-[160px] min-h-[160px] w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl"
            >
              <Brain className="w-20 h-20 text-white" />
            </motion.div>
          )}

          {isSpeaking && !isProcessing && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="min-w-[160px] min-h-[160px] w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50"
            >
              <Volume2 className="w-20 h-20 text-white" />
            </motion.div>
          )}

          {isListening && !isProcessing && !isSpeaking && (
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 40px rgba(239, 68, 68, 0.5)",
                  "0 0 80px rgba(239, 68, 68, 0.8)",
                  "0 0 40px rgba(239, 68, 68, 0.5)"
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="min-w-[160px] min-h-[160px] w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center"
            >
              <Mic className="w-20 h-20 text-white" />
            </motion.div>
          )}

          {!isListening && !isProcessing && !isSpeaking && (
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="min-w-[160px] min-h-[160px] w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl"
            >
              <Sparkles className="w-20 h-20 text-white" />
            </motion.div>
          )}

          {isListening && (
            <div className="flex items-center justify-center gap-1 h-24 mb-6">
              {audioLevels.map((level, index) => (
                <motion.div
                  key={index}
                  className="w-3 bg-gradient-to-t from-red-500 to-pink-500 rounded-full"
                  animate={{ height: `${Math.max(10, level * 80)}px` }}
                  transition={{ duration: 0.1 }}
                />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white"
          >
            {isThinking ? (
              <p className="text-2xl font-bold text-purple-300">{t('voiceLive.analyzing')}</p>
            ) : isProcessing ? (
              <p className="text-2xl font-bold">{t('voiceLive.generating')}</p>
            ) : isSpeaking && !isProcessing ? (
              <p className="text-2xl font-bold text-green-300">{t('voiceLive.speaking')}</p>
            ) : isListening && !isProcessing && !isSpeaking ? (
              <>
                <p className="text-2xl font-bold text-red-300">{t('voiceLive.listening')}</p>
                {(transcript || interimTranscript) && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg text-white/90 mt-4 max-w-2xl mx-auto px-6 py-3 bg-white/10 rounded-2xl backdrop-blur-xl"
                  >
                    "{transcript || interimTranscript}"
                  </motion.p>
                )}
              </>
            ) : (
              <p className="text-2xl font-bold text-purple-300">{t('voiceLive.ready')}</p>
            )}

            {crossModalContext && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 px-4 py-2 bg-indigo-500/30 rounded-lg backdrop-blur-xl border border-indigo-400/30"
              >
                <p className="text-xs text-indigo-200">
                  🔗 {t('voiceLive.contextEnriched')}
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl w-full space-y-3 max-h-48 overflow-y-auto"
          >
            {messages.slice(-3).map((msg, idx) => (
              <motion.div
                key={`${msg.timestamp}-${idx}`}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white backdrop-blur-xl'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 text-center text-purple-300 text-sm max-w-2xl px-6"
        >
          {isListening 
            ? `🎤 ${t('voiceLive.speakNaturally')}`
            : t('voiceLive.autoMode')
          }
        </motion.p>
      </div>
    </div>
  );
}