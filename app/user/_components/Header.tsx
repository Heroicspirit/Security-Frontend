"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ShoppingCart, User, Settings, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/user/dashboard", label: "Home" },
  { href: "/user/bouquets", label: "bouquets" },
  { href: "/user/plants", label: "Plants" },
  { href: "/user/roses", label: "Roses" },
  { href: "/user/settings", label: "Settings" },
];

export default function Header({ onOpenMfaSettings }: { onOpenMfaSettings?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cartCount } = useCart();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Clear client-side cookies
    document.cookie = "auth_token=; path=/; max-age=0";
    document.cookie = "user_data=; path=/; max-age=0";

    router.push("/login");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0f1115]/90 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href="/user/dashboard"
          className="text-xl font-bold tracking-tight text-white hover:opacity-90 transition"
        >
          Bloom<span className="text-pink-400">Bliss</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition ${
                isActive(link.href)
                  ? "text-white border-b-2 border-pink-400 pb-0.5"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="relative flex-1 max-w-md mx-4 hidden sm:block">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>

          <input
            type="text"
            placeholder="Search flowers..."
            className="w-full bg-slate-900/60 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">

          {/* Cart */}
          <Link
            href="/user/cart"
            className="relative p-2 text-slate-400 hover:text-white transition"
          >
            <ShoppingCart className="w-5 h-5" />

            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-pink-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          <div className="flex items-center gap-2 border-l border-slate-800 pl-3 relative">
            {onOpenMfaSettings && (
              <button
                onClick={onOpenMfaSettings}
                className="p-2 text-slate-400 hover:text-white transition"
                title="Security Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 hover:bg-slate-800/50 rounded-lg px-2 py-1 transition"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden md:inline text-sm font-medium text-slate-300">
                Dashboard
              </span>
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#111319] border border-slate-800 rounded-xl overflow-hidden z-20 shadow-xl">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800/60 transition flex items-center gap-3"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg border border-slate-800 text-slate-300"
          >
            ☰
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 border-t border-slate-800 pt-4">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition ${
                  isActive(link.href)
                    ? "text-pink-400 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}