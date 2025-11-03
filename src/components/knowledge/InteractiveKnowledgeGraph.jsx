/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Interactive Knowledge Graph                                ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ║ Fingerprint: AMG:AL:2025:DO:NBC:8F7E:4C9A:3B2F:1E6D:5C4B                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Network, Search, ZoomIn, ZoomOut, Maximize2, Filter, Grid3x3, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InteractiveKnowledgeGraph({ fusion }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTypes, setFilterTypes] = useState(["concept", "entity", "theme", "fact", "question"]);
  const [selectedCluster, setSelectedCluster] = useState("all");
  const [zoom, setZoom] = useState(1);
  const [showClusters, setShowClusters] = useState(true);
  const [layoutType, setLayoutType] = useState("force");
  const canvasRef = useRef(null);

  const graph = fusion?.knowledge_graph;

  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return (
      <Card className="p-12 bg-slate-50 text-center border-2 border-dashed border-slate-300">
        <Network className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600">Aucun graphe de connaissances disponible</p>
      </Card>
    );
  }

  // Filter nodes based on search, type, and cluster
  const filteredNodes = graph.nodes.filter(node => {
    const matchesSearch = !searchQuery || 
      node.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterTypes.includes(node.type);
    
    // Check cluster filter
    if (selectedCluster !== "all" && graph.clusters) {
      const cluster = graph.clusters.find(c => c.id === selectedCluster);
      if (cluster && !cluster.node_ids.includes(node.id)) {
        return false;
      }
    }
    
    return matchesSearch && matchesType;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = graph.edges?.filter(edge => 
    filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  ) || [];

  // Get node color by type
  const getNodeColor = (type) => {
    switch (type) {
      case "concept": return "#a855f7"; // purple-500
      case "entity": return "#3b82f6"; // blue-500
      case "theme": return "#10b981"; // green-500
      case "fact": return "#f97316"; // orange-500
      case "question": return "#ec4899"; // pink-500
      default: return "#64748b"; // slate-500
    }
  };

  const getClusterColor = (clusterId) => {
    const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];
    const index = graph.clusters?.findIndex(c => c.id === clusterId) || 0;
    return colors[index % colors.length];
  };

  const getRelationshipColor = (relationship) => {
    switch (relationship) {
      case "causes": return "#ef4444"; // red-500
      case "supports": return "#10b981"; // green-500
      case "contradicts": return "#f97316"; // orange-500
      case "part_of": return "#3b82f6"; // blue-500
      case "related_to": return "#94a3b8"; // slate-400
      default: return "#cbd5e1"; // slate-300
    }
  };

  // Force-directed layout with improvements
  const forceDirectedLayout = () => {
    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Initialize positions
    let positions = filteredNodes.map((node, idx) => {
      const angle = (idx / filteredNodes.length) * 2 * Math.PI;
      const radius = Math.min(width, height) / 4;
      return {
        ...node,
        x: centerX + radius * Math.cos(angle) + (Math.random() - 0.5) * 50,
        y: centerY + radius * Math.sin(angle) + (Math.random() - 0.5) * 50,
        vx: 0,
        vy: 0
      };
    });

    // Simulation parameters
    const iterations = 50;
    const repulsionStrength = 5000;
    const attractionStrength = 0.05;
    const damping = 0.8;

    // Run force simulation
    for (let iter = 0; iter < iterations; iter++) {
      // Apply repulsion between all nodes
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const dx = positions[j].x - positions[i].x;
          const dy = positions[j].y - positions[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsionStrength / (distance * distance);
          
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          positions[i].vx -= fx;
          positions[i].vy -= fy;
          positions[j].vx += fx;
          positions[j].vy += fy;
        }
      }

      // Apply attraction along edges
      filteredEdges.forEach(edge => {
        const sourceIdx = positions.findIndex(n => n.id === edge.source);
        const targetIdx = positions.findIndex(n => n.id === edge.target);
        
        if (sourceIdx !== -1 && targetIdx !== -1) {
          const dx = positions[targetIdx].x - positions[sourceIdx].x;
          const dy = positions[targetIdx].y - positions[sourceIdx].y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          
          const force = distance * attractionStrength * (edge.strength || 5);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          positions[sourceIdx].vx += fx;
          positions[sourceIdx].vy += fy;
          positions[targetIdx].vx -= fx;
          positions[targetIdx].vy -= fy;
        }
      });

      // Update positions
      positions = positions.map(node => {
        node.x += node.vx * damping;
        node.y += node.vy * damping;
        
        // Keep nodes within bounds
        node.x = Math.max(50, Math.min(width - 50, node.x));
        node.y = Math.max(50, Math.min(height - 50, node.y));
        
        return node;
      });
    }

    return positions;
  };

  // Cluster-based layout
  const clusterLayout = () => {
    const width = 800;
    const height = 600;
    
    if (!graph.clusters || graph.clusters.length === 0) {
      return forceDirectedLayout();
    }

    const clustersWithNodes = graph.clusters.map(cluster => ({
      ...cluster,
      nodes: filteredNodes.filter(n => cluster.node_ids.includes(n.id))
    })).filter(c => c.nodes.length > 0);

    const clusterCount = clustersWithNodes.length;
    const positions = [];

    clustersWithNodes.forEach((cluster, clusterIdx) => {
      const angle = (clusterIdx / clusterCount) * 2 * Math.PI;
      const clusterRadius = Math.min(width, height) / 3;
      const clusterCenterX = width / 2 + clusterRadius * Math.cos(angle);
      const clusterCenterY = height / 2 + clusterRadius * Math.sin(angle);
      
      // Position nodes within cluster
      cluster.nodes.forEach((node, nodeIdx) => {
        const nodeAngle = (nodeIdx / cluster.nodes.length) * 2 * Math.PI;
        const nodeRadius = 60 + (node.importance || 5) * 5;
        
        positions.push({
          ...node,
          x: clusterCenterX + nodeRadius * Math.cos(nodeAngle),
          y: clusterCenterY + nodeRadius * Math.sin(nodeAngle),
          cluster: cluster.id
        });
      });
    });

    return positions;
  };

  const positionedNodes = layoutType === "cluster" ? clusterLayout() : forceDirectedLayout();
  const nodeMap = Object.fromEntries(positionedNodes.map(n => [n.id, n]));

  const handleTypeToggle = (type) => {
    setFilterTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <Card className="p-6 bg-white border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Network className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-slate-900">Graphe de Connaissances Interactif</h3>
          <Badge className="bg-indigo-100 text-indigo-700">
            {filteredNodes.length} nœuds • {filteredEdges.length} relations
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Select value={layoutType} onValueChange={setLayoutType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="force">Force-Directed</SelectItem>
              <SelectItem value="cluster">Clusters</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher un nœud..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {graph.clusters && graph.clusters.length > 0 && (
            <Select value={selectedCluster} onValueChange={setSelectedCluster}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tous les clusters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les clusters</SelectItem>
                {graph.clusters.map((cluster) => (
                  <SelectItem key={cluster.id} value={cluster.id}>
                    {cluster.theme} ({cluster.node_ids?.length || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowClusters(!showClusters)}
            title={showClusters ? "Masquer clusters" : "Afficher clusters"}
          >
            {showClusters ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
        </div>

        {/* Type filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-slate-600 font-medium">Types:</span>
          {["concept", "entity", "theme", "fact", "question"].map(type => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                checked={filterTypes.includes(type)}
                onCheckedChange={() => handleTypeToggle(type)}
                id={`type-${type}`}
              />
              <label
                htmlFor={`type-${type}`}
                className="text-sm text-slate-700 capitalize cursor-pointer flex items-center gap-1"
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getNodeColor(type) }}
                />
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="relative bg-slate-50 rounded-xl border-2 border-slate-200 overflow-hidden" style={{ height: 600 }}>
        <svg
          ref={canvasRef}
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          className="cursor-move"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        >
          {/* Cluster backgrounds */}
          {showClusters && layoutType === "cluster" && graph.clusters?.map((cluster) => {
            const clusterNodes = positionedNodes.filter(n => n.cluster === cluster.id);
            if (clusterNodes.length === 0) return null;

            const centerX = clusterNodes.reduce((sum, n) => sum + n.x, 0) / clusterNodes.length;
            const centerY = clusterNodes.reduce((sum, n) => sum + n.y, 0) / clusterNodes.length;
            const radius = Math.max(...clusterNodes.map(n => 
              Math.sqrt((n.x - centerX) ** 2 + (n.y - centerY) ** 2)
            )) + 40;

            return (
              <circle
                key={cluster.id}
                cx={centerX}
                cy={centerY}
                r={radius}
                fill={getClusterColor(cluster.id)}
                opacity={0.1}
                stroke={getClusterColor(cluster.id)}
                strokeWidth={2}
                strokeDasharray="5,5"
              />
            );
          })}

          {/* Edges */}
          <g>
            {filteredEdges.map((edge, idx) => {
              const sourceNode = nodeMap[edge.source];
              const targetNode = nodeMap[edge.target];
              if (!sourceNode || !targetNode) return null;

              const strokeWidth = Math.max(1, (edge.strength || 5) / 2);

              return (
                <g key={idx}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={getRelationshipColor(edge.relationship)}
                    strokeWidth={strokeWidth}
                    opacity={0.6}
                    className="transition-all"
                  />
                  {/* Edge label */}
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={(sourceNode.y + targetNode.y) / 2}
                    fontSize="8"
                    fill="#64748b"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {edge.relationship}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {positionedNodes.map((node, idx) => {
              const size = 10 + (node.importance || 5) * 2;
              const isSelected = selectedNode?.id === node.id;
              const color = getNodeColor(node.type);

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-all hover:opacity-80"
                  style={{ 
                    transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                    transformOrigin: `${node.x}px ${node.y}px`
                  }}
                >
                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size}
                    fill={color}
                    stroke={isSelected ? "#0f172a" : "#ffffff"}
                    strokeWidth={isSelected ? 3 : 2}
                    opacity={0.9}
                  />
                  
                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y + size + 12}
                    fontSize="10"
                    fontWeight={isSelected ? "bold" : "normal"}
                    fill={isSelected ? "#0f172a" : "#475569"}
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {node.label.slice(0, 20)}{node.label.length > 20 ? '...' : ''}
                  </text>

                  {/* Importance badge */}
                  {node.importance >= 8 && (
                    <circle
                      cx={node.x + size / 2}
                      cy={node.y - size / 2}
                      r="4"
                      fill="#fbbf24"
                      stroke="#f59e0b"
                      strokeWidth="1"
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-lg max-h-96 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-700 mb-2">Légende:</p>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">Types de nœuds:</p>
              <div className="space-y-1">
                {["concept", "entity", "theme", "fact", "question"].map(type => (
                  <div key={type} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNodeColor(type) }} />
                    <span className="text-xs text-slate-600 capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {graph.clusters && graph.clusters.length > 0 && showClusters && (
              <div>
                <p className="text-xs font-medium text-slate-600 mb-1">Clusters:</p>
                <div className="space-y-1">
                  {graph.clusters.slice(0, 6).map((cluster, idx) => (
                    <div key={cluster.id} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getClusterColor(cluster.id) }}
                      />
                      <span className="text-xs text-slate-600 truncate">{cluster.theme}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Node Details */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge style={{ backgroundColor: getNodeColor(selectedNode.type) }} className="text-white">
                  {selectedNode.type}
                </Badge>
                <h4 className="font-semibold text-slate-900">{selectedNode.label}</h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600 mb-1">
                  <strong>Importance:</strong> {selectedNode.importance}/10
                </p>
                {selectedNode.source_ids && (
                  <p className="text-slate-600">
                    <strong>Sources:</strong> {selectedNode.source_ids.length}
                  </p>
                )}
              </div>

              {selectedNode.metadata && Object.keys(selectedNode.metadata).length > 0 && (
                <div>
                  <p className="text-slate-600 font-medium mb-1">Métadonnées:</p>
                  <div className="text-xs text-slate-600">
                    {Object.entries(selectedNode.metadata).map(([key, value]) => (
                      <p key={key}>• {key}: {String(value)}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Connected nodes */}
            {filteredEdges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length > 0 && (
              <div className="mt-4 pt-4 border-t border-indigo-200">
                <p className="text-sm font-medium text-slate-700 mb-2">Connexions:</p>
                <div className="flex flex-wrap gap-2">
                  {filteredEdges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((edge, idx) => {
                      const connectedNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
                      const connectedNode = nodeMap[connectedNodeId];
                      if (!connectedNode) return null;

                      return (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="cursor-pointer hover:bg-indigo-100"
                          onClick={() => setSelectedNode(connectedNode)}
                        >
                          {edge.relationship} → {connectedNode.label}
                        </Badge>
                      );
                    })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clusters Info */}
      {graph.clusters && graph.clusters.length > 0 && (
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Grid3x3 className="w-5 h-5" />
            Clusters Thématiques
          </h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {graph.clusters.map((cluster, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedCluster(cluster.id)}
                style={{ 
                  borderLeftColor: getClusterColor(cluster.id),
                  borderLeftWidth: 4
                }}
              >
                <p className="font-medium text-slate-900 text-sm mb-1">{cluster.theme}</p>
                <p className="text-xs text-slate-600">{cluster.node_ids?.length || 0} nœuds</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCEAU DE PROPRIÉTÉ INTELLECTUELLE
 * © 2025 AMG+A.L - PROPRIÉTAIRE
 * Innovation: Interactive Knowledge Graph Visualization with Force-Directed Layout
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */