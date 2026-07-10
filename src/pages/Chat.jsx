import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Brain, Sparkles, Home } from "lucide-react";
import druideTask from "@/components/utils/druideTask";
import ChatMessage from "../components/chat/ChatMessage";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
import ChatInput from "../components/chat/ChatInput";
import WelcomeScreen from "../components/chat/WelcomeScreen";
import ConsciousnessIndicator from "../components/chat/ConsciousnessIndicator";


import ConsciousImageGenerator from "../components/consciousness/ConsciousImageGenerator";
import MultimodalChatEnhancer from "../components/multimodal/MultimodalChatEnhancer";
import IntelligenceIndicator from "../components/intelligence/IntelligenceIndicator";
import IntelligenceSwitcher from "../components/intelligence/IntelligenceSwitcher";


import { useIntelligence } from "../components/intelligence/IntelligenceManager";
import { useDruidCompanion } from "../components/companion/DruidCompanionProvider";
import { useLanguage } from "@/components/utils/LanguageContext";
import QuantumThinkingIndicator from "../components/chat/QuantumThinkingIndicator";
import { createQuantumEngine } from "../components/consciousness/QuantumResponseEngine";
import { useBehaviorTracking } from "../components/analytics/BehaviorTracker";
import { IPGeolocationEngine } from "../components/location/IPGeolocationEngine";
import { detectVisualNeed, generateAutoVisual } from "../components/multimodal/AutoVisualDetector";
import DiagramGenerator from "../components/chat/DiagramGenerator";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CognitiveMonitor from "@/components/system/CognitiveMonitor";

