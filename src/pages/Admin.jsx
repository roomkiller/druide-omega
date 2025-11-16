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
  Download,
  TrendingUp,
  Brain,
  BookOpen,
  MessageSquare,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  FileText,
  Copyright,
  Ban,
  UserCircle,
  Clock,
  BarChart3,
  Bell
} from "lucide-react";
import { motion } from "framer-motion";
import MarketAnalysisPanel from "../components/admin/MarketAnalysisPanel";
import QuantumSecurityLayer from "../components/admin/QuantumSecurityLayer";
import CopyrightNotices from "../components/admin/CopyrightNotices";
import MetricsChart from "../components/admin/MetricsChart";
import ErrorTracker from "../components/admin/ErrorTracker";
import AlertsPanel from "../components/admin/AlertsPanel";
import ABTestManager from "../components/admin/ABTestManager";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import Pagination from "../components/utils/Pagination";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [usersPage, setUsersPage] = useState(1);
  const [logsPage, setLogsPage] = useState(1);
  const pageSize = 20;
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

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['adminUsers', usersPage],
    queryFn: async () => {
      const skip = (usersPage - 1) * pageSize;
      const users = await base44.asServiceRole.entities.User.list('-created_date', pageSize);
      return { items: users, total: users.length };
    },
    enabled: isAdmin,
  });

  const { data: logsData, isLoading: loadingLogs } = useQuery({
    queryKey: ['auditLogs', logsPage],
    queryFn: async () => {
      const skip = (logsPage - 1) * pageSize;
      const logs = await base44.asServiceRole.entities.AuditLog.list('-created_date', pageSize);
      return { items: logs, total: logs.length };
    },
    enabled: isAdmin,
  });

  const { data: systemMetrics = [] } = useQuery({
    queryKey: ['systemMetrics'],
    queryFn: () => base44.entities.SystemMetrics.list('-timestamp', 50),
    enabled: isAdmin,
    refetchInterval: 30000
  });

  const deleteAllConversationsMutation = useMutation({
    mutationFn: async () => {
      for (const conv of conversations) {
        await base44.entities.Conversation.delete(conv.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-conversations'] });
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
    },
  });

  const exportDataMutation = useMutation({
    mutationFn: async () => {
      const exportData = {
        export_date: new Date().toISOString(),
        conversations,
        memories,
        knowledge_bases: knowledgeBases,
        visual_contents: visualContents
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

  const renderUserCard = (userData, index) => (
    <motion.div
      key={userData.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCircle className="w-10 h-10 text-slate-400" />
            <div>
              <div className="font-semibold">{userData.full_name || userData.email}</div>
              <div className="text-sm text-slate-600">{userData.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={userData.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'}>
              {userData.role}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-12 max-w-md mx-auto">
          <div className="text-center">
            <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Accès Restreint</h2>
            <p className="text-slate-600">Cette page est réservée aux administrateurs.</p>
          </div>
        </Card>
      </div>
    );
  }

  const performanceData = systemMetrics
    .filter(m => m.metric_type === 'performance')
    .slice(-20)
    .map(m => ({ timestamp: m.timestamp, value: m.value }));

  const apiData = systemMetrics
    .filter(m => m.metric_type === 'api')
    .slice(-20)
    .map(m => ({ timestamp: m.timestamp, value: m.value }));

  return (
    <QuantumSecurityLayer requiredRole="admin">
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-6 flex-shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Administration</h1>
                <p className="text-purple-100">Tableau de bord système complet</p>
              </div>
            </div>
            <Badge className="bg-red-500 text-white">Admin</Badge>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white shadow-md mb-6">
                <TabsTrigger value="overview">
                  <Activity className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="metrics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Métriques
                </TabsTrigger>
                <TabsTrigger value="errors">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Erreurs
                </TabsTrigger>
                <TabsTrigger value="alerts">
                  <Bell className="w-4 h-4 mr-2" />
                  Alertes
                </TabsTrigger>
                <TabsTrigger value="abtests">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  A/B Tests
                </TabsTrigger>
                <TabsTrigger value="users">
                  <Users className="w-4 h-4 mr-2" />
                  Utilisateurs
                </TabsTrigger>
                <TabsTrigger value="data">
                  <Database className="w-4 h-4 mr-2" />
                  Données
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Conversations", value: conversations.length, icon: MessageSquare, color: "from-purple-500 to-indigo-600" },
                    { label: "Mémoires", value: memories.length, icon: Database, color: "from-indigo-500 to-purple-600" },
                    { label: "Connaissances", value: knowledgeBases.length, icon: BookOpen, color: "from-blue-500 to-cyan-600" },
                    { label: "Visuels", value: visualContents.length, icon: ImageIcon, color: "from-pink-500 to-rose-600" }
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                        <Card className="p-6">
                          <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                          <div className="text-sm text-slate-600">{stat.label}</div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <AlertsPanel />
                  <ErrorTracker />
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <MetricsChart 
                    title="Performance (temps de réponse)"
                    data={performanceData}
                    dataKey="value"
                    color="#8b5cf6"
                    unit="ms"
                  />
                  <MetricsChart 
                    title="Requêtes API"
                    data={apiData}
                    dataKey="value"
                    color="#3b82f6"
                    unit=" req"
                  />
                </div>
              </TabsContent>

              <TabsContent value="errors">
                <ErrorTracker />
              </TabsContent>

              <TabsContent value="alerts">
                <AlertsPanel />
              </TabsContent>

              <TabsContent value="abtests">
                <ABTestManager />
              </TabsContent>

              <TabsContent value="users">
                <div className="space-y-4">
                  {loadingUsers ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
                    </div>
                  ) : (
                    <>
                      {usersData?.items?.map((userData, idx) => renderUserCard(userData, idx))}
                      <Pagination
                        currentPage={usersPage}
                        totalPages={Math.ceil((usersData?.total || 0) / pageSize)}
                        totalItems={usersData?.total}
                        onPageChange={setUsersPage}
                        itemsPerPage={pageSize}
                      />
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="data" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-blue-500" />
                    Export de Données
                  </h3>
                  <Button onClick={() => exportDataMutation.mutate()} disabled={exportDataMutation.isPending}>
                    {exportDataMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                    Exporter JSON
                  </Button>
                </Card>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-bold mb-2">Supprimer Conversations</h3>
                    <p className="text-sm text-slate-600 mb-4">{conversations.length} conversations</p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={conversations.length === 0} className="w-full">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer tout
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Supprimer {conversations.length} conversations de manière irréversible?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteAllConversationsMutation.mutate()} className="bg-red-600">
                            Confirmer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-bold mb-2">Supprimer Mémoires</h3>
                    <p className="text-sm text-slate-600 mb-4">{memories.length} mémoires</p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={memories.length === 0} className="w-full">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer tout
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Supprimer {memories.length} mémoires de manière irréversible?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteAllMemoriesMutation.mutate()} className="bg-red-600">
                            Confirmer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-bold mb-2">Supprimer Connaissances</h3>
                    <p className="text-sm text-slate-600 mb-4">{knowledgeBases.length} bases</p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={knowledgeBases.length === 0} className="w-full">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer tout
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Supprimer {knowledgeBases.length} bases de connaissances de manière irréversible?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteAllKnowledgeMutation.mutate()} className="bg-red-600">
                            Confirmer
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
    </QuantumSecurityLayer>
  );
}