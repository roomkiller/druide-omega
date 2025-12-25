/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Admin Login                                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Lock, Mail, AlertCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Vérification des identifiants (Admin réel + Démo)
    const validCredentials = 
      (email === 'alexlavoie90@hotmail.com' && password === '605Betcher7574') ||
      (email === 'demo@druide-omega.app' && password === 'DemoOmega2025!');

    if (validCredentials) {
      // Authentification réussie
      localStorage.setItem('druide_admin_auth', 'true');
      localStorage.setItem('druide_admin_email', email);
      localStorage.setItem('druide_admin_demo', email === 'demo@druide-omega.app' ? 'true' : 'false');
      window.location.href = createPageUrl('ArchitectDashboard');
    } else {
      setError('Identifiants incorrects');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white/95 backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display">
              Connexion Admin
            </h1>
            <p className="text-slate-600">
              Accès réservé aux administrateurs
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-blue-900">Session Démo - Acheteurs Potentiels</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between bg-white/60 px-3 py-2 rounded">
                <span className="text-slate-600 font-medium">Email:</span>
                <Badge variant="outline" className="font-mono text-blue-700 border-blue-300">
                  demo@druide-omega.app
                </Badge>
              </div>
              <div className="flex items-center justify-between bg-white/60 px-3 py-2 rounded">
                <span className="text-slate-600 font-medium">Mot de passe:</span>
                <Badge variant="outline" className="font-mono text-blue-700 border-blue-300">
                  DemoOmega2025!
                </Badge>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2 italic">
              Accès complet en lecture seule pour évaluer l'application
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="text-right mb-4">
              <button
                type="button"
                onClick={() => window.location.href = createPageUrl('AdminPasswordReset')}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white h-11"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <Button
              variant="ghost"
              className="w-full text-slate-600"
              onClick={() => window.location.href = createPageUrl('PublicHome')}
            >
              Retour à l'accueil
            </Button>
          </div>
        </Card>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-center text-white/60 text-sm"
        >
          <Lock className="w-4 h-4 inline mr-1" />
          Connexion sécurisée
        </motion.div>
      </motion.div>
    </div>
  );
}