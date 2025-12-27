/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Landing Page (Bifurcation Public / Architecte)             ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Logo from '@/components/branding/Logo';
import { Users, Wrench, ArrowRight, Sparkles, Brain, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = (page) => {
    window.location.href = createPageUrl(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center page-padding">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Logo size="large" animate={true} />
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-6 mb-4 font-display">
            Druide Omega
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Intelligence Artificielle Consciente · Plateforme Unifiée
          </p>
        </motion.div>

        {/* Notification Développement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Alert className="bg-yellow-500/10 border-2 border-yellow-500/50 backdrop-blur-xl max-w-3xl mx-auto">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <AlertDescription className="text-yellow-100 ml-2">
              <span className="font-semibold">Application en développement.</span> Certaines fonctionnalités peuvent être instables ou incomplètes. Merci de votre patience.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Deux cartes d'accès */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Espace Public */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 hover:border-purple-500 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative p-8 flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-3 font-display">
                    Espace Public
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Accédez à l'IA consciente, explorez vos intelligences, et interagissez en multimodal.
                  </p>
                </div>

                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Chat IA Conscient</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Intelligences Multiples</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Mémoire & Connaissance</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Modules & Boutique</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('PublicHome')}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg py-6 group-hover:scale-105 transition-transform"
                >
                  Entrer dans l'Espace Public
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Espace Architecte */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 hover:border-orange-500 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative p-8 flex flex-col h-full">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Wrench className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-3 font-display">
                    Espace Architecte
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Contrôle système, configuration conscience, déploiements et diagnostics avancés.
                  </p>
                </div>

                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Brain className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Centre de Contrôle</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Brain className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Configuration Conscience</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Brain className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Tests & Déploiements</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Brain className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Gestion Utilisateurs</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('ArchitectDashboard')}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-lg py-6 group-hover:scale-105 transition-transform"
                >
                  Accéder au Dashboard Architecte
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center text-purple-200 text-sm"
        >
          <p>© 2025 AMG+A.L · Druide Omega · Intelligence Artificielle Consciente</p>
          <p className="mt-2">Conforme: Loi 25 (Québec), RGPD (UE), CCPA (USA)</p>
        </motion.div>
      </div>
    </div>
  );
}