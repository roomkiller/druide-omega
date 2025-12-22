/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Offline Indicator                                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Indicateur visuel du statut online/offline                                ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { useOffline } from '@/components/offline/OfflineManager';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WifiOff, 
  Wifi, 
  CloudOff, 
  RefreshCw, 
  Database,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '@/components/utils/LanguageContext';

export default function OfflineIndicator() {
  const { isOnline, offlineReady, pendingSync, forceSync, llmEmulator } = useOffline();
  const { language } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    if (!isOnline || syncing) return;
    
    setSyncing(true);
    try {
      await forceSync();
    } catch (error) {
      console.error('Erreur sync:', error);
    } finally {
      setSyncing(false);
    }
  };

  const emulatorStats = llmEmulator?.getStats() || {};

  return (
    <AnimatePresence>
      {(!isOnline || pendingSync > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 lg:bottom-6 right-4 z-50 max-w-sm"
        >
          <Card className={`p-4 shadow-2xl border-2 ${
            isOnline 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-orange-500 bg-orange-50'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isOnline ? 'bg-blue-500' : 'bg-orange-500'
                }`}>
                  {isOnline ? (
                    <Wifi className="w-5 h-5 text-white" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-white" />
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {isOnline 
                      ? (language === 'en' ? 'Online' : 'En ligne')
                      : (language === 'en' ? 'Offline Mode' : 'Mode Hors-ligne')
                    }
                  </h4>
                  {!isOnline && (
                    <p className="text-xs text-slate-600">
                      {offlineReady 
                        ? (language === 'en' ? 'Limited features available' : 'Fonctionnalités limitées')
                        : (language === 'en' ? 'Initializing...' : 'Initialisation...')
                      }
                    </p>
                  )}
                  {pendingSync > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Database className="w-3 h-3 text-orange-600" />
                      <span className="text-xs text-orange-600 font-medium">
                        {pendingSync} {language === 'en' ? 'pending sync' : 'en attente'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExpanded(!expanded)}
                className="flex-shrink-0"
              >
                {expanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-200 space-y-3"
                >
                  {/* Statut émulateur LLM */}
                  {!isOnline && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CloudOff className="w-4 h-4 text-slate-600" />
                        <span className="text-xs font-semibold text-slate-700">
                          {language === 'en' ? 'LLM Emulator' : 'Émulateur LLM'}
                        </span>
                        <Badge variant={emulatorStats.ready ? "default" : "secondary"} className="text-[9px]">
                          {emulatorStats.ready 
                            ? (language === 'en' ? 'Active' : 'Actif')
                            : (language === 'en' ? 'Loading' : 'Chargement')
                          }
                        </Badge>
                      </div>
                      {emulatorStats.ready && (
                        <div className="text-xs text-slate-600 space-y-1 ml-6">
                          <div>• {emulatorStats.patternsCount} {language === 'en' ? 'patterns loaded' : 'patterns chargés'}</div>
                          <div>• {emulatorStats.conversationHistoryLength} {language === 'en' ? 'local messages' : 'messages locaux'}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bouton de synchronisation */}
                  {isOnline && pendingSync > 0 && (
                    <Button
                      onClick={handleSync}
                      disabled={syncing}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="sm"
                    >
                      {syncing ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          {language === 'en' ? 'Syncing...' : 'Synchronisation...'}
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3 mr-2" />
                          {language === 'en' ? 'Sync Now' : 'Synchroniser'}
                        </>
                      )}
                    </Button>
                  )}

                  {/* Informations additionnelles */}
                  <div className="text-[10px] text-slate-500 space-y-1">
                    {!isOnline ? (
                      <>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{language === 'en' ? 'Data saved locally' : 'Données sauvegardées localement'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>{language === 'en' ? 'Auto-sync on reconnect' : 'Sync auto à la reconnexion'}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-green-600">
                          {language === 'en' ? 'Full features available' : 'Toutes fonctionnalités disponibles'}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}