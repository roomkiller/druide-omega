/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Admin Login (contournement temporaire par code)            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, AlertCircle, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { validateArchitectCode, setArchitectBypass } from '@/lib/adminBypass';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Si déjà admin plateforme, accès direct
    base44.auth.me()
      .then((user) => {
        if (user?.role === 'admin') {
          navigate(createPageUrl('ArchitectDashboard'));
        } else {
          setStatus('form');
        }
      })
      .catch(() => setStatus('form'));
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateArchitectCode(code.trim())) {
      setArchitectBypass();
      navigate(createPageUrl('ArchitectDashboard'));
    } else {
      setError('Code incorrect. Accès refusé.');
    }
  };

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
        <Card className="p-8 bg-white/95 backdrop-blur-xl shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1 font-display text-center">
            Espace Architecte
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            Accès sécurisé — entrez votre code d'accès
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="architect-code" className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-orange-600" />
                Code d'accès
              </Label>
              <Input
                id="architect-code"
                type="password"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError(''); }}
                placeholder="••••••••••••"
                autoFocus
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
              Déverrouiller l'accès
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <Button
              variant="ghost"
              className="w-full text-slate-500"
              onClick={() => navigate(createPageUrl('PublicHome'))}
            >
              Retour à l'accueil
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}