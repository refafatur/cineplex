"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Calendar, Clock, DollarSign, Film, Warehouse } from "lucide-react";

interface Movie { id: number; title: string; }
interface Studio { id: number; name: string; capacity: number; }
interface Schedule {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  price: number;
  movie: Movie;
  studio: Studio;
}

export default function AdminSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [open, setOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [form, setForm] = useState({ movie_id: "", studio_id: "", date: "", start_time: "", end_time: "", price: "" });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [s, m, st] = await Promise.all([api("/schedules"), api("/movies"), api("/studios")]);
      setSchedules(s);
      setMovies(m);
      setStudios(st);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpen = (schedule: Schedule | null = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setForm({
        movie_id: schedule.movie.id.toString(),
        studio_id: schedule.studio.id.toString(),
        date: schedule.date,
        start_time: schedule.start_time.slice(0, 5),
        end_time: schedule.end_time.slice(0, 5),
        price: schedule.price.toString(),
      });
    } else {
      setEditingSchedule(null);
      setForm({ movie_id: "", studio_id: "", date: "", start_time: "", end_time: "", price: "" });
    }
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingSchedule ? `/schedules/${editingSchedule.id}` : "/schedules";
      const method = editingSchedule ? "PUT" : "POST";
      
      await api(url, {
        method,
        body: JSON.stringify({
          movie_id: parseInt(form.movie_id),
          studio_id: parseInt(form.studio_id),
          date: form.date,
          start_time: form.start_time,
          end_time: form.end_time,
          price: parseFloat(form.price),
        }),
      });
      
      setOpen(false);
      fetchData();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus jadwal tayang ini?")) return;
    try {
      await api(`/schedules/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Jadwal Tayang</h1>
          <p className="text-zinc-500 mt-2 font-medium text-sm">Kelola waktu pemutaran film di setiap studio.</p>
        </div>
        <Button onClick={() => handleOpen()} className="bg-red-600 hover:bg-red-700 h-12 px-6 gap-2 font-black rounded-2xl shadow-lg shadow-red-600/20">
          <Plus className="w-5 h-5" /> Jadwal Baru
        </Button>
      </div>

      <Card className="bg-zinc-900/40 border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 bg-white/5">
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Film</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Lokasi</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Waktu</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Harga</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {schedules.map((s) => (
                  <tr key={s.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center">
                           <Film className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="text-sm font-black text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">{s.movie?.title}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <Warehouse className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-sm font-bold text-zinc-400">{s.studio?.name}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-black text-white">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase">
                          <Calendar className="w-3 h-3" />
                          {s.date}
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-sm font-black text-white">
                      Rp {Number(s.price).toLocaleString("id-ID")}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpen(s)} className="h-9 w-9 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="h-9 w-9 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {schedules.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-zinc-600">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-10" />
                      <p className="font-bold text-sm">Belum ada jadwal tayang yang terdaftar.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white p-8 max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              {editingSchedule ? "Edit Jadwal" : "Buat Jadwal Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-zinc-500 font-black uppercase text-[10px] tracking-widest pl-1">Pilih Film</Label>
                <select value={form.movie_id} onChange={(e) => setForm({ ...form, movie_id: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white text-sm focus:ring-2 focus:ring-red-600 focus:outline-none transition-all appearance-none" required>
                  <option value="">-- Pilih Movie --</option>
                  {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-500 font-black uppercase text-[10px] tracking-widest pl-1">Pilih Studio</Label>
                <select value={form.studio_id} onChange={(e) => setForm({ ...form, studio_id: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white text-sm focus:ring-2 focus:ring-red-600 focus:outline-none transition-all appearance-none" required>
                  <option value="">-- Pilih Studio --</option>
                  {studios.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.capacity} seats)</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-500 font-black uppercase text-[10px] tracking-widest pl-1">Tanggal Tayang</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="h-12 bg-zinc-800/50 border-zinc-700 rounded-xl focus:ring-red-600" required />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-zinc-500 font-black uppercase text-[10px] tracking-widest pl-1">Jam Mulai</Label>
                <Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  className="h-12 bg-zinc-800/50 border-zinc-700 rounded-xl focus:ring-red-600" required />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-500 font-black uppercase text-[10px] tracking-widest pl-1">Jam Selesai</Label>
                <Input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  className="h-12 bg-zinc-800/50 border-zinc-700 rounded-xl focus:ring-red-600" required />
              </div>
            </div>

            <div className="space-y-2">
                <Label className="text-zinc-500 font-black uppercase text-[10px] tracking-widest pl-1">Harga Tiket (Rp)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="50000" className="h-12 pl-10 bg-zinc-800/50 border-zinc-700 rounded-xl focus:ring-red-600 font-black" required />
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 h-14 font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95 mt-4">
              {loading ? "Menyimpan..." : editingSchedule ? "Perbarui Jadwal" : "Terbitkan Jadwal"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

