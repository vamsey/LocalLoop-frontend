import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import {
  LineChart, Line, XAxis, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Mic, Zap, Smartphone, MessageCircle, Quote, ArrowRight,
  ClipboardList, Bot, TrendingUp, Globe, Mail, HelpCircle,
  Twitter, Instagram, Facebook,
  FileText, Star, Wallet, Receipt, BadgePercent, Gift,
  Shield, Crown, ChevronRight, CheckCircle2
} from "lucide-react";
import Navbar from "../components/Navbar";

const chartData = [
  { name: "Mon", revenue: 1200 },
  { name: "Tue", revenue: 2100 },
  { name: "Wed", revenue: 800 },
  { name: "Thu", revenue: 1600 },
  { name: "Fri", revenue: 2400 },
  { name: "Sat", revenue: 1900 },
];

const TESTIMONIALS = [
  { name: "Amma's Bakery",    text: "I used to throw away leftover bread. Now, LocalLoop's Flash Sale clears my shelves in 30 minutes. It's magic." },
  { name: "Sharma Groceries", text: "The AI Voice Ledger saves me two hours a night. I just tell my phone what I sold, and my khata is perfectly updated." },
  { name: "Raju Tailors",     text: "Customers actually find my tailoring shop on the map now. My revenue is up 40% since I registered." },
  { name: "Fresh Veggies Co.", text: "Group buying through the B2B network helped me cut my wholesale costs by 15%. Incredible platform for small vendors." },
];

const SCROLLING_TESTIMONIALS = [...TESTIMONIALS, ...TESTIMONIALS];

const LANGUAGES = [
  { code: "en", label: "EN", full: "English" },
  { code: "hi", label: "हि", full: "Hindi" },
  { code: "te", label: "తె", full: "Telugu" },
];

const TRANSLATIONS = {
  en: {
    badge: "The Future of Local Commerce",
    h1a: "Empowering",
    h1b: "Local Businesses.",
    sub: "Discover nearby shops, support local entrepreneurs, and give small businesses the AI tools they need to grow digitally.",
    cta1: "I own a shop",
    cta2: "I'm a customer",
    statsTitle: "Trusted by local communities across India",
    s1n: "10,400+", s1l: "Businesses registered",
    s2n: "₹2.1Cr+", s2l: "Revenue tracked this month",
    s3n: "412",     s3l: "Flash sales live today",
    s4n: "2 hrs",   s4l: "Avg time saved per day",
    howTitle: "How it works",
    howSub: "From sign-up to growing sales in three simple steps — no tech skills needed.",
    step1t: "Register your shop",   step1d: "Add your shop name, category, and location in under 2 minutes.",
    step2t: "Manage with AI daily", step2d: "Log sales by voice, track stock, auto-send payment reminders.",
    step3t: "Grow your revenue",    step3d: "Run flash sales, boost your Maps ranking, reach more customers.",
  },
  hi: {
    badge: "स्थानीय व्यापार का भविष्य",
    h1a: "सशक्त बनाएं",
    h1b: "स्थानीय व्यवसाय।",
    sub: "पास की दुकानें खोजें, स्थानीय उद्यमियों को सहयोग करें और छोटे व्यापारियों को डिजिटल AI टूल्स दें।",
    cta1: "मेरी दुकान है",
    cta2: "मैं ग्राहक हूँ",
    statsTitle: "पूरे भारत में स्थानीय समुदायों का विश्वास",
    s1n: "10,400+", s1l: "पंजीकृत व्यवसाय",
    s2n: "₹2.1Cr+", s2l: "इस माह ट्रैक किया राजस्व",
    s3n: "412",     s3l: "आज लाइव फ्लैश सेल",
    s4n: "2 घंटे",  s4l: "प्रतिदिन बचाया औसत समय",
    howTitle: "यह कैसे काम करता है",
    howSub: "तीन आसान चरणों में साइन-अप से बिक्री तक — कोई तकनीकी ज्ञान जरूरी नहीं।",
    step1t: "अपनी दुकान पंजीकृत करें", step1d: "2 मिनट में दुकान का नाम, श्रेणी और स्थान जोड़ें।",
    step2t: "AI से रोज़ प्रबंधन करें",   step2d: "आवाज़ से बिक्री दर्ज करें, स्टॉक ट्रैक करें, रिमाइंडर भेजें।",
    step3t: "राजस्व बढ़ाएं",             step3d: "फ्लैश सेल चलाएं, Maps रैंकिंग बढ़ाएं, ज़्यादा ग्राहक पाएं।",
  },
  te: {
    badge: "స్థానిక వ్యాపారానికి భవిష్యత్తు",
    h1a: "శక్తివంతం చేయడం",
    h1b: "స్థానిక వ్యాపారాలను.",
    sub: "దగ్గరలోని దుకాణాలు కనుగొనండి, స్థానిక వ్యాపారులకు మద్దతు ఇవ్వండి మరియు చిన్న వ్యాపారాలకు AI సాధనాలు అందించండి.",
    cta1: "నాకు దుకాణం ఉంది",
    cta2: "నేను కస్టమర్‌ని",
    statsTitle: "భారతదేశంలో స్థానిక సంఘాల విశ్వాసం",
    s1n: "10,400+", s1l: "నమోదైన వ్యాపారాలు",
    s2n: "₹2.1Cr+", s2l: "ఈ నెల ట్రాక్ చేసిన ఆదాయం",
    s3n: "412",     s3l: "ఈరోజు లైవ్ ఫ్లాష్ సేల్స్",
    s4n: "2 గంటలు", s4l: "రోజుకు సగటు ఆదా సమయం",
    howTitle: "ఇది ఎలా పని చేస్తుంది",
    howSub: "మూడు సులభమైన దశల్లో సైన్-అప్ నుండి అమ్మకాల వరకు — సాంకేతిక నైపుణ్యం అవసరం లేదు.",
    step1t: "మీ దుకాణాన్ని నమోదు చేయండి", step1d: "2 నిమిషాల్లో దుకాణం పేరు, వర్గం మరియు స్థానం జోడించండి.",
    step2t: "AI తో రోజూ నిర్వహించండి",   step2d: "వాయిస్ ద్వారా అమ్మకాలు నమోదు చేయండి, స్టాక్ ట్రాక్ చేయండి.",
    step3t: "మీ ఆదాయాన్ని పెంచుకోండి",   step3d: "ఫ్లాష్ సేల్స్ నిర్వహించండి, మరిన్ని కస్టమర్లను చేరుకోండి.",
  },
};

