
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Server,
  HardDrive,
  Cpu,
  Globe,
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
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 sm:px-6 py-6 sm:py-8 flex-shrink-0 shadow-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="min-w-[48px] min-h-[48px] w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl"
                >
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {language === 'en' ? 'Administration' : 'Administration'}
                  </h1>
                  <p className="text-purple-100 text-sm sm:text-base">
                    {language === 'en' ? 'Complete system dashboard' : 'Tableau de bord système complet'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-red-500 text-white">Admin</Badge>
                <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                  {user?.email}
                </Badge>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-white" />
                  <span className="text-xs text-purple-100">
                    {language === 'en' ? 'Users' : 'Utilisateurs'}
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white">{totalUsers}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-white" />
                  <span className="text-xs text-purple-100">
                    {language === 'en' ? 'Total Data' : 'Données Total'}
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white">{totalEntities}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <Bell className="w-4 h-4 text-white" />
                  <span className="text-xs text-purple-100">
                    {language === 'en' ? 'Active Alerts' : 'Alertes Actives'}
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white">{activeAlerts}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-white" />
                  <span className="text-xs text-purple-100">
                    {language === 'en' ? 'Critical Errors' : 'Erreurs Critiques'}
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white">{criticalErrors}</p>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 pb-4 -mt-6 pt-6">
                <TabsList className="bg-white shadow-md flex flex-wrap gap-2 h-auto p-2">
                  <TabsTrigger value="overview" className="min-h-[44px]">
                    <Activity className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="market" className="min-h-[44px]">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{language === 'en' ? 'Market' : 'Marché'}</span>
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="min-h-[44px]">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{language === 'en' ? 'Billing' : 'Facturation'}</span>
                  </TabsTrigger>
                  <TabsTrigger value="metrics" className="min-h-[44px]">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{language === 'en' ? 'Metrics' : 'Métriques'}</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="min-h-[44px]">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="errors" className="min-h-[44px]">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{language === 'en' ? 'Errors' : 'Erreurs'}</span>
                  </TabsTrigger>
                  <TabsTrigger value="alerts" className="min-h-[44px]">
                    <Bell className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{language === 'en' ? 'Alerts' : 'Alertes'}</span>
                  </TabsTrigger>
                  <TabsTrigger value="abtests" className="min-h-[44px]">
                    <Settings className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">A/B Tests</span>
                  </TabsTrigger>
                  <TabsTrigger value="users" className="min-h-[44px]">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{language === 'en' ? 'Users' : 'Utilisateurs'}</span>
                  </TabsTrigger>
                  <TabsTrigger value="data" className="min-h-[44px]">
                    <Database className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{language === 'en' ? 'Data' : 'Données'}</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-6">
                <div className="space-y-6 pb-6">
                  {/* Enhanced Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        label: language === 'en' ? 'Conversations' : 'Conversations',
                        value: conversations.length,
                        color: "from-purple-500 to-indigo-600",
                        icon: Database,
                        trend: "+12%"
                      },
                      {
                        label: language === 'en' ? 'Memories' : 'Mémoires',
                        value: memories.length,
                        color: "from-indigo-500 to-purple-600",
                        icon: Brain,
                        trend: "+8%"
                      },
                      {
                        label: language === 'en' ? 'Knowledge' : 'Connaissances',
                        value: knowledgeBases.length,
                        color: "from-blue-500 to-cyan-600",
                        icon: BookOpen,
                        trend: "+15%"
                      },
                      {
                        label: language === 'en' ? 'Visuals' : 'Visuels',
                        value: visualContents.length,
                        color: "from-pink-500 to-rose-600",
                        icon: Eye,
                        trend: "+5%"
                      }
                    ].map((stat, idx) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <Card className="p-6 hover:shadow-xl transition-all">
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-baseline gap-2 mb-1">
                              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                              <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                                {stat.trend}
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-600">{stat.label}</div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* System Health */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      {language === 'en' ? 'System Health' : 'État du Système'}
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700">
                            {language === 'en' ? 'Performance' : 'Performance'}
                          </span>
                          <span className="text-sm font-bold text-green-600">98%</span>
                        </div>
                        <Progress value={98} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700">
                            {language === 'en' ? 'Availability' : 'Disponibilité'}
                          </span>
                          <span className="text-sm font-bold text-green-600">99.9%</span>
                        </div>
                        <Progress value={99.9} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700">
                            {language === 'en' ? 'Storage' : 'Stockage'}
                          </span>
                          <span className="text-sm font-bold text-blue-600">67%</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-600" />
                      {language === 'en' ? 'Quick Actions' : 'Actions Rapides'}
                    </h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        variant="outline"
                        className="min-h-[44px] justify-start"
                        onClick={() => window.location.href = createPageUrl("ApplicationEvaluation")}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'View Evaluation' : 'Voir Évaluation'}
                      </Button>
                      <Button
                        variant="outline"
                        className="min-h-[44px] justify-start"
                        onClick={() => exportDataMutation.mutate()}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Export Data' : 'Exporter'}
                      </Button>
                      <Button
                        variant="outline"
                        className="min-h-[44px] justify-start"
                        onClick={() => window.location.href = createPageUrl("Billing")}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Billing' : 'Facturation'}
                      </Button>
                      <Button
                        variant="outline"
                        className="min-h-[44px] justify-start"
                        onClick={() => window.location.href = createPageUrl("Security")}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Security' : 'Sécurité'}
                      </Button>
                    </div>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-6">
                    <AlertsPanel />
                    <ErrorTracker />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="market">
                <div className="pb-6">
                  <MarketAnalysisPanel />
                </div>
              </TabsContent>

              <TabsContent value="billing">
                <div className="pb-6">
                  <Card className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="min-w-[48px] min-h-[48px] w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold">
                          {language === 'en' ? 'Billing Management' : 'Gestion de la Facturation'}
                        </h2>
                        <p className="text-slate-600">
                          {language === 'en' ? 'Subscriptions and payments' : 'Abonnements et paiements'}
                        </p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                      <Button
                        size="lg"
                        className="min-h-[80px] h-auto text-base sm:text-lg"
                        onClick={() => window.location.href = createPageUrl("Billing")}
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        {language === 'en' ? 'Manage Billing' : 'Gérer la Facturation'}
                      </Button>
                      <Button
                        size="lg"
                        className="min-h-[80px] h-auto text-base sm:text-lg"
                        variant="outline"
                        onClick={() => window.location.href = createPageUrl("Security")}
                      >
                        <Shield className="w-5 h-5 mr-2" />
                        {language === 'en' ? 'Security Settings' : 'Paramètres de Sécurité'}
                      </Button>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-6">
                <div className="space-y-6 pb-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <MetricsChart
                      title={language === 'en' ? 'Performance (response time)' : 'Performance (temps de réponse)'}
                      data={performanceData}
                      dataKey="value"
                      color="#8b5cf6"
                      unit="ms"
                    />
                    <MetricsChart
                      title={language === 'en' ? 'API Requests' : 'Requêtes API'}
                      data={apiData}
                      dataKey="value"
                      color="#3b82f6"
                      unit=" req"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="pb-6">
                  <FunnelAnalytics />
                </div>
              </TabsContent>

              <TabsContent value="errors">
                <div className="pb-6">
                  <ErrorTracker />
                </div>
              </TabsContent>

              <TabsContent value="alerts">
                <div className="pb-6">
                  <AlertsPanel />
                </div>
              </TabsContent>

              <TabsContent value="abtests">
                <div className="pb-6">
                  <ABTestManager />
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <div className="space-y-4 pb-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">
                      {language === 'en' ? 'User Management' : 'Gestion des Utilisateurs'}
                    </h3>
                    <p className="text-slate-600 mb-4">
                      {language === 'en'
                        ? `Total: ${totalUsers} users registered`
                        : `Total : ${totalUsers} utilisateurs enregistrés`}
                    </p>
                  </Card>
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
                <div className="space-y-6 pb-6">
                  <BulkOperations />
                  <DataRetentionPolicy />

                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Download className="w-5 h-5 text-blue-500" />
                      {language === 'en' ? 'Data Export' : 'Export de Données'}
                    </h3>
                    <p className="text-slate-600 mb-4">
                      {language === 'en'
                        ? 'Export all application data to JSON format'
                        : 'Exporter toutes les données de l\'application en format JSON'}
                    </p>
                    <Button
                      onClick={() => exportDataMutation.mutate()}
                      disabled={exportDataMutation.isPending}
                      className="min-h-[44px]"
                    >
                      {exportDataMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                      {language === 'en' ? 'Export JSON' : 'Exporter JSON'}
                    </Button>
                  </Card>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                      { label: language === 'en' ? 'Conversations' : 'Conversations', data: conversations, mutation: deleteAllConversationsMutation },
                      { label: language === 'en' ? 'Memories' : 'Mémoires', data: memories, mutation: deleteAllMemoriesMutation },
                      { label: language === 'en' ? 'Knowledge' : 'Connaissances', data: knowledgeBases, mutation: deleteAllKnowledgeMutation }
                    ].map((item, idx) => (
                      <Card key={idx} className="p-6">
                        <h3 className="text-lg font-bold mb-2">
                          {language === 'en' ? `Delete ${item.label}` : `Supprimer ${item.label}`}
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">{item.data.length} items</p>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              disabled={item.data.length === 0}
                              className="w-full min-h-[44px]"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {language === 'en' ? 'Delete All' : 'Supprimer tout'}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {language === 'en' ? 'Confirm Deletion' : 'Confirmer la suppression'}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {language === 'en'
                                  ? `Permanently delete ${item.data.length} ${item.label.toLowerCase()}? This action cannot be undone.`
                                  : `Supprimer ${item.data.length} ${item.label.toLowerCase()} de manière irréversible ?`
                                }
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="min-h-[44px]">
                                {language === 'en' ? 'Cancel' : 'Annuler'}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => item.mutation.mutate()}
                                className="bg-red-600 min-h-[44px]"
                              >
                                {language === 'en' ? 'Confirm' : 'Confirmer'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </QuantumSecurityLayer>
  );
}
