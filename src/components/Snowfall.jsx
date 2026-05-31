import { useEffect, useRef } from "react";

const BASE_COUNT = 850;

function flakeCount(width, height) {
  const area = (width * height) / (1920 * 1080);
  return Math.round(BASE_COUNT * Math.max(0.75, Math.min(1.35, area)));
}

function createFlakes(width, height) {
  const count = flakeCount(width, height);

  return Array.from({ length: count }, () => {
    const depth = Math.random();
    const depthTier = depth < 0.45 ? 0 : depth < 0.78 ? 1 : 2;

    const tierScale = depthTier === 0 ? 0.65 : depthTier === 1 ? 0.85 : 1.1;
    const tierSpeed = depthTier === 0 ? 0.5 : depthTier === 1 ? 0.75 : 1;
    const tierOpacity = depthTier === 0 ? 0.55 : depthTier === 1 ? 0.75 : 1;

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      depth: depthTier,
      radius: (Math.random() * 1.6 + 0.5) * tierScale,
      speed: (Math.random() * 0.45 + 0.14) * tierSpeed * 1.5,
      drift: (Math.random() - 0.5) * 0.12,
      opacity: (Math.random() * 0.28 + 0.14) * tierOpacity,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.0025 + 0.0015,
    };
  });
}

export default function Snowfall() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let flakes = [];
    let animationId = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      flakes = createFlakes(w, h);
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      for (const flake of flakes) {
        flake.wobble += flake.wobbleSpeed;
        flake.y += flake.speed;
        flake.x += flake.drift + Math.sin(flake.wobble) * 0.05;

        if (flake.y > h + 8) {
          flake.y = -8;
          flake.x = Math.random() * w;
        }
        if (flake.x < -8) flake.x = w + 8;
        if (flake.x > w + 8) flake.x = -8;

        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(flake.opacity, 0.52)})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-snowfall pointer-events-none absolute inset-0 z-[3]"
      aria-hidden="true"
    />
  );
}
