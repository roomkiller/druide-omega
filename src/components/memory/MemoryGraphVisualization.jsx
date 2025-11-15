/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Memory Graph Visualization                                 ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useMemo, useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Network, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function MemoryGraphVisualization({ memories, onNodeClick }) {
  const canvasRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const graphData = useMemo(() => {
    if (!memories || memories.length === 0) return { nodes: [], edges: [] };

    const nodes = memories.slice(0, 50).map(memory => ({
      id: memory.id,
      label: memory.content?.substring(0, 30) + "..." || "Mémoire",
      type: memory.type,
      importance: memory.importance,
      tags: memory.tags || [],
      modality: memory.modality,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      vx: 0,
      vy: 0
    }));

    const edges = [];
    
    memories.slice(0, 50).forEach(memory => {
      // Direct links
      if (memory.linked_memory_ids) {
        memory.linked_memory_ids.forEach(linkedId => {
          if (nodes.find(n => n.id === linkedId)) {
            edges.push({
              source: memory.id,
              target: linkedId,
              type: "direct",
              strength: 1
            });
          }
        });
      }

      // Tag-based connections
      nodes.forEach(otherNode => {
        if (otherNode.id !== memory.id) {
          const sharedTags = (memory.tags || []).filter(tag =>
            otherNode.tags.includes(tag)
          );
          
          if (sharedTags.length >= 2) {
            edges.push({
              source: memory.id,
              target: otherNode.id,
              type: "tag",
              strength: sharedTags.length * 0.3,
              sharedTags
            });
          }
        }
      });
    });

    return { nodes, edges };
  }, [memories]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    let animationId;
    const { nodes, edges } = graphData;

    const typeColors = {
      interaction: "#3B82F6",
      fact: "#F59E0B",
      preference: "#EC4899",
      insight: "#8B5CF6",
      conversation_summary: "#10B981"
    };

    const simulate = () => {
      ctx.clearRect(0, 0, width, height);

      // Physics simulation
      nodes.forEach(node => {
        // Gravity to center
        const centerX = width / 2;
        const centerY = height / 2;
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const distToCenter = Math.sqrt(dx * dx + dy * dy);
        
        if (distToCenter > 0) {
          node.vx += (dx / distToCenter) * 0.1;
          node.vy += (dy / distToCenter) * 0.1;
        }

        // Repulsion between nodes
        nodes.forEach(other => {
          if (other.id === node.id) return;
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          
          if (dist < 150) {
            const force = (150 - dist) / dist;
            node.vx -= (dx / dist) * force * 0.3;
            node.vy -= (dy / dist) * force * 0.3;
          }
        });

        // Damping
        node.vx *= 0.9;
        node.vy *= 0.9;

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Boundary
        node.x = Math.max(40, Math.min(width - 40, node.x));
        node.y = Math.max(40, Math.min(height - 40, node.y));
      });

      // Draw edges
      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        
        if (!source || !target) return;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        
        if (edge.type === "direct") {
          ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
          ctx.lineWidth = 1;
        }
        
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach(node => {
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;
        const radius = 8 + (node.importance || 5);

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = typeColors[node.type] || "#8B5CF6";
        ctx.fill();

        if (isSelected || isHovered) {
          ctx.strokeStyle = "#1F2937";
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Label on hover or select
        if (isHovered || isSelected) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.fillRect(node.x + 15, node.y - 10, 150, 24);
          ctx.fillStyle = "#1F2937";
          ctx.font = "12px sans-serif";
          ctx.fillText(node.label, node.x + 20, node.y + 5);
        }
      });

      animationId = requestAnimationFrame(simulate);
    };

    simulate();

    // Mouse interaction
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const hovered = nodes.find(node => {
        const dx = node.x - x;
        const dy = node.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < (8 + (node.importance || 5));
      });

      setHoveredNode(hovered || null);
      canvas.style.cursor = hovered ? "pointer" : "default";
    };

    const handleClick = (e) => {
      if (hoveredNode) {
        setSelectedNode(hoveredNode);
        onNodeClick?.(memories.find(m => m.id === hoveredNode.id));
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [graphData, selectedNode, hoveredNode, memories, onNodeClick]);

  if (graphData.nodes.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
        <div className="text-center">
          <Network className="w-12 h-12 text-indigo-300 mx-auto mb-3" />
          <p className="text-slate-600">Aucune mémoire à visualiser</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-slate-900 to-indigo-900 border-indigo-300 ${isFullscreen ? 'fixed inset-4 z-50' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-white" />
          <h3 className="text-lg font-bold text-white">Graphe de Mémoires</h3>
          <Badge variant="secondary">{graphData.nodes.length} nœuds</Badge>
          <Badge variant="secondary">{graphData.edges.length} connexions</Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedNode(null)}
            className="text-white hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-white hover:bg-white/10"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={isFullscreen ? 1400 : 800}
        height={isFullscreen ? 800 : 500}
        className="w-full rounded-lg bg-slate-950"
      />

      <div className="mt-4 flex gap-2 flex-wrap">
        <Badge className="bg-blue-500 text-white">Interaction</Badge>
        <Badge className="bg-yellow-500 text-white">Fait</Badge>
        <Badge className="bg-pink-500 text-white">Préférence</Badge>
        <Badge className="bg-purple-500 text-white">Intuition</Badge>
        <Badge className="bg-green-500 text-white">Résumé</Badge>
      </div>
    </Card>
  );
}