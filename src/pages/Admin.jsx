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
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
              <TabsTrigger value="data" className="text-white data-[state=active]:bg-white/20">
                <Database className="w-4 h-4 mr-2" />
                Gestion des Données
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
              </Card>

              {/* Recent Activity */}
              <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Activité Récente
                </h3>
                <div className="space-y-2 text-sm">
                  {conversations.slice(0, 5).map((conv) => (
                    <div key={conv.id} className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-slate-300">Conversation: {conv.title}</span>
                      <span className="text-xs text-slate-500">
                        {new Date(conv.created_date).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Data Management Tab */}
            <TabsContent value="data" className="space-y-6">
              <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-400" />
                  Export de Données
                </h3>
                <p className="text-slate-300 mb-4">
                  Exportez toutes les données de l'application au format JSON
                </p>
                <Button
                  onClick={() => exportDataMutation.mutate()}
                  disabled={exportDataMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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

              <div className="grid md:grid-cols-2 gap-6">
                {/* Conversations */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-lg font-bold text-white mb-2">Conversations</h3>
                  <p className="text-3xl font-bold text-purple-400 mb-2">{conversations.length}</p>
                  <p className="text-sm text-slate-400">
                    Total: {conversations.reduce((sum, c) => sum + (c.messages?.length || 0), 0)} messages
                  </p>
                </Card>

                {/* Memories */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-lg font-bold text-white mb-2">Mémoires</h3>
                  <p className="text-3xl font-bold text-indigo-400 mb-2">{memories.length}</p>
                  <p className="text-sm text-slate-400">
                    Importance moyenne: {memories.length > 0 ? (memories.reduce((sum, m) => sum + m.importance, 0) / memories.length).toFixed(1) : 0}/10
                  </p>
                </Card>

                {/* Knowledge */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-lg font-bold text-white mb-2">Bases de Connaissances</h3>
                  <p className="text-3xl font-bold text-blue-400 mb-2">{knowledgeBases.length}</p>
                  <p className="text-sm text-slate-400">
                    Actives: {knowledgeBases.filter(kb => kb.active).length}
                  </p>
                </Card>

                {/* Visuals */}
                <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
                  <h3 className="text-lg font-bold text-white mb-2">Contenus Visuels</h3>
                  <p className="text-3xl font-bold text-pink-400 mb-2">{visualContents.length}</p>
                  <p className="text-sm text-slate-400">
                    Générées: {visualContents.filter(v => v.type === 'generated_image').length}
                  </p>
                </Card>
              </div>
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