import React from 'react';
import { Sparkles, Shield, Zap, Flame, Radio, Heart, Magnet, Target, Crosshair, Maximize2, Wind } from 'lucide-react';
import { UpgradeCard } from '../game/types';
import { sound } from '../game/audio';

interface LevelUpModalProps {
  level: number;
  options: UpgradeCard[];
  onSelect: (option: UpgradeCard) => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, options, onSelect }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles': return <Sparkles className="w-5 h-5" />;
      case 'shield': return <Shield className="w-5 h-5" />;
      case 'zap': return <Zap className="w-5 h-5" />;
      case 'flame': return <Flame className="w-5 h-5" />;
      case 'radio': return <Radio className="w-5 h-5" />;
      case 'heart': return <Heart className="w-5 h-5" />;
      case 'magnet': return <Magnet className="w-5 h-5" />;
      case 'target': return <Target className="w-5 h-5" />;
      case 'crosshair': return <Crosshair className="w-5 h-5" />;
      case 'maximize-2': return <Maximize2 className="w-5 h-5" />;
      case 'wind': return <Wind className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getRarityBadge = (rarity: UpgradeCard['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return <span className="text-amber-400 font-mono text-[10px] tracking-wider uppercase">Legendario</span>;
      case 'epic':
        return <span className="text-purple-400 font-mono text-[10px] tracking-wider uppercase">Épico</span>;
      case 'rare':
        return <span className="text-sky-400 font-mono text-[10px] tracking-wider uppercase">Raro</span>;
      default:
        return <span className="text-slate-400 font-mono text-[10px] tracking-wider uppercase">Común</span>;
    }
  };

  const getBorderColor = (rarity: UpgradeCard['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'border-amber-500/60 hover:border-amber-400 shadow-amber-500/20';
      case 'epic': return 'border-purple-500/60 hover:border-purple-400 shadow-purple-500/20';
      case 'rare': return 'border-sky-500/60 hover:border-sky-400 shadow-sky-500/20';
      default: return 'border-slate-700 hover:border-slate-500';
    }
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NIVEL {level} ALCANZADO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-100">
            Selecciona una Sobrecarga Táctica
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Elige una mejora para incorporar permanentemente a tu nave durante esta expedición.
          </p>
        </div>

        {/* Upgrade Cards Grid */}
        <div className="flex flex-col gap-3">
          {options.map((option, index) => {
            return (
              <button
                key={option.id + index}
                type="button"
                onClick={() => {
                  sound.click();
                  onSelect(option);
                }}
                className={`group flex items-start gap-4 p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border text-left transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md ${getBorderColor(
                  option.rarity
                )}`}
              >
                {/* Icon Container */}
                <div className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-cyan-400 group-hover:text-cyan-300 transition-colors shadow-inner">
                  {getIcon(option.icon)}
                </div>

                {/* Card Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-heading font-bold text-sm sm:text-base text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                      {option.title}
                    </span>
                    {getRarityBadge(option.rarity)}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
