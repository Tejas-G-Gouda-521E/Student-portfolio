import Snowfall from "./Snowfall";
import MountainSilhouette from "./MountainSilhouette";
import { useCinematicFloat } from "../hooks/useCinematicFloat";

export default function HeroBackground() {
  const floatRef = useCinematicFloat({ amplitude: 2, period: 48 });

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Smooth sky gradient — no mid-screen band */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              180deg,
              #060608 0%,
              #0c0c0e 12%,
              #121214 24%,
              #18181a 38%,
              #1e1e20 52%,
              #222224 64%,
              #1a1a1c 76%,
              #101012 88%,
              #060608 100%
            )
          `,
        }}
      />

      <div
        ref={floatRef}
        className="absolute inset-[-1.5%] will-change-transform"
        style={{ transformOrigin: "50% 35%" }}
      >
        {/* Top vignette */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-black/75 via-black/15 to-transparent" />

        {/* Subtle atmospheric depth — vertical only, no horizontal band */}
        <div className="pointer-events-none absolute inset-x-0 top-[8%] h-[55%] bg-gradient-to-b from-transparent via-white/[0.004] to-transparent" />

        {/* Horizon glow — sits behind mountains in lower area only */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[22vh] h-36 md:bottom-[26vh]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_80%,rgba(255,255,255,0.045)_0%,transparent_65%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a]/15 via-transparent to-transparent" />
        </div>

        <Snowfall />
        <MountainSilhouette />

        {/* Ground fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Fixed frame vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
