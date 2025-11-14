/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Layout Component                                           ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  MessageSquare, 
  Plus, 
  Sparkles, 
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
  Network
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    interactions: true,
    consciousness: false,
    knowledge: false
  });

  const { data: conversations = [], refetch } = useQuery({
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
                  <Button
                    key={item.label}
                    onClick={() => navigate(item.url)}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start ${item.color || 'hover:bg-slate-100'}`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
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
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Druide_Omega</h1>
            <p className="text-xs text-slate-500">IA Universelle Bienveillante</p>
          </div>
        </div>
        
        {/* Actions principales */}
        <div className="space-y-2">
          <Button 
            onClick={() => navigate(createPageUrl("Home"))}
            variant="outline"
            className="w-full border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-700"
          >
            <Home className="w-4 h-4 mr-2" />
            Accueil
          </Button>

          <Button 
            onClick={() => navigate(createPageUrl("Chat"))}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {/* Section Interactions */}
          <NavSection
            title="Interactions"
            icon={MessageSquare}
            sectionKey="interactions"
            items={[
              { label: "Salle Vocale", icon: Radio, url: createPageUrl("VoiceRoom"), color: "hover:bg-green-50 hover:text-green-700" },
              { label: "Galerie Visuelle", icon: ImageIcon, url: createPageUrl("VisualGallery"), color: "hover:bg-pink-50 hover:text-pink-700" }
            ]}
          />

          {/* Section Conscience */}
          <NavSection
            title="Conscience & Évolution"
            icon={Brain}
            sectionKey="consciousness"
            items={[
              { label: "Flux de Conscience", icon: Brain, url: createPageUrl("Consciousness"), color: "hover:bg-purple-50 hover:text-purple-700" },
              { label: "Évolution Conscience", icon: Infinity, url: createPageUrl("ConsciousnessEvolution"), color: "hover:bg-rose-50 hover:text-rose-700" },
              { label: "Système Neuronal", icon: Network, url: createPageUrl("NeuralSystem"), color: "hover:bg-cyan-50 hover:text-cyan-700" },
              { label: "Moments Favoris", icon: Star, url: createPageUrl("Favorites"), color: "hover:bg-yellow-50 hover:text-yellow-700" },
              { label: "Journal Émotionnel", icon: Heart, url: createPageUrl("EmotionalJournal"), color: "hover:bg-pink-50 hover:text-pink-700" }
            ]}
          />

          {/* Section Connaissances */}
          <NavSection
            title="Connaissances"
            icon={Database}
            sectionKey="knowledge"
            items={[
              { label: "Système de Mémoire", icon: Database, url: createPageUrl("Memory"), color: "hover:bg-indigo-50 hover:text-indigo-700" },
              { label: "Base de Connaissances", icon: BookOpen, url: createPageUrl("Knowledge"), color: "hover:bg-blue-50 hover:text-blue-700" },
              { label: "Fusion de Connaissances", icon: Sparkles, url: createPageUrl("KnowledgeFusion"), color: "hover:bg-purple-50 hover:text-purple-700" },
              { label: "Enrichissement Auto", icon: Zap, url: createPageUrl("KnowledgeEnrichment"), color: "hover:bg-cyan-50 hover:text-cyan-700" },
              { label: "Briefings Intelligents", icon: Newspaper, url: createPageUrl("DailyBriefing"), color: "hover:bg-indigo-50 hover:text-indigo-700" }
            ]}
          />

          {/* Séparateur */}
          <div className="my-4 border-t border-slate-200" />

          {/* Configuration - toujours visible */}
          <NavSection
            title=""
            icon={Layers}
            sectionKey="config"
            alwaysExpanded={true}
            items={[
              { label: "Guide", icon: BookOpen, url: createPageUrl("Guide"), color: "hover:bg-blue-50 hover:text-blue-700" },
              { label: "Personnalité", icon: Settings, url: createPageUrl("Personality"), color: "hover:bg-emerald-50 hover:text-emerald-700" },
              { label: "Administration", icon: Settings, url: createPageUrl("Admin"), color: "hover:bg-red-50 hover:text-red-700" }
            ]}
          />

          {/* Conversations récentes */}
          {conversations.length > 0 && (
            <>
              <div className="my-4 border-t border-slate-200" />
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Conversations récentes
                </h3>
              </div>
            </>
          )}
        </div>

        {/* Liste des conversations */}
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

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-sm">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(createPageUrl("Home"))}>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Druide_Omega</h1>
                  <p className="text-xs text-slate-500">IA Universelle</p>
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-slate-900">Druide_Omega</h1>
            </div>
            <div className="w-10" />
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE - Utilisation non autorisée interdite
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */