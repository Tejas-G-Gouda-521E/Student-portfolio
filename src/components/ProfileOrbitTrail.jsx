import { useEffect, useRef } from "react";

const COLOR = { r: 198, g: 212, b: 228 };
const TRAIL_LENGTH = 150;
const ORBIT_SPEED = 0.065;
const PARTICLE_RADIUS = 4.5;
const GLOW_RADIUS = 20;
const WRAP_THRESHOLD = 48;
const ACCENT_TYPES = ["zigzag", "swirl", "loop"];

function smoothstep(t) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

function pointOnRoundedRect(t, w, h, radius, cx, cy) {
  const r = Math.min(radius, w / 2, h / 2);
  const hw = w / 2;
  const hh = h / 2;
  const top = w - 2 * r;
  const side = h - 2 * r;
  const arc = (Math.PI * r) / 2;
  const perim = 2 * top + 2 * side + 4 * arc;
  let d = ((t % 1) + 1) % 1;
  d *= perim;

  const x0 = cx - hw + r;
  const y0 = cy - hh;

  if (d <= top) return { x: x0 + d, y: y0 };
  d -= top;
  if (d <= arc) {
    const a = -Math.PI / 2 + d / r;
    return { x: cx + hw - r + Math.cos(a) * r, y: y0 + r + Math.sin(a) * r };
  }
  d -= arc;
  if (d <= side) return { x: cx + hw, y: y0 + r + d };
  d -= side;
  if (d <= arc) {
    const a = d / r;
    return { x: cx + hw - r + Math.cos(a) * r, y: cy + hh - r + Math.sin(a) * r };
  }
  d -= arc;
  if (d <= top) return { x: cx + hw - r - d, y: cy + hh };
  d -= top;
  if (d <= arc) {
    const a = Math.PI / 2 + d / r;
    return { x: cx - hw + r + Math.cos(a) * r, y: cy + hh - r + Math.sin(a) * r };
  }
  d -= arc;
  if (d <= side) return { x: cx - hw, y: cy + hh - r - d };
  d -= side;
  const a = Math.PI + d / r;
  return { x: cx - hw + r + Math.cos(a) * r, y: y0 + r + Math.sin(a) * r };
}

function getPathTangent(tNorm, rw, rh, radius, cx, cy) {
  const eps = 0.004;
  const p1 = pointOnRoundedRect(tNorm, rw, rh, radius, cx, cy);
  let p2 = pointOnRoundedRect(tNorm + eps, rw, rh, radius, cx, cy);
  let tx = p2.x - p1.x;
  let ty = p2.y - p1.y;
  if (Math.hypot(tx, ty) > 30) {
    p2 = pointOnRoundedRect(tNorm - eps, rw, rh, radius, cx, cy);
    tx = p1.x - p2.x;
    ty = p1.y - p2.y;
  }
  const len = Math.hypot(tx, ty) || 1;
  return { tx: tx / len, ty: ty / len, nx: -ty / len, ny: tx / len };
}

function computeAccentOffset(accent, progress, tangent) {
  const p = smoothstep(progress);
  const envelope = Math.sin(p * Math.PI);
  const amp = accent.amplitude * envelope;
  const { tx, ty, nx, ny } = tangent;

  if (accent.type === "zigzag") {
    const wave = Math.sin(p * Math.PI * 4 + accent.seed) * amp;
    const along = Math.sin(p * Math.PI * 2 + accent.seed * 0.5) * amp * 0.28;
    return { x: nx * wave + tx * along, y: ny * wave + ty * along };
  }

  if (accent.type === "swirl") {
    const angle = p * Math.PI * 2.8 + accent.seed;
    const cx = Math.cos(angle) * amp;
    const cy = Math.sin(angle) * amp;
    return { x: tx * cx - nx * cy * 0.35, y: ty * cx - ny * cy * 0.35 };
  }

  const angle = p * Math.PI * 2 + accent.seed;
  const r = amp * (0.65 + 0.35 * Math.sin(p * Math.PI));
  return { x: Math.cos(angle) * r, y: Math.sin(angle) * r * 0.8 };
}

function createAccent() {
  return {
    type: ACCENT_TYPES[Math.floor(Math.random() * ACCENT_TYPES.length)],
    progress: 0,
    duration: 1.05 + Math.random() * 0.45,
    amplitude: 7 + Math.random() * 5,
    seed: Math.random() * Math.PI * 2,
    phase: "play",
    returnProgress: 0,
    returnDuration: 0.75 + Math.random() * 0.25,
    endOffset: { x: 0, y: 0 },
  };
}

function createParticles() {
  return [
    { phase: 0, trail: [], accent: null, nextAccentTime: 2 + Math.random() * 2 },
    { phase: 0.5, trail: [], accent: null, nextAccentTime: 4 + Math.random() * 2 },
  ];
}

