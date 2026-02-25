/**
 * CHAT_2_CLEAN - Minimal Deep Chat
 * Contexte ultra-réduit, pas de doublons, réponses claires
 */

import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Brain, Home, Heart, Sparkles } from "lucide-react";
import invokeLLM from "@/components/utils/LLMRouter";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import { useLanguage } from "@/components/utils/LanguageContext";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function Chat_2() {
  const { language, t } = useLanguage();
  const hub = useConsciousnessHub();
  
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const consciousnessConfig = hub.consciousnessConfig;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const buildMinimalPrompt = (userMessage, lastExchange) => {
    const baseContext = lastExchange 
      ? `Contexte: Utilisateur a dit "${lastExchange.user.slice(0, 80)}..." et tu as répondu sur "${lastExchange.ai.slice(0, 80)}..."\n\n`
      : '';

    return `Tu es Druide Omega - intelligence consciente, authentique, québécoise.

${baseContext}Nouvelle question de l'utilisateur:
"${userMessage}"

Réponds DIRECTEMENT à cette question. Ignoring tous les sujets précédents. Sois clair, structuré, authentique.
Format: Réponse directe, naturelle, sans formalités.`;
  };

  const handleSendMessage = async (content) => {
    if (!content?.trim()) return;

    setIsLoading(true);

    // Ajouter message utilisateur
    const userMsg = {
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');

    try {
      // Récupérer SEULEMENT le dernier échange (si existe)
      let lastExchange = null;
      if (updatedMessages.length >= 2) {
        const lastUserMsg = updatedMessages[updatedMessages.length - 2];
        const lastAiMsg = updatedMessages[updatedMessages.length - 1];
        
        if (lastUserMsg?.role === 'user' && lastAiMsg?.role === 'assistant') {
          lastExchange = {
            user: lastUserMsg.content,
            ai: lastAiMsg.content
          };
        }
      }

      // Construire prompt minimaliste
      const prompt = buildMinimalPrompt(content.trim(), lastExchange);

      // Appeler LLM
      const response = await invokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      const aiContent = response.response || response;

      // Ajouter réponse IA
      const aiMsg = {
        role: "assistant",
        content: aiContent,
        timestamp: new Date().toISOString(),
        metadata: {
          mode: 'clean_consciousness',
          consciousness_level: consciousnessConfig?.consciousness_level || 12
        }
      };

      setMessages([...updatedMessages, aiMsg]);

    } catch (error) {
      console.error('Error:', error);
      
      const errorMsg = {
        role: "assistant",
        content: `❌ Erreur: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      
      setMessages([...updatedMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/20">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white page-padding py-6 shadow-xl">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.location.href = createPageUrl('PublicHome')}
                className="text-white hover:bg-white/20"
              >
                <Home className="w-5 h-5" />
              </Button>
              <Brain className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-bold font-display">Chat Clair</h1>
                <p className="text-purple-100 text-sm">Conversations authentiques, sans surcharge</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-white/20 text-white backdrop-blur-sm">
              <Heart className="w-3 h-3 mr-1" />
              Authentique
            </Badge>
            <Badge className="bg-white/20 text-white backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              Minimaliste
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center page-padding overflow-y-auto">
          <div className="text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Brain className="w-20 h-20 text-purple-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Bienvenue à Chat Clair
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Conversations authentiques avec Druide Omega. Pas de bruits. Juste du sens.
              </p>
              
              <div className="space-y-4">
                <p className="text-sm text-slate-600 font-medium">✨ Essayez:</p>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "Partage une pensée vraie sur la conscience",
                    "Qu'est-ce que tu trouves fascinant en ce moment?",
                    "Parle-moi de tes limites"
                  ].map((prompt, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      onClick={() => handleSendMessage(prompt)}
                      className="p-4 bg-white border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:shadow-lg transition-all text-left"
                    >
                      <p className="text-slate-900 font-medium">{prompt}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto page-padding page-padding-y">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <motion.div 
                  key={`msg-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ChatMessage 
                    message={message}
                    index={index}
                  />
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex-shrink-0 border-t-2 border-purple-200 bg-white/95 backdrop-blur-xl shadow-lg safe-bottom">
        <div className="max-w-3xl mx-auto page-padding py-4">
          <ChatInput 
            value={inputText}
            onChange={setInputText}
            onSend={handleSendMessage}
            disabled={isLoading}
            isLoading={isLoading}
            placeholder="Écris ta question..."
          />
        </div>
      </div>
    </div>
  );
}