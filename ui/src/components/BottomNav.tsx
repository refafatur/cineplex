"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Ticket, User, Film } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  // Do not show on admin, kasir, login, or register
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/kasir") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  const navs = [
    { name: "Beranda", icon: Home, href: "/" },
    { name: "Film", icon: Film, href: "/movies" },
    { name: "Tiket", icon: Ticket, href: "/my-bookings" },
    { name: "Profil", icon: User, href: "/profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-zinc-800 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navs.map((nav) => {
          const isActive = pathname === nav.href;
          const Icon = nav.icon;
          return (
            <Link
              key={nav.name}
              href={nav.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-red-500" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : ""}`} />
              <span className="text-[10px] font-bold">{nav.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
