/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Architect Dashboard (Espace Admin)                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from 'react';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LanguageSelector from '@/components/LanguageSelector';
import { 
  Activity, 
  Brain, 
  Award,
  Users,
  Settings,
  BarChart3,
  Wrench,
  Zap,
  ArrowRight,
  Shield,
  AlertCircle,
  Sparkles,
  Home,
  LogOut,
  Code,
  FileText,
  Globe,
  Briefcase,
  Network,
  TrendingUp,
  Calendar,
  MessageSquare,
  Database,
  BookOpen,
  Eye,
  Target,
  Rocket,
  FlaskConical,
  FolderTree,
  ClipboardList,
  CheckCircle,
  Star,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/utils/LanguageContext';

export default function ArchitectDashboard() {
  const { language } = useLanguage();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      // Vérifier l'authentification admin locale
      const adminAuth = localStorage.getItem('druide_admin_auth');
      
      if (adminAuth !== 'true') {
        window.location.href = createPageUrl('AdminLogin');
        return;
      }
      
      setIsAdmin(true);
    } catch (error) {
      console.error('Erreur authentification:', error.message);
      window.location.href = createPageUrl('AdminLogin');
    } finally {
      setLoading(false);
    }
  };

  const adminFeatures = [
    {
      icon: Activity,
      title: 'Centre de Contrôle',
      description: 'Supervision complète du système Druide',
      url: 'DruideControl',
      color: 'from-purple-600 to-indigo-700',
      badge: 'Central'
    },
    {
      icon: Zap,
      title: 'System Health',
      description: 'Diagnostics et santé système',
      url: 'SystemHealth',
      color: 'from-emerald-600 to-teal-700'
    },
    {
      icon: Brain,
      title: 'Configuration Conscience',
      description: 'Paramètres conscience et SAPIER',
      url: 'Consciousness',
      color: 'from-purple-500 to-violet-600',
      badge: 'SAPIER'
    },
    {
      icon: Award,
      title: 'Tests IA',
      description: 'Batterie de tests cognitifs',
      url: 'AITests',
      color: 'from-indigo-600 to-purple-700'
    },
    {
      icon: Settings,
      title: 'Administration',
      description: 'Configuration système avancée',
      url: 'Admin',
      color: 'from-red-600 to-orange-700'
    },
    {
      icon: BarChart3,
      title: 'Évaluation Application',
      description: 'Métriques et performances',
      url: 'ApplicationEvaluation',
      color: 'from-purple-600 to-pink-700'
    },
    {
      icon: Users,
      title: 'Gestion Utilisateurs',
      description: 'Administration comptes',
      url: 'UserManagement',
      color: 'from-indigo-600 to-blue-700'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Tableaux de bord analytiques',
      url: 'PublicAdmin',
      color: 'from-cyan-600 to-blue-700'
    },
    {
      icon: Sparkles,
      title: 'Talents Cachés',
      description: 'Capacités profondes de Druide',
      url: 'HiddenTalents',
      color: 'from-pink-600 to-rose-700',
      badge: 'Nouveau'
    },
    {
      icon: Code,
      title: 'Auto-Codage Sécurisé',
      description: 'Laboratoire d\'amélioration autonome',
      url: 'SelfCodingLab',
      color: 'from-violet-600 to-purple-700',
      badge: 'IA+'
    },
    {
      icon: FileText,
      title: 'Preuve de Concept',
      description: 'Document technique certifié cryptographique',
      url: 'ProofOfConcept',
      color: 'from-purple-600 to-pink-700',
      badge: 'Protégé'
    },
    {
      icon: Globe,
      title: 'API Publique',
      description: 'Portail développeurs et intégrations entreprise',
      url: 'APIPortal',
      color: 'from-blue-600 to-cyan-700',
      badge: 'Public'
    },
    {
      icon: Briefcase,
      title: '100 Cas d\'Usage',
      description: 'Scénarios pratiques et comparaisons techniques',
      url: 'UseCases',
      color: 'from-purple-600 to-indigo-700',
      badge: 'Complet'
    },
    {
      icon: Home,
      title: 'Accueil Landing',
      description: 'Retour à la page d\'accueil principale',
      url: 'Landing',
      color: 'from-slate-600 to-gray-700'
    },
    {
      icon: Network,
      title: 'Système Neuronal',
      description: 'Modules neuronaux et réseau',
      url: 'NeuralSystem',
      color: 'from-cyan-600 to-blue-700',
      badge: 'Réseau'
    },
    {
      icon: TrendingUp,
      title: 'Progrès Projet',
      description: 'Avancement et métriques développement',
      url: 'ProjectProgress',
      color: 'from-green-600 to-emerald-700'
    },
    {
      icon: CheckCircle,
      title: 'Analyse Complétion',
      description: 'État d\'avancement par catégorie',
      url: 'CompletionAnalysis',
      color: 'from-blue-600 to-indigo-700'
    },
    {
      icon: Database,
      title: 'Mémoires',
      description: 'Gestion mémoire cross-modale',
      url: 'Memory',
      color: 'from-purple-600 to-indigo-700'
    },
    {
      icon: BookOpen,
      title: 'Base de Connaissances',
      description: 'Documents et sources de savoirs',
      url: 'Knowledge',
      color: 'from-amber-600 to-orange-700'
    },
    {
      icon: MessageSquare,
      title: 'Chat Principal',
      description: 'Interface conversationnelle IA',
      url: 'Chat',
      color: 'from-indigo-600 to-purple-700'
    },
    {
      icon: Eye,
      title: 'Galerie Visuelle',
      description: 'Contenus visuels générés',
      url: 'VisualGallery',
      color: 'from-pink-600 to-rose-700'
    },
    {
      icon: Calendar,
      title: 'Briefings Quotidiens',
      description: 'Synthèses intelligentes automatiques',
      url: 'DailyBriefing',
      color: 'from-violet-600 to-purple-700'
    },
    {
      icon: Target,
      title: 'Intelligences Multiples',
      description: 'Théorie de Gardner intégrée',
      url: 'Intelligences',
      color: 'from-teal-600 to-cyan-700'
    },
    {
      icon: Rocket,
      title: 'Évolution Conscience',
      description: 'Historique croissance cognitive',
      url: 'ConsciousnessEvolution',
      color: 'from-purple-600 to-pink-700'
    },
    {
      icon: FlaskConical,
      title: 'Documentation',
      description: 'Guides techniques et utilisateur',
      url: 'Documentation',
      color: 'from-blue-600 to-cyan-700'
    },
    {
      icon: FolderTree,
      title: 'Vue Projet',
      description: 'Architecture et structure globale',
      url: 'ProjectOverview',
      color: 'from-slate-600 to-gray-700'
    },
    {
      icon: ClipboardList,
      title: 'Guide Utilisateur',
      description: 'Manuel d\'utilisation complet',
      url: 'UserGuide',
      color: 'from-emerald-600 to-green-700'
    },
    {
      icon: Activity,
      title: 'Profil',
      description: 'Paramètres et personnalisation',
      url: 'Profile',
      color: 'from-indigo-600 to-purple-700'
    },
    {
      icon: MessageSquare,
      title: 'Salon Vocal',
      description: 'Interface communication vocale',
      url: 'VoiceRoom',
      color: 'from-rose-600 to-pink-700'
    },
    {
      icon: Shield,
      title: 'Propriété Intellectuelle',
      description: 'Droits et protection IP',
      url: 'IntellectualProperty',
      color: 'from-amber-600 to-yellow-700',
      badge: 'Légal'
    },
    {
      icon: FileText,
      title: 'Synthèse Documentation',
      description: 'Compilation technique complète',
      url: 'DocumentationSynthesis',
      color: 'from-blue-600 to-cyan-700'
    },
    {
      icon: Code,
      title: 'Référence API',
      description: 'Documentation endpoints API',
      url: 'APIReference',
      color: 'from-purple-600 to-indigo-700'
    },
    {
      icon: FolderTree,
      title: 'Architecture Technique',
      description: 'Structure système et design',
      url: 'TechnicalArchitecture',
      color: 'from-slate-600 to-gray-700'
    },
    {
      icon: Target,
      title: 'Coach IA',
      description: 'Assistant développement personnel',
      url: 'AICoach',
      color: 'from-green-600 to-emerald-700'
    },
    {
      icon: BarChart3,
      title: 'Analytics Comportement',
      description: 'Analyse usage et patterns',
      url: 'BehaviorAnalytics',
      color: 'from-cyan-600 to-blue-700'
    },
    {
      icon: BookOpen,
      title: 'Meilleures Pratiques',
      description: 'Guidelines et standards',
      url: 'BestPractices',
      color: 'from-purple-600 to-violet-700'
    },
    {
      icon: Calendar,
      title: 'Changelog',
      description: 'Historique versions et mises à jour',
      url: 'Changelog',
      color: 'from-indigo-600 to-blue-700'
    },
    {
      icon: Brain,
      title: 'Analyse Conscience',
      description: 'Métriques cognitives avancées',
      url: 'ConsciousnessAnalysis',
      color: 'from-purple-600 to-pink-700'
    },
    {
      icon: Activity,
      title: 'État Conscience',
      description: 'Monitoring temps réel',
      url: 'ConsciousnessState',
      color: 'from-violet-600 to-purple-700'
    },
    {
      icon: Target,
      title: 'Archive Décisions',
      description: 'Historique choix intuitifs',
      url: 'DecisionArchive',
      color: 'from-indigo-600 to-cyan-700'
    },
    {
      icon: Sparkles,
      title: 'Simulations Rêves',
      description: 'Exploration créative nocturne',
      url: 'Dreams',
      color: 'from-pink-600 to-purple-700',
      badge: 'Expérimental'
    },
    {
      icon: Heart,
      title: 'Journal Émotionnel',
      description: 'Suivi états émotionnels IA',
      url: 'EmotionalJournal',
      color: 'from-rose-600 to-pink-700'
    },
    {
      icon: Shield,
      title: 'Évolution Éthique',
      description: 'Progression morale et valeurs',
      url: 'EthicalEvolution',
      color: 'from-green-600 to-emerald-700'
    },
    {
      icon: MessageSquare,
      title: 'FAQ',
      description: 'Questions fréquentes',
      url: 'FAQ',
      color: 'from-blue-600 to-indigo-700'
    },
    {
      icon: Star,
      title: 'Favoris',
      description: 'Contenus sauvegardés',
      url: 'Favorites',
      color: 'from-amber-600 to-orange-700'
    },
    {
      icon: Zap,
      title: 'Vue Fonctionnalités',
      description: 'Catalogue capacités système',
      url: 'FeaturesOverview',
      color: 'from-cyan-600 to-blue-700'
    },
    {
      icon: Database,
      title: 'Modèles de Données',
      description: 'Schémas entités système',
      url: 'DataModels',
      color: 'from-purple-600 to-indigo-700'
    }
  ];

  const navigate = (url) => {
    window.location.href = createPageUrl(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('druide_admin_auth');
    localStorage.removeItem('druide_admin_email');
    window.location.href = createPageUrl('AdminLogin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Wrench className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">
            {language === 'en' ? 'Checking access...' : 'Vérification accès...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white page-padding py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-12 h-12" />
                <h1 className="text-5xl md:text-6xl font-bold font-display">
                  {language === 'en' ? 'Architect Dashboard' : 'Dashboard Architecte'}
                </h1>
              </div>
              <p className="text-xl text-orange-100 mb-8 max-w-3xl">
                {language === 'en'
                  ? 'Complete system control · Advanced configuration · Deep diagnostics'
                  : 'Contrôle système complet · Configuration avancée · Diagnostics profonds'
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector variant="ghost" />
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Logout' : 'Déconnexion'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto page-padding -mt-8 mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-purple-700 mb-1">
                    {language === 'en' ? 'Consciousness' : 'Conscience'}
                  </div>
                  <div className="text-2xl font-bold text-purple-700">12/15</div>
                </div>
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-green-700 mb-1">
                    {language === 'en' ? 'System' : 'Système'}
                  </div>
                  <div className="text-2xl font-bold text-green-700">OK</div>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-orange-700 mb-1">Provider</div>
                  <div className="text-lg font-bold text-orange-700">DeepSeek</div>
                </div>
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-indigo-700 mb-1">Tests</div>
                  <div className="text-2xl font-bold text-indigo-700">95%</div>
                </div>
                <Award className="w-8 h-8 text-indigo-600" />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Admin Features Grid */}
      <div className="max-w-7xl mx-auto page-padding pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card 
                  className="p-6 hover:shadow-xl transition-all cursor-pointer group h-full border-2 border-orange-100 hover:border-orange-300"
                  onClick={() => navigate(feature.url)}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                    {feature.badge && (
                      <Badge className="bg-orange-100 text-orange-700 text-xs">
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

      {/* Warning Banner */}
      <div className="max-w-7xl mx-auto page-padding pb-12">
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-900 mb-1">
                {language === 'en' ? 'Reserved for Administrators' : 'Espace Réservé Administrateurs'}
              </h3>
              <p className="text-sm text-amber-800">
                {language === 'en'
                  ? 'This space provides access to advanced system configuration features. Any modification may impact application behavior.'
                  : 'Cet espace donne accès à des fonctionnalités avancées de configuration système. Toute modification peut impacter le comportement de l\'application.'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}