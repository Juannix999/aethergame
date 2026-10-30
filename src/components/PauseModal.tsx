import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Smartphone, Monitor } from 'lucide-react';
import { sound } from '../game/audio';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  hapticsEnabled: boolean;
  onToggleHaptics: () => void;
  showMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
  isMuted,
  onToggleMute,
  hapticsEnabled,
  onToggleHaptics,
  showMobileFrame,
  onToggleMobileFrame,
}) => {
  return (
    <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-center animate-in fade-in zoom-in-95 duration-150">
        <div>
          <div className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase mb-1">
            Misión en Espera
          </div>
          <h2 className="text-2xl font-bold font-heading text-slate-100">JUEGO PAUSADO</h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              sound.click();
              onResume();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 text-white font-heading font-bold text-sm tracking-wide shadow-md shadow-cyan-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>REANUDAR MISIÓN</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              onRestart();
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold tracking-wide transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REINICIAR PARTIDA</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              onHome();
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold tracking-wide transition-all"
          >
            <Home className="w-4 h-4" />
            <span>MENÚ PRINCIPAL</span>
          </button>
        </div>

        {/* Quick Settings Toggles */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-around text-xs text-slate-400 font-mono">
          <button
            type="button"
            onClick={() => {
              sound.click();
              onToggleMute();
            }}
            className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            <span>{isMuted ? 'Silenciado' : 'Sonido'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              onToggleHaptics();
            }}
            className={`flex items-center gap-1.5 transition-colors ${
              hapticsEnabled ? 'text-cyan-400' : 'text-slate-500'
            }`}
          >
            <span>📳</span>
            <span>{hapticsEnabled ? 'Vibración ON' : 'Vibración OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              onToggleMobileFrame();
            }}
            className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
          >
            {showMobileFrame ? <Monitor className="w-4 h-4 text-cyan-400" /> : <Smartphone className="w-4 h-4" />}
            <span>{showMobileFrame ? 'Completa' : 'Móvil'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
