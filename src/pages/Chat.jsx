import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import WelcomeScreen from "../components/chat/WelcomeScreen";

export default function Chat() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
      loadConversation(id);
    }
  }, [window.location.search]);

  const loadConversation = async (id) => {
    try {
      const conversations = await base44.entities.Conversation.list();
      const conversation = conversations.find(c => c.id === id);
      if (conversation) {
        setConversationId(id);
        setMessages(conversation.messages || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la conversation:", error);
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

  const handleSendMessage = async (content) => {
    const userMessage = {
      role: "user",
      content,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: content,
        add_context_from_internet: false
      });

      const assistantMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      // Sauvegarder ou créer la conversation
      if (conversationId) {
        await base44.entities.Conversation.update(conversationId, {
          messages: finalMessages,
          last_message_at: new Date().toISOString()
        });
      } else {
        const newConversation = await base44.entities.Conversation.create({
          title: generateTitle(content),
          messages: finalMessages,
          last_message_at: new Date().toISOString()
        });
        setConversationId(newConversation.id);
        window.history.pushState({}, '', `?id=${newConversation.id}`);
      }

      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setMessages(updatedMessages.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {messages.length === 0 ? (
        <WelcomeScreen onSuggestionClick={handleSendMessage} />
      ) : (
        <ScrollArea className="flex-1 px-4 md:px-8">
          <div className="max-w-4xl mx-auto py-8">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}
      
      <ChatInput 
        onSend={handleSendMessage}
        disabled={isLoading}
        isLoading={isLoading}
      />
    </div>
  );
}