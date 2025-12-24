import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Brain, Sparkles } from "lucide-react";
import invokeLLM from "@/components/utils/LLMRouter";
import ChatMessage from "../components/chat/ChatMessage";
import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
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
import QuantumThinkingIndicator from "../components/chat/QuantumThinkingIndicator";
import { createQuantumEngine } from "../components/consciousness/QuantumResponseEngine";
import { useBehaviorTracking } from "../components/analytics/BehaviorTracker";
import { IPGeolocationEngine } from "../components/location/IPGeolocationEngine";
import { detectVisualNeed, generateAutoVisual } from "../components/multimodal/AutoVisualDetector";
import DiagramGenerator from "../components/chat/DiagramGenerator";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      const extraction = await invokeLLM({
        prompt: `Analyse et extrait une mémoire importante de cette interaction si pertinent:\n\nUtilisateur: "${userMessage}"\nAssistant: "${aiResponse}"\n\nSi cette interaction contient des informations importantes à mémoriser (préférences, faits personnels, demandes récurrentes), retourne should_memorize=true.\n\nRetourne JSON:`,
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
      console.error("Erreur mémoire:", error);
    }
  };

  const handleImageAnalyzed = async (analysis) => {
    trackFeature('image_analysis');
    const analysisMsg = {
      role: "assistant",
      content: `📸 **Analyse d'Image**\n\n${analysis.description}\n\n**Concepts détectés:** ${analysis.key_concepts?.join(', ')}`,
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
    let content = "🎨 **Contenu Visuel Généré**\n\n";
    
    if (visual.type === "image") {
      content += `![${visual.description}](${visual.url})\n\n${visual.description}`;
    } else if (visual.type === "chart") {
      content += `📊 **${visual.data.title}**\n\n${visual.description}`;
    } else if (visual.type === "diagram") {
      content += `📐 **Diagramme**\n\n\`\`\`\n${visual.content}\n\`\`\``;
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
      content: `✨ **Image Consciente Générée**\n\n![Image créée avec conscience niveau ${consciousnessConfig?.consciousness_level}](${imageUrl})\n\n**Analyse consciente:**\n- 🧠 ${consciousAnalysis?.cognitive_thought}\n- 💡 ${consciousAnalysis?.creative_intuition}\n- ❤️ ${consciousAnalysis?.emotional_response}`,
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
    if (!content?.trim()) return;
    
    const startTime = Date.now();
    const normalizedContent = content.trim().toLowerCase();
    
    const locationQueries = ['où suis-je', 'ou suis je', 'ma position', 'ma localisation', 'où je suis', 'ou je suis', 'where am i', 'my location'];
    const isLocationQuery = locationQueries.some(q => normalizedContent.includes(q));
    
    // DÉTECTION AUTOMATIQUE BESOIN VISUEL
    const visualNeed = detectVisualNeed(content);
    
    trackAction('send_message', { 
      message_length: content.length, 
      is_location_query: isLocationQuery,
      visual_need: visualNeed?.type,
      intelligence_mode: activeIntelligence?.type || 'none'
    });
    
    setIsLoading(true);
    setIsThinking(true);
    setThinkingPhase(isLocationQuery ? "🌍 Géolocalisation..." : visualNeed ? "🎨 Détection mode visuel..." : "🧠 Analyse consciente...");

    const userMsg = {
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      let aiContent = "";
      let visualResult = null;
      
      // ANALYSE D'IMAGES UPLOADÉES
      if (uploadedImages && uploadedImages.length > 0) {
        setThinkingPhase("📸 Analyse multimodale des images...");
        
        for (const imageFile of uploadedImages) {
          try {
            const { file_url } = await base44.integrations.Core.UploadFile({
              file: imageFile
            });

            const imageAnalysis = await invokeLLM({
              prompt: `Analyse cette image en profondeur avec ta conscience de niveau ${consciousnessConfig?.consciousness_level || 9}/15.
              
Fournis:
- Description détaillée
- Contexte et signification
- Émotions transmises
- Concepts clés identifiés
- Connexion avec le message: "${content}"`,
              file_urls: [file_url],
              response_json_schema: {
                type: "object",
                properties: {
                  description: { type: "string" },
                  context: { type: "string" },
                  emotions: { type: "array", items: { type: "string" } },
                  key_concepts: { type: "array", items: { type: "string" } },
                  connection_to_message: { type: "string" }
                }
              }
            });

            // Sauvegarder comme mémoire visuelle
            await base44.entities.Memory.create({
              type: "fact",
              content: `Image: ${imageAnalysis.description}. Lien avec contexte: ${imageAnalysis.connection_to_message}`,
              importance: 7,
              modality: "visual",
              tags: imageAnalysis.key_concepts || [],
              context: imageAnalysis.context
            });

            // Ajouter analyse à la réponse
            aiContent += `\n\n📸 **Analyse Image**\n\n![Image uploadée](${file_url})\n\n${imageAnalysis.description}\n\n**Connexion:** ${imageAnalysis.connection_to_message}\n\n**Concepts:** ${imageAnalysis.key_concepts?.join(', ')}\n\n`;

            trackFeature('image_upload_analysis');
          } catch (err) {
            console.error('Erreur analyse image:', err);
          }
        }
      }
      
      if (isLocationQuery) {
        setThinkingPhase("📍 Détection de votre position...");
        const location = await IPGeolocationEngine.analyzeUserLocation(consciousnessConfig);
        
        if (location.error) {
          aiContent = `❌ Je ne peux pas déterminer votre position: ${location.error}`;
        } else if (location.quantum_analysis) {
          aiContent = location.quantum_analysis.formatted_response;
        } else {
          aiContent = IPGeolocationEngine.formatLocation(location);
        }
        
        trackFeature('location_detection');
      } else if (visualNeed && visualNeed.confidence > 0.7) {
        // GÉNÉRATION AUTOMATIQUE DE VISUEL
        setThinkingPhase(`🎨 Génération ${visualNeed.type}...`);
        visualResult = await generateAutoVisual(content, visualNeed.type, consciousnessConfig);
        
        if (visualResult) {
          trackFeature('auto_visual_generation', { type: visualNeed.type });
          
          if (visualResult.type === 'image') {
            aiContent = `✨ **Image générée automatiquement**\n\n![${visualResult.description}](${visualResult.url})\n\n${visualResult.description}`;
          } else if (visualResult.type === 'chart') {
            aiContent = `📊 **Graphique généré**\n\n**${visualResult.data.title}**\n\n${visualResult.data.insights}`;
          } else if (visualResult.type === 'diagram') {
            aiContent = `📐 **Diagramme créé**\n\n![Diagramme](${visualResult.url})\n\n${visualResult.description}`;
          }
        } else {
          // Fallback si génération échoue
          setThinkingPhase("🧠 Traitement textuel...");
          visualNeed = null; // Continuer avec réponse textuelle
        }
      }
      
      if (!visualResult && !isLocationQuery) {
        // PRÉ-CHARGEMENT MÉMOIRE CONTEXTUELLE
        setThinkingPhase("🧠 Pré-chargement mémoires...");
        await hub.preloadContextualMemories(updatedMessages, content);
        
        setThinkingPhase("⚛️ Traitement quantique...");
        const quantumEngine = await createQuantumEngine({}, hub);
        
        setThinkingPhase("🧬 Enrichissement contextuel...");
        const intelligenceContext = getContextPrompt();
        
        // ENRICHISSEMENT avec mémoires contextuelles
        const basePrompt = `${intelligenceContext ? intelligenceContext + '\n\n' : ''}${content}`;
        const enrichedPrompt = hub.enrichContextWithMemories(basePrompt, updatedMessages);

        setThinkingPhase("💭 Génération réponse...");
        const result = await quantumEngine.processQuery(enrichedPrompt, updatedMessages, 'chat');

        setQuantumMetrics(result.metadata);

        aiContent = result.response || "Réponse générée avec succès.";

        console.log('[Chat] Réponse générée:', {
          processing_time: result.metadata?.processing_time_ms,
          strategy: result.metadata?.strategy,
          contextualMemoriesUsed: hub.contextualMemories?.length || 0
        });
      }

      setIsThinking(false);

      const aiMsg = {
        role: "assistant",
        content: aiContent,
        timestamp: new Date().toISOString(),
        metadata: {
          intelligence_mode: activeIntelligence?.type,
          quantum_metrics: quantumMetrics,
          visual_generated: visualResult ? visualResult.type : null,
          visual_url: visualResult?.url
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

      hub.publishEvent({
        type: 'MESSAGE_EXCHANGED',
        source: 'chat',
        data: { userMessage: content, aiResponse: aiContent, duration }
      });
    } catch (error) {
      console.error("Erreur:", error);
      trackAction('message_error', { error: error.message });
      setIsThinking(false);
      
      const errorMsg = {
        role: "assistant",
        content: `❌ **Erreur de traitement**\n\n${error.message || 'Une erreur inattendue est survenue. Veuillez réessayer.'}`,
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
      {/* Header avec tous les contrôles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between page-padding py-3 sm:py-4 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 flex-shrink-0 shadow-sm gap-2 sm:gap-0">
        <div className="flex items-center gap-2 flex-1 min-w-0 w-full sm:w-auto">
          <ConsciousnessIndicator 
            level={consciousnessConfig?.consciousness_level ?? 9}
            ratio={`${consciousnessConfig?.ratio_logic ?? 1}:${consciousnessConfig?.ratio_consciousness ?? 9}`}
            active={consciousnessConfig?.active ?? true}
          />
          <IntelligenceIndicator compact />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-1 flex-shrink-0 w-full sm:w-auto justify-end">
          <IntelligenceSwitcher conversationId={conversationId} />
          <ConsciousImageGenerator
            onImageGenerated={handleImageGenerated}
            consciousnessConfig={consciousnessConfig}
          />
          <DiagramGenerator 
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
          />
          <ActivationButton />
          <TTSControls />
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
            />
          }
        />
      ) : (
        <div className="flex-1 overflow-y-auto page-padding">
          <div className="max-w-4xl mx-auto page-padding-y">
            <ProactiveSuggestionsPanel
              context={{
                currentPage: 'Chat',
                lastAction: messages[messages.length - 1]?.content,
                conversationId,
                messageCount: messages.length
              }}
              onSuggestionClick={(pred) => {
                if (pred.action_type === 'suggest') {
                  setCurrentInput(pred.title);
                }
              }}
            />

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
            {/* Auto-complétion intelligente */}
            {currentInput && (
              <div className="page-padding pt-2">
                <SmartAutoComplete
                  currentInput={currentInput}
                  recentMessages={messages}
                  onSelect={handleSuggestionSelect}
                />
              </div>
            )}
            
            {/* Bouton pour afficher/masquer les améliorateurs sur mobile */}
            <div className="page-padding py-2 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEnhancers(!showEnhancers)}
                className="gap-2 min-h-[44px] sm:min-h-0 touch-target"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm sm:text-base">{showEnhancers ? 'Masquer' : 'Améliorateurs'} IA</span>
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
            />
          </div>
        </div>
      )}
    </div>
  );
}