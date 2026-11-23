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

  if (shipId === 'titan') {
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
  }

  if (shipId === 'raptor') {
    // F-35 Lightning: 5th-Gen Stealth Multi-Role Strike Fighter
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Wingtip Missiles */}
        <rect x="6" y="24" width="2" height="14" rx="1" fill="#94a3b8" />
        <rect x="6" y="22" width="2" height="3" fill="#38bdf8" />
        <rect x="56" y="24" width="2" height="14" rx="1" fill="#94a3b8" />
        <rect x="56" y="22" width="2" height="3" fill="#38bdf8" />

        {/* Diamond Wings & Stealth Chines */}
        <path
          d="M 32 4 L 38 18 L 44 26 L 58 35 L 53 44 L 44 42 L 48 54 L 40 54 L 36 50 L 32 52 L 28 50 L 24 54 L 16 54 L 20 42 L 11 44 L 6 35 L 20 26 L 26 18 Z"
          fill={color}
          stroke="#94a3b8"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Twin Canted Tail Fins */}
        <path d="M 24 40 L 19 53 L 25 53 Z" fill="#475569" />
        <path d="M 40 40 L 45 53 L 39 53 Z" fill="#475569" />

        {/* Gold Tinted Cockpit */}
        <ellipse cx="32" cy="22" rx="3" ry="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
      </svg>
    );
  }

  if (shipId === 'warthog') {
    // Su-25 / A-10 Armored Woodland Camo Ground Attacker
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Underwing Ordnance Pylons */}
        <rect x="10" y="26" width="3" height="14" rx="1" fill="#1e293b" />
        <rect x="10" y="24" width="3" height="3" fill="#ef4444" />
        <rect x="16" y="28" width="3" height="12" rx="1" fill="#1e293b" />
        <rect x="51" y="26" width="3" height="14" rx="1" fill="#1e293b" />
        <rect x="51" y="24" width="3" height="3" fill="#ef4444" />
        <rect x="45" y="28" width="3" height="12" rx="1" fill="#1e293b" />

        {/* Straight Shoulder Wing Airframe */}
        <path
          d="M 32 6 L 38 16 L 42 26 L 60 26 L 58 40 L 42 41 L 40 54 L 32 50 L 24 54 L 22 41 L 6 40 L 4 26 L 22 26 L 26 16 Z"
          fill={color}
          stroke="#a3e635"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Splinter Camo panels */}
        <path d="M 26 22 L 36 26 L 38 38 L 28 36 Z" fill="#15803d" opacity="0.7" />

        {/* Twin Turbojet Nacelles */}
        <rect x="20" y="32" width="5" height="15" rx="1" fill="#1c1917" />
        <rect x="39" y="32" width="5" height="15" rx="1" fill="#1c1917" />

        {/* Armored Cockpit */}
        <rect x="29" y="16" width="6" height="10" rx="1" fill="#fef08a" stroke="#365314" strokeWidth="0.8" />
      </svg>
    );
  }

  if (shipId === 'blackbird') {
    // SR-71 Blackbird Hypersonic Mach 3 Interceptor
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Ultra slender needle fuselage and wide blended chines */}
        <path
          d="M 32 2 L 36 16 L 38 28 L 44 26 L 58 46 L 50 50 L 46 54 L 40 54 L 36 48 L 32 52 L 28 48 L 24 54 L 18 54 L 14 50 L 6 46 L 20 26 L 26 28 L 28 16 Z"
          fill={color}
          stroke="#f43f5e"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* J58 Engine Pods with forward spike shock cones */}
        <rect x="18" y="24" width="6" height="24" rx="2" fill="#0f172a" stroke="#f43f5e" strokeWidth="0.8" />
        <polygon points="21,18 24,24 18,24" fill="#e11d48" />

        <rect x="40" y="24" width="6" height="24" rx="2" fill="#0f172a" stroke="#f43f5e" strokeWidth="0.8" />
        <polygon points="43,18 46,24 40,24" fill="#e11d48" />

        {/* Dual Inward-Canted Rudder Fins */}
        <path d="M 23 36 L 20 50 L 24 50 Z" fill="#1e293b" />
        <path d="M 41 36 L 44 50 L 40 50 Z" fill="#1e293b" />

        {/* Tandem Cockpit Windows */}
        <rect x="31" y="14" width="2" height="3" fill="#fef08a" />
        <rect x="31" y="20" width="2" height="3" fill="#fef08a" />
      </svg>
    );
  }

  if (shipId === 'typhoon') {
    // Typhoon: Eurofighter Agile Canard-Delta Fighter
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Front Canards */}
        <path d="M 28 18 L 16 22 L 18 26 L 28 24 Z" fill="#b45309" stroke="#fed7aa" strokeWidth="0.8" />
        <path d="M 36 18 L 48 22 L 46 26 L 36 24 Z" fill="#b45309" stroke="#fed7aa" strokeWidth="0.8" />

        {/* Pure Delta Wing & Body */}
        <path
          d="M 32 6 L 36 16 L 38 28 L 58 44 L 54 48 L 40 48 L 38 54 L 32 51 L 26 54 L 24 48 L 10 48 L 6 44 L 26 28 L 28 16 Z"
          fill={color}
          stroke="#fed7aa"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Ventral Air Intake */}
        <rect x="29" y="30" width="6" height="8" rx="1" fill="#0f172a" stroke="#fbbf24" strokeWidth="0.8" />

        {/* Tall Central Tail Fin */}
        <rect x="31" y="38" width="2" height="14" rx="0.5" fill="#78350f" />

        {/* Canopy */}
        <ellipse cx="32" cy="20" rx="3" ry="7" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
      </svg>
    );
  }

  if (shipId === 'tomcat') {
    // F-14 Tomcat: Variable-Sweep Wing Naval Interceptor
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Swing Wings */}
        <path d="M 24 24 L 6 36 L 10 42 L 25 36 Z" fill={color} stroke="#facc15" strokeWidth="0.8" />
        <path d="M 40 24 L 58 36 L 54 42 L 39 36 Z" fill={color} stroke="#facc15" strokeWidth="0.8" />
        {/* Fuselage & Nacelles */}
        <path
          d="M 32 6 L 36 18 L 40 26 L 44 46 L 39 46 L 35 40 L 32 44 L 29 40 L 25 46 L 20 46 L 24 26 L 28 18 Z"
          fill={color}
          stroke="#facc15"
          strokeWidth="1.2"
        />
        {/* Jolly Rogers Yellow Fins */}
        <path d="M 23 34 L 18 48 L 24 48 Z" fill="#0f172a" stroke="#facc15" strokeWidth="0.8" />
        <path d="M 41 34 L 46 48 L 40 48 Z" fill="#0f172a" stroke="#facc15" strokeWidth="0.8" />
        {/* Tandem Canopy */}
        <ellipse cx="32" cy="22" rx="2.5" ry="7" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
      </svg>
    );
  }

  if (shipId === 'spitfire') {
    // Supermarine Spitfire Mk.IX: Elliptical Wings & Spinning Propeller
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Elliptical Wings */}
        <ellipse cx="18" cy="30" rx="14" ry="7" fill={color} stroke="#a3e635" strokeWidth="1" />
        <ellipse cx="46" cy="30" rx="14" ry="7" fill={color} stroke="#a3e635" strokeWidth="1" />
        {/* RAF Roundels */}
        <circle cx="16" cy="30" r="3.5" fill="#1d4ed8" />
        <circle cx="16" cy="30" r="2.2" fill="#ffffff" />
        <circle cx="16" cy="30" r="1.1" fill="#ef4444" />
        <circle cx="48" cy="30" r="3.5" fill="#1d4ed8" />
        <circle cx="48" cy="30" r="2.2" fill="#ffffff" />
        <circle cx="48" cy="30" r="1.1" fill="#ef4444" />
        {/* Fuselage & Tail */}
        <path
          d="M 32 8 L 35 20 L 35 42 L 44 48 L 42 52 L 34 50 L 32 54 L 30 50 L 22 52 L 20 48 L 29 42 L 29 20 Z"
          fill={color}
          stroke="#a3e635"
          strokeWidth="1.2"
        />
        {/* Canopy */}
        <ellipse cx="32" cy="24" rx="2" ry="5" fill="#38bdf8" />
        {/* Golden Propeller blur disc */}
        <ellipse cx="32" cy="8" rx="12" ry="3" fill="#fef08a" opacity="0.4" />
        <circle cx="32" cy="8" r="2" fill="#ef4444" />
      </svg>
    );
  }

  if (shipId === 'fulcrum') {
    // MiG-29 Fulcrum: Twin Canted Fins, Blended LERX
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* Airframe */}
        <path
          d="M 32 6 L 35 18 L 38 24 L 56 34 L 52 42 L 42 40 L 40 48 L 35 48 L 32 44 L 29 48 L 24 48 L 22 40 L 12 42 L 8 34 L 26 24 L 29 18 Z"
          fill={color}
          stroke="#bae6fd"
          strokeWidth="1.2"
        />
        {/* Twin Fins with Red Star Dots */}
        <path d="M 25 36 L 21 48 L 26 48 Z" fill="#0369a1" />
        <circle cx="24" cy="42" r="1.2" fill="#ef4444" />
        <path d="M 39 36 L 43 48 L 38 48 Z" fill="#0369a1" />
        <circle cx="40" cy="42" r="1.2" fill="#ef4444" />
        {/* Canopy */}
        <ellipse cx="32" cy="20" rx="2.5" ry="6" fill="#e0f2fe" stroke="#0284c7" strokeWidth="0.8" />
      </svg>
    );
  }

  if (shipId === 'dragonlady') {
    // U-2S Dragon Lady: Massive Glider Wings & Spy Sensors
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        {/* High Aspect Ratio Wings */}
        <path
          d="M 32 6 L 34 22 L 62 26 L 62 30 L 35 30 L 34 50 L 42 54 L 40 56 L 32 55 L 24 56 L 22 54 L 30 50 L 29 30 L 2 30 L 2 26 L 30 22 Z"
          fill={color}
          stroke="#38bdf8"
          strokeWidth="1.2"
        />
        {/* Wingtip Gear Pods */}
        <rect x="60" y="25" width="2" height="6" fill="#38bdf8" />
        <rect x="2" y="25" width="2" height="6" fill="#38bdf8" />
        {/* Senior Span Dorsal Dome */}
        <ellipse cx="32" cy="34" rx="2" ry="4" fill="#38bdf8" />
        {/* Cockpit */}
        <ellipse cx="32" cy="18" rx="1.8" ry="4" fill="#fef08a" />
      </svg>
    );
  }

  // Aurora Hypersonic Mach 5 Scramjet
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* 75-degree Waverider Delta */}
      <polygon
        points="32,4 58,46 50,50 38,46 32,49 26,46 14,50 6,46"
        fill={color}
        stroke="#f97316"
        strokeWidth="1.4"
      />
      {/* Test Orange Chevron Stripes */}
      <line x1="20" y1="36" x2="28" y2="44" stroke="#ea580c" strokeWidth="1.5" />
      <line x1="44" y1="36" x2="36" y2="44" stroke="#ea580c" strokeWidth="1.5" />
      {/* Ventral Rudder Stubs */}
      <rect x="25" y="38" width="2" height="8" fill="#f97316" />
      <rect x="37" y="38" width="2" height="8" fill="#f97316" />
      {/* Cockpit Slit */}
      <ellipse cx="32" cy="22" rx="1.8" ry="5" fill="#ffedd5" stroke="#f97316" strokeWidth="0.8" />
    </svg>
  );
};
