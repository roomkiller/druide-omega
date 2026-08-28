/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Admin Login (authentification réelle par rôle)             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const navigate = useNavigate();
  // 'checking' | 'not_admin' — les admins et non-connectés sont redirigés
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    base44.auth.me()
      .then((user) => {
        if (user?.role === 'admin') {
          navigate(createPageUrl('ArchitectDashboard'));
        } else if (!user) {
          // Visiteur anonyme (app publique) → page de connexion sécurisée de la plateforme
          base44.auth.redirectToLogin(createPageUrl('ArchitectDashboard'));
        } else {
          setStatus('not_admin');
        }
      })
      .catch(() => {
        // Non connecté → page de connexion sécurisée de la plateforme
        base44.auth.redirectToLogin(createPageUrl('ArchitectDashboard'));
      });
  }, [navigate]);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Shield className="w-12 h-12 mx-auto mb-4 animate-pulse text-orange-400" />
          <p>Vérification de votre identité…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white/95 backdrop-blur-xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 font-display">
            Accès réservé
          </h1>
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-left mb-6">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Votre compte est connecté, mais il ne possède pas le rôle administrateur.
              L'espace Architecte est réservé aux administrateurs de l'application.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(createPageUrl('PublicHome'))}
          >
            Retour à l'accueil
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}