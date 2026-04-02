"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles } from "lucide-react";

const TAGS = [
  "Text Generation",
  "Image AI",
  "Coding",
  "Data Analysis",
  "Productivity",
  "Voice AI",
];

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim())
      router.push(`/tools?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-[#1B1464] via-[#2E4BC6] to-[#4A8FD4]">
      {/* Decorative network/wave lines - matching presentation */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M0 450C240 270 480 630 720 450C960 270 1200 630 1440 450"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M0 500C240 320 480 680 720 500C960 320 1200 680 1440 500"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M0 400C240 220 480 580 720 400C960 220 1200 580 1440 400"
          stroke="white"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M0 350C240 170 480 530 720 350C960 170 1200 530 1440 350"
          stroke="white"
          strokeWidth="0.7"
          fill="none"
        />
        <circle cx="200" cy="200" r="2" fill="white" opacity=".6" />
        <circle cx="400" cy="150" r="1.5" fill="white" opacity=".5" />
        <circle cx="700" cy="300" r="2" fill="white" opacity=".6" />
        <circle cx="1000" cy="180" r="1.5" fill="white" opacity=".4" />
        <circle cx="1200" cy="250" r="2" fill="white" opacity=".5" />
        <circle cx="1350" cy="400" r="1.5" fill="white" opacity=".4" />
        <line
          x1="200"
          y1="200"
          x2="400"
          y2="150"
          stroke="white"
          strokeWidth="0.5"
          opacity=".3"
        />
        <line
          x1="400"
          y1="150"
          x2="700"
          y2="300"
          stroke="white"
          strokeWidth="0.5"
          opacity=".3"
        />
        <line
          x1="700"
          y1="300"
          x2="1000"
          y2="180"
          stroke="white"
          strokeWidth="0.5"
          opacity=".3"
        />
        <line
          x1="1000"
          y1="180"
          x2="1200"
          y2="250"
          stroke="white"
          strokeWidth="0.5"
          opacity=".3"
        />
      </svg>

      {/* Radial glow */}
      <div className="absolute top-1/4 right-1/4 w-150 h-150 rounded-full bg-[#00C2CB]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-100 h-100 rounded-full bg-[#7B5CF5]/10 blur-[100px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8 animate-fade-in">
          <Sparkles size={14} className="text-[#00C2CB]" />
          <span className="text-white/90 text-sm font-medium">
            Discover 1000+ AI Tools in One Place
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-display font-bold text-white leading-tight mb-6 animate-fade-up"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
        >
          Find the Perfect
          <br />
          <span className="bg-linear-to-r from-[#00C2CB] to-[#33D4DC] bg-clip-text text-transparent">
            AI Tool
          </span>{" "}
          for Any Task
        </h1>

        <p
          className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
          style={{ animationDelay: ".1s" }}
        >
          Stop wasting hours searching. AINavix centralizes thousands of AI
          tools so you can discover, compare, and choose the right one — in
          seconds.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-6 animate-fade-up"
          style={{ animationDelay: ".2s" }}
        >
          <div className="relative flex items-center bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,.25)] overflow-hidden p-2">
            <Search
              size={20}
              className="absolute left-5 text-[#1B1464]/40 pointer-events-none"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search AI tools — e.g. 'image generation', 'code assistant'..."
              className="flex-1 pl-12 pr-4 py-3 text-[#1B1464] text-sm font-medium placeholder-[#1B1464]/40 outline-none bg-transparent"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(0,194,203,.4)] hover:shadow-[0_0_30px_rgba(0,194,203,.6)] transition-all duration-200 hover:-translate-y-px whitespace-nowrap"
            >
              Search <ArrowRight size={15} />
            </button>
          </div>
        </form>

        {/* Quick tags */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-up"
          style={{ animationDelay: ".3s" }}
        >
          <span className="text-white/50 text-sm mr-1">Popular:</span>
          {TAGS.map((tag) => (
            <Link
              key={tag}
              href={`/tools?search=${encodeURIComponent(tag)}`}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white text-xs font-medium transition-all duration-200"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* CTA pair */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: ".4s" }}
        >
          <Link
            href="/tools"
            className="flex items-center gap-2 bg-white text-[#2E4BC6] text-sm font-bold px-8 py-3.5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,.3)] hover:-translate-y-px transition-all duration-200"
          >
            Browse All Tools <ArrowRight size={16} />
          </Link>
          <Link
            href="/auth/register"
            className="flex items-center gap-2 border-2 border-white/40 text-white text-sm font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 hover:border-white/70 transition-all duration-200"
          >
            Create Free Account
          </Link>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 inset-x-0">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ height: 80 }}
        >
          <path
            d="M0 40C240 10 480 70 720 40C960 10 1200 70 1440 40V80H0V40Z"
            fill="#F8F9FF"
          />
        </svg>
      </div>
    </section>
  );
}
