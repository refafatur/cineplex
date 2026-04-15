"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Calendar, Check, CreditCard, Ticket } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  description: string;
  poster: string;
  thumbnail?: string;
  duration_minutes: number;
  status: string;
  schedules: Array<{
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    price: number;
    studio: { id: number; name: string };
  }>;
}

interface Seat {
  id: number;
  row: string;
  number: number;
  is_booked: boolean;
}

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [step, setStep] = useState<"schedule" | "seats" | "confirm">("schedule");
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ id: number } | null>(null);

  useEffect(() => {
    api(`/movies/${id}`).then(setMovie).catch(console.error);
  }, [id]);

  const handleSelectSchedule = async (scheduleId: number) => {
    setSelectedSchedule(scheduleId);
    setSelectedSeats([]);
    try {
      const data = await api(`/schedules/${scheduleId}`);
      setSeats(data.seats || []);
      setStep("seats");
    } catch (err) { console.error(err); }
  };

  const toggleSeat = (seatId: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (!user) { router.push("/login"); return; }
    if (!selectedSchedule || selectedSeats.length === 0) return;
    setLoading(true);
    try {
      const result = await api("/bookings", {
        method: "POST",
        body: JSON.stringify({
          schedule_id: selectedSchedule,
          seat_ids: selectedSeats,
          payment_method: "online",
        }),
      });
      setBookingResult(result);
      setStep("confirm");
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const schedule = movie?.schedules?.find((s) => s.id === selectedSchedule);
  const totalPrice = schedule ? selectedSeats.length * Number(schedule.price) : 0;

  const groupedSeats = seats.reduce<Record<string, Seat[]>>((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Dynamic Backdrop */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        {(movie.thumbnail || movie.poster) && (
          <>
            <Image
              src={movie.thumbnail || movie.poster}
              alt={movie.title}
              fill
              className="object-cover opacity-40 blur-[2px] scale-110"
              unoptimized
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </>
        )}
        <div className="absolute top-6 left-6 z-50">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 gap-2 backdrop-blur-md bg-black/40 px-5 rounded-full border border-white/10 h-11">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Button>
          </Link>
        </div>
      </div>

      {/* Movie Profile Section */}
      <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-[20]">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Container */}
          <div className="w-48 md:w-64 shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5 bg-zinc-900">
              <Image src={movie.poster} alt={movie.title} fill className="object-cover" unoptimized />
            </div>
          </div>

          {/* Info Details */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="inline-flex px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-[10px] font-black uppercase tracking-widest text-red-500">
              Exclusive Cineplex
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-white uppercase drop-shadow-md">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 text-zinc-400 font-bold text-sm">
                <Clock className="w-4 h-4 text-zinc-500" />
                <span>{movie.duration_minutes} Menit</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-zinc-700 hidden md:block" />
              <div className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${movie.status === "showing"
                ? "bg-green-500/20 text-green-400 border border-green-500/20"
                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                }`}>
                {movie.status === "showing" ? "Now Showing" : "Coming Soon"}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <p className="text-zinc-400 leading-relaxed text-base italic line-clamp-6 md:line-clamp-none">
                {movie.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Section */}
      <div className="max-w-5xl mx-auto px-6 mt-20">
        {step === "schedule" && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <h2 className="text-2xl font-black uppercase tracking-tighter border-l-4 border-red-600 pl-4">Pilih Jadwal</h2>
            {movie.schedules?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {movie.schedules.map((s) => (
                  <Card key={s.id} onClick={() => handleSelectSchedule(s.id)}
                    className="cursor-pointer bg-zinc-900/40 border-zinc-800 hover:border-red-500/50 hover:bg-red-500/5 transition-all group overflow-hidden">
                    <CardContent className="p-6">
                      <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mb-2 group-hover:text-red-400 transition-colors">{s.studio?.name}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-2xl font-black text-white">{s.start_time.slice(0, 5)}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase">{s.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-white/40 group-hover:text-white transition-colors">Rp {Number(s.price).toLocaleString("id-ID")}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 font-medium">Belum ada jadwal tayang tersedia.</p>
            )}
          </div>
        )}

        {step === "seats" && schedule && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <Button variant="ghost" onClick={() => setStep("schedule")} className="p-0 h-auto text-zinc-500 hover:text-white mb-2 gap-1 text-xs">
                  <ArrowLeft className="w-3 h-3" /> Ganti Jadwal
                </Button>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Pilih Kursi</h2>
                <p className="text-zinc-500 text-xs font-bold uppercase">{schedule.studio?.name} • {schedule.date} • {schedule.start_time.slice(0, 5)}</p>
              </div>
            </div>

            {/* Screen */}
            <div className="relative mb-20">
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full opacity-50 shadow-[0_5px_15px_rgba(220,38,38,0.5)]" />
              <p className="text-center text-[8px] font-black uppercase tracking-[1em] text-zinc-700 mt-4">Screen</p>
            </div>

            {/* Seats Grid */}
            <div className="flex flex-col items-center gap-3 mb-16 overflow-x-auto pb-6">
              {Object.entries(groupedSeats).map(([row, rowSeats]) => (
                <div key={row} className="flex items-center gap-4">
                  <span className="w-4 text-[10px] text-zinc-700 font-black text-right">{row}</span>
                  <div className="flex gap-2">
                    {rowSeats.sort((a, b) => a.number - b.number).map((seat) => (
                      <button key={seat.id} disabled={seat.is_booked} onClick={() => toggleSeat(seat.id)}
                        className={`w-9 h-9 rounded-md text-[10px] font-black transition-all ${seat.is_booked ? "bg-zinc-900 text-zinc-800 cursor-not-allowed border border-white/5" :
                          selectedSeats.includes(seat.id) ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" :
                            "bg-green-600 text-white shadow-[0_2px_10px_rgba(22,163,74,0.3)] hover:scale-110 active:scale-95"
                          }`}>
                        {seat.number}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-600">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-600" /><span>Tersedia</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-600" /><span>Dipilih</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-zinc-900 border border-white/5" /><span>Terisi</span></div>
            </div>

            {/* Sticky Checkout - Premium Floating Pill */}
            {selectedSeats.length > 0 && (
              <div className="fixed bottom-20 md:bottom-0 left-0 right-0 z-[60] px-4 md:px-0 md:bg-black/80 md:backdrop-blur-xl md:border-t md:border-white/5 md:p-6 animate-in slide-in-from-bottom-full duration-500">
                <div className="max-w-5xl mx-auto flex items-center justify-between bg-zinc-900 md:bg-transparent p-4 md:p-0 rounded-[32px] md:rounded-none border border-white/5 md:border-none shadow-2xl md:shadow-none">
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-8 min-w-0">
                    <div className="shrink-0">
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{selectedSeats.length} Kursi Terpilih</p>
                      <p className="text-xl md:text-2xl font-black text-white leading-tight">Rp {totalPrice.toLocaleString("id-ID")}</p>
                    </div>
                    {/* Seat Labels - Hidden on small mobile to keep pill compact */}
                    <div className="hidden sm:flex gap-2 min-w-0 flex-wrap">
                      {selectedSeats.map(id => {
                        const s = seats.find(x => x.id === id);
                        return s ? (
                          <span key={id} className="text-[10px] px-2 py-1 bg-white/5 rounded-md text-zinc-400 font-bold border border-white/5">
                            {s.row}{s.number}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <Button onClick={handleBooking} disabled={loading}
                    className="bg-red-600 hover:bg-red-700 h-14 md:h-16 px-8 md:px-12 gap-3 font-black text-sm md:text-lg rounded-2xl md:rounded-xl shadow-[0_10px_30px_rgba(220,38,38,0.4)] transition-all active:scale-95 shrink-0">
                    <CreditCard className="w-5 h-5" />
                    <span className="hidden sm:inline">{loading ? "Proses..." : "Booking Sekarang"}</span>
                    <span className="sm:hidden">{loading ? "..." : "Pesan"}</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === "confirm" && bookingResult && (
          <div className="text-center py-20 bg-zinc-950 rounded-[40px] border border-white/5 shadow-2xl animate-in zoom-in duration-700">
            <div className="w-24 h-24 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-8 border border-green-600/30">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Pemesanan Selesai</h2>
            <p className="text-zinc-500 font-bold mb-4">Tunjukkan kode ini ke kasir untuk mencetak tiket:</p>

            <div className="bg-white/5 border border-white/10 px-8 py-6 rounded-3xl inline-block mb-10 group transition-all hover:bg-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Booking Code</p>
              <p className="text-5xl font-black text-red-600 tracking-widest font-mono">
                {(bookingResult as any).booking_code || `#${bookingResult.id}`}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button variant="outline" className="h-14 px-8 border-zinc-800 text-zinc-300 hover:bg-zinc-800 gap-2 rounded-2xl font-bold">Beranda</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
