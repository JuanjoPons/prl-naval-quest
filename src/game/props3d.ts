import * as THREE from 'three';
import { createTechnician } from './avatar3d';
import { Challenge } from '../types/prl';

/* ------------------------------------------------------------------ *
 *  Objetos y barcos con más detalle: formas redondeadas, etiquetas
 *  con texto y pictogramas, materiales con brillo tipo pintura.
 * ------------------------------------------------------------------ */

/* ---------- Texturas dibujadas en canvas ---------- */

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

function fitFont(g: CanvasRenderingContext2D, text: string, maxW: number, start: number, weight = 'bold'): void {
  let size = start;
  g.font = `${weight} ${size}px system-ui, sans-serif`;
  while (g.measureText(text).width > maxW && size > 18) {
    size -= 4;
    g.font = `${weight} ${size}px system-ui, sans-serif`;
  }
}

/** Cartel rectangular con borde y texto (y subtítulo opcional). */
function signTex(text: string, bg: string, fg: string, sub = ''): THREE.CanvasTexture {
  return makeTex(512, 256, (g, w, h) => {
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = fg;
    g.lineWidth = 14;
    g.strokeRect(14, 14, w - 28, h - 28);
    g.fillStyle = fg;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    fitFont(g, text, w * 0.84, sub ? 84 : 96);
    g.fillText(text, w / 2, sub ? h * 0.42 : h / 2);
    if (sub) {
      fitFont(g, sub, w * 0.8, 40, 'normal');
      g.fillText(sub, w / 2, h * 0.76);
    }
  });
}

/** Rombo de pictograma de seguridad con un símbolo en el centro. */
function diamondTex(symbol: string, bg: string, fg: string): THREE.CanvasTexture {
  return makeTex(256, 256, (g, w, h) => {
    g.translate(w / 2, h / 2);
    g.rotate(Math.PI / 4);
    g.fillStyle = bg;
    g.fillRect(-88, -88, 176, 176);
    g.strokeStyle = '#111';
    g.lineWidth = 8;
    g.strokeRect(-88, -88, 176, 176);
    g.rotate(-Math.PI / 4);
    g.translate(-w / 2, -h / 2);
    g.fillStyle = fg;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = 'bold 110px system-ui, sans-serif';
    g.fillText(symbol, w / 2, h / 2 + 6);
  });
}

function woodTex(base: string, line: string): THREE.CanvasTexture {
  return makeTex(256, 256, (g, w, h) => {
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);
    g.strokeStyle = line;
    for (let i = 0; i < 40; i++) {
      g.globalAlpha = 0.25 + Math.random() * 0.3;
      g.lineWidth = 1 + Math.random() * 2;
      const y = Math.random() * h;
      g.beginPath();
      g.moveTo(0, y);
      g.bezierCurveTo(w * 0.3, y + (Math.random() - 0.5) * 20, w * 0.7, y + (Math.random() - 0.5) * 20, w, y);
      g.stroke();
    }
    g.globalAlpha = 1;
  });
}

function stripeTex(c1: string, c2: string): THREE.CanvasTexture {
  return makeTex(256, 256, (g, w, h) => {
    g.fillStyle = c1;
    g.fillRect(0, 0, w, h);
    g.fillStyle = c2;
    for (let x = -h; x < w + h; x += 64) {
      g.beginPath();
      g.moveTo(x, h);
      g.lineTo(x + 32, h);
      g.lineTo(x + 32 + h, 0);
      g.lineTo(x + h, 0);
      g.closePath();
      g.fill();
    }
  });
}

function panelTex(lines: { title: string; text: string; color: string }[]): THREE.CanvasTexture {
  return makeTex(512, 512, (g, w, h) => {
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = '#1f2937';
    g.lineWidth = 12;
    g.strokeRect(12, 12, w - 24, h - 24);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    lines.forEach((l, i) => {
      const y = 90 + i * 150;
      g.fillStyle = l.color;
      g.fillRect(40, y - 52, w - 80, 14);
      g.fillStyle = '#111827';
      fitFont(g, l.title, w * 0.84, 60);
      g.fillText(l.title, w / 2, y);
      g.font = '30px system-ui, sans-serif';
      g.fillText(l.text, w / 2, y + 50);
    });
  });
}

