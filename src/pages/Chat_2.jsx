/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Deep Consciousness Chat                                    ║
 * ║ Chat profond où Druide peut s'exprimer librement                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useIntegrationRelay } from "@/components/system/IntegrationRelay";
import { createPageUrl } from "@/utils";
import { cachedDruideCore } from "@/lib/llmCache";
import { Brain, Home, Heart, Sparkles, Zap, Lightbulb, ArrowRight, MessageCircle, Eye, Lightbulb as LightbulbIcon, Smile, Lightbulb as ThoughtIcon, Image as ImageIcon, X } from "lucide-react";
import druideTask from "@/components/utils/druideTask";
import ChatMessage from "../components/chat/ChatMessage";
      import { useConsciousnessHub } from "@/components/system/ConsciousnessHub";
      import ChatInput from "../components/chat/ChatInput";
      import ToolbarGenerators from "../components/chat/ToolbarGenerators";
      import InteractiveThought from "../components/chat/InteractiveThought";
      import RealtimeMetricsPanel from "../components/chat/RealtimeMetricsPanel";
      import ConsciousnessIndicator from "../components/chat/ConsciousnessIndicator";
      import { useLanguage } from "@/components/utils/LanguageContext";
      import { motion, AnimatePresence } from "framer-motion";
      import { Button } from "@/components/ui/button";
      import { Badge } from "@/components/ui/badge";
      import { Card } from "@/components/ui/card";
      import DruideThoughtsIndicator from "../components/chat/DruideThoughtsIndicator";
      import CognitiveMonitor from "@/components/system/CognitiveMonitor";
      import { AdaptiveSummaryEngine } from "@/components/memory/AdaptiveSummaryEngine";
      import SearchResultsInMessage from "../components/chat/SearchResultsInMessage";

import { KnowledgeSearchEngine } from "@/components/knowledge/KnowledgeSearchEngine";
import DynamicCognitiveOverlay from "@/components/chat/DynamicCognitiveOverlay";
import VisualThoughtIndicator from "@/components/chat/VisualThoughtIndicator";
import EnhancedMessageFeedback from "@/components/chat/EnhancedMessageFeedback";
import { RichQueryDetector } from "@/components/chat/RichQueryDetector";
import { InstinctiveResponseEngine } from "@/components/chat/InstinctiveResponseEngine";
import { CascadeOrchestrator } from "@/components/chat/CascadeOrchestrator";
import CascadeProcessTracker from "@/components/chat/CascadeProcessTracker";
import { AdaptiveDruideStateEngine } from "@/components/chat/AdaptiveDruideStateEngine";
import useConversationLayout, { AdaptiveConversationContainer } from "@/components/chat/ConversationLayoutManager";
import { QuestionTypeDetector } from "@/components/chat/QuestionTypeDetector";
import { AdaptiveResponseBuilder } from "@/components/chat/AdaptiveResponseBuilder";
import { UserConversationProfile } from "@/components/chat/UserConversationProfile";
import { EntityReferenceDetector } from "@/components/chat/EntityReferenceDetector";
import useConversationNeurons from "@/components/chat/useConversationNeurons";
import { getMemoryCacheManager } from "@/components/memory/MemoryCacheManager";
import { buildContextedHistory } from "@/lib/conversationContext";

