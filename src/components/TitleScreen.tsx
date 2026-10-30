import React from 'react';
import { Play, Shield, Wrench, Trophy, Volume2, VolumeX, Smartphone, Monitor } from 'lucide-react';
import { ShipConfig, ShipId, HighScoreRecord } from '../game/types';
import { SHIPS } from '../game/upgrades';
import { sound } from '../game/audio';
import { AirplaneIcon } from './AirplaneIcon';

interface TitleScreenProps {
  selectedShip: ShipConfig;
  onSelectShip: (ship: ShipConfig) => void;
  onStartGame: () => void;
  onOpenHangar: () => void;
  onOpenAchievements: () => void;
  coins: number;
  unlockedShips: ShipId[];
  isMuted: boolean;
  onToggleMute: () => void;
  highScore: HighScoreRecord | null;
  showMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  selectedShip,
  onSelectShip,
  onStartGame,
  onOpenHangar,
  onOpenAchievements,
  coins,
  unlockedShips,
  isMuted,
  onToggleMute,
  highScore,
  showMobileFrame,
  onToggleMobileFrame,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-8 select-none pointer-events-auto">
      {/* Top Header Utilities: Coins, Highscore, Mute, Frame Toggle */}
      <div className="flex items-center justify-between w-full">
        {/* Play Store Currency Badge */}
        <button
          type="button"
          onClick={() => {
            sound.click();
            onOpenHangar();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-amber-500/40 text-amber-300 font-mono text-xs font-semibold hover:border-amber-400 transition-colors shadow-sm"
        >
          <span className="text-sm">🪙</span>
          <span className="tabular-nums">{coins.toLocaleString()} CRÉDITOS</span>
        </button>

        {/* Action icons cluster */}
        <div className="flex items-center gap-2">
          {/* Mobile frame toggle */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              onToggleMobileFrame();
            }}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors text-xs flex items-center gap-1.5"
            title={showMobileFrame ? 'Modo Pantalla Completa' : 'Modo Marco Play Store'}
          >
            {showMobileFrame ? <Monitor className="w-4 h-4 text-cyan-400" /> : <Smartphone className="w-4 h-4" />}
            <span className="hidden sm:inline font-mono text-[11px]">
              {showMobileFrame ? 'Completa' : 'Móvil'}
            </span>
          </button>

          {/* Sound toggle */}
          <button
            type="button"
            onClick={() => {
              sound.click();
              onToggleMute();
            }}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Hero Centerpiece: Bespoke SVG Title Lockup with 30-40% Negative Space */}
      <div className="flex flex-col items-center justify-center my-auto max-w-xl mx-auto text-center px-2">
        {/* Custom Inline SVG Title Lockup */}
        <div className="relative mb-2">
          <svg className="w-full max-w-[340px] sm:max-w-[420px] h-auto drop-shadow-[0_0_35px_rgba(6,182,212,0.5)]" viewBox="0 0 420 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="subGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            {/* Wing insignia background */}
            <path d="M 30 50 L 100 20 L 150 45 L 80 55 Z" fill="#0284c7" opacity="0.4" />
            <path d="M 390 50 L 320 20 L 270 45 L 340 55 Z" fill="#0284c7" opacity="0.4" />
            {/* Main title text */}
            <text x="210" y="52" textAnchor="middle" fill="url(#titleGrad)" fontFamily="'Space Grotesk', sans-serif" fontWeight="800" fontSize="38" letterSpacing="4">
              AETHER STRIKE
            </text>
            <text x="210" y="78" textAnchor="middle" fill="url(#subGrad)" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="13" letterSpacing="8">
              COMBATE AÉREO
            </text>
          </svg>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide max-w-sm mb-5 text-balance">
          Combate aéreo táctico arcade. Pilota cazas de combate de última generación, esquiva fuego antiaéreo y derriba escuadrones enemigos y fortalezas aéreas.
        </p>

        {/* Primary Start CTA Button */}
        <button
          type="button"
          onClick={() => {
            sound.click();
            onStartGame();
          }}
          className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-heading font-bold text-base sm:text-lg tracking-wider shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all border border-cyan-300/40"
        >
          <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
          <span>DESPEGAR Y VOLAR</span>
        </button>

        {/* High Score Notification if present */}
        {highScore && (
          <div className="mt-3 text-[11px] font-mono text-cyan-400/90 tracking-wide tabular-nums">
            RÉCORD: {highScore.score.toLocaleString()} PTS · OLEADA {highScore.wave}
          </div>
        )}
      </div>

      {/* Bottom Section: Ship Selection + Control Hints */}
      <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
        {/* Ship Selector Cards with Real Airplane Shapes */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
          {SHIPS.map((ship) => {
            const isUnlocked = unlockedShips.includes(ship.id);
            const isSelected = selectedShip.id === ship.id;

            return (
              <button
                key={ship.id}
                type="button"
                onClick={() => {
                  sound.click();
                  if (isUnlocked) {
                    onSelectShip(ship);
                  } else {
                    onOpenHangar();
                  }
                }}
                className={`relative flex flex-col p-2.5 sm:p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-900/95 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : isUnlocked
                    ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="w-8 h-8 rounded bg-slate-900/80 border border-slate-700/60 flex items-center justify-center p-0.5">
                    <AirplaneIcon shipId={ship.id} color={ship.color} className="w-6 h-6" />
                  </div>
                  {!isUnlocked && (
                    <span className="text-[10px] font-mono text-amber-400">🪙 {ship.cost}</span>
                  )}
                </div>

                <div className="text-xs sm:text-sm font-bold font-heading truncate text-slate-100">
                  {ship.name}
                </div>

                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {ship.specialName}
                </div>
              </button>
            );
          })}
        </div>

        {/* Secondary Sub-actions (Hangar / Logros) */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.click();
              onOpenHangar();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Logros Play Games</span>
          </button>
        </div>

        {/* Single Flat Control Hint Line (as mandated by guidelines) */}
        <div className="text-center text-[11px] font-mono text-slate-500 tracking-wide">
          WASD / Joystick Mover · Espacio Dash · E Habilidad Especial · P Pausa
        </div>
      </div>
    </div>
  );
};
