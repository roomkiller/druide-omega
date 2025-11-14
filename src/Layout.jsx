/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Layout Component (with Consciousness Hub)                  ║
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
  ChevronDown,
  ChevronRight,
  Home,
  Layers,
  Network,
  Mic,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

function LayoutContent({ children, currentPageName }) {
  const location = useLocation();
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    intelligences: true,
    interactions: false,
    consciousness: false,
    knowledge: false
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list('-last_message_at'),
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navigate = (url) => {
    window.location.href = url;
    setSidebarOpen(false);
  };

  const NavSection = ({ title, icon: Icon, items, sectionKey, alwaysExpanded = false }) => {
    const isExpanded = alwaysExpanded || expandedSections[sectionKey];
    
    return (
      <div className="mb-3">
        {!alwaysExpanded && (
          <button
            onClick={() => toggleSection(sectionKey)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span>{title}</span>
            </div>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={alwaysExpanded ? "space-y-1" : "space-y-1 ml-3 mt-1"}>
                {items.map((item) => (
                  <Tooltip key={item.label} content={item.tooltip} position="right">
                    <Button
                      onClick={() => navigate(item.url)}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start ${item.color || 'hover:bg-slate-100'}`}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  </Tooltip>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-slate-200/60">
        <div 
          className="flex items-center gap-3 mb-6 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={() => navigate(createPageUrl("Home"))}
        >
          <Logo size="small" animate={true} />
          <div>
            <h1 className="text-xl font-bold text-slate-900">Druide_Omega</h1>
            <p className="text-xs text-slate-500">{t('home.title')}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <LanguageSelector />
        </div>
        
        <div className="space-y-2">
          <Tooltip content="Retour à la page d'accueil" position="right">
            <Button 
              onClick={() => navigate(createPageUrl("Home"))}
              variant="outline"
              className="w-full border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-700"
            >
              <Home className="w-4 h-4 mr-2" />
              {t('nav.home')}
            </Button>
          </Tooltip>

          <Tooltip content="Démarrer une nouvelle conversation avec toutes les capacités" position="right">
            <Button 
              onClick={() => navigate(createPageUrl("Chat"))}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('nav.newConversation')}
            </Button>
          </Tooltip>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          <NavSection
            title="Intelligences Multiples"
            icon={Lightbulb}
            sectionKey="intelligences"
            items={[
              { 
                label: "Explorer par Intelligence", 
                icon: Lightbulb, 
                url: createPageUrl("Intelligences"), 
                color: "hover:bg-amber-50 hover:text-amber-700",
                tooltip: "9 types d'intelligence pour guider vos conversations (Gardner)"
              }
            ]}
          />

          <div className="my-4 border-t border-slate-200" />

          <NavSection
            title="Interactions"
            icon={MessageSquare}
            sectionKey="interactions"
            items={[
              { 
                label: t('nav.voiceRoom'), 
                icon: Radio, 
                url: createPageUrl("VoiceRoom"), 
                color: "hover:bg-green-50 hover:text-green-700",
                tooltip: "Conversation vocale complète avec contrôles manuels"
              },
              { 
                label: "Vocal Live Auto", 
                icon: Mic, 
                url: createPageUrl("VoiceLive"), 
                color: "hover:bg-blue-50 hover:text-blue-700",
                tooltip: "Mode vocal automatique - activation par la voix uniquement"
              },
              { 
                label: t('nav.visualGallery'), 
                icon: ImageIcon, 
                url: createPageUrl("VisualGallery"), 
                color: "hover:bg-pink-50 hover:text-pink-700",
                tooltip: "Galerie d'images générées et analysées"
              }
            ]}
          />

          <NavSection
            title={t('nav.consciousness')}
            icon={Brain}
            sectionKey="consciousness"
            items={[
              { 
                label: t('nav.consciousness'), 
                icon: Brain, 
                url: createPageUrl("Consciousness"), 
                color: "hover:bg-purple-50 hover:text-purple-700",
                tooltip: "Flux de conscience et pensées spontanées de l'IA"
              },
              { 
                label: t('nav.evolution'), 
                icon: Infinity, 
                url: createPageUrl("ConsciousnessEvolution"), 
                color: "hover:bg-rose-50 hover:text-rose-700",
                tooltip: "Historique d'évolution de la conscience artificielle"
              },
              { 
                label: t('nav.neuralSystem'), 
                icon: Network, 
                url: createPageUrl("NeuralSystem"), 
                color: "hover:bg-cyan-50 hover:text-cyan-700",
                tooltip: "Architecture neuronale modulaire et performances"
              },
              { 
                label: t('nav.favorites'), 
                icon: Star, 
                url: createPageUrl("Favorites"), 
                color: "hover:bg-yellow-50 hover:text-yellow-700",
                tooltip: "Pensées et contenus favoris sauvegardés"
              },
              { 
                label: t('nav.emotionalJournal'), 
                icon: Heart, 
                url: createPageUrl("EmotionalJournal"), 
                color: "hover:bg-pink-50 hover:text-pink-700",
                tooltip: "Journal des réactions émotionnelles de l'IA"
              }
            ]}
          />

          <NavSection
            title={t('nav.knowledge')}
            icon={Database}
            sectionKey="knowledge"
            items={[
              { 
                label: t('nav.memory'), 
                icon: Database, 
                url: createPageUrl("Memory"), 
                color: "hover:bg-indigo-50 hover:text-indigo-700",
                tooltip: "Système de mémoire persistante cross-modale"
              },
              { 
                label: t('nav.knowledge'), 
                icon: BookOpen, 
                url: createPageUrl("Knowledge"), 
                color: "hover:bg-blue-50 hover:text-blue-700",
                tooltip: "Base de connaissances uploadable (PDF, textes, URLs)"
              },
              { 
                label: t('nav.fusion'), 
                icon: Brain, 
                url: createPageUrl("KnowledgeFusion"), 
                color: "hover:bg-purple-50 hover:text-purple-700",
                tooltip: "Fusion et analyse comparative de connaissances"
              },
              { 
                label: t('nav.enrichment'), 
                icon: Zap, 
                url: createPageUrl("KnowledgeEnrichment"), 
                color: "hover:bg-cyan-50 hover:text-cyan-700",
                tooltip: "Enrichissement automatique des domaines de connaissance"
              },
              { 
                label: t('nav.briefings'), 
                icon: Newspaper, 
                url: createPageUrl("DailyBriefing"), 
                color: "hover:bg-indigo-50 hover:text-indigo-700",
                tooltip: "Briefings intelligents quotidiens synthétisés"
              }
            ]}
          />

          <div className="my-4 border-t border-slate-200" />

          <NavSection
            title=""
            icon={Layers}
            sectionKey="config"
            alwaysExpanded={true}
            items={[
              { 
                label: t('nav.guide'), 
                icon: BookOpen, 
                url: createPageUrl("Guide"), 
                color: "hover:bg-blue-50 hover:text-blue-700",
                tooltip: "Guide d'utilisation complet de Druide_Omega"
              },
              { 
                label: t('nav.personality'), 
                icon: Settings, 
                url: createPageUrl("Personality"), 
                color: "hover:bg-emerald-50 hover:text-emerald-700",
                tooltip: "Configurer la personnalité et les traits de l'IA"
              },
              { 
                label: t('nav.admin'), 
                icon: Settings, 
                url: createPageUrl("Admin"), 
                color: "hover:bg-red-50 hover:text-red-700",
                tooltip: "Panneau d'administration (accès restreint)"
              }
            ]}
          />

          {conversations.length > 0 && (
            <>
              <div className="my-4 border-t border-slate-200" />
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {t('nav.recentConversations')}
                </h3>
              </div>
            </>
          )}
        </div>

        <div className="space-y-2 mt-2">
          {conversations.slice(0, 8).map((conv) => (
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
      </ScrollArea>
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

      <aside className="hidden lg:flex lg:flex-col w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-sm">
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
                  <h1 className="text-xl font-bold text-slate-900">Druide_Omega</h1>
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
              <h1 className="text-lg font-bold text-slate-900">Druide_Omega</h1>
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