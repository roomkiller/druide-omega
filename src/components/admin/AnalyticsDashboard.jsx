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
import { TrendingUp, Users, MessageSquare, Database, Eye, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsDashboard() {
  const { data: analytics } = useQuery({
    queryKey: ['analyticsEvents'],
    queryFn: () => base44.entities.AnalyticsEvent.list('-timestamp', 500),
    refetchInterval: 30000,
    initialData: [],
  });

  const { data: users = [] } = useQuery({
    queryKey: ['analyticsUsers'],
    queryFn: () => base44.entities.User.list(),
    initialData: [],
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ['analyticsConversations'],
    queryFn: () => base44.entities.Conversation.list(),
    initialData: [],
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

  const stats = [
    { 
      title: "Events Totaux", 
      value: totalEvents, 
      icon: Activity, 
      color: "from-purple-500 to-indigo-600" 
    },
    { 
      title: "Utilisateurs Actifs", 
      value: uniqueUsers, 
      icon: Users, 
      color: "from-blue-500 to-cyan-600" 
    },
    { 
      title: "Conversations", 
      value: conversations.length, 
      icon: MessageSquare, 
      color: "from-pink-500 to-rose-600" 
    },
    { 
      title: "Events/Utilisateur", 
      value: avgEventsPerUser, 
      icon: TrendingUp, 
      color: "from-green-500 to-emerald-600" 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.title}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Activité par jour */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Activité (7 derniers jours)</h3>
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
          <h3 className="font-bold text-lg mb-4">Events par Type</h3>
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
          <h3 className="font-bold text-lg mb-4">Fonctionnalités Populaires</h3>
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
          <h3 className="font-bold text-lg mb-4">Croissance Utilisateurs</h3>
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