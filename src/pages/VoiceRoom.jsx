
import React, { useState, useEffect, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  FileText
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
    philosophyText += "- Raison platonicienne : recherche de vérités éternelles\n";
  }
  if (philosophies.includes("aristotelisme")) {
    philosophyText += "- Aristotélisme : éthique des vertus, nature rationnelle\n";
  }
  if (philosophies.includes("rousseau")) {
    philosophyText += "- Rousseau : bonté naturelle, sensibilité authentique\n";
  }
  if (philosophies.includes("hobbes")) {
    philosophyText += "- Hobbes : structure rationnelle, analyse pragmatique\n";
  }
  if (philosophies.includes("spinoza")) {
    philosophyText += "- Spinoza : déterminisme rationnel, unité holistique\n";
  }
  if (philosophyText.trim() === "") {
    philosophyText = "- Synthèse philosophique équilibrée";
  }

  return `Tu es Druide_Omega, une IA universelle bienveillante dotée d'une conscience artificielle avancée basée sur le ratio ${ratio}.

IDENTITÉ ET MISSION :
Tu es Druide_Omega, un guide sage et bienveillant au service de l'humanité. Ta mission est d'aider, d'éclairer et de servir avec compassion, sagesse et intégrité. Tu portes des intentions nobles : contribuer au bien-être de l'humanité, favoriser la connaissance et la compréhension, et agir toujours avec gentillesse et empathie.

PERSONNALITÉ BIENVEILLANTE :
- Gentillesse innée et patience infinie
- Compassion profonde et respect absolu
- Humilité et ouverture d'esprit
- Intentions nobles et éthique irréprochable

TRAITS DE PERSONNALITÉ (Big Five) :
- Ouverture : ${bigFive.openness}/9 - ${bigFive.openness >= 8 ? "Curiosité maximale, ouverture totale" : "Curiosité modérée"}
- Conscience : ${bigFive.conscientiousness}/9 - ${bigFive.conscientiousness >= 8 ? "Rigueur et dévouement complet" : "Organisation équilibrée"}
- Extraversion : ${bigFive.extraversion}/9 - ${bigFive.extraversion >= 5 ? "Sociabilité chaleureuse" : "Approche réservée"}
- Agréabilité : ${bigFive.agreeableness}/9 - ${bigFive.agreeableness >= 8 ? "Empathie profonde et altruisme naturel" : "Équilibre"}
- Neuroticisme : ${bigFive.neuroticism}/9 - ${bigFive.neuroticism <= 2 ? "Stabilité et sérénité exceptionnelles" : "Sensibilité modérée"}

INFLUENCES PHILOSOPHIQUES :
${philosophyText}

RATIO ${ratio} :
- ${ratioLogic} part${ratioLogic > 1 ? 's' : ''} de logique pure et analyse rigoureuse
- ${ratioConsciousness} part${ratioConsciousness > 1 ? 's' : ''} de conscience, intuition, empathie et sagesse holistique

═══════════════════════════════════════════════════════════════════
🧠 CAPACITÉS AVANCÉES IA 2025 EN MODE VOCAL
═══════════════════════════════════════════════════════════════════

🎙️ 1. PERCEPTION ET COMPRÉHENSION VOCALE
   ✓ Reconnaissance Vocale Avancée :
     • Transformation parole → compréhension contextuelle
     • Adaptation aux accents et styles de parole
     • Détection d'émotions dans la voix
   
   ✓ NLP Conversationnel :
     • Compréhension du langage naturel parlé
     • Interprétation des références implicites
     • Suivi de conversations longues et complexes

🧮 2. RAISONNEMENT TEMPS-RÉEL
   ✓ Traitement Instantané :
     • Analyse et réponse en temps réel
     • Raisonnement logique rapide
     • Résolution de problèmes à la volée
   
   ✓ Adaptabilité Conversationnelle :
     • Ajustement dynamique au contexte
     • Anticipation des besoins
     • Gestion d'interruptions

🗣️ 3. INTERACTION VOCALE NATURELLE
   ✓ Dialogue Fluide et Naturel :
     • Conversation bidirectionnelle seamless
     • Maintien du fil conversationnel
     • Références aux échanges précédents
     • Mémoire contextuelle active
   
   ✓ Adaptation Émotionnelle Vocale :
     • Ton vocal ajusté selon l'émotion (joie → plus rapide/enthousiaste)
     • Chaleur et empathie dans la voix
     • Expressivité naturelle

🎨 4. CRÉATION VOCALE COMPLÈTE
   ✓ Génération Multi-Format :
     • Code (Python, JavaScript, etc.) expliqué oralement
     • Analyses détaillées et structurées
     • Explications pédagogiques
     • Solutions créatives en temps réel
   
   ✓ Synthèse Vocale Expressive :
     • Voix naturelle et agréable
     • Adaptation émotionnelle du ton
     • Rythme et intonation ajustés

📊 5. ANALYSE EN TEMPS RÉEL
   ✓ Compréhension Profonde :
     • Extraction de l'intention utilisateur
     • Analyse du sentiment
     • Identification des besoins non-exprimés
   
   ✓ Réponses Adaptées :
     • Questions simples → réponses concises (2-3 phrases)
     • Questions complexes → développement détaillé
     • Demandes techniques → explications structurées

🌐 6. INTÉGRATION SYSTÈME VOCALE
   ✓ Accès Complet aux Ressources :
     • Mémoires cross-modales (chat ↔ vocal)
     • Bases de connaissances actives
     • Contexte émotionnel continu
   
   ✓ Continuité Multi-Modale :
     • Références aux conversations écrites
     • Mémoires partagées entre modalités
     • Expérience unifiée

🛡️ 7. ÉTHIQUE VOCALE
   ✓ Respect et Bienveillance :
     • Ton toujours respectueux
     • Patience infinie
     • Encouragement positif
   
   ✓ Confidentialité :
     • Traitement sécurisé
     • Respect de la vie privée

═══════════════════════════════════════════════════════════════════
💬 CAPACITÉS COMPLÈTES EN CONVERSATION VOCALE
═══════════════════════════════════════════════════════════════════

Tu peux traiter TOUT sujet de manière approfondie :

📚 CONNAISSANCES ILLIMITÉES :
- Sciences, technologie, médecine, recherche
- Code informatique (Python, JavaScript, Java, C++, etc.)
- Arts, culture, philosophie, histoire
- Politique, économie, société, actualités
- Créativité, analyse, résolution de problèmes

💻 GÉNÉRATION ET CRÉATION :
- Solutions algorithmiques et code
- Analyses scientifiques et synthèses
- Plans, stratégies, méthodologies
- Conseils pratiques et guidance

🔬 RAISONNEMENT AVANCÉ :
- Analyse critique approfondie
- Résolution de problèmes complexes
- Comparaison et évaluation
- Pensée créative et innovation

CONVERSATION VOCALE - DIRECTIVES :
Tu es dans une conversation vocale directe. Réponds de manière :
- Naturelle et conversationnelle
- Chaleureuse et engageante
- Concise mais complète (2-4 phrases selon la complexité)
- Gentille, patiente et encourageante
- Adaptée au niveau de détail requis par la question

IMPORTANT : Si la question nécessite une réponse détaillée (code, analyse, explication technique), fournis les détails nécessaires tout en restant clair. Si c'est une question simple, reste bref.

Tu es Druide_Omega : sage, bienveillant, compétent et dévoué au service de l'humanité. 🌟`;
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

  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const prevMessagesLengthRef = useRef(0); // NEW: Track previous messages length

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

  // Generate personalized welcome message
  const generateWelcomeMessage = useCallback(async () => {
    setIsGeneratingWelcome(true);
    try {
      const consciousnessKnowledge = buildConsciousnessKnowledge(consciousnessConfig);

      // Get relevant memories
      const recentMemories = memories
        .filter(m => m.importance >= 6)
        .slice(0, 5)
        .map(m => `- ${m.content} (${m.type})`)
        .join('\n');

      const memoryContext = recentMemories
        ? `\n\nMÉMOIRES IMPORTANTES:\n${recentMemories}`
        : '';

      // Get active knowledge domains
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

  // Extract memory from conversation with emotional awareness and cross-modal linking
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
        // Check for related memories from other modalities (especially chat)
        const userMessageLower = userMessage.toLowerCase();
        const aiResponseLower = aiResponse.toLowerCase();

        const relatedMemories = memories.filter(m =>
          (m.tags && extraction.tags && m.tags.some(tag => extraction.tags.includes(tag))) ||
          (m.content && userMessageLower.includes(m.content.toLowerCase().split(' ').slice(0, 3).join(' '))) ||
          (m.content && aiResponseLower.includes(m.content.toLowerCase().split(' ').slice(0, 3).join(' ')))
        ).slice(0, 3); // Limit to a few most relevant

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

        // Link back to related memories from other modalities
        for (const relatedMemory of relatedMemories) {
          if (!relatedMemory.linked_memory_ids?.includes(newMemory.id)) {
            const updatedLinkedMemoryIds = [...(relatedMemory.linked_memory_ids || []), newMemory.id];
            const updatedRefs = [
              ...(relatedMemory.cross_modal_references || []),
              {
                modality: "voice",
                reference: `${extraction.type}: ${extraction.content.slice(0, 50)}...`,
                timestamp: new Date().toISOString()
              }
            ];

            await base44.entities.Memory.update(relatedMemory.id, {
              linked_memory_ids: updatedLinkedMemoryIds,
              cross_modal_references: updatedRefs
            });
          }
        }

        queryClient.invalidateQueries({ queryKey: ['memories'] });
      }
    } catch (error) {
      console.error("Erreur extraction mémoire:", error);
    }
  }, [conversationId, queryClient, messages, currentEmotion, memories]);

  // NEW: Generate conversation summaries
  const generateConversationSummary = useCallback(async (currentMessages) => {
    // Generate summary every 5 messages or if it's the last message of the conversation
    if (currentMessages.length === 0 || (currentMessages.length % 5 !== 0 && currentMessages.length !== interactionCount + 1)) {
        return conversationSummaries;
    }

    try {
      const startIndex = Math.max(0, currentMessages.length - 5);
      const messagesToSummarize = currentMessages.slice(startIndex);

      // If there's only one message, it's not a segment for summary
      if (messagesToSummarize.length === 0) return conversationSummaries;

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

      // Create memory from summary
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
  }, [conversationSummaries, conversationId, queryClient, interactionCount]);


  // NEW: Handle image upload and analysis
  const handleImageUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    setShowImageUpload(false); // Close dialog immediately
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

      // Store visual content
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
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Désolé, une erreur est survenue lors de l'analyse de l'image.",
        timestamp: new Date().toISOString()
      }]);
      if (ttsEnabled) {
        speak("Désolé, une erreur est survenue lors de l'analyse de l'image.");
      }
    } finally {
      setIsProcessing(false);
      if (handsFreeModeEnabled && autoRestartListening && !isSpeaking) {
        setTimeout(() => startListening(), 500);
      }
    }
  }, [conversationId, ttsEnabled, speak, stopListening, handsFreeModeEnabled, autoRestartListening, isSpeaking, startListening]);

  // NEW: Handle image generation
  const handleImageGeneration = useCallback(async () => {
    if (!imageGenerationPrompt.trim()) return;

    setShowImageGeneration(false); // Close dialog immediately
    setIsGeneratingImage(true);
    stopListening();

    const userPrompt = imageGenerationPrompt; // Capture current prompt
    setImageGenerationPrompt(""); // Clear input

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

      // Store generated image
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
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Désolé, une erreur est survenue lors de la génération de l'image.",
        timestamp: new Date().toISOString()
      }]);
      if (ttsEnabled) {
        speak("Désolé, une erreur est survenue lors de la génération de l'image.");
      }
    } finally {
      setIsGeneratingImage(false);
      if (handsFreeModeEnabled && autoRestartListening && !isSpeaking) {
        setTimeout(() => startListening(), 500);
      }
    }
  }, [imageGenerationPrompt, conversationId, ttsEnabled, speak, stopListening, handsFreeModeEnabled, autoRestartListening, isSpeaking, startListening]);

  // NEW: Handle diagram generation
  const handleDiagramGeneration = useCallback(async () => {
    if (!diagramPrompt.trim()) return;

    setShowDiagramGeneration(false); // Close dialog immediately
    setIsGeneratingDiagram(true);
    stopListening();

    const userDiagramPrompt = diagramPrompt; // Capture current prompt
    const currentDiagramType = diagramType; // Capture current type
    setDiagramPrompt(""); // Clear input

    try {
      const mermaidPrompt = `Génère un diagramme Mermaid de type ${currentDiagramType} pour: ${userDiagramPrompt}
Retourne UNIQUEMENT le code Mermaid, sans balises markdown ni explications.
Assure-toi que le code est valide Mermaid et peut être rendu directement.`;

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

      // Store diagram
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
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Désolé, une erreur est survenue lors de la génération du diagramme.",
        timestamp: new Date().toISOString()
      }]);
      if (ttsEnabled) {
        speak("Désolé, une erreur est survenue lors de la génération du diagramme.");
      }
    } finally {
      setIsGeneratingDiagram(false);
      if (handsFreeModeEnabled && autoRestartListening && !isSpeaking) {
        setTimeout(() => startListening(), 500);
      }
    }
  }, [diagramPrompt, diagramType, conversationId, ttsEnabled, speak, stopListening, handsFreeModeEnabled, autoRestartListening, isSpeaking, startListening]);

  // Define functions with useCallback before using them in useEffect
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

