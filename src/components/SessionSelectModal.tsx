import React from 'react';
import { LevelId } from '../types/prl';
import { LEVELS_DATA } from '../data/challenges';
import { Anchor, ShieldAlert, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface SessionSelectModalProps {
  currentLevelId: LevelId;
  onSelectLevel: (lvlId: LevelId) => void;
  onClose: () => void;
}

export const SessionSelectModal: React.FC<SessionSelectModalProps> = ({
  currentLevelId,
  onSelectLevel,
  onClose
}) => {
  const levels = Object.values(LEVELS_DATA);

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-blue-500/80 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Anchor className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-blue-400 tracking-wider">
                Plan Formativo de Prevención Naval
              </span>
              <h2 className="text-xl font-bold text-white">
                Selección de Sesión de Evaluación
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          El curso está estructurado en <b>5 sesiones prácticas</b> con calificación individual de 1 a 10. Cada sesión cuenta con entre 8 y 10 retos técnicos interactivos en escenarios navales reales:
        </p>

        {/* Sessions list */}
        <div className="space-y-3">
          {levels.map((lvl) => {
            const isCurrent = currentLevelId === lvl.id;
            const isAvailable = lvl.challenges.length > 0;

            return (
              <div
                key={lvl.id}
                onClick={() => {
                  if (isAvailable) {
                    onSelectLevel(lvl.id as LevelId);
                    onClose();
                  }
                }}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-blue-950/60 border-blue-500 ring-1 ring-blue-500 shadow-md'
                    : isAvailable
                    ? 'bg-slate-950/70 border-slate-800 hover:border-blue-500/60 hover:bg-slate-900/80 cursor-pointer'
                    : 'bg-slate-950/30 border-slate-800/40 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-300 text-xs font-bold flex items-center justify-center font-mono">
                      {lvl.id}
                    </span>
                    <h3 className="font-bold text-sm text-white">
                      {lvl.name}
                    </h3>
                  </div>

                  {isCurrent && (
                    <span className="text-[11px] font-semibold text-blue-400 bg-blue-950 border border-blue-800 px-2.5 py-0.5 rounded-full">
                      Sesión Activa
                    </span>
                  )}
                  {!isAvailable && (
                    <span className="text-[11px] font-medium text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                      Próxima Sesión
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mb-2.5 pl-8">
                  {lvl.subtitle}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pl-8 text-xs text-slate-400 border-t border-slate-800/60 pt-2">
                  <div className="flex items-center gap-1.5 text-blue-300">
                    <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
                    <span>{lvl.challenges.length} Retos evaluables</span>
                  </div>

                  {isAvailable && (
                    <div className="flex items-center gap-1 text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                      <span>{isCurrent ? 'Reiniciar' : 'Entrar al Nivel'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
