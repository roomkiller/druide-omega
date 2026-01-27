import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader } from 'lucide-react';

export default function CognitiveNetworkVisualizer({ correlations = [] }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [stats, setStats] = useState({ nodes: 0, edges: 0, density: 0 });
  const nodesRef = useRef({});
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  useEffect(() => {
    if (!containerRef.current || correlations.length === 0) return;

    // Initialiser la scène
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Créer les nœuds (concepts uniques)
    const nodeMap = new Map();
    const nodePositions = new Map();

    correlations.forEach(corr => {
      if (!nodeMap.has(corr.source_content)) {
        nodeMap.set(corr.source_content, {
          content: corr.source_content,
          type: corr.source_modality,
          connections: 0,
          strength: 0
        });
      }
      if (!nodeMap.has(corr.target_content)) {
        nodeMap.set(corr.target_content, {
          content: corr.target_content,
          type: corr.target_modality,
          connections: 0,
          strength: 0
        });
      }

      nodeMap.get(corr.source_content).connections++;
      nodeMap.get(corr.target_content).connections++;
      nodeMap.get(corr.source_content).strength += corr.correlation_strength || 5;
      nodeMap.get(corr.target_content).strength += corr.correlation_strength || 5;
    });

    // Positionner les nœuds en cercle
    let angle = 0;
    const radius = 30;
    const nodes = Array.from(nodeMap.entries());
    const angleStep = (Math.PI * 2) / nodes.length;

    nodes.forEach(([content, data], idx) => {
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      nodePositions.set(content, { x, y });
      angle += angleStep;

      // Créer la géométrie du nœud
      const size = 1 + (data.connections / 5);
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const color = getColorByType(data.type);
      const material = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.3 });
      const node = new THREE.Mesh(geometry, material);
      node.position.set(x, y, 0);
      node.userData = { content, ...data };
      scene.add(node);

      nodesRef.current[content] = node;
    });

    // Créer les arêtes (corrélations)
    correlations.forEach(corr => {
      const source = nodePositions.get(corr.source_content);
      const target = nodePositions.get(corr.target_content);
      if (!source || !target) return;

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(
        new Float32Array([source.x, source.y, 0, target.x, target.y, 0]),
        3
      ));

      const strength = corr.correlation_strength || 5;
      const opacity = 0.3 + (strength / 10) * 0.4;
      const material = new THREE.LineBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: opacity,
        linewidth: strength / 2
      });

      const line = new THREE.Line(geometry, material);
      scene.add(line);
    });

    // Ajouter lumière
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(50, 50, 50);
    scene.add(light1);

    const light2 = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(light2);

    // Stats
    setStats({
      nodes: nodeMap.size,
      edges: correlations.length,
      density: ((correlations.length * 2) / (nodeMap.size * (nodeMap.size - 1)) * 100).toFixed(1)
    });

    // Interaction souris
    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(Object.values(nodesRef.current));

      Object.values(nodesRef.current).forEach(node => {
        node.material.emissiveIntensity = 0.3;
      });

      if (intersects.length > 0) {
        intersects[0].object.material.emissiveIntensity = 0.8;
      }
    };

    const onClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(Object.values(nodesRef.current));

      if (intersects.length > 0) {
        setSelectedNode(intersects[0].object.userData);
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotation légère
      scene.rotation.z += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [correlations]);

  const getColorByType = (type) => {
    const colors = {
      memory: 0x8b5cf6,
      knowledge: 0xf59e0b,
      chat: 0x3b82f6,
      visual: 0xec4899,
      voice: 0x10b981,
      system: 0x6b7280
    };
    return colors[type] || 0x6366f1;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 bg-blue-50 border-blue-200">
          <div className="text-xs text-blue-600">Nœuds</div>
          <div className="text-xl font-bold text-blue-700">{stats.nodes}</div>
        </Card>
        <Card className="p-3 bg-indigo-50 border-indigo-200">
          <div className="text-xs text-indigo-600">Connexions</div>
          <div className="text-xl font-bold text-indigo-700">{stats.edges}</div>
        </Card>
        <Card className="p-3 bg-purple-50 border-purple-200">
          <div className="text-xs text-purple-600">Densité</div>
          <div className="text-xl font-bold text-purple-700">{stats.density}%</div>
        </Card>
      </div>

      <div
        ref={containerRef}
        className="w-full h-96 rounded-lg border border-slate-200 bg-white relative"
      />

      {selectedNode && (
        <Card className="p-4 bg-slate-50 border-slate-200">
          <div className="font-semibold text-slate-900 mb-2">{selectedNode.content}</div>
          <div className="space-y-1 text-sm text-slate-600">
            <div>Type: <Badge>{selectedNode.type}</Badge></div>
            <div>Connexions: {selectedNode.connections}</div>
            <div>Force totale: {selectedNode.strength.toFixed(1)}</div>
          </div>
        </Card>
      )}
    </div>
  );
}