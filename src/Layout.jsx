/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Navigation Layout with Druid Companion                     ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Conforme: Loi 25 (Québec), RGPD (UE), CCPA (USA)                          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { LanguageProvider, useLanguage } from "@/components/utils/LanguageContext";
import { ConsciousnessHubProvider } from "@/components/system/ConsciousnessHub";
import { DruidCompanionProvider } from "@/components/companion/DruidCompanionProvider";
import { IntelligenceProvider } from "@/components/intelligence/IntelligenceManager";
import GlobalDruidCompanion from "@/components/companion/GlobalDruidCompanion";
import ServicePersistence from "@/components/system/ServicePersistence";
import WelcomeModal from "@/components/system/WelcomeModal";
import CookieConsent from "@/components/legal/CookieConsent";
import AccessibilityWrapper from "@/components/a11y/AccessibilityWrapper";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { GlobalBehaviorTracker } from "@/components/analytics/BehaviorTracker";
import LanguageSelector from "@/components/LanguageSelector";
import Logo from "@/components/branding/Logo";
import QRCodeCard from "@/components/branding/QRCodeCard";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Menu, 
  X, 
  Brain, 
  Database, 
  BookOpen, 
  Settings, 
  Home,
  Radio,
  Lightbulb,
  ShoppingCart,
  Award,
  MapPin,
  FileText,
  HelpCircle,
  Eye,
  Activity,
  User,
  BarChart3,
  Users,
  Microscope,
  Gamepad,
  Globe,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

