type RibbonFrame = {
  width: number;
  height: number;
  scrollY: number;
  compact: boolean;
  rtl: boolean;
  time?: number;
  pointer?: { x: number; y: number; strength: number };
};

type RibbonPoint = {
  x: number;
  y: number;
  normalX: number;
  normalY: number;
  spread: number;
  twist: number;
  t: number;
};

type GlowLayer = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  scale: number;
  starSprite?: HTMLCanvasElement;
};

type StarLight = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  flare: boolean;
  twinkle: number;
  focus: boolean;
};

const starSeeds = Array.from({ length: 40 }, (_, index) => {
  const seed = (offset: number) => {
    const value = Math.sin((index + 1) * 127.1 + offset * 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
  return { position: seed(1), orbit: seed(2), depth: seed(3), size: seed(4) };
});

// Stars belong to the ribbon's moving geometry, rather than a separate fixed
// starfield. Seeds are reused; identical frame inputs yield identical positions.
function sampleRibbonStars(
  frame: RibbonFrame,
  points: RibbonPoint[],
  phase: number,
): StarLight[] {
  const { width, height, compact, rtl, time = 0, pointer } = frame;
  const count = compact ? 14 : starSeeds.length;
  const direction = rtl ? -1 : 1;

  return starSeeds.slice(0, count).map((seed, index) => {
    const travel = seed.position + time * 0.009 + phase * 0.025;
    const t = -0.1 + (travel - Math.floor(travel)) * 1.2;
    const sample = ((t + 0.3) / 1.6) * (points.length - 1);
    const before = points[Math.floor(sample)];
    const after = points[Math.min(points.length - 1, Math.floor(sample) + 1)];
    const mix = sample - Math.floor(sample);
    const interpolate = (key: "x" | "y" | "normalX" | "normalY" | "spread") =>
      before[key] + (after[key] - before[key]) * mix;
    const normalX = interpolate("normalX");
    const normalY = interpolate("normalY");
    const orbit = seed.orbit * Math.PI * 2 + time * 0.25 + phase * 0.65;
    const radius =
      interpolate("spread") * (0.4 + seed.depth * 1.6) +
      (compact ? 10 : 22);
    const across = Math.sin(orbit) * radius;
    const along = Math.cos(orbit) * radius * 0.24;
    let x =
      interpolate("x") + normalX * across - normalY * direction * along;
    let y = interpolate("y") + normalY * across + Math.abs(normalX) * along;
    let proximity = 0;

    if (!compact && pointer?.strength) {
      const dx = x - pointer.x * width;
      const dy = y - pointer.y * height;
      const distance = Math.hypot(dx, dy);
      const reach = Math.min(240, width * 0.24);
      proximity = Math.exp(-(distance * distance) / (reach * reach));
      const push = proximity * pointer.strength * 32;
      x += (dx / Math.max(1, distance)) * push;
      y += (dy / Math.max(1, distance)) * push;
      x += (pointer.x - 0.5) * pointer.strength * seed.depth * 18;
      y += (pointer.y - 0.5) * pointer.strength * seed.depth * 10;
    }

    const twinkle = 0.65 + 0.35 * Math.sin(time * 0.8 + seed.orbit * 15);
    const edgeFade = Math.max(0, Math.min(1, t * 7, (1 - t) * 7));
    return {
      x,
      y,
      radius: (compact ? 0.65 : 0.8) + seed.size * 0.9,
      alpha: edgeFade * (0.35 + twinkle * 0.45 + proximity * 0.2),
      flare: index % 7 === 0,
      twinkle,
      focus: false,
    };
  });
}

// A sparse, stratified field reaches the empty parts of the viewport too.
// Independent slow pulses hand the brighter focus from one star to another.
function sampleAmbientStars(
  { width, height, scrollY, compact, rtl, time = 0, pointer }: RibbonFrame,
  points: RibbonPoint[],
): StarLight[] {
  const columns = compact ? 4 : 6;
  const rows = compact ? 3 : 6;
  const count = columns * rows;

  return starSeeds.slice(0, count).map((seed, index) => {
    const depth = 0.35 + seed.depth * 0.65;
    const column = index % columns;
    const row = Math.floor(index / columns);
    const positionX = (column + 0.2 + seed.orbit * 0.6) / columns;
    const drift = (scrollY / height) * 0.025 * depth;
    const positionY = (row + 0.2 + seed.position * 0.6) / rows - drift;
    const wrappedY = positionY - Math.floor(positionY);
    const direction = rtl ? -1 : 1;
    let x =
      (rtl ? 1 - positionX : positionX) * width +
      Math.sin(time * 0.12 + seed.position * 9) * depth * 5 * direction;
    let y =
      wrappedY * height +
      Math.cos(time * 0.14 + seed.orbit * 9) * depth * 5;
    let proximity = 0;

    if (!compact && pointer?.strength) {
      x += (pointer.x - 0.5) * pointer.strength * depth * 22;
      y += (pointer.y - 0.5) * pointer.strength * depth * 14;
      const dx = x - pointer.x * width;
      const dy = y - pointer.y * height;
      const reach = Math.min(210, width * 0.22);
      proximity =
        Math.exp(-(dx * dx + dy * dy) / (reach * reach)) * pointer.strength;
    }

    const ribbonIndex = Math.max(
      0,
      Math.min(
        points.length - 1,
        Math.round(((wrappedY + 0.3) / 1.6) * (points.length - 1)),
      ),
    );
    const distanceFromRibbon = Math.abs(x - points[ribbonIndex].x);
    const darkSpace = Math.min(1, distanceFromRibbon / (compact ? 80 : 220));
    const pulse =
      0.5 +
      0.5 * Math.sin(time * (0.55 + seed.size * 0.25) + seed.position * 20);
    const twinkle = Math.pow(pulse, 2.5);
    const edgeFade = Math.max(0, Math.min(1, wrappedY * 14, (1 - wrappedY) * 14));
    const focus = index % (compact ? 5 : 7) === 0;

    return {
      x,
      y,
      radius: (focus ? 1.15 : 0.55) + seed.size * (compact ? 0.55 : 0.8),
      alpha:
        edgeFade *
        (0.025 + twinkle * (focus ? 0.9 : 0.65) + proximity * 0.25) *
        (0.4 + darkSpace * 0.6),
      flare: focus,
      focus,
      twinkle,
    };
  });
}

// Scroll controls the main shape; bounded waves and a local pointer field add
// gentle movement. Identical frame inputs always reproduce identical geometry.
function sampleRibbon({
  width,
  height,
  scrollY,
  compact,
  rtl,
  time = 0,
  pointer,
}: RibbonFrame) {
  const phase = (scrollY / Math.max(height, 1)) * 1.65;
  const count = compact ? 56 : 88;
  const halfWidth = Math.min(compact ? 68 : 120, width * 0.085);
  const waveAmplitude = Math.min(
    compact ? 6 : 20,
    width * (compact ? 0.009 : 0.014),
  );
  const cursor = compact ? undefined : pointer;
  const cursorX = cursor ? (rtl ? 1 - cursor.x : cursor.x) : 0.5;
  const cursorPush = (cursorX - 0.5) * 90 * (cursor?.strength ?? 0);
  const points: RibbonPoint[] = [];

  for (let index = 0; index <= count; index += 1) {
    const t = -0.3 + (index / count) * 1.6;
    const wave = t * 4.6 + phase + 1.25;
    const secondary = t * 7.4 - phase * 0.62;
    const swell = t * 5.2 - time * 0.58;
    const ripple = t * 9.6 + time * 0.36;
    const cursorDistance = t - (cursor?.y ?? 0.5);
    const cursorWeight = Math.exp(-(cursorDistance * cursorDistance) / 0.1225);
    const x =
      width * (0.57 + 0.37 * Math.sin(wave) + 0.045 * Math.sin(secondary)) +
      waveAmplitude * (Math.sin(swell) + 0.28 * Math.sin(ripple)) +
      cursorPush * (0.2 + 0.8 * cursorWeight);
    const derivative =
      (width * (1.702 * Math.cos(wave) + 0.333 * Math.cos(secondary)) +
        waveAmplitude * (5.2 * Math.cos(swell) + 2.688 * Math.cos(ripple)) -
        (cursorPush * 0.8 * cursorWeight * 2 * cursorDistance) / 0.1225) /
      height;
    const length = Math.hypot(1, derivative);

    points.push({
      x: rtl ? width - x : x,
      y: t * height,
      normalX: (rtl ? -1 : 1) / length,
      normalY: -derivative / length,
      spread:
        halfWidth *
        (0.78 + 0.22 * Math.sin(t * 3.1 + phase * 0.75)) *
        (1 + 0.035 * Math.sin(t * 4.8 - time * 0.7)),
      twist:
        t * 3.7 +
        phase * 1.22 +
        0.07 * Math.sin(t * 3.6 - time * 0.45) +
        (cursorX - 0.5) * (cursor?.strength ?? 0) * cursorWeight * 0.12,
      t,
    });
  }

  return { points, phase: phase + Math.sin(time * 0.4) * 0.08 };
}

function traceRibbon(
  context: CanvasRenderingContext2D,
  points: RibbonPoint[],
  strand: number,
  phase: number,
) {
  context.beginPath();

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];
    const twist = point.twist + strand * 0.13;
    const fold = Math.cos(twist);
    const offset = point.spread * strand * (0.2 + fold * 0.8);
    const depth = Math.sin(twist) * point.spread * strand * 0.18;
    const filament =
      Math.sin(point.t * 5.4 + phase + strand * 4.3) * strand * 2;
    const x = point.x + point.normalX * (offset + filament);
    const y = point.y + point.normalY * offset + depth;

    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
}

export default function drawScrollRibbon(
  context: CanvasRenderingContext2D,
  frame: RibbonFrame,
  glowLayer?: GlowLayer,
) {
  const { width, height, scrollY, compact } = frame;
  const { points, phase } = sampleRibbon(frame);
  const stars = [
    ...sampleAmbientStars(frame, points),
    ...sampleRibbonStars(frame, points, phase),
  ];
  const heroPresence = Math.max(0, 1 - scrollY / (height * 0.85));
  const intensity = compact
    ? 0.34 + heroPresence * 0.16
    : 0.46 + heroPresence * 0.35;

  context.clearRect(-2, -2, width + 4, height + 4);
  context.save();
  context.globalAlpha = intensity;

  // Blur the atmosphere at reduced resolution, then composite it once. The
  // crisp filaments use source-over instead of costly screen blending per line.
  const atmosphere = glowLayer?.context ?? context;
  atmosphere.save();
  if (glowLayer) atmosphere.clearRect(-2, -2, width + 4, height + 4);
  atmosphere.lineCap = "round";
  atmosphere.lineJoin = "round";
  const glow = atmosphere.createLinearGradient(0, 0, width, height);
  glow.addColorStop(0, "rgba(20, 70, 235, 0.03)");
  glow.addColorStop(0.4, "rgba(20, 115, 255, 0.15)");
  glow.addColorStop(0.7, "rgba(65, 186, 255, 0.25)");
  glow.addColorStop(1, "rgba(14, 65, 225, 0.04)");
  atmosphere.strokeStyle = glow;

  atmosphere.shadowColor = "rgba(25, 135, 255, 0.7)";
  atmosphere.shadowBlur = glowLayer ? (compact ? 12 : 28) * glowLayer.scale : 0;
  atmosphere.lineWidth = compact ? 46 : 120;
  traceRibbon(atmosphere, points, 0, phase);
  atmosphere.stroke();
  atmosphere.shadowBlur = glowLayer ? (compact ? 6 : 15) * glowLayer.scale : 0;
  atmosphere.lineWidth = compact ? 16 : 40;
  traceRibbon(atmosphere, points, -0.08, phase);
  atmosphere.stroke();
  // One cached halo sprite keeps the stars soft without a shadow/filter per
  // particle. Their bloom shares the ribbon's existing low-resolution buffer.
  if (glowLayer?.starSprite) {
    atmosphere.shadowBlur = 0;
    for (const star of stars) {
      if (star.alpha <= 0) continue;
      if (star.focus) {
        const focusRadius = (compact ? 42 : 90) + star.twinkle * 25;
        atmosphere.globalAlpha = star.alpha * (compact ? 0.1 : 0.18);
        atmosphere.drawImage(
          glowLayer.starSprite,
          star.x - focusRadius,
          star.y - focusRadius,
          focusRadius * 2,
          focusRadius * 2,
        );
      }
      const radius = star.flare ? 19 + star.twinkle * 6 : 8 + star.radius * 3;
      atmosphere.globalAlpha = star.alpha * (star.flare ? 0.85 : 0.55);
      atmosphere.drawImage(
        glowLayer.starSprite,
        star.x - radius,
        star.y - radius,
        radius * 2,
        radius * 2,
      );
    }
  }
  atmosphere.restore();

  if (glowLayer) {
    context.globalCompositeOperation = "screen";
    context.drawImage(glowLayer.canvas, 0, 0, width, height);
  }
  context.globalCompositeOperation = "source-over";
  context.lineCap = "round";
  context.lineJoin = "round";

  const strands = compact ? 16 : 36;
  const light = context.createLinearGradient(0, 0, 0, height);
  light.addColorStop(0, "rgba(22, 91, 232, 0.12)");
  light.addColorStop(0.24, "rgba(45, 133, 255, 0.56)");
  light.addColorStop(0.54, "rgba(155, 231, 255, 0.96)");
  light.addColorStop(0.78, "rgba(59, 151, 255, 0.65)");
  light.addColorStop(1, "rgba(23, 85, 226, 0.16)");
  context.strokeStyle = light;

  for (let index = 0; index < strands; index += 1) {
    const strand = (index / (strands - 1)) * 2 - 1;
    context.globalAlpha = intensity * (0.34 + (1 - Math.abs(strand)) * 0.66);
    context.lineWidth = index % 7 === 0 ? 1.3 : 0.65;
    traceRibbon(context, points, strand, phase);
    context.stroke();
  }

  // A brighter pair of strands gives the band a readable core as it folds.
  context.globalAlpha = intensity * 0.95;
  context.strokeStyle = "rgba(185, 239, 255, 0.9)";
  context.lineWidth = compact ? 0.8 : 1.4;
  traceRibbon(context, points, 0.12, phase);
  context.stroke();
  context.globalAlpha = intensity * 0.45;
  context.lineWidth = 0.6;
  traceRibbon(context, points, -0.28, phase);
  context.stroke();

  // Sparse points and a few four-point glints give the flow a stellar edge.
  // All are behind live content and share the same capped animation loop.
  for (const star of stars) {
    if (star.alpha <= 0) continue;
    context.globalAlpha = star.alpha * (compact ? 0.65 : 0.9);
    context.fillStyle = star.flare ? "#d9f6ff" : "#8bd4ff";
    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fill();
    if (star.flare) {
      const reach = (compact ? 2.7 : 3.8) + star.twinkle * 2;
      const waist = 0.65;
      context.globalAlpha *= 0.65;
      context.beginPath();
      context.moveTo(star.x, star.y - reach);
      context.lineTo(star.x + waist, star.y - waist);
      context.lineTo(star.x + reach, star.y);
      context.lineTo(star.x + waist, star.y + waist);
      context.lineTo(star.x, star.y + reach);
      context.lineTo(star.x - waist, star.y + waist);
      context.lineTo(star.x - reach, star.y);
      context.lineTo(star.x - waist, star.y - waist);
      context.closePath();
      context.fill();
    }
  }
  context.restore();
}
