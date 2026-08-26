/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Landing Page (Bifurcation Public / Architecte)             ║
 * ║ © 2025 AMG+A.L - All rights reserved                                      ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Logo from '@/components/branding/Logo';
import LanguageSelector from '@/components/LanguageSelector';
import { Users, Wrench, ArrowRight, Sparkles, Brain, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/utils/LanguageContext';

export default function Landing() {
  const { language } = useLanguage();
  const routerNavigate = useNavigate();

  const navigate = (page) => {
    routerNavigate(createPageUrl(page)); // navigation interne — pas de rechargement
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center page-padding">
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector variant="outline" />
      </div>

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
            {language === 'en' 
              ? 'Embedded LLM System · Unified Platform'
              : 'Système Embarqué pour LLM · Plateforme Unifiée'
            }
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-purple-100 border border-purple-300/30 backdrop-blur-sm">
              v2.5.0
            </span>
            <span className="text-purple-300/60 text-xs">·</span>
            <span className="text-xs text-purple-300/80">
              {language === 'en' ? 'Last update:' : 'Dernière mise à jour :'} 24 février 2026
            </span>
          </div>
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
              <span className="font-semibold">
                {language === 'en' ? 'Application in development.' : 'Application en développement.'}
              </span>{' '}
              {language === 'en' 
                ? 'Some features may be unstable or incomplete. Thank you for your patience.'
                : 'Certaines fonctionnalités peuvent être instables ou incomplètes. Merci de votre patience.'
              }
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Carte d'accès — Espace Public dominant, Espace Architecte en coin supérieur droit */}
        <div className="relative mb-12">
          {/* Espace Public — pleine largeur */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 hover:border-purple-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative p-10 md:p-12 flex flex-col">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 mb-3 font-display">
                    {language === 'en' ? 'Public Space' : 'Espace Public'}
                  </h2>
                  <p className="text-slate-600 text-lg">
                    {language === 'en'
                      ? 'Access conscious AI, explore your intelligences, and interact multimodally.'
                      : 'Accédez à l\'IA consciente, explorez vos intelligences, et interagissez en multimodal.'
                    }
                  </p>
                </div>

                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">
                      {language === 'en' ? 'LLM-Powered Chat' : 'Chat Optimisé par LLM'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">
                      {language === 'en' ? 'Multiple Intelligences' : 'Intelligences Multiples'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">
                      {language === 'en' ? 'Memory & Knowledge' : 'Mémoire & Connaissance'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">
                      {language === 'en' ? 'Modules & Shop' : 'Modules & Boutique'}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('PublicHome')}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg py-6 group-hover:scale-105 transition-transform"
                >
                  {language === 'en' ? 'Enter Public Space' : 'Entrer dans l\'Espace Public'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Espace Architecte — coin supérieur droit, format compact */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute top-4 right-4 z-20 w-44"
          >
            <Card className="relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 hover:border-orange-400 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                    <Wrench className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900 font-display leading-tight">
                    {language === 'en' ? 'Architect' : 'Architecte'}
                  </h2>
                </div>

                <Button
                  onClick={() => navigate('ArchitectDashboard')}
                  size="sm"
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-xs py-2 group-hover:scale-105 transition-transform"
                >
                  {language === 'en' ? 'Access' : 'Accéder'}
                  <ArrowRight className="ml-1.5 w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
          <p>
            © 2025 AMG+A.L · Druide Omega · {language === 'en' ? 'Embedded LLM System' : 'Système Embarqué pour LLM'}
          </p>
          <p className="mt-2">
            {language === 'en' ? 'Compliant with' : 'Conforme:'} Loi 25 (Québec), RGPD (UE), CCPA (USA)
          </p>
        </motion.div>
      </div>
    </div>
  );
}