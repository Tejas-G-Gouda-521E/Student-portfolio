import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { skillCarousel as defaultItems } from "../../data/portfolio";

const TRANSITION_DURATION = 1.05;
const SETTLE_DURATION = 0.22;
const SPREAD_X = 130;
const ROTATE_Y = 32;
const DEPTH_Z = 90;
const OVERSHOOT = 0.07;

function wrapOffset(offset, total) {
  let o = offset;
  while (o > total / 2) o -= total;
  while (o < -total / 2) o += total;
  return o;
}

function normalizeOffsetNearPrevious(raw, previous, total) {
  let o = raw;
  while (o - previous > total / 2) o -= total;
  while (o - previous < -total / 2) o += total;
  return o;
}

function cardTransform(offset) {
  const abs = Math.abs(offset);
  const t = Math.min(abs, 1);
  const beyond = Math.max(0, abs - 1);

  const scale = 1 - t * 0.08 - beyond * 0.06;
  const opacity =
    abs <= 2.2
      ? Math.max(0.12, 1 - t * 0.22 - beyond * 0.18)
      : Math.max(0, 0.1 - beyond * 0.08);
  const x = offset * SPREAD_X * (1 + beyond * 0.06);
  const rotateY = offset * -ROTATE_Y;
  const z = -abs * DEPTH_Z - beyond * 40;
  const blur = Math.max(0, (abs - 0.35) * 3.5);

  return {
    x,
    rotateY,
    z,
    scale: Math.max(0.72, scale),
    opacity: Math.min(1, opacity),
    zIndex: 20 - abs * 8,
    blur,
  };
}

