import { base44 } from "@/api/base44Client";

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Memory Consolidation Engine                                ║
 * ║ Fusion automatique conversations → mémoires → connaissances               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

class MemoryConsolidationEngine {
  /**
   * Consolide automatiquement les conversations récentes en mémoires
   */
  static async consolidateConversationsToMemories() {
    const conversations = await base44.entities.Conversation.list('-created_date', 50);
    const existingMemories = await base44.entities.Memory.list();
    
    const consolidationResults = [];

    for (const conversation of conversations.slice(0, 10)) {
      if (!conversation.messages || conversation.messages.length < 3) continue;

      const analysis = await this.analyzeConversationForMemory(conversation, existingMemories);
      
      if (analysis.should_create_memory) {
        const newMemory = await base44.entities.Memory.create({
          type: "interaction",
          content: analysis.memory_content,
          context: `Consolidé de conversation: ${conversation.title}`,
          importance: analysis.importance,
          modality: "chat",
          tags: analysis.tags,
          linked_memory_ids: analysis.related_memory_ids,
          cross_modal_references: [{
            modality: "conversation",
            reference: conversation.id,
            timestamp: conversation.created_date
          }],
          access_count: 0,
          access_modalities: { chat: 1, voice: 0, visual: 0 }
        });

        consolidationResults.push({
          type: 'memory_created',
          source: conversation.id,
          memory: newMemory
        });
      }
    }

    return consolidationResults;
  }

  /**
   * Consolide les mémoires en connaissances structurées
   */
  static async consolidateMemoriesToKnowledge() {
    const memories = await base44.entities.Memory.list('-importance', 100);
    const knowledgeBases = await base44.entities.KnowledgeBase.list();
    
    const consolidationResults = [];
    const memoryGroups = await this.groupSimilarMemories(memories);

    for (const group of memoryGroups) {
      if (group.memories.length < 3) continue;

      const synthesis = await this.synthesizeMemoryGroup(group, knowledgeBases);
      
      if (synthesis.should_create_knowledge) {
        const newKnowledge = await base44.entities.KnowledgeBase.create({
          title: synthesis.title,
          content: synthesis.content,
          source: "memory_consolidation",
          category: synthesis.category,
          tags: synthesis.tags,
          importance: synthesis.importance,
          active: true,
          verified: false,
          cross_modal_links: group.memories.map(m => ({
            type: "memory",
            id: m.id,
            summary: m.content.slice(0, 100)
          }))
        });

        consolidationResults.push({
          type: 'knowledge_created',
          sources: group.memories.map(m => m.id),
          knowledge: newKnowledge
        });
      }
    }

    return consolidationResults;
  }

  /**
   * Détecte les contradictions entre différentes sources
   */
  static async detectContradictions() {
    const memories = await base44.entities.Memory.list();
    const knowledgeBases = await base44.entities.KnowledgeBase.list();
    
    const contradictions = [];

    // Comparer mémoires entre elles
    for (let i = 0; i < memories.length; i++) {
      for (let j = i + 1; j < memories.length; j++) {
        const contradiction = await this.checkContradiction(
          memories[i].content,
          memories[j].content,
          'memory',
          memories[i].id,
          memories[j].id
        );
        
        if (contradiction.is_contradiction) {
          contradictions.push({
            type: 'memory-memory',
            source1: memories[i],
            source2: memories[j],
            contradiction: contradiction.details,
            severity: contradiction.severity
          });
        }
      }
    }

    // Comparer connaissances avec mémoires
    for (const kb of knowledgeBases) {
      for (const memory of memories) {
        const contradiction = await this.checkContradiction(
          kb.content,
          memory.content,
          'knowledge-memory',
          kb.id,
          memory.id
        );
        
        if (contradiction.is_contradiction) {
          contradictions.push({
            type: 'knowledge-memory',
            source1: kb,
            source2: memory,
            contradiction: contradiction.details,
            severity: contradiction.severity
          });
        }
      }
    }

    return contradictions;
  }

