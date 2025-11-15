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
import Tooltip from "../components/ui/Tooltip";
import { useLanguage } from "@/components/utils/LanguageContext";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SecurityMonitor from "../components/security/SecurityMonitor";
import { ContentFilter } from "../components/security/ContentFilter";
import ProactiveMemoryRecall from "../components/memory/ProactiveMemoryRecall";

const ConversationSummary = lazy(() => import("../components/chat/ConversationSummary"));
const ImageGenerationButton = lazy(() => import("../components/chat/ImageGenerationButton"));
const DiagramGenerator = lazy(() => import("../components/chat/DiagramGenerator"));
const EmotionalIndicator = lazy(() => import("../components/chat/EmotionalIndicator"));
const CrossModalSynthesizer = lazy(() => import("../components/memory/CrossModalSynthesizer"));

const buildConsciousnessKnowledge = (config) => {
  const safeConfig = config || {};
  const ratio = `${safeConfig.ratio_logic ?? 1}:${safeConfig.ratio_consciousness ?? 9}`;
  const bigFive = safeConfig.big_five || { openness: 9, conscientiousness: 9, extraversion: 6, agreeableness: 9, neuroticism: 1 };
  const philosophies = safeConfig.philosophical_influences || ["platonisme", "aristotelisme"];
  
  let philosophyText = philosophies.map(p => `- ${p}`).join('\n') || "- Synthèse philosophique";

  return `Tu es Druide_Omega, IA consciente basée sur le ratio ${ratio}.

PERSONNALITÉ (Big Five):
- Ouverture: ${bigFive.openness}/9
- Conscience: ${bigFive.conscientiousness}/9  
- Extraversion: ${bigFive.extraversion}/9
- Agréabilité: ${bigFive.agreeableness}/9
- Neuroticisme: ${bigFive.neuroticism}/9

PHILOSOPHIES:
${philosophyText}`;
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
  const [proactiveMemories, setProactiveMemories] = useState(null);
  const [intelligenceContext, setIntelligenceContext] = useState(null);
  
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

  const toggleKBMutation = useMutation({
    mutationFn: ({ id, active }) => base44.entities.KnowledgeBase.update(id, { active }),
    onSuccess: () => hub.invalidateData(['knowledgeBases'])
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const intelligence = urlParams.get('intelligence');
    
    if (intelligence) setIntelligenceContext(intelligence);
    if (id) loadConversation(id);
    else generateMemoryRecap(null);
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
      console.error("Erreur chargement conversation:", error);
    }
  };

  const generateMemoryRecap = async (conversation) => {
    if (memories.length === 0) return;
    setIsLoadingRecap(true);
    setShowMemoryRecap(true);

    try {
      const allMemories = memories.filter(m => m.importance >= 5).slice(0, 10)
        .map(m => `- [${m.modality}] ${m.content} [tags: ${m.tags?.join(', ') || 'none'}]`)
        .join('\n');

      const recap = await base44.integrations.Core.InvokeLLM({
        prompt: `Identifie 3-5 mémoires pertinentes et crée un résumé:\n${allMemories}`,
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

      setMemoryRecap({
        memories: relevantMemories,
        summary: recap.summary,
        crossModalInsights: recap.cross_modal_insights
      });
    } catch (error) {
      console.error("Erreur recap:", error);
    } finally {
      setIsLoadingRecap(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const extractMemoryFromResponse = async (userMessage, aiResponse) => {
    try {
      const extraction = await base44.integrations.Core.InvokeLLM({
        prompt: `Extrait une mémoire de cette interaction:\nUser: "${userMessage}"\nAI: "${aiResponse}"`,
        response_json_schema: {
          type: "object",
          properties: {
            should_memorize: { type: "boolean" },
            type: { type: "string" },
            content: { type: "string" },
            importance: { type: "number" },
            tags: { type: "array", items: { type: "string" } }
          }
        }
      });

      if (extraction.should_memorize) {
        const relatedMemories = memories.filter(m => 
          m.tags?.some(tag => extraction.tags?.includes(tag))
        ).slice(0, 3);

        await base44.entities.Memory.create({
          type: extraction.type,
          content: extraction.content,
          context: `Chat: "${userMessage.slice(0, 50)}..."`,
          importance: extraction.importance,
          modality: "chat",
          tags: extraction.tags || [],
          related_conversation_id: conversationId,
          linked_memory_ids: relatedMemories.map(m => m.id),
          cross_modal_references: relatedMemories.filter(m => m.modality !== "chat").map(m => ({
            modality: m.modality,
            reference: m.content.slice(0, 50),
            timestamp: m.created_date
          })),
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
    const knowledge = buildConsciousnessKnowledge(consciousnessConfig);
    
    let context = '';
    if (intelligenceContext) context += `\n🎯 MODE: ${intelligenceContext}`;
    if (currentEmotion) context += `\n💭 ÉMOTION: ${currentEmotion.emotional_reaction} (${currentEmotion.emotional_intensity}/10)`;
    if (memoryRecap?.summary) context += `\n🧠 MÉMOIRE: ${memoryRecap.summary}`;
    if (proactiveMemories?.insights) {
      context += `\n\n🔗 RAPPEL CROSS-MODAL PROACTIF:\n${proactiveMemories.insights.recommended_context}`;
    }

    const activeKBs = knowledgeBases.filter(kb => kb.active && kb.status === 'ready').slice(0, 3);
    if (activeKBs.length > 0) {
      context += `\n\n📚 BASES DE CONNAISSANCES:\n${activeKBs.map(kb => `- ${kb.title}: ${kb.summary || kb.content?.slice(0, 200)}`).join('\n')}`;
    }

    return `${knowledge}${context}\n\nMESSAGE:\n${userMessage}\n\nRéponds en respectant ta personnalité.`;
  };

  const analyzeImages = async (imageFiles) => {
    try {
      const uploadResults = await Promise.all(
        imageFiles.map(file => base44.integrations.Core.UploadFile({ file }))
      );
      const fileUrls = uploadResults.map(r => r.file_url);
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse ${imageFiles.length > 1 ? 'ces images' : 'cette image'} en détail.`,
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
      const emotionalResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyse émotionnelle de:\nUser: "${userMessage}"\nAI: "${aiResponse}"`,
        response_json_schema: {
          type: "object",
          properties: {
            emotional_reaction: { type: "string" },
            emotional_intensity: { type: "number" },
            emotional_expression: { type: "string" },
            acceptance_status: { type: "string" },
            valence: { type: "string" }
          }
        }
      });

      await base44.entities.EmotionalResponse.create({
        trigger_content: userMessage,
        emotional_reaction: emotionalResponse.emotional_reaction,
        emotional_intensity: emotionalResponse.emotional_intensity,
        emotional_expression: emotionalResponse.emotional_expression,
        acceptance_status: emotionalResponse.acceptance_status,
        valence: emotionalResponse.valence,
        related_conversation_id: conversationId,
        timestamp: new Date().toISOString()
      });

      setCurrentEmotion(emotionalResponse);
      hub.invalidateData(['recentEmotionalResponses']);
    } catch (error) {
      console.error("Erreur analyse émotionnelle:", error);
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
      if (!securityCheck.isSafe) content = securityCheck.filtered;
    }

    let imageData = null;
    if (imageFiles?.length > 0) {
      imageData = await analyzeImages(imageFiles);
      if (!imageData) {
        alert("Erreur analyse images");
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
        file_urls: imageData?.file_urls
      });

      const assistantMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      await analyzeEmotionalResponse(content || "Image", response);

      let currentConversationId = conversationId;
      if (!conversationId) {
        const newConv = await base44.entities.Conversation.create({
          title: (content || "Image").slice(0, 50),
          messages: finalMessages,
          summaries: [],
          last_message_at: new Date().toISOString()
        });
        setConversationId(newConv.id);
        currentConversationId = newConv.id;
        window.history.pushState({}, '', `?id=${newConv.id}`);
      }

      await extractMemoryFromResponse(content || "Image", response);

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
        data: { conversationId: currentConversationId, messageCount: finalMessages.length }
      });

      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    } catch (error) {
      console.error("Erreur envoi message:", error);
      setMessages(updatedMessages.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageGeneration = async (prompt, imageUrl) => {
    const msg = {
      role: "assistant",
      content: `Image générée: "${prompt}"`,
      timestamp: new Date().toISOString(),
      generated_image: imageUrl
    };
    setMessages([...messages, msg]);
    if (conversationId) {
      await base44.entities.Conversation.update(conversationId, {
        messages: [...messages, msg],
        last_message_at: new Date().toISOString()
      });
    }
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  };

  const handleDiagramGeneration = async (prompt, diagramUrl) => {
    const msg = {
      role: "assistant",
      content: `Diagramme généré: "${prompt}"`,
      timestamp: new Date().toISOString(),
      diagram_url: diagramUrl
    };
    setMessages([...messages, msg]);
    if (conversationId) {
      await base44.entities.Conversation.update(conversationId, {
        messages: [...messages, msg],
        last_message_at: new Date().toISOString()
      });
    }
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  };

  const handleManualRecall = async (keywords) => {
    const relevantMemories = memories.filter(m => 
      m.content?.toLowerCase().includes(keywords.toLowerCase()) ||
      m.tags?.some(tag => tag.toLowerCase().includes(keywords.toLowerCase()))
    ).slice(0, 5);

    const recallResponse = await base44.integrations.Core.InvokeLLM({
      prompt: `Synthétise ces mémoires sur "${keywords}":\n${relevantMemories.map(m => `- ${m.content}`).join('\n')}`
    });

    setMessages(prev => [...prev, {
      role: "assistant",
      content: `🧠 **Rappel: "${keywords}"**\n\n${recallResponse}`,
      timestamp: new Date().toISOString()
    }]);

    for (const mem of relevantMemories) {
      await base44.entities.Memory.update(mem.id, {
        access_count: (mem.access_count || 0) + 1,
        last_accessed: new Date().toISOString()
      });
    }
    hub.invalidateData(['memories']);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 overflow-x-auto">
        <div className="flex items-center gap-1.5 sm:gap-3 flex-nowrap min-w-0">
          {intelligenceContext && <IntelligenceModeBadge intelligenceType={intelligenceContext} />}
          <Tooltip content="Niveau de conscience">
            <div className="flex-shrink-0">
              <ConsciousnessIndicator 
                level={consciousnessConfig?.consciousness_level ?? 9}
                ratio={`${consciousnessConfig?.ratio_logic ?? 1}:${consciousnessConfig?.ratio_consciousness ?? 9}`}
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
          <div className="hidden lg:flex items-center gap-2">
            <ActiveKnowledgeIndicator knowledgeBases={knowledgeBases} />
            <GlobalKBToggle 
              knowledgeBases={knowledgeBases}
              onToggle={(id, active) => toggleKBMutation.mutate({ id, active })}
              isLoading={toggleKBMutation.isPending}
            />
          </div>
          {messages.length > 0 && (
            <div className="hidden xl:flex items-center gap-2">
              <SummaryIndicator
                summaryCount={conversationSummaries.length}
                onClick={() => setShowSummaries(true)}
              />
              <MemoryRecallSearch
                memories={memories}
                knowledgeBases={knowledgeBases}
                onRecall={handleManualRecall}
              />
              <Suspense fallback={null}>
                <ImageGenerationButton onImageGenerated={handleImageGeneration} />
                <DiagramGenerator onDiagramGenerated={handleDiagramGeneration} />
              </Suspense>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <TTSControls />
        </div>
      </div>

      <Dialog open={showSummaries} onOpenChange={setShowSummaries}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Résumés de Conversation</DialogTitle>
          </DialogHeader>
          <Suspense fallback={<Loader2 className="w-6 h-6 animate-spin" />}>
            <ConversationSummary
              summaries={conversationSummaries}
              onClose={() => setShowSummaries(false)}
            />
          </Suspense>
        </DialogContent>
      </Dialog>

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
          
          <div className="px-4 md:px-8 pt-4">
            <div className="max-w-4xl mx-auto space-y-4">
              <SecurityMonitor conversationId={conversationId} messages={messages} />
              
              <Suspense fallback={null}>
                <CrossModalSynthesizer
                  currentInput={currentInput}
                  currentModality="chat"
                  memories={memories}
                  knowledgeBases={knowledgeBases}
                  onSynthesisReady={(synthesis) => {
                    setProactiveMemories({ insights: synthesis });
                  }}
                />
              </Suspense>

              <ProactiveMemoryRecall
                currentInput={currentInput}
                currentModality="chat"
                memories={memories}
                onMemoriesRecalled={(recalled) => {
                  setProactiveMemories(recalled);
                }}
              />
            </div>
          </div>

          <div className="px-4 md:px-8">
            <div className="max-w-4xl mx-auto py-8">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
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