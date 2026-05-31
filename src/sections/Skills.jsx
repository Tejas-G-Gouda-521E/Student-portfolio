import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SkillsParticleBackground from "../components/skills/SkillsParticleBackground";
import SkillsCarousel from "../components/skills/SkillsCarousel";
import { skillCarousel } from "../data/portfolio";

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".skills-heading", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".skills-carousel-wrap", {
        y: 50,
        opacity: 0,
        duration: 1.1,
        ease: "power2.out",
        delay: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-black py-24 md:py-32"
    >
      <SkillsParticleBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
        <div className="skills-heading mb-16 text-center md:mb-20">
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-white/40">
            Skills
          </span>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-white md:text-5xl lg:text-6xl">
            Tools & Technologies
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/45 md:text-lg">
            A curated stack for building premium digital products.
          </p>
        </div>

        <div className="skills-carousel-wrap">
          <SkillsCarousel items={skillCarousel} />
        </div>
      </div>
    </section>
  );
}
