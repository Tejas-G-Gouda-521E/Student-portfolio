import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: options.y ?? 60,
        opacity: 0,
        duration: options.duration ?? 1,
        ease: options.ease ?? "power3.out",
        scrollTrigger: {
          trigger: el,
          start: options.start ?? "top 85%",
          end: options.end ?? "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => ctx.revert();
  }, [options.y, options.duration, options.ease, options.start, options.end]);

  return ref;
}

export function useStaggerAnimation(selector, options = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    if (!elements.length) return;

    const ctx = gsap.context(() => {
      gsap.from(elements, {
        y: options.y ?? 40,
        opacity: 0,
        duration: options.duration ?? 0.8,
        stagger: options.stagger ?? 0.12,
        ease: options.ease ?? "power3.out",
        scrollTrigger: {
          trigger: container,
          start: options.start ?? "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => ctx.revert();
  }, [selector, options.y, options.duration, options.stagger, options.ease, options.start]);

  return containerRef;
}
