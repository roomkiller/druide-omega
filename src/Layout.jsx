
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
import { MessageSquare, Plus, Sparkles, Menu, X, Brain, Database, BookOpen, Settings, Star, Radio, Image as ImageIcon, Zap, Infinity, Newspaper, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: conversations = [], refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.Conversation.list('-last_message_at'),
  });

  const handleNewChat = () => {
    window.location.href = createPageUrl("Chat");
    setSidebarOpen(false);
  };

  const handleConsciousness = () => {
    window.location.href = createPageUrl("Consciousness");
    setSidebarOpen(false);
  };

  const handleMemory = () => {
    window.location.href = createPageUrl("Memory");
    setSidebarOpen(false);
  };

  const handleKnowledge = () => {
    window.location.href = createPageUrl("Knowledge");
    setSidebarOpen(false);
  };

  const handlePersonality = () => {
    window.location.href = createPageUrl("Personality");
    setSidebarOpen(false);
  };

  const handleFavorites = () => {
    window.location.href = createPageUrl("Favorites");
    setSidebarOpen(false);
  };

  const handleVoiceRoom = () => {
    window.location.href = createPageUrl("VoiceRoom");
    setSidebarOpen(false);
  };

  const handleVisualGallery = () => {
    window.location.href = createPageUrl("VisualGallery");
    setSidebarOpen(false);
  };

  const handleEnrichment = () => {
    window.location.href = createPageUrl("KnowledgeEnrichment");
    setSidebarOpen(false);
  };

  const handleConsciousnessEvolution = () => {
    window.location.href = createPageUrl("ConsciousnessEvolution");
    setSidebarOpen(false);
  };

  const handleDailyBriefing = () => {
    window.location.href = createPageUrl("DailyBriefing");
    setSidebarOpen(false);
  };

  const handleEmotionalJournal = () => {
    window.location.href = createPageUrl("EmotionalJournal");
    setSidebarOpen(false);
  };

  const handleHome = () => {
    window.location.href = createPageUrl("Home");
    setSidebarOpen(false);
  };

  const handleGuide = () => {
    window.location.href = createPageUrl("Guide");
    setSidebarOpen(false);
  };

  const handleAdmin = () => {
    window.location.href = createPageUrl("Admin");
    setSidebarOpen(false);
  };

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
        <div className="p-6 border-b border-slate-200/60">
          <div className="flex items-center gap-3 mb-6 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleHome}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Druide_Omega</h1>
              <p className="text-xs text-slate-500">IA Universelle Bienveillante</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={handleHome}
              variant="outline"
              className="w-full border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-700 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Accueil
            </Button>

            <Button 
              onClick={handleGuide}
              variant="outline"
              className="w-full border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 transition-all duration-300"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Guide d'Utilisation
            </Button>

            <Button 
              onClick={handleNewChat}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle conversation
            </Button>

            <Button 
              onClick={handleVoiceRoom}
              variant="outline"
              className="w-full border-green-200 hover:bg-green-50 hover:border-green-300 text-green-700 transition-all duration-300"
            >
              <Radio className="w-4 h-4 mr-2" />
              Salle Vocale
            </Button>
            
            <Button 
              onClick={handleConsciousness}
              variant="outline"
              className="w-full border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-700 transition-all duration-300"
            >
              <Brain className="w-4 h-4 mr-2" />
              Flux de Conscience
            </Button>

            <Button 
              onClick={handleConsciousnessEvolution}
              variant="outline"
              className="w-full border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-rose-700 transition-all duration-300"
            >
              <Infinity className="w-4 h-4 mr-2" />
              Évolution Conscience
            </Button>

            <Button 
              onClick={handleFavorites}
              variant="outline"
              className="w-full border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300 text-yellow-700 transition-all duration-300"
            >
              <Star className="w-4 h-4 mr-2" />
              Moments Favoris
            </Button>

            <Button 
              onClick={handleMemory}
              variant="outline"
              className="w-full border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-700 transition-all duration-300"
            >
              <Database className="w-4 h-4 mr-2" />
              Système de Mémoire
            </Button>

            <Button 
              onClick={handleKnowledge}
              variant="outline"
              className="w-full border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 transition-all duration-300"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Base de Connaissances
            </Button>

            <Button 
              onClick={handleEnrichment}
              variant="outline"
              className="w-full border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300 text-cyan-700 transition-all duration-300"
            >
              <Zap className="w-4 h-4 mr-2" />
              Enrichissement Auto
            </Button>

            <Button 
              onClick={handleDailyBriefing}
              variant="outline"
              className="w-full border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-700 transition-all duration-300"
            >
              <Newspaper className="w-4 h-4 mr-2" />
              Briefings Intelligents
            </Button>

            <Button 
              onClick={handleEmotionalJournal}
              variant="outline"
              className="w-full border-pink-200 hover:bg-pink-50 hover:border-pink-300 text-pink-700 transition-all duration-300"
            >
              <Heart className="w-4 h-4 mr-2" />
              Journal Émotionnel
            </Button>

            <Button 
              onClick={handleVisualGallery}
              variant="outline"
              className="w-full border-pink-200 hover:bg-pink-50 hover:border-pink-300 text-pink-700 transition-all duration-300"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Galerie Visuelle
            </Button>

            <Button 
              onClick={handlePersonality}
              variant="outline"
              className="w-full border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 text-emerald-700 transition-all duration-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Personnalité
            </Button>

            <Button 
              onClick={handleAdmin}
              variant="outline"
              className="w-full border-red-200 hover:bg-red-50 hover:border-red-300 text-red-700 transition-all duration-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Administration
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-2">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                to={`${createPageUrl("Chat")}?id=${conv.id}`}
                className={`block p-3 rounded-xl transition-all duration-200 group ${
                  location.search.includes(conv.id)
                    ? "bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/50"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 mt-1 text-slate-400 group-hover:text-purple-600 transition-colors" />
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
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-200/60">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 cursor-pointer" onClick={handleHome}>
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
              
              <div className="space-y-2">
                <Button 
                  onClick={handleHome}
                  variant="outline"
                  className="w-full border-purple-200 hover:bg-purple-50"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Accueil
                </Button>

                <Button 
                  onClick={handleGuide}
                  variant="outline"
                  className="w-full border-blue-200 hover:bg-blue-50"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Guide
                </Button>

                <Button 
                  onClick={handleNewChat}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle conversation
                </Button>

                <Button 
                  onClick={handleVoiceRoom}
                  variant="outline"
                  className="w-full border-green-200 hover:bg-green-50"
                >
                  <Radio className="w-4 h-4 mr-2" />
                  Salle Vocale
                </Button>
                
                <Button 
                  onClick={handleConsciousness}
                  variant="outline"
                  className="w-full border-purple-200 hover:bg-purple-50"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Flux de Conscience
                </Button>

                <Button 
                  onClick={handleConsciousnessEvolution}
                  variant="outline"
                  className="w-full border-rose-200 hover:bg-rose-50"
                >
                  <Infinity className="w-4 h-4 mr-2" />
                  Évolution Conscience
                </Button>

                <Button 
                  onClick={handleFavorites}
                  variant="outline"
                  className="w-full border-yellow-200 hover:bg-yellow-50"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Moments Favoris
                </Button>

                <Button 
                  onClick={handleMemory}
                  variant="outline"
                  className="w-full border-indigo-200 hover:bg-indigo-50"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Système de Mémoire
                </Button>

                <Button 
                  onClick={handleKnowledge}
                  variant="outline"
                  className="w-full border-blue-200 hover:bg-blue-50"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Base de Connaissances
                </Button>

                <Button 
                  onClick={handleEnrichment}
                  variant="outline"
                  className="w-full border-cyan-200 hover:bg-cyan-50"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Enrichissement Auto
                </Button>

                <Button 
                  onClick={handleDailyBriefing}
                  variant="outline"
                  className="w-full border-indigo-200 hover:bg-indigo-50"
                >
                  <Newspaper className="w-4 h-4 mr-2" />
                  Briefings Intelligents
                </Button>

                <Button 
                  onClick={handleEmotionalJournal}
                  variant="outline"
                  className="w-full border-pink-200 hover:bg-pink-50"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Journal Émotionnel
                </Button>

                <Button 
                  onClick={handleVisualGallery}
                  variant="outline"
                  className="w-full border-pink-200 hover:bg-pink-50"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Galerie Visuelle
                </Button>

                <Button 
                  onClick={handlePersonality}
                  variant="outline"
                  className="w-full border-emerald-200 hover:bg-emerald-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Personnalité
                </Button>

                <Button 
                  onClick={handleAdmin}
                  variant="outline"
                  className="w-full border-red-200 hover:bg-red-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Administration
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 px-3 py-4">
              <div className="space-y-2">
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
                      <MessageSquare className="w-4 h-4 mt-1 text-slate-400 group-hover:text-purple-600 transition-colors" />
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
