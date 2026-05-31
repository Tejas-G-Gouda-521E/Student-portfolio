import { personalInfo } from "../data/portfolio";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050506] py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-8">
        <p className="text-sm text-white/30">
          &copy; {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
        </p>
        <p className="text-xs text-white/20">
          Built with React, Three.js & GSAP
        </p>
      </div>
    </footer>
  );
}
