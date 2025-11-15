/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Mobile-Optimized Layout                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LanguageProvider, useLanguage } from "@/components/utils/LanguageContext";
import { ConsciousnessHubProvider } from "@/components/system/ConsciousnessHub";
import ServicePersistence from "@/components/system/ServicePersistence";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
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
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

function LayoutContent({ children, currentPageName }) {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NAV_ITEMS = [
    { 
      label: t('nav.home'), 
      icon: Home, 
      url: "Home", 
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      label: t('nav.newConversation'), 
      icon: Plus, 
      url: "Chat", 
      gradient: "from-purple-600 to-indigo-600",
      primary: true
    },
    { 
      label: t('nav.intelligences'), 
      icon: Lightbulb, 
      url: "Intelligences", 
      gradient: "from-amber-500 to-orange-500"
    },
    { 
      label: t('nav.voiceRoom'), 
      icon: Radio, 
      url: "VoiceRoom", 
      gradient: "from-green-500 to-emerald-500"
    },
    { 
      label: t('nav.voiceLive'), 
      icon: Mic, 
      url: "VoiceLive", 
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      label: t('nav.visualGallery'), 
      icon: ImageIcon, 
      url: "VisualGallery", 
      gradient: "from-pink-500 to-rose-500"
    },
    { 
      label: t('consciousness.title'), 
      icon: Brain, 
      url: "Consciousness", 
      gradient: "from-purple-500 to-violet-500"
    },
    { 
      label: "Boussole Morale", 
      icon: Scale, 
      url: "MoralCompass", 
      gradient: "from-indigo-500 to-blue-500"
    },
    { 
      label: t('memory.title'), 
      icon: Database, 
      url: "Memory", 
      gradient: "from-indigo-500 to-purple-500"
    },
    { 
      label: t('neural.title'), 
      icon: Network, 
      url: "NeuralSystem", 
      gradient: "from-cyan-500 to-blue-500"
    },
    { 
      label: "Décisions", 
      icon: Infinity, 
      url: "DecisionArchive", 
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      label: t('knowledge.title'), 
      icon: BookOpen, 
      url: "Knowledge", 
      gradient: "from-blue-500 to-indigo-500"
    },
    { 
      label: t('briefings.title'), 
      icon: Newspaper, 
      url: "DailyBriefing", 
      gradient: "from-indigo-500 to-violet-500"
    },
    { 
      label: t('nav.favorites'), 
      icon: Star, 
      url: "Favorites", 
      gradient: "from-yellow-500 to-amber-500"
    },
    { 
      label: t('personality.title'), 
      icon: Settings, 
      url: "Personality", 
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  const navigate = (url) => {
    window.location.href = createPageUrl(url);
    setSidebarOpen(false);
  };

  const isActive = (url) => {
    return currentPageName === url;
  };

  return (
    <AnalyticsProvider currentPage={currentPageName}>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 overflow-hidden">
        <style>{`
          :root {
            --primary: 240 5.9% 10%;
            --primary-foreground: 0 0% 98%;
            --accent: 262 83% 58%;
            --accent-light: 262 90% 95%;
          }
          
          @media (max-width: 768px) {
            .mobile-safe-area {
              padding-bottom: env(safe-area-inset-bottom);
            }
          }
        `}</style>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-72 bg-white/90 backdrop-blur-xl border-r border-slate-200/60 shadow-lg">
          <div className="p-5 border-b border-slate-200/60 flex-shrink-0">
            <div 
              className="flex flex-col items-center mb-4 cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => navigate("Home")}
            >
              <Logo size="small" animate={true} />
              <div className="text-center mt-2">
                <h1 className="text-lg font-bold text-slate-900">Druide Omega</h1>
                <p className="text-xs text-slate-500">{t('home.title')}</p>
              </div>
            </div>
            <LanguageSelector />
          </div>

          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                
                return (
                  <Tooltip key={item.label} content={item.label} position="right">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => navigate(item.url)}
                        variant={active ? "default" : "ghost"}
                        size="sm"
                        className={`w-full justify-start group relative overflow-hidden ${
                          active 
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                            : 'hover:bg-slate-50'
                        } ${item.primary && !active ? 'border-2 border-purple-200' : ''}`}
                      >
                        <Icon className={`w-4 h-4 mr-2 ${active ? '' : 'text-slate-600 group-hover:text-slate-900'}`} />
                        <span className={`text-sm ${active ? 'font-semibold' : ''}`}>{item.label}</span>
                      </Button>
                    </motion.div>
                  </Tooltip>
                );
              })}
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-slate-200/60 flex-shrink-0">
            <QRCodeCard compact={true} />
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col lg:hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-slate-200/60 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("Home")}>
                    <Logo size="small" animate={true} />
                    <div>
                      <h1 className="text-lg font-bold text-slate-900">Druide Omega</h1>
                      <p className="text-xs text-slate-500">{t('home.title')}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-3 border-b border-slate-200/60">
                  <LanguageSelector />
                </div>

                <ScrollArea className="flex-1 px-3 py-3">
                  <div className="space-y-1.5">
                    {NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.url);
                      
                      return (
                        <motion.div 
                          key={item.label}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => navigate(item.url)}
                            variant={active ? "default" : "ghost"}
                            size="sm"
                            className={`w-full justify-start ${
                              active 
                                ? `bg-gradient-to-r ${item.gradient} text-white shadow-md` 
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <Icon className={`w-4 h-4 mr-3 ${active ? '' : 'text-slate-600'}`} />
                            <span className="text-sm">{item.label}</span>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>

                <div className="p-3 border-t border-slate-200/60 mobile-safe-area">
                  <QRCodeCard compact={true} />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <header className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200/60 px-3 py-2.5 flex-shrink-0 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(true)}
                className="flex-shrink-0"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
                <Logo size="small" animate={false} />
                <h1 className="text-base font-bold text-slate-900 truncate">Druide Omega</h1>
              </div>
              
              <div className="flex-shrink-0">
                <LanguageSelector variant="ghost" />
              </div>
            </div>
          </header>
          
          {/* Page Content */}
          <div className="flex-1 overflow-hidden">
            <ServicePersistence currentPage={currentPageName} />
            {children}
          </div>

          {/* Mobile Bottom Navigation Bar */}
          <nav className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/60 mobile-safe-area sticky bottom-0 z-30 shadow-lg">
            <div className="flex items-center justify-around px-2 py-2">
              {[
                { icon: Home, url: "Home", label: "Accueil" },
                { icon: Plus, url: "Chat", label: "Chat", highlight: true },
                { icon: Brain, url: "Consciousness", label: "Conscience" },
                { icon: BookOpen, url: "Knowledge", label: "Savoirs" },
                { icon: Settings, url: "Personality", label: "Config" }
              ].map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                
                return (
                  <motion.button
                    key={item.url}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(item.url)}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                      active 
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                        : item.highlight 
                          ? 'bg-gradient-to-br from-purple-50 to-indigo-50 text-purple-600'
                          : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'drop-shadow-md' : ''}`} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </nav>
        </main>
      </div>
    </AnalyticsProvider>
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