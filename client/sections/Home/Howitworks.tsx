const STEPS = [
  {
    n: "01",
    title: "Discover",
    desc: "Search across 1000+ curated AI tools by name, category, or use-case.",
    icon: "🔍",
  },
  {
    n: "02",
    title: "Compare",
    desc: "Side-by-side feature and pricing comparison helps you evaluate quickly.",
    icon: "⚖️",
  },
  {
    n: "03",
    title: "Review",
    desc: "Read verified user reviews and community ratings before deciding.",
    icon: "⭐",
  },
  {
    n: "04",
    title: "Go Build",
    desc: "Head straight to the tool and start creating with confidence.",
    icon: "🚀",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#F8F9FF] relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-100 rounded-full bg-linear-to-r from-[#2E4BC6]/5 to-[#00C2CB]/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="text-[#2E4BC6] text-sm font-semibold uppercase tracking-wider mb-3 block">
            How It Works
          </span>
          <h2 className="font-display font-bold text-[#1B1464] text-3xl md:text-4xl mb-4">
            Simple. Fast. Effective.
          </h2>
          <p className="text-[#1B1464]/55 text-lg max-w-xl mx-auto">
            Four steps from confusion to clarity — find your AI tool in under a
            minute.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-linear-to-r from-transparent via-[#2E4BC6]/20 to-transparent" />

          {STEPS.map(({ n, title, desc, icon }, i) => (
            <div
              key={n}
              className="relative bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,20,100,.07)] border border-[#E8EAFF] hover:shadow-[0_8px_32px_rgba(27,20,100,.12)] hover:-translate-y-1 transition-all duration-300 text-center"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#E8EAFF] to-[#F8F9FF] flex items-center justify-center mx-auto mb-4 text-3xl border border-[#E8EAFF]">
                {icon}
              </div>
              <div className="text-xs font-bold text-[#2E4BC6] bg-[#E8EAFF] w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 font-display">
                {n}
              </div>
              <h3 className="font-display font-bold text-[#1B1464] text-lg mb-2">
                {title}
              </h3>
              <p className="text-[#1B1464]/55 text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
