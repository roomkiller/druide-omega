import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Brain } from "lucide-react";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import WelcomeScreen from "../components/chat/WelcomeScreen";
import ConsciousnessIndicator from "../components/chat/ConsciousnessIndicator";
import TTSControls from "../components/tts/TTSControls";
import ActivationButton from "../components/system/ActivationButton";
import ConsciousImageGenerator from "../components/consciousness/ConsciousImageGenerator";
import MultimodalChatEnhancer from "../components/multimodal/MultimodalChatEnhancer";
import IntelligenceIndicator from "../components/intelligence/IntelligenceIndicator";
import IntelligenceSwitcher from "../components/intelligence/IntelligenceSwitcher";
import ProactiveSuggestionsPanel from "../components/proactive/ProactiveSuggestionsPanel";
import SmartAutoComplete from "../components/proactive/SmartAutoComplete";
import { useIntelligence } from "../components/intelligence/IntelligenceManager";
import { useDruidCompanion } from "../components/companion/DruidCompanionProvider";
import { useLanguage } from "@/components/utils/LanguageContext";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import QuantumThinkingIndicator from "../components/chat/QuantumThinkingIndicator";
import { createQuantumEngine } from "../components/consciousness/QuantumResponseEngine";
import { useBehaviorTracking } from "../components/analytics/BehaviorTracker";
import { IPGeolocationEngine } from "../components/location/IPGeolocationEngine";
import { motion } from "framer-motion";

