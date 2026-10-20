import * as THREE from 'three';
import { createTechnician } from './avatar3d';

/* ------------------------------------------------------------------ *
 *  Mapa 3D del astillero (estilo "maqueta" de exploración).
 *  Isla procedural con agua, árboles y rocas, y cinco accesos
 *  (uno por sesión) marcados con una baliza dorada.
 * ------------------------------------------------------------------ */

export type GateKind = 'workshop' | 'pier' | 'mast' | 'bilge' | 'yard';

export interface GateDef {
  levelId: number;
  title: string;
  place: string;
  x: number;
  z: number;
  kind: GateKind;
}

export const GATES: GateDef[] = [
  { levelId: 1, title: 'Sesión 1', place: 'Taller', x: -17, z: -8, kind: 'workshop' },
  { levelId: 2, title: 'Sesión 2', place: 'Muelle', x: 12, z: -20, kind: 'pier' },
  { levelId: 3, title: 'Sesión 3', place: 'Palo Mayor', x: 22, z: 6, kind: 'mast' },
  { levelId: 4, title: 'Sesión 4', place: 'Sentina', x: -4, z: 20, kind: 'bilge' },
  { levelId: 5, title: 'Sesión 5', place: 'Varadero', x: -24, z: 14, kind: 'yard' }
];

const ISLAND_R = 60;
const WATER_LIMIT = 0.3;
const WALK_SPEED = 7; // unidades por segundo
const WORLD_HALF = 58;
const TERRAIN_SIZE = 150;
const TERRAIN_SEGMENTS = 150;

/* ---------- Ruido y alturas ---------- */

function hash(ix: number, iz: number): number {
  const s = Math.sin(ix * 127.1 + iz * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function valueNoise(x: number, z: number): number {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx);
  const uz = fz * fz * (3 - 2 * fz);
  const a = hash(ix, iz);
  const b = hash(ix + 1, iz);
  const c = hash(ix, iz + 1);
  const d = hash(ix + 1, iz + 1);
  const top = a + (b - a) * ux;
  const bottom = c + (d - c) * ux;
  return top + (bottom - top) * uz; // 0..1
}

/** Ruido fractal en aproximadamente -1..1 */
function fbm(x: number, z: number): number {
  let v = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 4; i++) {
    v += amp * valueNoise(x * freq, z * freq);
    freq *= 2;
    amp *= 0.5;
  }
  return (v / 0.9375 - 0.5) * 2;
}

function rawHeight(x: number, z: number): number {
  const r = Math.hypot(x, z) / ISLAND_R;
  const dome = (1 - r * r) * 7 - 1.5;
  return dome + fbm(x * 0.05, z * 0.05) * 4 + fbm(x * 0.14 + 7, z * 0.14 - 3) * 1.2;
}

// Plataformas planas alrededor de cada acceso para que el edificio se asiente bien
const PLATEAUS = GATES.map((g) => ({
  x: g.x,
  z: g.z,
  h: Math.max(2.4, rawHeight(g.x, g.z))
}));

export function heightAt(x: number, z: number): number {
  let h = rawHeight(x, z);
  for (const p of PLATEAUS) {
    const d2 = (x - p.x) * (x - p.x) + (z - p.z) * (z - p.z);
    const w = Math.exp(-d2 / (2 * 4.5 * 4.5));
    h = h * (1 - w) + p.h * w;
  }
  return h;
}

/* ---------- Colores ---------- */

const C_DEEP = new THREE.Color('#2a7fa6');
const C_SAND = new THREE.Color('#ead9a6');
const C_GRASS_LIGHT = new THREE.Color('#7fb35a');
const C_GRASS_DARK = new THREE.Color('#3f8a3f');
const C_ROCK = new THREE.Color('#8f7d68');

function terrainColor(x: number, z: number, h: number, out: THREE.Color): void {
  if (h < 0) {
    out.copy(C_DEEP).lerp(C_SAND, THREE.MathUtils.clamp((h + 1.5) / 1.5, 0, 1));
  } else if (h < 0.7) {
    out.copy(C_SAND);
  } else if (h < 1.8) {
    out.copy(C_SAND).lerp(C_GRASS_LIGHT, (h - 0.7) / 1.1);
  } else if (h < 4.5) {
    const t = fbm(x * 0.08, z * 0.08) * 0.5 + 0.5;
    out.copy(C_GRASS_LIGHT).lerp(C_GRASS_DARK, t);
  } else {
    out.copy(C_GRASS_DARK).lerp(C_ROCK, THREE.MathUtils.clamp((h - 4.5) / 2.2, 0, 1));
  }
  // Ligera variación para dar aspecto pintado
  const tint = 1 + fbm(x * 0.4, z * 0.4) * 0.05;
  out.multiplyScalar(tint);
}

