/**
 * Lien de retour vers l'espace architecte.
 * Rendu uniquement si une session architecte est active — totalement
 * invisible pour les visiteurs de l'espace public.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useArchitectSession } from '@/lib/architectSession';

export default function ArchitectReturnLink({ onNavigate, className = '' }) {
  const isArchitect = useArchitectSession();
  if (!isArchitect) return null;

  return (
    <Link
      to="/ArchitectDashboard"
      onClick={onNavigate}
      className={`w-full flex items-center text-sm px-3 py-2 rounded-lg border border-orange-300 hover:bg-orange-50 text-slate-700 font-medium ${className}`}
    >
      <Shield className="w-4 h-4 mr-2.5 text-orange-600" />
      <span className="flex-1 text-left">Espace architecte</span>
    </Link>
  );
}