import { sound } from './audio';
import { GameState, ShipConfig, PlayerStats, UpgradeCard, WeatherState } from './types';
import { createInitialStats } from './upgrades';
import { loadSaveData, saveGameData } from './storage';
import { drawPlayerPlane, drawEnemyAircraft } from './aircraftRenderer';
import { WeatherSystem } from './weatherSystem';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  shape?: 'circle' | 'square' | 'line';
  rotation?: number;
}

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
  scale: number;
}

export interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  pierce: number;
  color: string;
  isPlayer: boolean;
  trailColor?: string;
}

export interface Enemy {
  id: number;
  type: 'scout' | 'fighter' | 'cruiser' | 'kamikaze' | 'boss';
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  color: string;
  shootCooldown: number;
  shootInterval: number;
  points: number;
  hitFlashTimer: number;
  behaviorTimer: number;
  bossPhase?: number;
  laserCharging?: boolean;
  laserTimer?: number;
}

export interface DropItem {
  id: number;
  type: 'xp' | 'coin' | 'health';
  x: number;
  y: number;
  vx: number;
  vy: number;
  value: number;
  radius: number;
  pulseTimer: number;
}

export interface GameEngineCallbacks {
  onStateChange: (state: GameState) => void;
  onHUDUpdate: (data: {
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
  }) => void;
  onLevelUp: (options: UpgradeCard[]) => void;
  onGameOver: (summary: {
    score: number;
    wave: number;
    kills: number;
    coinsEarned: number;
    timeSurvived: number;
    isNewHighScore: boolean;
  }) => void;
  onAchievementUnlocked: (title: string) => void;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private callbacks: GameEngineCallbacks;

  // Running state
  public state: GameState = 'TITLE';
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private hitstopTimer: number = 0;
  private shakeMagnitude: number = 0;

  // Game Arena Dimensions
  public width: number = 800;
  public height: number = 600;

  // Selected Ship & Stats
  public currentShip: ShipConfig;
  public stats: PlayerStats;

  // Player Entity
  public player = {
    x: 400,
    y: 500,
    vx: 0,
    vy: 0,
    targetVx: 0,
    targetVy: 0,
    radius: 18,
    bankAngle: 0, // Tilt animation
    shootTimer: 0,
    dashTimer: 0, // invulnerability duration
    dashCooldown: 0,
    dashMaxCooldown: 2.5,
    specialTimer: 0,
    specialCooldown: 0,
    specialMaxCooldown: 12,
    invincibleTimer: 0,
    afterimages: [] as Array<{ x: number; y: number; angle: number; alpha: number }>,
    orbitalAngle: 0,
    auraPulse: 0,
  };

  // Progression & Wave system
  public score: number = 0;
  public kills: number = 0;
  public coinsThisRun: number = 0;
  public wave: number = 1;
  public waveTimer: number = 0;
  public waveDuration: number = 30; // seconds per wave
  public xp: number = 0;
  public level: number = 1;
  public xpNeeded: number = 60;
  public timeSurvived: number = 0;
  public autoAim: boolean = true;

