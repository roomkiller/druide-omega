/**
 * IntegrationRelay — Relais global des fonctions dépendant des crédits d'intégration.
 * Sur OFF (« Arrêt interne »), les pages affichent leur visuel mais ne déclenchent
 * aucun appel InvokeLLM/backend : aucun spinner bloquant, message « Arrêt interne » à la place.
 * © 2025 AMG+A.L
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Power } from 'lucide-react';

const IntegrationRelayContext = createContext(null);
const STORAGE_KEY = 'druide_integration_relay';

export function IntegrationRelayProvider({ children }) {
  const [relayOn, setRelayOn] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) !== 'off'; } catch { return true; }
  });

  const toggleRelay = useCallback(() => {
    setRelayOn(prev => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off'); } catch {}
      return next;
    });
  }, []);

  const setRelay = useCallback((val) => {
    setRelayOn(() => {
      try { localStorage.setItem(STORAGE_KEY, val ? 'on' : 'off'); } catch {}
      return val;
    });
  }, []);

  return (
    <IntegrationRelayContext.Provider value={{ relayOn, toggleRelay, setRelay }}>
      {children}
    </IntegrationRelayContext.Provider>
  );
}

export function useIntegrationRelay() {
  const ctx = useContext(IntegrationRelayContext);
  if (!ctx) return { relayOn: true, toggleRelay: () => {}, setRelay: () => {} };
  return ctx;
}

/** Interrupteur flottant — bascule le relais ON/OFF. */
export function RelayToggle() {
  const { relayOn, toggleRelay } = useIntegrationRelay();
  return (
    <motion.button
      onClick={toggleRelay}
      whileTap={{ scale: 0.95 }}
      className={`fixed bottom-4 left-4 z-[60] flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border touch-target transition-colors ${
        relayOn ? 'bg-green-500 text-white border-green-600' : 'bg-slate-700 text-amber-300 border-slate-800'
      }`}
      title={relayOn ? 'Relais intégration ACTIF — cliquez pour arrêt interne' : 'Relais en ARRÊT INTERNE — cliquez pour réactiver'}
    >
      <Power className="w-4 h-4" />
      <span className="text-xs font-semibold hidden sm:inline">
        {relayOn ? 'Intégrations ON' : 'Arrêt interne'}
      </span>
    </motion.button>
  );
}

/** Bannière affichée sur toutes les pages quand le relais est OFF. */
export function RelayBanner() {
  const { relayOn } = useIntegrationRelay();
  if (relayOn) return null;
  return (
    <div className="bg-amber-100 border-y border-amber-300 px-4 py-2 text-center text-xs text-amber-900">
      ⚠ <strong>Arrêt interne</strong> — relais d'intégration désactivé. Les fonctions dépendant des crédits d'intégration sont suspendues ; le visuel des pages reste accessible.
    </div>
  );
}