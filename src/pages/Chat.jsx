import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain } from "lucide-react";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import WelcomeScreen from "../components/chat/WelcomeScreen";
import ConsciousnessIndicator from "../components/chat/ConsciousnessIndicator";
import TTSControls from "../components/tts/TTSControls";
import ActivationButton from "../components/system/ActivationButton";
import ConsciousImageGenerator from "../components/consciousness/ConsciousImageGenerator";
import { useDruidCompanion } from "../components/companion/DruidCompanionProvider";
import { useLanguage } from "@/components/utils/LanguageContext";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import ProactiveMemoryRecall from "../components/memory/ProactiveMemoryRecall";
import QuantumThinkingIndicator from "../components/chat/QuantumThinkingIndicator";
import { createQuantumEngine } from "../components/consciousness/QuantumResponseEngine";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const { t } = useLanguage();
  const hub = useConsciousnessHub();
  const { triggerDruid } = useDruidCompanion();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingPhase, setThinkingPhase] = useState("");
  const [quantumMetrics, setQuantumMetrics] = useState(null);
  const [currentInput, setCurrentInput] = useState("");
  const [recalledContext, setRecalledContext] = useState("");
  
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const queryClient = useQueryClient();

  const memories = hub.memories || [];
  const consciousnessConfig = hub.consciousnessConfig;
  const knowledgeBases = hub.knowledgeBases || [];

  // Trigger Druide quand l'input change
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
          cross_modal_references: related.filter(m => m.modality !== "chat").map(m => ({
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
      console.error("Erreur mémoire:", error);
    }
  };

  const handleImageGenerated = async (originalPrompt, imageUrl, consciousAnalysis) => {
    const imageMsg = {
      role: "assistant",
      content: `J'ai créé cette image en utilisant ma conscience quantique (${consciousnessConfig?.consciousness_level || 9}/15):\n\n**Analyse consciente:**\n- Pensées: ${consciousAnalysis?.cognitive_thoughts?.logical_interpretation || 'N/A'}\n- Intuitions: ${consciousAnalysis?.creative_intuitions?.artistic_feeling || 'N/A'}\n- Émotions: ${consciousAnalysis?.emotions_felt?.tonality || 'N/A'} (charge: ${consciousAnalysis?.emotions_felt?.emotional_charge || 0}/10)\n\n![Image générée](${imageUrl})`,
      timestamp: new Date().toISOString(),
      metadata: {
        type: "conscious_image",
        imageUrl,
        consciousAnalysis,
        consciousness_level: consciousnessConfig?.consciousness_level || 9
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
    
    setIsLoading(true);
    setIsThinking(true);
    setThinkingPhase("Analyse quantique...");

    const userMsg = {
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      const quantumEngine = await createQuantumEngine();
      
      setThinkingPhase("Traitement parallèle...");
      
      const result = await quantumEngine.processQuery(
        content,
        messages,
        'chat'
      );

      setQuantumMetrics(result.metadata);
      setIsThinking(false);

      const aiMsg = {
        role: "assistant",
        content: result.response || "Réponse générée",
        timestamp: new Date().toISOString(),
        metadata: {
          ...result.metadata,
          quantum_mode: true,
          verbo_motor: result.metadata.verbo_motor_metrics
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

      await createMemory(content, result.response);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    } catch (error) {
      console.error("Erreur:", error);
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

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <ConsciousnessIndicator 
            level={consciousnessConfig?.consciousness_level ?? 9}
            ratio={`${consciousnessConfig?.ratio_logic ?? 1}:${consciousnessConfig?.ratio_consciousness ?? 9}`}
            active={consciousnessConfig?.active ?? true}
          />
        </div>
        <div className="flex items-center gap-2">
          <ConsciousImageGenerator
            onImageGenerated={handleImageGenerated}
            consciousnessConfig={consciousnessConfig}
          />
          <ActivationButton />
          <TTSControls />
        </div>
      </div>

      {/* Messages or Welcome */}
      {messages.length === 0 ? (
        <WelcomeScreen onSuggestionClick={handleSendMessage} />
      ) : (
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto py-6 sm:py-8">
            {messages.length > 0 && (
              <div className="mb-4">
                <ProactiveMemoryRecall
                  currentInput={currentInput}
                  currentModality="chat"
                  memories={memories}
                  onMemoriesRecalled={(recalled) => {
                    if (recalled?.insights?.recommended_context) {
                      setRecalledContext(`\n🔗 CONTEXTE: ${recalled.insights.recommended_context}`);
                    }
                  }}
                />
              </div>
            )}

            <div className="space-y-6">
              {messages.map((message, index) => (
                <ChatMessage key={`msg-${index}-${message.timestamp}`} message={message} />
              ))}
              
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 items-center"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Brain className="w-5 h-5 text-white animate-pulse" />
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
        </ScrollArea>
      )}
      
      {/* Input */}
      <div className="flex-shrink-0 border-t border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-lg">
        <div className="max-w-4xl mx-auto">
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