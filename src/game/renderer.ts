import { Challenge, Player } from '../types/prl';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private time = 0;
  private particles: Particle[] = [];

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  public addCelebrationParticles(x: number, y: number): void {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#6366f1'];
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 40 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 4
      });
    }
  }

  public addDustParticle(x: number, y: number): void {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 6,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -0.3 - Math.random() * 0.4,
      life: 0,
      maxLife: 20 + Math.random() * 10,
      color: 'rgba(203, 213, 225, 0.5)',
      size: 2 + Math.random() * 2
    });
  }

  public updateParticles(): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  public render(
    levelId: number,
    player: Player,
    challenges: Challenge[],
    nearObject: Challenge | null
  ): void {
    this.time += 0.03;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.width, this.height);

    if (levelId === 1) {
      this.drawWorkshopScenario();
    } else if (levelId === 2) {
      this.drawPierScenario();
    } else if (levelId === 3) {
      this.drawSailboatMastScenario();
    } else if (levelId === 4) {
      this.drawBilgeScenario();
    } else if (levelId === 5) {
      this.drawShipyardEmergenciesScenario();
    } else {
      this.drawGenericScenario(levelId);
    }

    // Render interactive challenge stations
    this.drawChallengeStations(challenges, nearObject);

    // Render Player
    this.drawPlayer(player);

    // Render Particles (dust, sparkles)
    this.drawParticles();

    // Render HUD Proximity Banner if near an active challenge
    if (nearObject && !nearObject.completed) {
      this.drawProximityPrompt(nearObject);
    }
  }

  // ==========================================
  // ESCENARIO 1: TALLER DE MANTENIMIENTO NAVAL
  // ==========================================
  private drawWorkshopScenario(): void {
    const ctx = this.ctx;

    // 1. Suelo del taller (hormigón pulido industrial con cuadrícula)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, this.width, this.height);

    // Líneas de juntas de hormigón
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // Pasillo peatonal de seguridad marcado en amarillo suave
    ctx.fillStyle = 'rgba(234, 179, 8, 0.05)';
    ctx.fillRect(40, 240, 720, 80);

    // Franjas de peligro amarillo/negro en el perímetro
    this.drawHazardStrip(40, 50, 720, 12);
    this.drawHazardStrip(40, 550, 720, 12);

    // 2. Barco en seco / Casco de fibra de vidrio
    this.drawDryDockBoat(360, 260);

    // 3. Banco de trabajo con herramientas (Esquina inferior derecha)
    this.drawWorkbench(560, 420, 150, 60);

    // 4. Zona de Aspiración y chimenea de extracción (Superior derecha)
    this.drawExtractionHood(560, 70, 110, 80);

    // 5. Armario de EPIs metálico (Superior centro-izquierda)
    this.drawEPICabinet(270, 70, 60, 70);

    // 6. Contenedores de residuos peligrosos (Centro derecha)
    this.drawHazardDrums(670, 250);

    // 7. Panel de Señalización de Seguridad (Inferior centro)
    this.drawSafetySignPost(360, 440);

    // 8. NPCs: Manuel (Jefe Taller) y Carlos (Delegado Prevención)
    this.drawNPC(440, 140, 'Manuel', '#38bdf8', '#0284c7');
    this.drawNPC(180, 460, 'Carlos', '#fbbf24', '#d97706');
  }

  // ==========================================
  // ESCENARIO 2: EL MUELLE Y QUÍMICOS
  // ==========================================
  private drawPierScenario(): void {
    const ctx = this.ctx;

    // 1. Muelle / Pantalán de hormigón y tablones de madera
    // Mitad izquierda/centro es muelle, franja derecha e inferior es mar
    const pierWidth = 540;
    const waterStart = 540;

    // Pavimento del muelle
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, pierWidth, this.height);

    // Tablones de madera del pantalán
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    for (let y = 0; y < this.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(pierWidth, y);
      ctx.stroke();
    }

    // Borde de seguridad del muelle (franja de contraste con bolardos)
    this.drawHazardStrip(pierWidth - 16, 0, 16, this.height, true);

    // Bolardos de amarre de hierro fundido
    for (let by = 60; by < this.height; by += 120) {
      this.drawBollard(pierWidth - 26, by);
    }

    // 2. Agua marina animada
    this.drawSeaWater(waterStart, 0, this.width - waterStart, this.height);

    // 3. Embarcación amarrada flotando junto al muelle
    this.drawMooredBoat(580, 180);

    // 4. Cabos de amarre conectando el barco a los bolardos
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pierWidth - 26, 180);
    ctx.quadraticCurveTo(570, 190, 600, 200);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pierWidth - 26, 420);
    ctx.quadraticCurveTo(570, 410, 600, 380);
    ctx.stroke();

    // 5. Cubeto de retención y botes de pintura (Zona central-derecha del muelle)
    this.drawChemicalSpillPallet(430, 280);

    // 6. Ducha y Lavaojos de Emergencia (Zona inferior)
    this.drawEmergencyShower(370, 440);

    // 7. Manga de viento y estación anemométrica (Superior derecha)
    this.drawWindsock(490, 110);

    // 8. Armario ignífugo de seguridad (Superior izquierda)
    this.drawFlammableCabinet(160, 80);

    // 9. Mesa de mezclas y herramientas antichispa
    this.drawBrassToolsTable(460, 430);

    // 10. Perchero de buzos químicos Tipo 4/5/6
    this.drawChemicalSuitsRack(140, 275);

    // 11. Zona de descontaminación y retirada de guantes
    this.drawDecontaminationStation(280, 275);
  }

  // ==========================================
  // ESCENARIO 3: TRABAJO EN ALTURA EN EMBARCACIÓN
  // ==========================================
  private drawSailboatMastScenario(): void {
    const ctx = this.ctx;

    // 1. Mar exterior a ambos lados
    this.drawSeaWater(0, 0, 90, this.height);
    this.drawSeaWater(this.width - 90, 0, 90, this.height);

    // 2. Cubierta del velero (Teca náutica con borda curvada)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(90, 20);
    ctx.quadraticCurveTo(this.width / 2, -20, this.width - 90, 20);
    ctx.lineTo(this.width - 90, this.height - 20);
    ctx.quadraticCurveTo(this.width / 2, this.height + 15, 90, this.height - 20);
    ctx.closePath();

    ctx.fillStyle = '#b45309';
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Tablillas de teca calafateadas
    ctx.strokeStyle = 'rgba(30, 20, 10, 0.35)';
    ctx.lineWidth = 1;
    for (let x = 110; x < this.width - 100; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, 25);
      ctx.lineTo(x, this.height - 25);
      ctx.stroke();
    }
    ctx.restore();

    // Candeleleros y guardamancebos (líneas de vida perimetrales de acero)
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(105, 30);
    ctx.lineTo(105, this.height - 30);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.width - 105, 30);
    ctx.lineTo(this.width - 105, this.height - 30);
    ctx.stroke();

    // 3. Zona de exclusión bajo el mástil delimitada con franja de peligro
    this.drawHazardStrip(260, 160, 280, 10);
    this.drawHazardStrip(260, 360, 280, 10);

    // 4. Mástil central (Palo Mayor) con botavara y jarcia
    const mastX = 400;
    const mastY = 250;

    // Sombra del mástil
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(mastX + 25, mastY + 20, 35, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Obenques de acero inoxidable a babor y estribor
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(mastX, mastY);
    ctx.lineTo(110, 220);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(mastX, mastY);
    ctx.lineTo(this.width - 110, 220);
    ctx.stroke();

    // Botavara horizontal
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(mastX, mastY);
    ctx.lineTo(mastX, mastY + 110);
    ctx.stroke();

    // Perfil cilíndrico del Palo Mayor
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(mastX, mastY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Winches de cubierta
    ctx.fillStyle = '#334155';
    ctx.beginPath(); ctx.arc(mastX - 50, mastY + 30, 9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(mastX + 50, mastY + 30, 9, 0, Math.PI * 2); ctx.fill();

    // Tambucho de cabina (escala inferior)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(350, 470, 100, 60);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(350, 470, 100, 60);
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BAJADA A CABINA', 400, 505);

    // Rótulo del mástil
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('PALO MAYOR (ALTURA > 12m)', mastX, mastY - 24);

    // Perchero de arneses y casco
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(160, 130, 24, 28);
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(160, 130, 24, 28);

    // Aro salvavidas
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(170, 460, 14, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ==========================================
  // ESCENARIO 4: LA SENTINA Y ELECTRICIDAD
  // ==========================================
  private drawBilgeScenario(): void {
    const ctx = this.ctx;

    // 1. Fondo oscuro de la sentina industrial
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, this.width, this.height);

    // Cuadernas de acero estructural del casco
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 8;
    for (let x = 60; x < this.width; x += 110) {
      ctx.beginPath();
      ctx.moveTo(x, 40);
      ctx.lineTo(x, this.height - 40);
      ctx.stroke();
    }

    // Pozo central de sentina con aguas aceitosas
    const sumpGrad = ctx.createLinearGradient(0, 200, 0, 360);
    sumpGrad.addColorStop(0, '#0c1a2e');
    sumpGrad.addColorStop(0.5, '#071626');
    sumpGrad.addColorStop(1, '#020b14');
    ctx.fillStyle = sumpGrad;
    ctx.fillRect(120, 210, 560, 150);

    // Reflejo irisado de aceite en agua
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.2)';
    ctx.lineWidth = 2;
    for (let wy = 230; wy < 350; wy += 28) {
      ctx.beginPath();
      ctx.moveTo(140, wy + Math.sin(this.time * 2 + wy) * 3);
      ctx.lineTo(660, wy + Math.sin(this.time * 2 + wy + 2) * 3);
      ctx.stroke();
    }

    // Pasarela de chapa lagrimada de sentina (piso antideslizante)
    ctx.fillStyle = '#334155';
    ctx.fillRect(40, 100, 720, 50);
    ctx.fillRect(40, 420, 720, 50);

    // Líneas de patrón lagrimado
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    for (let x = 50; x < 750; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, 105); ctx.lineTo(x + 8, 145); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, 425); ctx.lineTo(x + 8, 465); ctx.stroke();
    }

    // 2. Bomba de achique sumergible en el pozo
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(440, 270, 35, 45);
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 2;
    ctx.strokeRect(440, 270, 35, 45);

    // Manguera de evacuación corrugada
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(460, 270);
    ctx.quadraticCurveTo(520, 240, 680, 220);
    ctx.stroke();
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BOMBA DE ACHIQUE', 460, 328);

    // 3. Banco de baterías con candado LOTO
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(480, 180, 80, 45);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.strokeRect(480, 180, 80, 45);
    // Bornes
    ctx.fillStyle = '#dc2626'; ctx.fillRect(490, 175, 12, 6);
    ctx.fillStyle = '#0284c7'; ctx.fillRect(540, 175, 12, 6);
    // Candado amarillo LOTO
    ctx.fillStyle = '#facc15';
    ctx.fillRect(518, 192, 14, 14);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('LOTO', 525, 203);

    // 4. Manga flexible de ventilación forzada (naranja)
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(310, 40);
    ctx.bezierCurveTo(270, 100, 260, 180, 290, 240);
    ctx.stroke();
    ctx.fillStyle = '#ea580c';
    ctx.beginPath(); ctx.arc(290, 240, 9, 0, Math.PI * 2); ctx.fill();

    // 5. Escala vertical de gato para acceso exterior (boca de hombre)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(80, 30); ctx.lineTo(80, 150); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(110, 30); ctx.lineTo(110, 150); ctx.stroke();
    for (let sy = 45; sy < 150; sy += 18) {
      ctx.beginPath(); ctx.moveTo(80, sy); ctx.lineTo(110, sy); ctx.stroke();
    }
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('ESCALA DE ACCESO', 95, 25);

    // 6. Panel de detección multigás (en la pared)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(150, 130, 40, 50);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(150, 130, 40, 50);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(156, 138, 28, 12);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 7px monospace';
    ctx.fillText('20.9%', 170, 147);

    // Rótulo central de sentina
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SENTINA PRINCIPAL - ESPACIO CONFINADO', 400, 90);
  }

  // ==========================================
  // ESCENARIO 5: VARADERO Y EMERGENCIAS
  // ==========================================
  private drawShipyardEmergenciesScenario(): void {
    const ctx = this.ctx;

    // 1. Suelo de hormigón industrial y explanada del varadero
    ctx.fillStyle = '#1e2430';
    ctx.fillRect(0, 0, this.width, this.height);

    // Raíles metálicos de la rampa de varada (slipway)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(80, 260); ctx.lineTo(720, 260);
    ctx.moveTo(80, 310); ctx.lineTo(720, 310);
    ctx.stroke();

    // Traviesas de los raíles
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    for (let rx = 90; rx < 720; rx += 25) {
      ctx.beginPath();
      ctx.moveTo(rx, 252);
      ctx.lineTo(rx, 318);
      ctx.stroke();
    }

    // 2. Barco en cuna de varada (cuna metálica roja y puntales)
    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(390, 285, 140, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Casco del barco varado
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(380, 270, 130, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Línea de flotación roja
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(290, 275, 180, 14);

    // Puntales de apuntalamiento de madera y acero
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(290, 285); ctx.lineTo(260, 340);
    ctx.moveTo(470, 285); ctx.lineTo(500, 340);
    ctx.stroke();

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EMBARCACIÓN EN CUNA DE VARADA', 380, 250);

    // 3. Fuego de Disolvente (Animación con llamas pulsantes)
    const fireX = 180;
    const fireY = 150;
    // Charco de químico ardiendo
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(fireX, fireY + 8, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Llamas
    const fPulse = Math.sin(this.time * 6);
    const fHeight = 22 + fPulse * 5;
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(fireX - 16, fireY + 8);
    ctx.quadraticCurveTo(fireX - 8, fireY - fHeight * 0.7, fireX, fireY - fHeight);
    ctx.quadraticCurveTo(fireX + 8, fireY - fHeight * 0.7, fireX + 16, fireY + 8);
    ctx.fill();

    // Núcleo de llama amarilla
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(fireX - 9, fireY + 8);
    ctx.quadraticCurveTo(fireX - 4, fireY - (fHeight * 0.5), fireX, fireY - fHeight * 0.7);
    ctx.quadraticCurveTo(fireX + 4, fireY - (fHeight * 0.5), fireX + 9, fireY + 8);
    ctx.fill();

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('¡FUEGO CLASE B!', fireX, fireY + 28);

    // 4. Panel P.A.S. (Proteger, Avisar, Socorrer)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(265, 115, 70, 48);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(265, 115, 70, 48);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('P.A.S.', 300, 132);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '8px sans-serif';
    ctx.fillText('112 / EMERGENCIAS', 300, 146);

    // 5. Puesto de Extintores (Panel rojo con extintores CO2 y Polvo)
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(415, 110, 50, 55);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(415, 110, 50, 55);
    // Extintores dibujados
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(425, 122, 10, 28);
    ctx.fillRect(445, 122, 10, 28);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(427, 116, 6, 6);
    ctx.fillRect(447, 116, 6, 6);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('CO2 / ABC', 440, 158);

    // 6. Cabina de DEA y Primeros Auxilios
    ctx.fillStyle = '#065f46';
    ctx.fillRect(555, 165, 50, 50);
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.strokeRect(555, 165, 50, 50);
    // Cruz blanca
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(575, 175, 10, 26);
    ctx.fillRect(567, 183, 26, 10);
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('DEA & RCP', 580, 210);

    // 7. Zona de Simulación PLS / Camilla
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(595, 315, 50, 30);
    ctx.strokeStyle = '#059669';
    ctx.strokeRect(595, 315, 50, 30);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('ZONA P.L.S.', 620, 332);

    // 8. Ducha de Emergencia y Lavaojos
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(310, 485); ctx.lineTo(310, 440); ctx.lineTo(325, 440);
    ctx.stroke();
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('DUCHA LAVADO', 310, 498);

    // 9. Punto de Encuentro Oficial (Verde con 4 siluetas de personas reunidas)
    ctx.fillStyle = '#15803d';
    ctx.fillRect(130, 425, 60, 50);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;
    ctx.strokeRect(130, 425, 60, 50);
    // Flechas hacia el centro
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('PUNTO DE', 160, 444);
    ctx.fillText('ENCUENTRO', 160, 456);
    ctx.fillText('EVACUACIÓN', 160, 467);

    // Pulsador de alarma (caja roja pequeña)
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(115, 435, 12, 14);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(115, 435, 12, 14);

    // Franjas de seguridad perimetrales
    this.drawHazardStrip(40, 50, 720, 10);
    this.drawHazardStrip(40, 560, 720, 10);
  }

  private drawGenericScenario(levelId: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Sesión ${levelId}`, 400, 300);
  }

  // ==========================================
  // DIBUJO DE ELEMENTOS GRÁFICOS DETALLADOS
  // ==========================================

  private drawHazardStrip(x: number, y: number, w: number, h: number, vertical = false): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    ctx.fillStyle = '#eab308';
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = '#18181b';
    const stripeWidth = 14;
    if (vertical) {
      for (let sy = y - w; sy < y + h + w; sy += stripeWidth * 2) {
        ctx.beginPath();
        ctx.moveTo(x, sy);
        ctx.lineTo(x + w, sy + w);
        ctx.lineTo(x + w, sy + w + stripeWidth);
        ctx.lineTo(x, sy + stripeWidth);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      for (let sx = x - h; sx < x + w + h; sx += stripeWidth * 2) {
        ctx.beginPath();
        ctx.moveTo(sx, y);
        ctx.lineTo(sx + h, y + h);
        ctx.lineTo(sx + h + stripeWidth, y + h);
        ctx.lineTo(sx + stripeWidth, y);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private drawDryDockBoat(cx: number, cy: number): void {
    const ctx = this.ctx;
    ctx.save();

    // Sombra del barco
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 45, 140, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cunas de varada de madera bajo la quilla
    ctx.fillStyle = '#78350f';
    ctx.fillRect(cx - 90, cy + 25, 20, 25);
    ctx.fillRect(cx - 10, cy + 30, 25, 25);
    ctx.fillRect(cx + 70, cy + 25, 20, 25);

    // Casco del barco (Silueta náutica con proa afilada y popa recortada)
    ctx.beginPath();
    ctx.moveTo(cx - 120, cy); // Popa
    ctx.bezierCurveTo(cx - 120, cy - 40, cx + 50, cy - 50, cx + 130, cy); // Proa arriba
    ctx.bezierCurveTo(cx + 50, cy + 45, cx - 120, cy + 35, cx - 120, cy); // Fondo
    ctx.closePath();

    // Degradado de casco de fibra de vidrio
    const grad = ctx.createLinearGradient(cx - 120, cy - 40, cx + 120, cy + 40);
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(0.5, '#0369a1');
    grad.addColorStop(1, '#075985');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Obra viva en imprimación / zona de lijado
    ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.beginPath();
    ctx.moveTo(cx - 110, cy + 10);
    ctx.bezierCurveTo(cx - 40, cy + 32, cx + 50, cy + 35, cx + 110, cy + 5);
    ctx.lineTo(cx + 80, cy + 20);
    ctx.bezierCurveTo(cx + 20, cy + 38, cx - 60, cy + 35, cx - 100, cy + 25);
    ctx.closePath();
    ctx.fill();

    // Manchas blancas de polvo de fibra de lijado
    ctx.fillStyle = 'rgba(241, 245, 249, 0.5)';
    ctx.beginPath();
    ctx.ellipse(cx - 30, cy + 8, 35, 12, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Etiqueta del barco
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EMBARCACIÓN EN VARADA (FIBRA DE VIDRIO)', cx, cy - 8);

    ctx.restore();
  }

  private drawMooredBoat(cx: number, cy: number): void {
    const ctx = this.ctx;
    ctx.save();

    // Ligero balanceo con el mar
    const bob = Math.sin(this.time * 2) * 3;
    const boatY = cy + bob;

    // Sombra en el agua
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.beginPath();
    ctx.ellipse(cx, boatY + 35, 90, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Casco del barco
    ctx.beginPath();
    ctx.moveTo(cx - 70, boatY - 120); // Proa hacia arriba
    ctx.bezierCurveTo(cx - 40, boatY - 150, cx + 40, boatY - 150, cx + 70, boatY - 120);
    ctx.lineTo(cx + 65, boatY + 120); // Popa
    ctx.lineTo(cx - 65, boatY + 120);
    ctx.closePath();

    const boatGrad = ctx.createLinearGradient(cx - 70, boatY, cx + 70, boatY);
    boatGrad.addColorStop(0, '#f8fafc');
    boatGrad.addColorStop(0.5, '#e2e8f0');
    boatGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = boatGrad;
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Línea de flotación / Obra viva para aplicar Antifouling
    ctx.fillStyle = 'rgba(185, 28, 28, 0.7)';
    ctx.fillRect(cx - 65, boatY + 20, 130, 80);

    // Cubierta de teca de madera
    ctx.fillStyle = '#b45309';
    ctx.fillRect(cx - 45, boatY - 80, 90, 80);

    // Mástil central
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(cx, boatY - 40, 8, 0, Math.PI * 2);
    ctx.fill();

    // Texto descriptivo
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ZONA PINTADO ANTIFOULING', cx, boatY + 60);

    ctx.restore();
  }

  private drawSeaWater(x: number, y: number, w: number, h: number): void {
    const ctx = this.ctx;
    ctx.save();

    // Fondo marino profundo
    const waterGrad = ctx.createLinearGradient(x, y, x + w, y + h);
    waterGrad.addColorStop(0, '#0369a1');
    waterGrad.addColorStop(0.5, '#0284c7');
    waterGrad.addColorStop(1, '#075985');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(x, y, w, h);

    // Ondas marinas dinámicas
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    for (let wy = y + 20; wy < y + h; wy += 35) {
      ctx.beginPath();
      for (let wx = x; wx < x + w; wx += 20) {
        const waveOffset = Math.sin((wx * 0.05) + this.time * 2 + (wy * 0.02)) * 5;
        if (wx === x) ctx.moveTo(wx, wy + waveOffset);
        else ctx.lineTo(wx, wy + waveOffset);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawBollard(x: number, y: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawWorkbench(x: number, y: number, w: number, h: number): void {
    const ctx = this.ctx;
    // Tablero de madera gruesa
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Tornillo de banco metálico
    ctx.fillStyle = '#475569';
    ctx.fillRect(x + 10, y + 5, 20, 20);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 8, y + 2, 24, 6);

    // Herramientas sobre el banco (llave inglesa y destornillador)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 50, y + 25);
    ctx.lineTo(x + 80, y + 35);
    ctx.stroke();

    // Carrete de cable eléctrico
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(x + 115, y + 30, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(x + 115, y + 30, 6, 0, Math.PI * 2);
    ctx.fill();

    // Etiqueta
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BANCO & CUADRO ELÉCTRICO', x + w / 2, y - 6);
  }

  private drawExtractionHood(x: number, y: number, w: number, h: number): void {
    const ctx = this.ctx;
    // Campana de aspiración con conducto galvanizado
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + w / 2 - 12, y, 24, 30); // Tubo

    // Cono de la campana
    ctx.beginPath();
    ctx.moveTo(x + w / 2 - 15, y + 30);
    ctx.lineTo(x + w / 2 + 15, y + 30);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fillStyle = '#475569';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Rejilla de aspiración con partículas animadas de succión
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    for (let lx = x + 15; lx < x + w - 10; lx += 15) {
      const pOffset = (this.time * 20) % 15;
      ctx.beginPath();
      ctx.moveTo(lx, y + h + 15 - pOffset);
      ctx.lineTo(lx, y + h - pOffset);
      ctx.stroke();
    }

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ASPIRACIÓN LOCALIZADA', x + w / 2, y + h + 16);
  }

  private drawEPICabinet(x: number, y: number, w: number, h: number): void {
    const ctx = this.ctx;
    // Armario metálico azul
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Puertas y tiradores
    ctx.strokeStyle = '#075985';
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w / 2, y + h);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + w / 2 - 4, y + h / 2 - 5, 2, 10);
    ctx.fillRect(x + w / 2 + 2, y + h / 2 - 5, 2, 10);

    // Señal de uso obligatorio de EPI (círculo azul con cruz o máscara)
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 20, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EPI', x + w / 2, y + 23);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('ARMARIO EPIS', x + w / 2, y + h + 14);
  }

  private drawHazardDrums(x: number, y: number): void {
    const ctx = this.ctx;
    // Bidones industriales para residuos de fibra y disolventes
    const drums = [
      { dx: x, dy: y, color: '#eab308', label: 'TÓXICO' },
      { dx: x + 25, dy: y + 10, color: '#ef4444', label: 'FIBRA' }
    ];

    drums.forEach(d => {
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.ellipse(d.dx, d.dy, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(d.dx - 12, d.dy, 24, 25);
      ctx.beginPath();
      ctx.ellipse(d.dx, d.dy + 25, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rombo de peligro
      ctx.fillStyle = '#000000';
      ctx.save();
      ctx.translate(d.dx, d.dy + 12);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-3, -3, 6, 6);
      ctx.restore();
    });

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RESIDUOS PELIGROSOS', x + 12, y + 46);
  }

  private drawSafetySignPost(x: number, y: number): void {
    const ctx = this.ctx;
    // Poste y panel de señales reglamentarias
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x - 2, y, 4, 35);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 25, y - 25, 50, 25);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 25, y - 25, 50, 25);

    // Pictograma azul de obligación
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(x - 12, y - 12, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(x + 12, y - 12, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SEÑALIZACIÓN', x, y + 44);
  }

  private drawChemicalSpillPallet(x: number, y: number): void {
    const ctx = this.ctx;
    // Cubeto de retención amarillo
    ctx.fillStyle = '#eab308';
    ctx.fillRect(x, y, 70, 45);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 70, 45);

    // Rejilla del cubeto
    ctx.strokeStyle = '#713f12';
    ctx.lineWidth = 1;
    for (let lx = x + 10; lx < x + 70; lx += 12) {
      ctx.beginPath();
      ctx.moveTo(lx, y);
      ctx.lineTo(lx, y + 45);
      ctx.stroke();
    }

    // Latas de pintura antifouling encima
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 12, y + 10, 18, 22);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x + 38, y + 10, 18, 22);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CUBETO RETENCIÓN', x + 35, y + 58);
  }

  private drawEmergencyShower(x: number, y: number): void {
    const ctx = this.ctx;
    // Tubo de ducha de emergencia verde
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x, y + 35);
    ctx.lineTo(x, y - 15);
    ctx.lineTo(x + 15, y - 15);
    ctx.stroke();

    // Rociador
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(x + 15, y - 12, 8, 0, Math.PI);
    ctx.fill();

    // Cuenco de lavaojos
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(x, y + 10, 10, 0, Math.PI);
    ctx.fill();

    // Señal verde con cruz blanca
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(x - 18, y - 35, 18, 18);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 11, y - 32, 4, 12);
    ctx.fillRect(x - 15, y - 28, 12, 4);

    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DUCHA & LAVAOJOS', x, y + 48);
  }

  private drawWindsock(x: number, y: number): void {
    const ctx = this.ctx;
    // Mástil
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 40);
    ctx.stroke();

    // Manga cónica de viento (franjas rojas y blancas ondeando)
    const wave = Math.sin(this.time * 3) * 4;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 28, y + wave);
    ctx.lineTo(x + 28, y + 10 + wave);
    ctx.lineTo(x, y + 14);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 8, y + 2, 7, 10);
    ctx.fillRect(x + 20, y + 4, 5, 7);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VENTILACIÓN & VIENTO', x, y + 52);
  }

  private drawFlammableCabinet(x: number, y: number): void {
    const ctx = this.ctx;
    // Armario amarillo ignífugo RF-90
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(x, y, 55, 65);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 55, 65);

    // Pictograma de llama de fuego
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(x + 27, y + 25, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('INFLAM.', x + 27, y + 28);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('ARMARIO IGNÍFUGO', x + 27, y + 78);
  }

  private drawBrassToolsTable(x: number, y: number): void {
    const ctx = this.ctx;
    // Mesa metálica
    ctx.fillStyle = '#475569';
    ctx.fillRect(x, y, 60, 35);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, 60, 35);

    // Herramientas doradas de bronce / cobre antichispa
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 12);
    ctx.lineTo(x + 28, y + 24);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 35, y + 22);
    ctx.lineTo(x + 50, y + 10);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ÚTILES ANTICHISPA', x + 30, y + 48);
  }

  private drawChemicalSuitsRack(x: number, y: number): void {
    const ctx = this.ctx;
    // Perchero metálico
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 15, y);
    ctx.lineTo(x + 15, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 35);
    ctx.moveTo(x - 12, y + 35);
    ctx.lineTo(x + 12, y + 35);
    ctx.stroke();

    // Traje blanco colgado con capucha (Tipo 4/5/6)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x - 10, y + 4, 20, 26);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 10, y + 4, 20, 26);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BUZOS TIPO 4/5/6', x, y + 48);
  }

  private drawDecontaminationStation(x: number, y: number): void {
    const ctx = this.ctx;
    // Contenedor de descontaminación de guantes
    ctx.fillStyle = '#eab308';
    ctx.fillRect(x - 12, y + 5, 24, 25);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 12, y + 5, 24, 25);

    // Tapa y rótulo
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x - 14, y + 2, 28, 4);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RETIRADA EPIS', x, y + 44);
  }

  private drawNPC(x: number, y: number, name: string, shirtColor: string, helmetColor: string): void {
    const ctx = this.ctx;
    const bob = Math.sin(this.time * 2 + x) * 1.5;
    const ny = y + bob;

    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, ny + 16, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cuerpo / Ropa de trabajo
    ctx.fillStyle = shirtColor;
    ctx.fillRect(x - 9, ny - 6, 18, 16);

    // Cabeza
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(x, ny - 12, 7, 0, Math.PI * 2);
    ctx.fill();

    // Casco de seguridad
    ctx.fillStyle = helmetColor;
    ctx.beginPath();
    ctx.arc(x, ny - 15, 8, Math.PI, 0, false);
    ctx.fill();
    ctx.fillRect(x - 10, ny - 15, 20, 3); // Visera

    // Nombre y rol sobre la cabeza
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, x, ny - 25);
  }

  // ==========================================
  // ESTACIONES DE RETO INTERACTIVAS
  // ==========================================
  private drawChallengeStations(challenges: Challenge[], nearObject: Challenge | null): void {
    const ctx = this.ctx;

    challenges.forEach(obj => {
      const isNear = nearObject?.id === obj.id;
      const isCompleted = obj.completed;

      // Anillo de pulso exterior
      const pulse = Math.sin(this.time * 4 + obj.id) * 3;
      const radius = 16 + (isNear ? 4 : 0);

      ctx.save();

      // Aura brillante
      if (!isCompleted) {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, radius + 6 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = isNear ? 'rgba(59, 130, 246, 0.35)' : 'rgba(245, 158, 11, 0.2)';
        ctx.fill();
      }

      // Círculo base de la baliza interactiva
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isCompleted ? '#475569' : (isNear ? '#2563eb' : '#d97706');
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Icono / Símbolo dentro del círculo
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let glyph = '⚠️';
      if (isCompleted) glyph = '✓';
      else if (obj.type === 'tool') glyph = '🔧';
      else if (obj.type === 'epi') glyph = '🥽';
      else if (obj.type === 'npc') glyph = '👤';
      else if (obj.type === 'chemical') glyph = '🧪';
      else if (obj.type === 'ventilation') glyph = '💨';
      else if (obj.type === 'electrical') glyph = '⚡';
      else if (obj.type === 'waste') glyph = '🛢️';
      else if (obj.type === 'emergency') glyph = '🚿';
      else if (obj.type === 'sign') glyph = '📋';

      ctx.fillText(glyph, obj.x, obj.y + 1);

      // Placa identificativa del reto
      ctx.font = 'bold 10px sans-serif';
      ctx.textBaseline = 'bottom';
      const labelY = obj.y - radius - 6;

      const textWidth = ctx.measureText(obj.name).width;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(obj.x - textWidth / 2 - 6, labelY - 14, textWidth + 12, 16);
      ctx.strokeStyle = isCompleted ? '#64748b' : (isNear ? '#60a5fa' : '#f59e0b');
      ctx.lineWidth = 1;
      ctx.strokeRect(obj.x - textWidth / 2 - 6, labelY - 14, textWidth + 12, 16);

      ctx.fillStyle = isCompleted ? '#94a3b8' : '#ffffff';
      ctx.fillText(obj.name, obj.x, labelY);

      ctx.restore();
    });
  }

  // ==========================================
  // DIBUJO DEL PERSONAJE TÉCNICO (SPRITE 2D)
  // Basado en el técnico con casco azul y mono
  // ==========================================
  private drawPlayer(player: Player): void {
    const ctx = this.ctx;
    const px = player.x + player.width / 2;
    const py = player.y + player.height / 2;

    ctx.save();

    // Sombra del técnico
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(px, py + 14, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Animación de paso de piernas (caminar)
    const walkOffset = player.isMoving ? Math.sin(player.frame * 0.4) * 4 : 0;

    // Botas de seguridad (RD 773/1997 - Puntera reforzada)
    ctx.fillStyle = '#78350f'; // Cuero oscuro
    ctx.fillRect(px - 9, py + 8 + walkOffset, 7, 8);
    ctx.fillRect(px + 2, py + 8 - walkOffset, 7, 8);
    // Puntera de acero
    ctx.fillStyle = '#451a03';
    ctx.fillRect(px - 9, py + 12 + walkOffset, 7, 4);
    ctx.fillRect(px + 2, py + 12 - walkOffset, 7, 4);

    // Pantalón / Mono azul de trabajo
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(px - 10, py - 4, 20, 16);

    // Tirantes del mono
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(px - 8, py - 12, 4, 8);
    ctx.fillRect(px + 4, py - 12, 4, 8);

    // Cinturón de herramientas de cuero con hebilla dorada
    ctx.fillStyle = '#92400e';
    ctx.fillRect(px - 11, py - 3, 22, 4);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(px - 3, py - 3, 6, 4);

    // Camiseta blanca bajo el mono
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(px - 8, py - 12, 16, 8);

    // Brazos
    ctx.fillStyle = '#fed7aa'; // Brazos piel
    const armSwing = player.isMoving ? Math.sin(player.frame * 0.4) * 5 : 0;
    ctx.fillRect(px - 13, py - 10 - armSwing, 4, 11);
    ctx.fillRect(px + 9, py - 10 + armSwing, 4, 11);

    // Herramienta en mano derecha (destornillador / llave)
    ctx.fillStyle = '#dc2626'; // Mango rojo
    ctx.fillRect(px + 10, py + 1 + armSwing, 3, 6);
    ctx.fillStyle = '#94a3b8'; // Vástago metálico
    ctx.fillRect(px + 10, py + 7 + armSwing, 2, 6);

    // Cabeza del técnico (sonriente, ojos expresivos)
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(px, py - 18, 9, 0, Math.PI * 2);
    ctx.fill();

    // Cara según dirección
    if (player.direction === 'down') {
      // Ojos y sonrisa
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px - 4, py - 18, 2, 3);
      ctx.fillRect(px + 2, py - 18, 2, 3);
      // Sonrisa
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px, py - 15, 3, 0.1, Math.PI - 0.1);
      ctx.stroke();
    } else if (player.direction === 'left') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px - 5, py - 18, 2, 3);
    } else if (player.direction === 'right') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + 3, py - 18, 2, 3);
    }

    // Casco azul de seguridad (como en las imágenes de referencia del usuario)
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(px, py - 22, 10, Math.PI, 0, false);
    ctx.fill();

    // Visera del casco
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(px - 12, py - 22, 24, 4);

    // Franja reflectante blanca del casco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px - 4, py - 28, 8, 3);

    ctx.restore();
  }

  private drawParticles(): void {
    const ctx = this.ctx;
    ctx.save();
    for (const p of this.particles) {
      const alpha = 1 - (p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawProximityPrompt(nearObject: Challenge): void {
    const ctx = this.ctx;
    const px = nearObject.x;
    const py = nearObject.y + 36;

    ctx.save();
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(px - 110, py, 220, 26, 6);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Pulsa [ ESPACIO ] o [ E ] para interactuar', px, py + 13);
    ctx.restore();
  }
}
