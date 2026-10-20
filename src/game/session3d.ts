import * as THREE from 'three';
import { createTechnician, Technician } from './avatar3d';
import { buildProp, buildBoat } from './props3d';
import { buildScenery } from './scenery3d';
import { LEVELS_DATA } from '../data/challenges';
import { Challenge, ChallengeType, LevelId, Player } from '../types/prl';

/* ------------------------------------------------------------------ *
 *  Escena 3D de cada sesión.
 *  La lógica (movimiento, retos, puntuación) sigue en App.tsx; este
 *  módulo sólo dibuja. Las coordenadas del juego (800x600 px) se
 *  convierten a unidades 3D con PX píxeles por unidad.
 * ------------------------------------------------------------------ */

const PX = 50;
const toWX = (px: number) => (px - 400) / PX;
const toWZ = (py: number) => (py - 300) / PX;

/** Zona jugable de cada sesión, en píxeles del lienzo de juego. */
export interface LevelBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const DEFAULT_BOUNDS: LevelBounds = { minX: 15, maxX: 753, minY: 55, maxY: 553 };
// Muelle: la zona jugable termina en el borde del pantalán; el mar queda fuera.
const LEVEL_BOUNDS: Record<number, LevelBounds> = {
  2: { minX: 15, maxX: 753, minY: 55, maxY: 500 }
};

export function getLevelBounds(levelId: number): LevelBounds {
  return LEVEL_BOUNDS[levelId] ?? DEFAULT_BOUNDS;
}

const DOCK_EDGE_Z = 4.6; // borde sur del pantalán en unidades 3D

type FloorKind = 'tiles' | 'planks' | 'deck' | 'steel' | 'asphalt';

interface Theme {
  floor: string;
  line: string;
  wall: string;
  stripe: string;
  sky: string;
  kind: FloorKind;
}

const THEMES: Record<number, Theme> = {
  1: { floor: '#cfcabd', line: '#b3ac9f', wall: '#e4e8ea', stripe: '#f2c230', sky: '#dfe9f0', kind: 'tiles' },
  2: { floor: '#a97a4c', line: '#7d5632', wall: '#a7d8e4', stripe: '#e0a526', sky: '#bfe6f5', kind: 'planks' },
  3: { floor: '#a8a59c', line: '#8a877f', wall: '#ece4d2', stripe: '#c0392b', sky: '#bfe3f5', kind: 'asphalt' },
  4: { floor: '#4b555d', line: '#353e46', wall: '#5d6b75', stripe: '#f2b232', sky: '#14181c', kind: 'steel' },
  5: { floor: '#7c8086', line: '#60656b', wall: '#dcd5c3', stripe: '#e53935', sky: '#c9e4f2', kind: 'asphalt' }
};

