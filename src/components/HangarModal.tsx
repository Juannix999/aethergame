import React, { useState } from 'react';
import { X, Shield, Zap, Sparkles, Wind, Magnet, Target, Check, Lock } from 'lucide-react';
import { ShipConfig, ShipId, PermanentUpgrades } from '../game/types';
import { SHIPS } from '../game/upgrades';
import { sound } from '../game/audio';
import { AirplaneIcon } from './AirplaneIcon';

interface HangarModalProps {
  coins: number;
  unlockedShips: ShipId[];
  selectedShip: ShipConfig;
  permanentUpgrades: PermanentUpgrades;
  onClose: () => void;
  onSelectShip: (ship: ShipConfig) => void;
  onUnlockShip: (shipId: ShipId, cost: number) => void;
  onUpgradeStat: (statKey: keyof PermanentUpgrades, cost: number) => void;
}

export const HangarModal: React.FC<HangarModalProps> = ({
  coins,
  unlockedShips,
  selectedShip,
  permanentUpgrades,
  onClose,
  onSelectShip,
  onUnlockShip,
  onUpgradeStat,
}) => {
  const [activeTab, setActiveTab] = useState<'ships' | 'upgrades'>('ships');

  const upgradeConfigs: Array<{
    key: keyof PermanentUpgrades;
    title: string;
    description: string;
    icon: React.ReactNode;
    currentLevel: number;
    maxLevel: number;
    baseCost: number;
  }> = [
    {
      key: 'maxHpLevel',
      title: 'Refuerzo de Blindaje',
      description: '+20 PV iniciales para todas las naves por nivel',
      icon: <Shield className="w-5 h-5 text-rose-400" />,
      currentLevel: permanentUpgrades.maxHpLevel,
      maxLevel: 5,
      baseCost: 100,
    },
    {
      key: 'damageLevel',
      title: 'Acelerador de Plasma',
      description: '+10% de daño permanente en todos los disparos',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      currentLevel: permanentUpgrades.damageLevel,
      maxLevel: 5,
      baseCost: 150,
    },
    {
      key: 'speedLevel',
      title: 'Postquemadores Iónicos',
      description: '+8% de velocidad de maniobra táctica',
      icon: <Wind className="w-5 h-5 text-sky-400" />,
      currentLevel: permanentUpgrades.speedLevel,
      maxLevel: 5,
      baseCost: 100,
    },
    {
      key: 'magnetLevel',
      title: 'Vórtice Colector',
      description: '+25% de radio de absorción de cristales y créditos',
      icon: <Magnet className="w-5 h-5 text-indigo-400" />,
      currentLevel: permanentUpgrades.magnetLevel,
      maxLevel: 5,
      baseCost: 80,
    },
    {
      key: 'critLevel',
      title: 'Procesador de Tiro Crítico',
      description: '+5% de probabilidad de daño crítico (2x daño)',
      icon: <Target className="w-5 h-5 text-emerald-400" />,
      currentLevel: permanentUpgrades.critLevel,
      maxLevel: 5,
      baseCost: 150,
    },
  ];

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-100">
              Hangar Estelar & Armería
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency balance */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/60 border border-amber-600/40 rounded-lg text-amber-300 font-mono text-xs font-bold tabular-nums">
              <span>🪙</span>
              <span>{coins.toLocaleString()}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.click();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab('ships');
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-heading font-semibold transition-all ${
              activeTab === 'ships'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Flota de Cazas ({unlockedShips.length}/{SHIPS.length})
          </button>
          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab('upgrades');
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-heading font-semibold transition-all ${
              activeTab === 'upgrades'
                ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mejoras de Tecnología Permanente
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto pr-1 flex flex-col gap-3 flex-1">
          {activeTab === 'ships' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SHIPS.map((ship) => {
                const isUnlocked = unlockedShips.includes(ship.id);
                const isSelected = selectedShip.id === ship.id;
                const canAfford = coins >= ship.cost;

                return (
                  <div
                    key={ship.id}
                    className={`flex flex-col justify-between p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-950/90 border-cyan-400 shadow-lg shadow-cyan-500/20'
                        : isUnlocked
                        ? 'bg-slate-950/60 border-slate-800'
                        : 'bg-slate-950/30 border-slate-900 opacity-80'
                    }`}
                  >
                    <div>
                      {/* Aircraft Preview Bay */}
                      <div className="w-full h-24 rounded-lg bg-slate-900/90 border border-slate-800/80 flex items-center justify-center relative mb-3 overflow-hidden shadow-inner">
                        {/* Grid lines background */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:12px_12px] opacity-40" />
                        <AirplaneIcon shipId={ship.id} color={ship.color} className="w-14 h-14 relative z-10 drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]" />
                        {isSelected && (
                          <span className="absolute top-2 right-2 text-[10px] font-mono font-bold text-cyan-400 flex items-center gap-1 bg-cyan-950/90 px-2 py-0.5 rounded border border-cyan-800/80 z-20">
                            <Check className="w-3 h-3" /> ACTIVO
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading font-bold text-base text-slate-100">
                        {ship.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 mb-3 leading-snug">
                        {ship.tagline}
                      </p>

                      {/* Stat meters */}
                      <div className="flex flex-col gap-1.5 text-xs font-mono text-slate-300 mb-4 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Blindaje</span>
                          <span className="font-bold tabular-nums">{ship.hull} PV</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Velocidad</span>
                          <span className="font-bold tabular-nums">{ship.speed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cadencia</span>
                          <span className="font-bold tabular-nums">{ship.fireRate}/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Potencia</span>
                          <span className="font-bold tabular-nums">{ship.damage} Dmg</span>
                        </div>
                        <div className="pt-1 border-t border-slate-800 flex flex-col gap-0.5">
                          <span className="text-[10px] text-amber-400 font-bold uppercase">{ship.specialName}</span>
                          <span className="text-[10px] text-slate-400 leading-tight">{ship.specialDescription}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ship Action Button */}
                    {isSelected ? (
                      <button
                        type="button"
                        disabled
                        className="w-full py-2 rounded-lg bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 font-mono text-xs font-bold"
                      >
                        NAVE SELECCIONADA
                      </button>
                    ) : isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => {
                          sound.click();
                          onSelectShip(ship);
                        }}
                        className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-mono text-xs font-bold transition-colors"
                      >
                        EQUIPAR NAVE
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => {
                          sound.click();
                          onUnlockShip(ship.id, ship.cost);
                        }}
                        className={`w-full py-2 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border ${
                          canAfford
                            ? 'bg-amber-600 hover:bg-amber-500 border-amber-400 text-white shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>DESBLOQUEAR (🪙 {ship.cost})</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {upgradeConfigs.map((cfg) => {
                const cost = cfg.baseCost * (cfg.currentLevel + 1);
                const isMax = cfg.currentLevel >= cfg.maxLevel;
                const canAfford = coins >= cost;

                return (
                  <div
                    key={cfg.key}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                        {cfg.icon}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-sm text-slate-100">
                            {cfg.title}
                          </span>
                          <span className="text-[11px] font-mono text-cyan-400 font-semibold tabular-nums">
                            Nv. {cfg.currentLevel}/{cfg.maxLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                          {cfg.description}
                        </p>
                      </div>
                    </div>

                    {/* Level Up Button */}
                    <div className="shrink-0">
                      {isMax ? (
                        <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-500 font-mono text-xs font-semibold border border-slate-800">
                          NIVEL MÁXIMO
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => {
                            sound.click();
                            onUpgradeStat(cfg.key, cost);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all border ${
                            canAfford
                              ? 'bg-amber-600 hover:bg-amber-500 border-amber-400 text-white shadow-sm hover:scale-105 active:scale-95'
                              : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>MEJORAR (🪙 {cost})</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