const HOW_STEPS = [
  { icon: ClipboardList, color: "text-violet-500", bg: "bg-violet-500/10", borderColor: "border-violet-500/20", key: "step1" },
  { icon: Bot,           color: "text-cyan-500",   bg: "bg-cyan-500/10",   borderColor: "border-cyan-500/20",   key: "step2" },
  { icon: TrendingUp,    color: "text-emerald-500", bg: "bg-emerald-500/10", borderColor: "border-emerald-500/20", key: "step3" },
];

// ── Mini GST Invoice Preview ──
function MiniInvoicePreview({ darkMode }) {
  const items = [
    { name: "Rice Bag (25kg)", qty: 2, price: 1200, gst: 5 },
    { name: "Cooking Oil (1L)", qty: 3, price: 150, gst: 12 },
  ];
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const tax = items.reduce((s, it) => s + (it.qty * it.price * it.gst) / 100, 0);
  const total = subtotal + tax;

  return (
    <div className={`rounded-2xl border text-xs font-mono overflow-hidden ${darkMode ? "bg-black/40 border-white/10" : "bg-white border-zinc-200 shadow-sm"}`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${darkMode ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-100"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] ${darkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"}`}>AT</div>
            <div>
              <p className={`font-bold text-[11px] ${darkMode ? "text-zinc-200" : "text-zinc-800"}`}>Amma Tiffin Center</p>
              <p className={`text-[9px] ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>GSTIN: 36AABCA1234A1Z5</p>
            </div>
          </div>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${darkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>INV-04821</span>
        </div>
      </div>
      {/* Items */}
      <div className="px-4 py-3 space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className={darkMode ? "text-zinc-400" : "text-zinc-600"}>{it.name} ×{it.qty}</span>
            <span className={`font-bold ${darkMode ? "text-zinc-200" : "text-zinc-800"}`}>₹{(it.qty * it.price).toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
      {/* Totals */}
      <div className={`px-4 py-3 border-t ${darkMode ? "border-white/[0.06]" : "border-zinc-100"}`}>
        <div className="flex justify-between mb-1">
          <span className={darkMode ? "text-zinc-500" : "text-zinc-400"}>Subtotal</span>
          <span className={darkMode ? "text-zinc-300" : "text-zinc-600"}>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className={darkMode ? "text-zinc-500" : "text-zinc-400"}>GST</span>
          <span className={darkMode ? "text-zinc-300" : "text-zinc-600"}>₹{Math.round(tax)}</span>
        </div>
        <div className="flex justify-between font-black text-sm">
          <span className={darkMode ? "text-zinc-100" : "text-zinc-900"}>Total</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">₹{Math.round(total).toLocaleString("en-IN")}</span>
        </div>
      </div>
      {/* Actions */}
      <div className={`px-4 py-2.5 border-t flex gap-2 ${darkMode ? "border-white/[0.06]" : "border-zinc-100"}`}>
        <div className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center text-[10px] font-bold">Send WhatsApp</div>
        <div className={`flex-1 py-1.5 rounded-lg text-center text-[10px] font-bold border ${darkMode ? "border-white/10 text-zinc-400" : "border-zinc-200 text-zinc-500"}`}>Download PDF</div>
      </div>
    </div>
  );
}

// ── Mini Stamp Card ──
function MiniStampCard({ stamps = 7, total = 10, darkMode }) {
  return (
    <div className={`grid grid-cols-5 gap-1.5`}>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < stamps;
        return (
          <div key={i} className={`aspect-square rounded-lg flex items-center justify-center border transition-all ${
            filled
              ? "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-400 shadow-sm shadow-amber-400/30"
              : darkMode ? "border-white/[0.06] bg-white/[0.02]" : "border-amber-200 bg-amber-50/50"
          }`}>
            {filled && <Star size={9} className="text-white" fill="white" />}
          </div>
        );
      })}
    </div>
  );
}

