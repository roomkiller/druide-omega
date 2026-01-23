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
    this.maxQueueSize = 500;
    this.retryDelays = [1000, 5000, 15000]; // ms
  }

  cleanup() {
    this.syncQueue = [];
    this.syncing = false;
  }

  async queueOperation(operation, entityName, data, id = null) {
    // Validation
    if (!operation || !entityName || !data) {
      console.error('[SyncManager] Paramètres invalides pour queue');
      return;
    }

    // Limiter taille queue
    if (this.syncQueue.length >= this.maxQueueSize) {
      console.warn('[SyncManager] Queue saturée, suppression anciennes opérations');
      this.syncQueue = this.syncQueue.slice(-this.maxQueueSize + 1);
    }

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
      const queueData = JSON.stringify(this.syncQueue);
      
      // Vérifier taille avant sauvegarde
      if (queueData.length > 4000000) { // 4MB
        console.warn('[SyncManager] Queue trop volumineuse, nettoyage');
        // Garder uniquement les 100 plus récentes
        this.syncQueue = this.syncQueue.slice(-100);
      }
      
      localStorage.setItem('druide_sync_queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('[SyncManager] Quota localStorage dépassé');
        // Garder uniquement 50 dernières
        this.syncQueue = this.syncQueue.slice(-50);
        try {
          localStorage.setItem('druide_sync_queue', JSON.stringify(this.syncQueue));
        } catch (e) {
          console.error('[SyncManager] Impossible de sauvegarder même après nettoyage');
        }
      } else {
        console.error('[SyncManager] Erreur sauvegarde queue:', error);
      }
    }
  }

  async loadSyncQueue() {
    try {
      const saved = localStorage.getItem('druide_sync_queue');
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Validation et nettoyage
        if (Array.isArray(parsed)) {
          // Filtrer opérations trop anciennes (>7 jours)
          const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          this.syncQueue = parsed.filter(item => 
            item && 
            item.timestamp && 
            item.timestamp > weekAgo &&
            item.operation &&
            item.entityName
          );
          
          if (this.syncQueue.length !== parsed.length) {
            console.log(`[SyncManager] Nettoyé ${parsed.length - this.syncQueue.length} opérations obsolètes`);
            await this.saveSyncQueue();
          }
        } else {
          this.syncQueue = [];
        }
      }
    } catch (error) {
      console.error('[SyncManager] Erreur chargement queue:', error);
      this.syncQueue = [];
      localStorage.removeItem('druide_sync_queue');
    }
  }

  async syncAll() {
    if (this.syncing) {
      console.log('[SyncManager] Synchronisation déjà en cours');
      return { success: 0, failed: 0, total: 0, skipped: true };
    }

    // Vérifier connectivité
    if (!navigator.onLine) {
      console.log('[SyncManager] Hors ligne, sync annulée');
      return { success: 0, failed: 0, total: 0, offline: true };
    }

    this.syncing = true;
    await this.loadSyncQueue();

    console.log('[SyncManager] Démarrage sync de', this.syncQueue.length, 'opérations');

    const results = {
      success: 0,
      failed: 0,
      total: this.syncQueue.length
    };

    // Copie pour itération sécurisée
    const itemsToSync = [...this.syncQueue].filter(item => item.status === 'pending');

    for (const item of itemsToSync) {
      try {
        // Délai entre tentatives
        if (item.attempts > 0) {
          const delay = this.retryDelays[Math.min(item.attempts - 1, this.retryDelays.length - 1)];
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        await this.syncItem(item);
        results.success++;
        
        // Retirer de la queue
        this.syncQueue = this.syncQueue.filter(q => q.id !== item.id);
        
        // Sauvegarder après chaque succès (batch de 10)
        if (results.success % 10 === 0) {
          await this.saveSyncQueue();
        }
      } catch (error) {
        console.error('[SyncManager] Erreur sync item:', error);
        results.failed++;
        
        // Incrémenter les tentatives
        const queueItem = this.syncQueue.find(q => q.id === item.id);
        if (queueItem) {
          queueItem.attempts++;
          queueItem.lastError = error.message;
          queueItem.lastAttempt = Date.now();
          
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

    // Validation
    if (!entityName || !base44.entities[entityName]) {
      throw new Error(`Entity invalide: ${entityName}`);
    }

    switch (operation) {
      case 'create':
        if (!data || typeof data !== 'object') {
          throw new Error('Données invalides pour create');
        }
        return await base44.entities[entityName].create(data);
      
      case 'update':
        if (!entityId) throw new Error('Entity ID required for update');
        if (!data || typeof data !== 'object') {
          throw new Error('Données invalides pour update');
        }
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