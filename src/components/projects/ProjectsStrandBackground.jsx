import { useEffect, useRef } from "react";

const INTENSITY = 0.7;

const LAYERS = [
  {
    count: Math.round(980 * INTENSITY),
    speed: 0.32,
    maxLen: 12,
    opacity: 0.055,
    lineWidth: 0.35,
  },
  {
    count: Math.round(840 * INTENSITY),
    speed: 0.5,
    maxLen: 17,
    opacity: 0.09,
    lineWidth: 0.45,
  },
  {
    count: Math.round(630 * INTENSITY),
    speed: 0.72,
    maxLen: 22,
    opacity: 0.13,
    lineWidth: 0.55,
  },
];

function createStrands(width, height, layer) {
  const cx = width * 0.5;
  const cy = height * 0.48;
  const maxR = Math.hypot(width, height) * 0.58;

  return Array.from({ length: layer.count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * maxR;
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: 0,
      vy: 0,
      seed: Math.random() * 1000,
    };
  });
}

export default function ProjectsStrandBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, active: false });
  const prevMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let strands = [];
    let frameId = 0;
    let w = 0;
    let h = 0;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      strands = LAYERS.flatMap((layer) =>
        createStrands(w, h, layer).map((s) => ({ ...s, layer }))
      );
    };

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.vx = x - prevMouseRef.current.x;
      mouseRef.current.vy = y - prevMouseRef.current.y;
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.active = true;
      prevMouseRef.current = { x, y };
    };

    const handleLeave = () => {
      mouseRef.current.active = false;
    };

    const animate = () => {
      time += 1;
      const cx = w * 0.5;
      const cy = h * 0.48;
      const mouse = mouseRef.current;

      ctx.fillStyle = "rgba(5, 5, 6, 0.11)";
      ctx.fillRect(0, 0, w, h);

      for (const s of strands) {
        const { layer } = s;
        const dx = s.x - cx;
        const dy = s.y - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const angle = Math.atan2(dy, dx);

        const swirl =
          Math.sin(time * 0.0035 + dist * 0.01 + s.seed) * 0.45 +
          Math.cos(time * 0.0028 + s.seed * 0.6) * 0.2;
        const flowAngle = angle + swirl;
        const flow = layer.speed * (0.55 + Math.sin(time * 0.0018 + s.seed) * 0.35);

        s.vx += Math.cos(flowAngle) * flow * 0.035;
        s.vy += Math.sin(flowAngle) * flow * 0.035;

        if (mouse.active) {
          const mx = mouse.x - s.x;
          const my = mouse.y - s.y;
          const md = Math.hypot(mx, my);
          if (md < 260 && md > 0) {
            const force = (1 - md / 260) * 0.85;
            s.vx += (mx / md) * force * 0.12 + mouse.vx * force * 0.015;
            s.vy += (my / md) * force * 0.12 + mouse.vy * force * 0.015;
          }
        }

        s.vx *= 0.94;
        s.vy *= 0.94;
        s.x += s.vx;
        s.y += s.vy;

        const maxR = Math.hypot(w, h) * 0.62;
        if (dist > maxR || s.x < -50 || s.x > w + 50 || s.y < -50 || s.y > h + 50) {
          const spawnAngle = Math.random() * Math.PI * 2;
          const spawnDist = Math.random() * maxR * 0.12;
          s.x = cx + Math.cos(spawnAngle) * spawnDist;
          s.y = cy + Math.sin(spawnAngle) * spawnDist;
          s.vx = 0;
          s.vy = 0;
        }

        const speed = Math.hypot(s.vx, s.vy);
        const len = Math.min(speed * 9, layer.maxLen);
        if (len < 0.4) continue;

        const nx = s.vx / (speed || 1);
        const ny = s.vy / (speed || 1);
        const tone = 95 + layer.opacity * 400;
        const alpha = layer.opacity * Math.min(1, speed * 0.7 + 0.25);

        ctx.beginPath();
        ctx.moveTo(s.x - nx * len, s.y - ny * len);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = `rgba(${tone}, ${tone}, ${tone + 6}, ${alpha})`;
        ctx.lineWidth = layer.lineWidth;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      mouseRef.current.vx *= 0.86;
      mouseRef.current.vy *= 0.86;
      frameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 bg-[#050506]">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_0%,rgba(5,5,6,0.5)_70%,rgba(5,5,6,0.92)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050506]/60 via-transparent to-[#050506]/80" />
    </div>
  );
}