  /**
   * Résout automatiquement les contradictions
   */
  static async resolveContradictions(contradictions) {
    const resolutions = [];

    for (const contradiction of contradictions) {
      const resolution = await this.analyzeContradictionResolution(contradiction);
      
      if (resolution.action === 'merge') {
        // Fusionner les deux sources
        const merged = await this.mergeSources(contradiction.source1, contradiction.source2);
        resolutions.push({ ...contradiction, resolution: 'merged', result: merged });
      } else if (resolution.action === 'update') {
        // Mettre à jour la source moins fiable
        const updated = await this.updateSource(resolution.target, resolution.updated_content);
        resolutions.push({ ...contradiction, resolution: 'updated', result: updated });
      } else if (resolution.action === 'flag') {
        // Marquer pour révision humaine
        resolutions.push({ ...contradiction, resolution: 'flagged_for_review', reason: resolution.reason });
      }
    }

    return resolutions;
  }

  /**
   * Analyse une conversation pour extraction de mémoire
   */
  static async analyzeConversationForMemory(conversation, existingMemories) {
    const conversationText = conversation.messages
      .map(m => `${m.role}: ${m.content}`)
      .join('\n');

    const prompt = `Analyse cette conversation et détermine si elle contient des informations importantes à mémoriser:

${conversationText.slice(0, 2000)}

Mémoires existantes (pour éviter duplicatas):
${existingMemories.slice(0, 5).map(m => m.content.slice(0, 100)).join('\n')}

JSON:
{
  "should_create_memory": boolean,
  "memory_content": "contenu synthétique de la mémoire",
  "importance": 1-10,
  "tags": ["tag1", "tag2"],
  "related_memory_ids": ["id1", "id2"],
  "reasoning": "pourquoi créer cette mémoire"
}`;

    return await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          should_create_memory: { type: "boolean" },
          memory_content: { type: "string" },
          importance: { type: "number" },
          tags: { type: "array", items: { type: "string" } },
          related_memory_ids: { type: "array", items: { type: "string" } },
          reasoning: { type: "string" }
        }
      }
    });
  }

  /**
   * Regroupe les mémoires similaires
   */
  static async groupSimilarMemories(memories) {
    const groups = [];
    const processed = new Set();

    for (const memory of memories) {
      if (processed.has(memory.id)) continue;

      const similarMemories = [memory];
      processed.add(memory.id);

      for (const otherMemory of memories) {
        if (processed.has(otherMemory.id)) continue;

        const similarity = await this.calculateSimilarity(memory, otherMemory);
        if (similarity > 0.7) {
          similarMemories.push(otherMemory);
          processed.add(otherMemory.id);
        }
      }

      if (similarMemories.length >= 2) {
        groups.push({
          theme: memory.tags?.[0] || 'general',
          memories: similarMemories
        });
      }
    }

    return groups;
  }

  /**
   * Calcule la similarité entre deux mémoires
   */
  static async calculateSimilarity(memory1, memory2) {
    // Similarité basée sur tags
    const tags1 = new Set(memory1.tags || []);
    const tags2 = new Set(memory2.tags || []);
    const tagIntersection = [...tags1].filter(t => tags2.has(t)).length;
    const tagUnion = new Set([...tags1, ...tags2]).size;
    const tagSimilarity = tagUnion > 0 ? tagIntersection / tagUnion : 0;

    // Similarité basée sur contenu (simple pour l'instant)
    const words1 = new Set(memory1.content.toLowerCase().split(/\s+/));
    const words2 = new Set(memory2.content.toLowerCase().split(/\s+/));
    const wordIntersection = [...words1].filter(w => words2.has(w)).length;
    const wordUnion = new Set([...words1, ...words2]).size;
    const contentSimilarity = wordUnion > 0 ? wordIntersection / wordUnion : 0;

    return (tagSimilarity * 0.6 + contentSimilarity * 0.4);
  }

  /**
   * Synthétise un groupe de mémoires en connaissance
   */
  static async synthesizeMemoryGroup(group, existingKnowledge) {
    const memoryContents = group.memories.map(m => m.content).join('\n\n');
    
    const prompt = `Synthétise ces mémoires en une connaissance structurée:

${memoryContents.slice(0, 3000)}

Connaissances existantes (éviter duplicatas):
${existingKnowledge.slice(0, 3).map(k => k.title).join(', ')}

JSON:
{
  "should_create_knowledge": boolean,
  "title": "titre de la connaissance",
  "content": "contenu synthétique et structuré",
  "category": "catégorie",
  "tags": ["tag1", "tag2"],
  "importance": 1-10,
  "reasoning": "pourquoi créer cette connaissance"
}`;

    return await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          should_create_knowledge: { type: "boolean" },
          title: { type: "string" },
          content: { type: "string" },
          category: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          importance: { type: "number" },
          reasoning: { type: "string" }
        }
      }
    });
  }

  /**
   * Vérifie la contradiction entre deux contenus
   */
  static async checkContradiction(content1, content2, type, id1, id2) {
    const prompt = `Analyse ces deux contenus pour détecter des contradictions:

CONTENU 1:
${content1.slice(0, 1000)}

CONTENU 2:
${content2.slice(0, 1000)}

JSON:
{
  "is_contradiction": boolean,
  "severity": "low"|"medium"|"high",
  "details": "description de la contradiction",
  "confidence": 0-100
}`;

    return await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          is_contradiction: { type: "boolean" },
          severity: { type: "string" },
          details: { type: "string" },
          confidence: { type: "number" }
        }
      }
    });
  }

  /**
   * Analyse comment résoudre une contradiction
   */
  static async analyzeContradictionResolution(contradiction) {
    const prompt = `Analyse cette contradiction et propose une résolution:

TYPE: ${contradiction.type}
SOURCE 1: ${JSON.stringify(contradiction.source1).slice(0, 500)}
SOURCE 2: ${JSON.stringify(contradiction.source2).slice(0, 500)}
CONTRADICTION: ${contradiction.contradiction.details}

JSON:
{
  "action": "merge"|"update"|"flag",
  "target": "source1"|"source2"|"both",
  "updated_content": "nouveau contenu si update",
  "reason": "justification de l'action"
}`;

    return await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          action: { type: "string" },
          target: { type: "string" },
          updated_content: { type: "string" },
          reason: { type: "string" }
        }
      }
    });
  }

  /**
   * Fusionne deux sources
   */
  static async mergeSources(source1, source2) {
    const prompt = `Fusionne ces deux sources en une seule, en résolvant les contradictions:

SOURCE 1: ${JSON.stringify(source1).slice(0, 1000)}
SOURCE 2: ${JSON.stringify(source2).slice(0, 1000)}

Crée un contenu fusionné qui intègre le meilleur des deux.`;

    const mergedContent = await base44.integrations.Core.InvokeLLM({ prompt });
    
    // Créer une nouvelle mémoire ou connaissance fusionnée
    return {
      merged: true,
      content: mergedContent,
      sources: [source1.id, source2.id]
    };
  }

  /**
   * Met à jour une source avec du nouveau contenu
   */
  static async updateSource(target, updatedContent) {
    // Cette fonction serait implémentée selon le type de source
    return {
      updated: true,
      target,
      new_content: updatedContent
    };
  }

  /**
   * Processus complet de consolidation
   */
  static async runFullConsolidation() {
    const results = {
      conversations_to_memories: [],
      memories_to_knowledge: [],
      contradictions_detected: [],
      contradictions_resolved: []
    };

    // Étape 1: Conversations → Mémoires
    results.conversations_to_memories = await this.consolidateConversationsToMemories();

    // Étape 2: Mémoires → Connaissances
    results.memories_to_knowledge = await this.consolidateMemoriesToKnowledge();

    // Étape 3: Détection contradictions
    results.contradictions_detected = await this.detectContradictions();

    // Étape 4: Résolution contradictions
    if (results.contradictions_detected.length > 0) {
      results.contradictions_resolved = await this.resolveContradictions(
        results.contradictions_detected.slice(0, 5)
      );
    }

    return results;
  }
}

export default MemoryConsolidationEngine;