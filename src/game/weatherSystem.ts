import { WeatherType, WeatherState } from './types';
import { sound } from './audio';

export interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  width: number;
  alpha: number;
}

export interface RainSplash {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export interface ElectricSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  phase: number;
}

export interface LightningBolt {
  segments: Array<{ x1: number; y1: number; x2: number; y2: number; width: number }>;
  alpha: number;
  color: string;
}

export interface NebulaCloud {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  phase: number;
}

export interface CosmicDustMote {
  x: number;
  y: number;
  size: number;
  color: string;
  vy: number;
  vx: number;
  alpha: number;
  phase: number;
}

export const WEATHER_CONFIGS: Record<WeatherType, WeatherState> = {
  CLEAR: {
    type: 'CLEAR',
    name: 'Espacio Despejado',
    subname: 'Vuelo Nocturno Estable',
    icon: 'sparkles',
    color: '#38bdf8',
    description: 'Condiciones atmosféricas ideales. Visibilidad espacial máxima.',
  },
  RAIN: {
    type: 'RAIN',
    name: 'Lluvia de Iones',
    subname: 'Precipitación Hipersónica',
    icon: 'cloud-rain',
    color: '#06b6d4',
    description: 'Torrentes de lluvia iónica cargada con estelas de viento y salpicaduras.',
  },
  STORM: {
    type: 'STORM',
    name: 'Tormenta Eléctrica',
    subname: 'Tempestad Electromagnética',
    icon: 'cloud-lightning',
    color: '#a855f7',
    description: 'Rayos ramificados de plasma con truenos atmosféricos y chispas ionizadas.',
  },
  NEBULA: {
    type: 'NEBULA',
    name: 'Nebulosa Cósmica',
    subname: 'Nube de Gas y Plasma Estelar',
    icon: 'orbit',
    color: '#ec4899',
    description: 'Volúmenes densos de gas interestelar con motas de polvo estelar radiante.',
  },
};

export class WeatherSystem {
  public currentWeather: WeatherType = 'CLEAR';
  public targetWeather: WeatherType = 'CLEAR';
  public transitionAlpha: number = 1.0;
  public weatherBannerTimer: number = 0;
  public bannerText: string = '';

  // Rain particle pool
  private rainDrops: RainDrop[] = [];
  private rainSplashes: RainSplash[] = [];

  // Storm particle & lightning system
  private electricSparks: ElectricSpark[] = [];
  private activeLightning: LightningBolt | null = null;
  private lightningTimer: number = 3.5;
  private screenFlashAlpha: number = 0;
  private cloudScrollOffset: number = 0;

  // Nebula system
  private nebulaClouds: NebulaCloud[] = [];
  private dustMotes: CosmicDustMote[] = [];

  constructor(width: number = 800, height: number = 600) {
    this.initParticles(width, height);
  }

