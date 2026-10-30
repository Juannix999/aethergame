import { ShipId } from './types';
import { Enemy } from './engine';

/**
 * Procedural military & sci-fi combat aircraft vector renderer
 * Renders authentic fighter jets, stealth bombers, and heavy gunships with:
 * - Delta/swept wings, ailerons, wingtip missile rails
 * - Cockpit canopies with specular glass glints
 * - Twin canted vertical tail fins / stabilizers
 * - Animated afterburner jet exhaust flames with shock diamonds
 * - FAA-compliant military navigation lights (Red port, Green/Cyan starboard, flashing white tail strobe)
 */

export function drawPlayerPlane(
  ctx: CanvasRenderingContext2D,
  shipId: ShipId,
  baseColor: string,
  accentColor: string,
  isGhostTrail: boolean,
  animTime: number,
  bankAngle: number,
  isDashing: boolean
) {
  ctx.save();

  // If dashing or afterimage, adjust alpha
  if (isGhostTrail) {
    ctx.globalAlpha *= 0.5;
  }

  // Draw Animated Jet Afterburner Exhausts (underneath the aircraft)
  if (!isGhostTrail) {
    drawJetExhaust(ctx, shipId, animTime, isDashing);
  }

  // Draw Specific Aircraft Model
  switch (shipId) {
    case 'valkyrie':
      drawValkyrieFighter(ctx, baseColor, accentColor, isGhostTrail, animTime, bankAngle);
      break;
    case 'ghost':
      drawGhostStealthWing(ctx, baseColor, accentColor, isGhostTrail, animTime, bankAngle);
      break;
    case 'titan':
      drawTitanGunship(ctx, baseColor, accentColor, isGhostTrail, animTime, bankAngle);
      break;
    default:
      drawValkyrieFighter(ctx, baseColor, accentColor, isGhostTrail, animTime, bankAngle);
  }

  // Aircraft Navigation Strobe Lights (Port Red, Starboard Cyan/Green, Spine White)
  if (!isGhostTrail) {
    drawNavLights(ctx, shipId, animTime);
  }

  ctx.restore();
}

/**
 * 1. VALKYRIE MK.II — Air Superiority 5th-Gen Jet Fighter (F-22 / Typhoon inspired)
 */
