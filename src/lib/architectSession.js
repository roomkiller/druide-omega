/**
 * Session architecte — source unique pour savoir si l'espace architecte
 * doit être visible/accessible dans l'interface courante.
 */

import { useContext } from 'react';
import { AuthContext } from '@/lib/AuthContext';
import { hasArchitectBypass } from '@/lib/adminBypass';

export function useArchitectSession() {
  // Lecture tolérante du contexte : le Layout peut être monté avant/hors du
  // provider (rechargement à chaud, arbres de secours). Dans ce cas on retombe
  // simplement sur le laissez-passer local plutôt que de faire écran blanc.
  const auth = useContext(AuthContext);
  return auth?.user?.role === 'admin' || hasArchitectBypass();
}

export default useArchitectSession;