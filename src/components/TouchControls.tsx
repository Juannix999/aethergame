import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Zap, Shield } from 'lucide-react';
import { sound } from '../game/audio';

interface TouchControlsProps {
  onMoveVector: (vector: { x: number; y: number }) => void;
  onDash: () => void;
  onSpecial: () => void;
  dashReady: boolean;
  dashCooldownPct: number;
  specialReady: boolean;
  specialCooldownPct: number;
  specialName: string;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMoveVector,
  onDash,
  onSpecial,
  dashReady,
  dashCooldownPct,
  specialReady,
  specialCooldownPct,
  specialName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [basePos, setBasePos] = useState<{ x: number; y: number } | null>(null);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });

  const touchIdRef = useRef<number | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const baseOriginRef = useRef<{ x: number; y: number } | null>(null);

  const radius = 52; // Max thumbstick drag radius in pixels

  // Handle touch down on the dynamic steering zone (left 70% of screen)
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only capture on primary touch
    if (touchIdRef.current !== null) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Check for double tap to dash
    const now = performance.now();
    if (now - lastTapTimeRef.current < 280) {
      sound.vibrate(25);
      onDash();
    }
    lastTapTimeRef.current = now;

    e.preventDefault();
    touchIdRef.current = e.pointerId;
    setIsDragging(true);

    sound.vibrate(12);

    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    const origin = { x: relativeX, y: relativeY };
    baseOriginRef.current = origin;
    setBasePos(origin);
    setKnobOffset({ x: 0, y: 0 });
    onMoveVector({ x: 0, y: 0 });
  };

  const updateJoystick = useCallback(
    (clientX: number, clientY: number) => {
      if (!baseOriginRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = clientX - rect.left;
      const currentY = clientY - rect.top;

      const dx = currentX - baseOriginRef.current.x;
      const dy = currentY - baseOriginRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist === 0) {
        setKnobOffset({ x: 0, y: 0 });
        onMoveVector({ x: 0, y: 0 });
        return;
      }

      const clampedDist = Math.min(dist, radius);
      const nx = (dx / dist) * clampedDist;
      const ny = (dy / dist) * clampedDist;

      setKnobOffset({ x: nx, y: ny });
      onMoveVector({
        x: nx / radius,
        y: ny / radius,
      });
    },
    [radius, onMoveVector]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (touchIdRef.current === e.pointerId) {
        updateJoystick(e.clientX, e.clientY);
      }
    },
    [updateJoystick]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (touchIdRef.current === e.pointerId) {
        touchIdRef.current = null;
        baseOriginRef.current = null;
        setIsDragging(false);
        setBasePos(null);
        setKnobOffset({ x: 0, y: 0 });
        onMoveVector({ x: 0, y: 0 });
      }
    },
    [onMoveVector]
  );

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
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
      {/* 1. Large Dynamic Touch Flight Steering Zone (covers the left 68% of the screen) */}
      <div
        onPointerDown={handlePointerDown}
        className="pointer-events-auto absolute inset-y-0 left-0 w-[68%] touch-none"
      />

      {/* 2. Visual Joystick (Anchored dynamically under thumb OR resting in bottom-left corner) */}
      <div
        className="absolute pointer-events-none transition-opacity duration-200"
        style={
          basePos
            ? {
                left: `${basePos.x}px`,
                top: `${basePos.y}px`,
                transform: 'translate(-50%, -50%)',
                opacity: 1,
              }
            : {
                left: '20px',
                bottom: '24px',
                transform: 'none',
                opacity: 0.65,
              }
        }
      >
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-cyan-400/40 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center shadow-lg shadow-cyan-950/40">
          {/* Inner rings */}
          <div className="w-16 h-16 rounded-full border border-cyan-400/25" />
          <div className="absolute w-2 h-2 rounded-full bg-cyan-400/50" />

          {/* Directional cross markers */}
          <div className="absolute top-1 w-1 h-2 bg-cyan-400/30" />
          <div className="absolute bottom-1 w-1 h-2 bg-cyan-400/30" />
          <div className="absolute left-1 w-2 h-1 bg-cyan-400/30" />
          <div className="absolute right-1 w-2 h-1 bg-cyan-400/30" />

          {/* Joystick Thumb Knob */}
          <div
            className={`absolute w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform ${
              isDragging
                ? 'bg-gradient-to-br from-cyan-400 to-sky-600 scale-105 shadow-cyan-400/60 ring-2 ring-cyan-300'
                : 'bg-slate-800/90 border border-slate-600 shadow-slate-900/60'
            }`}
            style={{
              transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`,
            }}
          >
            <div className="w-4 h-4 rounded-full bg-white/70" />
          </div>
        </div>

        {/* Small hint label when idle */}
        {!isDragging && (
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-400/70 whitespace-nowrap tracking-wider">
            TOCA Y DESLIZA
          </div>
        )}
      </div>

      {/* 3. Action Buttons Cluster (Right thumb quadrant) */}
      <div className="absolute right-3 sm:right-6 bottom-4 sm:bottom-6 pointer-events-auto flex items-end gap-3 touch-none">
        {/* Dash Button */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            sound.vibrate(25);
            onDash();
          }}
          disabled={!dashReady}
          className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-xl transition-transform active:scale-90 border-2 select-none ${
            dashReady
              ? 'bg-gradient-to-b from-cyan-500 to-sky-700 border-cyan-300 text-white shadow-cyan-500/40 ring-1 ring-cyan-400/60'
              : 'bg-slate-900/85 border-slate-700/60 text-slate-500'
          }`}
        >
          <Zap className="w-6 h-6 mb-0.5 fill-current" />
          <span className="text-[10px] tracking-tight font-mono font-bold">DASH</span>

          {/* Radial cooldown ring / overlay */}
          {!dashReady && (
            <div className="absolute inset-0 rounded-full bg-black/65 flex items-center justify-center text-[11px] font-mono font-bold text-slate-300">
              {Math.ceil(dashCooldownPct * 100)}%
            </div>
          )}
        </button>

        {/* Special Ultimate Ability Button */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            sound.vibrate([35, 20, 50]);
            onSpecial();
          }}
          disabled={!specialReady}
          className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-2xl transition-transform active:scale-90 border-2 select-none ${
            specialReady
              ? 'bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 border-amber-300 text-white shadow-amber-500/50 ring-2 ring-amber-400/70 animate-pulse'
              : 'bg-slate-900/85 border-slate-700/60 text-slate-500'
          }`}
        >
          <Shield className="w-7 h-7 mb-0.5 fill-current" />
          <span className="text-[10px] font-mono font-bold tracking-tight uppercase truncate max-w-[70px]">
            {specialName.slice(0, 9)}
          </span>

          {/* Radial cooldown overlay */}
          {!specialReady && (
            <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center text-xs font-mono font-bold text-amber-300">
              {Math.ceil(specialCooldownPct * 100)}%
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
