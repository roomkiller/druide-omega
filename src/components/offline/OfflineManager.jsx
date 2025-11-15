/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Offline Mode Manager                                       ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect } from "react";

const DB_NAME = "druide_omega_offline";
const DB_VERSION = 1;

export class OfflineManager {
  constructor() {
    this.db = null;
    this.isOnline = navigator.onLine;
    this.pendingChanges = [];
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("memories")) {
          db.createObjectStore("memories", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("knowledge_bases")) {
          db.createObjectStore("knowledge_bases", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("pending_changes")) {
          db.createObjectStore("pending_changes", { keyPath: "id", autoIncrement: true });
        }
      };
    });
  }

  async saveMemory(memory) {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["memories"], "readwrite");
      const store = transaction.objectStore("memories");
      
      const request = store.put({
        ...memory,
        offline_modified: true,
        last_modified: Date.now()
      });

      request.onsuccess = () => {
        this.trackChange("memory", "update", memory.id);
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getMemories() {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["memories"], "readonly");
      const store = transaction.objectStore("memories");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveKnowledgeBase(kb) {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["knowledge_bases"], "readwrite");
      const store = transaction.objectStore("knowledge_bases");
      
      const request = store.put({
        ...kb,
        offline_modified: true,
        last_modified: Date.now()
      });

      request.onsuccess = () => {
        this.trackChange("knowledge_base", "update", kb.id);
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getKnowledgeBases() {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["knowledge_bases"], "readonly");
      const store = transaction.objectStore("knowledge_bases");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async trackChange(entityType, operation, entityId) {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["pending_changes"], "readwrite");
      const store = transaction.objectStore("pending_changes");
      
      const request = store.add({
        entity_type: entityType,
        operation,
        entity_id: entityId,
        timestamp: Date.now()
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingChanges() {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["pending_changes"], "readonly");
      const store = transaction.objectStore("pending_changes");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearPendingChanges() {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["pending_changes"], "readwrite");
      const store = transaction.objectStore("pending_changes");
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async syncToServer(base44) {
    const pendingChanges = await this.getPendingChanges();
    
    if (pendingChanges.length === 0) {
      return { synced: 0, conflicts: [] };
    }

    const conflicts = [];
    let syncedCount = 0;

    for (const change of pendingChanges) {
      try {
        if (change.entity_type === "memory") {
          const offlineData = await this.getMemoryById(change.entity_id);
          const serverData = await base44.entities.Memory.filter({ id: change.entity_id });

          if (serverData.length > 0) {
            const conflict = this.detectConflict(offlineData, serverData[0]);
            if (conflict) {
              conflicts.push({ ...conflict, entity_type: "memory", entity_id: change.entity_id });
            } else {
              await base44.entities.Memory.update(change.entity_id, offlineData);
              syncedCount++;
            }
          }
        } else if (change.entity_type === "knowledge_base") {
          const offlineData = await this.getKnowledgeBaseById(change.entity_id);
          const serverData = await base44.entities.KnowledgeBase.filter({ id: change.entity_id });

          if (serverData.length > 0) {
            const conflict = this.detectConflict(offlineData, serverData[0]);
            if (conflict) {
              conflicts.push({ ...conflict, entity_type: "knowledge_base", entity_id: change.entity_id });
            } else {
              await base44.entities.KnowledgeBase.update(change.entity_id, offlineData);
              syncedCount++;
            }
          }
        }
      } catch (error) {
        console.error("Erreur sync:", error);
      }
    }

    if (conflicts.length === 0) {
      await this.clearPendingChanges();
    }

    return { synced: syncedCount, conflicts };
  }

  detectConflict(offlineData, serverData) {
    const offlineModified = offlineData.last_modified || 0;
    const serverModified = new Date(serverData.updated_date).getTime();

    if (serverModified > offlineModified) {
      return {
        offline_version: offlineData,
        server_version: serverData,
        conflict_type: "concurrent_modification"
      };
    }

    return null;
  }

  async getMemoryById(id) {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["memories"], "readonly");
      const store = transaction.objectStore("memories");
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getKnowledgeBaseById(id) {
    if (!this.db) await this.initialize();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["knowledge_bases"], "readonly");
      const store = transaction.objectStore("knowledge_bases");
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineManager = new OfflineManager();

export function useOfflineMode() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingChanges, setPendingChanges] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const updatePendingCount = async () => {
      const changes = await offlineManager.getPendingChanges();
      setPendingChanges(changes.length);
    };

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 5000);

    return () => clearInterval(interval);
  }, []);

  return { isOnline, pendingChanges };
}