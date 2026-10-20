import * as THREE from 'three';
import { buildBoat } from './props3d';

/* ------------------------------------------------------------------ *
 *  Escenarios propios de cada sesión (no pertenecen a la zona
 *  jugable): taller, palo mayor en tierra, sentina y varadero.
 * ------------------------------------------------------------------ */

function makeTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  if (g) draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function pegboardTex(): THREE.CanvasTexture {
  return makeTex(512, 256, (g, w, h) => {
    g.fillStyle = '#c9a774';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#5b4426';
    for (let x = 16; x < w; x += 32) for (let y = 16; y < h; y += 32) {
      g.beginPath();
      g.arc(x, y, 4, 0, Math.PI * 2);
      g.fill();
    }
  });
}

function doorTex(): THREE.CanvasTexture {
  return makeTex(512, 256, (g, w, h) => {
    g.fillStyle = '#f2c230';
    g.fillRect(0, 0, w, h);
    // Ventanas de cristal de la puerta enrollable
    g.fillStyle = '#7ccff0';
    for (let i = 0; i < 4; i++) {
      g.fillRect(16 + i * 124, 26, 100, 48);
      g.fillRect(16 + i * 124, 110, 100, 48);
    }
    // Lamas horizontales
    g.strokeStyle = '#c99a1c';
    g.lineWidth = 3;
    for (let y = 0; y < h; y += 32) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.stroke();
    }
  });
}

/** Cabina de muelle: trestles (caballetes de madera) que sostienen un casco en seco. */
function cradle(parent: THREE.Object3D, xs: number[], topY: number): void {
  const wood = new THREE.MeshStandardMaterial({ color: '#8a5a33', roughness: 0.9 });
  for (const x of xs) {
    const trestle = new THREE.Mesh(new THREE.BoxGeometry(0.45, topY, 1.6), wood);
    trestle.position.set(x, topY / 2, 0);
    trestle.castShadow = true;
    trestle.receiveShadow = true;
    parent.add(trestle);
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 1.8), wood);
    top.position.set(x, topY + 0.09, 0);
    top.castShadow = true;
    parent.add(top);
  }
}

/** Segmento de suelo entre dos puntos (x, z), para las líneas amarillas de seguridad. */
function floorLine(parent: THREE.Object3D, a: [number, number], b: [number, number], mat: THREE.Material): void {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const len = Math.hypot(dx, dz);
  const line = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.14), mat);
  line.rotation.x = -Math.PI / 2;
  line.rotation.z = Math.atan2(dz, dx);
  line.position.set((a[0] + b[0]) / 2, 0.012, (a[1] + b[1]) / 2);
  parent.add(line);
}

/** Taller de reparaciones, según la foto: puerta amarilla enrollable al fondo,
 *  tablero de herramientas, armario naranja con banco, estanterías, bidón y gato hidráulico. */
