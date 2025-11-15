/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Session Sync Service (Mobile ↔ Desktop)                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

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
    setSessionState(prev => ({
      ...prev,
      device: isMobile ? 'mobile' : 'desktop'
    }));

    // Load from localStorage
    const stored = localStorage.getItem('druide_session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessionState(prev => ({ ...prev, ...parsed }));
      } catch (err) {
        console.error('Failed to parse stored session', err);
      }
    }
  }, []);

  const syncSession = (data) => {
    const newState = {
      ...sessionState,
      ...data,
      lastSync: Date.now()
    };
    
    setSessionState(newState);
    localStorage.setItem('druide_session', JSON.stringify(newState));
  };

  const importSession = (qrData) => {
    try {
      const data = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
      
      if (data.type === 'druide_session') {
        syncSession({
          sessionId: data.sessionId,
          currentPage: data.page,
          conversationId: data.conversationId
        });
        
        // Navigate to the page
        if (data.page) {
          window.location.href = `/${data.page.toLowerCase()}${data.conversationId ? `?id=${data.conversationId}` : ''}`;
        }
        
        return { success: true };
      }
    } catch (err) {
      console.error('Failed to import session', err);
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