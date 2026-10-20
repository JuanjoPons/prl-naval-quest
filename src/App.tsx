/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Challenge, ChallengeOption, LevelId, Player, SessionResult } from './types/prl';
import { LEVELS_DATA } from './data/challenges';
import { SessionWorld, getLevelBounds } from './game/session3d';
import { HUD } from './components/HUD';
import { ChallengeModal } from './components/ChallengeModal';
import { EvaluationReportModal } from './components/EvaluationReportModal';
import { SessionSelectModal } from './components/SessionSelectModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { IdentificationModal } from './components/IdentificationModal';
import { VirtualDPad } from './components/VirtualDPad';
import { Overworld } from './game/overworld3d';
import {
  playSound,
  isAudioEnabled,
  setAudioEnabled
} from './utils/audio';
import { exportStandaloneHTML } from './utils/htmlExporter';
import { saveScoreToLeaderboard } from './utils/leaderboard';
import { Info, HelpCircle, Trophy, Map as MapIcon } from 'lucide-react';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<SessionWorld | null>(null);

  // User and Game State
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('prl_student_name') || 'Técnico PRL';
  });
  const [groupId, setGroupId] = useState<string>(() => {
    return localStorage.getItem('prl_group_id') || '1º FP Naval';
  });
  const [currentLevelId, setCurrentLevelId] = useState<LevelId>(1);
  const [mode, setMode] = useState<'map' | 'level'>('map');
  const [nearGate, setNearGate] = useState<number | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('prl_completed_levels') || '[]');
    } catch {
      return [];
    }
  });
  const overworldCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overworldRef = useRef<Overworld | null>(null);
  const [score, setScore] = useState<number>(5.0);
  const [lives, setLives] = useState<number>(3);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [nearObject, setNearObject] = useState<Challenge | null>(null);
  const [soundEnabled, setSoundState] = useState<boolean>(true);

  // Modals
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isSessionMenuOpen, setIsSessionMenuOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isIdentificationOpen, setIsIdentificationOpen] = useState<boolean>(() => {
    // Show identification screen on startup if not yet identified
    return !localStorage.getItem('prl_user_identified');
  });
  const [highlightLeaderboardId, setHighlightLeaderboardId] = useState<string | null>(null);
  const [leaderboardToast, setLeaderboardToast] = useState<{ message: string; isTop5: boolean } | null>(null);
  const [showHelpBanner, setShowHelpBanner] = useState<boolean>(true);

  // Assessment tracking
  const [accidentsCount, setAccidentsCount] = useState<number>(0);
  const [challengeLog, setChallengeLog] = useState<SessionResult['challengeLog']>([]);

  // Player physics
  const playerRef = useRef<Player>({
    x: 90,
    y: 310,
    width: 32,
    height: 32,
    speed: 3.5,
    direction: 'down',
    frame: 0,
    isMoving: false
  });

  const keysRef = useRef<Record<string, boolean>>({});

  // Initialize level
  const loadLevel = useCallback((lvlId: LevelId) => {
    const lvlConfig = LEVELS_DATA[lvlId];
    if (!lvlConfig) return;

    setCurrentLevelId(lvlId);
    setScore(5.0); // Baseline 5.0
    setLives(3);
    setAccidentsCount(0);
    setChallengeLog([]);
    setActiveChallenge(null);
    setNearObject(null);

    // Deep clone challenges y reordenar las opciones al azar (la correcta no queda siempre en la misma posición)
    const clonedChallenges = JSON.parse(JSON.stringify(lvlConfig.challenges));
    for (const ch of clonedChallenges) {
      const opts = ch.options as ChallengeOption[];
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
    }
    setChallenges(clonedChallenges);

    // Reset player position
    playerRef.current = {
      x: lvlConfig.startingX,
      y: lvlConfig.startingY,
      width: 32,
      height: 32,
      speed: 3.5,
      direction: 'down',
      frame: 0,
      isMoving: false
    };

    playSound('click');
  }, []);

  // Initial load
  useEffect(() => {
    loadLevel(1);
  }, [loadLevel]);

  // Sync student name
  const handleUpdateStudentName = (name: string) => {
    setStudentName(name);
    localStorage.setItem('prl_student_name', name);
  };

  const handleSaveIdentification = (name: string, group: string) => {
    setStudentName(name);
    setGroupId(group);
    localStorage.setItem('prl_student_name', name);
    localStorage.setItem('prl_group_id', group);
    localStorage.setItem('prl_user_identified', '1');
    setIsIdentificationOpen(false);
  };

  const enterLevel = (lvlId: LevelId) => {
    loadLevel(lvlId);
    setNearGate(null);
    setMode('level');
    setIsSessionMenuOpen(false);
  };

  const returnToMap = () => {
    setActiveChallenge(null);
    setNearObject(null);
    setIsReportOpen(false);
    setMode('map');
  };

  const markLevelCompleted = (lvlId: number) => {
    setCompletedLevels((prev) => {
      if (prev.includes(lvlId)) return prev;
      const next = [...prev, lvlId];
      try {
        localStorage.setItem('prl_completed_levels', JSON.stringify(next));
      } catch {
        /* almacenamiento no disponible */
      }
      return next;
    });
  };

  // Sound toggle
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundState(nextState);
    setAudioEnabled(nextState);
    if (nextState) playSound('click');
  };

  // Escena 3D de la sesión (WebGL)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const world = new SessionWorld(canvas);
    rendererRef.current = world;
    return () => {
      world.dispose();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    rendererRef.current?.setActive(mode === 'level');
  }, [mode]);

  useEffect(() => {
    if (mode === 'level') rendererRef.current?.setLevel(currentLevelId);
  }, [currentLevelId, mode]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      keysRef.current[key] = true;

      // Entrar a una sesión desde el mapa 3D
      if (
        mode === 'map' &&
        (key === 'e' || key === ' ') &&
        nearGate !== null &&
        !isIdentificationOpen &&
        !isLeaderboardOpen
      ) {
        e.preventDefault();
        enterLevel(nearGate as LevelId);
        return;
      }

      // Interaction trigger
      if (
        (key === 'e' || key === ' ') &&
        nearObject &&
        !nearObject.completed &&
        !activeChallenge &&
        !isReportOpen &&
        !isSessionMenuOpen
      ) {
        e.preventDefault();
        playSound('interact');
        setActiveChallenge(nearObject);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearObject, activeChallenge, isReportOpen, isSessionMenuOpen, mode, nearGate, isIdentificationOpen, isLeaderboardOpen]);

  // Main Game Loop (60 FPS)
  useEffect(() => {
    if (mode !== 'level') return;
    let animId: number;

    const gameLoop = () => {
      const player = playerRef.current;
      const keys = keysRef.current;
      const canvas = canvasRef.current;

      // Only allow movement if no modal is obstructing
      const isModalActive = !!activeChallenge || isReportOpen || isSessionMenuOpen;

      if (!isModalActive) {
        let dx = 0;
        let dy = 0;

        if (keys['arrowup'] || keys['w']) {
          dy -= player.speed;
          player.direction = 'up';
        }
        if (keys['arrowdown'] || keys['s']) {
          dy += player.speed;
          player.direction = 'down';
        }
        if (keys['arrowleft'] || keys['a']) {
          dx -= player.speed;
          player.direction = 'left';
        }
        if (keys['arrowright'] || keys['d']) {
          dx += player.speed;
          player.direction = 'right';
        }

        player.isMoving = dx !== 0 || dy !== 0;

        if (player.isMoving) {
          player.x += dx;
          player.y += dy;
          player.frame++;

          if (player.frame % 16 === 0) {
            playSound('step');
          }
          if (rendererRef.current && player.frame % 6 === 0) {
            rendererRef.current.addDustParticle(player.x + 16, player.y + 28);
          }
        }

        // Límites de la zona jugable de cada sesión (en el muelle no se sale al mar)
        const bounds = getLevelBounds(currentLevelId);
        player.x = Math.max(bounds.minX, Math.min(bounds.maxX, player.x));
        player.y = Math.max(bounds.minY, Math.min(bounds.maxY, player.y));

        // Proximity detection for challenges
        let foundNear: Challenge | null = null;
        for (const ch of challenges) {
          const dist = Math.hypot((player.x + 16) - ch.x, (player.y + 16) - ch.y);
          if (dist < 46 && !ch.completed) {
            foundNear = ch;
            break;
          }
        }
        setNearObject(foundNear);
      }

      if (rendererRef.current) {
        rendererRef.current.updateParticles();
        rendererRef.current.render(player, challenges, nearObject, 3 - lives);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [mode, currentLevelId, challenges, nearObject, activeChallenge, isReportOpen, isSessionMenuOpen, lives]);

  // Mapa 3D: se crea al entrar en el mapa y se destruye al salir
  const currentLevelRef = useRef<number>(currentLevelId);
  currentLevelRef.current = currentLevelId;

  useEffect(() => {
    if (mode !== 'map' || !overworldCanvasRef.current) return;
    const ow = new Overworld(
      overworldCanvasRef.current,
      keysRef.current,
      { onNearGate: (id) => setNearGate(id) },
      currentLevelRef.current
    );
    ow.setCompleted(completedLevels);
    overworldRef.current = ow;
    return () => {
      ow.dispose();
      overworldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    overworldRef.current?.setCompleted(completedLevels);
  }, [completedLevels]);

  useEffect(() => {
    overworldRef.current?.setPaused(
      isIdentificationOpen || isLeaderboardOpen || isSessionMenuOpen || isReportOpen
    );
  }, [isIdentificationOpen, isLeaderboardOpen, isSessionMenuOpen, isReportOpen]);

  // Selecting an option in challenge
  const handleSelectOption = (opt: ChallengeOption) => {
    if (!activeChallenge) return;

    // Adjust score
    setScore((prev) => Math.max(1.0, Math.min(10.0, prev + opt.scoreDelta)));

    // Handle damage / accident
    if (opt.damage) {
      playSound('damage');
      setLives((prev) => Math.max(0, prev - 1));
      setAccidentsCount((prev) => prev + 1);
    } else if (opt.correct) {
      playSound('correct');
      if (rendererRef.current) {
        rendererRef.current.addCelebrationParticles(activeChallenge.x, activeChallenge.y);
      }
    } else {
      playSound('wrong');
    }

    // Mark challenge completed
    const updatedChallenges = challenges.map((ch) =>
      ch.id === activeChallenge.id ? { ...ch, completed: true } : ch
    );
    setChallenges(updatedChallenges);

    // Append to log
    setChallengeLog((prev) => [
      ...prev,
      {
        title: activeChallenge.title,
        chosenText: opt.text,
        correct: opt.correct,
        scoreDelta: opt.scoreDelta,
        explanation: opt.explanation
      }
    ]);
  };

  // Session summary result
  const currentConfig = LEVELS_DATA[currentLevelId];
  const completedCount = challenges.filter((c) => c.completed).length;

  // Record session score to leaderboard
  const recordCurrentScoreToLeaderboard = useCallback(() => {
    if (completedCount === 0) return null;
    const saveRes = saveScoreToLeaderboard({
      studentName,
      groupId,
      levelId: currentLevelId,
      levelName: currentConfig?.name || `Sesión ${currentLevelId}`,
      score,
      lives,
      completedChallengesCount: completedCount,
      totalChallengesCount: challenges.length,
      accidentsCount
    });
    setHighlightLeaderboardId(saveRes.entry.id);
    if (saveRes.isTop5) {
      setLeaderboardToast({
        message: saveRes.isNewRecord
          ? '🏆 ¡Nuevo récord #1 registrado en el Cuadro de Honor!'
          : `⭐ ¡Puntuación clasificada en el puesto #${saveRes.rank} del Top 5!`,
        isTop5: true
      });
      setTimeout(() => setLeaderboardToast(null), 5000);
    }
    return saveRes;
  }, [studentName, currentLevelId, currentConfig, score, lives, completedCount, challenges.length, accidentsCount]);

  // Close challenge modal & check for level finish
  const handleCloseChallengeModal = () => {
    setActiveChallenge(null);

    // Check if all challenges in current level are completed
    const remaining = challenges.filter((c) => !c.completed);
    if (remaining.length === 0 && challenges.length > 0) {
      markLevelCompleted(currentLevelId);
      playSound('victory');
      recordCurrentScoreToLeaderboard();
      setTimeout(() => {
        setIsReportOpen(true);
      }, 500);
    }
  };

  const handleOpenReport = () => {
    recordCurrentScoreToLeaderboard();
    setIsReportOpen(true);
  };

  const handleOpenLeaderboard = () => {
    if (completedCount > 0) {
      recordCurrentScoreToLeaderboard();
    }
    setIsLeaderboardOpen(true);
  };

  // Touch D-Pad handlers
  const handleDirectionPress = (dir: 'up' | 'down' | 'left' | 'right', pressed: boolean) => {
    const keyMap = {
      up: 'arrowup',
      down: 'arrowdown',
      left: 'arrowleft',
      right: 'arrowright'
    };
    keysRef.current[keyMap[dir]] = pressed;
  };

  const handleActionPress = () => {
    if (mode === 'map') {
      if (nearGate !== null) enterLevel(nearGate as LevelId);
      return;
    }
    if (nearObject && !nearObject.completed && !activeChallenge) {
      playSound('interact');
      setActiveChallenge(nearObject);
    }
  };

  const sessionResult: SessionResult = {
    levelId: currentLevelId,
    levelName: currentConfig?.name || `Sesión ${currentLevelId}`,
    studentName,
    groupId,
    date: new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    finalScore: score,
    maxScore: 10.0,
    initialScore: 5.0,
    livesRemaining: lives,
    completedChallenges: completedCount,
    totalChallenges: challenges.length,
    accidentsCount,
    challengeLog
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top HUD */}
      <HUD
        studentName={studentName}
        groupId={groupId}
        onUpdateStudentName={handleUpdateStudentName}
        onOpenIdentification={() => setIsIdentificationOpen(true)}
        levelName={currentConfig?.name || ''}
        score={score}
        lives={lives}
        completedChallenges={completedCount}
        totalChallenges={challenges.length}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSessionMenu={() => setIsSessionMenuOpen(true)}
        onOpenReport={handleOpenReport}
        onOpenLeaderboard={handleOpenLeaderboard}
        onExportHTML={() => exportStandaloneHTML(studentName)}
        onRestartLevel={() => loadLevel(currentLevelId)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-5 flex flex-col items-center justify-center">
        
        {/* Help Banner */}
        {showHelpBanner && (
          <div className="w-full max-w-[1200px] mb-3 p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl flex items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                Muévete con las <b>Flechas / WASD</b>. Acércate a los objetos y operarios con baliza dorada y pulsa <b>[ ESPACIO ] o [ E ]</b> para tomar decisiones de seguridad.
              </span>
            </div>
            <button
              onClick={() => setShowHelpBanner(false)}
              className="text-slate-400 hover:text-white px-2 py-0.5 rounded text-[11px] hover:bg-blue-900/40 shrink-0"
            >
              Entendido
            </button>
          </div>
        )}

        {/* 3D Overworld Map */}
        {mode === 'map' && (
          <div className="relative w-full max-w-[1200px] bg-sky-200 border-2 border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 max-h-[78vh]">
            <canvas ref={overworldCanvasRef} className="w-full h-full block" />
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 pointer-events-none flex items-center gap-2">
              <MapIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Mapa del Astillero · elige una sesión</span>
            </div>
            <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 pointer-events-none">
              Sesiones: <span className="text-emerald-400 font-bold">{completedLevels.length}</span>/5
            </div>
            {nearGate !== null && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-amber-500/60 px-4 py-2 rounded-xl text-xs text-amber-200 font-semibold shadow-lg pointer-events-none whitespace-nowrap">
                Pulsa <kbd>ESPACIO</kbd> o <kbd>E</kbd> para entrar en la Sesión {nearGate}
              </div>
            )}
          </div>
        )}

        {/* Game Screen Frame */}
        <div className={`relative w-full max-w-[1200px] bg-slate-900 border-2 border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 aspect-[16/10] max-h-[78vh] ${mode === 'level' ? '' : 'hidden'}`}>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full block"
          />

          {/* Aviso de interacción con el reto cercano */}
          {nearObject && !nearObject.completed && !activeChallenge && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-amber-500/60 px-4 py-2 rounded-xl text-xs text-amber-200 font-semibold shadow-lg pointer-events-none whitespace-nowrap">
              Pulsa <kbd>ESPACIO</kbd> o <kbd>E</kbd> para revisar: {nearObject.name}
            </div>
          )}

          {/* Quick Level Title Badge overlay */}
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 pointer-events-none flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>{currentConfig?.location}</span>
          </div>

          {/* Level Progress indicator in corner */}
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 pointer-events-none">
            Completado: <span className="text-blue-400 font-bold">{Math.round((completedCount / (challenges.length || 1)) * 100)}%</span>
          </div>
        </div>

        {/* Touch D-Pad for Mobile & Tablets */}
        <VirtualDPad
          onDirectionPress={handleDirectionPress}
          onActionPress={handleActionPress}
        />

        {/* Footer Quick Instructions */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 max-w-[1200px] w-full px-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-mono">W A S D</kbd>
              <span>Mover Técnico</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-mono">ESPACIO</kbd>
              <span>Interactuar</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {mode === 'level' && (
              <button
                onClick={returnToMap}
                className="text-amber-400 hover:text-amber-300 font-medium transition flex items-center gap-1"
              >
                🗺 Volver al mapa
              </button>
            )}
            <button
              onClick={() => exportStandaloneHTML(studentName)}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition flex items-center gap-1"
            >
              📥 Descargar Juego HTML Autónomo (Offline)
            </button>
          </div>
        </div>
      </main>

      {/* Identification Modal */}
      <IdentificationModal
        initialName={studentName}
        initialGroup={groupId}
        isOpen={isIdentificationOpen}
        onSave={handleSaveIdentification}
        onClose={() => setIsIdentificationOpen(false)}
        isMandatory={!localStorage.getItem('prl_user_identified')}
      />

      {/* Challenge / Question Modal */}
      {activeChallenge && (
        <ChallengeModal
          challenge={activeChallenge}
          onSelectOption={handleSelectOption}
          onClose={handleCloseChallengeModal}
        />
      )}

      {/* Evaluation Report Modal */}
      {isReportOpen && (
        <EvaluationReportModal
          result={sessionResult}
          onClose={() => setIsReportOpen(false)}
          onExportHTML={() => exportStandaloneHTML(studentName)}
          onOpenLeaderboard={handleOpenLeaderboard}
        />
      )}

      {/* Session Selection Modal */}
      {isSessionMenuOpen && (
        <SessionSelectModal
          currentLevelId={currentLevelId}
          onSelectLevel={enterLevel}
          onClose={() => setIsSessionMenuOpen(false)}
        />
      )}

      {/* Leaderboard Modal (Top 5 LocalStorage) */}
      {isLeaderboardOpen && (
        <LeaderboardModal
          onClose={() => setIsLeaderboardOpen(false)}
          highlightEntryId={highlightLeaderboardId}
        />
      )}

      {/* Floating Leaderboard Toast Notification */}
      {leaderboardToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-950/90 to-slate-900 border-2 border-amber-500/70 text-amber-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-bounce">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Trophy className="w-4 h-4 fill-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">{leaderboardToast.message}</p>
            <button
              onClick={() => {
                setLeaderboardToast(null);
                setIsLeaderboardOpen(true);
              }}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline mt-0.5"
            >
              Abrir Cuadro de Honor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
