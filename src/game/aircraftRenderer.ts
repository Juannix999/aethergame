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
    case 'raptor':
      drawRaptorFighter(ctx, baseColor, accentColor, isGhostTrail, animTime, bankAngle);
      break;
    case 'warthog':
      drawWarthogAttacker(ctx, baseColor, accentColor, isGhostTrail, animTime, bankAngle);
      break;
    case 'blackbird':
      drawBlackbirdMach3(ctx, baseColor, accentColor, isGhostTrail, animTime, bankAngle);
      break;
    case 'typhoon':
      drawTyphoonCanard(ctx, baseColor, accentColor, isGhostTrail, animTime, bankAngle);
      break;
    case 'tomcat':
      drawTomcatFighter(ctx, baseColor, accentColor, isGhostTrail, animTime, bankAngle);
      break;
    case 'spitfire':
      drawSpitfireFighter(ctx, baseColor, accentColor, isGhostTrail, animTime, bankAngle);
      break;
    case 'fulcrum':
      drawFulcrumFighter(ctx, baseColor, accentColor, isGhostTrail, animTime, bankAngle);
      break;
    case 'dragonlady':
      drawDragonladySpy(ctx, baseColor, accentColor, isGhostTrail, animTime, bankAngle);
      break;
    case 'aurora':
      drawAuroraHypersonic(ctx, baseColor, accentColor, isGhostTrail, animTime, bankAngle);
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
 * 4. RAPTOR / LIGHTNING — 5th-Gen Stealth Multi-Role Strike Jet (F-35 Lightning II)
 */
