/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Offline Manager (Enhanced)                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Gestion complète du mode hors-ligne avec émulateur LLM                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { LocalLLMEmulator } from './LocalLLMEmulator';
import { OfflineStorage } from './OfflineStorage';
import { SyncManager } from './SyncManager';

const OfflineContext = createContext(null);

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
};

export function OfflineProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineReady, setOfflineReady] = useState(false);
  const [pendingSync, setPendingSync] = useState(0);
  const [llmEmulator] = useState(() => new LocalLLMEmulator());
  const [offlineStorage] = useState(() => new OfflineStorage());
  const [syncManager] = useState(() => new SyncManager());
  
  // Cleanup au démontage
  useEffect(() => {
    return () => {
      // Nettoyer les instances
      if (llmEmulator?.cleanup) llmEmulator.cleanup();
      if (offlineStorage?.cleanup) offlineStorage.cleanup();
      if (syncManager?.cleanup) syncManager.cleanup();
    };
  }, [llmEmulator, offlineStorage, syncManager]);

  // Écouter les changements de connexion
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('[OfflineManager] Connexion rétablie');
      syncManager.syncAll().then(() => {
        setPendingSync(0);
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('[OfflineManager] Mode hors-ligne activé');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncManager]);

  // Initialiser le stockage offline
  useEffect(() => {
    const initOffline = async () => {
      try {
        await offlineStorage.init();
        await llmEmulator.init();
        setOfflineReady(true);
        
        // Charger le nombre d'opérations en attente
        const pending = await syncManager.getPendingCount();
        setPendingSync(pending);
        
        console.log('[OfflineManager] Système hors-ligne prêt');
      } catch (error) {
        console.error('[OfflineManager] Erreur initialisation:', error);
      }
    };

    initOffline();
  }, [offlineStorage, llmEmulator, syncManager]);

  // Enregistrer le Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('[OfflineManager] Service Worker enregistré:', registration.scope);
        })
        .catch(error => {
          console.error('[OfflineManager] Erreur Service Worker:', error);
        });
    }
  }, []);

  // Fonction pour invoquer le LLM (online ou offline)
  const invokeLLM = useCallback(async (params) => {
    // Validation des paramètres
    if (!params || typeof params !== 'object' || !params.prompt) {
      throw new Error('[OfflineManager] Paramètres LLM invalides: prompt requis');
    }

    if (isOnline) {
      try {
        return await base44.integrations.Core.InvokeLLM(params);
      } catch (error) {
        console.warn('[OfflineManager] Erreur LLM online, fallback vers émulateur:', error);
        // S'assurer que l'émulateur est prêt
        if (!llmEmulator.ready) {
          await llmEmulator.init();
        }
        return await llmEmulator.invoke(params);
      }
    } else {
      // Mode offline
      if (!llmEmulator.ready) {
        await llmEmulator.init();
      }
      return await llmEmulator.invoke(params);
    }
  }, [isOnline, llmEmulator]);

  // Fonction pour créer une entité (avec queue offline)
  const createEntity = useCallback(async (entityName, data) => {
    // Validation
    if (!entityName || typeof entityName !== 'string') {
      throw new Error('[OfflineManager] Nom d\'entité invalide');
    }
    if (!data || typeof data !== 'object') {
      throw new Error('[OfflineManager] Données d\'entité invalides');
    }

    if (isOnline) {
      try {
        return await base44.entities[entityName].create(data);
      } catch (error) {
        console.warn('[OfflineManager] Erreur création online, mise en queue:', error);
        await syncManager.queueOperation('create', entityName, data);
        setPendingSync(prev => prev + 1);
        return { id: `offline_${Date.now()}`, ...data };
      }
    } else {
      await syncManager.queueOperation('create', entityName, data);
      setPendingSync(prev => prev + 1);
      return { id: `offline_${Date.now()}`, ...data };
    }
  }, [isOnline, syncManager]);

  // Fonction pour mettre à jour une entité (avec queue offline)
  const updateEntity = useCallback(async (entityName, id, data) => {
    if (isOnline) {
      try {
        return await base44.entities[entityName].update(id, data);
      } catch (error) {
        console.warn('[OfflineManager] Erreur update online, mise en queue:', error);
        await syncManager.queueOperation('update', entityName, data, id);
        setPendingSync(prev => prev + 1);
        return { id, ...data };
      }
    } else {
      await syncManager.queueOperation('update', entityName, data, id);
      setPendingSync(prev => prev + 1);
      return { id, ...data };
    }
  }, [isOnline, syncManager]);

  // Fonction pour lire des entités (avec cache offline)
  const listEntity = useCallback(async (entityName, filter = {}) => {
    if (isOnline) {
      try {
        const data = await base44.entities[entityName].list();
        // Mettre en cache pour utilisation offline
        await offlineStorage.cacheEntities(entityName, data);
        return data;
      } catch (error) {
        console.warn('[OfflineManager] Erreur lecture online, utilisation du cache:', error);
        return await offlineStorage.getCachedEntities(entityName) || [];
      }
    } else {
      return await offlineStorage.getCachedEntities(entityName) || [];
    }
  }, [isOnline, offlineStorage]);

  // Forcer la synchronisation
  const forceSync = useCallback(async () => {
    if (!isOnline) {
      throw new Error('Cannot sync while offline');
    }
    
    await syncManager.syncAll();
    setPendingSync(0);
  }, [isOnline, syncManager]);

  const value = {
    isOnline,
    offlineReady,
    pendingSync,
    invokeLLM,
    createEntity,
    updateEntity,
    listEntity,
    forceSync,
    llmEmulator,
    offlineStorage,
    syncManager
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
}