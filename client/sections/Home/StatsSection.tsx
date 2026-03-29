const STATS = [
  { value: "1,200+", label: "AI Tools Listed", icon: "🤖" },
  { value: "50+", label: "Categories", icon: "📂" },
  { value: "8,000+", label: "User Reviews", icon: "⭐" },
  { value: "15k+", label: "Active Users", icon: "👥" },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-[#F8F9FF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(({ value, label, icon }) => (
            <div
              key={label}
              className="relative bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(27,20,100,.07)] border border-[#E8EAFF] hover:shadow-[0_8px_40px_rgba(27,20,100,.12)] hover:-translate-y-1 transition-all duration-300 text-center overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-linear-to-br from-[#2E4BC6]/5 to-[#00C2CB]/8 -translate-y-8 translate-x-8" />
              <div className="text-3xl mb-2">{icon}</div>
              <div
                className="font-display font-bold text-[#1B1464] mb-1"
                style={{ fontSize: "1.75rem" }}
              >
                {value}
              </div>
              <div className="text-[#1B1464]/55 text-sm font-medium">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
