import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Brain, BookOpen, Database, Zap, FileText, Link as LinkIcon, Type } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const sourceIcons = {
  file: FileText,
  url: LinkIcon,
  text: Type,
  memory: Brain
};

export default function KnowledgeGraph({ knowledgeBases, memories }) {
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (!knowledgeBases || !memories) return;

    // Create nodes for knowledge bases
    const kbNodes = knowledgeBases.map((kb, idx) => ({
      id: `kb-${kb.id}`,
      label: kb.title,
      type: 'knowledge',
      sourceType: kb.source_type,
      data: kb,
      x: 0,
      y: 0,
      tags: kb.tags || []
    }));

    // Create nodes for memories
    const memoryNodes = memories
      .filter(m => m.importance >= 6)
      .slice(0, 20)
      .map((mem, idx) => ({
        id: `mem-${mem.id}`,
        label: mem.content.slice(0, 30) + '...',
        type: 'memory',
        data: mem,
        x: 0,
        y: 0,
        tags: mem.tags || []
      }));

    const allNodes = [...kbNodes, ...memoryNodes];

    // Create edges based on shared tags
    const edgeList = [];
    for (let i = 0; i < allNodes.length; i++) {
      for (let j = i + 1; j < allNodes.length; j++) {
        const node1 = allNodes[i];
        const node2 = allNodes[j];
        const sharedTags = node1.tags.filter(tag => node2.tags.includes(tag));
        
        if (sharedTags.length > 0) {
          edgeList.push({
            from: node1.id,
            to: node2.id,
            strength: sharedTags.length,
            tags: sharedTags
          });
        }
      }
    }

    // Position nodes using force-directed layout simulation
    positionNodes(allNodes, edgeList);

    setNodes(allNodes);
    setEdges(edgeList);
  }, [knowledgeBases, memories]);

  const positionNodes = (nodeList, edgeList) => {
    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;

    // Initialize positions in a circle
    nodeList.forEach((node, i) => {
      const angle = (i / nodeList.length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.35;
      node.x = centerX + radius * Math.cos(angle);
      node.y = centerY + radius * Math.sin(angle);
    });

    // Simple force simulation (simplified for performance)
    for (let iteration = 0; iteration < 50; iteration++) {
      // Repulsion between all nodes
      for (let i = 0; i < nodeList.length; i++) {
        for (let j = i + 1; j < nodeList.length; j++) {
          const node1 = nodeList[i];
          const node2 = nodeList[j];
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 1000 / (distance * distance);
          
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          node1.x -= fx;
          node1.y -= fy;
          node2.x += fx;
          node2.y += fy;
        }
      }

      // Attraction along edges
      edgeList.forEach(edge => {
        const node1 = nodeList.find(n => n.id === edge.from);
        const node2 = nodeList.find(n => n.id === edge.to);
        if (!node1 || !node2) return;

        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = distance * 0.01 * edge.strength;
        
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        
        node1.x += fx;
        node1.y += fy;
        node2.x -= fx;
        node2.y -= fy;
      });

      // Center gravity
      nodeList.forEach(node => {
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        node.x += dx * 0.01;
        node.y += dy * 0.01;
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodes.length === 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw edges
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.lineWidth = 1;
    edges.forEach(edge => {
      const node1 = nodes.find(n => n.id === edge.from);
      const node2 = nodes.find(n => n.id === edge.to);
      if (!node1 || !node2) return;

      ctx.beginPath();
      ctx.moveTo(node1.x, node1.y);
      ctx.lineTo(node2.x, node2.y);
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id;
      const radius = isSelected ? 12 : 8;
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      
      if (node.type === 'knowledge') {
        ctx.fillStyle = isSelected ? 'rgb(99, 102, 241)' : 'rgb(139, 92, 246)';
      } else {
        ctx.fillStyle = isSelected ? 'rgb(236, 72, 153)' : 'rgb(251, 113, 133)';
      }
      ctx.fill();
      
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node label (only for selected)
      if (isSelected) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.font = '12px sans-serif';
        const text = node.label.slice(0, 30);
        const textWidth = ctx.measureText(text).width;
        ctx.fillRect(node.x - textWidth / 2 - 4, node.y + 20, textWidth + 8, 20);
        ctx.fillStyle = 'white';
        ctx.fillText(text, node.x - textWidth / 2, node.y + 34);
      }
    });
  }, [nodes, edges, selectedNode]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked node
    const clickedNode = nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 12;
    });

    setSelectedNode(clickedNode || null);
  };

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <p>Pas assez de données pour générer un graphe de connaissances</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-purple-500" />
          <span className="text-slate-600">Base de Connaissances</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-pink-400" />
          <span className="text-slate-600">Mémoires</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-px bg-purple-300" />
          <span className="text-slate-600">Relations (tags partagés)</span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-96 bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl border border-slate-200 cursor-pointer"
        />
        
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <Card className="p-4 bg-white/95 backdrop-blur-xl border-purple-200">
              <div className="flex items-start gap-3">
                {selectedNode.type === 'knowledge' ? (
                  (() => {
                    const Icon = sourceIcons[selectedNode.sourceType] || BookOpen;
                    return (
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    );
                  })()
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {selectedNode.data.title || selectedNode.data.content?.slice(0, 50)}
                  </h4>
                  {selectedNode.data.summary && (
                    <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                      {selectedNode.data.summary}
                    </p>
                  )}
                  {selectedNode.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedNode.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-3">
          <div className="text-2xl font-bold text-purple-600">
            {nodes.filter(n => n.type === 'knowledge').length}
          </div>
          <div className="text-xs text-slate-600">Sources</div>
        </Card>
        <Card className="p-3">
          <div className="text-2xl font-bold text-pink-600">
            {nodes.filter(n => n.type === 'memory').length}
          </div>
          <div className="text-xs text-slate-600">Mémoires</div>
        </Card>
        <Card className="p-3">
          <div className="text-2xl font-bold text-indigo-600">
            {edges.length}
          </div>
          <div className="text-xs text-slate-600">Connexions</div>
        </Card>
        <Card className="p-3">
          <div className="text-2xl font-bold text-blue-600">
            {[...new Set(nodes.flatMap(n => n.tags))].length}
          </div>
          <div className="text-xs text-slate-600">Tags uniques</div>
        </Card>
      </div>
    </div>
  );
}