import React from 'react';
import { ShipId } from '../game/types';

interface AirplaneIconProps {
  shipId: ShipId;
  color?: string;
  className?: string;
}

export const AirplaneIcon: React.FC<AirplaneIconProps> = ({
  shipId,
  color = '#38bdf8',
  className = 'w-6 h-6',
}) => {
  if (shipId === 'valkyrie') {
    // Air Superiority 5th Gen Jet Fighter (F-22 style)
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Missiles on wingtips */}
        <rect x="6" y="24" width="2" height="16" rx="1" fill="#e2e8f0" />
        <rect x="6" y="22" width="2" height="3" fill="#ef4444" />
        <rect x="56" y="24" width="2" height="16" rx="1" fill="#e2e8f0" />
        <rect x="56" y="22" width="2" height="3" fill="#ef4444" />

        {/* Main Swept Wing & Fuselage */}
        <path
          d="M 32 4 L 37 18 L 42 26 L 57 36 L 54 44 L 42 41 L 39 52 L 32 48 L 25 52 L 22 41 L 10 44 L 7 36 L 22 26 L 27 18 Z"
          fill={color}
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Twin vertical tail stabilizers */}
        <path d="M 23 38 L 19 51 L 24 53 Z" fill="#0284c7" />
        <path d="M 41 38 L 45 51 L 40 53 Z" fill="#0284c7" />

        {/* Bubble Glass Cockpit Canopy */}
        <ellipse cx="32" cy="22" rx="3.5" ry="9" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
        <ellipse cx="32" cy="20" rx="1.5" ry="5" fill="#ffffff" opacity="0.8" />

        {/* Pitot nose probe */}
        <line x1="32" y1="4" x2="32" y2="1" stroke="#f8fafc" strokeWidth="1.5" />
      </svg>
    );
  }

  if (shipId === 'ghost') {
    // Stealth Flying-Wing Jet (B-2 Spirit style)
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Stealth Flying Wing polygon with sawtooth trailing edge */}
        <path
          d="M 32 10 L 60 38 L 58 44 L 48 40 L 42 49 L 36 45 L 32 50 L 28 45 L 22 49 L 16 40 L 6 44 L 4 38 Z"
          fill={color}
          stroke="#d8b4fe"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Facet lines */}
        <line x1="32" y1="10" x2="32" y2="44" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="32" y1="24" x2="48" y2="38" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="32" y1="24" x2="16" y2="38" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.6" />

        {/* Stealth Cockpit */}
        <polygon points="32,20 35,30 32,36 29,30" fill="#f3e8ff" stroke="#7e22ce" strokeWidth="0.8" />
      </svg>
    );
  }

  // Titan: Heavy Armored Gunship (A-10 Warthog style)
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Heavy Gatling Cannon nose projection */}
      <rect x="30" y="4" width="4" height="10" rx="1" fill="#1e293b" stroke="#cbd5e1" strokeWidth="0.8" />

      {/* Main Body & Broad Straight Wings */}
      <path
        d="M 32 12 L 38 18 L 40 28 L 60 28 L 60 40 L 42 41 L 40 54 L 32 50 L 24 54 L 22 41 L 4 40 L 4 28 L 24 28 L 26 18 Z"
        fill={color}
        stroke="#fef08a"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* High-Mounted Twin Turbofan Jet Engines */}
      <rect x="18" y="32" width="6" height="16" rx="2" fill="#292524" stroke="#f59e0b" strokeWidth="1" />
      <rect x="40" y="32" width="6" height="16" rx="2" fill="#292524" stroke="#f59e0b" strokeWidth="1" />
      <rect x="18" y="32" width="6" height="3" rx="1" fill="#38bdf8" />
      <rect x="40" y="32" width="6" height="3" rx="1" fill="#38bdf8" />

      {/* Twin H-Tail Stabilizers */}
      <rect x="17" y="44" width="3" height="12" rx="1" fill="#b45309" />
      <rect x="44" y="44" width="3" height="12" rx="1" fill="#b45309" />

      {/* Armored multi-pane canopy */}
      <rect x="29" y="20" width="6" height="10" rx="1" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
      <line x1="29" y1="25" x2="35" y2="25" stroke="#78350f" strokeWidth="0.8" />
    </svg>
  );
};
