"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  description: string;
  poster: string;
  thumbnail?: string;
  trailer?: string;
  duration_minutes: number;
  status: string;
}

export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Movie | null>(null);
  const [form, setForm] = useState({ title: "", description: "", duration_minutes: "", status: "showing" });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);
  
  // Previews
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [trailerPreview, setTrailerPreview] = useState<string | null>(null);

  const fetchMovies = () => api("/movies").then(setMovies).catch(console.error);

  useEffect(() => { fetchMovies(); }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", duration_minutes: "", status: "showing" });
    setPosterFile(null);
    setThumbnailFile(null);
    setTrailerFile(null);
    setPosterPreview(null);
    setThumbnailPreview(null);
    setTrailerPreview(null);
    setEditing(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "poster" | "thumbnail" | "trailer") => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const url = URL.createObjectURL(file);
    if (type === "poster") {
      setPosterFile(file);
      setPosterPreview(url);
    } else if (type === "thumbnail") {
      setThumbnailFile(file);
      setThumbnailPreview(url);
    } else if (type === "trailer") {
      setTrailerFile(file);
      setTrailerPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("title", form.title);
    if (form.description) payload.append("description", form.description);
    payload.append("duration_minutes", form.duration_minutes);
    payload.append("status", form.status);
    if (posterFile) payload.append("poster", posterFile);
    if (thumbnailFile) payload.append("thumbnail", thumbnailFile);
    if (trailerFile) payload.append("trailer", trailerFile);

    try {
      if (editing) {
        payload.append("_method", "PUT");
        await api(`/movies/${editing.id}`, { method: "POST", body: payload });
      } else {
        await api("/movies", { method: "POST", body: payload });
      }
      setOpen(false);
      resetForm();
      fetchMovies();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus film ini?")) return;
    await api(`/movies/${id}`, { method: "DELETE" });
    fetchMovies();
  };

  const handleEdit = (movie: Movie) => {
    setEditing(movie);
    setForm({
      title: movie.title,
      description: movie.description || "",
      duration_minutes: String(movie.duration_minutes),
      status: movie.status,
    });
    setPosterFile(null);
    setThumbnailFile(null);
    setTrailerFile(null);
    setPosterPreview(movie.poster || null);
    setThumbnailPreview(movie.thumbnail || null);
    setTrailerPreview(movie.trailer || null);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Movies</h1>
          <p className="text-zinc-500 mt-1">Kelola daftar film bioskop</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-red-600 hover:bg-red-700 gap-2"><Plus className="w-4 h-4" /> Tambah Film</Button>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Film" : "Tambah Film Baru"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Judul</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="bg-zinc-800 border-zinc-700 text-white" required />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Deskripsi</Label>
                <textarea 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm focus:ring-2 focus:ring-red-600 focus:outline-none transition-all resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-zinc-300">Thumbnail (Hero Atas)</Label>
                    <div className="aspect-[16/9] w-full bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 relative group">
                        {thumbnailPreview ? (
                            <img src={thumbnailPreview} className="w-full h-full object-cover" alt="Thumbnail Preview" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs italic">No Preview</div>
                        )}
                    </div>
                    <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "thumbnail")}
                      className="bg-zinc-800 border-zinc-700 text-white" />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-zinc-300">Poster (Grid Bawah)</Label>
                    <div className="aspect-[2/3] w-32 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 mx-auto">
                        {posterPreview ? (
                            <img src={posterPreview} className="w-full h-full object-cover" alt="Poster Preview" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs italic">No Preview</div>
                        )}
                    </div>
                    <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "poster")}
                      className="bg-zinc-800 border-zinc-700 text-white" />
                  </div>
              </div>

              <div className="space-y-4">
                <Label className="text-zinc-300">File Trailer (Max 5MB)</Label>
                <div className="aspect-video w-full bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
                    {trailerPreview ? (
                        <video src={trailerPreview} controls className="w-full h-full" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs italic">No Trailer Preview</div>
                    )}
                </div>
                <Input type="file" accept="video/mp4,video/webm" onChange={(e) => handleFileChange(e, "trailer")}
                  className="bg-zinc-800 border-zinc-700 text-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Durasi (menit)</Label>
                  <Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 text-white" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Status</Label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full h-9 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm">
                    <option value="showing">Now Showing</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 h-12 font-bold">{editing ? "Update Film" : "Simpan Film"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <Card key={movie.id} className="bg-zinc-900/50 border-zinc-800 overflow-hidden group">
            <div className="aspect-[2/1] bg-zinc-800 overflow-hidden">
              {movie.poster ? (
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">No Poster</div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-bold">{movie.title}</h3>
                  <p className="text-sm text-zinc-500">{movie.duration_minutes} min</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${movie.status === "showing" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                  {movie.status === "showing" ? "Showing" : "Coming Soon"}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => handleEdit(movie)}
                  className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 gap-1">
                  <Pencil className="w-3 h-3" /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(movie.id)}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-1">
                  <Trash2 className="w-3 h-3" /> Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
