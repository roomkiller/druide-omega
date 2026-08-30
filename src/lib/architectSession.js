/**
 * Session architecte — source unique pour savoir si l'espace architecte
 * doit être visible/accessible dans l'interface courante.
 */

import { useAuth } from '@/lib/AuthContext';
import { hasArchitectBypass } from '@/lib/adminBypass';

export function useArchitectSession() {
  const { user } = useAuth();
  return user?.role === 'admin' || hasArchitectBypass();
}

export default useArchitectSession;