import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight, Activity, Globe, Shield, ChevronRight, Plus, Trash2, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";

// Calculator UI Imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Logic Imports
import { calculate, type FuelEntry, type Region, type Constraints } from "@/lib/carbon";
import { saveResult } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9f4] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=Fraunces:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');

        .font-display { font-family: 'Fraunces', Georgia, serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .hero-badge { animation: fadeIn 0.6s ease forwards; }
        .hero-title { animation: fadeUp 0.7s ease 0.1s both; }
        .hero-sub { animation: fadeUp 0.7s ease 0.2s both; }
        .hero-cta { animation: fadeUp 0.7s ease 0.3s both; }
        .hero-stats { animation: fadeUp 0.7s ease 0.4s both; }

        .step-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .step-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(34, 85, 34, 0.12);
        }

        .feature-card {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #4ade80, #16a34a);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .feature-card:hover::before {
          transform: scaleX(1);
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(34, 85, 34, 0.1);
          border-color: #bbf7d0;
        }

        .btn-primary {
          background: #16a34a;
          color: white;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35);
        }
        .btn-primary:hover {
          background: #15803d;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(22, 163, 74, 0.4);
        }
        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-outline {
          background: white;
          border: 1.5px solid #d1fae5;
          color: #166534;
          transition: all 0.25s ease;
        }
        .btn-outline:hover {
          background: #f0fdf4;
          border-color: #86efac;
          transform: translateY(-2px);
        }

        .nav-pill {
          transition: all 0.2s;
        }
        .nav-pill:hover {
          color: #15803d;
          background: #f0fdf4;
        }

        .stat-num {
          font-family: 'Fraunces', serif;
          font-variant-numeric: tabular-nums;
        }

        .leaf-bg {
          background-image: radial-gradient(circle at 20% 50%, rgba(134, 239, 172, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(74, 222, 128, 0.1) 0%, transparent 40%),
                            radial-gradient(circle at 60% 80%, rgba(187, 247, 208, 0.12) 0%, transparent 40%);
        }

        .hero-orb-1 {
          position: absolute;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(134, 239, 172, 0.18) 0%, transparent 70%);
          top: -100px;
          right: -80px;
          animation: float 8s ease-in-out infinite;
          pointer-events: none;
        }
        .hero-orb-2 {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(74, 222, 128, 0.12) 0%, transparent 70%);
          bottom: 0;
          left: -60px;
          animation: float 10s ease-in-out 2s infinite;
          pointer-events: none;
        }

        .number-badge {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 700;
          color: white;
          box-shadow: 0 6px 20px rgba(22, 163, 74, 0.3);
          flex-shrink: 0;
        }

        .cta-blob {
          background: linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%);
          position: relative;
          overflow: hidden;
        }
        .cta-blob::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: rgba(74, 222, 128, 0.07);
          top: -200px;
          left: -100px;
          pointer-events: none;
        }
        .cta-blob::after {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: rgba(134, 239, 172, 0.05);
          bottom: -150px;
          right: -50px;
          pointer-events: none;
        }
      `}</style>

      {/* NAVIGATION */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-green-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow-sm">
              <Leaf className="size-5 text-white" />
            </div>
            <span className="text-xl font-bold text-green-900 tracking-tight font-display">Ladang Pro</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            <a href="#cara-kerja" className="nav-pill px-4 py-2 rounded-lg text-sm font-medium text-slate-600">Cara Kerja</a>
            <a href="#ciri-ciri" className="nav-pill px-4 py-2 rounded-lg text-sm font-medium text-slate-600">Ciri-Ciri</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="nav-pill px-4 py-2 rounded-lg text-sm font-medium text-green-800 hidden sm:block">
              Log Masuk
            </Link>
            <Link to="/register" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5">
              Daftar Percuma
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">

        {/* HERO */}
        <section className="relative leaf-bg overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
          <div className="hero-orb-1" />
          <div className="hero-orb-2" />

          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">

            <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 border border-green-200 text-green-800 text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Sistem Pintar Petani Moden
            </div>

            <h1 className="hero-title font-display text-5xl md:text-6xl lg:text-7xl font-bold text-green-950 tracking-tight leading-[1.1] mb-6">
              Urus Karbon <br />
              <span className="italic text-green-600">Lebih Bijak,</span>
              <br />Lebih Lestari
            </h1>

            <p className="hero-sub text-lg md:text-xl text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed font-light">
              Sistem pemantauan pelepasan karbon berpandukan data dan sokongan keputusan pintar khusus untuk kelestarian sektor pertanian.
            </p>

            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/login" className="btn-primary h-14 px-8 rounded-2xl text-base font-semibold flex items-center gap-2.5">
                Log Masuk Papan Pemuka
                <ArrowRight className="size-5" />
              </Link>
              
              <button 
                onClick={() => {
                  document.getElementById('kalkulator')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-outline h-14 px-8 rounded-2xl text-base font-semibold"
              >
                Cuba Kalkulator 
              </button>
            </div>

            {/* STATS ROW */}
            <div className="hero-stats grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { num: "98%", label: "Ketepatan Data" },
                { num: "500+", label: "Ladang Aktif" },
                { num: "40%", label: "Pengurangan Karbon" },
              ].map((s) => (
                <div key={s.label} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-green-100 shadow-sm">
                  <div className="stat-num text-3xl font-bold text-green-700 mb-1">{s.num}</div>
                  <div className="text-xs text-slate-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />

        {/* HOW IT WORKS */}
        <section id="cara-kerja" className="w-full bg-white py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6">

            <div className="text-center mb-20">
              <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-3">Cara Berfungsi</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-green-950 leading-tight mb-4">
                3 Langkah Mudah ke Arah<br />
                <span className="italic text-green-600">Kelestarian</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
                Tidak perlu kepakaran teknikal. Sistem kami memproses data harian anda menjadi pelan tindakan yang jelas.
              </p>
            </div>

            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  n: "1",
                  title: "Masukkan Data",
                  desc: "Pilih jenis bahan api seperti diesel traktor dan jumlah penggunaan elektrik tahunan ladang anda.",
                  tag: "Input",
                },
                {
                  n: "2",
                  title: "Jana Analisis",
                  desc: "Enjin karbon akan mengira jumlah pelepasan secara automatik dan memaparkan punca utama (Root Cause).",
                  tag: "Proses",
                },
                {
                  n: "3",
                  title: "Terima Tindakan",
                  desc: "Dapatkan 3 cadangan intervensi terbaik yang ditapis khusus berdasarkan bajet dan kekangan operasi anda.",
                  tag: "Hasil",
                },
              ].map((step, i) => (
                <div
                  key={step.n}
                  className="step-card group flex gap-6 items-start bg-[#f7f9f4] rounded-2xl p-7 border border-green-100 cursor-default"
                >
                  <div className="number-badge">{step.n}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-green-950">{step.title}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        {step.tag}
                      </span>
                    </div>
                    <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="hidden sm:flex self-center">
                    <ArrowRight className="size-5 text-green-300 group-hover:text-green-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />

        {/* FEATURES */}
        <section id="ciri-ciri" className="w-full bg-[#f7f9f4] py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6">

            <div className="text-center mb-20">
              <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-3">Kelebihan Kami</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-green-950 leading-tight mb-4">
                Kenapa Pilih <span className="italic text-green-600">Ladang Pro?</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Activity className="size-6 text-green-600" />}
                title="Penapisan Kekangan Pintar"
                desc="Tindakan yang disyorkan bukan sekadar teori. Ia ditapis berdasarkan bajet, cuaca, dan tenaga kerja sebenar ladang anda."
                accent="#dcfce7"
              />
              <FeatureCard
                icon={<Globe className="size-6 text-green-600" />}
                title="Fokus Pada 'Root Cause'"
                desc="Sistem menyusun graf pecahan pelepasan dari tertinggi hingga terendah untuk memastikan anda menyelesaikan masalah yang paling kritikal dahulu."
                accent="#d1fae5"
              />
              <FeatureCard
                icon={<Shield className="size-6 text-green-600" />}
                title="Privasi Data Terjamin"
                desc="Semua data pengiraan dan jejak karbon disimpan terus secara lokal di dalam peranti anda tanpa memerlukan sambungan pelayan luar."
                accent="#bbf7d0"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-blob py-24 md:py-32 text-center px-6">
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-800/60 border border-green-700 text-green-200 text-sm font-medium mb-8">
              <Leaf className="size-3.5" />
              Percuma untuk 30 hari pertama
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Bersedia untuk melestarikan<br />
              <span className="italic text-green-300">ladang anda?</span>
            </h2>

            <p className="text-green-200 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Gunakan kalkulator kami sekarang secara percuma untuk mendapatkan analisis pertama anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  document.getElementById('kalkulator')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: "white",
                  color: "#065f46",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                  transition: "all 0.25s ease",
                }}
                className="h-14 px-8 rounded-2xl text-base font-bold flex items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-1"
              >
                Mula Kira Sekarang
                <ArrowRight className="size-5" />
              </button>
              <Link 
                to="/login"
                style={{
                  background: "transparent",
                  color: "white",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  transition: "all 0.25s ease",
                }}
                className="h-14 px-8 rounded-2xl text-base font-semibold flex items-center justify-center hover:bg-white/10 hover:-translate-y-1"
              >
                Lihat Papan Pemuka
              </Link>
            </div>
          </div>
        </section>

        {/* EMBEDDED CALCULATOR SECTION */}
        <section id="kalkulator" className="w-full bg-[#f7f9f4] py-24 md:py-32 border-t border-green-100">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-3">Kalkulator Pantas</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-green-950 mb-4">
                Kira Jejak Karbon Anda Sekarang
              </h2>
              <p className="text-slate-500">Isi data aktiviti ladang anda untuk dapatkan analisis & tindakan segera.</p>
            </div>
            
            {/* THIS IS WHERE WE RENDER THE EMBEDDED CALCULATOR */}
            <div className="text-left bg-white p-6 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(34,85,34,0.06)] border border-green-100">
              <QuickCalculator />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-8 bg-green-950 border-t border-green-900">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-700 flex items-center justify-center">
              <Leaf className="size-4 text-white" />
            </div>
            <span className="font-display font-bold text-green-200 text-sm">Ladang Pro</span>
          </div>
          <p className="text-green-500 text-sm">
            © {new Date().getFullYear()} Ladang Pro · Membina masa depan pertanian lestari.
          </p>
          <div className="flex gap-5 text-green-500 text-sm">
            <a href="#" className="hover:text-green-300 transition-colors">Privasi</a>
            <a href="#" className="hover:text-green-300 transition-colors">Terma</a>
            <a href="#" className="hover:text-green-300 transition-colors">Hubungi</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------
// HELPER COMPONENTS
// ---------------------------------------------------------

function FeatureCard({
  icon,
  title,
  desc,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: string;
}) {
  return (
    <div className="feature-card bg-white rounded-2xl p-8 border border-green-100 flex flex-col gap-5">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: accent }}
      >
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-green-950 mb-2">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-[15px]">{desc}</p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 block font-semibold text-green-900">{label}</Label>
      {children}
    </div>
  );
}

// ---------------------------------------------------------
// EMBEDDED CALCULATOR LOGIC
// ---------------------------------------------------------
function QuickCalculator() {
  const [entries, setEntries] = useState<FuelEntry[]>([
    { id: crypto.randomUUID(), activity: "Mobile combustion", fuel: "Diesel", amount: 0 },
  ]);
  const [region, setRegion] = useState<Region>("Peninsular");
  const [electricity, setElectricity] = useState<number>(0);
  const [c, setC] = useState<Constraints>({
    budget: "Medium",
    machineAvailable: true,
    weather: "Good",
    time: "Flexible",
    labor: "Medium",
  });
  
  // New state to hold the calculated result & control the slide animation
  const [resultData, setResultData] = useState<any>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const update = (id: string, patch: Partial<FuelEntry>) =>
    setEntries((p) => p.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const remove = (id: string) => setEntries((p) => p.filter((e) => e.id !== id));
  const add = () =>
    setEntries((p) => [
      ...p,
      { id: crypto.randomUUID(), activity: "Mobile combustion", fuel: "Diesel", amount: 0 },
    ]);

  const submit = () => {
    // 1. Calculate the result
    const result = calculate({ entries, region, electricity, constraints: c });
    
    // 2. Save it to local memory (will save as "guest" if not logged in)
    saveResult(result);
    
    // 3. Trigger the slide down animation by setting the result state
    setResultData(result);
    
    // 4. Smooth scroll to the result box slightly after it begins rendering
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div>
      <Card className="mb-6 shadow-none border-green-100">
        <CardHeader>
          <CardTitle className="text-green-950 font-display">Scope 1 — Pembakaran Bahan Api</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {entries.map((e, idx) => (
            <div key={e.id} className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-4">
                <Label className="mb-2 block font-semibold text-green-900">Jenis aktiviti</Label>
                <Select
                  value={e.activity}
                  onValueChange={(v) => update(e.id, { activity: v as FuelEntry["activity"] })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mobile combustion">Mobile combustion</SelectItem>
                    <SelectItem value="Stationary combustion">Stationary combustion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Label className="mb-2 block font-semibold text-green-900">Jenis bahan api</Label>
                <Select
                  value={e.fuel}
                  onValueChange={(v) => update(e.id, { fuel: v as FuelEntry["fuel"] })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="LPG">LPG</SelectItem>
                    <SelectItem value="Natural Gas">Natural Gas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-4">
                <Label className="mb-2 block font-semibold text-green-900">Jumlah penggunaan</Label>
                <Input
                  type="number"
                  min={0}
                  value={e.amount || ""}
                  onChange={(ev) => update(e.id, { amount: Number(ev.target.value) || 0 })}
                  placeholder="cth: 250"
                  className="focus-visible:ring-green-500"
                />
              </div>
              <div className="col-span-1">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={entries.length === 1}
                  onClick={() => remove(e.id)}
                  aria-label="Buang"
                  className="hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              {idx < entries.length - 1 && <div className="col-span-12 border-b border-green-50 my-2" />}
            </div>
          ))}
          <Button variant="outline" onClick={add} className="mt-2 border-green-200 text-green-800 hover:bg-green-50">
            <Plus className="size-4 mr-2" /> Tambah bahan api
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6 shadow-none border-green-100">
        <CardHeader>
          <CardTitle className="text-green-950 font-display">Scope 2 — Elektrik</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block font-semibold text-green-900">Grid region</Label>
            <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Peninsular">Peninsular</SelectItem>
                <SelectItem value="Sabah">Sabah</SelectItem>
                <SelectItem value="Sarawak">Sarawak</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block font-semibold text-green-900">Annual electricity (kWh)</Label>
            <Input
              type="number"
              min={0}
              value={electricity || ""}
              onChange={(e) => setElectricity(Number(e.target.value) || 0)}
              placeholder="cth: 12000"
              className="focus-visible:ring-green-500"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-none border-green-100">
        <CardHeader>
          <CardTitle className="text-green-950 font-display">Constraints — Sumber & Keadaan Anda</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-5">
          <Field label="Budget">
            <Select value={c.budget} onValueChange={(v) => setC({ ...c, budget: v as Constraints["budget"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Weather">
            <Select value={c.weather} onValueChange={(v) => setC({ ...c, weather: v as Constraints["weather"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Rainy">Rainy</SelectItem>
                <SelectItem value="Hot">Hot</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Time available">
            <Select value={c.time} onValueChange={(v) => setC({ ...c, time: v as Constraints["time"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Limited">Limited</SelectItem>
                <SelectItem value="Flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Labor">
            <Select value={c.labor} onValueChange={(v) => setC({ ...c, labor: v as Constraints["labor"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Machine available?">
            <div className="flex items-center gap-3 h-10">
              <Switch
                checked={c.machineAvailable}
                onCheckedChange={(v) => setC({ ...c, machineAvailable: v })}
              />
              <span className="text-sm font-medium text-slate-600">{c.machineAvailable ? "Yes" : "No"}</span>
            </div>
          </Field>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4 border-t border-green-100">
        <Button 
          size="lg" 
          onClick={submit} 
          className="gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Sparkles className="size-5" /> Calculate & get my plan
        </Button>
      </div>

      {/* --- SLIDE-DOWN RESULT SECTION --- */}
      <div 
        className={`w-full transition-all duration-700 ease-in-out overflow-hidden ${
          resultData ? "max-h-[3000px] opacity-100 mt-12" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div ref={resultRef} className="bg-green-950 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
          
          <div className="absolute -right-20 -top-20 opacity-10 pointer-events-none">
             <Leaf className="w-96 h-96" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8 font-display">
              Keputusan Anda
            </h2>
            
            {resultData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Score Card */}
                <div className="bg-green-900/50 p-6 rounded-2xl border border-green-800">
                  <p className="text-green-300 text-sm font-medium mb-2">Jumlah Jejak Karbon</p>
                  <p className="text-5xl font-bold text-white mb-2">
                    {resultData.totalEmissions.toFixed(0)} <span className="text-xl text-green-400">kg CO₂e</span>
                  </p>
                  <p className="text-xs text-green-200/70">
                    Berdasarkan input Scope 1 & Scope 2 anda.
                  </p>
                </div>

                {/* Top Actions List */}
                <div className="md:col-span-2 bg-white rounded-2xl p-6 text-green-950">
                  <h3 className="text-lg font-bold mb-4">Tindakan Disyorkan Untuk Anda</h3>
                  <div className="space-y-4">
                    {resultData.topActions.map((action: any, index: number) => (
                      <div key={index} className="flex gap-4 items-start p-4 bg-[#f7f9f4] rounded-xl border border-green-100">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-green-900">{action.title}</h4>
                          <p className="text-sm text-slate-600 mt-1 leading-relaxed">{action.description}</p>
                          <div className="flex gap-2 mt-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-green-200 text-green-800 rounded-md">
                              Kos: {action.cost}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-green-950 text-green-100 rounded-md">
                              Impak: {action.impact}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* CTA */}
            <div className="mt-8 pt-8 border-t border-green-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-green-200 text-sm">
                Simpan data ini untuk pantauan jangka panjang.
              </p>
              <Link 
                to="/register" 
                className="px-6 py-3 bg-white text-green-900 font-bold rounded-xl hover:bg-green-50 transition-colors"
              >
                Daftar Akaun Percuma
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}