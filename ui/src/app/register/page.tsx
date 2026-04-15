"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setError("");
    if (step === 1 && !name.trim()) {
      setError("Nama lengkap harus diisi");
      return;
    }
    if (step === 2 && !email.trim()) {
      setError("Email harus diisi");
      return;
    }
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
      setError("Password tidak cocok!");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, passwordConfirmation);
      router.push("/");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setError(error?.data?.message || "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black" />

      <Card className="relative z-10 w-full max-w-md bg-zinc-950/80 border-zinc-800 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center pb-6 pt-10">
          <Link href="/" className="text-4xl font-extrabold tracking-tighter text-red-600 mb-4 inline-block">
            CINEPLEX
          </Link>
          <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">Bikin Akun Baru</CardTitle>
          <CardDescription className="text-zinc-400 font-medium">Ikuti langkah mudah di bawah ini</CardDescription>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step >= num ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]" : "bg-zinc-800 text-zinc-500"
                }`}>
                  {step > num ? <Check className="w-4 h-4" /> : num}
                </div>
                {num < 3 && (
                  <div className={`w-12 h-1 ml-2 rounded-full transition-all duration-300 ${
                    step > num ? "bg-red-600/50" : "bg-zinc-800"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-10">
          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
            <div className="min-h-[140px] flex flex-col justify-center animate-in slide-in-from-right-8 fade-in duration-300">
              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm font-semibold">
                  {error}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-zinc-300 font-bold uppercase tracking-wider text-[10px]">Langkah 1: Siapa namamu?</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap" autoFocus
                    className="h-14 bg-zinc-900/50 border-zinc-700 text-white font-bold placeholder:text-zinc-600 focus:border-red-500 rounded-xl" required />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-zinc-300 font-bold uppercase tracking-wider text-[10px]">Langkah 2: Alamat Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com" autoFocus
                    className="h-14 bg-zinc-900/50 border-zinc-700 text-white font-bold placeholder:text-zinc-600 focus:border-red-500 rounded-xl" required />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-zinc-300 font-bold uppercase tracking-wider text-[10px]">Langkah 3: Amankan Akunmu</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password (min. 6 karakter)" autoFocus
                      className="h-14 bg-zinc-900/50 border-zinc-700 text-white font-bold placeholder:text-zinc-600 focus:border-red-500 rounded-xl" required />
                  </div>
                  <div className="space-y-3">
                    <Input id="password_confirmation" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}
                      placeholder="Ulangi password"
                      className="h-14 bg-zinc-900/50 border-zinc-700 text-white font-bold placeholder:text-zinc-600 focus:border-red-500 rounded-xl" required />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/5">
              {step > 1 && (
                <Button type="button" onClick={handleBack} variant="outline" className="h-14 px-4 bg-transparent border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              
              {step < 3 ? (
                <Button type="button" onClick={handleNext} className="flex-1 bg-red-600 hover:bg-red-700 text-white h-14 font-black uppercase tracking-wider text-sm rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] gap-2">
                  Lanjut <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white h-14 font-black uppercase tracking-wider text-sm rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                  {loading ? "Memproses..." : "Selesai & Daftar"}
                </Button>
              )}
            </div>

            <div className="relative mt-8 mb-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950/80 px-2 text-zinc-500 font-bold tracking-widest backdrop-blur-sm">Atau</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => alert("Fitur Registrasi Google masih dalam tahap pengembangan (Pajangan).")}
              className="w-full bg-white hover:bg-zinc-200 text-white border-transparent h-12 font-bold text-base transition-all gap-3 rounded-xl"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Daftar dengan Google
            </Button>

            <p className="text-center text-zinc-500 text-xs mt-6 font-medium">
              Sudah merasa punya akun?{" "}
              <Link href="/login" className="text-red-500 hover:text-red-400 font-bold transition">Login di sini</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
