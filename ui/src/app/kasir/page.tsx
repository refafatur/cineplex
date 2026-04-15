"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, CreditCard, Film, Clock, ArrowLeft, Printer, Ticket as TicketIcon, Search, LayoutGrid, QrCode } from "lucide-react";

interface Schedule {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  price: number;
  movie: { id: number; title: string; poster?: string };
  studio: { id: number; name: string };
}

interface Seat {
  id: number;
  row: string;
  number: number;
  is_booked: boolean;
}

interface Booking {
  id: number;
  booking_code: string;
  total_price: number;
  status: string;
  schedule: Schedule;
  tickets: { seat: Seat }[];
}

export default function KasirPage() {
  const [activeTab, setActiveTab] = useState<"penjualan" | "checkin">("penjualan");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [bookedSeats, setBookedSeats] = useState<Seat[]>([]);
  
  // Check-in state
  const [searchCode, setSearchCode] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<Booking | null>(null);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    api("/schedules").then(setSchedules).catch(console.error);
  }, []);

  // Group schedules by movie
  const movies = useMemo(() => {
    const movieMap = new Map<number, { id: number; title: string; poster?: string }>();
    schedules.forEach(s => {
      if (!movieMap.has(s.movie.id)) {
        movieMap.set(s.movie.id, s.movie);
      }
    });
    return Array.from(movieMap.values());
  }, [schedules]);

  const movieSchedules = useMemo(() => {
    if (!selectedMovieId) return [];
    return schedules.filter(s => s.movie.id === selectedMovieId);
  }, [selectedMovieId, schedules]);

  const handleSelectMovie = (id: number) => {
    setSelectedMovieId(id);
    setSelectedSchedule(null);
    setSelectedSeats([]);
  };

  const handleSelectSchedule = async (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setSelectedSeats([]);
    try {
      const data = await api(`/schedules/${schedule.id}`);
      setSeats(data.seats || []);
    } catch (err) { console.error(err); }
  };

  const toggleSeat = (seatId: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (!selectedSchedule || selectedSeats.length === 0) return;
    setLoading(true);
    try {
      const currentBooked = seats.filter(s => selectedSeats.includes(s.id));
      setBookedSeats(currentBooked);

      await api("/bookings", {
        method: "POST",
        body: JSON.stringify({
          schedule_id: selectedSchedule.id,
          seat_ids: selectedSeats,
          payment_method: "cash",
        }),
      });

      setShowReceipt(true);
      setSelectedSeats([]);
      const data = await api(`/schedules/${selectedSchedule.id}`);
      setSeats(data.seats || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSearchBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode) return;
    setSearchLoading(true);
    setSearchError("");
    setSearchResult(null);
    try {
      const data = await api(`/bookings/search/${searchCode}`);
      setSearchResult(data);
    } catch (err: any) {
      setSearchError(err.message || "Booking tidak ditemukan.");
    }
    setSearchLoading(false);
  };

  const handlePrintCheckedIn = () => {
    if (!searchResult) return;
    setSelectedSchedule(searchResult.schedule);
    setBookedSeats(searchResult.tickets.map(t => t.seat));
    setShowReceipt(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const groupedSeats = seats.reduce<Record<string, Seat[]>>((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  const totalPrice = selectedSchedule ? selectedSeats.length * Number(selectedSchedule.price) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Point of Sale</h1>
          <p className="text-zinc-500 mt-2 font-medium">Sistem kasir tiket bioskop.</p>
        </div>

        <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
           <Button 
              variant="ghost" 
              onClick={() => setActiveTab("penjualan")}
              className={`rounded-xl gap-2 h-11 px-6 ${activeTab === "penjualan" ? "bg-red-600 text-white hover:bg-red-700 hover:text-white" : "text-zinc-500"}`}>
              <LayoutGrid className="w-4 h-4" /> Penjualan Baru
           </Button>
           <Button 
              variant="ghost" 
              onClick={() => setActiveTab("checkin")}
              className={`rounded-xl gap-2 h-11 px-6 ${activeTab === "checkin" ? "bg-red-600 text-white hover:bg-red-700 hover:text-white" : "text-zinc-500"}`}>
              <QrCode className="w-4 h-4" /> Cari Booking
           </Button>
        </div>
      </div>

      {activeTab === "penjualan" ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-red-600 pl-4">
               {selectedSchedule ? "Pilih Kursi" : selectedMovieId ? "Pilih Jam Tayang" : "Pilih Film"}
            </h2>
            {(selectedMovieId || selectedSchedule) && (
              <Button variant="outline" 
                onClick={() => selectedSchedule ? setSelectedSchedule(null) : setSelectedMovieId(null)}
                className="border-zinc-800 text-zinc-400 hover:text-white rounded-xl gap-2 h-10 px-4">
                <ArrowLeft className="w-4 h-4" /> Kembali
              </Button>
            )}
          </div>

          {/* Step 1: Select Movie */}
          {!selectedMovieId && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((m) => (
                <Card key={m.id} onClick={() => handleSelectMovie(m.id)}
                  className="cursor-pointer bg-zinc-900/40 border-zinc-800 hover:border-red-600/50 hover:bg-red-600/5 transition-all group overflow-hidden border-2 rounded-3xl">
                  <div className="aspect-[2/3] relative">
                    {m.poster ? (
                      <img src={m.poster} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800"><Film className="text-zinc-700 w-12 h-12" /></div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-white font-black uppercase text-sm truncate leading-tight">{m.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Step 2: Select Schedule */}
          {selectedMovieId && !selectedSchedule && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movieSchedules.map((s) => (
                <Card key={s.id} onClick={() => handleSelectSchedule(s)}
                  className="cursor-pointer bg-zinc-900/40 border-zinc-800 hover:border-red-600/50 hover:bg-red-600/5 transition-all border-2 rounded-3xl">
                  <CardContent className="p-6">
                    <p className="text-red-500 font-black text-xs uppercase tracking-widest mb-2">{s.studio?.name}</p>
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-4 h-4 text-zinc-500" />
                      <span className="text-3xl font-black text-white">{s.start_time.slice(0, 5)}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-zinc-500 text-xs font-bold uppercase">{s.date}</p>
                      <p className="text-lg font-black text-white">Rp {Number(s.price).toLocaleString("id-ID")}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Step 3: Seat Selection */}
          {selectedSchedule && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-12 bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm">
                <div className="relative mb-20 max-w-2xl mx-auto">
                  <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full opacity-50 shadow-[0_5px_15px_rgba(220,38,38,0.5)]" />
                  <p className="text-center text-[8px] font-black uppercase tracking-[1em] text-zinc-700 mt-4">Screen</p>
                </div>

                <div className="flex flex-col items-center gap-3 mb-16 overflow-x-auto pb-6">
                  {Object.entries(groupedSeats).map(([row, rowSeats]) => (
                    <div key={row} className="flex items-center gap-4">
                      <span className="w-4 text-[10px] text-zinc-700 font-black text-right">{row}</span>
                      <div className="flex gap-2">
                        {rowSeats.sort((a, b) => a.number - b.number).map((seat) => (
                          <button key={seat.id} disabled={seat.is_booked} onClick={() => toggleSeat(seat.id)}
                            className={`w-9 h-9 rounded-md text-[10px] font-black transition-all ${
                              seat.is_booked ? "bg-zinc-950 text-zinc-800 cursor-not-allowed border border-white/5 opacity-30" :
                              selectedSeats.includes(seat.id) ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-110 z-10" :
                              "bg-green-600 text-white shadow-[0_2px_10px_rgba(22,163,74,0.3)] hover:scale-110 active:scale-95"
                            }`}>
                            {seat.number}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-600" /><span>Tersedia</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-600" /><span>Dipilih</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-zinc-950 border border-white/5 opacity-30" /><span>Terisi</span></div>
                </div>
              </div>

              <div className="space-y-6 mt-12 lg:mt-0">
                 <Card className="bg-zinc-900 border-zinc-800 overflow-hidden rounded-3xl">
                    <CardHeader className="bg-white/5">
                       <CardTitle className="text-lg font-black uppercase tracking-tighter text-white">Ringkasan Pesanan</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                       <div className="space-y-1">
                          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Film</p>
                          <p className="text-white font-bold">{selectedSchedule.movie.title}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Waktu</p>
                            <p className="text-white font-bold">{selectedSchedule.start_time.slice(0, 5)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Studio</p>
                            <p className="text-white font-bold">{selectedSchedule.studio?.name}</p>
                          </div>
                       </div>
                       <div className="space-y-2 border-t border-zinc-800 pt-6">
                          <div className="flex justify-between items-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                             <span>Jumlah Tiket</span>
                             <span className="text-white">{selectedSeats.length} Kursi</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Total Harga</span>
                             <span className="text-2xl font-black text-red-600">Rp {totalPrice.toLocaleString("id-ID")}</span>
                          </div>
                       </div>
                       <Button onClick={handleBooking} disabled={loading || selectedSeats.length === 0}
                          className="w-full bg-red-600 hover:bg-red-700 h-16 gap-3 font-black text-lg rounded-2xl shadow-xl shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50">
                          <CreditCard className="w-6 h-6" /> {loading ? "Memproses..." : "Bayar Sekarang"}
                       </Button>
                    </CardContent>
                 </Card>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-10 duration-500">
           <Card className="bg-zinc-900/50 border-zinc-800 p-8 rounded-[40px] border-2">
              <div className="flex flex-col items-center text-center space-y-4 mb-8">
                 <div className="w-20 h-20 rounded-3xl bg-red-600/10 flex items-center justify-center text-red-600">
                    <Search className="w-10 h-10" />
                 </div>
                 <h2 className="text-3xl font-black uppercase text-white tracking-tighter">Cari Kode Booking</h2>
                 <p className="text-zinc-500 max-w-sm">Masukkan kode booking yang didapat dari pemesanan online pelanggan.</p>
              </div>

              <form onSubmit={handleSearchBooking} className="flex gap-4 max-w-xl mx-auto">
                 <div className="relative flex-1">
                    <TicketIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <Input 
                       value={searchCode}
                       onChange={(e) => setSearchCode(e.target.value)}
                       placeholder="Contoh: CPX-12345ABC" 
                       className="bg-zinc-800 border-zinc-700 h-14 pl-12 rounded-2xl text-xl font-black placeholder:text-zinc-600 focus:ring-red-600 focus:border-red-600"
                    />
                 </div>
                 <Button type="submit" disabled={searchLoading} className="h-14 px-8 bg-red-600 hover:bg-red-700 rounded-2xl font-black uppercase tracking-wider">
                    {searchLoading ? "Mencari..." : "Cari"}
                 </Button>
              </form>

              {searchError && (
                 <p className="text-red-500 text-center mt-6 font-bold uppercase text-xs italic">{searchError}</p>
              )}

              {searchResult && (
                 <div className="mt-12 p-8 bg-zinc-950/50 border border-zinc-800 rounded-3xl space-y-6 animate-in zoom-in-95 duration-300">
                    <div className="flex items-start justify-between">
                       <div className="flex gap-6">
                          <div className="w-24 aspect-[2/3] bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 shrink-0">
                             {searchResult.schedule.movie.poster && (
                                <img src={searchResult.schedule.movie.poster} className="w-full h-full object-cover" />
                             )}
                          </div>
                          <div>
                             <div className="flex items-center gap-3 mb-1">
                                <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                   searchResult.status === 'paid' ? 'bg-green-600/10 text-green-500' : 
                                   searchResult.status === 'pending' ? 'bg-yellow-600/10 text-yellow-500' : 
                                   'bg-red-600/10 text-red-500'
                                }`}>
                                   {searchResult.status}
                                </span>
                                <span className="text-zinc-600 text-[10px] font-black">{searchResult.booking_code}</span>
                             </div>
                             <h3 className="text-2xl font-black text-white leading-none uppercase">{searchResult.schedule.movie.title}</h3>
                             <div className="mt-4 space-y-2">
                                <p className="text-zinc-400 font-bold flex items-center gap-2"><Clock className="w-4 h-4 text-zinc-600" /> {searchResult.schedule.start_time.slice(0, 5)} • {searchResult.schedule.studio.name}</p>
                                <p className="text-zinc-400 font-bold flex items-center gap-2 font-mono"><LayoutGrid className="w-4 h-4 text-zinc-600" /> {searchResult.tickets.map(t => `${t.seat.row}${t.seat.number}`).join(", ")}</p>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex flex-col gap-3">
                          {searchResult.status === 'pending' && (
                             <Button 
                                onClick={async () => {
                                   try {
                                      await api(`/bookings/${searchResult.id}/status`, {
                                         method: 'PATCH',
                                         body: JSON.stringify({ status: 'paid' })
                                      });
                                      // Refresh search result
                                      const data = await api(`/bookings/search/${searchResult.booking_code}`);
                                      setSearchResult(data);
                                   } catch (err) { console.error(err); }
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white h-12 px-6 gap-2 font-black rounded-xl shadow-lg shadow-red-600/20">
                                <Check className="w-4 h-4" /> Konfirmasi Pembayaran
                             </Button>
                          )}
                          
                          {searchResult.status === 'paid' && (
                             <Button onClick={handlePrintCheckedIn} className="bg-white text-black hover:bg-zinc-200 h-12 px-6 gap-2 font-black rounded-xl">
                                <Printer className="w-4 h-4" /> Cetak Tiket
                             </Button>
                          )}
                       </div>
                    </div>
                 </div>
              )}
           </Card>
        </div>
      )}

      {/* Ticket Modal */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md bg-white p-0 overflow-hidden border-none text-black selection:bg-black selection:text-white">
          <div className="p-8 space-y-8 print:p-0">
             <div className="flex items-center justify-between no-print mb-4 border-b pb-4">
                <div className="flex items-center gap-2 text-green-600 font-bold">
                   <Check className="w-5 h-5" /> Siap Cetak
                </div>
                <Button onClick={handlePrint} size="sm" variant="outline" className="gap-2 border-black text-black">
                   <Printer className="w-4 h-4" /> Cetak Sekarang
                </Button>
             </div>

             <div className="max-h-[70vh] overflow-y-auto px-2 space-y-6 print:max-h-none print:overflow-visible">
                {bookedSeats.map((seat, i) => (
                   <div key={seat.id} className="ticket-item relative border-2 border-black p-6 font-mono space-y-4 print:break-after-page">
                      <div className="absolute left-0 top-0 bottom-0 w-8 border-r-2 border-dashed border-black flex items-center justify-center -rotate-90 origin-center whitespace-nowrap text-[10px] font-bold tracking-tighter uppercase">
                         CINEPLEX EXCLUSIVE • CONFIRMED
                      </div>
                      
                      <div className="pl-10 space-y-4">
                         <div className="flex justify-between items-start border-b-2 border-black pb-2">
                            <div>
                               <p className="text-[10px] font-bold text-zinc-500 uppercase">Movie Title</p>
                               <h3 className="text-2xl font-black leading-none uppercase">{selectedSchedule?.movie.title}</h3>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-bold text-zinc-500 uppercase">Theatre</p>
                               <span className="text-4xl font-black leading-none">{selectedSchedule?.studio.name.replace(/\D/g, '') || '1'}</span>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <p className="text-[10px] font-bold text-zinc-500 uppercase">Date</p>
                               <p className="text-sm font-black">{selectedSchedule?.date}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-zinc-500 uppercase">Time</p>
                               <p className="text-sm font-black">{selectedSchedule?.start_time.slice(0, 5)}</p>
                            </div>
                         </div>

                         <div className="flex justify-between items-end border-t-2 border-dashed border-black pt-4">
                            <div>
                               <p className="text-[10px] font-bold text-zinc-500 uppercase">Seat</p>
                               <p className="text-2xl font-black">{seat.row} - {seat.number}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Price</p>
                               <p className="text-sm font-bold">Rp {Number(selectedSchedule?.price).toLocaleString()}</p>
                            </div>
                         </div>

                         <div className="pt-4 flex justify-center">
                            <div className="border-t border-zinc-300 w-full pt-2 text-[10px] text-zinc-400 text-center uppercase tracking-widest">
                               Enjoy your movie at Cineplex
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .ticket-item, .ticket-item * { visibility: visible; }
          .ticket-item { 
            position: absolute !important; 
            left: 0 !important; 
            top: 0 !important; 
            width: 100% !important; 
            border: 1px solid black !important;
            display: block !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}

