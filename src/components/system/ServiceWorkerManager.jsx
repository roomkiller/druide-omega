/**
 * Service Worker Manager - UI pour gérer le cache
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, RefreshCw, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function ServiceWorkerManager() {
  const [status, setStatus] = useState('checking');
  const [cacheSize, setCacheSize] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    checkServiceWorker();
    estimateCacheSize();
  }, []);

  const checkServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        setStatus('active');
        setLastUpdate(new Date());
      } else {
        setStatus('inactive');
      }
    } else {
      setStatus('unsupported');
    }
  };

  const estimateCacheSize = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const { usage } = await navigator.storage.estimate();
      setCacheSize((usage / 1024 / 1024).toFixed(2)); // MB
    }
  };

  const clearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      setCacheSize(0);
      alert('Cache cleared successfully!');
    }
  };

  const updateServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        setLastUpdate(new Date());
        alert('Service Worker updated!');
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-slate-900">Service Worker</h3>
        <Badge className={
          status === 'active' ? 'bg-green-100 text-green-700' :
          status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }>
          {status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
          {status === 'inactive' && <XCircle className="w-3 h-3 mr-1" />}
          {status}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Cache Size</p>
            <p className="text-2xl font-bold text-slate-900">{cacheSize} MB</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Last Update</p>
            <p className="text-sm font-semibold text-slate-900">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={updateServiceWorker}
            disabled={status !== 'active'}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Update
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={clearCache}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear Cache
          </Button>
        </div>

        <div className="text-xs text-slate-600">
          <p className="font-semibold mb-1">Cache Strategy:</p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>Static assets: Cache-first</li>
            <li>API calls: Network-first</li>
            <li>Images: Cache with fallback</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}