export default function ProfileOrbitTrail({
  className = "",
  imageInset = 32,
  orbitGap = 14,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef({
    t: 0,
    clock: 0,
    particles: createParticles(),
    mouse: { x: 0, y: 0, vx: 0, vy: 0, active: false },
    prevMouse: { x: 0, y: 0 },
    lastTime: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    let frameId = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const state = stateRef.current;
      state.mouse.vx = x - state.prevMouse.x;
      state.mouse.vy = y - state.prevMouse.y;
      state.mouse.x = x;
      state.mouse.y = y;
      state.mouse.active = true;
      state.prevMouse = { x, y };
    };

    const handleLeave = () => {
      stateRef.current.mouse.active = false;
    };

    const getOrbitGeometry = () => {
      const cx = w / 2;
      const cy = h / 2;
      const pathInset = Math.max(8, imageInset - orbitGap);
      const rw = Math.max(40, w - pathInset * 2);
      const rh = Math.max(40, h - pathInset * 2);
      const radius = Math.min(32, rw * 0.1, rh * 0.1);
      return { cx, cy, rw, rh, radius };
    };

    const getBaseOrbitPoint = (tNorm, geom) => {
      const { cx, cy, rw, rh, radius } = geom;
      let { x, y } = pointOnRoundedRect(tNorm, rw, rh, radius, cx, cy);
      const state = stateRef.current;

      if (state.mouse.active) {
        const dx = state.mouse.x - x;
        const dy = state.mouse.y - y;
        const dist = Math.hypot(dx, dy);
        if (dist < 220 && dist > 0) {
          const pull = (1 - dist / 220) * 0.16;
          x += dx * pull;
          y += dy * pull;
        }
        x += state.mouse.vx * 0.06;
        y += state.mouse.vy * 0.06;
      }

      return { x, y };
    };

    const updateAccent = (particle, delta, tNorm, geom) => {
      const state = stateRef.current;

      if (!particle.accent) {
        if (state.clock >= particle.nextAccentTime) {
          particle.accent = createAccent();
          particle.nextAccentTime = state.clock + 3.5 + Math.random() * 3.5;
        }
        return { x: 0, y: 0 };
      }

      const accent = particle.accent;
      const tangent = getPathTangent(tNorm, geom.rw, geom.rh, geom.radius, geom.cx, geom.cy);

      if (accent.phase === "play") {
        accent.progress += delta / accent.duration;
        if (accent.progress >= 1) {
          accent.progress = 1;
          accent.phase = "return";
          accent.returnProgress = 0;
          accent.endOffset = computeAccentOffset(accent, 1, tangent);
        }
        return computeAccentOffset(accent, accent.progress, tangent);
      }

      accent.returnProgress += delta / accent.returnDuration;
      const blend = 1 - smoothstep(Math.min(accent.returnProgress, 1));

      if (accent.returnProgress >= 1) {
        particle.accent = null;
        return { x: 0, y: 0 };
      }

      return {
        x: accent.endOffset.x * blend,
        y: accent.endOffset.y * blend,
      };
    };

    const pushTrailPoint = (trail, x, y) => {
      if (trail.length > 0) {
        const last = trail[trail.length - 1];
        if (Math.hypot(x - last.x, y - last.y) > WRAP_THRESHOLD) {
          trail.length = 0;
          trail.push({ x, y });
          return;
        }
      }
      trail.push({ x, y });
      if (trail.length > TRAIL_LENGTH) trail.shift();
    };

    const drawTrail = (trail) => {
      if (trail.length < 2) return;

      for (let i = 1; i < trail.length; i++) {
        const progress = i / trail.length;
        const alpha = Math.pow(progress, 1.45) * 0.62;
        const width = 1.2 + progress * 2.2;

        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = `rgba(${COLOR.r}, ${COLOR.g}, ${COLOR.b}, ${alpha})`;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      const head = trail[trail.length - 1];
      const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, GLOW_RADIUS);
      glow.addColorStop(0, `rgba(${COLOR.r}, ${COLOR.g}, ${COLOR.b}, 0.55)`);
      glow.addColorStop(0.35, `rgba(${COLOR.r}, ${COLOR.g}, ${COLOR.b}, 0.2)`);
      glow.addColorStop(1, `rgba(${COLOR.r}, ${COLOR.g}, ${COLOR.b}, 0)`);

      ctx.beginPath();
      ctx.arc(head.x, head.y, GLOW_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(head.x, head.y, PARTICLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235, 242, 250, 0.92)`;
      ctx.fill();
    };

    const animate = (now) => {
      const state = stateRef.current;
      if (!state.lastTime) state.lastTime = now;
      const delta = Math.min((now - state.lastTime) / 1000, 0.05);
      state.lastTime = now;
      state.clock += delta;

      state.t += ORBIT_SPEED * delta;
      const geom = getOrbitGeometry();

      state.mouse.vx *= 0.88;
      state.mouse.vy *= 0.88;

      ctx.clearRect(0, 0, w, h);

      for (const particle of state.particles) {
        const tNorm = (state.t + particle.phase) % 1;
        const base = getBaseOrbitPoint(tNorm, geom);
        const accent = updateAccent(particle, delta, tNorm, geom);

        const x = base.x + accent.x;
        const y = base.y + accent.y;

        pushTrailPoint(particle.trail, x, y);
        drawTrail(particle.trail);
      }

      frameId = requestAnimationFrame(animate);
    };

    resize();
    stateRef.current.lastTime = 0;
    stateRef.current.clock = 0;
    stateRef.current.particles = createParticles();
    frameId = requestAnimationFrame(animate);

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, [imageInset, orbitGap]);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
