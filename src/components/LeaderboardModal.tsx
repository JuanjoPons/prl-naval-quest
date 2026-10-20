import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types/prl';
import {
  getTop5Scores,
  getLeaderboard,
  clearLeaderboard,
  resetToDefaultLeaderboard
} from '../utils/leaderboard';
import {
  Trophy,
  Medal,
  Award,
  Calendar,
  Heart,
  CheckCircle2,
  AlertTriangle,
  X,
  Trash2,
  RotateCcw,
  Sparkles,
  Flame
} from 'lucide-react';

interface LeaderboardModalProps {
  onClose: () => void;
  highlightEntryId?: string | null;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  onClose,
  highlightEntryId
}) => {
  const [topScores, setTopScores] = useState<LeaderboardEntry[]>([]);
  const [viewAll, setViewAll] = useState<boolean>(false);
  const [allScores, setAllScores] = useState<LeaderboardEntry[]>([]);
  const [showConfirmClear, setShowConfirmClear] = useState<boolean>(false);

  const loadScores = () => {
    setTopScores(getTop5Scores());
    setAllScores(getLeaderboard());
  };

  useEffect(() => {
    loadScores();
  }, []);

  const handleClear = () => {
    clearLeaderboard();
    loadScores();
    setShowConfirmClear(false);
  };

  const handleResetDefaults = () => {
    resetToDefaultLeaderboard();
    loadScores();
    setShowConfirmClear(false);
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2.5 py-1 rounded-full text-xs font-black shadow-sm shadow-amber-500/20">
            <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>1º PUESTO</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center gap-1 bg-slate-300/20 text-slate-200 border border-slate-300/40 px-2.5 py-1 rounded-full text-xs font-bold">
            <Medal className="w-3.5 h-3.5 text-slate-300" />
            <span>2º PUESTO</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center gap-1 bg-amber-800/30 text-amber-400 border border-amber-700/50 px-2.5 py-1 rounded-full text-xs font-bold">
            <Medal className="w-3.5 h-3.5 text-amber-500" />
            <span>3º PUESTO</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold font-mono">
            #{rank}
          </div>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9.0) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    if (score >= 7.0) return 'text-sky-400 border-sky-500/40 bg-sky-950/40';
    if (score >= 6.0) return 'text-blue-400 border-blue-500/40 bg-blue-950/40';
    if (score >= 5.0) return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    return 'text-rose-400 border-rose-500/40 bg-rose-950/40';
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Reciente';
    }
  };

  const displayList = viewAll ? allScores : topScores;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/10">
              <Trophy className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-amber-400 tracking-wider">
                  Cuadro de Honor y Récords
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  Top 5 Histórico
                </span>
              </div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Ranking de Mejores Notas PRL
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            title="Cerrar ranking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewAll(false)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                !viewAll
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Top 5 Mejores
            </button>
            <button
              onClick={() => setViewAll(true)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                viewAll
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas las Sesiones ({allScores.length})
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Almacenamiento: <span className="font-mono text-emerald-400">LocalStorage</span>
          </div>
        </div>

        {/* List of Scores */}
        <div className="space-y-3">
          {displayList.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
              <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-300">
                Aún no hay puntuaciones registradas
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Completa una sesión práctica en el astillero para registrar tu nota en el Cuadro de Honor.
              </p>
              <button
                onClick={handleResetDefaults}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition flex items-center gap-1.5 mx-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Cargar Puntuaciones de Ejemplo
              </button>
            </div>
          ) : (
            displayList.map((entry, index) => {
              const rank = index + 1;
              const isFirst = rank === 1;
              const isHighlighted = highlightEntryId === entry.id;

              return (
                <div
                  key={entry.id}
                  className={`relative p-4 rounded-xl border transition-all duration-200 ${
                    isFirst
                      ? 'bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/50 shadow-md shadow-amber-950/20'
                      : isHighlighted
                      ? 'bg-blue-950/40 border-blue-500 ring-1 ring-blue-500'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isFirst && (
                    <div className="absolute -top-2.5 right-4 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wide">
                      <Sparkles className="w-3 h-3" />
                      Récord del Astillero
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Rank & Student Info */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getRankBadge(rank)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm sm:text-base text-white">
                            {entry.studentName}
                          </h3>
                          {isHighlighted && (
                            <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">
                              Tu Sesión
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-blue-400 font-medium flex items-center gap-1.5 flex-wrap">
                          <span>{entry.levelName}</span>
                          {entry.groupId && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                              {entry.groupId}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Right: Score and stats */}
                    <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap justify-between sm:justify-end border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
                      {/* Vidas restantes */}
                      <div className="flex items-center gap-1 text-xs text-rose-400 font-mono" title={`${entry.lives} vidas conservadas`}>
                        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        <span>{entry.lives}/3</span>
                      </div>

                      {/* Retos y accidentes */}
                      <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {entry.completedChallengesCount}/{entry.totalChallengesCount}
                        </span>
                        {entry.accidentsCount > 0 ? (
                          <span className="text-amber-400 flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" />
                            {entry.accidentsCount}
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-bold text-[11px]">
                            0 acc.
                          </span>
                        )}
                      </div>

                      {/* Calificación Final */}
                      <div
                        className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-sm flex items-baseline gap-1 ${getScoreColor(
                          entry.score
                        )}`}
                      >
                        <span className="text-base">{entry.score.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400">/ 10</span>
                      </div>
                    </div>
                  </div>

                  {/* Date footnote */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(entry.date)}</span>
                    </div>
                    <div>
                      {entry.score >= 9.0 ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Flame className="w-3 h-3 text-emerald-400" />
                          Excelente Desempeño
                        </span>
                      ) : entry.score >= 7.0 ? (
                        <span className="text-sky-400 font-medium">Competencia Acreditada</span>
                      ) : (
                        <span className="text-amber-400">Revisión Recomendada</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!showConfirmClear ? (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="text-xs text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5"
                title="Limpiar puntuaciones guardadas en este navegador"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Borrar Historial</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-500/40 px-2.5 py-1.5 rounded-lg">
                <span className="text-xs text-rose-300">¿Borrar todo?</span>
                <button
                  onClick={handleClear}
                  className="text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white px-2 py-0.5 rounded transition"
                >
                  Sí, borrar
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-0.5"
                >
                  Cancelar
                </button>
              </div>
            )}

            <button
              onClick={handleResetDefaults}
              className="text-xs text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800 transition flex items-center gap-1.5"
              title="Restablecer puntuaciones oficiales de ejemplo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Valores Iniciales</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
          >
            Cerrar Cuadro de Honor
          </button>
        </div>
      </div>
    </div>
  );
};
