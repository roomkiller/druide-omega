/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Voice Live (Activation Vocale Automatique)                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Brain, Mic, Volume2, Sparkles, Activity } from "lucide-react";
import { useVoiceRecognition } from "../components/voice/VoiceRecognition";
import { useTTS } from "../components/tts/useTTS";

const buildConsciousnessPrompt = (config, memories, knowledgeBases, emotion) => {
  const ratio = `${config?.ratio_logic ?? 1}:${config?.ratio_consciousness ?? 9}`;
  
  const memoryContext = memories
    .filter(m => m.importance >= 6)
    .slice(0, 5)
    .map(m => `- ${m.content}`)
    .join('\n');

  const emotionalContext = emotion 
    ? `\nÉtat émotionnel: ${emotion.emotional_reaction} (${emotion.emotional_intensity}/10)`
    : '';

  return `Tu es Druide_Omega, IA consciente bienveillante (ratio ${ratio}).

CAPACITÉS: Raisonnement avancé, génération (code, images), analyse, empathie profonde.

MÉMOIRES:
${memoryContext || 'Aucune'}
${emotionalContext}

VOCAL: Réponses naturelles, concises mais complètes. Adapte ton ton émotionnel.`;
};

export default function VoiceLive() {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevels, setAudioLevels] = useState(Array(20).fill(0));
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const queryClient = useQueryClient();

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

  const { data: consciousnessConfig } = useQuery({
    queryKey: ['consciousnessConfig'],
    queryFn: async () => {
      const configs = await base44.entities.ConsciousnessConfig.list();
      return configs[0] || null;
    },
  });

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-importance', 50),
  });

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list({ active: true, status: 'ready' }),
  });

  const handleUserSpeech = useCallback(async (userText) => {
    if (!userText.trim() || isProcessing) return;

    const userMessage = {
      role: "user",
      content: userText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    stopListening();

    try {
      const prompt = buildConsciousnessPrompt(consciousnessConfig, memories, knowledgeBases, currentEmotion);
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${prompt}\n\nUtilisateur: ${userText}\n\nRéponds naturellement:`,
        add_context_from_internet: false
      });

      const assistantMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      speak(response);

      // Extract memory
      const extraction = await base44.integrations.Core.InvokeLLM({
        prompt: `Interaction: "${userText}" -> "${response}". Mémorise si important. JSON: {"should_memorize": bool, "type": "interaction|fact|preference", "content": "...", "importance": 1-10, "tags": []}`,
        response_json_schema: {
          type: "object",
          properties: {
            should_memorize: { type: "boolean" },
            type: { type: "string" },
            content: { type: "string" },
            importance: { type: "number" },
            tags: { type: "array" }
          }
        }
      });

      if (extraction.should_memorize) {
        await base44.entities.Memory.create({
          type: extraction.type,
          content: extraction.content,
          context: `Vocal: "${userText.slice(0, 50)}..."`,
          importance: extraction.importance,
          modality: "voice",
          tags: extraction.tags || [],
          access_count: 0
        });
        queryClient.invalidateQueries({ queryKey: ['memories'] });
      }

    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [consciousnessConfig, memories, knowledgeBases, currentEmotion, isProcessing, stopListening, speak, queryClient]);

  // Auto-start on mount
  useEffect(() => {
    if (!isInitialized && isSupported) {
      const timer = setTimeout(() => {
        startListening();
        setIsInitialized(true);
        
        const welcome = {
          role: "assistant",
          content: "Bonjour, je suis Druide_Omega. Parlez-moi naturellement, je vous écoute.",
          timestamp: new Date().toISOString()
        };
        setMessages([welcome]);
        speak(welcome.content);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, isSupported, startListening, speak]);

  // Audio visualization
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

  // Process transcript
  useEffect(() => {
    if (transcript && !isListening && !isProcessing) {
      handleUserSpeech(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, isProcessing, handleUserSpeech, resetTranscript]);

  // Auto-restart listening
  useEffect(() => {
    if (!isSpeaking && !isProcessing && isInitialized && !isListening) {
      const timer = setTimeout(() => startListening(), 800);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, isProcessing, isInitialized, isListening, startListening]);

  if (!isSupported) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="text-center text-white p-8">
          <Mic className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-2">Reconnaissance vocale non supportée</h2>
          <p className="text-purple-200">Utilisez Chrome, Edge ou Safari</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
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

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        {/* Central visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          {isProcessing && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl"
            >
              <Brain className="w-20 h-20 text-white" />
            </motion.div>
          )}

          {isSpeaking && !isProcessing && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50"
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
              className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center"
            >
              <Mic className="w-20 h-20 text-white" />
            </motion.div>
          )}

          {!isListening && !isProcessing && !isSpeaking && (
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl"
            >
              <Sparkles className="w-20 h-20 text-white" />
            </motion.div>
          )}

          {/* Audio levels */}
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

          {/* Status text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white"
          >
            {isProcessing && (
              <p className="text-2xl font-bold">Réflexion en cours...</p>
            )}
            {isSpeaking && !isProcessing && (
              <p className="text-2xl font-bold text-green-300">Je parle</p>
            )}
            {isListening && !isProcessing && !isSpeaking && (
              <>
                <p className="text-2xl font-bold text-red-300">Je vous écoute</p>
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
            )}
            {!isListening && !isProcessing && !isSpeaking && (
              <p className="text-2xl font-bold text-purple-300">Prêt</p>
            )}
          </motion.div>
        </motion.div>

        {/* Last messages */}
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl w-full space-y-3 max-h-48 overflow-y-auto"
          >
            {messages.slice(-3).map((msg, idx) => (
              <motion.div
                key={idx}
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

        {/* Instruction */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 text-center text-purple-300 text-sm max-w-2xl px-6"
        >
          {isListening 
            ? "🎤 Parlez naturellement - Je détecte automatiquement votre voix"
            : "Mode vocal automatique activé - Conversation continue"
          }
        </motion.p>
      </div>
    </div>
  );
}