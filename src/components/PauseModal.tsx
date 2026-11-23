import React from 'react';
import {
  Play,
  RotateCcw,
  Home,
  Volume2,
  VolumeX,
  Settings,
  Crosshair,
  Sliders,
  Activity,
} from 'lucide-react';
import { sound } from '../game/audio';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onOpenSettings?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  hapticsEnabled: boolean;
  onToggleHaptics: () => void;
  autoAim: boolean;
  onToggleAutoAim: () => void;
  sensitivity: 'low' | 'normal' | 'high';
  onChangeSensitivity: (lvl: 'low' | 'normal' | 'high') => void;
  missionStats: {
    wave: number;
    score: number;
    level: number;
    hp: number;
    maxHp: number;
    coinsThisRun: number;
    shipName: string;
    weatherName?: string;
  };
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
  onOpenSettings,
  isMuted,
  onToggleMute,
  hapticsEnabled,
  onToggleHaptics,
  autoAim,
  onToggleAutoAim,
  sensitivity,
  onChangeSensitivity,
  missionStats,
}) => {
  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-center animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div>
          <div className="text-[11px] font-mono font-bold text-cyan-400 tracking-widest uppercase mb-0.5">
            {missionStats.shipName}
          </div>
          <h2 className="text-2xl font-bold font-heading text-slate-100">MENÚ DE PAUSA</h2>
        </div>

        {/* Live Mission Telemetry Strip */}
        <div className="grid grid-cols-4 gap-1.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <div>
            <div className="text-[9px] font-mono text-slate-400 uppercase">Oleada</div>
            <div className="text-sm font-bold font-mono text-amber-400 tabular-nums">
              {missionStats.wave}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-mono text-slate-400 uppercase">Nivel</div>
            <div className="text-sm font-bold font-mono text-cyan-400 tabular-nums">
              {missionStats.level}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-mono text-slate-400 uppercase">PV</div>
            <div className="text-sm font-bold font-mono text-rose-400 tabular-nums">
              {Math.ceil(missionStats.hp)}/{missionStats.maxHp}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-mono text-slate-400 uppercase">Puntos</div>
            <div className="text-sm font-bold font-mono text-slate-100 tabular-nums">
              {missionStats.score.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Primary Resume Button */}
        <button
          type="button"
          onClick={() => {
            sound.click();
            onResume();
          }}
          className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 text-white font-heading font-bold text-sm tracking-wide shadow-md shadow-cyan-600/30 hover:scale-[1.01] active:scale-[0.98] transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>REANUDAR VUELO</span>
        </button>

        {/* Useful In-Flight Tactical Controls */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-left">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Opciones Tácticas Rápidas</span>
            <span className="text-amber-300">🪙 +{missionStats.coinsThisRun}</span>
          </div>

          {/* 3 Quick Toggles */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                const willUnmute = isMuted;
                onToggleMute();
                if (willUnmute) sound.click();
              }}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg border text-[11px] font-semibold transition-all active:scale-95 ${
                !isMuted
                  ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                  : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isMuted ? 'Sin Sonido' : 'Sonido ON'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.click();
                onToggleAutoAim();
              }}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg border text-[11px] font-semibold transition-all active:scale-95 ${
                autoAim
                  ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              <Crosshair className="w-4 h-4" />
              <span>{autoAim ? 'Auto-Aim ON' : 'Manual'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleHaptics();
                sound.click();
              }}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg border text-[11px] font-semibold transition-all active:scale-95 ${
                hapticsEnabled
                  ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{hapticsEnabled ? 'Vibrar ON' : 'Vibrar OFF'}</span>
            </button>
          </div>

          {/* Direct Touch Sensitivity Selector */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Sensibilidad Táctil
              </span>
              <span className="text-cyan-400 uppercase font-bold">
                {sensitivity === 'low' ? 'Baja' : sensitivity === 'high' ? 'Alta' : 'Normal'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['low', 'normal', 'high'] as const).map((lvl) => {
                const active = sensitivity === lvl;
                const label = lvl === 'low' ? 'Baja' : lvl === 'high' ? 'Alta' : 'Normal';
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      sound.click();
                      onChangeSensitivity(lvl);
                    }}
                    className={`py-1.5 rounded-lg text-[11px] font-mono font-bold border transition-all ${
                      active
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation & Settings Actions */}
        <div className="flex flex-col gap-2">
          {onOpenSettings && (
            <button
              type="button"
              onClick={() => {
                sound.click();
                onOpenSettings();
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wide transition-all group"
            >
              <Settings className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
              <span>AJUSTES AVANZADOS (VOLUMEN / GRÁFICOS)</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                sound.click();
                onRestart();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold tracking-wide transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>REINICIAR</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.click();
                onHome();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/40 text-rose-200 text-xs font-semibold tracking-wide transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              <span>MENÚ INICIO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
