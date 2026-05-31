export default function SectionHeading({ label, title, subtitle, align = "center" }) {
  const alignClass =
    align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <div className={`flex flex-col gap-3 mb-12 md:mb-16 ${alignClass}`}>
      <span className="text-xs font-medium uppercase tracking-[0.3em] text-blue-400/80">
        {label}
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-white/50 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
