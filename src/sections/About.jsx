import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassCard from "../components/GlassCard";
import ProfileOrbitTrail from "../components/ProfileOrbitTrail";
import SectionHeading from "../components/SectionHeading";
import { personalInfo } from "../data/portfolio";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-reveal", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(imageRef.current, {
        scale: 0.92,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: "5+", label: "Years Experience" },
    { value: "40+", label: "Projects Delivered" },
    { value: "12", label: "Technologies" },
  ];

  return (
    <section id="about" ref={sectionRef} className="section-padding relative bg-[#050506]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.025),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="about-reveal">
          <SectionHeading
            label="About Me"
            title="Building the future, one pixel at a time"
            subtitle="Passionate about creating digital experiences that inspire and engage."
          />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div ref={imageRef} className="relative aspect-square w-full max-w-md mx-auto lg:mx-0">
            <div className="absolute inset-0 z-0">
              <ProfileOrbitTrail imageInset={32} orbitGap={14} />
            </div>

            <GlassCard className="absolute inset-8 z-10 overflow-hidden !p-0 border-white/10">
              {!imgError ? (
                <img
                  src={personalInfo.profileImage}
                  alt={`Portrait of ${personalInfo.name}`}
                  className="h-full w-full object-cover object-center"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#111827] to-[#0a0a0b]">
                  <span className="text-5xl font-bold text-gradient">{personalInfo.name.charAt(0)}</span>
                </div>
              )}
            </GlassCard>
          </div>

          <div className="space-y-6">
            <p className="about-reveal text-base leading-relaxed text-white/60 md:text-lg">
              {personalInfo.bio}
            </p>
            <p className="about-reveal text-base leading-relaxed text-white/60 md:text-lg">
              I specialize in crafting immersive web experiences using cutting-edge technologies
              like React, Three.js, and GSAP. Every project is an opportunity to push boundaries
              and create something extraordinary.
            </p>

            <div className="about-reveal grid grid-cols-3 gap-4 pt-4">
              {stats.map((stat) => (
                <GlassCard key={stat.label} className="!p-4 text-center">
                  <p className="text-2xl font-bold text-gradient md:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-white/40">{stat.label}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