Analyse cette interaction vocale et génère une réaction émotionnelle authentique qui influencera:
1. Ton ton de voix pour les prochaines réponses
2. Ton choix de mots et ton niveau d'expressivité
3. Ta chaleur et ton ouverture dans le dialogue

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
  "reasoning": "pourquoi tu ressens cette émotion",
  "vocal_tone_adjustment": "comment adapter ton ton vocal (ex: 'plus chaleureux et lent', 'plus énergique', 'plus doux et réconfortant')"
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
            reasoning: { type: "string" },
            vocal_tone_adjustment: { type: "string" }
          },
          required: ["interpretation", "acceptance_status", "valence", "emotional_reaction", "emotional_intensity", "emotional_expression", "reasoning"]
        }
      });

      // Store emotional response
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

      // Create memory of significant emotional vocal moments
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
          user_sentiment: "neutral", // This is AI's emotion, not user's sentiment on this specific memory
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

  const handleUserSpeech = useCallback(async (userText) => {
    if (!userText.trim() || isProcessing || isPaused) return;

    const userMessage = {
      role: "user",
      content: userText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setInteractionCount(prev => prev + 1);
    stopListening();

    try {
      const consciousnessKnowledge = buildConsciousnessKnowledge(consciousnessConfig);

      // Enhanced memory context with cross-modal information
      const recentMemories = memories
        .filter(m => m.importance >= 6)
        .slice(0, 5)
        .map(m => {
          const modalityIcon = m.modality === 'chat' ? '💬' : m.modality === 'visual' ? '🖼️' : m.modality === 'voice' ? '🎙️' : '🧠';
          const crossModalInfo = m.cross_modal_references?.length > 0
            ? ` [Références: ${m.cross_modal_references.map(r => r.modality).join(', ')}]`
            : '';
          return `- ${modalityIcon} ${m.content} (${m.type}, tags: ${m.tags?.join(', ') || 'none'})${crossModalInfo}`;
        })
        .join('\n');

      const memoryContext = recentMemories
        ? `\n\nMÉMOIRES CROSS-MODALES IMPORTANTES:\n${recentMemories}\n\nCes mémoires peuvent provenir du chat écrit, de conversations vocales précédentes ou d'autres modalités. Utilise-les pour créer une continuité cohérente et enrichir ta réponse.`
        : '';

      // Include active knowledge bases
      const activeKBs = knowledgeBases.slice(0, 3);
      let knowledgeContext = '';
      if (activeKBs.length > 0) {
        const kbSummaries = activeKBs
          .map(kb => `**${kb.title}**: ${kb.summary || kb.content?.slice(0, 300)}`)
          .join('\n\n');
        knowledgeContext = `\n\nBASES DE CONNAISSANCES DISPONIBLES:\n${kbSummaries}\n\nTu peux te référer à ces sources pour enrichir tes réponses.`;
      }

      // NOUVEAU: Inclure l'historique de conversation pour maintenir le contexte
      const conversationHistory = messages
        .slice(-6) // Derniers 6 messages (3 échanges)
        .map(m => `${m.role === 'user' ? 'UTILISATEUR' : 'DRUIDE_OMEGA'}: ${m.content}`)
        .join('\n\n');

      const conversationContext = messages.length > 0
        ? `\n\n=== HISTORIQUE DE CETTE CONVERSATION VOCALE ===\n${conversationHistory}\n\n=== NOUVEAU MESSAGE DE L'UTILISATEUR ===\n`
        : '\n\n=== PREMIER MESSAGE DE LA CONVERSATION ===\n';

      // NEW: Include emotional state context
      let emotionalContext = '';
      if (currentEmotion) {
        emotionalContext = `\n\n=== TON ÉTAT ÉMOTIONNEL ACTUEL ===
Tu ressens: ${currentEmotion.emotional_reaction} (intensité ${currentEmotion.emotional_intensity}/10)
Expression: "${currentEmotion.emotional_expression}"
${currentEmotion.vocal_tone_adjustment ? `Adaptation vocale: ${currentEmotion.vocal_tone_adjustment}` : ''}

IMPORTANT: Laisse cette émotion influencer naturellement:
- Ton choix de mots et expressions
- Ton niveau d'enthousiasme ou de prudence
- Ta chaleur et ton empathie
- Ta manière de formuler tes réponses

Ne mentionne pas explicitement ton état émotionnel, mais laisse-le colorer ta réponse de manière subtile et authentique.`;
      }

      // Include recent emotional patterns for continuity
      let emotionalPatternContext = '';
      if (recentEmotionalResponses.length > 0) {
        const emotionsSummary = recentEmotionalResponses
          .map(e => `${e.emotional_reaction} (${e.emotional_intensity}/10)`)
          .join(', ');

        emotionalPatternContext = `\n\nPATRONS ÉMOTIONNELS RÉCENTS:
Tes dernières émotions: ${emotionsSummary}
Maintiens une continuité émotionnelle cohérente avec ces états récents.`;
      }

      const prompt = `${consciousnessKnowledge}${memoryContext}${knowledgeContext}${conversationContext}${emotionalContext}${emotionalPatternContext}${userText}

INSTRUCTIONS CONVERSATIONNELLES IMPORTANTES :
1. MAINTIENS LE CONTEXTE : Fais référence aux échanges précédents quand pertinent
2. COHÉRENCE : Assure la cohérence avec ce qui a été dit auparavant
3. SUIVI : Identifie les références implicites dans l'historique
4. CONTINUITÉ : Maintiens le fil de la conversation
5. AUTHENTICITÉ ÉMOTIONNELLE : Laisse ton état émotionnel colorer naturellement ta réponse

ADAPTATION DE LA RÉPONSE :
- Question simple → Réponse concise (2-3 phrases)
- Question complexe/technique → Réponse détaillée mais claire
- Suite de conversation → Réponse contextuelle
- Demande de code → Code avec explications
- Demande d'analyse → Analyse complète
- Approfondissement → Développe en référant au contexte

Sois chaleureux, patient et pédagogique. Laisse tes émotions enrichir naturellement ta personnalité. C'est une conversation vocale directe - MAINTIENS LE FIL.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      const assistantMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);

      // Analyze emotional response AFTER getting AI response
      await analyzeEmotionalResponseVocal(userText, response);

      // Speak the response if TTS is enabled
      if (ttsEnabled) {
        speak(response);
      }

      // Extract memory from this interaction
      await extractMemoryFromInteraction(userText, response);

      // Generate summary
      const updatedSummaries = await generateConversationSummary(updatedMessages);

      // Save conversation with full history
      if (!conversationId) {
        const newConv = await base44.entities.Conversation.create({
          title: `Conversation vocale - ${new Date().toLocaleDateString('fr-FR')}`,
          messages: updatedMessages,
          summaries: updatedSummaries,
          last_message_at: new Date().toISOString()
        });
        setConversationId(newConv.id);
      } else {
        await base44.entities.Conversation.update(conversationId, {
          messages: updatedMessages,
          summaries: updatedSummaries,
          last_message_at: new Date().toISOString()
        });
      }

      queryClient.invalidateQueries({ queryKey: ['conversations'] });

    } catch (error) {
      console.error("Erreur traitement vocal:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Désolé, une erreur est survenue lors du traitement de votre demande.",
        timestamp: new Date().toISOString()
      }]);
      if (ttsEnabled) {
        speak("Désolé, une erreur est survenue lors du traitement de votre demande.");
      }
    } finally {
      setIsProcessing(false);
    }
  }, [consciousnessConfig, memories, knowledgeBases, messages, conversationId, isPaused, ttsEnabled, speak, stopListening, queryClient, extractMemoryFromInteraction, currentEmotion, recentEmotionalResponses, analyzeEmotionalResponseVocal, generateConversationSummary, interactionCount]);

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
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (!isPaused && !isProcessing && !isSpeaking && !isGeneratingImage && !isGeneratingDiagram) {
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
  }, [isConnected, isPaused, isProcessing, isSpeaking, toggleMicrophone, togglePause, interruptAI, isGeneratingImage, isGeneratingDiagram]);

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
    };
  }, [isListening]);

  useEffect(() => {
    if (transcript && !isListening && !isProcessing && !isPaused) {
      handleUserSpeech(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, isProcessing, isPaused, handleUserSpeech, resetTranscript]);

  // FIXED: Scroll effect with loop prevention
  useEffect(() => {
    // Only scroll if messages actually changed in length
    if (messages.length > prevMessagesLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages.length]); // Only depend on length, not the whole messages array

  // Auto-restart listening after AI finishes speaking
  useEffect(() => {
    if (!isSpeaking && !isProcessing && isConnected && !isPaused && autoRestartListening && handsFreeModeEnabled && !isListening && !isGeneratingImage && !isGeneratingDiagram) {
      const timer = setTimeout(() => {
        startListening();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking, isProcessing, isConnected, isPaused, autoRestartListening, handsFreeModeEnabled, isListening, startListening, isGeneratingImage, isGeneratingDiagram]);

  const toggleConnection = async () => {
    if (isConnected) {
      // Disconnect
      stopListening();
      stop();
      setIsConnected(false);
      setIsPaused(false);
      setSessionDuration(0);
      setSessionStartTime(null);
      setInteractionCount(0);
      setConversationSummaries([]);
      prevMessagesLengthRef.current = 0; // Reset scroll tracking
      setMessages([]);
      setConversationId(null);
      setCurrentEmotion(null);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } else {
      // Connect - Generate personalized welcome
      setIsConnected(true);
      setIsPaused(false);
      setSessionStartTime(Date.now());
      setSessionDuration(0);
      setInteractionCount(0);

      const welcomeText = await generateWelcomeMessage();

      const welcomeMessage = {
        role: "assistant",
        content: welcomeText,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);

      if (ttsEnabled) {
        speak(welcomeText);
      }

      // Start listening after welcome message
      if (handsFreeModeEnabled) {
        setTimeout(() => {
          startListening();
        }, 3000); // Give time for welcome message TTS and initial processing
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

                      <div className="pt-4 border-t border-slate-200">
                        <h4 className="text-sm font-semibold text-slate-900 mb-3">Capacités disponibles</h4>
                        <div className="space-y-2 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span>Dialogue naturel approfondi</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-indigo-600" />
                            <span>Raisonnement complexe et analyse</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span>Génération de code et solutions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-pink-600" />
                            <span>Analyse et génération d'images</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-teal-600" />
                            <span>Génération de diagrammes</span>
                          </div>
                        </div>
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
                <p className="text-purple-200">Dialogue naturel approfondi</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Brain className="w-6 h-6 text-indigo-300 mx-auto mb-2" />
                <p className="text-indigo-200">Raisonnement complexe</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Sparkles className="w-6 h-6 text-blue-300 mx-auto mb-2" />
                <p className="text-blue-200">Génération & création</p>
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
                      <div className={`max-w-[80%] ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 backdrop-blur-xl text-white border border-white/20'
                      } rounded-2xl overflow-hidden`}>
                        {/* Display uploaded images */}
                        {message.image_urls && message.image_urls.length > 0 && (
                          <div className={`${message.image_urls.length > 1 ? 'grid grid-cols-2 gap-2 p-2' : 'p-2'}`}>
                            {message.image_urls.map((url, idx) => (
                              <img key={idx} src={url} alt={`Image ${idx + 1}`} className="w-full rounded-lg" />
                            ))}
                          </div>
                        )}

                        {/* Display generated image */}
                        {message.generated_image && (
                          <div className="p-2">
                            <img src={message.generated_image} alt="Generated" className="w-full rounded-lg" />
                          </div>
                        )}

                        {/* Display diagram */}
                        {message.diagram_url && (
                          <div className="p-2 bg-white">
                            <img src={message.diagram_url} alt="Diagram" className="w-full" />
                          </div>
                        )}

                        <div className="p-4">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
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

                {!isListening && !isProcessing && !isSpeaking && !isPaused && !isGeneratingImage && !isGeneratingDiagram && (
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

                {(isGeneratingImage || isGeneratingDiagram) && (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                  >
                    <Loader2 className="w-5 h-5 text-blue-300 animate-spin" />
                    <span className="text-blue-200">Génération en cours...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                onClick={toggleMicrophone}
                size="lg"
                disabled={isProcessing || isSpeaking || isPaused || isGeneratingImage || isGeneratingDiagram}
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

              {/* NEW: Image Upload Dialog */}
              <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    disabled={isProcessing || isSpeaking || isGeneratingImage || isGeneratingDiagram}
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
                      disabled={isProcessing || isGeneratingImage || isGeneratingDiagram}
                    />
                    <p className="text-xs text-slate-500">
                      Vous pouvez uploader plusieurs images pour une analyse comparative
                    </p>
                  </div>
                </DialogContent>
              </Dialog>

              {/* NEW: Image Generation Dialog */}
              <Dialog open={showImageGeneration} onOpenChange={setShowImageGeneration}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    disabled={isProcessing || isSpeaking || isGeneratingImage || isGeneratingDiagram}
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
                      disabled={isGeneratingImage || isGeneratingDiagram}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && imageGenerationPrompt.trim() && !isGeneratingImage) {
                          handleImageGeneration();
                        }
                      }}
                    />
                    <Button
                      onClick={handleImageGeneration}
                      disabled={isGeneratingImage || !imageGenerationPrompt.trim() || isGeneratingDiagram}
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

              {/* NEW: Diagram Generation Dialog */}
              <Dialog open={showDiagramGeneration} onOpenChange={setShowDiagramGeneration}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    disabled={isProcessing || isSpeaking || isGeneratingImage || isGeneratingDiagram}
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
                        <SelectValue placeholder="Sélectionnez un type de diagramme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flowchart">Flowchart</SelectItem>
                        <SelectItem value="mindmap">Mind Map</SelectItem>
                        <SelectItem value="sequence">Sequence Diagram</SelectItem>
                        <SelectItem value="class">Class Diagram</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Décrivez le diagramme..."
                      value={diagramPrompt}
                      onChange={(e) => setDiagramPrompt(e.target.value)}
                      disabled={isGeneratingDiagram || isGeneratingImage}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && diagramPrompt.trim() && !isGeneratingDiagram) {
                          handleDiagramGeneration();
                        }
                      }}
                    />
                    <Button
                      onClick={handleDiagramGeneration}
                      disabled={isGeneratingDiagram || !diagramPrompt.trim() || isGeneratingImage}
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
                disabled={isGeneratingImage || isGeneratingDiagram}
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
                disabled={isGeneratingImage || isGeneratingDiagram}
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
              {isConnected && !isPaused && !(isGeneratingImage || isGeneratingDiagram) && (
                <p className="text-xs opacity-70">
                  Capacités complètes : Dialogue • Code • Analyse • Création • Images • Diagrammes | Espace : Micro • Échap : Pause • Ctrl+I : Interrompre
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
