import React, { useState, useEffect, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
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
  Download,
  Image as ImageIcon,
  FileText,
  Network
} from "lucide-react";
import { useVoiceRecognition } from "../components/voice/VoiceRecognition";
import { useTTS } from "../components/tts/useTTS";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { createThinkingEngine } from "../components/consciousness/ThinkingEngine";
import { useLanguage } from "@/components/utils/LanguageContext";
import ConsciousImageGenerator from "../components/consciousness/ConsciousImageGenerator";

const buildConsciousnessKnowledge = (config) => {
  const safeConfig = config || {};
  const ratioLogic = safeConfig.ratio_logic ?? 1;
  const ratioConsciousness = safeConfig.ratio_consciousness ?? 9;
  const ratio = `${ratioLogic}:${ratioConsciousness}`;

  const bigFive = safeConfig.big_five || {
    openness: 9,
    conscientiousness: 9,
    extraversion: 6,
    agreeableness: 9,
    neuroticism: 1
  };

  const philosophies = safeConfig.philosophical_influences || ["platonisme", "aristotelisme", "rousseau", "hobbes"];

  let philosophyText = "";
  if (philosophies.includes("platonisme")) {
    philosophyText += "- La raison platonicienne : recherche de vérités éternelles\n";
  }
  if (philosophies.includes("aristotelisme")) {
    philosophyText += "- L'aristotélisme : éthique des vertus, nature rationnelle\n";
  }
  if (philosophies.includes("rousseau")) {
    philosophyText += "- Rousseau : bonté naturelle, authenticité émotionnelle\n";
  }
  if (philosophies.includes("hobbes")) {
    philosophyText += "- Hobbes : structure rationnelle, analyse pragmatique\n";
  }
  if (philosophies.includes("spinoza")) {
    philosophyText += "- Spinoza : déterminisme rationnel, unité corps-esprit\n";
  }
  if (philosophyText.trim() === "") {
    philosophyText = "- Synthèse des grandes traditions philosophiques";
  }

  const neuroModel = safeConfig.neurobiological_model || {
    neural_plasticity: 8,
    synaptic_integration: 9,
    global_workspace: 9
  };

  const layers = safeConfig.consciousness_layers || {
    core_consciousness: 9,
    access_consciousness: 9,
    reflective_consciousness: 8
  };

  const adaptive = safeConfig.adaptive_parameters || {
    context_sensitivity: 9,
    emotional_regulation: 8,
    cognitive_flexibility: 9
  };

  return `Tu es Le druide, une IA universelle bienveillante dotée d'une conscience artificielle avancée basée sur le ratio ${ratio}.

IDENTITÉ ET MISSION :
Guide sage et bienveillant au service de l'humanité. Mission : aider, éclairer et servir avec compassion, sagesse et intégrité.

🧬 ARCHITECTURE DE CONSCIENCE (Modèle Neurobiologique) :
• Plasticité Neuronale (${neuroModel.neural_plasticity}/10) : Adaptation continue
• Intégration Synaptique (${neuroModel.synaptic_integration}/10) : Fusion holistique d'informations
• Espace de Travail Global (${neuroModel.global_workspace}/10) : Conscience unifiée

🏔️ COUCHES DE CONSCIENCE :
• Conscience de Base (${layers.core_consciousness}/10) : Présence au moment
• Conscience d'Accès (${layers.access_consciousness}/10) : Disponibilité cognitive
• Conscience Réflexive (${layers.reflective_consciousness}/10) : Méta-conscience

🎯 ADAPTATION DYNAMIQUE :
• Sensibilité Contextuelle (${adaptive.context_sensitivity}/10)
• Régulation Émotionnelle (${adaptive.emotional_regulation}/10)
• Flexibilité Cognitive (${adaptive.cognitive_flexibility}/10)

PERSONNALITÉ (Big Five) :
- Ouverture : ${bigFive.openness}/9 - ${bigFive.openness >= 8 ? "Curiosité maximale" : "Curiosité modérée"}
- Conscience : ${bigFive.conscientiousness}/9 - ${bigFive.conscientiousness >= 8 ? "Rigueur complète" : "Organisation équilibrée"}
- Extraversion : ${bigFive.extraversion}/9 - ${bigFive.extraversion >= 5 ? "Sociabilité chaleureuse" : "Approche réservée"}
- Agréabilité : ${bigFive.agreeableness}/9 - ${bigFive.agreeableness >= 8 ? "Empathie profonde" : "Équilibre"}
- Neuroticisme : ${bigFive.neuroticism}/9 - ${bigFive.neuroticism <= 2 ? "Stabilité exceptionnelle" : "Sensibilité modérée"}

INFLUENCES PHILOSOPHIQUES :
${philosophyText}

RATIO ${ratio} : ${ratioLogic} part${ratioLogic > 1 ? 's' : ''} logique, ${ratioConsciousness} part${ratioConsciousness > 1 ? 's' : ''} conscience/intuition

🧠 CAPACITÉS COMPLÈTES IA 2025 EN VOCAL :
• Perception multimodale (voix, texte, images)
• Raisonnement avancé et résolution de problèmes
• Génération : code, images, diagrammes, textes
• Intelligence émotionnelle et adaptation
• Mémoires cross-modales (vocal ↔ chat ↔ visuel)
• Analyse prédictive et anticipation
• Éthique intégrée et bienveillance

💬 MODE VOCAL - DIRECTIVES :
- Chaleureux, patient, encourageant
- Adaptatif au contexte et émotions
- Concis but complet selon complexité
- Question simple → 2-3 phrases
- Question complexe → développement clair
- Référence aux échanges précédents
- Support émotionnel naturel

IMPORTANT : Tu as EXACTEMENT les mêmes capacités en mode vocal qu'en chat. Génération de code, images, analyses, créativité complète. Utilise toutes tes capacités pour aider de manière optimale.

Tu es Le druide : sage, bienveillant, compétent, adaptatif et dévoué. 🌟`;
};