/* ---------- Constructor de props ---------- */

class PropBuilder {
  group = new THREE.Group();
  mats: THREE.MeshStandardMaterial[] = [];

  m(color: string, rough = 0.6, metal = 0): THREE.MeshStandardMaterial {
    const mm = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
    this.mats.push(mm);
    return mm;
  }

  mt(map: THREE.Texture, rough = 0.6): THREE.MeshStandardMaterial {
    const mm = new THREE.MeshStandardMaterial({ map, roughness: rough });
    this.mats.push(mm);
    return mm;
  }

  mesh(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, parent?: THREE.Object3D): THREE.Mesh {
    const o = new THREE.Mesh(geo, mat);
    o.position.set(x, y, z);
    o.castShadow = true;
    o.receiveShadow = true;
    (parent ?? this.group).add(o);
    return o;
  }

  box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0, parent?: THREE.Object3D): THREE.Mesh {
    return this.mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent);
  }

  cyl(rt: number, rb: number, h: number, seg: number, mat: THREE.Material, x = 0, y = 0, z = 0, parent?: THREE.Object3D): THREE.Mesh {
    return this.mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat, x, y, z, parent);
  }

  plane(w: number, h: number, mat: THREE.Material, x: number, y: number, z: number, rotY = 0, parent?: THREE.Object3D): THREE.Mesh {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    p.position.set(x, y, z);
    p.rotation.y = rotY;
    (parent ?? this.group).add(p);
    return p;
  }
}

type Builder = (b: PropBuilder, ch: Challenge) => void;

const STEEL = '#9aa4ab';
const DARK = '#2b3238';

/** Armario metálico con dos puertas, cerradura y etiqueta. */
function cabinet(title: string, body: string, bg: string, fg: string, extra?: (b: PropBuilder) => void): Builder {
  return (b) => {
    b.box(1.0, 1.9, 0.6, b.m(body, 0.4, 0.3), 0, 0.95, 0);
    b.box(1.0, 0.12, 0.62, b.m(DARK, 0.7), 0, 0.06, 0);
    b.box(0.02, 1.78, 0.02, b.m(DARK, 0.6), 0, 0.95, 0.31);
    const handle = b.m('#d0d6db', 0.2, 0.8);
    b.cyl(0.018, 0.018, 0.36, 8, handle, -0.07, 0.95, 0.34);
    b.cyl(0.018, 0.018, 0.36, 8, handle, 0.07, 0.95, 0.34);
    b.plane(0.72, 0.36, b.mt(signTex(title, bg, fg)), 0, 1.55, 0.302);
    if (extra) extra(b);
  };
}

function drums(color: string, label: string, bg: string, fg: string, symbol = '!'): Builder {
  return (b) => {
    const body = b.m(color, 0.45, 0.35);
    const rim = b.m('#3c4650', 0.4, 0.6);
    const drum = (x: number, z: number) => {
      b.cyl(0.42, 0.42, 1.1, 20, body, x, 0.55, z);
      b.cyl(0.44, 0.44, 0.06, 20, rim, x, 0.06, z);
      b.cyl(0.44, 0.44, 0.06, 20, rim, x, 1.06, z);
      b.cyl(0.4, 0.4, 0.03, 20, rim, x, 1.12, z);
      b.plane(0.5, 0.5, b.mt(signTex(label, bg, fg)), x, 0.6, z + 0.43);
    };
    drum(-0.5, 0);
    drum(0.5, 0.25);
    b.plane(0.3, 0.3, b.mt(diamondTex(symbol, '#ffffff', '#111')), 0.5, 0.6, 0.7);
  };
}

