/**
 * Performance Dashboard
 * Affiche metrics de performance et optimisations
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Zap,
  Image as ImageIcon,
  Database,
  Gauge,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // Simuler les metrics
    const metrics = {
      images: {
        original_mb: 12.4,
        optimized_mb: 3.1,
        compression_ratio: 0.75,
        lazy_loading: 95,
      },
      api: {
        avg_response_ms: 145,
        sla_target_ms: 200,
        cache_hit_rate: 0.68,
        slow_endpoints: [
          { name: "/audit", time_ms: 520, sla_ms: 500, exceeds: true },
          { name: "/export", time_ms: 2800, sla_ms: 3000, exceeds: false },
        ],
      },
      bundle: {
        main_js_kb: 145,
        vendors_js_kb: 195,
        css_kb: 42,
        total_kb: 382,
      },
      vitals: {
        lcp_ms: 1650,
        fid_ms: 48,
        cls: 0.08,
        ttb_ms: 2100,
      },
      cache: {
        entries: 24,
        hit_count: 1023,
        miss_count: 487,
      },
    };

    setMetrics(metrics);
  }, []);

  if (!metrics) return null;

  const getStatus = (value, target, higher = false) => {
    if (higher) return value >= target ? "good" : value >= target * 0.8 ? "ok" : "poor";
    return value <= target ? "good" : value <= target * 1.2 ? "ok" : "poor";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">📊 Performance Dashboard</h1>
          <p className="text-gray-400">Optimisations et métriques de vitesse</p>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Compression Images",
              value: `${Math.round(metrics.images.compression_ratio * 100)}%`,
              icon: ImageIcon,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "Cache Hit Rate",
              value: `${Math.round(metrics.api.cache_hit_rate * 100)}%`,
              icon: Database,
              color: "from-green-500 to-green-600",
            },
            {
              label: "Avg API Response",
              value: `${metrics.api.avg_response_ms}ms`,
              icon: Gauge,
              color: "from-purple-500 to-purple-600",
            },
            {
              label: "Lazy Loading",
              value: `${metrics.images.lazy_loading}%`,
              icon: Zap,
              color: "from-orange-500 to-orange-600",
            },
          ].map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`bg-gradient-to-br ${metric.color} border-0 text-white`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90">{metric.label}</p>
                        <p className="text-3xl font-bold mt-2">{metric.value}</p>
                      </div>
                      <Icon className="w-12 h-12 opacity-30" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Images Optimization */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Image Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Size Reduction</span>
                  <span className="text-green-400 font-bold">
                    {metrics.images.original_mb}MB → {metrics.images.optimized_mb}MB
                  </span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Lazy Loading Coverage</span>
                  <span className="text-green-400">{metrics.images.lazy_loading}%</span>
                </div>
                <Progress value={metrics.images.lazy_loading} className="h-2" />
              </div>
              <div className="bg-green-900/20 border border-green-700 rounded p-3 text-sm text-green-400">
                ✓ WebP format enabled • Responsive images • LQIP placeholders
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Performance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gauge className="w-5 h-5" />
                API Response Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "List Phases", time: 110 },
                { name: "Get Notifications", time: 85 },
                { name: "Create Phase", time: 165 },
                { name: "Validate Data", time: 210 },
              ].map((endpoint, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{endpoint.name}</span>
                    <span className={endpoint.time > 200 ? "text-yellow-400" : "text-green-400"}>
                      {endpoint.time}ms
                    </span>
                  </div>
                  <Progress value={Math.min(endpoint.time / 2.5, 100)} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Cache Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Cached Entries</span>
                  <span className="text-blue-400">{metrics.cache.entries}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Hit Rate</span>
                  <span className="text-green-400">
                    {Math.round(
                      (metrics.cache.hit_count / (metrics.cache.hit_count + metrics.cache.miss_count)) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <p>• Browser cache: 1 year (assets)</p>
                <p>• API cache: 5 minutes (responses)</p>
                <p>• Service Worker offline support</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Core Web Vitals */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Core Web Vitals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "LCP", value: `${metrics.vitals.lcp_ms}ms`, target: 2500, status: "good" },
                  { label: "FID", value: `${metrics.vitals.fid_ms}ms`, target: 100, status: "good" },
                  { label: "CLS", value: metrics.vitals.cls.toFixed(2), target: 0.1, status: "good" },
                  { label: "TTB", value: `${metrics.vitals.ttb_ms}ms`, target: 3000, status: "good" },
                ].map((vital, i) => (
                  <div key={i} className="bg-slate-700/30 p-4 rounded border border-slate-600">
                    <p className="text-gray-400 text-xs mb-2">{vital.label}</p>
                    <p className="text-2xl font-bold text-white">{vital.value}</p>
                    <Badge className="mt-2 bg-green-900 text-green-300">Good</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bundle Analysis */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Bundle Size Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Main JS", size: metrics.bundle.main_js_kb, color: "bg-blue-500" },
                  { name: "Vendors", size: metrics.bundle.vendors_js_kb, color: "bg-purple-500" },
                  { name: "CSS", size: metrics.bundle.css_kb, color: "bg-green-500" },
                ].map((asset, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{asset.name}</span>
                      <span className="text-white font-bold">{asset.size}KB</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded h-2">
                      <div
                        className={`${asset.color} h-2 rounded`}
                        style={{ width: `${(asset.size / metrics.bundle.total_kb) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-gray-400 text-sm mt-4">
                  Total: <span className="text-white font-bold">{metrics.bundle.total_kb}KB</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}