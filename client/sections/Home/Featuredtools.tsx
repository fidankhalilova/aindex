"use client";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, ExternalLink, Zap } from "lucide-react";
import { useFeaturedTools, getStrapiMedia } from "@/lib/api";
import { Tool } from "@/types";

const PRICING_COLORS: Record<string, string> = {
  free: "bg-emerald-50 text-emerald-700 border-emerald-200",
  freemium: "bg-blue-50 text-blue-700 border-blue-200",
  paid: "bg-amber-50 text-amber-700 border-amber-200",
  enterprise: "bg-purple-50 text-purple-700 border-purple-200",
};

function ToolCard({ tool }: { tool: Tool }) {
  const {
    name,
    slug,
    shortDescription,
    logo,
    pricing,
    averageRating,
    reviewsCount,
    categories, // ← plural
    isVerified,
    website,
  } = tool;

  const logoUrl = logo?.url ? getStrapiMedia(logo.url) : null;
  // First category in the array
  const catName = categories?.[0]?.name;
  const rating = averageRating || 0;
  // Normalise pricing to lowercase for colour lookup
  const pricingKey = pricing?.toLowerCase() ?? "free";

  return (
    <div className="group bg-white rounded-2xl border border-[#E8EAFF] shadow-[0_4px_24px_rgba(27,20,100,.06)] hover:shadow-[0_12px_40px_rgba(27,20,100,.13)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-linear-to-br from-[#E8EAFF] to-[#F8F9FF] shrink-0 flex items-center justify-center border border-[#E8EAFF]">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={name}
                width={48}
                height={48}
                className="object-contain w-full h-full"
              />
            ) : (
              <span className="text-[#2E4BC6] font-bold text-lg">
                {name[0]}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="font-semibold text-[#1B1464] text-sm truncate">
                {name}
              </h3>
              {isVerified && (
                <span
                  title="Verified"
                  className="w-4 h-4 rounded-full bg-[#00C2CB] flex items-center justify-center shrink-0"
                >
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>
            {catName && (
              <span className="text-[#2E4BC6] text-xs font-medium bg-[#E8EAFF] px-2 py-0.5 rounded-full">
                {catName}
              </span>
            )}
          </div>

          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize shrink-0 ${
              PRICING_COLORS[pricingKey] || PRICING_COLORS.free
            }`}
          >
            {pricing}
          </span>
        </div>

        <p className="text-[#1B1464]/60 text-sm leading-relaxed line-clamp-2 mb-4">
          {shortDescription}
        </p>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className={
                  i < Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-[#1B1464]/70 text-xs font-semibold">
            {rating.toFixed(1)}
          </span>
          <span className="text-[#1B1464]/40 text-xs">
            ({reviewsCount || 0})
          </span>
        </div>
      </div>

      <div className="border-t border-[#E8EAFF] p-4 flex items-center gap-2">
        <Link
          href={`/tools/${slug}`}
          className="flex-1 text-center text-sm font-semibold text-[#2E4BC6] hover:text-[#1B1464] transition-colors duration-200"
        >
          View Details
        </Link>
        <div className="w-px h-5 bg-[#E8EAFF]" />
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm font-medium text-[#1B1464]/50 hover:text-[#2E4BC6] transition-colors duration-200"
        >
          <ExternalLink size={13} /> Visit
        </a>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#E8EAFF] p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#E8EAFF] animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#E8EAFF] rounded animate-pulse w-2/3" />
          <div className="h-3 bg-[#E8EAFF] rounded animate-pulse w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-[#E8EAFF] rounded animate-pulse" />
        <div className="h-3 bg-[#E8EAFF] rounded animate-pulse w-5/6" />
      </div>
      <div className="h-4 bg-[#E8EAFF] rounded animate-pulse w-1/3" />
    </div>
  );
}

export default function FeaturedTools() {
  const { data: tools = [], isLoading } = useFeaturedTools(6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-[#00C2CB]" />
              <span className="text-[#2E4BC6] text-sm font-semibold uppercase tracking-wider">
                Featured
              </span>
            </div>
            <h2 className="font-bold text-[#1B1464] text-3xl md:text-4xl">
              Top AI Tools
            </h2>
          </div>
          <Link
            href="/tools"
            className="hidden sm:flex items-center gap-1.5 text-[#2E4BC6] text-sm font-semibold hover:gap-2.5 transition-all duration-200"
          >
            Browse All <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : tools.length > 0 ? (
            tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
          ) : (
            <div className="col-span-3 text-center py-16">
              <p className="text-[#1B1464]/40 text-base">
                No featured tools yet.{" "}
                <Link
                  href="/tools/submit"
                  className="text-[#2E4BC6] font-semibold underline"
                >
                  Submit the first one!
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white font-semibold px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(46,75,198,.3)] hover:shadow-[0_0_30px_rgba(0,194,203,.4)] hover:-translate-y-px transition-all duration-200"
          >
            Explore All Tools <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