function workshop(parent: THREE.Group): void {
  const steel = new THREE.MeshStandardMaterial({ color: '#b9c0c6', roughness: 0.35, metalness: 0.7 });
  const red = new THREE.MeshStandardMaterial({ color: '#c0392b', roughness: 0.5 });
  const black = new THREE.MeshStandardMaterial({ color: '#1f2328', roughness: 0.6 });
  const yellow = new THREE.MeshStandardMaterial({ color: '#f2c230', roughness: 0.5, metalness: 0.2 });
  const orange = new THREE.MeshStandardMaterial({ color: '#e8702a', roughness: 0.5 });
  const wood = new THREE.MeshStandardMaterial({ color: '#9c6b3f', roughness: 0.8 });

  // Puerta enrollable amarilla en el muro frontal (z = +6.15)
  const door = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 2.9), new THREE.MeshStandardMaterial({ map: doorTex(), roughness: 0.5, metalness: 0.3 }));
  door.position.set(0, 1.45, 6.1);
  door.rotation.y = Math.PI;
  parent.add(door);
  const header = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.55, 0.3), yellow);
  header.position.set(0, 3.1, 6.0);
  header.castShadow = true;
  parent.add(header);

  // Tablero de herramientas en el muro del fondo (z = -6.15)
  const board = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.6), new THREE.MeshStandardMaterial({ map: pegboardTex(), roughness: 0.9 }));
  board.position.set(2.6, 1.5, -6.0);
  parent.add(board);
  for (let i = 0; i < 6; i++) {
    const x = 1.2 + i * 0.5;
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 8), steel);
    s.position.set(x, 1.3, -5.9);
    const h = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 10), i % 2 ? red : black);
    h.position.set(x, 1.65, -5.9);
    parent.add(s, h);
  }

  // Estantería de botes en el muro del fondo, lado izquierdo
  for (const y of [0.9, 1.5]) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.07, 0.5), wood);
    shelf.position.set(-4.4, y, -5.7);
    shelf.castShadow = true;
    parent.add(shelf);
  }
  ['#e74c3c', '#2980b9', '#f1c40f', '#27ae60', '#95a5a6'].forEach((c, i) => {
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.28, 14), new THREE.MeshStandardMaterial({ color: c, roughness: 0.4 }));
    can.position.set(-5.4 + i * 0.4, 1.09, -5.7);
    can.castShadow = true;
    parent.add(can);
  });

  // Armario naranja con cajones y banco de trabajo, lado derecho
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 0.9), orange);
  cab.position.set(5.6, 0.6, -4.6);
  cab.castShadow = true;
  parent.add(cab);
  for (let i = 0; i < 4; i++) {
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.02, 0.02), black);
    drawer.position.set(5.6, 0.25 + i * 0.27, -4.14);
    parent.add(drawer);
  }
  const bench = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 1.0), wood);
  bench.position.set(5.6, 1.24, -4.6);
  bench.castShadow = true;
  parent.add(bench);

  // Bidón verde y cubo amarillo en el lado izquierdo
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.0, 16), new THREE.MeshStandardMaterial({ color: '#1e7a46', roughness: 0.5 }));
  drum.position.set(-6.9, 0.5, 2.8);
  drum.castShadow = true;
  parent.add(drum);
  const bin = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.55, 14), yellow);
  bin.position.set(-6.2, 0.28, -1.2);
  bin.castShadow = true;
  parent.add(bin);

  // Gato hidráulico amarillo (carro de elevación) cerca de la puerta, lado derecho
  const jack = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.5), yellow);
  base.position.y = 0.2;
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 8), black);
  arm.position.set(0.2, 0.9, 0);
  arm.rotation.z = -0.5;
  jack.add(base, arm);
  jack.position.set(4.6, 0, 2.6);
  jack.castShadow = true;
  parent.add(jack);

  // Aro salvavidas rojo y blanco en el muro izquierdo
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.08, 10, 24), new THREE.MeshStandardMaterial({ color: '#f4736a', roughness: 0.5 }));
  ring.position.set(-7.95, 1.5, 0.6);
  ring.rotation.y = Math.PI / 2;
  parent.add(ring);

  // Neumático montado en el muro derecho
  const tire = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.22, 12, 28), black);
  tire.position.set(7.95, 1.9, -2.2);
  tire.rotation.y = -Math.PI / 2;
  parent.add(tire);

  // Líneas amarillas de seguridad que convergen hacia la puerta
  const lineMat = new THREE.MeshStandardMaterial({ color: '#f2c230', roughness: 0.6 });
  floorLine(parent, [-6.0, 5.9], [-1.2, -3.0], lineMat);
  floorLine(parent, [6.0, 5.9], [1.2, -3.0], lineMat);
}

/** Palo mayor: velero en tierra sobre caballetes, detrás del muro norte. */
function mastYard(parent: THREE.Group): void {
  const hull = buildBoat('#eef2f5', 'PRL 03');
  hull.scale.setScalar(2.2);
  hull.position.set(0, 0.7, -7.6);
  parent.add(hull);
  cradle(parent, [-3.4, -1.1, 1.2, 3.5], 0.7);
}

