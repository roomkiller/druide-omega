/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Démonstration de l'Espace Architecte                        ║
 * ║ Page d'accueil démo : présente les capacités du dashboard architecte        ║
 * ║ Les sections confidentielles sont verrouillées (session démo = accès limité) ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { clearArchitectBypass } from '@/lib/adminBypass';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LanguageSelector from '@/components/LanguageSelector';
import {
  Shield, Lock, Sparkles, LogOut, Eye, EyeOff,
  Activity, Brain, Database, BookOpen, MessageSquare, Radio,
  Palette, Network, Target, Heart, Compass, Search, Rocket,
  GraduationCap, Lightbulb, Layers, Eye as EyeIcon, Zap,
  ArrowRight, AlertCircle, CheckCircle2, KeyRound, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/utils/LanguageContext';

// Pages verrouillées en mode démo (confidentielles)
const LOCKED = new Set([
  'druidecontrol', 'systemhealth', 'consciousness', 'consciousnessconfiguration',
  'consciousnessanalysis', 'consciousnessstate', 'consciousnessevolution',
  'applicationevaluation', 'applicationaudit', 'testrunner',
  'admin', 'publicadmin', 'usermanagement', 'systemboot', 'architectdashboard',
  'security', 'securitydashboard', 'intellectualproperty', 'legalipreport',
  'securevault', 'registry', 'applicationregistry', 'technicalarchitecture',
  'druideomegaexplained', 'rddocumentation', 'documentationsynthesis',
  'selfcodinglab', 'architecturelab', 'proofofconcept', 'datamodels',
  'apireference', 'apidocumentation', 'apiportal', 'monitoring',
  'analytics', 'behavioranalytics', 'completionanalysis', 'projectoverview',
  'projectprogress', 'marketposition', 'competitiveforces', 'strategicpositioning',
  'updatephases', 'translationaudit', 'translationworkplan', 'mobileplan',
  'billing', 'productmanagement', 'knowledgefusion', 'memoryconsolidation',
  'metalearning', 'cognitivenetworkvisualization', 'neuralsystem',
  'decisionarchive', 'ethicalevolution', 'hiddentalents', 'glossary', 'changelog'
]);

export default function ArchitectDemo() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [showLocked, setShowLocked] = useState(true);

  const t = (fr, en) => language === 'en' ? en : fr;

  const handleLogout = () => {
    clearArchitectBypass();
    navigate(createPageUrl('AdminLogin'), { replace: true });
  };

  const go = (url, locked) => {
    if (locked) return;
    navigate(createPageUrl(url));
  };

  // Sélection représentative des capacités de l'espace architecte
  const sections = [
    {
      title: t('Conscience & IA', 'Consciousness & AI'),
      color: 'from-purple-600 to-violet-600',
      items: [
        { icon: Brain, title: t('Configuration Conscience', 'Consciousness Config'), desc: t('Paramètres conscience et SAPIER', 'Consciousness and SAPIER settings'), url: 'Consciousness' },
        { icon: Activity, title: t('État Conscience', 'Consciousness State'), desc: t('Monitoring temps réel', 'Real-time monitoring'), url: 'ConsciousnessState' },
        { icon: Rocket, title: t('Évolution Conscience', 'Consciousness Evolution'), desc: t('Historique croissance cognitive', 'Cognitive growth history'), url: 'ConsciousnessEvolution' },
        { icon: Sparkles, title: t('Talents Cachés', 'Hidden Talents'), desc: t('Capacités profondes de Druide', 'Druide deep capabilities'), url: 'HiddenTalents' }
      ]
    },
    {
      title: t('Contrôle & Monitoring', 'Control & Monitoring'),
      color: 'from-indigo-600 to-blue-600',
      items: [
        { icon: Zap, title: t('Centre de Contrôle', 'Control Center'), desc: t('Supervision complète du système', 'Complete system supervision'), url: 'DruideControl' },
        { icon: Activity, title: t('Monitoring', 'Monitoring'), desc: t('Surveillance système temps réel', 'Real-time system surveillance'), url: 'Monitoring' },
        { icon: Activity, title: t('Status', 'Status'), desc: t('État des services', 'Services state'), url: 'Status' }
      ]
    },
    {
      title: t('Connaissances & Mémoire', 'Knowledge & Memory'),
      color: 'from-amber-600 to-orange-600',
      items: [
        { icon: Database, title: t('Mémoires', 'Memories'), desc: t('Gestion mémoire cross-modale', 'Cross-modal memory management'), url: 'Memory' },
        { icon: BookOpen, title: t('Base de Connaissances', 'Knowledge Base'), desc: t('Documents et sources', 'Documents and sources'), url: 'Knowledge' },
        { icon: Network, title: t('Graphe de Connaissance', 'Knowledge Graph'), desc: t('Visualisation des connexions', 'Connections visualization'), url: 'KnowledgeGraph' },
        { icon: Search, title: t('Recherche Sémantique', 'Semantic Search'), desc: t('Recherche contextuelle', 'Contextual search'), url: 'SemanticSearch' }
      ]
    },
    {
      title: t('Contenu & Expériences', 'Content & Experiences'),
      color: 'from-pink-600 to-rose-600',
      items: [
        { icon: MessageSquare, title: t('Chat Principal', 'Main Chat'), desc: t('Interface conversationnelle IA', 'AI conversational interface'), url: 'Chat' },
        { icon: Radio, title: t('Salon Vocal', 'Voice Room'), desc: t('Communication vocale', 'Voice communication'), url: 'VoiceRoom' },
        { icon: EyeIcon, title: t('Galerie Visuelle', 'Visual Gallery'), desc: t('Contenus visuels générés', 'Generated visual content'), url: 'VisualGallery' },
        { icon: Layers, title: t('Studio Multimodal', 'Multimodal Studio'), desc: t('Édition texte/voix/visuel', 'Text/voice/visual editing'), url: 'MultimodalStudio' }
      ]
    },
    {
      title: t('Apprentissage & Intelligence', 'Learning & Intelligence'),
      color: 'from-teal-600 to-cyan-600',
      items: [
        { icon: Target, title: t('Intelligences Multiples', 'Multiple Intelligences'), desc: t('Théorie de Gardner', 'Gardner theory'), url: 'Intelligences' },
        { icon: GraduationCap, title: t('Apprentissage', 'Learning'), desc: t('Formation continue', 'Continuous training'), url: 'Learning' },
        { icon: Brain, title: t('Méta-Apprentissage', 'Meta-Learning'), desc: t('Apprendre à apprendre', 'Learning to learn'), url: 'MetaLearning' },
        { icon: Award, title: t('Tests IA', 'AI Tests'), desc: t('Évaluations cognitives de Druide', 'Druide cognitive evaluations'), url: 'AITests' }
      ]
    },
    {
      title: t('Éthique & Exploration', 'Ethics & Exploration'),
      color: 'from-green-600 to-emerald-600',
      items: [
        { icon: Heart, title: t('Charte Éthique IA', 'AI Ethics Charter'), desc: t('Principes et valeurs', 'Principles and values'), url: 'AIEthicsCharter' },
        { icon: Compass, title: t('Boussole Morale', 'Moral Compass'), desc: t('Navigation éthique', 'Ethical navigation'), url: 'MoralCompass' },
        { icon: Sparkles, title: t('Simulations Rêves', 'Dream Simulations'), desc: t('Exploration créative nocturne', 'Nightly creative exploration'), url: 'Dreams' }
      ]
    },
    {
      title: t('Sécurité & Légal', 'Security & Legal'),
      color: 'from-red-600 to-orange-600',
      items: [
        { icon: Shield, title: t('Propriété Intellectuelle', 'Intellectual Property'), desc: t('Droits et protection IP', 'IP rights and protection'), url: 'IntellectualProperty' },
        { icon: Shield, title: t('Security Dashboard', 'Security Dashboard'), desc: t('Tableau de bord sécurité', 'Security dashboard'), url: 'SecurityDashboard' },
        { icon: CheckCircle2, title: t('Conformité RGPD', 'GDPR Compliance'), desc: t('Protection des données', 'Data protection'), url: 'GDPRCompliance' }
      ]
    },
    {
      title: t('Analyses & Insights', 'Analytics & Insights'),
      color: 'from-blue-600 to-cyan-600',
      items: [
        { icon: Activity, title: t('Analytics Global', 'Global Analytics'), desc: t('Tableaux de bord métriques', 'Metrics dashboards'), url: 'Analytics' },
        { icon: Lightbulb, title: t('Insights', 'Insights'), desc: t('Découvertes et analyses', 'Discoveries and analyses'), url: 'Insights' },
        { icon: Lightbulb, title: t('Synthèse Intelligente', 'Intelligent Synthesis'), desc: t('Agrégation cognitive', 'Cognitive aggregation'), url: 'IntelligentSynthesis' }
      ]
    }
  ];

  const lockedCount = sections.reduce((acc, s) => acc + s.items.filter(i => LOCKED.has(i.url.toLowerCase())).length, 0);
  const openCount = sections.reduce((acc, s) => acc + s.items.filter(i => !LOCKED.has(i.url.toLowerCase())).length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/40">
      {/* Hero */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 text-white page-padding py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Sparkles className="w-7 h-7" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/25">
                  {t('Mode Démonstration', 'Demo Mode')}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-2">
                {t('Découverte de l\'Espace Architecte', 'Architect Space Tour')}
              </h1>
              <p className="text-lg text-cyan-100 max-w-2xl">
                {t(
                  'Explorez les capacités du tableau de bord architecte. Les sections confidentielles sont verrouillées en démonstration.',
                  'Explore the architect dashboard capabilities. Confidential sections are locked in demo mode.'
                )}
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
                {t('Quitter la démo', 'Exit demo')}
              </Button>
            </div>
          </motion.div>

          {/* Stats démo */}
          <div className="grid grid-cols-3 gap-3 mt-8 max-w-md">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/15">
              <div className="text-2xl font-bold">{openCount}</div>
              <div className="text-xs text-cyan-100">{t('Accessibles', 'Accessible')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/15">
              <div className="text-2xl font-bold">{lockedCount}</div>
              <div className="text-xs text-cyan-100">{t('Verrouillées', 'Locked')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/15">
              <div className="text-2xl font-bold">{sections.length}</div>
              <div className="text-xs text-cyan-100">{t('Catégories', 'Categories')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bandeau d'information */}
      <div className="max-w-7xl mx-auto page-padding -mt-6 mb-6 relative z-10">
        <Card className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-cyan-900">
                {t(
                  'Vous êtes en mode démonstration. Les modules avec un cadenas contiennent des informations confidentielles réservées aux architectes authentifiés.',
                  'You are in demo mode. Modules with a lock icon contain confidential information reserved for authenticated architects.'
                )}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLocked(s => !s)}
              className="text-cyan-700 hover:bg-cyan-100 flex-shrink-0"
            >
              {showLocked ? <><EyeOff className="w-4 h-4 mr-1.5" />{t('Masquer verrouillées', 'Hide locked')}</> : <><Eye className="w-4 h-4 mr-1.5" />{t('Afficher tout', 'Show all')}</>}
            </Button>
          </div>
        </Card>
      </div>

      {/* Sections */}
      <div className="max-w-7xl mx-auto page-padding pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, sIdx) => {
            const visibleItems = showLocked ? section.items : section.items.filter(i => !LOCKED.has(i.url.toLowerCase()));
            if (visibleItems.length === 0) return null;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sIdx * 0.05 }}
              >
                <div className="mb-3">
                  <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                    <span className={`w-1.5 h-5 rounded-full bg-gradient-to-b ${section.color}`} />
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-2">
                  {visibleItems.map((item) => {
                    const locked = LOCKED.has(item.url.toLowerCase());
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.url}
                        onClick={() => go(item.url, locked)}
                        disabled={locked}
                        className={`w-full text-left group relative overflow-hidden rounded-xl border transition-all ${
                          locked
                            ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
                            : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-md'
                        }`}
                      >
                        <div className="p-3 flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            locked ? 'bg-slate-200 text-slate-400' : `bg-gradient-to-br ${section.color} text-white`
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-sm font-semibold truncate ${locked ? 'text-slate-400' : 'text-slate-900'}`}>
                                {item.title}
                              </span>
                              {locked && <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
                            </div>
                            <p className={`text-xs truncate ${locked ? 'text-slate-400' : 'text-slate-500'}`}>
                              {item.desc}
                            </p>
                          </div>
                          {!locked && (
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                          )}
                        </div>
                        {locked && (
                          <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[11px] font-medium text-slate-500 bg-white/90 px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              {t('Réservé aux architectes', 'Architects only')}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA Accès complet */}
      <div className="max-w-7xl mx-auto page-padding pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 border-0 text-white text-center overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_60%)]" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/20">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-2 font-display">
                {t('Accès complet à l\'espace architecte', 'Full access to architect space')}
              </h3>
              <p className="text-violet-100 max-w-xl mx-auto mb-6">
                {t(
                  'Authentifiez-vous avec vos identifiants architecte pour déverrouiller toutes les sections confidentielles, diagnostics avancés et configurations système.',
                  'Authenticate with your architect credentials to unlock all confidential sections, advanced diagnostics and system configurations.'
                )}
              </p>
              <Button
                onClick={() => navigate(createPageUrl('AdminLogin'))}
                size="lg"
                className="bg-white text-violet-700 hover:bg-violet-50 font-semibold"
              >
                <Shield className="w-4 h-4 mr-2" />
                {t('Se connecter en tant qu\'architecte', 'Sign in as architect')}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}