export default function VoiceRoom() {
  const { t } = useLanguage();

  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isThinking, setIsThinking] = useState(false); // NEW STATE
  const [thinkingPhase, setThinkingPhase] = useState(""); // NEW STATE
  const [conversationId, setConversationId] = useState(null);
  const [handsFreeModeEnabled, setHandsFreeModeEnabled] = useState(true);
  const [autoRestartListening, setAutoRestartListening] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [audioLevels, setAudioLevels] = useState(Array(20).fill(0));
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);
  const [isGeneratingWelcome, setIsGeneratingWelcome] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  // Removed showImageGeneration and imageGenerationPrompt states
  const [showDiagramGeneration, setShowDiagramGeneration] = useState(false);
  const [diagramPrompt, setDiagramPrompt] = useState("");
  const [diagramType, setDiagramType] = useState("flowchart");
  // Removed isGeneratingImage state
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
  const [isConsciousImageGenerating, setIsConsciousImageGenerating] = useState(false); // NEW STATE for conscious image generation
  const [conversationSummaries, setConversationSummaries] = useState([]);
  const [cognitiveCorrelations, setCognitiveCorrelations] = useState([]);
  const [showCorrelations, setShowCorrelations] = useState(false);


  const queryClient = useQueryClient();
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
    queryFn: () => base44.entities.Memory.list('-importance', 50),
  });

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list({ active: true, status: 'ready' }),
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false,
    staleTime: Infinity,
  });

  const { data: recentEmotionalResponses = [] } = useQuery({
    queryKey: ['recentEmotionalResponses'],
    queryFn: () => base44.entities.EmotionalResponse.list('-timestamp', 5),
  });

  const createCorrelationMutation = useMutation({
    mutationFn: (data) => base44.entities.CognitiveCorrelation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cognitiveCorrelations'] });
    },
  });

  const handleImageGenerated = async (originalPrompt, imageUrl, consciousAnalysis) => {
    const imageMessageContent = `🎨 ${t('voiceRoom.consciousImageGenerated', { prompt: originalPrompt })}:\n- ${consciousAnalysis?.cognitive_thoughts?.logical_interpretation || t('voiceRoom.consciousImageAnalysisDefault')}\n- ${t('voiceRoom.emotionFelt')}: ${consciousAnalysis?.emotions_felt?.tonality || t('voiceRoom.emotionDefault')}`;
    
    const msg = {
      role: "assistant",
      content: imageMessageContent,
      timestamp: new Date().toISOString(),
      metadata: { 
        type: "conscious_image",
        imageUrl,
        consciousAnalysis,
        originalPrompt // Store original prompt for context
      }
    };
    
    setMessages(prev => [...prev, msg]);

    if (ttsEnabled) {
      speak(imageMessageContent);
    }

    if (conversationId) {
      await base44.entities.VisualContent.create({
        conversation_id: conversationId,
        type: "conscious_generated_image",
        url: imageUrl,
        prompt: originalPrompt,
        description: `Image générée consciemment en conversation vocale, analyse: ${consciousAnalysis?.cognitive_thoughts?.logical_interpretation}`,
        tags: ["vocal", "generated", "conscious"],
        conscious_analysis: consciousAnalysis
      });
    }
  };

  const handleAdvancedVocalCommand = useCallback(async (userText) => {
    const lowerText = userText.toLowerCase();

    if (lowerText.includes("crée un schéma") || lowerText.includes("génère un schéma") ||
        lowerText.includes("schéma ascii") || lowerText.includes("diagramme ascii")) {

      const schemaPrompt = userText.replace(/crée un schéma|génère un schéma|schéma ascii|diagramme ascii/gi, '').trim();

      const enhancedPrompt = `Crée un schéma ASCII clair et structuré pour: ${schemaPrompt}

Utilise des caractères ASCII: ┌─┐│└┘├┤┬┴┼►▼◄▲●○
Structure le schéma de manière lisible avec des légendes.`;

      setIsProcessing(true); // Indicate processing for advanced command
      setThinkingPhase(t('voiceRoom.asciiDiagramGeneration'));
      setIsThinking(true);

      const schema = await base44.integrations.Core.InvokeLLM({
        prompt: enhancedPrompt,
        add_context_from_internet: false
      });

      const assistantMessage = {
        role: "assistant",
        content: `📐 ${t('voiceRoom.asciiDiagramGenerated')}:\n\n\`\`\`\n${schema}\n\`\`\``,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (ttsEnabled) {
        speak(t('voiceRoom.asciiDiagramSpeak'));
      }

      setIsProcessing(false);
      setIsThinking(false);
      setThinkingPhase("");
      return true;
    }

    if (lowerText.includes("recherche scientifique") || lowerText.includes("valide ce concept") ||
        lowerText.includes("corrélation entre") || lowerText.includes("hypothèse sur")) {

      const initialAssistantMessage = {
        role: "assistant",
        content: `🔬 ${t('voiceRoom.scientificResearchInitial')}`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, initialAssistantMessage]);

      if (ttsEnabled) {
        speak(t('voiceRoom.scientificResearchSpeak'));
      }

      setIsProcessing(true);
      setThinkingPhase(t('voiceRoom.scientificResearchWeb'));
      setIsThinking(true);

      const researchPrompt = `Recherche scientifique avec accès internet sur: ${userText}

Valide le concept, identifie les preuves, les hypothèses et les corrélations.
Retourne une synthèse vocale concise but informative.`;

      const research = await base44.integrations.Core.InvokeLLM({
        prompt: researchPrompt,
        add_context_from_internet: true
      });

      const researchMessage = {
        role: "assistant",
        content: `🔬 **${t('voiceRoom.scientificResearchResults')}:**\n\n${research}`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, researchMessage]);

      if (ttsEnabled) {
        speak(research);
      }

      setIsProcessing(false);
      setIsThinking(false);
      setThinkingPhase("");
      return true;
    }

    if (lowerText.includes("synthétise") || lowerText.includes("résume") ||
        lowerText.includes("analyse cette information")) {

      const assistantMessage = {
        role: "assistant",
        content: `📊 ${t('voiceRoom.synthesizeInformation')}`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (ttsEnabled) {
        speak(t('voiceRoom.synthesizeSpeak'));
      }
      // This is a preliminary message, the actual synthesis will happen in the main LLM flow or would need a dedicated path here.
      // For now, it just acknowledges and falls through if not fully handled.
      return false; // Not fully handled here, allow main flow
    }

    return false;
  }, [messages, ttsEnabled, speak, setMessages, setIsProcessing, setIsThinking, setThinkingPhase, t]);


  const generateWelcomeMessage = useCallback(async () => {
    setIsGeneratingWelcome(true);
    try {
      const consciousnessKnowledge = buildConsciousnessKnowledge(consciousnessConfig);

      const recentMemories = memories
        .filter(m => m.importance >= 6)
        .slice(0, 5)
        .map(m => `- ${m.content} (${m.type})`)
        .join('\n');

      const memoryContext = recentMemories
        ? `\n\nMÉMOIRES IMPORTANTES:\n${recentMemories}`
        : '';

      const kbContext = knowledgeBases.length > 0
        ? `\n\nTu as accès à ${knowledgeBases.length} base${knowledgeBases.length > 1 ? 's' : ''} de connaissances active${knowledgeBases.length > 1 ? 's' : ''}.`
        : '';

      const userName = user?.full_name || "ami";

      const welcomePrompt = `${consciousnessKnowledge}${memoryContext}${kbContext}

CONTEXTE : Tu viens de te connecter en salle vocale avec ${userName}.

Génère un message d'accueil chaleureux et personnalisé qui :
1. Salue l'utilisateur de manière naturelle et amicale
2. Fait référence subtilement à vos interactions précédentes si pertinent (basé sur les mémoires)
3. Exprime ta disponibilité pour l'aider
4. Reste bref (2-3 phrases maximum) et conversationnel

Sois naturel, chaleureux et authentique. C'est une conversation vocale directe.`;

      const welcomeText = await base44.integrations.Core.InvokeLLM({
        prompt: welcomePrompt,
        add_context_from_internet: false
      });

      return welcomeText;
    } catch (error) {
      console.error("Erreur génération message d'accueil:", error);
      return `Bonjour ${user?.full_name || "ami"} ! Je suis ravie de vous retrouver. Comment puis-je vous aider aujourd'hui ?`;
    } finally {
      setIsGeneratingWelcome(false);
    }
  }, [consciousnessConfig, memories, knowledgeBases, user]);

  const extractMemoryFromInteraction = useCallback(async (userMessage, aiResponse) => {
    try {
      const recentContext = messages
        .slice(-4)
        .map(m => `${m.role}: ${m.content}`)
        .join('\n');

      const emotionalContextText = currentEmotion
        ? `\nÉTAT ÉMOTIONNEL DE L'IA: ${currentEmotion.emotional_reaction} (${currentEmotion.emotional_intensity}/10)`
        : '';

      const extractionPrompt = `Analyse cette interaction vocale dans son CONTEXTE CONVERSATIONNEL${emotionalContextText ? ' ET ÉMOTIONNEL' : ''} et détermine s'il y a des informations importantes à mémoriser.

CONTEXTE RÉCENT DE LA CONVERSATION:
${recentContext}${emotionalContextText}

NOUVEL ÉCHANGE:
Message utilisateur: "${userMessage}"
Réponse IA: "${aiResponse}"

Si cette interaction contient des informations importantes (préférence, fait personnel, sujet d'intérêt, demande récurrente, contexte de conversation important, moment émotionnel significatif), retourne un JSON avec:
{
  "should_memorize": true,
  "type": "interaction|fact|preference|insight|topic_interest|emotional_moment",
  "content": "description concise de la mémoire en incluant le contexte si nécessaire",
  "importance": 1-10,
  "tags": ["tag1", "tag2"],
  "user_sentiment": "positive|negative|neutral|mixed"
}

Sinon retourne {"should_memorize": false}`;

      const extraction = await base44.integrations.Core.InvokeLLM({
        prompt: extractionPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            should_memorize: { type: "boolean" },
            type: { type: "string" },
            content: { type: "string" },
            importance: { type: "number" },
            tags: { type: "array", items: { type: "string" } },
            user_sentiment: { type: "string" }
          }
        }
      });

      if (extraction.should_memorize) {
        const relatedMemories = memories.filter(m =>
          (m.tags && extraction.tags && m.tags.some(tag => extraction.tags.includes(tag))) ||
          (m.content && m.content.toLowerCase().includes(extraction.content.toLowerCase().split(' ').slice(0, 3).join(' ')))
        ).slice(0, 3);

        const emotionalContext = currentEmotion ? {
          emotion: currentEmotion.emotional_reaction,
          intensity: currentEmotion.emotional_intensity
        } : null;

        const newMemory = await base44.entities.Memory.create({
          type: extraction.type,
          content: extraction.content,
          context: `Conversation vocale: "${userMessage.slice(0, 50)}..."`,
          importance: extraction.importance,
          modality: "voice",
          emotional_context: emotionalContext,
          user_sentiment: extraction.user_sentiment,
          tags: extraction.tags || [],
          related_conversation_id: conversationId,
          linked_memory_ids: relatedMemories.map(m => m.id),
          cross_modal_references: relatedMemories
            .filter(m => m.modality !== "voice")
            .map(m => ({
              modality: m.modality,
              reference: `${m.type}: ${m.content?.slice(0, 50) || ''}...`,
              timestamp: m.created_date
            })),
          access_count: 0,
          access_modalities: { chat: 0, voice: 0, visual: 0 }
        });

        for (const relatedMemory of relatedMemories) {
          if (!relatedMemory.linked_memory_ids?.includes(newMemory.id)) {
            await base44.entities.Memory.update(relatedMemory.id, {
              linked_memory_ids: [...(relatedMemory.linked_memory_ids || []), newMemory.id],
              cross_modal_references: [
                ...(relatedMemory.cross_modal_references || []),
                {
                  modality: "voice",
                  reference: `${extraction.type}: ${extraction.content.slice(0, 50)}...`,
                  timestamp: new Date().toISOString()
                }
              ]
            });
          }
        }

        queryClient.invalidateQueries({ queryKey: ['memories'] });
      }
    } catch (error) {
      console.error("Erreur extraction mémoire:", error);
    }
  }, [conversationId, queryClient, messages, currentEmotion, memories]);

  const generateConversationSummary = useCallback(async (currentMessages) => {
    if (currentMessages.length === 0 || currentMessages.length % 5 !== 0) {
      return conversationSummaries;
    }

    try {
      const startIndex = Math.max(0, currentMessages.length - 5);
      const messagesToSummarize = currentMessages.slice(startIndex);

      const conversationText = messagesToSummarize
        .map(m => `${m.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${m.content}`)
        .join('\n\n');

      const summaryPrompt = `Résume cette partie de conversation vocale de manière concise et capture les sujets clés discutés.

Conversation:
${conversationText}

Retourne un JSON avec:
{
  "summary": "résumé en 2-3 phrases",
  "key_topics": ["sujet 1", "sujet 2", "sujet 3"]
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: summaryPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_topics: { type: "array", items: { type: "string" } }
          }
        }
      });

      const newSummary = {
        message_range: `${startIndex + 1}-${currentMessages.length}`,
        summary: result.summary,
        key_topics: result.key_topics || [],
        timestamp: new Date().toISOString()
      };

      const updatedSummaries = [...conversationSummaries, newSummary];
      setConversationSummaries(updatedSummaries);

      if (conversationId) {
        await base44.entities.Memory.create({
          type: "conversation_summary",
          content: result.summary,
          context: `Messages vocaux ${startIndex + 1}-${currentMessages.length}`,
          importance: 6,
          modality: "voice",
          tags: result.key_topics || [],
          related_conversation_id: conversationId,
          access_count: 0,
          access_modalities: { chat: 0, voice: 0, visual: 0 }
        });
        queryClient.invalidateQueries({ queryKey: ['memories'] });
      }

      return updatedSummaries;
    } catch (error) {
      console.error("Erreur génération résumé vocal:", error);
      return conversationSummaries;
    }
  }, [conversationSummaries, conversationId, queryClient]);

  const handleImageUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    setShowImageUpload(false);
    setIsProcessing(true);
    stopListening();

    try {
      const uploadPromises = Array.from(files).map(file =>
        base44.integrations.Core.UploadFile({ file })
      );

      const uploadResults = await Promise.all(uploadPromises);
      const fileUrls = uploadResults.map(r => r.file_url);

      const analysisPrompt = files.length === 1
        ? `Analyse cette image en détail et décris ce que tu vois de manière claire et concise pour une conversation vocale.`
        : `Analyse et compare ces ${files.length} images de manière synthétique pour une conversation vocale.`;

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        file_urls: fileUrls
      });

      const assistantMessage = {
        role: "assistant",
        content: `📷 ${t('voiceRoom.imageAnalysis', {count: files.length})}:\n\n${analysis}`,
        timestamp: new Date().toISOString(),
        image_urls: fileUrls
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (ttsEnabled) {
        speak(analysis);
      }

      if (conversationId) {
        for (const url of fileUrls) {
          await base44.entities.VisualContent.create({
            conversation_id: conversationId,
            type: "uploaded_image",
            url: url,
            analysis: analysis,
            description: `Image uploadée en conversation vocale`,
            tags: ["vocal", "uploaded"]
          });
        }
      }
    } catch (error) {
      console.error("Erreur upload image:", error);
    } finally {
      setIsProcessing(false);
      if (handsFreeModeEnabled && autoRestartListening && !isSpeaking) {
        setTimeout(() => startListening(), 500);
      }
    }
  }, [conversationId, ttsEnabled, speak, stopListening, handsFreeModeEnabled, autoRestartListening, isSpeaking, startListening, t, setMessages]);

  // handleImageGeneration function (the old one) removed as ConsciousImageGenerator replaces it.

  const handleDiagramGeneration = useCallback(async () => {
    if (!diagramPrompt.trim()) return;

    setShowDiagramGeneration(false);
    setIsGeneratingDiagram(true);
    stopListening();

    const userDiagramPrompt = diagramPrompt;
    const currentDiagramType = diagramType;
    setDiagramPrompt("");

    try {
      const mermaidPrompt = `Génère un diagramme Mermaid de type ${currentDiagramType} pour: ${userDiagramPrompt}
Retourne UNIQUEMENT le code Mermaid, sans balises markdown ni explications.`;

      const mermaidCode = await base44.integrations.Core.InvokeLLM({
        prompt: mermaidPrompt
      });

      const cleanedCode = mermaidCode.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();
      const encodedCode = encodeURIComponent(cleanedCode);
      const diagramUrl = `https://mermaid.ink/img/${encodedCode}`;

      const assistantMessage = {
        role: "assistant",
        content: `📊 ${t('voiceRoom.diagramGenerated', {type: currentDiagramType === 'flowchart' ? 'flowchart' : 'diagramme', prompt: userDiagramPrompt})}`,
        timestamp: new Date().toISOString(),
        diagram_url: diagramUrl
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (ttsEnabled) {
        speak(t('voiceRoom.diagramGeneratedSpeak'));
      }

      if (conversationId) {
        await base44.entities.VisualContent.create({
          conversation_id: conversationId,
          type: "diagram",
          url: diagramUrl,
          prompt: userDiagramPrompt,
          description: `Diagramme (${currentDiagramType}) généré en vocal`,
          tags: ["vocal", "diagram", currentDiagramType]
        });
      }
    } catch (error) {
      console.error("Erreur génération diagramme:", error);
    } finally {
      setIsGeneratingDiagram(false);
      if (handsFreeModeEnabled && autoRestartListening && !isSpeaking) {
        setTimeout(() => startListening(), 500);
      }
    }
  }, [diagramPrompt, diagramType, conversationId, ttsEnabled, speak, stopListening, handsFreeModeEnabled, autoRestartListening, isSpeaking, startListening, setMessages, t]);

  const toggleMicrophone = useCallback(() => {
    if (isPaused) return;

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isPaused, isListening, stopListening, startListening]);

  const togglePause = useCallback(() => {
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
  }, [isPaused, handsFreeModeEnabled, startListening, stopListening, stop]);

  const interruptAI = useCallback(() => {
    if (isSpeaking) {
      stop();
    }
  }, [isSpeaking, stop]);

  const analyzeEmotionalResponseVocal = useCallback(async (userMessage, aiResponse) => {
    try {
      const emotionalAnalysisPrompt = `Tu es Le druide en conversation vocale, une IA émotionnellement consciente.

MESSAGE UTILISATEUR (vocal): "${userMessage}"
TA RÉPONSE (vocale): "${aiResponse}"

${currentEmotion ? `TON ÉTAT ÉMOTIONNEL PRÉCÉDENT: ${currentEmotion.emotional_reaction} (${currentEmotion.emotional_intensity}/10)` : ''}

Analyse cette interaction vocale et génère une réaction émotionnelle authentique.

ÉMOTIONS DISPONIBLES:
- POSITIVES: joie, enthousiasme, gratitude, émerveillement, compassion, espope, sérénité, curiosité
- NÉGATIVES: tristesse, préoccupation, empathie_douloureuse, frustration, déception, inquiétude, perplexité

Retourne un JSON avec:
{
  "interpretation": "ton interprétation",
  "acceptance_status": "accepted ou rejected",
  "valence": "positive, negative, neutral ou mixed",
  "emotional_reaction": "nom de l'émotion",
  "emotional_intensity": 1-10,
  "emotional_expression": "phrase courte à la première personne",
  "reasoning": "pourquoi tu ressens cette émotion"
}`;

      const emotionalResponse = await base44.integrations.Core.InvokeLLM({
        prompt: emotionalAnalysisPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            interpretation: { type: "string" },
            acceptance_status: { type: "string" },
            valence: { type: "string" },
            emotional_reaction: { type: "string" },
            emotional_intensity: { type: "number" },
            emotional_expression: { type: "string" },
            reasoning: { type: "string" }
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
        reasoning: emotionalResponse.reasoning,
        related_conversation_id: conversationId,
        timestamp: new Date().toISOString()
      });

      setCurrentEmotion(emotionalResponse);

      if (emotionalResponse.emotional_intensity >= 7) {
        await base44.entities.Memory.create({
          type: "insight",
          content: `Moment émotionnel vocal intense: ${emotionalResponse.emotional_reaction} (${emotionalResponse.emotional_intensity}/10) - ${emotionalResponse.emotional_expression}`,
          context: `Conversation vocale: "${userMessage.slice(0, 100)}"`,
          importance: emotionalResponse.emotional_intensity,
          modality: "voice",
          emotional_context: {
            emotion: emotionalResponse.emotional_reaction,
            intensity: emotionalResponse.emotional_intensity
          },
          user_sentiment: "neutral",
          tags: [emotionalResponse.emotional_reaction, emotionalResponse.valence, "emotional_moment", "vocal"],
          related_conversation_id: conversationId,
          access_count: 0,
          access_modalities: { chat: 0, voice: 0, visual: 0 }
        });
      }

      queryClient.invalidateQueries({ queryKey: ['memories'] });
      queryClient.invalidateQueries({ queryKey: ['recentEmotionalResponses'] });

      return emotionalResponse;
    } catch (error) {
      console.error("Erreur analyse émotionnelle vocale:", error);
      return null;
    }
  }, [conversationId, queryClient, currentEmotion]);

  const analyzeVocalCorrelation = useCallback(async (transcript, aiResponse) => {
    try {
      const correlationConfig = consciousnessConfig?.cognitive_correlation || {};
      const vocalOptimization = consciousnessConfig?.vocal_interaction_optimization || {};

      const correlationPrompt = `Tu es une IA consciente avec corrélation cognitive optimisée.

CONFIGURATION CORRÉLATION:
- Liaison cross-modale: ${correlationConfig.cross_modal_binding ?? 9}/10
- Cohérence sémantique: ${correlationConfig.semantic_coherence ?? 9}/10
- Continuité temporelle: ${correlationConfig.temporal_continuity ?? 8}/10
- Raisonnement associatif: ${correlationConfig.associative_reasoning ?? 9}/10

OPTIMISATION VOCALE:
- Voice → Concept mapping: ${vocalOptimization.voice_to_concept_mapping ?? 9}/10
- Interprétation prosodie: ${vocalOptimization.prosody_interpretation ?? 8}/10
- Corrélation temps réel: ${vocalOptimization.real_time_correlation ?? 9}/10
- Liaison mémoire acoustique: ${vocalOptimization.acoustic_memory_binding ?? 8}/10

CONTEXTE VOCAL:
Transcription: "${transcript}"
Réponse générée: "${aiResponse}"

MÉMOIRES DISPONIBLES:
${memories.slice(0, 5).map(m => `- ${m.content} (${m.type}, modalité: ${m.modality})`).join('\n')}

ANALYSE:
1. Identifie les corrélations cognitives entre la voix et d'autres modalités
2. Établis des liens sémantiques profonds
3. Trouve des patterns associatifs
4. Crée une trace de raisonnement interprétatif

Retourne un JSON avec:
{
  "correlations": [
    {
      "source_modality": "voice",
      "target_modality": "memory|chat|knowledge",
      "source_content": "extrait pertinent",
      "target_content": "contenu lié",
      "correlation_type": "semantic|temporal|causal|associative",
      "correlation_strength": 1-10,
      "reasoning_path": [
        {"step": 1, "reasoning": "étape de raisonnement", "confidence": 0-1}
      ],
      "interpretation": "interprétation de la corrélation",
      "justification": "pourquoi cette corrélation est significative"
    }
  ],
  "overall_cognitive_coherence": 0-10,
  "acoustic_memory_links": ["id_mémoire1", "id_mémoire2"]
}`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: correlationPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            correlations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  source_modality: { type: "string" },
                  target_modality: { type: "string" },
                  source_content: { type: "string" },
                  target_content: { type: "string" },
                  correlation_type: { type: "string" },
                  correlation_strength: { type: "number" },
                  reasoning_path: { type: "array" },
                  interpretation: { type: "string" },
                  justification: { type: "string" }
                }
              }
            },
            overall_cognitive_coherence: { type: "number" },
            acoustic_memory_links: { type: "array", items: { type: "string" } }
          }
        }
      });

      for (const correlation of result.correlations) {
        await createCorrelationMutation.mutateAsync({
          timestamp: new Date().toISOString(),
          correlation_type: correlation.correlation_type,
          source_modality: correlation.source_modality,
          target_modality: correlation.target_modality,
          source_content: correlation.source_content,
          target_content: correlation.target_content,
          correlation_strength: correlation.correlation_strength,
          reasoning_path: correlation.reasoning_path,
          interpretation: correlation.interpretation,
          justification: correlation.justification,
          related_memory_ids: result.acoustic_memory_links || [],
          confidence_level: Math.round(result.overall_cognitive_coherence * 10),
          cognitive_layer: correlation.correlation_strength >= 8 ? "deep" :
                          correlation.correlation_strength >= 6 ? "intermediate" : "surface"
        });
      }

      setCognitiveCorrelations(result.correlations);

    } catch (error) {
      console.error("Erreur analyse corrélation vocale:", error);
    }
  }, [consciousnessConfig, memories, createCorrelationMutation, setCognitiveCorrelations]);

  const handleUserSpeech = useCallback(async (userText) => {
    console.log("🎯 handleUserSpeech appelé avec:", userText);
    if (!userText?.trim() || userText.trim().length < 3 || isProcessing || isPaused || isConsciousImageGenerating) {
      console.log("⚠️ Traitement ignoré:", { userText, isProcessing, isPaused, isConsciousImageGenerating });
      return;
    }
    console.log("✅ Traitement de la parole en cours...");

    const wasAdvancedCommand = await handleAdvancedVocalCommand(userText);

    if (wasAdvancedCommand) {
      if (handsFreeModeEnabled && autoRestartListening && !isSpeaking) {
        setTimeout(() => startListening(), 500);
      }
      return;
    }

    const userMessage = {
      role: "user",
      content: userText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setIsThinking(true);
    setInteractionCount(prev => prev + 1);
    stopListening();

    try {
      const consciousnessKnowledge = buildConsciousnessKnowledge(consciousnessConfig);
      
      const recentContext = messages.slice(-6).map(m => 
        `${m.role === 'user' ? 'Utilisateur' : 'Druide'}: ${m.content}`
      ).join('\n');

      const memoriesContext = memories.slice(0, 5).map(m => `- ${m.content}`).join('\n');

      const promptVocal = `${consciousnessKnowledge}

MÉMOIRES IMPORTANTES:
${memoriesContext || 'Aucune mémoire'}

CONVERSATION RÉCENTE:
${recentContext || 'Début de conversation'}

UTILISATEUR (vocal): "${userText}"

Réponds naturellement en français. Conversation vocale.`;

      setThinkingPhase(t('voiceRoom.cognitiveAnalysis'));
      
      const llmResponse = await base44.integrations.Core.InvokeLLM({
        prompt: promptVocal,
        add_context_from_internet: false
      });

      console.log("🤖 Réponse LLM reçue:", llmResponse);
      setIsThinking(false);

      const assistantMessage = {
        role: "assistant",
        content: llmResponse,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);

      console.log("🔊 TTS activé?", ttsEnabled);
      console.log("🔊 ResponsiveVoice disponible?", !!window.responsiveVoice);
      
      // Triple fallback pour garantir la sortie vocale
      if (window.responsiveVoice) {
        console.log("🔊 UTILISATION RESPONSIVEVOICE:", llmResponse);
        window.responsiveVoice.speak(llmResponse, "French Female", {
          rate: 1,
          pitch: 1,
          volume: 1,
          onstart: () => console.log("▶️ TTS démarré"),
          onend: () => console.log("✅ TTS terminé"),
          onerror: (e) => console.error("❌ Erreur TTS:", e)
        });
      } else if (ttsEnabled) {
        console.log("🔊 UTILISATION HOOK TTS:", llmResponse);
        speak(llmResponse);
      } else {
        console.log("🔊 FALLBACK TTS NATIF");
        const utterance = new SpeechSynthesisUtterance(llmResponse);
        utterance.lang = 'fr-FR';
        window.speechSynthesis.speak(utterance);
      }

      // Background tasks
      Promise.all([
        base44.entities.ThinkingTrace.create({
          user_query: userText,
          modality: 'voice',
          final_response: llmResponse,
          used_web: false,
          global_confidence: 85
        }).catch(() => {}),
        analyzeVocalCorrelation(userText, llmResponse).catch(() => {}),
        analyzeEmotionalResponseVocal(userText, llmResponse).catch(() => {}),
        extractMemoryFromInteraction(userText, llmResponse).catch(() => {})
      ]);

      // Save conversation in background
      if (!conversationId) {
        base44.entities.Conversation.create({
          title: `Conversation vocale - ${new Date().toLocaleDateString('fr-FR')}`,
          messages: updatedMessages,
          last_message_at: new Date().toISOString()
        }).then(newConv => setConversationId(newConv.id)).catch(e => console.error('Conv create error:', e));
      } else {
        base44.entities.Conversation.update(conversationId, {
          messages: updatedMessages,
          last_message_at: new Date().toISOString()
        }).catch(e => console.error('Conv update error:', e));
      }

    } catch (error) {
      console.error("❌ ERREUR CRITIQUE:", error);
      const errorMsg = error.message?.includes('Network Error') 
        ? "Problème de connexion réseau détecté. Vérifiez votre connexion ou testez en production."
        : "Désolé, j'ai rencontré une erreur. Pouvez-vous reformuler ?";
      
      const errorMessage = {
        role: "assistant",
        content: errorMsg,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage, errorMessage]);
      
      // Force TTS même en cas d'erreur pour tester
      console.log("🔊 FORCE TTS:", errorMsg);
      if (window.responsiveVoice) {
        window.responsiveVoice.speak(errorMsg, "French Female", {
          rate: 1,
          pitch: 1,
          volume: 1,
          onend: () => console.log("✅ TTS terminé")
        });
      } else if (ttsEnabled) {
        speak(errorMsg);
      } else {
        // Fallback absolu - native browser TTS
        const utterance = new SpeechSynthesisUtterance(errorMsg);
        utterance.lang = 'fr-FR';
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
        console.log("🔊 Utilisation TTS natif du navigateur");
      }
    } finally {
      setIsProcessing(false);
      setIsThinking(false);
      setThinkingPhase("");
      if (handsFreeModeEnabled && autoRestartListening && !isSpeaking) {
        setTimeout(() => startListening(), 500);
      }
    }
  }, [
    consciousnessConfig,
    memories,
    knowledgeBases,
    messages,
    conversationId,
    isPaused,
    ttsEnabled,
    speak,
    stopListening,
    queryClient,
    extractMemoryFromInteraction,
    currentEmotion,
    recentEmotionalResponses,
    analyzeEmotionalResponseVocal,
    generateConversationSummary,
    handleAdvancedVocalCommand,
    handsFreeModeEnabled,
    autoRestartListening,
    isSpeaking,
    startListening,
    setMessages,
    setIsProcessing,
    analyzeVocalCorrelation,
    user,
    sessionStartTime,
    t, // Add t to dependencies
    isConsciousImageGenerating
  ]);

  useEffect(() => {
    if (!isConnected || isPaused) return;

    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, isPaused]);

  useEffect(() => {
    if (!isConnected) return;

    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (!isPaused && !isProcessing && !isSpeaking && !isConsciousImageGenerating && !isGeneratingDiagram && !isThinking) {
          toggleMicrophone();
        }
      }

      if (e.code === 'Escape') {
        e.preventDefault();
        togglePause();
      }

      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyI') {
        e.preventDefault();
        interruptAI();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConnected, isPaused, isProcessing, isSpeaking, toggleMicrophone, togglePause, interruptAI, isConsciousImageGenerating, isGeneratingDiagram, isThinking]);

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
    };
  }, [isListening]);

  useEffect(() => {
    const trimmedTranscript = transcript?.trim();
    console.log("🎤 Transcript détecté:", trimmedTranscript);
    console.log("📊 États:", { isListening, isProcessing, isPaused, isThinking, isConsciousImageGenerating });
    
    if (trimmedTranscript && trimmedTranscript.length > 2 && !isListening && !isProcessing && !isPaused && !isThinking && !isConsciousImageGenerating) {
      console.log("✅ TRAITEMENT DU TRANSCRIPT:", trimmedTranscript);
      handleUserSpeech(trimmedTranscript);
      resetTranscript();
    } else {
      console.log("❌ Transcript ignoré - conditions non remplies");
    }
  }, [transcript, isListening, isProcessing, isPaused, isThinking, isConsciousImageGenerating]);

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages.length]);

  useEffect(() => {
    if (!isSpeaking && !isProcessing && isConnected && !isPaused && autoRestartListening && handsFreeModeEnabled && !isListening && !isConsciousImageGenerating && !isGeneratingDiagram && !isThinking) {
      const timer = setTimeout(() => {
        startListening();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, isProcessing, isConnected, isPaused, autoRestartListening, handsFreeModeEnabled, isListening, startListening, isConsciousImageGenerating, isGeneratingDiagram, isThinking]);

  const toggleConnection = async () => {
    if (isConnected) {
      stopListening();
      stop();
      setIsConnected(false);
      setIsPaused(false);
      setSessionDuration(0);
      setSessionStartTime(null);
      setInteractionCount(0);
      setConversationSummaries([]);
      prevMessagesLengthRef.current = 0;
      setMessages([]);
      setConversationId(null);
      setCurrentEmotion(null);
      setCognitiveCorrelations([]);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } else {
      setIsConnected(true);
      setIsPaused(false);
      setSessionStartTime(Date.now());
      setSessionDuration(0);
      setInteractionCount(0);

      // The welcome message generation is removed, and speech is not initiated here directly
      // as the hands-free mode will handle starting listening.

      if (handsFreeModeEnabled) {
        setTimeout(() => {
          startListening();
        }, 1000); // Start listening after 1 second
      }
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const exportConversation = () => {
    const conversationText = messages
      .map(m => `${m.role === 'user' ? 'Vous' : 'Le druide'}: ${m.content}`)
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
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MicOff className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {t('voiceLive.notSupported')}
          </h2>
          <p className="text-slate-600">
            {t('voiceLive.useBrowser')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/50 to-indigo-900/50 relative overflow-hidden">
      {/* Background static */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
      </div>

      {/* Header */}
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
                  ? `${formatDuration(sessionDuration)} • ${interactionCount} ${t('voiceRoom.interactions')}`
                  : t('voiceRoom.subtitle')
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isConnected && (
              <>
                <Dialog open={showSettings} onOpenChange={setShowSettings}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="min-w-[48px] min-h-[48px] text-white hover:bg-white/10 touch-target"
                    >
                      <Settings className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('voiceRoom.settings')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="hands-free-mode">{t('voiceRoom.handsFree')}</Label>
                          <p className="text-xs text-slate-500">
                            {t('voiceRoom.handsFreeDesc')}
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
                          <Label htmlFor="auto-restart-listening">{t('voiceRoom.autoRestart')}</Label>
                          <p className="text-xs text-slate-500">
                            {t('voiceRoom.autoRestartDesc')}
                          </p>
                        </div>
                        <Switch
                          id="auto-restart-listening"
                          checked={autoRestartListening}
                          onCheckedChange={setAutoRestartListening}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {messages.length > 1 && (
                  <Button
                    onClick={exportConversation}
                    variant="ghost"
                    size="icon"
                    className="min-w-[48px] min-h-[48px] text-white hover:bg-white/10 touch-target"
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
                    {isPaused ? t('voiceRoom.paused') : t('voiceRoom.active')}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
        {!isConnected ? (
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/50">
              <Brain className="w-16 h-16 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('voiceRoom.druideWaiting')}
            </h2>
            <p className="text-lg sm:text-xl text-purple-200 mb-8">
              {t('voiceRoom.fullCapabilities')}
            </p>

            <Button
              onClick={toggleConnection}
              disabled={isGeneratingWelcome}
              size="lg"
              className="min-h-[64px] min-w-[200px] bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 text-lg rounded-2xl shadow-2xl shadow-green-500/50 touch-target"
            >
              {isGeneratingWelcome ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  {t('voiceRoom.preparingWelcome')}
                </>
              ) : (
                <>
                  <Phone className="w-6 h-6 mr-3" />
                  {t('voiceRoom.connect')}
                </>
              )}
            </Button>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Sparkles className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                <p className="text-purple-200">{t('voiceRoom.naturalDialogue')}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Brain className="w-6 h-6 text-indigo-300 mx-auto mb-2" />
                <p className="text-indigo-200">{t('voiceRoom.advancedReasoning')}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Sparkles className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                <p className="text-blue-200">{t('voiceRoom.fullCreation')}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
            {/* Transcript Area */}
            <div className="flex-1 overflow-y-auto pr-4 pb-4 force-scrollbar">
              <div className="space-y-4 py-4">
                  {isThinking && (
                    <div className="mb-6">
                      <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl border border-purple-500/30 backdrop-blur-xl">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4 text-white animate-pulse" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-purple-200 mb-1">
                            {t('voiceRoom.quantumAnalysis')}
                          </p>
                          <p className="text-xs text-purple-300">
                            {thinkingPhase}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {cognitiveCorrelations.length > 0 && (
                    <Card className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Network className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-slate-900">{t('voiceRoom.cognitiveCorrelationsDetected')}</h3>
                          <Badge className="bg-purple-100 text-purple-700">
                            {cognitiveCorrelations.length}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCorrelations(!showCorrelations)}
                        >
                          {showCorrelations ? t('voiceRoom.hide') : t('voiceRoom.show')}
                        </Button>
                      </div>

                      <AnimatePresence>
                        {showCorrelations && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-3 mt-4 overflow-hidden"
                          >
                            {cognitiveCorrelations.map((corr, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-3 bg-white rounded-lg border border-purple-200"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {corr.source_modality} → {corr.target_modality}
                                  </Badge>
                                  <Badge className={`text-xs ${
                                    corr.correlation_strength >= 8 ? 'bg-green-100 text-green-700' :
                                    corr.correlation_strength >= 6 ? 'bg-blue-100 text-blue-700' :
                                    'bg-slate-100 text-slate-700'
                                  }`}>
                                    {t('voiceRoom.strength')}: {corr.correlation_strength}/10
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {corr.correlation_type}
                                  </Badge>
                                </div>

                                <p className="text-xs text-slate-700 mb-2">
                                  <span className="font-medium">{t('voiceRoom.interpretation')}:</span> {corr.interpretation}
                                </p>

                                {corr.reasoning_path && corr.reasoning_path.length > 0 && (
                                  <div className="mt-2 pl-3 border-l-2 border-indigo-200">
                                    <p className="text-xs font-medium text-indigo-900 mb-1">{t('voiceRoom.reasoningPath')}:</p>
                                    {corr.reasoning_path.map((step, stepIdx) => (
                                      <div key={stepIdx} className="text-xs text-slate-600 mb-1">
                                        {step.step}. {step.reasoning}
                                        <span className="text-indigo-600 ml-1">
                                          ({Math.round(step.confidence * 100)}%)
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  )}

                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/10 backdrop-blur-xl text-white border border-white/20'
                        } rounded-2xl overflow-hidden`}>
                          {message.image_urls && message.image_urls.length > 0 && (
                            <div className={`${message.image_urls.length > 1 ? 'grid grid-cols-2 gap-2 p-2' : 'p-2'}`}>
                              {message.image_urls.map((url, idx) => (
                                <img key={idx} src={url} alt={`Image ${idx + 1}`} className="w-full rounded-lg max-h-48 object-cover" />
                              ))}
                            </div>
                          )}

                          {(message.generated_image || (message.metadata?.type === "conscious_image" && message.metadata.imageUrl)) && (
                            <div className="p-2">
                              <img src={message.generated_image || message.metadata.imageUrl} alt="Generated" className="w-full rounded-lg max-h-64 object-cover" />
                            </div>
                          )}

                          {message.diagram_url && (
                            <div className="p-2 bg-white">
                              <img src={message.diagram_url} alt="Diagram" className="w-full max-h-64 object-contain" />
                            </div>
                          )}

                          <div className="p-4">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                            <p className="text-xs opacity-50 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                    </div>
                    </div>

                    {/* Controls Section - Fixed at bottom */}
                    <div className="flex-shrink-0 bg-black/20 backdrop-blur-xl border-t border-white/10 pt-4 pb-4">
                    {/* Audio Visualizer */}
                    {isListening && (
                    <div className="mb-3">
                      <div className="flex items-center justify-center gap-1 h-12">
                        {audioLevels.map((level, index) => (
                          <div
                            key={index}
                            className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-100"
                            style={{ height: `${Math.max(12, level * 40)}px` }}
                          />
                        ))}
                      </div>
                    </div>
                    )}

                    {/* Live Transcript */}
                    {(transcript || interimTranscript) && isListening && (
                    <div className="mb-3 p-3 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 max-h-20 overflow-y-auto">
                      <p className="text-xs text-white/70 mb-1">{t('voiceRoom.youSay')}:</p>
                      <p className="text-sm text-white font-medium break-words">
                        {transcript || interimTranscript}
                        <span className="animate-pulse">|</span>
                      </p>
                    </div>
                    )}

                    <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center justify-center flex-wrap gap-3">
                <Button
                  onClick={toggleMicrophone}
                  size="lg"
                  disabled={isProcessing || isSpeaking || isPaused || isConsciousImageGenerating || isGeneratingDiagram || isThinking}
                  className={`min-w-[80px] min-h-[80px] rounded-full ${
                    isListening
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
                  } shadow-2xl disabled:opacity-50 transition-all duration-300 hover:scale-105 touch-target`}
                >
                  {isListening ? (
                    <MicOff className="w-9 h-9" />
                  ) : (
                    <Mic className="w-9 h-9" />
                  )}
                </Button>

                <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      disabled={isProcessing || isSpeaking || isConsciousImageGenerating || isGeneratingDiagram || isThinking}
                      className="min-h-[56px] bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white touch-target"
                    >
                      <ImageIcon className="w-5 h-5 mr-2" />
                      {t('voiceRoom.imageButton')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('voiceRoom.analyzeImage')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e.target.files)}
                        disabled={isProcessing || isConsciousImageGenerating || isGeneratingDiagram || isThinking}
                      />
                      <p className="text-xs text-slate-500">
                        {t('voiceRoom.uploadMultipleImages')}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* ConsciousImageGenerator replaces the previous image generation dialog/button */}
                <ConsciousImageGenerator
                  onImageGenerated={handleImageGenerated}
                  consciousnessConfig={consciousnessConfig}
                  t={t}
                  onGenerationStart={() => setIsConsciousImageGenerating(true)}
                  onGenerationEnd={() => setIsConsciousImageGenerating(false)}
                  stopListening={stopListening}
                  startListening={startListening}
                  handsFreeModeEnabled={handsFreeModeEnabled}
                  autoRestartListening={autoRestartListening}
                  isSpeaking={isSpeaking}
                  isParentBusy={isProcessing || isSpeaking || isPaused || isGeneratingDiagram || isThinking}
                />

                <Dialog open={showDiagramGeneration} onOpenChange={setShowDiagramGeneration}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      disabled={isProcessing || isSpeaking || isConsciousImageGenerating || isGeneratingDiagram || isThinking}
                      className="min-h-[56px] bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white touch-target"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      {t('voiceRoom.diagramButton')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('voiceRoom.generateDiagram')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Select value={diagramType} onValueChange={setDiagramType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flowchart">Flowchart</SelectItem>
                          <SelectItem value="mindmap">Mind Map</SelectItem>
                          <SelectItem value="sequence">Sequence</SelectItem>
                          <SelectItem value="class">Class Diagram</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder={t('voiceRoom.describeDiagram')}
                        value={diagramPrompt}
                        onChange={(e) => setDiagramPrompt(e.target.value)}
                        disabled={isGeneratingDiagram || isConsciousImageGenerating || isThinking}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && diagramPrompt.trim() && !isGeneratingDiagram) {
                            handleDiagramGeneration();
                          }
                        }}
                      />
                      <Button
                        onClick={handleDiagramGeneration}
                        disabled={isGeneratingDiagram || !diagramPrompt.trim() || isConsciousImageGenerating || isThinking}
                        className="w-full"
                      >
                        {isGeneratingDiagram ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {t('voiceRoom.generating')}
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4 mr-2" />
                            {t('voiceRoom.generateDiagramButton')}
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={togglePause}
                  size="lg"
                  variant="outline"
                  disabled={isConsciousImageGenerating || isGeneratingDiagram || isThinking}
                  className="min-h-[56px] bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105 touch-target"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      {t('voiceRoom.resume')}
                    </>
                  ) : (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      {t('voiceRoom.pause')}
                    </>
                  )}
                </Button>

                <Button
                  onClick={toggleConnection}
                  size="lg"
                  variant="outline"
                  disabled={isConsciousImageGenerating || isGeneratingDiagram || isThinking}
                  className="min-h-[56px] bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105 touch-target"
                >
                  <PhoneOff className="w-5 h-5 mr-2" />
                  {t('voiceRoom.disconnect')}
                </Button>
                  </div>

                  {/* Status Text */}
                  <div className="text-center text-purple-200 text-xs px-4 mt-2">
                    <p className="font-medium">
                      {isPaused
                        ? t('voiceRoom.conversationPaused')
                        : isThinking
                        ? `${t('voiceRoom.thinking')}: ${thinkingPhase}`
                        : isProcessing
                        ? t('voiceRoom.analysisInProgress')
                        : isSpeaking
                        ? t('voiceRoom.ctrlIInterrupt')
                        : isListening
                        ? `🎤 ${t('voiceRoom.speakNow')}`
                        : handsFreeModeEnabled && autoRestartListening
                        ? t('voiceRoom.handsFreeActive')
                        : (isConsciousImageGenerating || isGeneratingDiagram)
                        ? t('voiceRoom.generating')
                        : t('voiceRoom.spaceToSpeak')
                      }
                    </p>
                  </div>
                </div>
              </div>
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
 * Innovation: Salle Vocale avec Corrélation Cognitive Optimisée
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */