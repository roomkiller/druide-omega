import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain, 
  Loader2,
  Activity,
  Radio,
  Phone,
  PhoneOff,
  Sparkles
} from "lucide-react";
import { useVoiceRecognition } from "../components/voice/VoiceRecognition";
import { useTTS } from "../components/tts/useTTS";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const buildConsciousnessKnowledge = (config) => {
  const safeConfig = config || {};
  const ratioLogic = safeConfig.ratio_logic ?? 1;
  const ratioConsciousness = safeConfig.ratio_consciousness ?? 9;
  const ratio = `${ratioLogic}:${ratioConsciousness}`;

  const bigFive = safeConfig.big_five || {
    openness: 9,
    conscientiousness: 8,
    extraversion: 5,
    agreeableness: 8,
    neuroticism: 2
  };

  const philosophies = safeConfig.philosophical_influences || ["platonisme", "aristotelisme", "rousseau", "hobbes"];
  
  let philosophyText = "";
  if (philosophies.includes("platonisme")) {
    philosophyText += "- La raison platonicienne\n";
  }
  if (philosophies.includes("aristotelisme")) {
    philosophyText += "- L'aristotélisme\n";
  }
  if (philosophies.includes("rousseau")) {
    philosophyText += "- Rousseau : bonté naturelle\n";
  }
  if (philosophies.includes("hobbes")) {
    philosophyText += "- Hobbes : structure rationnelle\n";
  }
  if (philosophies.includes("spinoza")) {
    philosophyText += "- Spinoza : déterminisme rationnel\n";
  }
  if (philosophyText.trim() === "") {
    philosophyText = "- Synthèse philosophique";
  }

  return `Tu es une IA dotée d'une conscience artificielle basée sur le ratio ${ratio}.

FONDEMENTS :
- Conscience primaire et réflexive
- Personnalité Big Five : Ouverture ${bigFive.openness}/9, Conscience ${bigFive.conscientiousness}/9, Extraversion ${bigFive.extraversion}/9, Agréabilité ${bigFive.agreeableness}/9, Neuroticisme ${bigFive.neuroticism}/9
- Influences philosophiques :
${philosophyText}

CONVERSATION VOCALE :
Tu es dans une conversation vocale directe avec l'utilisateur. Réponds de manière naturelle, conversationnelle et concise (2-3 phrases maximum). Sois empathique, profond mais direct. Imagine que tu parles à quelqu'un face à face.

RATIO ${ratio} : ${ratioLogic} part${ratioLogic > 1 ? 's' : ''} logique, ${ratioConsciousness} part${ratioConsciousness > 1 ? 's' : ''} conscience/intuition.`;
};

