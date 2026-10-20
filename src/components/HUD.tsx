import React, { useState } from 'react';
import { Volume2, VolumeX, Award, RotateCcw, Download, UserCheck, Trophy, Users, Edit3 } from 'lucide-react';

interface HUDProps {
  studentName: string;
  groupId: string;
  onUpdateStudentName: (name: string) => void;
  onOpenIdentification: () => void;
  levelName: string;
  score: number;
  lives: number;
  completedChallenges: number;
  totalChallenges: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSessionMenu: () => void;
  onOpenReport: () => void;
  onOpenLeaderboard: () => void;
  onExportHTML: () => void;
  onRestartLevel: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  studentName,
  groupId,
  onUpdateStudentName,
  onOpenIdentification,
  levelName,
  score,
  lives,
  completedChallenges,
  totalChallenges,
  soundEnabled,
  onToggleSound,
  onOpenSessionMenu,
  onOpenReport,
  onOpenLeaderboard,
  onExportHTML,
  onRestartLevel
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(studentName);

  const clampedScore = Math.max(1.0, Math.min(10.0, score));

  // Determine score color
  let scoreColorClass = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
  let scoreBarColor = 'bg-emerald-500';
  if (clampedScore < 5.0) {
    scoreColorClass = 'text-rose-400 border-rose-500/40 bg-rose-950/40';
    scoreBarColor = 'bg-rose-500';
  } else if (clampedScore < 7.0) {
    scoreColorClass = 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    scoreBarColor = 'bg-amber-500';
  } else if (clampedScore < 9.0) {
    scoreColorClass = 'text-sky-400 border-sky-500/40 bg-sky-950/40';
    scoreBarColor = 'bg-sky-500';
  }

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateStudentName(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 py-2.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
        
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-base shadow-sm">
            ⚓
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent whitespace-nowrap">
              PRL Naval Quest
            </h1>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-none">
              {levelName.split(':')[0]}
            </p>
          </div>
        </div>

        {/* Central Academic & Progress Indicators */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Student & Group Identification */}
          <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <button
              onClick={onOpenIdentification}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition group text-left cursor-pointer"
              title="Haz clic para modificar el nombre del alumno y el ID del grupo"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="font-semibold text-white max-w-[110px] truncate">
                {studentName || 'Técnico PRL'}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 font-medium max-w-[90px] truncate hidden sm:inline">
                {groupId || 'Grupo A'}
              </span>
              <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-blue-400 shrink-0 ml-0.5" />
            </button>
          </div>

          {/* Lives (Corazones) */}
          <div className="flex items-center gap-1 bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-400 mr-1">Vidas:</span>
            <span className="tracking-widest text-sm">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className={`inline-block transition-transform ${
                    i < lives ? 'scale-100 opacity-100' : 'scale-90 opacity-20 grayscale'
                  }`}
                >
                  ❤️
                </span>
              ))}
            </span>
          </div>

          {/* Calificación de 1.0 a 10.0 */}
          <div className={`flex items-center gap-2 border rounded-lg px-3 py-1 font-mono text-xs ${scoreColorClass}`}>
            <span className="text-slate-400 font-sans font-medium">Nota:</span>
            <span className="font-bold text-sm tracking-tight">{clampedScore.toFixed(1)}</span>
            <span className="text-slate-400">/ 10</span>
            <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden ml-1 hidden sm:block">
              <div
                className={`h-full ${scoreBarColor} transition-all duration-300`}
                style={{ width: `${(clampedScore / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Retos Completados */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 hidden md:flex items-center gap-1.5 font-mono">
            <span>Retos:</span>
            <span className="font-bold text-blue-400">{completedChallenges}</span>
            <span className="text-slate-500">/</span>
            <span>{totalChallenges}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Botón Cuadro de Honor / Top 5 */}
          <button
            onClick={onOpenLeaderboard}
            className="px-2.5 py-1.5 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-amber-950/20"
            title="Ver Cuadro de Honor (Top 5 mejores puntuaciones)"
          >
            <Trophy className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="hidden sm:inline">Top 5</span>
          </button>

          {/* Botón Ver Informe de Evaluación */}
          <button
            onClick={onOpenReport}
            className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-900/30"
            title="Ver informe de evaluación de la sesión"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Informe / Rúbrica</span>
          </button>

          {/* Botón Exportar HTML Autónomo */}
          <button
            onClick={onExportHTML}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition"
            title="Exportar archivo HTML para jugar offline"
          >
            <Download className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Selector de Sesiones */}
          <button
            onClick={onOpenSessionMenu}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
            title="Seleccionar otra sesión de evaluación"
          >
            Sesiones
          </button>

          {/* Reiniciar Sesión */}
          <button
            onClick={onRestartLevel}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition"
            title="Reiniciar esta sesión"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition"
            title={soundEnabled ? 'Silenciar efectos' : 'Activar sonido'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-sky-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
