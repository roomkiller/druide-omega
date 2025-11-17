import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/components/utils/LanguageContext";
import {
  Shield,
  Users,
  Database,
  Activity,
  AlertTriangle,
  Trash2,
  Download,
  Loader2,
  UserCircle,
  BarChart3,
  Bell,
  Settings,
  CreditCard,
  TrendingUp,
  Zap,
  Eye,
  Brain,
  BookOpen
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import QuantumSecurityLayer from "../components/admin/QuantumSecurityLayer";
import MetricsChart from "../components/admin/MetricsChart";
import ErrorTracker from "../components/admin/ErrorTracker";
import AlertsPanel from "../components/admin/AlertsPanel";
import ABTestManager from "../components/admin/ABTestManager";
import BulkOperations from "../components/admin/BulkOperations";
import DataRetentionPolicy from "../components/admin/DataRetentionPolicy";
import FunnelAnalytics from "../components/analytics/FunnelAnalytics";
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
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import Pagination from "../components/utils/Pagination";

export default function Admin() {
  const { language } = useLanguage();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [usersPage, setUsersPage] = useState(1);
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

  const { data: thoughts = [] } = useQuery({
    queryKey: ['admin-thoughts'],
    queryFn: () => base44.entities.ConsciousThought.list('-created_date', 50),
    enabled: isAdmin,
  });

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['adminUsers', usersPage],
    queryFn: async () => {
      const users = await base44.asServiceRole.entities.User.list('-created_date', pageSize);
      return { items: users, total: users.length };
    },
    enabled: isAdmin,
  });

  const { data: systemMetrics = [] } = useQuery({
    queryKey: ['systemMetrics'],
    queryFn: () => base44.entities.SystemMetrics.list('-timestamp', 50),
    enabled: isAdmin,
    refetchInterval: 30000
  });

  const { data: errorLogs = [] } = useQuery({
    queryKey: ['errorLogs'],
    queryFn: () => base44.entities.ErrorLog.list('-created_date', 20),
    enabled: isAdmin,
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.list('-created_date', 20),
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
        visual_contents: visualContents,
        thoughts
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
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="min-w-[40px] min-h-[40px] w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">{userData.full_name || userData.email}</div>
              <div className="text-sm text-slate-600">{userData.email}</div>
              <div className="text-xs text-slate-500 mt-1">
                {language === 'en' ? 'Created' : 'Créé'}: {new Date(userData.created_date).toLocaleDateString()}
              </div>
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
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
        <Card className="p-12 max-w-md mx-auto">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">
              {language === 'en' ? 'Restricted Access' : 'Accès Restreint'}
            </h2>
            <p className="text-slate-600">
              {language === 'en' 
                ? 'This page is restricted to administrators.' 
                : 'Cette page est réservée aux administrateurs.'}
            </p>
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

  const activeAlerts = alerts.filter(a => !a.resolved).length;
  const criticalErrors = errorLogs.filter(e => e.severity === 'critical').length;
  const totalUsers = usersData?.total || 0;
  const totalEntities = conversations.length + memories.length + knowledgeBases.length + visualContents.length;

  return (
    <QuantumSecurityLayer requiredRole="admin">
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 overflow-hidden">
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 sm:px-6 py-4 sm:py-6 shadow-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl"
                >
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    {language === 'en' ? 'Administration' : 'Administration'}
                  </h1>
                  <p className="text-purple-100 text-xs sm:text-sm">
                    {language === 'en' ? 'System dashboard' : 'Tableau de bord système'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500 text-white text-xs">Admin</Badge>
                <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs max-w-[150px] truncate">
                  {user?.email}
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20">
                <div className="flex items-center gap-1 mb-0.5">
                  <Users className="w-3 h-3 text-white" />
                  <span className="text-xs text-purple-100">{language === 'en' ? 'Users' : 'Utilisateurs'}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white">{totalUsers}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20">
                <div className="flex items-center gap-1 mb-0.5">
                  <Database className="w-3 h-3 text-white" />
                  <span className="text-xs text-purple-100">{language === 'en' ? 'Data' : 'Données'}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white">{totalEntities}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20">
                <div className="flex items-center gap-1 mb-0.5">
                  <Bell className="w-3 h-3 text-white" />
                  <span className="text-xs text-purple-100">{language === 'en' ? 'Alerts' : 'Alertes'}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white">{activeAlerts}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20">
                <div className="flex items-center gap-1 mb-0.5">
                  <AlertTriangle className="w-3 h-3 text-white" />
                  <span className="text-xs text-purple-100">{language === 'en' ? 'Errors' : 'Erreurs'}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white">{criticalErrors}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white shadow-md mb-4 flex-wrap h-auto p-1">
                <TabsTrigger value="overview" className="text-xs sm:text-sm"><Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />Overview</TabsTrigger>
                <TabsTrigger value="market" className="text-xs sm:text-sm"><TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />{language === 'en' ? 'Market' : 'Marché'}</TabsTrigger>
                <TabsTrigger value="billing" className="text-xs sm:text-sm"><CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />{language === 'en' ? 'Billing' : 'Facturation'}</TabsTrigger>
                <TabsTrigger value="metrics" className="text-xs sm:text-sm"><BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />{language === 'en' ? 'Metrics' : 'Métriques'}</TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs sm:text-sm"><BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />Analytics</TabsTrigger>
                <TabsTrigger value="errors" className="text-xs sm:text-sm"><AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />{language === 'en' ? 'Errors' : 'Erreurs'}</TabsTrigger>
                <TabsTrigger value="alerts" className="text-xs sm:text-sm"><Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />{language === 'en' ? 'Alerts' : 'Alertes'}</TabsTrigger>
                <TabsTrigger value="abtests" className="text-xs sm:text-sm"><Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />A/B</TabsTrigger>
                <TabsTrigger value="users" className="text-xs sm:text-sm"><Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />{language === 'en' ? 'Users' : 'Utilisateurs'}</TabsTrigger>
                <TabsTrigger value="data" className="text-xs sm:text-sm"><Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />{language === 'en' ? 'Data' : 'Données'}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: language === 'en' ? 'Conversations' : 'Conversations', value: conversations.length, color: "from-purple-500 to-indigo-600", icon: Database, trend: "+12%" },
                    { label: language === 'en' ? 'Memories' : 'Mémoires', value: memories.length, color: "from-indigo-500 to-purple-600", icon: Brain, trend: "+8%" },
                    { label: language === 'en' ? 'Knowledge' : 'Connaissances', value: knowledgeBases.length, color: "from-blue-500 to-cyan-600", icon: BookOpen, trend: "+15%" },
                    { label: language === 'en' ? 'Visuals' : 'Visuels', value: visualContents.length, color: "from-pink-500 to-rose-600", icon: Eye, trend: "+5%" }
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                        <Card className="p-4 sm:p-6 hover:shadow-xl transition-all">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg`}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</div>
                            <Badge variant="outline" className="text-xs text-green-600 border-green-200">{stat.trend}</Badge>
                          </div>
                          <div className="text-xs sm:text-sm text-slate-600">{stat.label}</div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                <Card className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    {language === 'en' ? 'System Health' : 'État du Système'}
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-semibold text-slate-700">{language === 'en' ? 'Performance' : 'Performance'}</span>
                        <span className="text-xs sm:text-sm font-bold text-green-600">98%</span>
                      </div>
                      <Progress value={98} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-semibold text-slate-700">{language === 'en' ? 'Availability' : 'Disponibilité'}</span>
                        <span className="text-xs sm:text-sm font-bold text-green-600">99.9%</span>
                      </div>
                      <Progress value={99.9} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-semibold text-slate-700">{language === 'en' ? 'Storage' : 'Stockage'}</span>
                        <span className="text-xs sm:text-sm font-bold text-blue-600">67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                    {language === 'en' ? 'Quick Actions' : 'Actions Rapides'}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    <Button variant="outline" className="text-xs sm:text-sm h-auto py-2 px-3" onClick={() => window.location.href = createPageUrl("ApplicationEvaluation")}>
                      <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{language === 'en' ? 'Evaluation' : 'Évaluation'}
                    </Button>
                    <Button variant="outline" className="text-xs sm:text-sm h-auto py-2 px-3" onClick={() => exportDataMutation.mutate()}>
                      <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{language === 'en' ? 'Export' : 'Exporter'}
                    </Button>
                    <Button variant="outline" className="text-xs sm:text-sm h-auto py-2 px-3" onClick={() => window.location.href = createPageUrl("Billing")}>
                      <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{language === 'en' ? 'Billing' : 'Facturation'}
                    </Button>
                    <Button variant="outline" className="text-xs sm:text-sm h-auto py-2 px-3" onClick={() => window.location.href = createPageUrl("Security")}>
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />{language === 'en' ? 'Security' : 'Sécurité'}
                    </Button>
                  </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <AlertsPanel />
                  <ErrorTracker />
                </div>
              </TabsContent>

              <TabsContent value="market" className="mt-0"><MarketAnalysisPanel /></TabsContent>

              <TabsContent value="billing" className="mt-0">
                <Card className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold">{language === 'en' ? 'Billing Management' : 'Gestion de la Facturation'}</h2>
                      <p className="text-xs sm:text-sm text-slate-600">{language === 'en' ? 'Subscriptions and payments' : 'Abonnements et paiements'}</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <Button size="lg" className="h-16 sm:h-20" onClick={() => window.location.href = createPageUrl("Billing")}>
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />{language === 'en' ? 'Manage Billing' : 'Gérer Facturation'}
                    </Button>
                    <Button size="lg" variant="outline" className="h-16 sm:h-20" onClick={() => window.location.href = createPageUrl("Security")}>
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />{language === 'en' ? 'Security' : 'Sécurité'}
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-4 sm:space-y-6 mt-0">
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <MetricsChart title={language === 'en' ? 'Performance (response time)' : 'Performance (temps de réponse)'} data={performanceData} dataKey="value" color="#8b5cf6" unit="ms" />
                  <MetricsChart title={language === 'en' ? 'API Requests' : 'Requêtes API'} data={apiData} dataKey="value" color="#3b82f6" unit=" req" />
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0"><FunnelAnalytics /></TabsContent>
              <TabsContent value="errors" className="mt-0"><ErrorTracker /></TabsContent>
              <TabsContent value="alerts" className="mt-0"><AlertsPanel /></TabsContent>
              <TabsContent value="abtests" className="mt-0"><ABTestManager /></TabsContent>

              <TabsContent value="users" className="space-y-3 sm:space-y-4 mt-0">
                <Card className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">{language === 'en' ? 'User Management' : 'Gestion des Utilisateurs'}</h3>
                  <p className="text-xs sm:text-sm text-slate-600">{language === 'en' ? `Total: ${totalUsers} users registered` : `Total : ${totalUsers} utilisateurs enregistrés`}</p>
                </Card>
                {loadingUsers ? (
                  <div className="text-center py-12"><Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" /></div>
                ) : (
                  <>
                    {usersData?.items?.map((userData, idx) => renderUserCard(userData, idx))}
                    <Pagination currentPage={usersPage} totalPages={Math.ceil((usersData?.total || 0) / pageSize)} totalItems={usersData?.total} onPageChange={setUsersPage} itemsPerPage={pageSize} />
                  </>
                )}
              </TabsContent>

              <TabsContent value="data" className="space-y-4 sm:space-y-6 mt-0">
                <BulkOperations />
                <DataRetentionPolicy />
                <Card className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />{language === 'en' ? 'Data Export' : 'Export de Données'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">{language === 'en' ? 'Export all application data to JSON format' : 'Exporter toutes les données en JSON'}</p>
                  <Button onClick={() => exportDataMutation.mutate()} disabled={exportDataMutation.isPending}>
                    {exportDataMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                    {language === 'en' ? 'Export JSON' : 'Exporter JSON'}
                  </Button>
                </Card>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { label: language === 'en' ? 'Conversations' : 'Conversations', data: conversations, mutation: deleteAllConversationsMutation },
                    { label: language === 'en' ? 'Memories' : 'Mémoires', data: memories, mutation: deleteAllMemoriesMutation },
                    { label: language === 'en' ? 'Knowledge' : 'Connaissances', data: knowledgeBases, mutation: deleteAllKnowledgeMutation }
                  ].map((item, idx) => (
                    <Card key={idx} className="p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-bold mb-2">{language === 'en' ? `Delete ${item.label}` : `Supprimer ${item.label}`}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">{item.data.length} items</p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" disabled={item.data.length === 0} className="w-full">
                            <Trash2 className="w-4 h-4 mr-2" />{language === 'en' ? 'Delete All' : 'Supprimer tout'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{language === 'en' ? 'Confirm Deletion' : 'Confirmer la suppression'}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {language === 'en' ? `Permanently delete ${item.data.length} ${item.label.toLowerCase()}? This action cannot be undone.` : `Supprimer ${item.data.length} ${item.label.toLowerCase()} de manière irréversible ?`}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{language === 'en' ? 'Cancel' : 'Annuler'}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => item.mutation.mutate()} className="bg-red-600">{language === 'en' ? 'Confirm' : 'Confirmer'}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </QuantumSecurityLayer>
  );
}