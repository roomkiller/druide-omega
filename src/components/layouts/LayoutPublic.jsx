/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Layout Public (Navigation Utilisateur)                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/components/utils/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import Logo from "@/components/branding/Logo";
import QRCodeCard from "@/components/branding/QRCodeCard";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Menu, X, Home, Radio, Lightbulb, Database, BookOpen,
  User, MapPin, HelpCircle, Gamepad,
  Globe, ExternalLink, PanelLeftClose, PanelLeft,
  MessageSquare, Zap, Sparkles, Microscope, Brain, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import ArchitectReturnLink from "@/components/security/ArchitectReturnLink";

export default function LayoutPublic({ children, currentPageName }) {
  const { t, language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const en = language === 'en';
  const NAV_ITEMS = [
    { label: t('nav.home'), icon: Home, url: "PublicHome", gradient: "from-purple-500 to-pink-500" },
    { label: t('nav.chat'), icon: Plus, url: "Chat", gradient: "from-purple-600 to-indigo-600", primary: true },
    { label: t('nav.voiceRoom'), icon: Radio, url: "VoiceRoom", gradient: "from-green-500 to-emerald-500" },
    { label: t('nav.intelligences'), icon: Lightbulb, url: "Intelligences", gradient: "from-amber-500 to-orange-500" },
    { label: t('memory.title'), icon: Database, url: "Memory", gradient: "from-indigo-500 to-purple-500" },
    { label: t('knowledge.title'), icon: BookOpen, url: "Knowledge", gradient: "from-blue-500 to-indigo-500" },
    { label: t('nav.games'), icon: Gamepad, url: "Games", gradient: "from-purple-500 to-pink-600" },
    { label: en ? 'AI Synthesis' : 'Synthèse IA', icon: Sparkles, url: "IntelligentSynthesis", gradient: "from-amber-500 to-orange-600" },
    { label: en ? 'Medical Research' : 'Recherche Médicale', icon: Microscope, url: "MedicalResearch", gradient: "from-red-500 to-pink-600" },
    { label: en ? 'Psychology' : 'Recherche Psychologie', icon: Brain, url: "PsychologyResearch", gradient: "from-indigo-500 to-purple-600" },
    { label: en ? 'Hidden Talents' : 'Talents Cachés', icon: Star, url: "HiddenTalents", gradient: "from-pink-500 to-rose-600" },
    { label: en ? 'Features' : 'Fonctionnalités', icon: Zap, url: "FeaturesOverview", gradient: "from-cyan-500 to-blue-600" },
    { label: en ? 'Prompt Guide' : 'Guide Prompts', icon: MessageSquare, url: "PromptGuide", gradient: "from-indigo-500 to-purple-600" },
    { label: t('nav.myProfile'), icon: User, url: "Profile", gradient: "from-cyan-500 to-blue-600" },
    { label: t('nav.userGuide'), icon: HelpCircle, url: "UserGuide", gradient: "from-pink-500 to-rose-600" },
    { label: t('nav.myPersonalPage'), icon: Globe, external: true, url: "https://azex.base44.app/", gradient: "from-cyan-500 to-blue-600" }
  ];

  // Seuls les liens externes passent par un handler ; tout le reste est un <Link>.
  const openExternal = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setSidebarOpen(false);
  };

  const isActive = (url) => currentPageName === url;

  const getQuebecBadge = () => {
    if (language === 'en') return 'Proudly from Quebec';
    if (language === 'es') return 'Orgullosamente de Quebec';
    if (language === 'de') return 'Stolz aus Quebec';
    if (language === 'zh') return '自豪来自魁北克';
    return 'Fièrement Québécois';
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:flex-col bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-xl transition-all duration-300 ${sidebarCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-72'}`}>
        <div className="card-padding border-b border-slate-200/60 flex-shrink-0 bg-gradient-to-br from-white to-purple-50/30">
          <Link to="/PublicHome" className="flex flex-col items-center mb-4 cursor-pointer hover:opacity-90 transition-opacity">
            <Logo size="small" animate={true} />
            <div className="text-center mt-2">
              <h1 className="text-lg font-bold text-slate-900 font-display">Druide Omega</h1>
              <Badge className="mt-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] px-2.5 py-0.5 flex items-center gap-1 w-fit mx-auto shadow-sm">
                <MapPin className="w-3 h-3" />
                {getQuebecBadge()}
              </Badge>
            </div>
          </Link>
          <LanguageSelector />
        </div>

        <div className="flex-1 overflow-y-auto px-3 page-padding-y">
          <div className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = !item.external && isActive(item.url);
              const linkClass = `w-full flex items-center text-sm transition-all duration-200 px-3 py-2 rounded-lg ${
                active
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg font-semibold`
                  : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium'
              } ${item.primary && !active ? 'border-2 border-purple-200 hover:border-purple-300' : ''}`;

              if (item.external) {
                return (
                  <button key={item.label} onClick={() => openExternal(item.url)} className={linkClass}>
                    <Icon className="w-4 h-4 mr-2.5 text-slate-600" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
                  </button>
                );
              }
              return (
                <Link key={item.label} to={createPageUrl(item.url)} className={linkClass}>
                  <Icon className={`w-4 h-4 mr-2.5 ${active ? 'drop-shadow-sm' : 'text-slate-600'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200/60">
            <ArchitectReturnLink />
          </div>
        </div>

        <div className="card-padding border-t border-slate-200/60 flex-shrink-0 bg-gradient-to-br from-pink-50/50 via-rose-50/50 to-purple-50/30">
          <QRCodeCard compact />
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
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white/98 backdrop-blur-xl shadow-2xl z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between card-padding border-b border-slate-200/60 bg-gradient-to-r from-purple-50 to-pink-50">
                <Link to="/PublicHome" className="flex items-center gap-2 cursor-pointer">
                  <Logo size="small" animate={true} />
                  <div>
                    <h1 className="text-base font-bold text-slate-900 font-display">Druide Omega</h1>
                    <Badge className="mt-0.5 bg-purple-500 text-white text-[9px] px-2 py-0.5 flex items-center gap-1 w-fit">
                      <MapPin className="w-2.5 h-2.5" />
                      {getQuebecBadge()}
                    </Badge>
                  </div>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-3 border-b border-slate-200/60">
                <LanguageSelector />
              </div>

              <div className="flex-1 overflow-y-auto px-3 page-padding-y">
                <div className="content-spacing">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = !item.external && isActive(item.url);
                    const linkClass = `w-full flex items-center text-sm min-h-[44px] touch-target px-3 py-2 rounded-lg transition-all duration-200 ${
                      active ? `bg-gradient-to-r ${item.gradient} text-white shadow-md font-semibold` : 'hover:bg-slate-50 font-medium'
                    }`;

                    if (item.external) {
                      return (
                        <button key={item.label} onClick={() => openExternal(item.url)} className={linkClass}>
                          <Icon className="w-4 h-4 mr-3 flex-shrink-0 text-slate-600" />
                          <span className="flex-1 text-left">{item.label}</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-2 opacity-60 flex-shrink-0" />
                        </button>
                      );
                    }
                    return (
                      <Link key={item.label} to={createPageUrl(item.url)} onClick={() => setSidebarOpen(false)} className={linkClass}>
                        <Icon className={`w-4 h-4 mr-3 flex-shrink-0 ${active ? '' : 'text-slate-600'}`} />
                        <span className="flex-1 text-left">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200/60">
                  <ArchitectReturnLink onNavigate={() => setSidebarOpen(false)} className="min-h-[44px]" />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Toggle Button Desktop */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-50 items-center gap-2 px-2 py-3 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 border border-purple-400/50 shadow-lg hover:shadow-xl transition-all duration-300 ${sidebarCollapsed ? 'left-2' : 'left-[280px]'}`}
      >
        {sidebarCollapsed ? <PanelLeft className="w-4 h-4 text-white" /> : <PanelLeftClose className="w-4 h-4 text-white" />}
      </motion.button>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200/60 page-padding py-3 flex-shrink-0 sticky top-0 z-30 shadow-sm safe-top">
          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="flex-shrink-0 min-w-[44px] min-h-[44px] touch-target">
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
              <Logo size="small" animate={false} />
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate font-display">Druide Omega</h1>
            </div>
            <div className="flex-shrink-0 min-w-[44px]">
              <LanguageSelector variant="ghost" />
            </div>
          </div>
        </header>
        
        <div className="flex-1">{children}</div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/60 sticky bottom-0 z-30 shadow-lg safe-bottom">
          <div className="flex items-center justify-around px-2 py-2 gap-2">
            {[
              { icon: Home, url: "PublicHome", label: t('nav.home') },
              { icon: Plus, url: "Chat", label: t('nav.chat'), highlight: true },
              { icon: Globe, url: "https://azex.base44.app/", label: t('nav.myPersonalPage').split(' ')[0], external: true },
              { icon: User, url: "Profile", label: language === 'en' ? 'Profile' : 'Profil' },
              { icon: Zap, url: "FeaturesOverview", label: language === 'en' ? 'Features' : 'Fonctions' }
            ].map((item) => {
              const Icon = item.icon;
              const active = !item.external && isActive(item.url);
              const navClass = `flex flex-col items-center gap-0.5 px-1 sm:px-1.5 py-2 rounded-xl transition-all min-w-[60px] min-h-[60px] touch-target flex-1 max-w-[80px] ${
                active ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg' : 
                item.highlight ? 'bg-gradient-to-br from-purple-50 to-indigo-50 text-purple-600' :
                item.external ? 'bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-600' : 'text-slate-600 hover:bg-slate-50'
              }`;

              if (item.external) {
                return (
                  <motion.button
                    key={item.url}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => openExternal(item.url)}
                    className={navClass}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[9px] sm:text-[10px] font-medium text-center">{item.label}</span>
                  </motion.button>
                );
              }

              return (
                <Link key={item.url} to={createPageUrl(item.url)} className={navClass}>
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] sm:text-[10px] font-medium text-center">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
}