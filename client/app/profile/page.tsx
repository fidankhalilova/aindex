// app/profile/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Star,
  Edit2,
  Save,
  X,
  Lock,
  Package,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import {
  useReviewsByUser,
  useUserSubmittedTools,
  useUpdateProfile,
  useUploadAvatar,
  getStrapiMedia,
} from "@/lib/api";
import { Review, Tool } from "@/types";
import toast from "react-hot-toast";

type Tab = "reviews" | "submitted";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, refreshUser, logout } = useAuth();

  const [tab, setTab] = useState<Tab>("reviews");
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Queries
  const { data: reviews = [] } = useReviewsByUser(user?.id ?? 0, {
    enabled: !!user?.id,
  });

  const { data: submitted = [] } = useUserSubmittedTools(user?.id ?? 0, {
    enabled: !!user?.id,
  });

  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setUsername(user.username || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        data: { bio, username },
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
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      await uploadAvatar.mutateAsync({ userId: user.id, file });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] pt-20 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#E8EAFF] border-t-[#2E4BC6] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] pt-20 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <Lock size={40} className="text-[#2E4BC6]" />
        <h2 className="text-3xl font-bold text-[#1B1464]">
          Sign in to view profile
        </h2>
        <Link
          href="/auth/login"
          className="bg-gradient-to-r from-[#2E4BC6] to-[#00C2CB] text-white font-semibold px-8 py-3.5 rounded-2xl"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const avatarUrl = user.avatar?.url ? getStrapiMedia(user.avatar.url) : null;
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "—";

  return (
    <div className="min-h-screen bg-[#F8F9FF] pt-14">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#1B1464] via-[#2E4BC6] to-[#4A8FD4] relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-white/30 shadow-xl bg-gradient-to-br from-[#4A6DE0] to-[#00C2CB]">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={user.username}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                    {user.username[0].toUpperCase()}
                  </span>
                )}
              </div>

              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-[#F8F9FF] transition-all"
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
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              {editing ? (
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-3xl font-bold bg-white/10 border border-white/30 rounded-2xl px-4 py-2 text-white w-full max-w-xs focus:outline-none"
                />
              ) : (
                <h1 className="text-4xl font-bold text-white">
                  {user.username}
                </h1>
              )}

              <p className="text-white/70 mt-1">
                {user.email} • Joined {joinDate}
              </p>

              {editing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={250}
                  rows={3}
                  placeholder="Write something about yourself..."
                  className="mt-4 w-full max-w-md bg-white/10 border border-white/30 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:outline-none"
                />
              ) : (
                <p className="text-white/75 mt-3 max-w-md">
                  {user.bio || "No bio added yet."}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {editing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={updateProfile.isPending}
                    className="flex items-center gap-2 bg-white text-[#2E4BC6] font-semibold px-6 py-3 rounded-2xl hover:bg-[#F8F9FF]"
                  >
                    <Save size={18} />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setBio(user.bio || "");
                      setUsername(user.username);
                    }}
                    className="flex items-center gap-2 border border-white/40 text-white px-6 py-3 rounded-2xl hover:bg-white/10"
                  >
                    <X size={18} /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 border border-white/40 text-white px-6 py-3 rounded-2xl hover:bg-white/10"
                  >
                    <Edit2 size={18} /> Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-200 border border-red-400/30 px-6 py-3 rounded-2xl hover:bg-red-500/10"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 mt-8 mb-10">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: MessageSquare, label: "Reviews", value: reviews.length },
            { icon: Package, label: "Submitted", value: submitted.length },
            { icon: Star, label: "Avg Rating", value: avgRating },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-white rounded-3xl p-6 text-center border border-[#E8EAFF] shadow-sm"
            >
              <Icon size={24} className="text-[#2E4BC6] mx-auto mb-3" />
              <div className="text-3xl font-bold text-[#1B1464]">{value}</div>
              <div className="text-xs text-[#1B1464]/50 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="flex border-b border-[#E8EAFF] mb-8">
          {(["reviews", "submitted"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-4 px-8 font-medium text-lg transition-all border-b-2 ${
                tab === t
                  ? "border-[#2E4BC6] text-[#2E4BC6]"
                  : "border-transparent text-[#1B1464]/60 hover:text-[#1B1464]"
              }`}
            >
              {t === "reviews"
                ? `My Reviews (${reviews.length})`
                : `Submitted Tools (${submitted.length})`}
            </button>
          ))}
        </div>

        {tab === "reviews" ? (
          reviews.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E8EAFF]">
              <MessageSquare
                size={60}
                className="mx-auto text-[#E8EAFF] mb-4"
              />
              <p className="text-[#1B1464]/50">
                You haven't written any reviews yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-3xl p-7 border border-[#E8EAFF]"
                >
                  {/* Review Header */}
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

                  {review.title && (
                    <p className="font-medium mb-3">{review.title}</p>
                  )}
                  <p className="text-[#1B1464]/80 leading-relaxed">
                    {review.content}
                  </p>

                  {(review.pros || review.cons) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      {review.pros && (
                        <div className="bg-emerald-50 rounded-2xl p-5">
                          <p className="font-medium text-emerald-700 mb-1">
                            Pros
                          </p>
                          <p className="text-emerald-700/80 text-sm">
                            {review.pros}
                          </p>
                        </div>
                      )}
                      {review.cons && (
                        <div className="bg-red-50 rounded-2xl p-5">
                          <p className="font-medium text-red-700 mb-1">Cons</p>
                          <p className="text-red-700/80 text-sm">
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
        ) : submitted.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E8EAFF]">
            <Package size={60} className="mx-auto text-[#E8EAFF] mb-4" />
            <p className="text-[#1B1464]/50">
              You haven't submitted any tools yet.
            </p>
            <Link
              href="/tools/submit"
              className="mt-6 inline-block bg-gradient-to-r from-[#2E4BC6] to-[#00C2CB] text-white px-8 py-3 rounded-2xl font-semibold"
            >
              Submit Your First Tool
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {submitted.map((tool) => (
              <div
                key={tool.id}
                className="bg-white rounded-3xl p-6 border border-[#E8EAFF]"
              >
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#F8F9FF] border border-[#E8EAFF] flex-shrink-0">
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
        )}
      </div>
    </div>
  );
}
