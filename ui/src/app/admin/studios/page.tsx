"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Warehouse, Users } from "lucide-react";

interface Studio {
  id: number;
  name: string;
  capacity: number;
  seats_count?: number;
}

export default function AdminStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [open, setOpen] = useState(false);
  const [editingStudio, setEditingStudio] = useState<Studio | null>(null);
  const [form, setForm] = useState({ name: "", capacity: "" });
  const [loading, setLoading] = useState(false);

  const fetchStudios = async () => {
    try {
      const data = await api("/studios");
      setStudios(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  const handleOpen = (studio: Studio | null = null) => {
    if (studio) {
      setEditingStudio(studio);
      setForm({ name: studio.name, capacity: studio.capacity.toString() });
    } else {
      setEditingStudio(null);
      setForm({ name: "", capacity: "" });
    }
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingStudio ? `/studios/${editingStudio.id}` : "/studios";
      const method = editingStudio ? "PUT" : "POST";
      
      await api(url, {
        method,
        body: JSON.stringify({
          name: form.name,
          capacity: parseInt(form.capacity),
        }),
      });
      
      setOpen(false);
      fetchStudios();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus studio ini? Semua kursi di dalamnya akan ikut terhapus.")) return;
    try {
      await api(`/studios/${id}`, { method: "DELETE" });
      fetchStudios();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Manajemen Studio</h1>
          <p className="text-zinc-500 mt-2 font-medium">Kelola ruang bioskop dan kapasitas kursi.</p>
        </div>
        <Button onClick={() => handleOpen()} className="bg-red-600 hover:bg-red-700 h-12 px-6 gap-2 font-black rounded-2xl shadow-lg shadow-red-600/20">
          <Plus className="w-5 h-5" /> Studio Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {studios.map((studio) => (
          <Card key={studio.id} className="bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 transition-all duration-300 group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center">
                <Warehouse className="w-5 h-5" />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleOpen(studio)} className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(studio.id)} className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <h3 className="text-xl font-black text-white group-hover:text-red-500 transition-colors">{studio.name}</h3>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                  <Users className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-black text-white">{studio.capacity} Kursi</span>
                </div>
                {studio.seats_count !== undefined && (
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">Terdaftar: {studio.seats_count}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {studios.length === 0 && (
          <div className="col-span-full py-20 bg-zinc-900/20 border border-zinc-800 border-dashed rounded-3xl flex flex-col items-center justify-center text-zinc-500">
            <Warehouse className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-bold">Belum ada studio yang ditambahkan.</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white p-8 max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              {editingStudio ? "Edit Studio" : "Studio Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest pl-1">Nama Studio</Label>
              <Input 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="misal: Studio 1 Premiere" 
                className="bg-zinc-800/50 border-zinc-700 h-12 rounded-xl focus:ring-red-600 focus:border-red-600" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest pl-1">Kapasitas Kursi</Label>
              <Input 
                type="number" 
                value={form.capacity} 
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                placeholder="50" 
                className="bg-zinc-800/50 border-zinc-700 h-12 rounded-xl focus:ring-red-600 focus:border-red-600" 
                required 
              />
              <p className="text-[10px] text-zinc-600 font-medium pl-1">Kursi akan digenerate otomatis ke database.</p>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 h-12 font-black rounded-xl shadow-lg transition-all active:scale-95">
              {loading ? "Menyimpan..." : editingStudio ? "Update Studio" : "Tambahkan Studio"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
