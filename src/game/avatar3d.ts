import * as THREE from 'three';

/** Técnico de mantenimiento: mono de trabajo con bandas reflectantes, casco amarillo, cinturón y guantes. */
export interface Technician {
  group: THREE.Group;
  legL: THREE.Mesh;
  legR: THREE.Mesh;
  armL: THREE.Mesh;
  armR: THREE.Mesh;
  materials: THREE.MeshStandardMaterial[];
}

export function createTechnician(overallColor = '#1f4e79'): Technician {
  const group = new THREE.Group();
  const materials: THREE.MeshStandardMaterial[] = [];
  const mat = (color: string, rough = 0.7, metal = 0) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
    materials.push(m);
    return m;
  };

  const coverall = mat(overallColor, 0.8);
  const coverallDark = mat('#183d5f', 0.8);
  const reflective = mat('#e8e8e8', 0.35, 0.2);
  const skin = mat('#e0a875', 0.7);
  const hat = mat('#f5c400', 0.35);
  const boots = mat('#1a1a1a', 0.6);
  const glove = mat('#3a3a3a', 0.9);
  const belt = mat('#6b4a2b', 0.8);
  const steel = mat('#9aa3ab', 0.3, 0.6);

  const add = (geo: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = group) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  };

  // Torso con mono de trabajo
  add(new THREE.CapsuleGeometry(0.36, 0.55, 6, 12), coverall, 0, 1.15, 0);
  // Bandas reflectantes y cinturón con herramienta
  add(new THREE.CylinderGeometry(0.372, 0.372, 0.07, 20, 1, true), reflective, 0, 0.98, 0);
  add(new THREE.BoxGeometry(0.8, 0.14, 0.54), belt, 0, 0.8, 0);
  add(new THREE.CylinderGeometry(0.045, 0.045, 0.34, 8), steel, 0.36, 0.8, 0.14).rotation.z = Math.PI / 2;

  // Cabeza y casco amarillo de obra
  add(new THREE.SphereGeometry(0.27, 18, 14), skin, 0, 1.9, 0);
  add(new THREE.SphereGeometry(0.32, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), hat, 0, 1.98, 0);
  add(new THREE.TorusGeometry(0.33, 0.035, 6, 28), hat, 0, 1.98, 0).rotation.x = Math.PI / 2;

  // Brazos con guantes (los guantes son hijos del brazo para moverse con él)
  const armGeo = new THREE.CapsuleGeometry(0.11, 0.42, 4, 8);
  const armL = add(armGeo, coverall, -0.44, 1.12, 0);
  armL.rotation.z = 0.12;
  const armR = add(armGeo, coverall, 0.44, 1.12, 0);
  armR.rotation.z = -0.12;
  add(new THREE.SphereGeometry(0.1, 10, 8), glove, 0, -0.34, 0, armL);
  add(new THREE.SphereGeometry(0.1, 10, 8), glove, 0, -0.34, 0, armR);

  // Piernas, botas y bandas reflectantes en las perneras
  const legGeo = new THREE.CapsuleGeometry(0.13, 0.4, 4, 8);
  const legL = add(legGeo, coverallDark, -0.16, 0.45, 0);
  const legR = add(legGeo, coverallDark, 0.16, 0.45, 0);
  add(new THREE.CylinderGeometry(0.135, 0.135, 0.05, 14, 1, true), reflective, 0, 0.3, 0, legL);
  add(new THREE.CylinderGeometry(0.135, 0.135, 0.05, 14, 1, true), reflective, 0, 0.3, 0, legR);
  add(new THREE.BoxGeometry(0.22, 0.14, 0.32), boots, 0, -0.2, 0.05, legL);
  add(new THREE.BoxGeometry(0.22, 0.14, 0.32), boots, 0, -0.2, 0.05, legR);

  return { group, legL, legR, armL, armR, materials };
}
