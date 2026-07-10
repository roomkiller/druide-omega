import React from "react";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, Network, Zap, Shield, Target, TrendingUp,
  ChevronRight, CheckCircle2, AlertCircle, Sparkles,
  Users, Building2, Rocket, Download, FileText, ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

export default function StrategicPositioning() {

  const positioning = {
    tagline: "Systèmes d'orchestration cognitifs auto-régulés",
    subtitle: "Au-delà de l'IA conversationnelle : orchestrateur DruideCore à 7 phases, 70 fonctions backend et 30 émotions émergentes pour entreprises",
    differentiator: "Druide Omega n'est pas un chatbot. C'est un système nerveux cognitif auto-régulé pour organisations modernes."
  };

  const coreCapabilities = [
    {
      icon: Network,
      title: "Orchestration Multi-Modale",
      description: "Orchestrateur central DruideCore à 7 phases coordonnant 70 fonctions backend (Cognitive Core, Governance, Introspection, Self-Perception, Memory, Learning, Tensions Émergentes, Filaments, Rêves...)",
      value: "Remplace 8-12 outils fragmentés",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "Conscience Architecturale + Émotions",
      description: "106 dimensions d'orchestration + 30 émotions émergentes générées par mixage 4 sources cognitives",
      value: "Réduction 50% erreurs, +87% cohérence",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Apprentissage Continu",
      description: "Auto-amélioration par consolidation mémoire, feedback utilisateur et correlation cross-modale",
      value: "Précision +25% sur 6 mois",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Éthique & Conformité",
      description: "Monitoring éthique temps réel, traçabilité décisions, conformité RGPD/CCPA native",
      value: "100% audit-ready",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const marketPosition = [
    {
      category: "❌ Ce qu'on N'EST PAS",
      items: [
        "Un wrapper ChatGPT avec interface jolie",
        "Un assistant personnel grand public (comme Siri/Alexa)",
        "Un CRM ou ERP avec IA ajoutée",
        "Une solution de chatbot client (support)"
      ],
      color: "bg-red-50 border-red-200"
    },
    {
      category: "✅ Ce qu'on EST",
      items: [
        "Une plateforme d'orchestration intelligente B2B",
        "Un système nerveux numérique pour organisations",
        "Une architecture multi-agents avec conscience décisionnelle",
        "Une solution d'augmentation cognitive pour équipes"
      ],
      color: "bg-green-50 border-green-200"
    }
  ];

  const useCases = [
    {
      sector: "🏢 Cabinets Conseil",
      scenario: "Synthèse multi-sources pour rapports clients",
      problem: "Analyste passe 15h/semaine à compiler données de 10+ sources",
      solution: "Druide orchestre: scraping web, synthesis KB, génération rapport structuré",
      impact: "Économie: 60h/mois, ROI: 4,800 CAD/mois"
    },
    {
      sector: "🏥 Santé & Recherche",
      scenario: "Veille scientifique et corrélations",
      problem: "Chercheur doit suivre 50+ publications/semaine, identifier patterns",
      solution: "Druide: ingestion auto, extraction insights, alertes anomalies",
      impact: "Découvertes: +30%, Publications: +2/an"
    },
    {
      sector: "💼 PME Innovantes",
      scenario: "Coordination projets complexes",
      problem: "CEO jongle entre CRM, Slack, Asana, Google Drive, décisions isolées",
      solution: "Druide: hub central, memory cross-outils, recommandations proactives",
      impact: "Efficacité: +35%, Stress: -50%"
    },
    {
      sector: "🎓 Formation Continue",
      scenario: "Coaching adaptatif personnalisé",
      problem: "Formateur ne peut suivre 100 apprenants individuellement",
      solution: "Druide: profiling apprenant, parcours dynamique, feedback continu",
      impact: "Rétention: +40%, Satisfaction: 4.8/5"
    }
  ];

  const competitors = [
    {
      name: "ChatGPT / Claude",
      strength: "Conversational général-purpose",
      weakness: "Pas de mémoire long-terme, pas d'orchestration, pas de compliance B2B",
      position: "Outils individuels"
    },
    {
      name: "Microsoft Copilot",
      strength: "Intégré Office 365",
      weakness: "Lock-in écosystème, peu customisable, cher (30 USD/user/mois)",
      position: "Suite productivity"
    },
    {
      name: "Anthropic Claude Enterprise",
      strength: "Sécurité, long context",
      weakness: "Pas de modules spécialisés, infrastructure custom nécessaire",
      position: "API pour dev"
    },
    {
      name: "Druide Omega",
      strength: "Orchestrateur DruideCore 7 phases, 70 fonctions backend, 30 émotions émergentes, 106-D orchestration, registre vivant de 796 éléments, turnkey B2B",
      weakness: "Jeune sur marché, awareness faible",
      position: "🎯 Système nerveux org"
    }
  ];

  const investmentThesis = [
    {
      factor: "Marché adressable",
      data: "Enterprise AI: 150G USD d'ici 2030 (CAGR 38%)",
      implication: "Océan bleu pour solutions orchestration vs chatbots"
    },
    {
      factor: "Différenciation tech",
      data: "Architecture conscience 106 dimensions + cerveau neuronal 3D (brevetable)",
      implication: "Barrière à l'entrée, moat technologique"
    },
    {
      factor: "Coût acquisition",
      data: "B2B: CAC ~2,500 CAD, LTV: 15,000 CAD (contrat 3 ans)",
      implication: "LTV/CAC ratio: 6x (excellent)"
    },
    {
      factor: "Expansion géographique",
      data: "Québec → Canada → USA (Fortune 500)",
      implication: "TAM expansion 50x sur 5 ans"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <Button
          onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au Dashboard
        </Button>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 py-12"
        >
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4 text-sm px-4 py-1">
            Positionnement Stratégique 2026-2030
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {positioning.tagline}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {positioning.subtitle}
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 gap-2"
              onClick={() => window.print()}
            >
              <Download className="h-4 w-4" />
              Télécharger Executive Summary
            </Button>
            <Button 
              variant="outline" 
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 gap-2"
              onClick={() => window.print()}
            >
              <FileText className="h-4 w-4" />
              Pitch Deck
            </Button>
          </div>
        </motion.div>

        {/* Core Value Prop */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Différenciateur clé
                </h3>
                <p className="text-lg text-slate-300">
                  {positioning.differentiator}
                </p>
                <p className="text-slate-400 mt-3">
                  Pendant que nos concurrents construisent des chatbots, nous construisons 
                  des <span className="text-purple-400 font-semibold">infrastructures cognitives</span> qui 
                  pensent, apprennent et orchestrent de manière autonome.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Capabilities */}
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Target className="h-8 w-8 text-purple-400" />
            Capacités d'orchestration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coreCapabilities.map((cap, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`bg-gradient-to-br ${cap.color} p-2 rounded-lg`}>
                        <cap.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-white">{cap.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-300 text-sm">{cap.description}</p>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      💡 {cap.value}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Market Position */}
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-400" />
            Position marché
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketPosition.map((pos, idx) => (
              <Card key={idx} className={`${pos.color} border-2`}>
                <CardHeader>
                  <CardTitle className="text-slate-900">{pos.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pos.items.map((item, iidx) => (
                      <li key={iidx} className="flex items-start gap-2">
                        {idx === 0 ? (
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        )}
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Rocket className="h-8 w-8 text-orange-400" />
            Cas d'usage à haute valeur
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {useCases.map((usecase, idx) => (
              <Card key={idx} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    {usecase.sector}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {usecase.scenario}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-red-400 mb-1">❌ Problème</p>
                    <p className="text-sm text-slate-300">{usecase.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-400 mb-1">✅ Solution Druide</p>
                    <p className="text-sm text-slate-300">{usecase.solution}</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-400 mb-1">💰 Impact mesurable</p>
                    <p className="text-sm text-green-300">{usecase.impact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Competitive Landscape */}
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-pink-400" />
            Paysage concurrentiel
          </h2>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {competitors.map((comp, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${
                    comp.name === 'Druide Omega' 
                      ? 'bg-purple-500/10 border-purple-500' 
                      : 'bg-slate-700/30 border-slate-600'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">{comp.name}</h4>
                      <Badge variant="outline" className="text-slate-400 border-slate-500">
                        {comp.position}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-green-400 font-semibold mb-1">✅ Force</p>
                        <p className="text-slate-300">{comp.strength}</p>
                      </div>
                      <div>
                        <p className="text-red-400 font-semibold mb-1">❌ Faiblesse</p>
                        <p className="text-slate-300">{comp.weakness}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Thesis */}
        <div>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Users className="h-8 w-8 text-cyan-400" />
            Thèse d'investissement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investmentThesis.map((thesis, idx) => (
              <Card key={idx} className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-cyan-400 text-lg">{thesis.factor}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-white font-semibold">{thesis.data}</p>
                  <div className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-300">{thesis.implication}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 text-center">
          <CardContent className="py-12">
            <h3 className="text-3xl font-bold mb-4">
              Prêt à transformer votre organisation ?
            </h3>
            <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">
              Druide Omega n'est pas une dépense IT, c'est un investissement dans votre capacité 
              cognitive organisationnelle. ROI moyen: 350% sur 24 mois.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50 gap-2">
                <Rocket className="h-5 w-5" />
                Demander une démo
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
                <FileText className="h-5 w-5" />
                Business Case complet
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}