export default function Chat() {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
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
  const [showEnhancers, setShowEnhancers] = useState(false);
  
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const memories = hub.memories || [];
  const consciousnessConfig = hub.consciousnessConfig;

  useEffect(() => {
    trackAction('mount');
    hub.registerModule('chat', { messages: [] });
    return () => hub.unregisterModule('chat');
  }, []);

  useEffect(() => {
    hub.updateModuleState('chat', { messages, conversationId });
  }, [messages, conversationId]);

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
      console.error(isEn ? "Loading error:" : "Erreur chargement:", error);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isThinking]);

  const createMemory = async (userMessage, aiResponse) => {
    try {
      const extraction = await druideTask({
        prompt: isEn 
          ? `Analyze and extract an important memory from this interaction if relevant:\n\nUser: "${userMessage}"\nAssistant: "${aiResponse}"\n\nIf this interaction contains important information to remember (preferences, personal facts, recurring requests), return should_memorize=true.\n\nReturn JSON:`
          : `Analyse et extrait une mémoire importante de cette interaction si pertinent:\n\nUtilisateur: "${userMessage}"\nAssistant: "${aiResponse}"\n\nSi cette interaction contient des informations importantes à mémoriser (préférences, faits personnels, demandes récurrentes), retourne should_memorize=true.\n\nRetourne JSON:`,
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
        hub.publishEvent({
          type: 'MEMORY_CREATED',
          source: 'chat',
          data: { content: extraction.content, importance: extraction.importance }
        });
      }
    } catch (error) {
     console.error(isEn ? "Memory error:" : "Erreur mémoire:", error);
    }
    };

  const handleImageAnalyzed = async (analysis) => {
    trackFeature('image_analysis');
    const analysisMsg = {
       role: "assistant",
       content: isEn 
         ? `📸 **Image Analysis**\n\n${analysis.description}\n\n**Detected Concepts:** ${analysis.key_concepts?.join(', ')}`
         : `📸 **Analyse d'Image**\n\n${analysis.description}\n\n**Concepts détectés:** ${analysis.key_concepts?.join(', ')}`,
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

    hub.publishEvent({
      type: 'IMAGE_ANALYZED',
      source: 'chat',
      data: { analysis }
    });
  };

  const handleVisualGenerated = async (visual) => {
    trackFeature('visual_generation', { type: visual.type });
    let content = isEn ? "🎨 **Generated Visual Content**\n\n" : "🎨 **Contenu Visuel Généré**\n\n";
    
    if (visual.type === "image") {
      content += `![${visual.description}](${visual.url})\n\n${visual.description}`;
    } else if (visual.type === "chart") {
      content += isEn ? `📊 **${visual.data.title}**\n\n${visual.description}` : `📊 **${visual.data.title}**\n\n${visual.description}`;
    } else if (visual.type === "diagram") {
      content += isEn ? `📐 **Diagram**\n\n\`\`\`\n${visual.content}\n\`\`\`` : `📐 **Diagramme**\n\n\`\`\`\n${visual.content}\n\`\`\``;
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

    hub.publishEvent({
      type: 'VISUAL_GENERATED',
      source: 'chat',
      data: { visual }
    });
  };

  const handleImageGenerated = async (originalPrompt, imageUrl, consciousAnalysis) => {
    trackFeature('conscious_image_generation');
    const imageMsg = {
      role: "assistant",
      content: isEn 
        ? `✨ **Conscious Image Generated**\n\n![Image created with consciousness level ${consciousnessConfig?.consciousness_level}](${imageUrl})\n\n**Conscious Analysis:**\n- 🧠 ${consciousAnalysis?.cognitive_thought}\n- 💡 ${consciousAnalysis?.creative_intuition}\n- ❤️ ${consciousAnalysis?.emotional_response}`
        : `✨ **Image Consciente Générée**\n\n![Image créée avec conscience niveau ${consciousnessConfig?.consciousness_level}](${imageUrl})\n\n**Analyse consciente:**\n- 🧠 ${consciousAnalysis?.cognitive_thought}\n- 💡 ${consciousAnalysis?.creative_intuition}\n- ❤️ ${consciousAnalysis?.emotional_response}`,
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

    hub.publishEvent({
      type: 'CONSCIOUS_IMAGE_GENERATED',
      source: 'chat',
      data: { imageUrl, analysis: consciousAnalysis }
    });
  };

  const handleSendMessage = async (content, uploadedImages = null) => {
    if (!content?.trim() && (!uploadedImages || uploadedImages.length === 0)) return;
    
    const startTime = Date.now();
    
    trackAction('send_message', { 
      message_length: content.length,
      intelligence_mode: activeIntelligence?.type || 'none',
      has_images: uploadedImages?.length > 0
    });
    
    setIsLoading(true);
    setIsThinking(true);
    setThinkingPhase(isEn ? "🧠 Processing your message..." : "🧠 Traitement de votre message...");

    // Traiter les images uploadées d'abord
    let imageUrls = [];
    if (uploadedImages && uploadedImages.length > 0) {
      setThinkingPhase(isEn ? "📸 Uploading images..." : "📸 Upload des images...");
      for (const imageFile of uploadedImages) {
        try {
          const { file_url } = await base44.integrations.Core.UploadFile({
            file: imageFile
          });
          imageUrls.push(file_url);
        } catch (err) {
          console.error(isEn ? 'Image upload error:' : 'Erreur upload image:', err);
        }
      }
    }

    const userMsg = {
      role: "user",
      content: content?.trim() || (isEn ? "📷 [Image sent]" : "📷 [Image envoyée]"),
      timestamp: new Date().toISOString(),
      image_urls: imageUrls.length > 0 ? imageUrls : undefined
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      let aiContent = "";
      
      // ANALYSE D'IMAGES UPLOADÉES / IMAGE ANALYSIS
      if (imageUrls.length > 0) {
        setThinkingPhase(isEn ? "🔍 Analyzing images..." : "🔍 Analyse des images...");
        
        const analysisPrompt = isEn 
          ? (content?.trim() 
            ? `Analyze these ${imageUrls.length} image(s) considering the question: "${content}"`
            : `Analyze and describe these ${imageUrls.length} image(s) in detail.`)
          : (content?.trim() 
            ? `Analyse ces ${imageUrls.length} image(s) en tenant compte de la question: "${content}"`
            : `Analyse et décris ces ${imageUrls.length} image(s) en détail.`);

        const imageAnalysis = await druideTask({
          prompt: analysisPrompt,
          file_urls: imageUrls,
          response_json_schema: {
            type: "object",
            properties: {
              overall_description: { type: "string" },
              key_elements: { type: "array", items: { type: "string" } },
              interpretation: { type: "string" },
              emotional_tone: { type: "string" }
            }
          }
        });

        if (isEn) {
          aiContent = `## 📸 Image Analysis${imageUrls.length > 1 ? 's' : ''}\n\n`;
          aiContent += `**Description:** ${imageAnalysis.overall_description}\n\n`;
          aiContent += `**Key Elements:**\n${imageAnalysis.key_elements?.map(e => `- ${e}`).join('\n')}\n\n`;
          aiContent += `**Interpretation:** ${imageAnalysis.interpretation}\n\n`;
          if (imageAnalysis.emotional_tone) {
            aiContent += `**Emotional Tone:** ${imageAnalysis.emotional_tone}`;
          }
        } else {
          aiContent = `## 📸 Analyse d'Image${imageUrls.length > 1 ? 's' : ''}\n\n`;
          aiContent += `**Description:** ${imageAnalysis.overall_description}\n\n`;
          aiContent += `**Éléments clés:**\n${imageAnalysis.key_elements?.map(e => `- ${e}`).join('\n')}\n\n`;
          aiContent += `**Interprétation:** ${imageAnalysis.interpretation}\n\n`;
          if (imageAnalysis.emotional_tone) {
            aiContent += `**Ton émotionnel:** ${imageAnalysis.emotional_tone}`;
          }
        }
        
        trackFeature('image_upload_analysis', { count: imageUrls.length });
      } else {
        // TRAITEMENT NORMAL — Moteur central Druide Omega (druideCore)
        setThinkingPhase(isEn ? "🌿 Druide is thinking..." : "🌿 Le Druide réfléchit...");

        const intelligenceContext = getContextPrompt();

        // Historique récent pour la continuité (10 derniers messages)
        const conversationHistory = messages.slice(-10).map(m => ({
          role: m.role,
          content: m.content
        }));

        const { data: druideResult } = await base44.functions.invoke('druideCore', {
          userMessage: content,
          conversationHistory,
          intelligenceContext: intelligenceContext || undefined
        });

        aiContent = druideResult?.response || (isEn ? "Response generated successfully." : "Réponse générée avec succès.");
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
      
      // Déclencher boucle perception-action
      try {
        await base44.functions.invoke('perceptionActionEngine', {
          operation: 'execute_full_loop',
          data: {
            raw_input: content,
            context: { conversation_id: convId, intelligence_mode: activeIntelligence?.type },
            urgency: 2
          }
        });
      } catch (err) {
        console.warn('Perception-action loop failed:', err);
      }

      // Invoquer les fonctions d'analyse en arrière-plan (non-bloquant)
      Promise.all([
        base44.functions.invoke('cognitivebiasDetector', {}).catch(e => console.warn('Bias detection failed:', e)),
        base44.functions.invoke('enhanceCrossModalCorrelations', {}).catch(e => console.warn('Correlation enhancement failed:', e)),
        base44.functions.invoke('optimizingLatency', {}).catch(e => console.warn('Latency optimization failed:', e))
      ]).then(() => {
        queryClient.invalidateQueries({ queryKey: ['cognitiveCorrelations'] });
        queryClient.invalidateQueries({ queryKey: ['metaLearning'] });
      });
      
      queryClient.invalidateQueries({ queryKey: ['conversations'] });

      hub.publishEvent({
        type: 'MESSAGE_EXCHANGED',
        source: 'chat',
        data: { userMessage: content, aiResponse: aiContent, duration }
      });
    } catch (error) {
      console.error(isEn ? "Error:" : "Erreur:", error);
      trackAction('message_error', { error: error.message });
      setIsThinking(false);
      
      const errorMsg = {
        role: "assistant",
        content: isEn 
          ? `❌ **Processing Error**\n\n${error.message || 'An unexpected error occurred. Please try again.'}`
          : `❌ **Erreur de traitement**\n\n${error.message || 'Une erreur inattendue est survenue. Veuillez réessayer.'}`,
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
    <div className="flex flex-col h-full relative">
      {/* Header avec tous les contrôles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between page-padding py-3 sm:py-4 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 flex-shrink-0 shadow-sm gap-2 sm:gap-0">
        <div className="flex items-center gap-2 flex-1 min-w-0 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.href = createPageUrl('PublicHome')}
            className="text-slate-600 hover:text-purple-600 hover:bg-purple-50 flex-shrink-0"
            title={isEn ? "Return to home" : "Retour à l'accueil"}
          >
            <Home className="w-5 h-5" />
          </Button>
          <ConsciousnessIndicator 
             level={consciousnessConfig?.consciousness_level ?? 9}
             ratio={`${consciousnessConfig?.ratio_logic ?? 1}:${consciousnessConfig?.ratio_consciousness ?? 9}`}
            active={consciousnessConfig?.active ?? true}
          />
          <IntelligenceIndicator compact />
          <CognitiveMonitor compact />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-1 flex-shrink-0 w-full sm:w-auto justify-end">
        </div>
      </div>



      {messages.length === 0 ? (
        <WelcomeScreen 
          onSuggestionClick={handleSendMessage}
          chatInput={
            <ChatInput 
              onSend={handleSendMessage}
              disabled={isLoading}
              isLoading={isLoading}
              onInputChange={setCurrentInput}
              conversationId={conversationId}
              onImageGenerated={handleImageGenerated}
              onDiagramGenerated={(prompt, url, type) => {
                const msg = {
                  role: "assistant",
                  content: `📐 **Diagramme créé**\n\n![${prompt}](${url})\n\n${prompt}`,
                  timestamp: new Date().toISOString(),
                  metadata: { type: "diagram", url, diagram_type: type }
                };
                const updated = [...messages, msg];
                setMessages(updated);
                if (conversationId) {
                  base44.entities.Conversation.update(conversationId, {
                    messages: updated,
                    last_message_at: new Date().toISOString()
                  });
                }
              }}
              onDocumentGenerated={(prompt, content) => {
                const msg = {
                  role: "assistant",
                  content: `📄 **Document généré**\n\n${content}`,
                  timestamp: new Date().toISOString(),
                  metadata: { type: "document", prompt }
                };
                const updated = [...messages, msg];
                setMessages(updated);
                if (conversationId) {
                  base44.entities.Conversation.update(conversationId, {
                    messages: updated,
                    last_message_at: new Date().toISOString()
                  });
                }
              }}
              onCodeGenerated={(prompt, code, language) => {
                const msg = {
                  role: "assistant",
                  content: `💻 **Code ${language} généré**\n\n${code}`,
                  timestamp: new Date().toISOString(),
                  metadata: { type: "code", language, prompt }
                };
                const updated = [...messages, msg];
                setMessages(updated);
                if (conversationId) {
                  base44.entities.Conversation.update(conversationId, {
                    messages: updated,
                    last_message_at: new Date().toISOString()
                  });
                }
              }}
              onTableGenerated={(prompt, table) => {
                const msg = {
                  role: "assistant",
                  content: `📊 **Tableau créé**\n\n${table}`,
                  timestamp: new Date().toISOString(),
                  metadata: { type: "table", prompt }
                };
                const updated = [...messages, msg];
                setMessages(updated);
                if (conversationId) {
                  base44.entities.Conversation.update(conversationId, {
                    messages: updated,
                    last_message_at: new Date().toISOString()
                  });
                }
              }}
              onFormulaGenerated={(prompt, formulas) => {
                const msg = {
                  role: "assistant",
                  content: `🧮 **Formules mathématiques**\n\n${formulas}`,
                  timestamp: new Date().toISOString(),
                  metadata: { type: "formula", prompt }
                };
                const updated = [...messages, msg];
                setMessages(updated);
                if (conversationId) {
                  base44.entities.Conversation.update(conversationId, {
                    messages: updated,
                    last_message_at: new Date().toISOString()
                  });
                }
              }}
              onTextTransformed={(original, transformed, mode) => {
                const msg = {
                  role: "assistant",
                  content: `📝 **Texte transformé (${mode})**\n\n${transformed}`,
                  timestamp: new Date().toISOString(),
                  metadata: { type: "text_transform", mode, original }
                };
                const updated = [...messages, msg];
                setMessages(updated);
                if (conversationId) {
                  base44.entities.Conversation.update(conversationId, {
                    messages: updated,
                    last_message_at: new Date().toISOString()
                  });
                }
              }}
              consciousnessConfig={consciousnessConfig}
            />
          }
        />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto page-padding page-padding-y">
            <div className="content-spacing">
              {messages.map((message, index) => {
                const categories = hub.categorizeInformation?.(message.content) || [];
                return (
                  <ChatMessage 
                    key={`msg-${index}-${message.timestamp}`} 
                    message={message}
                    index={index}
                    conversationId={conversationId}
                    messageCategories={categories}
                  />
                );
              })}
              
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 items-start"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <Brain className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <QuantumThinkingIndicator 
                      phase={thinkingPhase} 
                      metrics={quantumMetrics}
                    />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>
        </div>
      )}
      
      {/* Zone d'entrée avec améliorateurs - SEULEMENT si conversation active */}
      {messages.length > 0 && (
        <div className="flex-shrink-0 border-t border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-lg safe-bottom">
          <div className="max-w-4xl mx-auto">
            
            {/* Bouton pour afficher/masquer les améliorateurs sur mobile */}
            <div className="page-padding py-2 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEnhancers(!showEnhancers)}
                className="gap-2 min-h-[44px] sm:min-h-0 touch-target"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm sm:text-base">{showEnhancers ? (isEn ? 'Hide' : 'Masquer') : (isEn ? 'AI Enhancers' : 'Améliorateurs')} {isEn ? 'Tools' : 'IA'}</span>
              </Button>
            </div>

            {/* Améliorateurs multimodaux */}
            <AnimatePresence>
              {showEnhancers && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-3 pb-2 overflow-hidden"
                >
                  <MultimodalChatEnhancer
                    context={{ messages, conversationId }}
                    onImageAnalyzed={handleImageAnalyzed}
                    onVisualGenerated={handleVisualGenerated}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <ChatInput 
              onSend={handleSendMessage}
              disabled={isLoading}
              isLoading={isLoading}
              onInputChange={setCurrentInput}
              conversationId={conversationId}
              onImageGenerated={handleImageGenerated}
              onDiagramGenerated={(prompt, url, type) => {
                const diagramMsg = {
                  role: "assistant",
                  content: `📐 **Diagramme créé**\n\n![${prompt}](${url})\n\n${prompt}`,
                  timestamp: new Date().toISOString(),
                  metadata: { type: "diagram", url, diagram_type: type }
                };
                setMessages([...messages, diagramMsg]);
                if (conversationId) {
                  base44.entities.Conversation.update(conversationId, {
                    messages: [...messages, diagramMsg],
                    last_message_at: new Date().toISOString()
                  });
                }
              }}
              consciousnessConfig={consciousnessConfig}
            />
          </div>
        </div>
      )}
    </div>
  );
}