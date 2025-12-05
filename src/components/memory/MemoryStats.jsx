import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, Star, Database, TrendingUp, MessageCircle, Mic, Eye, Clock, Zap, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { safeToFixed, safeAverage } from "@/components/utils/SafeNumber";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area } from "recharts";
import { format, subDays, startOfDay } from "date-fns";

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'];

export default function MemoryStats({ memories = [], detailed = false }) {
  const totalMemories = memories.length;
  
  const importanceValues = memories.map(m => m.importance || 0);
  const averageImportance = safeAverage(importanceValues, 1);
  
  const totalAccesses = memories.reduce((sum, m) => sum + (m.access_count || 0), 0);
  const highImportanceCount = memories.filter(m => m.importance >= 7).length;
  
  // Nouvelles statistiques
  const modalityStats = useMemo(() => {
    const counts = { chat: 0, voice: 0, visual: 0, system: 0 };
    memories.forEach(m => {
      const mod = m.modality || 'system';
      counts[mod] = (counts[mod] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
  }, [memories]);

  const typeStats = useMemo(() => {
    const counts = {};
    memories.forEach(m => {
      const type = m.type || 'autre';
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).slice(0, 6);
  }, [memories]);

  const activityByDay = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      last7Days.push(date);
    }
    return last7Days.map(date => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      const count = memories.filter(m => {
        const mDate = new Date(m.created_date);
        return mDate >= date && mDate < nextDay;
      }).length;
      return {
        date: format(date, 'dd/MM'),
        mémoires: count
      };
    });
  }, [memories]);

  const importanceDistribution = useMemo(() => {
    const ranges = [
      { range: '1-3', min: 1, max: 3, count: 0 },
      { range: '4-5', min: 4, max: 5, count: 0 },
      { range: '6-7', min: 6, max: 7, count: 0 },
      { range: '8-10', min: 8, max: 10, count: 0 }
    ];
    memories.forEach(m => {
      const imp = m.importance || 5;
      const rangeItem = ranges.find(r => imp >= r.min && imp <= r.max);
      if (rangeItem) rangeItem.count++;
    });
    return ranges;
  }, [memories]);

  const recentMemories = useMemo(() => {
    const now = new Date();
    const last24h = memories.filter(m => (now - new Date(m.created_date)) < 86400000).length;
    const lastWeek = memories.filter(m => (now - new Date(m.created_date)) < 604800000).length;
    return { last24h, lastWeek };
  }, [memories]);

  const stats = [
    {
      title: "Mémoires totales",
      value: totalMemories,
      icon: Database,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Importance moyenne",
      value: `${averageImportance}/10`,
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Accès total",
      value: totalAccesses,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Haute priorité",
      value: highImportanceCount,
      icon: Brain,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-2">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{WebkitTextFillColor: 'transparent'}} />
                  </div>
                  <span className="hidden sm:inline">{stat.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-slate-500 sm:hidden">{stat.title}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Charts (when detailed prop is true) */}
      {detailed && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Activité par jour */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm sm:text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  Activité (7 jours)
                </h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[10px] sm:text-xs">
                    24h: {recentMemories.last24h}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] sm:text-xs">
                    7j: {recentMemories.lastWeek}
                  </Badge>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={activityByDay}>
                  <defs>
                    <linearGradient id="colorMemories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="mémoires" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorMemories)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Répartition par modalité */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 sm:p-6">
              <h3 className="font-bold text-sm sm:text-lg mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                Répartition par Modalité
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={modalityStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {modalityStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Distribution par type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 sm:p-6">
              <h3 className="font-bold text-sm sm:text-lg mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                Types de Mémoires
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={typeStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Distribution importance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-4 sm:p-6">
              <h3 className="font-bold text-sm sm:text-lg mb-4 flex items-center gap-2">
                <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                Distribution Importance
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={importanceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}