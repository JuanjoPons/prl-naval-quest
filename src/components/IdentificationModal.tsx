import React, { useState } from 'react';
import { User, Users, Shield, ArrowRight, Award, Anchor, CheckCircle } from 'lucide-react';

interface IdentificationModalProps {
  initialName: string;
  initialGroup: string;
  isOpen: boolean;
  onSave: (name: string, group: string) => void;
  onClose?: () => void;
  isMandatory?: boolean; // If true (on initial launch), user must enter details to proceed
}

export const IdentificationModal: React.FC<IdentificationModalProps> = ({
  initialName,
  initialGroup,
  isOpen,
  onSave,
  onClose,
  isMandatory = false
}) => {
  const [name, setName] = useState(initialName || '');
  const [group, setGroup] = useState(initialGroup || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanGroup = group.trim();

    if (!cleanName) {
      setError('Por favor, introduce tu nombre y apellidos.');
      return;
    }
    if (!cleanGroup) {
      setError('Por favor, indica el ID del grupo o clase (ej. FP Naval 1º A).');
      return;
    }

    setError(null);
    onSave(cleanName, cleanGroup);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-blue-500 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-blue-950/50 space-y-6 my-auto">
        
        {/* Header with Naval PRL Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 mb-1 shadow-lg shadow-blue-900/30">
            <Anchor className="w-8 h-8 text-blue-400" />
          </div>
          <span className="text-xs uppercase font-bold text-blue-400 tracking-wider block">
            Astillero y Mantenimiento de Embarcaciones
          </span>
          <h2 className="text-2xl font-black text-white">
            PRL Naval Quest
          </h2>
          <p className="text-xs text-slate-300 max-w-sm mx-auto">
            Identificación obligatoria para la emisión de la rúbrica oficial de evaluación continua en Prevención de Riesgos Laborales.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs px-3.5 py-2.5 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Student Name */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Nombre y Apellidos del Alumno/a:</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ej. Laura Martínez Sánchez"
              className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
              autoFocus
            />
          </div>

          {/* Group ID */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>ID del Grupo / Curso / Centro:</span>
            </label>
            <input
              type="text"
              value={group}
              onChange={(e) => {
                setGroup(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ej. 1º GM Mantenimiento Barcos - Grupo B"
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          {/* Educational notice */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400 space-y-1 text-left">
            <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Vinculación con el Informe Docente en PDF:</span>
            </div>
            <p className="leading-relaxed">
              Tus datos quedarán reflejados en el encabezado oficial del informe de aciertos y errores, en el cálculo de la nota de 1.0 a 10.0 y en el Cuadro de Honor.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center gap-2">
            {!isMandatory && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 px-4 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-900/40 transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{isMandatory ? 'Iniciar Simulación de PRL' : 'Guardar Identificación'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