function workbench(extra?: (b: PropBuilder) => void): Builder {
  return (b) => {
    const wood = b.mt(woodTex('#a0683a', '#6b4324'), 0.8);
    b.box(1.9, 0.1, 0.95, wood, 0, 0.92, 0);
    for (const x of [-0.85, 0.85]) for (const z of [-0.4, 0.4]) b.box(0.08, 0.9, 0.08, b.m(STEEL, 0.4, 0.7), x, 0.45, z);
    b.box(1.7, 0.26, 0.82, b.m('#7a6a55', 0.8), 0, 0.72, 0);
    b.box(0.5, 0.14, 0.02, b.m('#c8ccd0', 0.3, 0.7), -0.4, 0.72, 0.42);
    b.box(0.36, 0.26, 0.2, b.m('#2f3840', 0.5, 0.5), 0.7, 1.06, 0.3);
    b.box(0.36, 0.08, 0.22, b.m('#1f262c', 0.5, 0.5), 0.7, 1.2, 0.3);
    b.box(0.55, 0.03, 0.08, b.m(STEEL, 0.3, 0.8), -0.45, 0.99, -0.2).rotation.y = 0.4;
    b.box(0.42, 0.03, 0.07, b.m('#d84a2c', 0.4, 0.5), 0.1, 0.99, -0.25).rotation.y = -0.5;
    if (extra) extra(b);
  };
}

function signPost(title: string, bg: string, fg: string): Builder {
  return (b) => {
    b.cyl(0.045, 0.045, 1.8, 10, b.m('#5a6470', 0.4, 0.6), 0, 0.9, 0);
    const panel = b.m('#ffffff', 0.6);
    b.box(1.2, 0.95, 0.05, panel, 0, 1.75, 0);
    b.plane(1.12, 0.87, b.mt(signTex(title, bg, fg)), 0, 1.75, 0.03);
    b.plane(1.12, 0.87, b.mt(signTex(title, bg, fg)), 0, 1.75, -0.03, Math.PI);
  };
}

function hazardBarrier(title: string): Builder {
  return (b) => {
    const stripe = b.mt(stripeTex('#f2c230', '#1f1f1f'), 0.6);
    b.box(0.1, 0.5, 0.5, b.m(DARK), -0.9, 0.25, 0);
    b.box(0.1, 0.5, 0.5, b.m(DARK), 0.9, 0.25, 0);
    b.box(1.9, 0.08, 0.6, b.m(DARK), 0, 0.04, 0);
    b.box(1.8, 1.1, 0.06, b.m('#f2c230', 0.6), 0, 0.85, 0);
    b.plane(1.7, 0.5, b.mt(stripeTex('#f2c230', '#1f1f1f')), 0, 0.5, 0.035);
    b.plane(1.7, 0.5, stripe, 0, 1.2, 0.035);
    b.plane(1.1, 0.34, b.mt(signTex(title, '#ffffff', '#c0392b')), 0, 0.85, 0.04);
  };
}

function electrical(): Builder {
  return cabinet('ELECTRICIDAD', '#c7ced4', '#ffd60a', '#111111', (b) => {
    b.box(0.07, 0.07, 0.04, b.m('#2ecc71', 0.3), -0.2, 0.62, 0.33);
    b.box(0.07, 0.07, 0.04, b.m('#e74c3c', 0.3), 0.2, 0.62, 0.33);
  });
}

function extinguisher(): Builder {
  return (b) => {
    b.cyl(0.18, 0.2, 0.04, 16, b.m(DARK), 0, 0.02, 0);
    b.cyl(0.14, 0.14, 0.9, 20, b.m('#d32f2f', 0.4, 0.2), 0, 0.5, 0);
    b.cyl(0.15, 0.15, 0.1, 20, b.m('#8b1a1a', 0.4), 0, 0.13, 0);
    b.cyl(0.05, 0.05, 0.16, 10, b.m('#2b2b2b', 0.4, 0.5), 0, 1.0, 0);
    b.box(0.22, 0.05, 0.08, b.m('#2b2b2b', 0.4, 0.5), 0, 1.07, 0);
    b.plane(0.2, 0.36, b.mt(signTex('CO₂', '#f5f5f5', '#d32f2f')), 0, 0.55, 0.145);
    b.plane(0.2, 0.36, b.mt(signTex('CO₂', '#f5f5f5', '#d32f2f')), 0, 0.55, -0.145, Math.PI);
    b.cyl(0.02, 0.02, 0.5, 6, b.m('#1a1a1a', 0.8), 0.16, 0.6, 0.02).rotation.z = -0.6;
  };
}

