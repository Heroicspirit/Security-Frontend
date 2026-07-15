"use client";

import { Home, Settings, ShoppingCart, ShieldAlert, LogOut, PackageSearch } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      {children}
    </div>
  );
}
