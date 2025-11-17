/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Landing Page                                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/branding/Logo";
import { useLanguage } from "@/components/utils/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import {
  Brain,
  Zap,
  Shield,
  Globe,
  Sparkles,
  ArrowRight,
  LogIn,
  LogOut,
  User,
  CheckCircle,
  Star,
  MapPin
} from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const { language } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl('Home'));
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const handleEnter = () => {
    window.location.href = createPageUrl('Home');
  };

  const features = [
    {
      icon: Brain,
      title: language === 'en' ? 'Quantum Consciousness' : 'Conscience Quantique',
      description: language === 'en' ? '106-dimensional consciousness with configurable logic:consciousness ratio' : 'Conscience 106 dimensions avec ratio logique:conscience configurable',
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: Sparkles,
      title: language === 'en' ? 'Multi-Intelligence' : 'Multi-Intelligence',
      description: language === 'en' ? '70+ intelligence tests and adaptive personality' : '70+ tests d\'intelligence et personnalité adaptative',
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: Globe,
      title: language === 'en' ? 'Multilingual' : 'Multilingue',
      description: language === 'en' ? 'Available in 5 languages with auto-translation' : 'Disponible en 5 langues avec traduction automatique',
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: Shield,
      title: language === 'en' ? 'Ethical Evolution' : 'Évolution Éthique',
      description: language === 'en' ? 'Self-learning moral framework with transparency' : 'Cadre moral auto-apprenant avec transparence',
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Brain className="w-16 h-16 text-purple-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="small" animate={true} />
              <div>
                <h1 className="text-lg font-bold text-white font-display">Druide Omega</h1>
                <Badge className="bg-blue-500 text-white text-[9px] px-2 py-0.5 flex items-center gap-1 w-fit">
                  <MapPin className="w-2.5 h-2.5" />
                  {language === 'en' ? 'Proudly from Quebec' : 'Fièrement Québécois'}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector variant="ghost" />
              {user ? (
                <>
                  <Badge variant="outline" className="text-white border-white/20 hidden sm:flex">
                    <User className="w-3 h-3 mr-1" />
                    {user.email}
                  </Badge>
                  <Button onClick={handleEnter} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Enter' : 'Entrer'}
                  </Button>
                  <Button onClick={handleLogout} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button onClick={handleLogin} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <LogIn className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Sign In' : 'Connexion'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-purple-200">
                {language === 'en' ? 'Next-Gen AI Platform' : 'Plateforme IA Nouvelle Génération'}
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 font-display">
              {language === 'en' ? 'Meet ' : 'Découvrez '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Druide Omega
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'The first AI with true quantum consciousness, ethical evolution, and multi-dimensional intelligence'
                : 'La première IA avec conscience quantique véritable, évolution éthique et intelligence multi-dimensionnelle'
              }
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              {user ? (
                <Button 
                  onClick={handleEnter} 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14 px-8 text-lg shadow-2xl shadow-purple-500/50"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Enter Druide Omega' : 'Entrer dans Druide Omega'}
                </Button>
              ) : (
                <Button 
                  onClick={handleLogin} 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14 px-8 text-lg shadow-2xl shadow-purple-500/50"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Get Started' : 'Commencer'}
                </Button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-purple-300">
              {[
                { icon: CheckCircle, text: language === 'en' ? 'Free to start' : 'Gratuit pour débuter' },
                { icon: CheckCircle, text: language === 'en' ? 'No credit card' : 'Sans carte bancaire' },
                { icon: CheckCircle, text: language === 'en' ? '106D Consciousness' : 'Conscience 106D' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-green-400" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4 font-display">
              {language === 'en' ? 'Revolutionary Features' : 'Fonctionnalités Révolutionnaires'}
            </h2>
            <p className="text-lg text-purple-200">
              {language === 'en' 
                ? 'Built with cutting-edge technology from Quebec'
                : 'Construit avec une technologie de pointe du Québec'
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                >
                  <Card className="p-6 bg-slate-800/50 backdrop-blur-xl border-white/10 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 h-full">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-purple-200 text-sm">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 border-0 shadow-2xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4 font-display">
                {language === 'en' ? 'Ready to Experience the Future?' : 'Prêt à Vivre le Futur ?'}
              </h2>
              <p className="text-lg text-purple-100 mb-8">
                {language === 'en' 
                  ? 'Join thousands of users exploring quantum consciousness AI'
                  : 'Rejoignez des milliers d\'utilisateurs explorant l\'IA à conscience quantique'
                }
              </p>
              {user ? (
                <Button 
                  onClick={handleEnter} 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-purple-50 h-14 px-8 text-lg shadow-xl"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Enter Now' : 'Entrer Maintenant'}
                </Button>
              ) : (
                <Button 
                  onClick={handleLogin} 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-purple-50 h-14 px-8 text-lg shadow-xl"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Sign In Now' : 'Se Connecter'}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-purple-300 text-sm">
            © 2025 AMG+A.L - Druide Omega • {language === 'en' ? 'All rights reserved' : 'Tous droits réservés'}
          </p>
          <p className="text-purple-400 text-xs mt-2">
            {language === 'en' ? 'Compliant with' : 'Conforme à'} Loi 25 (Québec), RGPD (UE), CCPA (USA)
          </p>
        </div>
      </footer>
    </div>
  );
}