// app/tools/submit/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Lock } from "lucide-react";
import { useCategories, useFeatures, useTags, useSubmitTool } from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";

const PRICING_OPTS = [
  { value: "Free", label: "Free" },
  { value: "Freemium", label: "Freemium" },
  { value: "Paid", label: "Paid" },
  { value: "Enterprise", label: "Enterprise" },
];

// Simple slug generator
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-") // remove multiple hyphens
    .replace(/^-|-$/g, ""); // remove leading/trailing hyphens
};

export default function SubmitToolPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const submitTool = useSubmitTool();

  const { data: categoriesData } = useCategories();
  const { data: featuresData = [] } = useFeatures();
  const { data: tagsData = [] } = useTags();

  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    description: "",
    website: "",
    pricing: "Free" as const,
    pricingDetails: "",
    categoryId: "",
    selectedFeatureIds: [] as number[],
    selectedTagIds: [] as number[],
  });

  const [submitting, setSubmitting] = useState(false);

  const toggleFeature = (id: number) => {
    setForm((prev) => ({
      ...prev,
      selectedFeatureIds: prev.selectedFeatureIds.includes(id)
        ? prev.selectedFeatureIds.filter((fid) => fid !== id)
        : [...prev.selectedFeatureIds, id],
    }));
  };

  const toggleTag = (id: number) => {
    setForm((prev) => ({
      ...prev,
      selectedTagIds: prev.selectedTagIds.includes(id)
        ? prev.selectedTagIds.filter((tid) => tid !== id)
        : [...prev.selectedTagIds, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.shortDescription ||
      !form.website ||
      !form.categoryId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    const categoryId = Number(form.categoryId);
    if (isNaN(categoryId) || categoryId <= 0) {
      toast.error("Please select a valid category");
      return;
    }

    const slug = generateSlug(form.name);

    if (!slug) {
      toast.error("Tool name is invalid. Please enter a valid name.");
      return;
    }

    setSubmitting(true);

    try {
      await submitTool.mutateAsync({
        name: form.name.trim(),
        slug, // ← Added this
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        website: form.website.trim(),
        pricing: form.pricing,
        pricingDetails: form.pricingDetails.trim(),

        categories: [categoryId],
        features: form.selectedFeatureIds,
        tags: form.selectedTagIds,

        submittedBy: user.id,
      });

      toast.success("Tool submitted successfully! Our team will review it.");
      router.push("/profile");
    } catch (err: any) {
      console.error(err?.response?.data || err);
      const message =
        err?.response?.data?.error?.message || "Failed to submit tool";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ... rest of your component (loading, auth check, form JSX) remains the same ...

  return (
    <div className="min-h-screen bg-[#F8F9FF] pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <Link
          href="/tools"
          className="flex items-center gap-2 text-[#1B1464]/60 hover:text-[#2E4BC6] mb-8"
        >
          <ArrowLeft size={18} /> Back to Tools
        </Link>

        <h1 className="text-4xl font-bold text-[#1B1464] mb-2">
          Submit an AI Tool
        </h1>
        <p className="text-[#1B1464]/60 mb-10">
          Share a great tool with the community. Our team will review it before
          publishing.
        </p>

        <div className="bg-white rounded-3xl shadow-sm border border-[#E8EAFF] p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name & Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1B1464]/70 mb-2">
                  Tool Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Claude 3.5 Sonnet"
                  className="w-full px-5 py-3.5 bg-[#F8F9FF] border border-[#E8EAFF] rounded-2xl focus:outline-none focus:border-[#2E4BC6]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1B1464]/70 mb-2">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.website}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, website: e.target.value }))
                  }
                  placeholder="https://example.com"
                  className="w-full px-5 py-3.5 bg-[#F8F9FF] border border-[#E8EAFF] rounded-2xl focus:outline-none focus:border-[#2E4BC6]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1B1464]/70 mb-2">
                Short Description <span className="text-red-500">*</span>
              </label>
              <input
                value={form.shortDescription}
                onChange={(e) =>
                  setForm((p) => ({ ...p, shortDescription: e.target.value }))
                }
                maxLength={160}
                placeholder="One sentence that describes the tool"
                className="w-full px-5 py-3.5 bg-[#F8F9FF] border border-[#E8EAFF] rounded-2xl focus:outline-none focus:border-[#2E4BC6]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1B1464]/70 mb-2">
                Full Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={5}
                placeholder="Explain what the tool does..."
                className="w-full px-5 py-3.5 bg-[#F8F9FF] border border-[#E8EAFF] rounded-2xl focus:outline-none focus:border-[#2E4BC6] resize-y"
              />
            </div>

            {/* Category + Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1B1464]/70 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, categoryId: e.target.value }))
                  }
                  className="w-full px-5 py-3.5 bg-[#F8F9FF] border border-[#E8EAFF] rounded-2xl focus:outline-none focus:border-[#2E4BC6]"
                  required
                >
                  <option value="">Select a category</option>
                  {categoriesData?.data?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1B1464]/70 mb-2">
                  Pricing
                </label>
                <select
                  value={form.pricing}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, pricing: e.target.value as any }))
                  }
                  className="w-full px-5 py-3.5 bg-[#F8F9FF] border border-[#E8EAFF] rounded-2xl focus:outline-none focus:border-[#2E4BC6]"
                >
                  {PRICING_OPTS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1B1464]/70 mb-2">
                Pricing Details
              </label>
              <input
                value={form.pricingDetails}
                onChange={(e) =>
                  setForm((p) => ({ ...p, pricingDetails: e.target.value }))
                }
                placeholder="e.g. Free tier available • Pro at $19/month"
                className="w-full px-5 py-3.5 bg-[#F8F9FF] border border-[#E8EAFF] rounded-2xl focus:outline-none focus:border-[#2E4BC6]"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-[#1B1464]/70 mb-3">
                Key Features
              </label>
              <div className="max-h-64 overflow-y-auto p-4 border border-[#E8EAFF] rounded-2xl bg-[#F8F9FF] grid grid-cols-1 sm:grid-cols-2 gap-2">
                {featuresData.map((f) => (
                  <label
                    key={f.id}
                    className="flex items-center gap-2 p-2 hover:bg-white rounded-xl cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.selectedFeatureIds.includes(f.id)}
                      onChange={() => toggleFeature(f.id)}
                    />
                    {f.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-[#1B1464]/70 mb-3">
                Tags
              </label>
              <div className="max-h-64 overflow-y-auto p-4 border border-[#E8EAFF] rounded-2xl bg-[#F8F9FF] grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tagsData.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-center gap-2 p-2 hover:bg-white rounded-xl cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.selectedTagIds.includes(t.id)}
                      onChange={() => toggleTag(t.id)}
                    />
                    {t.name}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 hover:brightness-105 transition-all disabled:opacity-70"
            >
              <Send size={20} />
              {submitting
                ? "Submitting for Review..."
                : "Submit Tool for Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
