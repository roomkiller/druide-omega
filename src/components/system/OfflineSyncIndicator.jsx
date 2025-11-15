/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Offline Sync Status Indicator                              ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from "lucide-react";
import { useOfflineMode, offlineManager } from "@/components/offline/OfflineManager";
import { base44 } from "@/api/base44Client";
import SyncConflictResolver from "@/components/offline/SyncConflictResolver";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function OfflineSyncIndicator() {
  const { isOnline, pendingChanges } = useOfflineMode();
  const [isSyncing, setIsSyncing] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [showConflicts, setShowConflicts] = useState(false);

  const handleSync = async () => {
    if (!isOnline) return;
    
    setIsSyncing(true);
    try {
      const result = await offlineManager.syncToServer(base44);
      
      if (result.conflicts.length > 0) {
        setConflicts(result.conflicts);
        setShowConflicts(true);
      }
    } catch (error) {
      console.error("Erreur sync:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConflictResolved = (entityId) => {
    setConflicts(prev => prev.filter(c => c.entity_id !== entityId));
    if (conflicts.length <= 1) {
      setShowConflicts(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Badge 
          variant={isOnline ? "default" : "secondary"}
          className={`flex items-center gap-1 ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`}
        >
          {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {isOnline ? 'En ligne' : 'Hors ligne'}
        </Badge>

        {pendingChanges > 0 && (
          <Badge variant="outline" className="text-orange-600 border-orange-300">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {pendingChanges} en attente
          </Badge>
        )}

        {isOnline && pendingChanges > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleSync}
            disabled={isSyncing}
            className="h-7"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
        )}
      </div>

      <Dialog open={showConflicts} onOpenChange={setShowConflicts}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Résolution de Conflits</DialogTitle>
          </DialogHeader>
          <SyncConflictResolver 
            conflicts={conflicts} 
            onResolved={handleConflictResolved} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}