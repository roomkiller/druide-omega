/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Offline Storage Manager                                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Gestion du stockage local avec IndexedDB                                  ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export class OfflineStorage {
  constructor() {
    this.db = null;
    this.dbName = 'DruideOmegaOffline';
    this.version = 2;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Store pour les entités cachées
        if (!db.objectStoreNames.contains('entities')) {
          const entitiesStore = db.createObjectStore('entities', { keyPath: 'id', autoIncrement: true });
          entitiesStore.createIndex('entityName', 'entityName', { unique: false });
          entitiesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store pour les conversations
        if (!db.objectStoreNames.contains('conversations')) {
          db.createObjectStore('conversations', { keyPath: 'id' });
        }

        // Store pour les mémoires
        if (!db.objectStoreNames.contains('memories')) {
          db.createObjectStore('memories', { keyPath: 'id' });
        }

        // Store pour les connaissances
        if (!db.objectStoreNames.contains('knowledge')) {
          db.createObjectStore('knowledge', { keyPath: 'id' });
        }

        console.log('[OfflineStorage] Base de données initialisée');
      };
    });
  }

  async cacheEntities(entityName, entities) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['entities'], 'readwrite');
      const store = transaction.objectStore('entities');

      // Supprimer les anciennes entrées de cette entité
      const index = store.index('entityName');
      const request = index.openCursor(IDBKeyRange.only(entityName));

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      // Ajouter les nouvelles entrées
      entities.forEach(entity => {
        store.add({
          entityName,
          data: entity,
          timestamp: Date.now()
        });
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getCachedEntities(entityName) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['entities'], 'readonly');
      const store = transaction.objectStore('entities');
      const index = store.index('entityName');
      const request = index.getAll(entityName);

      request.onsuccess = () => {
        const results = request.result.map(item => item.data);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveConversation(conversation) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readwrite');
      const store = transaction.objectStore('conversations');
      const request = store.put({ ...conversation, _offline: true });

      request.onsuccess = () => resolve(conversation.id);
      request.onerror = () => reject(request.error);
    });
  }

  async getConversation(id) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readonly');
      const store = transaction.objectStore('conversations');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllConversations() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['conversations'], 'readonly');
      const store = transaction.objectStore('conversations');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveMemory(memory) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['memories'], 'readwrite');
      const store = transaction.objectStore('memories');
      const request = store.put({ ...memory, _offline: true });

      request.onsuccess = () => resolve(memory.id);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllMemories() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['memories'], 'readonly');
      const store = transaction.objectStore('memories');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearCache() {
    if (!this.db) await this.init();

    const stores = ['entities', 'conversations', 'memories', 'knowledge'];
    
    for (const storeName of stores) {
      await new Promise((resolve, reject) => {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    console.log('[OfflineStorage] Cache effacé');
  }

  async getStorageUsage() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage,
        quota: estimate.quota,
        usagePercent: ((estimate.usage / estimate.quota) * 100).toFixed(2)
      };
    }
    return null;
  }
}