/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║ DRUIDE_OMEGA - Knowledge Graph Visualizer                                ║
 * ║ Real-time interactive visualization of knowledge relationships            ║
 * ║ © 2025 AMG+A.L                                                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useMemo, useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function KnowledgeGraphVisualizer({ graph, title, interactive = true }) {
  const canvasRef = React.useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // Process graph data for visualization
  const graphData = useMemo(() => {
    if (!graph?.nodes || !graph?.edges) return null;

    const nodes = graph.nodes || [];
    const edges = graph.edges || [];

    // Simple force-directed layout calculation (lightweight)
    const processedNodes = nodes.map((node, idx) => ({
      ...node,
      x: (idx % 5) * 150 + 100,
      y: Math.floor(idx / 5) * 150 + 100,
      radius: 20 + (node.importance || 5) * 2
    }));

    return { nodes: processedNodes, edges };
  }, [graph]);

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !graphData) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Apply zoom and pan
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw edges
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1 / zoom;
    graphData.edges.forEach(edge => {
      const source = graphData.nodes.find(n => n.id === edge.source);
      const target = graphData.nodes.find(n => n.id === edge.target);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    graphData.nodes.forEach(node => {
      const isHovered = hoveredNode?.id === node.id;
      const isSelected = selectedNode?.id === node.id;

      // Node circle
      ctx.fillStyle = isSelected
        ? '#8b5cf6'
        : isHovered
        ? '#6366f1'
        : '#3b82f6';
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();

      // Node border
      if (isHovered || isSelected) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2 / zoom;
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = '#fff';
      ctx.font = `${12 / zoom}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label.slice(0, 15), node.x, node.y);
    });
  }, [graphData, zoom, pan, hoveredNode, selectedNode]);

  // Redraw on changes
  React.useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  const handleCanvasClick = (e) => {
    if (!interactive || !graphData) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const clicked = graphData.nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < node.radius;
    });

    setSelectedNode(clicked || null);
  };

  const handleMouseMove = (e) => {
    if (!interactive || !graphData) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const hovered = graphData.nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < node.radius;
    });

    setHoveredNode(hovered || null);
  };

  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  if (!graphData) {
    return (
      <Card className="p-6 text-center text-slate-500">
        No graph data available
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">{title || 'Knowledge Graph'}</h3>
        {interactive && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={zoomIn} title="Zoom in">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={zoomOut} title="Zoom out">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={resetView} title="Reset view">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="relative bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className={interactive ? 'cursor-grab active:cursor-grabbing' : ''}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredNode(null)}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </div>

      {selectedNode && (
        <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="font-semibold text-slate-900 mb-2">{selectedNode.label}</h4>
          <div className="space-y-1 text-sm text-slate-700">
            <p>Type: <Badge variant="outline">{selectedNode.type}</Badge></p>
            <p>Importance: {selectedNode.importance}/10</p>
            {selectedNode.source_ids?.length > 0 && (
              <p>Sources: {selectedNode.source_ids.length}</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}