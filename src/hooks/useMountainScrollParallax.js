import { useEffect, useRef } from "react";

const SCROLL_FACTORS = {
  back: 0.06,
  mid: 0.12,
  front: 0.2,
};

const BREATH_PERIOD = 15;
const FRONT_BREATH_AMP = 22;
const BACK_BREATH_AMP = 20;

export function useMountainScrollParallax() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const backEl = container.querySelector(".mountain-layer-back");
    const midEl = container.querySelector(".mountain-layer-mid");
    const frontEl = container.querySelector(".mountain-layer-front");

    const start = performance.now();
    let rafId = 0;

    const update = (now) => {
      const hero = document.getElementById("hero");
      let scrollBack = 0;
      let scrollMid = 0;
      let scrollFront = 0;

      if (hero) {
        const { top, height } = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -top / height));
        scrollBack = progress * height * SCROLL_FACTORS.back;
        scrollMid = progress * height * SCROLL_FACTORS.mid;
        scrollFront = progress * height * SCROLL_FACTORS.front;
      }

      const elapsed = (now - start) / 1000;
      const wave = Math.sin((elapsed * Math.PI * 2) / BREATH_PERIOD);
      const frontBreath = -wave * FRONT_BREATH_AMP;
      const backBreath = wave * BACK_BREATH_AMP;

      if (backEl) {
        backEl.style.transform = `translate3d(0, ${-scrollBack + backBreath}px, 0)`;
      }
      if (midEl) {
        midEl.style.transform = `translate3d(0, ${-scrollMid}px, 0)`;
      }
      if (frontEl) {
        frontEl.style.transform = `translate3d(0, ${-scrollFront + frontBreath}px, 0)`;
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return containerRef;
}
