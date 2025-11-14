/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Layout Component (Optimized Navigation)                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LanguageProvider, useLanguage } from "@/components/utils/LanguageContext";
import { ConsciousnessHubProvider } from "@/components/system/ConsciousnessHub";
import ServicePersistence from "@/components/system/ServicePersistence";
import LanguageSelector from "@/components/LanguageSelector";
import Tooltip from "@/components/ui/Tooltip";
import Logo from "@/components/branding/Logo";
import QRCodeCard from "@/components/branding/QRCodeCard";
import { 
  MessageSquare, 
  Plus, 
  Menu, 
  X, 
  Brain, 
  Database, 
  BookOpen, 
  Settings, 
  Star, 
  Radio, 
  Image as ImageIcon, 
  Zap, 
  Infinity, 
  Newspaper, 
  Heart,
  Home,
  Mic,
  Lightbulb,
  TrendingUp,
  Network,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list('-last_message_at', 8),
  });

  const navigate = (url) => {
    window.location.href = url;
    setSidebarOpen(false);
  };

  const NAV_ITEMS = [
    // Core Actions
    { 
      label: t('nav.home'), 
      icon: Home, 
      url: createPageUrl("Home"), 
      color: "hover:bg-purple-50 hover:text-purple-700",
      tooltip: "Retour à l'accueil"
    },
    { 
      label: t('nav.newConversation'), 
      icon: Plus, 
      url: createPageUrl("Chat"), 
      color: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white",
      tooltip: "Nouvelle conversation multi-capacités",
      primary: true
    },
    
    // Intelligences
    { 
      label: "9 Intelligences", 
      icon: Lightbulb, 
      url: createPageUrl("Intelligences"), 
      color: "hover:bg-amber-50 hover:text-amber-700",
      tooltip: "Navigation par type d'intelligence (Gardner)"
    },

    // Interactions
    { 
      label: "Vocal Manuel", 
      icon: Radio, 
      url: createPageUrl("VoiceRoom"), 
      color: "hover:bg-green-50 hover:text-green-700",
      tooltip: "Conversation vocale avec contrôles"
    },
    { 
      label: "Vocal Auto", 
      icon: Mic, 
      url: createPageUrl("VoiceLive"), 
      color: "hover:bg-blue-50 hover:text-blue-700",
      tooltip: "Mode vocal automatique"
    },
    { 
      label: t('nav.visualGallery'), 
      icon: ImageIcon, 
      url: createPageUrl("VisualGallery"), 
      color: "hover:bg-pink-50 hover:text-pink-700",
      tooltip: "Galerie d'images et diagrammes"
    },

    // Consciousness & Memory
    { 
      label: t('nav.consciousness'), 
      icon: Brain, 
      url: createPageUrl("Consciousness"), 
      color: "hover:bg-purple-50 hover:text-purple-700",
      tooltip: "Flux de conscience de l'IA"
    },
    { 
      label: t('nav.memory'), 
      icon: Database, 
      url: createPageUrl("Memory"), 
      color: "hover:bg-indigo-50 hover:text-indigo-700",
      tooltip: "Mémoire cross-modale persistante"
    },
    { 
      label: t('nav.favorites'), 
      icon: Star, 
      url: createPageUrl("Favorites"), 
      color: "hover:bg-yellow-50 hover:text-yellow-700",
      tooltip: "Contenus favoris"
    },

    // Knowledge & Intelligence
    { 
      label: t('nav.knowledge'), 
      icon: BookOpen, 
      url: createPageUrl("Knowledge"), 
      color: "hover:bg-blue-50 hover:text-blue-700",
      tooltip: "Base de connaissances"
    },
    { 
      label: t('nav.enrichment'), 
      icon: Zap, 
      url: createPageUrl("KnowledgeEnrichment"), 
      color: "hover:bg-cyan-50 hover:text-cyan-700",
      tooltip: "Enrichissement auto des domaines"
    },
    { 
      label: t('nav.briefings'), 
      icon: Newspaper, 
      url: createPageUrl("DailyBriefing"), 
      color: "hover:bg-indigo-50 hover:text-indigo-700",
      tooltip: "Briefings quotidiens"
    },

    // System
    { 
      label: t('nav.neuralSystem'), 
      icon: Network, 
      url: createPageUrl("NeuralSystem"), 
      color: "hover:bg-cyan-50 hover:text-cyan-700",
      tooltip: "Architecture neuronale"
    },
    { 
      label: t('nav.evolution'), 
      icon: Infinity, 
      url: createPageUrl("ConsciousnessEvolution"), 
      color: "hover:bg-rose-50 hover:text-rose-700",
      tooltip: "Évolution de la conscience"
    },
    { 
      label: t('nav.emotionalJournal'), 
      icon: Heart, 
      url: createPageUrl("EmotionalJournal"), 
      color: "hover:bg-pink-50 hover:text-pink-700",
      tooltip: "Journal émotionnel de l'IA"
    },

    // Configuration
    { 
      label: "Documentation", 
      icon: FileText, 
      url: createPageUrl("Documentation"), 
      color: "hover:bg-slate-50 hover:text-slate-700",
      tooltip: "Documentation complète et légale"
    },
    { 
      label: t('nav.guide'), 
      icon: BookOpen, 
      url: createPageUrl("Guide"), 
      color: "hover:bg-blue-50 hover:text-blue-700",
      tooltip: "Guide d'utilisation"
    },
    { 
      label: t('nav.personality'), 
      icon: Settings, 
      url: createPageUrl("Personality"), 
      color: "hover:bg-emerald-50 hover:text-emerald-700",
      tooltip: "Configurer la personnalité IA"
    },
    { 
      label: t('nav.admin'), 
      icon: Settings, 
      url: createPageUrl("Admin"), 
      color: "hover:bg-red-50 hover:text-red-700",
      tooltip: "Administration (accès restreint)"
    }
  ];

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-slate-200/60 flex-shrink-0">
        <div 
          className="flex flex-col items-center mb-6 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={() => navigate(createPageUrl("Home"))}
        >
          <Logo size="nav" animate={true} />
          <div className="text-center mt-3">
            <h1 className="text-xl font-bold text-slate-900">Druide Omega</h1>
            <p className="text-xs text-slate-500">{t('home.title')}</p>
          </div>
        </div>
        
        <LanguageSelector />
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <Tooltip key={item.label} content={item.tooltip} position="right">
              <Button
                onClick={() => navigate(item.url)}
                variant={item.primary ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start ${item.color} ${item.primary ? 'shadow-lg shadow-purple-500/30 mb-2' : ''}`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            </Tooltip>
          ))}

          {conversations.length > 0 && (
            <>
              <div className="my-4 border-t border-slate-200" />
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t('nav.recentConversations')}
                </h3>
              </div>
            </>
          )}
        </div>

        {conversations.length > 0 && (
          <div className="space-y-2 mt-2 pb-4">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                to={`${createPageUrl("Chat")}?id=${conv.id}`}
                onClick={() => setSidebarOpen(false)}
                className={`block p-3 rounded-xl transition-all duration-200 group ${
                  location.search.includes(conv.id)
                    ? "bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 mt-1 text-slate-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {conv.last_message_at && format(new Date(conv.last_message_at), "d MMM", { locale: fr })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t border-slate-200/60 flex-shrink-0">
        <QRCodeCard compact={true} />
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 overflow-hidden">
      <style>{`
        :root {
          --primary: 240 5.9% 10%;
          --primary-foreground: 0 0% 98%;
          --accent: 262 83% 58%;
          --accent-light: 262 90% 95%;
        }
      `}</style>

      <aside className="hidden lg:flex lg:flex-col w-80 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-sm">
        {sidebarContent}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(createPageUrl("Home"))}>
                <Logo size="small" animate={true} />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Druide Omega</h1>
                  <p className="text-xs text-slate-500">{t('home.title')}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Logo size="small" animate={false} />
              <h1 className="text-lg font-bold text-slate-900">Druide Omega</h1>
            </div>
            <LanguageSelector variant="ghost" />
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden">
          <ServicePersistence currentPage={currentPageName} />
          {children}
        </div>
      </main>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <LanguageProvider>
      <ConsciousnessHubProvider>
        <LayoutContent children={children} currentPageName={currentPageName} />
      </ConsciousnessHubProvider>
    </LanguageProvider>
  );
}