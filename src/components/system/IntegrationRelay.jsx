/**
 * IntegrationRelay — Relais global des fonctions dépendant des crédits d'intégration.
 * Sur OFF (« Arrêt interne »), les pages affichent leur visuel mais ne déclenchent
 * aucun appel InvokeLLM/backend : aucun spinner bloquant, message « Arrêt interne » à la place.
 * © 2025 AMG+A.L
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { appParams } from '@/lib/app-params';

const IntegrationRelayContext = createContext(null);
const STORAGE_KEY = 'druide_integration_relay';
const AUTO_DISABLED_KEY = 'druide_integration_relay_auto';

export function IntegrationRelayProvider({ children }) {
  const [relayOn, setRelayOn] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) !== 'off'; } catch { return true; }
  });
  const [autoDisabled, setAutoDisabled] = useState(() => {
    try { return localStorage.getItem(AUTO_DISABLED_KEY) === 'true'; } catch { return false; }
  });

  const persistRelay = useCallback((val) => {
    try { localStorage.setItem(STORAGE_KEY, val ? 'on' : 'off'); } catch {}
  }, []);

  const toggleRelay = useCallback(() => {
    setAutoDisabled(false);
    try { localStorage.setItem(AUTO_DISABLED_KEY, 'false'); } catch {}
    setRelayOn(prev => {
      const next = !prev;
      persistRelay(next);
      return next;
    });
  }, [persistRelay]);

  const setRelay = useCallback((val) => {
    setRelayOn(val);
    persistRelay(val);
  }, [persistRelay]);

  // Auto-détection: interception globale des réponses backend.
  // Quand 2+ réponses 402/403 (plan limité) arrivent du serveur base44,
  // le relais bascule automatiquement sur OFF pour permettre la navigation résiduelle.
  useEffect(() => {
    if (!relayOn) return;

    const originalFetch = window.fetch;
    const serverUrl = appParams.serverUrl;
    let failureCount = 0;

    const interceptedFetch = async (...args) => {
      const response = await originalFetch(...args);
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
      const isBase44Call = serverUrl && url && url.includes(serverUrl);

      if (isBase44Call && (response.status === 402 || response.status === 403)) {
        failureCount++;
        if (failureCount >= 2) {
          console.warn('[IntegrationRelay] Fonctions backend non disponibles (plan limité) — arrêt automatique du relais pour navigation résiduelle');
          setAutoDisabled(true);
          try { localStorage.setItem(AUTO_DISABLED_KEY, 'true'); } catch {}
          setRelay(false);
        }
      } else if (response.ok) {
        failureCount = 0;
      }
      return response;
    };

    window.fetch = interceptedFetch;
    return () => { window.fetch = originalFetch; };
  }, [relayOn, setRelay]);

  return (
    <IntegrationRelayContext.Provider value={{ relayOn, toggleRelay, setRelay, autoDisabled }}>
      {children}
    </IntegrationRelayContext.Provider>
  );
}

export function useIntegrationRelay() {
  const ctx = useContext(IntegrationRelayContext);
  if (!ctx) return { relayOn: true, toggleRelay: () => {}, setRelay: () => {}, autoDisabled: false };
  return ctx;
}

/** Bannière affichée sur toutes les pages quand le relais est OFF. */
export function RelayBanner() {
  const { relayOn, autoDisabled } = useIntegrationRelay();
  if (relayOn) return null;
  return (
    <div className="bg-amber-100 border-y border-amber-300 px-4 py-2 text-center text-xs text-amber-900">
      {autoDisabled ? (
        <>⚠ <strong>Arrêt interne automatique</strong> — fonctions backend non disponibles sur le plan actuel. Navigation résiduelle active : le visuel des pages reste accessible. Cliquez sur l'interrupteur du relais pour tenter de réactiver.</>
      ) : (
        <>⚠ <strong>Arrêt interne</strong> — relais d'intégration désactivé. Les fonctions dépendant des crédits d'intégration sont suspendues ; le visuel des pages reste accessible.</>
      )}
    </div>
  );
}