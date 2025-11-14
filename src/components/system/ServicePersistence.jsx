/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Service Persistence Layer                                  ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ SYSTEM: Maintains services across page changes                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useEffect } from 'react';
import { useConsciousnessHub } from './ConsciousnessHub';

/**
 * Service that persists across page navigation
 * Maintains:
 * - Active conversations
 * - Voice connections
 * - Memory cache
 * - Knowledge base state
 */
export default function ServicePersistence({ currentPage }) {
  const hub = useConsciousnessHub();

  useEffect(() => {
    // Register page as active module
    hub.registerModule(`Page_${currentPage}`, {
      page: currentPage,
      loadTime: Date.now()
    });

    // Publish page change event
    hub.publishEvent({
      type: 'PAGE_CHANGE',
      source: 'ServicePersistence',
      data: {
        from: window.sessionStorage.getItem('lastPage'),
        to: currentPage
      }
    });

    // Store current page
    window.sessionStorage.setItem('lastPage', currentPage);

    // Cleanup on unmount
    return () => {
      hub.unregisterModule(`Page_${currentPage}`);
    };
  }, [currentPage, hub]);

  // Persist critical services
  useEffect(() => {
    const persistedData = {
      consciousnessLevel: hub.consciousnessConfig?.consciousness_level,
      activeModules: hub.activeModules,
      memoryCount: hub.memories?.length || 0,
      knowledgeCount: hub.knowledgeBases?.length || 0,
      lastSync: Date.now()
    };

    // Save to sessionStorage
    sessionStorage.setItem('druide_services', JSON.stringify(persistedData));
  }, [hub.consciousnessConfig, hub.activeModules, hub.memories, hub.knowledgeBases]);

  return null; // This is a service component, no UI
}