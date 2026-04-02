"use client";
export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, ArrowLeft, ExternalLink, Star } from "lucide-react";
import { useTool } from "@/hooks/useTools";
import { getStrapiMedia } from "@/lib/apiClient";

function CompareWinnerPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("slug");

  const { data: tool, isLoading, error } = useTool(slug as string);

  useEffect(() => {
    if (!slug) {
      router.replace("/compare");
    }
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#1B1464] to-[#00C2CB] flex items-center justify-center text-white">
        <div className="text-center">
          <Trophy className="w-20 h-20 mx-auto mb-6 animate-bounce" />
          <p className="text-2xl font-medium">Declaring the winner...</p>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">Tool not found</p>
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

  const logoUrl = getStrapiMedia(tool.logo?.url ?? null);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1B1464] via-[#2E4BC6] to-[#00C2CB] text-white pt-20 pb-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-10 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} /> Back to comparison
        </button>

        <div className="mb-12">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur px-8 py-3 rounded-full mb-8">
            <Trophy className="text-amber-300" size={36} />
            <span className="uppercase tracking-widest text-sm font-semibold">
              Our Winner
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
            {tool.name} <span className="text-amber-300">wins!</span>
          </h1>
          <p className="mt-4 text-xl text-white/80">
            Best match based on rating and popularity
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 md:p-14">
          <div className="flex justify-center mb-10 relative">
            <div className="w-44 h-44 rounded-3xl overflow-hidden border-8 border-white/30 bg-white/10 p-6 shadow-2xl">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={tool.name}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl font-bold text-white/70">
                  {tool.name?.[0] || "?"}
                </div>
              )}
            </div>
            <div className="absolute -top-4 -right-4 bg-amber-400 text-[#1B1464] font-black text-3xl w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-white/50">
              #1
            </div>
          </div>

          <h2 className="text-4xl font-display font-bold mb-6">{tool.name}</h2>

          <div className="flex justify-center gap-12 mb-10">
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-300">
                {(tool.averageRating || 0).toFixed(1)}
              </div>
              <div className="flex justify-center gap-1 my-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={26}
                    className="fill-amber-300 text-amber-300"
                  />
                ))}
              </div>
              <p className="text-sm text-white/60">Rating</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold">{tool.reviewsCount || 0}</div>
              <p className="text-sm text-white/60 mt-2">Reviews</p>
            </div>
          </div>

          {tool.shortDescription && (
            <p className="text-lg text-white/90 max-w-md mx-auto leading-relaxed mb-12">
              {tool.shortDescription}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none bg-white text-[#1B1464] font-semibold py-4 px-10 rounded-2xl hover:bg-amber-300 transition-all flex items-center justify-center gap-3"
            >
              Visit Website <ExternalLink size={20} />
            </a>
            <Link
              href={`/tools/${tool.slug}`}
              className="flex-1 sm:flex-none border border-white/60 hover:bg-white/10 font-semibold py-4 px-10 rounded-2xl transition-all"
            >
              Read Full Review
            </Link>
          </div>
        </div>

        <p className="mt-10 text-white/60">
          Not convinced?{" "}
          <Link href="/compare" className="underline hover:text-white">
            Go back to comparison
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CompareWinnerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-[#1B1464] to-[#00C2CB] flex items-center justify-center text-white">
          <div className="text-center">
            <Trophy className="w-20 h-20 mx-auto mb-6 animate-bounce" />
            <p className="text-2xl font-medium">Declaring the winner...</p>
          </div>
        </div>
      }
    >
      <CompareWinnerPageInner />
    </Suspense>
  );
}