/* ---------- Aleatoriedad determinista ---------- */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- Escena ---------- */

interface GateRuntime {
  def: GateDef;
  beaconMat: THREE.MeshBasicMaterial;
  ringMat: THREE.MeshBasicMaterial;
  labelCanvas: HTMLCanvasElement;
  labelTex: THREE.CanvasTexture;
  done: boolean;
}

export interface OverworldCallbacks {
  onNearGate: (levelId: number | null) => void;
}

export class Overworld {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private player = new THREE.Group();
  private legL!: THREE.Mesh;
  private legR!: THREE.Mesh;
  private gates: GateRuntime[] = [];
  private water!: THREE.Mesh;
  private beaconsPulse = 0;
  private walkPhase = 0;
  private yaw = 0;
  private nearId: number | null = null;
  private animId = 0;
  private lastTime = performance.now();
  private disposed = false;
  private paused = false;
  private keys: Record<string, boolean>;
  private callbacks: OverworldCallbacks;
  private tmpColor = new THREE.Color();

  constructor(
    canvas: HTMLCanvasElement,
    keys: Record<string, boolean>,
    callbacks: OverworldCallbacks,
    spawnLevelId: number | null
  ) {
    this.keys = keys;
    this.callbacks = callbacks;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene.background = new THREE.Color('#9fd3f0');
    this.scene.fog = new THREE.Fog('#bfe3f5', 90, 230);

    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 500);

    this.buildLights();
    this.buildTerrain();
    this.buildWater();
    this.buildVegetation();
    this.buildGates();
    this.buildPlayer();

    const spawn = GATES.find((g) => g.levelId === spawnLevelId) ?? GATES[0];
    this.player.position.set(spawn.x + 3.2, 0, spawn.z + 3.2);
    this.player.position.y = heightAt(this.player.position.x, this.player.position.z);

