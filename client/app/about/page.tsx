import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Eye, Zap } from "lucide-react";

export const metadata: Metadata = { title: "About Us" };

const TEAM = [
  {
    name: "Fidan Khalilova",
    role: "Group Leader & Product",
    initial: "F",
    color: "from-[#2E4BC6] to-[#7B5CF5]",
  },
  {
    name: "Nizami Hajiyev",
    role: "Full-Stack Developer",
    initial: "N",
    color: "from-[#7B5CF5] to-[#00C2CB]",
  },
  {
    name: "Murad Safarli",
    role: "Full-Stack Developer",
    initial: "M",
    color: "from-[#00C2CB] to-[#2E4BC6]",
  },
  {
    name: "Ismayil Aliyev",
    role: "Backend & Data",
    initial: "I",
    color: "from-[#2E4BC6] to-[#4A6DE0]",
  },
  {
    name: "Ali Ismayilov",
    role: "Frontend & UI/UX",
    initial: "A",
    color: "from-[#4A6DE0] to-[#00C2CB]",
  },
];

const VALUES = [
  {
    icon: Target,
    title: "Our Mission",
    text: "Help every person find the right AI tool for their specific task — without hours of research, confusion, or trial and error.",
    color: "text-[#2E4BC6]",
    bg: "bg-[#E8EAFF]",
  },
  {
    icon: Eye,
    title: "Our Vision",
    text: "A world where AI tools are as easy to find as apps in a store — searchable, comparable, and reviewed by a trusted community.",
    color: "text-[#7B5CF5]",
    bg: "bg-purple-50",
  },
  {
    icon: Zap,
    title: "Our Approach",
    text: "Curated by humans, powered by community. Every tool is reviewed before listing, and every review is from a real user experience.",
    color: "text-[#00C2CB]",
    bg: "bg-[#E0FAFA]",
  },
];

