import React, { useState } from 'react';
import { Challenge, ChallengeOption } from '../types/prl';
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface ChallengeModalProps {
  challenge: Challenge;
  onSelectOption: (option: ChallengeOption) => void;
  onClose: () => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  challenge,
  onSelectOption,
  onClose
}) => {
  const [selectedOption, setSelectedOption] = useState<ChallengeOption | null>(null);

  const handleOptionClick = (opt: ChallengeOption) => {
    if (selectedOption) return; // Prevent double click
    setSelectedOption(opt);
    onSelectOption(opt);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-blue-500/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-3 flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              {challenge.roleOrSub || 'Reto de Seguridad Laboral'}
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              {challenge.title}
            </h2>
          </div>
          <span className="px-2.5 py-1 text-xs rounded-full font-mono bg-blue-950/60 border border-blue-800 text-blue-300 shrink-0">
            {challenge.name}
          </span>
        </div>

        {/* Narrative Description */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-sm leading-relaxed text-slate-200">
          <p>{challenge.desc}</p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Selecciona tu decisión técnica / preventiva:
          </label>
          {challenge.options.map((opt, index) => {
            const isChosen = selectedOption === opt;
            let btnStyle = 'bg-slate-950 border-slate-800 hover:border-blue-500 hover:bg-slate-800/50 text-slate-200';

            if (selectedOption) {
              if (opt.correct) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold ring-1 ring-emerald-500';
              } else if (isChosen && !opt.correct) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 font-semibold ring-1 ring-rose-500';
              } else {
                btnStyle = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(opt)}
                disabled={!!selectedOption}
                className={`w-full p-3.5 rounded-xl border text-left text-sm transition-all duration-200 flex items-start gap-3 ${btnStyle}`}
              >
                <span className="font-mono text-xs mt-0.5 text-blue-400 font-bold shrink-0">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="flex-1 leading-snug">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Alert upon Selection */}
        {selectedOption && (
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300 ${
              selectedOption.damage
                ? 'bg-rose-950/70 border-rose-600 text-rose-200'
                : selectedOption.correct
                ? 'bg-emerald-950/70 border-emerald-600 text-emerald-200'
                : 'bg-amber-950/70 border-amber-600 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1.5 text-sm">
              {selectedOption.damage ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>¡Accidente Laboral Detectado! (-1 Vida)</span>
                </>
              ) : selectedOption.correct ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>¡Medida Preventiva Correcta! (+Nota)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Procedimiento Inadecuado (-Nota)</span>
                </>
              )}
            </div>
            <p className="mt-1 text-slate-300">{selectedOption.explanation}</p>
          </div>
        )}

        {/* Action Button to close */}
        {selectedOption && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-900/40"
            >
              <span>Continuar Exploración</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
