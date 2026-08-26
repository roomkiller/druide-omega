/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Public Home (Accueil Utilisateur Public)                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/utils/LanguageContext';
import { 
  MessageSquare, Radio, Lightbulb, Database, BookOpen,
  Network, Gamepad, ShoppingCart, User, ArrowRight,
  Brain, Home, FileText, Film,
  Sparkles, Microscope, Star, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicHome() {
  const { language } = useLanguage();
  const routerNavigate = useNavigate();

  const en = language === 'en';

  const features = [
    {
      icon: MessageSquare,
      title: en ? 'Standard Chat' : 'Chat Standard',
      description: en ? 'Conversations with advanced LLM system' : 'Conversations avec système LLM avancé',
      url: 'Chat',
      color: 'from-purple-500 to-indigo-600',
      badge: en ? 'Popular' : 'Populaire'
    },
    {
      icon: Home,
      title: en ? 'Landing Home' : 'Accueil Landing',
      description: en ? 'Back to the main landing page' : 'Retour à la page d\'accueil principale',
      url: 'Landing',
      color: 'from-slate-500 to-gray-600',
    },
    {
      icon: Radio,
      title: en ? 'Voice Room' : 'Salon Vocal',
      description: en ? 'Natural voice interaction in real time' : 'Interaction vocale naturelle en temps réel',
      url: 'VoiceRoom',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Lightbulb,
      title: en ? 'Multiple Intelligences' : 'Intelligences Multiples',
      description: en ? 'Explore your 8 intelligences according to Gardner' : 'Explorez vos 8 intelligences selon Gardner',
      url: 'Intelligences',
      color: 'from-amber-500 to-orange-600',
      badge: en ? 'New' : 'Nouveau'
    },
    {
      icon: Database,
      title: en ? 'Memory' : 'Mémoire',
      description: en ? 'Your personal multimodal memory' : 'Votre mémoire personnelle multimodale',
      url: 'Memory',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: BookOpen,
      title: en ? 'Knowledge Base' : 'Base de Connaissance',
      description: en
        ? 'Import, organize and enrich your documents, URLs and texts. The AI analyzes, summarizes and makes them available in every conversation.'
        : 'Importez, organisez et enrichissez vos documents, URLs et textes. L\'IA les analyse, les résume et les rend disponibles dans chaque conversation.',
      url: 'Knowledge',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Network,
      title: en ? 'Knowledge Graph' : 'Graphe de Connaissance',
      description: en ? 'Interactive visualization of connections between your knowledge' : 'Visualisation interactive des connexions et relations entre vos savoirs',
      url: 'KnowledgeGraph',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Gamepad,
      title: en ? 'Games' : 'Jeux',
      description: en ? 'Interactive games with advanced LLM system' : 'Jeux interactifs avec système LLM avancé',
      url: 'Games',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: User,
      title: en ? 'My Profile' : 'Mon Profil',
      description: en ? 'Settings and personalization' : 'Configuration et personnalisation',
      url: 'Profile',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Film,
      title: en ? 'Video Studio' : 'Studio Vidéo',
      description: en ? 'Create videos with AI' : 'Créez des vidéos avec l\'IA',
      url: 'VideoStudio',
      color: 'from-red-500 to-pink-600',
      badge: en ? 'Creative' : 'Créatif'
    },
    {
      icon: Sparkles,
      title: en ? 'AI Synthesis' : 'Synthèse IA',
      description: en ? 'Multi-source intelligent synthesis' : 'Synthèse intelligente multi-sources',
      url: 'IntelligentSynthesis',
      color: 'from-amber-500 to-orange-600',
      badge: en ? 'New' : 'Nouveau'
    },
    {
      icon: Microscope,
      title: en ? 'Medical Research' : 'Recherche Médicale',
      description: en ? 'Clinical analysis and medical protocols' : 'Analyses cliniques et protocoles médicaux',
      url: 'MedicalResearch',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: Brain,
      title: en ? 'Psychology Research' : 'Recherche Psychologie',
      description: en ? 'Psychological and behavioral analysis' : 'Analyse psychologique et comportementale',
      url: 'PsychologyResearch',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Star,
      title: en ? 'Hidden Talents' : 'Talents Cachés',
      description: en ? 'Discover your unsuspected abilities' : 'Découvrez vos capacités insoupçonnées',
      url: 'HiddenTalents',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Zap,
      title: en ? 'Features' : 'Fonctionnalités',
      description: en ? 'Overview of all capabilities' : 'Vue d\'ensemble des capacités',
      url: 'FeaturesOverview',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: MessageSquare,
      title: en ? 'Prompt Guide' : 'Guide Prompts',
      description: en ? 'Best practices for prompting' : 'Bonnes pratiques de prompting',
      url: 'PromptGuide',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  const navigate = (url) => {
    routerNavigate(createPageUrl(url)); // navigation interne — pas de rechargement
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
              {en ? 'Welcome to Druide Omega' : 'Bienvenue dans Druide Omega'}
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              {en
                ? 'Explore the embedded LLM system and discover your multiple intelligences'
                : 'Explorez le système LLM embarqué et découvrez vos intelligences multiples'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button
                onClick={() => navigate('Chat_2')}
                className="bg-white text-purple-600 hover:bg-purple-50 text-lg px-8 py-6"
              >
                <Brain className="mr-2 w-5 h-5" />
                {en ? 'Deep Chat with Druide' : 'Chat Profond avec Druide'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate('Documentation')}
                variant="outline"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-lg px-8 py-6"
              >
                <FileText className="mr-2 w-5 h-5" />
                {en ? 'Documentation' : 'Documentation'}
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
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <div className="text-4xl font-bold text-purple-600 mb-2">∞</div>
              <div className="text-slate-600">{en ? 'Optimization Level' : 'Niveau d\'Optimisation'}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
              <div className="text-4xl font-bold text-indigo-600 mb-2">8</div>
              <div className="text-slate-600">{en ? 'Multiple Intelligences' : 'Intelligences Multiples'}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
              <div className="text-4xl font-bold text-purple-600 mb-2">∞</div>
              <div className="text-slate-600">{en ? 'Possibilities' : 'Possibilités'}</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}