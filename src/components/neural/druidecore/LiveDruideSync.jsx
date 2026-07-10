/**
 * DRUIDE_OMEGA - Synchronisation temps réel (Niveau 1)
 * S'abonne aux mémoires : dès que DruideCore crée une mémoire, tension ou filament,
 * toutes les visualisations de la page se rafraîchissent instantanément.
 */
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const QUERY_KEYS = [
  ['pipelineData'],
  ['tensionHistory'],
  ['ratioData'],
  ['filamentHistory'],
  ['memoryFlux'],
  ['cognitiveHeatmap']
];

export default function LiveDruideSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = base44.entities.Memory.subscribe(() => {
      QUERY_KEYS.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
    });
    return unsubscribe;
  }, [queryClient]);

  return null;
}