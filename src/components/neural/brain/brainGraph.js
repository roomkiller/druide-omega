/**
 * DRUIDE_OMEGA - Cerveau cognitif 3D : régions et préparation du graphe
 */

export const REGIONS = {
  knowledge: { label: 'Lobe frontal', sublabel: 'Connaissances', center: [0, 8, 22], color: 0xf59e0b, hex: '#f59e0b' },
  chat: { label: 'Lobe temporal', sublabel: 'Langage / Chat', center: [-24, -2, 2], color: 0x3b82f6, hex: '#3b82f6' },
  voice: { label: 'Cortex auditif', sublabel: 'Voix', center: [24, -2, 2], color: 0x10b981, hex: '#10b981' },
  visual: { label: 'Lobe occipital', sublabel: 'Visuel', center: [0, 6, -24], color: 0xec4899, hex: '#ec4899' },
  memory: { label: 'Hippocampe', sublabel: 'Mémoire', center: [0, -2, -4], color: 0x8b5cf6, hex: '#8b5cf6' },
  system: { label: 'Tronc cérébral', sublabel: 'Système', center: [0, -20, -8], color: 0x94a3b8, hex: '#94a3b8' }
};

export function regionForType(type) {
  return REGIONS[type] ? type : 'memory';
}

/**
 * Transforme les corrélations en graphe structuré :
 * nodes (avec région + rang de connectivité), edges, stats par région, top hubs.
 */
export function buildGraph(correlations) {
  const nodeMap = new Map();

  const addNode = (content, type) => {
    if (!nodeMap.has(content)) {
      nodeMap.set(content, { id: content, type, region: regionForType(type), connections: 0, strength: 0 });
    }
  };

  correlations.forEach(c => {
    addNode(c.source_content, c.source_modality);
    addNode(c.target_content, c.target_modality);
    const s = nodeMap.get(c.source_content);
    const t = nodeMap.get(c.target_content);
    s.connections++; t.connections++;
    s.strength += c.correlation_strength || 5;
    t.strength += c.correlation_strength || 5;
  });

  const nodes = Array.from(nodeMap.values());

  const edges = correlations
    .filter(c => nodeMap.has(c.source_content) && nodeMap.has(c.target_content))
    .map(c => ({
      source: c.source_content,
      target: c.target_content,
      strength: c.correlation_strength || 5,
      type: c.correlation_type || 'association',
      interpretation: c.interpretation || null
    }));

  // Rang de connectivité au sein de chaque région (hubs au centre)
  const byRegion = {};
  nodes.forEach(n => {
    if (!byRegion[n.region]) byRegion[n.region] = [];
    byRegion[n.region].push(n);
  });
  Object.values(byRegion).forEach(list => {
    list.sort((a, b) => b.connections - a.connections);
    list.forEach((n, i) => { n.regionRank = i; n.regionCount = list.length; });
  });

  // Statistiques par région
  const regionStats = Object.keys(REGIONS).map(key => ({
    key,
    ...REGIONS[key],
    nodeCount: (byRegion[key] || []).length,
    totalStrength: (byRegion[key] || []).reduce((sum, n) => sum + n.strength, 0)
  }));

  // Top 3 hubs globaux
  const topHubs = [...nodes].sort((a, b) => b.connections - a.connections).slice(0, 3).map(n => n.id);

  // Voisins de chaque nœud (pour le panneau de détails)
  const neighbors = {};
  edges.forEach(e => {
    if (!neighbors[e.source]) neighbors[e.source] = [];
    if (!neighbors[e.target]) neighbors[e.target] = [];
    neighbors[e.source].push({ id: e.target, strength: e.strength, type: e.type });
    neighbors[e.target].push({ id: e.source, strength: e.strength, type: e.type });
  });

  return { nodes, edges, regionStats, topHubs, neighbors };
}