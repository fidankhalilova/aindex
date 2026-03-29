"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LogOut, User, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { getStrapiMedia } from "@/lib/api";
import Image from "next/image";
import toast from "react-hot-toast";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Browse Tools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileOpen(false);
    setUserMenu(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully");
    router.push("/");
  };

  // Fixed avatar URL handling (compatible with your current Strapi v5 User type)
  const avatarUrl = user?.avatar?.url ? getStrapiMedia(user.avatar.url) : null;

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest(".user-menu-container")) {
          setUserMenu(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [userMenu]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-sm border-b border-[#E8EAFF]"
          : "bg-linear-to-r from-[#1B1464] to-[#2E4BC6]"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" fill="#2E4BC6" />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="#2E4BC6"
                strokeWidth="1.5"
              />
              <path
                d="M12 6v2M12 16v2M6 12H4M20 12h-2"
                stroke="#2E4BC6"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span
            className={`font-display font-bold text-xl transition-colors ${
              scrolled ? "text-[#1B1464]" : "text-white"
            }`}
          >
            AIndex
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === href
                    ? scrolled
                      ? "bg-[#2E4BC6] text-white"
                      : "bg-white/20 text-white backdrop-blur-sm"
                    : scrolled
                      ? "text-gray-700 hover:text-[#2E4BC6] hover:bg-gray-100"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Section */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Submit Tool Button */}
              <Link
                href="/tools/submit"
                className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
                  scrolled
                    ? "bg-[#2E4BC6] hover:bg-[#1B1464] text-white shadow-sm"
                    : "bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                }`}
              >
                <Plus size={16} /> Submit Tool
              </Link>

              {/* User Menu */}
              <div className="relative user-menu-container">
                <button
                  onClick={() => setUserMenu((v) => !v)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all ${
                    scrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 bg-linear-to-br from-[#2E4BC6] to-[#00C2CB]">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={user.username}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                        {user.username?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <span
                      className={`text-sm font-semibold ${scrolled ? "text-gray-800" : "text-white"}`}
                    >
                      {user.username}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${userMenu ? "rotate-180" : ""} ${scrolled ? "text-gray-600" : "text-white/70"}`}
                    />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E8EAFF] py-2 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenu(false)}
                    >
                      <User size={17} className="text-[#2E4BC6]" />
                      My Profile
                    </Link>
                    <hr className="my-1 border-[#E8EAFF]" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={17} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={`px-5 py-2 text-sm font-medium rounded-xl transition-all ${
                  scrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  scrolled
                    ? "bg-[#2E4BC6] text-white hover:bg-[#1B1464]"
                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                }`}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden p-2 rounded-xl transition-colors ${
            scrolled
              ? "text-gray-700 hover:bg-gray-100"
              : "text-white hover:bg-white/10"
          }`}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className={`lg:hidden border-t ${scrolled ? "bg-white border-[#E8EAFF]" : "bg-[#1B1464] border-white/20"}`}
        >
          <div className="px-4 py-6 space-y-2">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block px-4 py-3 rounded-2xl text-sm font-medium ${
                  pathname === href
                    ? scrolled
                      ? "bg-[#2E4BC6] text-white"
                      : "bg-white/20 text-white"
                    : scrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-white/80 hover:bg-white/10"
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="pt-4 border-t border-[#E8EAFF]/30 mt-4">
              {isAuthenticated && user ? (
                <>
                  <Link
                    href="/profile"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-2xl"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/tools/submit"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-2xl"
                  >
                    Submit Tool
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-2xl"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/auth/login"
                    className="block text-center py-3 border border-[#2E4BC6] text-[#2E4BC6] font-semibold rounded-2xl hover:bg-[#2E4BC6] hover:text-white transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block text-center py-3 bg-[#2E4BC6] text-white font-semibold rounded-2xl hover:bg-[#1B1464]"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
