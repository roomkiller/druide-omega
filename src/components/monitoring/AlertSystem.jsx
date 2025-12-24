/**
 * Automatic Alert System - Notifications pour erreurs et événements critiques
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, XCircle, AlertCircle, CheckCircle, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AlertSystem() {
  const [alerts, setAlerts] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [filter, setFilter] = useState('all'); // all, error, warning, info

  useEffect(() => {
    if (!isEnabled) return;

    // Monitor console errors
    const originalError = console.error;
    console.error = (...args) => {
      addAlert({
        type: 'error',
        severity: 'high',
        message: args[0]?.toString() || 'Console error',
        timestamp: new Date()
      });
      originalError.apply(console, args);
    };

    // Monitor unhandled rejections
    const handleRejection = (event) => {
      addAlert({
        type: 'error',
        severity: 'high',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: new Date()
      });
    };

    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      console.error = originalError;
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [isEnabled]);

  const addAlert = (alert) => {
    const alertWithId = { ...alert, id: Date.now() };
    setAlerts(prev => [alertWithId, ...prev].slice(0, 50)); // Keep last 50 alerts
  };

  const clearAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const clearAll = () => {
    setAlerts([]);
  };

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' || alert.type === filter
  );

  const severityConfig = {
    high: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    info: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-900">System Alerts</h3>
          <Badge variant={isEnabled ? 'default' : 'secondary'}>
            {isEnabled ? 'Active' : 'Paused'}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEnabled(!isEnabled)}
          >
            {isEnabled ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="outline" onClick={clearAll}>
            Clear All
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'error', 'warning', 'info'].map(f => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <Badge className="ml-2" variant="secondary">
                {alerts.filter(a => a.type === f).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
              <p className="font-medium">All systems operational</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const config = severityConfig[alert.severity] || severityConfig.info;
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-3 border rounded-lg ${config.bg} ${config.border}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 ${config.color} mt-0.5`} />
                      <div>
                        <p className="font-medium text-slate-900">{alert.message}</p>
                        <p className="text-xs text-slate-600 mt-1">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => clearAlert(alert.id)}
                    >
                      ×
                    </Button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}