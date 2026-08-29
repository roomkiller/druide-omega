import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { hasArchitectBypass, hasDemoSession } from "@/lib/adminBypass";
import { Lock } from "lucide-react";
import { PUBLIC_PAGES_SET, CONFIDENTIAL_PAGES_SET } from "@/navigation.config";

export default function ConfidentialPageGuard({ children }) {
  const location = useLocation();
  const pageName = location.pathname.replace(/^\//, "").toLowerCase();
  const isPublic = PUBLIC_PAGES_SET.has(pageName);
  const isConfidential = !isPublic && CONFIDENTIAL_PAGES_SET.has(pageName);
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!isConfidential) return;
    setStatus("checking");
    // Plein accès : admin plateforme OU session architecte (email+mdp serveur)
    // La session démo est explicitement bloquée sur les pages confidentielles
    if (hasDemoSession()) {
      setStatus("denied");
      return;
    }
    base44.auth
      .me()
      .then((user) => setStatus(user?.role === "admin" || hasArchitectBypass() ? "allowed" : "denied"))
      .catch(() => setStatus(hasArchitectBypass() ? "allowed" : "denied"));
  }, [isConfidential, location.pathname]);

  if (!isConfidential || status === "allowed") return children;

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

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