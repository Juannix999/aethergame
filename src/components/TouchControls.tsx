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
  const joystickAreaRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const radius = 48; // Max thumbstick drag radius in pixels

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    touchIdRef.current = e.pointerId;
    updateJoystick(e.clientX, e.clientY);
  };

  const updateJoystick = useCallback((clientX: number, clientY: number) => {
    if (!joystickAreaRef.current) return;
    const rect = joystickAreaRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist === 0) {
      setKnobPos({ x: 0, y: 0 });
      onMoveVector({ x: 0, y: 0 });
      return;
    }

    const clampedDist = Math.min(dist, radius);
    const nx = (dx / dist) * clampedDist;
    const ny = (dy / dist) * clampedDist;

    setKnobPos({ x: nx, y: ny });
    onMoveVector({
      x: nx / radius,
      y: ny / radius,
    });
  }, [radius, onMoveVector]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (touchIdRef.current === e.pointerId) {
      updateJoystick(e.clientX, e.clientY);
    }
  }, [updateJoystick]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (touchIdRef.current === e.pointerId) {
      touchIdRef.current = null;
      setIsDragging(false);
      setKnobPos({ x: 0, y: 0 });
      onMoveVector({ x: 0, y: 0 });
    }
  }, [onMoveVector]);

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
    <div className="absolute inset-x-0 bottom-0 pointer-events-none p-4 sm:p-6 flex items-end justify-between z-30 select-none pb-safe">
      {/* Virtual Joystick (Left) */}
      <div
        ref={joystickAreaRef}
        onPointerDown={handlePointerDown}
        className="pointer-events-auto relative w-32 h-32 rounded-full border border-cyan-500/30 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center touch-none select-none active:border-cyan-400"
      >
        {/* Ring guides */}
        <div className="w-16 h-16 rounded-full border border-cyan-500/20" />
        <div className="absolute w-2 h-2 rounded-full bg-cyan-400/40" />

        {/* Dynamic thumb knob */}
        <div
          className={`absolute w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${
            isDragging
              ? 'bg-gradient-to-br from-cyan-400 to-blue-600 scale-105 shadow-cyan-500/50'
              : 'bg-slate-800/80 border border-slate-600 shadow-slate-900/50'
          }`}
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        >
          <div className="w-4 h-4 rounded-full bg-white/60" />
        </div>
      </div>

      {/* Action Buttons (Right) */}
      <div className="pointer-events-auto flex items-end gap-3 touch-none">
        {/* Dash Trigger Button */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            sound.click();
            onDash();
          }}
          disabled={!dashReady}
          className={`relative w-16 h-16 rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-lg transition-all active:scale-95 border ${
            dashReady
              ? 'bg-gradient-to-b from-cyan-600 to-sky-700 border-cyan-400 text-white shadow-cyan-500/30'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-500'
          }`}
        >
          <Zap className="w-6 h-6 mb-0.5" />
          <span className="text-[10px] tracking-tight font-mono">DASH</span>

          {/* Cooldown radial overlay */}
          {!dashReady && (
            <div
              className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center text-[11px] font-mono font-bold text-slate-300"
            >
              {Math.ceil(dashCooldownPct * 100)}%
            </div>
          )}
        </button>

        {/* Special Ultimate Button */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            sound.click();
            onSpecial();
          }}
          disabled={!specialReady}
          className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center font-bold text-xs shadow-lg transition-all active:scale-95 border ${
            specialReady
              ? 'bg-gradient-to-b from-amber-500 to-amber-700 border-amber-300 text-white shadow-amber-500/40 animate-pulse'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-500'
          }`}
        >
          <Shield className="w-7 h-7 mb-0.5" />
          <span className="text-[10px] font-mono tracking-tight uppercase truncate max-w-[68px]">
            {specialName.slice(0, 8)}
          </span>

          {/* Cooldown overlay */}
          {!specialReady && (
            <div
              className="absolute inset-0 rounded-full bg-black/65 flex items-center justify-center text-xs font-mono font-bold text-amber-300"
            >
              {Math.ceil(specialCooldownPct * 100)}%
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
