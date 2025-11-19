/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Admin Dashboard                                            ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/utils/LanguageContext";
import { createPageUrl } from "@/utils";
import {
  Shield, Users, Database, Activity, AlertTriangle, Loader2,
  UserCircle, BarChart3, DollarSign, Newspaper, Trophy, TrendingUp,
  Brain, BookOpen, Eye, LogOut, Bell, Settings as SettingsIcon, Download, FileText
} from "lucide-react";
import { motion } from "framer-motion";
import CryptoShield, { useCryptoShield } from "../components/admin/CryptoShield";
import MetricsChart from "../components/admin/MetricsChart";
import ErrorTracker from "../components/admin/ErrorTracker";
import AlertsPanel from "../components/admin/AlertsPanel";
import ValuationCalculator from "../components/admin/ValuationCalculator";
import CompetitiveBenchmark from "../components/admin/CompetitiveBenchmark";
import AINewsAggregator from "../components/admin/AINewsAggregator";
import StockTracker from "../components/admin/StockTracker";
import MarketAnalysisPanel from "../components/admin/MarketAnalysisPanel";
import Pagination from "../components/utils/Pagination";
import AuditLogsPanel from "../components/admin/AuditLogsPanel";
import SystemHealthPanel from "../components/admin/SystemHealthPanel";
import DataExportPanel from "../components/admin/DataExportPanel";
import AnalyticsDashboard from "../components/admin/AnalyticsDashboard";
import NotificationsPanel from "../components/admin/NotificationsPanel";
import SettingsPanel from "../components/admin/SettingsPanel";
import ABTestManager from "../components/admin/ABTestManager";
import BulkOperations from "../components/admin/BulkOperations";
import DataRetentionPolicy from "../components/admin/DataRetentionPolicy";

