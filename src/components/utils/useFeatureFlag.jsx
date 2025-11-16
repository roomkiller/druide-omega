/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Feature Flags Hook                                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useFeatureFlag(flagName) {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me().catch(() => null)
  });

  const { data: flag, isLoading } = useQuery({
    queryKey: ['featureFlag', flagName],
    queryFn: async () => {
      const flags = await base44.entities.FeatureFlag.filter({ flag_name: flagName });
      return flags[0] || null;
    },
    staleTime: 60000 // 1 min cache
  });

  if (isLoading || !flag) {
    return { enabled: false, loading: isLoading };
  }

  // Check global enabled
  if (!flag.enabled) {
    return { enabled: false, loading: false };
  }

  // Check target users
  if (flag.target_users?.length > 0) {
    return {
      enabled: user && flag.target_users.includes(user.email),
      loading: false
    };
  }

  // Check rollout percentage
  if (flag.rollout_percentage < 100 && user) {
    const hash = user.email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const userPercentage = hash % 100;
    return {
      enabled: userPercentage < flag.rollout_percentage,
      loading: false
    };
  }

  return { enabled: true, loading: false };
}