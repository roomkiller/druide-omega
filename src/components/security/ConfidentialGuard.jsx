/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - ConfidentialGuard (base neuve)                             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * Protège UNIQUEMENT les pages listées dans CONFIDENTIAL_PAGES.
 * Décision 100% synchrone (rôle déjà en mémoire + session architecte) :
 * aucun appel réseau, donc aucun ralentissement de navigation.
 * Toute page publique traverse le guard sans le moindre traitement.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { hasArchitectBypass } from '@/lib/adminBypass';
import { CONFIDENTIAL_PAGES_SET } from '@/navigation.config';

export default function ConfidentialGuard({ pageName, children }) {
  const { user } = useAuth();

  const isConfidential = CONFIDENTIAL_PAGES_SET.has((pageName || '').toLowerCase());
  if (!isConfidential) return children;

  const isAdmin = user?.role === 'admin';
  if (isAdmin || hasArchitectBypass()) return children;

  return (
    <div className="min-h-[70vh] flex items-center justify-center page-padding">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Contenu indisponible</h1>
        <p className="text-sm text-slate-600 mb-6">
          Cette section n'est pas disponible.
        </p>
        <div className="flex justify-center">
          <Link
            to="/PublicHome"
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
      </Card>
    </div>
  );
}