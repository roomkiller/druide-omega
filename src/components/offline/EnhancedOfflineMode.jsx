/**
 * Enhanced Offline Mode - Mode hors-ligne amélioré
 */

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WifiOff, Wifi, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function EnhancedOfflineMode() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [cachedData, setCachedData] = useState({
    conversations: 0,
    memories: 0,
    knowledge: 0
  });

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      await syncOfflineQueue();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadCachedData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCachedData = async () => {
    try {
      const cache = await caches.open('druide-omega-data');
      const keys = await cache.keys();
      
      setCachedData({
        conversations: keys.filter(k => k.url.includes('Conversation')).length,
        memories: keys.filter(k => k.url.includes('Memory')).length,
        knowledge: keys.filter(k => k.url.includes('KnowledgeBase')).length
      });
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const syncOfflineQueue = async () => {
    const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
    
    for (const item of queue) {
      try {
        if (item.type === 'create') {
          await base44.entities[item.entity].create(item.data);
        } else if (item.type === 'update') {
          await base44.entities[item.entity].update(item.id, item.data);
        } else if (item.type === 'delete') {
          await base44.entities[item.entity].delete(item.id);
        }
      } catch (error) {
        console.error('Sync error:', error);
      }
    }

    localStorage.removeItem('offline_queue');
    setOfflineQueue([]);
  };

  const downloadForOffline = async () => {
    try {
      // Cache essential data
      const [convs, mems, kbs] = await Promise.all([
        base44.entities.Conversation.list(),
        base44.entities.Memory.list(),
        base44.entities.KnowledgeBase.list()
      ]);

      const cache = await caches.open('druide-omega-data');
      
      await cache.put(
        new Request('/offline-data'),
        new Response(JSON.stringify({ convs, mems, kbs }))
      );

      loadCachedData();
      alert('Data downloaded for offline use!');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download data');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isOnline ? (
            <Wifi className="w-6 h-6 text-green-600" />
          ) : (
            <WifiOff className="w-6 h-6 text-red-600" />
          )}
          <div>
            <h3 className="font-bold text-slate-900">Network Status</h3>
            <Badge className={isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </div>
        <Button size="sm" onClick={downloadForOffline} disabled={!isOnline}>
          <Download className="w-4 h-4 mr-1" />
          Download for Offline
        </Button>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Cached Conversations</span>
            <span className="font-bold text-slate-900">{cachedData.conversations}</span>
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Cached Memories</span>
            <span className="font-bold text-slate-900">{cachedData.memories}</span>
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Cached Knowledge</span>
            <span className="font-bold text-slate-900">{cachedData.knowledge}</span>
          </div>
        </div>

        {offlineQueue.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">
                {offlineQueue.length} pending sync operation(s)
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}