/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Sync Manager                                               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Gestion de la synchronisation des données offline                         ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { base44 } from '@/api/base44Client';

export class SyncManager {
  constructor() {
    this.syncQueue = [];
    this.syncing = false;
    this.dbName = 'DruideOmegaOffline';
  }

  async queueOperation(operation, entityName, data, id = null) {
    const queueItem = {
      id: `sync_${Date.now()}_${Math.random()}`,
      operation,
      entityName,
      data,
      entityId: id,
      timestamp: Date.now(),
      attempts: 0,
      status: 'pending'
    };

    this.syncQueue.push(queueItem);
    await this.saveSyncQueue();
    
    console.log('[SyncManager] Opération en queue:', operation, entityName);
  }

  async saveSyncQueue() {
    try {
      localStorage.setItem('druide_sync_queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('[SyncManager] Erreur sauvegarde queue:', error);
    }
  }

  async loadSyncQueue() {
    try {
      const saved = localStorage.getItem('druide_sync_queue');
      if (saved) {
        this.syncQueue = JSON.parse(saved);
      }
    } catch (error) {
      console.error('[SyncManager] Erreur chargement queue:', error);
      this.syncQueue = [];
    }
  }

  async syncAll() {
    if (this.syncing) {
      console.log('[SyncManager] Synchronisation déjà en cours');
      return;
    }

    this.syncing = true;
    await this.loadSyncQueue();

    console.log('[SyncManager] Démarrage sync de', this.syncQueue.length, 'opérations');

    const results = {
      success: 0,
      failed: 0,
      total: this.syncQueue.length
    };

    for (const item of [...this.syncQueue]) {
      try {
        await this.syncItem(item);
        results.success++;
        
        // Retirer de la queue
        this.syncQueue = this.syncQueue.filter(q => q.id !== item.id);
      } catch (error) {
        console.error('[SyncManager] Erreur sync item:', error);
        results.failed++;
        
        // Incrémenter les tentatives
        const queueItem = this.syncQueue.find(q => q.id === item.id);
        if (queueItem) {
          queueItem.attempts++;
          queueItem.lastError = error.message;
          
          // Retirer après 3 tentatives
          if (queueItem.attempts >= 3) {
            queueItem.status = 'failed';
            this.syncQueue = this.syncQueue.filter(q => q.id !== item.id);
            console.error('[SyncManager] Opération abandonnée après 3 tentatives:', queueItem);
          }
        }
      }
    }

    await this.saveSyncQueue();
    this.syncing = false;

    console.log('[SyncManager] Synchronisation terminée:', results);
    return results;
  }

  async syncItem(item) {
    const { operation, entityName, data, entityId } = item;

    switch (operation) {
      case 'create':
        return await base44.entities[entityName].create(data);
      
      case 'update':
        if (!entityId) throw new Error('Entity ID required for update');
        return await base44.entities[entityName].update(entityId, data);
      
      case 'delete':
        if (!entityId) throw new Error('Entity ID required for delete');
        return await base44.entities[entityName].delete(entityId);
      
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  async getPendingCount() {
    await this.loadSyncQueue();
    return this.syncQueue.filter(item => item.status === 'pending').length;
  }

  async clearQueue() {
    this.syncQueue = [];
    await this.saveSyncQueue();
    console.log('[SyncManager] Queue vidée');
  }

  getQueueStatus() {
    return {
      total: this.syncQueue.length,
      pending: this.syncQueue.filter(item => item.status === 'pending').length,
      failed: this.syncQueue.filter(item => item.status === 'failed').length,
      syncing: this.syncing
    };
  }
}