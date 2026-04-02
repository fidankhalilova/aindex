"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, UserPlus } from "lucide-react";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";

const PERKS = [
  "Submit AI tools for review",
  "Write verified reviews",
  "Save and compare tools",
  "Get notified on new releases",
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.username.trim() || form.username.length < 3)
      e.username = "Username must be at least 3 characters";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email is required";
    if (!form.password || form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await authService.register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      login(response.jwt, response.user);

      toast.success(`Welcome to AINavix, ${response.user.username}!`);
      router.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#1B1464] via-[#2E4BC6] to-[#4A8FD4] items-center justify-center p-16 relative overflow-hidden">
        <div className="relative z-10 text-center">
          <h2 className="text-5xl font-bold text-white leading-tight mb-6">
            Join the Community
          </h2>
          <p className="text-white/70 mb-10">
            Free account. Start discovering better AI tools today.
          </p>

          <ul className="space-y-4 text-left text-white/80">
            {PERKS.map((perk, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-4xl font-bold text-[#1B1464] mb-2">
            Create Account
          </h1>
          <p className="text-[#1B1464]/60 mb-8">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#2E4BC6] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1B1464]/70 mb-2">
                Username
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="yourname"
                className={`w-full px-5 py-3.5 border rounded-2xl focus:outline-none transition-all ${
                  errors.username
                    ? "border-red-400"
                    : "border-[#E8EAFF] focus:border-[#2E4BC6]"
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1B1464]/70 mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-5 py-3.5 border rounded-2xl focus:outline-none transition-all ${
                  errors.email
                    ? "border-red-400"
                    : "border-[#E8EAFF] focus:border-[#2E4BC6]"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1B1464]/70 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-5 py-3.5 border rounded-2xl pr-12 focus:outline-none transition-all ${
                    errors.password
                      ? "border-red-400"
                      : "border-[#E8EAFF] focus:border-[#2E4BC6]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1B1464]/70 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showCp ? "text" : "password"}
                  value={form.confirm}
                  onChange={(e) => handleChange("confirm", e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-5 py-3.5 border rounded-2xl pr-12 focus:outline-none transition-all ${
                    errors.confirm
                      ? "border-red-400"
                      : "border-[#E8EAFF] focus:border-[#2E4BC6]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCp(!showCp)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showCp ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirm && (
                <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 hover:brightness-105 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
              ) : (
                <>
                  <UserPlus size={20} /> Create Account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