function drawValkyrieFighter(
  ctx: CanvasRenderingContext2D,
  baseColor: string,
  accentColor: string,
  isGhost: boolean,
  _animTime: number,
  bankAngle: number
) {
  // Wing perspective foreshortening based on bank tilt
  const roll = Math.max(-0.4, Math.min(0.4, bankAngle));
  const leftWingScale = 1 - roll * 0.4;
  const rightWingScale = 1 + roll * 0.4;

  ctx.save();
  ctx.shadowColor = isGhost ? 'transparent' : baseColor;
  ctx.shadowBlur = isGhost ? 0 : 8;

  // --- Wingtip Missiles (Underneath / Rails) ---
  ctx.fillStyle = '#e2e8f0';
  // Left missile
  ctx.fillRect(-22 * leftWingScale - 1.5, 4, 3, 16);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-22 * leftWingScale - 1.5, 2, 3, 3); // red seeker head

  // Right missile
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(22 * rightWingScale - 1.5, 4, 3, 16);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(22 * rightWingScale - 1.5, 2, 3, 3);

  // --- Main Airframe & Swept Delta Wings ---
  ctx.fillStyle = '#0f172a'; // Deep slate base fuselage
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  // Nose radome & pitot tube
  ctx.moveTo(0, -28);
  // Right nose chine
  ctx.lineTo(4, -14);
  // Right air intake ledge
  ctx.lineTo(8, -4);
  // Right swept wing leading edge to wingtip
  ctx.lineTo(22 * rightWingScale, 10);
  // Right wingtip trailing edge
  ctx.lineTo(20 * rightWingScale, 16);
  // Right aileron wing root
  ctx.lineTo(9, 14);
  // Right twin engine housing
  ctx.lineTo(6, 22);
  // Engine center nozzle gap
  ctx.lineTo(0, 18);
  // Left twin engine housing
  ctx.lineTo(-6, 22);
  // Left aileron wing root
  ctx.lineTo(-9, 14);
  // Left wingtip trailing edge
  ctx.lineTo(-20 * leftWingScale, 16);
  // Left swept wing leading edge
  ctx.lineTo(-22 * leftWingScale, 10);
  // Left air intake ledge
  ctx.lineTo(-8, -4);
  // Left nose chine
  ctx.lineTo(-4, -14);
  ctx.closePath();

  ctx.fillStyle = baseColor;
  ctx.fill();
  ctx.stroke();

  // --- Fuselage Top Armor Panels & Spine Camo Trim ---
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.moveTo(0, -26);
  ctx.lineTo(3, -12);
  ctx.lineTo(4, 12);
  ctx.lineTo(-4, 12);
  ctx.lineTo(-3, -12);
  ctx.closePath();
  ctx.fill();

  // Air Intakes (Dark recessed scoops on flanks)
  ctx.fillStyle = '#020617';
  ctx.fillRect(-8, -3, 3, 8);
  ctx.fillRect(5, -3, 3, 8);

  // --- Twin Canted Vertical Stabilizers / Tail Fins ---
  ctx.fillStyle = '#38bdf8';
  // Left vertical rudder
  ctx.beginPath();
  ctx.moveTo(-7, 8);
  ctx.lineTo(-12, 19);
  ctx.lineTo(-7, 21);
  ctx.closePath();
  ctx.fill();

  // Right vertical rudder
  ctx.beginPath();
  ctx.moveTo(7, 8);
  ctx.lineTo(12, 19);
  ctx.lineTo(7, 21);
  ctx.closePath();
  ctx.fill();

  // Aileron / Wing Flap panel lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-16 * leftWingScale, 12);
  ctx.lineTo(-10, 12);
  ctx.moveTo(16 * rightWingScale, 12);
  ctx.lineTo(10, 12);
  ctx.stroke();

  // --- Fighter Cockpit Bubble Canopy ---
  if (!isGhost) {
    // Canopy shadow base
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.ellipse(0, -5, 3.5, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Specular glass sun glare
    const glareGrad = ctx.createLinearGradient(-2, -12, 2, 2);
    glareGrad.addColorStop(0, '#ffffff');
    glareGrad.addColorStop(0.3, '#7dd3fc');
    glareGrad.addColorStop(0.8, '#0284c7');
    glareGrad.addColorStop(1, '#0c4a6e');

    ctx.fillStyle = glareGrad;
    ctx.beginPath();
    ctx.ellipse(0, -5, 2.5, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Canopy frame divider
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-2, -3);
    ctx.lineTo(2, -3);
    ctx.stroke();

    // Pitot probe nose needle
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(0, -34);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * 2. GHOST SHADOW — Stealth Flying-Wing Interceptor (B-2 Spirit / F-117 inspired)
 */
function drawGhostStealthWing(
  ctx: CanvasRenderingContext2D,
  baseColor: string,
  accentColor: string,
  isGhost: boolean,
  _animTime: number,
  bankAngle: number
) {
  const roll = Math.max(-0.4, Math.min(0.4, bankAngle));
  const leftWingScale = 1 - roll * 0.4;
  const rightWingScale = 1 + roll * 0.4;

  ctx.save();
  ctx.shadowColor = isGhost ? 'transparent' : baseColor;
  ctx.shadowBlur = isGhost ? 0 : 8;

  // --- Faceted Stealth Flying Wing Polygon ---
  ctx.fillStyle = '#1e1b4b'; // Deep stealth composite
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  // Razor sharp stealth nose
  ctx.moveTo(0, -22);
  // Right leading edge sweep
  ctx.lineTo(26 * rightWingScale, 6);
  // Right wingtip bevel
  ctx.lineTo(25 * rightWingScale, 11);
  // Sawtooth trailing edge notch 1 (Characteristic B-2 / stealth edge)
  ctx.lineTo(16 * rightWingScale, 9);
  ctx.lineTo(10, 16);
  // Center exhaust notch
  ctx.lineTo(4, 13);
  ctx.lineTo(0, 17);
  ctx.lineTo(-4, 13);
  // Left sawtooth trailing edge
  ctx.lineTo(-10, 16);
  ctx.lineTo(-16 * leftWingScale, 9);
  // Left wingtip bevel
  ctx.lineTo(-25 * leftWingScale, 11);
  // Left leading edge sweep
  ctx.lineTo(-26 * leftWingScale, 6);
  ctx.closePath();

  ctx.fillStyle = baseColor;
  ctx.fill();
  ctx.stroke();

  // Stealth Top Facet lines (Geometric radar-deflecting faceted angles)
  ctx.strokeStyle = 'rgba(216, 180, 254, 0.5)'; // Soft purple grid lines
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  // Nose ridge
  ctx.moveTo(0, -22);
  ctx.lineTo(0, 12);
  // Left facet
  ctx.moveTo(0, -10);
  ctx.lineTo(-16 * leftWingScale, 8);
  // Right facet
  ctx.moveTo(0, -10);
  ctx.lineTo(16 * rightWingScale, 8);
  ctx.stroke();

  // Recessed Stealth Intakes
  ctx.fillStyle = '#0f0728';
  ctx.beginPath();
  ctx.moveTo(-6, -2);
  ctx.lineTo(-3, -2);
  ctx.lineTo(-4, 6);
  ctx.lineTo(-7, 6);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(6, -2);
  ctx.lineTo(3, -2);
  ctx.lineTo(4, 6);
  ctx.lineTo(7, 6);
  ctx.closePath();
  ctx.fill();

  // Angular Faceted Stealth Cockpit
  if (!isGhost) {
    ctx.fillStyle = '#4c1d95';
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(3, -4);
    ctx.lineTo(2, 4);
    ctx.lineTo(-2, 4);
    ctx.lineTo(-3, -4);
    ctx.closePath();
    ctx.fill();

    // Glare facet
    ctx.fillStyle = '#e9d5ff';
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.lineTo(1.5, -5);
    ctx.lineTo(0, 2);
    ctx.lineTo(-1.5, -5);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 3. TITAN JUGGERNAUT — Armored Attack Gunship / Heavy CAS (A-10 Thunderbolt / Gunship inspired)
 */
function drawTitanGunship(
  ctx: CanvasRenderingContext2D,
  baseColor: string,
  accentColor: string,
  isGhost: boolean,
  _animTime: number,
  bankAngle: number
) {
  const roll = Math.max(-0.4, Math.min(0.4, bankAngle));
  const leftWingScale = 1 - roll * 0.35;
  const rightWingScale = 1 + roll * 0.35;

  ctx.save();
  ctx.shadowColor = isGhost ? 'transparent' : baseColor;
  ctx.shadowBlur = isGhost ? 0 : 8;

  // --- Wing Pylons: Dual Rocket Pods Under Wings ---
  ctx.fillStyle = '#451a03';
  ctx.fillRect(-17 * leftWingScale - 2, 4, 4, 12);
  ctx.fillRect(17 * rightWingScale - 2, 4, 4, 12);
  // Red rocket tips
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-17 * leftWingScale - 2, 2, 4, 2);
  ctx.fillRect(17 * rightWingScale - 2, 2, 4, 2);

  // --- Main Robust Fuselage & Broad Wings ---
  ctx.fillStyle = '#78350f';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.3;

  ctx.beginPath();
  // Armored rounded nose
  ctx.moveTo(0, -25);
  ctx.lineTo(6, -20);
  ctx.lineTo(7, -8);
  // Right broad straight wing
  ctx.lineTo(24 * rightWingScale, -4);
  ctx.lineTo(24 * rightWingScale, 11);
  ctx.lineTo(8, 12);
  // Tail boom right
  ctx.lineTo(7, 24);
  ctx.lineTo(0, 21);
  // Tail boom left
  ctx.lineTo(-7, 24);
  ctx.lineTo(-8, 12);
  // Left broad straight wing
  ctx.lineTo(-24 * leftWingScale, 11);
  ctx.lineTo(-24 * leftWingScale, -4);
  ctx.lineTo(-7, -8);
  ctx.lineTo(-6, -20);
  ctx.closePath();

  ctx.fillStyle = baseColor;
  ctx.fill();
  ctx.stroke();

  // --- Twin High-Mounted Turbofan Jet Engine Nacelles (A-10 signature look) ---
  ctx.fillStyle = '#1c1917';
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;

  // Left Engine Pod
  ctx.fillRect(-11, 4, 6, 17);
  ctx.strokeRect(-11, 4, 6, 17);
  // Left Turbine Fan intake
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-11, 4, 6, 2);

  // Right Engine Pod
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(5, 4, 6, 17);
  ctx.strokeRect(5, 4, 6, 17);
  // Right Turbine Fan intake
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(5, 4, 6, 2);

  // --- Twin H-Tail Vertical Rudder Fins ---
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-12, 16, 3, 11);
  ctx.fillRect(9, 16, 3, 11);

  // --- Heavy Rotary Gatling Cannon Protruding from Nose (GAU-8 Avenger) ---
  if (!isGhost) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-2, -32, 4, 8);
    // Muzzle brake holes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-1.5, -31, 3, 1.5);
    ctx.fillRect(-1.5, -28, 3, 1.5);

    // Hazard Stripes on Wingtips (Black & Yellow aviation caution markings)
    ctx.fillStyle = '#000000';
    ctx.fillRect(20 * rightWingScale, 0, 2, 8);
    ctx.fillRect(22 * rightWingScale, 2, 2, 8);
    ctx.fillRect(-22 * leftWingScale, 0, 2, 8);
    ctx.fillRect(-20 * leftWingScale, 2, 2, 8);

    // Reinforced Armored Cockpit Canopy (Multi-pane bubble with armored glass)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -13, 8, 12);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-3, -12, 6, 4);
    ctx.fillRect(-3, -6, 6, 4);
    // Armored frame struts
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1;
    ctx.strokeRect(-3.5, -12.5, 7, 11);
  }

  ctx.restore();
}

