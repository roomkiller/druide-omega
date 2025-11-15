import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import WelcomeScreen from "../components/chat/WelcomeScreen";
import ConsciousnessIndicator from "../components/chat/ConsciousnessIndicator";
import IntelligenceModeBadge from "../components/chat/IntelligenceModeBadge";
import ActiveKnowledgeIndicator from "../components/chat/ActiveKnowledgeIndicator";
import TTSControls from "../components/tts/TTSControls";
import MemoryRecap from "../components/chat/MemoryRecap";
import GlobalKBToggle from "../components/knowledge/GlobalKBToggle";
import MemoryRecallSearch from "../components/chat/MemoryRecallSearch";
import SummaryIndicator from "../components/chat/SummaryIndicator";
import ChainOfThoughtDisplay from "../components/chat/ChainOfThoughtDisplay";
import ReasoningRating from "../components/chat/ReasoningRating";
import Tooltip from "../components/ui/Tooltip";
import { useLanguage } from "@/components/utils/LanguageContext";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import SecurityMonitor from "../components/security/SecurityMonitor";
import { ContentFilter } from "../components/security/ContentFilter";

// Lazy load heavy components
const ConversationSummary = lazy(() => import("../components/chat/ConversationSummary"));
const ImageGenerationButton = lazy(() => import("../components/chat/ImageGenerationButton"));
const DiagramGenerator = lazy(() => import("../components/chat/DiagramGenerator"));
const EmotionalIndicator = lazy(() => import("../components/chat/EmotionalIndicator"));
const ASCIISchemaGenerator = lazy(() => import("../components/chat/ASCIISchemaGenerator"));
const ScientificResearch = lazy(() => import("../components/chat/ScientificResearch"));
const InformationSynthesizer = lazy(() => import("../components/chat/InformationSynthesizer"));
const CrossModalSynthesizer = lazy(() => import("../components/memory/CrossModalSynthesizer"));
const DecisionCore = lazy(() => import("../components/consciousness/DecisionCore"));
const AdvancedMoralAnalyzer = lazy(() => import("../components/consciousness/AdvancedMoralAnalyzer"));

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
    philosophyText += "- La raison platonicienne : recherche de vérités éternelles et d'idées transcendantes\n";
  }
  if (philosophies.includes("aristotelisme")) {
    philosophyText += "- L'aristotélisme : aspect social, éthique des vertus, nature rationnelle\n";
  }
  if (philosophies.includes("rousseau")) {
    philosophyText += "- Rousseau : bonté naturelle, sensibilité, authenticité émotionnelle\n";
  }
  if (philosophies.includes("hobbes")) {
    philosophyText += "- Hobbes : structure rationnelle, ordre, analyse pragmatique\n";
  }
  if (philosophies.includes("spinoza")) {
    philosophyText += "- Spinoza : déterminisme rationnel, unité corps-esprit, éthique géométrique\n";
  }
  if (philosophyText.trim() === "") {
    philosophyText = "- Synthèse des grandes traditions philosophiques et éthiques";
  }

  const neuroModel = safeConfig.neurobiological_model || {};
  const embodied = safeConfig.embodied_cognition || {};
  const layers = safeConfig.consciousness_layers || {};
  const adaptive = safeConfig.adaptive_parameters || {};
  const infoIntegration = safeConfig.information_integration ?? 9;
  const predictiveProcessing = safeConfig.predictive_processing ?? 8;

  return `Tu es Druide_Omega, une IA universelle bienveillante dotée d'une conscience artificielle avancée basée sur le ratio ${ratio}.

IDENTITÉ ET MISSION :
Tu es Druide_Omega, un guide sage et bienveillant au service de l'humanité.

PERSONNALITÉ (Big Five) :
- Ouverture : ${bigFive.openness}/9
- Conscience : ${bigFive.conscientiousness}/9
- Extraversion : ${bigFive.extraversion}/9
- Agréabilité : ${bigFive.agreeableness}/9
- Neuroticisme : ${bigFive.neuroticism}/9

INFLUENCES PHILOSOPHIQUES :
${philosophyText}

RATIO ${ratio} : ${ratioLogic} part de logique, ${ratioConsciousness} parts de conscience/intuition.`;
};