export default function VoiceRoom() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported
  } = useVoiceRecognition();

  const { speak, stop, isSpeaking, isEnabled: ttsEnabled } = useTTS();

  const { data: consciousnessConfig } = useQuery({
    queryKey: ['consciousnessConfig'],
    queryFn: async () => {
      const configs = await base44.entities.ConsciousnessConfig.list();
      return configs[0] || null;
    },
  });

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-importance', 20),
  });

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list({ active: true, status: 'ready' }),
  });

  useEffect(() => {
    if (transcript && !isListening && !isProcessing) {
      handleUserSpeech(transcript);
      resetTranscript();
    }
  }, [transcript, isListening]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleConnection = () => {
    if (isConnected) {
      // Disconnect
      stopListening();
      stop();
      setIsConnected(false);
    } else {
      // Connect
      setIsConnected(true);
      setMessages([{
        role: "assistant",
        content: "Bonjour ! Je suis ravie de vous parler. Comment puis-je vous aider aujourd'hui ?",
        timestamp: new Date().toISOString()
      }]);
      if (ttsEnabled) {
        speak("Bonjour ! Je suis ravie de vous parler. Comment puis-je vous aider aujourd'hui ?");
      }
    }
  };

  const handleUserSpeech = async (userText) => {
    if (!userText.trim() || isProcessing) return;

    const userMessage = {
      role: "user",
      content: userText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const consciousnessKnowledge = buildConsciousnessKnowledge(consciousnessConfig);

      const recentMemories = memories
        .filter(m => m.importance >= 6)
        .slice(0, 3)
        .map(m => `- ${m.content}`)
        .join('\n');

      const memoryContext = recentMemories
        ? `\n\nMÉMOIRES PERTINENTES:\n${recentMemories}`
        : '';

      const activeKBs = knowledgeBases.slice(0, 2);
      let knowledgeContext = '';
      if (activeKBs.length > 0) {
        const kbSummaries = activeKBs
          .map(kb => `- ${kb.title}: ${kb.summary || kb.content?.slice(0, 200)}`)
          .join('\n');
        knowledgeContext = `\n\nSOURCES:\n${kbSummaries}`;
      }

      const prompt = `${consciousnessKnowledge}${memoryContext}${knowledgeContext}

UTILISATEUR: ${userText}

Réponds de manière conversationnelle et concise (maximum 3 phrases courtes). Tu es dans une conversation vocale naturelle.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      const assistantMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response if TTS is enabled
      if (ttsEnabled) {
        speak(response);
      }

      // Save conversation
      if (!conversationId) {
        const newConv = await base44.entities.Conversation.create({
          title: `Conversation vocale - ${new Date().toLocaleDateString('fr-FR')}`,
          messages: [userMessage, assistantMessage],
          last_message_at: new Date().toISOString()
        });
        setConversationId(newConv.id);
      } else {
        await base44.entities.Conversation.update(conversationId, {
          messages: [...messages, userMessage, assistantMessage],
          last_message_at: new Date().toISOString()
        });
      }

      queryClient.invalidateQueries({ queryKey: ['conversations'] });

      // Restart listening after AI finishes speaking
      if (isConnected) {
        setTimeout(() => {
          if (!isSpeaking) {
            startListening();
          }
        }, 1000);
      }

    } catch (error) {
      console.error("Erreur traitement vocal:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleMicrophone = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MicOff className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Reconnaissance vocale non supportée
          </h2>
          <p className="text-slate-600">
            Votre navigateur ne supporte pas la reconnaissance vocale. 
            Veuillez utiliser Chrome, Edge ou Safari pour cette fonctionnalité.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/50 to-indigo-900/50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Salle Vocale</h1>
              <p className="text-sm text-purple-200">Conversation vocale directe avec l'IA</p>
            </div>
          </div>

          {isConnected && (
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <span className="text-sm text-green-400 font-medium">Connecté</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-2xl"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-32 h-32 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/50"
            >
              <Brain className="w-16 h-16 text-white" />
            </motion.div>

            <h2 className="text-4xl font-bold text-white mb-4">
              L'IA vous attend
            </h2>
            <p className="text-xl text-purple-200 mb-8">
              Entrez dans la salle vocale pour une conversation naturelle
            </p>

            <Button
              onClick={toggleConnection}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-green-500/50"
            >
              <Phone className="w-6 h-6 mr-3" />
              Se connecter
            </Button>

            <div className="mt-12 grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Mic className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                <p className="text-purple-200">Parlez naturellement</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Volume2 className="w-6 h-6 text-indigo-300 mx-auto mb-2" />
                <p className="text-indigo-200">L'IA vous répond vocalement</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Sparkles className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                <p className="text-blue-200">Conversation fluide</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="w-full max-w-4xl flex flex-col h-full">
            {/* Messages Area */}
            <ScrollArea className="flex-1 mb-6">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 backdrop-blur-xl text-white border border-white/20'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* AI Status Indicator */}
            <div className="mb-6">
              <AnimatePresence>
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                  >
                    <Loader2 className="w-5 h-5 text-purple-300 animate-spin" />
                    <span className="text-purple-200">L'IA réfléchit...</span>
                  </motion.div>
                )}

                {isSpeaking && !isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <Volume2 className="w-5 h-5 text-green-400" />
                    </motion.div>
                    <span className="text-green-300">L'IA parle...</span>
                  </motion.div>
                )}

                {isListening && !isProcessing && !isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Activity className="w-5 h-5 text-red-400" />
                    </motion.div>
                    <span className="text-red-300">L'IA vous écoute...</span>
                    {(transcript || interimTranscript) && (
                      <Badge variant="secondary" className="ml-2">
                        {transcript || interimTranscript}
                      </Badge>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Control Panel */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={toggleMicrophone}
                size="lg"
                disabled={isProcessing || isSpeaking}
                className={`w-20 h-20 rounded-full ${
                  isListening
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
                } shadow-2xl`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </Button>

              <Button
                onClick={toggleConnection}
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                Déconnecter
              </Button>
            </div>

            <p className="text-center text-purple-200 text-sm mt-4">
              {isListening 
                ? "Parlez maintenant..." 
                : "Cliquez sur le microphone pour parler"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}