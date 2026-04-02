"use client";
export const dynamic = "force-dynamic";
import { Suspense, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ExternalLink, ArrowLeft, Send, Check } from "lucide-react";
import { useTool } from "@/hooks/useTools";
import { useReviewsByTool, useCreateReview } from "@/hooks/useReviews";
import { getStrapiMedia } from "@/lib/apiClient";
import { incrementToolViews } from "@/services/toolsService";
import { Tool, Review, Feature, Tag } from "@/types";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";

const PRICING_COLORS: Record<string, string> = {
  free: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  freemium: "bg-blue-50 text-blue-700 border border-blue-200",
  paid: "bg-amber-50 text-amber-700 border border-amber-200",
  enterprise: "bg-purple-50 text-purple-700 border border-purple-200",
};

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1;
        return (
          <button
            key={v}
            type="button"
            onMouseEnter={() => setHovered(v)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(v)}
            className="focus:outline-none transition-transform active:scale-110"
          >
            <Star
              size={32}
              className={`transition-all ${
                v <= (hovered || value)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function ToolDetailPageInner() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");

  const {
    data: tool,
    isLoading: isToolLoading,
    error: toolError,
  } = useTool(slug as string);
  const { data: reviews = [], isLoading: isReviewsLoading } = useReviewsByTool(
    tool?.id ?? 0,
    {
      enabled: !!tool?.id,
    },
  );
  const createReviewMutation = useCreateReview();

  useEffect(() => {
    if (tool?.id) {
      incrementToolViews(tool.id).catch(() => {});
    }
  }, [tool?.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a rating");
    if (!content.trim()) return toast.error("Please write a review");
    if (!user?.id || !tool?.id) return toast.error("Please log in");
    try {
      await createReviewMutation.mutateAsync({
        rating,
        title: title.trim() || undefined,
        content: content.trim(),
        pros: pros.trim() || undefined,
        cons: cons.trim() || undefined,
        tool: tool.id,
        user: user.id,
      });
      toast.success("Review submitted successfully!");
      setRating(0);
      setTitle("");
      setContent("");
      setPros("");
      setCons("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit review");
    }
  };

  if (isToolLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#F8F9FF]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#E8EAFF] border-t-[#2E4BC6] animate-spin mx-auto mb-4" />
          <p className="text-[#1B1464]/60">Loading tool details...</p>
        </div>
      </div>
    );
  }

  if (toolError || !tool) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#F8F9FF]">
        <div className="text-center">
          <p className="text-red-600 mb-4 text-lg">Tool not found</p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-[#2E4BC6] hover:text-[#1B1464] font-medium"
          >
            <ArrowLeft size={18} /> Browse all tools
          </Link>
        </div>
      </div>
    );
  }

  const logoUrl = getStrapiMedia(tool.logo?.url ?? "");
  const catName = tool.categories?.[0]?.name || "Uncategorized";

  return (
    <div className="min-h-screen bg-[#F8F9FF] pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#1B1464]/60 hover:text-[#2E4BC6] mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to tools</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          <div className="flex-1 space-y-10">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border border-[#E8EAFF] bg-white shrink-0 flex items-center justify-center">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={tool.name}
                    width={112}
                    height={112}
                    className="object-contain p-4"
                  />
                ) : (
                  <span className="text-5xl font-bold text-[#2E4BC6]">
                    {tool.name?.[0]}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <h1 className="font-semibold text-3xl sm:text-4xl text-[#1B1464] tracking-tight">
                    {tool.name}
                  </h1>
                  {tool.isVerified && (
                    <div className="flex items-center gap-1.5 text-[#00C2CB] font-medium text-sm bg-[#E8EAFF] px-3 py-1 rounded-full w-fit">
                      <Check size={16} /> Verified
                    </div>
                  )}
                </div>
                <p className="text-lg text-[#1B1464]/70 leading-relaxed mb-5">
                  {tool.shortDescription}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className={`px-5 py-2 rounded-2xl text-sm font-semibold capitalize border ${PRICING_COLORS[tool.pricing?.toLowerCase() || "free"] || ""}`}
                  >
                    {tool.pricing || "Free"}
                  </span>
                  {tool.categories && tool.categories.length > 0 && (
                    <div className="text-[#1B1464]/60 text-sm">
                      in{" "}
                      <span className="font-medium text-[#2E4BC6]">
                        {catName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#2E4BC6] hover:bg-[#1e3a9f] text-white px-8 py-3.5 rounded-2xl font-semibold transition-all shadow-sm"
            >
              Visit Website <ExternalLink size={19} />
            </a>

            <div className="prose prose-lg max-w-none text-[#1B1464]/80">
              <h2 className="text-2xl font-semibold text-[#1B1464] mb-5">
                About this tool
              </h2>
              <div className="leading-relaxed whitespace-pre-line text-[17px]">
                {tool.description}
              </div>
            </div>

            {tool.features && tool.features.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-[#1B1464] mb-6">
                  Key Features
                </h2>
                <div className="grid gap-5">
                  {tool.features.map((feature: Feature) => (
                    <div
                      key={feature.id}
                      className="bg-white border border-[#E8EAFF] rounded-3xl p-7 hover:shadow-sm transition-shadow"
                    >
                      <h3 className="font-semibold text-xl mb-3">
                        {feature.name}
                      </h3>
                      {feature.description && (
                        <p className="text-[#1B1464]/70 leading-relaxed">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tool.tags && tool.tags.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-[#1B1464] mb-5">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag: Tag) => (
                    <span
                      key={tag.id}
                      className="px-5 py-2 bg-[#E8EAFF] text-[#2E4BC6] text-sm rounded-2xl font-medium"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-96 shrink-0">
            <div className="bg-white border border-[#E8EAFF] rounded-3xl p-7 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-[#1B1464]">
                  Reviews ({reviews.length})
                </h2>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="fill-current" size={24} />
                  <span className="font-bold text-2xl">
                    {tool.averageRating?.toFixed(1) || "—"}
                  </span>
                </div>
              </div>

              {isAuthenticated && user ? (
                <form onSubmit={handleSubmitReview} className="space-y-6 mb-10">
                  <div>
                    <label className="block text-sm font-medium text-[#1B1464]/70 mb-3">
                      Your Rating
                    </label>
                    <StarPicker value={rating} onChange={setRating} />
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Review title (optional)"
                    className="w-full px-5 py-3.5 border border-[#E8EAFF] rounded-2xl focus:outline-none focus:border-[#2E4BC6] text-base"
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your honest review..."
                    rows={5}
                    className="w-full px-5 py-3.5 border border-[#E8EAFF] rounded-2xl focus:outline-none focus:border-[#2E4BC6] resize-y text-base"
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <textarea
                      value={pros}
                      onChange={(e) => setPros(e.target.value)}
                      placeholder="Pros (optional)"
                      rows={3}
                      className="w-full px-5 py-3.5 border border-[#E8EAFF] rounded-2xl focus:outline-none focus:border-[#2E4BC6] text-sm resize-y"
                    />
                    <textarea
                      value={cons}
                      onChange={(e) => setCons(e.target.value)}
                      placeholder="Cons (optional)"
                      rows={3}
                      className="w-full px-5 py-3.5 border border-[#E8EAFF] rounded-2xl focus:outline-none focus:border-[#2E4BC6] text-sm resize-y"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={createReviewMutation.isPending}
                    className="w-full bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:brightness-105 transition-all disabled:opacity-70"
                  >
                    {createReviewMutation.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send size={19} /> Submit Review
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 text-[#1B1464]/60 bg-[#F8F9FF] rounded-2xl">
                  Log in to write a review
                </div>
              )}

              <div className="space-y-10">
                {reviews.length === 0 ? (
                  <p className="text-center text-[#1B1464]/50 py-12">
                    No reviews yet. Be the first!
                  </p>
                ) : (
                  reviews.map((review: Review) => (
                    <div
                      key={review.id}
                      className="border-t border-[#E8EAFF] pt-8 first:border-t-0 first:pt-0"
                    >
                      <div className="flex justify-between items-start mb-2 mt-8">
                        <div>
                          <p className="font-semibold text-[#1B1464]">
                            {review.user?.username || "Anonymous"}
                          </p>
                          <div className="flex text-amber-400 mt-0.5">
                            {"★".repeat(review.rating)}
                          </div>
                        </div>
                        <span className="text-xs text-[#1B1464]/50">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.title && (
                        <p className="font-medium text-lg mb-2">
                          {review.title}
                        </p>
                      )}
                      <p className="text-[#1B1464]/80 leading-relaxed">
                        {review.content}
                      </p>
                      {(review.pros || review.cons) && (
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                          {review.pros && (
                            <div className="bg-emerald-50/70 p-4 rounded-2xl">
                              <span className="font-medium text-emerald-700 block mb-1">
                                Pros
                              </span>
                              <p className="text-emerald-700/80">
                                {review.pros}
                              </p>
                            </div>
                          )}
                          {review.cons && (
                            <div className="bg-red-50/70 p-4 rounded-2xl">
                              <span className="font-medium text-red-700 block mb-1">
                                Cons
                              </span>
                              <p className="text-red-700/80">{review.cons}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToolDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-20 flex items-center justify-center bg-[#F8F9FF]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-[#E8EAFF] border-t-[#2E4BC6] animate-spin mx-auto mb-4" />
            <p className="text-[#1B1464]/60">Loading tool details...</p>
          </div>
        </div>
      }
    >
      <ToolDetailPageInner />
    </Suspense>
  );
}
