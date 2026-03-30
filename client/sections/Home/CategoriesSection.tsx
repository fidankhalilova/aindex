"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCategories, useTools } from "@/lib/api";

// Define category colors and icons
const CATEGORY_STYLES: Record<
  string,
  { icon: string; color: string; border: string }
> = {
  "ai-writing": {
    icon: "✍️",
    color: "from-[#2E4BC6]/10 to-[#2E4BC6]/5",
    border: "border-[#2E4BC6]/15",
  },
  "image-generation": {
    icon: "🎨",
    color: "from-[#7B5CF5]/10 to-[#7B5CF5]/5",
    border: "border-[#7B5CF5]/15",
  },
  "code-generation": {
    icon: "💻",
    color: "from-[#00C2CB]/10 to-[#00C2CB]/5",
    border: "border-[#00C2CB]/15",
  },
  "conversational-ai": {
    icon: "💬",
    color: "from-[#F59E0B]/10 to-[#F59E0B]/5",
    border: "border-[#F59E0B]/15",
  },
  "automated-analytics": {
    icon: "📊",
    color: "from-[#10B981]/10 to-[#10B981]/5",
    border: "border-[#10B981]/15",
  },
  "adaptive-learning": {
    icon: "🎓",
    color: "from-[#EF4444]/10 to-[#EF4444]/5",
    border: "border-[#EF4444]/15",
  },
};

// Default style for categories without specific mapping
const DEFAULT_STYLE = {
  icon: "🔧",
  color: "from-[#6B7280]/10 to-[#6B7280]/5",
  border: "border-[#6B7280]/15",
};

interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  color?: string;
}

export default function CategoriesSection() {
  const {
    data: categoriesResponse,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const { data: toolsResponse, isLoading: toolsLoading } = useTools({
    pageSize: 1000,
    // Don't filter by state, get all published tools
  });

  // Create a map of category slug to tool count
  const getToolCountByCategory = () => {
    const countMap = new Map<string, number>();

    if (toolsResponse?.data && Array.isArray(toolsResponse.data)) {
      toolsResponse.data.forEach((tool: any) => {
        // Handle both Strapi v4 and v5 structures
        const categories = tool.attributes?.categories || tool.categories;

        if (categories && Array.isArray(categories)) {
          categories.forEach((cat: any) => {
            // Handle both nested and flat category structures
            const slug = cat.attributes?.slug || cat.slug;
            if (slug) {
              countMap.set(slug, (countMap.get(slug) || 0) + 1);
            }
          });
        }
      });
    }

    console.log("Tool count by category:", Object.fromEntries(countMap));
    return countMap;
  };

  const toolCountByCategory = getToolCountByCategory();

  // Get category style based on slug
  const getCategoryStyle = (slug: string) => {
    return CATEGORY_STYLES[slug] || DEFAULT_STYLE;
  };

  // Get tool count for a category
  const getToolCount = (category: Category): number => {
    return toolCountByCategory.get(category.slug) || 0;
  };

  if (categoriesLoading || toolsLoading) {
    return (
      <section className="py-20 bg-[#F8F9FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="h-4 w-24 bg-[#E8EAFF] rounded animate-pulse mb-3" />
              <div className="h-8 w-64 bg-[#E8EAFF] rounded animate-pulse" />
            </div>
            <div className="h-10 w-24 bg-[#E8EAFF] rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                <div className="w-10 h-10 bg-[#E8EAFF] rounded-full mb-3" />
                <div className="h-4 bg-[#E8EAFF] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#E8EAFF] rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categoriesError) {
    console.error("Categories error:", categoriesError);
    return null;
  }

  if (!categoriesResponse?.data || categoriesResponse.data.length === 0) {
    return null;
  }

  const categories = categoriesResponse.data;
  const totalTools = Array.from(toolCountByCategory.values()).reduce(
    (sum, count) => sum + count,
    0,
  );

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
            {totalTools > 0 && (
              <p className="text-[#1B1464]/50 text-sm mt-2">
                {totalTools} AI tools across {categories.length} categories
              </p>
            )}
          </div>
          <Link
            href="/tools"
            className="hidden sm:flex items-center gap-1.5 text-[#2E4BC6] text-sm font-semibold hover:gap-2.5 transition-all duration-200"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const { slug, name, description } = category;
            const style = getCategoryStyle(slug);
            const toolCount = getToolCount(category);

            return (
              <Link
                key={category.id}
                href={`/tools?category=${slug}`}
                className={`group relative bg-gradient-to-br ${style.color} border ${style.border} rounded-2xl p-5 hover:shadow-[0_8px_32px_rgba(27,20,100,.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
              >
                <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full bg-white/20 translate-x-6 translate-y-6 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl mb-3">{style.icon}</div>
                <div className="font-semibold text-[#1B1464] text-sm mb-1">
                  {name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#1B1464]/45 text-xs font-medium">
                    {toolCount}
                  </span>
                  <span className="text-[#1B1464]/30 text-[10px]">
                    {toolCount === 1 ? "tool" : "tools"}
                  </span>
                </div>
                {description && (
                  <div className="mt-2 text-[#1B1464]/30 text-[10px] line-clamp-2">
                    {description}
                  </div>
                )}
                {/* Tool count badge with animation */}
                {toolCount > 0 && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold text-[#2E4BC6] shadow-sm">
                      {toolCount}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile View All button */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-[#2E4BC6] text-sm font-semibold hover:gap-2.5 transition-all duration-200"
          >
            View All Categories <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
