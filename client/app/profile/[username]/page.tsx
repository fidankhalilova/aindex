// app/profile/[username]/page.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Package,
  MessageSquare,
  Check,
  User,
} from "lucide-react";
import {
  useUserByUsername,
  useReviewsByUser,
  useUserSubmittedTools,
  getStrapiMedia,
} from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import { Review, Tool } from "@/types";

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [tab, setTab] = useState<"reviews" | "submitted">("reviews");

  const { data: profile } = useUserByUsername(username || "");
  const { data: reviews = [] } = useReviewsByUser(profile?.id ?? 0, {
    enabled: !!profile?.id,
  });
  const { data: submittedRaw = [] } = useUserSubmittedTools(profile?.id ?? 0, {
    enabled: !!profile?.id,
  });

  const submitted = submittedRaw.filter((tool) => tool.state === "Published");

  const isOwnProfile = currentUser?.id === profile?.id;

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] pt-20 flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-6">👤</div>
        <h2 className="text-3xl font-bold text-[#1B1464] mb-2">
          User not found
        </h2>
        <p className="text-[#1B1464]/60 text-center">
          No user with username @{username}
        </p>
        <Link
          href="/tools"
          className="mt-8 text-[#2E4BC6] font-medium flex items-center gap-2 hover:underline"
        >
          ← Back to Tools
        </Link>
      </div>
    );
  }

  const avatarUrl = profile.avatar?.url
    ? getStrapiMedia(profile.avatar.url)
    : null;
  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : "—";

  return (
    <div className="min-h-screen bg-[#F8F9FF] pt-14">
      {/* Hero Header */}
      <div className="bg-linear-to-br from-[#1B1464] via-[#2E4BC6] to-[#4A8FD4] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-28 relative">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-10 transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-white/30 bg-linear-to-br from-[#4A6DE0] to-[#00C2CB] shadow-2xl shrink-0">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={profile.username}
                  width={144}
                  height={144}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                  {profile.username[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-3 justify-center sm:justify-start mb-2">
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                  {profile.username}
                </h1>
                {isOwnProfile && (
                  <span className="bg-white/20 text-white text-xs px-4 py-1.5 rounded-full flex items-center gap-1.5 mt-1">
                    <Check size={14} /> You
                  </span>
                )}
              </div>

              <p className="text-white/70 text-lg">Member since {joinDate}</p>

              {profile.bio && (
                <p className="text-white/80 mt-5 max-w-2xl text-[17px] leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>

            {isOwnProfile && (
              <Link
                href="/profile"
                className="mt-6 sm:mt-0 border border-white/40 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-medium transition-all flex items-center gap-2"
              >
                <User size={18} /> Edit Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-5xl mx-auto px-4 mt-14 mb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: MessageSquare, label: "Reviews", value: reviews.length },
            { icon: Package, label: "Tools Added", value: submitted.length },
            { icon: Star, label: "Average Rating", value: avgRating },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-white rounded-3xl p-7 text-center border border-[#E8EAFF] shadow-sm"
            >
              <Icon size={28} className="text-[#2E4BC6] mx-auto mb-4" />
              <div className="text-4xl font-bold text-[#1B1464] mb-1">
                {value}
              </div>
              <div className="text-sm text-[#1B1464]/50">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex border-b border-[#E8EAFF] mb-10">
          {(["reviews", "submitted"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-5 px-8 font-semibold text-lg border-b-2 transition-all ${
                tab === t
                  ? "border-[#2E4BC6] text-[#2E4BC6]"
                  : "border-transparent text-[#1B1464]/60 hover:text-[#1B1464]"
              }`}
            >
              {t === "reviews"
                ? `Reviews (${reviews.length})`
                : `Tools (${submitted.length})`}
            </button>
          ))}
        </div>

        {/* Reviews Tab */}
        {tab === "reviews" ? (
          reviews.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E8EAFF]">
              <MessageSquare
                size={64}
                className="mx-auto text-[#E8EAFF] mb-6"
              />
              <p className="text-[#1B1464]/50 text-lg">
                {isOwnProfile ? "You haven't" : `${profile.username} hasn't`}{" "}
                written any reviews yet.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-3xl p-8 border border-[#E8EAFF] shadow-sm"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="font-semibold text-lg text-[#1B1464]">
                        {review.tool?.name || "Unknown Tool"}
                      </p>
                      <p className="text-sm text-[#1B1464]/50 mt-1">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div className="flex text-amber-400 text-2xl">
                      {"★".repeat(review.rating)}
                    </div>
                  </div>

                  {review.title && (
                    <p className="font-medium text-xl mb-4">{review.title}</p>
                  )}

                  <p className="text-[#1B1464]/80 leading-relaxed text-[17px]">
                    {review.content}
                  </p>

                  {(review.pros || review.cons) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      {review.pros && (
                        <div className="bg-emerald-50 rounded-2xl p-6">
                          <p className="font-semibold text-emerald-700 mb-2">
                            ✅ Pros
                          </p>
                          <p className="text-emerald-700/80 whitespace-pre-wrap">
                            {review.pros}
                          </p>
                        </div>
                      )}
                      {review.cons && (
                        <div className="bg-red-50 rounded-2xl p-6">
                          <p className="font-semibold text-red-700 mb-2">
                            ⚠️ Cons
                          </p>
                          <p className="text-red-700/80 whitespace-pre-wrap">
                            {review.cons}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          /* Submitted Tools Tab */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {submitted.length === 0 ? (
              <div className="col-span-2 text-center py-20 bg-white rounded-3xl border border-[#E8EAFF]">
                <Package size={64} className="mx-auto text-[#E8EAFF] mb-6" />
                <p className="text-[#1B1464]/50 text-lg">
                  {isOwnProfile ? "You haven't" : `${profile.username} hasn't`}{" "}
                  published any tools yet.
                </p>
              </div>
            ) : (
              submitted.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-white rounded-3xl p-7 border border-[#E8EAFF] hover:shadow-md transition-shadow group"
                >
                  <div className="flex gap-5">
                    {tool.logo && (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F8F9FF] border border-[#E8EAFF] shrink-0">
                        <Image
                          src={getStrapiMedia(tool.logo.url)!}
                          alt={tool.name}
                          width={64}
                          height={64}
                          className="object-contain p-3"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xl text-[#1B1464] group-hover:text-[#2E4BC6] transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-[#1B1464]/70 mt-3 line-clamp-3 leading-relaxed">
                        {tool.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[#E8EAFF] flex items-center justify-between">
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-[#2E4BC6] font-medium hover:underline"
                    >
                      View Tool →
                    </Link>
                    <span className="text-xs text-[#1B1464]/50">
                      {new Date(tool.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
