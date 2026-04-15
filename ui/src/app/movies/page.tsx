"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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

export default function MoviesPage() {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    api("/movies").then(setMovies).catch(console.error);
  }, []);

  const nowShowing = [...movies].filter((m) => m.status === "showing").sort((a, b) => b.id - a.id);
  const comingSoon = [...movies].filter((m) => m.status === "coming_soon").sort((a, b) => b.id - a.id);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="text-3xl font-black tracking-tighter text-red-600 uppercase">Cineplex</Link>
        {/* <Link href="/">
           <Button variant="ghost" className="text-zinc-400 hover:text-white gap-2 rounded-xl">
              <ArrowLeft className="w-4 h-4" /> Kembali
           </Button>
        </Link> */}
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 w-full">
        <div className="mb-16 text-center">
           <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">Semua Film</h1>
           <p className="text-zinc-500 font-medium text-lg max-w-2xl mx-auto">
             Jelajahi seluruh koleksi film kami yang sedang tayang maupun yang akan segera hadir.
           </p>
        </div>

        {/* Now Showing Section */}
        {nowShowing.length > 0 && (
          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white border-l-4 border-red-600 pl-4 mb-8">
              Sedang Tayang
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {nowShowing.map((movie) => (
                <Link key={movie.id} href={`/movies/${movie.id}`}>
                  <div className="group relative flex flex-col gap-4 cursor-pointer">
                    <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                      {movie.poster ? (
                        <Image src={movie.poster} alt={movie.title} fill className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75" unoptimized />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">No Poster</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-6">
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-xs md:text-sm">
                          Book Ticket
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold tracking-tight text-zinc-100 group-hover:text-red-500 transition-colors px-1 truncate">{movie.title}</h3>
                      <p className="text-xs md:text-sm text-zinc-500 px-1">{movie.duration_minutes} min</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon Section */}
        {comingSoon.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white border-l-4 border-yellow-500 pl-4 mb-8">
              Segera Hadir
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {comingSoon.map((movie) => (
                <div key={movie.id} className="flex flex-col gap-4 group">
                  <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl bg-zinc-800 transition-transform duration-500 group-hover:scale-105">
                    {movie.poster ? (
                      <Image src={movie.poster} alt={movie.title} fill className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">No Poster</div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-zinc-300 group-hover:text-yellow-500 transition-colors px-1 truncate">{movie.title}</h3>
                    <p className="text-xs md:text-sm text-yellow-500/80 px-1 uppercase font-bold tracking-widest mt-1">Akan Datang</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {movies.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            Sedang memuat data film...
          </div>
        )}
      </div>
    </div>
  );
}
