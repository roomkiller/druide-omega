/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Gestionnaire de Mémoire Stable et Persistante              ║
 * ║ © 2026 AMG+A.L - Tous droits réservés                                     ║
 * ║                                                                            ║
 * ║ Module passif/neutre/régulé pour encodage, consolidation et oubli         ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { operation, data } = await req.json();

    // ═══════════════════════════════════════════════════════════════════════
    // OPÉRATIONS DISPONIBLES
    // ═══════════════════════════════════════════════════════════════════════

    switch (operation) {
      case 'encode': {
        // Encodage d'une nouvelle mémoire avec priorité et rétention
        const memory = await encodeMemory(base44, data);
        return Response.json({ success: true, memory });
      }

      case 'consolidate': {
        // Consolidation des mémoires selon mécanisme
        const result = await consolidateMemories(base44, data?.mechanism || 'périodique');
        return Response.json({ success: true, ...result });
      }

      case 'regulate_forgetting': {
        // Oubli régulé basé sur decay_rate et accès
        const result = await regulateForgetting(base44);
        return Response.json({ success: true, ...result });
      }

      case 'retrieve': {
        // Récupération intelligente avec scoring de pertinence
        const memories = await retrieveMemories(base44, data);
        return Response.json({ success: true, memories });
      }

      case 'update_confidence': {
        // Mise à jour du niveau de confiance basé sur validation
        const result = await updateConfidenceScore(base44, data.memory_id, data.adjustment);
        return Response.json({ success: true, ...result });
      }

      default:
        return Response.json({ error: 'Unknown operation' }, { status: 400 });
    }

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// FONCTIONS INTERNES - MODE PASSIF/NEUTRE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Encode une nouvelle mémoire avec paramètres de stabilité
 */
async function encodeMemory(base44, memoryData) {
  const now = new Date().toISOString();
  
  // Déterminer automatiquement le content_type si non spécifié
  const contentType = memoryData.content_type || inferContentType(memoryData.content);
  
  // Calculer le score de confiance initial
  const initialConfidence = calculateInitialConfidence(memoryData);
  
  // Déterminer la priorité d'encodage basée sur l'importance et le type
  const encodingPriority = memoryData.encoding_priority || 
    (memoryData.importance >= 8 ? 'haute' : memoryData.importance >= 5 ? 'moyenne' : 'faible');
  
  // Déterminer la rétention basée sur la priorité et le type
  const retentionDuration = memoryData.retention_duration || 
    (encodingPriority === 'haute' ? 'persistante' : 
     encodingPriority === 'moyenne' ? 'semi_persistante' : 'volatile');

  const memory = await base44.entities.Memory.create({
    ...memoryData,
    content_type: contentType,
    confidence_score: initialConfidence,
    encoding_priority: encodingPriority,
    retention_duration: retentionDuration,
    consolidation_mechanism: memoryData.consolidation_mechanism || 'périodique',
    forgetting_mechanism: memoryData.forgetting_mechanism || 'régulé',
    decay_rate: calculateDecayRate(retentionDuration),
    last_consolidation: now,
    access_count: 0
  });

  return memory;
}

/**
 * Inférence automatique du type de contenu
 */
function inferContentType(content) {
  if (!content) return 'logique';
  
  const lowerContent = content.toLowerCase();
  
  // Symbolique: concepts, métaphores, abstractions
  if (lowerContent.includes('symbole') || lowerContent.includes('représente') || 
      lowerContent.includes('métaphore')) {
    return 'symbolique';
  }
  
  // Décisionnel: choix, actions, stratégies
  if (lowerContent.includes('décision') || lowerContent.includes('choisi') || 
      lowerContent.includes('action') || lowerContent.includes('stratégie')) {
    return 'décisionnel';
  }
  
  // Perceptif: sensations, observations, expériences
  if (lowerContent.includes('voir') || lowerContent.includes('entend') || 
      lowerContent.includes('ressent') || lowerContent.includes('perçoit')) {
    return 'perceptif';
  }
  
  // Par défaut: logique
  return 'logique';
}

/**
 * Calcul du score de confiance initial
 */
function calculateInitialConfidence(memoryData) {
  let confidence = 70; // Base
  
  // Boost si source fiable
  if (memoryData.context?.includes('vérifié') || memoryData.context?.includes('confirmé')) {
    confidence += 15;
  }
  
  // Boost si importance élevée
  if (memoryData.importance >= 8) {
    confidence += 10;
  }
  
  // Réduction si incertain
  if (memoryData.content?.includes('peut-être') || memoryData.content?.includes('possiblement')) {
    confidence -= 20;
  }
  
  return Math.min(100, Math.max(0, confidence));
}

