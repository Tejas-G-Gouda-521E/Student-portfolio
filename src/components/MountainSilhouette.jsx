import { useMountainScrollParallax } from "../hooks/useMountainScrollParallax";

export default function MountainSilhouette() {
  const containerRef = useMountainScrollParallax();

  return (
    <div
      ref={containerRef}
      className="hero-mountains pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[36vh] min-h-[220px] md:h-[40vh]"
    >
      {/* Background ridge — slowest parallax */}
      <div className="mountain-layer-back absolute inset-x-0 bottom-0 will-change-transform">
        <svg
          viewBox="0 0 1440 480"
          preserveAspectRatio="none"
          className="block h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M0,480 L0,340 C160,310 320,280 480,300 C640,320 780,250 960,275 C1120,298 1280,230 1440,285 L1440,480 Z"
            fill="#131315"
            opacity="0.45"
          />
        </svg>
      </div>

      {/* Mid-ground peaks */}
      <div className="mountain-layer-mid absolute inset-x-0 bottom-0 will-change-transform">
        <svg
          viewBox="0 0 1440 480"
          preserveAspectRatio="none"
          className="block h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="mid-ridge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#161618" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0a0a0c" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M0,480 L0,360 C200,330 380,300 560,320 C740,340 900,280 1080,305 C1240,325 1340,295 1440,315 L1440,480 Z"
            fill="url(#mid-ridge)"
          />
        </svg>
      </div>

      {/* Foreground terrain — fastest parallax */}
      <div className="mountain-layer-front absolute inset-x-0 bottom-0 will-change-transform">
        <svg
          viewBox="0 0 1440 480"
          preserveAspectRatio="none"
          className="block h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="front-ridge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1c1c1e" stopOpacity="0" />
              <stop offset="28%" stopColor="#101012" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#050506" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M0,480 L0,395 C180,375 360,360 540,378 C720,396 880,365 1060,382 C1220,396 1340,372 1440,388 L1440,480 Z"
            fill="url(#front-ridge)"
          />
          <path
            d="M0,480 L0,420 C220,405 440,395 660,410 C880,425 1100,400 1440,415 L1440,480 Z"
            fill="#040404"
          />
        </svg>
      </div>

      {/* Atmospheric blend at mountain crests */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-transparent via-[#1a1a1a]/20 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#2a2a2a]/10 to-transparent blur-md" />
    </div>
  );
}