function drawRaptorFighter(
  ctx: CanvasRenderingContext2D,
  baseColor: string,
  accentColor: string,
  isGhost: boolean,
  _animTime: number,
  bankAngle: number
) {
  const roll = Math.max(-0.4, Math.min(0.4, bankAngle));
  const leftWingScale = 1 - roll * 0.38;
  const rightWingScale = 1 + roll * 0.38;

  ctx.save();
  ctx.shadowColor = isGhost ? 'transparent' : baseColor;
  ctx.shadowBlur = isGhost ? 0 : 8;

  // Wingtip AIM-9X Sidewinder Missiles
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-23 * leftWingScale - 1.5, 4, 3, 15);
  ctx.fillRect(23 * rightWingScale - 1.5, 4, 3, 15);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-23 * leftWingScale - 1.5, 2, 3, 3);
  ctx.fillRect(23 * rightWingScale - 1.5, 2, 3, 3);

  // Stealth Diamond Wing & Faceted Fuselage
  ctx.fillStyle = '#1e293b'; // Gunmetal stealth
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  // Chine Nose
  ctx.moveTo(0, -29);
  ctx.lineTo(5, -16);
  // DSI Intakes
  ctx.lineTo(9, -6);
  // Diamond Wing Leading Edge
  ctx.lineTo(23 * rightWingScale, 8);
  // Wingtip trailing cut
  ctx.lineTo(20 * rightWingScale, 15);
  // Flaperon root
  ctx.lineTo(10, 13);
  // Horizontal taileron right
  ctx.lineTo(16 * rightWingScale, 23);
  ctx.lineTo(8, 24);
  // Single Pratt & Whitney F135 center engine exhaust
  ctx.lineTo(4, 21);
  ctx.lineTo(-4, 21);
  // Horizontal taileron left
  ctx.lineTo(-8, 24);
  ctx.lineTo(-16 * leftWingScale, 23);
  // Flaperon root left
  ctx.lineTo(-10, 13);
  ctx.lineTo(-20 * leftWingScale, 15);
  ctx.lineTo(-23 * leftWingScale, 8);
  ctx.lineTo(-9, -6);
  ctx.lineTo(-5, -16);
  ctx.closePath();

  ctx.fillStyle = baseColor;
  ctx.fill();
  ctx.stroke();

  // Radar-Absorbent Material (RAM) Serrated Edges & Panels
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(0, -26);
  ctx.lineTo(3, -14);
  ctx.lineTo(3, 11);
  ctx.lineTo(-3, 11);
  ctx.lineTo(-3, -14);
  ctx.closePath();
  ctx.fill();

  // Twin Canted Vertical Rudders (Stealth angle)
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.moveTo(-6, 9);
  ctx.lineTo(-11, 21);
  ctx.lineTo(-6, 22);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(6, 9);
  ctx.lineTo(11, 21);
  ctx.lineTo(6, 22);
  ctx.closePath();
  ctx.fill();

  // Golden Specular Tinted Stealth Bubble Canopy
  if (!isGhost) {
    const goldCanopy = ctx.createLinearGradient(-2, -12, 2, 2);
    goldCanopy.addColorStop(0, '#fef08a');
    goldCanopy.addColorStop(0.4, '#eab308');
    goldCanopy.addColorStop(0.8, '#0f766e');
    goldCanopy.addColorStop(1, '#042f2e');

    ctx.fillStyle = goldCanopy;
    ctx.beginPath();
    ctx.ellipse(0, -6, 3, 8.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Canopy glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0.8, -8, 1, 3.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 5. WARTHOG / FROGFOOT — Heavy Close-Air-Support Armored Attacker (Su-25 / A-10)
 */
function drawWarthogAttacker(
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

  // Multiple Heavy Underwing Ordnance Pylons (Rocket Pods & Bombs)
  const pylonOffsets = [-19, -14, 14, 19];
  pylonOffsets.forEach((px) => {
    const scale = px < 0 ? leftWingScale : rightWingScale;
    const realX = px * scale;
    // Pylon launcher
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(realX - 1.5, 4, 3, 14);
    // Rocket/Bomb red or yellow head
    ctx.fillStyle = Math.abs(px) > 16 ? '#ef4444' : '#eab308';
    ctx.fillRect(realX - 1.5, 2, 3, 3);
  });

  // Rugged Heavy Fuselage & High-Shoulder Swept Wings
  ctx.fillStyle = '#3f6212'; // Olive drab military green
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.3;

  ctx.beginPath();
  // Armored chiseled nose
  ctx.moveTo(0, -27);
  ctx.lineTo(6, -18);
  ctx.lineTo(8, -6);
  // Wide straight-swept wing
  ctx.lineTo(25 * rightWingScale, 3);
  ctx.lineTo(24 * rightWingScale, 13);
  ctx.lineTo(9, 13);
  // Tail boom
  ctx.lineTo(8, 23);
  ctx.lineTo(0, 20);
  ctx.lineTo(-8, 23);
  ctx.lineTo(-9, 13);
  // Left wing
  ctx.lineTo(-24 * leftWingScale, 13);
  ctx.lineTo(-25 * leftWingScale, 3);
  ctx.lineTo(-8, -6);
  ctx.lineTo(-6, -18);
  ctx.closePath();

  ctx.fillStyle = baseColor;
  ctx.fill();
  ctx.stroke();

  // Woodland Camo Splinter Panels
  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.moveTo(-4, -14);
  ctx.lineTo(2, -10);
  ctx.lineTo(5, 4);
  ctx.lineTo(-3, 8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#854d0e';
  ctx.beginPath();
  ctx.moveTo(12 * rightWingScale, 0);
  ctx.lineTo(20 * rightWingScale, 3);
  ctx.lineTo(16 * rightWingScale, 11);
  ctx.lineTo(9, 10);
  ctx.closePath();
  ctx.fill();

  // Dual Nacelle High Turbojets
  ctx.fillStyle = '#1c1917';
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 1;
  ctx.fillRect(-11, 2, 6, 18);
  ctx.strokeRect(-11, 2, 6, 18);
  ctx.fillRect(5, 2, 6, 18);
  ctx.strokeRect(5, 2, 6, 18);

  // Twin Vertical Rudders
  ctx.fillStyle = '#4d7c0f';
  ctx.fillRect(-12, 14, 3, 10);
  ctx.fillRect(9, 14, 3, 10);

  // 30mm Autocannon Chin Pod under nose
  if (!isGhost) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-2, -31, 4, 6);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-1, -33, 2, 3);

    // Armored Bathtub Cockpit
    ctx.fillStyle = '#020617';
    ctx.fillRect(-3.5, -12, 7, 10);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-2.5, -11, 5, 4);
    ctx.fillRect(-2.5, -6, 5, 3);
  }

  ctx.restore();
}

/**
 * 6. BLACKBIRD — Mach 3+ Hypersonic Stealth Interceptor (SR-71 Blackbird)
 */