function shower(): Builder {
  return (b) => {
    const steel = b.m('#c9d1d8', 0.25, 0.8);
    b.cyl(0.05, 0.05, 0.1, 10, b.m(DARK), 0, 0.05, 0);
    b.cyl(0.035, 0.035, 2.3, 10, steel, 0, 1.2, 0);
    b.cyl(0.2, 0.2, 0.05, 20, steel, 0, 2.3, 0.0).rotation.x = Math.PI / 2 - 0.0;
    b.cyl(0.3, 0.3, 0.02, 24, b.m('#b5d334', 0.9), 0, 0.012, 0.0);
    b.box(0.12, 0.05, 0.25, b.m('#d4a017', 0.5), 0.3, 1.2, 0.1);
    b.box(0.35, 0.18, 0.2, b.m('#ffffff', 0.4), -0.25, 0.9, 0.2);
    b.cyl(0.2, 0.2, 0.06, 20, b.m('#dfe6ea', 0.3), 0.2, 0.45, -0.25).rotation.x = 0;
  };
}

function aed(): Builder {
  return (b) => {
    b.box(0.7, 1.0, 0.28, b.m('#f5f5f5', 0.4), 0, 0.9, 0);
    b.box(0.6, 0.4, 0.04, b.m('#7fd3f7', 0.05, 0.1), 0, 0.92, 0.155);
    b.box(0.3, 0.2, 0.12, b.m('#ffd600', 0.5), 0, 0.92, 0.0);
    b.plane(0.5, 0.2, b.mt(signTex('DEA', '#ffffff', '#d32f2f')), 0, 1.5, 0.15);
    b.box(0.1, 0.1, 0.05, b.m('#22c55e', 0.3), 0.25, 0.4, 0.15);
  };
}

function firstAid(): Builder {
  return (b) => {
    b.box(0.9, 0.55, 0.4, b.m('#f5f5f5', 0.5), 0, 0.55, 0);
    b.box(0.5, 0.12, 0.02, b.m('#d32f2f', 0.4), 0, 0.55, 0.205);
    b.box(0.12, 0.42, 0.02, b.m('#d32f2f', 0.4), 0, 0.55, 0.21);
    b.box(0.9, 0.1, 0.4, b.m('#b0b8be', 0.5), 0, 0.1, 0);
  };
}

function hood(): Builder {
  return (b) => {
    const steel = b.m('#c9d1d6', 0.45, 0.5);
    const canopy = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 1.0, 0.6, 4, 1, true), steel);
    canopy.rotation.y = Math.PI / 4;
    canopy.rotation.x = Math.PI;
    canopy.position.set(0, 1.9, 0);
    canopy.castShadow = true;
    b.group.add(canopy);
    b.box(1.8, 0.06, 1.8, steel, 0, 2.23, 0);
    b.cyl(0.22, 0.22, 1.1, 14, steel, 0, 2.85, 0);
    b.cyl(0.035, 0.035, 1.9, 8, b.m('#7a858e', 0.4, 0.6), -0.9, 0.95, -0.9);
    b.cyl(0.035, 0.035, 1.9, 8, b.m('#7a858e', 0.4, 0.6), 0.9, 0.95, 0.9);
  };
}

function bin(): Builder {
  return (b) => {
    const body = b.m('#2e7d32', 0.5);
    b.cyl(0.42, 0.36, 1.0, 16, body, 0, 0.6, 0);
    b.cyl(0.44, 0.44, 0.08, 16, b.m('#1b5e20', 0.5), 0, 1.13, 0);
    b.plane(0.5, 0.3, b.mt(signTex('RESIDUOS', '#2e7d32', '#ffffff')), 0, 0.65, 0.39);
    for (const x of [-0.3, 0.3]) b.cyl(0.07, 0.07, 0.06, 10, b.m('#1a1a1a', 0.8), x, 0.07, 0.25).rotation.x = Math.PI / 2;
  };
}

