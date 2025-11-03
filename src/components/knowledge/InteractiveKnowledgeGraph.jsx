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
import { Network, Search, ZoomIn, ZoomOut, Maximize2, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InteractiveKnowledgeGraph({ fusion }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [zoom, setZoom] = useState(1);
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

  // Filter nodes based on search and type
  const filteredNodes = graph.nodes.filter(node => {
    const matchesSearch = !searchQuery || 
      node.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || node.type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = graph.edges?.filter(edge => 
    filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  ) || [];

  // Get node color by type
  const getNodeColor = (type) => {
    switch (type) {
      case "concept": return "bg-purple-500";
      case "entity": return "bg-blue-500";
      case "theme": return "bg-green-500";
      case "fact": return "bg-orange-500";
      case "question": return "bg-pink-500";
      default: return "bg-slate-500";
    }
  };

  const getRelationshipColor = (relationship) => {
    switch (relationship) {
      case "causes": return "stroke-red-500";
      case "supports": return "stroke-green-500";
      case "contradicts": return "stroke-orange-500";
      case "part_of": return "stroke-blue-500";
      case "related_to": return "stroke-slate-400";
      default: return "stroke-slate-300";
    }
  };

  // Simple force-directed layout (simplified for visualization)
  const layoutNodes = () => {
    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    return filteredNodes.map((node, idx) => {
      const angle = (idx / filteredNodes.length) * 2 * Math.PI;
      const r = radius * (1 + (node.importance || 5) / 20); // Vary radius by importance
      
      return {
        ...node,
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle)
      };
    });
  };

  const positionedNodes = layoutNodes();
  const nodeMap = Object.fromEntries(positionedNodes.map(n => [n.id, n]));

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
          <Button variant="outline" size="icon">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher un nœud..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Tous les types</option>
          <option value="concept">Concepts</option>
          <option value="entity">Entités</option>
          <option value="theme">Thèmes</option>
          <option value="fact">Faits</option>
          <option value="question">Questions</option>
        </select>
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
          {/* Edges */}
          <g>
            {filteredEdges.map((edge, idx) => {
              const sourceNode = nodeMap[edge.source];
              const targetNode = nodeMap[edge.target];
              if (!sourceNode || !targetNode) return null;

              return (
                <g key={idx}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    className={`${getRelationshipColor(edge.relationship)} transition-all`}
                    strokeWidth={Math.max(1, edge.strength / 2)}
                    opacity={0.6}
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

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-all hover:opacity-80"
                  style={{ transform: isSelected ? 'scale(1.2)' : 'scale(1)' }}
                >
                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size}
                    className={`${getNodeColor(node.type)} ${isSelected ? 'stroke-slate-900' : 'stroke-white'}`}
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
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-lg">
          <p className="text-xs font-semibold text-slate-700 mb-2">Types de nœuds:</p>
          <div className="space-y-1">
            {["concept", "entity", "theme", "fact", "question"].map(type => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getNodeColor(type)}`} />
                <span className="text-xs text-slate-600 capitalize">{type}</span>
              </div>
            ))}
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
                <Badge className={`${getNodeColor(selectedNode.type)} text-white`}>
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
          <h4 className="font-semibold text-slate-900 mb-3">Clusters Thématiques</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {graph.clusters.map((cluster, idx) => (
              <div key={idx} className="p-3 bg-white border border-slate-200 rounded-lg">
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
 * Innovation: Interactive Knowledge Graph Visualization
 * Référence: AMG-AL-DO-2025-001
 * ═══════════════════════════════════════════════════════════════════════════
 */