export default function GlassCard({ children, className = "", hover = true }) {
  return (
    <div
      className={`glass-card rounded-2xl p-6 md:p-8 transition-all duration-500 ${
        hover ? "hover:border-white/15 hover:shadow-[0_8px_40px_rgba(59,130,246,0.12)] hover:-translate-y-1" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
