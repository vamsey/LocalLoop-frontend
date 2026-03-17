import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Megaphone, MapPin, Package,
  LayoutDashboard, Sparkles, TrendingUp,
  ArrowUpRight, ArrowDownRight, Bot, CheckCircle2, AlertCircle,
  Mic, Radio, Timer, ShoppingBag, History, BadgePercent,
  Zap, Users, Receipt, AlertTriangle, ChevronRight,
  MessageSquare, PlusCircle, FileText, Star, Wallet,
  Send, Download, Trash2, Plus, Gift, Crown, Award
} from "lucide-react";
import Navbar from "../components/Navbar";

// ── Inline Sparkline ──
function Sparkline({ data, color = "#8b5cf6", height = 56 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 280, h = height;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 8) - 4}`).join(" ");
  const areaPoints = `0,${h} ${points} ${(data.length - 1) * step},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color.replace("#", "")})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.length > 0 && (() => {
        const last = data[data.length - 1];
        const x = (data.length - 1) * step;
        const y = h - ((last - min) / range) * (h - 8) - 4;
        return <circle cx={x} cy={y} r="4" fill={color} />;
      })()}
    </svg>
  );
}

// ── Stamp Card Visual ──
function StampCard({ stamps, total, darkMode }) {
  return (
    <div className={`rounded-2xl border p-4 ${darkMode ? "bg-white/[0.03] border-white/[0.08]" : "bg-amber-50/60 border-amber-200"}`}>
      <div className="grid grid-cols-5 gap-2.5">
        {Array.from({ length: total }).map((_, i) => {
          const filled = i < stamps;
          const isNext = i === stamps;
          return (
            <div key={i} className={`aspect-square rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
              filled
                ? "bg-gradient-to-br from-amber-400 to-orange-500 border-amber-400 shadow-md shadow-amber-400/30"
                : isNext
                  ? darkMode ? "border-dashed border-amber-500/50 bg-amber-500/5" : "border-dashed border-amber-400 bg-amber-100/50"
                  : darkMode ? "border-white/[0.06] bg-white/[0.02]" : "border-amber-200 bg-white/60"
            }`}>
              {filled
                ? <Star size={14} className="text-white" fill="white" />
                : isNext
                  ? <Plus size={12} className={darkMode ? "text-amber-500/50" : "text-amber-400/60"} />
                  : <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? "bg-white/10" : "bg-amber-200"}`} />
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OwnerDashboard() {
  const [section, setSection] = useState("overview");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [aiOutput, setAiOutput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const [flashActive, setFlashActive] = useState(false);

  // GST Invoice state
  const [invoiceItems, setInvoiceItems] = useState([
    { name: "Rice Bag (25kg)", qty: 2, price: 1200, gst: 5 },
    { name: "Cooking Oil (1L)", qty: 3, price: 150, gst: 12 },
  ]);
  const [invoiceCustomer, setInvoiceCustomer] = useState({ name: "Ravi Kumar", phone: "9876543210", gstin: "" });
  const [invoiceSent, setInvoiceSent] = useState(false);

  // Loyalty state
  const [loyaltyCustomers, setLoyaltyCustomers] = useState([
    { name: "Ramesh P.",  phone: "9876501234", stamps: 7,  reward: "Free Milk Pack",    tier: "gold"   },
    { name: "Priya S.",   phone: "9876502345", stamps: 3,  reward: "₹20 off next bill", tier: "silver" },
    { name: "Suresh K.",  phone: "9876503456", stamps: 9,  reward: "Free Milk Pack",    tier: "gold"   },
    { name: "Anita R.",   phone: "9876504567", stamps: 1,  reward: "₹20 off next bill", tier: "bronze" },
    { name: "Venkat M.",  phone: "9876505678", stamps: 10, reward: "Free Milk Pack",    tier: "gold"   },
  ]);
  const [stampTarget] = useState(10);
  const [loyaltyReward, setLoyaltyReward] = useState("Free Milk Pack");
  const [addStampFor, setAddStampFor] = useState(null);

  // Cash Summary state
  const [summaryTime, setSummaryTime] = useState("21:00");
  const [summaryPhone, setSummaryPhone] = useState("9876543210");

  const cashData = {
    cash: 3200, upi: 1650, credit: 820, restock: 1100,
    orders: 24, avgOrder: 202, vsYesterday: 12,
    creditCustomers: [
      { name: "Ramesh", amount: 300, days: 2 },
      { name: "Priya",  amount: 220, days: 5 },
      { name: "Suresh", amount: 300, days: 9 },
    ],
  };
  const netProfit = cashData.cash + cashData.upi - cashData.credit - cashData.restock;
  const profitPct = Math.round((netProfit / (cashData.cash + cashData.upi)) * 100);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.style.backgroundColor = darkMode ? "#030303" : "#FAFAFA";
  }, [darkMode]);

  // GST helpers
  const addInvoiceItem = () => setInvoiceItems(p => [...p, { name: "", qty: 1, price: 0, gst: 5 }]);
  const removeInvoiceItem = (i) => setInvoiceItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => setInvoiceItems(p => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  const invoiceSubtotal = invoiceItems.reduce((s, it) => s + it.qty * it.price, 0);
  const invoiceTax = invoiceItems.reduce((s, it) => s + (it.qty * it.price * it.gst) / 100, 0);
  const invoiceTotal = invoiceSubtotal + invoiceTax;

  // Loyalty helpers
  const addStamp = (idx) => {
    setLoyaltyCustomers(p => p.map((c, i) => i !== idx ? c : { ...c, stamps: c.stamps >= stampTarget ? 0 : c.stamps + 1 }));
    setAddStampFor(idx);
    setTimeout(() => setAddStampFor(null), 600);
  };
  const tierStyle = (tier) => ({
    gold:   darkMode ? "text-amber-400 bg-amber-400/10 border-amber-400/20"   : "text-amber-700 bg-amber-100 border-amber-200",
    silver: darkMode ? "text-zinc-300 bg-zinc-300/10 border-zinc-300/20"      : "text-zinc-600 bg-zinc-100 border-zinc-200",
    bronze: darkMode ? "text-orange-400 bg-orange-400/10 border-orange-400/20": "text-orange-700 bg-orange-100 border-orange-200",
  })[tier];
  const TierIcons = { gold: Crown, silver: Award, bronze: Star };

  const navItems = [
    { id: "overview",    icon: LayoutDashboard, label: "Overview"       },
    { id: "sales",       icon: ShoppingBag,     label: "Sales & Offers" },
    { id: "marketing",   icon: Megaphone,        label: "Marketing"      },
    { id: "inventory",   icon: Package,          label: "Inventory"      },
    { id: "gst",         icon: FileText,         label: "GST Invoice"    },
    { id: "loyalty",     icon: Star,             label: "Loyalty Cards"  },
    { id: "cashsummary", icon: Wallet,           label: "Cash Summary"   },
    { id: "profit",      icon: BarChart3,        label: "Profit & Loss"  },
    { id: "maps",        icon: MapPin,           label: "Google Maps"    },
    { id: "ai",          icon: Bot,              label: "AI Assistant"   },
  ];

  const recentSales = [
    { id: "#ORD-1042", items: "1x Rice Bag (25kg), 2x Sugar (1kg)", total: "₹1300", time: "10 mins ago", status: "Completed" },
    { id: "#ORD-1041", items: "3x Milk Packet (500ml)",              total: "₹75",   time: "1 hour ago",  status: "Completed" },
    { id: "#ORD-1040", items: "1x Cooking Oil (1L)",                 total: "₹150",  time: "3 hours ago", status: "Completed" },
    { id: "#ORD-1039", items: "5x Wheat Flour (1kg)",                total: "₹250",  time: "Yesterday",   status: "Completed" },
  ];

  const weeklyRevenue = [1800, 2200, 1600, 2800, 1900, 3100, 1000];
  const weekLabels    = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const lowStockItems = [
    { name: "Rice Bag (25kg)",   stock: 15, max: 50, unit: "bags",    critical: true  },
    { name: "Milk Packets",      stock: 8,  max: 60, unit: "packets", critical: true  },
    { name: "Wheat Flour (1kg)", stock: 22, max: 80, unit: "packs",   critical: false },
  ];
  const todayPulse = [
    { label: "Orders Today",     value: "24",   icon: Receipt,       color: "violet" },
    { label: "New Customers",    value: "6",    icon: Users,         color: "cyan"   },
    { label: "Avg Order Value",  value: "₹517", icon: TrendingUp,    color: "emerald"},
    { label: "Pending Payments", value: "3",    icon: AlertTriangle, color: "amber"  },
  ];
  const quickActions = [
    { label: "Flash Sale",    icon: BadgePercent, color: "rose",    section: "sales"       },
    { label: "Add Stock",     icon: PlusCircle,   color: "emerald", section: "inventory"   },
    { label: "GST Invoice",   icon: FileText,     color: "blue",    section: "gst"         },
    { label: "Loyalty Stamp", icon: Star,         color: "amber",   section: "loyalty"     },
  ];

  const colorMap = {
    violet:  { bg: darkMode ? "bg-violet-500/10"  : "bg-violet-50",  text: "text-violet-500",  border: "border-violet-500/20"  },
    cyan:    { bg: darkMode ? "bg-cyan-500/10"    : "bg-cyan-50",    text: "text-cyan-500",    border: "border-cyan-500/20"    },
    emerald: { bg: darkMode ? "bg-emerald-500/10" : "bg-emerald-50", text: "text-emerald-500", border: "border-emerald-500/20" },
    amber:   { bg: darkMode ? "bg-amber-500/10"   : "bg-amber-50",   text: "text-amber-500",   border: "border-amber-500/20"   },
    rose:    { bg: darkMode ? "bg-rose-500/10"    : "bg-rose-50",    text: "text-rose-500",    border: "border-rose-500/20"    },
    blue:    { bg: darkMode ? "bg-blue-500/10"    : "bg-blue-50",    text: "text-blue-500",    border: "border-blue-500/20"    },
  };

  const cardBase = `backdrop-blur-2xl border rounded-[2rem] transition-all ${
    darkMode ? "bg-white/[0.02] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"
  }`;
  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none focus:ring-2 ${
    darkMode
      ? "bg-white/[0.04] border-white/[0.08] text-white placeholder-zinc-600 focus:ring-violet-500/30"
      : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:ring-violet-300"
  }`;

  const handleAIGenerate = (type) => {
    setAiOutput("Generating...");
    setTimeout(() => {
      if (type === "insta")   setAiOutput("🔥 Fresh Homemade Meals at Amma Tiffin Center! Visit us today. #LocalEats #HomeMade");
      if (type === "wa")      setAiOutput("Hello! 👋 Amma Tiffin Center is now on LocalLoop! Order ahead or drop by daily.");
      if (type === "tagline") setAiOutput("Amma Tiffin Center — Taste of Home in Every Bite.");
    }, 600);
  };

  const handleVoiceLedger = () => {
    if (isListening) return;
    setIsListening(true); setVoiceInput("Listening...");
    setTimeout(() => setVoiceInput("Sold 2 kilos of sugar to Rahul for ₹100"), 2000);
    setTimeout(() => { setIsListening(false); setVoiceInput(""); alert("✅ Inventory reduced by 2kg (Sugar) and ₹100 added to Rahul's Khata!"); }, 4000);
  };

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${darkMode ? "bg-[#030303] text-white" : "bg-[#FAFAFA] text-zinc-900"}`}
      style={{ fontFamily: "'Inter', sans-serif" }}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      {/* BACKGROUNDS */}
      <div className={`fixed inset-0 -z-50 ${darkMode ? "bg-[#030303]" : "bg-[#FAFAFA]"}`} />
      <div className={`fixed inset-0 -z-40 bg-[size:40px_40px] ${darkMode ? "bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" : "bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]"}`} />
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
        {darkMode && <div className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-20" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.8) 0%, transparent 70%)", left: mousePos.x - 300, top: mousePos.y - 300 }} />}
        <motion.div animate={{ y: [0, 40, 0] }} transition={{ duration: 10, repeat: Infinity }} className={`absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px] ${darkMode ? "bg-fuchsia-600 opacity-15" : "bg-fuchsia-300 opacity-20"}`} />
        <motion.div animate={{ y: [0, -40, 0] }} transition={{ duration: 12, repeat: Infinity }} className={`absolute bottom-[-200px] right-1/4 w-[600px] h-[600px] rounded-full blur-[160px] ${darkMode ? "bg-cyan-600 opacity-15" : "bg-cyan-200 opacity-30"}`} />
      </div>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="max-w-7xl mx-auto pt-10 pb-24 px-6 flex flex-col md:flex-row gap-8">

        {/* SIDEBAR */}
        <div className={`w-full md:w-64 shrink-0 backdrop-blur-2xl border rounded-[2rem] p-5 h-fit ${darkMode ? "bg-white/[0.02] border-white/[0.08]" : "bg-white/80 border-zinc-200 shadow-xl shadow-zinc-200/50"}`}>
          <div className="flex items-center gap-3 px-3 mb-6 mt-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg ${darkMode ? "bg-white/[0.05] border border-white/10 text-violet-400" : "bg-violet-50 border border-violet-100 text-violet-600"}`}>AT</div>
            <div>
              <h2 style={{ fontFamily: "'Outfit', sans-serif" }} className="font-bold text-lg leading-tight tracking-tight">Sharma Groceries</h2>
              <p className={`text-xs font-medium uppercase tracking-widest mt-0.5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Owner Portal</p>
            </div>
          </div>
          <nav className="flex overflow-x-auto md:flex-col gap-1 pb-2 md:pb-0 hide-scrollbar">
            {navItems.map(({ id, icon: Icon, label }) => {
              const isActive = section === id;
              return (
                <button key={id} onClick={() => setSection(id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap md:whitespace-normal font-semibold text-sm ${
                    isActive ? "bg-zinc-900 text-white shadow-lg" : darkMode ? "text-zinc-400 hover:bg-white/[0.05] hover:text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}>
                  <Icon size={17} />{label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* MAIN */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>

              {/* ══ OVERVIEW ══ */}
              {section === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h1 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-4xl font-bold tracking-tight">Business Overview</h1>
                    <p className={`mt-1 text-sm font-medium ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className={`${cardBase} p-7`}>
                      <div className="flex justify-between items-start mb-5">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500"><TrendingUp size={22} /></div>
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full"><ArrowUpRight size={13} /> 12%</span>
                      </div>
                      <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Total Revenue</p>
                      <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-3xl font-bold mt-1">₹12,400</p>
                    </div>
                    <div className={`${cardBase} p-7`}>
                      <div className="flex justify-between items-start mb-5">
                        <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500"><BarChart3 size={22} /></div>
                        <span className="flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full"><ArrowDownRight size={13} /> 4%</span>
                      </div>
                      <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Total Expenses</p>
                      <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-3xl font-bold mt-1">₹7,800</p>
                    </div>
                    <div className={`backdrop-blur-2xl border rounded-[2rem] p-7 ${darkMode ? "bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 border-violet-500/20" : "bg-gradient-to-br from-violet-50 to-fuchsia-50 border-violet-200 shadow-sm"}`}>
                      <div className="mb-5"><div className={`p-3 rounded-2xl w-fit ${darkMode ? "bg-violet-500/20 text-violet-400" : "bg-violet-100 text-violet-600"}`}><Sparkles size={22} /></div></div>
                      <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-violet-300" : "text-violet-700"}`}>Net Profit</p>
                      <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-3xl font-bold mt-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">₹4,600</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {todayPulse.map(({ label, value, icon: Icon, color }) => {
                      const c = colorMap[color];
                      return (
                        <div key={label} className={`${cardBase} px-5 py-4 flex items-center gap-4`}>
                          <div className={`p-2.5 rounded-xl shrink-0 ${c.bg} ${c.text}`}><Icon size={18} /></div>
                          <div>
                            <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-xl font-bold">{value}</p>
                            <p className={`text-xs font-medium mt-0.5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>{label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className={`${cardBase} p-6`}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Quick Actions</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {quickActions.map(({ label, icon: Icon, color, section: dest }) => {
                        const c = colorMap[color];
                        return (
                          <button key={label} onClick={() => setSection(dest)} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border font-semibold text-sm transition-all hover:scale-[1.03] active:scale-[0.98] ${c.bg} ${c.text} ${c.border}`}>
                            <Icon size={16} />{label}<ChevronRight size={14} className="ml-auto opacity-50" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-5 gap-4">
                    <div className={`${cardBase} p-7 md:col-span-3`}>
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Weekly Revenue</p>
                        <span className="text-xs font-semibold text-violet-500 bg-violet-500/10 px-2.5 py-1 rounded-full">This Week</span>
                      </div>
                      <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-2xl font-bold mb-4">₹14,400</p>
                      <Sparkline data={weeklyRevenue} color={darkMode ? "#a78bfa" : "#7c3aed"} height={64} />
                      <div className="flex justify-between mt-2">{weekLabels.map((d, i) => <span key={d} className={`text-[10px] font-semibold ${i === new Date().getDay() - 1 ? (darkMode ? "text-violet-400" : "text-violet-600") : (darkMode ? "text-zinc-600" : "text-zinc-400")}`}>{d}</span>)}</div>
                      <div className="flex items-end gap-1.5 mt-5 h-16">
                        {weeklyRevenue.map((v, i) => (
                          <div key={i} className="flex-1">
                            <div className={`w-full rounded-md ${i === new Date().getDay() - 1 ? "bg-gradient-to-t from-violet-600 to-fuchsia-500" : darkMode ? "bg-white/10" : "bg-zinc-200"}`} style={{ height: `${(v / Math.max(...weeklyRevenue)) * 100}%` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={`${cardBase} p-7 md:col-span-2 flex flex-col`}>
                      <div className="flex items-center gap-2 mb-5"><AlertTriangle size={16} className="text-amber-500" /><p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Low Stock Alerts</p></div>
                      <div className="space-y-4 flex-1">
                        {lowStockItems.map(({ name, stock, max, unit, critical }) => (
                          <div key={name}>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-sm font-semibold truncate pr-2">{name}</span>
                              <span className={`text-xs font-bold shrink-0 px-2 py-0.5 rounded-full ${critical ? "text-rose-500 bg-rose-500/10" : "text-amber-500 bg-amber-500/10"}`}>{stock} {unit}</span>
                            </div>
                            <div className={`w-full h-2 rounded-full ${darkMode ? "bg-white/[0.06]" : "bg-zinc-100"}`}>
                              <div className={`h-2 rounded-full ${critical ? "bg-gradient-to-r from-rose-500 to-orange-400" : "bg-gradient-to-r from-amber-400 to-yellow-300"}`} style={{ width: `${(stock / max) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setSection("inventory")} className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold border transition-all hover:scale-[1.02] ${darkMode ? "border-white/[0.08] text-zinc-300 hover:bg-white/[0.04]" : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"}`}>Manage Inventory <ChevronRight size={16} /></button>
                    </div>
                  </div>

                  <div className={`${cardBase} overflow-hidden`}>
                    <div className={`flex items-center justify-between px-7 py-5 border-b ${darkMode ? "border-white/[0.05]" : "border-zinc-100"}`}>
                      <div className="flex items-center gap-2"><History size={16} className="text-violet-500" /><p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>Recent Orders</p></div>
                      <button onClick={() => setSection("sales")} className="text-xs font-bold text-violet-500 hover:underline flex items-center gap-1">View All <ChevronRight size={13} /></button>
                    </div>
                    <div className={`divide-y ${darkMode ? "divide-white/[0.04]" : "divide-zinc-100"}`}>
                      {recentSales.slice(0, 3).map((sale, i) => (
                        <div key={i} className={`flex items-center justify-between px-7 py-4 text-sm transition-colors ${darkMode ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50"}`}>
                          <div className="flex items-center gap-4 min-w-0">
                            <span className="font-bold text-violet-500 shrink-0">{sale.id}</span>
                            <span className={`truncate ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>{sale.items}</span>
                          </div>
                          <div className="flex items-center gap-4 shrink-0 ml-4">
                            <span className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>{sale.time}</span>
                            <span className="font-bold">{sale.total}</span>
                            <span className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full"><CheckCircle2 size={12} /> Done</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ══ SALES ══ */}
              {section === "sales" && (
                <div className="space-y-6">
                  <h1 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-4xl font-bold tracking-tight mb-6">Sales & Offers</h1>
                  <div className={`backdrop-blur-2xl border rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden ${darkMode ? "bg-gradient-to-r from-rose-900/20 to-orange-900/20 border-rose-500/20" : "bg-gradient-to-r from-rose-50 to-orange-50 border-rose-200 shadow-xl shadow-rose-200/50"}`}>
                    {flashActive && <div className="absolute right-10 w-48 h-48 bg-rose-500/20 rounded-full blur-2xl animate-ping" />}
                    <div className="z-10">
                      <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest px-3 py-1.5 rounded-full mb-5 bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg"><Radio size={14} /> HYPER-LOCAL FLASH SALE</div>
                      <h2 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-3xl font-bold mb-3">Clear Perishable Inventory</h2>
                      <p className={`max-w-md text-lg leading-relaxed ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>Broadcast an instant 50% discount to users within 2km to clear stock before closing.</p>
                    </div>
                    <button onClick={() => { setFlashActive(true); setTimeout(() => { alert("Flash Sale Broadcasted to 412 nearby users!"); setFlashActive(false); }, 2000); }} className="shrink-0 w-full md:w-auto bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-5 rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 z-10">
                      {flashActive ? <Timer className="animate-spin" size={20} /> : <BadgePercent size={20} />}
                      {flashActive ? "Broadcasting..." : "Alert Nearby Users"}
                    </button>
                  </div>
                  <div className={`${cardBase} overflow-hidden`}>
                    <table className="w-full text-left">
                      <thead className={darkMode ? "bg-white/[0.03]" : "bg-zinc-50"}><tr>{["Order ID","Items","Time","Total","Status"].map(h => <th key={h} className="p-5 font-semibold text-xs uppercase tracking-wider text-zinc-500">{h}</th>)}</tr></thead>
                      <tbody className={`divide-y ${darkMode ? "divide-white/[0.05]" : "divide-zinc-100"}`}>
                        {recentSales.map((sale, i) => (
                          <tr key={i} className={`transition-colors ${darkMode ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50"}`}>
                            <td className="p-5 font-bold text-violet-500">{sale.id}</td>
                            <td className="p-5 text-sm max-w-[200px] truncate font-medium">{sale.items}</td>
                            <td className={`p-5 text-sm ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>{sale.time}</td>
                            <td className="p-5 font-bold">{sale.total}</td>
                            <td className="p-5"><span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20"><CheckCircle2 size={14} /> {sale.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ══ MARKETING ══ */}
              {section === "marketing" && (
                <div className="space-y-6">
                  <h1 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-4xl font-bold tracking-tight mb-6">Marketing Tools</h1>
                  {[
                    { title: "Boost Search Ranking", desc: "Appear at the top of LocalLoop results and attract more customers nearby.", sub: "$3.99 / month", btn: "Activate Promotion", primary: true },
                    { title: "Automated WhatsApp Reminders", desc: "Auto-send UPI payment links to customers with pending Khata balances.", sub: null, btn: "Setup Reminders", primary: false },
                  ].map(({ title, desc, sub, btn, primary }) => (
                    <div key={title} className={`${cardBase} p-10 flex flex-col md:flex-row items-center justify-between gap-8`}>
                      <div>
                        <h2 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-2xl font-bold mb-3">{title}</h2>
                        <p className={`max-w-md text-lg leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>{desc}</p>
                        {sub && <p className="text-xl font-bold mt-4">{sub.split("/")[0]} <span className="text-sm font-medium text-zinc-500">/ {sub.split("/")[1]}</span></p>}
                      </div>
                      <button className={`shrink-0 w-full md:w-auto px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 ${primary ? "bg-zinc-900 text-white shadow-xl" : `border ${darkMode ? "border-white/[0.08] text-white hover:bg-white/[0.03]" : "border-zinc-300 text-zinc-900 bg-white hover:bg-zinc-50"}`}`}>{btn}</button>
                    </div>
                  ))}
                </div>
              )}

              {/* ══ INVENTORY ══ */}
              {section === "inventory" && (
                <div className="space-y-6">
                  <h1 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-4xl font-bold tracking-tight mb-6">Inventory & Ledger</h1>
                  <div className={`${cardBase} p-8 flex flex-col md:flex-row items-center gap-8`}>
                    <button onClick={handleVoiceLedger} className={`relative shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-transform hover:scale-105 ${isListening ? "bg-rose-500 shadow-rose-500/40" : "bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-violet-500/40"}`}>
                      {isListening && <div className="absolute inset-0 border-[4px] border-rose-500 rounded-full animate-ping opacity-50" />}
                      <Mic size={32} />
                    </button>
                    <div>
                      <h2 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-2xl font-bold mb-2">AI Voice Khata</h2>
                      {voiceInput ? <p className={`font-mono text-base ${isListening ? "text-rose-500 animate-pulse" : "text-emerald-500"}`}>"{voiceInput}"</p>
                        : <p className={`text-base leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>Tap mic and speak naturally.<br /><span className="italic">e.g., "Sold 1 rice bag to Ramesh for ₹1200"</span></p>}
                    </div>
                  </div>
                  <div className={`${cardBase} overflow-hidden`}>
                    <table className="w-full text-left">
                      <thead className={darkMode ? "bg-white/[0.03]" : "bg-zinc-50"}><tr>{["Product Name","Stock Level","Price"].map(h => <th key={h} className="p-5 font-semibold text-xs uppercase tracking-wider text-zinc-500">{h}</th>)}</tr></thead>
                      <tbody className={`divide-y ${darkMode ? "divide-white/[0.05]" : "divide-zinc-100"}`}>
                        {[{ name:"Rice Bag (25kg)",ok:false,stock:"Low: 15 left",price:"₹1200"},{name:"Cooking Oil (1L)",ok:true,stock:"Good: 20 left",price:"₹150"},{name:"Sugar (1kg)",ok:true,stock:"Good: 48 left",price:"₹50"}].map((row, i) => (
                          <tr key={i} className={`transition-colors ${darkMode ? "hover:bg-white/[0.02]" : "hover:bg-zinc-50"}`}>
                            <td className="p-5 font-bold">{row.name}</td>
                            <td className="p-5"><span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded-full border ${row.ok ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-rose-500 bg-rose-500/10 border-rose-500/20"}`}>{row.ok ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />} {row.stock}</span></td>
                            <td className="p-5 font-semibold">{row.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════
                  GST INVOICE
              ══════════════════════════════════ */}
              {section === "gst" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`p-3 rounded-2xl ${darkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}><FileText size={28} /></div>
                    <div>
                      <h1 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-4xl font-bold tracking-tight">GST Invoice</h1>
                      <p className={`text-sm mt-0.5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Generate & WhatsApp GST-compliant invoices in one tap</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Builder */}
                    <div className="space-y-4">
                      <div className={`${cardBase} p-6 space-y-4`}>
                        <p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Customer Details</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <label className={`text-xs font-semibold mb-1.5 block ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>Customer Name</label>
                            <input className={inputCls} value={invoiceCustomer.name} onChange={e => setInvoiceCustomer(p => ({ ...p, name: e.target.value }))} placeholder="Ravi Kumar" />
                          </div>
                          <div>
                            <label className={`text-xs font-semibold mb-1.5 block ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>Phone</label>
                            <input className={inputCls} value={invoiceCustomer.phone} onChange={e => setInvoiceCustomer(p => ({ ...p, phone: e.target.value }))} placeholder="9876543210" />
                          </div>
                          <div>
                            <label className={`text-xs font-semibold mb-1.5 block ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>GSTIN (optional)</label>
                            <input className={inputCls} value={invoiceCustomer.gstin} onChange={e => setInvoiceCustomer(p => ({ ...p, gstin: e.target.value }))} placeholder="29ABCDE1234F1Z5" />
                          </div>
                        </div>
                      </div>

                      <div className={`${cardBase} p-6`}>
                        <div className="flex items-center justify-between mb-4">
                          <p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Line Items</p>
                          <button onClick={addInvoiceItem} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${darkMode ? "bg-white/[0.05] hover:bg-white/[0.08] text-zinc-300" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"}`}><Plus size={13} /> Add Item</button>
                        </div>
                        <div className="space-y-3">
                          {invoiceItems.map((item, i) => (
                            <div key={i} className={`rounded-2xl border p-4 space-y-3 ${darkMode ? "border-white/[0.06] bg-white/[0.02]" : "border-zinc-100 bg-zinc-50/50"}`}>
                              <div className="flex gap-2">
                                <input className={`${inputCls} flex-1`} value={item.name} onChange={e => updateItem(i, "name", e.target.value)} placeholder="Item name" />
                                <button onClick={() => removeInvoiceItem(i)} className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${darkMode ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20" : "bg-rose-50 text-rose-500 hover:bg-rose-100"}`}><Trash2 size={14} /></button>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className={`text-xs font-semibold mb-1 block ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Qty</label>
                                  <input type="number" className={inputCls} value={item.qty} onChange={e => updateItem(i, "qty", Number(e.target.value))} min="1" />
                                </div>
                                <div>
                                  <label className={`text-xs font-semibold mb-1 block ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Price (₹)</label>
                                  <input type="number" className={inputCls} value={item.price} onChange={e => updateItem(i, "price", Number(e.target.value))} min="0" />
                                </div>
                                <div>
                                  <label className={`text-xs font-semibold mb-1 block ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>GST %</label>
                                  <select className={inputCls} value={item.gst} onChange={e => updateItem(i, "gst", Number(e.target.value))}>
                                    {[0,5,12,18,28].map(r => <option key={r} value={r}>{r}%</option>)}
                                  </select>
                                </div>
                              </div>
                              <p className={`text-xs font-bold text-right ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                ₹{(item.qty * item.price).toLocaleString("en-IN")} + ₹{Math.round(item.qty * item.price * item.gst / 100)} GST
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Invoice Preview */}
                    <div className="space-y-4">
                      <div className={`${cardBase} p-6`}>
                        <div className="flex items-center justify-between mb-5">
                          <p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Invoice Preview</p>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${darkMode ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>INV-{String(Math.floor(Date.now() / 1000)).slice(-5)}</span>
                        </div>

                        <div className={`rounded-2xl p-4 mb-4 ${darkMode ? "bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20" : "bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100"}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${darkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"}`}>AT</div>
                            <div>
                              <p className="font-bold text-sm">Sharma Groceries</p>
                              <p className={`text-xs ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>GSTIN: 36AABCA1234A1Z5 · +91 98765 43210</p>
                            </div>
                          </div>
                        </div>

                        <div className={`rounded-xl p-3 mb-4 ${darkMode ? "bg-white/[0.02] border border-white/[0.06]" : "bg-zinc-50 border border-zinc-100"}`}>
                          <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Bill To</p>
                          <p className="font-bold text-sm">{invoiceCustomer.name || "—"}</p>
                          <p className={`text-xs ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>{invoiceCustomer.phone}{invoiceCustomer.gstin ? ` · ${invoiceCustomer.gstin}` : ""}</p>
                        </div>

                        <div className="space-y-2 mb-4">
                          {invoiceItems.map((item, i) => item.name && (
                            <div key={i} className="flex justify-between items-center text-sm">
                              <span className={darkMode ? "text-zinc-300" : "text-zinc-700"}>{item.name} × {item.qty}</span>
                              <span className="font-semibold">₹{(item.qty * item.price).toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                        </div>

                        <div className={`border-t pt-3 space-y-1.5 ${darkMode ? "border-white/[0.06]" : "border-zinc-100"}`}>
                          <div className="flex justify-between text-sm"><span className={darkMode ? "text-zinc-400" : "text-zinc-500"}>Subtotal</span><span>₹{invoiceSubtotal.toLocaleString("en-IN")}</span></div>
                          <div className="flex justify-between text-sm"><span className={darkMode ? "text-zinc-400" : "text-zinc-500"}>GST</span><span>₹{Math.round(invoiceTax).toLocaleString("en-IN")}</span></div>
                          <div className={`flex justify-between font-black text-lg pt-2 border-t ${darkMode ? "border-white/[0.06]" : "border-zinc-100"}`}>
                            <span>Total</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">₹{Math.round(invoiceTotal).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                        <p className={`text-xs text-center mt-4 ${darkMode ? "text-zinc-600" : "text-zinc-400"}`}>{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => { setInvoiceSent(true); setTimeout(() => setInvoiceSent(false), 2500); alert(`✅ Invoice sent to ${invoiceCustomer.name} via WhatsApp!`); }}
                          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-500/20"
                        >
                          {invoiceSent ? <CheckCircle2 size={16} /> : <Send size={16} />}
                          {invoiceSent ? "Sent!" : "Send via WhatsApp"}
                        </button>
                        <button onClick={() => alert("📥 Invoice PDF downloaded!")} className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm border hover:scale-[1.02] transition-transform ${darkMode ? "border-white/[0.08] text-zinc-300 hover:bg-white/[0.04]" : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"}`}>
                          <Download size={16} /> Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════
                  LOYALTY CARDS
              ══════════════════════════════════ */}
              {section === "loyalty" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`p-3 rounded-2xl ${darkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"}`}><Star size={28} /></div>
                    <div>
                      <h1 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-4xl font-bold tracking-tight">Loyalty Cards</h1>
                      <p className={`text-sm mt-0.5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Digital stamp cards — no app needed, works via WhatsApp link</p>
                    </div>
                  </div>

                  {/* Program config */}
                  <div className={`${cardBase} p-7`}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-400/30">
                          <Gift size={28} className="text-white" />
                        </div>
                        <div>
                          <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-xl font-bold">Buy {stampTarget} Get 1 Free</p>
                          <p className={`text-sm mt-1 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>Reward: <span className="font-semibold">{loyaltyReward}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto">
                        <input className={`${inputCls} flex-1 md:w-52`} value={loyaltyReward} onChange={e => setLoyaltyReward(e.target.value)} placeholder="e.g. Free Milk Pack" />
                        <button className={`shrink-0 px-5 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 ${darkMode ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>Save</button>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Active members",   value: loyaltyCustomers.length, icon: Users, color: "violet" },
                      { label: "Ready to redeem",  value: loyaltyCustomers.filter(c => c.stamps >= stampTarget).length, icon: Gift, color: "amber" },
                      { label: "Total stamps",     value: loyaltyCustomers.reduce((s, c) => s + c.stamps, 0), icon: Star, color: "emerald" },
                    ].map(({ label, value, icon: Icon, color }) => {
                      const c = colorMap[color];
                      return (
                        <div key={label} className={`${cardBase} px-6 py-5 flex items-center gap-4`}>
                          <div className={`p-3 rounded-2xl shrink-0 ${c.bg} ${c.text}`}><Icon size={20} /></div>
                          <div>
                            <p style={{ fontFamily: "'Outfit', sans-serif" }} className="text-3xl font-bold">{value}</p>
                            <p className={`text-xs font-medium mt-0.5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>{label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Customer cards */}
                  <div className="space-y-3">
                    {loyaltyCustomers.map((customer, idx) => {
                      const TierIcon = TierIcons[customer.tier];
                      const isReady = customer.stamps >= stampTarget;
                      return (
                        <motion.div key={idx} layout className={`${cardBase} p-6`}>
                          <div className="flex items-start gap-5">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${darkMode ? "bg-white/[0.06] text-zinc-300" : "bg-zinc-100 text-zinc-600"}`}>
                              {customer.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-bold">{customer.name}</p>
                                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${tierStyle(customer.tier)}`}>
                                    <TierIcon size={11} /> {customer.tier}
                                  </span>
                                  {isReady && (
                                    <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                                      <Gift size={11} /> Reward ready!
                                    </motion.span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>{customer.stamps}/{stampTarget}</span>
                                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => addStamp(idx)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 ${
                                      isReady
                                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent shadow-lg shadow-amber-400/30"
                                        : darkMode ? "bg-white/[0.05] border-white/[0.10] text-zinc-300 hover:bg-white/[0.08]" : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                                    }`}>
                                    {isReady ? <><Gift size={13} /> Redeem</> : <><Plus size={13} /> Add Stamp</>}
                                  </motion.button>
                                  <button onClick={() => alert(`WhatsApp reminder sent to ${customer.name}!`)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:scale-105 ${darkMode ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
                                    <MessageSquare size={13} /> Remind
                                  </button>
                                </div>
                              </div>
                              <StampCard stamps={customer.stamps} total={stampTarget} darkMode={darkMode} />
                              <p className={`text-xs mt-2 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                {isReady ? `🎁 Eligible for: ${customer.reward}` : `${stampTarget - customer.stamps} more to earn: ${customer.reward}`}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => { const name = prompt("Customer name?"); const phone = prompt("Phone?"); if (name && phone) setLoyaltyCustomers(p => [...p, { name, phone, stamps: 0, reward: loyaltyReward, tier: "bronze" }]); }}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm border border-dashed transition-all hover:scale-[1.01] ${darkMode ? "border-white/[0.10] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.20]" : "border-zinc-300 text-zinc-400 hover:text-zinc-600 hover:border-zinc-400"}`}
                  >
                    <Plus size={16} /> Enrol New Customer
                  </button>
                </div>
              )}

              {/* ══════════════════════════════════
                  CASH SUMMARY
              ══════════════════════════════════ */}
              {section === "cashsummary" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`p-3 rounded-2xl ${darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}><Wallet size={28} /></div>
                    <div>
                      <h1 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-4xl font-bold tracking-tight">Daily Cash Summary</h1>
                      <p className={`text-sm mt-0.5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Auto-generates and WhatsApps your end-of-day report</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left: Breakdown */}
                    <div className="space-y-4">
                      <div className={`${cardBase} p-7`}>
                        <p className={`text-xs font-bold uppercase tracking-widest mb-5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Today's Breakdown</p>
                        <div className="space-y-2">
                          {[
                            { label: "Cash sales",           value: cashData.cash,    color: "text-emerald-500", sign: "+", bg: darkMode ? "bg-emerald-500/5" : "bg-emerald-50/50" },
                            { label: "UPI received",          value: cashData.upi,     color: "text-blue-500",    sign: "+", bg: darkMode ? "bg-blue-500/5"    : "bg-blue-50/50"    },
                            { label: "Credit given today",    value: cashData.credit,  color: "text-amber-500",   sign: "−", bg: darkMode ? "bg-amber-500/5"   : "bg-amber-50/50"   },
                            { label: "Expenses / restocking", value: cashData.restock, color: "text-rose-500",    sign: "−", bg: darkMode ? "bg-rose-500/5"    : "bg-rose-50/50"    },
                          ].map(({ label, value, color, sign, bg }) => (
                            <div key={label} className={`flex items-center justify-between py-3.5 px-4 rounded-2xl ${bg}`}>
                              <span className={`text-sm font-medium ${darkMode ? "text-zinc-300" : "text-zinc-700"}`}>{label}</span>
                              <span className={`font-bold text-base ${color}`}>{sign}₹{value.toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                        </div>

                        <div className={`mt-4 p-5 rounded-2xl border ${darkMode ? "bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border-emerald-500/20" : "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"}`}>
                          <div className="flex justify-between items-center">
                            <span className={`font-bold ${darkMode ? "text-emerald-300" : "text-emerald-800"}`}>Net Profit Today</span>
                            <span style={{ fontFamily: "'Outfit', sans-serif" }} className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">₹{netProfit.toLocaleString("en-IN")}</span>
                          </div>
                          <div className={`mt-3 h-2 rounded-full ${darkMode ? "bg-white/10" : "bg-emerald-200/50"}`}>
                            <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: `${profitPct}%` }} />
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className={`text-xs ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Expenses {100 - profitPct}%</span>
                            <span className={`text-xs font-semibold ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>Profit {profitPct}%</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-4">
                          {[
                            { label: "Orders",      value: String(cashData.orders) },
                            { label: "Avg order",   value: `₹${cashData.avgOrder}` },
                            { label: "vs yesterday",value: `+${cashData.vsYesterday}%`, green: true },
                          ].map(({ label, value, green }) => (
                            <div key={label} className={`rounded-2xl p-3 text-center ${darkMode ? "bg-white/[0.03]" : "bg-zinc-50"}`}>
                              <p style={{ fontFamily: "'Outfit', sans-serif" }} className={`text-xl font-bold ${green ? "text-emerald-500" : ""}`}>{value}</p>
                              <p className={`text-xs mt-0.5 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>{label}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Credit customers */}
                      <div className={`${cardBase} p-6`}>
                        <div className="flex items-center gap-2 mb-4"><AlertTriangle size={15} className="text-amber-500" /><p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Credit Customers</p></div>
                        <div className="space-y-2">
                          {cashData.creditCustomers.map(({ name, amount, days }) => (
                            <div key={name} className={`flex items-center justify-between px-4 py-3 rounded-xl ${darkMode ? "bg-white/[0.02]" : "bg-zinc-50"}`}>
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${darkMode ? "bg-white/[0.06] text-zinc-300" : "bg-zinc-200 text-zinc-600"}`}>{name[0]}</div>
                                <span className="text-sm font-semibold">{name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-amber-500">₹{amount}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${days >= 7 ? "text-rose-500 bg-rose-500/10" : "text-amber-500 bg-amber-500/10"}`}>Day {days}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: WhatsApp preview + settings */}
                    <div className="space-y-4">
                      <div className={`${cardBase} p-6`}>
                        <div className="flex items-center justify-between mb-4">
                          <p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>WhatsApp Preview</p>
                          <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${darkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" /> Sends at {summaryTime}
                          </span>
                        </div>

                        <div className={`rounded-2xl p-4 font-mono text-xs leading-relaxed border ${darkMode ? "bg-black/40 border-white/[0.06]" : "bg-zinc-50 border-zinc-200"}`}>
                          <div className={`inline-block rounded-2xl rounded-tl-sm px-4 py-3 w-full ${darkMode ? "bg-emerald-900/30 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-100"}`}>
                            <p className={`font-bold mb-2 text-sm ${darkMode ? "text-emerald-300" : "text-emerald-800"}`}>Sharma Groceries — Daily Report</p>
                            <p className={darkMode ? "text-zinc-400" : "text-zinc-500"}>📅 {new Date().toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short" })}</p>
                            <div className="mt-2 space-y-0.5">
                              <p><span className={darkMode ? "text-zinc-400" : "text-zinc-500"}>💵 Cash:    </span><span className="font-bold text-emerald-500">₹{cashData.cash.toLocaleString("en-IN")}</span></p>
                              <p><span className={darkMode ? "text-zinc-400" : "text-zinc-500"}>📲 UPI:     </span><span className="font-bold text-blue-500">₹{cashData.upi.toLocaleString("en-IN")}</span></p>
                              <p><span className={darkMode ? "text-zinc-400" : "text-zinc-500"}>🕐 Credit:  </span><span className="font-bold text-amber-500">₹{cashData.credit.toLocaleString("en-IN")}</span></p>
                              <p><span className={darkMode ? "text-zinc-400" : "text-zinc-500"}>🛒 Restock: </span><span className="font-bold text-rose-500">₹{cashData.restock.toLocaleString("en-IN")}</span></p>
                            </div>
                            <div className={`my-2 border-t ${darkMode ? "border-white/10" : "border-emerald-200"}`} />
                            <p><span className={darkMode ? "text-zinc-200" : "text-zinc-800"}>✅ Net profit: </span><span className="font-black text-emerald-500">₹{netProfit.toLocaleString("en-IN")}</span></p>
                            <p className="mt-1.5"><span className={darkMode ? "text-zinc-400" : "text-zinc-500"}>📦 {cashData.orders} orders · Avg ₹{cashData.avgOrder} · +{cashData.vsYesterday}% vs yesterday</span></p>
                          </div>
                          <p className={`text-right mt-1 text-[10px] ${darkMode ? "text-zinc-600" : "text-zinc-400"}`}>{summaryTime} ✓✓</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <button onClick={() => alert("Summary shared with family group!")} className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-500/20">
                            <Send size={15} /> Share with Family
                          </button>
                          <button onClick={() => alert("Sent to accountant!")} className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm border hover:scale-[1.02] transition-transform ${darkMode ? "border-white/[0.08] text-zinc-300 hover:bg-white/[0.04]" : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"}`}>
                            <Send size={15} /> Send to CA
                          </button>
                        </div>
                      </div>

                      <div className={`${cardBase} p-6 space-y-4`}>
                        <p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Auto-send Settings</p>
                        <div>
                          <label className={`text-xs font-semibold mb-1.5 block ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>Send time</label>
                          <input type="time" className={inputCls} value={summaryTime} onChange={e => setSummaryTime(e.target.value)} />
                        </div>
                        <div>
                          <label className={`text-xs font-semibold mb-1.5 block ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>WhatsApp number</label>
                          <input className={inputCls} value={summaryPhone} onChange={e => setSummaryPhone(e.target.value)} placeholder="9876543210" />
                        </div>
                        <button onClick={() => alert(`✅ Saved! Summary will auto-send daily at ${summaryTime}`)} className="w-full py-3.5 rounded-2xl font-bold text-sm bg-zinc-900 text-white hover:scale-[1.01] transition-transform">Save Settings</button>
                        <button onClick={() => alert("Monthly P&L PDF downloaded!")} className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm border transition-all hover:scale-[1.01] ${darkMode ? "border-white/[0.08] text-zinc-300 hover:bg-white/[0.04]" : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"}`}>
                          <Download size={15} /> Export Monthly P&L PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ PROFIT & MAPS ══ */}
              {(section === "profit" || section === "maps") && (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className={`p-5 rounded-3xl mb-6 border ${darkMode ? "bg-white/[0.05] border-white/10 text-zinc-500" : "bg-zinc-50 border-zinc-200 text-zinc-400 shadow-sm"}`}>
                    {section === "profit" ? <BarChart3 size={40} /> : <MapPin size={40} />}
                  </div>
                  <h2 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-3xl font-bold mb-4 tracking-tight">
                    {section === "profit" ? "Advanced Analytics" : "Google Maps Integration"}
                  </h2>
                  <p className={`max-w-md text-lg leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>This module is currently under development. Coming soon.</p>
                </div>
              )}

              {/* ══ AI ASSISTANT ══ */}
              {section === "ai" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-2xl text-white shadow-lg"><Bot size={28} /></div>
                    <h1 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-4xl font-bold tracking-tight">AI Marketing Assistant</h1>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                      {[
                        { type:"insta",   label:"Instagram Caption",  sub:"Engaging social media post",       color:"text-fuchsia-500" },
                        { type:"wa",      label:"WhatsApp Broadcast", sub:"Message for your loyal customers", color:"text-emerald-500" },
                        { type:"tagline", label:"Business Tagline",   sub:"Catchy slogan for your shop",      color:"text-violet-500"  },
                      ].map(({ type, label, sub, color }) => (
                        <button key={type} onClick={() => handleAIGenerate(type)} className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all hover:scale-[1.02] ${darkMode ? "bg-white/[0.02] border-white/[0.08] hover:border-violet-500/50" : "bg-white border-zinc-200 hover:border-violet-400 shadow-sm"}`}>
                          <div className="text-left"><h3 className="font-bold text-lg">{label}</h3><p className={`text-sm mt-1 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>{sub}</p></div>
                          <Sparkles className={color} size={24} />
                        </button>
                      ))}
                    </div>
                    <div className={`backdrop-blur-2xl border rounded-[2rem] p-8 min-h-[300px] flex flex-col ${darkMode ? "bg-black/50 border-white/[0.08]" : "bg-zinc-50 border-zinc-200"}`}>
                      <div className="flex items-center gap-2 mb-6 pb-6 border-b border-zinc-200/30">
                        {["bg-rose-500","bg-amber-500","bg-emerald-500"].map(c => <div key={c} className={`w-3.5 h-3.5 rounded-full ${c}`} />)}
                        <span className={`text-xs ml-3 font-mono tracking-widest uppercase ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}>Terminal_Output</span>
                      </div>
                      <div className={`flex-1 font-mono text-sm leading-relaxed ${aiOutput === "Generating..." ? "animate-pulse text-violet-500" : ""}`}>
                        {aiOutput ? <p>{aiOutput}</p> : <p className={`italic ${darkMode ? "text-zinc-600" : "text-zinc-400"}`}>&gt; Waiting for input...<br />&gt; Click an action on the left.</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;