function drawBlackbirdMach3(
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
  ctx.shadowColor = isGhost ? 'transparent' : accentColor;
  ctx.shadowBlur = isGhost ? 0 : 10;

  // Ultra-sleek slender needle fuselage with massive blended chines
  ctx.fillStyle = '#090d16'; // Deep radar-absorbent obsidian black
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.3;

  ctx.beginPath();
  // Needle nose pitot tube
  ctx.moveTo(0, -36);
  // Wide continuous chines flanking fuselage
  ctx.lineTo(4, -20);
  ctx.lineTo(6, -8);
  // Right engine nacelle leading junction
  ctx.lineTo(13 * rightWingScale, -4);
  // Right outer delta wingtip
  ctx.lineTo(24 * rightWingScale, 12);
  // Right trailing edge
  ctx.lineTo(17 * rightWingScale, 16);
  // Right J58 engine nozzle
  ctx.lineTo(13 * rightWingScale, 24);
  ctx.lineTo(9 * rightWingScale, 24);
  // Inboard trailing edge to tail boom
  ctx.lineTo(4, 18);
  ctx.lineTo(0, 22);
  // Left inboard trailing edge
  ctx.lineTo(-4, 18);
  // Left J58 engine nozzle
  ctx.lineTo(-9 * leftWingScale, 24);
  ctx.lineTo(-13 * leftWingScale, 24);
  // Left trailing edge
  ctx.lineTo(-17 * leftWingScale, 16);
  // Left outer delta wingtip
  ctx.lineTo(-24 * leftWingScale, 12);
  // Left engine nacelle leading junction
  ctx.lineTo(-13 * leftWingScale, -4);
  // Left wide chine
  ctx.lineTo(-6, -8);
  ctx.lineTo(-4, -20);
  ctx.closePath();

  ctx.fillStyle = baseColor;
  ctx.fill();
  ctx.stroke();

  // Pratt & Whitney J58 Nacelle Bodies with Movable Spike Cones
  for (const dir of [-1, 1]) {
    const scale = dir === -1 ? leftWingScale : rightWingScale;
    const nx = dir * 11 * scale;

    // Nacelle pod
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(nx - 3, -6, 6, 26);
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(nx - 3, -6, 6, 26);

    // Forward supersonic spike shock cone
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.moveTo(nx, -14);
    ctx.lineTo(nx + 2.5, -6);
    ctx.lineTo(nx - 2.5, -6);
    ctx.closePath();
    ctx.fill();

    // Inward-canted vertical rudder fins (mounted directly on engine nacelles)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(nx + (dir * 1), 6);
    ctx.lineTo(nx - (dir * 3), 20);
    ctx.lineTo(nx, 22);
    ctx.closePath();
    ctx.fill();
  }

  // Red Thermal Expansion Seam Lines (Classic SR-71 high-temp panel lines)
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.lineTo(0, 14);
  ctx.moveTo(-4, -10);
  ctx.lineTo(4, -10);
  ctx.stroke();

  // Tiny Tandem Cockpit Windows (Pilot & RSO)
  if (!isGhost) {
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-1.5, -18, 3, 4);
    ctx.fillRect(-1.5, -11, 3, 4);

    // Long pitot needle
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -36);
    ctx.lineTo(0, -42);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * 7. TYPHOON — Agile Canard-Delta Tactical Interceptor (Eurofighter Typhoon)
 */
