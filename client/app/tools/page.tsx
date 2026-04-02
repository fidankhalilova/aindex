"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, GitCompare, ChevronLeft, ChevronRight } from "lucide-react";
import { useTools } from "@/hooks/useTools";
import { useCategories } from "@/hooks/useCategories";
import { ToolsQueryParams } from "@/types";
import ToolCard from "@/components/ToolCard";
import toast from "react-hot-toast";

const PRICING_OPTS = [
  { value: "all", label: "All Pricing" },
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
  { value: "enterprise", label: "Enterprise" },
];
const SORT_OPTS = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
  { value: "popular", label: "Most Popular" },
  { value: "name", label: "A → Z" },
];

export default function ToolsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const pricing = searchParams.get("pricing") || "all";
  const sort = (searchParams.get("sort") ||
    "newest") as ToolsQueryParams["sort"];
  const page = Number(searchParams.get("page") || 1);

  const [compareList, setCompareList] = useState<number[]>([]);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(searchParams.toString());
      if (value === "all" || value === "") p.delete(key);
      else p.set(key, value);
      if (key !== "page") p.delete("page");
      router.push(`/tools?${p.toString()}`);
    },
    [searchParams, router],
  );

  const toolsQuery = useTools({
    search: search || undefined,
    category: category === "all" ? undefined : category,
    pricing: pricing === "all" ? undefined : pricing,
    sort,
    page,
    pageSize: 12,
  });

  const categoriesQuery = useCategories();

  const tools = toolsQuery.data?.data ?? [];
  const totalPages = toolsQuery.data?.meta?.pagination?.pageCount ?? 1;
  const totalTools = toolsQuery.data?.meta?.pagination?.total ?? 0;
  const loading = toolsQuery.isLoading;
  const categories = categoriesQuery.data?.data ?? [];

  const toggleCompare = (id: number) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) {
        toast.error("Compare up to 3 tools at once");
        return prev;
      }
      return [...prev, id];
    });
  };

  const goCompare = () => {
    if (compareList.length < 2) {
      toast.error("Select at least 2 tools to compare");
      return;
    }
    router.push(`/tools/compare?ids=${compareList.join(",")}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] pt-20">
      {/* Sticky filter bar */}
      <div className="bg-white border-b border-[#E8EAFF] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1B1464]/35 pointer-events-none"
              />
              <input
                defaultValue={search}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  updateParam("search", (e.target as HTMLInputElement).value)
                }
                placeholder="Search tools..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#F8F9FF] border border-[#E8EAFF] rounded-xl text-sm text-[#1B1464] placeholder-[#1B1464]/35 focus:outline-none focus:border-[#2E4BC6] focus:ring-2 focus:ring-[#2E4BC6]/10 transition-all"
              />
            </div>

            <select
              value={category}
              onChange={(e) => updateParam("category", e.target.value)}
              className="px-4 py-2.5 bg-[#F8F9FF] border border-[#E8EAFF] rounded-xl text-sm text-[#1B1464] focus:outline-none focus:border-[#2E4BC6] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={pricing}
              onChange={(e) => updateParam("pricing", e.target.value)}
              className="px-4 py-2.5 bg-[#F8F9FF] border border-[#E8EAFF] rounded-xl text-sm text-[#1B1464] focus:outline-none focus:border-[#2E4BC6] cursor-pointer"
            >
              {PRICING_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="px-4 py-2.5 bg-[#F8F9FF] border border-[#E8EAFF] rounded-xl text-sm text-[#1B1464] focus:outline-none focus:border-[#2E4BC6] cursor-pointer"
            >
              {SORT_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#1B1464]/55 text-sm">
            {loading ? (
              "Loading..."
            ) : (
              <>
                <span className="font-semibold text-[#1B1464]">
                  {totalTools}
                </span>{" "}
                tools found
              </>
            )}
          </p>
          {(search || category !== "all" || pricing !== "all") && (
            <button
              onClick={() => router.push("/tools")}
              className="flex items-center gap-1.5 text-sm text-[#2E4BC6] font-medium hover:text-[#1B1464] transition-colors"
            >
              <X size={14} /> Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#E8EAFF] p-5 space-y-4"
              >
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#E8EAFF] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#E8EAFF] rounded animate-pulse w-2/3" />
                    <div className="h-3 bg-[#E8EAFF] rounded animate-pulse w-1/3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-[#E8EAFF] rounded animate-pulse" />
                  <div className="h-3 bg-[#E8EAFF] rounded animate-pulse w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-bold text-[#1B1464] text-xl mb-2">
              No tools found
            </h3>
            <p className="text-[#1B1464]/50 mb-6">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={() => router.push("/tools")}
              className="bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white font-semibold px-6 py-3 rounded-xl"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                compareList={compareList}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => updateParam("page", String(page - 1))}
              disabled={page <= 1}
              className="w-9 h-9 rounded-lg border border-[#E8EAFF] flex items-center justify-center text-[#1B1464]/50 hover:border-[#2E4BC6] hover:text-[#2E4BC6] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => updateParam("page", String(p))}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                    p === page
                      ? "bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white shadow-[0_0_16px_rgba(46,75,198,.3)]"
                      : "border border-[#E8EAFF] text-[#1B1464]/60 hover:border-[#2E4BC6] hover:text-[#2E4BC6]"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => updateParam("page", String(page + 1))}
              disabled={page >= totalPages}
              className="w-9 h-9 rounded-lg border border-[#E8EAFF] flex items-center justify-center text-[#1B1464]/50 hover:border-[#2E4BC6] hover:text-[#2E4BC6] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 bg-[#1B1464] text-white px-5 py-3.5 rounded-2xl shadow-[0_8px_40px_rgba(27,20,100,.5)]">
            <GitCompare size={18} className="text-[#00C2CB]" />
            <span className="text-sm font-medium">
              {compareList.length} tool{compareList.length > 1 ? "s" : ""}{" "}
              selected
            </span>
            <button
              onClick={goCompare}
              className="bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white text-sm font-bold px-4 py-2 rounded-xl shadow-[0_0_16px_rgba(0,194,203,.4)] hover:shadow-[0_0_24px_rgba(0,194,203,.6)] transition-all"
            >
              Compare Now
            </button>
            <button
              onClick={() => setCompareList([])}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