/** Sentina: interior del casco con cuadernas, tuberías y agua de sentina. */
function bilge(parent: THREE.Group): void {
  const steel = new THREE.MeshStandardMaterial({ color: '#7f8b94', roughness: 0.5, metalness: 0.6 });
  for (let x = -7; x <= 7.5; x += 2.2) {
    for (const z of [-5.95, 5.95]) {
      const frame = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.09, 8, 18, Math.PI), steel);
      frame.position.set(x, 0, z);
      frame.castShadow = true;
      parent.add(frame);
    }
  }
  const pipeColors = ['#c0392b', '#f1c40f', '#2980b9'];
  pipeColors.forEach((c, i) => {
    const pipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 16.2, 10),
      new THREE.MeshStandardMaterial({ color: c, roughness: 0.4, metalness: 0.3 })
    );
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0, 1.5 + i * 0.22, -5.75);
    pipe.castShadow = true;
    parent.add(pipe);
  });
  const pipe2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 16.2, 10),
    new THREE.MeshStandardMaterial({ color: '#7f8c8d', roughness: 0.5, metalness: 0.4 })
  );
  pipe2.rotation.z = Math.PI / 2;
  pipe2.position.set(0, 0.35, 5.75);
  parent.add(pipe2);

  const water = new THREE.MeshStandardMaterial({ color: '#1c4f6b', roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.7 });
  for (const [x, z, w, d] of [[-4.5, 3.0, 4.5, 2.2], [3.5, -2.5, 3.2, 1.8]]) {
    const puddle = new THREE.Mesh(new THREE.PlaneGeometry(w, d), water);
    puddle.rotation.x = -Math.PI / 2;
    puddle.position.set(x, 0.02, z);
    parent.add(puddle);
  }

  // Lámparas de sentina (portátiles) en las cuadernas
  for (const x of [-5, 0, 5]) {
    const lamp = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.18, 0.12),
      new THREE.MeshStandardMaterial({ color: '#fff2b0', emissive: '#fff2b0', emissiveIntensity: 1.0 })
    );
    lamp.position.set(x, 1.6, -5.88);
    parent.add(lamp);
  }
}

/** Varadero: casco en seco en el astillero, grúa de pórtico y conos de seguridad. */
function drydock(parent: THREE.Group): void {
  const hull = buildBoat('#f5f7fa', 'PRL 05');
  hull.scale.setScalar(2.3);
  hull.position.set(0, 0.7, -7.6);
  parent.add(hull);
  cradle(parent, [-3.6, -1.2, 1.2, 3.6], 0.7);

  // Pórtico de la travelift detrás del casco
  const yellow = new THREE.MeshStandardMaterial({ color: '#f2c230', roughness: 0.5, metalness: 0.3 });
  for (const x of [-7.2, 7.2]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.35, 5.0, 0.35), yellow);
    post.position.set(x, 2.5, -10.6);
    post.castShadow = true;
    parent.add(post);
  }
  const beam = new THREE.Mesh(new THREE.BoxGeometry(14.8, 0.35, 0.35), yellow);
  beam.position.set(0, 5.0, -10.6);
  beam.castShadow = true;
  parent.add(beam);

  // Conos de seguridad
  const orange = new THREE.MeshStandardMaterial({ color: '#ff6a13', roughness: 0.6 });
  for (const [x, z] of [[-6.2, 4.6], [6.2, 4.6], [-6.2, -2.6]]) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 14), orange);
    cone.position.set(x, 0.3, z);
    cone.castShadow = true;
    parent.add(cone);
  }
}

export function buildScenery(levelId: number, parent: THREE.Group): void {
  switch (levelId) {
    case 1:
      workshop(parent);
      break;
    case 3:
      mastYard(parent);
      break;
    case 4:
      bilge(parent);
      break;
    case 5:
      drydock(parent);
      break;
  }
}