/**
 * Calcul du taux de dégradation basé sur rétention
 */
function calculateDecayRate(retentionDuration) {
  switch (retentionDuration) {
    case 'persistante': return 0.01; // Très lent
    case 'semi_persistante': return 0.1; // Modéré
    case 'volatile': return 0.5; // Rapide
    default: return 0.1;
  }
}

/**
 * Consolidation des mémoires - renforce les mémoires importantes
 */
async function consolidateMemories(base44, mechanism = 'périodique') {
  const now = new Date().toISOString();
  let consolidatedCount = 0;
  let mergedCount = 0;

  // Récupérer les mémoires à consolider
  let memories;
  
  if (mechanism === 'périodique') {
    // Consolider les mémoires non consolidées depuis 24h
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    memories = await base44.asServiceRole.entities.Memory.filter({
      created_by: base44.user?.email,
      last_consolidation: { $lt: yesterday }
    });
  } else {
    // Consolidation événementielle: mémoires haute priorité non consolidées
    memories = await base44.asServiceRole.entities.Memory.filter({
      created_by: base44.user?.email,
      encoding_priority: 'haute',
      consolidation_mechanism: 'événementiel'
    });
  }

  // Consolidation: renforcement et fusion
  for (const memory of memories) {
    // Renforcer la confiance des mémoires fréquemment accédées
    if (memory.access_count > 5) {
      const newConfidence = Math.min(100, memory.confidence_score + 5);
      await base44.asServiceRole.entities.Memory.update(memory.id, {
        confidence_score: newConfidence,
        last_consolidation: now
      });
      consolidatedCount++;
    }

    // Fusionner les mémoires similaires
    const similarMemories = await findSimilarMemories(base44, memory);
    if (similarMemories.length > 0) {
      await mergeSimilarMemories(base44, memory, similarMemories);
      mergedCount++;
    }
  }

  return {
    consolidated_count: consolidatedCount,
    merged_count: mergedCount,
    mechanism,
    timestamp: now
  };
}

/**
 * Trouve des mémoires similaires pour consolidation
 */
async function findSimilarMemories(base44, memory) {
  // Récupérer les mémoires avec même type et tags similaires
  const candidates = await base44.asServiceRole.entities.Memory.filter({
    created_by: base44.user?.email,
    type: memory.type,
    id: { $ne: memory.id }
  });

  // Filtrer par similarité de tags
  return candidates.filter(candidate => {
    if (!memory.tags || !candidate.tags) return false;
    const commonTags = memory.tags.filter(tag => candidate.tags.includes(tag));
    return commonTags.length >= 2; // Au moins 2 tags en commun
  });
}

/**
 * Fusionne des mémoires similaires
 */
async function mergeSimilarMemories(base44, mainMemory, similarMemories) {
  // Créer un résumé consolidé
  const allContents = [mainMemory.content, ...similarMemories.map(m => m.content)];
  const mergedContent = `[Mémoire consolidée] ${allContents.join(' | ')}`;
  
  // Calculer nouvelle confiance (moyenne pondérée)
  const totalConfidence = mainMemory.confidence_score + 
    similarMemories.reduce((sum, m) => sum + m.confidence_score, 0);
  const avgConfidence = totalConfidence / (1 + similarMemories.length);

  // Mettre à jour la mémoire principale
  await base44.asServiceRole.entities.Memory.update(mainMemory.id, {
    content: mergedContent,
    confidence_score: Math.round(avgConfidence),
    linked_memory_ids: [
      ...(mainMemory.linked_memory_ids || []),
      ...similarMemories.map(m => m.id)
    ],
    last_consolidation: new Date().toISOString()
  });

  // Marquer les mémoires fusionnées pour archivage
  for (const similar of similarMemories) {
    await base44.asServiceRole.entities.Memory.update(similar.id, {
      retention_duration: 'volatile',
      tags: [...(similar.tags || []), 'merged_into_' + mainMemory.id]
    });
  }
}

/**
 * Oubli régulé - supprime ou dégrade les mémoires selon mécanisme
 */
