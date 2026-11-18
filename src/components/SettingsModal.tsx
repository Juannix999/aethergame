import React, { useState } from 'react';
import {
  Settings,
  X,
  Volume2,
  VolumeX,
  Music,
  Zap,
  Crosshair,
  Gauge,
  Sliders,
  RotateCcw,
  AlertTriangle,
  Check,
  Info,
  Sparkles,
  Activity,
  Flame,
} from 'lucide-react';
import { sound } from '../game/audio';
import { GameSaveData } from '../game/storage';

interface SettingsModalProps {
  onClose: () => void;
  saveData: GameSaveData;
  onUpdateSetting: <K extends keyof GameSaveData>(key: K, value: GameSaveData[K]) => void;
  onResetData: () => void;
}

type SettingsTab = 'audio' | 'controls' | 'display' | 'data';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  saveData,
  onUpdateSetting,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('audio');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [vibrationTested, setVibrationTested] = useState(false);

  const handleTestSfx = () => {
    sound.laser();
    setTimeout(() => sound.explosion(false), 120);
  };

  const handleTestVibration = () => {
    sound.vibrate([40, 40, 80]);
    setVibrationTested(true);
    setTimeout(() => setVibrationTested(false), 1200);
  };

  const handleConfirmReset = () => {
    sound.explosion(true);
    onResetData();
    setShowResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-[60] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Settings className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
                AJUSTES DE SISTEMA
              </h2>
              <p className="text-[11px] font-mono text-cyan-400">
                CONFIGURACIÓN DE VUELO & HARDWARE
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.click();
              onClose();
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            title="Cerrar Ajustes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab('audio');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
              activeTab === 'audio'
                ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Audio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab('controls');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
              activeTab === 'controls'
                ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Controles</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab('display');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
              activeTab === 'display'
                ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Pantalla</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.click();
              setActiveTab('data');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
              activeTab === 'data'
                ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Datos</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-200 text-sm">
          {/* TAB 1: AUDIO */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              {/* Master Sound Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${saveData.soundMuted ? 'bg-rose-950/80 text-rose-400 border border-rose-500/40' : 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/40'}`}>
                    {saveData.soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100">Sonido General</div>
                    <div className="text-[11px] text-slate-400">Activar o silenciar todo el audio del juego</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = !saveData.soundMuted;
                    sound.setMute(next);
                    onUpdateSetting('soundMuted', next);
                  }}
                  className={`w-13 h-7 rounded-full p-1 transition-colors flex items-center ${
                    !saveData.soundMuted ? 'bg-cyan-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* SFX Volume */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-slate-200">Efectos de Combate (SFX)</span>
                  </div>
                  <span className="font-mono text-xs text-cyan-400 font-bold">
                    {Math.round((saveData.sfxVolume ?? 0.8) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={saveData.sfxVolume ?? 0.8}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    sound.setSfxVolume(val);
                    onUpdateSetting('sfxVolume', val);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between items-center pt-1 text-[11px] text-slate-400 font-mono">
                  <span>Disparos, explosiones y alertas</span>
                  <button
                    type="button"
                    onClick={handleTestSfx}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-sans font-semibold border border-slate-700 hover:border-cyan-400/50 transition-colors"
                  >
                    Probar SFX
                  </button>
                </div>
              </div>

              {/* Music Volume */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-slate-200">Música de Combate & Ambiente</span>
                  </div>
                  <span className="font-mono text-xs text-indigo-400 font-bold">
                    {Math.round((saveData.musicVolume ?? 0.6) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={saveData.musicVolume ?? 0.6}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    sound.setMusicVolume(val);
                    onUpdateSetting('musicVolume', val);
                  }}
                  className="w-full accent-indigo-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="text-[11px] text-slate-400 font-mono">
                  Sintetizador polifónico espacial adaptativo
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTROLES */}
          {activeTab === 'controls' && (
            <div className="space-y-4">
              {/* Auto Aim / Guided Fire */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-950/80 text-sky-400 border border-sky-500/40">
                    <Crosshair className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100">Disparo Guiado (Auto-Aim)</div>
                    <div className="text-[11px] text-slate-400">Apuntado inteligente de cañones hacia objetivos cercanos</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    onUpdateSetting('autoAim', !saveData.autoAim);
                  }}
                  className={`w-13 h-7 rounded-full p-1 transition-colors flex items-center ${
                    saveData.autoAim ? 'bg-cyan-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Joystick Sensitivity */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-slate-200">Sensibilidad Táctil Directa</span>
                  </div>
                  <span className="font-mono text-xs text-cyan-400 uppercase font-semibold">
                    {saveData.joystickSensitivity ?? 'normal'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'normal', 'high'] as const).map((lvl) => {
                    const isSelected = (saveData.joystickSensitivity || 'normal') === lvl;
                    const labels = { low: 'Baja (0.9x)', normal: 'Normal (1.2x)', high: 'Alta (1.5x)' };
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => {
                          sound.click();
                          onUpdateSetting('joystickSensitivity', lvl);
                        }}
                        className={`py-2 px-2 rounded-lg font-mono text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {labels[lvl]}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Ajusta la velocidad de respuesta al deslizar el dedo directamente sobre la pantalla
                </div>
              </div>

              {/* Haptic Vibration */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-500/40">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100">Vibración Háptica (Celular)</div>
                    <div className="text-[11px] text-slate-400">Respuesta física en impactos, choques y explosiones</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestVibration}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono text-xs border border-slate-700 hover:border-indigo-400/50 transition-colors"
                  >
                    {vibrationTested ? '¡Vibrando!' : 'Probar'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const next = !saveData.hapticsEnabled;
                      sound.setHaptics(next);
                      onUpdateSetting('hapticsEnabled', next);
                    }}
                    className={`w-13 h-7 rounded-full p-1 transition-colors flex items-center ${
                      saveData.hapticsEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PANTALLA & RENDIMIENTO */}
          {activeTab === 'display' && (
            <div className="space-y-4">
              {/* Graphics & Particle Quality */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-slate-200">Calidad de Partículas & Clima</span>
                  </div>
                  <span className="font-mono text-xs text-amber-400 uppercase font-semibold">
                    {saveData.graphicsQuality || 'high'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((q) => {
                    const isSelected = (saveData.graphicsQuality || 'high') === q;
                    const labels = {
                      low: 'Ahorro Batería',
                      medium: 'Equilibrada',
                      high: 'Ultra (60 FPS)',
                    };
                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          sound.click();
                          onUpdateSetting('graphicsQuality', q);
                        }}
                        className={`py-2 px-2 rounded-lg font-mono text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-amber-950/70 border-amber-400 text-amber-300 shadow-sm shadow-amber-500/20'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {labels[q]}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Regula la densidad de gotas de lluvia, nebulosas y chispas de plasma
                </div>
              </div>

              {/* Show FPS Counter */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100">Contador de FPS en Pantalla</div>
                    <div className="text-[11px] text-slate-400">Superpone la tasa de refresco y estabilidad de fotogramas</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.click();
                    onUpdateSetting('showFps', !saveData.showFps);
                  }}
                  className={`w-13 h-7 rounded-full p-1 transition-colors flex items-center ${
                    saveData.showFps ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: DATOS & ALMACENAMIENTO */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              {/* Progress Summary Card */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Resumen de Progreso Guardado Localmente
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">🪙 Créditos:</span>
                    <span className="text-amber-400 font-bold">{saveData.coins.toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">✈️ Cazas:</span>
                    <span className="text-cyan-400 font-bold">{saveData.unlockedShips.length}/7</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">🏆 Récord:</span>
                    <span className="text-emerald-400 font-bold">
                      {saveData.highScores[0]?.score.toLocaleString() || '0'} PTS
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">🎖️ Logros:</span>
                    <span className="text-purple-400 font-bold">
                      {saveData.achievements.filter(a => a.unlocked).length}/{saveData.achievements.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reset Data Confirmation / Action */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Zona de Restablecimiento</span>
                </div>
                <p className="text-xs text-slate-400">
                  Borra el progreso de la partida, monedas, cazas desbloqueados y récords para reiniciar el juego como si fuera la primera vez.
                </p>

                {resetSuccess ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-xs">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>¡Progreso restablecido con éxito a valores de fábrica!</span>
                  </div>
                ) : !showResetConfirm ? (
                  <button
                    type="button"
                    onClick={() => {
                      sound.click();
                      setShowResetConfirm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-900/40 hover:bg-rose-900/70 border border-rose-600/50 text-rose-300 text-xs font-semibold tracking-wide transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restablecer Todo el Progreso</span>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-lg bg-rose-950/80 border border-rose-500 space-y-2.5 animate-in fade-in duration-150">
                    <div className="text-xs font-bold text-rose-200">
                      ¿Confirmar borrado total? Esta acción no se puede deshacer.
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleConfirmReset}
                        className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
                      >
                        Sí, Borrar Todo
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(false)}
                        className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Version & Technical Details */}
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Aether Strike: Combate Aéreo</span>
                </div>
                <span className="text-slate-400">v1.2.0 (Build 2026)</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Check className="w-3.5 h-3.5 text-cyan-400" />
            <span>Los cambios se guardan automáticamente</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.click();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-heading font-bold text-xs tracking-wide transition-all shadow-md shadow-cyan-600/20"
          >
            ACEPTAR Y REGRESAR
          </button>
        </div>
      </div>
    </div>
  );
};
