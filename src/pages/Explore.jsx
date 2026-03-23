import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Star, ChevronRight,
  Sparkles, Grid3X3, List, Navigation,
  X, Phone, MessageCircle, ShoppingBag
} from "lucide-react";
import { getBusinesses } from "../services/api";
import Navbar from "../components/Navbar";

// ── Cache config ─────────────────────────────────────────────────────────────
const CACHE_KEY = "localloop_businesses";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "All",       emoji: "✦"  },
  { label: "Food",      emoji: "🍱" },
  { label: "Grocery",   emoji: "🛒" },
  { label: "Tailoring", emoji: "🧵" },
  { label: "Services",  emoji: "🔧" },
];

const getMockMenu = (category) => {
  switch (category) {
    case "Food":
      return [
        { name: "Masala Dosa", price: "₹50", desc: "Crispy crepe served with chutney & sambar" },
        { name: "Full South Indian Meals", price: "₹120", desc: "Rice, dal, 2 curries, rasam, curd, papad" },
        { name: "Idli (2 pcs)", price: "₹40", desc: "Soft steamed rice cakes" },
        { name: "Filter Coffee", price: "₹20", desc: "Authentic strong filter coffee" },
      ];
    case "Grocery":
      return [
        { name: "Sona Masoori Rice (25kg)", price: "₹1,250", desc: "Premium aged rice" },
        { name: "Toor Dal (1kg)", price: "₹120", desc: "Unpolished yellow lentils" },
        { name: "Sunflower Oil (1L)", price: "₹145", desc: "Refined cooking oil" },
        { name: "Sugar (1kg)", price: "₹45", desc: "Fine crystal sugar" },
      ];
    case "Tailoring":
      return [
        { name: "Shirt Stitching", price: "₹350", desc: "Custom fit with premium lining" },
        { name: "Pant Alteration", price: "₹80", desc: "Length & waist adjustments" },
        { name: "Saree Fall & Pico", price: "₹150", desc: "Machine stitched with matching thread" },
        { name: "Suit Stitching", price: "₹800", desc: "Full formal suit customization" },
      ];
    case "Services":
      return [
        { name: "AC Servicing", price: "₹500", desc: "Filter cleaning & gas check" },
        { name: "Plumbing Repair", price: "₹300", desc: "Basic leak fixes and pipe replacement" },
        { name: "Electrical Checkup", price: "₹200", desc: "Switchboard and wiring diagnosis" },
        { name: "RO Water Purifier Service", price: "₹400", desc: "Filter change and tank cleaning" },
      ];
    default:
      return [
        { name: "Standard Product 1", price: "₹100", desc: "High quality local item" },
        { name: "Standard Product 2", price: "₹250", desc: "Premium local service" },
      ];
  }
};

// ── Cache helpers ─────────────────────────────────────────────────────────────
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, cachedAt } = JSON.parse(raw);
    if (Date.now() - cachedAt < CACHE_TTL && Array.isArray(data) && data.length > 0) {
      return data;
    }
    return null; // expired
  } catch {
    return null; // corrupted — treat as miss
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, cachedAt: Date.now() }));
  } catch {
    // localStorage full or blocked — silently skip
  }
}

function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}

// ── Skeleton shimmer styles (injected once) ──────────────────────────────────
const SKELETON_STYLE = `
  @keyframes shimmer {
    0%   { background-position: -700px 0; }
    100% { background-position:  700px 0; }
  }
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      rgba(128,128,128,0.08) 25%,
      rgba(128,128,128,0.18) 37%,
      rgba(128,128,128,0.08) 63%
    );
    background-size: 700px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 0.75rem;
  }
`;

