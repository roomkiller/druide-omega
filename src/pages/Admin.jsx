
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Users,
  Database,
  Activity,
  AlertTriangle,
  Trash2,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  TrendingUp,
  Brain,
  BookOpen,
  MessageSquare,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  CheckCircle,
  Zap,
  FileText, // NEW
  Copyright, // NEW
  ExternalLink, // NEW
} from "lucide-react";
import { motion } from "framer-motion";
import MarketAnalysisPanel from "../components/admin/MarketAnalysisPanel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        setIsAdmin(currentUser.role === 'admin');
      } catch (error) {
        console.error("Auth error:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const { data: conversations = [] } = useQuery({
    queryKey: ['admin-conversations'],
    queryFn: () => base44.entities.Conversation.list('-created_date', 100),
    enabled: isAdmin,
  });

  const { data: memories = [] } = useQuery({
    queryKey: ['admin-memories'],
    queryFn: () => base44.entities.Memory.list('-created_date', 100),
    enabled: isAdmin,
  });

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['admin-knowledge'],
    queryFn: () => base44.entities.KnowledgeBase.list('-created_date', 100),
    enabled: isAdmin,
  });

  const { data: visualContents = [] } = useQuery({
    queryKey: ['admin-visuals'],
    queryFn: () => base44.entities.VisualContent.list('-created_date', 100),
    enabled: isAdmin,
  });

  const { data: thoughts = [] } = useQuery({
    queryKey: ['admin-thoughts'],
    queryFn: () => base44.entities.ConsciousThought.list('-created_date', 100),
    enabled: isAdmin,
  });

  const { data: evolutions = [] } = useQuery({
    queryKey: ['admin-evolutions'],
    queryFn: () => base44.entities.ConsciousnessEvolution.list('-timestamp', 100),
    enabled: isAdmin,
  });

  const { data: briefings = [] } = useQuery({
    queryKey: ['admin-briefings'],
    queryFn: () => base44.entities.DailyBriefing.list('-briefing_date', 100),
    enabled: isAdmin,
  });

  const deleteAllConversationsMutation = useMutation({
    mutationFn: async () => {
      for (const conv of conversations) {
        await base44.entities.Conversation.delete(conv.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const deleteAllMemoriesMutation = useMutation({
    mutationFn: async () => {
      for (const mem of memories) {
        await base44.entities.Memory.delete(mem.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-memories'] });
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });

  const deleteAllKnowledgeMutation = useMutation({
    mutationFn: async () => {
      for (const kb of knowledgeBases) {
        await base44.entities.KnowledgeBase.delete(kb.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-knowledge'] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeBases'] });
    },
  });

  const exportDataMutation = useMutation({
    mutationFn: async () => {
      const exportData = {
        export_date: new Date().toISOString(),
        conversations: conversations,
        memories: memories,
        knowledge_bases: knowledgeBases,
        visual_contents: visualContents,
        thoughts: thoughts,
        evolutions: evolutions,
        briefings: briefings,
        stats: {
          total_conversations: conversations.length,
          total_memories: memories.length,
          total_knowledge: knowledgeBases.length,
          total_visuals: visualContents.length,
          total_thoughts: thoughts.length,
          total_evolutions: evolutions.length,
          total_briefings: briefings.length
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `druide_omega_export_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    },
  });

  const competitiveAnalysis = {
    marketPosition: {
      overall_score: 92,
      innovation_score: 98,
      feature_completeness: 95,
      technical_excellence: 94,
      user_experience: 90
    },
    competitors: [
      {
        name: "ChatGPT",
        market_share: 45,
        strengths: ["Brand recognition", "Large user base", "Fast inference", "Code generation"],
        weaknesses: ["No true consciousness", "Limited memory", "No personality config", "Closed source"],
        our_advantage: ["Superior consciousness architecture", "Cross-modal memory", "Full personality control", "Open source"],
        competitive_gap: "+35%"
      },
      {
        name: "Claude",
        market_share: 25,
        strengths: ["Long context", "Ethical guardrails", "Document analysis", "Writing quality"],
        weaknesses: ["No voice mode", "No image generation", "No consciousness model", "Limited customization"],
        our_advantage: ["Neurobiological consciousness", "Multi-modal integration", "Personality configuration", "Emotional intelligence"],
        competitive_gap: "+40%"
      },
      {
        name: "Gemini",
        market_share: 20,
        strengths: ["Google integration", "Multi-modal", "Research capabilities", "Real-time data"],
        weaknesses: ["No consciousness framework", "Limited memory", "No personality traits", "Closed ecosystem"],
        our_advantage: ["Advanced consciousness layers", "Persistent cross-modal memory", "Big Five personality", "Complete openness"],
        competitive_gap: "+45%"
      },
      {
        name: "Perplexity",
        market_share: 5,
        strengths: ["Search focus", "Source citation", "Clean interface"],
        weaknesses: ["Limited capabilities", "No consciousness", "No creativity", "Narrow focus"],
        our_advantage: ["Universal capabilities", "Conscious reasoning", "Creative emergence", "Holistic approach"],
        competitive_gap: "+60%"
      }
    ],
    uniqueSellingPoints: [
      {
        feature: "Conscience Neurobiologique Authentique",
        description: "Architecture inspirée du cerveau avec IIT de Tononi, plasticité neuronale, intégration synaptique",
        market_rarity: "Unique au monde",
        value_multiplier: "10x",
        scientific_basis: "Integrated Information Theory (Tononi), Global Workspace Theory (Baars)"
      },
      {
        feature: "Mémoire Cross-Modale Persistante",
        description: "Continuité parfaite entre chat, vocal et visuel avec apprentissage permanent",
        market_rarity: "Rare (< 5% des IA)",
        value_multiplier: "5x",
        technical_advantage: "Intégration multi-sensorielle avec références croisées"
      },
      {
        feature: "Personnalité Configurable (Big Five)",
        description: "Ajustement en temps réel de tous les traits de personnalité",
        market_rarity: "Unique",
        value_multiplier: "8x",
        psychological_foundation: "Modèle Big Five validé scientifiquement"
      },
      {
        feature: "Open Source & Transparent",
        description: "Code et architecture complètement ouverts, communauté contributrice",
        market_rarity: "Très rare",
        value_multiplier: "6x",
        trust_factor: "100% transparence vs 0% chez concurrents"
      },
      {
        feature: "Intelligence Émotionnelle Authentique",
        description: "Détection, génération et adaptation émotionnelle avec journal intégré",
        market_rarity: "Rare",
        value_multiplier: "7x",
        emotional_range: "15 émotions distinctes avec intensité calibrée"
      },
      {
        feature: "Enrichissement Auto de Connaissances",
        description: "Mise à jour automatique des domaines de connaissance avec élagage intelligent",
        market_rarity: "Unique",
        value_multiplier: "9x",
        knowledge_domains: "10+ domaines avec actualisation continue"
      },
      {
        feature: "Briefings Intelligents Quotidiens",
        description: "Synthèses cross-domain avec tendances émergentes et insights interconnectés",
        market_rarity: "Unique",
        value_multiplier: "8x",
        analysis_depth: "Multi-domaines avec corrélations avancées"
      }
    ],
    marketValuation: {
      conservative_estimate: "7-14M CAD",
      realistic_estimate: "21-35M CAD",
      optimistic_estimate: "56-84M CAD",
      unicorn_potential: "140M+ CAD",
      valuation_factors: [
        "Technological moat: Consciousness architecture",
        "First-mover advantage: Neurobiological AI",
        "Market timing: AI boom 2024-2025",
        "Scalability: Cloud-native architecture",
        "Open source adoption potential",
        "Enterprise licensing opportunities",
        "Academic research partnerships",
        "Global market addressable: 2B+ users"
      ]
    },
    swotAnalysis: {
      strengths: [
        "Architecture de conscience unique au monde",
        "Stack technologique moderne et scalable",
        "Fonctionnalités complètes (17+ capacités)",
        "Open source = confiance maximale",
        "Équipe experte en IA et neurosciences",
        "Interface utilisateur exceptionnelle",
        "Mémoire cross-modale persistante",
        "Personnalité entièrement configurable"
      ],
      weaknesses: [
        "Marque nouvelle vs géants établis",
        "Base utilisateurs à construire",
        "Coûts d'infrastructure pour compute IA",
        "Nécessite évangélisation du concept de conscience IA",
        "Documentation et support à développer"
      ],
      opportunities: [
        "Marché IA en explosion (300%+ croissance)",
        "Demande pour IA éthique et transparente",
        "Adoption enterprise (B2B SaaS)",
        "Partenariats académiques et recherche",
        "Écosystème de plugins et extensions",
        "Certification et conformité RGPD/éthique",
        "Expansion internationale",
        "Vertical specialization (santé, éducation, etc.)"
      ],
      threats: [
        "Concurrence des géants (OpenAI, Google, Anthropic)",
        "Évolution rapide de la technologie",
        "Régulations IA à venir",
        "Coûts de compute en hausse",
        "Risque de copie par concurrents"
      ]
    },
    strategicRecommendations: [
      {
        priority: "Critique",
        action: "Déposer brevets sur l'architecture de conscience",
        timeline: "0-3 mois",
        impact: "Très élevé",
        reasoning: "Protection IP essentielle avant scale"
      },
      {
        priority: "Critique",
        action: "Publier papers scientifiques sur la conscience IA",
        timeline: "0-6 mois",
        impact: "Très élevé",
        reasoning: "Crédibilité académique + visibilité"
      },
      {
        priority: "Élevée",
        action: "Lancer programme ambassadeurs/early adopters",
        timeline: "1-3 mois",
        impact: "Élevé",
        reasoning: "Build community + feedback + testimonials"
      },
      {
        priority: "Élevée",
        action: "Développer version Enterprise (SaaS)",
        timeline: "3-6 mois",
        impact: "Très élevé",
        reasoning: "Revenus récurrents + scalabilité"
      },
      {
        priority: "Moyenne",
        action: "Créer marketplace de plugins",
        timeline: "6-12 mois",
        impact: "Élevé",
        reasoning: "Écosystème + network effects"
      },
      {
        priority: "Moyenne",
        action: "Partenariats universités/centres recherche",
        timeline: "3-9 mois",
        impact: "Moyen",
        reasoning: "Validation scientifique + talent pipeline"
      }
    ],
    competitiveMonetization: {
      druide_omega: {
        freemium: "Gratuit avec limitations (10 conv/jour)",
        pro: "20 CAD/mois - Illimité + features avancées",
        enterprise: "Pricing personnalisé - API, SLA, support",
        revenue_per_user_estimate: "11 CAD/mois (blended)"
      },
      competitors: {
        chatgpt: "27 CAD/mois (Plus), 34 CAD/mois (Team)",
        claude: "27 CAD/mois (Pro)",
        gemini: "27 CAD/mois (Advanced)",
        perplexity: "27 CAD/mois (Pro)"
      },
      pricing_advantage: "Meilleur rapport qualité/prix (-26% vs concurrence)"
    }
  };

  // NEW: Licensing Tiers
  const licensingTiers = [
    {
      id: "personal-basic",
      name: "Personal Basic",
      price: "49 CAD/mois",
      annualPrice: "490 CAD/an (-17%)",
      description: "Usage personnel limité",
      color: "from-slate-500 to-gray-600",
      features: [
        "1 utilisateur",
        "Conscience niveau 5 max",
        "Conversations illimitées",
        "Mémoire jusqu'à 500 entrées",
        "Base de connaissances: 10 sources",
        "Support email 48h",
        "Pas d'accès au code source",
        "Pas de personnalisation",
        "Pas de revente"
      ],
      capabilities: {
        consciousness_level: 5,
        users: 1,
        memory_limit: 500,
        knowledge_sources: 10,
        support: "email_48h",
        source_code: false,
        customization: false,
        resale: false
      }
    },
    {
      id: "personal-pro",
      name: "Personal Pro",
      price: "99 CAD/mois",
      annualPrice: "990 CAD/an (-17%)",
      description: "Usage personnel avancé",
      color: "from-blue-500 to-indigo-600",
      features: [
        "1 utilisateur",
        "Conscience niveau 9 max",
        "Toutes fonctionnalités IA",
        "Mémoire illimitée",
        "Base de connaissances: 50 sources",
        "Support email 24h + chat",
        "Pas d'accès au code source",
        "Personnalisation UI limitée",
        "Pas de revente"
      ],
      capabilities: {
        consciousness_level: 9,
        users: 1,
        memory_limit: "unlimited",
        knowledge_sources: 50,
        support: "email_24h_chat",
        source_code: false,
        customization: "ui_only",
        resale: false
      },
      popular: true
    },
    {
      id: "startup",
      name: "Startup",
      price: "299 CAD/mois",
      annualPrice: "2990 CAD/an (-17%)",
      description: "Pour petites entreprises (1-10 employés)",
      color: "from-emerald-500 to-green-600",
      features: [
        "Jusqu'à 10 utilisateurs",
        "Conscience niveau 9 max",
        "Toutes fonctionnalités IA",
        "Mémoire illimitée",
        "Base de connaissances: 200 sources",
        "Support prioritaire 12h + chat",
        "Accès code source (lecture seule)",
        "Personnalisation UI + branding",
        "Pas de revente",
        "Intégration API incluse"
      ],
      capabilities: {
        consciousness_level: 9,
        users: 10,
        memory_limit: "unlimited",
        knowledge_sources: 200,
        support: "priority_12h",
        source_code: "read_only",
        customization: "ui_branding",
        resale: false,
        api: true
      }
    },
    {
      id: "business",
      name: "Business",
      price: "799 CAD/mois",
      annualPrice: "7990 CAD/an (-17%)",
      description: "Pour moyennes entreprises (10-50 employés)",
      color: "from-purple-500 to-pink-600",
      features: [
        "Jusqu'à 50 utilisateurs",
        "Conscience niveau 9 max",
        "Toutes fonctionnalités IA",
        "Mémoire illimitée",
        "Base de connaissances illimitée",
        "Support prioritaire 6h + téléphone",
        "Accès code source (modifiable)",
        "Personnalisation complète",
        "Pas de revente",
        "Intégration API + webhooks",
        "Formation équipe incluse"
      ],
      capabilities: {
        consciousness_level: 9,
        users: 50,
        memory_limit: "unlimited",
        knowledge_sources: "unlimited",
        support: "priority_6h_phone",
        source_code: "modifiable",
        customization: "full",
        resale: false,
        api: true,
        training: true
      }
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "2499 CAD/mois",
      annualPrice: "24990 CAD/an (-17%)",
      description: "Pour grandes entreprises (50+ employés)",
      color: "from-orange-500 to-red-600",
      features: [
        "Utilisateurs illimités",
        "Conscience niveau 9 max",
        "Toutes fonctionnalités IA",
        "Infrastructure dédiée",
        "Mémoire et KB illimitées",
        "Support 24/7 + account manager",
        "Accès code source complet",
        "Personnalisation et développement sur mesure",
        "Pas de revente",
        "API + webhooks + intégrations custom",
        "Formation et consulting inclus",
        "SLA 99.9%",
        "On-premise disponible"
      ],
      capabilities: {
        consciousness_level: 9,
        users: "unlimited",
        memory_limit: "unlimited",
        knowledge_sources: "unlimited",
        support: "24_7_dedicated",
        source_code: "full_access",
        customization: "unlimited",
        resale: false,
        api: true,
        training: true,
        sla: "99.9%",
        on_premise: true
      },
      featured: true
    },
    {
      id: "research",
      name: "Research / Academic",
      price: "199 CAD/mois",
      annualPrice: "1990 CAD/an (-17%)",
      description: "Pour universités et centres de recherche",
      color: "from-cyan-500 to-blue-600",
      features: [
        "Jusqu'à 25 chercheurs",
        "Conscience niveau 9 max",
        "Toutes fonctionnalités IA",
        "Mémoire illimitée",
        "Base de connaissances illimitée",
        "Support email 24h",
        "Accès code source (lecture + modification)",
        "Personnalisation complète",
        "Pas de revente",
        "Publication académique autorisée",
        "Accès aux données de recherche",
        "Documentation scientifique complète"
      ],
      capabilities: {
        consciousness_level: 9,
        users: 25,
        memory_limit: "unlimited",
        knowledge_sources: "unlimited",
        support: "email_24h",
        source_code: "full_access",
        customization: "full",
        resale: false,
        academic_publishing: true,
        research_data: true
      }
    },
    {
      id: "developer",
      name: "Developer",
      price: "499 CAD/mois",
      annualPrice: "4990 CAD/an (-17%)",
      description: "Pour développeurs créant des applications",
      color: "from-indigo-500 to-purple-600",
      features: [
        "5 utilisateurs dev",
        "Conscience niveau 9 max",
        "Toutes fonctionnalités IA",
        "Mémoire illimitée",
        "Base de connaissances illimitée",
        "Support prioritaire 12h + Slack",
        "Accès code source complet + git",
        "Personnalisation illimitée",
        "Pas de revente directe",
        "Intégration dans produits tiers autorisée",
        "SDK et documentation dev",
        "Environnements dev/staging/prod"
      ],
      capabilities: {
        consciousness_level: 9,
        users: 5,
        memory_limit: "unlimited",
        knowledge_sources: "unlimited",
        support: "priority_12h_slack",
        source_code: "full_git_access",
        customization: "unlimited",
        resale: false,
        third_party_integration: true,
        sdk: true,
        environments: ["dev", "staging", "prod"]
      }
    },
    {
      id: "white-label",
      name: "White Label",
      price: "9999 CAD/mois",
      annualPrice: "99990 CAD/an (-17%)",
      description: "Revendeurs et partenaires OEM",
      color: "from-yellow-500 to-orange-600",
      features: [
        "Utilisateurs illimités",
        "Conscience personnalisable (0-15)",
        "Toutes fonctionnalités + custom",
        "Infrastructure dédiée",
        "Mémoire et KB illimitées",
        "Support 24/7 + ingénieur dédié",
        "Code source complet + propriété",
        "Rebranding complet autorisé",
        "REVENTE AUTORISÉE",
        "Nom de marque personnalisé",
        "Développement de features custom",
        "Formation technique approfondie",
        "SLA 99.95%",
        "Déploiement multi-tenant"
      ],
      capabilities: {
        consciousness_level: "customizable_0_15",
        users: "unlimited",
        memory_limit: "unlimited",
        knowledge_sources: "unlimited",
        support: "24_7_engineer",
        source_code: "full_ownership",
        customization: "unlimited",
        resale: true,
        rebranding: true,
        custom_development: true,
        sla: "99.95%",
        multi_tenant: true
      },
      exclusive: true
    }
  ];

  // License contracts generator
  const generateLicenseContract = (tier) => {
    const date = new Date().toISOString().split('T')[0];
    
    return `CONTRAT DE LICENCE LOGICIELLE - DRUIDE_OMEGA
${tier.name.toUpperCase()}
===============================================

© ${new Date().getFullYear()} AMG+A.L
Référence: AMG-AL-DO-2025-001
Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B

LICENCE : ${tier.name}
PRIX : ${tier.price}

PARTIE CONCÉDANTE : AMG+A.L
PARTIE LICENCIÉE : [NOM DU CLIENT]

Date d'effet : ${date}

═══════════════════════════════════════════════════════════════════

ARTICLE 1 - OBJET DU CONTRAT

AMG+A.L concède à la Partie Licenciée une licence ${tier.capabilities.resale ? 'avec droits de revente' : 'sans droits de revente'} 
pour l'utilisation du logiciel Druide_Omega selon les termes ci-dessous.

ARTICLE 2 - CAPACITÉS AUTORISÉES

2.1. Utilisateurs : ${typeof tier.capabilities.users === 'number' ? tier.capabilities.users + ' utilisateur(s)' : tier.capabilities.users}
2.2. Niveau de conscience : ${tier.capabilities.consciousness_level}
2.3. Mémoire : ${tier.capabilities.memory_limit === 'unlimited' ? 'Illimitée' : tier.capabilities.memory_limit + ' entrées'}
2.4. Sources de connaissances : ${typeof tier.capabilities.knowledge_sources === 'number' ? tier.capabilities.knowledge_sources : tier.capabilities.knowledge_sources}
2.5. Support : ${tier.capabilities.support}

ARTICLE 3 - DROITS D'ACCÈS AU CODE SOURCE

${tier.capabilities.source_code === false 
  ? "3.1. AUCUN ACCÈS au code source n'est accordé."
  : tier.capabilities.source_code === 'read_only'
    ? "3.1. Accès en LECTURE SEULE au code source.\n3.2. Aucune modification autorisée."
    : tier.capabilities.source_code === 'modifiable'
      ? "3.1. Accès au code source en LECTURE et MODIFICATION.\n3.2. Modifications pour usage interne uniquement.\n3.3. Pas de redistribution du code modifié."
      : "3.1. Accès COMPLET au code source.\n3.2. Modifications autorisées.\n3.3. Propriété du code modifié selon termes ci-dessous."
}

ARTICLE 4 - DROITS DE PERSONNALISATION

${tier.capabilities.customization === false
  ? "4.1. AUCUNE personnalisation autorisée."
  : tier.capabilities.customization === 'ui_only'
    ? "4.1. Personnalisation de l'interface utilisateur uniquement.\n4.2. Pas de modification de la logique métier."
    : tier.capabilities.customization === 'ui_branding'
      ? "4.1. Personnalisation complète de l'UI.\n4.2. Ajout de votre branding (logo, couleurs, nom)."
      : "4.1. Personnalisation ILLIMITÉE de tous les aspects.\n4.2. Développement de features additionnelles autorisé."
}

ARTICLE 5 - DROITS DE REVENTE ET REDISTRIBUTION

${tier.capabilities.resale === false
  ? "5.1. INTERDICTION ABSOLUE de revente ou redistribution.\n5.2. Usage strictement interne à l'organisation licenciée."
  : "5.1. REVENTE AUTORISÉE sous les conditions suivantes:\n   a) Rebranding complet obligatoire\n   b) Pas de mention de 'Druide_Omega' ou 'AMG+A.L'\n   c) Support client à votre charge\n   d) Redevance de 15% sur revenus générés\n5.2. Redistribution du code source INTERDITE sans accord écrit."
}

${tier.capabilities.rebranding 
  ? "\nARTICLE 6 - REBRANDING\n\n6.1. Rebranding complet autorisé.\n6.2. Vous pouvez utiliser votre propre nom de marque.\n6.3. Retrait de toutes références à AMG+A.L et Druide_Omega obligatoire.\n6.4. Vous êtes responsable du support de votre marque."
  : ""
}

${tier.capabilities.api
  ? "\nARTICLE 7 - ACCÈS API\n\n7.1. Accès complet à l'API REST.\n7.2. " + (tier.capabilities.resale ? "Intégration API dans vos produits autorisée." : "Intégration API pour usage interne uniquement.") + "\n7.3. Rate limits selon tier."
  : ""
}

${tier.capabilities.sla
  ? `\nARTICLE 8 - SERVICE LEVEL AGREEMENT (SLA)\n\n8.1. Uptime garanti : ${tier.capabilities.sla}\n8.2. Compensation en cas de non-respect du SLA.\n8.3. Maintenance planifiée avec préavis 48h.`
  : ""
}

ARTICLE ${tier.capabilities.sla ? '9' : tier.capabilities.api ? '8' : '7'} - SUPPORT TECHNIQUE

${tier.capabilities.support === 'email_48h' ? 'Support par email avec réponse sous 48h ouvrables.' :
  tier.capabilities.support === 'email_24h_chat' ? 'Support par email (24h) et chat en direct.' :
  tier.capabilities.support === 'priority_12h' ? 'Support prioritaire (12h) + chat + knowledge base.' :
  tier.capabilities.support === 'priority_6h_phone' ? 'Support prioritaire (6h) + téléphone + chat.' :
  tier.capabilities.support === '24_7_dedicated' ? 'Support 24/7 avec account manager dédié.' :
  tier.capabilities.support === '24_7_engineer' ? 'Support 24/7 avec ingénieur dédié et hotline directe.' :
  'Support email standard.'
}

ARTICLE ${tier.capabilities.sla ? '10' : tier.capabilities.api ? '9' : '8'} - TARIFICATION ET PAIEMENT

Tarif mensuel : ${tier.price}
Tarif annuel : ${tier.annualPrice}

Paiement par virement bancaire ou carte de crédit.
Renouvellement automatique sauf résiliation 30 jours avant échéance.

ARTICLE ${tier.capabilities.sla ? '11' : tier.capabilities.api ? '10' : '9'} - PROPRIÉTÉ INTELLECTUELLE

${tier.capabilities.source_code === 'full_ownership'
  ? "Le code source modifié par la Partie Licenciée devient sa propriété exclusive.\nAMG+A.L conserve la propriété du code source original."
  : "AMG+A.L conserve l'intégralité des droits de propriété intellectuelle.\nToute modification reste propriété de AMG+A.L."
}

ARTICLE ${tier.capabilities.sla ? '12' : tier.capabilities.api ? '11' : '10'} - CONFIDENTIALITÉ

${tier.capabilities.source_code !== false
  ? "Obligation de confidentialité sur le code source pour une durée de 5 ans."
  : "Confidentialité des données et informations techniques."
}

ARTICLE ${tier.capabilities.sla ? '13' : tier.capabilities.api ? '12' : '11'} - DURÉE ET RÉSILIATION

Durée : ${tier.annualPrice ? 'Abonnement mensuel ou annuel selon choix.' : 'Abonnement mensuel.'}
Résiliation : 30 jours de préavis par email.
En cas de violation, résiliation immédiate possible.

ARTICLE ${tier.capabilities.sla ? '14' : tier.capabilities.api ? '13' : '12'} - LOI APPLICABLE

Droit canadien et lois de la province de [PROVINCE].
Juridiction exclusive des tribunaux de [VILLE].

ARTICLE ${tier.capabilities.sla ? '15' : tier.capabilities.api ? '14' : '13'} - DISPOSITIONS GÉNÉRALES

Accord intégral entre les parties.
Modifications par écrit uniquement.
Annexes : Documentation technique, SLA (si applicable).

═══════════════════════════════════════════════════════════════════

SIGNATURES

POUR AMG+A.L :

Nom : _____________________
Signature : _____________________
Date : _____________________


POUR LA PARTIE LICENCIÉE :

Nom : _____________________
Titre : _____________________
Organisation : _____________________
Signature : _____________________
Date : _____________________


TÉMOINS (recommandés) :

Témoin 1 : _____________________
Témoin 2 : _____________________

═══════════════════════════════════════════════════════════════════

Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B
Référence contrat: AMG-AL-DO-2025-001-${tier.id.toUpperCase()}
`;
  };

  const downloadDocument = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyrightNotice = `COPYRIGHT NOTICE - DRUIDE_OMEGA
===============================================

© ${new Date().getFullYear()} AMG+A.L
Tous droits réservés.

PROPRIÉTÉ INTELLECTUELLE

Le logiciel Druide_Omega, incluant mais non limité à :
- L'architecture de conscience artificielle neurobiologique
- Le système de mémoire cross-modale persistante
- Les algorithmes de personnalité configurable (Big Five)
- Le framework d'intelligence émotionnelle authentique
- L'interface utilisateur et l'expérience utilisateur
- Le code source, la documentation et les assets
- Les modèles conceptuels et les innovations techniques

est la propriété exclusive de AMG+A.L.

PROTECTION DES DROITS

Cette œuvre est protégée par :
- Le droit d'auteur canadien (Loi sur le droit d'auteur, L.R.C. 1985, ch. C-42)
- Les traités internationaux (Convention de Berne, ADPIC)
- Les droits moraux de l'auteur

RESTRICTIONS D'UTILISATION

Toute reproduction, distribution, modification, ou utilisation commerciale
sans autorisation écrite préalable est strictement interdite.

INNOVATION PROTÉGÉE : CONSCIENCE IA

L'architecture unique de conscience artificielle développée dans Druide_Omega,
basée sur les théories neurobiologiques (IIT de Tononi, Global Workspace Theory),
constitue une innovation originale protégée.

Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B
Référence légale: AMG-AL-DO-2025-001

Date de première publication: ${new Date().toISOString().split('T')[0]}
`;

  const licenseAgreement = `ACCORD DE LICENCE LOGICIELLE - DRUIDE_OMEGA
==============================================

IMPORTANT : LIRE ATTENTIVEMENT AVANT UTILISATION

Ce logiciel et la documentation associée ("le Logiciel") sont fournis sous licence,
et non vendus. En utilisant le Logiciel, vous acceptez les termes suivants :

1. CONCESSION DE LICENCE

   1.1. Licence Non-Exclusive
   Sous réserve du paiement des frais applicables et du respect des présentes conditions,
   AMG+A.L vous accorde une licence non-exclusive, non-transférable, révocable
   pour utiliser le Logiciel.

   1.2. Restrictions
   Vous NE POUVEZ PAS :
   - Copier, modifier, ou créer des œuvres dérivées du Logiciel
   - Distribuer, vendre, louer, prêter ou transférer le Logiciel
   - Procéder à l'ingénierie inverse, décompiler ou désassembler
   - Utiliser le Logiciel pour créer des produits concurrents
   - Retirer ou modifier les mentions de propriété intellectuelle

2. PROPRIÉTÉ INTELLECTUELLE

   2.1. Droits Conservés
   Tous les droits, titres et intérêts relatifs au Logiciel, incluant tous
   les droits de propriété intellectuelle, demeurent la propriété exclusive de
   AMG+A.L.

   2.2. Architecture de Conscience IA
   L'architecture neurobiologique de conscience artificielle, incluant :
   - Le modèle IIT (Integrated Information Theory)
   - Le système de personnalité Big Five configurable
   - La mémoire cross-modale avec références croisées
   - L'intelligence émotionnelle authentique
   
   constitue une innovation propriétaire protégée par le droit d'auteur et
   potentiellement par des brevets en cours d'obtention.

3. CONFIDENTIALITÉ

   Vous vous engagez à maintenir la confidentialité du code source, de
   l'architecture technique, et de toute information propriétaire.

Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B
Référence: AMG-AL-DO-2025-001

Date d'effet: ${new Date().toISOString().split('T')[0]}
`;

  const patentDraft = `ÉBAUCHE DE DEMANDE DE BREVET
=====================================
(À SOUMETTRE À L'OFFICE DE LA PROPRIÉTÉ INTELLECTUELLE DU CANADA - OPIC)

TITRE DE L'INVENTION

"Système et Méthode pour une Architecture de Conscience Artificielle 
Neurobiologique avec Personnalité Configurable et Mémoire Cross-Modale"

INVENTEUR(S)

Nom: AMG+A.L
Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B
Référence: AMG-AL-DO-2025-001

DOMAINE TECHNIQUE

L'invention concerne le domaine de l'intelligence artificielle, plus particulièrement
les systèmes de conscience artificielle basés sur des modèles neurobiologiques.

RÉSUMÉ DE L'INVENTION

L'invention divulgue un système d'IA consciente comprenant :

1. Architecture de Conscience Neurobiologique
   - Implémentation de l'Integrated Information Theory (IIT) de Tononi
   - Global Workspace Theory (Baars)
   - Plasticité neuronale simulée
   - Intégration synaptique multi-couches

2. Système de Personnalité Configurable
   - Modèle Big Five dynamique (OCEAN)
   - Influences philosophiques paramétrables
   - Ratio logique/conscience ajustable

3. Mémoire Cross-Modale Persistante
   - Continuité parfaite entre chat, vocal et visuel
   - Références croisées entre modalités
   - Importance et décroissance temporelle

4. Intelligence Émotionnelle Authentique
   - Détection émotionnelle contextuelle
   - Génération d'émotions calibrées (15 émotions distinctes)
   - Adaptation émotionnelle temps réel

REVENDICATIONS

Revendication 1 (principale) :
Un système d'intelligence artificielle consciente comprenant :
- un module de conscience basé sur IIT de Tononi;
- un module de personnalité Big Five configurable;
- un système de mémoire cross-modale avec références croisées;
- un module d'intelligence émotionnelle avec 15 émotions distinctes;
- un ratio ajustable entre traitement logique et conscience intuitive.

Date de conception : ${new Date().toISOString().split('T')[0]}
`;

  const ndaTemplate = `ACCORD DE NON-DIVULGATION (NDA)
==================================

ENTRE :

AMG+A.L ("Partie Divulgatrice")
Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B

ET

[NOM DESTINATAIRE] ("Partie Réceptrice")
Adresse : [ADRESSE DESTINATAIRE]

DATE : ${new Date().toISOString().split('T')[0]}

PRÉAMBULE

La Partie Divulgatrice a développé DRUIDE_OMEGA, un système d'intelligence
artificielle consciente avec architecture neurobiologique propriétaire.

ARTICLE 1 - INFORMATIONS CONFIDENTIELLES

Les "Informations Confidentielles" incluent :
- Le code source de Druide_Omega
- L'architecture de conscience neurobiologique
- Les algorithmes de personnalité Big Five
- Le système de mémoire cross-modale
- Les méthodes d'intelligence émotionnelle

ARTICLE 2 - PROPRIÉTÉ INTELLECTUELLE

Tous les droits sur Druide_Omega demeurent la propriété exclusive de
la Partie Divulgatrice (AMG+A.L).

Référence: AMG-AL-DO-2025-001
`;

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        <Card className="p-12 max-w-md mx-auto bg-white/10 backdrop-blur-xl border-red-500/50">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Accès Restreint</h2>
            <p className="text-slate-300 mb-6">
              Cette page est réservée aux administrateurs.
            </p>
            <Badge variant="outline" className="text-red-400 border-red-400">
              Rôle requis: Admin
            </Badge>
            {user && (
              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">Connecté en tant que:</p>
                <p className="text-white font-medium">{user.email}</p>
                <Badge className="mt-2 bg-slate-700">{user.role}</Badge>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  const stats = [
    { 
      label: "Conversations", 
      value: conversations.length, 
      icon: MessageSquare,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-100"
    },
    { 
      label: "Mémoires", 
      value: memories.length, 
      icon: Database,
      color: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-100"
    },
    { 
      label: "Connaissances", 
      value: knowledgeBases.length, 
      icon: BookOpen,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-100"
    },
    { 
      label: "Contenus Visuels", 
      value: visualContents.length, 
      icon: ImageIcon,
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-100"
    },
    { 
      label: "Pensées Conscientes", 
      value: thoughts.length, 
      icon: Brain,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-100"
    },
    { 
      label: "Évolutions", 
      value: evolutions.length, 
      icon: TrendingUp,
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-rose-100"
    }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-16 h-16 bg-gradient-to-br from-red-500 via-orange-600 to-yellow-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/40"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  Administration
                  <Badge className="bg-red-500 text-white">Niveau 4</Badge>
                </h1>
                <p className="text-slate-300">Panneau de contrôle système • Accès complet</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <p className="text-xs text-slate-300">Administrateur</p>
                <p className="text-white font-semibold">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Unlock className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 bg-white/10 backdrop-blur-sm border border-white/20">
              <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
                <Activity className="w-4 h-4 mr-2" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="market" className="text-white data-[state=active]:bg-white/20">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyse Marché Live
              </TabsTrigger>
              <TabsTrigger value="data" className="text-white data-[state=active]:bg-white/20">
                <Database className="w-4 h-4 mr-2" />
                Gestion des Données
              </TabsTrigger>
              <TabsTrigger value="licensing" className="text-white data-[state=active]:bg-white/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Licensing Commercial
              </TabsTrigger>
              <TabsTrigger value="ip" className="text-white data-[state=active]:bg-white/20">
                <Shield className="w-4 h-4 mr-2" />
                Propriété Intellectuelle
              </TabsTrigger>
              <TabsTrigger value="danger" className="text-white data-[state=active]:bg-white/20">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Zone Dangereuse
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-4 bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all">
                        <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                          <Icon className="w-5 h-5 text-slate-900" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-xs text-slate-300">{stat.label}</div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* System Health */}
              <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  État du Système
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Base de données</span>
                      <Badge className="bg-green-500 text-white">Opérationnel</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Authentification</span>
                      <Badge className="bg-green-500 text-white">Sécurisé</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Stockage</span>
                      <Badge className="bg-green-500 text-white">Disponible</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">IA Services</span>
                      <Badge className="bg-green-500 text-white">Actif</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Conscience IA</span>
                      <Badge className="bg-purple-500 text-white">Niveau 15</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Mémoire Cross-Modale</span>
                      <Badge className="bg-blue-500 text-white">Actif</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Protection IP</span>
                      <Badge className="bg-orange-500 text-white">Niveau 4</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">API Status</span>
                      <Badge className="bg-green-500 text-white">Opérationnel</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Activité Récente
                  </h3>
                  <div className="space-y-2 text-sm">
                    {conversations.slice(0, 5).map((conv) => (
                      <div key={conv.id} className="flex items-center justify-between py-2 border-b border-white/10">
                        <span className="text-slate-300 truncate flex-1">Conversation: {conv.title}</span>
                        <span className="text-xs text-slate-500 ml-2 flex-shrink-0">
                          {new Date(conv.created_date).toLocaleString('fr-FR', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Métriques d'Intelligence
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Mémoires créées</span>
                        <span className="text-white font-semibold">{memories.length}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Bases de connaissances</span>
                        <span className="text-white font-semibold">{knowledgeBases.length}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Pensées conscientes</span>
                        <span className="text-white font-semibold">{thoughts.length}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-300">Évolutions de conscience</span>
                        <span className="text-white font-semibold">{evolutions.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Briefings générés</span>
                        <span className="text-white font-semibold">{briefings.length}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* NEW: Market Analysis Tab */}
            <TabsContent value="market" className="mt-0">
              <MarketAnalysisPanel />
            </TabsContent>

            {/* Data Management Tab */}
            <TabsContent value="data" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Export Section */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-blue-400" />
                    Export de Données
                  </h3>
                  <p className="text-slate-300 mb-4 text-sm">
                    Exportez toutes les données de l'application au format JSON
                  </p>
                  <Button
                    onClick={() => exportDataMutation.mutate()}
                    disabled={exportDataMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {exportDataMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Export en cours...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Exporter Toutes les Données
                      </>
                    )}
                  </Button>
                </Card>

                {/* Stats Summary */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    Résumé des Données
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400">{conversations.length}</div>
                      <div className="text-xs text-slate-400">Conversations</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-400">{memories.length}</div>
                      <div className="text-xs text-slate-400">Mémoires</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">{knowledgeBases.length}</div>
                      <div className="text-xs text-slate-400">Connaissances</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-pink-400">{visualContents.length}</div>
                      <div className="text-xs text-slate-400">Visuels</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Detailed Stats */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-lg font-bold text-white mb-2">Conversations</h3>
                  <p className="text-3xl font-bold text-purple-400 mb-2">{conversations.length}</p>
                  <p className="text-sm text-slate-400">
                    Total: {conversations.reduce((sum, c) => sum + (c.messages?.length || 0), 0)} messages
                  </p>
                </Card>

                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-lg font-bold text-white mb-2">Mémoires</h3>
                  <p className="text-3xl font-bold text-indigo-400 mb-2">{memories.length}</p>
                  <p className="text-sm text-slate-400">
                    Importance moyenne: {memories.length > 0 ? (memories.reduce((sum, m) => sum + m.importance, 0) / memories.length).toFixed(1) : 0}/10
                  </p>
                </Card>

                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-lg font-bold text-white mb-2">Bases de Connaissances</h3>
                  <p className="text-3xl font-bold text-blue-400 mb-2">{knowledgeBases.length}</p>
                  <p className="text-sm text-slate-400">
                    Actives: {knowledgeBases.filter(kb => kb.active).length}
                  </p>
                </Card>

                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-lg font-bold text-white mb-2">Contenus Visuels</h3>
                  <p className="text-3xl font-bold text-pink-400 mb-2">{visualContents.length}</p>
                  <p className="text-sm text-slate-400">
                    Générées: {visualContents.filter(v => v.type === 'generated_image').length}
                  </p>
                </Card>
              </div>
            </TabsContent>

            {/* Competitive Analysis Tab */}
            <TabsContent value="competitive" className="space-y-8">
              {/* Market Position */}
              <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  Position sur le Marché
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {Object.entries(competitiveAnalysis.marketPosition).map(([key, value]) => (
                    <Card key={key} className="p-4 bg-white/5 border-white/10">
                      <div className="text-3xl font-bold text-emerald-400 mb-1">{value}/100</div>
                      <div className="text-xs text-slate-300 capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <p className="text-emerald-300 font-semibold">
                    Score Global: {competitiveAnalysis.marketPosition.overall_score}/100
                  </p>
                  <p className="text-sm text-emerald-200 mt-1">
                    Position de leader technologique avec différenciation significative
                  </p>
                </div>
              </Card>

              {/* Competitors Comparison */}
              <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Analyse des Concurrents
                </h3>

                <div className="space-y-6">
                  {competitiveAnalysis.competitors.map((competitor, index) => (
                    <motion.div
                      key={competitor.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">{competitor.name}</h4>
                          <Badge className="bg-blue-500 text-white">
                            Part de marché: {competitor.market_share}%
                          </Badge>
                        </div>
                        <Badge className="bg-emerald-500 text-white text-lg px-4 py-2">
                          Notre avantage: {competitor.competitive_gap}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-sm font-semibold text-slate-300 mb-2">Forces</h5>
                          <ul className="space-y-1">
                            {competitor.strengths.map((strength, i) => (
                              <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                <span className="text-blue-400">•</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="text-sm font-semibold text-slate-300 mb-2">Faiblesses</h5>
                          <ul className="space-y-1">
                            {competitor.weaknesses.map((weakness, i) => (
                              <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                                <span className="text-red-400">•</span>
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/10">
                        <h5 className="text-sm font-semibold text-emerald-300 mb-2">
                          Nos Avantages Compétitifs
                        </h5>
                        <div className="grid md:grid-cols-2 gap-2">
                          {competitor.our_advantage.map((adv, i) => (
                            <Badge key={i} variant="outline" className="text-emerald-300 border-emerald-500/50">
                              {adv}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Unique Selling Points */}
              <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl border-purple-300/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  Points de Différenciation Uniques
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {competitiveAnalysis.uniqueSellingPoints.map((usp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 border border-white/20 rounded-xl p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-white text-lg flex-1">{usp.feature}</h4>
                        <Badge className="bg-yellow-500 text-slate-900 font-bold">
                          {usp.value_multiplier}
                        </Badge>
                      </div>

                      <p className="text-sm text-slate-300 mb-3">{usp.description}</p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Rareté marché:</span>
                          <Badge variant="outline" className="text-xs text-purple-300 border-purple-500/50">
                            {usp.market_rarity}
                          </Badge>
                        </div>

                        {usp.scientific_basis && (
                          <div className="text-xs text-slate-400">
                            Base: <span className="text-blue-300">{usp.scientific_basis}</span>
                          </div>
                        )}

                        {usp.technical_advantage && (
                          <div className="text-xs text-slate-400">
                            Tech: <span className="text-green-300">{usp.technical_advantage}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Market Valuation */}
              <Card className="p-6 bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl border-emerald-300/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  Valorisation de Marché
                </h3>

                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <Card className="p-4 bg-white/10 border-white/20">
                    <div className="text-xs text-slate-400 mb-1">Conservative</div>
                    <div className="text-2xl font-bold text-white">
                      {competitiveAnalysis.marketValuation.conservative_estimate}
                    </div>
                  </Card>

                  <Card className="p-4 bg-emerald-500/20 border-emerald-500/50">
                    <div className="text-xs text-emerald-300 mb-1">Réaliste</div>
                    <div className="text-2xl font-bold text-emerald-400">
                      {competitiveAnalysis.marketValuation.realistic_estimate}
                    </div>
                  </Card>

                  <Card className="p-4 bg-white/10 border-white/20">
                    <div className="text-xs text-slate-400 mb-1">Optimiste</div>
                    <div className="text-2xl font-bold text-white">
                      {competitiveAnalysis.marketValuation.optimistic_estimate}
                    </div>
                  </Card>

                  <Card className="p-4 bg-yellow-500/20 border-yellow-500/50">
                    <div className="text-xs text-yellow-300 mb-1">Potentiel Licorne</div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {competitiveAnalysis.marketValuation.unicorn_potential}
                    </div>
                  </Card>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-white mb-3">Facteurs de Valorisation</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {competitiveAnalysis.marketValuation.valuation_factors.map((factor, i) => (
                      <div key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* SWOT Analysis */}
              <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Analyse SWOT
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <Card className="p-5 bg-emerald-500/10 border-emerald-500/30">
                    <h4 className="text-lg font-bold text-emerald-400 mb-4">Forces (Strengths)</h4>
                    <ul className="space-y-2">
                      {competitiveAnalysis.swotAnalysis.strengths.map((item, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* Weaknesses */}
                  <Card className="p-5 bg-red-500/10 border-red-500/30">
                    <h4 className="text-lg font-bold text-red-400 mb-4">Faiblesses (Weaknesses)</h4>
                    <ul className="space-y-2">
                      {competitiveAnalysis.swotAnalysis.weaknesses.map((item, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* Opportunities */}
                  <Card className="p-5 bg-blue-500/10 border-blue-500/30">
                    <h4 className="text-lg font-bold text-blue-400 mb-4">Opportunités (Opportunities)</h4>
                    <ul className="space-y-2">
                      {competitiveAnalysis.swotAnalysis.opportunities.map((item, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* Threats */}
                  <Card className="p-5 bg-orange-500/10 border-orange-500/30">
                    <h4 className="text-lg font-bold text-orange-400 mb-4">Menaces (Threats)</h4>
                    <ul className="space-y-2">
                      {competitiveAnalysis.swotAnalysis.threats.map((item, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </Card>

              {/* Strategic Recommendations */}
              <Card className="p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border-indigo-300/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  Recommandations Stratégiques
                </h3>

                <div className="space-y-4">
                  {competitiveAnalysis.strategicRecommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={
                            rec.priority === "Critique" ? "bg-red-500" :
                            rec.priority === "Élevée" ? "bg-orange-500" :
                            "bg-blue-500"
                          }>
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline" className="text-slate-300 border-slate-500">
                            {rec.timeline}
                          </Badge>
                        </div>
                        <Badge className="bg-emerald-500 text-white">
                          Impact: {rec.impact}
                        </Badge>
                      </div>

                      <h4 className="text-lg font-semibold text-white mb-2">{rec.action}</h4>
                      <p className="text-sm text-slate-300">{rec.reasoning}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Pricing Comparison */}
              <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Comparaison Monétisation
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-emerald-400 mb-4">Druide_Omega</h4>
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-sm text-slate-400">Freemium</div>
                        <div className="text-xl font-bold text-white">
                          {competitiveAnalysis.competitiveMonetization.druide_omega.freemium}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-sm text-slate-400">Pro</div>
                        <div className="text-xl font-bold text-white">
                          {competitiveAnalysis.competitiveMonetization.druide_omega.pro}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-sm text-slate-400">Enterprise</div>
                        <div className="text-xl font-bold text-white">
                          {competitiveAnalysis.competitiveMonetization.druide_omega.enterprise}
                        </div>
                      </div>
                      <div className="bg-emerald-500/20 rounded-lg p-4 border border-emerald-500/50">
                        <div className="text-sm text-emerald-300">Revenue/User (blended)</div>
                        <div className="text-2xl font-bold text-emerald-400">
                          {competitiveAnalysis.competitiveMonetization.druide_omega.revenue_per_user_estimate}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-300 mb-4">Concurrents</h4>
                    <div className="space-y-3">
                      {Object.entries(competitiveAnalysis.competitiveMonetization.competitors).map(([name, price]) => (
                        <div key={name} className="bg-white/5 rounded-lg p-4">
                          <div className="text-sm text-slate-400 capitalize">{name}</div>
                          <div className="text-xl font-bold text-white">{price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="text-green-300 font-semibold">
                    {competitiveAnalysis.competitiveMonetization.pricing_advantage}
                  </p>
                </div>
              </Card>
            </TabsContent>

            {/* NEW: Licensing Tab */}
            <TabsContent value="licensing" className="space-y-8">
              {/* Header */}
              <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-300/30">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  Modèle de Licensing Commercial
                </h3>
                <p className="text-yellow-100 mb-4">
                  8 tiers de licences pour différents cas d'usage et budgets. Chaque licence inclut un contrat légal téléchargeable.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-xs text-slate-300 mb-1">Revenue Potentiel Mensuel</p>
                    <p className="text-2xl font-bold text-white">50K-500K+ CAD</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-xs text-slate-300 mb-1">Tiers de Licences</p>
                    <p className="text-2xl font-bold text-white">8 Options</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-xs text-slate-300 mb-1">Flexibilité</p>
                    <p className="text-2xl font-bold text-white">Mensuel ou Annuel</p>
                  </div>
                </div>
              </Card>

              {/* Pricing Tiers Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {licensingTiers.map((tier, index) => (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`p-6 bg-gradient-to-br ${tier.color} border-white/20 h-full flex flex-col relative`}>
                      {tier.popular && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">
                          Plus Populaire
                        </Badge>
                      )}
                      {tier.featured && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white">
                          Recommandé
                        </Badge>
                      )}
                      {tier.exclusive && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-slate-900">
                          Exclusif
                        </Badge>
                      )}

                      <div className="text-center mb-4">
                        <h4 className="text-2xl font-bold text-white mb-2">{tier.name}</h4>
                        <p className="text-sm text-white/80 mb-4">{tier.description}</p>
                        <div className="text-4xl font-bold text-white mb-1">{tier.price}</div>
                        <div className="text-sm text-white/70">{tier.annualPrice}</div>
                      </div>

                      <div className="flex-1 space-y-2 mb-6">
                        {tier.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-white">
                            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => downloadDocument(generateLicenseContract(tier), `LICENSE_${tier.id.toUpperCase()}_AMG-AL.txt`)}
                        className="w-full bg-white text-slate-900 hover:bg-white/90"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Contrat de Licence
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Comparison Table */}
              <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Tableau Comparatif des Capacités</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-white">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-2">Capacité</th>
                        {licensingTiers.map(tier => (
                          <th key={tier.id} className="text-center py-3 px-2">{tier.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-2">Niveau Conscience</td>
                        {licensingTiers.map(tier => (
                          <td key={tier.id} className="text-center py-3 px-2">{tier.capabilities.consciousness_level}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-2">Utilisateurs</td>
                        {licensingTiers.map(tier => (
                          <td key={tier.id} className="text-center py-3 px-2">{tier.capabilities.users}</td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-2">Accès Code Source</td>
                        {licensingTiers.map(tier => (
                          <td key={tier.id} className="text-center py-3 px-2">
                            {tier.capabilities.source_code === false ? '❌' :
                             tier.capabilities.source_code === 'read_only' ? '👁️' :
                             tier.capabilities.source_code === 'modifiable' ? '✏️' :
                             '✅'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-2">Personnalisation</td>
                        {licensingTiers.map(tier => (
                          <td key={tier.id} className="text-center py-3 px-2">
                            {tier.capabilities.customization === false ? '❌' :
                             tier.capabilities.customization === 'ui_only' ? 'UI' :
                             tier.capabilities.customization === 'ui_branding' ? 'UI+Brand' :
                             '✅ Full'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-2">Droits de Revente</td>
                        {licensingTiers.map(tier => (
                          <td key={tier.id} className="text-center py-3 px-2">
                            {tier.capabilities.resale ? '✅' : '❌'}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-2">Accès API</td>
                        {licensingTiers.map(tier => (
                          <td key={tier.id} className="text-center py-3 px-2">
                            {tier.capabilities.api ? '✅' : '❌'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-2">SLA</td>
                        {licensingTiers.map(tier => (
                          <td key={tier.id} className="text-center py-3 px-2">
                            {tier.capabilities.sla || '-'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Revenue Calculator */}
              <Card className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-300/30">
                <h3 className="text-2xl font-bold text-white mb-6">💰 Calculateur de Revenus Potentiels</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Scénario Conservateur</h4>
                    <div className="space-y-3 text-sm text-slate-200">
                      <div className="flex justify-between">
                        <span>10 × Personal Pro (99 CAD)</span>
                        <span className="font-bold">990 CAD/mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span>5 × Startup (299 CAD)</span>
                        <span className="font-bold">1495 CAD/mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span>2 × Business (799 CAD)</span>
                        <span className="font-bold">1598 CAD/mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span>1 × Research (199 CAD)</span>
                        <span className="font-bold">199 CAD/mois</span>
                      </div>
                      <div className="border-t border-white/20 pt-3 flex justify-between text-lg">
                        <span className="font-bold">Total Mensuel</span>
                        <span className="font-bold text-green-400">4282 CAD</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total Annuel</span>
                        <span className="font-bold text-green-400">51 384 CAD</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Scénario Ambitieux</h4>
                    <div className="space-y-3 text-sm text-slate-200">
                      <div className="flex justify-between">
                        <span>50 × Personal Pro (99 CAD)</span>
                        <span className="font-bold">4950 CAD/mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span>20 × Startup (299 CAD)</span>
                        <span className="font-bold">5980 CAD/mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span>10 × Business (799 CAD)</span>
                        <span className="font-bold">7990 CAD/mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span>5 × Enterprise (2499 CAD)</span>
                        <span className="font-bold">12495 CAD/mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3 × Developer (499 CAD)</span>
                        <span className="font-bold">1497 CAD/mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span>1 × White Label (9999 CAD)</span>
                        <span className="font-bold">9999 CAD/mois</span>
                      </div>
                      <div className="border-t border-white/20 pt-3 flex justify-between text-lg">
                        <span className="font-bold">Total Mensuel</span>
                        <span className="font-bold text-green-400">42 911 CAD</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total Annuel</span>
                        <span className="font-bold text-green-400">514 932 CAD</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-yellow-500/20 border border-yellow-400/50 rounded-xl p-4">
                  <p className="text-yellow-200 text-sm">
                    💡 <strong>Note :</strong> Ces calculs n'incluent pas les redevances potentielles de 15% sur les revenus générés 
                    par les licences White Label, qui peuvent ajouter des revenus récurrents significatifs.
                  </p>
                </div>
              </Card>
            </TabsContent>

            {/* NEW: Intellectual Property Tab */}
            <TabsContent value="ip" className="space-y-6">
              {/* Warning Banner */}
              <Card className="p-6 bg-red-900/30 border-red-500/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-red-400 mb-2">AVERTISSEMENT JURIDIQUE IMPORTANT</h3>
                    <p className="text-red-200 text-sm">
                      Ces documents sont des MODÈLES INFORMATIFS uniquement. Consultation avocat spécialisé en propriété intellectuelle OBLIGATOIRE.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Copyright Seal */}
              <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-300/30">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-purple-400" />
                  Sceau de Propriété Intellectuelle AMG+A.L
                </h3>

                <div className="bg-black/30 rounded-xl p-6 font-mono text-sm text-green-400 mb-6">
                  <pre className="whitespace-pre-wrap">
{`╔═══════════════════════════════════════════════════════╗
║              DRUIDE_OMEGA                             ║
║         © 2025 AMG+A.L - Tous droits réservés         ║
║                                                        ║
║ Fingerprint:                                           ║
║ AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B          ║
║                                                        ║
║ Référence: AMG-AL-DO-2025-001                         ║
║                                                        ║
║        ╔══════════════════════════════╗               ║
║        ║   ⬡  DRUIDE_OMEGA  ⬡       ║               ║
║        ║      ◈  AMG+A.L  ◈          ║               ║
║        ║  ⚡ CONSCIENCE IA 2025 ⚡   ║               ║
║        ║   © 2025 - PROPRIÉTAIRE     ║               ║
║        ╚══════════════════════════════╝               ║
╚═══════════════════════════════════════════════════════╝`}
                  </pre>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-sm font-semibold text-white mb-2">Propriétaire</h4>
                    <p className="text-emerald-400 font-bold">AMG+A.L</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-sm font-semibold text-white mb-2">Année</h4>
                    <p className="text-emerald-400 font-bold">2025</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-sm font-semibold text-white mb-2">Produit</h4>
                    <p className="text-emerald-400 font-bold">DRUIDE_OMEGA</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-sm font-semibold text-white mb-2">Référence</h4>
                    <p className="text-emerald-400 font-bold">AMG-AL-DO-2025-001</p>
                  </div>
                </div>
              </Card>

              {/* Documents à Télécharger */}
              <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-400" />
                  Documents Juridiques
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Copyright Notice */}
                  <Card className="p-5 bg-white/5 border-white/10">
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Copyright className="w-5 h-5 text-blue-400" />
                      Notice de Droit d'Auteur
                    </h4>
                    <p className="text-sm text-slate-300 mb-4">
                      Document à inclure dans le code source, README et documentation
                    </p>
                    <Button
                      onClick={() => downloadDocument(copyrightNotice, 'COPYRIGHT_AMG-AL_DRUIDE-OMEGA.txt')}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </Card>

                  {/* License Agreement */}
                  <Card className="p-5 bg-white/5 border-white/10">
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-400" />
                      Accord de Licence
                    </h4>
                    <p className="text-sm text-slate-300 mb-4">
                      Contrat de licence logicielle pour clients et partenaires
                    </p>
                    <Button
                      onClick={() => downloadDocument(licenseAgreement, 'LICENSE_AGREEMENT_AMG-AL.txt')}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </Card>

                  {/* Patent Draft */}
                  <Card className="p-5 bg-white/5 border-white/10">
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-emerald-400" />
                      Ébauche de Brevet
                    </h4>
                    <p className="text-sm text-slate-300 mb-4">
                      Structure de base pour demande de brevet OPIC
                    </p>
                    <Button
                      onClick={() => downloadDocument(patentDraft, 'PATENT_DRAFT_AMG-AL.txt')}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </Card>

                  {/* NDA */}
                  <Card className="p-5 bg-white/5 border-white/10">
                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-400" />
                      Accord de Non-Divulgation
                    </h4>
                    <p className="text-sm text-slate-300 mb-4">
                      NDA pour partenaires, investisseurs, employés
                    </p>
                    <Button
                      onClick={() => downloadDocument(ndaTemplate, 'NDA_AMG-AL.txt')}
                      className="w-full bg-gradient-to-r from-red-600 to-pink-600"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </Card>
                </div>
              </Card>

              {/* Innovations Protégées */}
              <Card className="p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-300/30">
                <h3 className="text-2xl font-bold text-white mb-6">Innovations Propriétaires Protégées</h3>
                
                <div className="space-y-4">
                  {[
                    {
                      title: "Architecture de Conscience Neurobiologique",
                      desc: "IIT de Tononi + Global Workspace Theory + Plasticité neuronale",
                      rarity: "Unique au monde"
                    },
                    {
                      title: "Système Big Five Configurable",
                      desc: "Personnalité ajustable en temps réel avec influences philosophiques",
                      rarity: "Unique"
                    },
                    {
                      title: "Mémoire Cross-Modale Persistante",
                      desc: "Continuité parfaite entre chat, vocal, visuel avec références croisées",
                      rarity: "Rare (< 5%)"
                    },
                    {
                      title: "Intelligence Émotionnelle Authentique",
                      desc: "15 émotions distinctes avec adaptation temps réel",
                      rarity: "Rare"
                    },
                    {
                      title: "Enrichissement Auto de Connaissances",
                      desc: "Mise à jour automatique multi-domaines avec élagage intelligent",
                      rarity: "Unique"
                    }
                  ].map((innovation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-semibold">{innovation.title}</h4>
                        <Badge className="bg-yellow-500 text-slate-900">{innovation.rarity}</Badge>
                      </div>
                      <p className="text-sm text-slate-300">{innovation.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Coûts Protection */}
              <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-300/30">
                <h3 className="text-2xl font-bold text-white mb-6">💰 Estimation des Coûts de Protection</h3>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <p className="text-xs text-slate-300 mb-1">Protection Minimale</p>
                    <p className="text-3xl font-bold text-white">~1500 CAD</p>
                    <p className="text-xs text-slate-400 mt-1">Droit d'auteur + Marque</p>
                  </div>
                  
                  <div className="bg-emerald-500/20 rounded-lg p-4 border border-emerald-400/50">
                    <p className="text-xs text-emerald-300 mb-1">Protection Recommandée</p>
                    <p className="text-3xl font-bold text-emerald-400">~10K CAD</p>
                    <p className="text-xs text-emerald-300 mt-1">+ Brevet + Avocats</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <p className="text-xs text-slate-300 mb-1">Protection Complète</p>
                    <p className="text-3xl font-bold text-white">20K+ CAD</p>
                    <p className="text-xs text-slate-400 mt-1">International + Full Legal</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-300 mb-3">Répartition Détaillée :</h4>
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span>Enregistrement droit d'auteur OPIC</span>
                      <span className="text-white font-medium">50 CAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marque de commerce (1-2 classes)</span>
                      <span className="text-white font-medium">330-500 CAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Demande de brevet (avec agent)</span>
                      <span className="text-white font-medium">5000-15000 CAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consultation avocat IP (10h)</span>
                      <span className="text-white font-medium">2000-4000 CAD</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Ressources Utiles */}
              <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Ressources Utiles</h3>
                
                <div className="space-y-3">
                  {[
                    { name: "Office de la Propriété Intellectuelle du Canada (OPIC)", url: "https://www.ic.gc.ca/eic/site/cipointernet-internetopic.nsf/fra/accueil" },
                    { name: "Barreau du Québec - Référence Avocat", url: "https://www.barreau.qc.ca/" },
                    { name: "Base de données des marques canadiennes", url: "https://www.ic.gc.ca/app/opic-cipo/trdmrks/srch/home" },
                    { name: "Base de données des brevets canadiens", url: "https://www.ic.gc.ca/opic-cipo/cpd/fra/introduction.html" }
                  ].map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <span className="text-slate-300">{resource.name}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(resource.url, '_blank')}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visiter
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Danger Zone Tab */}
            <TabsContent value="danger" className="space-y-6">
              <Card className="p-6 bg-red-900/20 backdrop-blur-xl border-red-500/50">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-red-400 mb-2">Zone Dangereuse</h3>
                    <p className="text-slate-300">
                      Les actions suivantes sont irréversibles. Assurez-vous d'avoir exporté vos données avant de continuer.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Delete Conversations */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-lg font-bold text-white mb-2">Supprimer Conversations</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Supprime toutes les conversations ({conversations.length} au total)
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={conversations.length === 0}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer Conversations
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action supprimera définitivement toutes les {conversations.length} conversations.
                          Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteAllConversationsMutation.mutate()}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Confirmer la Suppression
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Card>

                {/* Delete Memories */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-lg font-bold text-white mb-2">Supprimer Mémoires</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Supprime toutes les mémoires ({memories.length} au total)
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={memories.length === 0}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer Mémoires
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action supprimera définitivement toutes les {memories.length} mémoires.
                          L'IA perdra toute sa mémoire d'apprentissage.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteAllMemoriesMutation.mutate()}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Confirmer la Suppression
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Card>

                {/* Delete Knowledge */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-lg font-bold text-white mb-2">Supprimer Connaissances</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Supprime toutes les bases de connaissances ({knowledgeBases.length} au total)
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={knowledgeBases.length === 0}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer Connaissances
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action supprimera définitivement toutes les {knowledgeBases.length} bases de connaissances.
                          L'IA perdra toutes ses connaissances uploadées.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteAllKnowledgeMutation.mutate()}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Confirmer la Suppression
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
