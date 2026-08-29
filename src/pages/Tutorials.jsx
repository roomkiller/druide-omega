/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Interactive Tutorials (Multilingual)                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";
import { createPageUrl } from "@/utils";
import { navigateTo } from "@/lib/spaNavigate";
import {
  PlayCircle,
  MessageSquare,
  Mic,
  Database,
  BookOpen,
  Settings,
  Brain,
  CheckCircle,
  ArrowRight,
  Clock
} from "lucide-react";

export default function Tutorials() {
  const { language } = useLanguage();
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  const content = {
    fr: {
      title: "Tutoriels Interactifs",
      subtitle: "Apprenez pas-à-pas avec des guides pratiques",
      
      tutorials: [
        {
          id: "first-conversation",
          title: "Première Conversation",
          icon: MessageSquare,
          duration: "5 min",
          difficulty: "Débutant",
          color: "purple",
          description: "Démarrez votre première conversation avec Druide Omega et découvrez le Thinking Engine",
          steps: [
            { step: 1, title: "Ouvrir le Chat", action: "Cliquez sur 'Chat' dans le menu", page: "Chat" },
            { step: 2, title: "Première Question", action: "Posez une question ou choisissez une suggestion" },
            { step: 3, title: "Observer le Thinking", action: "Regardez l'IA analyser votre question" },
            { step: 4, title: "Lire la Réponse", action: "Explorez la réponse détaillée avec métadonnées" },
            { step: 5, title: "Poursuivre", action: "Posez une question de suivi pour approfondir" }
          ]
        },
        {
          id: "voice-interaction",
          title: "Interaction Vocale",
          icon: Mic,
          duration: "7 min",
          difficulty: "Intermédiaire",
          color: "green",
          description: "Apprenez à utiliser les modes vocaux pour une expérience mains-libres",
          steps: [
            { step: 1, title: "Accéder à la Salle Vocale", action: "Menu → Salle Vocale", page: "VoiceRoom" },
            { step: 2, title: "Autoriser le Micro", action: "Acceptez l'accès au microphone" },
            { step: 3, title: "Premier Message Vocal", action: "Cliquez et parlez naturellement" },
            { step: 4, title: "Générer une Image", action: "Dites 'Génère une image de...'" },
            { step: 5, title: "Explorer Voix Live", action: "Essayez le mode conversationnel continu", page: "VoiceLive" }
          ]
        },
        {
          id: "memory-system",
          title: "Système de Mémoire",
          icon: Database,
          duration: "10 min",
          difficulty: "Intermédiaire",
          color: "indigo",
          description: "Maîtrisez le système de mémoire cross-modale et le graphe de connaissances",
          steps: [
            { step: 1, title: "Accéder aux Mémoires", action: "Menu → Mémoire", page: "Memory" },
            { step: 2, title: "Explorer les Mémoires", action: "Filtrez par modalité, tags ou importance" },
            { step: 3, title: "Graphe de Mémoires", action: "Activez la vue graphe pour voir les liens" },
            { step: 4, title: "Quiz de Rappel", action: "Testez votre rétention avec le quiz actif" },
            { step: 5, title: "Mémoires Connexes", action: "Cliquez sur une mémoire pour voir les liens" }
          ]
        },
        {
          id: "knowledge-base",
          title: "Base de Connaissances",
          icon: BookOpen,
          duration: "8 min",
          difficulty: "Avancé",
          color: "blue",
          description: "Uploadez et gérez vos documents pour personnaliser l'IA",
          steps: [
            { step: 1, title: "Ouvrir la KB", action: "Menu → Base de Connaissances", page: "Knowledge" },
            { step: 2, title: "Téléverser un Document", action: "Cliquez 'Téléverser' et choisissez un fichier" },
            { step: 3, title: "Attendre l'Extraction", action: "L'IA extrait automatiquement les faits" },
            { step: 4, title: "Activer/Désactiver", action: "Contrôlez quelles sources sont utilisées" },
            { step: 5, title: "Élagage Auto", action: "Nettoyez les sources obsolètes" }
          ]
        },
        {
          id: "consciousness-config",
          title: "Configuration Conscience",
          icon: Brain,
          duration: "12 min",
          difficulty: "Avancé",
          color: "purple",
          description: "Personnalisez la conscience et la personnalité de l'IA",
          steps: [
            { step: 1, title: "Ouvrir Personnalité", action: "Menu → Personnalité", page: "Personality" },
            { step: 2, title: "Ajuster le Ratio", action: "Modifiez Logique:Conscience selon besoin" },
            { step: 3, title: "Big Five", action: "Configurez les 5 traits de personnalité" },
            { step: 4, title: "Philosophie", action: "Choisissez les influences philosophiques" },
            { step: 5, title: "Sauvegarder Profil", action: "Créez un profil pour réutilisation" }
          ]
        }
      ]
    },

    en: {
      title: "Interactive Tutorials",
      subtitle: "Learn step-by-step with practical guides",
      
      tutorials: [
        {
          id: "first-conversation",
          title: "First Conversation",
          icon: MessageSquare,
          duration: "5 min",
          difficulty: "Beginner",
          color: "purple",
          description: "Start your first conversation with Druide Omega and discover the Thinking Engine",
          steps: [
            { step: 1, title: "Open Chat", action: "Click 'Chat' in menu", page: "Chat" },
            { step: 2, title: "First Question", action: "Ask a question or choose a suggestion" },
            { step: 3, title: "Observe Thinking", action: "Watch AI analyze your question" },
            { step: 4, title: "Read Response", action: "Explore detailed response with metadata" },
            { step: 5, title: "Continue", action: "Ask a follow-up question to deepen" }
          ]
        },
        {
          id: "voice-interaction",
          title: "Voice Interaction",
          icon: Mic,
          duration: "7 min",
          difficulty: "Intermediate",
          color: "green",
          description: "Learn to use voice modes for hands-free experience",
          steps: [
            { step: 1, title: "Access Voice Room", action: "Menu → Voice Room", page: "VoiceRoom" },
            { step: 2, title: "Allow Microphone", action: "Accept microphone access" },
            { step: 3, title: "First Voice Message", action: "Click and speak naturally" },
            { step: 4, title: "Generate Image", action: "Say 'Generate an image of...'" },
            { step: 5, title: "Explore Voice Live", action: "Try continuous conversational mode", page: "VoiceLive" }
          ]
        },
        {
          id: "memory-system",
          title: "Memory System",
          icon: Database,
          duration: "10 min",
          difficulty: "Intermediate",
          color: "indigo",
          description: "Master cross-modal memory system and knowledge graph",
          steps: [
            { step: 1, title: "Access Memories", action: "Menu → Memory", page: "Memory" },
            { step: 2, title: "Explore Memories", action: "Filter by modality, tags or importance" },
            { step: 3, title: "Memory Graph", action: "Activate graph view to see links" },
            { step: 4, title: "Recall Quiz", action: "Test your retention with active quiz" },
            { step: 5, title: "Related Memories", action: "Click a memory to see connections" }
          ]
        },
        {
          id: "knowledge-base",
          title: "Knowledge Base",
          icon: BookOpen,
          duration: "8 min",
          difficulty: "Advanced",
          color: "blue",
          description: "Upload and manage your documents to personalize AI",
          steps: [
            { step: 1, title: "Open KB", action: "Menu → Knowledge Base", page: "Knowledge" },
            { step: 2, title: "Upload Document", action: "Click 'Upload' and choose file" },
            { step: 3, title: "Wait for Extraction", action: "AI automatically extracts facts" },
            { step: 4, title: "Activate/Deactivate", action: "Control which sources are used" },
            { step: 5, title: "Auto Pruning", action: "Clean up obsolete sources" }
          ]
        },
        {
          id: "consciousness-config",
          title: "Consciousness Configuration",
          icon: Brain,
          duration: "12 min",
          difficulty: "Advanced",
          color: "purple",
          description: "Customize AI consciousness and personality",
          steps: [
            { step: 1, title: "Open Personality", action: "Menu → Personality", page: "Personality" },
            { step: 2, title: "Adjust Ratio", action: "Modify Logic:Consciousness as needed" },
            { step: 3, title: "Big Five", action: "Configure 5 personality traits" },
            { step: 4, title: "Philosophy", action: "Choose philosophical influences" },
            { step: 5, title: "Save Profile", action: "Create profile for reuse" }
          ]
        }
      ]
    }
  };

  const t = content[language === 'en' ? 'en' : 'fr'];

  const colorMap = {
    purple: "from-purple-500 to-indigo-600",
    green: "from-green-500 to-emerald-600",
    indigo: "from-indigo-500 to-purple-600",
    blue: "from-blue-500 to-cyan-600"
  };

  const difficultyColors = {
    "Débutant": "bg-green-100 text-green-700",
    "Beginner": "bg-green-100 text-green-700",
    "Intermédiaire": "bg-blue-100 text-blue-700",
    "Intermediate": "bg-blue-100 text-blue-700",
    "Avancé": "bg-purple-100 text-purple-700",
    "Advanced": "bg-purple-100 text-purple-700"
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 py-4 sm:py-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.title}</h1>
              <p className="text-sm sm:text-base text-slate-600">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid lg:grid-cols-2 gap-6">
            {t.tutorials.map((tutorial, idx) => {
              const Icon = tutorial.icon;
              return (
                <motion.div
                  key={tutorial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${colorMap[tutorial.color]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{tutorial.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className={difficultyColors[tutorial.difficulty]}>
                            {tutorial.difficulty}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tutorial.duration}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">{tutorial.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4 flex-1">
                      {tutorial.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 text-sm mb-1">{step.title}</h4>
                            <p className="text-xs text-slate-600">{step.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {tutorial.steps[0].page && (
                      <Button
                        onClick={() => navigateTo(tutorial.steps[0].page)}
                        className={`w-full bg-gradient-to-r ${colorMap[tutorial.color]}`}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        {language === 'en' ? "Start Tutorial" : "Commencer"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}