import { useEffect, useRef } from "react";

export function useCinematicFloat({ amplitude = 2, period = 48 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const t = (now - start) / 1000;
      const x = Math.sin(t * ((Math.PI * 2) / period)) * amplitude * 0.55;
      const y = Math.cos(t * ((Math.PI * 2) / (period * 1.4))) * amplitude * 0.35;
      const scale = 1 + Math.sin(t * ((Math.PI * 2) / (period * 2.5))) * 0.0015;

      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [amplitude, period]);

  return ref;
}
