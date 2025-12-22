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
  }

  async init() {
    try {
      // Charger les patterns depuis IndexedDB
      const db = await this.openDB();
      const patterns = await this.loadPatterns(db);
      this.patterns = patterns;
      
      // Charger le profil utilisateur
      this.userProfile = await this.loadUserProfile(db);
      
      this.ready = true;
      console.log('[LocalLLMEmulator] Émulateur initialisé avec', patterns.length, 'patterns');
    } catch (error) {
      console.error('[LocalLLMEmulator] Erreur initialisation:', error);
      this.ready = false;
    }
  }

  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('DruideOmegaOffline', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('patterns')) {
          db.createObjectStore('patterns', { keyPath: 'id', autoIncrement: true });
        }
        
        if (!db.objectStoreNames.contains('userProfile')) {
          db.createObjectStore('userProfile', { keyPath: 'id' });
        }
      };
    });
  }

  async loadPatterns(db) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['patterns'], 'readonly');
      const store = transaction.objectStore('patterns');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async loadUserProfile(db) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['userProfile'], 'readonly');
      const store = transaction.objectStore('userProfile');
      const request = store.get('main');
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async invoke(params) {
    const { prompt, response_json_schema, add_context_from_internet = false } = params;

    // Mode dégradé: pas d'accès internet en offline
    if (add_context_from_internet) {
      return this.generateOfflineResponse(
        "⚠️ Mode hors-ligne: Recherche internet non disponible. Réponse basée sur les connaissances locales."
      );
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

    // Sauvegarder dans l'historique
    this.conversationHistory.push({ prompt, response, timestamp: Date.now() });

    return response;
  }

  analyzePrompt(prompt) {
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

  generateTextResponse(analysis) {
    // Réponses par défaut selon le type
    const responses = {
      help: "🔌 Mode hors-ligne activé.\n\nJe peux vous aider avec des fonctionnalités de base en attendant le retour de la connexion:\n• Consulter vos données locales\n• Créer des notes (synchronisées plus tard)\n• Réponses simples basées sur mes connaissances pré-chargées\n\nPour des analyses complexes ou recherches internet, veuillez vous reconnecter.",
      
      explain: `📚 Explication (mode hors-ligne):\n\nJe comprends que vous cherchez une explication sur "${analysis.keywords.slice(0, 2).join(' ')}". En mode hors-ligne, mes capacités sont limitées.\n\nJe peux vous fournir des informations générales stockées localement. Pour une analyse approfondie et actualisée, la connexion sera nécessaire.`,
      
      create: "✏️ Mode création hors-ligne:\n\nJe note votre demande de création. Elle sera traitée avec toutes mes capacités dès le retour de la connexion.\n\nEn attendant, je peux vous aider à structurer vos idées ou créer des brouillons simples.",
      
      analyze: "🔍 Analyse limitée (hors-ligne):\n\nEn mode hors-ligne, mes capacités d'analyse sont réduites. Je peux effectuer des analyses basiques, mais pour une analyse approfondie incluant des données externes, la connexion est requise.\n\nVos données d'analyse seront sauvegardées localement."
    };

    // Sélectionner la réponse selon l'intention principale
    const primaryIntent = analysis.intent[0] || 'help';
    let response = responses[primaryIntent] || responses.help;

    // Personnaliser avec le profil utilisateur si disponible
    if (this.userProfile?.name) {
      response = `Bonjour ${this.userProfile.name},\n\n` + response;
    }

    // Ajouter un footer informatif
    response += "\n\n💡 *Astuce*: Toutes vos actions sont sauvegardées localement et seront synchronisées automatiquement à la reconnexion.";

    return response;
  }

  generateStructuredResponse(analysis, schema) {
    // Générer une réponse JSON selon le schéma
    const response = {};

    if (schema.properties) {
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
  async learnPattern(prompt, response) {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(['patterns'], 'readwrite');
      const store = transaction.objectStore('patterns');
      
      await store.add({
        prompt: prompt.slice(0, 200),
        response: response.slice(0, 500),
        timestamp: Date.now(),
        frequency: 1
      });
      
      console.log('[LocalLLMEmulator] Pattern appris');
    } catch (error) {
      console.error('[LocalLLMEmulator] Erreur apprentissage:', error);
    }
  }

  // Sauvegarder le profil utilisateur
  async saveUserProfile(profile) {
    try {
      const db = await this.openDB();
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