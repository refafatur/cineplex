"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Ticket, Check, Clock, Film } from "lucide-react";

interface Booking {
   id: number;
   booking_code: string;
   total_price: number;
   status: string;
   payment_method: string;
   created_at: string;
   schedule: {
      date: string;
      start_time: string;
      movie: { title: string; thumbnail?: string; poster?: string };
      studio: { name: string }
   };
   tickets: Array<{ seat: { row: string; number: number } }>;
}

export default function MyBookingsPage() {
   const { user } = useAuth();
   const [bookings, setBookings] = useState<Booking[]>([]);

   useEffect(() => {
      if (user) api("/bookings").then(setBookings).catch(console.error);
   }, [user]);

   return (
      <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
         <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-black/80 backdrop-blur-xl border-b border-white/5">
            <Link href="/" className="text-3xl font-black tracking-tighter text-red-600 uppercase">Cineplex</Link>
            {/* <Link href="/">
               <Button variant="ghost" className="text-zinc-400 hover:text-white gap-2 rounded-xl">
                  <ArrowLeft className="w-4 h-4" /> Kembali
               </Button>
            </Link> */}
         </header>

         <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
            <div className="mb-12">
               <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Tiket Saya</h1>
               <p className="text-zinc-500 font-medium">History dan status pemesanan tiket Anda.</p>
            </div>

            {bookings.length === 0 ? (
               <div className="text-center py-32 bg-zinc-900/30 rounded-[40px] border border-white/5 border-dashed">
                  <Ticket className="w-20 h-20 text-zinc-800 mx-auto mb-6" />
                  <p className="text-zinc-500 text-xl font-bold uppercase tracking-tight">Belum ada booking ditemukan</p>
                  <Link href="/">
                     <Button className="mt-8 bg-red-600 hover:bg-red-700 h-14 px-10 rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-red-600/20">Mulai Pesan Tiket</Button>
                  </Link>
               </div>
            ) : (
               <div className="grid grid-cols-1 gap-6">
                  {bookings.map((b) => (
                     <Card key={b.id} className="bg-zinc-950 border-white/5 overflow-hidden rounded-[32px] group hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-red-600/5">
                        <CardContent className="p-0">
                           <div className="flex flex-col md:flex-row">
                              {/* Thumbnail Area */}
                              <div className="w-full md:w-64 h-48 md:h-auto relative overflow-hidden bg-zinc-900 border-r border-white/5">
                                 {b.schedule?.movie?.thumbnail || b.schedule?.movie?.poster ? (
                                    <img
                                       src={b.schedule.movie.thumbnail || b.schedule.movie.poster}
                                       alt={b.schedule.movie.title}
                                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                                    />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center"><Film className="w-12 h-12 text-zinc-800" /></div>
                                 )}
                                 <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:hidden" />
                              </div>

                              {/* Content Area */}
                              <div className="flex-1 p-8 flex flex-col justify-between">
                                 <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                       <div className="flex items-center gap-3 mb-2">
                                          <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${b.status === 'paid' ? 'bg-green-600/20 text-green-400 border border-green-600/20' :
                                                b.status === 'pending' ? 'bg-yellow-600/20 text-yellow-500 border border-yellow-600/20' :
                                                   'bg-red-600/20 text-red-500 border border-red-600/20'
                                             }`}>
                                             {b.status}
                                          </span>
                                          <span className="text-zinc-600 text-[10px] font-black tracking-widest uppercase">ID: {b.booking_code}</span>
                                       </div>
                                       <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{b.schedule?.movie?.title}</h3>
                                       <p className="text-zinc-500 font-bold uppercase text-[11px] tracking-widest pt-2">
                                          {b.schedule?.studio?.name} • {b.schedule?.date} • {b.schedule?.start_time.slice(0, 5)}
                                       </p>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                       <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Total Bayar</p>
                                       <p className="text-2xl font-black text-red-600">Rp {Number(b.total_price).toLocaleString("id-ID")}</p>
                                    </div>
                                 </div>

                                 <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                                    <div className="flex gap-2 flex-wrap">
                                       {b.tickets?.map((t, i) => (
                                          <div key={i} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-zinc-300 font-black">
                                             {t.seat?.row}{t.seat?.number}
                                          </div>
                                       ))}
                                    </div>

                                    {b.status === 'pending' && (
                                       <div className="flex items-center gap-2 text-yellow-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                          <Clock className="w-3 h-3" /> Bukti Bayar dikasir
                                       </div>
                                    )}
                                    {b.status === 'paid' && (
                                       <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
                                          <Check className="w-3 h-3" /> Berhasil Di-ACC
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
