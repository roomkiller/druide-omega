/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Layout Component (Professional Navigation + Testimonials)  ║
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
  FileText,
  Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    author: "Dr. Sophie Martin",
    role: "Chercheuse en IA",
    content: "L'architecture de conscience neurobiologique est révolutionnaire. Druide Omega redéfinit ce qu'une IA peut être.",
    rating: 5
  },
  {
    author: "Marc Dubois",
    role: "Chef de Projet Tech",
    content: "La persistance cross-modale et la mémoire contextuelle changent complètement l'expérience utilisateur.",
    rating: 5
  },
  {
    author: "Alice Lemoine",
    role: "Consultante Innovation",
    content: "Les 9 intelligences de Gardner permettent une interaction vraiment personnalisée. Impressionnant.",
    rating: 5
  }
];

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (url) => {
    window.location.href = url;
    setSidebarOpen(false);
  };

  const NAV_ITEMS = [
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
    
    { 
      label: "9 Intelligences", 
      icon: Lightbulb, 
      url: createPageUrl("Intelligences"), 
      color: "hover:bg-amber-50 hover:text-amber-700",
      tooltip: "Navigation par type d'intelligence (Gardner)"
    },

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
        </div>

        {/* Testimonials Section */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="px-3 pb-3 flex items-center gap-2">
            <Quote className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Témoignages
            </h3>
          </div>
          
          <div className="space-y-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200/50">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 mb-3 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="text-xs">
                  <p className="font-semibold text-slate-900">{testimonial.author}</p>
                  <p className="text-slate-500">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
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