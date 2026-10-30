import React from 'react';
import { RotateCcw, Home, Wrench, Trophy, Sparkles } from 'lucide-react';
import { sound } from '../game/audio';

interface GameOverModalProps {
  summary: {
    score: number;
    wave: number;
    kills: number;
    coinsEarned: number;
    timeSurvived: number;
    isNewHighScore: boolean;
  };
  onPlayAgain: () => void;
  onHome: () => void;
  onOpenHangar: () => void;
  onOpenAchievements: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  summary,
  onPlayAgain,
  onHome,
  onOpenHangar,
  onOpenAchievements,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div>
          {summary.isNewHighScore ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/70 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-2 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              <span>¡NUEVO RÉCORD HISTÓRICO!</span>
            </div>
          ) : (
            <div className="text-xs font-mono font-bold text-rose-400 tracking-widest uppercase mb-1">
              Transmisión Interrumpida
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-100">
            {summary.isNewHighScore ? 'VICTORIA TÁCTICA' : 'MISIÓN FINALIZADA'}
          </h2>
        </div>

        {/* Primary Score Highlight */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Puntuación Total</div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-400 tabular-nums my-0.5">
            {summary.score.toLocaleString()}
          </div>
          <div className="text-xs font-mono text-amber-400 font-semibold mt-1">
            +🪙 {summary.coinsEarned} Créditos Añadidos a la Bóveda
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-left">
          <div className="bg-slate-950/50 border border-slate-800/80 p-2.5 rounded-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Oleada</div>
            <div className="text-base font-bold font-mono text-slate-200 tabular-nums">
              {summary.wave}
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800/80 p-2.5 rounded-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Derribos</div>
            <div className="text-base font-bold font-mono text-slate-200 tabular-nums">
              {summary.kills}
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800/80 p-2.5 rounded-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Tiempo</div>
            <div className="text-base font-bold font-mono text-slate-200 tabular-nums">
              {formatTime(summary.timeSurvived)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              sound.click();
              onPlayAgain();
            }}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-heading font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all border border-cyan-400/40"
          >
            <RotateCcw className="w-4 h-4" />
            <span>JUGAR DE NUEVO</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                sound.click();
                onOpenHangar();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold tracking-wide transition-all"
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hangar & Mejoras</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.click();
                onOpenAchievements();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold tracking-wide transition-all"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Logros</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.click();
              onHome();
            }}
            className="text-xs font-mono text-slate-400 hover:text-slate-200 py-1 transition-colors flex items-center justify-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Volver al Menú Principal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
