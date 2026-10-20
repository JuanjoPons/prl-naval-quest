import { LEVELS_DATA } from '../data/challenges';

export function exportStandaloneHTML(studentName: string, groupId = '1º FP Naval'): void {
  const levelsJSON = JSON.stringify(LEVELS_DATA);

  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PRL Naval Quest - Simulador de Seguridad y Salud</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
    body { background-color: #0b1120; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 12px; }
    #game-wrapper { position: relative; width: 800px; max-width: 100%; border: 3px solid #3b82f6; border-radius: 16px; overflow: hidden; background: #0f172a; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    #hud { width: 100%; padding: 12px 20px; background: rgba(15, 23, 42, 0.95); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; border-bottom: 2px solid #334155; gap: 10px; font-size: 14px; }
    .hud-badge { background: #1e293b; border: 1px solid #475569; padding: 4px 10px; border-radius: 8px; font-weight: 600; font-size: 13px; }
    .score-badge { background: #0369a1; border: 1px solid #38bdf8; color: #fff; padding: 4px 12px; border-radius: 8px; font-weight: bold; }
    canvas { display: block; background: #1e293b; width: 100%; height: auto; image-rendering: pixelated; }
    .modal { position: absolute; inset: 0; background: rgba(11, 17, 32, 0.88); backdrop-filter: blur(6px); display: flex; justify-content: center; align-items: center; z-index: 50; padding: 20px; }
    .modal-box { background: #0f172a; border: 2px solid #3b82f6; border-radius: 16px; max-width: 580px; width: 100%; padding: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); max-height: 90vh; overflow-y: auto; }
    .btn-opt { display: block; width: 100%; padding: 12px 16px; margin: 10px 0; background: #1e293b; border: 1px solid #334155; border-radius: 10px; color: #e2e8f0; font-size: 14px; text-align: left; cursor: pointer; transition: all 0.2s; font-weight: 500; }
    .btn-opt:hover { background: #1d4ed8; border-color: #60a5fa; color: #fff; transform: translateY(-2px); }
    .btn-primary { background: #2563eb; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; }
    .btn-primary:hover { background: #1d4ed8; }
    .hidden { display: none !important; }
    .btn-touch { width: 50px; height: 50px; background: #1e293b; border: 1px solid #475569; border-radius: 12px; color: #fff; font-size: 18px; font-weight: bold; display: flex; align-items: center; justify-content: center; }
    .btn-touch:active { background: #2563eb; }
  </style>
</head>
<body>
  <div id="game-wrapper">
    <div id="hud">
      <div class="hud-badge">👤 Alumno: <span id="hud-name">${studentName || 'Técnico PRL'}</span></div>
      <div class="hud-badge" style="color: #34d399;">👥 Grupo: <span id="hud-group">${groupId}</span></div>
      <div class="hud-badge">⚓ <span id="hud-level-title">Sesión 1</span></div>
      <div class="hud-badge">❤️ <span id="hud-lives">❤️❤️❤️</span></div>
      <div class="score-badge">📊 Nota: <span id="hud-score">5.0</span> / 10</div>
      <div style="display: flex; gap: 6px;">
        <button class="btn-primary" style="padding: 4px 10px; font-size: 12px; background: #d97706;" onclick="showOfflineLeaderboard()">🏆 Top 5</button>
        <button class="btn-primary" style="padding: 4px 10px; font-size: 12px;" onclick="showReport()">Ver Informe</button>
        <button class="btn-primary" style="padding: 4px 10px; font-size: 12px; background: #334155;" onclick="showSessionMenu()">Sesiones</button>
      </div>
    </div>

    <canvas id="gameCanvas" width="800" height="600"></canvas>

    <!-- Modal Reto -->
    <div id="challenge-modal" class="modal hidden">
      <div class="modal-box">
        <h3 id="modal-chal-title" style="color: #60a5fa; font-size: 18px; margin-bottom: 8px;"></h3>
        <p id="modal-chal-desc" style="color: #cbd5e1; font-size: 14px; margin-bottom: 16px; line-height: 1.5;"></p>
        <div id="modal-chal-options"></div>
        <div id="modal-feedback" class="hidden" style="margin-top: 14px; padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.4;"></div>
        <div style="margin-top: 16px; text-align: right;">
          <button id="btn-next-action" class="btn-primary hidden" onclick="closeChallengeModal()">Continuar Exploración</button>
        </div>
      </div>
    </div>

    <!-- Modal Selección de Sesión -->
    <div id="session-modal" class="modal">
      <div class="modal-box" style="text-align: center;">
        <h2 style="color: #38bdf8; margin-bottom: 8px;">🚢 PRL Naval Quest - Simulador Autónomo</h2>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px;">Usa las <b>Flechas / WASD</b> para moverte y pulsa <b>[ ESPACIO ] o [ E ]</b> junto a las balizas doradas.</p>
        <button class="btn-opt" onclick="loadLevel(1)">📍 Sesión 1: Taller de Mantenimiento y Evaluación de Riesgos (8 Retos)</button>
        <button class="btn-opt" onclick="loadLevel(2)">📍 Sesión 2: El Muelle y Productos Químicos - Antifouling (8 Retos)</button>
        <button class="btn-opt" onclick="loadLevel(3)">📍 Sesión 3: Trabajo en Altura en Embarcación - Palo Mayor (8 Retos)</button>
        <button class="btn-opt" onclick="loadLevel(4)">📍 Sesión 4: La Sentina - Espacios Confinados y Elec. (8 Retos)</button>
        <button class="btn-opt" onclick="loadLevel(5)">📍 Sesión 5: Varadero - Emergencias y Primeros Auxilios (8 Retos)</button>
      </div>
    </div>

    <!-- Modal Informe de Evaluación -->
    <div id="report-modal" class="modal hidden">
      <div class="modal-box">
        <h2 style="color: #38bdf8; margin-bottom: 8px;">📊 Informe de Calificación - PRL Naval</h2>
        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 16px;">Alumno/a: <b>${studentName || 'Técnico PRL'}</b> | Grupo: <b style="color: #34d399;">${groupId}</b></p>
        <div style="background: #1e293b; padding: 16px; border-radius: 12px; margin-bottom: 16px; text-align: center;">
          <div style="font-size: 12px; color: #94a3b8;">CALIFICACIÓN FINAL DE LA SESIÓN</div>
          <div id="report-score" style="font-size: 36px; font-weight: bold; color: #38bdf8; font-family: monospace;">5.0 / 10</div>
          <div id="report-qual" style="font-size: 14px; font-weight: bold; color: #10b981; margin-top: 4px;">Suficiente</div>
        </div>
        <div id="report-log" style="max-height: 180px; overflow-y: auto; font-size: 12px; line-height: 1.5; color: #cbd5e1; margin-bottom: 16px;"></div>
        <div style="display: flex; justify-content: space-between;">
          <button class="btn-primary" style="background: #334155;" onclick="window.print()">Imprimir / PDF</button>
          <button class="btn-primary" onclick="closeReport()">Volver</button>
        </div>
      </div>
    </div>

    <!-- Modal Cuadro de Honor Top 5 -->
    <div id="leaderboard-modal" class="modal hidden">
      <div class="modal-box">
        <h2 style="color: #f59e0b; margin-bottom: 6px;">🏆 Cuadro de Honor - Top 5 Puntuaciones</h2>
        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 16px;">Mejores notas registradas en este navegador (LocalStorage):</p>
        <div id="leaderboard-list" style="max-height: 260px; overflow-y: auto; margin-bottom: 16px;"></div>
        <div style="display: flex; justify-content: space-between; gap: 8px;">
          <button class="btn-primary" style="background: #475569; font-size: 11px;" onclick="clearOfflineLeaderboard()">Borrar Historial</button>
          <button class="btn-primary" onclick="closeOfflineLeaderboard()">Cerrar</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    const LEVELS_DB = ${levelsJSON};
    let currentLevel = 1;
    let score = 5.0;
    let lives = 3;
    let challenges = [];
    let activeChallenge = null;
    let nearObject = null;
    let time = 0;
    let challengeLog = [];

    const player = { x: 90, y: 310, width: 32, height: 32, speed: 3.5, direction: 'down', frame: 0, isMoving: false };
    const keys = {};

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Web Audio Synthesizer
    let audioCtx = null;
    function playSfx(type) {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        if (type === 'correct') {
          osc.frequency.setValueAtTime(523, now);
          osc.frequency.setValueAtTime(659, now + 0.1);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'damage') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(110, now);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now); osc.stop(now + 0.3);
        }
      } catch(e) {}
    }

    window.addEventListener('keydown', e => {
      keys[e.key.toLowerCase()] = true;
      if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && nearObject && !nearObject.completed && document.getElementById('challenge-modal').classList.contains('hidden') && document.getElementById('session-modal').classList.contains('hidden') && document.getElementById('report-modal').classList.contains('hidden')) {
        e.preventDefault();
        openChallenge(nearObject);
      }
    });
    window.addEventListener('keyup', e => {
      keys[e.key.toLowerCase()] = false;
    });

    function showSessionMenu() {
      document.getElementById('session-modal').classList.remove('hidden');
    }

    function showReport() {
      const clamped = Math.max(1.0, Math.min(10.0, score));
      saveOfflineLeaderboardRecord(clamped);
      document.getElementById('report-score').innerText = clamped.toFixed(1) + ' / 10.0';
      let qual = 'Insuficiente (Suspenso)';
      if (clamped >= 9.0) qual = 'Sobresaliente';
      else if (clamped >= 7.0) qual = 'Notable';
      else if (clamped >= 6.0) qual = 'Bien';
      else if (clamped >= 5.0) qual = 'Suficiente (Aprobado)';
      document.getElementById('report-qual').innerText = qual;

      const logContainer = document.getElementById('report-log');
      logContainer.innerHTML = '';
      if (challengeLog.length === 0) {
        logContainer.innerHTML = '<i>Aún no has resuelto retos en esta sesión.</i>';
      } else {
        challengeLog.forEach(item => {
          const div = document.createElement('div');
          div.style.marginBottom = '8px';
          div.style.padding = '6px';
          div.style.background = '#0f172a';
          div.style.borderRadius = '6px';
          div.innerHTML = '<b>' + item.title + ':</b> ' + (item.delta >= 0 ? '+' : '') + item.delta.toFixed(1) + ' pts<br><small style="color:#94a3b8;">' + item.text + '</small>';
          logContainer.appendChild(div);
        });
      }
      document.getElementById('report-modal').classList.remove('hidden');
    }

    function closeReport() {
      document.getElementById('report-modal').classList.add('hidden');
    }

    const OFFLINE_KEY = 'prl_naval_quest_offline_top5';
    function getOfflineScores() {
      try {
        const raw = localStorage.getItem(OFFLINE_KEY);
        if (raw) return JSON.parse(raw);
      } catch(e) {}
      return [
        { student: 'Oficial Ruiz', level: 'Taller Naval', score: 9.8, lives: 3, date: '12 oct' },
        { student: 'Alba Garrido', level: 'Muelle Químicos', score: 9.4, lives: 3, date: '13 oct' },
        { student: 'Carlos Méndez', level: 'Palo Mayor', score: 8.9, lives: 2, date: '14 oct' },
        { student: 'Lucas Vega', level: 'Sentina Confinada', score: 8.5, lives: 2, date: '14 oct' },
        { student: 'Elena Pastor', level: 'Taller Naval', score: 8.0, lives: 2, date: '14 oct' }
      ];
    }

    function saveOfflineLeaderboardRecord(finalScore) {
      if (challengeLog.length === 0) return;
      try {
        const list = getOfflineScores();
        const student = document.getElementById('hud-name').innerText || 'Técnico PRL';
        const lvlName = (LEVELS_DB[currentLevel]?.name || 'Nivel ' + currentLevel).split(':')[0];
        const now = new Date();
        const dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        list.push({ student, level: lvlName, score: Math.round(finalScore * 10) / 10, lives, date: dateStr });
        list.sort((a,b) => b.score - a.score || b.lives - a.lives);
        localStorage.setItem(OFFLINE_KEY, JSON.stringify(list.slice(0, 15)));
      } catch(e) {}
    }

    function showOfflineLeaderboard() {
      saveOfflineLeaderboardRecord(Math.max(1.0, Math.min(10.0, score)));
      const list = getOfflineScores().slice(0, 5);
      const container = document.getElementById('leaderboard-list');
      container.innerHTML = '';
      if (list.length === 0) {
        container.innerHTML = '<div style=\"text-align:center; color:#94a3b8; padding:15px;\">No hay puntuaciones registradas.</div>';
      } else {
        list.forEach((entry, idx) => {
          const div = document.createElement('div');
          div.style.display = 'flex';
          div.style.justifyContent = 'space-between';
          div.style.alignItems = 'center';
          div.style.padding = '8px 12px';
          div.style.marginBottom = '6px';
          div.style.background = idx === 0 ? 'rgba(245, 158, 11, 0.15)' : '#0f172a';
          div.style.border = idx === 0 ? '1px solid #f59e0b' : '1px solid #334155';
          div.style.borderRadius = '8px';
          div.innerHTML = '<div><b style=\"color:#fff;\">#' + (idx + 1) + ' ' + entry.student + '</b><br><small style=\"color:#60a5fa;\">' + entry.level + ' • ' + '❤️'.repeat(entry.lives) + '</small></div><div style=\"font-size:16px; font-weight:bold; color:#38bdf8; font-family:monospace;\">' + Number(entry.score).toFixed(1) + ' <small style=\"font-size:10px; color:#94a3b8;\">/ 10</small></div>';
          container.appendChild(div);
        });
      }
      document.getElementById('leaderboard-modal').classList.remove('hidden');
    }

    function closeOfflineLeaderboard() {
      document.getElementById('leaderboard-modal').classList.add('hidden');
    }

    function clearOfflineLeaderboard() {
      localStorage.removeItem(OFFLINE_KEY);
      showOfflineLeaderboard();
    }

    function loadLevel(lvlId) {
      currentLevel = lvlId;
      score = 5.0;
      lives = 3;
      challengeLog = [];
      const lvlConfig = LEVELS_DB[lvlId];
      challenges = JSON.parse(JSON.stringify(lvlConfig.challenges));
      player.x = lvlConfig.startingX;
      player.y = lvlConfig.startingY;
      document.getElementById('hud-level-title').innerText = lvlConfig.name.split(':')[0];
      document.getElementById('session-modal').classList.add('hidden');
      updateHUD();
    }

    function updateHUD() {
      document.getElementById('hud-score').innerText = Math.max(1.0, Math.min(10.0, score)).toFixed(1);
      document.getElementById('hud-lives').innerText = '❤️'.repeat(Math.max(0, lives));
    }

    function openChallenge(ch) {
      activeChallenge = ch;
      document.getElementById('modal-chal-title').innerText = ch.title;
      document.getElementById('modal-chal-desc').innerText = ch.desc;
      const optsContainer = document.getElementById('modal-chal-options');
      optsContainer.innerHTML = '';
      document.getElementById('modal-feedback').className = 'hidden';
      document.getElementById('btn-next-action').classList.add('hidden');

      ch.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'btn-opt';
        btn.innerText = opt.text;
        btn.onclick = () => selectOption(opt);
        optsContainer.appendChild(btn);
      });

      document.getElementById('challenge-modal').classList.remove('hidden');
    }

    function selectOption(opt) {
      score += opt.scoreDelta;
      activeChallenge.completed = true;
      challengeLog.push({ title: activeChallenge.title, text: opt.text, delta: opt.scoreDelta });

      const fdb = document.getElementById('modal-feedback');
      fdb.classList.remove('hidden');
      if (opt.damage) {
        lives--;
        playSfx('damage');
        fdb.style.background = '#450a0a';
        fdb.style.border = '1px solid #dc2626';
        fdb.style.color = '#fca5a5';
        fdb.innerHTML = '<b>⚠️ ¡ACCIDENTE LABORAL!</b> Pierdes 1 vida.<br>' + opt.explanation;
      } else if (opt.correct) {
        playSfx('correct');
        fdb.style.background = '#064e3b';
        fdb.style.border = '1px solid #059669';
        fdb.style.color = '#6ee7b7';
        fdb.innerHTML = '<b>✓ ¡ACCIÓN PREVENTIVA CORRECTA!</b><br>' + opt.explanation;
      } else {
        fdb.style.background = '#422006';
        fdb.style.border = '1px solid #d97706';
        fdb.style.color = '#fde68a';
        fdb.innerHTML = '<b>Falta o Descuido en PRL:</b><br>' + opt.explanation;
      }

      updateHUD();
      document.querySelectorAll('#modal-chal-options button').forEach(b => b.disabled = true);
      document.getElementById('btn-next-action').classList.remove('hidden');
    }

    function closeChallengeModal() {
      document.getElementById('challenge-modal').classList.add('hidden');
      if (challenges.every(c => c.completed)) {
        setTimeout(showReport, 400);
      }
    }

    function updateGame() {
      const isModal = !document.getElementById('challenge-modal').classList.contains('hidden') || !document.getElementById('session-modal').classList.contains('hidden') || !document.getElementById('report-modal').classList.contains('hidden');
      if (isModal) return;

      player.isMoving = false;
      if (keys['arrowup'] || keys['w']) { player.y -= player.speed; player.direction = 'up'; player.isMoving = true; }
      if (keys['arrowdown'] || keys['s']) { player.y += player.speed; player.direction = 'down'; player.isMoving = true; }
      if (keys['arrowleft'] || keys['a']) { player.x -= player.speed; player.direction = 'left'; player.isMoving = true; }
      if (keys['arrowright'] || keys['d']) { player.x += player.speed; player.direction = 'right'; player.isMoving = true; }

      if (player.isMoving) player.frame++;

      player.x = Math.max(15, Math.min(canvas.width - player.width - 15, player.x));
      player.y = Math.max(55, Math.min(canvas.height - player.height - 15, player.y));

      nearObject = null;
      challenges.forEach(c => {
        const dist = Math.hypot((player.x + 16) - c.x, (player.y + 16) - c.y);
        if (dist < 46 && !c.completed) nearObject = c;
      });
    }

    function draw() {
      time += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (currentLevel === 1) {
        // Taller Suelo
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Líneas de juntas
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
        for (let y = 0; y < canvas.height; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

        // Barco en varada
        ctx.fillStyle = '#0369a1';
        ctx.beginPath(); ctx.ellipse(360, 260, 130, 42, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.fillStyle = '#ef4444'; ctx.fillRect(300, 265, 120, 20); // Obra viva
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('EMBARCACIÓN EN VARADA (FIBRA DE VIDRIO)', 360, 255);

        // Banco de trabajo
        ctx.fillStyle = '#92400e'; ctx.fillRect(560, 420, 150, 60);
        ctx.strokeStyle = '#b45309'; ctx.strokeRect(560, 420, 150, 60);
        ctx.fillStyle = '#fde68a'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('BANCO & CUADRO ELÉCTRICO', 635, 415);

        // Aspiración
        ctx.fillStyle = '#475569'; ctx.fillRect(600, 70, 60, 50);
        ctx.fillStyle = '#38bdf8'; ctx.fillText('ASPIRACIÓN LOCALIZADA', 630, 135);

        // Residuos
        ctx.fillStyle = '#eab308'; ctx.fillRect(670, 250, 25, 30);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(700, 250, 25, 30);
        ctx.fillStyle = '#fde68a'; ctx.fillText('RESIDUOS PELIGROSOS', 700, 295);
      } else if (currentLevel === 2) {
        // Muelle y Mar
        ctx.fillStyle = '#334155'; ctx.fillRect(0, 0, 540, canvas.height);
        ctx.fillStyle = '#0284c7'; ctx.fillRect(540, 0, 260, canvas.height);
        // Ondas animadas
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        for (let wy = 30; wy < canvas.height; wy += 40) {
          ctx.beginPath();
          for (let wx = 540; wx < canvas.width; wx += 20) {
            const wave = Math.sin(wx*0.05 + time*2 + wy*0.02)*4;
            if (wx === 540) ctx.moveTo(wx, wy + wave); else ctx.lineTo(wx, wy + wave);
          }
          ctx.stroke();
        }
        // Barco amarrado
        ctx.fillStyle = '#f8fafc'; ctx.fillRect(590, 150, 110, 240);
        ctx.fillStyle = '#b91c1c'; ctx.fillRect(590, 270, 110, 90);
        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 10px sans-serif'; ctx.fillText('ZONA PINTADO ANTIFOULING', 645, 320);

        // Cubeto retención
        ctx.fillStyle = '#eab308'; ctx.fillRect(430, 280, 70, 45);
        ctx.fillStyle = '#fde68a'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('CUBETO RETENCIÓN', 465, 338);

        // Ducha emergencia
        ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(370, 475); ctx.lineTo(370, 435); ctx.lineTo(385, 435); ctx.stroke();
        ctx.fillStyle = '#4ade80'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('DUCHA & LAVAOJOS', 370, 488);

        // Buzos y Descontaminación
        ctx.fillStyle = '#f8fafc'; ctx.fillRect(130, 275, 20, 26);
        ctx.strokeStyle = '#38bdf8'; ctx.strokeRect(130, 275, 20, 26);
        ctx.fillStyle = '#fde68a'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('BUZOS TIPO 4/5/6', 140, 315);

        ctx.fillStyle = '#eab308'; ctx.fillRect(268, 278, 24, 24);
        ctx.fillStyle = '#38bdf8'; ctx.fillText('RETIRADA EPIS', 280, 315);
      } else if (currentLevel === 3) {
        // Cubierta Velero y Palo Mayor
        ctx.fillStyle = '#0284c7'; ctx.fillRect(0, 0, canvas.width, canvas.height); // Mar
        ctx.fillStyle = '#b45309'; ctx.fillRect(100, 30, 600, 540); // Cubierta teca
        ctx.strokeStyle = '#78350f'; ctx.lineWidth = 4; ctx.strokeRect(100, 30, 600, 540);
        // Palo Mayor central
        ctx.fillStyle = '#64748b'; ctx.beginPath(); ctx.arc(400, 250, 18, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#fde68a'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('PALO MAYOR (>12m ALTURA)', 400, 225);
        // Botavara
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(400, 250); ctx.lineTo(400, 360); ctx.stroke();
      } else if (currentLevel === 4) {
        // Sentina y Sala Máquinas
        ctx.fillStyle = '#090d16'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Pozo sentina
        ctx.fillStyle = '#071626'; ctx.fillRect(120, 200, 560, 160);
        // Bomba achique
        ctx.fillStyle = '#ef4444'; ctx.fillRect(440, 270, 35, 45);
        ctx.fillStyle = '#fde68a'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('BOMBA DE ACHIQUE', 460, 330);
        // Baterías LOTO
        ctx.fillStyle = '#1e293b'; ctx.fillRect(480, 180, 80, 45);
        ctx.strokeStyle = '#eab308'; ctx.strokeRect(480, 180, 80, 45);
        ctx.fillStyle = '#facc15'; ctx.fillRect(515, 190, 14, 14);
        ctx.fillStyle = '#64748b'; ctx.font = 'bold 11px sans-serif';
        ctx.fillText('SENTINA - ESPACIO CONFINADO', 400, 90);
      } else if (currentLevel === 5) {
        // Varadero y Puesto de Emergencias
        ctx.fillStyle = '#1e2430'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Raíles
        ctx.strokeStyle = '#475569'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(80, 260); ctx.lineTo(720, 260); ctx.moveTo(80, 310); ctx.lineTo(720, 310); ctx.stroke();
        // Barco en cuna
        ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.ellipse(380, 270, 130, 30, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#dc2626'; ctx.fillRect(290, 275, 180, 14);
        ctx.fillStyle = '#fde68a'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('EMBARCACIÓN EN CUNA DE VARADA', 380, 250);
        // Fuego clase B
        ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.arc(180, 150, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ef4444'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('¡FUEGO CLASE B!', 180, 175);
        // Extintores
        ctx.fillStyle = '#991b1b'; ctx.fillRect(415, 110, 50, 55);
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 8px sans-serif'; ctx.fillText('CO2 / ABC', 440, 158);
        // DEA & RCP
        ctx.fillStyle = '#065f46'; ctx.fillRect(555, 165, 50, 50);
        ctx.fillStyle = '#6ee7b7'; ctx.font = 'bold 8px sans-serif'; ctx.fillText('DEA & RCP', 580, 210);
        // Punto de encuentro
        ctx.fillStyle = '#15803d'; ctx.fillRect(130, 425, 60, 50);
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 8px sans-serif'; ctx.fillText('PUNTO ENCUENTRO', 160, 455);
      }

      // Balizas de Reto
      challenges.forEach(c => {
        const isNear = nearObject?.id === c.id;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = c.completed ? '#64748b' : (isNear ? '#2563eb' : '#f59e0b');
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(c.name, c.x, c.y - 22);
      });

      // Técnico (Casco azul, mono de trabajo)
      const px = player.x + 16;
      const py = player.y + 16;
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(px, py + 12, 12, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2563eb'; ctx.fillRect(px - 10, py - 4, 20, 16); // Mono
      ctx.fillStyle = '#92400e'; ctx.fillRect(px - 11, py - 3, 22, 4); // Cinturón
      ctx.fillStyle = '#f8fafc'; ctx.fillRect(px - 8, py - 11, 16, 7); // Camiseta
      ctx.fillStyle = '#fed7aa'; ctx.beginPath(); ctx.arc(px, py - 17, 8, 0, Math.PI * 2); ctx.fill(); // Cara
      ctx.fillStyle = '#0284c7'; ctx.beginPath(); ctx.arc(px, py - 20, 9, Math.PI, 0, false); ctx.fill(); // Casco
      ctx.fillStyle = '#0369a1'; ctx.fillRect(px - 11, py - 20, 22, 3); // Visera

      // Prompt proximidad
      if (nearObject && !nearObject.completed) {
        ctx.fillStyle = '#10b981';
        ctx.fillRect(nearObject.x - 100, nearObject.y + 24, 200, 24);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Pulsa [ ESPACIO / E ] para interactuar', nearObject.x, nearObject.y + 40);
      }
    }

    function loop() {
      updateGame();
      draw();
      requestAnimationFrame(loop);
    }

    loadLevel(1);
    loop();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PRL_Naval_Quest_${studentName.replace(/\s+/g, '_') || 'Simulador'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