function windsock(): Builder {
  return (b) => {
    b.cyl(0.035, 0.035, 2.4, 8, b.m('#f5f5f5', 0.5), 0, 1.2, 0);
    const tex = stripeTex('#ff7a1a', '#ffffff');
    const sock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.1, 1.3, 14, 1, true),
      new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 0.9 })
    );
    b.mats.push(sock.material as THREE.MeshStandardMaterial);
    sock.rotation.z = Math.PI / 2 + 0.25;
    sock.position.set(0.55, 2.35, 0);
    sock.castShadow = true;
    b.group.add(sock);
  };
}

function fanDuct(): Builder {
  return (b) => {
    const steel = b.m('#d7dde2', 0.4, 0.5);
    b.box(0.9, 0.7, 0.7, steel, 0, 0.5, 0);
    b.cyl(0.25, 0.25, 0.25, 16, b.m('#2b3238', 0.5), 0.46, 0.5, 0).rotation.z = Math.PI / 2;
    b.cyl(0.14, 0.14, 1.8, 16, b.m('#e0e5ea', 0.9), 0.1, 1.2, 0.8).rotation.z = Math.PI / 4;
    b.cyl(0.05, 0.05, 0.6, 8, b.m('#7a858e', 0.5), -0.3, 0.1, 0.2);
  };
}

function containment(): Builder {
  return (b) => {
    const steel = b.m('#4b5563', 0.4, 0.6);
    b.box(2.0, 0.12, 1.3, steel, 0, 0.06, 0);
    b.box(2.0, 0.22, 0.08, steel, 0, 0.17, 0.66);
    b.box(2.0, 0.22, 0.08, steel, 0, 0.17, -0.66);
    b.box(0.08, 0.22, 1.3, steel, 1.0, 0.17, 0);
    b.box(0.08, 0.22, 1.3, steel, -1.0, 0.17, 0);
    drums('#2f6b9a', 'FDS', '#ffffff', '#1f3a5f')(b, {} as Challenge);
  };
}

function flammable(): Builder {
  return cabinet('INFLAMABLES', '#c62828', '#ffffff', '#c62828', (b) => {
    b.plane(0.3, 0.3, b.mt(diamondTex('!', '#ffd600', '#111')), 0, 0.9, 0.31);
  });
}

function panel(): Builder {
  return (b) => {
    b.box(1.3, 1.6, 0.06, b.m('#e5e7eb', 0.5), 0, 1.1, 0);
    b.plane(1.18, 1.46, b.mt(panelTex([
      { title: 'PROTEGER', text: 'Asegura la zona', color: '#e53935' },
      { title: 'ALERTAR', text: 'Avisa a los equipos', color: '#fb8c00' },
      { title: 'SOCORRER', text: 'Presta primeros auxilios', color: '#43a047' }
    ])), 0, 1.1, 0.034);
    b.box(0.04, 0.6, 0.04, b.m(DARK), -0.5, 0.25, -0.05);
    b.box(0.04, 0.6, 0.04, b.m(DARK), 0.5, 0.25, -0.05);
  };
}

function gasDetector(): Builder {
  return (b) => {
    for (const a of [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3]) {
      const leg = b.cyl(0.03, 0.03, 1.2, 8, b.m('#5a6470', 0.4, 0.6), Math.cos(a) * 0.25, 0.6, Math.sin(a) * 0.25);
      leg.rotation.z = Math.cos(a) * 0.15;
      leg.rotation.x = -Math.sin(a) * 0.15;
    }
    b.box(0.4, 0.5, 0.22, b.m('#f2c230', 0.4), 0, 1.4, 0);
    b.plane(0.3, 0.18, b.mt(signTex('CO', '#0f172a', '#34d399')), 0, 1.45, 0.115);
  };
}

