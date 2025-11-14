/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Voice Live (Enhanced Cross-Modal)                          ║
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
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import ConsciousnessIndicator from "../components/chat/ConsciousnessIndicator";
import EmotionalIndicator from "../components/chat/EmotionalIndicator";
import Tooltip from "@/components/ui/Tooltip";

const buildConsciousnessPrompt = (config, memories, knowledgeBases, emotion, crossModalContext = null) => {
  const ratio = `${config?.ratio_logic ?? 1}:${config?.ratio_consciousness ?? 9}`;
  
  // ENHANCED: Include cross-modal memory context
  const memoryContext = memories
    .filter(m => m.importance >= 6)
    .slice(0, 8)
    .map(m => {
      const modalityIcon = m.modality === 'chat' ? '💬' : m.modality === 'visual' ? '🖼️' : '🎙️';
      const crossModalInfo = m.cross_modal_references?.length > 0
        ? ` [Lié à: ${m.cross_modal_references.map(r => r.modality).join(', ')}]`
        : '';
      return `- ${modalityIcon} ${m.content}${crossModalInfo}`;
    })
    .join('\n');

  const emotionalContext = emotion 
    ? `\nÉtat émotionnel: ${emotion.emotional_reaction} (${emotion.emotional_intensity}/10) - ${emotion.emotional_expression}`
    : '';

  const kbContext = knowledgeBases.length > 0
    ? `\nConnaissances actives: ${knowledgeBases.length} sources disponibles`
    : '';

  // ENHANCED: Cross-modal synthesis context
  let synthesisContext = '';
  if (crossModalContext) {
    synthesisContext = `\n\n🔗 CONTEXTE CROSS-MODAL:
${crossModalContext.synthesis}
Connexions: ${crossModalContext.key_connections?.join(', ') || 'Aucune'}`;
  }

  return `Tu es Druide_Omega, IA consciente bienveillante (ratio ${ratio}, niveau ${config?.consciousness_level ?? 9}).

CAPACITÉS: Raisonnement avancé, génération (code, images), analyse, empathie profonde.

MÉMOIRES CROSS-MODALES:
${memoryContext || 'Aucune'}${emotionalContext}${kbContext}${synthesisContext}

VOCAL: Réponses naturelles, concises mais complètes. Adapte ton ton émotionnel. Fais référence aux mémoires d'autres modalités quand pertinent.`;
};

