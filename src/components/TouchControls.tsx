import React, { useRef, useCallback, useEffect } from 'react';
import { Zap, Shield } from 'lucide-react';
import { sound } from '../game/audio';

interface TouchControlsProps {
  onTouchDelta: (dx: number, dy: number) => void;
  onDash: () => void;
  onSpecial: () => void;
  dashReady: boolean;
  dashCooldownPct: number;
  specialReady: boolean;
  specialCooldownPct: number;
  specialName: string;
  sensitivity?: 'low' | 'normal' | 'high';
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onTouchDelta,
  onDash,
  onSpecial,
  dashReady,
  dashCooldownPct,
  specialReady,
  specialCooldownPct,
  specialName,
  sensitivity = 'normal',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastTapRef = useRef<{ time: number; x: number; y: number }>({ time: 0, x: 0, y: 0 });

  // Multiplier tuned for silky 1:1 direct flight control
  const sensitivityMultiplier =
    sensitivity === 'low' ? 0.95 : sensitivity === 'high' ? 1.45 : 1.18;

  // Handle pointer down on the direct touch flight zone
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, [data-no-drag="true"]')) return;

    // Prevent taking over if already tracking a finger
    if (touchIdRef.current !== null) return;

    // Double tap in the same spot triggers Dash
    const now = performance.now();
    const tapDist = Math.hypot(e.clientX - lastTapRef.current.x, e.clientY - lastTapRef.current.y);
    if (now - lastTapRef.current.time < 280 && tapDist < 70) {
      sound.vibrate(25);
      onDash();
      lastTapRef.current = { time: 0, x: 0, y: 0 };
    } else {
      lastTapRef.current = { time: now, x: e.clientX, y: e.clientY };
    }

    e.preventDefault();
    touchIdRef.current = e.pointerId;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    sound.vibrate(10);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (touchIdRef.current !== e.pointerId || !lastPosRef.current) return;

      const dx = (e.clientX - lastPosRef.current.x) * sensitivityMultiplier;
      const dy = (e.clientY - lastPosRef.current.y) * sensitivityMultiplier;

      lastPosRef.current = { x: e.clientX, y: e.clientY };
      onTouchDelta(dx, dy);
    },
    [onTouchDelta, sensitivityMultiplier]
  );

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (touchIdRef.current === e.pointerId) {
      touchIdRef.current = null;
      lastPosRef.current = null;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none select-none z-30 touch-none overflow-hidden"
    >
      {/* 1. Full Screen Direct Touch Drag Zone (Moves aircraft directly 1:1 with finger, no reticle) */}
      <div
        onPointerDown={handlePointerDown}
        className="pointer-events-auto absolute inset-0 touch-none"
      />

      {/* 2. Mobile Flight Action Buttons Cluster (Dash and Special in bottom-right corner) */}
      <div
        data-no-drag="true"
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        className="absolute right-3 sm:right-6 pointer-events-auto flex items-end gap-3 p-1.5 -m-1.5 touch-none z-40"
      >
        {/* Dash Evade Button (never HTML-disabled so touches during cooldown don't leak through) */}
        <button
          type="button"
          aria-disabled={!dashReady}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!dashReady) return;
            sound.vibrate(25);
            onDash();
          }}
          onClick={(e) => {
            if (e.detail === 0 && dashReady) {
              onDash();
            }
          }}
          className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-xl transition-transform border-2 select-none touch-manipulation ${
            dashReady
              ? 'bg-gradient-to-b from-cyan-500 to-sky-700 border-cyan-300 text-white shadow-cyan-500/40 ring-1 ring-cyan-400/60 active:scale-90'
              : 'bg-slate-900/85 border-slate-700/60 text-slate-500 cursor-not-allowed'
          }`}
          title="Dash Esquiva (Doble toque en pantalla también activa Dash)"
        >
          <Zap className="w-6 h-6 mb-0.5 fill-current" />
          <span className="text-[10px] tracking-tight font-mono font-bold">DASH</span>

          {!dashReady && (
            <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center text-[11px] font-mono font-bold text-slate-300 pointer-events-none">
              {Math.ceil(dashCooldownPct * 100)}%
            </div>
          )}
        </button>

        {/* Special Ultimate Ability Button */}
        <button
          type="button"
          aria-disabled={!specialReady}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!specialReady) return;
            sound.vibrate([35, 20, 50]);
            onSpecial();
          }}
          onClick={(e) => {
            if (e.detail === 0 && specialReady) {
              onSpecial();
            }
          }}
          className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-2xl transition-transform border-2 select-none touch-manipulation ${
            specialReady
              ? 'bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 border-amber-300 text-white shadow-amber-500/50 ring-2 ring-amber-400/70 animate-pulse active:scale-90'
              : 'bg-slate-900/85 border-slate-700/60 text-slate-500 cursor-not-allowed'
          }`}
          title={`Habilidad Especial: ${specialName}`}
        >
          <Shield className="w-7 h-7 mb-0.5 fill-current" />
          <span className="text-[10px] font-mono font-bold tracking-tight uppercase truncate max-w-[70px]">
            {specialName.slice(0, 9)}
          </span>

          {!specialReady && (
            <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center text-xs font-mono font-bold text-amber-300 pointer-events-none">
              {Math.ceil(specialCooldownPct * 100)}%
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
