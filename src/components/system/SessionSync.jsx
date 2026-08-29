/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Session Sync Service (Mobile ↔ Desktop)                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { navigateTo } from "@/lib/spaNavigate";

const SessionSyncContext = createContext();

export const useSessionSync = () => {
  const context = useContext(SessionSyncContext);
  if (!context) {
    throw new Error('useSessionSync must be used within SessionSyncProvider');
  }
  return context;
};

export function SessionSyncProvider({ children }) {
  const [sessionState, setSessionState] = useState({
    sessionId: null,
    currentPage: null,
    conversationId: null,
    lastSync: null,
    device: null // 'mobile' | 'desktop'
  });

  useEffect(() => {
    // Detect device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Load from localStorage avec validation
    let stored = null;
    try {
      const storedData = localStorage.getItem('druide_session');
      if (storedData) {
        stored = JSON.parse(storedData);
        
        // Validation des données
        if (stored && typeof stored === 'object') {
          // Vérifier expiration (24h)
          const age = Date.now() - (stored.lastSync || 0);
          if (age > 86400000) { // 24h
            console.log('[SessionSync] Session expirée, reset');
            localStorage.removeItem('druide_session');
            stored = null;
          }
        }
      }
    } catch (err) {
      console.error('[SessionSync] Erreur parse session:', err);
      localStorage.removeItem('druide_session');
    }

    setSessionState(prev => ({
      ...prev,
      device: isMobile ? 'mobile' : 'desktop',
      ...(stored || {}),
      sessionId: stored?.sessionId || `session_${Date.now()}`
    }));
  }, []);

  const syncSession = (data) => {
    try {
      const newState = {
        ...sessionState,
        ...data,
        lastSync: Date.now()
      };
      
      setSessionState(newState);
      
      // Sauvegarder avec validation
      const toSave = JSON.stringify(newState);
      if (toSave.length > 5000000) { // 5MB max
        console.warn('[SessionSync] Session trop volumineuse, nettoyage');
        const cleaned = {
          sessionId: newState.sessionId,
          currentPage: newState.currentPage,
          conversationId: newState.conversationId,
          lastSync: newState.lastSync,
          device: newState.device
        };
        localStorage.setItem('druide_session', JSON.stringify(cleaned));
      } else {
        localStorage.setItem('druide_session', toSave);
      }
    } catch (err) {
      console.error('[SessionSync] Erreur sync:', err);
      // Si quota dépassé, nettoyer
      if (err.name === 'QuotaExceededError') {
        localStorage.clear();
        console.warn('[SessionSync] LocalStorage saturé, vidé');
      }
    }
  };

  const importSession = (qrData) => {
    try {
      // Validation
      if (!qrData) {
        return { success: false, error: 'Données manquantes' };
      }

      const data = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
      
      // Validation type et structure
      if (!data || data.type !== 'druide_session') {
        return { success: false, error: 'Format session invalide' };
      }

      // Validation timestamp (ne pas importer session trop ancienne)
      if (data.timestamp && (Date.now() - data.timestamp) > 3600000) { // 1h
        return { success: false, error: 'Session expirée (>1h)' };
      }
      
      syncSession({
        sessionId: data.sessionId,
        currentPage: data.page,
        conversationId: data.conversationId
      });
      
      // Navigate to the page
      if (data.page) {
        navigateTo(data.page, data.conversationId ? { id: data.conversationId } : undefined);
      }
      
      return { success: true };
    } catch (err) {
      console.error('[SessionSync] Import échoué:', err);
      return { success: false, error: err.message };
    }
  };

  const exportSession = () => {
    return {
      type: 'druide_session',
      sessionId: sessionState.sessionId || `session_${Date.now()}`,
      page: sessionState.currentPage,
      conversationId: sessionState.conversationId,
      timestamp: Date.now(),
      version: '1.0'
    };
  };

  const value = {
    sessionState,
    syncSession,
    importSession,
    exportSession
  };

  return (
    <SessionSyncContext.Provider value={value}>
      {children}
    </SessionSyncContext.Provider>
  );
}