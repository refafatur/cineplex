"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Booking {
  id: number;
  total_price: number;
  status: string;
  payment_method: string;
  created_at: string;
  user: { name: string; email: string };
  schedule: { date: string; start_time: string; movie: { title: string } };
  tickets: Array<{ seat: { row: string; number: number } }>;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    api("/bookings").then(setBookings).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Bookings</h1>
        <p className="text-zinc-500 mt-1">Daftar semua transaksi tiket</p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">#</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Pelanggan</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Film</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Tanggal</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Kursi</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Total</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Pembayaran</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                    <td className="p-4 text-zinc-400">#{b.id}</td>
                    <td className="p-4">
                      <p className="text-white font-medium">{b.user?.name}</p>
                      <p className="text-xs text-zinc-500">{b.user?.email}</p>
                    </td>
                    <td className="p-4 text-white">{b.schedule?.movie?.title}</td>
                    <td className="p-4 text-zinc-400">{b.schedule?.date} {b.schedule?.start_time}</td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        {b.tickets?.map((t, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-zinc-800 rounded text-zinc-300">
                            {t.seat?.row}{t.seat?.number}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-white font-semibold">Rp {Number(b.total_price).toLocaleString("id-ID")}</td>
                    <td className="p-4 text-zinc-400">{b.payment_method}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        b.status === "paid" ? "bg-green-500/10 text-green-400" :
                        b.status === "cancelled" ? "bg-red-500/10 text-red-400" :
                        "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr><td colSpan={8} className="p-8 text-center text-zinc-500">Belum ada booking</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
