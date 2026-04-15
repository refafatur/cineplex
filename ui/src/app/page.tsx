"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

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

export default function Home() {
  const { user, logout } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    api("/movies").then(setMovies).catch(console.error);
  }, []);

  // Filter only the 4 newest movies for homepage
  const nowShowing = [...movies].filter((m) => m.status === "showing").sort((a, b) => b.id - a.id).slice(0, 4);
  const comingSoon = [...movies].filter((m) => m.status === "coming_soon").sort((a, b) => b.id - a.id).slice(0, 4);
  
  const carouselMovies = nowShowing.length > 0 ? nowShowing : [...movies].slice(0, 4);
  const featured = carouselMovies[currentIndex] || null;

  useEffect(() => {
    if (carouselMovies.length <= 1 || isHovering) return;
    const timer = setInterval(() => {
      setCurrentIndex((p) => (p + 1) % carouselMovies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselMovies.length, isHovering]);

  const nextSlide = () => setCurrentIndex((p) => (p + 1) % carouselMovies.length);
  const prevSlide = () => setCurrentIndex((p) => (p - 1 + carouselMovies.length) % carouselMovies.length);

  const fallbackPoster = "https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2JGjjc9k5.jpg";

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
        <Link href="/" className="text-3xl font-extrabold tracking-tighter text-red-600">CINEPLEX</Link>
        <nav className="hidden md:flex gap-10 text-sm font-semibold tracking-wide">
          {user && <Link href="/movies" className="text-zinc-300 hover:text-white transition">ALL MOVIES</Link>}
          {user && <Link href="/my-bookings" className="text-zinc-300 hover:text-white transition">MY TICKETS</Link>}
        </nav>
        <div className="hidden md:flex gap-4">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin"><Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/10">Admin Panel</Button></Link>
              )}
              {user.role === "kasir" && (
                <Link href="/kasir"><Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/10">Kasir Panel</Button></Link>
              )}
              <Button variant="ghost" onClick={logout} className="text-zinc-300 hover:text-white hover:bg-white/10">Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/10">Log In</Button></Link>
              <Link href="/register"><Button className="bg-red-600 hover:bg-red-700 text-white font-semibold">Sign Up</Button></Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative h-screen w-full flex items-center justify-start px-8 md:px-24 group overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {featured ? (
          <>
            <div key={featured.id} className="absolute inset-0 z-0 animate-in fade-in duration-1000 bg-black">
              <Image src={featured.thumbnail || featured.poster || fallbackPoster} alt={featured.title} fill className={`object-cover transition-opacity duration-1000 ${isHovering && featured.trailer ? "opacity-0" : "opacity-60"}`} priority unoptimized />
              {isHovering && featured.trailer && (
                <video src={featured.trailer} autoPlay loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-80 animate-in fade-in duration-1000" />
              )}
              <div className={`absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent transition-opacity duration-1000 ${isHovering && featured.trailer ? "opacity-0" : "opacity-100"}`} />
              <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-1000 ${isHovering && featured.trailer ? "opacity-0" : "opacity-100"}`} />
            </div>

            <div 
              key={`info-${featured.id}`} 
              className={`relative z-10 max-w-2xl mt-12 animate-in slide-in-from-bottom-10 fade-in duration-700 transition-opacity duration-700 ${isHovering && featured.trailer ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter leading-tight text-white drop-shadow-lg">
                {featured.title}
              </h1>
              {featured.description && (
                <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-lg leading-relaxed line-clamp-3">{featured.description}</p>
              )}
              <div className="flex gap-5">
                <Link href={`/movies/${featured.id}`}>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white h-14 px-8 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] gap-2 font-bold text-base transition-all hover:scale-105">
                    <Ticket className="w-5 h-5" /> Buy Ticket
                  </Button>
                </Link>
              </div>
            </div>

            {/* Slider Controls */}
            {carouselMovies.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-4 md:left-8 z-20 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all backdrop-blur-md">
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button onClick={nextSlide} className="absolute right-4 md:right-8 z-20 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all backdrop-blur-md">
                  <ChevronRight className="w-8 h-8" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-2">
                  {carouselMovies.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all ${idx === currentIndex ? "w-8 bg-red-600" : "w-2 bg-zinc-500 hover:bg-zinc-300"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
            <span className="text-zinc-600 tracking-widest font-semibold uppercase">Loading Movies...</span>
          </div>
        )}
      </section>

      {/* Now Showing */}
      <section id="now-showing" className="relative z-10 px-8 md:px-24 py-20 bg-black">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white border-l-4 border-red-600 pl-4">Now Showing</h2>
          <Link href="/movies" className="text-red-500 hover:text-red-400 font-bold text-sm tracking-wide transition uppercase">Lihat Semua</Link>
        </div>
        {nowShowing.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {nowShowing.map((movie) => (
              <Link key={movie.id} href={`/movies/${movie.id}`}>
                <div className="group relative flex flex-col gap-4 cursor-pointer">
                  <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                    {movie.poster ? (
                      <Image src={movie.poster} alt={movie.title} fill className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75" unoptimized />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">No Poster</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Book Ticket
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-zinc-100 group-hover:text-red-500 transition-colors px-1">{movie.title}</h3>
                  <p className="text-sm text-zinc-500 px-1">{movie.duration_minutes} min</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500">Belum ada film yang sedang tayang.</p>
        )}
      </section>

      {/* Coming Soon */}
      {comingSoon.length > 0 && (
        <section className="relative z-10 px-8 md:px-24 py-20 bg-zinc-950">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white border-l-4 border-yellow-500 pl-4">Coming Soon</h2>
            <Link href="/movies" className="text-yellow-500 hover:text-yellow-400 font-bold text-sm tracking-wide transition uppercase">Lihat Semua</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {comingSoon.map((movie) => (
              <div key={movie.id} className="flex flex-col gap-4">
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl bg-zinc-800">
                  {movie.poster ? (
                    <Image src={movie.poster} alt={movie.title} fill className="object-cover grayscale opacity-70" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">No Poster</div>
                  )}
                </div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-300 px-1">{movie.title}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 px-8 md:px-24 py-12 text-center">
        <p className="text-2xl font-extrabold tracking-tighter text-red-600 mb-2">CINEPLEX</p>
        <p className="text-zinc-600 text-sm">© 2026 Cineplex. All rights reserved.</p>
      </footer>
    </div>
  );
}