function drawTyphoonCanard(
  ctx: CanvasRenderingContext2D,
  baseColor: string,
  accentColor: string,
  isGhost: boolean,
  _animTime: number,
  bankAngle: number
) {
  const roll = Math.max(-0.4, Math.min(0.4, bankAngle));
  const leftWingScale = 1 - roll * 0.38;
  const rightWingScale = 1 + roll * 0.38;

  ctx.save();
  ctx.shadowColor = isGhost ? 'transparent' : baseColor;
  ctx.shadowBlur = isGhost ? 0 : 8;

  // Foreplane All-Moving Canards (Forward wings in front of cockpit)
  ctx.fillStyle = '#b45309';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1;

  // Left canard
  ctx.beginPath();
  ctx.moveTo(-4, -12);
  ctx.lineTo(-14 * leftWingScale, -8);
  ctx.lineTo(-12 * leftWingScale, -4);
  ctx.lineTo(-4, -6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right canard
  ctx.beginPath();
  ctx.moveTo(4, -12);
  ctx.lineTo(14 * rightWingScale, -8);
  ctx.lineTo(12 * rightWingScale, -4);
  ctx.lineTo(4, -6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Wingtip Electronic Warfare Pods / Missile rails
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-24 * leftWingScale - 1.5, 6, 3, 14);
  ctx.fillRect(24 * rightWingScale - 1.5, 6, 3, 14);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-24 * leftWingScale - 1.5, 4, 3, 3);
  ctx.fillRect(24 * rightWingScale - 1.5, 4, 3, 3);

  // Broad Pure Delta Wing & Fuselage
  ctx.fillStyle = '#78350f'; // Desert camo tan base
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.3;

  ctx.beginPath();
  // Nose
  ctx.moveTo(0, -28);
  ctx.lineTo(4, -16);
  ctx.lineTo(5, -4);
  // Pure delta wing 53 degree sweep
  ctx.lineTo(24 * rightWingScale, 11);
  ctx.lineTo(21 * rightWingScale, 16);
  ctx.lineTo(8, 16);
  // Twin Eurojet EJ200 nozzles
  ctx.lineTo(6, 22);
  ctx.lineTo(0, 19);
  ctx.lineTo(-6, 22);
  ctx.lineTo(-8, 16);
  ctx.lineTo(-21 * leftWingScale, 16);
  ctx.lineTo(-24 * leftWingScale, 11);
  ctx.lineTo(-5, -4);
  ctx.lineTo(-4, -16);
  ctx.closePath();

  ctx.fillStyle = baseColor;
  ctx.fill();
  ctx.stroke();

  // Desert Sand Splinter Panels
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.moveTo(-3, -16);
  ctx.lineTo(3, -16);
  ctx.lineTo(5, 12);
  ctx.lineTo(-5, 12);
  ctx.closePath();
  ctx.fill();

  // Ventral Box Air Intake under fuselage
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-4, -2, 8, 7);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 0.8;
  ctx.strokeRect(-4, -2, 8, 7);

  // Large Central Vertical Tail Fin
  ctx.fillStyle = '#92400e';
  ctx.fillRect(-1.5, 6, 3, 14);

  // High Visibility Canopy
  if (!isGhost) {
    const canopyGrad = ctx.createLinearGradient(-2, -12, 2, 2);
    canopyGrad.addColorStop(0, '#ffffff');
    canopyGrad.addColorStop(0.4, '#38bdf8');
    canopyGrad.addColorStop(1, '#0369a1');

    ctx.fillStyle = canopyGrad;
    ctx.beginPath();
    ctx.ellipse(0, -7, 2.8, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pitot probe
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(0, -34);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * 8. TOMCAT INTERCEPTOR — F-14 Tomcat Naval Variable-Sweep Wing Fighter (VF-84 Jolly Rogers)
 */
function drawTomcatFighter(
  ctx: CanvasRenderingContext2D,
  baseColor: string,
  accentColor: string,
  isGhost: boolean,
  animTime: number,
  bankAngle: number
) {
  const roll = Math.max(-0.4, Math.min(0.4, bankAngle));
  const leftWingScale = 1 - roll * 0.35;
  const rightWingScale = 1 + roll * 0.35;

  ctx.save();
  ctx.shadowColor = isGhost ? 'transparent' : accentColor;
  ctx.shadowBlur = isGhost ? 0 : 8;

  // --- Dynamic Variable-Sweep Wings (Swing Wings) ---
  // Wings sweep back automatically with speed/tilt
  const sweepAngle = 0.28 + Math.abs(roll) * 0.2;
  const wingSpan = 26;

  // Left Swing Wing
  ctx.save();
  ctx.translate(-7, 2);
  ctx.rotate(-sweepAngle);
  ctx.fillStyle = baseColor;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -6);
  ctx.lineTo(-wingSpan * leftWingScale, 8);
  ctx.lineTo(-wingSpan * leftWingScale + 4, 14);
  ctx.lineTo(0, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Right Swing Wing
  ctx.save();
  ctx.translate(7, 2);
  ctx.rotate(sweepAngle);
  ctx.fillStyle = baseColor;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -6);
  ctx.lineTo(wingSpan * rightWingScale, 8);
  ctx.lineTo(wingSpan * rightWingScale - 4, 14);
  ctx.lineTo(0, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // --- Main Airframe & Wide Engine Tunnel Fuselage (Grumman Pancake) ---
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  // Nose Radome & Pitot
  ctx.moveTo(0, -32);
  ctx.lineTo(3.5, -18);
  // Glove Vane Leading Edge Root
  ctx.lineTo(8, -6);
  ctx.lineTo(8, 14);
  // Right Engine Nacelle
  ctx.lineTo(10, 22);
  ctx.lineTo(5, 22);
  // Center Tunnel Gap (Tunnel of Love)
  ctx.lineTo(0, 16);
  // Left Engine Nacelle
  ctx.lineTo(-5, 22);
  ctx.lineTo(-10, 22);
  // Left Glove Root
  ctx.lineTo(-8, 14);
  ctx.lineTo(-8, -6);
  ctx.lineTo(-3.5, -18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // --- AIM-54 Phoenix Missile Pallets in Belly Tunnel ---
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-2, -2, 4, 12);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-2, -4, 4, 2); // Red missile seeker head

  // --- Twin Outboard Canted Tail Fins with VF-84 Jolly Rogers Emblem ---
  // Left Fin
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(-7, 6);
  ctx.lineTo(-11, 20);
  ctx.lineTo(-6, 20);
  ctx.closePath();
  ctx.fill();
  // Jolly Rogers yellow chevron tip
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-10, 16, 4, 4);

  // Right Fin
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(7, 6);
  ctx.lineTo(11, 20);
  ctx.lineTo(6, 20);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#facc15';
  ctx.fillRect(6, 16, 4, 4);

  // --- Two-Seater Tandem Cockpit Canopy (Pilot + RIO) ---
  if (!isGhost) {
    const canopyGrad = ctx.createLinearGradient(0, -22, 0, -6);
    canopyGrad.addColorStop(0, '#fef08a');
    canopyGrad.addColorStop(0.5, '#f59e0b');
    canopyGrad.addColorStop(1, '#78350f');

    ctx.fillStyle = canopyGrad;
    ctx.beginPath();
    ctx.ellipse(0, -14, 2.8, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Canopy frame divider separating Pilot and RIO
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-2.5, -14);
    ctx.lineTo(2.5, -14);
    ctx.stroke();

    // Glass glare
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(1, -20);
    ctx.lineTo(1, -10);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * 9. SPITFIRE AS — Supermarine Spitfire Mk.IX WWII Fighter (Elliptical Wings & Rolls-Royce Merlin)
 */
function drawSpitfireFighter(
  ctx: CanvasRenderingContext2D,
  baseColor: string,
  accentColor: string,
  isGhost: boolean,
  animTime: number,
  bankAngle: number
) {
  const roll = Math.max(-0.4, Math.min(0.4, bankAngle));
  const leftWingScale = 1 - roll * 0.35;
  const rightWingScale = 1 + roll * 0.35;

  ctx.save();
  ctx.shadowColor = isGhost ? 'transparent' : '#84cc16';
  ctx.shadowBlur = isGhost ? 0 : 8;

  // --- Iconic Elliptical Wings (RAF Signature) ---
  ctx.fillStyle = baseColor;
  ctx.strokeStyle = '#a3e635';
  ctx.lineWidth = 1.2;

  // Left Elliptical Wing
  ctx.beginPath();
  ctx.ellipse(-14 * leftWingScale, 3, 15 * leftWingScale, 9, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Right Elliptical Wing
  ctx.beginPath();
  ctx.ellipse(14 * rightWingScale, 3, 15 * rightWingScale, 9, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Yellow Leading Edge Recognition Bands
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-26 * leftWingScale, -2, 8 * leftWingScale, 2.5);
  ctx.fillRect(18 * rightWingScale, -2, 8 * rightWingScale, 2.5);

  // RAF Cockade Roundels on Wings (Blue, White, Red concentric)
  for (const [wx, scale] of [[-15, leftWingScale], [15, rightWingScale]] as const) {
    ctx.fillStyle = '#1d4ed8'; // Blue
    ctx.beginPath();
    ctx.arc(wx * scale, 3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff'; // White
    ctx.beginPath();
    ctx.arc(wx * scale, 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444'; // Red center
    ctx.beginPath();
    ctx.arc(wx * scale, 3, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Browning Machine Gun Barrels protruding from wings ---
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-20 * leftWingScale, -8, 1.5, 8);
  ctx.fillRect(-17 * leftWingScale, -10, 1.5, 10);
  ctx.fillRect(16 * rightWingScale, -10, 1.5, 10);
  ctx.fillRect(19 * rightWingScale, -8, 1.5, 8);

  // --- Slim Cigar Fuselage & Tail ---
  ctx.fillStyle = '#2e4912'; // Dark olive camo
  ctx.strokeStyle = '#a3e635';
  ctx.lineWidth = 1;

  ctx.beginPath();
  // Nose spinner
  ctx.moveTo(0, -28);
  ctx.lineTo(4, -18);
  ctx.lineTo(4, 14);
  // Horizontal Tail Elevators
  ctx.lineTo(12, 18);
  ctx.lineTo(10, 24);
  ctx.lineTo(3, 22);
  // Tail fin tip
  ctx.lineTo(0, 26);
  ctx.lineTo(-3, 22);
  ctx.lineTo(-10, 24);
  ctx.lineTo(-12, 18);
  ctx.lineTo(-4, 14);
  ctx.lineTo(-4, -18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Merlin 6-stack engine exhausts on flanks
  ctx.fillStyle = '#ea580c';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(-4.5, -20 + i * 2.5, 1.5, 1.5);
    ctx.fillRect(3, -20 + i * 2.5, 1.5, 1.5);
  }

  // Teardrop Glass Cockpit Canopy
  if (!isGhost) {
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(0, -6, 2.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // --- Spinning 5-Blade Golden Propeller Disc Blur at Nose ---
  if (!isGhost) {
    const propAngle = animTime * 40;
    // Translucent Propeller blur disc
    ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, -28, 15, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden spinning propeller blades with yellow tip blurs
    ctx.save();
    ctx.translate(0, -28);
    ctx.rotate(propAngle);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const px = Math.cos(angle) * 14;
      const py = Math.sin(angle) * 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Yellow blade tip
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Red Spinner Nose Cone
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, 0, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * 10. FULCRUM SUPERIORIDAD — MiG-29 Fulcrum Air Superiority Jet Fighter
 */
function drawFulcrumFighter(
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
  ctx.shadowColor = isGhost ? 'transparent' : '#0284c7';
  ctx.shadowBlur = isGhost ? 0 : 8;

  // --- Wingtip Missiles (R-73 Archer) ---
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-22 * leftWingScale, 0, 2.5, 14);
  ctx.fillRect(20 * rightWingScale, 0, 2.5, 14);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-22 * leftWingScale, -2, 2.5, 2.5);
  ctx.fillRect(20 * rightWingScale, -2, 2.5, 2.5);

  // --- Blended Airframe & LERX (Leading Edge Root Extensions) ---
  ctx.fillStyle = '#0284c7'; // Arctic naval camo blue
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  // Sharp nose radome
  ctx.moveTo(0, -30);
  ctx.lineTo(3, -16);
  // Curved LERX root
  ctx.lineTo(6, -6);
  // Swept Wing
  ctx.lineTo(21 * rightWingScale, 6);
  ctx.lineTo(19 * rightWingScale, 14);
  ctx.lineTo(10, 13);
  // Twin Engine Nozzles
  ctx.lineTo(7, 22);
  ctx.lineTo(3, 22);
  ctx.lineTo(0, 18);
  ctx.lineTo(-3, 22);
  ctx.lineTo(-7, 22);
  ctx.lineTo(-10, 13);
  ctx.lineTo(-19 * leftWingScale, 14);
  ctx.lineTo(-21 * leftWingScale, 6);
  ctx.lineTo(-6, -6);
  ctx.lineTo(-3, -16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Arctic Splinter Camo Patches
  ctx.fillStyle = '#bae6fd';
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(4, -8);
  ctx.lineTo(2, 6);
  ctx.lineTo(-3, 2);
  ctx.closePath();
  ctx.fill();

  // Engine nacelle intake ramps
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-7, -4, 3.5, 8);
  ctx.fillRect(3.5, -4, 3.5, 8);

  // Twin Outboard Vertical Stabilizers with Soviet Red Stars
  ctx.fillStyle = '#0369a1';
  ctx.beginPath();
  ctx.moveTo(-6, 8);
  ctx.lineTo(-10, 20);
  ctx.lineTo(-5, 20);
  ctx.closePath();
  ctx.fill();
  // Red star dot
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(-7, 15, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0369a1';
  ctx.beginPath();
  ctx.moveTo(6, 8);
  ctx.lineTo(10, 20);
  ctx.lineTo(5, 20);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(7, 15, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // High-arc Bubble Canopy
  if (!isGhost) {
    const canopyGrad = ctx.createLinearGradient(0, -18, 0, -4);
    canopyGrad.addColorStop(0, '#ffffff');
    canopyGrad.addColorStop(0.5, '#38bdf8');
    canopyGrad.addColorStop(1, '#0284c7');

    ctx.fillStyle = canopyGrad;
    ctx.beginPath();
    ctx.ellipse(0, -10, 2.6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 11. DRAGON LADY — U-2S Stratospheric High-Altitude Reconnaissance Spyplane
 */
function drawDragonladySpy(
  ctx: CanvasRenderingContext2D,
  baseColor: string,
  accentColor: string,
  isGhost: boolean,
  _animTime: number,
  bankAngle: number
) {
  const roll = Math.max(-0.4, Math.min(0.4, bankAngle));
  const leftWingScale = 1 - roll * 0.3;
  const rightWingScale = 1 + roll * 0.3;

  ctx.save();
  ctx.shadowColor = isGhost ? 'transparent' : '#38bdf8';
  ctx.shadowBlur = isGhost ? 0 : 8;

  // --- Ultra-Wide High-Aspect Ratio Glider Wings (31-Meter Wingspan) ---
  const span = 32;
  ctx.fillStyle = '#0f172a'; // Deep radar-absorbing matte charcoal
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;

  ctx.beginPath();
  // Nose
  ctx.moveTo(0, -32);
  ctx.lineTo(2.5, -14);
  // Extreme wingspan right wing
  ctx.lineTo(span * rightWingScale, -2);
  ctx.lineTo(span * rightWingScale, 3);
  ctx.lineTo(3, 4);
  // Slim tail section
  ctx.lineTo(2, 22);
  // Horizontal stabilizers
  ctx.lineTo(11, 24);
  ctx.lineTo(10, 27);
  ctx.lineTo(0, 28);
  ctx.lineTo(-10, 27);
  ctx.lineTo(-11, 24);
  ctx.lineTo(-2, 22);
  // Extreme wingspan left wing
  ctx.lineTo(-3, 4);
  ctx.lineTo(-span * leftWingScale, 3);
  ctx.lineTo(-span * leftWingScale, -2);
  ctx.lineTo(-2.5, -14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Wingtip Auxiliary Sensor & Skid Pods
  ctx.fillStyle = '#334155';
  ctx.fillRect(-span * leftWingScale - 1, -3, 2.5, 7);
  ctx.fillRect(span * rightWingScale - 1.5, -3, 2.5, 7);

  // Dorsal Senior Span Satellite Communications Radome Hump
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(0, 2, 2.5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Optical Sensor Nose Glass
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(0, -28, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Pilot High-Altitude Pressure Suit Canopy
  if (!isGhost) {
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, -18, 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 12. AURORA MACH 5 — SR-91 Aurora Classified Hypersonic Scramjet Waverider
 */
function drawAuroraHypersonic(
  ctx: CanvasRenderingContext2D,
  baseColor: string,
  accentColor: string,
  isGhost: boolean,
  animTime: number,
  bankAngle: number
) {
  const roll = Math.max(-0.4, Math.min(0.4, bankAngle));
  const leftWingScale = 1 - roll * 0.35;
  const rightWingScale = 1 + roll * 0.35;

  ctx.save();
  ctx.shadowColor = isGhost ? 'transparent' : '#f97316';
  ctx.shadowBlur = isGhost ? 0 : 10;

  // --- Sharp 75-Degree Delta Waverider Lifting Body ---
  ctx.fillStyle = '#020617'; // Thermal carbon-black skin
  ctx.strokeStyle = '#f97316'; // Test flight hazard orange trim
  ctx.lineWidth = 1.4;

  ctx.beginPath();
  // Extreme Hypersonic Needle Nose
  ctx.moveTo(0, -34);
  // Right Waverider Chine Edge
  ctx.lineTo(24 * rightWingScale, 18);
  ctx.lineTo(16 * rightWingScale, 21);
  // Scramjet Center Notch
  ctx.lineTo(6, 17);
  ctx.lineTo(0, 20);
  ctx.lineTo(-6, 17);
  // Left Waverider Chine Edge
  ctx.lineTo(-16 * leftWingScale, 21);
  ctx.lineTo(-24 * leftWingScale, 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Thermal Protection Tile Lines (Hexagonal heat shielding)
  ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.lineTo(0, 16);
  ctx.moveTo(-10, 4);
  ctx.lineTo(0, -12);
  ctx.lineTo(10, 4);
  ctx.stroke();

  // Neon Hazard Orange Test Stripes on Wings
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.moveTo(12 * rightWingScale, 4);
  ctx.lineTo(16 * rightWingScale, 14);
  ctx.lineTo(14 * rightWingScale, 14);
  ctx.lineTo(10 * rightWingScale, 4);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-12 * leftWingScale, 4);
  ctx.lineTo(-16 * leftWingScale, 14);
  ctx.lineTo(-14 * leftWingScale, 14);
  ctx.lineTo(-10 * leftWingScale, 4);
  ctx.closePath();
  ctx.fill();

  // Inward-Canted Ventral Stabilizers
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-7, 8, 2, 9);
  ctx.fillRect(5, 8, 2, 9);

  // Hypersonic Radar-Reflective Slit Cockpit
  if (!isGhost) {
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.ellipse(0, -16, 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 0.8;
    ctx.stroke();
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

  if (shipId === 'valkyrie' || shipId === 'typhoon') {
    // Twin Blue/Cyan Fighter Jet Turbines
    const nozzles = [-4.5, 4.5];
    for (const x of nozzles) {
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

      // Shock Diamond
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
  } else if (shipId === 'raptor') {
    // Single Large Pratt & Whitney F135 Vectoring Jet Afterburner
    const grad = ctx.createLinearGradient(0, 20, 0, 20 + flameLength * 1.3);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.2, '#67e8f9');
    grad.addColorStop(0.6, '#0284c7');
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-4, 20);
    ctx.lineTo(0, 20 + flameLength * 1.3);
    ctx.lineTo(4, 20);
    ctx.closePath();
    ctx.fill();

    // Shock diamond core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-1.5, 22);
    ctx.lineTo(0, 28);
    ctx.lineTo(1.5, 22);
    ctx.closePath();
    ctx.fill();
  } else if (shipId === 'warthog') {
    // Dual Heavy Camo Turbojets
    const nozzles = [-8, 8];
    for (const x of nozzles) {
      const grad = ctx.createLinearGradient(x, 20, x, 20 + flameLength * 0.9);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.5, '#ea580c');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x - 3, 20);
      ctx.lineTo(x, 20 + flameLength * 0.9);
      ctx.lineTo(x + 3, 20);
      ctx.closePath();
      ctx.fill();
    }
  } else if (shipId === 'blackbird') {
    // Twin Supersonic Mach 3+ J58 Afterburners with Mach Shock Diamonds
    const nozzles = [-11, 11];
    for (const x of nozzles) {
      const longFlame = flameLength * 1.45;
      const grad = ctx.createLinearGradient(x, 23, x, 23 + longFlame);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.2, '#f43f5e');
      grad.addColorStop(0.5, '#38bdf8');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x - 3, 23);
      ctx.lineTo(x, 23 + longFlame);
      ctx.lineTo(x + 3, 23);
      ctx.closePath();
      ctx.fill();

      // Triple Supersonic Shock Diamonds
      ctx.fillStyle = '#ffffff';
      for (const dy of [25, 30, 35]) {
        ctx.beginPath();
        ctx.moveTo(x - 1, dy);
        ctx.lineTo(x, dy + 3);
        ctx.lineTo(x + 1, dy);
        ctx.closePath();
        ctx.fill();
      }
    }
  } else if (shipId === 'tomcat') {
    // Twin GE F110 Afterburners (Naval Top Gun Interceptor)
    const nozzles = [-7.5, 7.5];
    for (const x of nozzles) {
      const grad = ctx.createLinearGradient(x, 22, x, 22 + flameLength * 1.25);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#fde047');
      grad.addColorStop(0.7, '#ea580c');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x - 2.5, 22);
      ctx.lineTo(x, 22 + flameLength * 1.25);
      ctx.lineTo(x + 2.5, 22);
      ctx.closePath();
      ctx.fill();

      // Supersonic Shock Diamond
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(x - 1, 25);
      ctx.lineTo(x, 29);
      ctx.lineTo(x + 1, 25);
      ctx.closePath();
      ctx.fill();
    }
  } else if (shipId === 'spitfire') {
    // Rolls-Royce Merlin V12 side manifold exhaust flames
    for (const x of [-4.5, 4.5]) {
      const grad = ctx.createLinearGradient(x, -16, x, -16 + flameLength * 0.4);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#60a5fa');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x - 1, -16);
      ctx.lineTo(x, -16 + flameLength * 0.4);
      ctx.lineTo(x + 1, -16);
      ctx.closePath();
      ctx.fill();
    }
  } else if (shipId === 'fulcrum') {
    // Twin RD-33 Thrust Vectoring Afterburners
    const nozzles = [-5, 5];
    for (const x of nozzles) {
      const grad = ctx.createLinearGradient(x, 22, x, 22 + flameLength * 1.2);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#38bdf8');
      grad.addColorStop(0.7, '#ea580c');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x - 2.5, 22);
      ctx.lineTo(x, 22 + flameLength * 1.2);
      ctx.lineTo(x + 2.5, 22);
      ctx.closePath();
      ctx.fill();
    }
  } else if (shipId === 'dragonlady') {
    // Single High-Altitude Non-Afterburning Turbojet Plume
    const grad = ctx.createLinearGradient(0, 26, 0, 26 + flameLength * 0.75);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.6, '#f97316');
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-2, 26);
    ctx.lineTo(0, 26 + flameLength * 0.75);
    ctx.lineTo(2, 26);
    ctx.closePath();
    ctx.fill();
  } else if (shipId === 'aurora') {
    // Dual Pulse Detonation Scramjet (Mach 5 pulse rings)
    for (const x of [-6, 6]) {
      const grad = ctx.createLinearGradient(x, 18, x, 18 + flameLength * 1.4);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, '#fb923c');
      grad.addColorStop(0.7, '#ea580c');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x - 3, 18);
      ctx.lineTo(x, 18 + flameLength * 1.4);
      ctx.lineTo(x + 3, 18);
      ctx.closePath();
      ctx.fill();

      // Scramjet Pulse Detonation Doughnut Shock Rings
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      for (const ry of [23, 29, 36]) {
        ctx.beginPath();
        ctx.ellipse(x, ry, 2.5, 1, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
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
  } else if (shipId === 'raptor') {
    leftX = -22;
    rightX = 22;
    wingY = 10;
  } else if (shipId === 'warthog') {
    leftX = -24;
    rightX = 24;
    wingY = 8;
  } else if (shipId === 'blackbird') {
    leftX = -23;
    rightX = 23;
    wingY = 12;
  } else if (shipId === 'typhoon') {
    leftX = -23;
    rightX = 23;
    wingY = 11;
  } else if (shipId === 'tomcat') {
    leftX = -24;
    rightX = 24;
    wingY = 10;
  } else if (shipId === 'spitfire') {
    leftX = -27;
    rightX = 27;
    wingY = 2;
  } else if (shipId === 'fulcrum') {
    leftX = -21;
    rightX = 21;
    wingY = 10;
  } else if (shipId === 'dragonlady') {
    leftX = -32;
    rightX = 32;
    wingY = 0;
  } else if (shipId === 'aurora') {
    leftX = -22;
    rightX = 22;
    wingY = 16;
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
