"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, ShoppingCart, User, Settings } from "lucide-react";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/user/dashboard", label: "Home" },
  { href: "/user/Bouquets", label: "Bouquets" },
  { href: "/user/plants", label: "Plants" },
  { href: "/user/roses", label: "Roses" },
  { href: "/user/settings", label: "Settings" },
];

export default function Header({ onOpenMfaSettings }: { onOpenMfaSettings?: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { cartCount } = useCart();

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
          <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
            {onOpenMfaSettings && (
              <button
                onClick={onOpenMfaSettings}
                className="p-2 text-slate-400 hover:text-white transition"
                title="Security Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <User className="w-4 h-4" />
            </div>

            <span className="hidden md:inline text-sm font-medium text-slate-300">
              Dashboard
            </span>
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