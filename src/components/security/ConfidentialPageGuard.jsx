import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { hasArchitectBypass, hasDemoSession } from "@/lib/adminBypass";
import { Lock } from "lucide-react";
import { PUBLIC_PAGES_SET, CONFIDENTIAL_PAGES_SET } from "@/navigation.config";

/**
 * Garde de route pour les pages confidentielles.
 *
 * Aucun appel réseau ici : on lit la session déjà résolue par AuthProvider
 * (chargée une seule fois au démarrage) plus la session architecte locale.
 * Naviguer ne déclenche donc aucune requête — la navigation reste instantanée
 * et fonctionne même quand les services d'authentification ne répondent pas.
 */
export default function ConfidentialPageGuard({ children }) {
  const location = useLocation();
  const { user } = useAuth();

  const pageName = location.pathname.replace(/^\//, "").toLowerCase();
  const isPublic = PUBLIC_PAGES_SET.has(pageName);
  const isConfidential = !isPublic && CONFIDENTIAL_PAGES_SET.has(pageName);

  if (!isConfidential) return children;

  // La session démo est explicitement bloquée sur les pages confidentielles.
  const allowed = !hasDemoSession() && (user?.role === "admin" || hasArchitectBypass());

  if (allowed) return children;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="text-center max-w-md">
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-purple-300" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Accès restreint</h1>
        <p className="text-slate-400">
          Cette section contient des informations confidentielles réservées aux administrateurs.
        </p>
        <Link to="/" className="inline-block mt-6 text-purple-300 hover:text-purple-200 underline">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}