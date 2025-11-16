/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Intelligent Query Cache Hook                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useQuery } from "@tanstack/react-query";

/**
 * Configuration de cache optimisée par type de données
 */
export const CACHE_CONFIG = {
  // Données statiques (rarement modifiées)
  static: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 heure
  },
  
  // Données utilisateur (modifiées occasionnellement)
  user: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  },
  
  // Données temps réel (fréquemment modifiées)
  realtime: {
    staleTime: 30 * 1000, // 30 secondes
    cacheTime: 2 * 60 * 1000, // 2 minutes
  },
  
  // Données critiques (toujours fraîches)
  critical: {
    staleTime: 0,
    cacheTime: 0,
  }
};

/**
 * Hook optimisé pour requêtes avec cache intelligent
 */
export function useCachedQuery(queryKey, queryFn, cacheType = 'user', options = {}) {
  const cacheConfig = CACHE_CONFIG[cacheType] || CACHE_CONFIG.user;
  
  return useQuery({
    queryKey,
    queryFn,
    staleTime: cacheConfig.staleTime,
    cacheTime: cacheConfig.cacheTime,
    refetchOnWindowFocus: cacheType === 'critical' || cacheType === 'realtime',
    refetchOnReconnect: true,
    ...options
  });
}

/**
 * Hook pour pagination avec cache
 */
export function usePaginatedQuery(
  baseQueryKey, 
  queryFn, 
  { page = 1, pageSize = 20, cacheType = 'user' } = {}
) {
  const cacheConfig = CACHE_CONFIG[cacheType] || CACHE_CONFIG.user;
  
  return useQuery({
    queryKey: [...baseQueryKey, 'page', page, 'size', pageSize],
    queryFn: () => queryFn(page, pageSize),
    staleTime: cacheConfig.staleTime,
    cacheTime: cacheConfig.cacheTime,
    keepPreviousData: true, // Important pour pagination fluide
  });
}