// ── Mini Cash Summary ──
function MiniCashSummary({ darkMode }) {
  const rows = [
    { label: "💵 Cash",    value: "₹3,200", color: "text-emerald-500" },
    { label: "📲 UPI",     value: "₹1,650", color: "text-blue-500"    },
    { label: "🕐 Credit",  value: "₹820",   color: "text-amber-500"   },
    { label: "🛒 Restock", value: "₹1,100", color: "text-rose-500"    },
  ];
  return (
    <div className={`rounded-2xl border font-mono text-xs overflow-hidden ${darkMode ? "bg-black/40 border-white/10" : "bg-white border-zinc-200 shadow-sm"}`}>
      <div className={`px-4 py-2.5 border-b flex items-center justify-between ${darkMode ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-100"}`}>
        <p className={`font-bold text-[11px] ${darkMode ? "text-emerald-300" : "text-emerald-800"}`}>Amma Tiffin — Daily Report</p>
        <span className={`text-[9px] ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Today ✓✓</span>
      </div>
      <div className="px-4 py-3 space-y-1.5">
        {rows.map(({ label, value, color }) => (
          <div key={label} className="flex justify-between">
            <span className={darkMode ? "text-zinc-500" : "text-zinc-400"}>{label}</span>
            <span className={`font-bold ${color}`}>{value}</span>
          </div>
        ))}
      </div>
      <div className={`px-4 py-2.5 border-t ${darkMode ? "border-white/[0.06]" : "border-zinc-100"}`}>
        <div className="flex justify-between font-black text-sm">
          <span className={darkMode ? "text-zinc-200" : "text-zinc-800"}>✅ Net Profit</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">₹1,630</span>
        </div>
        <div className={`mt-2 h-1.5 rounded-full ${darkMode ? "bg-white/10" : "bg-zinc-100"}`}>
          <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 w-[43%]" />
        </div>
      </div>
      <div className={`px-4 py-2 border-t flex gap-2 ${darkMode ? "border-white/[0.06]" : "border-zinc-100"}`}>
        <div className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center text-[10px] font-bold">Share Family</div>
        <div className={`flex-1 py-1.5 rounded-lg text-center text-[10px] font-bold border ${darkMode ? "border-white/10 text-zinc-400" : "border-zinc-200 text-zinc-500"}`}>Send to CA</div>
      </div>
    </div>
  );
}

function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lang, setLang] = useState("en");

  // ── FIX: Default to light mode (false), only use localStorage if explicitly set ──
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    // Only respect saved preference if user has explicitly toggled it before
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.style.backgroundColor = darkMode ? "#030303" : "#FAFAFA";
  }, [darkMode]);

  const t = TRANSLATIONS[lang];

  const card = `backdrop-blur-2xl border rounded-[2rem] transition-colors duration-500 ${
    darkMode ? "bg-white/[0.02] border-white/[0.05]" : "bg-white border-zinc-200 shadow-xl shadow-zinc-200/50"
  }`;

  return (
    <div
      onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
      className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
        darkMode ? "bg-[#030303] text-white" : "bg-[#FAFAFA] text-zinc-900"
      }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── FIXED BACKGROUNDS ── */}
      <div className={`fixed inset-0 -z-50 ${darkMode ? "bg-[#030303]" : "bg-[#FAFAFA]"}`} />
      <div className={`fixed inset-0 -z-40 bg-[size:40px_40px] ${
        darkMode
          ? "bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"
          : "bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]"
      }`} />

      {/* Cursor spotlight */}
      {darkMode && (
        <div
          className="pointer-events-none fixed -z-10 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.8) 0%, transparent 70%)",
            left: mousePosition.x - 300,
            top:  mousePosition.y - 300,
          }}
        />
      )}

      {/* Aurora glows */}
      <motion.div animate={{ y: [0, 40, 0] }} transition={{ duration: 10, repeat: Infinity }}
        className={`fixed -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px] -z-20 ${darkMode ? "bg-fuchsia-600 opacity-15" : "bg-fuchsia-300 opacity-20"}`}
      />
      <motion.div animate={{ y: [0, -40, 0] }} transition={{ duration: 12, repeat: Infinity }}
        className={`fixed bottom-[-200px] right-1/4 w-[600px] h-[600px] rounded-full blur-[160px] -z-20 ${darkMode ? "bg-cyan-600 opacity-15" : "bg-cyan-200 opacity-30"}`}
      />

      {/* ── NAVBAR with language toggle ── */}
      <div className="relative z-50">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="absolute top-1/2 -translate-y-1/2 right-20 flex items-center gap-1">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              title={l.full}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 ${
                lang === l.code
                  ? darkMode
                    ? "bg-white/10 text-white border border-white/20"
                    : "bg-zinc-900 text-white"
                  : darkMode
                    ? "text-zinc-500 hover:text-zinc-300"
                    : "text-zinc-400 hover:text-zinc-700"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="flex flex-col items-center text-center mt-20 md:mt-28 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border backdrop-blur-md ${
            darkMode ? "bg-white/[0.03] border-white/[0.08] text-zinc-300" : "bg-zinc-900/5 border-zinc-200 text-zinc-700"
          }`}
        >
          <Zap size={14} className={darkMode ? "text-cyan-400" : "text-violet-600"} />
          {t.badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          style={{ fontFamily: "'Outfit', sans-serif" }}
          className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tight max-w-5xl"
        >
          {t.h1a}{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            {t.h1b}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className={`mt-8 text-lg md:text-xl max-w-2xl font-medium ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}
        >
          {t.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
        >
          <a
            href="/register"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-zinc-900 text-white font-bold shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            {t.cta1} <ArrowRight size={18} />
          </a>
          <a
            href="/explore"
            className={`flex items-center justify-center px-8 py-4 rounded-2xl font-bold border backdrop-blur-sm transition-all duration-300 ${
              darkMode ? "border-white/[0.08] text-white hover:bg-white/[0.03]" : "border-zinc-300 text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            {t.cta2}
          </a>
        </motion.div>

        {/* ── STATS BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-14 w-full max-w-3xl"
        >
          <p className={`text-xs font-semibold uppercase tracking-widest mb-4 ${darkMode ? "text-zinc-600" : "text-zinc-400"}`}>
            {t.statsTitle}
          </p>
          <div className={`grid grid-cols-2 md:grid-cols-4 rounded-[1.5rem] border overflow-hidden ${
            darkMode ? "border-white/[0.06] bg-white/[0.01]" : "border-zinc-200 bg-white shadow-sm"
          }`}>
            {[
              { n: t.s1n, l: t.s1l, live: false },
              { n: t.s2n, l: t.s2l, live: false },
              { n: t.s3n, l: t.s3l, live: true  },
              { n: t.s4n, l: t.s4l, live: false },
            ].map(({ n, l, live }, i) => (
              <div key={i} className={`px-6 py-5 ${
                i < 3 ? (darkMode ? "border-r border-b md:border-b-0 border-white/[0.06]" : "border-r border-b md:border-b-0 border-zinc-100") : ""
              }`}>
                <div className="flex items-center gap-2">
                  {live && (
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                  <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-2xl font-bold">{n}</p>
                </div>
                <p className={`text-xs font-medium mt-1 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>{l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── DASHBOARD PREVIEW ── */}
      <motion.div
        initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}
        className="flex justify-center mt-24 px-6 mb-32 relative z-10"
      >
        <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} glareEnable glareMaxOpacity={0.1} scale={1.01} transitionSpeed={2500} className="max-w-5xl w-full">
          <div className={`backdrop-blur-2xl border rounded-[2rem] p-8 transition-colors duration-500 ${
            darkMode ? "bg-white/[0.02] border-white/[0.05] shadow-[0_0_60px_rgba(124,58,237,0.1)]" : "bg-white/80 border-zinc-200 shadow-2xl shadow-zinc-200/50"
          }`}>
            <div className="grid grid-cols-3 gap-6">
              {[
                { emoji: "💰", label: "Revenue",   value: "₹12,400" },
                { emoji: "📦", label: "Orders",    value: "230"     },
                { emoji: "👥", label: "Customers", value: "98"      },
              ].map(({ emoji, label, value }) => (
                <div key={label} className={`rounded-2xl p-5 border flex flex-col ${
                  darkMode ? "bg-white/[0.02] border-white/[0.05]" : "bg-gradient-to-br from-zinc-50 to-white border-zinc-100"
                }`}>
                  <span className="text-xl">{emoji}</span>
                  <p className={`text-sm mt-2 font-medium ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>{label}</p>
                  <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-2xl font-bold mt-1">{value}</p>
                </div>
              ))}
            </div>

            <div className={`mt-8 rounded-2xl p-6 h-64 border ${
              darkMode ? "bg-white/[0.01] border-white/[0.05]" : "bg-white/50 border-zinc-100"
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Weekly Revenue</p>
                  <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-2xl font-bold mt-0.5">₹10,000</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  ↑ 18% this week
                </span>
              </div>
              <ResponsiveContainer width="100%" height="75%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" stroke={darkMode ? "#52525b" : "#a1a1aa"} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ stroke: darkMode ? "#27272a" : "#e4e4e7", strokeWidth: 1 }}
                    contentStyle={darkMode
                      ? { backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }
                      : { backgroundColor: "#fff", border: "1px solid #e4e4e7", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }
                    }
                  />
                  <Line type="monotone" dataKey="revenue" stroke="url(#colorUv)" strokeWidth={4} dot={{ r: 0 }} activeDot={{ r: 6, fill: "#06b6d4", strokeWidth: 0 }} />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#d946ef" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Tilt>
      </motion.div>

      {/* ── MISSION STATEMENT ── */}
      <div className="max-w-4xl mx-auto px-6 py-24 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontFamily: "'Outfit', sans-serif" }}
          className="text-4xl md:text-5xl font-bold leading-[1.2] tracking-tight"
        >
          The digital revolution shouldn't belong{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">only to the giants.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className={`mt-8 text-lg md:text-xl leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}
        >
          For too long, powerful tools have been locked behind expensive enterprise software. Meanwhile, the heart of our communities — the Kirana stores, the neighborhood tailors, the street-side bakeries — have been left to rely on paper ledgers and word-of-mouth.
          <br /><br />
          <strong className={darkMode ? "text-zinc-200" : "text-zinc-900"}>LocalLoop levels the playing field.</strong> We are putting AI, smart inventory, and hyper-local marketing directly into the hands of small business owners. Zero friction, zero tech expertise required.
        </motion.p>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-16">
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Simple Process</p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-4xl md:text-5xl font-bold tracking-tight">{t.howTitle}</h2>
          <p className={`mt-4 text-lg max-w-xl mx-auto ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>{t.howSub}</p>
        </div>

        <div className="relative">
          <div className={`hidden md:block absolute top-16 left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-px ${
            darkMode ? "bg-gradient-to-r from-transparent via-white/10 to-transparent" : "bg-gradient-to-r from-transparent via-zinc-200 to-transparent"
          }`} />

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_STEPS.map(({ icon: Icon, color, bg, borderColor, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative rounded-[2rem] p-8 border text-center ${
                  darkMode ? "bg-white/[0.02] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"
                }`}
              >
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 ${
                  darkMode ? "bg-[#030303] border-white/10 text-zinc-400" : "bg-white border-zinc-200 text-zinc-500"
                }`}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-2 border ${bg} ${borderColor}`}>
                  <Icon size={26} className={color} />
                </div>

                <h3 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-xl font-bold mb-3 tracking-tight">
                  {t[`${key}t`]}
                </h3>
                <p className={`text-base leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                  {t[`${key}d`]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BENTO FEATURE GRID (original) ── */}
      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-4xl md:text-5xl font-bold tracking-tight">Enterprise power. Local simplicity.</h2>
          <p className={`mt-4 text-lg ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>Everything a business needs to thrive in the modern economy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -5 }} className={`md:col-span-2 rounded-[2rem] p-10 border overflow-hidden relative group ${card}`}>
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${darkMode ? "bg-violet-500" : "bg-violet-300"}`} />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${darkMode ? "bg-white/[0.05] border border-white/10 text-violet-400" : "bg-violet-50 border border-violet-100 text-violet-600"}`}>
              <Mic size={28} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-3xl font-bold mb-4 tracking-tight">AI Voice Khata</h3>
            <p className={`max-w-md text-lg leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              Speak your sales. Let AI do the math. Log transactions, update inventory, and manage credit instantly with just your voice — in Hindi, Telugu, or English.
            </p>
            <p className={`mt-4 text-sm font-semibold ${darkMode ? "text-violet-400" : "text-violet-600"}`}>Avg. 2 hrs saved per day →</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className={`rounded-[2rem] p-10 border relative overflow-hidden group ${card}`}>
            <div className={`absolute top-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${darkMode ? "bg-fuchsia-500" : "bg-fuchsia-300"}`} />
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${darkMode ? "bg-white/[0.05] border border-white/10 text-fuchsia-400" : "bg-fuchsia-50 border border-fuchsia-100 text-fuchsia-600"}`}>
              <Zap size={24} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-2xl font-bold mb-4 tracking-tight">Anti-Waste Flash Sales</h3>
            <p className={`leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              Clear perishable stock by alerting users within a 2km radius instantly. Avg. shelf cleared in under 30 minutes.
            </p>
            <p className={`mt-4 text-sm font-semibold ${darkMode ? "text-fuchsia-400" : "text-fuchsia-600"}`}>412 sales live today →</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className={`rounded-[2rem] p-10 border relative overflow-hidden group ${card}`}>
            <div className={`absolute bottom-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${darkMode ? "bg-cyan-500" : "bg-cyan-300"}`} />
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${darkMode ? "bg-white/[0.05] border border-white/10 text-cyan-400" : "bg-cyan-50 border border-cyan-100 text-cyan-600"}`}>
              <Smartphone size={24} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-2xl font-bold mb-4 tracking-tight">Zero-Friction PWA</h3>
            <p className={`leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              No app store downloads needed. Works offline on budget ₹5,000 smartphones — built for Bharat, not Silicon Valley.
            </p>
            <p className={`mt-4 text-sm font-semibold ${darkMode ? "text-cyan-400" : "text-cyan-600"}`}>Works on any Android →</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className={`md:col-span-2 rounded-[2rem] p-10 border relative overflow-hidden group ${card}`}>
            <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${darkMode ? "bg-emerald-500" : "bg-emerald-300"}`} />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${darkMode ? "bg-white/[0.05] border border-white/10 text-emerald-400" : "bg-emerald-50 border border-emerald-100 text-emerald-600"}`}>
              <MessageCircle size={28} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-3xl font-bold mb-4 tracking-tight">Automated WhatsApp Marketing</h3>
            <p className={`max-w-md text-lg leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              Generate promotional messages, chase pending payments, and send UPI links with one tap. Your customers are already on WhatsApp — meet them there.
            </p>
            <p className={`mt-4 text-sm font-semibold ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>3× higher open rate vs email →</p>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          NEW FEATURES SECTION: GST Invoice, Loyalty, Cash
      ══════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border ${
              darkMode ? "bg-white/[0.03] border-white/[0.08] text-zinc-300" : "bg-violet-50 border-violet-100 text-violet-700"
            }`}
          >
            <Zap size={12} className={darkMode ? "text-violet-400" : "text-violet-500"} /> New Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontFamily: "'Outfit', sans-serif" }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            Run your whole business.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">From one screen.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className={`mt-4 text-lg max-w-2xl mx-auto ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}
          >
            GST invoicing, customer loyalty programs, and daily cash summaries — built for the way Indian businesses actually work.
          </motion.p>
        </div>

        {/* ── GST Invoice Feature ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className={`rounded-[2rem] border overflow-hidden mb-6 ${darkMode ? "bg-white/[0.02] border-white/[0.08]" : "bg-white border-zinc-200 shadow-xl shadow-zinc-100/80"}`}
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: copy */}
            <div className="p-10 md:p-14 flex flex-col justify-center relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-80 h-80 rounded-full blur-[100px] opacity-15 ${darkMode ? "bg-blue-500" : "bg-blue-300"}`} />
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10 ${darkMode ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                <FileText size={28} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-3xl font-bold mb-4 tracking-tight relative z-10">
                GST Invoice,<br />Done in 30 Seconds
              </h3>
              <p className={`text-lg leading-relaxed mb-6 relative z-10 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                Add items, select the right GST slab, and send a pixel-perfect invoice straight to your customer's WhatsApp — no CA required.
              </p>
              <ul className={`space-y-2.5 relative z-10 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                {["Auto-calculates CGST & SGST", "Multiple GST slabs (0%, 5%, 12%, 18%, 28%)", "PDF download for records", "WhatsApp delivery in one tap"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm font-medium">
                    <CheckCircle2 size={15} className={darkMode ? "text-blue-400 shrink-0" : "text-blue-500 shrink-0"} />
                    {item}
                  </li>
                ))}
              </ul>
              <p className={`mt-6 text-sm font-bold relative z-10 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                Trusted by 3,200+ GST-registered businesses →
              </p>
            </div>
            {/* Right: mini preview */}
            <div className={`p-8 md:p-10 flex items-center justify-center ${darkMode ? "bg-blue-500/[0.03] border-l border-white/[0.05]" : "bg-gradient-to-br from-blue-50/60 to-violet-50/40 border-l border-zinc-100"}`}>
              <div className="w-full max-w-xs">
                <MiniInvoicePreview darkMode={darkMode} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Loyalty Cards + Cash Summary side by side ── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Loyalty Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className={`rounded-[2rem] border p-10 relative overflow-hidden ${darkMode ? "bg-white/[0.02] border-white/[0.08]" : "bg-white border-zinc-200 shadow-xl shadow-zinc-100/80"}`}
          >
            <div className={`absolute top-0 right-0 w-56 h-56 rounded-full blur-[80px] opacity-20 ${darkMode ? "bg-amber-500" : "bg-amber-300"}`} />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10 ${darkMode ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
              <Star size={28} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-2xl font-bold mb-3 tracking-tight relative z-10">
              Digital Loyalty Cards
            </h3>
            <p className={`text-base leading-relaxed mb-6 relative z-10 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              Replace paper punch cards with a digital stamp system. Customers collect stamps via WhatsApp link — no app needed. Reward your best customers automatically.
            </p>

            {/* Live stamp preview */}
            <div className={`rounded-2xl border p-5 mb-5 relative z-10 ${darkMode ? "bg-white/[0.03] border-white/[0.08]" : "bg-amber-50/60 border-amber-100"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${darkMode ? "bg-white/[0.06] text-zinc-300" : "bg-white text-zinc-600 border border-zinc-100"}`}>RP</div>
                  <div>
                    <p className="font-bold text-sm">Ramesh P.</p>
                    <p className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>7 / 10 stamps</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full ${darkMode ? "text-amber-400 bg-amber-400/10 border border-amber-400/20" : "text-amber-700 bg-amber-100 border border-amber-200"}`}>
                  👑 Gold
                </span>
              </div>
              <MiniStampCard stamps={7} total={10} darkMode={darkMode} />
              <p className={`text-xs mt-2.5 font-medium ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>3 more to earn: Free Milk Pack 🎁</p>
            </div>

            <ul className={`space-y-2 relative z-10 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              {["Gold / Silver / Bronze tier system", "WhatsApp stamp reminders", "One-tap redeem for owner"].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 size={13} className={darkMode ? "text-amber-400 shrink-0" : "text-amber-500 shrink-0"} />
                  {item}
                </li>
              ))}
            </ul>
            <p className={`mt-5 text-sm font-bold relative z-10 ${darkMode ? "text-amber-400" : "text-amber-600"}`}>
              Avg. 34% higher repeat visits →
            </p>
          </motion.div>

          {/* Cash Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className={`rounded-[2rem] border p-10 relative overflow-hidden ${darkMode ? "bg-white/[0.02] border-white/[0.08]" : "bg-white border-zinc-200 shadow-xl shadow-zinc-100/80"}`}
          >
            <div className={`absolute top-0 right-0 w-56 h-56 rounded-full blur-[80px] opacity-20 ${darkMode ? "bg-emerald-500" : "bg-emerald-300"}`} />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 relative z-10 ${darkMode ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
              <Wallet size={28} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-2xl font-bold mb-3 tracking-tight relative z-10">
              Daily Cash Summary
            </h3>
            <p className={`text-base leading-relaxed mb-6 relative z-10 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              At the end of each day, LocalLoop automatically generates a full breakdown — cash, UPI, credit given, expenses — and WhatsApps it to you and your family.
            </p>

            {/* Live preview */}
            <div className="relative z-10 mb-5">
              <MiniCashSummary darkMode={darkMode} />
            </div>

            <ul className={`space-y-2 relative z-10 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              {["Scheduled auto-send at your chosen time", "Share with family or CA instantly", "Monthly P&L export as PDF"].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 size={13} className={darkMode ? "text-emerald-400 shrink-0" : "text-emerald-500 shrink-0"} />
                  {item}
                </li>
              ))}
            </ul>
            <p className={`mt-5 text-sm font-bold relative z-10 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
              Zero manual bookkeeping required →
            </p>
          </motion.div>
        </div>

        {/* ── Feature CTA strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className={`mt-6 rounded-[2rem] border p-8 flex flex-col md:flex-row items-center justify-between gap-6 ${
            darkMode ? "bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 border-violet-500/20" : "bg-gradient-to-r from-violet-50 to-fuchsia-50 border-violet-100"
          }`}
        >
          <div>
            <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-xl font-bold mb-1">All features. Zero extra cost.</p>
            <p className={`text-sm ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>GST invoices, loyalty cards, cash summaries — included in every LocalLoop plan.</p>
          </div>
          <a href="/register" className="shrink-0 flex items-center gap-2 px-7 py-4 rounded-2xl bg-zinc-900 text-white font-bold hover:scale-105 transition-transform shadow-lg whitespace-nowrap">
            Start for free <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>

      {/* ── WALL OF LOVE ── */}
      <div className="py-32 overflow-hidden relative z-10">
        <div className="text-center mb-16 px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Wall of Love</p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-4xl md:text-5xl font-bold tracking-tight">Trusted by local communities.</h2>
        </div>

        <div className={`absolute left-0 top-0 bottom-0 w-40 z-10 bg-gradient-to-r ${darkMode ? "from-[#030303] to-transparent" : "from-[#FAFAFA] to-transparent"}`} />
        <div className={`absolute right-0 top-0 bottom-0 w-40 z-10 bg-gradient-to-l ${darkMode ? "from-[#030303] to-transparent" : "from-[#FAFAFA] to-transparent"}`} />

        <div className="flex">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
            className="flex gap-8 w-max px-8"
          >
            {SCROLLING_TESTIMONIALS.map((t, idx) => (
              <div key={idx} className={`w-[400px] shrink-0 rounded-[2rem] p-10 border ${
                darkMode ? "bg-white/[0.02] border-white/[0.05]" : "bg-white border-zinc-200 shadow-lg shadow-zinc-200/50"
              }`}>
                <Quote className={`mb-6 ${darkMode ? "text-white/20" : "text-zinc-200"}`} size={40} fill="currentColor" />
                <p className={`text-lg font-medium mb-8 leading-relaxed ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>"{t.text}"</p>
                <p style={{ fontFamily: "'Outfit', sans-serif" }} className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
                  — {t.name}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div className="max-w-6xl mx-auto px-6 py-32 text-center relative z-10">
        <div className={`rounded-[3rem] p-12 md:p-24 border relative overflow-hidden ${
          darkMode ? "bg-white/[0.02] border-white/[0.08]" : "bg-white border-zinc-200 shadow-2xl shadow-zinc-200/50"
        }`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-violet-500/20 to-transparent blur-[100px] rounded-full pointer-events-none" />
          <h2 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-5xl md:text-7xl font-black mb-8 relative z-10 tracking-tight">
            Ready to modernize your business?
          </h2>
          <p className={`text-xl mb-12 max-w-2xl mx-auto relative z-10 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
            Join 10,000+ local entrepreneurs who are saving time, reducing waste, and growing their revenue with LocalLoop.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5 relative z-10">
            <a href="/register" className="px-10 py-5 rounded-2xl bg-zinc-900 text-white font-bold shadow-2xl hover:scale-105 transition-transform duration-300">
              Get Started for Free
            </a>
            <a href="/explore" className={`px-10 py-5 rounded-2xl font-bold border transition-all duration-300 ${
              darkMode ? "border-white/[0.08] text-white hover:bg-white/[0.03]" : "border-zinc-300 text-zinc-900 bg-white hover:bg-zinc-50"
            }`}>
              Explore the App
            </a>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className={`border-t ${darkMode ? "border-white/[0.05]" : "border-zinc-200"}`}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 md:col-span-1">
              <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-xl font-black mb-3">
                <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">LocalLoop</span>
              </p>
              <p className={`text-sm leading-relaxed mb-5 ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                Empowering the neighborhood economy with AI-powered tools.
              </p>
              <div className="flex gap-3">
                {[Twitter, Instagram, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                    darkMode ? "border-white/[0.08] text-zinc-500 hover:text-white hover:border-white/20" : "border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:border-zinc-300"
                  }`}>
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Product</p>
              {["Explore Directory", "Register Business", "Owner Dashboard", "Flash Sales", "AI Voice Khata"].map((item) => (
                <a key={item} href="#" className={`block text-sm mb-2.5 transition-colors ${
                  darkMode ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-800"
                }`}>{item}</a>
              ))}
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Company</p>
              {["About Us", "Blog", "Careers", "Press", "Partners"].map((item) => (
                <a key={item} href="#" className={`block text-sm mb-2.5 transition-colors ${
                  darkMode ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-800"
                }`}>{item}</a>
              ))}
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Support</p>
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service", "Report a Bug"].map((item) => (
                <a key={item} href="#" className={`block text-sm mb-2.5 transition-colors ${
                  darkMode ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-500 hover:text-zinc-800"
                }`}>{item}</a>
              ))}
            </div>
          </div>

          <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${
            darkMode ? "border-white/[0.05]" : "border-zinc-100"
          }`}>
            <p className={`text-sm ${darkMode ? "text-zinc-600" : "text-zinc-400"}`}>
              © {new Date().getFullYear()} LocalLoop. Empowering the neighborhood economy.
            </p>
            <div className="flex items-center gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    lang === l.code
                      ? darkMode ? "bg-white/10 text-white" : "bg-zinc-900 text-white"
                      : darkMode ? "text-zinc-600 hover:text-zinc-400" : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  {l.full}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;