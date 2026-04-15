"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Ticket, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function KasirLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:sticky top-0 h-screen inset-y-0 left-0 z-50 w-64 bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-6 border-b border-zinc-800">
          <Link href="/kasir" className="text-2xl font-extrabold tracking-tighter text-red-600">CINEPLEX</Link>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Kasir Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/kasir" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all font-medium text-sm group">
            <Ticket className="w-5 h-5 text-zinc-500 group-hover:text-red-500 transition-colors" />
            Point of Sale
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-4 py-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 font-bold text-sm">
              {user?.name?.charAt(0) || "K"}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-zinc-500">{user?.role}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-zinc-400 hover:text-red-400 hover:bg-red-500/10">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex items-center justify-between lg:justify-end">
          <Button variant="ghost" size="icon" className="lg:hidden text-zinc-400" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
          <p className="text-sm text-zinc-500">Kasir: <span className="text-white font-medium">{user?.name}</span></p>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