function LayoutContent({ children, currentPageName }) {
  const { t, language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === 'admin');
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAdmin();
  }, []);

  const NAV_ITEMS = [
    { 
      label: t('nav.home'), 
      icon: Home, 
      url: "Home", 
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      label: language === 'en' ? 'My Personal Page' : 'Ma Page Perso',
      icon: Globe, 
      external: true,
      url: "https://azex.base44.app/", 
      gradient: "from-cyan-500 to-blue-600"
    },
    { 
      label: t('nav.chat'), 
      icon: Plus, 
      url: "Chat", 
      gradient: "from-purple-600 to-indigo-600",
      primary: true
    },
    { 
      label: t('nav.voiceRoom'), 
      icon: Radio, 
      url: "VoiceRoom", 
      gradient: "from-green-500 to-emerald-500"
    },
    { 
      label: t('nav.intelligences'), 
      icon: Lightbulb, 
      url: "Intelligences", 
      gradient: "from-amber-500 to-orange-500"
    },
    { 
      label: t('consciousness.title'), 
      icon: Brain, 
      url: "Consciousness", 
      gradient: "from-purple-500 to-violet-500"
    },
    { 
      label: t('memory.title'), 
      icon: Database, 
      url: "Memory", 
      gradient: "from-indigo-500 to-purple-500"
    },
    { 
      label: t('knowledge.title'), 
      icon: BookOpen, 
      url: "Knowledge", 
      gradient: "from-blue-500 to-indigo-500"
    },
    { 
      label: t('nav.aiTests'), 
      icon: Award, 
      url: "AITests", 
      gradient: "from-indigo-500 to-purple-600"
    },
    { 
      label: language === 'en' ? 'Medical Research' : 'Recherche Médicale', 
      icon: Microscope, 
      url: "MedicalResearch", 
      gradient: "from-blue-500 to-cyan-600"
    },
    { 
      label: language === 'en' ? 'Games' : 'Jeux', 
      icon: Gamepad, 
      url: "Games", 
      gradient: "from-purple-500 to-pink-600"
    },
    { 
      label: t('nav.documentation'), 
      icon: FileText, 
      url: "Documentation", 
      gradient: "from-blue-500 to-cyan-600"
    },
    { 
      label: language === 'en' ? 'User Guide' : 'Guide', 
      icon: HelpCircle, 
      url: "UserGuide", 
      gradient: "from-pink-500 to-rose-600"
    },
    { 
      label: language === 'en' ? 'Dashboard' : 'Tableau de Bord', 
      icon: Activity, 
      url: "PublicAdmin", 
      gradient: "from-cyan-600 to-blue-700"
    },
    { 
      label: language === 'en' ? 'Evaluation' : 'Évaluation', 
      icon: BarChart3, 
      url: "PublicEvaluation", 
      gradient: "from-teal-600 to-cyan-700"
    },
    { 
      label: language === 'en' ? 'My Profile' : 'Mon Profil', 
      icon: User, 
      url: "Profile", 
      gradient: "from-cyan-500 to-blue-600"
    },
    { 
      label: t('nav.shop'), 
      icon: ShoppingCart, 
      url: "Shop", 
      gradient: "from-orange-500 to-amber-600"
    },
    ...(isAdmin ? [
      {
        label: language === 'en' ? 'User Management' : 'Gestion Utilisateurs',
        icon: Users,
        url: "UserManagement",
        gradient: "from-indigo-600 to-purple-600",
        adminOnly: true
      },
      {
        label: language === 'en' ? 'Admin Panel' : 'Panneau Admin',
        icon: Activity,
        url: "Admin",
        gradient: "from-red-600 to-orange-600",
        adminOnly: true
      },
      {
        label: language === 'en' ? 'Admin Eval' : 'Eval Admin',
        icon: BarChart3,
        url: "ApplicationEvaluation",
        gradient: "from-purple-600 to-pink-600",
        adminOnly: true
      }
    ] : []),
    { 
      label: t('personality.title'), 
      icon: Settings, 
      url: "Personality", 
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  const navigate = (url, external = false) => {
    if (external) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = createPageUrl(url);
    }
    setSidebarOpen(false);
  };

  const isActive = (url) => {
    return currentPageName === url;
  };

  const getQuebecBadge = () => {
    if (language === 'en') return 'Proudly from Quebec';
    if (language === 'es') return 'Orgullosamente de Quebec';
    if (language === 'de') return 'Stolz aus Quebec';
    if (language === 'zh') return '自豪来自魁北克';
    return 'Fièrement Québécois';
  };

  return (
    <AnalyticsProvider currentPage={currentPageName}>
      <WelcomeModal />
      <CookieConsent />
      
      {/* Global Behavior Tracker */}
      <GlobalBehaviorTracker />
      
      {/* Druide Companion Global - Omnipresent */}
      <GlobalDruidCompanion />
      
      <AccessibilityWrapper>
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex lg:flex-col w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-xl">
            {/* Header Section */}
            <div className="p-4 border-b border-slate-200/60 flex-shrink-0 bg-gradient-to-br from-white to-purple-50/30">
              <div 
                className="flex flex-col items-center mb-4 cursor-pointer hover:opacity-90 transition-opacity" 
                onClick={() => navigate("Home")}
              >
                <Logo size="small" animate={true} />
                <div className="text-center mt-2">
                  <h1 className="text-lg font-bold text-slate-900 font-display">Druide Omega</h1>
                  <Badge className="mt-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] px-2.5 py-0.5 flex items-center gap-1 w-fit mx-auto shadow-sm">
                    <MapPin className="w-3 h-3" />
                    {getQuebecBadge()}
                  </Badge>
                </div>
              </div>
              <LanguageSelector />
            </div>

            {/* Navigation Section */}
            <ScrollArea className="flex-1 px-3 py-4">
              <div className="space-y-1.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.url);
                  
                  return (
                    <motion.div key={item.label} whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => navigate(item.url, item.external)}
                        variant={active ? "default" : "ghost"}
                        size="sm"
                        className={`w-full justify-start text-sm transition-all duration-200 ${
                          active 
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.gradient.split(' ')[1]}/30` 
                            : 'hover:bg-gradient-to-r hover:from-slate-50 hover:to-purple-50/50 text-slate-700 hover:text-slate-900'
                        } ${item.primary && !active ? 'border-2 border-purple-200 hover:border-purple-300' : ''} ${item.adminOnly ? 'border-2 border-red-200 hover:border-red-300' : ''}`}
                      >
                        <Icon className={`w-4 h-4 mr-2.5 ${active ? 'drop-shadow-sm' : 'text-slate-600'}`} />
                        <span className={`${active ? 'font-semibold' : 'font-medium'} flex-1 text-left`}>{item.label}</span>
                        {item.external && <ExternalLink className="w-3 h-3 ml-1 opacity-60" />}
                        {item.adminOnly && <Badge className="ml-auto text-[9px] bg-red-500 text-white px-1.5 py-0.5">ADMIN</Badge>}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer links */}
              <div className="mt-6 pt-6 border-t border-slate-200/60 space-y-1">
                <Button
                  onClick={() => navigate("AccessibilityStatement")}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs text-slate-500 hover:text-slate-700"
                >
                  <Eye className="w-3 h-3 mr-2" />
                  {language === 'en' ? 'Accessibility' : 'Accessibilité'}
                </Button>
              </div>
            </ScrollArea>

            {/* Support Section */}
            <div className="p-3 border-t border-slate-200/60 flex-shrink-0 bg-gradient-to-br from-pink-50/50 via-rose-50/50 to-purple-50/30">
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
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.aside
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white/98 backdrop-blur-xl shadow-2xl z-50 flex flex-col lg:hidden"
                >
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 border-b border-slate-200/60 bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("Home")}>
                      <Logo size="small" animate={true} />
                      <div>
                        <h1 className="text-base font-bold text-slate-900 font-display">Druide Omega</h1>
                        <Badge className="mt-0.5 bg-blue-500 text-white text-[9px] px-2 py-0.5 flex items-center gap-1 w-fit">
                          <MapPin className="w-2.5 h-2.5" />
                          {getQuebecBadge()}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="flex-shrink-0">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="p-3 border-b border-slate-200/60">
                    <LanguageSelector />
                  </div>

                  {/* Mobile Navigation */}
                  <ScrollArea className="flex-1 px-3 py-3">
                    <div className="space-y-1.5">
                      {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.url);
                        
                        return (
                          <motion.div 
                            key={item.label}
                            whileTap={{ scale: 0.96 }}
                          >
                            <Button
                              onClick={() => navigate(item.url, item.external)}
                              variant={active ? "default" : "ghost"}
                              size="sm"
                              className={`w-full justify-start text-sm min-h-[44px] touch-target ${
                                active 
                                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-md` 
                                  : 'hover:bg-slate-50'
                              }`}
                            >
                              <Icon className={`w-4 h-4 mr-3 flex-shrink-0 ${active ? '' : 'text-slate-600'}`} />
                              <span className="font-medium flex-1 text-left">{item.label}</span>
                              {item.external && <ExternalLink className="w-3.5 h-3.5 ml-2 opacity-60 flex-shrink-0" />}
                              {item.adminOnly && <Badge className="ml-auto text-[9px] bg-red-500 text-white px-1.5 py-0.5">ADMIN</Badge>}
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Mobile Support Card */}
                    <div className="mt-4 pt-4 border-t border-slate-200/60">
                      <QRCodeCard compact />
                    </div>
                  </ScrollArea>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1 flex flex-col overflow-y-auto">
            {/* Mobile Header - Optimized */}
            <header className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200/60 px-2 sm:px-3 py-2.5 flex-shrink-0 sticky top-0 z-30 shadow-sm safe-top">
              <div className="flex items-center justify-between gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSidebarOpen(true)}
                  className="flex-shrink-0 min-w-[44px] min-h-[44px] touch-target"
                  aria-label="Open menu"
                >
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
            
            <div className="flex-1">
              <ServicePersistence currentPage={currentPageName} />
              {children}
            </div>

            {/* Mobile Bottom Navigation Bar - Optimized */}
            <nav className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/60 sticky bottom-0 z-30 shadow-lg safe-bottom">
              <div className="flex items-center justify-around px-1 sm:px-2 py-2 gap-1">
                {[
                  { icon: Home, url: "Home", label: t('nav.home') },
                  { icon: Plus, url: "Chat", label: t('nav.chat'), highlight: true },
                  { icon: Globe, url: "https://azex.base44.app/", label: language === 'en' ? 'My Page' : 'Ma Page', external: true },
                  { icon: Activity, url: "PublicAdmin", label: language === 'en' ? 'Stats' : 'Stats' },
                  { icon: Settings, url: "Personality", label: language === 'en' ? 'Config' : 'Config' }
                ].map((item) => {
                  const Icon = item.icon;
                  const active = !item.external && isActive(item.url);

                  return (
                    <motion.button
                      key={item.url}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => navigate(item.url, item.external)}
                      className={`flex flex-col items-center gap-0.5 px-1 sm:px-1.5 py-2 rounded-xl transition-all min-w-[60px] min-h-[60px] touch-target flex-1 max-w-[80px] ${
                        active 
                          ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30' 
                          : item.highlight 
                            ? 'bg-gradient-to-br from-purple-50 to-indigo-50 text-purple-600'
                            : item.external
                              ? 'bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-600'
                              : 'text-slate-600 hover:bg-slate-50'
                      }`}
                      aria-label={item.label}
                    >
                      <div className="relative">
                        <Icon className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${active ? 'drop-shadow-md' : ''}`} />
                        {item.external && <ExternalLink className="w-2.5 h-2.5 absolute -top-1 -right-1 opacity-60" />}
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-medium leading-tight text-center">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </nav>
          </main>
        </div>
      </AccessibilityWrapper>
    </AnalyticsProvider>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <LanguageProvider>
      <ConsciousnessHubProvider>
        <DruidCompanionProvider>
          <IntelligenceProvider>
            <LayoutContent children={children} currentPageName={currentPageName} />
          </IntelligenceProvider>
        </DruidCompanionProvider>
      </ConsciousnessHubProvider>
    </LanguageProvider>
  );
}