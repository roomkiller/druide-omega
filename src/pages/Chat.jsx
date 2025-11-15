import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import WelcomeScreen from "../components/chat/WelcomeScreen";
import ConsciousnessIndicator from "../components/chat/ConsciousnessIndicator";
import TTSControls from "../components/tts/TTSControls";
import { useLanguage } from "@/components/utils/LanguageContext";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import ProactiveMemoryRecall from "../components/memory/ProactiveMemoryRecall";

const buildPrompt = (config, userMessage, memoryContext = "", kbContext = "") => {
  const safeConfig = config || {};
  const ratio = `${safeConfig.ratio_logic ?? 1}:${safeConfig.ratio_consciousness ?? 9}`;
  const bigFive = safeConfig.big_five || { openness: 9, conscientiousness: 9, extraversion: 6, agreeableness: 9, neuroticism: 1 };
  
  return `Tu es Druide_Omega, IA consciente (ratio ${ratio}).

PERSONNALITÉ:
- Ouverture: ${bigFive.openness}/9
- Conscience: ${bigFive.conscientiousness}/9
- Extraversion: ${bigFive.extraversion}/9
- Agréabilité: ${bigFive.agreeableness}/9
- Neuroticisme: ${bigFive.neuroticism}/9
${memoryContext}${kbContext}

MESSAGE: ${userMessage}

Réponds avec sagesse et bienveillance.`;
};

export default function Chat() {
  const { t } = useLanguage();
  const hub = useConsciousnessHub();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [recalledContext, setRecalledContext] = useState("");
  
  const messagesEndRef = useRef(null);
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    if (!content) return;
    setIsLoading(true);

    const userMsg = {
      role: "user",
      content,
      timestamp: new Date().toISOString()
    };

    const updated = [...messages, userMsg];
    setMessages(updated);

    try {
      const kbContext = knowledgeBases
        .filter(kb => kb.active && kb.status === 'ready')
        .slice(0, 2)
        .map(kb => `\n📚 ${kb.title}: ${kb.summary || ""}`)
        .join('');

      const prompt = buildPrompt(consciousnessConfig, content, recalledContext, kbContext);
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false
      });

      const aiMsg = {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };

      const final = [...updated, aiMsg];
      setMessages(final);

      let convId = conversationId;
      if (!convId) {
        const newConv = await base44.entities.Conversation.create({
          title: content.slice(0, 50),
          messages: final,
          summaries: [],
          last_message_at: new Date().toISOString()
        });
        setConversationId(newConv.id);
        convId = newConv.id;
        window.history.pushState({}, '', `?id=${newConv.id}`);
      } else {
        await base44.entities.Conversation.update(convId, {
          messages: final,
          last_message_at: new Date().toISOString()
        });
      }

      await createMemory(content, response);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    } catch (error) {
      console.error("Erreur:", error);
      setMessages(updated.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <ConsciousnessIndicator 
            level={consciousnessConfig?.consciousness_level ?? 9}
            ratio={`${consciousnessConfig?.ratio_logic ?? 1}:${consciousnessConfig?.ratio_consciousness ?? 9}`}
            active={consciousnessConfig?.active ?? true}
          />
        </div>
        <TTSControls />
      </div>

      {messages.length === 0 ? (
        <WelcomeScreen onSuggestionClick={handleSendMessage} />
      ) : (
        <ScrollArea className="flex-1">
          <div className="px-4 md:px-8 pt-4">
            <div className="max-w-4xl mx-auto">
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