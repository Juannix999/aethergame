import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/engine';
import { GameState, ShipConfig, UpgradeCard, PermanentUpgrades, ShipId, WeatherState } from './game/types';
import { SHIPS } from './game/upgrades';
import { sound } from './game/audio';
import { loadSaveData, saveGameData, resetSaveData, GameSaveData } from './game/storage';
import { GameHUD } from './components/GameHUD';
import { TouchControls } from './components/TouchControls';
import { TitleScreen } from './components/TitleScreen';
import { LevelUpModal } from './components/LevelUpModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { HangarModal } from './components/HangarModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { Trophy } from 'lucide-react';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Persistent Game Data state
  const [saveData, setSaveData] = useState<GameSaveData>(() => loadSaveData());

  // Active Ship
  const [selectedShip, setSelectedShip] = useState<ShipConfig>(() => {
    const saved = loadSaveData();
    return SHIPS.find(s => s.id === saved.selectedShip) || SHIPS[0];
  });

  // Game Engine State
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [levelUpOptions, setLevelUpOptions] = useState<UpgradeCard[]>([]);
  const [gameOverSummary, setGameOverSummary] = useState<{
    score: number;
    wave: number;
    kills: number;
    coinsEarned: number;
    timeSurvived: number;
    isNewHighScore: boolean;
  } | null>(null);

  // Auxiliary Modals
  const [showHangar, setShowHangar] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [achievementToast, setAchievementToast] = useState<string | null>(null);

  const showHangarRef = useRef(showHangar);
  const showAchievementsRef = useRef(showAchievements);
  const showSettingsRef = useRef(showSettingsModal);
  showHangarRef.current = showHangar;
  showAchievementsRef.current = showAchievements;
  showSettingsRef.current = showSettingsModal;

  // Sound & Settings
  const [isMuted, setIsMuted] = useState<boolean>(() => loadSaveData().soundMuted);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => loadSaveData().hapticsEnabled);
  const [autoAim, setAutoAim] = useState<boolean>(() => loadSaveData().autoAim);

  // Real-time HUD State from Engine (updated at measured intervals)
  const [hudData, setHudData] = useState<{
    hp: number;
    maxHp: number;
    shield: number;
    maxShield: number;
    xp: number;
    xpNeeded: number;
    level: number;
    score: number;
    coinsThisRun: number;
    wave: number;
    dashReady: boolean;
    dashCooldownPct: number;
    specialReady: boolean;
    specialCooldownPct: number;
    bossActive: boolean;
    bossHpPct: number;
    bossName: string;
    weather: WeatherState;
  }>({
    hp: 120,
    maxHp: 120,
    shield: 0,
    maxShield: 0,
    xp: 0,
    xpNeeded: 60,
    level: 1,
    score: 0,
    coinsThisRun: 0,
    wave: 1,
    dashReady: true,
    dashCooldownPct: 0,
    specialReady: true,
    specialCooldownPct: 0,
    bossActive: false,
    bossHpPct: 0,
    bossName: '',
    weather: {
      type: 'CLEAR',
      name: 'Espacio Despejado',
      subname: 'Vuelo Nocturno Estable',
      icon: 'sparkles',
      color: '#38bdf8',
      description: 'Condiciones atmosféricas ideales. Visibilidad espacial máxima.',
    },
  });

  // Keep sound engine settings aligned
  useEffect(() => {
    sound.setMute(isMuted);
    sound.setHaptics(hapticsEnabled);
    if (saveData.sfxVolume !== undefined) sound.setSfxVolume(saveData.sfxVolume);
    if (saveData.musicVolume !== undefined) sound.setMusicVolume(saveData.musicVolume);
  }, [isMuted, hapticsEnabled, saveData.sfxVolume, saveData.musicVolume]);

  // Toast auto-dismiss
  useEffect(() => {
    if (achievementToast) {
      const timer = setTimeout(() => {
        setAchievementToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [achievementToast]);

  // Instantiate Game Engine once canvas mounts
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current, selectedShip, {
      onStateChange: (newState) => {
        setGameState(newState);
      },
      onHUDUpdate: (data) => {
        setHudData(data);
      },
      onLevelUp: (options) => {
        setLevelUpOptions(options);
      },
      onGameOver: (summary) => {
        setGameOverSummary(summary);
        // Refresh save data
        setSaveData(loadSaveData());
      },
      onAchievementUnlocked: (title) => {
        setAchievementToast(title);
        setSaveData(loadSaveData());
      },
    });

    engineRef.current = engine;
    engine.start();

    // Handle Window Resize
    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener('resize', handleResize);

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      engine.keysHeld[e.code] = true;

      // Start game on Space/Enter from Title Screen
      if (engine.state === 'TITLE' && (e.code === 'Space' || e.code === 'Enter')) {
        engine.startNewGame();
        return;
      }

      // Actions during play
      if (engine.state === 'PLAYING') {
        if (e.code === 'Space') {
          engine.triggerDash();
        } else if (e.code === 'KeyE' || e.code === 'KeyF') {
          engine.triggerSpecial();
        } else if (e.code === 'Escape' || e.code === 'KeyP') {
          engine.setState('PAUSED');
        }
      } else if (engine.state === 'PAUSED' && (e.code === 'Escape' || e.code === 'KeyP')) {
        engine.setState('PLAYING');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      engine.keysHeld[e.code] = false;
    };

    const handleBlur = () => {
      engine.keysHeld = {};
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      engine.stop();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [selectedShip]);

  // Android / Mobile Back Button handler (Capacitor MainActivity & Browser History popstate)
  useEffect(() => {
    const handleBackAction = (): boolean => {
      if (showSettingsRef.current) {
        setShowSettingsModal(false);
        return true;
      }
      if (showHangarRef.current) {
        setShowHangar(false);
        return true;
      }
      if (showAchievementsRef.current) {
        setShowAchievements(false);
        return true;
      }

      const engine = engineRef.current;
      if (!engine) return false;

      if (engine.state === 'PLAYING') {
        engine.setState('PAUSED');
        return true;
      }
      if (engine.state === 'PAUSED') {
        engine.setState('PLAYING');
        return true;
      }
      if (engine.state === 'LEVEL_UP') {
        return true;
      }
      if (engine.state === 'GAME_OVER') {
        engine.setState('TITLE');
        sound.stopAmbientTrack();
        return true;
      }
      return false;
    };

    (window as any).__aetherHandleBack = handleBackAction;

    const handlePopState = () => {
      const handled = handleBackAction();
      const currentState = engineRef.current?.state;
      if (
        handled &&
        (currentState === 'PLAYING' ||
          currentState === 'PAUSED' ||
          currentState === 'LEVEL_UP' ||
          currentState === 'GAME_OVER')
      ) {
        window.history.pushState({ aetherGuard: true }, '');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      delete (window as any).__aetherHandleBack;
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Push browser history guard when playing or opening modals so mobile Back button pauses instead of leaving
  useEffect(() => {
    const needsGuard =
      gameState === 'PLAYING' ||
      gameState === 'PAUSED' ||
      gameState === 'LEVEL_UP' ||
      showHangar ||
      showAchievements ||
      showSettingsModal;

    if (needsGuard && !window.history.state?.aetherGuard) {
      window.history.pushState({ aetherGuard: true }, '');
    }
  }, [gameState, showHangar, showAchievements, showSettingsModal]);

  // Callbacks
  const handleStartGame = () => {
    if (engineRef.current) {
      engineRef.current.startNewGame();
    }
  };

  const handleSelectShip = (ship: ShipConfig) => {
    setSelectedShip(ship);
    if (engineRef.current) {
      engineRef.current.setShip(ship);
    }
    const current = loadSaveData();
    current.selectedShip = ship.id;
    saveGameData(current);
    setSaveData(current);
  };

  const handleUnlockShip = (shipId: ShipId, cost: number) => {
    const current = loadSaveData();
    if (current.coins >= cost && !current.unlockedShips.includes(shipId)) {
      current.coins -= cost;
      current.unlockedShips.push(shipId);
      current.selectedShip = shipId;
      saveGameData(current);
      setSaveData(current);
      const newShip = SHIPS.find(s => s.id === shipId);
      if (newShip) {
        setSelectedShip(newShip);
        if (engineRef.current) engineRef.current.setShip(newShip);
      }
      sound.levelUp();
    }
  };

  const handleUpgradeStat = (statKey: keyof PermanentUpgrades, cost: number) => {
    const current = loadSaveData();
    if (current.coins >= cost) {
      current.coins -= cost;
      current.permanentUpgrades[statKey] += 1;
      saveGameData(current);
      setSaveData(current);
      if (engineRef.current) {
        engineRef.current.setShip(selectedShip);
      }
      sound.levelUp();
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMute(next);
    const current = loadSaveData();
    current.soundMuted = next;
    saveGameData(current);
    setSaveData(current);
  };

  const handleToggleHaptics = () => {
    const next = !hapticsEnabled;
    setHapticsEnabled(next);
    sound.setHaptics(next);
    const current = loadSaveData();
    current.hapticsEnabled = next;
    saveGameData(current);
    setSaveData(current);
  };

  const handleToggleAutoAim = () => {
    const next = !autoAim;
    setAutoAim(next);
    if (engineRef.current) {
      engineRef.current.autoAim = next;
    }
    const current = loadSaveData();
    current.autoAim = next;
    saveGameData(current);
    setSaveData(current);
  };

  const handleUpdateSetting = <K extends keyof GameSaveData>(key: K, value: GameSaveData[K]) => {
    setSaveData((prev) => {
      const updated = { ...prev, [key]: value };
      saveGameData(updated);
      return updated;
    });

    if (key === 'soundMuted') {
      setIsMuted(value as boolean);
      sound.setMute(value as boolean);
    } else if (key === 'sfxVolume') {
      sound.setSfxVolume(value as number);
    } else if (key === 'musicVolume') {
      sound.setMusicVolume(value as number);
    } else if (key === 'hapticsEnabled') {
      setHapticsEnabled(value as boolean);
      sound.setHaptics(value as boolean);
    } else if (key === 'autoAim') {
      setAutoAim(value as boolean);
      if (engineRef.current) engineRef.current.autoAim = value as boolean;
    }
  };

  const handleResetData = () => {
    const fresh = resetSaveData();
    setSaveData(fresh);
    setIsMuted(fresh.soundMuted);
    sound.setMute(fresh.soundMuted);
    setHapticsEnabled(fresh.hapticsEnabled);
    sound.setHaptics(fresh.hapticsEnabled);
    setAutoAim(fresh.autoAim);
    const defaultShip = SHIPS.find((s) => s.id === fresh.selectedShip) || SHIPS[0];
    setSelectedShip(defaultShip);
    if (engineRef.current) {
      engineRef.current.setShip(defaultShip);
      engineRef.current.autoAim = fresh.autoAim;
    }
  };

  const handleResume = () => {
    if (engineRef.current) {
      engineRef.current.setState('PLAYING');
    }
  };

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.startNewGame();
    }
  };

  const handleHome = () => {
    if (engineRef.current) {
      engineRef.current.setState('TITLE');
      sound.stopAmbientTrack();
    }
  };

  const handleLevelUpSelect = (option: UpgradeCard) => {
    if (engineRef.current) {
      engineRef.current.applyUpgrade(option);
    }
  };

  const handleTouchDelta = useCallback((dx: number, dy: number) => {
    if (engineRef.current) {
      engineRef.current.handleTouchDelta(dx, dy);
    }
  }, []);

  const handleDash = () => {
    if (engineRef.current) {
      engineRef.current.triggerDash();
    }
  };

  const handleSpecial = () => {
    if (engineRef.current) {
      engineRef.current.triggerSpecial();
    }
  };

  return (
    <main className="h-full w-full bg-slate-950 text-slate-100 flex items-center justify-center overflow-hidden relative font-sans">
      {/* Responsive Viewport Box */}
      <div className="relative w-full h-full overflow-hidden bg-slate-950">
        {/* Main 60 FPS HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block touch-none cursor-crosshair"
        />

        {/* Real-time FPS Counter Overlay if enabled in Settings */}
        {saveData.showFps && (
          <div className="absolute top-2 left-3 z-40 px-2 py-0.5 rounded bg-slate-900/90 border border-emerald-500/50 text-emerald-400 font-mono text-[10px] font-bold pointer-events-none flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>60 FPS</span>
          </div>
        )}

        {/* Achievement Toast Banner (Slides in on unlock) */}
        {achievementToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/95 border border-amber-500/80 shadow-lg shadow-amber-500/20 text-xs font-heading font-bold text-amber-300 animate-in slide-in-from-top duration-300">
            <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>¡Logro Desbloqueado: {achievementToast}!</span>
          </div>
        )}

        {/* Title Screen Overlay */}
        {gameState === 'TITLE' && (
          <TitleScreen
            selectedShip={selectedShip}
            onSelectShip={handleSelectShip}
            onStartGame={handleStartGame}
            onOpenHangar={() => setShowHangar(true)}
            onOpenAchievements={() => setShowAchievements(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
            coins={saveData.coins}
            unlockedShips={saveData.unlockedShips}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            highScore={saveData.highScores[0] || null}
          />
        )}

        {/* Active Gameplay Overlays */}
        {gameState === 'PLAYING' && (
          <>
            {/* World-Matched Low Occlusion HUD */}
            <GameHUD
              hudData={hudData}
              specialName={selectedShip.specialName}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onPause={() => {
                if (engineRef.current) engineRef.current.setState('PAUSED');
              }}
              autoAim={autoAim}
              onToggleAutoAim={handleToggleAutoAim}
            />

            {/* Direct Screen Touch Flight Controls & Action Buttons */}
            <TouchControls
              onTouchDelta={handleTouchDelta}
              onDash={handleDash}
              onSpecial={handleSpecial}
              dashReady={hudData.dashReady}
              dashCooldownPct={hudData.dashCooldownPct}
              specialReady={hudData.specialReady}
              specialCooldownPct={hudData.specialCooldownPct}
              specialName={selectedShip.specialName}
              sensitivity={saveData.joystickSensitivity}
            />
          </>
        )}

        {/* Roguelite Perk Picker Modal */}
        {gameState === 'LEVEL_UP' && (
          <LevelUpModal
            level={hudData.level}
            options={levelUpOptions}
            onSelect={handleLevelUpSelect}
          />
        )}

        {/* Pause Modal */}
        {gameState === 'PAUSED' && (
          <PauseModal
            onResume={handleResume}
            onRestart={handleRestart}
            onHome={handleHome}
            onOpenSettings={() => setShowSettingsModal(true)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            hapticsEnabled={hapticsEnabled}
            onToggleHaptics={handleToggleHaptics}
            autoAim={autoAim}
            onToggleAutoAim={handleToggleAutoAim}
            sensitivity={saveData.joystickSensitivity || 'normal'}
            onChangeSensitivity={(lvl) => handleUpdateSetting('joystickSensitivity', lvl)}
            missionStats={{
              wave: hudData.wave,
              score: hudData.score,
              level: hudData.level,
              hp: hudData.hp,
              maxHp: hudData.maxHp,
              coinsThisRun: hudData.coinsThisRun,
              shipName: selectedShip.name,
              weatherName: hudData.weather?.name,
            }}
          />
        )}

        {/* Game Over / Mission Complete Modal */}
        {gameState === 'GAME_OVER' && gameOverSummary && (
          <GameOverModal
            summary={gameOverSummary}
            onPlayAgain={handleStartGame}
            onHome={handleHome}
            onOpenHangar={() => setShowHangar(true)}
            onOpenAchievements={() => setShowAchievements(true)}
          />
        )}

        {/* Secondary Modals: Hangar & Tech Armory */}
        {showHangar && (
          <HangarModal
            coins={saveData.coins}
            unlockedShips={saveData.unlockedShips}
            selectedShip={selectedShip}
            permanentUpgrades={saveData.permanentUpgrades}
            onClose={() => setShowHangar(false)}
            onSelectShip={handleSelectShip}
            onUnlockShip={handleUnlockShip}
            onUpgradeStat={handleUpgradeStat}
          />
        )}

        {/* Secondary Modals: Play Games Achievements */}
        {showAchievements && (
          <AchievementsModal
            achievements={saveData.achievements}
            onClose={() => setShowAchievements(false)}
          />
        )}

        {/* Secondary Modal: System & Gameplay Settings ("Tuerca") */}
        {showSettingsModal && (
          <SettingsModal
            onClose={() => setShowSettingsModal(false)}
            saveData={saveData}
            onUpdateSetting={handleUpdateSetting}
            onResetData={handleResetData}
          />
        )}
      </div>
    </main>
  );
}
