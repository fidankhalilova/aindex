"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { authService } from "@/services/authService";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!identifier.trim()) e.identifier = "Email or username is required";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await authService.login({
        identifier: identifier.trim(),
        password,
      });

      login(response.jwt, response.user);

      toast.success(`Welcome back, ${response.user.username}!`);
      router.push("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.error?.message || "Invalid credentials";
      toast.error(message);

      if (message.toLowerCase().includes("password")) {
        setErrors({ password: "Incorrect password" });
      } else {
        setErrors({ identifier: "Invalid email or username" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FF] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#1B1464] via-[#2E4BC6] to-[#4A8FD4] items-center justify-center p-16 relative overflow-hidden">
        <div className="relative text-center z-10">
          <h2 className="font-bold text-white text-5xl leading-tight mb-4">
            Welcome Back
          </h2>
          <p className="text-white/70 text-lg">
            Sign in to discover the best AI tools.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6 py-16">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="flex items-center gap-3 justify-center mb-10 lg:hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#2E4BC6] to-[#00C2CB] flex items-center justify-center">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <span className="font-bold text-2xl text-[#1B1464]">AINavix</span>
          </Link>

          <h1 className="text-4xl font-bold text-[#1B1464] mb-2">Sign In</h1>
          <p className="text-[#1B1464]/60 mb-8">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[#2E4BC6] font-semibold hover:underline"
            >
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1B1464]/70 mb-2">
                Email or Username
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com or username"
                className={`w-full px-5 py-3.5 border rounded-2xl focus:outline-none transition-all ${
                  errors.identifier
                    ? "border-red-400"
                    : "border-[#E8EAFF] focus:border-[#2E4BC6]"
                }`}
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[#1B1464]/70">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#2E4BC6] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-[#2E4BC6] to-[#00C2CB] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 hover:brightness-105 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
              ) : (
                <>
                  <LogIn size={20} /> Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