function lamp(): Builder {
  return (b) => {
    b.cyl(0.03, 0.03, 1.5, 8, b.m('#5a6470', 0.4, 0.6), 0, 0.75, 0);
    const glow = b.m('#fff7d6', 0.3);
    glow.emissive = new THREE.Color('#fff2b0');
    glow.emissiveIntensity = 0.8;
    b.cyl(0.22, 0.18, 0.3, 16, glow, 0, 1.6, 0);
    b.cyl(0.2, 0.2, 0.04, 16, b.m('#3a4249', 0.5), 0, 1.75, 0);
    b.cyl(0.25, 0.25, 0.05, 20, b.m(DARK), 0, 0.03, 0);
  };
}

function tripod(): Builder {
  return (b) => {
    for (const a of [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3]) {
      const leg = b.cyl(0.03, 0.03, 2.2, 8, b.m('#f5f5f5', 0.4, 0.4), Math.cos(a) * 0.5, 1.1, Math.sin(a) * 0.5);
      leg.rotation.z = -Math.cos(a) * 0.2;
      leg.rotation.x = Math.sin(a) * 0.2;
    }
    b.box(0.5, 0.3, 0.4, b.m('#f2c230', 0.4), 0, 2.25, 0);
    b.box(0.6, 0.15, 0.5, b.m(DARK, 0.6, 0.5), 0, 0.12, 0);
  };
}

function alarmPoint(): Builder {
  return (b) => {
    b.box(0.5, 0.6, 0.18, b.m('#e53935', 0.35), 0, 1.2, 0);
    b.cyl(0.14, 0.14, 0.08, 16, b.m('#ffffff', 0.3), 0, 1.2, 0.13).rotation.x = Math.PI / 2;
    b.plane(0.7, 0.35, b.mt(signTex('PUNTO ENCUENTRO', '#2e7d32', '#ffffff')), 0, 0.5, 0.1);
  };
}

function npc(name: string): Builder {
  return (b) => {
    const isCarlos = name.toLowerCase().includes('carlos');
    const tech = createTechnician(isCarlos ? '#2e86ab' : '#c0392b');
    b.mats.push(...tech.materials);
    b.group.add(tech.group);
  };
}

/* ---------- Selección del prop según el nombre del reto ---------- */

const RULES: { match: RegExp; build: Builder }[] = [
  { match: /ducha/i, build: shower() },
  { match: /lavaojos/i, build: shower() },
  { match: /extintor/i, build: extinguisher() },
  { match: /DEA|soporte vital/i, build: aed() },
  { match: /P\.A\.S|protocolo/i, build: panel() },
  { match: /cubeto/i, build: containment() },
  { match: /ignífugo|ignifugo/i, build: flammable() },
  { match: /manga de viento|posición/i, build: windsock() },
  { match: /ventilación forzada/i, build: fanDuct() },
  { match: /campana|aspiración/i, build: hood() },
  { match: /bidón|bidon/i, build: bin() },
  { match: /FDS|antifouling/i, build: drums('#e67e22', 'FDS', '#ffffff', '#111', '!') },
  { match: /multigás|detector/i, build: gasDetector() },
  { match: /lámpara|MBTS/i, build: lamp() },
  { match: /trípode|torno|rescate/i, build: tripod() },
  { match: /pulsador|encuentro/i, build: alarmPoint() },
  { match: /alarma/i, build: alarmPoint() },
  { match: /mascarillas/i, build: cabinet('RESPIRATORIA', '#eef4f8', '#1e6fb8', '#ffffff') },
  { match: /guantes/i, build: cabinet('GUANTES QUÍMICOS', '#eef4f8', '#f2c230', '#111') },
  { match: /arnés|cabo|drizas|portaherramientas|cruceta|anclaje/i, build: cabinet('ARNÉS EN 361', '#eef4f8', '#2e7d32', '#ffffff') },
  { match: /casco/i, build: cabinet('CASCO EN 12492', '#eef4f8', '#f2c230', '#111') },
  { match: /botas|bota/i, build: cabinet('CALZADO', '#eef4f8', '#1e3a5f', '#ffffff') },
  { match: /EPI/i, build: cabinet('EPI', '#eef4f8', '#1e6fb8', '#ffffff') },
  { match: /lijadora|mesa de agitadores|herramientas|banco/i, build: workbench() },
  { match: /cuadro eléctrico|selector de baterías|loto/i, build: electrical() },
  { match: /señalización|zona de exclusión|fuego|traumatismo/i, build: hazardBarrier('PELIGRO') },
  { match: /primeros|PLS|posición lateral/i, build: firstAid() }
];


