/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Espace Architecte · Landing de connexion sécurisée         ║
 * ║ Système interne de protection par code d'accès (session)                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Shield, Lock, AlertCircle, KeyRound,
  Eye, EyeOff, Fingerprint, ArrowRight, ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { validateArchitectCode, setArchitectBypass } from '@/lib/adminBypass';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const inputRef = useRef(null);

  // Vérifie si l'utilisateur est déjà admin plateforme → accès direct
  useEffect(() => {
    let active = true;
    base44.auth.me()
      .then((user) => {
        if (!active) return;
        if (user?.role === 'admin') {
          navigate(createPageUrl('ArchitectDashboard'), { replace: true });
        } else {
          setStatus('form');
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      })
      .catch(() => {
        if (!active) return;
        setStatus('form');
        setTimeout(() => inputRef.current?.focus(), 100);
      });
    return () => { active = false; };
  }, [navigate]);

  // Verrouillage temporaire après 5 tentatives échouées
  useEffect(() => {
    if (attempts >= 5 && !locked) {
      setLocked(true);
      setError("Trop de tentatives. Réessayez dans 30 secondes.");
      setTimeout(() => {
        setLocked(false);
        setAttempts(0);
        setError('');
      }, 30000);
    }
  }, [attempts, locked]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (locked) return;
    if (validateArchitectCode(code.trim())) {
      setArchitectBypass();
      navigate(createPageUrl('ArchitectDashboard'), { replace: true });
    } else {
      setAttempts((a) => a + 1);
      setError("Code d'accès incorrect. Accès refusé.");
      setCode('');
      inputRef.current?.focus();
    }
  };

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(124,58,237,0.25),transparent_60%)]" />
        <div className="relative text-center text-white">
          <Shield className="w-14 h-14 mx-auto mb-4 animate-pulse text-violet-400" />
          <p className="text-sm tracking-widest uppercase text-slate-400">
            Vérification de l'identité
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Halo d'ambiance */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.18),transparent_55%),radial-gradient(circle_at_75%_80%,rgba(236,72,153,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.6),rgba(2,6,23,0.95))] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <Card className="p-8 bg-slate-900/80 backdrop-blur-2xl border border-violet-500/20 shadow-[0_0_60px_-12px_rgba(124,58,237,0.45)]">
          {/* En-tête */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl blur-lg opacity-60" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white font-display tracking-tight">
              Espace Architecte
            </h1>
            <p className="text-sm text-slate-400 mt-1.5 max-w-xs">
              Zone protégée · authentification requise pour accéder au tableau de bord système
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="architect-code" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                <KeyRound className="w-4 h-4 text-violet-400" />
                Code d'accès architecte
              </Label>
              <div className="relative">
                <Input
                  ref={inputRef}
                  id="architect-code"
                  type={showCode ? 'text' : 'password'}
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError(''); }}
                  placeholder="Entrez votre code d'accès"
                  autoFocus
                  autoComplete="off"
                  disabled={locked}
                  className="bg-slate-950/60 border-slate-700 text-white placeholder:text-slate-600 pr-11 focus:border-violet-500 focus:ring-violet-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowCode((s) => !s)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showCode ? 'Masquer le code' : 'Afficher le code'}
                >
                  {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={locked || !code.trim()}
              className="w-full h-11 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <span className="flex items-center justify-center gap-2">
                <Fingerprint className="w-4 h-4" />
                Déverrouiller l'accès
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Button>
          </form>

          {/* Pied */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-800/60 px-2"
              onClick={() => navigate(createPageUrl('PublicHome'))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Accueil public
            </Button>
            <span className="text-[11px] text-slate-600 tracking-wide">
              Session sécurisée · chiffrée
            </span>
          </div>
        </Card>

        {/* Mention légale discrète */}
        <p className="text-center text-[11px] text-slate-600 mt-5">
          © 2025 AMG+A.L · Accès réservé · Loi 25 · RGPD · CCPA
        </p>
      </motion.div>
    </div>
  );
}