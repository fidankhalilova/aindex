import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATS = [
  {
    slug: "text-generation",
    label: "Text Generation",
    icon: "✍️",
    count: 240,
    color: "from-[#2E4BC6]/10 to-[#2E4BC6]/5",
    border: "border-[#2E4BC6]/15",
  },
  {
    slug: "image-generation",
    label: "Image Generation",
    icon: "🎨",
    count: 185,
    color: "from-[#7B5CF5]/10 to-[#7B5CF5]/5",
    border: "border-[#7B5CF5]/15",
  },
  {
    slug: "coding",
    label: "Coding & Dev",
    icon: "💻",
    count: 160,
    color: "from-[#00C2CB]/10 to-[#00C2CB]/5",
    border: "border-[#00C2CB]/15",
  },
  {
    slug: "productivity",
    label: "Productivity",
    icon: "⚡",
    count: 200,
    color: "from-[#F59E0B]/10 to-[#F59E0B]/5",
    border: "border-[#F59E0B]/15",
  },
  {
    slug: "data-analysis",
    label: "Data Analysis",
    icon: "📊",
    count: 130,
    color: "from-[#10B981]/10 to-[#10B981]/5",
    border: "border-[#10B981]/15",
  },
  {
    slug: "voice-audio",
    label: "Voice & Audio",
    icon: "🎙️",
    count: 95,
    color: "from-[#EF4444]/10 to-[#EF4444]/5",
    border: "border-[#EF4444]/15",
  },
  {
    slug: "video",
    label: "Video Creation",
    icon: "🎬",
    count: 110,
    color: "from-[#F97316]/10 to-[#F97316]/5",
    border: "border-[#F97316]/15",
  },
  {
    slug: "research",
    label: "Research",
    icon: "🔬",
    count: 80,
    color: "from-[#0EA5E9]/10 to-[#0EA5E9]/5",
    border: "border-[#0EA5E9]/15",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-[#F8F9FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[#2E4BC6] text-sm font-semibold uppercase tracking-wider mb-3 block">
              Categories
            </span>
            <h2 className="font-display font-bold text-[#1B1464] text-3xl md:text-4xl">
              Browse by Category
            </h2>
          </div>
          <Link
            href="/tools"
            className="hidden sm:flex items-center gap-1.5 text-[#2E4BC6] text-sm font-semibold hover:gap-2.5 transition-all duration-200"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATS.map(({ slug, label, icon, count, color, border }) => (
            <Link
              key={slug}
              href={`/tools?category=${slug}`}
              className={`group relative bg-linear-to-br ${color} border ${border} rounded-2xl p-5 hover:shadow-[0_8px_32px_rgba(27,20,100,.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
            >
              <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full bg-white/20 translate-x-6 translate-y-6" />
              <div className="text-3xl mb-3">{icon}</div>
              <div className="font-semibold text-[#1B1464] text-sm mb-1">
                {label}
              </div>
              <div className="text-[#1B1464]/45 text-xs">{count} tools</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