    this.resize();
    this.loop = this.loop.bind(this);
    this.animId = requestAnimationFrame(this.loop);
  }

  /* ----- Construcción ----- */

  private buildLights(): void {
    const hemi = new THREE.HemisphereLight('#d7f0ff', '#3d6b2e', 1.0);
    this.scene.add(hemi);

    const sun = new THREE.DirectionalLight('#fff1d6', 2.4);
    sun.position.set(40, 70, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -70;
    sun.shadow.camera.right = 70;
    sun.shadow.camera.top = 70;
    sun.shadow.camera.bottom = -70;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 220;
    sun.shadow.bias = -0.0008;
    this.scene.add(sun);
  }

  private buildTerrain(): void {
    const geo = new THREE.PlaneGeometry(
      TERRAIN_SIZE,
      TERRAIN_SIZE,
      TERRAIN_SEGMENTS,
      TERRAIN_SEGMENTS
    );
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = heightAt(x, z);
      pos.setY(i, h);
      terrainColor(x, z, h, this.tmpColor);
      colors[i * 3] = this.tmpColor.r;
      colors[i * 3 + 1] = this.tmpColor.g;
      colors[i * 3 + 2] = this.tmpColor.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    this.scene.add(mesh);
  }

  private buildWater(): void {
    const geo = new THREE.CircleGeometry(220, 64);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({
      color: '#1f7fb5',
      roughness: 0.18,
      metalness: 0.1,
      transparent: true,
      opacity: 0.86
    });
    this.water = new THREE.Mesh(geo, mat);
    this.water.position.y = 0;
    this.water.receiveShadow = true;
    this.scene.add(this.water);
  }

  private buildVegetation(): void {
    const rnd = mulberry32(20261014);
    const treePositions: { x: number; y: number; z: number; s: number }[] = [];
    const rockPositions: { x: number; y: number; z: number; s: number }[] = [];

    const nearGate = (x: number, z: number, d: number) =>
      GATES.some((g) => Math.hypot(g.x - x, g.z - z) < d);

    let attempts = 0;
    while (treePositions.length < 170 && attempts < 4000) {
      attempts++;
      const x = (rnd() * 2 - 1) * 50;
      const z = (rnd() * 2 - 1) * 50;
      const h = heightAt(x, z);
      if (h < 1.3 || h > 4.3) continue;
      if (Math.hypot(x, z) > 48 || nearGate(x, z, 7)) continue;
      treePositions.push({ x, y: h, z, s: 0.8 + rnd() * 0.6 });
    }

    attempts = 0;
    while (rockPositions.length < 60 && attempts < 4000) {
      attempts++;
      const x = (rnd() * 2 - 1) * 55;
      const z = (rnd() * 2 - 1) * 55;
      const h = heightAt(x, z);
      if (h < 0.5 || Math.hypot(x, z) > 52 || nearGate(x, z, 6)) continue;
      rockPositions.push({ x, y: h, z, s: 0.6 + rnd() * 1.2 });
    }

    // Troncos
    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.3, 6);
    trunkGeo.translate(0, 0.65, 0);
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#6b4a2e', roughness: 0.9 });
    const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, treePositions.length);
    trunks.castShadow = true;

    // Copas
    const crownGeo = new THREE.IcosahedronGeometry(1, 0);
    const crownMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8, flatShading: true });
    const crowns = new THREE.InstancedMesh(crownGeo, crownMat, treePositions.length);
    crowns.castShadow = true;
    crowns.receiveShadow = true;

    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const greens = ['#2f7d32', '#3c8f3a', '#2a6e2f', '#4a9a3f'].map((c) => new THREE.Color(c));

    treePositions.forEach((t, i) => {
      scale.set(t.s, t.s, t.s);
      m.compose(new THREE.Vector3(t.x, t.y, t.z), q, scale);
      trunks.setMatrixAt(i, m);

      const crownScale = new THREE.Vector3(1.3 * t.s, 1.5 * t.s, 1.3 * t.s);
      m.compose(new THREE.Vector3(t.x, t.y + 1.9 * t.s, t.z), q, crownScale);
      crowns.setMatrixAt(i, m);
      crowns.setColorAt(i, greens[i % greens.length]);
    });
    trunks.instanceMatrix.needsUpdate = true;
    crowns.instanceMatrix.needsUpdate = true;
    if (crowns.instanceColor) crowns.instanceColor.needsUpdate = true;
    this.scene.add(trunks, crowns);

    // Rocas
    const rockGeo = new THREE.DodecahedronGeometry(0.9, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: '#8c8a86', roughness: 0.95, flatShading: true });
    const rocks = new THREE.InstancedMesh(rockGeo, rockMat, rockPositions.length);
    rocks.castShadow = true;
    rocks.receiveShadow = true;
    rockPositions.forEach((r, i) => {
      scale.set(r.s, r.s * 0.6, r.s);
      m.compose(new THREE.Vector3(r.x, r.y + 0.1, r.z), q, scale);
      rocks.setMatrixAt(i, m);
    });
    rocks.instanceMatrix.needsUpdate = true;
    this.scene.add(rocks);
  }

  private buildGates(): void {
    const wallColors: Record<GateKind, string> = {
      workshop: '#e8e1d0',
      pier: '#d9c39a',
      mast: '#f1efe9',
      bilge: '#c9d6dc',
      yard: '#e6d2b0'
    };

    for (const def of GATES) {
      const group = new THREE.Group();
      const baseY = heightAt(def.x, def.z);
      group.position.set(def.x, baseY, def.z);

      // Edificio
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(3.4, 2.6, 3.4),
        new THREE.MeshStandardMaterial({ color: wallColors[def.kind], roughness: 0.75 })
      );
      body.position.y = 1.3;
      body.castShadow = true;
      body.receiveShadow = true;

      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(2.9, 1.7, 4),
        new THREE.MeshStandardMaterial({ color: '#b5452e', roughness: 0.6 })
      );
      roof.position.y = 3.45;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;

      const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 1.5, 0.1),
        new THREE.MeshStandardMaterial({ color: '#2c3e50', roughness: 0.6 })
      );
      door.position.set(0, 0.75, 1.72);

      group.add(body, roof, door);

      // Props específicos por tipo de sesión
      this.addGateProp(group, def.kind);

      // Baliza dorada
      const beaconMat = new THREE.MeshBasicMaterial({
        color: '#ffd34d',
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });
      const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 1.1, 16, 20, 1, true), beaconMat);
      beacon.position.y = 8;
      group.add(beacon);

      // Anillo en el suelo
      const ringMat = new THREE.MeshBasicMaterial({
        color: '#ffd34d',
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const ring = new THREE.Mesh(new THREE.RingGeometry(3.6, 4.1, 56), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.08;
      group.add(ring);

      // Etiqueta
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 512;
      labelCanvas.height = 170;
      const labelTex = new THREE.CanvasTexture(labelCanvas);
      labelTex.colorSpace = THREE.SRGBColorSpace;
      const label = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthTest: false })
      );
      label.scale.set(6.4, 2.1, 1);
      label.position.y = 7.4;
      label.renderOrder = 10;
      group.add(label);

      this.scene.add(group);

      const runtime: GateRuntime = { def, beaconMat, ringMat, labelCanvas, labelTex, done: false };
      this.gates.push(runtime);
      this.drawLabel(runtime);
    }
  }

  private addGateProp(group: THREE.Group, kind: GateKind): void {
    const wood = new THREE.MeshStandardMaterial({ color: '#8a5a33', roughness: 0.85 });
    const dark = new THREE.MeshStandardMaterial({ color: '#4a3424', roughness: 0.9 });

    const crate = (x: number, y: number, z: number, s = 1) => {
      const c = new THREE.Mesh(new THREE.BoxGeometry(0.9 * s, 0.9 * s, 0.9 * s), wood);
      c.position.set(x, y, z);
      c.castShadow = true;
      group.add(c);
    };

    switch (kind) {
      case 'workshop':
      case 'yard':
        crate(-2.3, 0.45, 1.6);
        crate(-2.3, 1.35, 1.6, 0.9);
        crate(2.2, 0.45, 1.8, 1.1);
        break;
      case 'pier': {
        // Bolardo de amarre
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 1.2, 10), dark);
        post.position.set(2.4, 0.6, 2.2);
        post.castShadow = true;
        group.add(post);
        break;
      }
      case 'mast': {
        // Palo mayor con bandera
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 9, 10), wood);
        pole.position.set(-2.4, 4.5, 2.2);
        pole.castShadow = true;
        group.add(pole);
        const flag = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 0.9, 0.05),
          new THREE.MeshStandardMaterial({ color: '#e0523d' })
        );
        flag.position.set(-1.6, 8.2, 2.2);
        group.add(flag);
        break;
      }
      case 'bilge': {
        // Bidones de residuos
        for (const [dx, dz] of [[-2.2, 1.9], [-1.2, 2.2]]) {
          const drum = new THREE.Mesh(
            new THREE.CylinderGeometry(0.45, 0.45, 1.1, 12),
            new THREE.MeshStandardMaterial({ color: '#f2b232', roughness: 0.5 })
          );
          drum.position.set(dx, 0.55, dz);
          drum.castShadow = true;
          group.add(drum);
        }
        break;
      }
    }
  }

  private drawLabel(g: GateRuntime): void {
    const c = g.labelCanvas;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = 'rgba(2,6,23,0.88)';
    ctx.strokeStyle = g.done ? '#4ade80' : '#fbbf24';
    ctx.lineWidth = 6;
    const r = 26;
    ctx.beginPath();
    ctx.moveTo(r, 6);
    ctx.lineTo(c.width - r, 6);
    ctx.quadraticCurveTo(c.width - 6, 6, c.width - 6, r);
    ctx.lineTo(c.width - 6, c.height - r);
    ctx.quadraticCurveTo(c.width - 6, c.height - 6, c.width - r, c.height - 6);
    ctx.lineTo(r, c.height - 6);
    ctx.quadraticCurveTo(6, c.height - 6, 6, c.height - r);
    ctx.lineTo(6, r);
    ctx.quadraticCurveTo(6, 6, r, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = g.done ? '#bbf7d0' : '#fde68a';
    ctx.font = 'bold 54px system-ui, sans-serif';
    ctx.fillText(`${g.def.title}${g.done ? ' ✔' : ''}`, c.width / 2, 72);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '40px system-ui, sans-serif';
    ctx.fillText(g.def.place, c.width / 2, 132);
    g.labelTex.needsUpdate = true;
  }

  private buildPlayer(): void {
    const av = createTechnician();
    this.player = av.group;
    this.legL = av.legL;
    this.legR = av.legR;
    this.scene.add(this.player);
  }

  /* ----- Ciclo ----- */

  private resize(): void {
    const canvas = this.renderer.domElement;
    const w = canvas.clientWidth || 800;
    const h = canvas.clientHeight || 600;
    if (canvas.width !== Math.floor(w * this.renderer.getPixelRatio()) || canvas.height !== Math.floor(h * this.renderer.getPixelRatio())) {
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }

  private loop(now: number): void {
    if (this.disposed) return;
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    this.resize();
    this.update(dt, now / 1000);
    this.renderer.render(this.scene, this.camera);

    this.animId = requestAnimationFrame(this.loop);
  }

  private update(dt: number, t: number): void {
    const keys = this.paused ? ({} as Record<string, boolean>) : this.keys;
    const dir = new THREE.Vector3();
    if (keys['arrowup'] || keys['w']) dir.z -= 1;
    if (keys['arrowdown'] || keys['s']) dir.z += 1;
    if (keys['arrowleft'] || keys['a']) dir.x -= 1;
    if (keys['arrowright'] || keys['d']) dir.x += 1;

    const moving = dir.lengthSq() > 0;
    if (moving) {
      dir.normalize();
      const step = WALK_SPEED * dt;
      const p = this.player.position;
      const tryMove = (nx: number, nz: number): boolean => {
        if (Math.abs(nx) > WORLD_HALF || Math.abs(nz) > WORLD_HALF) return false;
        if (heightAt(nx, nz) < WATER_LIMIT) return false;
        p.x = nx;
        p.z = nz;
        return true;
      };
      // Intenta el movimiento completo; si choca con el agua, prueba cada eje por separado
      if (!tryMove(p.x + dir.x * step, p.z + dir.z * step)) {
        tryMove(p.x + dir.x * step, p.z);
        tryMove(p.x, p.z + dir.z * step);
      }

      const targetYaw = Math.atan2(dir.x, dir.z);
      let diff = targetYaw - this.yaw;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      this.yaw += diff * Math.min(1, dt * 12);
      this.player.rotation.y = this.yaw;

      this.walkPhase += dt * 12;
    } else {
      this.walkPhase *= 0.85;
    }

    const p = this.player.position;
    p.y = heightAt(p.x, p.z);
    const swing = moving ? Math.sin(this.walkPhase) * 0.6 : 0;
    this.legL.rotation.x = swing;
    this.legR.rotation.x = -swing;

    // Cámara tipo "3/4" que sigue al técnico
    const target = new THREE.Vector3(p.x, p.y + 1.2, p.z);
    const camGoal = new THREE.Vector3(p.x, p.y + 15, p.z + 17);
    this.camera.position.lerp(camGoal, 1 - Math.exp(-5 * dt));
    this.camera.lookAt(target);

    // Baliza pulsante
    this.beaconsPulse += dt;
    const pulse = 0.5 + 0.5 * Math.sin(t * 3);
    for (const g of this.gates) {
      g.beaconMat.opacity = 0.22 + pulse * 0.18;
      g.ringMat.opacity = 0.55 + pulse * 0.35;
    }

    // Agua suave
    this.water.position.y = Math.sin(t * 1.3) * 0.03;

    // Detección de acceso cercano
    let near: number | null = null;
    for (const g of this.gates) {
      const d = Math.hypot(p.x - g.def.x, p.z - g.def.z);
      if (d < 4.6) {
        near = g.def.levelId;
        break;
      }
    }
    if (near !== this.nearId) {
      this.nearId = near;
      this.callbacks.onNearGate(near);
    }
  }

  /* ----- API pública ----- */

  /** Marca qué sesiones están completadas (baliza verde y tick en la etiqueta). */
  setCompleted(levelIds: number[]): void {
    for (const g of this.gates) {
      const done = levelIds.includes(g.def.levelId);
      if (done !== g.done) {
        g.done = done;
        const color = done ? '#4ade80' : '#ffd34d';
        g.beaconMat.color.set(color);
        g.ringMat.color.set(color);
        this.drawLabel(g);
      }
    }
  }

  setPaused(p: boolean): void {
    this.paused = p;
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.animId);
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) mat.dispose();
    });
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
