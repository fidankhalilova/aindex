"use client";
export const dynamic = "force-dynamic";
export const runtime = "edge";

import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ExternalLink, ArrowLeft, Trophy, Sparkles } from "lucide-react";
import { useToolsByIds } from "@/hooks/useTools";
import { getStrapiMedia } from "@/lib/apiClient";

const PRICING_COLORS: Record<string, string> = {
  free: "bg-emerald-100 text-emerald-700",
  freemium: "bg-blue-100 text-blue-700",
  paid: "bg-amber-100 text-amber-700",
  enterprise: "bg-purple-100 text-purple-700",
};

function ComparePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const ids = useMemo(() => {
    return (searchParams.get("ids") || "")
      .split(",")
      .filter(Boolean)
      .map(Number)
      .filter((id) => !isNaN(id));
  }, [searchParams]);

  const { data: tools = [], isLoading, error } = useToolsByIds(ids);

  const handlePickForMe = () => {
    if (tools.length < 2) return;
    const winner = [...tools].sort((a, b) => {
      const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0);
      return ratingDiff !== 0
        ? ratingDiff
        : (b.viewsCount || 0) - (a.viewsCount || 0);
    })[0];
    router.push(`/tools/compare/winner?slug=${winner.slug}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-[#E8EAFF] border-t-[#2E4BC6] animate-spin mx-auto mb-4" />
          <p className="text-[#1B1464]/60 text-sm">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (error || ids.length === 0 || tools.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">
            Failed to load tools for comparison.
          </p>
          <button
            onClick={() => router.back()}
            className="text-[#2E4BC6] hover:underline"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-[#1B1464]/60 hover:text-[#2E4BC6] mb-1"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <h1 className="font-display font-bold text-4xl text-[#1B1464]">
              Compare Tools
            </h1>
            <p className="text-[#1B1464]/60">
              Side-by-side • {tools.length} tools
            </p>
          </div>

          {tools.length >= 2 && (
            <button
              onClick={handlePickForMe}
              className="group flex items-center gap-3 bg-linear-to-r from-[#2E4BC6] via-[#00C2CB] to-[#2E4BC6] text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <Sparkles
                className="group-hover:rotate-12 transition-transform"
                size={20}
              />
              Pick for me!
              <Trophy size={20} />
            </button>
          )}
        </div>

        {tools.length < 2 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E8EAFF]">
            <p className="text-6xl mb-6">🔍</p>
            <p className="text-xl text-[#1B1464]/60 mb-8">
              Select at least 2 tools to compare
            </p>
            <Link
              href="/tools"
              className="inline-flex bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white font-semibold px-8 py-3.5 rounded-2xl hover:shadow-xl transition-all"
            >
              Browse Tools
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E8EAFF] shadow-sm overflow-hidden">
            {/* Tool Header Row */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `240px repeat(${tools.length}, 1fr)`,
              }}
            >
              <div className="p-8 border-b border-[#E8EAFF] font-medium text-[#1B1464]">
                Tool
              </div>
              {tools.map((tool) => {
                const logoUrl = getStrapiMedia(tool.logo?.url ?? null);
                return (
                  <div
                    key={tool.id}
                    className="p-8 border-b border-[#E8EAFF] text-center"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F8F9FF] border border-[#E8EAFF] flex items-center justify-center">
                        {logoUrl ? (
                          <Image
                            src={logoUrl}
                            alt={tool.name}
                            width={80}
                            height={80}
                            className="object-contain p-2"
                          />
                        ) : (
                          <span className="text-5xl font-display font-bold text-[#2E4BC6]">
                            {tool.name?.[0] || "?"}
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold text-xl text-[#1B1464] mb-2">
                      {tool.name}
                    </h3>
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2E4BC6] hover:text-[#00C2CB] text-sm inline-flex items-center gap-1"
                    >
                      Visit site <ExternalLink size={14} />
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Comparison Table */}
            <div className="divide-y divide-[#E8EAFF]">
              {/* Category */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `240px repeat(${tools.length}, 1fr)`,
                }}
              >
                <div className="p-6 pl-8 font-medium text-[#1B1464]">
                  Category
                </div>
                {tools.map((tool) => (
                  <div key={tool.id} className="p-6 text-[#1B1464]/80">
                    {tool.categories?.[0]?.name || "—"}
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `240px repeat(${tools.length}, 1fr)`,
                }}
              >
                <div className="p-6 pl-8 font-medium text-[#1B1464]">
                  Pricing
                </div>
                {tools.map((tool) => (
                  <div key={tool.id} className="p-6">
                    <span
                      className={`px-4 py-1 rounded-full text-xs font-semibold capitalize ${
                        PRICING_COLORS[tool.pricing?.toLowerCase() || ""] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tool.pricing || "—"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Rating */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `240px repeat(${tools.length}, 1fr)`,
                }}
              >
                <div className="p-6 pl-8 font-medium text-[#1B1464]">
                  Rating
                </div>
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-6 flex flex-col items-center gap-1"
                  >
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < Math.round(tool.averageRating || 0)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-200 text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium mt-1">
                      {(tool.averageRating || 0).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Reviews */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `240px repeat(${tools.length}, 1fr)`,
                }}
              >
                <div className="p-6 pl-8 font-medium text-[#1B1464]">
                  Reviews
                </div>
                {tools.map((tool) => (
                  <div key={tool.id} className="p-6 text-center font-medium">
                    {tool.reviewsCount || 0}
                  </div>
                ))}
              </div>

              {/* Short Description */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `240px repeat(${tools.length}, 1fr)`,
                }}
              >
                <div className="p-6 pl-8 font-medium text-[#1B1464]">
                  Short Description
                </div>
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-6 text-sm text-[#1B1464]/70 leading-relaxed"
                  >
                    {tool.shortDescription || "—"}
                  </div>
                ))}
              </div>

              {/* Action Row */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `240px repeat(${tools.length}, 1fr)`,
                }}
              >
                <div className="p-6 pl-8" />
                {tools.map((tool) => (
                  <div key={tool.id} className="p-6 flex justify-center">
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white font-semibold px-10 py-3 rounded-2xl hover:shadow-md transition-all text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F9FF] pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full border-4 border-[#E8EAFF] border-t-[#2E4BC6] animate-spin mx-auto mb-4" />
            <p className="text-[#1B1464]/60 text-sm">Loading comparison...</p>
          </div>
        </div>
      }
    >
      <ComparePageInner />
    </Suspense>
  );
}
