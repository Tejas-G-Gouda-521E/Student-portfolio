import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { projects as defaultProjects } from "../../data/portfolio";

const TRANSITION_DURATION = 1;
const SPREAD_X = 320;
const ROTATE_Y = 28;
const DEPTH_Z = 110;

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

function cardTransformFromOffset(offset) {
  const abs = Math.abs(offset);
  const t = Math.min(abs, 1);
  const beyond = Math.max(0, abs - 1);

  const scale = 1 - t * 0.2 - beyond * 0.12;
  const opacity =
    abs <= 1.35
      ? 1 - t * 0.52 - beyond * 0.35
      : Math.max(0, 0.08 - beyond * 0.08);
  const x = offset * SPREAD_X * (1 + beyond * 0.08);
  const rotateY = offset * -ROTATE_Y;
  const z = -abs * DEPTH_Z - beyond * 45;
  const blur = Math.max(0, (abs - 0.55) * 5);

  return {
    x,
    rotateY,
    z,
    scale: Math.max(0.62, scale),
    opacity: Math.max(0, Math.min(1, opacity)),
    zIndex: 40 - abs * 14,
    blur,
  };
}

function ProjectCard({ project, index }) {
  return (
    <div className="project-card-inner flex h-[420px] w-[280px] flex-col overflow-hidden rounded-2xl border border-white/12 bg-white/[0.05] shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl md:h-[460px] md:w-[320px]">
      <div className="flex flex-1 flex-col justify-between p-7 md:p-8">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-widest text-white/30">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">
              {project.year}
            </span>
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
            {project.title}
          </h3>
          <div className="mt-5 h-px w-10 bg-white/15" />
        </div>

        <p className="text-sm leading-relaxed text-white/45 md:text-[15px]">
          {project.description}
        </p>

        <div>
          <div className="mb-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/40"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href={project.link}
            className="hover-interactive hover-interactive--icon project-card-cta inline-flex items-center gap-2 text-sm font-medium text-white/70"
          >
            View Project
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsCarousel({ items = defaultProjects }) {
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
  const activeProject = items[activeIndex];

  const applyCardTransform = (index, offset) => {
    const el = cardRefs.current[index];
    if (!el) return;

    const t = cardTransformFromOffset(offset);
    gsap.set(el, {
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      x: t.x,
      y: 0,
      z: t.z,
      rotationY: t.rotateY,
      scale: t.scale,
      opacity: t.opacity,
      zIndex: t.zIndex,
      filter: t.blur > 0.05 ? `blur(${t.blur}px)` : "none",
      transformOrigin: "50% 50%",
      force3D: true,
    });

    const centerWeight = Math.max(0, 1 - Math.abs(offset) * 1.1);
    const inner = el.querySelector(".project-card-inner");
    const cta = el.querySelector(".project-card-cta");
    if (inner) {
      inner.style.borderColor = `rgba(255,255,255,${0.08 + centerWeight * 0.08})`;
      inner.style.background = `rgba(255,255,255,${0.03 + centerWeight * 0.04})`;
      inner.style.boxShadow = `0 ${24 + centerWeight * 12}px ${70 + centerWeight * 20}px rgba(0,0,0,${0.45 + centerWeight * 0.12})`;
    }
    if (cta) {
      cta.style.opacity = String(Math.min(1, centerWeight * 1.35));
      cta.style.pointerEvents = centerWeight > 0.55 ? "auto" : "none";
    }
  };

  const syncOffsetsFromCenter = (centerFloat) => {
    items.forEach((_, i) => {
      const raw = i - centerFloat;
      const proxy = offsetProxiesRef.current[i];
      const previous = proxy?.offset ?? wrapOffset(i - activeIndexRef.current, total);
      const offset = normalizeOffsetNearPrevious(raw, previous, total);

      if (proxy) proxy.offset = offset;
      else offsetProxiesRef.current[i] = { offset };

      applyCardTransform(i, offset);
    });
  };

  useLayoutEffect(() => {
    centerFloatRef.current = activeIndexRef.current;
    offsetProxiesRef.current = items.map((_, i) => ({
      offset: wrapOffset(i - activeIndexRef.current, total),
    }));
    syncOffsetsFromCenter(activeIndexRef.current);
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

    const state = { center: centerFloatRef.current };
    const endCenter = from + delta;

    tweenRef.current = gsap.to(state, {
      center: endCenter,
      duration: TRANSITION_DURATION,
      ease: "power3.inOut",
      onUpdate: () => {
        centerFloatRef.current = state.center;
        items.forEach((_, i) => {
          const raw = i - state.center;
          const proxy = offsetProxiesRef.current[i];
          const previous = proxy?.offset ?? raw;
          const offset = normalizeOffsetNearPrevious(raw, previous, total);
          proxy.offset = offset;
          applyCardTransform(i, offset);
        });
      },
      onComplete: () => {
        centerFloatRef.current = targetIndex;
        activeIndexRef.current = targetIndex;
        offsetProxiesRef.current = items.map((_, i) => ({
          offset: wrapOffset(i - targetIndex, total),
        }));
        syncOffsetsFromCenter(targetIndex);
        setActiveIndex(targetIndex);
        animatingRef.current = false;
        setIsAnimating(false);
        tweenRef.current = null;
      },
    });
  };

  const navigate = (dir) => {
    const target = (activeIndexRef.current + dir + total) % total;
    animateToIndex(target);
  };

  useEffect(() => {
    const floatEl = floatingRef.current;
    if (!floatEl) return;

    gsap.to(floatEl, {
      y: -8,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <div
        className="relative flex h-[500px] items-center justify-center overflow-hidden md:h-[540px]"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 46%" }}
      >
        <div ref={floatingRef} className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          {items.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (animatingRef.current) return;
                const offset = offsetProxiesRef.current[i]?.offset ?? wrapOffset(i - activeIndexRef.current, total);
                if (Math.abs(offset) < 0.05) return;
                animateToIndex(i);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !animatingRef.current) {
                  const offset = offsetProxiesRef.current[i]?.offset ?? wrapOffset(i - activeIndexRef.current, total);
                  if (Math.abs(offset) >= 0.05) animateToIndex(i);
                }
              }}
              className="absolute cursor-pointer"
              style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
            >
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6">
        <div className="text-center">
          <h3 className="font-serif text-2xl tracking-tight text-white md:text-3xl">
            {activeProject.title}
          </h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-white/35">
            {activeProject.year}
          </p>
        </div>

        <div className="flex items-center gap-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isAnimating}
            aria-label="Previous project"
            className="hover-interactive hover-interactive--icon group flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-sm disabled:opacity-40"
          >
            <svg
              className="h-4 w-4 text-white/60 transition-transform duration-300 group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => navigate(1)}
            disabled={isAnimating}
            aria-label="Next project"
            className="hover-interactive hover-interactive--icon group flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-sm disabled:opacity-40"
          >
            <svg
              className="h-4 w-4 text-white/60 transition-transform duration-300 group-hover:translate-x-0.5"
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
    </div>
  );
}