  public initParticles(width: number, height: number) {
    // 1. Rain Drops (110 pooled drops)
    this.rainDrops = [];
    for (let i = 0; i < 110; i++) {
      this.rainDrops.push({
        x: Math.random() * (width + 100) - 50,
        y: Math.random() * height,
        speed: 700 + Math.random() * 450,
        length: 14 + Math.random() * 18,
        width: Math.random() < 0.2 ? 2.0 : 1.2,
        alpha: 0.35 + Math.random() * 0.55,
      });
    }

    // 2. Electric Sparks (45 sparks)
    this.electricSparks = [];
    for (let i = 0; i < 45; i++) {
      this.electricSparks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 60,
        vy: 20 + Math.random() * 50,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.3 + Math.random() * 0.7,
        pulseSpeed: 4 + Math.random() * 6,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 3. Volumetric Nebula Clouds (16 persistent gas centers)
    this.nebulaClouds = [];
    const colors = [
      'rgba(236, 72, 153, ',  // Magenta
      'rgba(168, 85, 247, ',  // Purple
      'rgba(6, 182, 212, ',   // Cyan
      'rgba(59, 130, 246, ',   // Deep Blue
      'rgba(245, 158, 11, ',   // Amber
    ];
    for (let i = 0; i < 16; i++) {
      this.nebulaClouds.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 120 + Math.random() * 180,
        color: colors[i % colors.length],
        vx: (Math.random() - 0.5) * 15,
        vy: 12 + Math.random() * 20,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // 4. Cosmic Dust Motes (50 glowing embers)
    this.dustMotes = [];
    const dustColors = ['#f472b6', '#c084fc', '#38bdf8', '#fef08a'];
    for (let i = 0; i < 50; i++) {
      this.dustMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1.5 + Math.random() * 2.5,
        color: dustColors[Math.floor(Math.random() * dustColors.length)],
        vy: 15 + Math.random() * 30,
        vx: (Math.random() - 0.5) * 20,
        alpha: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  public setWaveWeather(wave: number, forcedType?: WeatherType) {
    if (forcedType) {
      this.targetWeather = forcedType;
    } else {
      // Atmospheric rotation based on wave progression:
      // Wave 1: Clear (flight training)
      // Wave 2: Hypersonic Ion Rain
      // Wave 3: Cosmic Nebula
      // Wave 4: Lightning Storm
      // Wave 5: Epic Lightning Storm (Boss encounter)
      // Wave 6+: Dynamic rotation with storm/nebula variations
      if (wave === 1) {
        this.targetWeather = 'CLEAR';
      } else if (wave === 2) {
        this.targetWeather = 'RAIN';
      } else if (wave === 3) {
        this.targetWeather = 'NEBULA';
      } else if (wave === 4 || wave === 5) {
        this.targetWeather = 'STORM';
      } else {
        const pool: WeatherType[] = ['CLEAR', 'RAIN', 'STORM', 'NEBULA'];
        // Boss waves prefer Storm or Nebula
        if (wave % 5 === 0) {
          this.targetWeather = Math.random() < 0.6 ? 'STORM' : 'NEBULA';
        } else {
          // Pick a different weather from current
          const options = pool.filter(w => w !== this.currentWeather);
          this.targetWeather = options[Math.floor(Math.random() * options.length)];
        }
      }
    }

    if (this.targetWeather !== this.currentWeather) {
      this.currentWeather = this.targetWeather;
      const info = WEATHER_CONFIGS[this.currentWeather];
      this.bannerText = `ALERTA METEOROLÓGICA: ${info.name.toUpperCase()}`;
      this.weatherBannerTimer = 3.5; // Show toast for 3.5s

      // Ambient audio cue on weather shift
      if (this.currentWeather === 'STORM') {
        sound.thunder();
      } else if (this.currentWeather === 'RAIN') {
        sound.electricZap();
      }
    }
  }

  public getWeatherInfo(): WeatherState {
    return WEATHER_CONFIGS[this.currentWeather];
  }

  public update(
    dt: number,
    width: number,
    height: number,
    playerX: number,
    playerY: number,
    playerVx: number
  ) {
    // Weather banner auto-dismiss
    if (this.weatherBannerTimer > 0) {
      this.weatherBannerTimer -= dt;
    }

    // Screen flash decay from lightning
    if (this.screenFlashAlpha > 0) {
      this.screenFlashAlpha = Math.max(0, this.screenFlashAlpha - dt * 2.8);
    }

    // Cloud scroll offset
    this.cloudScrollOffset = (this.cloudScrollOffset + dt * 20) % width;

    // --- 1. Rain Updates ---
    if (this.currentWeather === 'RAIN' || this.currentWeather === 'STORM') {
      // Wind tilt proportional to player motion
      const windOffset = -playerVx * 0.12 - 40; // slight left slant

      for (const drop of this.rainDrops) {
        drop.y += drop.speed * dt;
        drop.x += windOffset * dt;

        // Reset if off bottom or sides
        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * (width + 100) - 50;

          // Spawn splash ripple with 25% chance
          if (Math.random() < 0.25) {
            this.spawnSplash(drop.x, height - 4);
          }
        }

        // Check collision with player canopy/wings to create splash
        const distToPlayer = Math.hypot(drop.x - playerX, drop.y - playerY);
        if (distToPlayer < 24 && Math.random() < 0.2) {
          this.spawnSplash(drop.x, drop.y);
        }
      }

      // Update splashes
      for (let i = this.rainSplashes.length - 1; i >= 0; i--) {
        const s = this.rainSplashes[i];
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.alpha -= dt * 4.5;
        if (s.alpha <= 0) {
          this.rainSplashes.splice(i, 1);
        }
      }
    }

    // --- 2. Storm & Lightning Updates ---
    if (this.currentWeather === 'STORM') {
      this.lightningTimer -= dt;
      if (this.lightningTimer <= 0) {
        this.triggerLightningStrike(width, height);
        this.lightningTimer = 3.2 + Math.random() * 4.5; // Next strike in 3-7s
      }

      // Fade active lightning
      if (this.activeLightning) {
        this.activeLightning.alpha -= dt * 3.5;
        if (this.activeLightning.alpha <= 0) {
          this.activeLightning = null;
        }
      }

      // Update electric sparks
      for (const sp of this.electricSparks) {
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.phase += dt * sp.pulseSpeed;

        if (sp.y > height + 20) {
          sp.y = -10;
          sp.x = Math.random() * width;
        }
        if (sp.x < -20) sp.x = width + 10;
        if (sp.x > width + 20) sp.x = -10;
      }
    }

    // --- 3. Cosmic Nebula Updates ---
    if (this.currentWeather === 'NEBULA') {
      // Drift gas clouds
      for (const cloud of this.nebulaClouds) {
        cloud.x += cloud.vx * dt;
        cloud.y += cloud.vy * dt;
        cloud.phase += dt * 0.4;

        if (cloud.y > height + cloud.radius) {
          cloud.y = -cloud.radius;
          cloud.x = Math.random() * width;
        }
      }

      // Drift dust motes
      for (const mote of this.dustMotes) {
        mote.x += mote.vx * dt;
        mote.y += mote.vy * dt;
        mote.phase += dt * 2.5;

        if (mote.y > height + 10) {
          mote.y = -10;
          mote.x = Math.random() * width;
        }
      }
    }
  }

  private spawnSplash(x: number, y: number) {
    if (this.rainSplashes.length > 35) return; // Pool limit
    for (let i = 0; i < 3; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const speed = 40 + Math.random() * 80;
      this.rainSplashes.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 2,
        alpha: 0.8,
      });
    }
  }

  private triggerLightningStrike(width: number, height: number) {
    sound.thunder();
    this.screenFlashAlpha = 0.45; // Flash screen

    // Generate procedural branching lightning path
    const startX = width * 0.15 + Math.random() * (width * 0.7);
    const startY = 0;
    const segments: Array<{ x1: number; y1: number; x2: number; y2: number; width: number }> = [];

    let currentX = startX;
    let currentY = startY;
    const targetY = height * 0.65 + Math.random() * (height * 0.3);
    const steps = 10;
    const dy = targetY / steps;

    for (let i = 0; i < steps; i++) {
      const nextY = currentY + dy;
      const nextX = currentX + (Math.random() - 0.5) * 70;
      const thickness = Math.max(1.5, 4.0 - (i / steps) * 2.5);

      segments.push({
        x1: currentX,
        y1: currentY,
        x2: nextX,
        y2: nextY,
        width: thickness,
      });

      // 40% chance of a secondary fork branch
      if (Math.random() < 0.45 && i > 2) {
        const branchX = nextX + (Math.random() - 0.5) * 90;
        const branchY = nextY + dy * 0.8;
        segments.push({
          x1: nextX,
          y1: nextY,
          x2: branchX,
          y2: branchY,
          width: thickness * 0.6,
        });
      }

      currentX = nextX;
      currentY = nextY;
    }

    this.activeLightning = {
      segments,
      alpha: 1.0,
      color: '#ffffff',
    };
  }

  // --- RENDERING PIPELINE ---

  /**
   * Background Layer: Renders BEFORE stars, bullets and aircraft
   * (Cosmic nebula clouds & atmospheric turbulence shading)
   */
  public renderBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // 1. Nebula Cosmic Cloud Gas Volumes
    if (this.currentWeather === 'NEBULA') {
      ctx.save();
      for (const cloud of this.nebulaClouds) {
        const pulse = 1 + Math.sin(cloud.phase) * 0.12;
        const r = cloud.radius * pulse;

        const grad = ctx.createRadialGradient(cloud.x, cloud.y, 10, cloud.x, cloud.y, r);
        grad.addColorStop(0, cloud.color + '0.18)');
        grad.addColorStop(0.5, cloud.color + '0.08)');
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Storm Atmospheric Gradient Shading at Top
    if (this.currentWeather === 'STORM') {
      ctx.save();
      const stormGrad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
      stormGrad.addColorStop(0, 'rgba(46, 16, 101, 0.45)'); // Dark storm violet
      stormGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.25)');
      stormGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = stormGrad;
      ctx.fillRect(0, 0, width, height * 0.5);
      ctx.restore();
    }
  }

  /**
   * Foreground Layer: Renders AFTER aircraft and bullets
   * (Rain streaks, splash ripples, electric sparks, lightning bolts, screen flash)
   */
  public renderForeground(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // 1. Cosmic Dust Motes (Nebula)
    if (this.currentWeather === 'NEBULA') {
      ctx.save();
      for (const mote of this.dustMotes) {
        const alphaPulse = mote.alpha * (0.6 + Math.sin(mote.phase) * 0.4);
        ctx.fillStyle = mote.color;
        ctx.shadowColor = mote.color;
        ctx.shadowBlur = 8;
        ctx.globalAlpha = Math.max(0, alphaPulse);

        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Ion Rain Streaks & Splashes
    if (this.currentWeather === 'RAIN' || this.currentWeather === 'STORM') {
      ctx.save();
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = this.currentWeather === 'STORM' ? '#c084fc' : '#38bdf8';
      ctx.shadowColor = this.currentWeather === 'STORM' ? '#a855f7' : '#06b6d4';
      ctx.shadowBlur = 4;

      ctx.beginPath();
      for (const drop of this.rainDrops) {
        ctx.globalAlpha = drop.alpha;
        ctx.lineWidth = drop.width;
        // Slanted rain vector
        const angle = Math.PI * 0.56; // ~100 degrees slanting downwards
        const x2 = drop.x + Math.cos(angle) * drop.length;
        const y2 = drop.y + Math.sin(angle) * drop.length;

        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();

      // Draw splashes
      for (const sp of this.rainSplashes) {
        ctx.fillStyle = this.currentWeather === 'STORM' ? '#e9d5ff' : '#bae6fd';
        ctx.globalAlpha = Math.max(0, sp.alpha);
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. Electric Sparks (Storm)
    if (this.currentWeather === 'STORM') {
      ctx.save();
      for (const sp of this.electricSparks) {
        const pulse = 0.5 + Math.sin(sp.phase) * 0.5;
        ctx.fillStyle = pulse > 0.4 ? '#ffffff' : '#c084fc';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 6;
        ctx.globalAlpha = sp.alpha * pulse;

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 4. Procedural Branching Lightning Bolt
      if (this.activeLightning) {
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 16;
        ctx.globalAlpha = Math.max(0, this.activeLightning.alpha);
        ctx.lineCap = 'round';

        ctx.beginPath();
        for (const seg of this.activeLightning.segments) {
          ctx.lineWidth = seg.width;
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();

        // Secondary cyan aura stroke
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // 5. Screen Ambient Lightning Illumination Flash
      if (this.screenFlashAlpha > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(216, 180, 254, ${this.screenFlashAlpha * 0.4})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }
    }

    // 6. Atmospheric Weather Alert Banner Toast (In-Canvas Notification)
    if (this.weatherBannerTimer > 0) {
      ctx.save();
      const alpha = Math.min(1, this.weatherBannerTimer);
      ctx.globalAlpha = alpha;

      const info = WEATHER_CONFIGS[this.currentWeather];
      const boxW = 280;
      const boxH = 34;
      const boxX = (width - boxW) / 2;
      const boxY = 70;

      // Pill backdrop
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = info.color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();

      // Weather icon dot
      ctx.fillStyle = info.color;
      ctx.shadowColor = info.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(boxX + 18, boxY + boxH / 2, 4, 0, Math.PI * 2);
      ctx.fill();

      // Text
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.bannerText, boxX + 32, boxY + boxH / 2);

      ctx.restore();
    }
  }
}