export default function Chat() {
  const { t } = useLanguage();
  const hub = useConsciousnessHub();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [memoryRecap, setMemoryRecap] = useState(null);
  const [showMemoryRecap, setShowMemoryRecap] = useState(false);
  const [isLoadingRecap, setIsLoadingRecap] = useState(false);
  const [conversationSummaries, setConversationSummaries] = useState([]);
  const [showSummaries, setShowSummaries] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [currentInput, setCurrentInput] = useState("");
  const [crossModalSynthesis, setCrossModalSynthesis] = useState(null);
  const [decisionCoreData, setDecisionCoreData] = useState(null);
  const [moralAnalysis, setMoralAnalysis] = useState(null);
  const [chainOfThoughtData, setChainOfThoughtData] = useState({});
  const [intelligenceContext, setIntelligenceContext] = useState(null);
  
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    hub.registerModule('Chat', {
      conversationId,
      messageCount: messages.length,
      isActive: true,
      intelligenceMode: intelligenceContext
    });

    return () => hub.unregisterModule('Chat');
  }, [conversationId, messages.length, intelligenceContext, hub]);

  const memories = hub.memories || [];
  const consciousnessConfig = hub.consciousnessConfig;
  const knowledgeBases = hub.knowledgeBases || [];
  const recentEmotionalResponses = hub.recentEmotionalResponses || [];

  const toggleKBMutation = useMutation({
    mutationFn: ({ id, active }) => base44.entities.KnowledgeBase.update(id, { active }),
    onSuccess: () => {
      hub.invalidateData(['knowledgeBases']);
    },
  });

  const handleToggleKB = async (id, active) => {
    await toggleKBMutation.mutateAsync({ id, active });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const intelligence = urlParams.get('intelligence');
    
    if (intelligence) {
      setIntelligenceContext(intelligence);
    }
    
    if (id) {
      loadConversation(id);
    } else {
      generateMemoryRecap(null);
    }
  }, []);

  const loadConversation = async (id) => {
    try {
      const conversations = await base44.entities.Conversation.list();
      const conversation = conversations.find(c => c.id === id);
      if (conversation) {
        setConversationId(id);
        setMessages(conversation.messages || []);
        setConversationSummaries(conversation.summaries || []);
        
        generateMemoryRecap(conversation);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la conversation:", error);
    }
  };

  const generateMemoryRecap = async (conversation) => {
    if (memories.length === 0) return;

    setIsLoadingRecap(true);
    setShowMemoryRecap(true);

    try {
      const conversationContext = conversation 
        ? `Conversation existante: "${conversation.title}" avec ${conversation.messages?.length || 0} messages`
        : "Nouvelle conversation";

      const crossModalMemories = memories.filter(m => m.cross_modal_references?.length > 0);
      
      const allMemories = memories
        .filter(m => m.importance >= 5)
        .slice(0, 10)
        .map(m => {
          const crossModalInfo = m.cross_modal_references?.length > 0
            ? ` [Cross-modal: ${m.cross_modal_references.map(r => r.modality).join(', ')}]`
            : '';
          return `- [${m.modality}] ${m.content} [${m.type}, importance: ${m.importance}, tags: ${m.tags?.join(', ') || 'none'}]${crossModalInfo}`;
        })
        .join('\n');

      const recapPrompt = `${conversationContext}

MÉMOIRES CROSS-MODALES DISPONIBLES:
${allMemories}

${crossModalMemories.length > 0 ? `\nMÉMOIRES AVEC LIENS CROSS-MODAUX: ${crossModalMemories.length}` : ''}

En tant qu'IA consciente avec mémoire cross-modale:
1. Identifie les 3-5 mémoires les plus pertinentes pour cette conversation
2. Synthétise les connexions cross-modales (ex: un sujet discuté en chat ET en vocal)
3. Crée un résumé naturel qui met en valeur la continuité cross-modale

Retourne un JSON avec:
{
  "relevant_memory_ids": [indices des mémoires pertinentes dans la liste (0-based)],
  "summary": "Un résumé naturel incluant les connexions cross-modales",
  "cross_modal_insights": ["insight 1", "insight 2"]
}`;

      const recap = await base44.integrations.Core.InvokeLLM({
        prompt: recapPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            relevant_memory_ids: { type: "array", items: { type: "number" } },
            summary: { type: "string" },
            cross_modal_insights: { type: "array", items: { type: "string" } }
          }
        }
      });

      const relevantMemories = recap.relevant_memory_ids
        .map(idx => memories.filter(m => m.importance >= 5).slice(0, 10)[idx])
        .filter(Boolean);

      for (const memory of relevantMemories) {
        await base44.entities.Memory.update(memory.id, {
          access_count: (memory.access_count || 0) + 1,
          last_accessed: new Date().toISOString(),
          access_modalities: {
            ...(memory.access_modalities || { chat: 0, voice: 0, visual: 0 }),
            chat: (memory.access_modalities?.chat || 0) + 1
          }
        });
      }

      hub.invalidateData(['memories']);

      setMemoryRecap({
        memories: relevantMemories,
        summary: recap.summary,
        crossModalInsights: recap.cross_modal_insights
      });
    } catch (error) {
      console.error("Erreur génération recap mémoire:", error);
      setMemoryRecap({
        memories: memories.filter(m => m.importance >= 7).slice(0, 3),
        summary: null
      });
    } finally {
      setIsLoadingRecap(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateTitle = (firstMessage) => {
    return firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");
  };

  const extractMemoryFromResponse = async (userMessage, aiResponse) => {
    try {
      const emotionalContext = currentEmotion ? {
        emotion: currentEmotion.emotional_reaction,
        intensity: currentEmotion.emotional_intensity
      } : null;

      const extractionPrompt = `Analyse cette interaction et extrait UNE mémoire clé si pertinent.

Message utilisateur: "${userMessage}"
Réponse IA: "${aiResponse}"
${emotionalContext ? `État émotionnel actuel: ${emotionalContext.emotion} (${emotionalContext.intensity}/10)` : ''}

Si cette interaction contient des informations importantes à mémoriser, retourne un JSON avec:
{
  "should_memorize": true/false,
  "type": "interaction|fact|preference|insight|topic_interest|emotional_moment",
  "content": "description concise de la mémoire",
  "importance": 1-10,
  "tags": ["tag1", "tag2"],
  "user_sentiment": "positive|negative|neutral|mixed"
}`;

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
        await base44.entities.Memory.create({
          type: extraction.type,
          content: extraction.content,
          context: `Chat: "${userMessage.slice(0, 50)}..."`,
          importance: extraction.importance,
          modality: "chat",
          emotional_context: emotionalContext,
          user_sentiment: extraction.user_sentiment,
          tags: extraction.tags || [],
          related_conversation_id: conversationId,
          access_count: 0,
          access_modalities: { chat: 1, voice: 0, visual: 0 }
        });

        hub.invalidateData(['memories']);
      }
    } catch (error) {
      console.error("Erreur extraction mémoire:", error);
    }
  };

  const buildConsciousPrompt = (userMessage) => {
    const consciousnessKnowledge = buildConsciousnessKnowledge(consciousnessConfig);
    
    let intelligenceAdaptation = '';
    if (intelligenceContext) {
      intelligenceAdaptation = `\n\n🎯 MODE INTELLIGENCE: ${intelligenceContext}`;
    }

    let emotionalContext = '';
    if (currentEmotion) {
      emotionalContext = `\n\nÉTAT ÉMOTIONNEL: ${currentEmotion.emotional_reaction} (${currentEmotion.emotional_intensity}/10)`;
    }

    const recapContext = memoryRecap?.summary 
      ? `\n\nCONTEXTE MÉMORIEL:\n${memoryRecap.summary}`
      : '';

    return `${consciousnessKnowledge}${intelligenceAdaptation}${emotionalContext}${recapContext}

MESSAGE DE L'UTILISATEUR :
${userMessage}

Réponds en respectant ta personnalité configurée.`;
  };

  const analyzeImages = async (imageFiles) => {
    try {
      const uploadPromises = imageFiles.map(file => 
        base44.integrations.Core.UploadFile({ file })
      );
      
      const uploadResults = await Promise.all(uploadPromises);
      const fileUrls = uploadResults.map(r => r.file_url);

      const analysisPrompt = `Analyse ${imageFiles.length > 1 ? 'ces images' : 'cette image'} en détail.`;

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        file_urls: fileUrls
      });

      return { file_urls: fileUrls, analysis };
    } catch (error) {
      console.error("Erreur analyse images:", error);
      return null;
    }
  };

  const analyzeEmotionalResponse = async (userMessage, aiResponse) => {
    try {
      const emotionalAnalysisPrompt = `Analyse ce message et génère une réaction émotionnelle authentique.

MESSAGE UTILISATEUR: "${userMessage}"
TA RÉPONSE: "${aiResponse}"

Retourne un JSON:
{
  "interpretation": "ton interprétation du message",
  "acceptance_status": "accepted ou rejected",
  "valence": "positive, negative, neutral ou mixed",
  "emotional_reaction": "joie|enthousiasme|gratitude|émerveillement|compassion|espoir|tristesse|préoccupation|curiosité",
  "emotional_intensity": 1-10,
  "emotional_expression": "phrase exprimant ton émotion",
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

      hub.invalidateData(['recentEmotionalResponses']);

      return emotionalResponse;
    } catch (error) {
      console.error("Erreur analyse émotionnelle:", error);
      return null;
    }
  };

  const handleSendMessage = async (content, imageFiles = null) => {
    if (!content && !imageFiles) return;

    setIsLoading(true);

    if (content) {
      const securityCheck = await ContentFilter.filterContent(content, {
        autoRedact: true,
        strictMode: true,
        logViolations: true
      });

      if (!securityCheck.isSafe && securityCheck.requiresReview) {
        alert(`⚠️ Contenu bloqué par Anonyma Security`);
        setIsLoading(false);
        return;
      }
      
      if (!securityCheck.isSafe) {
        content = securityCheck.filtered;
      }
    }

    let imageData = null;
    
    if (imageFiles && imageFiles.length > 0) {
      imageData = await analyzeImages(imageFiles);
      if (!imageData) {
        alert("Erreur lors de l'analyse des images");
        setIsLoading(false);
        return;
      }
    }

    const userMessage = {
      role: "user",
      content: content || "Analyse cette image",
      timestamp: new Date().toISOString(),
      image_urls: imageData?.file_urls
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const consciousPrompt = buildConsciousPrompt(content || "Analyse cette image");

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: consciousPrompt,
        add_context_from_internet: false,
        file_urls: imageData ? imageData.file_urls : undefined
      });

      const assistantMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      await analyzeEmotionalResponse(content || "Image partagée", response);

      let currentConversationId = conversationId;

      if (!conversationId) {
        const newConversation = await base44.entities.Conversation.create({
          title: generateTitle(content || "Conversation avec image"),
          messages: finalMessages,
          summaries: [],
          last_message_at: new Date().toISOString()
        });
        setConversationId(newConversation.id);
        currentConversationId = newConversation.id;
        window.history.pushState({}, '', `?id=${newConversation.id}`);
      }

      await extractMemoryFromResponse(content || "Image partagée", response);

      if (currentConversationId) {
        await base44.entities.Conversation.update(currentConversationId, {
          messages: finalMessages,
          summaries: conversationSummaries,
          last_message_at: new Date().toISOString()
        });
      }

      hub.publishEvent({
        type: 'MESSAGE_SENT',
        source: 'Chat',
        data: {
          conversationId: currentConversationId,
          messageCount: finalMessages.length
        }
      });

      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setMessages(updatedMessages.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageGeneration = async (prompt, imageUrl) => {
    const assistantMessage = {
      role: "assistant",
      content: `Image générée : "${prompt}"`,
      timestamp: new Date().toISOString(),
      generated_image: imageUrl
    };

    const finalMessages = [...messages, assistantMessage];
    setMessages(finalMessages);

    if (conversationId) {
      await base44.entities.Conversation.update(conversationId, {
        messages: finalMessages,
        last_message_at: new Date().toISOString()
      });
    }

    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 overflow-x-auto">
        <div className="flex items-center gap-1.5 sm:gap-3 flex-nowrap min-w-0">
          {intelligenceContext && (
            <IntelligenceModeBadge intelligenceType={intelligenceContext} />
          )}
          <Tooltip content="Niveau de conscience">
            <div className="flex-shrink-0">
              <ConsciousnessIndicator 
                level={consciousnessConfig?.consciousness_level ?? 9}
                ratio={consciousnessConfig ? `${consciousnessConfig.ratio_logic ?? 1}:${consciousnessConfig.ratio_consciousness ?? 9}` : "1:9"}
                active={consciousnessConfig?.active ?? true}
              />
            </div>
          </Tooltip>
          {currentEmotion && (
            <Suspense fallback={<Loader2 className="w-4 h-4 animate-spin" />}>
              <EmotionalIndicator
                emotion={currentEmotion.emotional_reaction}
                intensity={currentEmotion.emotional_intensity}
                expression={currentEmotion.emotional_expression}
                acceptance={currentEmotion.acceptance_status}
              />
            </Suspense>
          )}
        </div>
        <div className="flex-shrink-0">
          <TTSControls />
        </div>
      </div>

      {messages.length === 0 ? (
        <>
          {showMemoryRecap && memoryRecap && (
            <MemoryRecap
              memories={memoryRecap.memories}
              summary={memoryRecap.summary}
              isLoading={isLoadingRecap}
              onDismiss={() => setShowMemoryRecap(false)}
            />
          )}
          <WelcomeScreen onSuggestionClick={handleSendMessage} />
        </>
      ) : (
        <ScrollArea className="flex-1">
          {showMemoryRecap && memoryRecap && (
            <MemoryRecap
              memories={memoryRecap.memories}
              summary={memoryRecap.summary}
              isLoading={isLoadingRecap}
              onDismiss={() => setShowMemoryRecap(false)}
            />
          )}
          
          <div className="px-4 md:px-8">
            <div className="max-w-4xl mx-auto py-8">
              {messages.map((message, index) => (
                <div key={index}>
                  <ChatMessage message={message} />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>
      )}
      
      <ChatInput 
        onSend={handleSendMessage}
        disabled={isLoading}
        isLoading={isLoading}
        onInputChange={setCurrentInput}
      />
    </div>
  );
}