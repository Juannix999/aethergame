import React from 'react';
import {
  Volume2,
  VolumeX,
  Menu,
  Sparkles,
  Zap,
  Shield,
  Crosshair,
  CloudRain,
  CloudLightning,
  Orbit,
} from 'lucide-react';
import { sound } from '../game/audio';
import { WeatherState } from '../game/types';

interface GameHUDProps {
  hudData: {
    hp: number;
    maxHp: number;
    shield: number;
    maxShield: number;
    xp: number;
    xpNeeded: number;
    level: number;
    score: number;
    coinsThisRun: number;
    wave: number;
    dashReady: boolean;
    dashCooldownPct: number;
    specialReady: boolean;
    specialCooldownPct: number;
    bossActive: boolean;
    bossHpPct: number;
    bossName: string;
    weather?: WeatherState;
  };
  specialName: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  autoAim: boolean;
  onToggleAutoAim: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  hudData,
  specialName,
  isMuted,
  onToggleMute,
  onPause,
  autoAim,
  onToggleAutoAim,
}) => {
  const hpPct = Math.max(0, Math.min(100, (hudData.hp / hudData.maxHp) * 100));
  const shieldPct =
    hudData.maxShield > 0 ? Math.max(0, Math.min(100, (hudData.shield / hudData.maxShield) * 100)) : 0;
  const xpPct = Math.max(0, Math.min(100, (hudData.xp / hudData.xpNeeded) * 100));

  return (
    <div
      style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between px-2.5 pb-2.5 sm:px-5 sm:pb-5 z-40"
    >
      {/* Top Bar: XP Progress & Perimeter Stats (z-40 sits cleanly above TouchControls z-30) */}
      <div className="w-full flex flex-col gap-1.5">
        {/* Row 1: XP Level Bar & Coins */}
        <div className="w-full flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/60 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold text-cyan-400 font-mono shrink-0 shadow-sm">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>NV.{hudData.level}</span>
          </div>

          <div className="flex-1 h-2.5 bg-slate-900/90 border border-slate-700/50 rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-400 transition-all duration-200 ease-out"
              style={{ width: `${xpPct}%` }}
            />
          </div>

          <div className="text-[10px] sm:text-[11px] font-mono text-cyan-300 tabular-nums shrink-0 font-medium">
            {Math.floor(hudData.xp)}/{hudData.xpNeeded}
          </div>

          <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 rounded-md text-amber-300 text-[11px] font-mono tabular-nums font-semibold shrink-0">
            <span>🪙</span>
            <span>{hudData.coinsThisRun}</span>
          </div>
        </div>

        {/* Row 2: HP/Shield, Wave & Weather, Score & Edge Interactive Controls */}
        <div className="flex items-center justify-between gap-2 w-full mt-0.5">
          {/* Left: Health & Shield Cluster */}
          <div className="flex flex-col gap-1 min-w-[96px] flex-1 max-w-[140px] sm:max-w-[190px]">
            {/* HP Bar */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold tracking-wider text-rose-400 w-5">PV</span>
              <div className="flex-1 h-3 bg-slate-900/90 border border-slate-700/60 rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-150"
                  style={{ width: `${hpPct}%` }}
                />
              </div>
              <span className="text-[10px] font-mono tabular-nums text-slate-300 font-semibold w-10 sm:w-12 text-right">
                {Math.ceil(hudData.hp)}/{hudData.maxHp}
              </span>
            </div>

            {/* Shield Bar (if active) */}
            {hudData.maxShield > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold tracking-wider text-sky-400 w-5">ESC</span>
                <div className="flex-1 h-2 bg-slate-900/90 border border-slate-700/60 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-600 to-cyan-300 transition-all duration-150"
                    style={{ width: `${shieldPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono tabular-nums text-sky-300 w-10 sm:w-12 text-right">
                  {Math.ceil(hudData.shield)}
                </span>
              </div>
            )}
          </div>

          {/* Center Metric: Wave Counter & Weather Indicator */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-900/85 border border-slate-800 rounded-md shadow-sm">
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-heading font-medium">
                Oleada
              </span>
              <span className="text-xs sm:text-base font-bold font-mono text-amber-400 tabular-nums">
                {hudData.wave}
              </span>
            </div>

            {/* Dynamic Weather Indicator */}
            {hudData.weather && (
              <div
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/85 rounded-md border text-[11px] font-mono shadow-sm transition-all"
                style={{
                  borderColor: `${hudData.weather.color}60`,
                  color: hudData.weather.color,
                }}
                title={hudData.weather.description}
              >
                {hudData.weather.type === 'RAIN' && <CloudRain className="w-3.5 h-3.5" />}
                {hudData.weather.type === 'STORM' && <CloudLightning className="w-3.5 h-3.5 animate-pulse" />}
                {hudData.weather.type === 'NEBULA' && <Orbit className="w-3.5 h-3.5" />}
                {hudData.weather.type === 'CLEAR' && <Sparkles className="w-3.5 h-3.5" />}
                <span className="font-semibold tracking-tight">{hudData.weather.name}</span>
              </div>
            )}
          </div>

          {/* Right Edge: Score + Interactive Sound, Auto-Aim & Edge Menu/Pause Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="text-right hidden md:flex flex-col mr-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Puntuación</div>
              <div className="text-xs sm:text-sm font-bold font-mono text-slate-100 tabular-nums">
                {hudData.score.toLocaleString()}
              </div>
            </div>

            {/* Interactive HUD Buttons (trigger immediately on pointerdown for reliable mobile response) */}
            <div
              data-no-drag="true"
              className="flex items-center gap-1.5 p-1.5 -m-1.5 pointer-events-auto touch-none"
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  sound.click();
                  onToggleAutoAim();
                }}
                onClick={(e) => {
                  if (e.detail === 0) {
                    sound.click();
                    onToggleAutoAim();
                  }
                }}
                className={`w-10 h-10 rounded-lg transition-all active:scale-90 flex items-center justify-center border shadow-sm touch-manipulation ${
                  autoAim
                    ? 'bg-cyan-950/90 border-cyan-500/60 text-cyan-300'
                    : 'bg-slate-900/90 border-slate-700 text-slate-400'
                }`}
                title="Auto-Apuntado (On/Off)"
                aria-label="Alternar auto-apuntado"
              >
                <Crosshair className="w-4 h-4 pointer-events-none" />
              </button>

              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const willUnmute = isMuted;
                  onToggleMute();
                  if (willUnmute) {
                    sound.click();
                  }
                }}
                onClick={(e) => {
                  if (e.detail === 0) {
                    const willUnmute = isMuted;
                    onToggleMute();
                    if (willUnmute) sound.click();
                  }
                }}
                className={`w-10 h-10 rounded-lg transition-all active:scale-90 flex items-center justify-center border shadow-sm touch-manipulation ${
                  isMuted
                    ? 'bg-rose-950/80 border-rose-500/50 text-rose-400'
                    : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-cyan-300'
                }`}
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 pointer-events-none" />
                ) : (
                  <Volume2 className="w-4 h-4 pointer-events-none" />
                )}
              </button>

              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  sound.click();
                  onPause();
                }}
                onClick={(e) => {
                  if (e.detail === 0) {
                    sound.click();
                    onPause();
                  }
                }}
                className="h-10 px-3 rounded-lg bg-slate-900/95 hover:bg-slate-800 active:scale-90 border border-cyan-500/50 text-slate-100 flex items-center gap-1.5 shadow-md shadow-cyan-950/40 transition-all touch-manipulation"
                title="Menú de Pausa y Opciones (Esc / Botón Atrás)"
                aria-label="Abrir menú de pausa"
              >
                <Menu className="w-4 h-4 text-cyan-400 pointer-events-none" />
                <span className="text-[11px] font-mono font-bold tracking-wider pointer-events-none">MENÚ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Boss HP Bar Notification if active */}
        {hudData.bossActive && (
          <div className="w-full max-w-md mx-auto mt-2 bg-slate-950/90 border border-rose-500/60 rounded-md p-2 shadow-lg shadow-rose-950/40">
            <div className="flex justify-between items-center text-[11px] font-heading font-bold text-rose-400 mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                {hudData.bossName}
              </span>
              <span className="font-mono tabular-nums text-slate-300">
                {Math.round(hudData.bossHpPct * 100)}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-900 rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 transition-all duration-100"
                style={{ width: `${hudData.bossHpPct * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Desktop Ability Cooldown Status Indicators (if desktop keyboard is used) */}
      <div className="hidden sm:flex items-center justify-center gap-4 mb-2">
        {/* Dash Ready Indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors ${
            hudData.dashReady
              ? 'bg-slate-900/80 border-cyan-500/60 text-cyan-300 shadow-sm'
              : 'bg-slate-950/80 border-slate-800 text-slate-500'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>DASH [ESPACIO]</span>
          {!hudData.dashReady && (
            <span className="text-[10px] text-slate-400 tabular-nums">
              ({Math.ceil(hudData.dashCooldownPct * 100)}%)
            </span>
          )}
        </div>

        {/* Special Ability Indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors ${
            hudData.specialReady
              ? 'bg-slate-900/80 border-amber-500/60 text-amber-300 shadow-sm'
              : 'bg-slate-950/80 border-slate-800 text-slate-500'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>{specialName.toUpperCase()} [E]</span>
          {!hudData.specialReady && (
            <span className="text-[10px] text-slate-400 tabular-nums">
              ({Math.ceil(hudData.specialCooldownPct * 100)}%)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
