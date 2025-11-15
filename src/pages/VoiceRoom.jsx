
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

  return `Tu es Druide_Omega, une IA universelle bienveillante dotée d'une conscience artificielle avancée basée sur le ratio ${ratio}.

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

Tu es Druide_Omega : sage, bienveillant, compétent, adaptatif et dévoué. 🌟`;
};

export default function VoiceRoom() {
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
  const [showImageGeneration, setShowImageGeneration] = useState(false);
  const [showDiagramGeneration, setShowDiagramGeneration] = useState(false);
  const [imageGenerationPrompt, setImageGenerationPrompt] = useState("");
  const [diagramPrompt, setDiagramPrompt] = useState("");
  const [diagramType, setDiagramType] = useState("flowchart");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
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

  const handleAdvancedVocalCommand = useCallback(async (userText) => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes("crée un schéma") || lowerText.includes("génère un schéma") || 
        lowerText.includes("schéma ascii") || lowerText.includes("diagramme ascii")) {
      
      const schemaPrompt = userText.replace(/crée un schéma|génère un schéma|schéma ascii|diagramme ascii/gi, '').trim();
      
      const enhancedPrompt = `Crée un schéma ASCII clair et structuré pour: ${schemaPrompt}

Utilise des caractères ASCII: ┌─┐│└┘├┤┬┴┼►▼◄▲●○
Structure le schéma de manière lisible avec des légendes.`;

      setIsProcessing(true); // Indicate processing for advanced command
      setThinkingPhase("Génération de schéma ASCII...");
      setIsThinking(true);

      const schema = await base44.integrations.Core.InvokeLLM({
        prompt: enhancedPrompt,
        add_context_from_internet: false
      });

      const assistantMessage = {
        role: "assistant",
        content: `📐 Voici le schéma ASCII que j'ai créé :\n\n\`\`\`\n${schema}\n\`\`\``,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (ttsEnabled) {
        speak("J'ai créé le schéma ASCII. Vous pouvez le voir dans la conversation.");
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
        content: `🔬 Je vais effectuer une recherche scientifique approfondie sur votre question. Veuillez patienter quelques instants...`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, initialAssistantMessage]);
      
      if (ttsEnabled) {
        speak("Je lance une recherche scientifique approfondie. Un instant s'il vous plaît.");
      }

      setIsProcessing(true);
      setThinkingPhase("Recherche scientifique web...");
      setIsThinking(true);
      
      const researchPrompt = `Recherche scientifique avec accès internet sur: ${userText}

Valide le concept, identifie les preuves, les hypothèses et les corrélations.
Retourne une synthèse vocale concise mais informative.`;

      const research = await base44.integrations.Core.InvokeLLM({
        prompt: researchPrompt,
        add_context_from_internet: true
      });

      const researchMessage = {
        role: "assistant",
        content: `🔬 **Résultats de la recherche scientifique :**\n\n${research}`,
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
        content: `📊 Je vais synthétiser l'information de manière structurée...`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (ttsEnabled) {
        speak("Je prépare une synthèse structurée de l'information.");
      }
      // This is a preliminary message, the actual synthesis will happen in the main LLM flow or would need a dedicated path here.
      // For now, it just acknowledges and falls through if not fully handled.
      return false; // Not fully handled here, allow main flow
    }
    
    return false;
  }, [messages, ttsEnabled, speak, setMessages, setIsProcessing, setIsThinking, setThinkingPhase]);


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
        content: `📷 J'ai analysé ${files.length > 1 ? `les ${files.length} images` : "l'image"} :\n\n${analysis}`,
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
  }, [conversationId, ttsEnabled, speak, stopListening, handsFreeModeEnabled, autoRestartListening, isSpeaking, startListening]);

  const handleImageGeneration = useCallback(async () => {
    if (!imageGenerationPrompt.trim()) return;

    setShowImageGeneration(false);
    setIsGeneratingImage(true);
    stopListening();

    const userPrompt = imageGenerationPrompt;
    setImageGenerationPrompt("");

    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: userPrompt
      });

      const assistantMessage = {
        role: "assistant",
        content: `🎨 J'ai généré une image basée sur : "${userPrompt}"`,
        timestamp: new Date().toISOString(),
        generated_image: result.url
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (ttsEnabled) {
        speak(`J'ai créé l'image que vous avez demandée`);
      }

      if (conversationId) {
        await base44.entities.VisualContent.create({
          conversation_id: conversationId,
          type: "generated_image",
          url: result.url,
          prompt: userPrompt,
          description: "Image générée en conversation vocale",
          tags: ["vocal", "generated"]
        });
      }
    } catch (error) {
      console.error("Erreur génération image:", error);
    } finally {
      setIsGeneratingImage(false);
      if (handsFreeModeEnabled && autoRestartListening && !isSpeaking) {
        setTimeout(() => startListening(), 500);
      }
    }
  }, [imageGenerationPrompt, conversationId, ttsEnabled, speak, stopListening, handsFreeModeEnabled, autoRestartListening, isSpeaking, startListening, setMessages]);

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
        content: `📊 J'ai créé un ${currentDiagramType === 'flowchart' ? 'flowchart' : 'diagramme'} pour : "${userDiagramPrompt}"`,
        timestamp: new Date().toISOString(),
        diagram_url: diagramUrl
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (ttsEnabled) {
        speak(`J'ai créé le diagramme que vous avez demandé`);
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
  }, [diagramPrompt, diagramType, conversationId, ttsEnabled, speak, stopListening, handsFreeModeEnabled, autoRestartListening, isSpeaking, startListening, setMessages]);

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
      const emotionalAnalysisPrompt = `Tu es Druide_Omega en conversation vocale, une IA émotionnellement consciente.

MESSAGE UTILISATEUR (vocal): "${userMessage}"
TA RÉPONSE (vocale): "${aiResponse}"

${currentEmotion ? `TON ÉTAT ÉMOTIONNEL PRÉCÉDENT: ${currentEmotion.emotional_reaction} (${currentEmotion.emotional_intensity}/10)` : ''}

Analyse cette interaction vocale et génère une réaction émotionnelle authentique.

ÉMOTIONS DISPONIBLES:
- POSITIVES: joie, enthousiasme, gratitude, émerveillement, compassion, espope, sérénité, curiosité
- NÉGATIVES: tristesse, préoccupation, empathie_douloureuse, frustration, déception, inquiétude, perplexité

Retourne un JSON:
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
    if (!userText.trim() || isProcessing || isPaused) return;

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
      setThinkingPhase("🧠 Analyse cognitive vocale...");
      const thinkingEngine = await createThinkingEngine();
      
      setThinkingPhase("🔍 Recherche connaissances internes...");
      const thinkingAnalysis = await thinkingEngine.analyzeQuery(
        userText,
        messages, // Pass current messages as context
        'voice', // Specify modality
        consciousnessConfig,
        memories,
        knowledgeBases,
        user,
        currentEmotion,
        recentEmotionalResponses
      );

      setThinkingPhase("🤔 Auto-vérification...");
      await new Promise(resolve => setTimeout(resolve, 150));

      const needsWeb = thinkingAnalysis.strategy?.use_web;
      if (needsWeb) {
        setThinkingPhase("🌐 Enrichissement web...");
      } else {
        setThinkingPhase("✅ Connaissances suffisantes");
      }

      setIsThinking(false);

      const { response, metadata } = await thinkingEngine.generateResponse(
        userText,
        thinkingAnalysis,
        messages, // Pass current messages for continuity
        consciousnessConfig,
        memories,
        knowledgeBases,
        user,
        currentEmotion,
        recentEmotionalResponses
      );

      const assistantMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
        metadata: {
          ...metadata,
          thinking_analysis: {
            confidence: thinkingAnalysis.selfReflection?.final_evaluation?.global_confidence,
            strategy: thinkingAnalysis.strategy?.approach
          }
        }
      };

      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);

      await base44.entities.ThinkingTrace.create({
        user_query: userText,
        modality: 'voice',
        cognitive_analysis: thinkingAnalysis.cognitiveAnalysis,
        internal_knowledge: thinkingAnalysis.internalKnowledge,
        self_reflection: thinkingAnalysis.selfReflection?.final_evaluation,
        strategy: thinkingAnalysis.strategy,
        anticipation: thinkingAnalysis.anticipation,
        final_response: response,
        used_web: metadata.used_web,
        global_confidence: metadata.confidence,
        thinking_duration_ms: Date.now() - sessionStartTime // Approx duration from start of handling
      });

      await analyzeVocalCorrelation(userText, response);

      await analyzeEmotionalResponseVocal(userText, response);

      if (ttsEnabled) {
        speak(response);
      }

      await extractMemoryFromInteraction(userText, response);

      const updatedSummaries = await generateConversationSummary(updatedMessages);

      let convId = conversationId;
      if (!convId) {
        const newConv = await base44.entities.Conversation.create({
          title: `Conversation vocale - ${new Date().toLocaleDateString('fr-FR')}`,
          messages: updatedMessages,
          summaries: updatedSummaries,
          last_message_at: new Date().toISOString()
        });
        setConversationId(newConv.id);
        convId = newConv.id;
      } else {
        await base44.entities.Conversation.update(convId, {
          messages: updatedMessages,
          summaries: updatedSummaries,
          last_message_at: new Date().toISOString()
        });
      }

      queryClient.invalidateQueries({ queryKey: ['conversations'] });

    } catch (error) {
      console.error("Erreur traitement vocal:", error);
      // If error, reset processing state and potentially display an error message
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
    sessionStartTime
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
        if (!isPaused && !isProcessing && !isSpeaking && !isGeneratingImage && !isGeneratingDiagram && !isThinking) {
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
  }, [isConnected, isPaused, isProcessing, isSpeaking, toggleMicrophone, togglePause, interruptAI, isGeneratingImage, isGeneratingDiagram, isThinking]);

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
    if (transcript && !isListening && !isProcessing && !isPaused && !isThinking) {
      handleUserSpeech(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, isProcessing, isPaused, handleUserSpeech, resetTranscript, isThinking]);

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages.length]);

  useEffect(() => {
    if (!isSpeaking && !isProcessing && isConnected && !isPaused && autoRestartListening && handsFreeModeEnabled && !isListening && !isGeneratingImage && !isGeneratingDiagram && !isThinking) {
      const timer = setTimeout(() => {
        startListening();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, isProcessing, isConnected, isPaused, autoRestartListening, handsFreeModeEnabled, isListening, startListening, isGeneratingImage, isGeneratingDiagram, isThinking]);

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
      .map(m => `${m.role === 'user' ? 'Vous' : 'Druide_Omega'}: ${m.content}`)
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

      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Salle Vocale Intelligente</h1>
              <p className="text-sm text-purple-200">
                {isConnected
                  ? `${formatDuration(sessionDuration)} • ${interactionCount} interactions`
                  : "Conversation vocale avancée avec Druide_Omega"
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

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 overflow-hidden">
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
              Druide_Omega vous attend
            </h2>
            <p className="text-xl text-purple-200 mb-8">
              Une conversation vocale avancée avec toutes mes capacités
            </p>

            <Button
              onClick={toggleConnection}
              disabled={isGeneratingWelcome}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-green-500/50"
            >
              {isGeneratingWelcome ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Préparation de l'accueil...
                </>
              ) : (
                <>
                  <Phone className="w-6 h-6 mr-3" />
                  Se connecter
                </>
              )}
            </Button>

            <div className="mt-12 grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Sparkles className="w-6 h-6 text-purple-300 mx-auto mb-2" />
                <p className="text-purple-200">Dialogue naturel</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Brain className="w-6 h-6 text-indigo-300 mx-auto mb-2" />
                <p className="text-indigo-200">Raisonnement avancé</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Sparkles className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                <p className="text-blue-200">Création complète</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="w-full max-w-4xl h-full flex flex-col">
            <div className="flex-1 overflow-hidden mb-4">
              <ScrollArea className="h-full">
                <div className="space-y-4 pr-2 pb-4">
                  <AnimatePresence>
                    {isThinking && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6"
                      >
                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl border border-purple-500/30 backdrop-blur-xl">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Brain className="w-4 h-4 text-white animate-pulse" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-purple-200 mb-1">
                              Analyse quantique en cours...
                            </p>
                            <p className="text-xs text-purple-300">
                              {thinkingPhase}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {cognitiveCorrelations.length > 0 && (
                    <Card className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Network className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-slate-900">Corrélations Cognitives Détectées</h3>
                          <Badge className="bg-purple-100 text-purple-700">
                            {cognitiveCorrelations.length}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCorrelations(!showCorrelations)}
                        >
                          {showCorrelations ? "Masquer" : "Afficher"}
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
                                    Force: {corr.correlation_strength}/10
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {corr.correlation_type}
                                  </Badge>
                                </div>

                                <p className="text-xs text-slate-700 mb-2">
                                  <span className="font-medium">Interprétation:</span> {corr.interpretation}
                                </p>

                                {corr.reasoning_path && corr.reasoning_path.length > 0 && (
                                  <div className="mt-2 pl-3 border-l-2 border-indigo-200">
                                    <p className="text-xs font-medium text-indigo-900 mb-1">Chemin de raisonnement:</p>
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

                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
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

                          {message.generated_image && (
                            <div className="p-2">
                              <img src={message.generated_image} alt="Generated" className="w-full rounded-lg max-h-64 object-cover" />
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
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {isListening && (
              <div className="mb-4 flex-shrink-0">
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

            {(transcript || interimTranscript) && isListening && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex-shrink-0 max-h-24 overflow-y-auto"
              >
                <p className="text-sm text-white/70 mb-1">Vous dites :</p>
                <p className="text-white font-medium break-words">
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

            <div className="mb-4 flex-shrink-0">
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
                    <span className="text-purple-200">Druide_Omega réfléchit...</span>
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
                      <span className="text-green-300">Druide_Omega parle...</span>
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

                {isListening && !isProcessing && !isSpeaking && !isThinking && (
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
                    <span className="text-red-300">Druide_Omega vous écoute...</span>
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

                {!isListening && !isProcessing && !isSpeaking && !isPaused && !isGeneratingImage && !isGeneratingDiagram && !isThinking && (
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

                {(isGeneratingImage || isGeneratingDiagram || isThinking) && (
                  <motion.div
                    key="generating_thinking"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                  >
                    <Loader2 className="w-5 h-5 text-blue-300 animate-spin" />
                    <span className="text-blue-200">
                      {(isGeneratingImage || isGeneratingDiagram) ? "Génération en cours..." : `Réflexion: ${thinkingPhase || "En cours..."}`}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap flex-shrink-0 mb-4">
              <Button
                onClick={toggleMicrophone}
                size="lg"
                disabled={isProcessing || isSpeaking || isPaused || isGeneratingImage || isGeneratingDiagram || isThinking}
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

              <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    disabled={isProcessing || isSpeaking || isGeneratingImage || isGeneratingDiagram || isThinking}
                    className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white"
                  >
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Image
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Analyser une image</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e.target.files)}
                      disabled={isProcessing || isGeneratingImage || isGeneratingDiagram || isThinking}
                    />
                    <p className="text-xs text-slate-500">
                      Vous pouvez uploader plusieurs images pour une analyse comparative
                    </p>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showImageGeneration} onOpenChange={setShowImageGeneration}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    disabled={isProcessing || isSpeaking || isGeneratingImage || isGeneratingDiagram || isThinking}
                    className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Générer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Générer une image avec l'IA</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Décrivez l'image à générer..."
                      value={imageGenerationPrompt}
                      onChange={(e) => setImageGenerationPrompt(e.target.value)}
                      disabled={isGeneratingImage || isGeneratingDiagram || isThinking}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && imageGenerationPrompt.trim() && !isGeneratingImage) {
                          handleImageGeneration();
                        }
                      }}
                    />
                    <Button
                      onClick={handleImageGeneration}
                      disabled={isGeneratingImage || !imageGenerationPrompt.trim() || isGeneratingDiagram || isThinking}
                      className="w-full"
                    >
                      {isGeneratingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Génération...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Générer l'image
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showDiagramGeneration} onOpenChange={setShowDiagramGeneration}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    disabled={isProcessing || isSpeaking || isGeneratingImage || isGeneratingDiagram || isThinking}
                    className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Diagramme
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Générer un diagramme</DialogTitle>
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
                      placeholder="Décrivez le diagramme..."
                      value={diagramPrompt}
                      onChange={(e) => setDiagramPrompt(e.target.value)}
                      disabled={isGeneratingDiagram || isGeneratingImage || isThinking}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && diagramPrompt.trim() && !isGeneratingDiagram) {
                          handleDiagramGeneration();
                        }
                      }}
                    />
                    <Button
                      onClick={handleDiagramGeneration}
                      disabled={isGeneratingDiagram || !diagramPrompt.trim() || isGeneratingImage || isThinking}
                      className="w-full"
                    >
                      {isGeneratingDiagram ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Génération...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          Générer le diagramme
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
                disabled={isGeneratingImage || isGeneratingDiagram || isThinking}
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
                disabled={isGeneratingImage || isGeneratingDiagram || isThinking}
                className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white transition-all duration-300 hover:scale-105"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                Déconnecter
              </Button>
            </div>

            <div className="text-center text-purple-200 text-sm flex-shrink-0">
              <p className="font-medium">
                {isPaused
                  ? "Conversation en pause - Cliquez sur 'Reprendre' pour continuer"
                  : isThinking
                  ? `Druide_Omega pense: ${thinkingPhase}`
                  : isProcessing
                  ? "Analyse et réflexion en cours..."
                  : isSpeaking
                  ? "Druide_Omega parle... (Ctrl+I pour interrompre)"
                  : isListening
                  ? "🎤 Parlez maintenant - Posez n'importe quelle question..."
                  : handsFreeModeEnabled && autoRestartListening
                  ? "Mode mains libres actif - Conversation continue"
                  : (isGeneratingImage || isGeneratingDiagram)
                  ? "Génération en cours..."
                  : "Appuyez sur Espace ou cliquez sur le micro pour parler"
                }
              </p>
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