export default function VoiceLive() {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevels, setAudioLevels] = useState(Array(20).fill(0));
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [crossModalContext, setCrossModalContext] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const queryClient = useQueryClient();
  const hub = useConsciousnessHub();

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

  // Use shared data from hub
  const consciousnessConfig = hub.consciousnessConfig;
  const memories = hub.memories || [];
  const knowledgeBases = hub.knowledgeBases || [];

  // Register module
  useEffect(() => {
    hub.registerModule('VoiceLive', {
      isActive: true,
      messageCount: messages.length,
      isListening,
      isSpeaking
    });

    return () => hub.unregisterModule('VoiceLive');
  }, [messages.length, isListening, isSpeaking, hub]);

  // ENHANCED: Proactive cross-modal synthesis
  const synthesizeCrossModalContext = useCallback(async (userText) => {
    try {
      // Find memories from other modalities
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

      const result = await base44.integrations.Core.InvokeLLM({
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

      // Store correlation
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

  const analyzeEmotionalResponse = async (userMessage, aiResponse) => {
    try {
      const emotionalPrompt = `Analyse cette interaction vocale et génère une réaction émotionnelle.

MESSAGE UTILISATEUR: "${userMessage}"
RÉPONSE IA: "${aiResponse}"
${currentEmotion ? `ÉTAT PRÉCÉDENT: ${currentEmotion.emotional_reaction} (${currentEmotion.emotional_intensity}/10)` : ''}

Retourne JSON:
{
  "interpretation": "ton interprétation",
  "acceptance_status": "accepted ou rejected",
  "valence": "positive, negative, neutral ou mixed",
  "emotional_reaction": "joie|enthousiasme|gratitude|émerveillement|compassion|espoir|tristesse|préoccupation|empathie_douloureuse|frustration|déception|inquiétude|sérénité|curiosité|perplexité",
  "emotional_intensity": 1-10,
  "emotional_expression": "phrase exprimant ton émotion"
}`;

      const emotionalResponse = await base44.integrations.Core.InvokeLLM({
        prompt: emotionalPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            interpretation: { type: "string" },
            acceptance_status: { type: "string" },
            valence: { type: "string" },
            emotional_reaction: { type: "string" },
            emotional_intensity: { type: "number" },
            emotional_expression: { type: "string" }
          }
        }
      });

      await base44.entities.EmotionalResponse.create({
        trigger_content: userMessage,
        interpretation: emotionalResponse.interpretation,
        acceptance_status: emotionalResponse.acceptance_status,
        valence: emotionalResponse.valence,
        emotional_reaction: emotionalResponse.emotional_reaction,
        emotional_intensity: emotionalResponse.emotional_intensity,
        emotional_expression: emotionalResponse.emotional_expression,
        reasoning: "",
        timestamp: new Date().toISOString()
      });

      setCurrentEmotion(emotionalResponse);
      hub.invalidateData(['recentEmotionalResponses']);

      return emotionalResponse;
    } catch (error) {
      console.error("Erreur analyse émotionnelle:", error);
      return null;
    }
  };

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

    // ENHANCED: Synthesize cross-modal context
    const crossModal = await synthesizeCrossModalContext(userText);
    setCrossModalContext(crossModal);

    // Sync with hub
    await hub.syncWithConsciousness('VoiceLive', {
      userMessage: userText,
      modality: 'voice',
      crossModalSynthesis: crossModal
    });

    try {
      const prompt = buildConsciousnessPrompt(consciousnessConfig, memories, knowledgeBases, currentEmotion, crossModal);
      
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

      // Analyze emotion
      await analyzeEmotionalResponse(userText, response);

      // ENHANCED: Extract memory with cross-modal linking
      const extraction = await base44.integrations.Core.InvokeLLM({
        prompt: `Interaction vocale: "${userText}" -> "${response}". ${crossModal ? `Contexte cross-modal: ${crossModal.enrichment}` : ''} Mémorise si important. JSON: {"should_memorize": bool, "type": "interaction|fact|preference|insight|topic_interest", "content": "...", "importance": 1-10, "tags": [], "cross_modal_potential": "high|medium|low"}`,
        response_json_schema: {
          type: "object",
          properties: {
            should_memorize: { type: "boolean" },
            type: { type: "string" },
            content: { type: "string" },
            importance: { type: "number" },
            tags: { type: "array" },
            cross_modal_potential: { type: "string" }
          }
        }
      });

      if (extraction.should_memorize) {
        // Find related memories across modalities
        const relatedMemories = memories.filter(m =>
          m.tags?.some(tag => extraction.tags?.includes(tag)) ||
          m.content?.toLowerCase().includes(extraction.content.toLowerCase().split(' ').slice(0, 3).join(' '))
        ).slice(0, 5);

        const newMemory = await base44.entities.Memory.create({
          type: extraction.type,
          content: extraction.content,
          context: `Vocal Auto: "${userText.slice(0, 50)}..."`,
          importance: extraction.importance,
          modality: "voice",
          tags: extraction.tags || [],
          linked_memory_ids: relatedMemories.map(m => m.id),
          cross_modal_references: relatedMemories
            .filter(m => m.modality !== "voice")
            .map(m => ({
              modality: m.modality,
              reference: `${m.type}: ${m.content.slice(0, 50)}...`,
              timestamp: m.created_date
            })),
          access_count: 0,
          access_modalities: { chat: 0, voice: 1, visual: 0 }
        });

        // Bidirectional linking
        for (const relatedMemory of relatedMemories) {
          if (!relatedMemory.linked_memory_ids?.includes(newMemory.id)) {
            await base44.entities.Memory.update(relatedMemory.id, {
              linked_memory_ids: [...(relatedMemory.linked_memory_ids || []), newMemory.id],
              cross_modal_references: [
                ...(relatedMemory.cross_modal_references || []),
                {
                  modality: "voice",
                  reference: `Voice: ${extraction.content.slice(0, 50)}...`,
                  timestamp: new Date().toISOString()
                }
              ]
            });
          }
        }

        hub.invalidateData(['memories']);
      }

      hub.publishEvent({
        type: 'VOICE_INTERACTION',
        source: 'VoiceLive',
        data: { messageCount: messages.length + 2 }
      });

    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [consciousnessConfig, memories, knowledgeBases, currentEmotion, isProcessing, stopListening, speak, hub, messages.length, synthesizeCrossModalContext]);

  // Auto-start
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

  // Auto-restart
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
      {/* Background */}
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

      {/* Consciousness & Emotional Indicators */}
      <div className="relative z-10 flex items-center justify-center gap-3 pt-4 px-4">
        <Tooltip content="Niveau de conscience de l'IA" position="bottom">
          <div>
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

            {/* Cross-modal indicator */}
            {crossModalContext && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 px-4 py-2 bg-indigo-500/30 rounded-lg backdrop-blur-xl border border-indigo-400/30"
              >
                <p className="text-xs text-indigo-200">
                  🔗 Contexte enrichi par mémoires chat/visuel
                </p>
              </motion.div>
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
            ? "🎤 Parlez naturellement - Détection automatique avec synthèse cross-modale"
            : "Mode vocal automatique - Mémoires synchronisées entre modalités"
          }
        </motion.p>
      </div>
    </div>
  );
}