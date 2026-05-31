import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectsStrandBackground from "../components/projects/ProjectsStrandBackground";
import ProjectsCarousel from "../components/projects/ProjectsCarousel";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".projects-heading", {
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

      gsap.from(".projects-showcase", {
        y: 50,
        opacity: 0,
        duration: 1.1,
        ease: "power2.out",
        delay: 0.12,
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
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#050506] py-24 md:py-32"
    >
      <ProjectsStrandBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
        <div className="projects-heading mb-14 text-center md:mb-20">
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-white/40">
            Projects
          </span>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-white md:text-5xl lg:text-6xl">
            Selected Work
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/45 md:text-lg">
            Immersive digital experiences at the intersection of design, technology, and motion.
          </p>
        </div>

        <div className="projects-showcase">
          <ProjectsCarousel />
        </div>
      </div>
    </section>
  );
}
