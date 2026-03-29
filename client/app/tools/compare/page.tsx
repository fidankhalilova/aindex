"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ExternalLink, ArrowLeft, Check, X } from "lucide-react";

import { useToolsByIds, getStrapiMedia } from "@/lib/api";
import { Tool, Feature, Tag } from "@/types";

const PRICING_COLORS: Record<string, string> = {
  free: "bg-emerald-50 text-emerald-700",
  freemium: "bg-blue-50 text-blue-700",
  paid: "bg-amber-50 text-amber-700",
  enterprise: "bg-purple-50 text-purple-700",
};

export default function ComparePage() {
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

  const getComparisonRows = (tools: Tool[]) => {
    const rows = [
      {
        label: "Category",
        render: (tool: Tool) => tool.categories?.[0]?.name || "—", // plural + flat
      },
      {
        label: "Pricing",
        render: (tool: Tool) => (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize inline-block ${
              PRICING_COLORS[tool.pricing?.toLowerCase() || ""] || ""
            }`}
          >
            {tool.pricing || "—"}
          </span>
        ),
      },
      {
        label: "Pricing Details",
        render: (tool: Tool) => (
          <div className="text-xs text-[#1B1464]/60">
            {tool.pricingDetails || "—"}
          </div>
        ),
      },
      {
        label: "Rating",
        render: (tool: Tool) => (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(tool.averageRating || 0)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-xs font-bold text-[#1B1464]">
              {(tool.averageRating || 0).toFixed(1)} / 5
            </span>
          </div>
        ),
      },
      {
        label: "Reviews",
        render: (tool: Tool) => (
          <span className="text-sm font-medium text-[#1B1464]">
            {tool.reviewsCount || 0}
          </span>
        ),
      },
      {
        label: "Verified",
        render: (tool: Tool) =>
          tool.isVerified ? (
            <div className="flex flex-col items-center gap-1">
              <Check size={18} className="text-[#00C2CB]" />
              <span className="text-xs text-[#00C2CB]">Verified</span>
            </div>
          ) : (
            <X size={18} className="text-gray-300" />
          ),
      },
      {
        label: "Short Description",
        render: (tool: Tool) => (
          <div className="text-sm text-[#1B1464]/60 leading-relaxed">
            {tool.shortDescription || "—"}
          </div>
        ),
      },
    ];

    // Key Features
    const hasFeatures = tools.some((t) => t.features && t.features.length > 0);
    if (hasFeatures) {
      rows.push({
        label: "Key Features",
        render: (tool: Tool) => (
          <div className="space-y-1.5">
            {tool.features && tool.features.length > 0 ? (
              tool.features.map((feature, idx) => {
                const name =
                  typeof feature === "string"
                    ? feature
                    : (feature as Feature).name;
                return (
                  <div key={idx} className="flex items-start gap-1.5 text-sm">
                    <Check
                      size={14}
                      className="text-[#00C2CB] shrink-0 mt-0.5"
                    />
                    <span className="text-[#1B1464]/70">{name}</span>
                  </div>
                );
              })
            ) : (
              <span className="text-[#1B1464]/40 text-sm">
                No features listed
              </span>
            )}
          </div>
        ),
      });
    }

    // Tags
    const hasTags = tools.some((t) => t.tags && t.tags.length > 0);
    if (hasTags) {
      rows.push({
        label: "Tags",
        render: (tool: Tool) => (
          <div className="flex flex-wrap gap-1.5">
            {tool.tags && tool.tags.length > 0 ? (
              tool.tags.map((tag, idx) => {
                const name = typeof tag === "string" ? tag : (tag as Tag).name;
                return (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 bg-[#E8EAFF] text-[#2E4BC6] rounded-full"
                  >
                    {name}
                  </span>
                );
              })
            ) : (
              <span className="text-[#1B1464]/40 text-sm">No tags</span>
            )}
          </div>
        ),
      });
    }

    return rows;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-[#E8EAFF] border-t-[#2E4BC6] animate-spin mx-auto mb-4" />
          <p className="text-[#1B1464]/50 text-sm">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (error || ids.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load tools for comparison.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-[#2E4BC6] hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-[#1B1464]/50 hover:text-[#2E4BC6] transition-colors mb-6"
        >
          <ArrowLeft size={15} /> Back
        </button>

        <h1 className="font-display font-bold text-[#1B1464] text-3xl mb-8">
          Compare Tools
        </h1>

        {tools.length < 2 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E8EAFF]">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-[#1B1464]/50 mb-4 text-lg">
              Select at least 2 tools from the browse page to compare.
            </p>
            <Link
              href="/tools"
              className="inline-flex bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white font-semibold px-6 py-3 rounded-xl shadow-[0_0_16px_rgba(46,75,198,.3)] hover:shadow-[0_0_24px_rgba(0,194,203,.4)] transition-all"
            >
              Browse Tools
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8EAFF] shadow-[0_4px_24px_rgba(27,20,100,.07)] overflow-hidden">
            <div className="overflow-x-auto">
              <div
                className="min-w-max divide-x divide-[#E8EAFF]"
                style={{
                  display: "grid",
                  gridTemplateColumns: `220px repeat(${tools.length}, minmax(280px, 1fr))`,
                }}
              >
                {/* Header row */}
                <div className="p-5 bg-[#F8F9FF] border-b border-[#E8EAFF] font-semibold text-[#1B1464]">
                  Tool Details
                </div>
                {tools.map((tool) => {
                  const logoUrl = getStrapiMedia(tool.logo?.url ?? null);

                  return (
                    <div
                      key={tool.id}
                      className="p-5 text-center border-b border-[#E8EAFF] bg-white"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F8F9FF] border border-[#E8EAFF] mx-auto mb-3 flex items-center justify-center">
                        {logoUrl ? (
                          <Image
                            src={logoUrl}
                            alt={tool.name}
                            width={80}
                            height={80}
                            className="object-contain p-2"
                          />
                        ) : (
                          <span className="font-display font-bold text-[#2E4BC6] text-2xl">
                            {tool.name?.[0] || "?"}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-[#1B1464] text-lg mb-2">
                        {tool.name}
                      </h3>

                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                            PRICING_COLORS[tool.pricing?.toLowerCase() || ""] ||
                            ""
                          }`}
                        >
                          {tool.pricing}
                        </span>
                        {tool.isVerified && (
                          <span className="inline-flex items-center gap-1 text-[#00C2CB] text-xs">
                            <Check size={12} /> Verified
                          </span>
                        )}
                      </div>

                      <a
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-[#2E4BC6] font-medium hover:underline"
                      >
                        Visit Website <ExternalLink size={14} />
                      </a>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic comparison rows */}
              {getComparisonRows(tools).map(({ label, render }) => (
                <div
                  key={label}
                  className="min-w-max divide-x divide-[#E8EAFF] border-t border-[#E8EAFF]"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `220px repeat(${tools.length}, minmax(280px, 1fr))`,
                  }}
                >
                  <div className="p-5 bg-[#F8F9FF] flex items-start">
                    <span className="text-sm font-semibold text-[#1B1464]/80">
                      {label}
                    </span>
                  </div>
                  {tools.map((tool) => (
                    <div
                      key={tool.id}
                      className="p-5 flex items-center justify-center text-center"
                    >
                      {render(tool)}
                    </div>
                  ))}
                </div>
              ))}

              {/* Full Description */}
              <div
                className="min-w-max divide-x divide-[#E8EAFF] border-t border-[#E8EAFF]"
                style={{
                  display: "grid",
                  gridTemplateColumns: `220px repeat(${tools.length}, minmax(280px, 1fr))`,
                }}
              >
                <div className="p-5 bg-[#F8F9FF] flex items-start">
                  <span className="text-sm font-semibold text-[#1B1464]/80">
                    Full Description
                  </span>
                </div>
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-5 text-sm text-[#1B1464]/60 leading-relaxed"
                  >
                    {tool.description?.length > 300
                      ? `${tool.description.substring(0, 300)}...`
                      : tool.description || "—"}
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div
                className="min-w-max divide-x divide-[#E8EAFF] border-t border-[#E8EAFF]"
                style={{
                  display: "grid",
                  gridTemplateColumns: `220px repeat(${tools.length}, minmax(280px, 1fr))`,
                }}
              >
                <div className="p-5 bg-[#F8F9FF]" />
                {tools.map((tool) => (
                  <div key={tool.id} className="p-5 text-center">
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="inline-block w-full bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-[0_0_12px_rgba(46,75,198,.25)] hover:shadow-[0_0_20px_rgba(0,194,203,.4)] hover:-translate-y-px transition-all duration-200"
                    >
                      View Full Details
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
