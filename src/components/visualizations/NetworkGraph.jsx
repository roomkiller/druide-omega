/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Interactive Network Graph Visualization                    ║
 * ║ © 2025 AMG+A.L - Tous droits réservés                                     ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Maximize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useVisualizationOptimization } from "./BaseVisualization";
import { getErrorLogger } from "@/components/system/ErrorLogger";

export default function NetworkGraph({ nodes, edges, title, onNodeClick }) {
  const logger = getErrorLogger();
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const animationRef = useRef(null);

  // Optimisation: mémoriser positions calculées
  const nodePositions = useMemo(() => {
    const positions = new Map();
    if (!nodes.length) return positions;
    
    nodes.forEach((node, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const radius = 150;
      positions.set(node.id, {
        x: 250 + Math.cos(angle) * radius,
        y: 250 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0
      });
    });
    return positions;
  }, [nodes]);

  useEffect(() => {
    if (!canvasRef.current || !nodes.length) return;

    const startTime = Date.now();

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const width = canvas.width = canvas.offsetWidth * 2;
      const height = canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);

      let frame = 0;
      const maxFrames = 200;

    const simulate = () => {
      frame++;
      
      // Apply forces
      nodes.forEach(node => {
        const pos = nodePositions.get(node.id);
        
        // Repulsion between nodes
        nodes.forEach(other => {
          if (node.id === other.id) return;
          const otherPos = nodePositions.get(other.id);
          const dx = pos.x - otherPos.x;
          const dy = pos.y - otherPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.1;
          const force = 500 / (dist * dist);
          pos.vx += (dx / dist) * force;
          pos.vy += (dy / dist) * force;
        });

        // Attraction along edges
        edges.forEach(edge => {
          if (edge.source === node.id) {
            const targetPos = nodePositions.get(edge.target);
            if (targetPos) {
              const dx = targetPos.x - pos.x;
              const dy = targetPos.y - pos.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              pos.vx += dx * 0.001;
              pos.vy += dy * 0.001;
            }
          }
        });

        // Center attraction
        const centerX = width / 4;
        const centerY = height / 4;
        pos.vx += (centerX - pos.x) * 0.0001;
        pos.vy += (centerY - pos.y) * 0.0001;

        // Apply velocity with damping
        pos.vx *= 0.9;
        pos.vy *= 0.9;
        pos.x += pos.vx;
        pos.y += pos.vy;
      });

      render(ctx, width / 2, height / 2, nodePositions);

      if (frame < maxFrames) {
        animationRef.current = requestAnimationFrame(simulate);
      }
    };

      simulate();

      // Log performance si lent
      const renderTime = Date.now() - startTime;
      logger.logPerformance('network_graph_render', renderTime);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } catch (error) {
      logger.log(error, {
        category: 'visualization',
        component: 'NetworkGraph',
        severity: 'error'
      });
    }
  }, [nodes, edges, nodePositions]);

  const render = (ctx, width, height, positions) => {
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    // Draw edges
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    edges.forEach(edge => {
      const sourcePos = positions.get(edge.source);
      const targetPos = positions.get(edge.target);
      if (sourcePos && targetPos) {
        ctx.beginPath();
        ctx.moveTo(sourcePos.x, sourcePos.y);
        ctx.lineTo(targetPos.x, targetPos.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const pos = positions.get(node.id);
      if (!pos) return;

      const isHovered = hoveredNode?.id === node.id;
      const radius = 8 + (node.weight || 0) * 2;

      // Node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? "#8b5cf6" : node.color || "#6366f1";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      if (isHovered || node.weight > 5) {
        ctx.fillStyle = "#1e293b";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, pos.x, pos.y - radius - 5);
      }
    });

    ctx.restore();
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const reset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900">{title}</h3>
          <Badge variant="secondary">{nodes.length} nœuds</Badge>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => setZoom(z => Math.min(3, z * 1.2))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setZoom(z => Math.max(0.5, z * 0.8))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={reset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-96 bg-slate-50 rounded-lg cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </Card>
  );
}