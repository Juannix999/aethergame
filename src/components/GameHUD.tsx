import React from 'react';
import { Volume2, VolumeX, Pause, Sparkles, Zap, Shield, Crosshair, CloudRain, CloudLightning, Orbit } from 'lucide-react';
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
  const shieldPct = hudData.maxShield > 0 ? Math.max(0, Math.min(100, (hudData.shield / hudData.maxShield) * 100)) : 0;
  const xpPct = Math.max(0, Math.min(100, (hudData.xp / hudData.xpNeeded) * 100));

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 sm:p-5 z-20">
      {/* Top Bar: XP Progress & Perimeter Stats (Low Occlusion < 15%) */}
      <div className="w-full flex flex-col gap-1.5">
        {/* XP Level Bar */}
        <div className="w-full flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/60 px-2.5 py-1 rounded-md text-xs font-semibold text-cyan-400 font-mono shrink-0 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NV.{hudData.level}</span>
          </div>

          <div className="flex-1 h-2.5 bg-slate-900/90 border border-slate-700/50 rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-400 transition-all duration-200 ease-out"
              style={{ width: `${xpPct}%` }}
            />
          </div>

          <div className="text-[11px] font-mono text-cyan-300 tabular-nums shrink-0 font-medium">
            {Math.floor(hudData.xp)}/{hudData.xpNeeded}
          </div>
        </div>

        {/* Top Header Row: HP, Wave, Score, Audio & Pause Controls */}
        <div className="flex items-center justify-between w-full mt-0.5">
          {/* Health & Shield Cluster */}
          <div className="flex flex-col gap-1 min-w-[130px] sm:min-w-[180px]">
            {/* HP Bar */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold tracking-wider text-rose-400 w-6">PV</span>
              <div className="flex-1 h-3 bg-slate-900/90 border border-slate-700/60 rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-150"
                  style={{ width: `${hpPct}%` }}
                />
              </div>
              <span className="text-[10px] font-mono tabular-nums text-slate-300 font-semibold w-12 text-right">
                {Math.ceil(hudData.hp)}/{hudData.maxHp}
              </span>
            </div>

            {/* Shield Bar (if active) */}
            {hudData.maxShield > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold tracking-wider text-sky-400 w-6">ESC</span>
                <div className="flex-1 h-2 bg-slate-900/90 border border-slate-700/60 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-600 to-cyan-300 transition-all duration-150"
                    style={{ width: `${shieldPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono tabular-nums text-sky-300 w-12 text-right">
                  {Math.ceil(hudData.shield)}
                </span>
              </div>
            )}
          </div>

          {/* Center Metric: Wave Counter & Weather Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-md shadow-sm">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-heading font-medium">Oleada</span>
              <span className="text-sm sm:text-base font-bold font-mono text-amber-400 tabular-nums">
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

          {/* Right Perimeter: Score, Coins & System Buttons */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden xs:flex flex-col">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Puntuación</div>
              <div className="text-xs sm:text-sm font-bold font-mono text-slate-100 tabular-nums">
                {hudData.score.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-1 bg-amber-950/40 border border-amber-600/40 px-2 py-0.5 rounded text-amber-300 text-xs font-mono tabular-nums font-semibold">
              <span>🪙</span>
              <span>{hudData.coinsThisRun}</span>
            </div>

            {/* Interactive HUD Buttons */}
            <div className="flex items-center gap-1 pointer-events-auto">
              <button
                type="button"
                onClick={() => {
                  sound.click();
                  onToggleAutoAim();
                }}
                className={`p-1.5 rounded transition-colors text-xs flex items-center justify-center border ${
                  autoAim
                    ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-900/80 border-slate-700 text-slate-400'
                }`}
                title="Auto-Apuntado (On/Off)"
              >
                <Crosshair className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.click();
                  onToggleMute();
                }}
                className="p-1.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.click();
                  onPause();
                }}
                className="p-1.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
                title="Pausar juego (Esc / P)"
              >
                <Pause className="w-3.5 h-3.5" />
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