function SkillCard({ item, isCenter }) {
  return (
    <div
      className={`skill-card-face flex h-[380px] w-[260px] flex-col overflow-hidden rounded-xl border md:h-[400px] md:w-[280px] ${
        isCenter
          ? "border-white/20 bg-[#f5f5f5] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          : "border-white/10 bg-[#ececec]/95 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
      }`}
    >
      <div className="flex flex-1 flex-col justify-between p-8">
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-black/40">
          {item.category}
        </span>
        <div>
          <h3 className="text-3xl font-semibold tracking-tight text-black md:text-4xl">
            {item.name}
          </h3>
          <div className="mt-6 h-px w-12 bg-black/15" />
        </div>
        <p className="text-sm leading-relaxed text-black/45">
          Core technology in my creative development stack.
        </p>
      </div>
    </div>
  );
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function SkillsCarousel({ items = defaultItems }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRefs = useRef([]);
  const floatingRef = useRef(null);
  const animatingRef = useRef(false);
  const activeIndexRef = useRef(0);
  const centerFloatRef = useRef(0);
  const offsetProxiesRef = useRef([]);
  const tweenRef = useRef(null);

  const total = items.length;
  const activeItem = items[activeIndex];

  const applyCardTransform = (index, offset, motion = 0) => {
    const el = cardRefs.current[index];
    if (!el) return;

    const t = cardTransform(offset);
    const floatY = Math.sin(motion * Math.PI * 2.4) * 4 * (1 - motion * 0.35);

    gsap.set(el, {
      x: t.x,
      y: floatY,
      z: t.z,
      rotationY: t.rotateY,
      scale: t.scale,
      opacity: t.opacity,
      zIndex: t.zIndex,
      filter: t.blur > 0.05 ? `blur(${t.blur}px)` : "none",
      transformOrigin: "50% 50%",
      force3D: true,
    });

    const centerWeight = Math.max(0, 1 - Math.abs(offset) * 1.12);
    const face = el.querySelector(".skill-card-face");
    if (face) {
      const borderAlpha = lerp(0.1, 0.2, centerWeight);
      face.style.borderColor = `rgba(255,255,255,${borderAlpha})`;
      face.style.backgroundColor = centerWeight > 0.5 ? "#f5f5f5" : "rgba(236,236,236,0.95)";
      const shadowY = lerp(12, 24, centerWeight);
      const shadowBlur = lerp(40, 80, centerWeight);
      const shadowAlpha = lerp(0.35, 0.45, centerWeight);
      face.style.boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha})`;
    }
  };

  const syncFromCenter = (centerFloat, motion = 0) => {
    items.forEach((_, i) => {
      const raw = i - centerFloat;
      const proxy = offsetProxiesRef.current[i];
      const previous = proxy?.offset ?? wrapOffset(i - activeIndexRef.current, total);
      const offset = normalizeOffsetNearPrevious(raw, previous, total);

      if (proxy) proxy.offset = offset;
      else offsetProxiesRef.current[i] = { offset };

      applyCardTransform(i, offset, motion);
    });
  };

  useLayoutEffect(() => {
    centerFloatRef.current = activeIndexRef.current;
    offsetProxiesRef.current = items.map((_, i) => ({
      offset: wrapOffset(i - activeIndexRef.current, total),
    }));
    syncFromCenter(activeIndexRef.current, 0);
  }, [items, total]);

  const animateToIndex = (targetIndex) => {
    const from = activeIndexRef.current;
    if (targetIndex === from || animatingRef.current) return;

    animatingRef.current = true;
    setIsAnimating(true);
    tweenRef.current?.kill();

    let delta = targetIndex - from;
    if (delta > total / 2) delta -= total;
    if (delta < -total / 2) delta += total;

    const endCenter = from + delta;
    const overshootCenter = endCenter - Math.sign(delta || 1) * OVERSHOOT;
    const state = { center: centerFloatRef.current, motion: 0 };

    const updateAll = () => {
      items.forEach((_, i) => {
        const raw = i - state.center;
        const proxy = offsetProxiesRef.current[i];
        const previous = proxy?.offset ?? raw;
        const offset = normalizeOffsetNearPrevious(raw, previous, total);
        proxy.offset = offset;
        applyCardTransform(i, offset, state.motion);
      });
    };

    const tl = gsap.timeline({
      onComplete: () => {
        centerFloatRef.current = targetIndex;
        activeIndexRef.current = targetIndex;
        offsetProxiesRef.current = items.map((_, i) => ({
          offset: wrapOffset(i - targetIndex, total),
        }));
        syncFromCenter(targetIndex, 0);
        setActiveIndex(targetIndex);
        animatingRef.current = false;
        setIsAnimating(false);
        tweenRef.current = null;
      },
    });

    tl.to(state, {
      center: overshootCenter,
      motion: 1,
      duration: TRANSITION_DURATION,
      ease: "power3.inOut",
      onUpdate: updateAll,
    }).to(state, {
      center: endCenter,
      motion: 0,
      duration: SETTLE_DURATION,
      ease: "power2.out",
      onUpdate: updateAll,
    });

    tweenRef.current = tl;
  };

  const navigate = (dir) => {
    const target = (activeIndexRef.current + dir + total) % total;
    animateToIndex(target);
  };

  useEffect(() => {
    const el = floatingRef.current;
    if (!el) return;

    gsap.to(el, {
      y: -6,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div
        className="relative flex h-[440px] items-center justify-center md:h-[480px]"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 45%" }}
      >
        <div ref={floatingRef} className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          {items.map((item, i) => {
            const offset = wrapOffset(i - activeIndex, total);
            const isCenter = Math.abs(offset) < 0.05;

            return (
              <div
                key={item.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute left-1/2 top-1/2"
                style={{
                  transformStyle: "preserve-3d",
                  marginLeft: "-130px",
                  marginTop: "-190px",
                  willChange: "transform, opacity",
                }}
              >
                <SkillCard item={item} isCenter={isCenter} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-8 md:gap-12">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={isAnimating}
          aria-label="Previous skill"
          className="hover-interactive hover-interactive--icon group flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 disabled:opacity-40"
        >
          <svg
            className="h-4 w-4 text-white/70 transition-transform duration-300 group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="min-w-[140px] text-center">
          <h3 className="font-serif text-2xl tracking-tight text-white md:text-3xl">
            {activeItem.name}
          </h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-white/40">
            {activeItem.category}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(1)}
          disabled={isAnimating}
          aria-label="Next skill"
          className="hover-interactive hover-interactive--icon group flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 disabled:opacity-40"
        >
          <svg
            className="h-4 w-4 text-white/70 transition-transform duration-300 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
