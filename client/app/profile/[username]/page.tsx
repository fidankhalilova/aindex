// app/profile/[username]/page.tsx
"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Star,
  Edit2,
  Save,
  X,
  LogOut,
  Package,
  MessageSquare,
  Plus,
  Settings,
  Heart,
  Lock as LockIcon,
  Globe,
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useReviewsByUser } from "@/hooks/useReviews";
import { useUserSubmittedTools } from "@/hooks/useTools";
import { useUpdateProfile, useUploadAvatar } from "@/hooks/useUsers";
import { useFavorites } from "@/hooks/useFavorites";
import { getStrapiMedia } from "@/lib/apiClient";
import { Review, Tool } from "@/types";
import toast from "react-hot-toast";

type Tab = "overview" | "reviews" | "submitted" | "favorites";
export const dynamic = "force-dynamic";
export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const router = useRouter();
  const {
    user: currentUser,
    isAuthenticated,
    isLoading: authLoading,
    refreshUser,
    logout,
  } = useAuth();

  const { username: profileUsername } = use(params);

  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [usernameState, setUsernameState] = useState("");
  const [profileUser, setProfileUser] = useState<any>(null); // Target profile user
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fileRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = currentUser?.username === profileUsername;

  // Fetch data only for own profile (for now - you can extend later with public API)
  const { data: reviews = [] } = useReviewsByUser(
    isOwnProfile ? (currentUser?.id ?? 0) : 0,
    { enabled: isOwnProfile && !!currentUser?.id },
  );

  const { data: submitted = [] } = useUserSubmittedTools(
    isOwnProfile ? (currentUser?.id ?? 0) : 0,
    { enabled: isOwnProfile && !!currentUser?.id },
  );

  const { favorites, removeFromFavorites, visibility, toggleVisibility } =
    useFavorites();

  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  // Redirect if not logged in and accessing own profile
  useEffect(() => {
    if (!authLoading && !isAuthenticated && isOwnProfile) {
      router.push("/auth/login");
    }
  }, [authLoading, isAuthenticated, isOwnProfile, router]);

  // Load current user data for editing (only own profile)
  useEffect(() => {
    if (currentUser && isOwnProfile) {
      setBio(currentUser.bio || "");
      setUsernameState(currentUser.username || "");
      setProfileUser(currentUser);
      setLoadingProfile(false);
    }
  }, [currentUser, isOwnProfile]);

  // For other users' profiles - placeholder (you can later add a useUserByUsername hook)
  useEffect(() => {
    if (!isOwnProfile) {
      // TODO: In future, fetch public user data here using profileUsername
      // For now, we show limited info
      setProfileUser({
        username: profileUsername,
        bio: "This is a public profile.",
        // Add more fields when you implement public user fetching
      });
      setLoadingProfile(false);
    }
  }, [profileUsername, isOwnProfile]);

  const handleSaveProfile = async () => {
    if (!currentUser || !isOwnProfile) return;
    try {
      await updateProfile.mutateAsync({
        userId: currentUser.id,
        data: { bio, username: usernameState },
      });
      await refreshUser();
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser || !isOwnProfile) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      await uploadAvatar.mutateAsync({ userId: currentUser.id, file });
      await refreshUser();
      toast.success("Avatar updated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload avatar");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] pt-20 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#E8EAFF] border-t-[#2E4BC6] animate-spin" />
      </div>
    );
  }

  const displayUser = isOwnProfile ? currentUser : profileUser;
  const avatarUrl = displayUser?.avatar?.url
    ? getStrapiMedia(displayUser.avatar.url)
    : null;
  const joinYear = displayUser?.createdAt
    ? new Date(displayUser.createdAt).getFullYear()
    : "2025";

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "—";

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      {/* Hero Header */}
      <div className="bg-linear-to-br from-[#1B1464] via-[#2E4BC6] to-[#4A8FD4] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-linear-to-br from-[#4A6DE0] to-[#00C2CB]">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayUser?.username || profileUsername}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-white text-5xl md:text-6xl font-bold">
                    {(displayUser?.username ||
                      profileUsername)?.[0]?.toUpperCase() || "?"}
                  </span>
                )}
              </div>

              {/* Avatar upload - only for own profile */}
              {isOwnProfile && (
                <>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-9 h-9 md:w-10 md:h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 transition-all"
                  >
                    <Camera size={18} className="text-[#2E4BC6]" />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-white text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {displayUser?.username || profileUsername}
                </h1>
                <div className="inline-block px-3 py-0.5 bg-white/20 text-xs rounded-full backdrop-blur-md">
                  Member since {joinYear}
                </div>
              </div>

              {displayUser?.email && (
                <p className="text-white/75 mt-1 text-sm">
                  {displayUser.email}
                </p>
              )}

              {isOwnProfile && editing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={280}
                  rows={2}
                  placeholder="Tell the community about yourself..."
                  className="mt-3 w-full max-w-lg bg-white/10 border border-white/30 rounded-2xl px-4 py-2 text-sm text-white placeholder-white/60 focus:outline-none resize-y"
                />
              ) : (
                <p className="text-white/80 mt-2 max-w-md mx-auto md:mx-0 leading-relaxed text-sm">
                  {displayUser?.bio || "No bio yet."}
                </p>
              )}
            </div>

            {/* Action Buttons - Only for own profile */}
            {isOwnProfile && (
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                {editing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={updateProfile.isPending}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-[#2E4BC6] font-semibold px-5 py-2 rounded-xl text-sm hover:bg-white/90"
                    >
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setBio(currentUser?.bio || "");
                        setUsernameState(currentUser?.username || "");
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-white/40 text-white px-5 py-2 rounded-xl text-sm hover:bg-white/10"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-white/40 text-white px-5 py-2 rounded-xl text-sm hover:bg-white/10"
                    >
                      <Edit2 size={16} /> Edit Profile
                    </button>
                    <Link
                      href="/tools/submit"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-[#2E4BC6] font-semibold px-5 py-2 rounded-xl text-sm hover:bg-white/90"
                    >
                      <Plus size={16} /> Submit Tool
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 pb-20">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              icon: MessageSquare,
              label: "Reviews Written",
              value: reviews.length,
              color: "text-rose-500",
            },
            {
              icon: Package,
              label: "Tools Submitted",
              value: submitted.length,
              color: "text-emerald-500",
            },
            {
              icon: Star,
              label: "Average Rating",
              value: avgRating,
              color: "text-amber-500",
            },
            {
              icon: Heart,
              label: "Favorites",
              value: favorites.length,
              color: "text-pink-500",
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8EAFF] hover:shadow transition-all"
            >
              <Icon size={26} className={`${color} mb-3`} />
              <div className="text-3xl font-bold text-[#1B1464]">{value}</div>
              <div className="text-xs text-[#1B1464]/60 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8EAFF] mb-8 gap-4">
          <div className="flex overflow-x-auto pb-1 scrollbar-hide">
            {(["overview", "reviews", "submitted", "favorites"] as Tab[]).map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-7 py-3 font-medium text-base whitespace-nowrap transition-all border-b-2 ${
                    tab === t
                      ? "border-[#2E4BC6] text-[#2E4BC6]"
                      : "border-transparent text-[#1B1464]/60 hover:text-[#1B1464]"
                  }`}
                >
                  {t === "favorites"
                    ? `Favorites (${favorites.length})`
                    : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ),
            )}
          </div>

          {isOwnProfile && (
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut size={18} /> Logout
              </button>
              <Link
                href="/settings"
                className="flex items-center gap-2 text-[#1B1464]/70 hover:text-[#1B1464]"
              >
                <Settings size={18} /> Account Settings
              </Link>
            </div>
          )}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <div className="space-y-10">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-[#1B1464]">
                  Recent Activity
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {reviews.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 border border-[#E8EAFF]">
                    <h4 className="font-semibold mb-5 flex items-center gap-2">
                      <MessageSquare size={20} className="text-[#2E4BC6]" />{" "}
                      Recent Reviews
                    </h4>
                    <div className="space-y-6">
                      {reviews.slice(0, 3).map((review: Review) => (
                        <div
                          key={review.id}
                          className="border-b border-[#E8EAFF] pb-6 last:border-0 last:pb-0"
                        >
                          <p className="font-medium text-[#1B1464]">
                            {review.tool?.name || "Unknown Tool"}
                          </p>
                          <p className="text-sm text-[#1B1464]/70 mt-1 line-clamp-2">
                            {review.content}
                          </p>
                          <p className="text-xs text-[#1B1464]/50 mt-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {submitted.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 border border-[#E8EAFF]">
                    <h4 className="font-semibold mb-5 flex items-center gap-2">
                      <Package size={20} className="text-[#2E4BC6]" /> Recently
                      Submitted
                    </h4>
                    <div className="space-y-5">
                      {submitted.slice(0, 3).map((tool: Tool) => (
                        <div key={tool.id} className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#F8F9FF] border border-[#E8EAFF] shrink-0">
                            {tool.logo && (
                              <Image
                                src={getStrapiMedia(tool.logo.url)!}
                                alt={tool.name}
                                width={48}
                                height={48}
                                className="object-contain p-1.5"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[#1B1464] truncate">
                              {tool.name}
                            </p>
                            <p className="text-xs text-[#1B1464]/50">
                              {new Date(tool.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {reviews.length === 0 && submitted.length === 0 && (
                  <div className="col-span-2 text-center py-16 bg-white rounded-3xl border border-[#E8EAFF]">
                    <p className="text-[#1B1464]/60">No recent activity yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {tab === "reviews" &&
          (reviews.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E8EAFF]">
              <MessageSquare
                size={70}
                className="mx-auto text-[#E8EAFF] mb-6"
              />
              <p className="text-xl text-[#1B1464]/60">No reviews yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review: Review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-3xl p-7 border border-[#E8EAFF]"
                >
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <p className="font-semibold text-[#1B1464]">
                        {review.tool?.name || "Unknown Tool"}
                      </p>
                      <p className="text-xs text-[#1B1464]/50">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex text-amber-400">
                      {"★".repeat(review.rating)}
                    </div>
                  </div>
                  <p className="text-[#1B1464]/80">{review.content}</p>
                </div>
              ))}
            </div>
          ))}

        {/* Submitted Tab */}
        {tab === "submitted" &&
          (submitted.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E8EAFF]">
              <Package size={70} className="mx-auto text-[#E8EAFF] mb-6" />
              <p className="text-xl text-[#1B1464]/60">
                No tools submitted yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {submitted.map((tool: Tool) => (
                <div
                  key={tool.id}
                  className="bg-white rounded-3xl p-6 border border-[#E8EAFF]"
                >
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#F8F9FF] border border-[#E8EAFF]">
                      {tool.logo && (
                        <Image
                          src={getStrapiMedia(tool.logo.url)!}
                          alt={tool.name}
                          width={56}
                          height={56}
                          className="object-contain p-2"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-[#1B1464]">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-[#1B1464]/50 mt-1">
                        {new Date(tool.createdAt).toLocaleDateString()}
                      </p>
                      <p className="line-clamp-2 text-sm text-[#1B1464]/70 mt-3">
                        {tool.shortDescription}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

        {/* Favorites Tab */}
        {tab === "favorites" && (
          <div>
            {isOwnProfile && (
              <div className="bg-white rounded-3xl p-6 border border-[#E8EAFF] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {visibility === "public" ? (
                    <Globe className="text-emerald-600" size={28} />
                  ) : (
                    <LockIcon className="text-amber-600" size={28} />
                  )}
                  <div>
                    <p className="font-semibold text-lg text-[#1B1464]">
                      Favorites are{" "}
                      {visibility === "public" ? "Public" : "Private"}
                    </p>
                    <p className="text-sm text-[#1B1464]/60">
                      {visibility === "public"
                        ? "Other users can see your favorite tools"
                        : "Only you can see your favorites"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleVisibility}
                  className={`px-6 py-2.5 rounded-2xl font-medium text-sm transition-all ${
                    visibility === "public"
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  }`}
                >
                  Make {visibility === "public" ? "Private" : "Public"}
                </button>
              </div>
            )}

            {favorites.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#E8EAFF]">
                <Heart size={70} className="mx-auto text-[#E8EAFF] mb-6" />
                <p className="text-xl text-[#1B1464]/60">No favorites yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favorites.map((tool: Tool) => (
                  <div
                    key={tool.id}
                    className="bg-white rounded-3xl p-6 border border-[#E8EAFF] relative group"
                  >
                    {isOwnProfile && (
                      <button
                        onClick={() => removeFromFavorites(tool.id)}
                        className="absolute top-5 right-5 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Heart size={24} fill="currentColor" />
                      </button>
                    )}

                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#F8F9FF] border border-[#E8EAFF] shrink-0">
                        {tool.logo && (
                          <Image
                            src={getStrapiMedia(tool.logo.url)!}
                            alt={tool.name}
                            width={56}
                            height={56}
                            className="object-contain p-2"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-[#1B1464] pr-8">
                          {tool.name}
                        </h3>
                        <p className="line-clamp-2 text-sm text-[#1B1464]/70 mt-3">
                          {tool.shortDescription}
                        </p>
                        <Link
                          href={`/tools/${tool.id}`}
                          className="text-[#2E4BC6] text-sm font-medium mt-4 inline-block hover:underline"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