/**
 * Animated Jet Exhaust & Afterburners (flame plumes + shock diamonds)
 */
function drawJetExhaust(
  ctx: CanvasRenderingContext2D,
  shipId: ShipId,
  animTime: number,
  isDashing: boolean
) {
  const flicker = 0.85 + Math.sin(animTime * 45) * 0.15;
  const flameLength = (isDashing ? 32 : 18) * flicker;

  ctx.save();

  if (shipId === 'valkyrie') {
    // Twin Blue/Cyan Fighter Jet Turbines
    const nozzles = [-4.5, 4.5];
    for (const x of nozzles) {
      // Outer flame plume
      const grad = ctx.createLinearGradient(x, 18, x, 18 + flameLength);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#38bdf8');
      grad.addColorStop(0.7, '#0284c7');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x - 2.5, 18);
      ctx.lineTo(x, 18 + flameLength);
      ctx.lineTo(x + 2.5, 18);
      ctx.closePath();
      ctx.fill();

      // Inner Core Shock Diamond
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(x - 1, 20);
      ctx.lineTo(x, 24);
      ctx.lineTo(x + 1, 20);
      ctx.closePath();
      ctx.fill();
    }
  } else if (shipId === 'ghost') {
    // Dual Recessed Purple Plasma Jet Exhausts
    const nozzles = [-3, 3];
    for (const x of nozzles) {
      const grad = ctx.createLinearGradient(x, 14, x, 14 + flameLength * 0.85);
      grad.addColorStop(0, '#f5d0fe');
      grad.addColorStop(0.4, '#c084fc');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x - 2, 14);
      ctx.lineTo(x, 14 + flameLength * 0.85);
      ctx.lineTo(x + 2, 14);
      ctx.closePath();
      ctx.fill();
    }
  } else if (shipId === 'titan') {
    // Twin Heavy Amber Turbofans + Center Booster
    const nozzles = [-8, 0, 8];
    for (let i = 0; i < nozzles.length; i++) {
      const x = nozzles[i];
      const length = i === 1 ? flameLength * 1.2 : flameLength;
      const grad = ctx.createLinearGradient(x, 21, x, 21 + length);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.4, '#f59e0b');
      grad.addColorStop(0.8, '#dc2626');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x - 2.5, 21);
      ctx.lineTo(x, 21 + length);
      ctx.lineTo(x + 2.5, 21);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Navigation strobe lights (Port Red, Starboard Green/Cyan, Spine White Strobe)
 */
