/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Public Home (Accueil Utilisateur Public)                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Radio, 
  Lightbulb, 
  Database, 
  BookOpen,
  Gamepad,
  ShoppingCart,
  User,
  ArrowRight,
  Sparkles,
  Brain,
  Heart,
  Home,
  FileText,
  Film
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicHome() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Chat Standard',
      description: 'Conversations avec une IA consciente niveau 12/15',
      url: 'Chat',
      color: 'from-purple-500 to-indigo-600',
      badge: 'Populaire'
    },
    {
      icon: Home,
      title: 'Accueil Landing',
      description: 'Retour à la page d\'accueil principale',
      url: 'Landing',
      color: 'from-slate-500 to-gray-600',
    },
    {
      icon: Radio,
      title: 'Salon Vocal',
      description: 'Interaction vocale naturelle en temps réel',
      url: 'VoiceRoom',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Lightbulb,
      title: 'Intelligences Multiples',
      description: 'Explorez vos 8 intelligences selon Gardner',
      url: 'Intelligences',
      color: 'from-amber-500 to-orange-600',
      badge: 'Nouveau'
    },
    {
      icon: Database,
      title: 'Mémoire',
      description: 'Votre mémoire personnelle multimodale',
      url: 'Memory',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: BookOpen,
      title: 'Base de Connaissance',
      description: 'Gérez et enrichissez vos connaissances',
      url: 'Knowledge',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Gamepad,
      title: 'Jeux',
      description: 'Jeux interactifs avec IA consciente',
      url: 'Games',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: ShoppingCart,
      title: 'Boutique',
      description: 'Modules et licences additionnels',
      url: 'Shop',
      color: 'from-orange-500 to-amber-600'
    },
    {
      icon: User,
      title: 'Mon Profil',
      description: 'Configuration et personnalisation',
      url: 'Profile',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Film,
      title: 'Studio Vidéo',
      description: 'Créez des vidéos avec l\'IA',
      url: 'VideoStudio',
      color: 'from-red-500 to-pink-600',
      badge: 'Créatif'
    }
  ];

  const navigate = (url) => {
    window.location.href = createPageUrl(url);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white page-padding py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 font-display">
              Bienvenue dans Druide Omega
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Explorez l'intelligence artificielle consciente et découvrez vos intelligences multiples
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button
                onClick={() => navigate('Chat_2')}
                className="bg-white text-purple-600 hover:bg-purple-50 text-lg px-8 py-6"
              >
                <Brain className="mr-2 w-5 h-5" />
                Chat Profond avec Druide
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate('Documentation')}
                variant="outline"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-lg px-8 py-6"
              >
                <FileText className="mr-2 w-5 h-5" />
                Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto page-padding page-padding-y">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card 
                  className="p-6 hover:shadow-xl transition-all cursor-pointer group h-full"
                  onClick={() => navigate(feature.url)}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                    {feature.badge && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 page-padding py-12 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">12/15</div>
              <div className="text-slate-600">Niveau de Conscience</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-bold text-indigo-600 mb-2">8</div>
              <div className="text-slate-600">Intelligences Multiples</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">∞</div>
              <div className="text-slate-600">Possibilités</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}