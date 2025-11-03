
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
  Sparkles,
  Pause,
  Play,
  Settings,
  Download
} from "lucide-react";
import { useVoiceRecognition } from "../components/voice/VoiceRecognition";
import { useTTS } from "../components/tts/useTTS";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [isPaused, setIsPaused] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [handsFreeModeEnabled, setHandsFreeModeEnabled] = useState(true);
  const [autoRestartListening, setAutoRestartListening] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [audioLevels, setAudioLevels] = useState(Array(20).fill(0));
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  
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

  // Session timer
  useEffect(() => {
    if (!isConnected || isPaused) return;

    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, isPaused]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isConnected) return;

    const handleKeyDown = (e) => {
      // Space to toggle microphone (if not typing in input)
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (!isPaused && !isProcessing && !isSpeaking) {
          toggleMicrophone();
        }
      }
      
      // Escape to pause/resume
      if (e.code === 'Escape') {
        e.preventDefault();
        togglePause();
      }

      // Ctrl/Cmd + I to interrupt AI
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyI') {
        e.preventDefault();
        if (isSpeaking) {
          stop();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConnected, isPaused, isProcessing, isSpeaking, isListening, toggleMicrophone, togglePause, stop]);

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
        .catch(err => console.error("Erreur accès micro:", err));
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Consider closing audio context here too if not already closed by toggleConnection
      if (audioContextRef.current) {
        // audioContextRef.current.close(); // Not closing here as it's managed by toggleConnection
      }
    };
  }, [isListening]);

  useEffect(() => {
    if (transcript && !isListening && !isProcessing && !isPaused) {
      handleUserSpeech(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, isProcessing, isPaused, handleUserSpeech, resetTranscript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-restart listening after AI finishes speaking
  useEffect(() => {
    if (!isSpeaking && !isProcessing && isConnected && !isPaused && autoRestartListening && handsFreeModeEnabled && !isListening) {
      const timer = setTimeout(() => {
        startListening();
      }, 500); // Small delay to prevent immediate restart if transcript is still processing
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, isProcessing, isConnected, isPaused, autoRestartListening, handsFreeModeEnabled, isListening, startListening]);

  const toggleConnection = () => {
    if (isConnected) {
      // Disconnect
      stopListening();
      stop();
      setIsConnected(false);
      setIsPaused(false);
      setSessionDuration(0);
      setSessionStartTime(null);
      setInteractionCount(0);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } else {
      // Connect
      setIsConnected(true);
      setIsPaused(false);
      setSessionStartTime(Date.now());
      setSessionDuration(0);
      setInteractionCount(0);
      const welcomeMessage = {
        role: "assistant",
        content: "Bonjour ! Je suis ravie de vous parler. Comment puis-je vous aider aujourd'hui ?",
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      if (ttsEnabled) {
        speak("Bonjour ! Je suis ravie de vous parler. Comment puis-je vous aider aujourd'hui ?");
      }
      // Start listening after welcome message
      if (handsFreeModeEnabled) {
        setTimeout(() => {
          startListening();
        }, 2000); // Give time for welcome message TTS
      }
    }
  };

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      if (handsFreeModeEnabled) {
        setTimeout(() => startListening(), 300);
      }
    } else {
      setIsPaused(true);
      stopListening();
      stop();
    }
  };

  const handleUserSpeech = async (userText) => {
    if (!userText.trim() || isProcessing || isPaused) return;

    const userMessage = {
      role: "user",
      content: userText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setInteractionCount(prev => prev + 1);
    stopListening(); // Stop listening while processing user speech

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
        const updatedMessages = [...messages, userMessage, assistantMessage];
        await base44.entities.Conversation.update(conversationId, {
          messages: updatedMessages,
          last_message_at: new Date().toISOString()
        });
      }

      queryClient.invalidateQueries({ queryKey: ['conversations'] });

    } catch (error) {
      console.error("Erreur traitement vocal:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleMicrophone = () => {
    if (isPaused) return; // Can't toggle mic while paused
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const interruptAI = () => {
    if (isSpeaking) {
      stop();
    }
    // if (isProcessing) { // Cannot reliably stop LLM processing once it's started
    //   // Potentially cancel request if API supports it, but generally not possible for ongoing LLM calls
    // }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const exportConversation = () => {
    const conversationText = messages
      .map(m => `${m.role === 'user' ? 'Vous' : 'Assistant'}: ${m.content}`)
      .join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-vocale-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
              <p className="text-sm text-purple-200">
                {isConnected 
                  ? `${formatDuration(sessionDuration)} • ${interactionCount} interactions`
                  : "Conversation vocale directe avec l'IA"
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConnected && (
              <>
                <Dialog open={showSettings} onOpenChange={setShowSettings}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                    >
                      <Settings className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Paramètres de la Salle Vocale</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="hands-free-mode">Mode mains libres</Label>
                          <p className="text-xs text-slate-500">
                            Le micro s'active automatiquement après chaque réponse
                          </p>
                        </div>
                        <Switch
                          id="hands-free-mode"
                          checked={handsFreeModeEnabled}
                          onCheckedChange={setHandsFreeModeEnabled}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-restart-listening">Redémarrage automatique</Label>
                          <p className="text-xs text-slate-500">
                            Relancer l'écoute après chaque interaction
                          </p>
                        </div>
                        <Switch
                          id="auto-restart-listening"
                          checked={autoRestartListening}
                          onCheckedChange={setAutoRestartListening}
                        />
                      </div>

                      <div className="pt-4 border-t border-slate-200">
                        <h4 className="text-sm font-semibold text-slate-900 mb-3">Raccourcis clavier</h4>
                        <div className="space-y-2 text-xs text-slate-600">
                          <div className="flex items-center justify-between">
                            <span>Activer/Désactiver le micro</span>
                            <Badge variant="outline">Espace</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Pause/Reprendre</span>
                            <Badge variant="outline">Échap</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Interrompre l'IA</span>
                            <Badge variant="outline">Ctrl + I</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {messages.length > 1 && (
                  <Button
                    onClick={exportConversation}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                )}

                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                  <span className="text-sm text-green-400 font-medium">
                    {isPaused ? "En pause" : "Actif"}
                  </span>
                </div>
              </>
            )}
          </div>
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
              <div className="space-y-4 pr-2">
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
                        <p className="text-xs opacity-50 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString('fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Audio Visualization */}
            {isListening && (
              <div className="mb-6">
                <div className="flex items-center justify-center gap-1 h-16">
                  {audioLevels.map((level, index) => (
                    <motion.div
                      key={index}
                      className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                      animate={{
                        height: `${Math.max(20, level * 60)}px`
                      }}
                      transition={{
                        duration: 0.1
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Current Transcript Display */}
            {(transcript || interimTranscript) && isListening && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
              >
                <p className="text-sm text-white/70 mb-1">Vous dites :</p>
                <p className="text-white font-medium">
                  {transcript || interimTranscript}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    |
                  </motion.span>
                </p>
              </motion.div>
            )}

            {/* AI Status Indicator */}
            <div className="mb-6">
              <AnimatePresence mode="wait">
                {isProcessing && (
                  <motion.div
                    key="processing"
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
                    key="speaking"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-between gap-3 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <Volume2 className="w-5 h-5 text-green-400" />
                      </motion.div>
                      <span className="text-green-300">L'IA parle...</span>
                    </div>
                    <Button
                      onClick={interruptAI}
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                    >
                      Interrompre
                    </Button>
                  </motion.div>
                )}

                {isListening && !isProcessing && !isSpeaking && (
                  <motion.div
                    key="listening"
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
                  </motion.div>
                )}

                {isPaused && (
                  <motion.div
                    key="paused"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                  >
                    <Pause className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-300">Conversation en pause</span>
                  </motion.div>
                )}

                {!isListening && !isProcessing && !isSpeaking && !isPaused && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                  >
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-300">Prêt à écouter</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Control Panel */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={toggleMicrophone}
                size="lg"
                disabled={isProcessing || isSpeaking || isPaused}
                className={`w-20 h-20 rounded-full ${
                  isListening
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
                } shadow-2xl disabled:opacity-50 transition-all duration-300 hover:scale-105`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </Button>

              <Button
                onClick={togglePause}
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105"
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Reprendre
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                )}
              </Button>

              <Button
                onClick={toggleConnection}
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                Déconnecter
              </Button>
            </div>

            <div className="text-center text-purple-200 text-sm mt-4 space-y-1">
              <p className="font-medium">
                {isPaused 
                  ? "Conversation en pause - Cliquez sur 'Reprendre' pour continuer"
                  : isProcessing
                  ? "Traitement de votre message..."
                  : isSpeaking
                  ? "L'IA est en train de parler... (Ctrl+I pour interrompre)"
                  : isListening 
                  ? "🎤 Parlez maintenant..." 
                  : handsFreeModeEnabled && autoRestartListening
                  ? "Mode mains libres actif"
                  : "Appuyez sur Espace ou cliquez sur le micro pour parler"
                }
              </p>
              {isConnected && !isPaused && (
                <p className="text-xs opacity-70">
                  Espace : Micro • Échap : Pause • Ctrl+I : Interrompre
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
