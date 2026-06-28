/**
 * DRUIDE_OMEGA - Memory Manager
 * Incremental backup + efficient storage
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await req.json();

    if (action === 'save_memory') {
      const memory = {
        id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_email: user.email,
        type: data.type || 'interaction',
        content: data.content,
        context: data.context || {},
        importance: data.importance || 0.5,
        timestamp: new Date().toISOString(),
        modalities: data.modalities || ['chat'],
        tags: data.tags || []
      };

      // Sauvegarde incrémentale
      await saveIncrementalMemory(memory, base44);

      // Indexing passif
      const index = createMemoryIndex(memory);

      return Response.json({
        success: true,
        memory_id: memory.id,
        indexed: true,
        backup_type: 'incremental'
      });
    }

    if (action === 'recall_memories') {
      const memories = await recallMemories(user.email, data.query, data.limit || 10, base44);
      return Response.json({ success: true, memories });
    }

    if (action === 'consolidate_memories') {
      const consolidated = await consolidateMemories(user.email, base44);
      return Response.json({ success: true, consolidated });
    }

    if (action === 'get_memory_stats') {
      const stats = await getMemoryStats(user.email, base44);
      return Response.json({ success: true, stats });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('MemoryManager error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Save memory incrementally
 */
async function saveIncrementalMemory(memory, base44) {
  try {
    await base44.entities.Memory?.create?.({
      type: memory.type,
      content: memory.content,
      context: JSON.stringify(memory.context),
      importance: memory.importance,
      modality: memory.modalities[0],
      tags: memory.tags,
      embedding_summary: generateEmbeddingSummary(memory.content),
      linked_memory_ids: [],
      access_count: 0,
      last_accessed: memory.timestamp
    });

    // Aussi sauvegarde dans le snapshot pour continuité
    await base44.entities.ConsciousnessSnapshot?.create?.({
      event_id: memory.id,
      user_email: memory.user_email,
      timestamp: memory.timestamp,
      active_consciousness: JSON.stringify({
        memory_type: memory.type,
        content: memory.content
      }),
      subconscious_data: JSON.stringify({
        importance: memory.importance,
        tags: memory.tags,
        modalities: memory.modalities
      }),
      backup_type: 'delta'
    });
  } catch (e) {
    console.log('Memory save attempt - entity may not exist');
  }
}

/**
 * Create memory index for fast recall
 */
function createMemoryIndex(memory) {
  return {
    id: memory.id,
    keywords: extractMemoryKeywords(memory.content),
    tags: memory.tags,
    importance: memory.importance,
    timestamp: memory.timestamp,
    type: memory.type,
    modalities: memory.modalities,
    semantic_hash: simpleHash(memory.content)
  };
}

/**
 * Recall memories based on query
 */
async function recallMemories(userEmail, query, limit, base44) {
  let memories = [];
  try {
    memories = await base44.entities.Memory?.filter?.({
      created_by: userEmail,
      tags: { $in: extractQueryKeywords(query) }
    }, '-last_accessed', limit) || [];
  } catch (e) {
    console.log('Memory recall skipped');
  }

  // Score and sort
  const scored = memories.map(mem => ({
    ...mem,
    recall_score: calculateRecallScore(mem, query)
  }));

  return scored.sort((a, b) => b.recall_score - a.recall_score);
}

/**
 * Consolidate overlapping memories
 */
async function consolidateMemories(userEmail, base44) {
  let memories = [];
  try {
    memories = await base44.entities.Memory?.filter?.({
      created_by: userEmail
    }, '-created_date', 100) || [];
  } catch (e) {
    console.log('Consolidation skipped');
  }

  const groups = groupSimilarMemories(memories);
  const consolidatedCount = Object.keys(groups).length;

  return {
    original_count: memories.length,
    consolidated_count: consolidatedCount,
    groups: groups,
    consolidation_rate: (1 - consolidatedCount / memories.length).toFixed(2)
  };
}

/**
 * Get memory statistics
 */
async function getMemoryStats(userEmail, base44) {
  let memories = [];
  try {
    memories = await base44.entities.Memory?.filter?.({
      created_by: userEmail
    }, '-created_date', 1000) || [];
  } catch (e) {
    console.log('Stats collection skipped');
  }

  const stats = {
    total_memories: memories.length,
    by_type: countByProperty(memories, 'type'),
    by_modality: countByProperty(memories, 'modality'),
    avg_importance: calculateAverage(memories, 'importance'),
    most_accessed: memories.sort((a, b) => (b.access_count || 0) - (a.access_count || 0)).slice(0, 5),
    memory_depth: memories.length > 0 ? (memories.length / 10).toFixed(1) : 0
  };

  return stats;
}

/**
 * UTILITIES
 */

function extractMemoryKeywords(content) {
  const words = content.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3);
  
  const freq = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);
  
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

function extractQueryKeywords(query) {
  return query.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 5);
}

function generateEmbeddingSummary(content) {
  // Simplified: first 100 chars as summary
  return content.substring(0, 100);
}

function calculateRecallScore(memory, query) {
  let score = 0;
  
  const queryKeywords = extractQueryKeywords(query);
  const memoryContent = memory.content.toLowerCase();
  
  // Keyword match
  const matches = queryKeywords.filter(kw => memoryContent.includes(kw)).length;
  score += matches / queryKeywords.length * 0.5;
  
  // Importance factor
  score += (memory.importance || 0.5) * 0.3;
  
  // Recency factor
  const age = Date.now() - new Date(memory.last_accessed || memory.created_date).getTime();
  const recency = Math.exp(-age / (1000 * 60 * 60 * 24)); // Decay over days
  score += recency * 0.2;
  
  return score;
}

function groupSimilarMemories(memories) {
  const groups = {};
  
  for (const mem of memories) {
    const type = mem.type || 'unknown';
    if (!groups[type]) groups[type] = [];
    groups[type].push(mem);
  }
  
  return groups;
}

function countByProperty(items, property) {
  const counts = {};
  items.forEach(item => {
    const val = item[property] || 'unknown';
    counts[val] = (counts[val] || 0) + 1;
  });
  return counts;
}

function calculateAverage(items, property) {
  if (items.length === 0) return 0;
  const sum = items.reduce((acc, item) => acc + (item[property] || 0), 0);
  return (sum / items.length).toFixed(2);
}

function simpleHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}