function AdminDashboard() {
  const { language } = useLanguage();
  const { user: adminUser, handleLogout } = useCryptoShield();
  const [activeTab, setActiveTab] = useState("overview");
  const [usersPage, setUsersPage] = useState(1);
  const pageSize = 20;

  // Data queries with proper error handling
  const { data: conversations = [], isLoading: loadingConv } = useQuery({
    queryKey: ['admin-conversations'],
    queryFn: () => base44.entities.Conversation.list('-created_date', 100),
    initialData: [],
  });

  const { data: memories = [], isLoading: loadingMem } = useQuery({
    queryKey: ['admin-memories'],
    queryFn: () => base44.entities.Memory.list('-created_date', 100),
    initialData: [],
  });

  const { data: knowledgeBases = [], isLoading: loadingKB } = useQuery({
    queryKey: ['admin-knowledge'],
    queryFn: () => base44.entities.KnowledgeBase.list('-created_date', 100),
    initialData: [],
  });

  const { data: visualContents = [], isLoading: loadingVisuals } = useQuery({
    queryKey: ['admin-visuals'],
    queryFn: () => base44.entities.VisualContent.list('-created_date', 100),
    initialData: [],
  });

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['adminUsers', usersPage],
    queryFn: async () => {
      const users = await base44.asServiceRole.entities.User.list('-created_date', pageSize, (usersPage - 1) * pageSize);
      const totalCount = await base44.asServiceRole.entities.User.list();
      return { items: users, total: totalCount.length };
    },
    initialData: { items: [], total: 0 },
  });

  const { data: systemMetrics = [], isLoading: loadingMetrics } = useQuery({
    queryKey: ['systemMetrics'],
    queryFn: () => base44.entities.SystemMetrics.list('-timestamp', 50),
    refetchInterval: 30000,
    initialData: [],
  });

  const { data: errorLogs = [], isLoading: loadingErrors } = useQuery({
    queryKey: ['errorLogs'],
    queryFn: () => base44.entities.ErrorLog.list('-created_date', 20),
    initialData: [],
  });

  const { data: alerts = [], isLoading: loadingAlerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => base44.entities.Alert.list('-created_date', 20),
    initialData: [],
  });

  const renderUserCard = (userData, index) => (
    <motion.div 
      key={userData.id} 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-4 hover:shadow-lg transition-shadow border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <UserCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-slate-900 truncate">{userData.full_name || userData.email}</div>
              <div className="text-sm text-slate-600 truncate">{userData.email}</div>
              <div className="text-xs text-slate-500 mt-1">
                {language === 'en' ? 'Created:' : 'Créé:'} {new Date(userData.created_date).toLocaleDateString()}
              </div>
            </div>
          </div>
          <Badge className={userData.role === 'admin' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}>
            {userData.role}
          </Badge>
        </div>
      </Card>
    </motion.div>
  );

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

  const isLoadingData = loadingConv || loadingMem || loadingKB || loadingVisuals;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 sm:px-6 py-4 sm:py-6 shadow-xl flex-shrink-0">
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
                  {language === 'en' ? 'System Dashboard' : 'Tableau de bord système'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-green-500 text-white text-xs">
                ✓ {language === 'en' ? 'Secure' : 'Sécurisé'}
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 text-xs max-w-[200px] truncate">
                {adminUser?.email}
              </Badge>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleLogout}
                className="text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{language === 'en' ? 'Logout' : 'Déconnexion'}</span>
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4">
            {[
              { 
                icon: Users, 
                label: language === 'en' ? 'Users' : 'Utilisateurs', 
                value: totalUsers,
                loading: loadingUsers
              },
              { 
                icon: Database, 
                label: language === 'en' ? 'Data' : 'Données', 
                value: totalEntities,
                loading: isLoadingData
              },
              { 
                icon: Activity, 
                label: language === 'en' ? 'Alerts' : 'Alertes', 
                value: activeAlerts,
                loading: loadingAlerts
              },
              { 
                icon: AlertTriangle, 
                label: language === 'en' ? 'Errors' : 'Erreurs', 
                value: criticalErrors,
                loading: loadingErrors
              }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Icon className="w-3 h-3 text-white" />
                    <span className="text-xs text-purple-100">{stat.label}</span>
                  </div>
                  {stat.loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : (
                    <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white shadow-md mb-4 flex-wrap h-auto p-1">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Vue
              </TabsTrigger>
              <TabsTrigger value="health" className="text-xs sm:text-sm">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Santé
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs sm:text-sm">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Notifs
              </TabsTrigger>
              <TabsTrigger value="audit" className="text-xs sm:text-sm">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Audit
              </TabsTrigger>
              <TabsTrigger value="export" className="text-xs sm:text-sm">
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Export
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm">
                <SettingsIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Config
              </TabsTrigger>
              <TabsTrigger value="abtests" className="text-xs sm:text-sm">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                A/B
              </TabsTrigger>
              <TabsTrigger value="bulk" className="text-xs sm:text-sm">
                <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Bulk
              </TabsTrigger>
              <TabsTrigger value="retention" className="text-xs sm:text-sm">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Rétention
              </TabsTrigger>
              <TabsTrigger value="valuation" className="text-xs sm:text-sm">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Valeur
              </TabsTrigger>
              <TabsTrigger value="competition" className="text-xs sm:text-sm">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Compét
              </TabsTrigger>
              <TabsTrigger value="news" className="text-xs sm:text-sm">
                <Newspaper className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                News
              </TabsTrigger>
              <TabsTrigger value="stocks" className="text-xs sm:text-sm">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Bourse
              </TabsTrigger>
              <TabsTrigger value="market" className="text-xs sm:text-sm">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Marché
              </TabsTrigger>
              <TabsTrigger value="metrics" className="text-xs sm:text-sm">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Métriques
              </TabsTrigger>
              <TabsTrigger value="users" className="text-xs sm:text-sm">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Users
              </TabsTrigger>
              <TabsTrigger value="ip" className="text-xs sm:text-sm">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Propriété IP
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Conversations', value: conversations.length, color: "from-purple-500 to-indigo-600", icon: Database },
                  { label: 'Mémoires', value: memories.length, color: "from-indigo-500 to-purple-600", icon: Brain },
                  { label: 'Connaissances', value: knowledgeBases.length, color: "from-blue-500 to-cyan-600", icon: BookOpen },
                  { label: 'Visuels', value: visualContents.length, color: "from-pink-500 to-rose-600", icon: Eye }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                      <Card className="p-4 sm:p-6 hover:shadow-xl transition-all">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-xs sm:text-sm text-slate-600">{stat.label}</div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <AlertsPanel />
                <ErrorTracker />
              </div>
            </TabsContent>

            <TabsContent value="health" className="mt-0"><SystemHealthPanel /></TabsContent>
            <TabsContent value="analytics" className="mt-0"><AnalyticsDashboard /></TabsContent>
            <TabsContent value="notifications" className="mt-0"><NotificationsPanel /></TabsContent>
            <TabsContent value="audit" className="mt-0"><AuditLogsPanel /></TabsContent>
            <TabsContent value="export" className="mt-0"><DataExportPanel /></TabsContent>
            <TabsContent value="settings" className="mt-0"><SettingsPanel /></TabsContent>
            <TabsContent value="abtests" className="mt-0"><ABTestManager /></TabsContent>
            <TabsContent value="bulk" className="mt-0"><BulkOperations /></TabsContent>
            <TabsContent value="retention" className="mt-0"><DataRetentionPolicy /></TabsContent>
            <TabsContent value="valuation" className="mt-0"><ValuationCalculator /></TabsContent>
            <TabsContent value="competition" className="mt-0"><CompetitiveBenchmark /></TabsContent>
            <TabsContent value="news" className="mt-0"><AINewsAggregator /></TabsContent>
            <TabsContent value="stocks" className="mt-0"><StockTracker /></TabsContent>
            <TabsContent value="market" className="mt-0"><MarketAnalysisPanel /></TabsContent>
            
            <TabsContent value="metrics" className="space-y-4 sm:space-y-6 mt-0">
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <MetricsChart 
                  title="Performance" 
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
            
            <TabsContent value="users" className="space-y-3 sm:space-y-4 mt-0">
              <Card className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Gestion des Utilisateurs</h3>
                <p className="text-xs sm:text-sm text-slate-600">Total: {totalUsers} utilisateurs</p>
              </Card>
              
              {loadingUsers ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
                </div>
              ) : usersData?.items?.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {usersData.items.map((userData, idx) => renderUserCard(userData, idx))}
                  </div>
                  <Pagination 
                    currentPage={usersPage} 
                    totalPages={Math.ceil((usersData?.total || 0) / pageSize)} 
                    totalItems={usersData?.total} 
                    onPageChange={setUsersPage} 
                    itemsPerPage={pageSize} 
                  />
                </>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-slate-600">Aucun utilisateur trouvé</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="ip" className="mt-0">
              <Card className="p-4 sm:p-6 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Documentation Propriété Intellectuelle</h3>
                    <p className="text-sm text-slate-600">Confidentiel - Usage légal uniquement</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-slate-700">
                    Documentation complète du système Druide Omega incluant:
                  </p>
                  <ul className="text-sm text-slate-700 list-disc list-inside space-y-1 ml-2">
                    <li>Framework SAPIER (équations et dimensions)</li>
                    <li>Architecture technique détaillée</li>
                    <li>Innovations brevetables</li>
                    <li>Modèles de données propriétaires</li>
                    <li>Algorithmes avancés</li>
                    <li>Recommandations légales</li>
                  </ul>
                  <Button 
                    onClick={() => window.location.href = createPageUrl('IntellectualProperty')}
                    className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white hover:opacity-90 mt-4"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Accéder à la documentation
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <CryptoShield>
      <AdminDashboard />
    </CryptoShield>
  );
}