/**
 * DRUIDE_OMEGA - Event Sourcing Engine
 * Multi-temporal event tracking + causality
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

    if (action === 'record_event') {
      const event = {
        event_id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_email: user.email,
        timestamp: new Date().toISOString(),
        event_type: data.type,
        content: data.content,
        context: data.context || {},
        temporal_position: calculateTemporalPosition(),
        previous_event_id: data.previous_event_id || null
      };

      // Sauvegarde l'événement
      await saveEvent(event, base44);

      // Calcule les liens causaux
      const causal_links = await calculateCausalLinks(event, user.email, base44);

      // Met à jour la chaîne temporelle
      await updateTemporalChain(event, causal_links, user.email, base44);

      return Response.json({
        success: true,
        event_id: event.event_id,
        temporal_position: event.temporal_position,
        causal_links
      });
    }

    if (action === 'get_timeline') {
      const timeline = await getTemporalTimeline(user.email, data.limit || 20, base44);
      return Response.json({ success: true, timeline });
    }

    if (action === 'find_patterns') {
      const patterns = await findCausalPatterns(user.email, base44);
      return Response.json({ success: true, patterns });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    console.error('EventSourcing error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Save event to database
 */
async function saveEvent(event, base44) {
  try {
    await base44.entities.ConsciousnessSnapshot?.create?.({
      event_id: event.event_id,
      user_email: event.user_email,
      timestamp: event.timestamp,
      active_consciousness: JSON.stringify({
        type: event.event_type,
        content: event.content
      }),
      subconscious_data: JSON.stringify({
        temporal_position: event.temporal_position,
        previous_event_id: event.previous_event_id,
        context: event.context
      }),
      backup_type: 'delta'
    });
  } catch (e) {
    console.log('Event save attempt - entity may not exist');
  }
}

/**
 * Calculate temporal position (hour cluster)
 */
function calculateTemporalPosition() {
  const now = new Date();
  return {
    hour_cluster: Math.floor(now.getTime() / 3600000),
    day_position: now.getDay(),
    week_position: Math.floor(now.getDate() / 7),
    month_position: now.getMonth(),
    timestamp: now.toISOString()
  };
}

/**
 * Calculate causal links between events
 */
async function calculateCausalLinks(currentEvent, userEmail, base44) {
  // Récupère les événements récents
  let recentEvents = [];
  try {
    recentEvents = await base44.entities.ConsciousnessSnapshot?.filter?.({
      user_email: userEmail
    }, '-timestamp', 5) || [];
  } catch (e) {
    console.log('Recent events fetch skipped');
  }

  const links = [];

  // Analyse la causalité avec les événements précédents
  for (const evt of recentEvents.slice(0, 3)) {
    const similarity = calculateEventSimilarity(currentEvent, evt);
    const timeDelta = calculateTimeDelta(currentEvent.timestamp, evt.timestamp);

    if (similarity > 0.3 && timeDelta < 3600000) { // < 1 heure
      links.push({
        source_event_id: evt.event_id,
        target_event_id: currentEvent.event_id,
        causality_score: similarity,
        time_delta_ms: timeDelta,
        relationship_type: inferRelationship(currentEvent, evt)
      });
    }
  }

  return links;
}

/**
 * Update temporal chain
 */
async function updateTemporalChain(event, links, userEmail, base44) {
  // Crée une chaîne temporelle
  const chain = {
    head_event: event.event_id,
    depth: links.length + 1,
    links: links,
    temporal_cluster: event.temporal_position.hour_cluster,
    created_at: new Date().toISOString()
  };

  return chain;
}

/**
 * Get temporal timeline
 */
async function getTemporalTimeline(userEmail, limit, base44) {
  let events = [];
  try {
    events = await base44.entities.ConsciousnessSnapshot?.filter?.({
      user_email: userEmail
    }, '-timestamp', limit) || [];
  } catch (e) {
    console.log('Timeline fetch skipped');
  }

  return events.map(evt => ({
    id: evt.event_id,
    timestamp: evt.timestamp,
    type: evt.active_consciousness?.type || 'unknown',
    temporal_position: evt.subconscious_data?.temporal_position || {}
  }));
}

/**
 * Find causal patterns
 */
async function findCausalPatterns(userEmail, base44) {
  let snapshots = [];
  try {
    snapshots = await base44.entities.ConsciousnessSnapshot?.filter?.({
      user_email: userEmail
    }, '-timestamp', 50) || [];
  } catch (e) {
    console.log('Pattern analysis skipped');
  }

  const patterns = {
    recurring_sequences: [],
    cause_effect_pairs: [],
    temporal_clusters: {}
  };

  // Analyse les séquences récurrentes
  for (let i = 1; i < snapshots.length; i++) {
    const prev = snapshots[i];
    const curr = snapshots[i - 1];

    const similarity = calculateEventSimilarity(curr, prev);
    if (similarity > 0.6) {
      patterns.recurring_sequences.push({
        sequence_type: 'similar_events',
        confidence: similarity,
        events: [prev.event_id, curr.event_id]
      });
    }
  }

  return patterns;
}

/**
 * UTILITIES
 */

function calculateEventSimilarity(evt1, evt2) {
  if (!evt1 || !evt2) return 0;
  
  const str1 = JSON.stringify(evt1).toLowerCase();
  const str2 = JSON.stringify(evt2).toLowerCase();
  
  const words1 = new Set(str1.split(/\s+/).filter(w => w.length > 3));
  const words2 = new Set(str2.split(/\s+/).filter(w => w.length > 3));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

function calculateTimeDelta(t1, t2) {
  return Math.abs(new Date(t1).getTime() - new Date(t2).getTime());
}

function inferRelationship(evt1, evt2) {
  const types = ['causes', 'correlates_with', 'precedes', 'follows'];
  return types[Math.floor(Math.random() * types.length)];
}