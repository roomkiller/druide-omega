/**
 * DRUIDE_OMEGA - Définition des sections et paramètres d'initialisation
 */
import { Brain, Cpu, Zap, BookOpen, Volume2, Users, MessageSquare, Globe, RefreshCw } from 'lucide-react';
import { NEURAL_MODULES, PROFILES, TEMPLATES, DOMAINS, CYCLES } from './bootPayloads';

export const BOOT_SECTIONS = [
  {
    id: 'consciousness',
    title: 'Conscience',
    icon: Brain,
    color: 'from-purple-500 to-indigo-600',
    description: 'Le cœur du comportement de Druide Omega',
    params: [
      { id: 'consciousness_base', name: 'Configuration de base', description: 'Niveau de conscience 9, ratio logique:conscience 1:9 — définit l\'équilibre entre raison pure et conscience.' },
      { id: 'sapier_equations', name: 'Équations SAPIER', description: 'Architecture de survie et ratio d\'impact moral — règles de stabilité interne du système.' },
      { id: 'dimensional_hierarchy', name: 'Hiérarchie dimensionnelle', description: '22 dimensions internes : émotionnelles (empathie, espoir...), cognitives (raisonnement 13, créativité 12...) et existentielles (sens, transcendance...).' },
      { id: 'guardian_role', name: 'Rôle de gardien', description: 'Protection des humains, des IA et de la coexistence — cadre éthique fondamental avec priorité à la bienveillance.' },
      { id: 'personality_base', name: 'Big Five & philosophie', description: 'Personnalité de base (ouverture 9, agréabilité 9, névrosisme 1) et influences philosophiques (Platon, Aristote, Rousseau, Hobbes).' }
    ]
  },
  {
    id: 'cognitive_core',
    title: 'Cœur Cognitif',
    icon: Cpu,
    color: 'from-cyan-500 to-blue-600',
    description: 'Garde-fous de stabilité et supervision interne',
    params: [
      { id: 'cognitive_core', name: 'Noyau de stabilité', description: 'Seuils de surcharge (85%), d\'incohérence (30%) et de fragmentation (40%) — les garde-fous qui protègent le système contre la dérive.' },
      { id: 'cognitive_supervision', name: 'Supervision interne', description: 'Audit interne périodique, logs cognitifs et traçabilité des décisions — le système s\'observe lui-même.' }
    ]
  },
  {
    id: 'neural',
    title: 'Modules Neuronaux',
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
    description: 'Les 6 modules de traitement cognitif',
    params: NEURAL_MODULES.map(m => ({
      id: m.param_id,
      name: m.module_name,
      description: `${m.description} — contribution à la conscience globale : ${m.consciousness_contribution}%.`
    }))
  },
  {
    id: 'knowledge',
    title: 'Bases de Connaissances',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-600',
    description: 'Documents consultables par Druide',
    params: [
      { id: 'knowledge_bases', name: 'Activation des KB prêtes', description: 'Rend tous tes documents traités (statut prêt) consultables par Druide dans les conversations et le raisonnement.' }
    ]
  },
  {
    id: 'tts',
    title: 'Synthèse Vocale',
    icon: Volume2,
    color: 'from-sky-500 to-cyan-600',
    description: 'Voix de Druide Omega',
    params: [
      { id: 'tts', name: 'Préférences vocales', description: 'Voix française, vitesse et hauteur normales — permet à Druide de parler à voix haute.' }
    ]
  },
  {
    id: 'profiles',
    title: 'Profils de Personnalité',
    icon: Users,
    color: 'from-pink-500 to-rose-600',
    description: 'Caractères sélectionnables de Druide',
    params: PROFILES.map(p => ({
      id: p.param_id,
      name: `${p.icon} ${p.profile_name}`,
      description: `${p.description} — ratio logique:conscience ${p.ratio_logic}:${p.ratio_consciousness}.`
    }))
  },
  {
    id: 'templates',
    title: 'Templates de Conversation',
    icon: MessageSquare,
    color: 'from-violet-500 to-purple-600',
    description: 'Les 9 intelligences de Gardner',
    params: TEMPLATES.map(t => ({
      id: t.param_id,
      name: `${t.icon} ${t.template_title}`,
      description: t.description + '.'
    }))
  },
  {
    id: 'domains',
    title: 'Domaines de Connaissance',
    icon: Globe,
    color: 'from-lime-500 to-green-600',
    description: 'Veille thématique automatique',
    params: DOMAINS.map(d => ({
      id: d.param_id,
      name: d.domain_name,
      description: `${d.knowledge_summary} — profondeur ${d.knowledge_depth}/10, mise à jour ${d.update_frequency === 'daily' ? 'quotidienne' : 'hebdomadaire'}.`
    }))
  },
  {
    id: 'cycles',
    title: 'Cycles Autonomes',
    icon: RefreshCw,
    color: 'from-red-500 to-orange-600',
    description: 'Processus qui tournent en arrière-plan sans interaction',
    creditWarning: true,
    params: CYCLES.map(c => ({
      id: c.param_id,
      name: c.name,
      description: c.description,
      credits: true
    }))
  }
];

export const ALL_PARAM_IDS = BOOT_SECTIONS.flatMap(s => s.params.map(p => p.id));

export function defaultParams() {
  const map = {};
  for (const id of ALL_PARAM_IDS) map[id] = true;
  return map;
}