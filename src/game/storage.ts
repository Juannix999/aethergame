import { ShipId, PermanentUpgrades, Achievement, HighScoreRecord } from './types';

export interface GameSaveData {
  coins: number;
  unlockedShips: ShipId[];
  selectedShip: ShipId;
  permanentUpgrades: PermanentUpgrades;
  achievements: Achievement[];
  highScores: HighScoreRecord[];
  soundMuted: boolean;
  hapticsEnabled: boolean;
  autoAim: boolean;
  showMobileFrame: boolean;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'Primer Derribo',
    description: 'Destruye a tu primer enemigo en el hiperespacio',
    icon: 'target',
    unlocked: false,
    rewardCoins: 50,
  },
  {
    id: 'kills_50',
    title: 'As de Combate',
    description: 'Elimina a 50 naves enemigas en una sola partida',
    icon: 'zap',
    unlocked: false,
    rewardCoins: 150,
  },
  {
    id: 'wave_5',
    title: 'Cazador de Titanes',
    description: 'Sobrevive y derrota al primer Titán en la oleada 5',
    icon: 'shield',
    unlocked: false,
    rewardCoins: 300,
  },
  {
    id: 'level_10',
    title: 'Hiper Sobrecarga',
    description: 'Alcanza el nivel 10 de mejoras en una expedición',
    icon: 'award',
    unlocked: false,
    rewardCoins: 250,
  },
  {
    id: 'coin_hoarder',
    title: 'Magnate Galáctico',
    description: 'Acumula 1,000 monedas de crédito espacial',
    icon: 'coins',
    unlocked: false,
    rewardCoins: 500,
  },
  {
    id: 'wave_10',
    title: 'Maestro del Vacío',
    description: 'Derrota al Soberano del Vacío en la oleada 10',
    icon: 'crown',
    unlocked: false,
    rewardCoins: 1000,
  },
];

const DEFAULT_SAVE: GameSaveData = {
  coins: 100, // Starter bonus
  unlockedShips: ['valkyrie'],
  selectedShip: 'valkyrie',
  permanentUpgrades: {
    maxHpLevel: 0,
    damageLevel: 0,
    speedLevel: 0,
    magnetLevel: 0,
    critLevel: 0,
  },
  achievements: DEFAULT_ACHIEVEMENTS,
  highScores: [],
  soundMuted: false,
  hapticsEnabled: true,
  autoAim: true,
  showMobileFrame: true, // Default to smartphone frame for mobile experience
};

const STORAGE_KEY = 'aether_strike_save_v1';

export function loadSaveData(): GameSaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SAVE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SAVE,
      ...parsed,
      permanentUpgrades: {
        ...DEFAULT_SAVE.permanentUpgrades,
        ...(parsed.permanentUpgrades || {}),
      },
      achievements: DEFAULT_ACHIEVEMENTS.map(def => {
        const existing = parsed.achievements?.find((a: Achievement) => a.id === def.id);
        return existing ? { ...def, unlocked: existing.unlocked } : def;
      }),
    };
  } catch (e) {
    console.warn('Failed to load save data, using defaults:', e);
    return DEFAULT_SAVE;
  }
}

export function saveGameData(data: GameSaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save data:', e);
  }
}
