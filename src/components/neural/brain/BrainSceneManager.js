/**
 * DRUIDE_OMEGA - Gestionnaire de scène 3D du cerveau cognitif
 * Régions anatomiques, orbite souris, arcs pulsés, sélection avec mise en évidence.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { REGIONS } from './brainGraph';

const GOLD = 0xfbbf24;

export default class BrainSceneManager {
  constructor(container, graph, { onSelect, onHover }) {
    this.container = container;
    this.graph = graph;
    this.onSelect = onSelect;
    this.onHover = onHover;
    this.nodeMeshes = {};
    this.edgeLines = [];
    this.pulses = [];
    this.halos = [];
    this.activityPulses = [];
    this.activityLinks = [];
    this.selectedId = null;
    this.disposed = false;

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b1020);
    this.scene.fog = new THREE.Fog(0x0b1020, 90, 180);

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 15, 75);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.6;
    this.controls.minDistance = 20;
    this.controls.maxDistance = 150;

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(40, 60, 50);
    this.scene.add(dir);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.regionCenters = {};
    Object.entries(REGIONS).forEach(([key, region]) => {
      this.regionCenters[key] = new THREE.Vector3(...region.center);
    });

    this._loadBrainModel();
    this._buildRegions();
    this._buildNodes();
    this._buildEdges();
    this._buildHalos();

    this._onMove = (e) => this._handleMove(e);
    this._onClick = (e) => this._handleClick(e);
    this.renderer.domElement.addEventListener('pointermove', this._onMove);
    this.renderer.domElement.addEventListener('click', this._onClick);

    this._onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener('resize', this._onResize);

    this._animate();
  }

  _loadBrainModel() {
    const loader = new GLTFLoader();
    loader.load(
      'https://media.base44.com/files/public/690822fad2ea668383422834/1ca8ed6c1_Hitem3d-1783653329824.glb',
      (gltf) => {
        if (this.disposed) return;
        const model = gltf.scene;

        // Centrer et redimensionner pour englober le réseau de nœuds
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale = 70 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        // Rendu translucide pour voir le réseau à l'intérieur
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0x8fa8d8,
              emissive: 0x2a3f6e,
              emissiveIntensity: 0.25,
              transparent: true,
              opacity: 0.18,
              depthWrite: false,
              side: THREE.DoubleSide
            });
            child.renderOrder = -1;
          }
        });

        // Si le grand axe (avant-arrière) n'est pas sur Z, réorienter le modèle
        if (size.z < size.x) {
          model.rotation.y = -Math.PI / 2;
        }

        this.brainModel = model;
        this.scene.add(model);
        this._alignRegionsToModel(model);
      }
    );
  }

  _alignRegionsToModel(model) {
    // Dimensions réelles du modèle une fois placé dans la scène
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const hx = size.x / 2, hy = size.y / 2, hz = size.z / 2;

    // Placement anatomique : chaque région au bon endroit du cerveau
    this.regionCenters.knowledge = new THREE.Vector3(0, hy * 0.3, hz * 0.5);      // Lobe frontal (avant, haut)
    this.regionCenters.visual = new THREE.Vector3(0, hy * 0.2, -hz * 0.55);       // Lobe occipital (arrière)
    this.regionCenters.chat = new THREE.Vector3(-hx * 0.55, -hy * 0.1, hz * 0.1); // Lobe temporal (gauche)
    this.regionCenters.voice = new THREE.Vector3(hx * 0.55, -hy * 0.1, hz * 0.1); // Cortex auditif (droite)
    this.regionCenters.memory = new THREE.Vector3(0, -hy * 0.05, -hz * 0.05);     // Hippocampe (centre profond)
    this.regionCenters.system = new THREE.Vector3(0, -hy * 0.6, -hz * 0.2);       // Tronc cérébral (bas, arrière)

    // Reconstruire le réseau aux nouvelles positions
    this._clearGraph();
    this._buildRegions();
    this._buildNodes();
    this._buildEdges();
    this._buildHalos();
    if (this._lastFilters) this.applyFilters(this._lastFilters);
    if (this.selectedId) this.select(this.selectedId);
  }

  _clearGraph() {
    Object.values(this.nodeMeshes).forEach(m => this.scene.remove(m));
    this.nodeMeshes = {};
    this.edgeLines.forEach(({ line }) => this.scene.remove(line));
    this.edgeLines = [];
    this.pulses.forEach(p => this.scene.remove(p.mesh));
    this.pulses = [];
    this.halos.forEach(h => this.scene.remove(h));
    this.halos = [];
    if (this.regionMeshes) {
      Object.values(this.regionMeshes).forEach(env => {
        if (env.userData.label) this.scene.remove(env.userData.label);
        this.scene.remove(env);
      });
      this.regionMeshes = {};
    }
  }

  _buildRegions() {
    Object.entries(REGIONS).forEach(([key, region]) => {
      const hasNodes = this.graph.nodes.some(n => n.region === key);
      if (!hasNodes) return;
      const center = this.regionCenters[key].clone();
      const envelope = new THREE.Mesh(
        new THREE.SphereGeometry(13, 24, 24),
        new THREE.MeshBasicMaterial({ color: region.color, transparent: true, opacity: 0.18, depthWrite: false })
      );
      envelope.position.copy(center);
      envelope.userData.regionKey = key;
      this.scene.add(envelope);

      const label = this._makeLabel(region.label, region.hex);
      label.position.copy(center).add(new THREE.Vector3(0, 15, 0));
      label.userData.regionKey = key;
      this.scene.add(label);
      envelope.userData.label = label;
      if (!this.regionMeshes) this.regionMeshes = {};
      this.regionMeshes[key] = envelope;
    });
  }

  _makeLabel(text, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 96;
    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 44px sans-serif';
    ctx.fillStyle = colorHex;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 48);
    const texture = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
    sprite.scale.set(16, 3, 1);
    return sprite;
  }

  _buildNodes() {
    const golden = Math.PI * (3 - Math.sqrt(5));
    this.graph.nodes.forEach(node => {
      const region = REGIONS[node.region];
      const center = this.regionCenters[node.region].clone();
      // Hubs au centre, périphériques en surface (spirale dorée pour répartition uniforme)
      const t = node.regionCount > 1 ? node.regionRank / (node.regionCount - 1) : 0;
      const r = 2.5 + t * 9.5;
      const theta = golden * node.regionRank;
      const phi = Math.acos(1 - 2 * ((node.regionRank + 0.5) / node.regionCount));
      const pos = center.clone().add(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      ));

      const size = 0.9 + Math.min(2.5, node.connections / 4);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(size, 24, 24),
        new THREE.MeshStandardMaterial({ color: region.color, emissive: region.color, emissiveIntensity: 0.35 })
      );
      mesh.position.copy(pos);
      mesh.userData = { ...node, size };
      this.scene.add(mesh);
      this.nodeMeshes[node.id] = mesh;
    });
  }

  _buildEdges() {
    const colorLow = new THREE.Color(0x6366f1);
    const colorHigh = new THREE.Color(0xec4899);
    this.graph.edges.forEach(edge => {
      const a = this.nodeMeshes[edge.source]?.position;
      const b = this.nodeMeshes[edge.target]?.position;
      if (!a || !b) return;
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.multiplyScalar(1 + 8 / Math.max(mid.length(), 1)); // arc courbé vers l'extérieur
      const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
      const points = curve.getPoints(24);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const color = colorLow.clone().lerp(colorHigh, Math.min(1, edge.strength / 10));
      const baseOpacity = 0.15 + (edge.strength / 10) * 0.5;
      const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: baseOpacity }));
      line.userData = { ...edge, baseOpacity };
      this.scene.add(line);
      this.edgeLines.push({ line, curve, edge });

      // Impulsions nerveuses sur les liens forts
      if (edge.strength >= 7 && this.pulses.length < 15) {
        const pulse = new THREE.Mesh(
          new THREE.SphereGeometry(0.45, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
        );
        this.scene.add(pulse);
        this.pulses.push({ mesh: pulse, curve, t: Math.random(), speed: 0.002 + edge.strength * 0.0004, parentLine: line });
      }
    });
  }

  _buildHalos() {
    this.graph.topHubs.forEach(id => {
      const nodeMesh = this.nodeMeshes[id];
      if (!nodeMesh) return;
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(nodeMesh.userData.size + 1.1, 24, 24),
        new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.22, depthWrite: false })
      );
      halo.position.copy(nodeMesh.position);
      halo.userData.parentId = id;
      this.scene.add(halo);
      this.halos.push(halo);
    });
  }

  _visibleNodeMeshes() {
    return Object.values(this.nodeMeshes).filter(m => m.visible);
  }

  _raycast(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster.intersectObjects(this._visibleNodeMeshes());
  }

  _handleMove(e) {
    const hits = this._raycast(e);
    Object.values(this.nodeMeshes).forEach(m => {
      if (m.userData.id !== this.selectedId) m.material.emissiveIntensity = 0.35;
    });
    if (hits.length > 0) {
      hits[0].object.material.emissiveIntensity = 0.9;
      this.renderer.domElement.style.cursor = 'pointer';
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.onHover?.(hits[0].object.userData, { x: e.clientX - rect.left, y: e.clientY - rect.top });
    } else {
      this.renderer.domElement.style.cursor = 'grab';
      this.onHover?.(null, null);
    }
  }

  _handleClick(e) {
    const hits = this._raycast(e);
    if (hits.length > 0) this.select(hits[0].object.userData.id);
    else this.select(null);
  }

  select(id) {
    this.selectedId = id;
    const neighborIds = new Set();
    if (id) {
      (this.graph.neighbors[id] || []).forEach(n => neighborIds.add(n.id));
      neighborIds.add(id);
    }

    Object.values(this.nodeMeshes).forEach(m => {
      const dimmed = id && !neighborIds.has(m.userData.id);
      m.material.opacity = dimmed ? 0.12 : 1;
      m.material.transparent = true;
      m.material.emissiveIntensity = m.userData.id === id ? 1 : 0.35;
    });
    this.edgeLines.forEach(({ line, edge }) => {
      const connected = id && (edge.source === id || edge.target === id);
      line.material.opacity = id ? (connected ? 0.95 : 0.04) : line.userData.baseOpacity;
    });

    if (id) {
      const node = this.nodeMeshes[id]?.userData;
      this.onSelect?.({ ...node, neighbors: (this.graph.neighbors[id] || []).sort((a, b) => b.strength - a.strength) });
    } else {
      this.onSelect?.(null);
    }
  }

  applyFilters({ hiddenRegions = [], minStrength = 0 }) {
    this._lastFilters = { hiddenRegions, minStrength };
    const hidden = new Set(hiddenRegions);
    Object.values(this.nodeMeshes).forEach(m => { m.visible = !hidden.has(m.userData.region); });
    if (this.regionMeshes) {
      Object.entries(this.regionMeshes).forEach(([key, env]) => {
        env.visible = !hidden.has(key);
        if (env.userData.label) env.userData.label.visible = !hidden.has(key);
      });
    }
    this.edgeLines.forEach(({ line, edge }) => {
      const sVisible = this.nodeMeshes[edge.source]?.visible;
      const tVisible = this.nodeMeshes[edge.target]?.visible;
      line.visible = sVisible && tVisible && edge.strength >= minStrength;
    });
    this.pulses.forEach(p => { p.mesh.visible = p.parentLine.visible; });
    this.halos.forEach(h => { h.visible = this.nodeMeshes[h.userData.parentId]?.visible; });
  }

  /**
   * Illumine le passage d'information entre deux lobes :
   * salve d'impulsions + arc lumineux éphémère + flash des enveloppes régionales.
   */
  triggerActivity(fromKey, toKey) {
    if (this.disposed) return;
    const a = this.regionCenters[fromKey];
    const b = this.regionCenters[toKey];
    if (!a || !b) return;

    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.y += 12; // arc élevé au-dessus des lobes
    const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
    const color = new THREE.Color(REGIONS[toKey]?.color ?? 0xffffff);

    // Arc lumineux qui s'estompe
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(32));
    const link = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 }));
    this.scene.add(link);
    this.activityLinks.push(link);

    // Salve de 5 impulsions décalées
    for (let i = 0; i < 5; i++) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 12, 12),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 })
      );
      mesh.visible = false;
      this.scene.add(mesh);
      this.activityPulses.push({ mesh, curve, t: -i * 0.12, speed: 0.012 });
    }

    // Flash des enveloppes des deux régions
    [fromKey, toKey].forEach(k => {
      const env = this.regionMeshes?.[k];
      if (env) env.material.opacity = 0.45;
    });
  }

  setAutoRotate(enabled) { this.controls.autoRotate = enabled; }

  resetView() {
    this.camera.position.set(0, 15, 75);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  _animate() {
    if (this.disposed) return;
    requestAnimationFrame(() => this._animate());
    this.controls.update();
    this.pulses.forEach(p => {
      p.t = (p.t + p.speed) % 1;
      p.mesh.position.copy(p.curve.getPoint(p.t));
    });
    const s = 1 + Math.sin(Date.now() * 0.003) * 0.12;
    this.halos.forEach(h => h.scale.setScalar(s));

    // Impulsions d'activité inter-lobes (one-shot)
    for (let i = this.activityPulses.length - 1; i >= 0; i--) {
      const p = this.activityPulses[i];
      p.t += p.speed;
      if (p.t >= 1) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.activityPulses.splice(i, 1);
      } else if (p.t >= 0) {
        p.mesh.visible = true;
        p.mesh.position.copy(p.curve.getPoint(p.t));
      }
    }
    // Arcs lumineux qui s'estompent
    for (let i = this.activityLinks.length - 1; i >= 0; i--) {
      const link = this.activityLinks[i];
      link.material.opacity -= 0.006;
      if (link.material.opacity <= 0.02) {
        this.scene.remove(link);
        link.geometry.dispose();
        link.material.dispose();
        this.activityLinks.splice(i, 1);
      }
    }
    // Retour progressif des enveloppes flashées à leur opacité de base
    if (this.regionMeshes) {
      Object.values(this.regionMeshes).forEach(env => {
        if (env.material.opacity > 0.18) {
          env.material.opacity = Math.max(0.18, env.material.opacity - 0.003);
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    this.renderer.domElement.removeEventListener('pointermove', this._onMove);
    this.renderer.domElement.removeEventListener('click', this._onClick);
    window.removeEventListener('resize', this._onResize);
    this.controls.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}