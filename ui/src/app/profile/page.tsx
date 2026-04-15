"use client";

import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, LogOut, Settings, CreditCard, Shield, Ticket } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-zinc-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Belum Login</h1>
        <p className="text-zinc-500 mb-8 text-center max-w-sm">Login untuk melihat tiket Anda, mengelola profil, dan mendapatkan promo menarik!</p>
        <div className="flex flex-col w-full max-w-xs gap-4">
          <Link href="/login">
            <Button className="w-full bg-red-600 hover:bg-red-700 h-12 font-bold shadow-[0_0_20px_rgba(220,38,38,0.3)]">Login ke Akun</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-12">Daftar Akun Baru</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Akun Saya</h1>

        <Card className="bg-zinc-900/80 border-zinc-800 shadow-2xl backdrop-blur-md">
          <CardContent className="p-6 md:p-8 flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)]">
              <span className="text-3xl font-bold text-white tracking-widest">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-zinc-400 flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
              <div className="mt-3 inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-semibold text-red-500 uppercase tracking-wider">
                {user.role} Member
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {user.role === "admin" && (
             <Link href="/admin">
               <Card className="bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-800 transition-colors cursor-pointer group">
                 <CardContent className="p-5 flex items-center gap-4">
                   <div className="p-3 bg-zinc-800 rounded-lg group-hover:bg-red-500/20 text-zinc-400 group-hover:text-red-400 transition-colors">
                     <Shield className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                     <h3 className="font-bold text-lg">Admin Dashboard</h3>
                     <p className="text-sm text-zinc-500">Kelola film, jadwal, dan operasional bioskop.</p>
                   </div>
                 </CardContent>
               </Card>
             </Link>
          )}

          <Link href="/my-bookings">
            <Card className="bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-800 transition-colors cursor-pointer group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-zinc-800 rounded-lg group-hover:bg-red-500/20 text-zinc-400 group-hover:text-red-400 transition-colors">
                  <Ticket className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Tiket Aktif</h3>
                  <p className="text-sm text-zinc-500">Lihat barcode dan detail tiket pesawat Anda.</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-800 transition-colors cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-zinc-800 rounded-lg group-hover:bg-red-500/20 text-zinc-400 group-hover:text-red-400 transition-colors">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Metode Pembayaran</h3>
                <p className="text-sm text-zinc-500">Kelola saldo kartu member dan E-Wallet.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-800 transition-colors cursor-pointer group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-zinc-800 rounded-lg group-hover:bg-red-500/20 text-zinc-400 group-hover:text-red-400 transition-colors">
                <Settings className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Pengaturan</h3>
                <p className="text-sm text-zinc-500">Ubah kata sandi dan preferensi notifikasi.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button onClick={logout} variant="outline" className="w-full border-red-900 text-red-500 hover:bg-red-950/30 hover:text-red-400 h-14 flex gap-2 font-bold text-base mt-4">
          <LogOut className="w-5 h-5" /> Keluar dari Akun
        </Button>
      </div>
    </div>
  );
}
