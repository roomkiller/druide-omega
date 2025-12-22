/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Analytics Dashboard                                        ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Users, MessageSquare, Database, Eye, Activity, Brain, BookOpen, RefreshCw, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/utils/LanguageContext";

export default function AnalyticsDashboard() {
  const { t, language } = useLanguage();
  const { data: analytics = [] } = useQuery({
    queryKey: ['analyticsEvents'],
    queryFn: () => base44.entities.AnalyticsEvent.list('-timestamp', 500),
    refetchInterval: 15000,
    staleTime: 10000,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['analyticsUsers'],
    queryFn: () => base44.entities.User.list(),
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ['analyticsConversations'],
    queryFn: () => base44.entities.Conversation.list(),
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const { data: memories = [] } = useQuery({
    queryKey: ['analyticsMemories'],
    queryFn: () => base44.entities.Memory.list('-created_date', 100),
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['analyticsKnowledge'],
    queryFn: () => base44.entities.KnowledgeBase.list(),
    refetchInterval: 60000,
    staleTime: 30000,
  });

  // Statistiques globales
  const totalEvents = analytics.length;
  const uniqueUsers = new Set(analytics.map(e => e.user_email)).size;
  const avgEventsPerUser = uniqueUsers > 0 ? (totalEvents / uniqueUsers).toFixed(1) : 0;

  // Events par type
  const eventsByType = analytics.reduce((acc, event) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {});

  const eventTypeData = Object.entries(eventsByType).map(([name, value]) => ({
    name,
    value
  })).slice(0, 8);

  // Activité par jour (7 derniers jours)
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    last7Days.push(date);
  }

  const activityByDay = last7Days.map(date => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const count = analytics.filter(e => {
      const eventDate = new Date(e.timestamp);
      return eventDate >= date && eventDate < nextDay;
    }).length;

    return {
      date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      events: count
    };
  });

  // Top features utilisées
  const featureUsage = analytics
    .filter(e => e.event_name?.includes('feature_'))
    .reduce((acc, event) => {
      const feature = event.event_name.replace('feature_', '');
      acc[feature] = (acc[feature] || 0) + 1;
      return acc;
    }, {});

  const topFeatures = Object.entries(featureUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  // Croissance utilisateurs
  const userGrowth = users.reduce((acc, user) => {
    const date = new Date(user.created_date).toLocaleDateString('fr-FR', { month: 'short' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const userGrowthData = Object.entries(userGrowth)
    .slice(-6)
    .map(([month, count]) => ({ month, users: count }));

  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'];

  // Nouvelles métriques
  const totalMemories = memories.length;
  const totalKnowledge = knowledgeBases.length;
  const avgMemoryImportance = memories.length > 0 
    ? (memories.reduce((sum, m) => sum + (m.importance || 5), 0) / memories.length).toFixed(1)
    : 0;

  const stats = [
    { 
      title: t('analytics.totalEvents'), 
      value: totalEvents, 
      icon: Activity, 
      color: "from-purple-500 to-indigo-600",
      subtitle: t('analytics.refresh15s')
    },
    { 
      title: t('analytics.activeUsers'), 
      value: uniqueUsers, 
      icon: Users, 
      color: "from-blue-500 to-cyan-600",
      subtitle: `${users.length} ${t('analytics.registered')}`
    },
    { 
      title: t('analytics.conversations'), 
      value: conversations.length, 
      icon: MessageSquare, 
      color: "from-pink-500 to-rose-600",
      subtitle: t('analytics.total')
    },
    { 
      title: t('analytics.memories'), 
      value: totalMemories, 
      icon: Brain, 
      color: "from-amber-500 to-orange-600",
      subtitle: `${language === 'en' ? 'Avg' : 'Moy'}: ${avgMemoryImportance}/10`
    },
    { 
      title: t('analytics.knowledgeBases'), 
      value: totalKnowledge, 
      icon: BookOpen, 
      color: "from-green-500 to-emerald-600",
      subtitle: t('analytics.documents')
    },
    { 
      title: t('analytics.eventsPerUser'), 
      value: avgEventsPerUser, 
      icon: TrendingUp, 
      color: "from-indigo-500 to-purple-600",
      subtitle: t('analytics.average')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-4 sm:p-5 hover:shadow-lg transition-all group">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-0.5">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-600">{stat.title}</div>
                {stat.subtitle && (
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <RefreshCw className="w-2.5 h-2.5" />
                    {stat.subtitle}
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Activité par jour */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">{t('analytics.activityLast7Days')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="events" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Events par type */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">{t('analytics.eventsByType')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={eventTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {eventTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Features */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">{t('analytics.popularFeatures')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topFeatures} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Croissance utilisateurs */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">{t('analytics.userGrowth')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="users" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}