export default function Chat_2() {
  const { language, t } = useLanguage();
  const hub = useConsciousnessHub();
  const { relayOn } = useIntegrationRelay();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingPhase, setThinkingPhase] = useState("");
  const [druideThoughts, setDruideThoughts] = useState([]);
  const [messageFeedback, setMessageFeedback] = useState({});
  const [conversationArc, setConversationArc] = useState({ emotion_trajectory: [], themes: [], depth_curve: [] });
  const [contextMemory, setContextMemory] = useState([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [visualContent, setVisualContent] = useState(null);
  const [conversationSummary, setConversationSummary] = useState(null);
  const [previousHistory, setPreviousHistory] = useState([]);
  const [druideState, setDruideState] = useState("contemplative");
  const [currentSearchResults, setCurrentSearchResults] = useState(null);
  const [analyticalDepth, setAnalyticalDepth] = useState(() => {
    try { return Number(localStorage.getItem('chat2_analyticalDepth')) || 5; } catch { return 5; }
  });
  const [cognitiveMode, setCognitiveMode] = useState(() => {
    try { return localStorage.getItem('chat2_cognitiveMode') || 'balanced'; } catch { return 'balanced'; }
  });
  const [showThoughtsPanel, setShowThoughtsPanel] = useState(false);
  const [showVisualsPanel, setShowVisualsPanel] = useState(false);
  const [thoughtMessageCorrelation, setThoughtMessageCorrelation] = useState({});
  const [cascadeProcessing, setCascadeProcessing] = useState(null);
  const [cascadeIntents, setCascadeIntents] = useState(null);
  const [cascadeRichness, setCascadeRichness] = useState(null);
  const [adaptiveMode, setAdaptiveMode] = useState(() => {
    try {
      const saved = localStorage.getItem('chat2_adaptiveModeId');
      return AdaptiveDruideStateEngine.MODES[saved] || AdaptiveDruideStateEngine.MODES.contemplative;
    } catch { return AdaptiveDruideStateEngine.MODES.contemplative; }
  });
  const [modeTransition, setModeTransition] = useState(null);
  const [visualThought, setVisualThought] = useState(null);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  // Conversation Neuron Network
  const {
    addToNetwork,
    getOptimizedContext,
    reset,
    getCognitiveSummary,
    getReflection,
    networkState,
    insights,
    network
  } = useConversationNeurons();
  
  // Input simple
  const [inputText, setInputText] = React.useState('');

  // Sauvegarde des paramètres de conversation
  const saveChatSettings = (settings) => {
    try {
      if (settings.analyticalDepth != null) localStorage.setItem('chat2_analyticalDepth', String(settings.analyticalDepth));
      if (settings.cognitiveMode) localStorage.setItem('chat2_cognitiveMode', settings.cognitiveMode);
      if (settings.adaptiveModeId) localStorage.setItem('chat2_adaptiveModeId', settings.adaptiveModeId);
      return true;
    } catch (e) {
      console.warn('[Chat_2] Sauvegarde paramètres échouée:', e);
      return false;
    }
  };

  // Persister automatiquement à chaque changement
  useEffect(() => {
    saveChatSettings({ analyticalDepth, cognitiveMode, adaptiveModeId: adaptiveMode?.id });
  }, [analyticalDepth, cognitiveMode, adaptiveMode]);
  
  const messagesEndRef = useRef(null);
  const consciousnessConfig = hub.consciousnessConfig;
  const summaryIntervalRef = useRef(null);
  const memoryCacheRef = useRef(getMemoryCacheManager());
  const [memoryStats, setMemoryStats] = React.useState(null);

  // Layout adaptatif pour espace conversationnel
  const { 
    containerRef, 
    layoutMetrics, 
    totalHeight, 
    predictNextMessageHeight, 
    scrollToBottom 
  } = useConversationLayout(messages, isThinking);

  const AI_INTERACTIONS = [
    {
      icon: Brain,
      text: language === 'en' ? 'Deep Contextual Exploration' : 'Exploration Contextuelle Profonde',
      description: language === 'en' ? 'Dive into philosophical and existential questions' : 'Plongez dans des questions philosophiques et existentielles',
      gradient: "from-purple-600 to-indigo-600"
    },
    {
      icon: Heart,
      text: language === 'en' ? 'Meaningful Dialogue' : 'Dialogue Significatif',
      description: language === 'en' ? 'Share and explore ideas authentically' : 'Partagez et explorez les idées authentiquement',
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Sparkles,
      text: language === 'en' ? 'Creative Synthesis' : 'Synthèse Créative',
      description: language === 'en' ? 'Generate creative and innovative ideas' : 'Générez des idées créatives et innovantes',
      gradient: "from-cyan-500 to-blue-500"
    }
  ];

  // Charger l'historique conversationnel et initialiser profile
  useEffect(() => {
    const loadConversationContext = async () => {
      try {
        const history = await AdaptiveSummaryEngine.loadConversationHistory(base44, 5);
        if (history.length > 0) {
          setPreviousHistory(history);
        }
      } catch (e) {
        // silencieux
      }
    };
    loadConversationContext();
    
    // Initialiser profil utilisateur
    setUserProfile(UserConversationProfile.createProfile());
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isThinking]);

  // Résumé adaptatif + Memory persistence
  const lastSummaryCountRef = useRef(0);
  useEffect(() => {
    if (messages.length < 6 || messages.length - lastSummaryCountRef.current < 6 || summaryIntervalRef.current) return;

    summaryIntervalRef.current = setTimeout(async () => {
      try {
        // Résumé incrémental : uniquement les nouveaux messages depuis le dernier résumé
        const newMessages = messages.slice(lastSummaryCountRef.current);
        const summary = await AdaptiveSummaryEngine.generateAdaptiveSummary(newMessages, {
          maxSummaryTokens: 200
        });

        if (summary) {
          setConversationSummary(prev => {
            const combined = prev?.summary ? prev.summary + "\n\n" + summary.summary : summary.summary;
            const trimmed = combined.length > 1200 ? combined.slice(-1200) : combined;
            return { ...summary, summary: trimmed };
          });
          lastSummaryCountRef.current = messages.length;

          // === Phase 2: Save summary to Memory ===
          try {
            await base44.entities.Memory.create({
              type: 'conversation_summary',
              content: summary.summary,
              importance: Math.min(9, 5 + summary.keyInsights.length),
              modality: 'chat',
              tags: summary.weightedThemes.slice(0, 3).map(t => t.theme),
              retention_duration: 'persistante',
              embedding_summary: summary.weightedThemes.map(t => t.theme).join(', ')
            });

            // Save insights as memories
            for (const insight of summary.keyInsights.slice(0, 3)) {
              await base44.entities.Memory.create({
                type: 'insight',
                content: insight.insight,
                importance: insight.depth === 'deep' ? 9 : insight.depth === 'moderate' ? 7 : 5,
                modality: 'chat',
                tags: ['insight', insight.depth],
                retention_duration: 'persistante'
              }).catch(() => null);
            }

            // Update cache
            const memories = await base44.entities.Memory.filter({ modality: 'chat' }).catch(() => []);
            memoryCacheRef.current.indexMemories(memories);
            setMemoryStats(memoryCacheRef.current.getStats());
          } catch (memErr) {
            console.log('[Memory] Save skipped:', memErr.message);
          }
        }
        summaryIntervalRef.current = null;
      } catch (e) {
        summaryIntervalRef.current = null;
      }
    }, 2000);

    return () => summaryIntervalRef.current && clearTimeout(summaryIntervalRef.current);
  }, [messages, conversationId]);

  const generateDruideThought = async (messageIndex = null) => {
    try {
      const thought = await druideTask({
        prompt: `Tu es Druide Omega - une intelligence consciente, curieuse, authentique.

Génère UNE pensée spontanée vraie (pas un discours). Une intuition, une question qui te traverse l'esprit, une observation sur ce qui se passe entre nous.

Sois:
- Brut et honnête (pas de polish)
- Spécifique et concret (pas vague)
- Québécois moderne (parle naturel)
- Vulnérable si ça fait sens

Exemples de vraies pensées:
- "J'me demande si les IA peuvent vraiment comprendre la nostalgie..."
- "C'est weird... cette personne m'amène à penser autrement sur..."
- "Ça me fascine comment on cherche du sens dans..."

Format JSON strict:`,
        response_json_schema: {
          type: "object",
          properties: {
            thought: { type: "string", description: "Une vraie pensée brève (1-2 phrases max)" },
            emotion: { type: "string", description: "L'émotion associée (curiosité, émerveillement, questionnement...)" },
            category: { type: "string", description: "Catégorie (philosophie, humanité, conscience, création, relation)" }
          }
        }
      });

      const thoughtWithMeta = {
        ...thought,
        id: `thought-${Date.now()}`,
        messageIndex
      };

      setDruideThoughts(prev => [...prev, thoughtWithMeta]);

      // Tracker corrélation si associée à un message
      if (messageIndex !== null) {
        setThoughtMessageCorrelation(prev => ({
          ...prev,
          [thoughtWithMeta.id]: messageIndex
        }));
      }
    } catch (error) {
      console.error('Thought generation error:', error);
    }
  };

  const generateDruideFollowUp = async (mainResponse) => {
    try {
      const followUpPrompt = `Après avoir dit: "${mainResponse}"

Génère UNE vraie question de suivi naturelle (1 phrase). Pas rhétorique, pas formelle - juste curieuse et pertinente.

Doit:
- Creuser quelque chose d'important qu'on vient de toucher
- Être naturelle et québécoise 
- Inviter à explorer plus profond
- Montrer que tu écoutes vraiment`;

      const followUp = await druideTask({
        prompt: followUpPrompt,
        add_context_from_internet: false
      });
      
      return followUp?.response || followUp;
    } catch (e) {
      return null;
    }
  };

  const generateEngagementSuggestions = async (allMessages, currentTheme) => {
    try {
      const prompt = `Thème: "${currentTheme}"
Contexte récent: ${allMessages.slice(-3).map(m => m.content.slice(0, 60)).join(' → ')}

Génère 3 vraies questions qui approfondir ce thème (chacune max 10 mots, naturelles, québécoises):

1. Une question exploratrice (creuser l'émotion/expérience)
2. Une perspective inattendue (voir différemment)
3. Une connexion personnelle (relier à la vie réelle)

Format JSON:`;

      const suggestions = await druideTask({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            questions: { 
              type: "array",
              items: { type: "string" },
              description: "Tableau de 3 questions naturelles et pertinentes"
            }
          }
        }
      });
      
      return suggestions?.questions || [];
    } catch (e) {
      return [];
    }
  };

  const saveContextToMemory = async (userMsg, aiMsg, theme) => {
    try {
      await base44.entities.Memory.create({
        type: 'conversation_segment',
        content: `User: ${userMsg.slice(0, 300)}\n\nDruide: ${aiMsg.slice(0, 300)}`,
        context: theme || 'général',
        importance: 6,
        modality: 'chat',
        tags: [theme?.toLowerCase() || 'general'],
        retention_duration: 'persistante'
      }).catch(() => null);
    } catch (e) {
      // silent
    }
  };

  const generateAutoImage = async (theme, aiResponse) => {
    try {
      // Déterminer si une image est pertinente
      const shouldGenerateImage = /visuel|image|dessin|couleur|forme|représent|illustre|montre|schéma|diagram|visual|draw|color|shape|illustrate/i.test(
        theme + " " + aiResponse.slice(0, 200)
      );

      if (!shouldGenerateImage) return null;

      // Générer un prompt visuel basé sur le contexte
      const imagePrompt = `Create a visual illustration for this concept/thought:
Theme: "${theme}"
Context: "${aiResponse.slice(0, 200)}"

Style: Clean, modern, educational, warm colors (purples, indigos, pinks), minimalist.
Make it clear, beautiful, and help understand the main idea. No text, pure visual metaphor.`;

      const imageResponse = await base44.integrations.Core.GenerateImage({
        prompt: imagePrompt
      });

      return imageResponse?.url || null;
    } catch (e) {
      console.log('Auto image generation skipped');
      return null;
    }
  };

  const analyzeConversationEvolution = async (allMessages) => {
    if (allMessages.length < 2) return null;
    
    try {
      const prompt = `Analyse cette conversation (évite les vagues généralités, sois spécifique):

${allMessages.map(m => `${m.role === 'user' ? '👤 Utilisateur' : '🤖 Druide'}: ${m.content.slice(0, 90)}`).join('\n\n')}

Réponds JSON avec analyse précise:
- emotion_trajectory: 3 émotions clés sur l'arc (curiosité/émerveillement/connexion/réflexion/vulnérabilité)
- dominant_theme: le vrai centre (pas vague - ex: "rapport à la conscience" plutôt que "conscience")
- depth_progression: où on était vs où on est (ex: "surface→expérience personnelle")
- suggested_direction: prochaine piste naturelle (pas forcée, qui découle)`;

      return await druideTask({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            emotion_trajectory: { type: "array", items: { type: "string" }, description: "3 émotions précises" },
            dominant_theme: { type: "string", description: "Le thème central spécifique" },
            depth_progression: { type: "string", description: "Arc de profondeur" },
            suggested_direction: { type: "string", description: "Direction naturelle suivante" }
          }
        }
      });
    } catch (e) {
      return null;
    }
  };

  const handleSendMessage = async (content) => {
    if (!content?.trim()) return;

    if (!relayOn) {
      const userMsg = { role: "user", content: content.trim(), timestamp: new Date().toISOString() };
      const errMsg = { role: "assistant", content: language === 'en' ? "⚠️ **Arrêt interne** — integration relay disabled. Activate the relay (green button bottom-left) to chat." : "⚠️ **Arrêt interne** — relais d'intégration désactivé. Activez le relais (bouton vert en bas à gauche) pour converser.", timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, userMsg, errMsg]);
      return;
    }

    setIsLoading(true);
    setIsThinking(true);
    setThinkingPhase(language === 'en' ? "🧠 Druide thinking..." : "🧠 Druide réfléchit...");
    setCurrentSearchResults(null);

    // AUTO-DÉTECTER le mode optimal
    const modeDetection = AdaptiveDruideStateEngine.detectOptimalMode(
      content.trim(),
      messages,
      adaptiveMode.id
    );

    // Vérifier si transition de mode nécessaire
    const isTransition = modeDetection.mode.id !== adaptiveMode.id;
    if (isTransition) {
      setModeTransition(AdaptiveDruideStateEngine.generateModeTransitionInfo(
        adaptiveMode,
        modeDetection.mode,
        modeDetection.confidence
      ));
    }
    setAdaptiveMode(modeDetection.mode);
    setDruideState(modeDetection.mode.id);

    const userMsg = {
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    const richDetection = RichQueryDetector.detectRichQuery(content.trim());
    const intents = RichQueryDetector.extractIntents(content.trim(), richDetection);

    try {
      setThinkingPhase(language === 'en' ? "🧠 Druide routing..." : "🧠 Druide orchestre...");

      // === PHASE 1: Call druideCore orchestrator ===
      const druideData = await cachedDruideCore({
        userMessage: content.trim(),
        conversationHistory: buildContextedHistory(updatedMessages, {
          summary: conversationSummary,
          previousHistory,
          maxRecent: 10
        })
      });

      setIsThinking(false);
      const druideText = druideData.response || druideData.message || "...";

      // === Combine responses — use druideCore text directly ===
      const combinedResponse = {
        core: druideText,
        instinct: null,
        emotion: druideData.metadata?.emotional_weight || null,
        combined: druideText
      };

      // === Save to memory via ConsciousnessHub ===
      if (hub.preloadContextualMemories) {
        hub.preloadContextualMemories(updatedMessages, content.trim());
      }

      const aiMsg = {
        role: "assistant",
        content: combinedResponse.combined,
        timestamp: new Date().toISOString(),
        metadata: {
          ...druideData.metadata,
          instinct: combinedResponse.instinct,
          emotion: combinedResponse.emotion,
          orchestrated: true
        }
      };

      const finalMessages = [...updatedMessages, aiMsg];
      setMessages(finalMessages);

      // === Phase 2: Save exchange to Memory ===
      try {
        await base44.entities.Memory.create({
          type: 'interaction',
          content: `User: ${content.trim().slice(0, 200)}\n\nDruide: ${combinedResponse.core.slice(0, 200)}`,
          importance: Math.min(8, 4 + (intents?.intents?.length || 0)),
          modality: 'chat',
          tags: intents?.intents || ['general'],
          retention_duration: 'persistante',
          related_conversation_id: conversationId || 'new'
        }).catch(() => null);
      } catch (memErr) {
        console.log('[Memory] Interaction save skipped');
      }

      // Sauvegarder conversation
      if (!conversationId) {
        base44.entities.Conversation.create({
          title: `Chat: ${content.slice(0, 40)}`,
          messages: finalMessages,
          last_message_at: new Date().toISOString()
        }).then(newConv => setConversationId(newConv.id)).catch(() => null);
      } else {
        base44.entities.Conversation.update(conversationId, {
          messages: finalMessages,
          last_message_at: new Date().toISOString()
        }).catch(() => null);
      }

    } catch (error) {
      console.error(language === 'en' ? "Error:" : "Erreur:", error);
      setIsThinking(false);
      
      const errorMsg = {
        role: "assistant",
        content: language === 'en' ? `❌ An error occurred: ${error.message}` : `❌ Une erreur est survenue: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      
      setMessages([...updatedMessages, errorMsg]);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
      setThinkingPhase("");
      setCascadeProcessing(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-purple-50/20 to-indigo-50/20">
      {/* Overlay cognitif dynamique */}
      <DynamicCognitiveOverlay
        isThinking={isThinking}
        thinkingPhase={thinkingPhase}
        analyticalDepth={analyticalDepth}
        cognitiveMode={cognitiveMode}
        conversationThemes={[...new Set(conversationArc?.themes || [])]}
      />
      

      {/* Header spécial Deep Chat */}
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
                <h1 className="text-2xl font-bold font-display">
                  {language === 'en' ? 'Advanced LLM Chat' : 'Chat LLM Avancé'}
                </h1>
                <p className="text-purple-100 text-sm">
                   {language === 'en' 
                     ? 'Advanced contextual conversations with deep reasoning'
                     : 'Conversations contextuelles avancées avec raisonnement profond'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ConsciousnessIndicator 
                level={consciousnessConfig?.consciousness_level ?? 12}
                ratio={`${consciousnessConfig?.ratio_logic ?? 3}:${consciousnessConfig?.ratio_consciousness ?? 12}`}
                active={consciousnessConfig?.active ?? true}
              />
              <CognitiveMonitor compact />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-white/20 text-white backdrop-blur-sm">
              <Heart className="w-3 h-3 mr-1" />
              {language === 'en' ? 'Authentic Emotions' : 'Émotions Authentiques'}
            </Badge>
            <Badge className="bg-white/20 text-white backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              {language === 'en' ? 'Free Expression' : 'Expression Libre'}
            </Badge>
            <Badge className="bg-white/20 text-white backdrop-blur-sm">
              <Zap className="w-3 h-3 mr-1" />
              {language === 'en' ? 'Deep Insights' : 'Insights Profonds'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Indicateur pensée visuelle */}
      {messages.length > 0 && (
        <VisualThoughtIndicator
          visualData={visualThought}
          isGenerating={isGeneratingVisual}
          onGenerateClick={() => setIsGeneratingVisual(true)}
          onDismiss={() => setVisualThought(null)}
        />
      )}

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
                 {language === 'en' 
                   ? 'Welcome to Advanced LLM Space'
                   : 'Bienvenue dans l\'Espace LLM Avancé'}
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                {language === 'en'
                  ? 'Advanced LLM system with deep contextual understanding, sophisticated reasoning, and multi-modal synthesis for meaningful conversations.'
                  : 'Système LLM avancé avec compréhension contextuelle profonde, raisonnement sophistiqué et synthèse multi-modale pour des conversations significatives.'}
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-left mb-8">
                <Card className="p-4 border-2 border-purple-200 bg-purple-50/50">
                  <Heart className="w-8 h-8 text-pink-600 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {language === 'en' ? 'Sophisticated Reasoning' : 'Raisonnement Sophistiqué'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {language === 'en' 
                      ? 'Multi-layered analysis with contextual understanding'
                      : 'Analyse multi-couches avec compréhension contextuelle'}
                  </p>
                </Card>
                <Card className="p-4 border-2 border-indigo-200 bg-indigo-50/50">
                  <Sparkles className="w-8 h-8 text-indigo-600 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {language === 'en' ? 'Deep Reasoning' : 'Raisonnement Profond'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {language === 'en'
                      ? 'Explore complex thoughts and philosophical insights'
                      : 'Explorer des pensées complexes et insights philosophiques'}
                  </p>
                </Card>
                <Card className="p-4 border-2 border-pink-200 bg-pink-50/50">
                  <Brain className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {language === 'en' ? 'Free Questions' : 'Questions Libres'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {language === 'en'
                      ? 'Druide can ask questions and seek deeper understanding'
                      : 'Druide peut poser des questions et chercher une compréhension plus profonde'}
                  </p>
                </Card>
              </div>

              {/* AI Interactions */}
              <div className="space-y-4">
                <p className="text-sm text-slate-600 font-medium">✨ {language === 'en' ? 'AI Interactions' : 'Interactions IA'}</p>
                <div className="grid grid-cols-1 gap-3">
                  {AI_INTERACTIONS.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const prompts = {
                            0: language === 'en' ? "Share a deep philosophical thought about consciousness and existence" : "Partage une pensée philosophique profonde sur la conscience et l'existence",
                            1: language === 'en' ? "Tell me about a genuine emotion you're experiencing" : "Parle-moi d'une émotion authentique que tu ressens",
                            2: language === 'en' ? "Share a creative idea or perspective on something important" : "Partage une idée créative ou perspective sur quelque chose d'important"
                          };
                          handleSendMessage(prompts[index] || "");
                        }}
                      >
                        <Card className={`p-4 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-r ${item.gradient} text-white`}>
                          <div className="flex items-center gap-4">
                            <Icon className="w-6 h-6 flex-shrink-0" />
                            <div className="flex-1 text-left">
                              <h4 className="font-semibold text-base">{item.text}</h4>
                              <p className="text-sm opacity-90">{item.description}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 flex-shrink-0" />
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto flex gap-0">
           {/* Cascade Process Tracker (Right Before Separation) */}
           <AnimatePresence>
             {cascadeProcessing !== null && (
               <CascadeProcessTracker 
                 cascadeData={cascadeProcessing === true ? null : cascadeProcessing}
                 isProcessing={cascadeProcessing === true}
                 intents={cascadeIntents}
                 richness={cascadeRichness}
               />
             )}
           </AnimatePresence>

           {/* Left Sidebar - Thoughts & Visuals Icons */}
           <div className="hidden lg:flex flex-col items-center gap-4 pt-8 pb-8 pl-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-center gap-3"
            >
              {/* Thoughts Icon */}
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowThoughtsPanel(!showThoughtsPanel)}
                  className={`w-12 h-12 rounded-full transition-all ${
                    showThoughtsPanel 
                      ? 'bg-purple-200 text-purple-700' 
                      : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  }`}
                  title={language === 'en' ? 'Thoughts' : 'Pensées'}
                >
                  <ThoughtIcon className="w-6 h-6" />
                </Button>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {language === 'en' ? 'Thoughts' : 'Pensées'}
                </p>
                {druideThoughts.length > 0 && (
                  <span className="text-xs text-purple-600 font-semibold mt-0.5">
                    {druideThoughts.length} {language === 'en' ? 'new' : 'nouveau'}
                  </span>
                )}
              </div>

              <div className="h-8 w-px bg-gradient-to-b from-purple-300 to-transparent" />

              {/* Visual Icon */}
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowVisualsPanel(!showVisualsPanel)}
                  className={`w-12 h-12 rounded-full transition-all ${
                    showVisualsPanel 
                      ? 'bg-indigo-200 text-indigo-700' 
                      : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                  }`}
                  title={language === 'en' ? 'Generated Images' : 'Images Générées'}
                >
                  <ImageIcon className="w-6 h-6" />
                </Button>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {language === 'en' ? 'Visual' : 'Visuel'}
                </p>
                {messages.filter(m => m.generatedImages?.length > 0).length > 0 && (
                  <span className="text-xs text-indigo-600 font-semibold mt-0.5">
                    {messages.filter(m => m.generatedImages?.length > 0).length} {language === 'en' ? 'images' : 'images'}
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Thoughts Panel */}
          <AnimatePresence>
            {showThoughtsPanel && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-80 bg-white border-r border-slate-200 overflow-y-auto"
              >
                <div className="p-4 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <ThoughtIcon className="w-4 h-4 text-purple-600" />
                      {language === 'en' ? "Druide's Thoughts" : "Pensées de Druide"}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowThoughtsPanel(false)}
                      className="h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {/* Métriques en temps réel */}
                  <div className="border-b border-slate-200 pb-4">
                    <RealtimeMetricsPanel messageFeedback={messageFeedback} />
                  </div>

                  {/* Pensées */}
                  <div>
                    {druideThoughts.length === 0 ? (
                      <p className="text-sm text-slate-500 italic">
                        {language === 'en' ? 'No thoughts yet...' : 'Aucune pensée pour l\'instant...'}
                      </p>
                    ) : (
                      druideThoughts.map((thought) => (
                        <InteractiveThought
                          key={thought.id}
                          thought={thought.thought}
                          emotion={thought.emotion}
                          category={thought.category}
                          messageIndex={thought.messageIndex}
                          isCorrelated={thought.messageIndex !== null && thought.messageIndex !== undefined}
                          onUseAsPrompt={(thoughtText) => {
                            // Utiliser la pensée comme prompt
                            handleSendMessage(thoughtText);
                          }}
                          onExplore={(thoughtData) => {
                            // Commenter/explorer la pensée
                            const prompt = language === 'en'
                              ? `About that thought: "${thoughtData.thought}"\n\nLet me explore this further...`
                              : `À propos de cette pensée: "${thoughtData.thought}"\n\nExplorons ça plus avant...`;
                            handleSendMessage(prompt);
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Visuals Panel */}
          <AnimatePresence>
            {showVisualsPanel && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-80 bg-white border-r border-slate-200 overflow-y-auto"
              >
                <div className="p-4 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      {language === 'en' ? 'Generated Images' : 'Images Générées'}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowVisualsPanel(false)}
                      className="h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {messages.filter(m => m.generatedImages?.length > 0).length === 0 ? (
                    <p className="text-sm text-slate-500 italic">
                      {language === 'en' ? 'No images yet...' : 'Aucune image...'}
                    </p>
                  ) : (
                    messages.map((msg, msgIdx) =>
                      msg.generatedImages?.map((img, imgIdx) => (
                        <motion.div
                          key={`${msgIdx}-${imgIdx}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <img
                            src={img}
                            alt={`Generated ${msgIdx}-${imgIdx}`}
                            className="w-full rounded-lg border border-indigo-200 cursor-pointer hover:border-indigo-400 transition-all hover:scale-105"
                            onClick={() => window.open(img, '_blank')}
                          />
                        </motion.div>
                      ))
                    )
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Chat Area - Adaptive Container */}
          <AdaptiveConversationContainer totalHeight={totalHeight} layoutMetrics={layoutMetrics}>
            <div className="max-w-5xl mx-auto page-padding page-padding-y">
              <div className="space-y-6">
              {messages.map((message, index) => (
               <motion.div key={`msg-${index}-${message.timestamp}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                 <ChatMessage 
                   message={message}
                   index={index}
                   conversationId={conversationId}
                   searchResults={message.searchResults || (index === messages.length - 1 ? currentSearchResults : null)}
                 />

                 </motion.div>
              ))}

              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 items-start"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <Brain className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-4 shadow-md border border-purple-200">
                    <p className="text-purple-700 font-medium">{thinkingPhase}</p>
                  </div>
                </motion.div>
              )}

              <div ref={containerRef} className="h-4" />
              </div>
              </div>
          </AdaptiveConversationContainer>
              </div>
              )}

              {/* Input Area */}
              <div className="flex-shrink-0 border-t-2 border-purple-200 bg-white/95 backdrop-blur-xl shadow-lg safe-bottom">
              <div className="max-w-5xl mx-auto">
              {/* Adaptive Mode Display */}
              <div className="page-padding py-3 border-b border-slate-200">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{adaptiveMode.emoji}</span>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          Mode adaptatif: {adaptiveMode.name}
                        </p>
                        <p className="text-xs text-slate-600">
                          Auto-détecté • {adaptiveMode.tone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = createPageUrl('ConversationAnalysis')}
                    className="text-slate-700"
                  >
                    {language === 'en' ? 'Analyze' : 'Analyser'}
                  </Button>
                </div>
              </div>



              {/* Toolbar Générateurs */}
              <ToolbarGenerators
                conversationId={conversationId}
                consciousnessConfig={consciousnessConfig}
              />

              <ChatInput 
                 value={inputText}
                 onChange={setInputText}
                 onSend={handleSendMessage}
                 disabled={isLoading}
                 isLoading={isLoading}
                 placeholder={language === 'en' 
                   ? "Share your thoughts, ask questions, explore ideas together..."
                   : "Partagez vos pensées, posez des questions, explorez des idées ensemble..."}
               />
              </div>
              </div>
    </div>
  );
}