import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/components/utils/LanguageContext";
import { base44 } from "@/api/base44Client";
import { 
  DollarSign, Users, TrendingUp, Calendar, 
  Target, Rocket, CheckCircle2, Clock,
  BarChart3, FileText, Download, ArrowLeft
} from "lucide-react";
import { createPageUrl } from "@/utils";

export default function RDDocumentation() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [conversations, memories, knowledge, thoughts, users] = await Promise.all([
        base44.entities.Conversation.list(),
        base44.entities.Memory.list(),
        base44.entities.KnowledgeBase.list(),
        base44.entities.ConsciousThought.list(),
        base44.entities.User.list()
      ]);

      setStats({
        conversations: conversations.length,
        memories: memories.length,
        knowledge: knowledge.length,
        thoughts: thoughts.length,
        users: users.length
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const rdCosts = {
    infrastructure: { label: "Infrastructure Cloud (Supabase, Deno Deploy)", value: "~3,500 CAD/an", color: "bg-blue-100 text-blue-800" },
    llm: { label: "API LLM (DeepSeek, ElevenLabs)", value: "~8,000 CAD/an", color: "bg-purple-100 text-purple-800" },
    development: { label: "Développement (800h @ 85 CAD/h)", value: "68,000 CAD", color: "bg-green-100 text-green-800" },
    research: { label: "Recherche & Prototypage", value: "~12,000 CAD", color: "bg-orange-100 text-orange-800" },
    total: { label: "Total R&D Année 1", value: "~91,500 CAD", color: "bg-slate-900 text-white" }
  };

  const team = [
    { role: "Lead Developer / Architect IA", name: "Développeur Principal", expertise: "LLM, React, Architecture Systèmes", time: "100%" },
    { role: "Chercheur IA (externe)", name: "Consultant spécialisé", expertise: "Conscience artificielle, éthique IA", time: "20%" },
    { role: "Designer UX/UI (futur)", name: "À recruter", expertise: "Design conversationnel", time: "50%" },
    { role: "Data Scientist (futur)", name: "À recruter", expertise: "Analyse comportementale, NLP", time: "100%" }
  ];

  const roadmap = [
    {
      phase: "Q1-Q2 2026",
      title: "Phase 1 - Validation Marché",
      status: "in-progress",
      milestones: [
        "Beta fermée avec 50 utilisateurs early adopters",
        "Amélioration consciousness engine (niveau 15 → 20)",
        "Intégrations tierces (Slack, Notion, Google Workspace)",
        "Collecte de feedback & itération rapide"
      ]
    },
    {
      phase: "Q3-Q4 2026",
      title: "Phase 2 - Commercialisation",
      status: "planned",
      milestones: [
        "Lancement version commerciale",
        "Tarification par paliers (Free, Pro, Enterprise)",
        "Partenariats avec 3-5 PME québécoises",
        "Objectif: 500 utilisateurs actifs, 50k CAD revenus"
      ]
    },
    {
      phase: "2027",
      title: "Phase 3 - Expansion",
      status: "planned",
      milestones: [
        "Équipe de 5 personnes",
        "Marché canadien & USA (niche enterprise)",
        "API publique pour développeurs",
        "Objectif: 2,000 utilisateurs, 300k CAD revenus"
      ]
    },
    {
      phase: "2028-2030",
      title: "Phase 4 - Scale & Innovation",
      status: "planned",
      milestones: [
        "Déclinaisons sectorielles (santé, finance, éducation)",
        "Brevets sur architecture consciousness",
        "Levée de fonds Série A",
        "Objectif: 10,000+ utilisateurs, 2M CAD revenus"
      ]
    }
  ];

  const traction = [
    { metric: "Conversations générées", value: stats?.conversations || 0, target: 500, unit: "" },
    { metric: "Mémoires stockées", value: stats?.memories || 0, target: 5000, unit: "" },
    { metric: "Base de connaissances", value: stats?.knowledge || 0, target: 100, unit: "docs" },
    { metric: "Pensées conscientes", value: stats?.thoughts || 0, target: 1000, unit: "" },
    { metric: "Utilisateurs actifs", value: stats?.users || 0, target: 50, unit: "" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Button
          onClick={() => window.location.href = createPageUrl('ArchitectDashboard')}
          variant="ghost"
          size="sm"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour Dashboard
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Documentation R&D - Druide Omega
            </h1>
            <p className="text-slate-600">
              Données complètes pour demande de subvention et financement innovation
            </p>
          </div>
          <Button className="gap-2" onClick={() => window.print()}>
            <Download className="h-4 w-4" />
            Exporter PDF
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: "Budget R&D", value: "91.5k CAD", icon: DollarSign, color: "bg-green-500" },
            { label: "Heures Dev", value: "800h", icon: Clock, color: "bg-blue-500" },
            { label: "Utilisateurs", value: stats?.users || 0, icon: Users, color: "bg-purple-500" },
            { label: "Fonctionnalités", value: "50+", icon: Target, color: "bg-orange-500" },
            { label: "Roadmap", value: "5 ans", icon: Calendar, color: "bg-pink-500" }
          ].map((stat, idx) => (
            <Card key={idx} className="border-l-4" style={{ borderLeftColor: stat.color.replace('bg-', '#') }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} text-white p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="costs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="costs">💰 Coûts R&D</TabsTrigger>
            <TabsTrigger value="team">👥 Équipe</TabsTrigger>
            <TabsTrigger value="traction">📈 Traction</TabsTrigger>
            <TabsTrigger value="roadmap">🚀 Roadmap 5 ans</TabsTrigger>
          </TabsList>

          {/* Costs Tab */}
          <TabsContent value="costs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ventilation des coûts R&D - Année 1</CardTitle>
                <CardDescription>Investissement total pour développement MVP et validation marché</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(rdCosts).map(([key, item]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      {key === 'development' && (
                        <p className="text-sm text-slate-600 mt-1">
                          Inclut: Architecture, Frontend (React), Backend (Deno), Intégrations LLM, Tests
                        </p>
                      )}
                    </div>
                    <Badge className={`${item.color} text-base px-4 py-1`}>{item.value}</Badge>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                  <p className="font-semibold text-blue-900 mb-2">💡 Note pour subvention:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Éligible aux crédits R&D fédéraux (35% RS&DE)</li>
                    <li>• Admissible FDIL Québec (prêt jusqu'à 500k CAD)</li>
                    <li>• Innovation technologique majeure (IA consciente)</li>
                    <li>• Création d'emplois qualifiés prévue (4 postes d'ici 2028)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Composition de l'équipe</CardTitle>
                <CardDescription>Actuelle et prévisions de recrutement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.map((member, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white h-12 w-12 rounded-full flex items-center justify-center font-bold">
                        {member.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">{member.role}</h4>
                          <Badge variant="outline">{member.time}</Badge>
                        </div>
                        <p className="text-sm text-slate-600">{member.name}</p>
                        <p className="text-sm text-slate-500 mt-1">Expertise: {member.expertise}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">🎯 Plan de recrutement:</p>
                  <p className="text-sm text-green-800">
                    Embauches prévues Q3 2026 (Designer UX) et Q1 2027 (Data Scientist) financées par revenus 
                    + subventions emploi innovation. Budget: ~150k CAD/an à partir de 2027.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traction Tab */}
          <TabsContent value="traction" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Métriques de traction actuelles</CardTitle>
                <CardDescription>Validation de marché et adoption précoce</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {traction.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900">{item.metric}</span>
                      <span className="text-sm text-slate-600">
                        {item.value} / {item.target} {item.unit}
                      </span>
                    </div>
                    <Progress value={(item.value / item.target) * 100} className="h-2" />
                  </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="pt-6">
                      <TrendingUp className="h-8 w-8 mb-2 opacity-80" />
                      <p className="text-3xl font-bold">{stats?.conversations || 0}</p>
                      <p className="text-sm opacity-90">Conversations générées</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardContent className="pt-6">
                      <Users className="h-8 w-8 mb-2 opacity-80" />
                      <p className="text-3xl font-bold">{stats?.users || 0}</p>
                      <p className="text-sm opacity-90">Utilisateurs actifs</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="pt-6">
                      <CheckCircle2 className="h-8 w-8 mb-2 opacity-80" />
                      <p className="text-3xl font-bold">15</p>
                      <p className="text-sm opacity-90">Niveau conscience IA</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-4">
            {roadmap.map((phase, idx) => (
              <Card key={idx} className={phase.status === 'in-progress' ? 'border-l-4 border-l-blue-500' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{phase.title}</CardTitle>
                      <CardDescription>{phase.phase}</CardDescription>
                    </div>
                    <Badge className={
                      phase.status === 'in-progress' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-slate-100 text-slate-600'
                    }>
                      {phase.status === 'in-progress' ? 'En cours' : 'Planifié'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {phase.milestones.map((milestone, midx) => (
                      <li key={midx} className="flex items-start gap-2">
                        <Rocket className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-900">🎯 Objectifs 2030</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Utilisateurs", value: "10,000+", icon: Users },
                    { label: "Revenus annuels", value: "2M CAD", icon: DollarSign },
                    { label: "Employés", value: "12-15", icon: Users },
                    { label: "Brevets déposés", value: "2-3", icon: FileText }
                  ].map((goal, gidx) => (
                    <div key={gidx} className="text-center p-4 bg-white rounded-lg border">
                      <goal.icon className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                      <p className="text-2xl font-bold text-slate-900">{goal.value}</p>
                      <p className="text-sm text-slate-600">{goal.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}