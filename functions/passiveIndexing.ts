/**
 * DRUIDE_OMEGA - Passive Indexing System
 * Background processing - zero LLM cost
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

    if (action === 'index_content') {
      // Aucun appel API - purement du traitement local
      const index = createPassiveIndex(data.content, data.metadata);
      
      return Response.json({
        success: true,
        index: index,
        indexed_at: new Date().toISOString(),
        cost: 'zero'
      });
    }

    if (action === 'batch_index') {
      // Indexe plusieurs contenus en parallèle
      const indices = data.items.map(item => 
        createPassiveIndex(item.content, item.metadata)
      );

      return Response.json({
        success: true,
        count: indices.length,
        indices,
        batch_completed_at: new Date().toISOString()
      });
    }

    if (action === 'search_index') {
      // Recherche dans l'index passif
      const results = searchPassiveIndex(data.query, data.indices || []);
      
      return Response.json({
        success: true,
        results,
        search_time_ms: 0
      });
    }

    if (action === 'get_statistics') {
      // Statistiques d'indexing
      const stats = calculateIndexStatistics(data.indices || []);
      
      return Response.json({
        success: true,
        statistics: stats
      });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('PassiveIndexing error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Create passive index - NO API CALLS
 */
function createPassiveIndex(content, metadata = {}) {
  const timestamp = new Date().toISOString();
  
  return {
    // Text analysis
    keywords: extractKeywords(content),
    word_count: countWords(content),
    char_count: content.length,
    
    // Semantic tags
    semantic_tags: detectSemanticTags(content),
    
    // Metadata
    metadata_keys: Object.keys(metadata),
    
    // Statistics
    statistics: {
      avg_word_length: calculateAvgWordLength(content),
      sentence_count: countSentences(content),
      complexity_score: estimateComplexity(content)
    },
    
    // Emotion / Valence
    valence: calculateValence(content),
    emotional_markers: detectEmotionalMarkers(content),
    
    // Temporal
    indexed_at: timestamp,
    content_hash: simpleHash(content),
    
    // Importance
    importance_score: calculateImportanceScore(content, metadata),
    
    // Searchability
    full_text_lower: content.toLowerCase(),
    ngrams: generateNgrams(content)
  };
}

/**
 * Extract keywords using frequency
 */
function extractKeywords(text) {
  const words = text.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3 && !isCommonWord(w));
  
  const freq = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);
  
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
}

/**
 * Count words
 */
function countWords(text) {
  return text.trim().split(/\s+/).length;
}

/**
 * Detect semantic tags
 */
function detectSemanticTags(text) {
  const lower = text.toLowerCase();
  const tags = [];
  
  const patterns = {
    learning: ['learn', 'teach', 'educate', 'training'],
    technical: ['code', 'function', 'algorithm', 'system'],
    emotional: ['feel', 'emotion', 'happy', 'sad', 'angry'],
    decision: ['decide', 'choose', 'option', 'alternative'],
    memory: ['remember', 'recall', 'memory', 'history'],
    growth: ['grow', 'improve', 'better', 'evolve'],
    consciousness: ['conscious', 'aware', 'aware', 'mind']
  };
  
  for (const [tag, keywords] of Object.entries(patterns)) {
    if (keywords.some(k => lower.includes(k))) {
      tags.push(tag);
    }
  }
  
  return tags;
}

/**
 * Calculate average word length
 */
function calculateAvgWordLength(text) {
  const words = text.split(/\s+/);
  if (words.length === 0) return 0;
  const totalLength = words.reduce((sum, w) => sum + w.length, 0);
  return (totalLength / words.length).toFixed(2);
}

/**
 * Count sentences
 */
function countSentences(text) {
  return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
}

/**
 * Estimate complexity (0-1)
 */
function estimateComplexity(text) {
  const words = text.split(/\s+/);
  const avgLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
  const unique = new Set(words.map(w => w.toLowerCase())).size;
  
  return Math.min(1, (avgLength / 10) * (unique / words.length));
}

/**
 * Calculate valence (-1 to 1)
 */
function calculateValence(text) {
  const lower = text.toLowerCase();
  
  const positive = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'love'];
  const negative = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'angry'];
  
  const posCount = positive.filter(w => lower.includes(w)).length;
  const negCount = negative.filter(w => lower.includes(w)).length;
  
  if (posCount + negCount === 0) return 0;
  return (posCount - negCount) / (posCount + negCount);
}

/**
 * Detect emotional markers
 */
function detectEmotionalMarkers(text) {
  const lower = text.toLowerCase();
  const markers = [];
  
  if (lower.includes('!')) markers.push('excitement');
  if (lower.includes('...')) markers.push('contemplation');
  if (lower.includes('?')) markers.push('curiosity');
  if (lower.includes('no') || lower.includes('not')) markers.push('negation');
  
  return markers;
}

/**
 * Simple hash function
 */
function simpleHash(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Calculate importance score (0-1)
 */
function calculateImportanceScore(text, metadata) {
  let score = 0;
  
  // Length factor
  if (text.length > 500) score += 0.3;
  else if (text.length > 200) score += 0.2;
  else score += 0.1;
  
  // Metadata factor
  if (Object.keys(metadata).length > 0) score += 0.2;
  
  // Complexity factor
  if (estimateComplexity(text) > 0.6) score += 0.3;
  
  // Semantic factor
  const tags = detectSemanticTags(text);
  if (tags.length > 2) score += 0.2;
  
  return Math.min(1, score);
}

/**
 * Generate n-grams for search
 */
function generateNgrams(text, n = 2) {
  const words = text.toLowerCase().split(/\s+/);
  const ngrams = [];
  
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(' '));
  }
  
  return ngrams.slice(0, 50);
}

/**
 * Search passive index
 */
function searchPassiveIndex(query, indices) {
  const queryLower = query.toLowerCase();
  const results = [];
  
  for (const index of indices) {
    let score = 0;
    
    // Keyword match
    if (index.keywords.some(k => k.word.includes(queryLower))) score += 0.5;
    
    // N-gram match
    if (index.ngrams.some(ng => ng.includes(queryLower))) score += 0.3;
    
    // Full text match
    if (index.full_text_lower.includes(queryLower)) score += 0.2;
    
    if (score > 0) {
      results.push({
        index: index,
        match_score: score,
        matched_keywords: index.keywords.filter(k => k.word.includes(queryLower))
      });
    }
  }
  
  return results.sort((a, b) => b.match_score - a.match_score);
}

/**
 * Calculate index statistics
 */
function calculateIndexStatistics(indices) {
  if (indices.length === 0) return { count: 0 };
  
  const totalWords = indices.reduce((sum, idx) => sum + idx.word_count, 0);
  const avgImportance = indices.reduce((sum, idx) => sum + idx.importance_score, 0) / indices.length;
  const tags = new Set(indices.flatMap(idx => idx.semantic_tags));
  
  return {
    total_indexed: indices.length,
    total_words: totalWords,
    avg_importance: avgImportance.toFixed(2),
    unique_semantic_tags: Array.from(tags),
    indexing_cost: 'zero'
  };
}

/**
 * Common words to filter
 */
function isCommonWord(word) {
  const common = ['the', 'and', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'to', 'of', 'in', 'for'];
  return common.includes(word);
}