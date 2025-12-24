/**
 * User Performance Tracker - Suivi des performances utilisateur
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MousePointer, Eye, Navigation } from 'lucide-react';

export default function PerformanceTracker() {
  const [userMetrics, setUserMetrics] = useState({
    sessionDuration: 0,
    pageViews: 0,
    clickCount: 0,
    scrollDepth: 0,
    engagement: 0
  });
  const [pageLoad, setPageLoad] = useState(null);

  useEffect(() => {
    const startTime = Date.now();
    let clickCount = 0;
    let maxScroll = 0;

    // Track clicks
    const handleClick = () => {
      clickCount++;
      setUserMetrics(prev => ({ ...prev, clickCount }));
    };

    // Track scroll depth
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      if (scrolled > maxScroll) {
        maxScroll = scrolled;
        setUserMetrics(prev => ({ ...prev, scrollDepth: Math.round(scrolled) }));
      }
    };

    // Update session duration
    const interval = setInterval(() => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      setUserMetrics(prev => ({
        ...prev,
        sessionDuration: duration,
        engagement: calculateEngagement(duration, clickCount, maxScroll)
      }));
    }, 1000);

    // Get page load performance
    if (performance.getEntriesByType) {
      const [perfData] = performance.getEntriesByType('navigation');
      if (perfData) {
        setPageLoad({
          dns: Math.round(perfData.domainLookupEnd - perfData.domainLookupStart),
          tcp: Math.round(perfData.connectEnd - perfData.connectStart),
          ttfb: Math.round(perfData.responseStart - perfData.requestStart),
          download: Math.round(perfData.responseEnd - perfData.responseStart),
          domInteractive: Math.round(perfData.domInteractive),
          domComplete: Math.round(perfData.domComplete),
          loadComplete: Math.round(perfData.loadEventEnd)
        });
      }
    }

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const calculateEngagement = (duration, clicks, scroll) => {
    const durationScore = Math.min(duration / 60, 10); // Max 10 points for 1 min
    const clickScore = Math.min(clicks / 5, 10); // Max 10 points for 5 clicks
    const scrollScore = scroll / 10; // Max 10 points for 100% scroll
    return Math.round((durationScore + clickScore + scrollScore) / 3 * 10);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* User Engagement Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Engagement</CardTitle>
            <Badge className={
              userMetrics.engagement > 70 ? 'bg-green-100 text-green-700' :
              userMetrics.engagement > 40 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }>
              Score: {userMetrics.engagement}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricItem
              icon={<Clock className="w-5 h-5" />}
              label="Session Duration"
              value={formatDuration(userMetrics.sessionDuration)}
            />
            <MetricItem
              icon={<Eye className="w-5 h-5" />}
              label="Page Views"
              value={userMetrics.pageViews}
            />
            <MetricItem
              icon={<MousePointer className="w-5 h-5" />}
              label="Click Count"
              value={userMetrics.clickCount}
            />
            <MetricItem
              icon={<Navigation className="w-5 h-5" />}
              label="Scroll Depth"
              value={`${userMetrics.scrollDepth}%`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Page Load Performance */}
      {pageLoad && (
        <Card>
          <CardHeader>
            <CardTitle>Page Load Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <PerformanceBar label="DNS Lookup" value={pageLoad.dns} max={100} unit="ms" />
              <PerformanceBar label="TCP Connection" value={pageLoad.tcp} max={100} unit="ms" />
              <PerformanceBar label="Time to First Byte" value={pageLoad.ttfb} max={200} unit="ms" />
              <PerformanceBar label="Content Download" value={pageLoad.download} max={500} unit="ms" />
              <PerformanceBar label="DOM Interactive" value={pageLoad.domInteractive} max={1000} unit="ms" />
              <PerformanceBar label="DOM Complete" value={pageLoad.domComplete} max={2000} unit="ms" />
              <PerformanceBar label="Load Complete" value={pageLoad.loadComplete} max={3000} unit="ms" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricItem({ icon, label, value }) {
  return (
    <div className="p-4 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-2 mb-2 text-slate-600">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function PerformanceBar({ label, value, max, unit }) {
  const percentage = Math.min((value / max) * 100, 100);
  const isGood = percentage < 50;
  const isWarning = percentage >= 50 && percentage < 80;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-900">{value}{unit}</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${
            isGood ? 'bg-green-500' :
            isWarning ? 'bg-yellow-500' :
            'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}