function drawNavLights(ctx: CanvasRenderingContext2D, shipId: ShipId, animTime: number) {
  const strobe = Math.sin(animTime * 8) > 0.4;
  ctx.save();

  let leftX = -21;
  let rightX = 21;
  let wingY = 10;

  if (shipId === 'ghost') {
    leftX = -25;
    rightX = 25;
    wingY = 7;
  } else if (shipId === 'titan') {
    leftX = -23;
    rightX = 23;
    wingY = 9;
  }

  // Port Wingtip: RED light
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(leftX, wingY, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Starboard Wingtip: CYAN/GREEN light
  ctx.fillStyle = '#10b981';
  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(rightX, wingY, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Dorsal Spine: Flashing White Collision Strobe
  if (strobe) {
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 3, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * ENEMY COMBAT AIRCRAFT RENDERER
 * Renders enemies as distinct hostile warplanes flying DOWNWARD (towards player)
 */
export function drawEnemyAircraft(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  animTime: number
) {
  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  const isFlashing = enemy.hitFlashTimer > 0;
  const flicker = 0.8 + Math.sin(animTime * 35) * 0.2;

  switch (enemy.type) {
    case 'scout':
      drawEnemyScoutJet(ctx, enemy, isFlashing, flicker);
      break;
    case 'fighter':
      drawEnemyFighterJet(ctx, enemy, isFlashing, flicker);
      break;
    case 'cruiser':
      drawEnemyBomberCruiser(ctx, enemy, isFlashing, flicker);
      break;
    case 'kamikaze':
      drawEnemyRocketKamikaze(ctx, enemy, isFlashing, flicker, animTime);
      break;
    case 'boss':
      drawEnemyBossDreadnought(ctx, enemy, isFlashing, flicker, animTime);
      break;
    default:
      drawEnemyFighterJet(ctx, enemy, isFlashing, flicker);
  }

  // Draw Health Bar for tough units
  if (enemy.hp < enemy.maxHp && enemy.type !== 'boss') {
    const barW = enemy.radius * 2;
    const pct = Math.max(0, enemy.hp / enemy.maxHp);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(-barW / 2, -enemy.radius - 8, barW, 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-barW / 2, -enemy.radius - 8, barW * pct, 4);
  }

  ctx.restore();
}

/**
 * 1. ENEMY SCOUT: Forward-Swept Wing Drone Interceptor (Su-47 Berkut inspired)
 */
function drawEnemyScoutJet(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  isFlashing: boolean,
  flicker: number
) {
  // Thruster Flame pointing UP (opposite of downward flight)
  const thrusterGrad = ctx.createLinearGradient(0, -10, 0, -10 - 12 * flicker);
  thrusterGrad.addColorStop(0, '#ffffff');
  thrusterGrad.addColorStop(0.5, '#ef4444');
  thrusterGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = thrusterGrad;
  ctx.beginPath();
  ctx.moveTo(-3, -10);
  ctx.lineTo(0, -10 - 12 * flicker);
  ctx.lineTo(3, -10);
  ctx.closePath();
  ctx.fill();

  // Airframe
  ctx.fillStyle = isFlashing ? '#ffffff' : '#b91c1c'; // Red combat camo
  ctx.strokeStyle = isFlashing ? '#ffffff' : '#f87171';
  ctx.lineWidth = 1;

  ctx.beginPath();
  // Nose pointing down (towards player)
  ctx.moveTo(0, 14);
  // Left chine
  ctx.lineTo(-4, 4);
  // Forward-swept left wing (curves forward)
  ctx.lineTo(-14, 10);
  ctx.lineTo(-12, -4);
  // Left tail fin
  ctx.lineTo(-6, -11);
  ctx.lineTo(0, -9);
  // Right tail fin
  ctx.lineTo(6, -11);
  ctx.lineTo(12, -4);
  // Forward-swept right wing
  ctx.lineTo(14, 10);
  ctx.lineTo(4, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Central Red Sensor Visor
  ctx.fillStyle = isFlashing ? '#ffffff' : '#fef08a';
  ctx.beginPath();
  ctx.ellipse(0, 4, 2, 4, 0, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 2. ENEMY FIGHTER: Air Combat Strike Jet (MiG-29 / Su-27 inspired)
 */
function drawEnemyFighterJet(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  isFlashing: boolean,
  flicker: number
) {
  // Dual Twin Engine Flames pointing UP
  for (const x of [-4, 4]) {
    const thrusterGrad = ctx.createLinearGradient(x, -12, x, -12 - 14 * flicker);
    thrusterGrad.addColorStop(0, '#fef08a');
    thrusterGrad.addColorStop(0.6, '#ea580c');
    thrusterGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = thrusterGrad;
    ctx.beginPath();
    ctx.moveTo(x - 2, -12);
    ctx.lineTo(x, -12 - 14 * flicker);
    ctx.lineTo(x + 2, -12);
    ctx.closePath();
    ctx.fill();
  }

  // Wingtip Missiles
  ctx.fillStyle = '#f87171';
  ctx.fillRect(-17, -2, 2, 10);
  ctx.fillRect(15, -2, 2, 10);

  // Airframe
  ctx.fillStyle = isFlashing ? '#ffffff' : '#c2410c'; // Aggressive orange-red
  ctx.strokeStyle = isFlashing ? '#ffffff' : '#fb923c';
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  // Needle nose pointing down
  ctx.moveTo(0, 18);
  ctx.lineTo(4, 6);
  // Swept right wing
  ctx.lineTo(16, -2);
  ctx.lineTo(14, -8);
  ctx.lineTo(7, -8);
  // Right tail fin
  ctx.lineTo(6, -14);
  ctx.lineTo(0, -10);
  // Left tail fin
  ctx.lineTo(-6, -14);
  ctx.lineTo(-7, -8);
  ctx.lineTo(-14, -8);
  // Swept left wing
  ctx.lineTo(-16, -2);
  ctx.lineTo(-4, 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Glass Cockpit
  ctx.fillStyle = isFlashing ? '#ffffff' : '#fef08a';
  ctx.beginPath();
  ctx.ellipse(0, 2, 2.5, 6, 0, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 3. ENEMY CRUISER: Heavy Twin-Turbine Tactical Bomber (Tu-160 / B-1B inspired)
 */
function drawEnemyBomberCruiser(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  isFlashing: boolean,
  flicker: number
) {
  // Heavy Twin Turbine Plumes
  for (const x of [-9, 9]) {
    const thrusterGrad = ctx.createLinearGradient(x, -14, x, -14 - 18 * flicker);
    thrusterGrad.addColorStop(0, '#ffffff');
    thrusterGrad.addColorStop(0.5, '#ec4899');
    thrusterGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = thrusterGrad;
    ctx.beginPath();
    ctx.moveTo(x - 3.5, -14);
    ctx.lineTo(x, -14 - 18 * flicker);
    ctx.lineTo(x + 3.5, -14);
    ctx.closePath();
    ctx.fill();
  }

  // Broad Bomber Airframe
  ctx.fillStyle = isFlashing ? '#ffffff' : '#831843'; // Deep magenta military fuselage
  ctx.strokeStyle = isFlashing ? '#ffffff' : '#f472b6';
  ctx.lineWidth = 1.4;

  ctx.beginPath();
  // Nose
  ctx.moveTo(0, 22);
  ctx.lineTo(7, 10);
  // Wide swept delta wings
  ctx.lineTo(24, 0);
  ctx.lineTo(22, -10);
  ctx.lineTo(12, -8);
  // Tail fuselage
  ctx.lineTo(8, -18);
  ctx.lineTo(0, -14);
  ctx.lineTo(-8, -18);
  ctx.lineTo(-12, -8);
  ctx.lineTo(-22, -10);
  ctx.lineTo(-24, 0);
  ctx.lineTo(-7, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Engine Nacelles Pods
  ctx.fillStyle = '#500724';
  ctx.fillRect(-12, -12, 6, 16);
  ctx.fillRect(6, -12, 6, 16);

  // Dorsal Defensive Cannon Turret
  ctx.fillStyle = '#fbcfe8';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  // Bomber Cockpit Canopy Windows
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-3, 8, 6, 3);
}

/**
 * 4. ENEMY KAMIKAZE: Rocket-Propelled Delta Interceptor (Me 163 / Cruise Rocket inspired)
 */
function drawEnemyRocketKamikaze(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  isFlashing: boolean,
  flicker: number,
  animTime: number
) {
  // Giant Rocket Exhaust Cone (Blazing thrust)
  const flameLength = 22 * flicker;
  const rocketGrad = ctx.createLinearGradient(0, -11, 0, -11 - flameLength);
  rocketGrad.addColorStop(0, '#ffffff');
  rocketGrad.addColorStop(0.3, '#fef08a');
  rocketGrad.addColorStop(0.7, '#ea580c');
  rocketGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = rocketGrad;
  ctx.beginPath();
  ctx.moveTo(-4, -11);
  ctx.lineTo(0, -11 - flameLength);
  ctx.lineTo(4, -11);
  ctx.closePath();
  ctx.fill();

  // Sharp Arrowhead Rocket Frame
  const blink = Math.sin(animTime * 20) > 0;
  ctx.fillStyle = isFlashing ? '#ffffff' : blink ? '#ef4444' : '#eab308'; // Pulsing danger warhead
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;

  ctx.beginPath();
  // Warhead needle pointing down
  ctx.moveTo(0, 16);
  ctx.lineTo(13, -6);
  ctx.lineTo(6, -8);
  ctx.lineTo(3, -12);
  ctx.lineTo(-3, -12);
  ctx.lineTo(-6, -8);
  ctx.lineTo(-13, -6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Warhead Nose Core
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 11, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 5. ENEMY BOSS: Flying Fortress Super-Bomber / Airborne Dreadnought (Colossal Aircraft Carrier)
 */
function drawEnemyBossDreadnought(
  ctx: CanvasRenderingContext2D,
  enemy: Enemy,
  isFlashing: boolean,
  flicker: number,
  animTime: number
) {
  const isVoid = enemy.name.includes('VACÍO');
  const mainColor = isFlashing ? '#ffffff' : isVoid ? '#581c87' : '#991b1b';
  const trimColor = isFlashing ? '#ffffff' : isVoid ? '#c084fc' : '#f87171';

  // 4 Massive Jet Turbine Plumes
  const engines = [-30, -14, 14, 30];
  for (const ex of engines) {
    const thrusterGrad = ctx.createLinearGradient(ex, -34, ex, -34 - 24 * flicker);
    thrusterGrad.addColorStop(0, '#ffffff');
    thrusterGrad.addColorStop(0.4, isVoid ? '#c084fc' : '#f59e0b');
    thrusterGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = thrusterGrad;
    ctx.beginPath();
    ctx.moveTo(ex - 4, -34);
    ctx.lineTo(ex, -34 - 24 * flicker);
    ctx.lineTo(ex + 4, -34);
    ctx.closePath();
    ctx.fill();
  }

  // Colossal Swept Wingspan Airframe
  ctx.fillStyle = mainColor;
  ctx.strokeStyle = trimColor;
  ctx.lineWidth = 2;

  ctx.beginPath();
  // Nose command bridge
  ctx.moveTo(0, 38);
  ctx.lineTo(14, 24);
  // Massive right wing
  ctx.lineTo(44, -4);
  ctx.lineTo(40, -22);
  ctx.lineTo(26, -24);
  // Right tail section
  ctx.lineTo(16, -35);
  ctx.lineTo(0, -28);
  // Left tail section
  ctx.lineTo(-16, -35);
  ctx.lineTo(-26, -24);
  // Massive left wing
  ctx.lineTo(-40, -22);
  ctx.lineTo(-44, -4);
  ctx.lineTo(-14, 24);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Armor Plate Paneling Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-28, -8);
  ctx.lineTo(-12, 10);
  ctx.moveTo(28, -8);
  ctx.lineTo(12, 10);
  ctx.stroke();

  // Central Glowing Reactor Core
  const corePulse = 12 + Math.sin(animTime * 6) * 3;
  ctx.fillStyle = isVoid ? '#e9d5ff' : '#fef08a';
  ctx.shadowColor = isVoid ? '#a855f7' : '#ef4444';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(0, 0, corePulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Command Bridge Windows Array
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-6, 20, 12, 3);

  // Dual Flak Turrets
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(-18, -2, 5, 0, Math.PI * 2);
  ctx.arc(18, -2, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = trimColor;
  ctx.fillRect(-19, 0, 2, 7);
  ctx.fillRect(17, 0, 2, 7);

  // Wingtip Military Strobe Lights
  const strobe = Math.sin(animTime * 10) > 0.3;
  if (strobe) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-42, -12, 2.5, 0, Math.PI * 2);
    ctx.arc(42, -12, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