export default function Chat() {
  const { t } = useLanguage();
  const hub = useConsciousnessHub();
  const { triggerDruid } = useDruidCompanion();
  const { trackAction, trackFeature } = useBehaviorTracking('chat');
  const { getContextPrompt, activeIntelligence } = useIntelligence();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingPhase, setThinkingPhase] = useState("");
  const [quantumMetrics, setQuantumMetrics] = useState(null);
  const [currentInput, setCurrentInput] = useState("");
  
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const memories = hub.memories || [];
  const consciousnessConfig = hub.consciousnessConfig;

  useEffect(() => {
    trackAction('mount');
  }, []);

  useEffect(() => {
    if (currentInput && currentInput.length > 10) {
      triggerDruid(currentInput, messages);
    }
  }, [currentInput, messages, triggerDruid]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) loadConversation(id);
  }, []);

  const loadConversation = async (id) => {
    try {
      trackAction('load_conversation', { conversation_id: id });
      const conversations = await base44.entities.Conversation.list();
      const conversation = conversations.find(c => c.id === id);
      if (conversation) {
        setConversationId(id);
        setMessages(conversation.messages || []);
      }
    } catch (error) {
      console.error("Erreur chargement:", error);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isThinking]);

  const createMemory = async (userMessage, aiResponse) => {
    try {
      const extraction = await base44.integrations.Core.InvokeLLM({
        prompt: `Extrait mémoire importante:\nUser: "${userMessage}"\nAI: "${aiResponse}"\n\nJSON: {"should_memorize": bool, "content": str, "importance": 1-10, "tags": [str]}`,
        response_json_schema: {
          type: "object",
          properties: {
            should_memorize: { type: "boolean" },
            content: { type: "string" },
            importance: { type: "number" },
            tags: { type: "array", items: { type: "string" } }
          }
        }
      });

      if (extraction.should_memorize) {
        const related = memories.filter(m => 
          m.tags?.some(tag => extraction.tags?.includes(tag))
        ).slice(0, 3);

        await base44.entities.Memory.create({
          type: "interaction",
          content: extraction.content,
          context: `Chat: ${userMessage.slice(0, 50)}`,
          importance: extraction.importance,
          modality: "chat",
          tags: extraction.tags || [],
          linked_memory_ids: related.map(m => m.id),
          access_count: 0
        });

        trackAction('create_memory', { importance: extraction.importance });
        hub.invalidateData(['memories']);
      }
    } catch (error) {
      console.error("Erreur mémoire:", error);
    }
  };

  const handleImageAnalyzed = async (analysis) => {
    trackFeature('image_analysis');
    const analysisMsg = {
      role: "assistant",
      content: `📸 **Analyse d'Image**\n\n${analysis.description}\n\n**Concepts:** ${analysis.key_concepts?.join(', ')}`,
      timestamp: new Date().toISOString(),
      metadata: { type: "image_analysis", analysis }
    };
    
    const updatedMessages = [...messages, analysisMsg];
    setMessages(updatedMessages);
    
    if (conversationId) {
      await base44.entities.Conversation.update(conversationId, {
        messages: updatedMessages,
        last_message_at: new Date().toISOString()
      });
    }
  };

  const handleVisualGenerated = async (visual) => {
    trackFeature('visual_generation', { type: visual.type });
    let content = "🎨 **Réponse Visuelle**\n\n";
    
    if (visual.type === "image") {
      content += `![${visual.description}](${visual.url})`;
    } else if (visual.type === "chart") {
      content += `📊 ${visual.data.title}`;
    } else if (visual.type === "diagram") {
      content += `\`\`\`\n${visual.content}\n\`\`\``;
    }
    
    const visualMsg = {
      role: "assistant",
      content,
      timestamp: new Date().toISOString(),
      metadata: { type: "visual_generation", visual }
    };
    
    const updatedMessages = [...messages, visualMsg];
    setMessages(updatedMessages);
    
    if (conversationId) {
      await base44.entities.Conversation.update(conversationId, {
        messages: updatedMessages,
        last_message_at: new Date().toISOString()
      });
    }
  };

  const handleImageGenerated = async (originalPrompt, imageUrl, consciousAnalysis) => {
    trackFeature('conscious_image_generation');
    const imageMsg = {
      role: "assistant",
      content: `J'ai créé cette image:\n\n![Image générée](${imageUrl})`,
      timestamp: new Date().toISOString(),
      metadata: {
        type: "conscious_image",
        imageUrl,
        consciousAnalysis
      }
    };

    const updatedMessages = [...messages, imageMsg];
    setMessages(updatedMessages);

    if (conversationId) {
      await base44.entities.Conversation.update(conversationId, {
        messages: updatedMessages,
        last_message_at: new Date().toISOString()
      });
    }
  };

  const handleSendMessage = async (content) => {
    if (!content?.trim()) return;
    
    const startTime = Date.now();
    const normalizedContent = content.trim().toLowerCase();
    
    const locationQueries = ['où suis-je', 'ou suis je', 'ma position', 'ma localisation', 'où je suis', 'ou je suis'];
    const isLocationQuery = locationQueries.some(q => normalizedContent.includes(q));
    
    trackAction('send_message', { 
      message_length: content.length, 
      is_location_query: isLocationQuery,
      intelligence_mode: activeIntelligence?.type || 'none'
    });
    
    setIsLoading(true);
    setIsThinking(true);
    setThinkingPhase(isLocationQuery ? "Localisation..." : "Analyse...");

    const userMsg = {
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      let aiContent = "";
      
      if (isLocationQuery) {
        setThinkingPhase("Géolocalisation...");
        const location = await IPGeolocationEngine.analyzeUserLocation(consciousnessConfig);
        
        if (location.error) {
          aiContent = `Je ne peux pas déterminer votre position: ${location.error}`;
        } else if (location.quantum_analysis) {
          aiContent = location.quantum_analysis.formatted_response;
        } else {
          aiContent = IPGeolocationEngine.formatLocation(location);
        }
        
        trackFeature('location_detection');
      } else {
        const quantumEngine = await createQuantumEngine();
        setThinkingPhase("Traitement...");
        
        const intelligenceContext = getContextPrompt();
        const enhancedContent = intelligenceContext ? `${intelligenceContext}\n\n${content}` : content;
        
        const result = await quantumEngine.processQuery(enhancedContent, messages, 'chat');
        setQuantumMetrics(result.metadata);
        aiContent = result.response || "Réponse générée";
      }

      setIsThinking(false);

      const aiMsg = {
        role: "assistant",
        content: aiContent,
        timestamp: new Date().toISOString(),
        metadata: {
          intelligence_mode: activeIntelligence?.type
        }
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      let convId = conversationId;
      if (!convId) {
        const newConv = await base44.entities.Conversation.create({
          title: content.slice(0, 50),
          messages: finalMessages,
          summaries: [],
          last_message_at: new Date().toISOString()
        });
        setConversationId(newConv.id);
        convId = newConv.id;
        window.history.pushState({}, '', `?id=${newConv.id}`);
      } else {
        await base44.entities.Conversation.update(convId, {
          messages: finalMessages,
          last_message_at: new Date().toISOString()
        });
      }

      const duration = Date.now() - startTime;
      trackAction('message_completed', { 
        duration_ms: duration, 
        response_length: aiContent?.length,
        intelligence_mode: activeIntelligence?.type
      });

      await createMemory(content, aiContent);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    } catch (error) {
      console.error("Erreur:", error);
      trackAction('message_error', { error: error.message });
      setIsThinking(false);
      
      const errorMsg = {
        role: "assistant",
        content: `Erreur: ${error.message || 'Erreur inconnue'}`,
        timestamp: new Date().toISOString()
      };
      
      setMessages([...updatedMessages, errorMsg]);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
      setThinkingPhase("");
      setQuantumMetrics(null);
      setCurrentInput("");
    }
  };

  const handleSuggestionSelect = (text) => {
    setCurrentInput(text);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div className="flex items-center justify-between px-3 py-2 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <ConsciousnessIndicator 
            level={consciousnessConfig?.consciousness_level ?? 9}
            ratio={`${consciousnessConfig?.ratio_logic ?? 1}:${consciousnessConfig?.ratio_consciousness ?? 9}`}
            active={consciousnessConfig?.active ?? true}
          />
          <IntelligenceIndicator compact />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <IntelligenceSwitcher conversationId={conversationId} />
          <div className="hidden sm:flex items-center gap-1">
            <ConsciousImageGenerator
              onImageGenerated={handleImageGenerated}
              consciousnessConfig={consciousnessConfig}
            />
            <ActivationButton />
            <TTSControls />
          </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <WelcomeScreen onSuggestionClick={handleSendMessage} />
      ) : (
        <div className="flex-1 overflow-y-auto px-3 sm:px-6">
          <div className="max-w-4xl mx-auto py-4 sm:py-6">
            <ProactiveSuggestionsPanel
              context={{
                currentPage: 'Chat',
                lastAction: messages[messages.length - 1]?.content,
                conversationId
              }}
              onSuggestionClick={(pred) => {
                if (pred.action_type === 'suggest') {
                  setCurrentInput(pred.title);
                }
              }}
            />

            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={`msg-${index}-${message.timestamp}`} message={message} />
              ))}
              
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 items-center"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <Brain className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <QuantumThinkingIndicator 
                    phase={thinkingPhase} 
                    metrics={quantumMetrics}
                  />
                </motion.div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-shrink-0 border-t border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          {currentInput && messages.length > 0 && (
            <div className="px-3 pt-2 hidden sm:block">
              <SmartAutoComplete
                currentInput={currentInput}
                recentMessages={messages}
                onSelect={handleSuggestionSelect}
              />
            </div>
          )}
          
          <div className="px-3 hidden sm:block">
            <MultimodalChatEnhancer
              context={{ messages, conversationId }}
              onImageAnalyzed={handleImageAnalyzed}
              onVisualGenerated={handleVisualGenerated}
            />
          </div>

          <ChatInput 
            onSend={handleSendMessage}
            disabled={isLoading}
            isLoading={isLoading}
            onInputChange={setCurrentInput}
            value={currentInput}
          />
        </div>
      </div>
    </div>
  );
}