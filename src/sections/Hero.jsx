import { useEffect, useRef } from "react";
import gsap from "gsap";
import HeroBackground from "../components/HeroBackground";
import { useSubtleParallax } from "../hooks/useSubtleParallax";
import { personalInfo } from "../data/portfolio";

export default function Hero() {
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const parallaxRef = useSubtleParallax(10);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".navbar-entrance", { opacity: 0, y: -12 });
      gsap.set(".hero-eyebrow", { opacity: 0, y: 16 });
      gsap.set(".hero-title", { opacity: 0, scale: 0.8, transformOrigin: "50% 50%" });
      gsap.set(".hero-subtitle", { opacity: 0, y: 24 });
      gsap.set(".hero-tagline", { opacity: 0, y: 20 });
      gsap.set(".hero-btn", { opacity: 0, y: 18 });
      gsap.set(".hero-mountains", { y: "100%" });
      gsap.set(".hero-scroll", { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.to(".navbar-entrance", { opacity: 1, y: 0, duration: 1.2 }, 0)
        .to(".hero-mountains", { y: "0%", duration: 2.5, ease: "expo.out" }, 0.15)
        .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 1.4 }, 0.2)
        .to(".hero-title", { opacity: 1, scale: 1, duration: 1.7 }, 0.35)
        .to(".hero-subtitle", { opacity: 1, y: 0, duration: 1.5 }, 0.55)
        .to(".hero-tagline", { opacity: 1, y: 0, duration: 1.4 }, 0.75)
        .to(".hero-btn", { opacity: 1, y: 0, duration: 1.3, stagger: 0.12 }, 0.95)
        .to(".hero-scroll", { opacity: 1, duration: 1.2 }, 1.4);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <HeroBackground />

      <div
        ref={parallaxRef}
        className="relative z-10 mx-auto max-w-7xl px-6 text-center md:px-8"
      >
        <p className="hero-eyebrow mb-4 text-xs font-medium uppercase tracking-[0.4em] text-white/40">
          AI · Technology · Design
        </p>

        <h1 className="hero-title text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
          <span className="text-gradient">{personalInfo.name}</span>
        </h1>

        <p className="hero-subtitle mt-4 text-xl font-light tracking-tight text-white/70 md:text-2xl lg:text-3xl">
          {personalInfo.title}
        </p>

        <p className="hero-tagline mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/40 md:text-lg">
          {personalInfo.tagline}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#projects"
            className="hover-interactive hover-interactive--solid hero-btn rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="hover-interactive hero-btn rounded-full border border-white/12 bg-white/[0.04] px-8 py-3.5 text-sm font-medium text-white/90 backdrop-blur-sm"
          >
            Get In Touch
          </a>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="hero-scroll absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">Scroll</span>
        <div className="h-10 w-px bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
