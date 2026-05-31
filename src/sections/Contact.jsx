import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlassCard from "../components/GlassCard";
import SectionHeading from "../components/SectionHeading";
import { personalInfo, socialLinks } from "../data/portfolio";

gsap.registerPlugin(ScrollTrigger);

const socialIcons = {
  github: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  twitter: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  dribbble: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm7.885 5.785a10.07 10.07 0 011.666 5.615c-.18.04-1.893.402-3.63.188-.06-.465-.135-.93-.24-1.395 1.912-.795 2.205-4.408 2.205-4.408zM12 2.16c2.07 0 3.945.795 5.355 2.085-.12.105-1.17 1.005-3.675 1.23-.945-1.74-2.01-3.195-2.145-3.33C10.785 2.22 11.385 2.16 12 2.16zM8.67 2.655c.12.135 1.17 1.59 2.1 3.375-2.655.705-5.01.75-5.28.75a9.915 9.915 0 014.18-4.125zM2.16 12c0-.27.045-.54.075-.81 2.55.075 5.28-.315 8.145-1.2.225.705.42 1.44.57 2.19-3.195 1.005-5.565 3.855-6.015 4.125A9.893 9.893 0 012.16 12zm3.57 6.015c.345-.27 2.385-2.01 5.355-2.805.915 2.37 1.29 4.35 1.395 4.95a9.878 9.878 0 01-6.75-2.145zm8.685 2.22c-.09-.525-.435-2.415-1.275-4.65 2.085-.3 3.93.285 4.155.375a9.934 9.934 0 01-2.88 4.275z" />
    </svg>
  ),
};

export default function Contact() {
  const sectionRef = useRef(null);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-reveal", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" ref={sectionRef} className="section-padding relative bg-[#0a0a0b]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="contact-reveal">
          <SectionHeading
            label="Contact"
            title="Let's create something amazing"
            subtitle="Have a project in mind? I'd love to hear about it."
          />
        </div>

        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="contact-reveal lg:col-span-2 space-y-6">
            <GlassCard hover={false}>
              <h3 className="mb-2 text-lg font-semibold text-white">Get in touch</h3>
              <p className="text-sm leading-relaxed text-white/50">
                I'm always open to discussing new projects, creative ideas, or opportunities to
                be part of your vision.
              </p>

              <div className="mt-6 space-y-4">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="hover-interactive flex items-center gap-3 text-sm text-white/70"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  {personalInfo.email}
                </a>
                <p className="flex items-center gap-3 text-sm text-white/70">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/5">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </span>
                  {personalInfo.location}
                </p>
              </div>
            </GlassCard>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="hover-interactive hover-interactive--icon contact-reveal flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/60"
                >
                  {socialIcons[social.icon]}
                </a>
              ))}
            </div>
          </div>

          <GlassCard className="contact-reveal lg:col-span-3" hover={false}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-wider text-white/40">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/20"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-wider text-white/40">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/20"
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-wider text-white/40">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full resize-none rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/20"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button
                type="submit"
                className="hover-interactive hover-interactive--solid group relative w-full overflow-hidden rounded-xl bg-white py-3.5 text-sm font-medium text-black sm:w-auto sm:px-10"
              >
                {submitted ? "Message Sent!" : "Send Message"}
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