const TIMELINE = [
  {
    phase: "Phase 1",
    title: "Market Research",
    desc: "Surveyed 100+ users to validate the problem. 77% reported struggling to find the right AI tool.",
  },
  {
    phase: "Phase 2",
    title: "Platform Development",
    desc: "Built the core discovery engine with search, filtering, and user authentication using Next.js & Strapi.",
  },
  {
    phase: "Phase 3",
    title: "Community Launch",
    desc: "Opened submissions and reviews to the public, growing to 1,200+ tools across 50+ categories.",
  },
  {
    phase: "Phase 4",
    title: "Scale & Expand",
    desc: "Adding comparison tools, API integrations, and enterprise features to reach profitability.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FF] pt-16">
      {/* Hero */}
      <section className="relative bg-linear-to-br from-[#1B1464] via-[#2E4BC6] to-[#4A8FD4] overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          viewBox="0 0 1440 400"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M0 200C360 120 720 280 1080 200C1260 160 1380 220 1440 200"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 240C360 160 720 320 1080 240C1260 200 1380 260 1440 240"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M0 160C360 80 720 240 1080 160C1260 120 1380 180 1440 160"
            stroke="white"
            strokeWidth="1"
            fill="none"
          />
        </svg>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[#00C2CB]/15 blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6">
            👋 Meet the Team
          </span>
          <h1 className="font-display font-bold text-white text-4xl md:text-5xl mb-5 leading-tight">
            We're Building the
            <br />
            <span className="bg-linear-to-r from-[#00C2CB] to-[#33D4DC] bg-clip-text text-transparent">
              AI Discovery Layer
            </span>
          </h1>
          <p className="text-white/65 text-lg max-w-2xl mx-auto leading-relaxed">
            AINavix was born from a simple frustration: thousands of AI tools
            exist, but finding the right one for your task takes way too long.
            We built the solution.
          </p>
        </div>
        <div className="absolute bottom-0 inset-x-0">
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            className="w-full block"
            style={{ height: 60 }}
          >
            <path
              d="M0 30C360 10 720 50 1080 30C1260 20 1380 40 1440 30V60H0V30Z"
              fill="#F8F9FF"
            />
          </svg>
        </div>
      </section>

      {/* Problem + Survey data */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#2E4BC6] text-sm font-semibold uppercase tracking-wider mb-3 block">
                The Problem
              </span>
              <h2 className="font-display font-bold text-[#1B1464] text-3xl md:text-4xl mb-5 leading-tight">
                Too Many Tools,
                <br />
                Not Enough Clarity
              </h2>
              <p className="text-[#1B1464]/60 text-base leading-relaxed mb-6">
                The AI landscape exploded from hundreds to thousands of tools in
                under two years. Users spend hours researching, only to choose
                the wrong tool. We asked real people about their experience.
              </p>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white font-semibold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(46,75,198,.3)] hover:shadow-[0_0_30px_rgba(0,194,203,.4)] hover:-translate-y-px transition-all duration-200"
              >
                Browse Tools <ArrowRight size={15} />
              </Link>
            </div>

            {/* Survey cards */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#E8EAFF] shadow-[0_4px_24px_rgba(27,20,100,.07)] p-6">
                <p className="text-[#1B1464]/60 text-sm mb-4 font-medium">
                  Have you ever struggled to find the right AI tool for a
                  specific task?
                </p>
                <div className="space-y-2.5">
                  {[
                    { label: "Sometimes", pct: 38, color: "bg-[#2E4BC6]" },
                    { label: "Rarely", pct: 35, color: "bg-[#00C2CB]" },
                    { label: "Yes, often", pct: 19, color: "bg-[#7B5CF5]" },
                    { label: "Never", pct: 8, color: "bg-[#E8EAFF]" },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-[#1B1464]/70">
                          {label}
                        </span>
                        <span className="text-xs font-bold text-[#1B1464]">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#F8F9FF] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E8EAFF] shadow-[0_4px_24px_rgba(27,20,100,.07)] p-6">
                <p className="text-[#1B1464]/60 text-sm mb-4 font-medium">
                  Is not being able to find the right AI tool a real problem?
                </p>
                <div className="space-y-2.5">
                  {[
                    { label: "Sometimes", pct: 46, color: "bg-[#2E4BC6]" },
                    {
                      label: "Yes, definitely",
                      pct: 31,
                      color: "bg-[#7B5CF5]",
                    },
                    { label: "Not really", pct: 15, color: "bg-[#00C2CB]" },
                    { label: "No", pct: 8, color: "bg-[#E8EAFF]" },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-[#1B1464]/70">
                          {label}
                        </span>
                        <span className="text-xs font-bold text-[#1B1464]">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#F8F9FF] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Approach */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#2E4BC6] text-sm font-semibold uppercase tracking-wider mb-3 block">
              What Drives Us
            </span>
            <h2 className="font-display font-bold text-[#1B1464] text-3xl">
              Mission, Vision & Approach
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, text, color, bg }) => (
              <div
                key={title}
                className="bg-[#F8F9FF] rounded-2xl border border-[#E8EAFF] p-7 hover:shadow-[0_8px_32px_rgba(27,20,100,.1)] hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-5`}
                >
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-display font-bold text-[#1B1464] text-lg mb-3">
                  {title}
                </h3>
                <p className="text-[#1B1464]/60 text-sm leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#2E4BC6] text-sm font-semibold uppercase tracking-wider mb-3 block">
              Roadmap
            </span>
            <h2 className="font-display font-bold text-[#1B1464] text-3xl">
              How We're Building This
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-linear-to-b from-[#2E4BC6] via-[#00C2CB] to-transparent" />
            <div className="space-y-8">
              {TIMELINE.map(({ phase, title, desc }, i) => (
                <div key={phase} className="flex gap-6">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#2E4BC6] to-[#00C2CB] flex items-center justify-center text-white text-xs font-bold shadow-[0_0_16px_rgba(46,75,198,.3)] z-10 relative">
                      0{i + 1}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#E8EAFF] shadow-[0_4px_24px_rgba(27,20,100,.06)] p-5 flex-1">
                    <span className="text-[#2E4BC6] text-xs font-semibold uppercase tracking-wider">
                      {phase}
                    </span>
                    <h3 className="font-display font-bold text-[#1B1464] text-base mt-1 mb-2">
                      {title}
                    </h3>
                    <p className="text-[#1B1464]/60 text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#2E4BC6] text-sm font-semibold uppercase tracking-wider mb-3 block">
              The Team
            </span>
            <h2 className="font-display font-bold text-[#1B1464] text-3xl">
              People Behind AINavix
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            {TEAM.map(({ name, role, initial, color }) => (
              <div
                key={name}
                className="bg-[#F8F9FF] rounded-2xl border border-[#E8EAFF] p-6 text-center hover:shadow-[0_8px_32px_rgba(27,20,100,.1)] hover:-translate-y-1.5 transition-all duration-300 w-44"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-linear-to-br ${color} flex items-center justify-center text-white font-display font-bold text-2xl mx-auto mb-4 shadow-[0_4px_16px_rgba(27,20,100,.2)]`}
                >
                  {initial}
                </div>
                <h3 className="font-semibold text-[#1B1464] text-sm mb-1 leading-tight">
                  {name}
                </h3>
                <p className="text-[#1B1464]/45 text-xs">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-linear-to-br from-[#1B1464] via-[#2E4BC6] to-[#4A8FD4] rounded-3xl p-12 relative overflow-hidden shadow-[0_20px_60px_rgba(27,20,100,.3)]">
            <svg
              className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
              viewBox="0 0 600 300"
              preserveAspectRatio="xMidYMid slice"
            >
              <path
                d="M0 150C150 90 300 210 450 150C525 120 570 165 600 150"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#00C2CB]/15 blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="font-display font-bold text-white text-3xl mb-4">
                Ready to Discover Better AI Tools?
              </h2>
              <p className="text-white/60 mb-8">
                Join thousands of users who already use AINavix to find,
                compare, and review AI tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/tools"
                  className="flex items-center justify-center gap-2 bg-white text-[#2E4BC6] font-bold px-7 py-3.5 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-px transition-all duration-200"
                >
                  Browse Tools <ArrowRight size={16} />
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 hover:border-white/70 transition-all duration-200"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
