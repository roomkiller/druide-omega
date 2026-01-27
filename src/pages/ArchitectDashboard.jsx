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
  Heart,
  CreditCard,
  Scale,
  Lock,
  GraduationCap,
  Languages,
  Smartphone,
  Link,
  DollarSign,
  Package,
  Store,
  Gauge,
  WifiOff,
  FolderOpen,
  GitMerge,
  Archive,
  Layers,
  Palette,
  GitBranch,
  Search,
  Compass,
  Microscope,
  Lightbulb,
  Handshake,
  Radio,
  User,
  ShoppingCart,
  Trophy
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

  const featuresByCategory = {
    'Contrôle & Monitoring': [
      { icon: Activity, title: 'Centre de Contrôle', description: 'Supervision complète du système Druide', url: 'DruideControl', color: 'from-purple-600 to-indigo-700', badge: 'Central' },
      { icon: Zap, title: 'System Health', description: 'Diagnostics et santé système', url: 'SystemHealth', color: 'from-emerald-600 to-teal-700' },
      { icon: Activity, title: 'Monitoring', description: 'Surveillance système temps réel', url: 'Monitoring', color: 'from-green-600 to-emerald-700' },
      { icon: Activity, title: 'Status', description: 'État services et disponibilité', url: 'Status', color: 'from-cyan-600 to-blue-700' }
    ],
    'Conscience & IA': [
      { icon: Brain, title: 'Configuration Conscience', description: 'Paramètres conscience et SAPIER', url: 'Consciousness', color: 'from-purple-500 to-violet-600', badge: 'SAPIER' },
      { icon: Brain, title: 'Analyse Conscience', description: 'Métriques cognitives avancées', url: 'ConsciousnessAnalysis', color: 'from-purple-600 to-pink-700' },
      { icon: Activity, title: 'État Conscience', description: 'Monitoring temps réel', url: 'ConsciousnessState', color: 'from-violet-600 to-purple-700' },
      { icon: Rocket, title: 'Évolution Conscience', description: 'Historique croissance cognitive', url: 'ConsciousnessEvolution', color: 'from-purple-600 to-pink-700' },
      { icon: Sparkles, title: 'Talents Cachés', description: 'Capacités profondes de Druide', url: 'HiddenTalents', color: 'from-pink-600 to-rose-700', badge: 'Nouveau' }
    ],
    'Tests & Évaluation': [
      { icon: Award, title: 'Tests IA', description: 'Batterie de tests cognitifs', url: 'AITests', color: 'from-indigo-600 to-purple-700' },
      { icon: BarChart3, title: 'Évaluation Application', description: 'Métriques et performances', url: 'ApplicationEvaluation', color: 'from-purple-600 to-pink-700' },
      { icon: TrendingUp, title: 'Progrès Projet', description: 'Avancement et métriques développement', url: 'ProjectProgress', color: 'from-green-600 to-emerald-700' },
      { icon: CheckCircle, title: 'Analyse Complétion', description: 'État d\'avancement par catégorie', url: 'CompletionAnalysis', color: 'from-blue-600 to-indigo-700' },
      { icon: FlaskConical, title: 'Test Runner', description: 'Exécution tests automatisés', url: 'TestRunner', color: 'from-cyan-600 to-blue-700' },
      { icon: Shield, title: 'Audit Application', description: 'Audit complet sécurité et code', url: 'ApplicationAudit', color: 'from-red-600 to-rose-700' }
    ],
    'Connaissances & Mémoire': [
      { icon: Database, title: 'Mémoires', description: 'Gestion mémoire cross-modale', url: 'Memory', color: 'from-purple-600 to-indigo-700' },
      { icon: BookOpen, title: 'Base de Connaissances', description: 'Documents et sources de savoirs', url: 'Knowledge', color: 'from-amber-600 to-orange-700' },
      { icon: GitMerge, title: 'Fusion Connaissances', description: 'Synthèse multi-sources', url: 'KnowledgeFusion', color: 'from-cyan-600 to-blue-700' },
      { icon: Sparkles, title: 'Enrichissement Connaissances', description: 'Expansion automatique savoirs', url: 'KnowledgeEnrichment', color: 'from-purple-600 to-pink-700' },
      { icon: Database, title: 'Gestion Connaissances', description: 'Organisation et indexation', url: 'KnowledgeManagement', color: 'from-blue-600 to-indigo-700' },
      { icon: Archive, title: 'Consolidation Mémoire', description: 'Optimisation stockage long terme', url: 'MemoryConsolidation', color: 'from-purple-600 to-indigo-700' }
    ],
    'Sécurité & Légal': [
      { icon: Shield, title: 'Security', description: 'Audit et contrôle sécurité', url: 'Security', color: 'from-red-600 to-orange-700' },
      { icon: Shield, title: 'Security Dashboard', description: 'Tableau de bord sécurité avancé', url: 'SecurityDashboard', color: 'from-rose-600 to-red-700' },
      { icon: Shield, title: 'Propriété Intellectuelle', description: 'Droits et protection IP', url: 'IntellectualProperty', color: 'from-amber-600 to-yellow-700', badge: 'Légal' },
      { icon: CheckCircle, title: 'Conformité RGPD', description: 'Validation protection données', url: 'GDPRCompliance', color: 'from-blue-600 to-indigo-700' },
      { icon: Database, title: 'Validation Données', description: 'Vérification intégrité données', url: 'DataValidation', color: 'from-green-600 to-emerald-700' },
      { icon: Scale, title: 'Légal', description: 'Documents juridiques', url: 'Legal', color: 'from-slate-600 to-gray-700' },
      { icon: Lock, title: 'Confidentialité', description: 'Politique de confidentialité', url: 'Privacy', color: 'from-indigo-600 to-blue-700' },
      { icon: FileText, title: 'Conditions Utilisation', description: 'Termes et conditions', url: 'Terms', color: 'from-purple-600 to-indigo-700' },
      { icon: CheckCircle, title: 'Conformité Réglementaire', description: 'RGPD, Loi 25, CCPA', url: 'RegulatoryCompliance', color: 'from-green-600 to-emerald-700' }
    ],
    'Documentation & Guides': [
       { icon: FlaskConical, title: 'Documentation', description: 'Guides techniques et utilisateur', url: 'Documentation', color: 'from-blue-600 to-cyan-700' },
       { icon: Brain, title: 'Druide Omega Expliqué', description: 'Architecture, LLMs et gains performance', url: 'DruideOmegaExplained', color: 'from-purple-600 to-pink-700', badge: 'Technique' },
       { icon: Code, title: 'Documentation Composants', description: 'Guide composants système', url: 'ComponentDocumentation', color: 'from-indigo-600 to-purple-700' },
       { icon: ClipboardList, title: 'Guide Utilisateur', description: 'Manuel d\'utilisation complet', url: 'UserGuide', color: 'from-emerald-600 to-green-700' },
       { icon: BookOpen, title: 'Guide Complet', description: 'Guide utilisateur détaillé', url: 'Guide', color: 'from-blue-600 to-cyan-700' },
       { icon: GraduationCap, title: 'Tutoriels', description: 'Formations étape par étape', url: 'Tutorials', color: 'from-purple-600 to-pink-700' },
       { icon: MessageSquare, title: 'Guide Prompts', description: 'Optimisation interactions IA', url: 'PromptGuide', color: 'from-indigo-600 to-purple-700' },
       { icon: BookOpen, title: 'Glossaire', description: 'Terminologie et définitions', url: 'Glossary', color: 'from-amber-600 to-orange-700' },
       { icon: MessageSquare, title: 'FAQ', description: 'Questions fréquentes', url: 'FAQ', color: 'from-blue-600 to-indigo-700' }
    ],
    'Contenu & Expériences': [
      { icon: MessageSquare, title: 'Chat Principal', description: 'Interface conversationnelle IA', url: 'Chat', color: 'from-indigo-600 to-purple-700' },
      { icon: MessageSquare, title: 'Chat Alternatif', description: 'Interface conversationnelle v2', url: 'Chat_2', color: 'from-purple-600 to-pink-700', badge: 'V2' },
      { icon: Radio, title: 'Salon Vocal', description: 'Interface communication vocale', url: 'VoiceRoom', color: 'from-rose-600 to-pink-700' },
      { icon: Radio, title: 'Vocal Live', description: 'Streaming vocal temps réel', url: 'VoiceLive', color: 'from-cyan-600 to-blue-700' },
      { icon: Eye, title: 'Galerie Visuelle', description: 'Contenus visuels générés', url: 'VisualGallery', color: 'from-pink-600 to-rose-700' },
      { icon: Layers, title: 'Studio Multimodal', description: 'Édition texte/voix/visuel', url: 'MultimodalStudio', color: 'from-pink-600 to-rose-700' },
      { icon: Palette, title: 'Interaction Visuelle', description: 'Interface graphique avancée', url: 'VisualInteraction', color: 'from-purple-600 to-pink-700' }
    ],
    'Développement & API': [
      { icon: Code, title: 'Auto-Codage Sécurisé', description: 'Laboratoire d\'amélioration autonome', url: 'SelfCodingLab', color: 'from-violet-600 to-purple-700', badge: 'IA+' },
      { icon: FlaskConical, title: 'Laboratoire Architecture', description: 'Expérimentation architecture système', url: 'ArchitectureLab', color: 'from-purple-600 to-pink-700', badge: 'Lab' },
      { icon: Globe, title: 'API Publique', description: 'Portail développeurs et intégrations entreprise', url: 'APIPortal', color: 'from-blue-600 to-cyan-700', badge: 'Public' },
      { icon: Code, title: 'Référence API', description: 'Documentation endpoints API', url: 'APIReference', color: 'from-purple-600 to-indigo-700' },
      { icon: FileText, title: 'Documentation API', description: 'Guide complet API développeurs', url: 'APIDocumentation', color: 'from-blue-600 to-indigo-700' },
      { icon: FileText, title: 'Preuve de Concept', description: 'Document technique certifié cryptographique', url: 'ProofOfConcept', color: 'from-purple-600 to-pink-700', badge: 'Protégé' },
      { icon: FolderTree, title: 'Architecture Technique', description: 'Structure système et design', url: 'TechnicalArchitecture', color: 'from-slate-600 to-gray-700' },
      { icon: Database, title: 'Modèles de Données', description: 'Schémas entités système', url: 'DataModels', color: 'from-purple-600 to-indigo-700' }
    ],
    'Administration & Gestion': [
      { icon: Settings, title: 'Administration', description: 'Configuration système avancée', url: 'Admin', color: 'from-red-600 to-orange-700' },
      { icon: Shield, title: 'Admin Publique', description: 'Administration espace public', url: 'PublicAdmin', color: 'from-orange-600 to-red-700' },
      { icon: Users, title: 'Gestion Utilisateurs', description: 'Administration comptes', url: 'UserManagement', color: 'from-indigo-600 to-blue-700' },
      { icon: Activity, title: 'Profil', description: 'Paramètres et personnalisation', url: 'Profile', color: 'from-indigo-600 to-purple-700' },
      { icon: Database, title: 'Registry', description: 'Registre composants et configurations', url: 'Registry', color: 'from-indigo-600 to-purple-700' },
      { icon: Database, title: 'Application Registry', description: 'Enregistrement applications système', url: 'ApplicationRegistry', color: 'from-violet-600 to-indigo-700' },
      { icon: Calendar, title: 'Phases de Mise à Jour', description: 'Gestion phases développement', url: 'UpdatePhases', color: 'from-purple-600 to-indigo-700' },
      { icon: CreditCard, title: 'Billing', description: 'Facturation et gestion paiements', url: 'Billing', color: 'from-green-600 to-teal-700' }
    ],
    'Analyses & Insights': [
      { icon: BarChart3, title: 'Analytics Global', description: 'Tableaux de bord métriques', url: 'Analytics', color: 'from-blue-600 to-cyan-700' },
      { icon: BarChart3, title: 'Analytics Comportement', description: 'Analyse usage et patterns', url: 'BehaviorAnalytics', color: 'from-cyan-600 to-blue-700' },
      { icon: MessageSquare, title: 'Analyse Conversations', description: 'Analyse sémantique et patterns', url: 'ConversationAnalysis', color: 'from-indigo-600 to-purple-700' },
      { icon: Lightbulb, title: 'Insights', description: 'Découvertes et analyses', url: 'Insights', color: 'from-amber-600 to-yellow-700' },
      { icon: Lightbulb, title: 'Synthèse Intelligente', description: 'Agrégation cognitive avancée', url: 'IntelligentSynthesis', color: 'from-amber-600 to-orange-700' },
      { icon: Calendar, title: 'Briefings Quotidiens', description: 'Synthèses intelligentes automatiques', url: 'DailyBriefing', color: 'from-violet-600 to-purple-700' },
      { icon: DollarSign, title: 'Documentation R&D', description: 'Coûts, équipe, traction, roadmap 5 ans', url: 'RDDocumentation', color: 'from-green-600 to-emerald-700', badge: 'Subvention' },
      { icon: Target, title: 'Positionnement Stratégique', description: 'Orchestration intelligente B2B', url: 'StrategicPositioning', color: 'from-purple-600 to-pink-700', badge: 'Business' },
      { icon: Trophy, title: 'Forces Concurrentielles', description: 'Évaluation forces et avantages marché', url: 'CompetitiveForces', color: 'from-purple-600 to-pink-700', badge: 'Stratégie' }
    ],
    'Apprentissage & Intelligence': [
      { icon: Target, title: 'Intelligences Multiples', description: 'Théorie de Gardner intégrée', url: 'Intelligences', color: 'from-teal-600 to-cyan-700' },
      { icon: GraduationCap, title: 'Apprentissage', description: 'Système formation continue', url: 'Learning', color: 'from-green-600 to-emerald-700' },
      { icon: Brain, title: 'Méta-Apprentissage', description: 'Apprendre à apprendre', url: 'MetaLearning', color: 'from-violet-600 to-purple-700' },
      { icon: Target, title: 'Coach IA', description: 'Assistant développement personnel', url: 'AICoach', color: 'from-green-600 to-emerald-700' }
    ],
    'Éthique & Exploration': [
      { icon: Heart, title: 'Charte Éthique IA', description: 'Principes et valeurs IA', url: 'AIEthicsCharter', color: 'from-purple-600 to-pink-700' },
      { icon: Shield, title: 'Évolution Éthique', description: 'Progression morale et valeurs', url: 'EthicalEvolution', color: 'from-green-600 to-emerald-700' },
      { icon: Compass, title: 'Boussole Morale', description: 'Navigation éthique décisions', url: 'MoralCompass', color: 'from-green-600 to-emerald-700' },
      { icon: Target, title: 'Archive Décisions', description: 'Historique choix intuitifs', url: 'DecisionArchive', color: 'from-indigo-600 to-cyan-700' },
      { icon: Heart, title: 'Journal Émotionnel', description: 'Suivi états émotionnels IA', url: 'EmotionalJournal', color: 'from-rose-600 to-pink-700' },
      { icon: Sparkles, title: 'Simulations Rêves', description: 'Exploration créative nocturne', url: 'Dreams', color: 'from-pink-600 to-purple-700', badge: 'Expérimental' },
      { icon: Search, title: 'Recherche Sémantique', description: 'Recherche contextuelle intelligente', url: 'SemanticSearch', color: 'from-blue-600 to-cyan-700' },
      { icon: GitBranch, title: 'Workflows', description: 'Automatisation processus', url: 'Workflows', color: 'from-indigo-600 to-blue-700' },
      { icon: User, title: 'Personnalité', description: 'Configuration traits caractère IA', url: 'Personality', color: 'from-purple-600 to-violet-700' }
    ],
    'Support & Configuration': [
      { icon: FileText, title: 'Synthèse Documentation', description: 'Compilation technique complète', url: 'DocumentationSynthesis', color: 'from-blue-600 to-cyan-700' },
      { icon: FolderTree, title: 'Vue Projet', description: 'Architecture et structure globale', url: 'ProjectOverview', color: 'from-slate-600 to-gray-700' },
      { icon: BookOpen, title: 'Meilleures Pratiques', description: 'Guidelines et standards', url: 'BestPractices', color: 'from-purple-600 to-violet-700' },
      { icon: Calendar, title: 'Changelog', description: 'Historique versions et mises à jour', url: 'Changelog', color: 'from-indigo-600 to-blue-700' },
      { icon: Star, title: 'Favoris', description: 'Contenus sauvegardés', url: 'Favorites', color: 'from-amber-600 to-orange-700' },
      { icon: Zap, title: 'Vue Fonctionnalités', description: 'Catalogue capacités système', url: 'FeaturesOverview', color: 'from-cyan-600 to-blue-700' },
      { icon: Smartphone, title: 'Plan Mobile', description: 'Stratégie développement mobile', url: 'MobilePlan', color: 'from-pink-600 to-rose-700' },
      { icon: Smartphone, title: 'Configuration React Native', description: 'Setup développement mobile', url: 'ReactNativeSetup', color: 'from-indigo-600 to-purple-700' },
      { icon: WifiOff, title: 'Test Hors Ligne', description: 'Validation mode offline', url: 'OfflineTest', color: 'from-slate-600 to-gray-700' },
      { icon: Languages, title: 'Audit Traduction', description: 'Vérification multilingue', url: 'TranslationAudit', color: 'from-blue-600 to-indigo-700' },
      { icon: Calendar, title: 'Plan Traduction', description: 'Roadmap localisation', url: 'TranslationWorkPlan', color: 'from-purple-600 to-violet-700' },
      { icon: FlaskConical, title: 'Documentation Tests', description: 'Procédures et résultats tests', url: 'TestingDocumentation', color: 'from-green-600 to-emerald-700' }
    ],
    'Outils & Intégrations': [
       { icon: Link, title: 'Intégrations', description: 'Connecteurs et API tierces', url: 'Integrations', color: 'from-cyan-600 to-blue-700' },
       { icon: DollarSign, title: 'Tarification', description: 'Plans et options abonnement', url: 'Pricing', color: 'from-green-600 to-emerald-700' },
       { icon: Package, title: 'Gestion Produits', description: 'Catalogue et inventaire', url: 'ProductManagement', color: 'from-purple-600 to-indigo-700' },
       { icon: Store, title: 'Boutique Modules IA', description: 'Extensions et plugins', url: 'AIModuleStore', color: 'from-amber-600 to-orange-700' },
       { icon: Gauge, title: 'Guide Performance', description: 'Optimisation et benchmarks', url: 'PerformanceGuide', color: 'from-blue-600 to-cyan-700' },
       { icon: TrendingUp, title: 'Position Marché', description: 'Analyse compétitive et positionnement', url: 'MarketPosition', color: 'from-rose-600 to-pink-700', badge: 'Stratégie' },
       { icon: ShoppingCart, title: 'Boutique', description: 'Modules et licences additionnels', url: 'Shop', color: 'from-orange-500 to-amber-600' }
    ],
    'Espaces Collaboratifs': [
      { icon: Briefcase, title: 'Espace de Travail IA', description: 'Environnement collaboratif', url: 'AIWorkspace', color: 'from-purple-600 to-pink-700' },
      { icon: FolderOpen, title: 'Espaces de Travail', description: 'Gestion multi-projets', url: 'AIWorkspaces', color: 'from-indigo-600 to-violet-700' },
      { icon: Handshake, title: 'Programme Partenaires', description: 'Collaboration et affiliations', url: 'PartnerProgram', color: 'from-blue-600 to-indigo-700' }
    ],
    'Conformité & Recherche': [
      { icon: Eye, title: 'Déclaration Accessibilité', description: 'Conformité WCAG et standards', url: 'AccessibilityStatement', color: 'from-blue-600 to-indigo-700' },
      { icon: Microscope, title: 'Recherche Médicale', description: 'Assistance recherche santé', url: 'MedicalResearch', color: 'from-red-600 to-pink-700' },
      { icon: Brain, title: 'Recherche Psychologie', description: 'Études comportementales', url: 'PsychologyResearch', color: 'from-indigo-600 to-purple-700' }
    ],
    'Cas d\'Usage & Navigation': [
       { icon: Briefcase, title: '100 Cas d\'Usage', description: 'Scénarios pratiques et comparaisons techniques', url: 'UseCases', color: 'from-purple-600 to-indigo-700', badge: 'Complet' },
       { icon: Network, title: 'Système Neuronal', description: 'Modules neuronaux et réseau', url: 'NeuralSystem', color: 'from-cyan-600 to-blue-700', badge: 'Réseau' },
       { icon: Home, title: 'Accueil Landing', description: 'Retour à la page d\'accueil principale', url: 'Landing', color: 'from-slate-600 to-gray-700' },
       { icon: Sparkles, title: 'Druide Showroom', description: 'Galerie features et innovations Druide', url: 'DruideShowroom', color: 'from-pink-600 to-rose-700', badge: 'Vitrine' }
    ]
  };

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

      {/* Categorized Features */}
      <div className="max-w-7xl mx-auto page-padding pb-12 space-y-8">
        {Object.entries(featuresByCategory).map(([ category, features ], catIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.05 }}
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-900 mb-2 font-display">{category}</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (catIdx * 0.05) + (idx * 0.05) }}
                  >
                    <Card 
                      className="p-4 hover:shadow-xl transition-all cursor-pointer group h-full border-2 border-orange-100 hover:border-orange-300"
                      onClick={() => navigate(feature.url)}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-base font-bold text-slate-900">{feature.title}</h3>
                        {feature.badge && (
                          <Badge className="bg-orange-100 text-orange-700 text-xs">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{feature.description}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
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