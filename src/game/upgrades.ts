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
  {
    id: 'raptor',
    name: 'Caza F-35 Lightning',
    tagline: 'Caza furtivo de ataque multifunción de 5ª gen con turbofán vectorial y misiles Sidewinder',
    hull: 130,
    speed: 330,
    fireRate: 4.4,
    damage: 28,
    color: '#64748b', // Slate Gray Military Camo
    accentColor: '#38bdf8',
    specialName: 'Enjambre Sidewinder',
    specialDescription: 'Lanza una andanada de 10 micromisiles guiados que rastrean y detonan en cadena.',
    specialCooldown: 13,
    unlocked: false,
    cost: 350,
  },
  {
    id: 'warthog',
    name: 'Asalto Su-25 Frogfoot',
    tagline: 'Avión de apoyo aéreo cercano acorazado con blindaje de titanio y camuflaje selvático',
    hull: 260,
    speed: 220,
    fireRate: 3.4,
    damage: 42,
    color: '#65a30d', // Olive Camo Green
    accentColor: '#facc15',
    specialName: 'Bombardeo en Racimo',
    specialDescription: 'Despliega una cortina de 8 bombas de fragmentación pesada que barren el espacio.',
    specialCooldown: 15,
    unlocked: false,
    cost: 450,
  },
  {
    id: 'blackbird',
    name: 'Interceptor SR-71 Blackbird',
    tagline: 'Aeronave hipersónica Mach 3+ con motores J58, fuselaje negro de titanio y alcance láser extremo',
    hull: 85,
    speed: 430,
    fireRate: 4.0,
    damage: 48,
    color: '#334155', // Obsidian Stealth Black
    accentColor: '#f43f5e',
    specialName: 'Onda Hipersónica Mach 3',
    specialDescription: 'Detona un estallido sónico supersónico que pulveriza proyectiles e incinera el frente.',
    specialCooldown: 11,
    unlocked: false,
    cost: 650,
  },
  {
    id: 'typhoon',
    name: 'Caza Delta Eurofighter',
    tagline: 'Caza de intercepción y superioridad aérea con alas en delta, canards móviles y contramedidas tácticas',
    hull: 140,
    speed: 350,
    fireRate: 4.8,
    damage: 26,
    color: '#d97706', // Desert Tan Camo
    accentColor: '#38bdf8',
    specialName: 'Bengalas & Escudo Táctico',
    specialDescription: 'Expulsa 16 bengalas defensivas en abanico y recarga instantáneamente el escudo de energía.',
    specialCooldown: 12,
    unlocked: false,
    cost: 750,
  },
  {
    id: 'tomcat',
    name: 'Interceptor F-14 Tomcat',
    tagline: 'Caza naval de geometría variable con doble turbina GE F110 y emblema Jolly Rogers',
    hull: 155,
    speed: 340,
    fireRate: 4.6,
    damage: 32,
    color: '#334155', // Naval Slate Dark
    accentColor: '#facc15', // VF-84 Yellow Chevron
    specialName: 'Misiles AIM-54 Phoenix',
    specialDescription: 'Descarga una salva de 6 misiles pesados de largo alcance que persiguen y aniquilan escuadrones enteros.',
    specialCooldown: 13,
    unlocked: false,
    cost: 850,
  },
  {
    id: 'spitfire',
    name: 'Caza As Spitfire Mk.IX',
    tagline: 'Leyenda británica de la Segunda Guerra Mundial con alas elípticas y potente motor Rolls-Royce Merlin',
    hull: 125,
    speed: 360,
    fireRate: 6.2,
    damage: 22,
    color: '#3f6212', // RAF Camo Green
    accentColor: '#ef4444', // RAF Cockade Red
    specialName: 'Ráfaga Browning Óctuple',
    specialDescription: 'Abre fuego con 8 cañones continuos de alta cadencia incendiaria con proyectiles perforantes.',
    specialCooldown: 10,
    unlocked: false,
    cost: 950,
  },
  {
    id: 'fulcrum',
    name: 'Superioridad MiG-29 Fulcrum',
    tagline: 'Caza táctico de combate cerrado con fuselaje integrado, doble deriva vertical y empuje acrobático',
    hull: 145,
    speed: 355,
    fireRate: 5.0,
    damage: 29,
    color: '#0284c7', // Arctic Naval Blue
    accentColor: '#e0f2fe',
    specialName: 'Maniobra Cobra de Pugachev',
    specialDescription: 'Frena el avión en un ángulo vertical de 90° esquivando todo daño y emitiendo una onda expansiva de plasma.',
    specialCooldown: 12,
    unlocked: false,
    cost: 1100,
  },
  {
    id: 'dragonlady',
    name: 'Espía U-2S Dragon Lady',
    tagline: 'Aeronave de reconocimiento de ultra gran altitud con alas planeadoras de 31 metros y enlace satelital',
    hull: 115,
    speed: 310,
    fireRate: 4.2,
    damage: 44,
    color: '#1e293b', // Spy Radar-Absorbent Black
    accentColor: '#38bdf8',
    specialName: 'Ataque Orbital de Precisión',
    specialDescription: 'Sincroniza con satélites espaciales militares para desatar 3 rayos iónicos devastadores desde la órbita.',
    specialCooldown: 14,
    unlocked: false,
    cost: 1300,
  },
  {
    id: 'aurora',
    name: 'Hipersónico SR-91 Aurora',
    tagline: 'Prototipo secreto Mach 5+ con fuselaje waverider triangular y motores de detonación por pulsos (Scramjet)',
    hull: 170,
    speed: 390,
    fireRate: 5.4,
    damage: 36,
    color: '#0f172a', // Waverider Black/Orange
    accentColor: '#f97316', // Scramjet Pulse Orange
    specialName: 'Pulso Scramjet Mach 5',
    specialDescription: 'Detona una onda de choque hipersónica que evapora proyectiles hostiles y congela el tiempo temporalmente.',
    specialCooldown: 15,
    unlocked: false,
    cost: 1600,
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
    critChance: (ship.id === 'blackbird' ? 0.25 : 0.1) + bonusCrit,
    bulletCount: 1,
    pierce: ship.id === 'ghost' || ship.id === 'blackbird' ? 1 : 0,
    magnetRadius: 100 * bonusMagnet,
    shieldMax: ship.id === 'titan' ? 50 : ship.id === 'warthog' ? 70 : ship.id === 'typhoon' ? 40 : 0,
    shieldCurrent: ship.id === 'titan' ? 50 : ship.id === 'warthog' ? 70 : ship.id === 'typhoon' ? 40 : 0,
    shieldRechargeRate: ship.id === 'titan' ? 5 : ship.id === 'warthog' ? 6 : ship.id === 'typhoon' ? 8 : 0,
    hasOrbitalDrone: false,
    orbitalDroneCount: 0,
    hasPlasmaAura: false,
    plasmaAuraRadius: 65,
  };
}
