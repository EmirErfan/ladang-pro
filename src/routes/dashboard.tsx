import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { getCurrentUser, loadHistory, saveResult, logout } from "@/lib/store";
import { calculate, type Region, type FuelEntry } from "@/lib/carbon";
import { useState } from "react";
import {
  Cloud, Zap, TrendingUp, Sparkles, Map as MapIcon,
  Calculator, LineChart, BarChart3, List, Info, Save, LogOut
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const history = loadHistory();
  const latest = history[0];

  // Form State for "Daftar Rekod Pelepasan"
  const [namaLadang, setNamaLadang] = useState("Ladang Sawit");
  const [tarikh, setTarikh] = useState(new Date().toISOString().split('T')[0]);
  const [region, setRegion] = useState<Region>("Peninsular");

  const [naturalGas, setNaturalGas] = useState<number | "">("");
  const [lpg, setLpg] = useState<number | "">("");
  const [diesel, setDiesel] = useState<number | "">("");
  const [petrol, setPetrol] = useState<number | "">("");
  const [elektrik, setElektrik] = useState<number | "">("");
  const [catatan, setCatatan] = useState("");

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();

    const entries: FuelEntry[] = [];
    if (naturalGas) entries.push({ id: "1", activity: "Stationary combustion", fuel: "Natural Gas", amount: Number(naturalGas) });
    if (lpg) entries.push({ id: "2", activity: "Stationary combustion", fuel: "LPG", amount: Number(lpg) });
    if (diesel) entries.push({ id: "3", activity: "Mobile combustion", fuel: "Diesel", amount: Number(diesel) });
    if (petrol) entries.push({ id: "4", activity: "Mobile combustion", fuel: "Petrol", amount: Number(petrol) });

    const result = calculate({
      entries,
      region,
      electricity: Number(elektrik) || 0,
      constraints: { budget: "Medium", machineAvailable: true, weather: "Good", time: "Flexible", labor: "Medium" }
    });

    saveResult(result);

    setNaturalGas(""); setLpg(""); setDiesel(""); setPetrol(""); setElektrik(""); setCatatan("");
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-[#fbfaf6] text-stone-800 font-sans p-4 md:p-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER WITH PROFILE CIRCLE */}
        <header className="flex justify-between items-center mb-8">

          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-md bg-[#a64027] flex items-center justify-center text-white font-bold font-serif">
              L
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Ladang Pro</h1>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest">Sistem Pengurusan Rekod</p>
            </div>
          </Link>

          {/* Top Navigation & Profile Circle */}
          <div className="flex items-center gap-6">

            {/* Top Menu Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-stone-500 uppercase tracking-widest">
              <Link to="/calculator" className="hover:text-[#a64027] transition-colors">Kalkulator</Link>
              <Link to="/history" className="hover:text-[#a64027] transition-colors">Sejarah</Link>
            </nav>

            {/* Profile Dropdown / Logout Button */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-3 bg-white pl-1.5 pr-4 py-1.5 rounded-full border border-[#ebe8df] shadow-sm hover:border-[#a64027]/40 hover:shadow-md transition-all"
              title="Log Keluar"
            >
              <div className="w-8 h-8 rounded-full bg-[#fbfaf6] border border-[#ebe8df] flex items-center justify-center text-[#a64027] font-bold shadow-inner group-hover:bg-[#a64027] group-hover:text-white transition-colors">
                {user ? user.name.charAt(0).toUpperCase() : "P"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-stone-700 leading-tight mb-0.5">{user ? user.name.split(' ')[0] : "Petani"}</p>
                <div className="flex items-center gap-1 text-[9px] font-bold text-stone-400 uppercase tracking-widest leading-none group-hover:text-[#a64027] transition-colors">
                  Log Keluar <LogOut className="size-2.5" />
                </div>
              </div>
            </button>

          </div>
        </header>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="JUMLAH PELEPASAN"
            value={latest?.totalEmissions.toFixed(2) || "0.00"}
            unit="kg CO₂e (Scope 1 + 2)"
            icon={<Cloud className="size-4" />}
          />
          <StatCard
            title="SCOPE 1 (BAHAN API)"
            value={latest?.scope1.toFixed(2) || "0.00"}
            unit="kg CO₂e (Gasoline, Diesel, Petrol)"
            icon={<Zap className="size-4" />}
          />
          <StatCard
            title="SCOPE 2 (ELEKTRIK)"
            value={latest?.scope2.toFixed(2) || "0.00"}
            unit="kg CO₂e (Grid)"
            icon={<Zap className="size-4" />}
          />
          <StatCard
            title="TREND BULANAN"
            value="+0.0%"
            unit="Trend banding bulan lepas"
            icon={<TrendingUp className="size-4" />}
          />
        </div>

        {/* SMART INSIGHT BOX */}
        <div className="relative overflow-hidden bg-[#183625] rounded-2xl p-8 text-white shadow-lg">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-300 via-transparent to-transparent"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="text-green-300 text-xs font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                <Sparkles className="size-3" /> AI INSIGHT
              </div>
              <h2 className="text-2xl font-bold mb-2">Smart Insight Box</h2>
              <p className="text-green-100/80 text-sm max-w-2xl leading-relaxed">
                Platform pintar kami menganalisis rekod penggunaan tenaga ladang anda dan menjana cadangan intervensi.
              </p>

              {latest?.topActions[0] && (
                <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 inline-block">
                  <p className="text-sm font-medium text-green-50">💡 {latest.topActions[0].title}</p>
                </div>
              )}
            </div>

            <button className="flex items-center gap-2 bg-white text-[#183625] px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-50 transition-colors shadow-lg">
              <Sparkles className="size-4" /> Jana Insight
            </button>
          </div>
        </div>

        {/* WEATHER MAP & FORM ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* MAP PLACEHOLDER */}
          <div className="lg:col-span-12">
            <SectionCard title="CUACA & RANTAU" subtitle="Smart Weather Insight" icon={<MapIcon className="size-4" />}>
              <div className="w-full h-64 bg-stone-200 rounded-xl overflow-hidden relative border border-stone-300">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000"
                  alt="Map Placeholder"
                  className="w-full h-full object-cover opacity-60 mix-blend-multiply"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-bold text-stone-700 shadow-sm">Map View Placeholder</span>
                </div>
              </div>
              <p className="text-xs text-stone-500 mt-4">
                Data cuaca terkini membantu anda membuat keputusan mengenai jadual pam air dan pengairan.
              </p>
            </SectionCard>
          </div>

          {/* CALCULATOR FORM */}
          <div className="lg:col-span-12">
            <SectionCard title="KALKULATOR KARBON" subtitle="Daftar Rekod Pelepasan" icon={<Calculator className="size-4" />}>
              <form onSubmit={handleSaveRecord} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputBox label="NAMA LADANG" value={namaLadang} onChange={(e) => setNamaLadang(e.target.value)} />
                  <InputBox label="TARIKH (HARI INI)" type="date" value={tarikh} onChange={(e) => setTarikh(e.target.value)} />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">RANTAU GRID ELEKTRIK (SCOPE 2)</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as Region)}
                    className="w-full bg-[#fbfaf6] border border-[#ebe8df] rounded-xl px-4 py-2.5 text-sm font-medium text-stone-800 focus:outline-none focus:border-[#a64027] focus:ring-1 focus:ring-[#a64027]"
                  >
                    <option value="Peninsular">Semenanjung Malaysia (TNB)</option>
                    <option value="Sabah">Sabah (SESB)</option>
                    <option value="Sarawak">Sarawak (SEB)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputBox label="SCOPE 1 : NATURAL GAS (m³)" type="number" placeholder="0" value={naturalGas} onChange={(e) => setNaturalGas(e.target.value as any)} />
                  <InputBox label="SCOPE 1 : LPG (kg)" type="number" placeholder="0" value={lpg} onChange={(e) => setLpg(e.target.value as any)} />
                  <InputBox label="SCOPE 1 : DIESEL (L)" type="number" placeholder="0" value={diesel} onChange={(e) => setDiesel(e.target.value as any)} />
                  <InputBox label="SCOPE 1 : PETROL (L)" type="number" placeholder="0" value={petrol} onChange={(e) => setPetrol(e.target.value as any)} />
                  <InputBox label="SCOPE 2 : ELEKTRIK (kWh)" type="number" placeholder="0" value={elektrik} onChange={(e) => setElektrik(e.target.value as any)} />
                </div>

                <InputBox label="CATATAN" placeholder="Masukkan sebarang nota..." value={catatan} onChange={(e) => setCatatan(e.target.value)} />

                <div className="pt-4 border-t border-[#ebe8df] flex justify-end">
                  <button type="submit" className="flex items-center gap-2 bg-[#a64027] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-[#8b3520] transition-colors">
                    <Save className="size-4" /> Simpan Rekod
                  </button>
                </div>
              </form>
            </SectionCard>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard title="PANDANGAN BULANAN" subtitle="Trend Pelepasan" icon={<LineChart className="size-4" />}>
            <EmptyChartPlaceholder />
          </SectionCard>
          <SectionCard title="KELAS VS KELAS" subtitle="Perbandingan" icon={<BarChart3 className="size-4" />}>
            <EmptyChartPlaceholder />
          </SectionCard>
        </div>

        {/* TABLES ROW */}
        <SectionCard title="REKOD LADANG" subtitle="Senarai Pelepasan" icon={<List className="size-4" />}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ebe8df]">
                  <th className="pb-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Tarikh</th>
                  <th className="pb-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Ladang</th>
                  <th className="pb-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Rantau</th>
                  <th className="pb-3 text-xs font-bold text-stone-500 uppercase tracking-wider">S1 (kg)</th>
                  <th className="pb-3 text-xs font-bold text-stone-500 uppercase tracking-wider">S2 (kg)</th>
                  <th className="pb-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? history.map((entry, idx) => (
                  <tr key={idx} className="border-b border-stone-100 last:border-0">
                    <td className="py-4 text-sm font-medium text-stone-700">{entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : 'Hari ini'}</td>
                    <td className="py-4 text-sm text-stone-600">Ladang Utama</td>
                    <td className="py-4 text-sm text-stone-600">Peninsular</td>
                    <td className="py-4 text-sm text-stone-600">{entry.scope1.toFixed(2)}</td>
                    <td className="py-4 text-sm text-stone-600">{entry.scope2.toFixed(2)}</td>
                    <td className="py-4 text-sm font-bold text-[#a64027]">{entry.totalEmissions.toFixed(2)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-stone-400">Tiada rekod dijumpai.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="RUJUKAN" subtitle="Emission Factors" icon={<Info className="size-4" />}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ebe8df]">
                  <th className="pb-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Skop</th>
                  <th className="pb-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Sumber</th>
                  <th className="pb-3 text-xs font-bold text-stone-500 uppercase tracking-wider">Faktor (Unit)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { scope: "Scope 1", source: "Natural Gas", factor: "2.0226 kg / m³" },
                  { scope: "Scope 1", source: "LPG", factor: "1.51 kg / kg" },
                  { scope: "Scope 1", source: "Diesel", factor: "2.68 kg / L" },
                  { scope: "Scope 1", source: "Petrol", factor: "2.31 kg / L" },
                  { scope: "Scope 2", source: "Peninsular", factor: "0.78 kg / kWh" },
                  { scope: "Scope 2", source: "Sabah", factor: "0.53 kg / kWh" },
                  { scope: "Scope 2", source: "Sarawak", factor: "0.25 kg / kWh" },
                ].map((item, idx) => (
                  <tr key={idx} className="border-b border-stone-100 last:border-0">
                    <td className="py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded-md tracking-wider">
                        {item.scope}
                      </span>
                    </td>
                    <td className="py-3 text-sm font-medium text-stone-700">{item.source}</td>
                    <td className="py-3 text-sm text-stone-500 font-mono">{item.factor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <footer className="text-center py-8 text-[10px] text-stone-400 uppercase tracking-widest">
          © {new Date().getFullYear()} Ladang Pro · Membina masa depan pertanian lestari.
        </footer>

      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function StatCard({ title, value, unit, icon }: { title: string, value: string, unit: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#ebe8df] shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4 text-stone-400">
        <h3 className="text-[10px] font-bold uppercase tracking-widest">{title}</h3>
        {icon}
      </div>
      <div className="mt-auto">
        <p className="text-3xl font-mono font-bold text-[#a64027] tracking-tight">{value}</p>
        <p className="text-[10px] text-stone-500 uppercase tracking-wider mt-1">{unit}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, icon, children }: { title: string, subtitle: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#ebe8df] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[#ebe8df] flex justify-between items-center bg-[#fcfbf9]">
        <div>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-lg font-bold text-stone-800">{subtitle}</h3>
        </div>
        <div className="text-stone-400">{icon}</div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function InputBox({ label, type = "text", placeholder, value, onChange }: { label: string, type?: string, placeholder?: string, value: any, onChange: (e: any) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-[#fbfaf6] border border-[#ebe8df] rounded-xl px-4 py-2.5 text-sm font-medium text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-[#a64027] focus:ring-1 focus:ring-[#a64027]"
      />
    </div>
  );
}

function EmptyChartPlaceholder() {
  return (
    <div className="h-48 w-full border-2 border-dashed border-[#ebe8df] rounded-xl flex items-center justify-center">
      <p className="text-sm text-stone-400 font-medium">Data belum mencukupi.</p>
    </div>
  );
}