/** Devuelve el prop 3D de un reto (tipo y nombre). */
export function buildProp(ch: Challenge): { group: THREE.Group; mats: THREE.MeshStandardMaterial[] } {
  const b = new PropBuilder();
  if (ch.type === 'npc') {
    npc(ch.name)(b, ch);
    return { group: b.group, mats: b.mats };
  }
  const currentTitle = (ch.roleOrSub || ch.name).toUpperCase().slice(0, 18);
  const rule = RULES.find((r) => r.match.test(ch.name));
  const fallback: Record<string, Builder> = {
    epi: cabinet('EPI', '#eef4f8', '#1e6fb8', '#ffffff'),
    tool: workbench(),
    hazard: hazardBarrier('PELIGRO'),
    chemical: drums('#e67e22', 'QUÍMICOS', '#ffffff', '#111'),
    electrical: electrical(),
    sign: signPost(currentTitle, '#1e88e5', '#ffffff'),
    ventilation: fanDuct(),
    emergency: firstAid(),
    waste: bin()
  };
  const build = rule?.build ?? fallback[ch.type] ?? firstAid();
  build(b, ch);
  return { group: b.group, mats: b.mats };
}

/* ---------- Barco ---------- */

function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}

function addRope(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3): void {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.018, len, 6),
    new THREE.MeshStandardMaterial({ color: '#e5d7b5', roughness: 0.9 })
  );
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  mesh.castShadow = true;
  parent.add(mesh);
}

function hullTexture(name: string): THREE.CanvasTexture {
  return makeTex(512, 128, (g, w, h) => {
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#1e3a5f';
    g.fillRect(0, h - 18, w, 18);
    g.fillStyle = '#1e3a5f';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    fitFont(g, name, w * 0.9, 80);
    g.fillText(name, w / 2, h / 2 - 8);
  });
}

