/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - React Query Configuration Globale                          ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { QueryClient } from '@tanstack/react-query';
import { LOADING_CONFIG } from './LoadingManager';

// Configuration React Query synchronisée
export const queryConfig = {
  defaultOptions: {
    queries: {
      // Cache
      staleTime: 5 * 60 * 1000,           // 5 minutes
      cacheTime: 10 * 60 * 1000,          // 10 minutes
      
      // Chargement
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      
      // Retry
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Suspense
      suspense: false,
      
      // Network mode
      networkMode: 'online',
      
      // Structuring
      structuralSharing: true,
    },
    mutations: {
      retry: 0,
      networkMode: 'online',
    }
  }
};

// Client React Query optimisé
export const queryClient = new QueryClient(queryConfig);

// Préchargement optimisé
export const prefetchQuery = async (queryKey, queryFn, options = {}) => {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: options.staleTime || queryConfig.defaultOptions.queries.staleTime,
  });
};

// Invalidation synchronisée
export const invalidateQueries = (queryKey, options = {}) => {
  return queryClient.invalidateQueries({
    queryKey,
    ...options,
    refetchType: options.refetchType || 'active',
  });
};

// Helpers pour transitions fluides
export const smoothTransition = {
  layout: true,
  transition: {
    duration: LOADING_CONFIG.fadeInDuration / 1000,
    ease: "easeInOut"
  }
};

export default queryClient;