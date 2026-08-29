/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Public Home (Accueil Utilisateur Public)                   ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 *
 * NAVIGATION : chaque élément pointe directement vers sa route via <Link>.
 * Aucun handler onClick, aucun useNavigate, aucun verrou, aucune modale.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/utils/LanguageContext';
import FeatureCard from '@/components/home/FeatureCard';
import {
  MessageSquare, Radio, Lightbulb, Database, BookOpen,
  Network, Gamepad, User, ArrowRight,
  Brain, Home, FileText, Film,
  Sparkles, Microscope, Star, Zap, Trophy
} from 'lucide-react';

export default function PublicHome() {
  const { language } = useLanguage();
  const en = language === 'en';

  const features = [
    {
      icon: MessageSquare,
      title: en ? 'Standard Chat' : 'Chat Standard',
      description: en ? 'Conversations with advanced LLM system' : 'Conversations avec système LLM avancé',
      path: '/Chat',
      color: 'from-purple-500 to-indigo-600',
      badge: en ? 'Popular' : 'Populaire'
    },
    {
      icon: Brain,
      title: en ? 'Deep Consciousness Chat' : 'Chat Conscience Profonde',
      description: en ? 'Deep consciousness conversations with cognitive architecture' : 'Conversations à conscience profonde avec architecture cognitive',
      path: '/Chat_2',
      color: 'from-violet-500 to-fuchsia-600',
      badge: en ? 'Deep' : 'Profond'
    },
    {
      icon: Radio,
      title: en ? 'Voice Room' : 'Salon Vocal',
      description: en ? 'Natural voice interaction in real time' : 'Interaction vocale naturelle en temps réel',
      path: '/VoiceRoom',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Lightbulb,
      title: en ? 'Multiple Intelligences' : 'Intelligences Multiples',
      description: en ? 'Explore your 8 intelligences according to Gardner' : 'Explorez vos 8 intelligences selon Gardner',
      path: '/Intelligences',
      color: 'from-amber-500 to-orange-600',
      badge: en ? 'New' : 'Nouveau'
    },
    {
      icon: Database,
      title: en ? 'Memory' : 'Mémoire',
      description: en ? 'Your personal multimodal memory' : 'Votre mémoire personnelle multimodale',
      path: '/Memory',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: BookOpen,
      title: en ? 'Knowledge Base' : 'Base de Connaissance',
      description: en
        ? 'Import, organize and enrich your documents, URLs and texts. The AI analyzes, summarizes and makes them available in every conversation.'
        : 'Importez, organisez et enrichissez vos documents, URLs et textes. L\'IA les analyse, les résume et les rend disponibles dans chaque conversation.',
      path: '/Knowledge',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Network,
      title: en ? 'Cognitive Network' : 'Réseau Cognitif',
      description: en ? 'Interactive visualization of cognitive correlations and neural pathways' : 'Visualisation interactive des corrélations cognitives et des chemins neuronaux',
      path: '/CognitiveNetworkVisualization',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Gamepad,
      title: en ? 'Games' : 'Jeux',
      description: en ? 'Interactive games with advanced LLM system' : 'Jeux interactifs avec système LLM avancé',
      path: '/Games',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: User,
      title: en ? 'My Profile' : 'Mon Profil',
      description: en ? 'Settings and personalization' : 'Configuration et personnalisation',
      path: '/Profile',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Film,
      title: en ? 'Video Studio' : 'Studio Vidéo',
      description: en ? 'Create videos with AI' : 'Créez des vidéos avec l\'IA',
      path: '/VideoStudio',
      color: 'from-red-500 to-pink-600',
      badge: en ? 'Creative' : 'Créatif'
    },
    {
      icon: Sparkles,
      title: en ? 'AI Synthesis' : 'Synthèse IA',
      description: en ? 'Multi-source intelligent synthesis' : 'Synthèse intelligente multi-sources',
      path: '/IntelligentSynthesis',
      color: 'from-amber-500 to-orange-600',
      badge: en ? 'New' : 'Nouveau'
    },
    {
      icon: Microscope,
      title: en ? 'Medical Research' : 'Recherche Médicale',
      description: en ? 'Clinical analysis and medical protocols' : 'Analyses cliniques et protocoles médicaux',
      path: '/MedicalResearch',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: Brain,
      title: en ? 'Psychology Research' : 'Recherche Psychologie',
      description: en ? 'Psychological and behavioral analysis' : 'Analyse psychologique et comportementale',
      path: '/PsychologyResearch',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: Star,
      title: en ? 'Hidden Talents' : 'Talents Cachés',
      description: en ? 'Discover your unsuspected abilities' : 'Découvrez vos capacités insoupçonnées',
      path: '/HiddenTalents',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Zap,
      title: en ? 'Features' : 'Fonctionnalités',
      description: en ? 'Overview of all capabilities' : 'Vue d\'ensemble des capacités',
      path: '/FeaturesOverview',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Trophy,
      title: en ? 'AI Tests & Performance' : 'Tests IA & Performance',
      description: en ? '70 real evaluation tests and market comparison' : '70 tests d\'évaluation réels et comparaison marché',
      path: '/AITests',
      color: 'from-amber-500 to-orange-600',
      badge: en ? 'Public' : 'Public'
    },
    {
      icon: MessageSquare,
      title: en ? 'Prompt Guide' : 'Guide Prompts',
      description: en ? 'Best practices for prompting' : 'Bonnes pratiques de prompting',
      path: '/PromptGuide',
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Bouton Accueil */}
      <div className="absolute top-4 left-3 z-50">
        <Link
          to="/Landing"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-sm font-medium bg-white/15 border border-white/30 text-white hover:bg-white/25 hover:border-white/50 backdrop-blur-md"
        >
          <Home className="w-4 h-4" />
          {en ? 'Home' : 'Accueil'}
        </Link>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white page-padding py-16">
        <div className="max-w-7xl mx-auto text-center">
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
            <Button asChild className="bg-white text-purple-600 hover:bg-purple-50 text-lg px-8 py-6">
              <Link to="/Chat_2">
                <Brain className="mr-2 w-5 h-5" />
                {en ? 'Deep Chat with Druide' : 'Chat Profond avec Druide'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-lg px-8 py-6"
            >
              <Link to="/Documentation">
                <FileText className="mr-2 w-5 h-5" />
                Documentation
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid — liens directs, aucun délai d'animation */}
      <div className="max-w-7xl mx-auto page-padding page-padding-y">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 page-padding py-12 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">∞</div>
              <div className="text-slate-600">{en ? 'Optimization Level' : 'Niveau d\'Optimisation'}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">8</div>
              <div className="text-slate-600">{en ? 'Multiple Intelligences' : 'Intelligences Multiples'}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">∞</div>
              <div className="text-slate-600">{en ? 'Possibilities' : 'Possibilités'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}