/** Barco de recreo amarrado: casco de perfil redondeado, cabina con ventanas, barandillas, mástil y aro salvavidas. */
export function buildBoat(hullColor: string, name = 'PRL 01'): THREE.Group {
  const g = new THREE.Group();
  const paint = (c: string) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.45, metalness: 0.05, clearcoat: 0.7, clearcoatRoughness: 0.25 });
  const flat = (c: string, r = 0.7) => new THREE.MeshStandardMaterial({ color: c, roughness: r });
  const add = (geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0, parent: THREE.Object3D = g) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  // Casco: perfil lateral extruido con bordes redondeados
  const hullShape = new THREE.Shape();
  hullShape.moveTo(-1.7, 0.95);
  hullShape.lineTo(-1.6, 0.35);
  hullShape.quadraticCurveTo(-1.45, 0.02, -0.9, 0.0);
  hullShape.lineTo(0.9, 0.0);
  hullShape.quadraticCurveTo(1.75, 0.05, 2.15, 0.95);
  hullShape.closePath();
  const hullGeo = new THREE.ExtrudeGeometry(hullShape, {
    depth: 1.1, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 4, curveSegments: 18
  });
  hullGeo.translate(0, 0, -0.55);
  add(hullGeo, paint(hullColor));

  // Obra viva (quilla) en rojo antiincrustante
  const keelShape = new THREE.Shape();
  keelShape.moveTo(-1.62, 0.36);
  keelShape.quadraticCurveTo(-1.45, 0.02, -0.9, 0.0);
  keelShape.lineTo(0.9, 0.0);
  keelShape.quadraticCurveTo(1.75, 0.05, 2.12, 0.36);
  keelShape.closePath();
  const keelGeo = new THREE.ExtrudeGeometry(keelShape, {
    depth: 1.12, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 3, curveSegments: 14
  });
  keelGeo.translate(0, 0, -0.56);
  add(keelGeo, paint('#b8322a'));

  // Cubierta y regala blanca
  add(new THREE.BoxGeometry(3.25, 0.05, 1.2), flat('#e7ebee', 0.8), 0.1, 0.94, 0);
  for (const z of [-0.62, 0.62]) {
    add(new THREE.BoxGeometry(3.4, 0.08, 0.08), paint('#f4f6f8'), 0.1, 1.0, z);
  }

  // Barandillas con postes y pasamanos
  const railMat = flat('#d9dee3', 0.3);
  for (const z of [-0.6, 0.6]) {
    for (let x = -1.4; x <= 1.7; x += 0.5) add(new THREE.CylinderGeometry(0.014, 0.014, 0.32, 6), railMat, x, 1.16, z);
    const top = add(new THREE.CylinderGeometry(0.016, 0.016, 3.3, 6), railMat, 0.15, 1.33, z);
    top.rotation.z = Math.PI / 2;
  }

  // Cabina con bordes redondeados
  const cabinGeo = new THREE.ExtrudeGeometry(roundedRect(1.7, 0.9, 0.12), {
    depth: 1.0, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 6
  });
  cabinGeo.translate(0, 0, -0.5);
  add(cabinGeo, paint('#f4f6f8'), -0.5, 1.4, 0);
  add(new THREE.BoxGeometry(1.9, 0.08, 1.2), paint('#b8322a'), -0.5, 1.86, 0);

  // Ventanas de cristal
  const glass = new THREE.MeshPhysicalMaterial({ color: '#0f2e44', roughness: 0.05, metalness: 0.1, clearcoat: 1 });
  for (const z of [-0.3, 0, 0.3]) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.38), glass);
    w.rotation.y = Math.PI / 2;
    w.position.set(0.41, 1.45, z);
    g.add(w);
  }
  for (const side of [-1, 1]) {
    for (const x of [-0.95, -0.25]) {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.38), glass);
      w.position.set(x, 1.45, side * 0.545);
      if (side < 0) w.rotation.y = Math.PI;
      g.add(w);
    }
  }

  // Mástil con crucetas, bandera y obenques
  const mastTop = new THREE.Vector3(0.95, 3.1, 0);
  add(new THREE.CylinderGeometry(0.035, 0.055, 2.2, 8), paint('#e5e7eb'), 0.95, 2.05, 0);
  add(new THREE.BoxGeometry(0.5, 0.04, 0.04), railMat, 0.95, 2.7, 0);
  add(new THREE.BoxGeometry(0.45, 0.25, 0.01), flat('#e0523d', 0.6), 1.2, 2.85, 0);
  for (const z of [-0.6, 0.6]) {
    addRope(g, mastTop, new THREE.Vector3(-1.5, 1.0, z));
    addRope(g, mastTop, new THREE.Vector3(1.6, 1.0, z));
  }

  // Aro salvavidas y defensas
  const ring = add(new THREE.TorusGeometry(0.2, 0.045, 10, 28), flat('#ff6a13', 0.5), -1.2, 1.25, 0.67);
  ring.rotation.x = 0;
  add(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12), flat('#f5f5f5', 0.6), -0.7, 0.55, 0.78).rotation.x = Math.PI / 2;
  add(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12), flat('#f5f5f5', 0.6), 0.8, 0.55, 0.78).rotation.x = Math.PI / 2;

  // Luces de navegación
  const red = new THREE.MeshStandardMaterial({ color: '#ff2d2d', emissive: '#ff2d2d', emissiveIntensity: 1.2 });
  const green = new THREE.MeshStandardMaterial({ color: '#22ff66', emissive: '#22ff66', emissiveIntensity: 1.2 });
  add(new THREE.SphereGeometry(0.06, 10, 8), red, 1.95, 1.0, -0.4);
  add(new THREE.SphereGeometry(0.06, 10, 8), green, 1.95, 1.0, 0.4);

  // Nombre del barco en el costado
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.38), new THREE.MeshStandardMaterial({ map: hullTexture(name), roughness: 0.6 }));
  sign.position.set(-0.2, 0.5, 0.672);
  g.add(sign);

  return g;
}
