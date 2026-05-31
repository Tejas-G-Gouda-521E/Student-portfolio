import { useEffect, useRef } from "react";

const LAYERS = [
  { count: 1400, speed: 0.35, maxLen: 14, opacity: 0.08, lineWidth: 0.4 },
  { count: 1200, speed: 0.55, maxLen: 20, opacity: 0.14, lineWidth: 0.55 },
  { count: 900, speed: 0.85, maxLen: 28, opacity: 0.22, lineWidth: 0.7 },
];

function createParticles(width, height, layer) {
  const cx = width * 0.5;
  const cy = height * 0.52;
  const maxR = Math.hypot(width, height) * 0.55;

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

export default function SkillsParticleBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, active: false });
  const prevMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let particles = [];
    let frameId = 0;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = LAYERS.flatMap((layer) =>
        createParticles(w, h, layer).map((p) => ({ ...p, layer }))
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
      const cy = h * 0.52;
      const mouse = mouseRef.current;

      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        const { layer } = p;
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const angle = Math.atan2(dy, dx);

        const swirl =
          Math.sin(time * 0.004 + dist * 0.012 + p.seed) * 0.55 +
          Math.cos(time * 0.003 + p.seed * 0.5) * 0.25;
        const flowAngle = angle + swirl;
        const flow = layer.speed * (0.6 + Math.sin(time * 0.002 + p.seed) * 0.4);

        p.vx += Math.cos(flowAngle) * flow * 0.04;
        p.vy += Math.sin(flowAngle) * flow * 0.04;

        if (mouse.active) {
          const mx = mouse.x - p.x;
          const my = mouse.y - p.y;
          const md = Math.hypot(mx, my);
          if (md < 280 && md > 0) {
            const force = (1 - md / 280) * 1.2;
            p.vx += (mx / md) * force * 0.15 + mouse.vx * force * 0.02;
            p.vy += (my / md) * force * 0.15 + mouse.vy * force * 0.02;
          }
        }

        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;

        const maxR = Math.hypot(w, h) * 0.65;
        if (dist > maxR || p.x < -40 || p.x > w + 40 || p.y < -40 || p.y > h + 40) {
          const spawnAngle = Math.random() * Math.PI * 2;
          const spawnDist = Math.random() * maxR * 0.15;
          p.x = cx + Math.cos(spawnAngle) * spawnDist;
          p.y = cy + Math.sin(spawnAngle) * spawnDist;
          p.vx = 0;
          p.vy = 0;
        }

        const speed = Math.hypot(p.vx, p.vy);
        const len = Math.min(speed * 10, layer.maxLen);
        if (len < 0.5) continue;

        const nx = p.vx / (speed || 1);
        const ny = p.vy / (speed || 1);
        const fade = layer.opacity * Math.min(1, speed * 0.8 + 0.2);

        ctx.beginPath();
        ctx.moveTo(p.x - nx * len, p.y - ny * len);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${fade})`;
        ctx.lineWidth = layer.lineWidth;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      mouseRef.current.vx *= 0.85;
      mouseRef.current.vy *= 0.85;
      frameId = requestAnimationFrame(animate);
    };

    resize();
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_52%,transparent_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}
