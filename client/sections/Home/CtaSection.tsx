import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-linear-to-br from-[#1B1464] via-[#2E4BC6] to-[#4A8FD4] rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-[0_20px_60px_rgba(27,20,100,.3)]">
          {/* Wave lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
            viewBox="0 0 800 400"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M0 200C160 120 320 280 480 200C640 120 800 280 960 200"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0 240C160 160 320 320 480 240C640 160 800 320 960 240"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#00C2CB]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#7B5CF5]/15 blur-3xl pointer-events-none" />

          <div className="relative">
            <h2 className="font-display font-bold text-white text-3xl md:text-4xl lg:text-5xl mb-5 leading-tight">
              Can't Find What
              <br />
              You're Looking For?
            </h2>
            <p className="text-white/65 text-lg mb-10 max-w-xl mx-auto">
              Know an AI tool that deserves to be here? Submit it and help the
              community discover it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/tools/submit"
                className="flex items-center gap-2 bg-white text-[#2E4BC6] font-bold px-8 py-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,.3)] hover:-translate-y-px transition-all duration-200"
              >
                <Plus size={18} /> Submit a Tool
              </Link>
              <Link
                href="/tools"
                className="flex items-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 hover:border-white/70 transition-all duration-200"
              >
                Browse All <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
