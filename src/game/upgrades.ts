import { ShipConfig, UpgradeCard, PlayerStats, PermanentUpgrades } from './types';

export const SHIPS: ShipConfig[] = [
  {
    id: 'valkyrie',
    name: 'Caza F-22 Valkyrie',
    tagline: 'Caza táctico de 5ª generación con alas delta, doble turbina y misiles guiados',
    hull: 120,
    speed: 300,
    fireRate: 3.6,
    damage: 25,
    color: '#06b6d4', // Cyan
    accentColor: '#38bdf8',
    specialName: 'Pulso EMP',
    specialDescription: 'Detona una onda electromagnética que neutraliza proyectiles y daña a todos los aviones enemigos.',
    specialCooldown: 12,
    unlocked: true,
    cost: 0,
  },
  {
    id: 'ghost',
    name: 'Bombardero B-2 Ghost',
    tagline: 'Ala volante furtiva de tecnología stealth y fuselaje radar-absorbente',
    hull: 90,
    speed: 370,
    fireRate: 5.2,
    damage: 18,
    color: '#a855f7', // Purple
    accentColor: '#c084fc',
    specialName: 'Tormenta Espectral',
    specialDescription: 'Descarga un torrente radial omnidireccional de 24 rayos láser perforantes.',
    specialCooldown: 14,
    unlocked: false,
    cost: 250,
  },
  {
    id: 'titan',
    name: 'Cañonero A-10 Titan',
    tagline: 'Fortaleza voladora de asalto pesado con cañón rotatorio frontal GAU-8 y doble reactor',
    hull: 210,
    speed: 240,
    fireRate: 2.8,
    damage: 38,
    color: '#f59e0b', // Amber
    accentColor: '#fbbf24',
    specialName: 'Rayo Apocalipsis',
    specialDescription: 'Dispara un haz continuo colosal que calcina toda la columna frente al avión durante 3 segundos.',
    specialCooldown: 16,
    unlocked: false,
    cost: 500,
  },
];

export const UPGRADE_POOL: UpgradeCard[] = [
  {
    id: 'multi_shot',
    title: 'Batería Multidisparo',
    category: 'weapon',
    rarity: 'rare',
    description: '+1 cañón frontal adicional disparado en cada andanada.',
    icon: 'sparkles',
    apply: (stats) => {
      stats.bulletCount = Math.min(stats.bulletCount + 1, 5);
    },
  },
  {
    id: 'plasma_pierce',
    title: 'Núcleo Perforante',
    category: 'weapon',
    rarity: 'epic',
    description: 'Los proyectiles atraviesan +1 enemigo antes de disiparse.',
    icon: 'maximize-2',
    apply: (stats) => {
      stats.pierce += 1;
    },
  },
  {
    id: 'hyper_fire',
    title: 'Sobrecarga de Fuego',
    category: 'weapon',
    rarity: 'common',
    description: '+25% de cadencia de tiro continuo.',
    icon: 'flame',
    apply: (stats) => {
      stats.fireRate *= 1.25;
    },
  },
  {
    id: 'heavy_rounds',
    title: 'Munición Antimateria',
    category: 'weapon',
    rarity: 'common',
    description: '+25% de daño de impacto directo.',
    icon: 'zap',
    apply: (stats) => {
      stats.damageMultiplier *= 1.25;
    },
  },
  {
    id: 'orbital_drone',
    title: 'Dron Centinela',
    category: 'tech',
    rarity: 'rare',
    description: 'Despliega un dron de escolta autónomo que orbita y abate agresores.',
    icon: 'crosshair',
    apply: (stats) => {
      stats.hasOrbitalDrone = true;
      stats.orbitalDroneCount = Math.min(stats.orbitalDroneCount + 1, 4);
    },
  },
  {
    id: 'plasma_aura',
    title: 'Aura Radiante de Fusión',
    category: 'tech',
    rarity: 'epic',
    description: 'Emite un anillo de energía constante que incinera enemigos cercanos.',
    icon: 'radio',
    apply: (stats) => {
      stats.hasPlasmaAura = true;
      stats.plasmaAuraRadius = Math.min(stats.plasmaAuraRadius + 30, 150);
    },
  },
  {
    id: 'energy_shield',
    title: 'Escudo Cinético',
    category: 'defense',
    rarity: 'rare',
    description: 'Genera un escudo de 40 PV que absorbe impactos y se regenera.',
    icon: 'shield',
    apply: (stats) => {
      stats.shieldMax += 40;
      stats.shieldCurrent = stats.shieldMax;
      stats.shieldRechargeRate += 4;
    },
  },
  {
    id: 'nanite_repair',
    title: 'Enjambre de Nanitas',
    category: 'defense',
    rarity: 'common',
    description: 'Repara 40 PV al instante y aumenta el blindaje máximo en +25 PV.',
    icon: 'heart',
    apply: (stats) => {
      stats.maxHp += 25;
      stats.hp = Math.min(stats.maxHp, stats.hp + 40);
    },
  },
  {
    id: 'gravity_magnet',
    title: 'Vórtice Magnético',
    category: 'utility',
    rarity: 'common',
    description: '+60% de radio para atraer cristales de energía y créditos.',
    icon: 'magnet',
    apply: (stats) => {
      stats.magnetRadius *= 1.6;
    },
  },
  {
    id: 'crit_matrix',
    title: 'Matriz Crítica',
    category: 'weapon',
    rarity: 'rare',
    description: '+15% de probabilidad de asestar golpes críticos (2x de daño).',
    icon: 'target',
    apply: (stats) => {
      stats.critChance = Math.min(stats.critChance + 0.15, 0.75);
    },
  },
  {
    id: 'ion_boosters',
    title: 'Propulsores Iónicos',
    category: 'utility',
    rarity: 'common',
    description: '+18% de velocidad de traslación táctica.',
    icon: 'wind',
    apply: (stats) => {
      stats.speed *= 1.18;
    },
  },
];

export function getRandomUpgradeOptions(count: number = 3): UpgradeCard[] {
  const shuffled = [...UPGRADE_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function createInitialStats(ship: ShipConfig, perms: PermanentUpgrades): PlayerStats {
  const bonusHp = perms.maxHpLevel * 20;
  const bonusDmg = 1 + perms.damageLevel * 0.1;
  const bonusSpeed = 1 + perms.speedLevel * 0.08;
  const bonusMagnet = 1 + perms.magnetLevel * 0.25;
  const bonusCrit = perms.critLevel * 0.05;

  return {
    hp: ship.hull + bonusHp,
    maxHp: ship.hull + bonusHp,
    speed: ship.speed * bonusSpeed,
    fireRate: ship.fireRate,
    damageMultiplier: bonusDmg,
    critChance: 0.1 + bonusCrit,
    bulletCount: 1,
    pierce: ship.id === 'ghost' ? 1 : 0,
    magnetRadius: 100 * bonusMagnet,
    shieldMax: ship.id === 'titan' ? 50 : 0,
    shieldCurrent: ship.id === 'titan' ? 50 : 0,
    shieldRechargeRate: ship.id === 'titan' ? 5 : 0,
    hasOrbitalDrone: false,
    orbitalDroneCount: 0,
    hasPlasmaAura: false,
    plasmaAuraRadius: 65,
  };
}