function floorTexture(theme: Theme): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 384;
  const g = c.getContext('2d');
  if (g) {
    g.fillStyle = theme.floor;
    g.fillRect(0, 0, c.width, c.height);
    g.strokeStyle = theme.line;
    g.lineWidth = 3;
    if (theme.kind === 'planks' || theme.kind === 'deck') {
      for (let x = 0; x <= c.width; x += 32) {
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x, c.height);
        g.stroke();
      }
    } else if (theme.kind === 'asphalt') {
      for (let i = 0; i < 900; i++) {
        g.fillStyle = Math.random() > 0.5 ? '#6d7177' : '#8a8e94';
        g.fillRect(Math.random() * c.width, Math.random() * c.height, 2, 2);
      }
    } else {
      for (let x = 0; x <= c.width; x += 64) {
        g.beginPath();
        g.moveTo(x, 0);
        g.lineTo(x, c.height);
        g.stroke();
      }
      for (let y = 0; y <= c.height; y += 64) {
        g.beginPath();
        g.moveTo(0, y);
        g.lineTo(c.width, y);
        g.stroke();
      }
    }
    g.fillStyle = theme.stripe;
    g.fillRect(0, 0, c.width, 10);
    g.fillRect(0, c.height - 10, c.width, 10);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function wrapWords(g: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (g.measureText(test).width <= maxW) line = test;
    else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function labelTexture(title: string, sub: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 160;
  const g = c.getContext('2d');
  if (g) {
    g.fillStyle = 'rgba(2,6,23,0.9)';
    g.fillRect(0, 0, c.width, c.height);
    g.strokeStyle = '#fbbf24';
    g.lineWidth = 6;
    g.strokeRect(6, 6, c.width - 12, c.height - 12);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const maxW = c.width - 40;
    // Ajusta el tamaño hasta que el texto quepa en dos líneas
    let size = 44;
    let titleLines: string[] = [];
    for (; size >= 22; size -= 2) {
      g.font = `bold ${size}px system-ui, sans-serif`;
      titleLines = wrapWords(g, title, maxW);
      if (titleLines.length <= 2) break;
    }
    const subSize = Math.max(20, Math.min(28, size - 12));
    g.font = `${subSize}px system-ui, sans-serif`;
    const subLines = sub ? wrapWords(g, sub, maxW).slice(0, 1) : [];
    const lineH = size * 1.15;
    const totalH = titleLines.length * lineH + subLines.length * subSize * 1.2;
    let y = c.height / 2 - totalH / 2 + lineH / 2;
    g.fillStyle = '#fde68a';
    g.font = `bold ${size}px system-ui, sans-serif`;
    for (const l of titleLines) {
      g.fillText(l, c.width / 2, y);
      y += lineH;
    }
    g.fillStyle = '#cbd5e1';
    g.font = `${subSize}px system-ui, sans-serif`;
    for (const l of subLines) {
      g.fillText(l, c.width / 2, y + subSize * 0.2);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Cabo entre dos puntos 3D. */
function addRope(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3): void {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, len, 6),
    new THREE.MeshStandardMaterial({ color: '#d8c39a', roughness: 0.9 })
  );
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  mesh.castShadow = true;
  parent.add(mesh);
}

interface PropRuntime {
  id: number;
  group: THREE.Group;
  mats: THREE.MeshStandardMaterial[];
  ring: THREE.Mesh;
  label: THREE.Sprite;
  completed: boolean;
}

interface Wounds {
  head: THREE.Object3D[];
  chest: THREE.Object3D[];
  limbs: THREE.Object3D[];
}

export class SessionWorld {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private levelGroup = new THREE.Group();
  private tech: Technician;
  private wounds: Wounds;
  private props: PropRuntime[] = [];
  private levelId = 1;
  private active = false;
  private yaw = 0;
  private walkPhase = 0;
  private lastPos = { x: NaN, y: NaN };
  private time = 0;
  private livesLostSeen = 0;
  private hurtUntil = 0;
  private flashes: { mesh: THREE.Mesh; until: number }[] = [];
  private canvas: HTMLCanvasElement;
  private hemi!: THREE.HemisphereLight;
  private sun!: THREE.DirectionalLight;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.camera = new THREE.PerspectiveCamera(40, 16 / 10, 0.1, 200);

    const hemi = new THREE.HemisphereLight('#e6f4ff', '#4a4a4a', 1.1);
    const sun = new THREE.DirectionalLight('#fff3dc', 2.2);
    this.hemi = hemi;
    this.sun = sun;
    sun.position.set(-6, 14, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -12;
    sun.shadow.camera.right = 12;
    sun.shadow.camera.top = 12;
    sun.shadow.camera.bottom = -12;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 60;
    sun.shadow.bias = -0.0007;
    this.scene.add(hemi, sun, this.levelGroup);

    this.tech = createTechnician();
    this.tech.group.scale.setScalar(0.9);
    this.scene.add(this.tech.group);
    this.wounds = this.buildWounds();

    this.setLevel(1);
  }

  private buildWounds(): Wounds {
    const white = new THREE.MeshStandardMaterial({ color: '#f5f5f5', roughness: 0.8 });
    const blood = new THREE.MeshStandardMaterial({ color: '#8b0000', roughness: 0.5, side: THREE.DoubleSide });

    const bandageHead = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.1), white);
    bandageHead.position.set(0, 1.86, 0.27);
    this.tech.group.add(bandageHead);

    const bloodChest = new THREE.Mesh(new THREE.CircleGeometry(0.13, 18), blood);
    bloodChest.position.set(0.14, 1.14, 0.366);
    const bloodChest2 = new THREE.Mesh(new THREE.CircleGeometry(0.07, 14), blood);
    bloodChest2.position.set(-0.13, 1.3, 0.36);
    this.tech.group.add(bloodChest, bloodChest2);

    const bandageArm = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.2, 12), white);
    bandageArm.position.set(0, 0.02, 0);
    this.tech.armL.add(bandageArm);

    const bloodLeg = new THREE.Mesh(new THREE.CircleGeometry(0.1, 14), blood);
    bloodLeg.position.set(0, 0.05, 0.135);
    this.tech.legR.add(bloodLeg);

    return { head: [bandageHead], chest: [bloodChest, bloodChest2], limbs: [bandageArm, bloodLeg] };
  }

  setActive(active: boolean): void {
    this.active = active;
  }

  /** Reconstruye el escenario y los retos de la sesión indicada. */
  setLevel(levelId: number): void {
    this.levelId = levelId;
    const cfg = LEVELS_DATA[levelId as LevelId];
    const theme = THEMES[levelId] ?? THEMES[1];
    const pier = levelId === 2;

    // Limpiar escena anterior
    this.levelGroup.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else if (mat) mat.dispose();
    });
    this.levelGroup.clear();
    this.props = [];
    this.flashes = [];
    this.livesLostSeen = 0;
    this.hurtUntil = 0;

    this.scene.background = new THREE.Color(theme.sky);
    this.scene.fog = new THREE.Fog(theme.sky, 26, 60);

    const floorMat = new THREE.MeshStandardMaterial({ map: floorTexture(theme), roughness: 0.85 });

    if (pier) {
      // Mar alrededor del pantalán
      const sea = new THREE.Mesh(
        new THREE.PlaneGeometry(260, 260),
        new THREE.MeshStandardMaterial({ color: '#1d7fb3', roughness: 0.2, metalness: 0.05 })
      );
      sea.rotation.x = -Math.PI / 2;
      sea.position.y = -0.3;
      sea.receiveShadow = true;
      this.levelGroup.add(sea);

      // Pantalán sin paredes: el suelo termina en el borde
      const depth = DOCK_EDGE_Z + 6;
      const dock = new THREE.Mesh(new THREE.PlaneGeometry(16, depth), floorMat);
      dock.rotation.x = -Math.PI / 2;
      dock.position.set(0, 0.005, -6 + depth / 2);
      dock.receiveShadow = true;
      this.levelGroup.add(dock);

      const woodEdge = new THREE.MeshStandardMaterial({ color: '#6b4a2b', roughness: 0.85 });
      const frontEdge = new THREE.Mesh(new THREE.BoxGeometry(16, 0.5, 0.25), woodEdge);
      frontEdge.position.set(0, -0.25, DOCK_EDGE_Z + 0.125);
      frontEdge.castShadow = true;
      this.levelGroup.add(frontEdge);
      for (const x of [-8.125, 8.125]) {
        const side = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.5, depth), woodEdge);
        side.position.set(x, -0.25, -6 + depth / 2);
        this.levelGroup.add(side);
      }

      // Pilotes del pantalán
      for (const x of [-7, -3.5, 0, 3.5, 7]) {
        const pile = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.4, 8), woodEdge);
        pile.position.set(x, -1.2, DOCK_EDGE_Z + 0.35);
        this.levelGroup.add(pile);
      }

      // Barcos amarrados al pantalán
      const boatA = buildBoat('#2e6fb7');
      boatA.position.set(-3.4, 0, 6.5);
      boatA.rotation.y = 0.12;
      const boatB = buildBoat('#1f8ad1');
      boatB.position.set(4.8, 0, 7.6);
      boatB.rotation.y = -0.2;
      boatB.scale.setScalar(0.8);
      this.levelGroup.add(boatA, boatB);

      addRope(this.levelGroup, new THREE.Vector3(-2.2, 0.8, 5.8), new THREE.Vector3(-2.2, 0.3, DOCK_EDGE_Z));
      addRope(this.levelGroup, new THREE.Vector3(-4.6, 0.8, 5.8), new THREE.Vector3(-4.6, 0.3, DOCK_EDGE_Z));
      addRope(this.levelGroup, new THREE.Vector3(4.8, 0.7, 7.0), new THREE.Vector3(4.8, 0.3, DOCK_EDGE_Z));
    } else {
      // Suelo cerrado con muros perimetrales
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      this.levelGroup.add(floor);

      const wallMat = new THREE.MeshStandardMaterial({ color: theme.wall, roughness: 0.8 });
      const stripeMat = new THREE.MeshStandardMaterial({ color: theme.stripe, roughness: 0.5 });
      const wallH = 1.8;
      const walls: [number, number, number, number][] = [
        [0, -6.15, 16.6, 0.3],
        [0, 6.15, 16.6, 0.3],
        [-8.15, 0, 0.3, 12],
        [8.15, 0, 0.3, 12]
      ];
      for (const [x, z, w, d] of walls) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(w, wallH, d), wallMat);
        wall.position.set(x, wallH / 2, z);
        wall.castShadow = true;
        wall.receiveShadow = true;
        this.levelGroup.add(wall);
        const cap = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, d), stripeMat);
        cap.position.set(x, wallH + 0.06, z);
        this.levelGroup.add(cap);
      }
      buildScenery(levelId, this.levelGroup);
    }

    // Iluminación: la sentina es un espacio cerrado y más oscuro
    this.hemi.intensity = levelId === 4 ? 0.5 : 1.1;
    this.sun.intensity = levelId === 4 ? 0.6 : 2.2;

    // Retos: el cartel sólo aparece al acercarse
    if (cfg) {
      for (const ch of cfg.challenges) {
        const { group, mats } = buildProp(ch);
        group.position.set(toWX(ch.x), 0, toWZ(ch.y));
        this.levelGroup.add(group);

        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.85, 1.05, 40),
          new THREE.MeshBasicMaterial({ color: '#ffd34d', transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false })
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(toWX(ch.x), 0.03, toWZ(ch.y));
        this.levelGroup.add(ring);

        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: labelTexture(ch.name, ch.roleOrSub ?? ''), transparent: true, depthTest: false })
        );
        sprite.scale.set(3.2, 1.0, 1);
        sprite.position.set(toWX(ch.x), 2.4, toWZ(ch.y));
        sprite.renderOrder = 10;
        sprite.visible = false;
        this.levelGroup.add(sprite);

        this.props.push({ id: ch.id, group, mats, ring, label: sprite, completed: false });
      }
    }

    this.lastPos = { x: NaN, y: NaN };
    this.resize();
  }

  /** Dibuja un frame. Lo llama el bucle de juego de App.tsx. livesLost = vidas perdidas en la sesión. */
  render(player: Player, challenges: Challenge[], nearObject: Challenge | null, livesLost = 0): void {
    if (!this.active) return;
    this.resize();
    this.time += 1 / 60;

    // Técnico
    const px = toWX(player.x + 16);
    const pz = toWZ(player.y + 16);
    this.tech.group.position.set(px, 0, pz);
    if (!isNaN(this.lastPos.x)) {
      const dx = px - this.lastPos.x;
      const dz = pz - this.lastPos.y;
      if (Math.abs(dx) + Math.abs(dz) > 0.0005) {
        const target = Math.atan2(dx, dz);
        let diff = target - this.yaw;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        this.yaw += diff * 0.25;
      }
    }
    this.lastPos = { x: px, y: pz };
    this.tech.group.rotation.y = this.yaw;

    const moving = player.isMoving;
    this.walkPhase += moving ? 0.22 : 0;
    const swing = moving ? Math.sin(this.walkPhase) * 0.6 : 0;
    this.tech.legL.rotation.x = swing;
    this.tech.legR.rotation.x = -swing;
    this.tech.armL.rotation.x = -swing * 0.8;
    this.tech.armR.rotation.x = swing * 0.8;

    // Heridas según las vidas perdidas
    if (livesLost > this.livesLostSeen) this.hurtUntil = this.time + 0.8;
    this.livesLostSeen = livesLost;
    for (const o of this.wounds.head) o.visible = livesLost >= 1;
    for (const o of this.wounds.chest) o.visible = livesLost >= 1;
    for (const o of this.wounds.limbs) o.visible = livesLost >= 2;

    // Destello rojo al recibir el golpe
    const hurt = this.time < this.hurtUntil;
    for (const m of this.tech.materials) {
      m.emissive.set(hurt ? '#ff1a1a' : '#000000');
      m.emissiveIntensity = hurt ? 0.45 + 0.25 * Math.sin(this.time * 20) : 0;
    }

    // Estado de los retos
    const pulse = 0.5 + 0.5 * Math.sin(this.time * 3);
    for (const p of this.props) {
      const data = challenges.find((c) => c.id === p.id);
      const done = !!data?.completed;
      const isNear = nearObject?.id === p.id && !done;
      if (done !== p.completed) {
        p.completed = done;
        p.ring.visible = !done;
      }
      p.label.visible = isNear;
      const emissive = done ? new THREE.Color('#22c55e') : isNear ? new THREE.Color('#ffd34d') : new THREE.Color('#000000');
      const intensity = done ? 0.35 : isNear ? 0.3 + pulse * 0.2 : 0;
      for (const m of p.mats) {
        m.emissive.copy(emissive);
        m.emissiveIntensity = intensity;
      }
      const ringMat = p.ring.material as THREE.MeshBasicMaterial;
      ringMat.opacity = 0.5 + pulse * 0.4;
    }

    // Destellos de acierto
    const now = this.time;
    this.flashes = this.flashes.filter((f) => {
      const left = f.until - now;
      if (left <= 0) {
        this.scene.remove(f.mesh);
        (f.mesh.material as THREE.Material).dispose();
        f.mesh.geometry.dispose();
        return false;
      }
      const mat = f.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, left / 1.2) * 0.9;
      f.mesh.scale.setScalar(1 + (1.2 - left) * 1.5);
      return true;
    });

    // Cámara que sigue al técnico
    const target = new THREE.Vector3(px, 1.0, pz);
    const goal = new THREE.Vector3(px, 8.5, pz + 7.5);
    this.camera.position.lerp(goal, 0.12);
    this.camera.lookAt(target);

    this.renderer.render(this.scene, this.camera);
  }

  /** Destello verde en la posición de un reto acertado. */
  flash(x: number, y: number): void {
    const geo = new THREE.RingGeometry(0.5, 0.7, 40);
    const mat = new THREE.MeshBasicMaterial({ color: '#4ade80', transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(toWX(x), 0.1, toWZ(y));
    this.scene.add(mesh);
    this.flashes.push({ mesh, until: this.time + 1.2 });
  }

  /* Compatibilidad con las llamadas de App.tsx */
  addCelebrationParticles(x: number, y: number): void {
    this.flash(x, y);
  }

  addDustParticle(_x: number, _y: number): void {
    /* El polvo de pisadas se omite en 3D */
  }

  updateParticles(): void {
    /* Animaciones gestionadas en render() */
  }

  private resize(): void {
    const w = this.canvas.clientWidth || 800;
    const h = this.canvas.clientHeight || 500;
    const pr = this.renderer.getPixelRatio();
    if (this.canvas.width !== Math.floor(w * pr) || this.canvas.height !== Math.floor(h * pr)) {
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }

  dispose(): void {
    this.setLevel(this.levelId);
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
