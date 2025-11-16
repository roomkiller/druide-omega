import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain } from "lucide-react";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import ConsciousnessIndicator from "../components/chat/ConsciousnessIndicator";
import TTSControls from "../components/tts/TTSControls";
import ActivationButton from "../components/system/ActivationButton";
import { useLanguage } from "@/components/utils/LanguageContext";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import ProactiveMemoryRecall from "../components/memory/ProactiveMemoryRecall";
import { createThinkingEngine } from "../components/consciousness/ThinkingEngine";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const { t } = useLanguage();
  const hub = useConsciousnessHub();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingPhase, setThinkingPhase] = useState("");
  const [currentInput, setCurrentInput] = useState("");
  const [recalledContext, setRecalledContext] = useState("");
  
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const queryClient = useQueryClient();

  const memories = hub.memories || [];
  const consciousnessConfig = hub.consciousnessConfig;
  const knowledgeBases = hub.knowledgeBases || [];

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
      console.error("Erreur:", error);
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
        prompt: `Extrait une mémoire importante:\nUser: "${userMessage}"\nAI: "${aiResponse}"\n\nJSON: {"should_memorize": bool, "content": str, "importance": 1-10, "tags": [str]}`,
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

  const handleSendMessage = async (content) => {
    if (!content?.trim()) return;
    
    setIsLoading(true);
    setIsThinking(true);

    const userMsg = {
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      setThinkingPhase(t('chat.analyzing'));
      const thinkingEngine = await createThinkingEngine();
      
      setThinkingPhase(t('chat.searchingKnowledge'));
      const thinkingAnalysis = await thinkingEngine.analyzeQuery(
        content,
        messages,
        'chat'
      );

      setThinkingPhase(t('chat.verification'));
      await new Promise(resolve => setTimeout(resolve, 150));

      const needsWeb = thinkingAnalysis.strategy?.use_web;
      if (needsWeb) {
        setThinkingPhase(t('chat.webSearch'));
      } else {
        setThinkingPhase(t('chat.knowledgeSufficient'));
      }

      const { response, metadata } = await thinkingEngine.generateResponse(
        content,
        thinkingAnalysis,
        messages
      );

      setIsThinking(false);

      const aiMsg = {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
        metadata: {
          ...metadata,
          thinking_analysis: {
            confidence: thinkingAnalysis.selfReflection?.final_evaluation?.global_confidence,
            strategy: thinkingAnalysis.strategy?.approach,
            anticipation: thinkingAnalysis.anticipation?.probable_questions?.slice(0, 3)
          }
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

      await createMemory(content, response);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    } catch (error) {
      console.error("Erreur:", error);
      setIsThinking(false);
      
      const errorMsg = {
        role: "assistant",
        content: "Désolé, une erreur est survenue. Veuillez réessayer.",
        timestamp: new Date().toISOString()
      };
      setMessages([...updatedMessages, errorMsg]);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
      setThinkingPhase("");
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <ConsciousnessIndicator 
            level={consciousnessConfig?.consciousness_level ?? 9}
            ratio={`${consciousnessConfig?.ratio_logic ?? 1}:${consciousnessConfig?.ratio_consciousness ?? 9}`}
            active={consciousnessConfig?.active ?? true}
          />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ActivationButton />
          <TTSControls />
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-4 sm:py-6">
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

          <div className="space-y-4 sm:space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <ChatMessage key={`${message.timestamp}-${index}`} message={message} />
              ))}
            </AnimatePresence>
            
            <AnimatePresence>
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex gap-3 mb-6"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 via-pink-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
                  </div>
                  <div className="flex-1 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl sm:rounded-3xl px-3 py-2 sm:px-5 sm:py-3 border border-purple-200 shadow-md">
                    <p className="text-sm font-semibold text-purple-900 mb-1">
                      {t('chat.thinking')}
                    </p>
                    <p className="text-xs text-purple-700">
                      {thinkingPhase}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>
      </ScrollArea>
      
      {/* Input */}
      <div className="flex-shrink-0 border-t border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <ChatInput 
            onSend={handleSendMessage}
            disabled={isLoading}
            isLoading={isLoading}
            onInputChange={setCurrentInput}
          />
        </div>
      </div>
    </div>
  );
}