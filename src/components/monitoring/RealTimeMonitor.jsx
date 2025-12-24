/**
 * Real-Time Monitoring System - Surveillance continue des métriques
 */

import React, { useState, useEffect, useRef } from 'react';
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Zap } from 'lucide-react';

export default function RealTimeMonitor({ onAlert }) {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    fps: 60,
    latency: 0,
    errors: 0,
    requests: 0
  });
  const [isMonitoring, setIsMonitoring] = useState(true);
  const intervalRef = useRef(null);
  const errorCountRef = useRef(0);

  useEffect(() => {
    if (!isMonitoring) return;

    // Monitor performance metrics
    intervalRef.current = setInterval(() => {
      const newMetrics = {
        cpu: performance.memory ? (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit * 100).toFixed(1) : 0,
        memory: performance.memory ? (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1) : 0,
        fps: calculateFPS(),
        latency: performance.now() % 100,
        errors: errorCountRef.current,
        requests: performance.getEntriesByType('resource').length
      };

      setMetrics(newMetrics);

      // Check thresholds and trigger alerts
      checkThresholds(newMetrics);
    }, 1000);

    // Monitor errors
    const errorHandler = (event) => {
      errorCountRef.current++;
      onAlert?.({
        type: 'error',
        severity: 'high',
        message: event.message || 'Unknown error',
        timestamp: new Date()
      });
    };

    window.addEventListener('error', errorHandler);

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener('error', errorHandler);
    };
  }, [isMonitoring, onAlert]);

  const calculateFPS = () => {
    const entries = performance.getEntriesByType('navigation');
    return entries.length > 0 ? Math.round(1000 / entries[0].duration) : 60;
  };

  const checkThresholds = (metrics) => {
    if (metrics.cpu > 80) {
      onAlert?.({
        type: 'performance',
        severity: 'warning',
        message: `High CPU usage: ${metrics.cpu}%`,
        timestamp: new Date()
      });
    }
    if (metrics.memory > 100) {
      onAlert?.({
        type: 'memory',
        severity: 'warning',
        message: `High memory usage: ${metrics.memory}MB`,
        timestamp: new Date()
      });
    }
    if (metrics.fps < 30) {
      onAlert?.({
        type: 'fps',
        severity: 'warning',
        message: `Low FPS detected: ${metrics.fps}`,
        timestamp: new Date()
      });
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <MetricCard
        icon={<Zap className="w-5 h-5" />}
        label="CPU"
        value={`${metrics.cpu}%`}
        status={metrics.cpu > 80 ? 'danger' : metrics.cpu > 60 ? 'warning' : 'good'}
        trend={metrics.cpu > 70 ? 'up' : 'down'}
      />
      <MetricCard
        icon={<Activity className="w-5 h-5" />}
        label="Memory"
        value={`${metrics.memory}MB`}
        status={metrics.memory > 100 ? 'danger' : metrics.memory > 75 ? 'warning' : 'good'}
        trend={metrics.memory > 90 ? 'up' : 'down'}
      />
      <MetricCard
        icon={<Activity className="w-5 h-5" />}
        label="FPS"
        value={metrics.fps}
        status={metrics.fps < 30 ? 'danger' : metrics.fps < 50 ? 'warning' : 'good'}
        trend={metrics.fps < 45 ? 'down' : 'up'}
      />
      <MetricCard
        icon={<Zap className="w-5 h-5" />}
        label="Latency"
        value={`${metrics.latency.toFixed(0)}ms`}
        status={metrics.latency > 100 ? 'warning' : 'good'}
        trend="stable"
      />
      <MetricCard
        icon={<AlertTriangle className="w-5 h-5" />}
        label="Errors"
        value={metrics.errors}
        status={metrics.errors > 0 ? 'danger' : 'good'}
        trend={metrics.errors > 0 ? 'up' : 'stable'}
      />
      <MetricCard
        icon={<Activity className="w-5 h-5" />}
        label="Requests"
        value={metrics.requests}
        status="good"
        trend="stable"
      />
    </div>
  );
}

function MetricCard({ icon, label, value, status, trend }) {
  const statusColors = {
    good: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    danger: 'bg-red-50 border-red-200 text-red-700'
  };

  return (
    <div className={`p-4 border rounded-lg ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        {trend === 'up' && <TrendingUp className="w-4 h-4" />}
        {trend === 'down' && <TrendingDown className="w-4 h-4" />}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}