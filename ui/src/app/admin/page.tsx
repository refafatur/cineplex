"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Users, CreditCard, DollarSign, Calendar } from "lucide-react";

interface Stats {
  total_movies: number;
  total_users: number;
  total_bookings: number;
  total_revenue: number;
  upcoming_schedules: number;
  recent_bookings: Array<{
    id: number;
    total_price: number;
    status: string;
    created_at: string;
    user: { name: string };
    schedule: { movie: { title: string } };
  }>;
  revenue_trend: Array<{ date: string; revenue: number }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api("/dashboard").then(setStats).catch(console.error);
  }, []);

  const statCards = [
    { label: "Total Movies", value: stats?.total_movies || 0, icon: Film, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
    { label: "Pelanggan", value: stats?.total_users || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Upcoming", value: stats?.upcoming_schedules || 0, icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Revenue", value: `Rp ${parseFloat((stats?.total_revenue || 0).toString()).toLocaleString("id-ID")}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  const maxRevenue = stats?.revenue_trend && stats.revenue_trend.length > 0
    ? Math.max(...stats.revenue_trend.map(t => parseFloat(t.revenue.toString() || "0"))) 
    : 1;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tighter">Ringkasan Cinema</h1>
        <p className="text-zinc-500 mt-2 font-medium">Selamat datang kembali, admin. Berikut data terbaru bioskop Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className={`bg-zinc-900/40 border-zinc-800 ${stat.border} hover:bg-zinc-900/60 transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 font-black uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-white mt-2 tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend Chart (Simple CSS implementation) */}
        <Card className="lg:col-span-2 bg-zinc-900/40 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-white uppercase tracking-wider">Tren Pendapatan (Tahun Ini)</CardTitle>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 flex items-end gap-3 px-2">
              {stats?.revenue_trend.map((trend, i) => (
                <div key={trend.date} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group">
                  <div 
                    className="w-full bg-emerald-500/20 hover:bg-emerald-500 transition-all duration-500 rounded-t-lg relative"
                    style={{ height: `${(parseFloat(trend.revenue.toString()) / maxRevenue) * 100}%`, minHeight: '4px' }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {parseFloat(trend.revenue.toString()).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase rotate-45 md:rotate-0 mt-2 text-center whitespace-nowrap">
                    {trend.date}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent bookings */}
        <Card className="bg-zinc-900/40 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white uppercase tracking-wider">Booking Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {stats?.recent_bookings?.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 group cursor-default">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${booking.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-red-500 transition-colors">
                      {booking.schedule?.movie?.title}
                    </p>
                    <p className="text-xs text-zinc-500 font-medium">{booking.user?.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-white tracking-tight">Rp {Number(booking.total_price).toLocaleString("id-ID")}</p>
                    <p className="text-[10px] text-zinc-500 font-black uppercase">{booking.status}</p>
                  </div>
                </div>
              )) || <p className="text-zinc-500">Belum ada booking</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