// ── SkeletonCard ─────────────────────────────────────────────────────────────
function SkeletonCard({ darkMode, listMode, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={`
        relative rounded-[2rem] overflow-hidden p-6 border
        flex ${listMode ? "flex-row items-center gap-5" : "flex-col gap-4"}
        ${darkMode
          ? "bg-white/[0.02] border-white/[0.08]"
          : "bg-white border-zinc-200"
        }
      `}
    >
      <div className="shrink-0 w-14 h-14 rounded-2xl skeleton-shimmer" />
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <div className="skeleton-shimmer h-6 w-3/5 rounded-xl" />
        <div className="flex gap-2">
          <div className="skeleton-shimmer h-4 w-16 rounded-full" />
          <div className="skeleton-shimmer h-4 w-12 rounded-full" />
        </div>
        <div className="skeleton-shimmer h-3.5 w-full rounded-lg" />
        <div className="skeleton-shimmer h-3.5 w-4/5 rounded-lg" />
        <div className={`flex items-center justify-between pt-3 mt-auto border-t ${darkMode ? "border-white/[0.08]" : "border-zinc-100"}`}>
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton-shimmer w-2.5 h-2.5 rounded-full" />
            ))}
            <div className="skeleton-shimmer h-3.5 w-6 rounded ml-1" />
          </div>
          <div className="skeleton-shimmer h-3.5 w-14 rounded" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating, darkMode }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={
            i <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : darkMode
              ? "text-zinc-700 fill-zinc-700"
              : "text-zinc-300 fill-zinc-300"
          }
        />
      ))}
    </div>
  );
}

