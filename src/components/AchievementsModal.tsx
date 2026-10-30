import React from 'react';
import { X, Trophy, CheckCircle2, Lock, Zap, Shield, Crown, Target, Award, Coins } from 'lucide-react';
import { Achievement } from '../game/types';
import { sound } from '../game/audio';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ achievements, onClose }) => {
  const getIcon = (iconName: string, unlocked: boolean) => {
    const className = `w-5 h-5 ${unlocked ? 'text-amber-400' : 'text-slate-600'}`;
    switch (iconName) {
      case 'target': return <Target className={className} />;
      case 'zap': return <Zap className={className} />;
      case 'shield': return <Shield className={className} />;
      case 'award': return <Award className={className} />;
      case 'coins': return <Coins className={className} />;
      case 'crown': return <Crown className={className} />;
      default: return <Trophy className={className} />;
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-slate-100">
                Logros de Play Games
              </h2>
              <p className="text-xs text-slate-400">
                Desbloqueados: <span className="font-mono text-cyan-400 font-bold tabular-nums">{unlockedCount}</span> de <span className="font-mono text-slate-300 font-bold tabular-nums">{achievements.length}</span>
              </p>
            </div>
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

        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>

        {/* List */}
        <div className="overflow-y-auto pr-1 flex flex-col gap-2.5 flex-1">
          {achievements.map((ach) => {
            return (
              <div
                key={ach.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  ach.unlocked
                    ? 'bg-slate-950/70 border-amber-500/40 shadow-sm'
                    : 'bg-slate-950/40 border-slate-850 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {getIcon(ach.icon, ach.unlocked)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-slate-100 truncate">
                        {ach.title}
                      </span>
                      {ach.unlocked ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Conquistado
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-0.5">
                          <Lock className="w-3 h-3" /> Bloqueado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                      {ach.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/40 border border-amber-700/40 px-2.5 py-1 rounded-md tabular-nums">
                    +🪙 {ach.rewardCoins}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
