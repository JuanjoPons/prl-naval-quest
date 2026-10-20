import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface VirtualDPadProps {
  onDirectionPress: (dir: 'up' | 'down' | 'left' | 'right', pressed: boolean) => void;
  onActionPress: () => void;
}

export const VirtualDPad: React.FC<VirtualDPadProps> = ({
  onDirectionPress,
  onActionPress
}) => {
  return (
    <div className="flex md:hidden items-center justify-between gap-4 mt-3 px-4 w-full max-w-[800px] select-none touch-none">
      {/* Directional Pad */}
      <div className="grid grid-cols-3 gap-1 w-36 h-36 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 shadow-xl">
        <div />
        <button
          onTouchStart={(e) => { e.preventDefault(); onDirectionPress('up', true); }}
          onTouchEnd={(e) => { e.preventDefault(); onDirectionPress('up', false); }}
          onMouseDown={() => onDirectionPress('up', true)}
          onMouseUp={() => onDirectionPress('up', false)}
          className="bg-slate-800 active:bg-blue-600 rounded-xl flex items-center justify-center text-slate-200 border border-slate-700"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div />

        <button
          onTouchStart={(e) => { e.preventDefault(); onDirectionPress('left', true); }}
          onTouchEnd={(e) => { e.preventDefault(); onDirectionPress('left', false); }}
          onMouseDown={() => onDirectionPress('left', true)}
          onMouseUp={() => onDirectionPress('left', false)}
          className="bg-slate-800 active:bg-blue-600 rounded-xl flex items-center justify-center text-slate-200 border border-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="bg-slate-950/60 rounded-lg flex items-center justify-center text-[10px] text-slate-500 font-mono">
          PAD
        </div>
        <button
          onTouchStart={(e) => { e.preventDefault(); onDirectionPress('right', true); }}
          onTouchEnd={(e) => { e.preventDefault(); onDirectionPress('right', false); }}
          onMouseDown={() => onDirectionPress('right', true)}
          onMouseUp={() => onDirectionPress('right', false)}
          className="bg-slate-800 active:bg-blue-600 rounded-xl flex items-center justify-center text-slate-200 border border-slate-700"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        <div />
        <button
          onTouchStart={(e) => { e.preventDefault(); onDirectionPress('down', true); }}
          onTouchEnd={(e) => { e.preventDefault(); onDirectionPress('down', false); }}
          onMouseDown={() => onDirectionPress('down', true)}
          onMouseUp={() => onDirectionPress('down', false)}
          className="bg-slate-800 active:bg-blue-600 rounded-xl flex items-center justify-center text-slate-200 border border-slate-700"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
        <div />
      </div>

      {/* Action Button [ E / ESPACIO ] */}
      <button
        onTouchStart={(e) => { e.preventDefault(); onActionPress(); }}
        onClick={onActionPress}
        className="w-24 h-24 rounded-2xl bg-emerald-600 active:bg-emerald-500 border-2 border-emerald-400 text-white font-extrabold text-sm flex flex-col items-center justify-center shadow-xl active:scale-95 transition-transform"
      >
        <span className="text-xl">⚡</span>
        <span>ACCION</span>
        <span className="text-[10px] opacity-80">[ E ]</span>
      </button>
    </div>
  );
};
