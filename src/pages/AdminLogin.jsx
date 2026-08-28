/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Espace Architecte · Landing de connexion sécurisée         ║
 * ║ Authentification email + mot de passe (validée côté serveur via secrets)  ║
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
  Shield, Lock, AlertCircle, Mail, KeyRound,
  Eye, EyeOff, Fingerprint, ArrowRight, ChevronLeft, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { setArchitectBypass } from '@/lib/adminBypass';

const SESSION_KEY = 'druide_architect_token';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef(null);

  // Vérifie si déjà admin plateforme ou déjà authentifié architecte
  useEffect(() => {
    let active = true;
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      navigate(createPageUrl('ArchitectDashboard'), { replace: true });
      return;
    }
    base44.auth.me()
      .then((user) => {
        if (!active) return;
        if (user?.role === 'admin') {
          navigate(createPageUrl('ArchitectDashboard'), { replace: true });
        } else {
          setStatus('form');
          setTimeout(() => emailRef.current?.focus(), 100);
        }
      })
      .catch(() => {
        if (!active) return;
        setStatus('form');
        setTimeout(() => emailRef.current?.focus(), 100);
      });
    return () => { active = false; };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await base44.functions.invoke('architectAuth', {
        email: email.trim(),
        password
      });
      if (res?.data?.success && res.data.token) {
        sessionStorage.setItem(SESSION_KEY, res.data.token);
        setArchitectBypass();
        navigate(createPageUrl('ArchitectDashboard'), { replace: true });
      } else {
        setError(res?.data?.error || 'Identifiants incorrects.');
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Échec de l\'authentification.';
      setError(msg);
    } finally {
      setSubmitting(false);
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.18),transparent_55%),radial-gradient(circle_at_75%_80%,rgba(236,72,153,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.6),rgba(2,6,23,0.95))] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <Card className="p-8 bg-slate-900/80 backdrop-blur-2xl border border-violet-500/20 shadow-[0_0_60px_-12px_rgba(124,58,237,0.45)]">
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="architect-email" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                <Mail className="w-4 h-4 text-violet-400" />
                Identifiant (email)
              </Label>
              <Input
                ref={emailRef}
                id="architect-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="vous@exemple.com"
                autoComplete="username"
                disabled={submitting}
                className="bg-slate-950/60 border-slate-700 text-white placeholder:text-slate-600 focus:border-violet-500 focus:ring-violet-500/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="architect-password" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                <KeyRound className="w-4 h-4 text-violet-400" />
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="architect-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  disabled={submitting}
                  className="bg-slate-950/60 border-slate-700 text-white placeholder:text-slate-600 pr-11 focus:border-violet-500 focus:ring-violet-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
              disabled={submitting || !email.trim() || !password}
              className="w-full h-11 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <span className="flex items-center justify-center gap-2">
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Fingerprint className="w-4 h-4" />
                )}
                {submitting ? 'Vérification…' : 'Déverrouiller l\'accès'}
                {!submitting && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
              </span>
            </Button>
          </form>

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

        <p className="text-center text-[11px] text-slate-600 mt-5">
          © 2025 AMG+A.L · Accès réservé · Loi 25 · RGPD · CCPA
        </p>
      </motion.div>
    </div>
  );
}