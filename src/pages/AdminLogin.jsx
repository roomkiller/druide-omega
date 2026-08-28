/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Espace Architecte · Landing de connexion sécurisée         ║
 * ║ Onglet 1 : Authentification email + mot de passe (validée serveur)          ║
 * ║ Onglet 2 : Mode démonstration (identifiants affichés, accès limité)        ║
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
  Eye, EyeOff, Fingerprint, ArrowRight, ChevronLeft, Loader2,
  Sparkles, User, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { setArchitectBypass, setDemoSession } from '@/lib/adminBypass';

const SESSION_KEY = 'druide_architect_token';

// Identifiants démonstration — volontairement publics (accès limité aux pages publiques)
const DEMO_PSEUDO = 'demo';
const DEMO_PASSWORD = 'demo';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('architect'); // 'architect' | 'demo'
  const [status, setStatus] = useState('checking');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [demoPseudo, setDemoPseudo] = useState('');
  const [demoPassword, setDemoPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef(null);

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

  const handleDemoLogin = (e) => {
    e.preventDefault();
    setError('');
    if (demoPseudo.trim().toLowerCase() !== DEMO_PSEUDO || demoPassword !== DEMO_PASSWORD) {
      setError('Identifiants de démonstration incorrects. Utilisez ceux affichés ci-dessus.');
      return;
    }
    setDemoSession();
    navigate(createPageUrl('ArchitectDemo'), { replace: true });
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
          {/* En-tête */}
          <div className="flex flex-col items-center text-center mb-6">
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

          {/* Onglets */}
          <div className="grid grid-cols-2 gap-1 p-1 mb-6 bg-slate-950/60 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => { setMode('architect'); setError(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                mode === 'architect'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Fingerprint className="w-4 h-4" />
              Architecte
            </button>
            <button
              type="button"
              onClick={() => { setMode('demo'); setError(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                mode === 'demo'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Démonstration
            </button>
          </div>

          {/* === Mode Architecte === */}
          {mode === 'architect' && (
            <motion.form
              key="architect-form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
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
            </motion.form>
          )}

          {/* === Mode Démonstration === */}
          {mode === 'demo' && (
            <motion.div
              key="demo-form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Avertissement accès limité */}
              <div className="flex items-start gap-2 p-3 mb-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-cyan-200 leading-relaxed">
                  Le mode démonstration donne accès aux pages publiques de l'application.
                  Les sections confidentielles (architecture, sécurité, IP, administration) restent protégées.
                </p>
              </div>

              {/* Identifiants démo affichés */}
              <div className="mb-5 p-4 rounded-xl bg-slate-950/60 border border-dashed border-cyan-500/40">
                <p className="text-[11px] uppercase tracking-widest text-cyan-400/80 mb-3 font-semibold">
                  Identifiants de démonstration
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-slate-300">
                      <User className="w-4 h-4 text-slate-500" />
                      Pseudo
                    </span>
                    <code className="px-2.5 py-1 rounded-md bg-slate-800 text-cyan-300 font-mono text-sm border border-slate-700 select-all">
                      {DEMO_PSEUDO}
                    </code>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-slate-300">
                      <KeyRound className="w-4 h-4 text-slate-500" />
                      Mot de passe
                    </span>
                    <code className="px-2.5 py-1 rounded-md bg-slate-800 text-cyan-300 font-mono text-sm border border-slate-700 select-all">
                      {DEMO_PASSWORD}
                    </code>
                  </div>
                </div>
              </div>

              <form onSubmit={handleDemoLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="demo-pseudo" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                    <User className="w-4 h-4 text-cyan-400" />
                    Pseudo
                  </Label>
                  <Input
                    id="demo-pseudo"
                    type="text"
                    value={demoPseudo}
                    onChange={(e) => { setDemoPseudo(e.target.value); setError(''); }}
                    placeholder="demo"
                    autoComplete="username"
                    className="bg-slate-950/60 border-slate-700 text-white placeholder:text-slate-600 focus:border-cyan-500 focus:ring-cyan-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demo-password" className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    Mot de passe
                  </Label>
                  <Input
                    id="demo-password"
                    type="password"
                    value={demoPassword}
                    onChange={(e) => { setDemoPassword(e.target.value); setError(''); }}
                    placeholder="demo"
                    autoComplete="current-password"
                    className="bg-slate-950/60 border-slate-700 text-white placeholder:text-slate-600 focus:border-cyan-500 focus:ring-cyan-500/30"
                  />
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
                  disabled={!demoPseudo.trim() || !demoPassword}
                  className="w-full h-11 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 disabled:opacity-40 disabled:cursor-not-allowed group"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Explorer en démonstration
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Button>
              </form>
            </motion.div>
          )}

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
              {mode === 'architect' ? 'Session sécurisée · chiffrée' : 'Accès limité · démo'}
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