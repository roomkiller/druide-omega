/**
 * System Monitoring Page - Dashboard complet de monitoring
 */

import React from 'react';
import { Activity } from 'lucide-react';
import MetricsDashboard from '@/components/monitoring/MetricsDashboard';

export default function MonitoringPage() {
  return (
    <div className="min-h-screen bg-slate-50 page-padding page-padding-y">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">System Monitoring</h1>
              <p className="text-slate-600">Real-time metrics and performance tracking</p>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <MetricsDashboard />
      </div>
    </div>
  );
}