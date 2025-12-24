/**
 * Advanced Metrics Dashboard - Visualisation complète des métriques système
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Activity, Users, Zap, TrendingUp, Database, Globe } from 'lucide-react';
import RealTimeMonitor from './RealTimeMonitor';
import AlertSystem from './AlertSystem';
import PerformanceTracker from './PerformanceTracker';

export default function MetricsDashboard() {
  const [timeRange, setTimeRange] = useState('1h'); // 1h, 24h, 7d, 30d
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalRequests: 0,
    avgResponseTime: 0,
    errorRate: 0,
    uptime: 100
  });

  useEffect(() => {
    // Simulate stats updates
    const interval = setInterval(() => {
      setStats({
        activeUsers: Math.floor(Math.random() * 100),
        totalRequests: Math.floor(Math.random() * 10000),
        avgResponseTime: Math.floor(Math.random() * 200) + 50,
        errorRate: (Math.random() * 2).toFixed(2),
        uptime: (99 + Math.random()).toFixed(2)
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Active Users"
          value={stats.activeUsers}
          change="+12%"
          positive
        />
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Total Requests"
          value={stats.totalRequests.toLocaleString()}
          change="+5%"
          positive
        />
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          label="Avg Response"
          value={`${stats.avgResponseTime}ms`}
          change="-8%"
          positive
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Error Rate"
          value={`${stats.errorRate}%`}
          change="-0.5%"
          positive
        />
        <StatCard
          icon={<Globe className="w-5 h-5" />}
          label="Uptime"
          value={`${stats.uptime}%`}
          change="+0.01%"
          positive
        />
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="realtime" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="realtime">Real-Time</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <RealTimeMonitor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <AlertSystem />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ icon, label, value, change, positive }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
            {icon}
          </div>
          <span className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        </div>
        <p className="text-sm text-slate-600 mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );
}