// ── BusinessCard ─────────────────────────────────────────────────────────────
function BusinessCard({ business, index, darkMode, listMode, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: listMode ? 0 : -5, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="group relative rounded-[2rem] overflow-hidden cursor-pointer"
    >
      <div
        className={`
          relative backdrop-blur-2xl rounded-[2rem] p-6 border
          flex ${listMode ? "flex-row items-center gap-5" : "flex-col gap-4"}
          transition-all duration-300
          ${darkMode
            ? "bg-white/[0.02] border-white/[0.08] hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]"
            : "bg-white border-zinc-200 hover:border-violet-300 hover:shadow-[0_10px_40px_rgba(139,92,246,0.1)]"
          }
        `}
      >
        <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
          ${darkMode ? "bg-white/[0.05] border border-white/10" : "bg-zinc-50 shadow-sm border border-zinc-100"}`}>
          {CATEGORIES.find((c) => c.label === business.category)?.emoji ?? "🏪"}
        </div>

        <div className={`flex-1 min-w-0 ${listMode ? "" : "flex flex-col gap-3"}`}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                style={{ fontFamily: "'Outfit', sans-serif" }}
                className={`font-bold text-xl leading-tight truncate ${darkMode ? "text-white" : "text-zinc-900"}`}
              >
                {business.name}
              </h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border
                  ${darkMode
                    ? "text-violet-300 bg-violet-500/10 border-violet-500/20"
                    : "text-violet-700 bg-violet-50 border-violet-200"
                  }`}>
                  {business.category}
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full
                  ${business.open
                    ? darkMode ? "text-emerald-400 bg-emerald-500/10" : "text-emerald-700 bg-emerald-50"
                    : darkMode ? "text-zinc-500 bg-zinc-800/50"        : "text-zinc-500 bg-zinc-100"
                  }`}>
                  {business.open ? "● Open" : "○ Closed"}
                </span>
              </div>
            </div>
          </div>

          <p className={`text-sm leading-relaxed line-clamp-2 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
            {business.description}
          </p>

          <div className={`flex items-center justify-between pt-3 mt-auto border-t
            ${darkMode ? "border-white/[0.08]" : "border-zinc-100"}`}>
            <div className="flex items-center gap-2">
              <Stars rating={business.rating ?? 4.5} darkMode={darkMode} />
              <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-zinc-800"}`}>
                {(business.rating ?? 4.5).toFixed(1)}
              </span>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-medium ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
              <MapPin size={12} className="text-cyan-500" />
              {business.distance ?? "Nearby"}
            </div>
          </div>
        </div>

        {!listMode && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center pb-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
            <button className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-900 dark:bg-white dark:text-black text-white px-5 py-2 rounded-full shadow-xl">
              View Menu <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

const SKELETON_COUNT = 6;

// ── Explore ──────────────────────────────────────────────────────────────────
function Explore() {
  const [businesses, setBusinesses]       = useState([]);
  const [filtered, setFiltered]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode]           = useState("grid");
  const [mousePos, setMousePos]           = useState({ x: 0, y: 0 });
  const [locationName, setLocationName]   = useState("you");
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [fromCache, setFromCache]         = useState(false); // ← tracks cache hit

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.style.backgroundColor = darkMode ? "#030303" : "#FAFAFA";
  }, [darkMode]);

  useEffect(() => {
    if (selectedBusiness) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [selectedBusiness]);

  // ── Fetch with cache ────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      // 1. Try cache first — instant render, no skeletons
      const cached = readCache();
      if (cached) {
        setBusinesses(cached);
        setFiltered(cached);
        setFromCache(true);
        setLoading(false);
        return;
      }

      // 2. Cache miss or expired → hit the backend
      setLoading(true);
      try {
        const res  = await getBusinesses();
        const data = Array.isArray(res.data) ? res.data : [];
        setBusinesses(data);
        setFiltered(data);
        writeCache(data); // persist for next reload
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
        setFromCache(false);
      }
    })();
  }, []);

  // ── Geolocation ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.state_district;
        if (city) setLocationName(city);
      } catch {}
    }, () => {});
  }, []);

  // ── Filter helpers ───────────────────────────────────────────────────────────
  const applyFilters = (cat, q) => {
    let list = businesses;
    if (cat !== "All") list = list.filter((b) => b.category === cat);
    if (q) list = list.filter((b) => b.name.toLowerCase().includes(q.toLowerCase()));
    setFiltered(list);
  };

  const filterCategory = (cat) => { setActiveCategory(cat); applyFilters(cat, search); };
  const handleSearch   = (val) => { setSearch(val); applyFilters(activeCategory, val); };

  // ── Manual refresh — busts cache and re-fetches ──────────────────────────────
  const handleRefresh = async () => {
    clearCache();
    setFromCache(false);
    setLoading(true);
    try {
      const res  = await getBusinesses();
      const data = Array.isArray(res.data) ? res.data : [];
      setBusinesses(data);
      setFiltered(data);
      writeCache(data);
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-[#030303] text-white" : "bg-[#FAFAFA] text-zinc-900"
      }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      <style>{SKELETON_STYLE}</style>

      {/* Grid background */}
      <div className={`absolute inset-0 -z-30 bg-[size:40px_40px] ${
        darkMode
          ? "bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"
          : "bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]"
      }`} />

      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
        {darkMode && (
          <div
            className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(124,58,237,0.8) 0%, transparent 70%)",
              left: mousePos.x - 300,
              top:  mousePos.y - 300,
            }}
          />
        )}
        <motion.div
          animate={{ y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className={`absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px]
            ${darkMode ? "bg-fuchsia-600 opacity-15" : "bg-fuchsia-300 opacity-20"}`}
        />
        <motion.div
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className={`absolute bottom-[-200px] right-1/4 w-[600px] h-[600px] rounded-full blur-[160px]
            ${darkMode ? "bg-cyan-600 opacity-15" : "bg-cyan-200 opacity-30"}`}
        />
      </div>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* ── Hero ── */}
      <div className="relative pt-24 pb-6 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
          className="flex flex-col items-center gap-3"
        >
          {/* Status badge — shows cache hint */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border backdrop-blur-md
              ${darkMode ? "bg-white/[0.03] border-white/[0.08] text-zinc-300" : "bg-zinc-900/5 border-zinc-200 text-zinc-700"}`}>
              {locationName !== "you"
                ? <Navigation size={12} className="text-cyan-500" />
                : <Sparkles   size={12} className="text-violet-500" />}
              {loading
                ? "Loading businesses..."
                : `${filtered.length} businesses near ${locationName}`}
            </span>

            {/* Cache badge + refresh button */}
            {!loading && fromCache && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border backdrop-blur-md
                ${darkMode ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
                ⚡ Cached
              </span>
            )}
            {!loading && (
              <button
                onClick={handleRefresh}
                title="Force refresh from server"
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border backdrop-blur-md transition-colors
                  ${darkMode
                    ? "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20"
                    : "bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 shadow-sm"
                  }`}
              >
                ↻ Refresh
              </button>
            )}
          </div>

          <h1
            style={{ fontFamily: "'Outfit', sans-serif" }}
            className="text-4xl md:text-5xl font-black leading-tight tracking-tight"
          >
            Explore{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              Local Businesses.
            </span>
          </h1>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-4 flex justify-center"
        >
          <div className="relative flex items-center w-full max-w-2xl group">
            {darkMode && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-violet-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            )}
            <div className={`relative flex items-center w-full rounded-2xl px-5 py-3 transition-all duration-300
              ${darkMode
                ? "bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] focus-within:border-violet-500/50 focus-within:bg-white/[0.04]"
                : "bg-white border border-zinc-200 shadow-lg focus-within:border-violet-400 focus-within:shadow-[0_0_0_4px_rgba(139,92,246,0.1)]"
              }`}>
              <Search size={20} className="text-violet-500 shrink-0" />
              <input
                type="text"
                placeholder="Search businesses, services, or categories..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className={`ml-4 w-full bg-transparent outline-none text-base font-medium
                  ${darkMode ? "text-white placeholder-zinc-500" : "text-zinc-900 placeholder-zinc-400"}`}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Filter bar ── */}
      <div className={`sticky top-[73px] z-40 backdrop-blur-2xl border-b px-6 py-4 transition-colors duration-500
        ${darkMode ? "bg-[#030303]/70 border-white/[0.08]" : "bg-[#FAFAFA]/70 border-zinc-200"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {CATEGORIES.map(({ label, emoji }) => (
              <motion.button
                key={label}
                whileTap={{ scale: 0.95 }}
                onClick={() => filterCategory(label)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
                  ${activeCategory === label
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg"
                    : darkMode
                    ? "bg-white/[0.03] border border-white/[0.08] text-zinc-400 hover:bg-white/[0.08] hover:text-white"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 shadow-sm"
                  }`}
              >
                <span>{emoji}</span> {label}
              </motion.button>
            ))}
          </div>
          <div className={`flex items-center gap-1 rounded-xl p-1.5 border
            ${darkMode ? "bg-white/[0.03] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`}>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all duration-200
                ${viewMode === "grid"
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-black shadow"
                  : darkMode ? "text-zinc-500 hover:text-white" : "text-zinc-500 hover:text-zinc-900"}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all duration-200
                ${viewMode === "list"
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-black shadow"
                  : darkMode ? "text-zinc-500 hover:text-white" : "text-zinc-500 hover:text-zinc-900"}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Card grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 pb-32">
        <AnimatePresence mode="wait">

          {/* Skeleton state */}
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6 max-w-4xl mx-auto"}
            >
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonCard key={i} index={i} darkMode={darkMode} listMode={viewMode === "list"} />
              ))}
            </motion.div>

          /* Real cards */
          ) : filtered.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${search}-${viewMode}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "flex flex-col gap-6 max-w-4xl mx-auto"}
            >
              {filtered.map((b, i) => (
                <BusinessCard
                  key={b.id ?? i}
                  business={b}
                  index={i}
                  darkMode={darkMode}
                  listMode={viewMode === "list"}
                  onClick={() => setSelectedBusiness(b)}
                />
              ))}
            </motion.div>

          /* Empty state */
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-32"
            >
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 text-3xl border
                ${darkMode ? "bg-white/[0.02] border-white/[0.08]" : "bg-white border-zinc-200 shadow-lg"}`}>
                🔍
              </div>
              <h2
                style={{ fontFamily: "'Outfit', sans-serif" }}
                className={`text-3xl font-bold tracking-tight ${darkMode ? "text-white" : "text-zinc-900"}`}
              >
                No businesses found
              </h2>
              <p className={`mt-3 max-w-md text-lg ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                Try a different search or category, or be the first to register in this space.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Business detail modal ── */}
      <AnimatePresence>
        {selectedBusiness && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
              onClick={() => setSelectedBusiness(null)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-[2rem] shadow-2xl
                ${darkMode ? "bg-[#0a0a0c] border border-white/[0.08] text-white" : "bg-white border border-zinc-200 text-zinc-900"}`}
            >
              {/* Modal header */}
              <div className={`shrink-0 flex items-start justify-between p-8 border-b
                ${darkMode ? "border-white/[0.08] bg-white/[0.02]" : "border-zinc-100 bg-zinc-50/50"}`}>
                <div className="flex items-start gap-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border
                    ${darkMode ? "bg-white/[0.05] border-white/10" : "bg-white shadow-sm border-zinc-100"}`}>
                    {CATEGORIES.find((c) => c.label === selectedBusiness.category)?.emoji ?? "🏪"}
                  </div>
                  <div>
                    <h2
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                      className="text-3xl font-bold leading-tight tracking-tight"
                    >
                      {selectedBusiness.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border
                        ${darkMode ? "text-violet-300 bg-violet-500/15 border-violet-500/25" : "text-violet-700 bg-violet-50 border-violet-200"}`}>
                        {selectedBusiness.category}
                      </span>
                      <span className={`flex items-center gap-1.5 text-sm font-semibold ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        {selectedBusiness.rating ?? 4.5}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBusiness(null)}
                  className={`p-2 rounded-full transition-colors
                    ${darkMode ? "hover:bg-white/10 text-zinc-400 hover:text-white" : "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900"}`}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal body */}
              <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
                <p className={`text-base leading-relaxed mb-8 pb-8 border-b
                  ${darkMode ? "text-zinc-400 border-white/[0.08]" : "text-zinc-600 border-zinc-100"}`}>
                  {selectedBusiness.description}
                </p>

                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBag className="text-violet-500" size={20} />
                  <h3 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-xl font-bold">
                    Catalog &amp; Services
                  </h3>
                </div>

                <div className="space-y-4">
                  {getMockMenu(selectedBusiness.category).map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border flex justify-between items-center transition-all hover:scale-[1.02]
                        ${darkMode
                          ? "bg-white/[0.02] border-white/[0.08] hover:border-violet-500/50"
                          : "bg-white border-zinc-200 shadow-sm hover:border-violet-300"
                        }`}
                    >
                      <div>
                        <h4 className="font-bold text-lg">{item.name}</h4>
                        <p className={`text-sm mt-1 ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>{item.desc}</p>
                      </div>
                      <span className={`font-bold px-4 py-1.5 rounded-xl
                        ${darkMode ? "bg-violet-500/10 text-violet-300" : "bg-violet-50 text-violet-700"}`}>
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal footer */}
              <div className={`shrink-0 p-8 border-t flex flex-col sm:flex-row gap-4
                ${darkMode ? "border-white/[0.08] bg-white/[0.02]" : "border-zinc-100 bg-zinc-50"}`}>
                <button className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold border transition-colors
                  ${darkMode
                    ? "border-white/[0.08] hover:bg-white/[0.05] text-white"
                    : "border-zinc-300 hover:bg-zinc-100 text-zinc-900 bg-white"
                  }`}>
                  <Phone size={18} />
                  {selectedBusiness.phone ?? "Call Business"}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold bg-zinc-900 dark:bg-white dark:text-black text-white shadow-xl hover:scale-[1.02] transition-transform">
                  <MessageCircle size={18} />
                  Message on WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Explore;