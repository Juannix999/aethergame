export type GameState = 'TITLE' | 'PLAYING' | 'LEVEL_UP' | 'PAUSED' | 'GAME_OVER' | 'VICTORY';

export type WeatherType = 'CLEAR' | 'RAIN' | 'STORM' | 'NEBULA';

export interface WeatherState {
  type: WeatherType;
  name: string;
  subname: string;
  icon: string;
  color: string;
  description: string;
}

export type ShipId = 'valkyrie' | 'ghost' | 'titan';

export interface ShipConfig {
  id: ShipId;
  name: string;
  tagline: string;
  hull: number;
  speed: number;
  fireRate: number;
  damage: number;
  color: string;
  accentColor: string;
  specialName: string;
  specialDescription: string;
  specialCooldown: number; // in seconds
  unlocked: boolean;
  cost: number;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  speed: number;
  fireRate: number; // shots per sec
  damageMultiplier: number;
  critChance: number;
  bulletCount: number;
  pierce: number;
  magnetRadius: number;
  shieldMax: number;
  shieldCurrent: number;
  shieldRechargeRate: number;
  hasOrbitalDrone: boolean;
  orbitalDroneCount: number;
  hasPlasmaAura: boolean;
  plasmaAuraRadius: number;
}

export interface UpgradeCard {
  id: string;
  title: string;
  category: 'weapon' | 'defense' | 'utility' | 'tech';
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  apply: (stats: PlayerStats, game: any) => void;
}

export interface PermanentUpgrades {
  maxHpLevel: number;
  damageLevel: number;
  speedLevel: number;
  magnetLevel: number;
  critLevel: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rewardCoins: number;
}

export interface HighScoreRecord {
  score: number;
  wave: number;
  timeSurvived: number;
  kills: number;
  date: string;
  shipId: ShipId;
}