  // Entities
  private bullets: Bullet[] = [];
  private enemies: Enemy[] = [];
  private drops: DropItem[] = [];
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];
  private nextEnemyId: number = 1;
  private nextDropId: number = 1;

  // Starfield Parallax Layers
  private stars: Array<{ x: number; y: number; size: number; speed: number; alpha: number; color: string }> = [];

  // Input states
  public keysHeld: Record<string, boolean> = {};
  public touchStickVector = { x: 0, y: 0 };
  public isTouchFiring: boolean = false;

  // Dynamic Weather System
  public weather: WeatherSystem;

  constructor(canvas: HTMLCanvasElement, ship: ShipConfig, callbacks: GameEngineCallbacks) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2D context not available');
    this.ctx = context;
    this.callbacks = callbacks;
    this.currentShip = ship;

    const saveData = loadSaveData();
    this.stats = createInitialStats(ship, saveData.permanentUpgrades);
    this.autoAim = saveData.autoAim ?? true;
    this.player.dashMaxCooldown = 2.2;
    this.player.specialMaxCooldown = ship.specialCooldown;

    this.weather = new WeatherSystem(this.width, this.height);
    this.initStars();
    this.resize();
  }

  public resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || window.innerHeight;

    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.ctx.scale(dpr, dpr);

    if (this.weather) {
      this.weather.initParticles(this.width, this.height);
    }

    if (this.state === 'TITLE') {
      this.player.x = this.width / 2;
      this.player.y = this.height * 0.72;
    }
  }

  private initStars() {
    this.stars = [];
    const count = 90;
    const colors = ['#ffffff', '#93c5fd', '#c084fc', '#fef08a'];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * (this.width || 800),
        y: Math.random() * (this.height || 600),
        size: Math.random() < 0.2 ? 2.5 : Math.random() < 0.6 ? 1.5 : 1,
        speed: 20 + Math.random() * 80,
        alpha: 0.2 + Math.random() * 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  public setShip(ship: ShipConfig) {
    this.currentShip = ship;
    const saveData = loadSaveData();
    this.stats = createInitialStats(ship, saveData.permanentUpgrades);
    this.player.specialMaxCooldown = ship.specialCooldown;
  }

  public start() {
    this.lastTime = performance.now();
    if (!this.animFrameId) {
      this.loop(this.lastTime);
    }
  }

  public stop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public startNewGame() {
    this.resize();
    const saveData = loadSaveData();
    this.stats = createInitialStats(this.currentShip, saveData.permanentUpgrades);

    this.score = 0;
    this.kills = 0;
    this.coinsThisRun = 0;
    this.wave = 1;
    this.waveTimer = 0;
    this.xp = 0;
    this.level = 1;
    this.xpNeeded = 60;
    this.timeSurvived = 0;

    this.weather.setWaveWeather(1);

    this.player.x = this.width / 2;
    this.player.y = this.height * 0.75;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.dashTimer = 0;
    this.player.dashCooldown = 0;
    this.player.specialTimer = 0;
    this.player.specialCooldown = 0;
    this.player.invincibleTimer = 0;
    this.player.afterimages = [];

    this.bullets = [];
    this.enemies = [];
    this.drops = [];
    this.particles = [];
    this.floatingTexts = [];

    this.setState('PLAYING');
    sound.startAmbientTrack();
    this.spawnWaveGroup();
  }

  public setState(newState: GameState) {
    this.state = newState;
    this.callbacks.onStateChange(newState);
  }

  // --- Input Trigger Actions ---

  public triggerDash() {
    if (this.player.dashCooldown > 0 || this.state !== 'PLAYING') return;
    this.player.dashTimer = 0.35; // 350ms invincible dash
    this.player.dashCooldown = this.player.dashMaxCooldown;
    sound.dash();

    // Dash burst speed
    const angle = Math.atan2(this.player.targetVy || -1, this.player.targetVx || 0);
    this.player.vx = Math.cos(angle) * this.stats.speed * 2.2;
    this.player.vy = Math.sin(angle) * this.stats.speed * 2.2;

    // Spawn burst particles
    for (let i = 0; i < 16; i++) {
      this.particles.push({
        x: this.player.x,
        y: this.player.y,
        vx: (Math.random() - 0.5) * 180,
        vy: (Math.random() - 0.5) * 180,
        size: Math.random() * 4 + 2,
        color: this.currentShip.color,
        alpha: 0.9,
        decay: 3.5,
      });
    }
  }

  public triggerSpecial() {
    if (this.player.specialCooldown > 0 || this.state !== 'PLAYING') return;
    this.player.specialCooldown = this.player.specialMaxCooldown;
    sound.special();
    this.shakeMagnitude = 12;

    if (this.currentShip.id === 'valkyrie') {
      // EMP Nova: Clears enemy bullets and stuns/damages all enemies
      this.bullets = this.bullets.filter(b => b.isPlayer);
      for (let i = 0; i < 40; i++) {
        const ang = (i / 40) * Math.PI * 2;
        this.particles.push({
          x: this.player.x,
          y: this.player.y,
          vx: Math.cos(ang) * 360,
          vy: Math.sin(ang) * 360,
          size: 4,
          color: '#38bdf8',
          alpha: 1,
          decay: 2.2,
        });
      }
      this.enemies.forEach(e => {
        e.hp -= 120 * this.stats.damageMultiplier;
        e.hitFlashTimer = 0.2;
        this.addFloatingText(e.x, e.y, 'EMP! -120', '#38bdf8');
      });
    } else if (this.currentShip.id === 'ghost') {
      // Tormenta Espectral: 28-bullet omnidirectional spiral storm
      for (let i = 0; i < 28; i++) {
        const ang = (i / 28) * Math.PI * 2;
        this.bullets.push({
          x: this.player.x,
          y: this.player.y,
          vx: Math.cos(ang) * 550,
          vy: Math.sin(ang) * 550,
          radius: 6,
          damage: 55 * this.stats.damageMultiplier,
          pierce: 3,
          color: '#c084fc',
          isPlayer: true,
          trailColor: '#a855f7',
        });
      }
    } else if (this.currentShip.id === 'titan') {
      // Rayo Apocalipsis: Fires 5 massive piercing laser beams
      [-24, -12, 0, 12, 24].forEach(offset => {
        this.bullets.push({
          x: this.player.x + offset,
          y: this.player.y - 20,
          vx: 0,
          vy: -800,
          radius: 12,
          damage: 180 * this.stats.damageMultiplier,
          pierce: 99,
          color: '#fbbf24',
          isPlayer: true,
          trailColor: '#f59e0b',
        });
      });
    }
  }

  // --- Main Game Loop ---

  private loop = (currentTime: number) => {
    this.animFrameId = requestAnimationFrame(this.loop);

    // Delta time clamping
    const rawDt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    const dt = Math.min(rawDt, 0.05);

    // Hitstop handling (simulation freeze on critical impacts)
    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      this.render();
      return;
    }

    this.update(dt);
    this.render();
  };

  private update(dt: number) {
    // Parallax Starfield update (always runs, even on title screen)
    this.updateStars(dt);

    if (this.state === 'PLAYING') {
      this.timeSurvived += dt;
      this.updateWave(dt);
      this.updatePlayer(dt);
      this.weather.update(dt, this.width, this.height, this.player.x, this.player.y, this.player.vx);
      this.updateWeapons(dt);
      this.updateEnemies(dt);
      this.updateBullets(dt);
      this.updateDrops(dt);
      this.checkCollisions();
    } else if (this.state === 'TITLE') {
      // Gentle floating animation on title screen
      this.player.x = this.width / 2 + Math.sin(this.lastTime * 0.002) * 40;
      this.player.y = this.height * 0.75 + Math.cos(this.lastTime * 0.003) * 15;
      this.player.bankAngle = Math.sin(this.lastTime * 0.002) * 0.25;
      // Ambient thruster particles
      if (Math.random() < 0.4) {
        this.particles.push({
          x: this.player.x + (Math.random() - 0.5) * 8,
          y: this.player.y + 16,
          vx: (Math.random() - 0.5) * 20,
          vy: 80 + Math.random() * 40,
          size: Math.random() * 3 + 1,
          color: this.currentShip.color,
          alpha: 0.8,
          decay: 2.5,
        });
      }
    }

    this.updateParticles(dt);
    this.updateFloatingTexts(dt);

    // Screen Shake decay
    if (this.shakeMagnitude > 0) {
      this.shakeMagnitude = Math.max(0, this.shakeMagnitude - dt * 25);
    }

    // Inform React HUD of critical metrics
    this.dispatchHUDUpdate();
  }

  private updateStars(dt: number) {
    const warpSpeedMultiplier = this.state === 'PLAYING' && this.player.dashTimer > 0 ? 2.8 : 1;
    for (const star of this.stars) {
      star.y += star.speed * warpSpeedMultiplier * dt;
      if (star.y > this.height) {
        star.y = 0;
        star.x = Math.random() * this.width;
      }
    }
  }

  private updatePlayer(dt: number) {
    // Process keyboard & touch inputs
    let dx = 0;
    let dy = 0;

    if (this.keysHeld['KeyA'] || this.keysHeld['ArrowLeft']) dx -= 1;
    if (this.keysHeld['KeyD'] || this.keysHeld['ArrowRight']) dx += 1;
    if (this.keysHeld['KeyW'] || this.keysHeld['ArrowUp']) dy -= 1;
    if (this.keysHeld['KeyS'] || this.keysHeld['ArrowDown']) dy += 1;

    // Merge with virtual touch joystick
    if (this.touchStickVector.x !== 0 || this.touchStickVector.y !== 0) {
      dx += this.touchStickVector.x;
      dy += this.touchStickVector.y;
    }

    // Normalize diagonal velocity
    const len = Math.hypot(dx, dy);
    if (len > 1) {
      dx /= len;
      dy /= len;
    }

    this.player.targetVx = dx;
    this.player.targetVy = dy;

    // Smooth inertia
    const accel = 14;
    const targetVx = dx * this.stats.speed;
    const targetVy = dy * this.stats.speed;
    this.player.vx += (targetVx - this.player.vx) * Math.min(1, dt * accel);
    this.player.vy += (targetVy - this.player.vy) * Math.min(1, dt * accel);

    this.player.x += this.player.vx * dt;
    this.player.y += this.player.vy * dt;

    // Viewport containment
    const margin = 24;
    this.player.x = Math.max(margin, Math.min(this.width - margin, this.player.x));
    this.player.y = Math.max(margin, Math.min(this.height - margin, this.player.y));

    // Dynamic bank angle tilt for responsive game feel
    const targetAngle = (this.player.vx / this.stats.speed) * 0.35;
    this.player.bankAngle += (targetAngle - this.player.bankAngle) * dt * 10;

    // Timers
    if (this.player.dashTimer > 0) {
      this.player.dashTimer -= dt;
      // Record afterimages
      this.player.afterimages.push({
        x: this.player.x,
        y: this.player.y,
        angle: this.player.bankAngle,
        alpha: 0.6,
      });
    }

    if (this.player.dashCooldown > 0) {
      this.player.dashCooldown = Math.max(0, this.player.dashCooldown - dt);
    }

    if (this.player.specialCooldown > 0) {
      this.player.specialCooldown = Math.max(0, this.player.specialCooldown - dt);
    }

    if (this.player.invincibleTimer > 0) {
      this.player.invincibleTimer -= dt;
    }

    // Shield passive regeneration
    if (this.stats.shieldMax > 0 && this.stats.shieldCurrent < this.stats.shieldMax) {
      this.stats.shieldCurrent = Math.min(
        this.stats.shieldMax,
        this.stats.shieldCurrent + this.stats.shieldRechargeRate * dt
      );
    }

    // Afterimage decay
    for (let i = this.player.afterimages.length - 1; i >= 0; i--) {
      const img = this.player.afterimages[i];
      img.alpha -= dt * 4;
      if (img.alpha <= 0) {
        this.player.afterimages.splice(i, 1);
      }
    }

    // Thruster engine particles
    if (Math.random() < 0.8) {
      this.particles.push({
        x: this.player.x + (Math.random() - 0.5) * 8,
        y: this.player.y + 16,
        vx: (Math.random() - 0.5) * 30 - this.player.vx * 0.2,
        vy: 110 + Math.random() * 50,
        size: Math.random() * 3 + 2,
        color: this.player.dashTimer > 0 ? '#38bdf8' : this.currentShip.color,
        alpha: 0.9,
        decay: 3.5,
      });
    }

    // Plasma Aura rotation
    if (this.stats.hasPlasmaAura) {
      this.player.auraPulse += dt * 4;
      // Damage enemies within aura
      const auraDmg = 35 * this.stats.damageMultiplier * dt;
      this.enemies.forEach(e => {
        const dist = Math.hypot(e.x - this.player.x, e.y - this.player.y);
        if (dist < this.stats.plasmaAuraRadius + e.radius) {
          e.hp -= auraDmg;
          e.hitFlashTimer = 0.08;
          if (Math.random() < 0.2) {
            this.particles.push({
              x: e.x + (Math.random() - 0.5) * e.radius,
              y: e.y + (Math.random() - 0.5) * e.radius,
              vx: (Math.random() - 0.5) * 60,
              vy: (Math.random() - 0.5) * 60,
              size: 2,
              color: '#38bdf8',
              alpha: 0.8,
              decay: 4,
            });
          }
        }
      });
    }

    // Orbital Drones rotation & firing
    if (this.stats.hasOrbitalDrone) {
      this.player.orbitalAngle += dt * 2.5;
    }
  }

  private updateWeapons(dt: number) {
    this.player.shootTimer += dt;
    const interval = 1 / this.stats.fireRate;

    if (this.player.shootTimer >= interval) {
      this.player.shootTimer = 0;
      this.firePrimaryWeapon();
    }
  }

  private firePrimaryWeapon() {
    sound.laser();

    // Determine firing angle
    let targetAngle = -Math.PI / 2; // Default up

    if (this.autoAim && this.enemies.length > 0) {
      // Find nearest alive enemy
      let nearestDist = Infinity;
      let targetEnemy: Enemy | null = null;
      for (const e of this.enemies) {
        if (e.y < this.player.y + 100) { // Prefer enemies above or nearby
          const d = Math.hypot(e.x - this.player.x, e.y - this.player.y);
          if (d < nearestDist) {
            nearestDist = d;
            targetEnemy = e;
          }
        }
      }
      if (targetEnemy && nearestDist < 500) {
        targetAngle = Math.atan2(targetEnemy.y - this.player.y, targetEnemy.x - this.player.x);
      }
    }

    const count = this.stats.bulletCount;
    const spreadStep = 0.12; // radians
    const baseDamage = this.currentShip.damage * this.stats.damageMultiplier;
    const speed = 720;

    for (let i = 0; i < count; i++) {
      const offsetIndex = i - (count - 1) / 2;
      const angle = targetAngle + offsetIndex * spreadStep;

      // Check for critical hit
      const isCrit = Math.random() < this.stats.critChance;
      const finalDmg = isCrit ? baseDamage * 2 : baseDamage;

      this.bullets.push({
        x: this.player.x + offsetIndex * 6,
        y: this.player.y - 14,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: isCrit ? 6 : 4,
        damage: finalDmg,
        pierce: this.stats.pierce,
        color: isCrit ? '#fef08a' : this.currentShip.accentColor,
        isPlayer: true,
        trailColor: this.currentShip.color,
      });
    }

    // Orbital drones fire independent plasma bursts
    if (this.stats.hasOrbitalDrone && this.enemies.length > 0) {
      const droneCount = this.stats.orbitalDroneCount;
      for (let i = 0; i < droneCount; i++) {
        const droneAngle = this.player.orbitalAngle + (i / droneCount) * Math.PI * 2;
        const dx = this.player.x + Math.cos(droneAngle) * 55;
        const dy = this.player.y + Math.sin(droneAngle) * 55;

        // Drone shoots upward
        this.bullets.push({
          x: dx,
          y: dy,
          vx: (Math.random() - 0.5) * 40,
          vy: -600,
          radius: 3.5,
          damage: 18 * this.stats.damageMultiplier,
          pierce: 0,
          color: '#38bdf8',
          isPlayer: true,
        });
      }
    }
  }

  private updateWave(dt: number) {
    this.waveTimer += dt;

    // Check if current wave time reached and all enemies or boss dead
    const bossAlive = this.enemies.some(e => e.type === 'boss');

    if (this.waveTimer >= this.waveDuration && !bossAlive) {
      this.waveTimer = 0;
      this.wave += 1;
      this.weather.setWaveWeather(this.wave);
      this.checkWaveAchievements();
      this.spawnWaveGroup();
    }

    // Periodic enemy spawning
    const maxEnemies = Math.min(10 + this.wave * 3, 30);
    if (this.enemies.length < maxEnemies && !bossAlive && Math.random() < dt * (1.2 + this.wave * 0.3)) {
      this.spawnRandomEnemy();
    }
  }

  private spawnWaveGroup() {
    // Boss waves on wave 5 and wave 10
    if (this.wave === 5) {
      this.spawnBoss('titan_dreadnought');
      return;
    } else if (this.wave === 10) {
      this.spawnBoss('void_overlord');
      return;
    }

    // Normal wave start: spawn squad of enemies
    const count = 4 + Math.min(this.wave * 2, 12);
    for (let i = 0; i < count; i++) {
      this.spawnRandomEnemy(i * 0.15);
    }
  }

  private spawnRandomEnemy(delayOffset: number = 0) {
    const types: Array<'scout' | 'fighter' | 'cruiser' | 'kamikaze'> = ['scout'];
    if (this.wave >= 2) types.push('fighter');
    if (this.wave >= 3) types.push('cruiser');
    if (this.wave >= 4) types.push('kamikaze');

    const chosenType = types[Math.floor(Math.random() * types.length)];
    const x = 40 + Math.random() * (this.width - 80);
    const y = -30 - delayOffset * 150;

    let hp = 30 + this.wave * 12;
    let radius = 14;
    let color = '#ef4444';
    let shootInterval = 3;
    let points = 25;

    if (chosenType === 'fighter') {
      hp = 45 + this.wave * 15;
      radius = 16;
      color = '#f97316';
      shootInterval = 2.2;
      points = 45;
    } else if (chosenType === 'cruiser') {
      hp = 120 + this.wave * 35;
      radius = 24;
      color = '#ec4899';
      shootInterval = 2.8;
      points = 90;
    } else if (chosenType === 'kamikaze') {
      hp = 25 + this.wave * 10;
      radius = 13;
      color = '#fbbf24';
      shootInterval = 999;
      points = 55;
    }

    this.enemies.push({
      id: this.nextEnemyId++,
      type: chosenType,
      name: chosenType.toUpperCase(),
      x,
      y,
      vx: (Math.random() - 0.5) * 60,
      vy: chosenType === 'kamikaze' ? 140 : 50 + Math.random() * 40,
      radius,
      hp,
      maxHp: hp,
      color,
      shootCooldown: Math.random() * shootInterval,
      shootInterval,
      points,
      hitFlashTimer: 0,
      behaviorTimer: 0,
    });
  }

  private spawnBoss(bossKind: 'titan_dreadnought' | 'void_overlord') {
    sound.bossWarning();
    this.shakeMagnitude = 16;

    const isVoid = bossKind === 'void_overlord';
    const hp = isVoid ? 2600 : 1300;
    const name = isVoid ? 'SOBERANO DEL VACÍO' : 'TITÁN ACORAZADO MK-V';

    this.enemies.push({
      id: this.nextEnemyId++,
      type: 'boss',
      name,
      x: this.width / 2,
      y: -90,
      vx: 60,
      vy: 40,
      radius: isVoid ? 46 : 42,
      hp,
      maxHp: hp,
      color: isVoid ? '#a855f7' : '#ef4444',
      shootCooldown: 1.5,
      shootInterval: 1.8,
      points: 1500,
      hitFlashTimer: 0,
      behaviorTimer: 0,
      bossPhase: 1,
      laserCharging: false,
      laserTimer: 0,
    });

    this.addFloatingText(this.width / 2, 120, '⚠️ ALERTA DE AMENAZA NIVEL TITÁN ⚠️', '#ef4444');
  }

  private updateEnemies(dt: number) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.behaviorTimer += dt;
      if (e.hitFlashTimer > 0) e.hitFlashTimer -= dt;

      if (e.type === 'boss') {
        // Boss AI
        if (e.y < 120) {
          e.y += e.vy * dt;
        } else {
          // Horizontal patrol sweep
          e.x += e.vx * dt;
          if (e.x > this.width - e.radius - 20) {
            e.x = this.width - e.radius - 20;
            e.vx = -Math.abs(e.vx);
          } else if (e.x < e.radius + 20) {
            e.x = e.radius + 20;
            e.vx = Math.abs(e.vx);
          }
        }

        // Boss shooting patterns
        e.shootCooldown -= dt;
        if (e.shootCooldown <= 0) {
          e.shootCooldown = e.shootInterval;
          this.executeBossAttack(e);
        }
      } else if (e.type === 'kamikaze') {
        // Fast homing charge towards player
        const angle = Math.atan2(this.player.y - e.y, this.player.x - e.x);
        e.vx = Math.cos(angle) * 190;
        e.vy = Math.sin(angle) * 190;
        e.x += e.vx * dt;
        e.y += e.vy * dt;
      } else {
        // Standard flight
        e.x += e.vx * dt;
        e.y += e.vy * dt;

        // Bounce horizontally
        if (e.x < e.radius || e.x > this.width - e.radius) {
          e.vx = -e.vx;
        }

        // Shooting
        e.shootCooldown -= dt;
        if (e.shootCooldown <= 0 && e.y > 20 && e.y < this.height - 100) {
          e.shootCooldown = e.shootInterval;
          this.executeEnemyShot(e);
        }

        // Remove if off-screen bottom
        if (e.y > this.height + 60) {
          this.enemies.splice(i, 1);
          continue;
        }
      }

      // Check death
      if (e.hp <= 0) {
        this.destroyEnemy(e, i);
      }
    }
  }

  private executeEnemyShot(e: Enemy) {
    if (e.type === 'fighter') {
      // Single targeted shot
      const angle = Math.atan2(this.player.y - e.y, this.player.x - e.x);
      this.bullets.push({
        x: e.x,
        y: e.y + e.radius,
        vx: Math.cos(angle) * 260,
        vy: Math.sin(angle) * 260,
        radius: 4,
        damage: 16,
        pierce: 0,
        color: '#f97316',
        isPlayer: false,
      });
    } else if (e.type === 'cruiser') {
      // 3-way spread
      [-0.25, 0, 0.25].forEach(offset => {
        const angle = Math.PI / 2 + offset;
        this.bullets.push({
          x: e.x,
          y: e.y + e.radius,
          vx: Math.cos(angle) * 240,
          vy: Math.sin(angle) * 240,
          radius: 5,
          damage: 22,
          pierce: 0,
          color: '#ec4899',
          isPlayer: false,
        });
      });
    }
  }

  private executeBossAttack(e: Enemy) {
    sound.heavyLaser();
    this.shakeMagnitude = 6;

    // Pattern 1: Radial 12-bolt flower burst
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + e.behaviorTimer * 0.4;
      this.bullets.push({
        x: e.x,
        y: e.y + 20,
        vx: Math.cos(angle) * 220,
        vy: Math.sin(angle) * 220,
        radius: 6,
        damage: 25,
        pierce: 0,
        color: e.color,
        isPlayer: false,
      });
    }
  }

  private destroyEnemy(e: Enemy, index: number) {
    this.enemies.splice(index, 1);
    this.kills++;
    this.score += e.points;

    const isBoss = e.type === 'boss';
    sound.explosion(isBoss);

    // Hitstop freeze on heavy kills
    this.hitstopTimer = isBoss ? 0.08 : 0.03;
    this.shakeMagnitude = isBoss ? 18 : 6;

    // Spawn explosion debris
    const count = isBoss ? 45 : 16;
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * (isBoss ? 280 : 150);
      this.particles.push({
        x: e.x,
        y: e.y,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        size: Math.random() * 4 + 2,
        color: e.color,
        alpha: 1,
        decay: Math.random() * 2 + 1.5,
      });
    }

    // Drop XP Gems and Coins
    const xpCount = isBoss ? 15 : e.type === 'cruiser' ? 4 : 1;
    for (let i = 0; i < xpCount; i++) {
      this.drops.push({
        id: this.nextDropId++,
        type: 'xp',
        x: e.x + (Math.random() - 0.5) * 24,
        y: e.y + (Math.random() - 0.5) * 24,
        vx: (Math.random() - 0.5) * 80,
        vy: (Math.random() - 0.5) * 80,
        value: isBoss ? 50 : 20,
        radius: 6,
        pulseTimer: 0,
      });
    }

    // Coin drop chance (50% for normal, 100% for cruiser and boss)
    if (isBoss || Math.random() < 0.45) {
      const coinCount = isBoss ? 8 : 1;
      for (let i = 0; i < coinCount; i++) {
        this.drops.push({
          id: this.nextDropId++,
          type: 'coin',
          x: e.x + (Math.random() - 0.5) * 20,
          y: e.y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 60,
          vy: (Math.random() - 0.5) * 60,
          value: 10,
          radius: 7,
          pulseTimer: 0,
        });
      }
    }

    // Rare health repair pickup (10% chance)
    if (Math.random() < 0.1 || isBoss) {
      this.drops.push({
        id: this.nextDropId++,
        type: 'health',
        x: e.x,
        y: e.y,
        vx: 0,
        vy: 20,
        value: 30,
        radius: 8,
        pulseTimer: 0,
      });
    }

    this.checkKillAchievements();
  }

  private updateBullets(dt: number) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Bullet trail spark
      if (b.isPlayer && Math.random() < 0.4) {
        this.particles.push({
          x: b.x,
          y: b.y + 4,
          vx: (Math.random() - 0.5) * 15,
          vy: 20,
          size: 2,
          color: b.trailColor || b.color,
          alpha: 0.7,
          decay: 5,
        });
      }

      // Out of bounds check
      if (b.y < -30 || b.y > this.height + 30 || b.x < -30 || b.x > this.width + 30) {
        this.bullets.splice(i, 1);
      }
    }
  }

  private updateDrops(dt: number) {
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];
      d.pulseTimer += dt * 3;

      // Magnet attraction towards player
      const dist = Math.hypot(this.player.x - d.x, this.player.y - d.y);
      if (dist < this.stats.magnetRadius) {
        const pull = 1 - dist / this.stats.magnetRadius;
        const speed = 400 * pull + 100;
        const angle = Math.atan2(this.player.y - d.y, this.player.x - d.x);
        d.vx = Math.cos(angle) * speed;
        d.vy = Math.sin(angle) * speed;
      } else {
        // Natural gentle drift downwards
        d.vx *= 0.94;
        d.vy = Math.min(60, d.vy + dt * 40);
      }

      d.x += d.vx * dt;
      d.y += d.vy * dt;

      // Collection check
      if (dist < this.player.radius + d.radius + 6) {
        this.collectDrop(d, i);
      } else if (d.y > this.height + 50) {
        this.drops.splice(i, 1);
      }
    }
  }

  private collectDrop(drop: DropItem, index: number) {
    this.drops.splice(index, 1);

    if (drop.type === 'xp') {
      sound.gem();
      this.gainXP(drop.value);
    } else if (drop.type === 'coin') {
      sound.coin();
      this.coinsThisRun += drop.value;
      this.score += drop.value * 2;
      this.addFloatingText(this.player.x, this.player.y - 20, `+${drop.value} Créditos`, '#fbbf24');
    } else if (drop.type === 'health') {
      sound.coin();
      this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + drop.value);
      this.addFloatingText(this.player.x, this.player.y - 20, `+${drop.value} PV`, '#10b981');
    }
  }

  private gainXP(amount: number) {
    this.xp += amount;
    if (this.xp >= this.xpNeeded) {
      this.xp -= this.xpNeeded;
      this.level++;
      this.xpNeeded = Math.floor(this.xpNeeded * 1.35 + 20);
      this.triggerLevelUp();
    }
  }

  private triggerLevelUp() {
    sound.levelUp();
    this.setState('LEVEL_UP');
    import('./upgrades').then(mod => {
      const options = mod.getRandomUpgradeOptions(3);
      this.callbacks.onLevelUp(options);
    });
  }

  public applyUpgrade(card: UpgradeCard) {
    card.apply(this.stats, this);
    this.setState('PLAYING');
    this.addFloatingText(this.player.x, this.player.y - 30, `¡MEJORA: ${card.title.toUpperCase()}!`, '#38bdf8');
  }

  private checkCollisions() {
    // 1. Player bullets vs Enemies
    for (let bi = this.bullets.length - 1; bi >= 0; bi--) {
      const b = this.bullets[bi];
      if (!b.isPlayer) continue;

      for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
        const e = this.enemies[ei];
        const dist = Math.hypot(b.x - e.x, b.y - e.y);

        if (dist < b.radius + e.radius) {
          e.hp -= b.damage;
          e.hitFlashTimer = 0.08;
          sound.hit();

          // Spawn hit spark
          for (let p = 0; p < 4; p++) {
            this.particles.push({
              x: b.x,
              y: b.y,
              vx: (Math.random() - 0.5) * 120,
              vy: (Math.random() - 0.5) * 120,
              size: 2,
              color: b.color,
              alpha: 0.9,
              decay: 4.5,
            });
          }

          // Pierce logic
          if (b.pierce > 0) {
            b.pierce--;
          } else {
            this.bullets.splice(bi, 1);
            break;
          }
        }
      }
    }

    // 2. Enemy bullets vs Player
    if (this.player.dashTimer <= 0 && this.player.invincibleTimer <= 0) {
      for (let bi = this.bullets.length - 1; bi >= 0; bi--) {
        const b = this.bullets[bi];
        if (b.isPlayer) continue;

        const dist = Math.hypot(b.x - this.player.x, b.y - this.player.y);
        if (dist < b.radius + this.player.radius) {
          this.bullets.splice(bi, 1);
          this.damagePlayer(b.damage);
          break;
        }
      }

      // 3. Enemy body collision vs Player
      for (const e of this.enemies) {
        const dist = Math.hypot(e.x - this.player.x, e.y - this.player.y);
        if (dist < e.radius + this.player.radius) {
          this.damagePlayer(e.type === 'kamikaze' ? 45 : 25);
          if (e.type === 'kamikaze') {
            e.hp = 0; // Detonates on impact
          }
          break;
        }
      }
    }
  }

  private damagePlayer(amount: number) {
    if (this.player.dashTimer > 0 || this.player.invincibleTimer > 0) return;

    sound.hit();
    this.shakeMagnitude = 10;
    this.player.invincibleTimer = 0.6; // 600ms invulnerability frames

    // Shield absorption first
    if (this.stats.shieldCurrent > 0) {
      if (this.stats.shieldCurrent >= amount) {
        this.stats.shieldCurrent -= amount;
        amount = 0;
      } else {
        amount -= this.stats.shieldCurrent;
        this.stats.shieldCurrent = 0;
      }
    }

    if (amount > 0) {
      this.stats.hp -= amount;
      this.addFloatingText(this.player.x, this.player.y - 20, `-${Math.round(amount)}`, '#ef4444');
    }

    if (this.stats.hp <= 0) {
      this.stats.hp = 0;
      this.handlePlayerDeath();
    }
  }

  private handlePlayerDeath() {
    sound.gameOver();
    sound.stopAmbientTrack();
    this.setState('GAME_OVER');

    // Huge explosion
    for (let i = 0; i < 50; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 260;
      this.particles.push({
        x: this.player.x,
        y: this.player.y,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        size: Math.random() * 5 + 2,
        color: this.currentShip.color,
        alpha: 1,
        decay: 2,
      });
    }

    // Save Highscore & Coins
    const saveData = loadSaveData();
    const isNewHigh = saveData.highScores.length === 0 || this.score > saveData.highScores[0].score;
    saveData.coins += this.coinsThisRun;

    saveData.highScores.push({
      score: this.score,
      wave: this.wave,
      timeSurvived: Math.floor(this.timeSurvived),
      kills: this.kills,
      date: new Date().toLocaleDateString(),
      shipId: this.currentShip.id,
    });
    saveData.highScores.sort((a, b) => b.score - a.score);
    saveData.highScores = saveData.highScores.slice(0, 5);

    saveGameData(saveData);

    this.callbacks.onGameOver({
      score: this.score,
      wave: this.wave,
      kills: this.kills,
      coinsEarned: this.coinsThisRun,
      timeSurvived: Math.floor(this.timeSurvived),
      isNewHighScore: isNewHigh,
    });
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha -= p.decay * dt;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateFloatingTexts(dt: number) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y += t.vy * dt;
      t.alpha -= dt * 1.5;
      if (t.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private addFloatingText(x: number, y: number, text: string, color: string) {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      alpha: 1,
      vy: -55,
      scale: 1,
    });
  }

  private checkKillAchievements() {
    const saveData = loadSaveData();
    let updated = false;

    if (this.kills >= 1 && !saveData.achievements.find(a => a.id === 'first_blood')?.unlocked) {
      this.unlockAchievement('first_blood', saveData);
      updated = true;
    }
    if (this.kills >= 50 && !saveData.achievements.find(a => a.id === 'kills_50')?.unlocked) {
      this.unlockAchievement('kills_50', saveData);
      updated = true;
    }
    if (saveData.coins + this.coinsThisRun >= 1000 && !saveData.achievements.find(a => a.id === 'coin_hoarder')?.unlocked) {
      this.unlockAchievement('coin_hoarder', saveData);
      updated = true;
    }

    if (updated) saveGameData(saveData);
  }

  private checkWaveAchievements() {
    const saveData = loadSaveData();
    let updated = false;

    if (this.wave >= 5 && !saveData.achievements.find(a => a.id === 'wave_5')?.unlocked) {
      this.unlockAchievement('wave_5', saveData);
      updated = true;
    }
    if (this.wave >= 10 && !saveData.achievements.find(a => a.id === 'wave_10')?.unlocked) {
      this.unlockAchievement('wave_10', saveData);
      updated = true;
    }
    if (this.level >= 10 && !saveData.achievements.find(a => a.id === 'level_10')?.unlocked) {
      this.unlockAchievement('level_10', saveData);
      updated = true;
    }

    if (updated) saveGameData(saveData);
  }

  private unlockAchievement(id: string, saveData: any) {
    const ach = saveData.achievements.find((a: any) => a.id === id);
    if (ach && !ach.unlocked) {
      ach.unlocked = true;
      saveData.coins += ach.rewardCoins;
      sound.levelUp();
      this.callbacks.onAchievementUnlocked(ach.title);
    }
  }

  private dispatchHUDUpdate() {
    const activeBoss = this.enemies.find(e => e.type === 'boss');
    this.callbacks.onHUDUpdate({
      hp: Math.max(0, this.stats.hp),
      maxHp: this.stats.maxHp,
      shield: Math.max(0, this.stats.shieldCurrent),
      maxShield: this.stats.shieldMax,
      xp: this.xp,
      xpNeeded: this.xpNeeded,
      level: this.level,
      score: this.score,
      coinsThisRun: this.coinsThisRun,
      wave: this.wave,
      dashReady: this.player.dashCooldown <= 0,
      dashCooldownPct: this.player.dashCooldown > 0 ? this.player.dashCooldown / this.player.dashMaxCooldown : 0,
      specialReady: this.player.specialCooldown <= 0,
      specialCooldownPct: this.player.specialCooldown > 0 ? this.player.specialCooldown / this.player.specialMaxCooldown : 0,
      bossActive: !!activeBoss,
      bossHpPct: activeBoss ? Math.max(0, activeBoss.hp / activeBoss.maxHp) : 0,
      bossName: activeBoss ? activeBoss.name : '',
      weather: this.weather ? this.weather.getWeatherInfo() : {
        type: 'CLEAR',
        name: 'Espacio Despejado',
        subname: 'Vuelo Nocturno Estable',
        icon: 'sparkles',
        color: '#38bdf8',
        description: 'Condiciones atmosféricas ideales.',
      },
    });
  }

  // --- Rendering Pipeline ---

  private render() {
    const ctx = this.ctx;
    ctx.save();

    // Clear background
    ctx.fillStyle = '#030712'; // deep slate 950
    ctx.fillRect(0, 0, this.width, this.height);

    // Apply Screen Shake
    if (this.shakeMagnitude > 0) {
      const offsetX = (Math.random() - 0.5) * this.shakeMagnitude;
      const offsetY = (Math.random() - 0.5) * this.shakeMagnitude;
      ctx.translate(offsetX, offsetY);
    }

    // Render Weather Background (Nebula cosmic gas clouds & storm skies)
    if (this.weather) {
      this.weather.renderBackground(ctx, this.width, this.height);
    }

    // Render Starfield Parallax
    this.renderStars(ctx);

    // Render Collectible Drops
    this.renderDrops(ctx);

    // Render Enemies
    this.renderEnemies(ctx);

    // Render Bullets
    this.renderBullets(ctx);

    // Render Player & Afterimages
    this.renderPlayer(ctx);

    // Render Weather Foreground (Rain streaks, splash ripples, lightning, electric sparks, cosmic dust)
    if (this.weather) {
      this.weather.renderForeground(ctx, this.width, this.height);
    }

    // Render Particle Systems
    this.renderParticles(ctx);

    // Render Floating Text
    this.renderFloatingTexts(ctx);

    ctx.restore();
  }

  private renderStars(ctx: CanvasRenderingContext2D) {
    for (const star of this.stars) {
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.alpha;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1;
  }

  private renderPlayer(ctx: CanvasRenderingContext2D) {
    // Render Dash Afterimages
    for (const img of this.player.afterimages) {
      ctx.save();
      ctx.translate(img.x, img.y);
      ctx.rotate(img.angle);
      ctx.globalAlpha = img.alpha * 0.4;
      drawPlayerPlane(
        ctx,
        this.currentShip.id,
        this.currentShip.color,
        this.currentShip.accentColor,
        true,
        this.lastTime * 0.001,
        img.angle,
        this.player.dashTimer > 0
      );
      ctx.restore();
    }

    // Render Player Vessel
    ctx.save();
    ctx.translate(this.player.x, this.player.y);
    ctx.rotate(this.player.bankAngle);

    // Blink if invincible
    if (this.player.invincibleTimer > 0 && Math.floor(this.player.invincibleTimer * 20) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    drawPlayerPlane(
      ctx,
      this.currentShip.id,
      this.currentShip.color,
      this.currentShip.accentColor,
      false,
      this.lastTime * 0.001,
      this.player.bankAngle,
      this.player.dashTimer > 0
    );
    ctx.restore();

    // Render Energy Shield Bubble
    if (this.stats.shieldCurrent > 0) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(this.player.x, this.player.y, this.player.radius + 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Render Plasma Aura Ring
    if (this.stats.hasPlasmaAura) {
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.lineDashOffset = -this.player.auraPulse * 15;
      ctx.beginPath();
      ctx.arc(this.player.x, this.player.y, this.stats.plasmaAuraRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Render Orbital Escort Drones
    if (this.stats.hasOrbitalDrone) {
      const droneCount = this.stats.orbitalDroneCount;
      for (let i = 0; i < droneCount; i++) {
        const droneAngle = this.player.orbitalAngle + (i / droneCount) * Math.PI * 2;
        const dx = this.player.x + Math.cos(droneAngle) * 55;
        const dy = this.player.y + Math.sin(droneAngle) * 55;

        ctx.save();
        ctx.translate(dx, dy);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  private renderEnemies(ctx: CanvasRenderingContext2D) {
    for (const e of this.enemies) {
      drawEnemyAircraft(ctx, e, this.lastTime * 0.001);
    }
  }

  private renderBullets(ctx: CanvasRenderingContext2D) {
    for (const b of this.bullets) {
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private renderDrops(ctx: CanvasRenderingContext2D) {
    for (const d of this.drops) {
      ctx.save();
      ctx.translate(d.x, d.y);
      const scale = 1 + Math.sin(d.pulseTimer) * 0.15;
      ctx.scale(scale, scale);

      if (dropIsXP(d)) {
        // Diamond crystal
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(0, -d.radius);
        ctx.lineTo(d.radius, 0);
        ctx.lineTo(0, d.radius);
        ctx.lineTo(-d.radius, 0);
        ctx.closePath();
        ctx.fill();
      } else if (d.type === 'coin') {
        // Golden Coin
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, d.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 1);
      } else if (d.type === 'health') {
        // Medical cross
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#059669';
        ctx.shadowBlur = 10;
        ctx.fillRect(-2, -6, 4, 12);
        ctx.fillRect(-6, -2, 12, 4);
      }

      ctx.restore();
    }
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  private renderFloatingTexts(ctx: CanvasRenderingContext2D) {
    for (const t of this.floatingTexts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, t.alpha);
      ctx.fillStyle = t.color;
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
}

function dropIsXP(d: DropItem): boolean {
  return d.type === 'xp';
}
