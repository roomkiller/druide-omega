/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - PWA Install Prompt                                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 30s or on second visit
      const visits = parseInt(localStorage.getItem('druide_visits') || '0');
      if (visits > 1) {
        setTimeout(() => setShowPrompt(true), 30000);
      }
      localStorage.setItem('druide_visits', visits + 1);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('druide_pwa_dismissed', Date.now());
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
      >
        <Card className="p-6 shadow-2xl bg-white/95 backdrop-blur-xl border-2 border-purple-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Installer Druide Ω</h3>
                <p className="text-xs text-slate-600">Accès rapide depuis votre écran d'accueil</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2 mb-4 text-sm text-slate-600">
            <p>✓ Accès hors ligne</p>
            <p>✓ Notifications push</p>
            <p>✓ Performance optimale</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleInstall} className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600">
              Installer
            </Button>
            <Button variant="outline" onClick={handleDismiss}>
              Plus tard
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}