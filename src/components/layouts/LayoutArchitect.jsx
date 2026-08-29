/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Layout Architecte (Navigation Admin)                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from "@/components/utils/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import Logo from "@/components/branding/Logo";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, X, Activity, Brain, Award, Users, Settings, BarChart3,
  Wrench, Shield, Zap, Home, PanelLeftClose, PanelLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function LayoutArchitect({ children, currentPageName }) {
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // L'accès aux pages architecte est contrôlé par ConfidentialPageGuard (route-level).
  // Pas de double vérification ici — le guard bloque les non-admins avant le layout.

  const NAV_ITEMS = [
    { label: 'Dashboard Architecte', icon: Home, url: "ArchitectDashboard", gradient: "from-orange-500 to-red-600" },
    { label: 'Centre de Contrôle', icon: Activity, url: "DruideControl", gradient: "from-purple-600 to-indigo-700" },
    { label: 'System Health', icon: Zap, url: "SystemHealth", gradient: "from-emerald-600 to-teal-700" },
    { label: 'Configuration Conscience', icon: Brain, url: "Consciousness", gradient: "from-purple-500 to-violet-600" },
    { label: 'Tests IA', icon: Award, url: "AITests", gradient: "from-indigo-600 to-purple-700" },
    { label: 'Administration', icon: Settings, url: "Admin", gradient: "from-red-600 to-orange-700" },
    { label: 'Évaluation Application', icon: BarChart3, url: "ApplicationEvaluation", gradient: "from-purple-600 to-pink-700" },
    { label: 'Gestion Utilisateurs', icon: Users, url: "UserManagement", gradient: "from-indigo-600 to-blue-700" },
    { label: 'Analytics Public', icon: BarChart3, url: "PublicAdmin", gradient: "from-cyan-600 to-blue-700" }
  ];

  const isActive = (url) => currentPageName === url;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:flex-col bg-white/95 backdrop-blur-xl border-r border-orange-200/60 shadow-xl transition-all duration-300 ${sidebarCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-72'}`}>
        <div className="card-padding border-b border-orange-200/60 flex-shrink-0 bg-gradient-to-br from-white to-orange-50/30">
          <Link to="/ArchitectDashboard" className="flex flex-col items-center mb-4 cursor-pointer hover:opacity-90 transition-opacity">
            <Logo size="small" animate={true} />
            <div className="text-center mt-2">
              <h1 className="text-lg font-bold text-slate-900 font-display">Druide Omega</h1>
              <Badge className="mt-1.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] px-2.5 py-0.5 flex items-center gap-1 w-fit mx-auto shadow-sm">
                <Shield className="w-3 h-3" />
                Architecte
              </Badge>
            </div>
          </Link>
          <LanguageSelector />
        </div>

        <div className="flex-1 overflow-y-auto px-3 page-padding-y">
          <div className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.url);

              return (
                <Link
                  key={item.label}
                  to={createPageUrl(item.url)}
                  className={`w-full flex items-center text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                    active
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg font-semibold`
                      : 'hover:bg-orange-50 text-slate-700 hover:text-slate-900 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2.5 ${active ? 'drop-shadow-sm' : 'text-slate-600'}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-orange-200/60">
            <Link
              to="/PublicHome"
              className="w-full flex items-center text-sm px-3 py-2 rounded-lg border border-orange-300 hover:bg-orange-50 text-slate-700 font-medium"
            >
              <Home className="w-4 h-4 mr-2.5" />
              Retour Espace Public
            </Link>
          </div>
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
              <div className="flex items-center justify-between card-padding border-b border-orange-200/60 bg-gradient-to-r from-orange-50 to-red-50">
                <Link to="/ArchitectDashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 cursor-pointer">
                  <Logo size="small" animate={true} />
                  <div>
                    <h1 className="text-base font-bold text-slate-900 font-display">Druide Omega</h1>
                    <Badge className="mt-0.5 bg-orange-500 text-white text-[9px] px-2 py-0.5 flex items-center gap-1 w-fit">
                      <Shield className="w-2.5 h-2.5" />
                      Architecte
                    </Badge>
                  </div>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-3 border-b border-orange-200/60">
                <LanguageSelector />
              </div>

              <div className="flex-1 overflow-y-auto px-3 page-padding-y">
                <div className="content-spacing">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.url);

                    return (
                      <Link
                        key={item.label}
                        to={createPageUrl(item.url)}
                        onClick={() => setSidebarOpen(false)}
                        className={`w-full flex items-center text-sm min-h-[44px] touch-target px-3 py-2 rounded-lg transition-all duration-200 ${
                          active ? `bg-gradient-to-r ${item.gradient} text-white shadow-md font-semibold` : 'hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mr-3 flex-shrink-0 ${active ? '' : 'text-slate-600'}`} />
                        <span className="flex-1 text-left">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-orange-200/60">
                  <Link
                    to="/PublicHome"
                    onClick={() => setSidebarOpen(false)}
                    className="w-full flex items-center text-sm px-3 py-2 rounded-lg border border-orange-300 hover:bg-orange-50 min-h-[44px] text-slate-700 font-medium"
                  >
                    <Home className="w-4 h-4 mr-3" />
                    Retour Espace Public
                  </Link>
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
        className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-50 items-center gap-2 px-2 py-3 rounded-full bg-gradient-to-br from-orange-500 to-red-600 border border-orange-400/50 shadow-lg hover:shadow-xl transition-all duration-300 ${sidebarCollapsed ? 'left-2' : 'left-[280px]'}`}
      >
        {sidebarCollapsed ? <PanelLeft className="w-4 h-4 text-white" /> : <PanelLeftClose className="w-4 h-4 text-white" />}
      </motion.button>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-orange-200/60 page-padding py-3 flex-shrink-0 sticky top-0 z-30 shadow-sm safe-top">
          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="flex-shrink-0 min-w-[44px] min-h-[44px] touch-target">
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
              <Shield className="w-5 h-5 text-orange-600" />
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate font-display">Architecte</h1>
            </div>
            <div className="flex-shrink-0 min-w-[44px]">
              <LanguageSelector variant="ghost" />
            </div>
          </div>
        </header>
        
        <div className="flex-1">{children}</div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-orange-200/60 sticky bottom-0 z-30 shadow-lg safe-bottom">
          <div className="flex items-center justify-around px-2 py-2 gap-2">
            {[
              { icon: Home, url: "ArchitectDashboard", label: 'Dashboard' },
              { icon: Activity, url: "DruideControl", label: 'Contrôle' },
              { icon: Zap, url: "SystemHealth", label: 'Health' },
              { icon: Brain, url: "Consciousness", label: 'Conscience' },
              { icon: Settings, url: "Admin", label: 'Admin' }
            ].map((item) => {
              const Icon = item.icon;
              const active = isActive(item.url);

              return (
                <Link
                  key={item.url}
                  to={createPageUrl(item.url)}
                  className={`flex flex-col items-center gap-0.5 px-1 sm:px-1.5 py-2 rounded-xl transition-all min-w-[60px] min-h-[60px] touch-target flex-1 max-w-[80px] ${
                    active ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
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