async function regulateForgetting(base44) {
  const now = Date.now();
  let forgottenCount = 0;
  let degradedCount = 0;

  // Récupérer toutes les mémoires de l'utilisateur
  const memories = await base44.asServiceRole.entities.Memory.filter({
    created_by: base44.user?.email
  });

  for (const memory of memories) {
    const createdAt = new Date(memory.created_date).getTime();
    const ageInDays = (now - createdAt) / (1000 * 60 * 60 * 24);

    // Oubli passif: suppression automatique des volatiles anciennes
    if (memory.forgetting_mechanism === 'passif' && 
        memory.retention_duration === 'volatile' && 
        ageInDays > 7) {
      await base44.asServiceRole.entities.Memory.delete(memory.id);
      forgottenCount++;
      continue;
    }

    // Oubli actif: basé sur manque d'accès
    if (memory.forgetting_mechanism === 'actif') {
      const daysSinceAccess = memory.last_accessed ? 
        (now - new Date(memory.last_accessed).getTime()) / (1000 * 60 * 60 * 24) : 
        ageInDays;
      
      if (daysSinceAccess > 30 && memory.access_count < 2) {
        await base44.asServiceRole.entities.Memory.delete(memory.id);
        forgottenCount++;
        continue;
      }
    }

    // Oubli régulé: dégradation progressive de la confiance
    if (memory.forgetting_mechanism === 'régulé') {
      const decayAmount = memory.decay_rate * (ageInDays / 30); // Decay mensuel
      const newConfidence = Math.max(0, memory.confidence_score - decayAmount * 10);
      
      // Si confiance < 20% et mémoire non essentielle, supprimer
      if (newConfidence < 20 && memory.importance < 7) {
        await base44.asServiceRole.entities.Memory.delete(memory.id);
        forgottenCount++;
      } else if (newConfidence < memory.confidence_score) {
        // Sinon dégrader la confiance
        await base44.asServiceRole.entities.Memory.update(memory.id, {
          confidence_score: Math.round(newConfidence)
        });
        degradedCount++;
      }
    }
  }

  return {
    forgotten_count: forgottenCount,
    degraded_count: degradedCount,
    timestamp: new Date().toISOString()
  };
}

/**
 * Récupération intelligente des mémoires avec scoring
 */
async function retrieveMemories(base44, queryData) {
  const {
    query,
    modality,
    min_confidence = 50,
    limit = 10,
    content_types = null
  } = queryData;

  // Filtres de base
  const filters = {
    created_by: base44.user?.email,
    confidence_score: { $gte: min_confidence }
  };

  if (modality) {
    filters.modality = modality;
  }

  if (content_types && content_types.length > 0) {
    filters.content_type = { $in: content_types };
  }

  // Récupérer les mémoires
  let memories = await base44.entities.Memory.filter(filters, '-importance', limit * 3);

  // Si query fournie, filtrer par pertinence sémantique (simple matching)
  if (query) {
    const queryLower = query.toLowerCase();
    memories = memories.filter(m => 
      m.content?.toLowerCase().includes(queryLower) ||
      m.context?.toLowerCase().includes(queryLower) ||
      m.tags?.some(tag => tag.toLowerCase().includes(queryLower))
    );
  }

  // Scorer et trier par pertinence
  memories = memories.map(m => ({
    ...m,
    relevance_score: calculateRelevanceScore(m, queryData)
  })).sort((a, b) => b.relevance_score - a.relevance_score);

  // Limiter les résultats
  memories = memories.slice(0, limit);

  // Mettre à jour les statistiques d'accès
  for (const memory of memories) {
    await base44.asServiceRole.entities.Memory.update(memory.id, {
      last_accessed: new Date().toISOString(),
      access_count: (memory.access_count || 0) + 1,
      [`access_modalities.${modality || 'chat'}`]: 
        ((memory.access_modalities?.[modality || 'chat'] || 0) + 1)
    });
  }

  return memories;
}

/**
 * Calcul du score de pertinence
 */
function calculateRelevanceScore(memory, queryData) {
  let score = 0;

  // Poids: confiance
  score += memory.confidence_score * 0.3;

  // Poids: importance
  score += memory.importance * 5 * 0.3;

  // Poids: récence (inversement proportionnel à l'âge)
  const ageInDays = (Date.now() - new Date(memory.created_date).getTime()) / (1000 * 60 * 60 * 24);
  const recencyScore = Math.max(0, 100 - ageInDays * 2);
  score += recencyScore * 0.2;

  // Poids: fréquence d'accès
  score += Math.min(100, (memory.access_count || 0) * 10) * 0.2;

  return Math.round(score);
}

/**
 * Mise à jour du score de confiance
 */
async function updateConfidenceScore(base44, memoryId, adjustment) {
  const memory = await base44.entities.Memory.filter({ id: memoryId });
  
  if (!memory || memory.length === 0) {
    throw new Error('Memory not found');
  }

  const currentScore = memory[0].confidence_score || 70;
  const newScore = Math.min(100, Math.max(0, currentScore + adjustment));

  await base44.asServiceRole.entities.Memory.update(memoryId, {
    confidence_score: newScore
  });

  return {
    memory_id: memoryId,
    old_score: currentScore,
    new_score: newScore,
    adjustment
  };
}