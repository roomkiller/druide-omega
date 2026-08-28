import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Brain, Star, Database, TrendingUp, MessageCircle, Mic, Eye, Clock, Zap, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { safeToFixed, safeAverage } from "@/components/utils/SafeNumber";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { useLanguage } from "@/components/utils/LanguageContext";

const COLORS = ['#a78bfa', '#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#818cf8', '#5eead4'];

const CHART_STROKE = '#f1f5f9';
const TOOLTIP_STYLE = {
  contentStyle: {
    background: 'rgba(255,255,255,0.96)',
    border: '1px solid #ede9fe',
    borderRadius: 12,
    boxShadow: '0 8px 24px -8px rgba(124,58,237,0.18)',
    fontSize: 12,
    padding: '8px 12px'
  },
  labelStyle: { color: '#64748b', fontWeight: 600, marginBottom: 2 },
  itemStyle: { color: '#1e293b' }
};

export default function MemoryStats({ memories = [], detailed = false }) {
  const { t, language } = useLanguage();
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
        [t('memoryStats.memories')]: count
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
      title: t('memoryStats.totalMemories'),
      value: totalMemories,
      icon: Database,
      gradient: "from-violet-500 to-indigo-500",
      ring: "ring-violet-100"
    },
    {
      title: t('memoryStats.avgImportance'),
      value: `${averageImportance}/10`,
      icon: Star,
      gradient: "from-amber-400 to-orange-500",
      ring: "ring-amber-100"
    },
    {
      title: t('memoryStats.totalAccess'),
      value: totalAccesses,
      icon: TrendingUp,
      gradient: "from-emerald-400 to-teal-500",
      ring: "ring-emerald-100"
    },
    {
      title: t('memoryStats.highPriority'),
      value: highImportanceCount,
      icon: Brain,
      gradient: "from-fuchsia-500 to-pink-500",
      ring: "ring-fuchsia-100"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, ease: 'easeOut' }}
          >
            <Card className="border-slate-200/70 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300 ring-1 ring-inset ring-slate-100">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm`}>
                    <stat.icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] sm:text-xs font-medium text-slate-500 truncate tracking-wide uppercase">
                      {stat.title}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900 font-display tabular-nums leading-tight mt-0.5">
                      {stat.value}
                    </div>
                  </div>
                </div>
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ease: 'easeOut' }}
          >
            <Card className="p-4 sm:p-6 border-slate-200/70 bg-white/80 backdrop-blur-sm shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-sm sm:text-base text-slate-700 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-violet-600" />
                  </span>
                  {t('memoryStats.activity7Days')}
                </h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[10px] sm:text-xs font-medium border-slate-200 text-slate-600 bg-slate-50/60">
                    {t('memoryStats.last24h')}: {recentMemories.last24h}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] sm:text-xs font-medium border-slate-200 text-slate-600 bg-slate-50/60">
                    {t('memoryStats.lastWeek')}: {recentMemories.lastWeek}
                  </Badge>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={activityByDay} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMemories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.35}/>
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_STROKE} vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip {...TOOLTIP_STYLE} />
                  <Area type="monotone" dataKey={t('memoryStats.memories')} stroke="#8b5cf6" strokeWidth={2.5} fill="url(#colorMemories)" dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#7c3aed' }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Répartition par modalité */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, ease: 'easeOut' }}
          >
            <Card className="p-4 sm:p-6 border-slate-200/70 bg-white/80 backdrop-blur-sm shadow-sm">
              <h3 className="font-semibold text-sm sm:text-base text-slate-700 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-600" />
                </span>
                {t('memoryStats.byModality')}
              </h3>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={modalityStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {modalityStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Distribution par type */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.29, ease: 'easeOut' }}
          >
            <Card className="p-4 sm:p-6 border-slate-200/70 bg-white/80 backdrop-blur-sm shadow-sm">
              <h3 className="font-semibold text-sm sm:text-base text-slate-700 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-indigo-600" />
                </span>
                {t('memoryStats.memoryTypes')}
              </h3>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={typeStats} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_STROKE} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={84} />
                  <Tooltip {...TOOLTIP_STYLE} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                  <Bar dataKey="value" fill="#818cf8" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Distribution importance */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, ease: 'easeOut' }}
          >
            <Card className="p-4 sm:p-6 border-slate-200/70 bg-white/80 backdrop-blur-sm shadow-sm">
              <h3 className="font-semibold text-sm sm:text-base text-slate-700 mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-emerald-600" />
                </span>
                {t('memoryStats.importanceDistribution')}
              </h3>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={importanceDistribution} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_STROKE} vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip {...TOOLTIP_STYLE} cursor={{ fill: 'rgba(16,185,129,0.06)' }} />
                  <Bar dataKey="count" fill="#34d399" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}