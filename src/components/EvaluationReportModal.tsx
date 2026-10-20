import React, { useState } from 'react';
import { SessionResult } from '../types/prl';
import { LEVELS_DATA } from '../data/challenges';
import {
  Award,
  Printer,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  Trophy,
  User,
  Users,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  FileText
} from 'lucide-react';

interface EvaluationReportModalProps {
  result: SessionResult;
  onClose: () => void;
  onExportHTML: () => void;
  onOpenLeaderboard?: () => void;
}

export const EvaluationReportModal: React.FC<EvaluationReportModalProps> = ({
  result,
  onClose,
  onExportHTML,
  onOpenLeaderboard
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'errors'>('all');

  const score = Math.max(1.0, Math.min(10.0, result.finalScore));
  // Sin retos completados no hay evaluación: la nota de partida (5.0) no debe contar como apto
  const evaluated = result.challengeLog.length > 0;
  const isPassing = evaluated && score >= 5.0;

  let qualification = evaluated ? 'Insuficiente (Suspenso)' : 'Sin evaluar (no hay retos completados)';
  let qualColor = 'text-rose-400 bg-rose-950/60 border-rose-500/50';
  let qualBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  if (score >= 9.0) {
    qualification = 'Sobresaliente';
    qualColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/50';
    qualBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  } else if (score >= 7.0) {
    qualification = 'Notable';
    qualColor = 'text-sky-400 bg-sky-950/60 border-sky-500/50';
    qualBadge = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
  } else if (score >= 6.0) {
    qualification = 'Bien';
    qualColor = 'text-blue-400 bg-blue-950/60 border-blue-500/50';
    qualBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  } else if (score >= 5.0) {
    qualification = 'Suficiente (Aprobado)';
    qualColor = 'text-amber-400 bg-amber-950/60 border-amber-500/50';
    qualBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  }

  // Count correct vs incorrect
  const correctCount = result.challengeLog.filter((item) => item.correct).length;
  const incorrectCount = result.challengeLog.filter((item) => !item.correct).length;
  const totalLogged = result.challengeLog.length;

  const handlePrint = () => {
    window.print();
  };

  // Verification code hash based on student, group, level and score
  const verificationHash = `PRL-${result.levelId}-${Math.abs(
    (result.studentName + result.groupId + result.date + score.toFixed(1))
      .split('')
      .reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  ).toString(36).toUpperCase().padStart(8, '0')}`;

  const displayedLog = result.challengeLog.filter((item) => {
    if (filter === 'correct') return item.correct;
    if (filter === 'errors') return !item.correct;
    return true;
  });

  return (
    <div className="report-overlay fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      
      {/* Print-specific style overrides */}
      <style>{`
        @page {
          size: A4;
          margin: 14mm 14mm 16mm 14mm;
        }
        .print-only { display: none; }
        @media print {
          html, body { background: #ffffff !important; }
          /* Solo se imprime el informe: se oculta toda la app de fondo */
          body * { visibility: hidden !important; }
          .printable-report, .printable-report * { visibility: visible !important; }
          .report-overlay {
            position: absolute !important;
            inset: 0 !important;
            display: block !important;
            background: #ffffff !important;
            backdrop-filter: none !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          .printable-report {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            background: #ffffff !important;
            color: #0f172a !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .printable-report .space-y-3 > div,
          .printable-report .avoid-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .print-text-dark { color: #0f172a !important; }
          .print-text-muted { color: #475569 !important; }
          .print-bg-light { background-color: #f8fafc !important; border: 1px solid #e2e8f0 !important; }
          .print-border { border-color: #cbd5e1 !important; }
        }
      `}</style>

      <div className="printable-report bg-slate-900 border-2 border-blue-500/80 rounded-2xl max-w-3xl w-full p-5 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-slate-800 print:border-slate-300 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 print:bg-blue-100 print:text-blue-700">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-blue-400 print:text-blue-700 tracking-wider block">
                Ficha Oficial de Calificación y Rúbrica Pedagógica
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white print:text-slate-900">
                Informe de Aciertos, Errores y Evaluación PRL
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="no-print text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            title="Cerrar informe"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student and Group Identification Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 print-bg-light p-4 rounded-xl border border-slate-800 print:border-slate-300 text-xs">
          <div>
            <span className="text-slate-400 print-text-muted block text-[11px] font-medium flex items-center gap-1">
              <User className="w-3 h-3 text-blue-400" />
              Alumno/a Evaluado:
            </span>
            <span className="font-bold text-white print-text-dark text-sm block truncate">
              {result.studentName || 'Técnico PRL'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 print-text-muted block text-[11px] font-medium flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-400" />
              ID del Grupo / Clase:
            </span>
            <span className="font-bold text-emerald-400 print:text-emerald-700 text-sm block truncate">
              {result.groupId || 'Grupo General'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 print-text-muted block text-[11px] font-medium flex items-center gap-1">
              <FileText className="w-3 h-3 text-amber-400" />
              Sesión Evaluada:
            </span>
            <span className="font-semibold text-slate-200 print-text-dark truncate block">
              {result.levelName}
            </span>
          </div>

          <div>
            <span className="text-slate-400 print-text-muted block text-[11px] font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3 text-sky-400" />
              Fecha y Hora:
            </span>
            <span className="font-mono text-slate-300 print-text-muted text-[11px] block">
              {result.date}
            </span>
          </div>
        </div>

        {/* Score Stamp and Academic Standing Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 print:bg-slate-50 rounded-2xl border border-slate-800 print:border-slate-300 shadow-inner">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-xs text-slate-400 print-text-muted uppercase tracking-wider font-bold">
              Calificación Numérica Final (1.0 a 10.0)
            </span>
            <div className="flex items-baseline gap-2 justify-center sm:justify-start">
              <span className="text-4xl sm:text-5xl font-black font-mono text-white print-text-dark tracking-tight">
                {evaluated ? score.toFixed(1) : '—'}
              </span>
              <span className="text-lg text-slate-500 font-mono font-bold">/ 10.0</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${qualBadge} print:border-slate-400 print:text-slate-800`}>
                {qualification}
              </div>
              <div className={`px-2.5 py-0.5 rounded-md text-[11px] font-extrabold flex items-center gap-1 ${
                !evaluated
                  ? 'bg-slate-800 text-slate-300 border border-slate-500/50 print:bg-slate-100 print:text-slate-700'
                  : isPassing
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 print:bg-emerald-100 print:text-emerald-800'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-500/50 print:bg-rose-100 print:text-rose-800'
              }`}>
                {!evaluated ? (
                  <span>PENDIENTE DE EVALUACIÓN</span>
                ) : isPassing ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>COMPETENCIA SUPERADA (APTO)</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>NO APTO (REQUIERE RECUPERACIÓN)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 text-xs font-mono w-full sm:w-auto">
            <div className="bg-slate-900/90 print-bg-light border border-slate-800 print:border-slate-300 p-2.5 rounded-xl text-center">
              <span className="text-slate-400 print-text-muted block text-[10px] uppercase font-bold">Aciertos</span>
              <span className="text-emerald-400 print:text-emerald-700 font-black text-base flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {correctCount}
              </span>
            </div>

            <div className="bg-slate-900/90 print-bg-light border border-slate-800 print:border-slate-300 p-2.5 rounded-xl text-center">
              <span className="text-slate-400 print-text-muted block text-[10px] uppercase font-bold">Errores</span>
              <span className={`font-black text-base flex items-center justify-center gap-1 ${incorrectCount > 0 ? 'text-rose-400 print:text-rose-700' : 'text-slate-400'}`}>
                <XCircle className="w-3.5 h-3.5" />
                {incorrectCount}
              </span>
            </div>

            <div className="bg-slate-900/90 print-bg-light border border-slate-800 print:border-slate-300 p-2.5 rounded-xl text-center">
              <span className="text-slate-400 print-text-muted block text-[10px] uppercase font-bold">Vidas Finales</span>
              <span className="text-rose-400 font-black text-base">
                {'❤️'.repeat(Math.max(0, result.livesRemaining))}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Challenge Decisions Breakdown */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 print:border-slate-300 pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print-text-dark">
                Desglose Exhaustivo de Aciertos y Errores Pedagógicos:
              </h3>
              <p className="text-[11px] text-slate-400 print-text-muted">
                Registro de cada decisión tomada con la justificación técnica de prevención aplicada:
              </p>
            </div>

            {/* Filter buttons (hidden on print) */}
            <div className="no-print flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos ({totalLogged})
              </button>
              <button
                onClick={() => setFilter('correct')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  filter === 'correct' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Aciertos ({correctCount})
              </button>
              <button
                onClick={() => setFilter('errors')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  filter === 'errors' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Errores ({incorrectCount})
              </button>
            </div>
          </div>

          {/* List of challenge decisions */}
          <div className="space-y-3 max-h-72 print:max-h-none overflow-y-auto print:overflow-visible pr-1">
            {totalLogged === 0 ? (
              <p className="text-xs text-slate-400 italic p-4 bg-slate-950/40 print-bg-light rounded-xl border border-slate-800 print:border-slate-300 text-center">
                Aún no has completado retos en esta sesión. Interactúa con los puntos técnicos en el escenario para registrar tus decisiones.
              </p>
            ) : (
              displayedLog.map((log, idx) => {
                const isCorrect = log.correct;
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs space-y-2 transition ${
                      isCorrect
                        ? 'bg-slate-950/70 print-bg-light border-emerald-500/40 print:border-emerald-600'
                        : 'bg-rose-950/20 print-bg-light border-rose-500/50 print:border-rose-600'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shrink-0 print:bg-emerald-100 print:text-emerald-800">
                            ✓
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-bold text-xs shrink-0 print:bg-rose-100 print:text-rose-800">
                            ✗
                          </div>
                        )}
                        <span className="font-bold text-slate-100 print-text-dark text-xs sm:text-sm">
                          {log.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isCorrect
                              ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 print:bg-emerald-100 print:text-emerald-800'
                              : 'text-rose-400 bg-rose-950/60 border border-rose-500/40 print:bg-rose-100 print:text-rose-800'
                          }`}
                        >
                          {isCorrect ? 'ACIERTO' : 'ERROR / ACCIDENTE'}{' '}
                          {log.scoreDelta >= 0 ? `+${log.scoreDelta.toFixed(1)}` : log.scoreDelta.toFixed(1)} pts
                        </span>
                      </div>
                    </div>

                    {/* Chosen option */}
                    <div className="pl-7 space-y-1">
                      <div className="text-slate-300 print-text-dark">
                        <span className="text-slate-500 print-text-muted font-medium">Decisión adoptada: </span>
                        <span className="font-medium italic">"{log.chosenText}"</span>
                      </div>

                      {/* Technical rationale / explanation */}
                      <div className={`p-2.5 rounded-lg text-[11px] leading-relaxed border ${
                        isCorrect
                          ? 'bg-emerald-950/30 text-emerald-200 border-emerald-500/20 print:bg-emerald-50 print:text-emerald-900 print:border-emerald-200'
                          : 'bg-rose-950/30 text-rose-200 border-rose-500/20 print:bg-rose-50 print:text-rose-900 print:border-rose-200'
                      }`}>
                        <span className="font-bold block mb-0.5">
                          {isCorrect ? 'Fundamentación Preventiva Homologada:' : 'Riesgo / Infracción Identificada:'}
                        </span>
                        <span>{log.explanation}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Official Signatures & Verification Stamp Section */}
        <div className="border-t border-slate-800 print:border-slate-300 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="border border-dashed border-slate-700 print:border-slate-400 rounded-xl p-3 text-center space-y-8 bg-slate-950/40 print-bg-light">
            <span className="text-[10px] uppercase font-bold text-slate-400 print-text-muted block">
              Firma del Alumno / Técnico
            </span>
            <div className="border-t border-slate-700 print:border-slate-400 pt-1 text-[11px] font-semibold text-slate-300 print-text-dark">
              {result.studentName}
            </div>
          </div>

          <div className="border border-dashed border-slate-700 print:border-slate-400 rounded-xl p-3 text-center space-y-8 bg-slate-950/40 print-bg-light">
            <span className="text-[10px] uppercase font-bold text-slate-400 print-text-muted block">
              Firma y Sello del Docente Evaluador
            </span>
            <div className="border-t border-slate-700 print:border-slate-400 pt-1 text-[11px] font-semibold text-slate-300 print-text-dark">
              Profesor / Instructor de PRL
            </div>
          </div>

          <div className="border border-slate-800 print:border-slate-300 rounded-xl p-3 bg-slate-950/60 print-bg-light flex flex-col justify-between text-[11px] text-slate-400 print-text-muted">
            <div>
              <span className="font-bold text-slate-300 print-text-dark block mb-1">
                Verificación Académica Oficial
              </span>
              <p className="text-[10px] leading-tight">
                Documento de calificación continua generado por el simulador interactivo PRL Naval Quest.
              </p>
            </div>
            <div className="font-mono text-[10px] text-blue-400 print:text-blue-700 font-bold mt-2">
              ID: {verificationHash}
            </div>
          </div>
        </div>

        {LEVELS_DATA[result.levelId] && (
          <div className="avoid-break border border-slate-800 print:border-slate-300 rounded-xl p-4 bg-slate-950/40 print-bg-light text-xs">
            <h3 className="font-bold uppercase tracking-wider text-[11px] text-slate-300 print-text-dark mb-2">
              Competencias evaluadas
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-300 print-text-dark">
              {LEVELS_DATA[result.levelId].targetCompetencies.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Firma y pie solo visibles al imprimir */}
        <div className="print-only text-[10px] text-slate-500 print-text-muted border-t border-slate-300 pt-2">
          Informe generado el {result.date} · {result.studentName} · {result.groupId} · ID {verificationHash}
        </div>

        {/* Action Controls (Hidden on Print) */}
        <div className="no-print border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-md shadow-sky-900/30 transition flex items-center gap-1.5 cursor-pointer"
              title="Abrir cuadro de diálogo de impresión para guardar como PDF"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <span className="text-[10px] text-slate-500 self-center max-w-[220px]">
              En el diálogo, elige "Guardar como PDF" y tamaño A4.
            </span>

            <button
              onClick={onExportHTML}
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-800/60 hover:bg-emerald-700/60 text-emerald-200 rounded-xl border border-emerald-600/50 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Exportar Juego HTML</span>
            </button>

            {onOpenLeaderboard && (
              <button
                onClick={onOpenLeaderboard}
                className="px-3.5 py-2 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl border border-amber-500/40 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Cuadro de Honor (Top 5)</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition shadow-md shadow-blue-900/30 cursor-pointer"
          >
            Volver al Simulador
          </button>
        </div>
      </div>
    </div>
  );
};
