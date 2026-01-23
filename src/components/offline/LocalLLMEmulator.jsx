/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Local LLM Emulator                                         ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Émulateur LLM pour fonctionnement hors-ligne                              ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export class LocalLLMEmulator {
  constructor() {
    this.patterns = [];
    this.vocabulary = new Map();
    this.conversationHistory = [];
    this.userProfile = null;
    this.ready = false;
    this.db = null;
    this.cleanupTimer = null;
  }

  async init() {
    try {
      // Charger les patterns depuis IndexedDB
      this.db = await this.openDB();
      const patterns = await this.loadPatterns(this.db);
      this.patterns = patterns;
      
      // Charger le profil utilisateur
      this.userProfile = await this.loadUserProfile(this.db);
      
      // Cleanup automatique de l'historique toutes les 5 minutes
      this.cleanupTimer = setInterval(() => {
        this.cleanupHistory();
      }, 5 * 60 * 1000);
      
      this.ready = true;
      console.log('[LocalLLMEmulator] Émulateur initialisé avec', patterns.length, 'patterns');
    } catch (error) {
      console.error('[LocalLLMEmulator] Erreur initialisation:', error);
      this.ready = false;
    }
  }

  cleanupHistory() {
    // Limiter l'historique à 100 entrées pour éviter les fuites mémoire
    if (this.conversationHistory.length > 100) {
      this.conversationHistory = this.conversationHistory.slice(-100);
      console.log('[LocalLLMEmulator] Historique nettoyé');
    }
  }

  cleanup() {
    // Nettoyer le timer
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    // Fermer la DB
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    
    // Vider les données en mémoire
    this.patterns = [];
    this.vocabulary.clear();
    this.conversationHistory = [];
    this.userProfile = null;
    this.ready = false;
    
    console.log('[LocalLLMEmulator] Cleanup effectué');
  }

  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('DruideOmegaOffline', 2);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Créer ou mettre à jour les stores
        if (!db.objectStoreNames.contains('patterns')) {
          db.createObjectStore('patterns', { keyPath: 'id', autoIncrement: true });
        }
        
        if (!db.objectStoreNames.contains('userProfile')) {
          db.createObjectStore('userProfile', { keyPath: 'id' });
        }
      };
      
      request.onblocked = () => {
        console.warn('[LocalLLMEmulator] DB upgrade bloqué, fermeture des autres connexions');
      };
    });
  }

  async loadPatterns(db) {
    return new Promise((resolve, reject) => {
      try {
        if (!db.objectStoreNames.contains('patterns')) {
          resolve([]);
          return;
        }
        const transaction = db.transaction(['patterns'], 'readonly');
        const store = transaction.objectStore('patterns');
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      } catch (error) {
        resolve([]);
      }
    });
  }

  async loadUserProfile(db) {
    return new Promise((resolve, reject) => {
      try {
        if (!db.objectStoreNames.contains('userProfile')) {
          resolve(null);
          return;
        }
        const transaction = db.transaction(['userProfile'], 'readonly');
        const store = transaction.objectStore('userProfile');
        const request = store.get('main');
        
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      } catch (error) {
        resolve(null);
      }
    });
  }

  async invoke(params) {
    // Validation des paramètres
    if (!params || typeof params !== 'object') {
      throw new Error('[LocalLLMEmulator] Paramètres invalides');
    }

    const { prompt, response_json_schema, add_context_from_internet = false } = params;

    // Validation du prompt
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      throw new Error('[LocalLLMEmulator] Prompt invalide ou vide');
    }

    // Détecter la langue du prompt
    const language = this.detectLanguage(prompt);

    // Mode dégradé: pas d'accès internet en offline
    if (add_context_from_internet) {
      const message = this.getLocalizedMessage('offlineNotAvailable', language);
      return this.generateOfflineResponse(message);
    }

    // Analyser le prompt
    const analysis = this.analyzePrompt(prompt);
    
    // Générer une réponse selon le type de requête
    let response;
    if (response_json_schema) {
      response = this.generateStructuredResponse(analysis, response_json_schema);
    } else {
      response = this.generateTextResponse(analysis);
    }

    // Sauvegarder dans l'historique avec limite
    this.conversationHistory.push({ prompt, response, timestamp: Date.now() });
    
    // Limiter immédiatement si trop d'entrées
    if (this.conversationHistory.length > 100) {
      this.conversationHistory.shift();
    }

    return response;
  }

  analyzePrompt(prompt) {
    // Validation
    if (!prompt || typeof prompt !== 'string') {
      return {
        type: 'general',
        intent: ['help'],
        keywords: [],
        sentiment: 'neutral',
        complexity: 'simple'
      };
    }

    const lowerPrompt = prompt.toLowerCase();
    
    // Détection du type de requête
    const analysis = {
      type: 'general',
      intent: [],
      keywords: [],
      sentiment: 'neutral',
      complexity: 'simple'
    };

    // Intentions courantes
    if (lowerPrompt.includes('aide') || lowerPrompt.includes('comment')) {
      analysis.intent.push('help');
    }
    if (lowerPrompt.includes('explique') || lowerPrompt.includes('qu\'est-ce que')) {
      analysis.intent.push('explain');
    }
    if (lowerPrompt.includes('crée') || lowerPrompt.includes('génère')) {
      analysis.intent.push('create');
    }
    if (lowerPrompt.includes('analyse') || lowerPrompt.includes('évalue')) {
      analysis.intent.push('analyze');
    }

    // Types spécialisés
    if (lowerPrompt.includes('code') || lowerPrompt.includes('fonction')) {
      analysis.type = 'code';
    } else if (lowerPrompt.includes('mathématique') || lowerPrompt.includes('calcul')) {
      analysis.type = 'math';
    } else if (lowerPrompt.includes('créatif') || lowerPrompt.includes('poème')) {
      analysis.type = 'creative';
    }

    // Extraire les mots-clés
    analysis.keywords = prompt
      .split(/\s+/)
      .filter(word => word.length > 4)
      .slice(0, 10);

    return analysis;
  }

  detectLanguage(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    if (/\b(the|is|are|you|can|help)\b/.test(lowerPrompt)) return 'en';
    if (/\b(el|la|los|las|ayuda|puedes)\b/.test(lowerPrompt)) return 'es';
    if (/\b(der|die|das|hilfe|können)\b/.test(lowerPrompt)) return 'de';
    if (/[\u4e00-\u9fa5]/.test(prompt)) return 'zh';
    return 'fr';
  }

  getLocalizedMessage(key, lang = 'fr') {
    const messages = {
      offlineNotAvailable: {
        fr: "⚠️ Mode hors-ligne: Recherche internet non disponible. Réponse basée sur les connaissances locales.",
        en: "⚠️ Offline mode: Internet search unavailable. Response based on local knowledge.",
        es: "⚠️ Modo sin conexión: Búsqueda en internet no disponible. Respuesta basada en conocimientos locales.",
        de: "⚠️ Offline-Modus: Internetsuche nicht verfügbar. Antwort basiert auf lokalem Wissen.",
        zh: "⚠️ 离线模式：互联网搜索不可用。基于本地知识的响应。"
      },
      offlineActivated: {
        fr: "🔌 Mode hors-ligne activé.\n\nJe peux vous aider avec des fonctionnalités de base en attendant le retour de la connexion:\n• Consulter vos données locales\n• Créer des notes (synchronisées plus tard)\n• Réponses simples basées sur mes connaissances pré-chargées\n\nPour des analyses complexes ou recherches internet, veuillez vous reconnecter.",
        en: "🔌 Offline mode activated.\n\nI can help you with basic features while waiting for connection:\n• View your local data\n• Create notes (synced later)\n• Simple responses based on pre-loaded knowledge\n\nFor complex analyses or internet searches, please reconnect.",
        es: "🔌 Modo sin conexión activado.\n\nPuedo ayudarte con funciones básicas mientras esperas la conexión:\n• Ver tus datos locales\n• Crear notas (sincronizadas después)\n• Respuestas simples basadas en conocimientos precargados\n\nPara análisis complejos o búsquedas en internet, vuelve a conectarte.",
        de: "🔌 Offline-Modus aktiviert.\n\nIch kann Ihnen mit grundlegenden Funktionen helfen:\n• Lokale Daten anzeigen\n• Notizen erstellen (später synchronisiert)\n• Einfache Antworten basierend auf vorgeladenem Wissen\n\nFür komplexe Analysen oder Internetsuchen bitte erneut verbinden.",
        zh: "🔌 离线模式已激活。\n\n我可以帮助您使用基本功能：\n• 查看本地数据\n• 创建笔记（稍后同步）\n• 基于预加载知识的简单响应\n\n对于复杂分析或互联网搜索，请重新连接。"
      },
      offlineTip: {
        fr: "\n\n💡 *Astuce*: Toutes vos actions sont sauvegardées localement et seront synchronisées automatiquement à la reconnexion.",
        en: "\n\n💡 *Tip*: All your actions are saved locally and will be automatically synced upon reconnection.",
        es: "\n\n💡 *Consejo*: Todas tus acciones se guardan localmente y se sincronizarán automáticamente al reconectarte.",
        de: "\n\n💡 *Tipp*: Alle Ihre Aktionen werden lokal gespeichert und bei Wiederverbindung automatisch synchronisiert.",
        zh: "\n\n💡 *提示*：您的所有操作都已本地保存，重新连接后将自动同步。"
      }
    };
    
    return messages[key]?.[lang] || messages[key]?.['fr'] || '';
  }

  generateTextResponse(analysis) {
    const language = this.detectLanguage(analysis.keywords.join(' '));
    
    // Réponses par défaut selon le type
    const responses = {
      help: this.getLocalizedMessage('offlineActivated', language),
      
      explain: language === 'en'
        ? `📚 Explanation (offline mode):\n\nI understand you're looking for an explanation about "${analysis.keywords.slice(0, 2).join(' ')}". In offline mode, my capabilities are limited.\n\nI can provide general information stored locally. For in-depth and updated analysis, connection will be necessary.`
        : `📚 Explication (mode hors-ligne):\n\nJe comprends que vous cherchez une explication sur "${analysis.keywords.slice(0, 2).join(' ')}". En mode hors-ligne, mes capacités sont limitées.\n\nJe peux vous fournir des informations générales stockées localement. Pour une analyse approfondie et actualisée, la connexion sera nécessaire.`,
      
      create: language === 'en'
        ? "✏️ Offline creation mode:\n\nI'm noting your creation request. It will be processed with all my capabilities once connection is restored.\n\nMeanwhile, I can help you structure your ideas or create simple drafts."
        : "✏️ Mode création hors-ligne:\n\nJe note votre demande de création. Elle sera traitée avec toutes mes capacités dès le retour de la connexion.\n\nEn attendant, je peux vous aider à structurer vos idées ou créer des brouillons simples.",
      
      analyze: language === 'en'
        ? "🔍 Limited analysis (offline):\n\nIn offline mode, my analysis capabilities are reduced. I can perform basic analyses, but for in-depth analysis including external data, connection is required.\n\nYour analysis data will be saved locally."
        : "🔍 Analyse limitée (hors-ligne):\n\nEn mode hors-ligne, mes capacités d'analyse sont réduites. Je peux effectuer des analyses basiques, mais pour une analyse approfondie incluant des données externes, la connexion est requise.\n\nVos données d'analyse seront sauvegardées localement."
    };

    // Sélectionner la réponse selon l'intention principale
    const primaryIntent = analysis.intent[0] || 'help';
    let response = responses[primaryIntent] || responses.help;

    // Personnaliser avec le profil utilisateur si disponible
    if (this.userProfile?.name) {
      response = `Bonjour ${this.userProfile.name},\n\n` + response;
    }

    // Ajouter un footer informatif
    response += this.getLocalizedMessage('offlineTip', language);

    return response;
  }

  generateStructuredResponse(analysis, schema) {
    // Validation du schéma
    if (!schema || typeof schema !== 'object') {
      return this.generateOfflineResponse('Schéma de réponse invalide en mode offline');
    }

    // Générer une réponse JSON selon le schéma
    const response = {};

    if (schema.properties && typeof schema.properties === 'object') {
      for (const [key, prop] of Object.entries(schema.properties)) {
        if (prop.type === 'string') {
          response[key] = `[Offline] ${key} généré en mode hors-ligne`;
        } else if (prop.type === 'number') {
          response[key] = 0;
        } else if (prop.type === 'boolean') {
          response[key] = false;
        } else if (prop.type === 'array') {
          response[key] = [];
        } else if (prop.type === 'object') {
          response[key] = {};
        }
      }
    }

    // Ajouter un flag offline
    response._offline_mode = true;
    response._timestamp = new Date().toISOString();
    response._message = "Réponse générée en mode hors-ligne avec capacités limitées";

    return response;
  }

  generateOfflineResponse(message) {
    return {
      _offline_mode: true,
      _timestamp: new Date().toISOString(),
      message,
      response: message
    };
  }

  // Méthode pour apprendre de nouvelles patterns (appelée quand online)
  async learnPattern(prompt, response, metadata = {}) {
    // Validation
    if (!prompt || !response || typeof prompt !== 'string' || typeof response !== 'string') {
      console.warn('[LocalLLMEmulator] Pattern invalide ignoré');
      return;
    }

    try {
      const db = this.db || await this.openDB();
      
      // Vérifier si pattern similaire existe
      const existingPatterns = await this.loadPatterns(db);
      const similarity = existingPatterns.find(p => 
        this._calculateSimilarity(p.prompt || '', prompt) > 0.8
      );

      const transaction = db.transaction(['patterns'], 'readwrite');
      const store = transaction.objectStore('patterns');
      
      const pattern = {
        prompt: prompt.slice(0, 200),
        response: response.slice(0, 500),
        timestamp: Date.now(),
        frequency: similarity ? (similarity.frequency || 1) + 1 : 1,
        metadata: {
          domain: metadata.domain,
          confidence: metadata.confidence,
          success_rate: metadata.success_rate || 1.0
        }
      };

      if (similarity) {
        // Mettre à jour pattern existant
        await store.put({ ...similarity, ...pattern, id: similarity.id });
      } else {
        // Ajouter nouveau pattern
        await store.add(pattern);
      }
      
      // Limiter le cache en mémoire
      this.patterns.push(pattern);
      if (this.patterns.length > 1000) {
        // Garder les patterns les plus utilisés
        this.patterns = this.patterns
          .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
          .slice(0, 1000);
      }
      
      console.log('[LocalLLMEmulator] Pattern appris (similarité:', !!similarity, ')');
    } catch (error) {
      console.error('[LocalLLMEmulator] Erreur apprentissage:', error);
    }
  }

  // Calcule la similarité entre deux prompts
  _calculateSimilarity(prompt1, prompt2) {
    if (!prompt1 || !prompt2) return 0;
    const words1 = new Set(prompt1.toLowerCase().split(/\s+/));
    const words2 = new Set(prompt2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  // Sauvegarder le profil utilisateur
  async saveUserProfile(profile) {
    // Validation
    if (!profile || typeof profile !== 'object') {
      console.warn('[LocalLLMEmulator] Profil invalide ignoré');
      return;
    }

    try {
      const db = this.db || await this.openDB();
      const transaction = db.transaction(['userProfile'], 'readwrite');
      const store = transaction.objectStore('userProfile');
      
      await store.put({ id: 'main', ...profile });
      this.userProfile = profile;
      
      console.log('[LocalLLMEmulator] Profil utilisateur sauvegardé');
    } catch (error) {
      console.error('[LocalLLMEmulator] Erreur sauvegarde profil:', error);
    }
  }

  getStats() {
    return {
      ready: this.ready,
      patternsCount: this.patterns.length,
      conversationHistoryLength: this.conversationHistory.length,
      hasUserProfile: !!this.userProfile
    };
  }
}