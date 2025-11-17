/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Interactive Knowledge Graph with AI Analysis               ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  Network, 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Sparkles,
  Database,
  Brain,
  Link2,
  Eye,
  EyeOff,
  RefreshCw,
  Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InteractiveKnowledgeGraph() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [zoom, setZoom] = useState(1);
  const [aiInsights, setAiInsights] = useState(null);
  const [analyzingGraph, setAnalyzingGraph] = useState(false);
  const [showEdges, setShowEdges] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [hoveredNode, setHoveredNode] = useState(null);

  const { data: knowledgeBases = [] } = useQuery({
    queryKey: ['knowledgeBases'],
    queryFn: () => base44.entities.KnowledgeBase.list('-created_date', 500)
  });

  const { data: memories = [] } = useQuery({
    queryKey: ['memories'],
    queryFn: () => base44.entities.Memory.list('-importance', 200)
  });

  // Build graph from data
  useEffect(() => {
    buildGraph();
  }, [knowledgeBases, memories, filterType, searchQuery]);

  const buildGraph = () => {
    const graphNodes = [];
    const graphEdges = [];
    const nodeMap = new Map();

    // Filter function
    const matchesFilter = (item) => {
      const typeMatch = filterType === 'all' || 
                       (filterType === 'knowledge' && item.type !== 'memory') ||
                       (filterType === 'memory' && item.type === 'memory') ||
                       (filterType === 'external' && item.category === 'external_data');
      
      const searchMatch = !searchQuery || 
                         item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return typeMatch && searchMatch;
    };

    // Add knowledge base nodes
    knowledgeBases.forEach((kb, idx) => {
      if (!matchesFilter({ ...kb, type: 'knowledge' })) return;
      
      const node = {
        id: `kb-${kb.id}`,
        label: kb.name?.slice(0, 30) || 'Untitled',
        type: 'knowledge',
        category: kb.category || 'general',
        data: kb,
        x: Math.cos(idx * 0.5) * 200 + 400,
        y: Math.sin(idx * 0.5) * 200 + 300,
        size: 30 + (kb.tags?.length || 0) * 2,
        color: getCategoryColor(kb.category)
      };
      graphNodes.push(node);
      nodeMap.set(node.id, node);
    });

    // Add memory nodes
    memories.forEach((mem, idx) => {
      if (!matchesFilter({ ...mem, type: 'memory' })) return;
      
      const node = {
        id: `mem-${mem.id}`,
        label: mem.content?.slice(0, 30) || 'Memory',
        type: 'memory',
        importance: mem.importance || 5,
        data: mem,
        x: Math.cos(idx * 0.7 + Math.PI) * 250 + 400,
        y: Math.sin(idx * 0.7 + Math.PI) * 250 + 300,
        size: 20 + (mem.importance || 5) * 2,
        color: getImportanceColor(mem.importance)
      };
      graphNodes.push(node);
      nodeMap.set(node.id, node);
    });

    // Create edges based on tags and relationships
    graphNodes.forEach(nodeA => {
      graphNodes.forEach(nodeB => {
        if (nodeA.id === nodeB.id) return;
        
        const tagsA = nodeA.data.tags || [];
        const tagsB = nodeB.data.tags || [];
        const commonTags = tagsA.filter(t => tagsB.includes(t));
        
        if (commonTags.length > 0) {
          graphEdges.push({
            source: nodeA.id,
            target: nodeB.id,
            weight: commonTags.length,
            label: commonTags[0]
          });
        }

        // Memory-KB connections
        if (nodeA.type === 'memory' && nodeB.type === 'knowledge') {
          const memContent = nodeA.data.content?.toLowerCase() || '';
          const kbName = nodeB.data.name?.toLowerCase() || '';
          const kbContent = nodeB.data.content?.toLowerCase() || '';
          
          if (memContent.includes(kbName) || kbContent.includes(memContent.slice(0, 50))) {
            graphEdges.push({
              source: nodeA.id,
              target: nodeB.id,
              weight: 1,
              label: 'related',
              style: 'dashed'
            });
          }
        }
      });
    });

    setNodes(graphNodes);
    setEdges(graphEdges);
  };

  const getCategoryColor = (category) => {
    const colors = {
      external_data: '#8b5cf6', // purple
      auto_enriched: '#06b6d4', // cyan
      subscription: '#f59e0b', // amber
      general: '#6366f1', // indigo
    };
    return colors[category] || '#6366f1';
  };

  const getImportanceColor = (importance) => {
    if (importance >= 8) return '#ef4444'; // red
    if (importance >= 6) return '#f59e0b'; // amber
    if (importance >= 4) return '#10b981'; // green
    return '#6b7280'; // gray
  };

  const handleNodeClick = (node) => {
    if (selectedNode?.id === node.id) {
      setExpandedNodes(prev => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
        } else {
          next.add(node.id);
        }
        return next;
      });
    }
    setSelectedNode(node);
  };

  const analyzeGraphWithAI = async () => {
    setAnalyzingGraph(true);
    try {
      const graphSummary = {
        total_nodes: nodes.length,
        knowledge_nodes: nodes.filter(n => n.type === 'knowledge').length,
        memory_nodes: nodes.filter(n => n.type === 'memory').length,
        total_edges: edges.length,
        categories: [...new Set(nodes.map(n => n.category || n.type))],
        avg_connections: edges.length / (nodes.length || 1),
        top_tags: getTopTags(nodes, 10)
      };

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Tu es le Druide Omega. Analyse ce graphe de connaissances et fournis des insights stratégiques.

Statistiques du graphe:
- Nœuds totaux: ${graphSummary.total_nodes}
- Connaissances: ${graphSummary.knowledge_nodes}
- Mémoires: ${graphSummary.memory_nodes}
- Connexions: ${graphSummary.total_edges}
- Connexions moyennes: ${graphSummary.avg_connections.toFixed(2)}
- Top tags: ${graphSummary.top_tags.join(', ')}

TÂCHE: Analyse et suggère:
1. Opportunités de nouvelles connexions
2. Zones sous-exploitées
3. Patterns émergents
4. Actions recommandées

Retourne JSON avec:
{
  "key_insights": ["insight1", "insight2", "insight3"],
  "suggested_connections": [{"from": "topic1", "to": "topic2", "reason": "..."}],
  "underutilized_areas": ["area1", "area2"],
  "emerging_patterns": ["pattern1", "pattern2"],
  "recommended_actions": [{"action": "...", "priority": "high|medium|low"}]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            key_insights: { type: "array", items: { type: "string" } },
            suggested_connections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  from: { type: "string" },
                  to: { type: "string" },
                  reason: { type: "string" }
                }
              }
            },
            underutilized_areas: { type: "array", items: { type: "string" } },
            emerging_patterns: { type: "array", items: { type: "string" } },
            recommended_actions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  priority: { type: "string" }
                }
              }
            }
          }
        }
      });

      setAiInsights(analysis);
    } catch (error) {
      console.error("Graph analysis error:", error);
    } finally {
      setAnalyzingGraph(false);
    }
  };

  const getTopTags = (nodes, limit) => {
    const tagCounts = {};
    nodes.forEach(node => {
      (node.data.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag);
  };

  const resetGraph = () => {
    setSearchQuery("");
    setFilterType("all");
    setZoom(1);
    setSelectedNode(null);
    setExpandedNodes(new Set());
    setAiInsights(null);
  };

  // Render graph using Canvas
  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Apply zoom
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(rect.width / 2, rect.height / 2);

    // Draw edges
    if (showEdges) {
      edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (!sourceNode || !targetNode) return;

        const isExpanded = expandedNodes.has(sourceNode.id) || expandedNodes.has(targetNode.id);
        
        ctx.beginPath();
        ctx.moveTo(sourceNode.x - rect.width / 2, sourceNode.y - rect.height / 2);
        ctx.lineTo(targetNode.x - rect.width / 2, targetNode.y - rect.height / 2);
        ctx.strokeStyle = isExpanded ? '#8b5cf6' : '#e2e8f0';
        ctx.lineWidth = isExpanded ? 2 : 1;
        if (edge.style === 'dashed') ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id;
      const isExpanded = expandedNodes.has(node.id);
      const isHovered = hoveredNode?.id === node.id;
      
      ctx.beginPath();
      ctx.arc(
        node.x - rect.width / 2,
        node.y - rect.height / 2,
        node.size / 2,
        0,
        2 * Math.PI
      );
      
      // Gradient fill
      const gradient = ctx.createRadialGradient(
        node.x - rect.width / 2, node.y - rect.height / 2, 0,
        node.x - rect.width / 2, node.y - rect.height / 2, node.size / 2
      );
      gradient.addColorStop(0, node.color);
      gradient.addColorStop(1, node.color + '80');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Border
      if (isSelected || isExpanded || isHovered) {
        ctx.strokeStyle = isSelected ? '#8b5cf6' : '#6366f1';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Label
      if (isExpanded || isHovered || zoom > 1.5) {
        ctx.fillStyle = '#1e293b';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          node.label,
          node.x - rect.width / 2,
          node.y - rect.height / 2 + node.size / 2 + 15
        );
      }
    });

    ctx.restore();
  }, [nodes, edges, zoom, selectedNode, expandedNodes, hoveredNode, showEdges]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Rechercher dans le graphe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="all">Tous les nœuds</option>
              <option value="knowledge">Connaissances</option>
              <option value="memory">Mémoires</option>
              <option value="external">Sources externes</option>
            </select>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEdges(!showEdges)}
            >
              {showEdges ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>

            <Button size="sm" variant="outline" onClick={() => setZoom(z => Math.min(z + 0.25, 3))}>
              <ZoomIn className="w-4 h-4" />
            </Button>

            <Button size="sm" variant="outline" onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}>
              <ZoomOut className="w-4 h-4" />
            </Button>

            <Button size="sm" variant="outline" onClick={resetGraph}>
              <RefreshCw className="w-4 h-4" />
            </Button>

            <Button
              size="sm"
              onClick={analyzeGraphWithAI}
              disabled={analyzingGraph || nodes.length === 0}
              className="bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              {analyzingGraph ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Analyser (IA)
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4 text-sm">
          <Badge variant="outline">
            <Network className="w-3 h-3 mr-1" />
            {nodes.length} nœuds
          </Badge>
          <Badge variant="outline">
            <Link2 className="w-3 h-3 mr-1" />
            {edges.length} connexions
          </Badge>
          <Badge variant="outline">
            <Database className="w-3 h-3 mr-1" />
            {nodes.filter(n => n.type === 'knowledge').length} KB
          </Badge>
          <Badge variant="outline">
            <Brain className="w-3 h-3 mr-1" />
            {nodes.filter(n => n.type === 'memory').length} mémoires
          </Badge>
        </div>
      </Card>

      {/* AI Insights */}
      <AnimatePresence>
        {aiInsights && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900">Insights IA</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Découvertes Clés:</h4>
                  <ul className="space-y-1">
                    {aiInsights.key_insights?.map((insight, i) => (
                      <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                {aiInsights.suggested_connections?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Connexions Suggérées:</h4>
                    <div className="space-y-2">
                      {aiInsights.suggested_connections.slice(0, 3).map((conn, i) => (
                        <div key={i} className="bg-white rounded p-2 text-xs">
                          <div className="font-medium">{conn.from} → {conn.to}</div>
                          <div className="text-slate-600 mt-1">{conn.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {aiInsights.recommended_actions?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Actions Recommandées:</h4>
                    <div className="space-y-1">
                      {aiInsights.recommended_actions.map((action, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Badge className={
                            action.priority === 'high' ? 'bg-red-500' :
                            action.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                          }>
                            {action.priority}
                          </Badge>
                          <span className="text-slate-700">{action.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Graph Canvas */}
      <Card className="p-0 overflow-hidden" style={{ height: '600px' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          onClick={(e) => {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / zoom;
            const y = (e.clientY - rect.top - rect.height / 2) / zoom;
            
            const clickedNode = nodes.find(node => {
              const dx = node.x - rect.width / 2 - x;
              const dy = node.y - rect.height / 2 - y;
              return Math.sqrt(dx * dx + dy * dy) < node.size / 2;
            });
            
            if (clickedNode) handleNodeClick(clickedNode);
          }}
          onMouseMove={(e) => {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / zoom;
            const y = (e.clientY - rect.top - rect.height / 2) / zoom;
            
            const hovered = nodes.find(node => {
              const dx = node.x - rect.width / 2 - x;
              const dy = node.y - rect.height / 2 - y;
              return Math.sqrt(dx * dx + dy * dy) < node.size / 2;
            });
            
            setHoveredNode(hovered || null);
          }}
        />
      </Card>

      {/* Selected Node Details */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900">{selectedNode.label}</h3>
                  <Badge className="mt-1" style={{ backgroundColor: selectedNode.color }}>
                    {selectedNode.type}
                  </Badge>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setSelectedNode(null)}>
                  ×
                </Button>
              </div>

              <div className="text-sm text-slate-600 space-y-2">
                <p>{selectedNode.data.content?.slice(0, 200)}...</p>
                
                {selectedNode.data.tags && (
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.data.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200">
                  <div className="text-xs text-slate-500">
                    Connexions: {edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}