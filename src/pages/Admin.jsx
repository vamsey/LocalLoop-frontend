import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Check, X, Store, Activity, Clock, TrendingUp,
  PieChart, Trash2, ChevronRight, ArrowUpRight, ArrowDownRight,
  LayoutDashboard, Users, AlertTriangle, CheckCircle2, Hourglass,
  Building2, Zap, Filter, Search, MoreHorizontal, Eye,
  RefreshCw, BarChart3,
} from "lucide-react";
import Chart from "chart.js/auto";
import Navbar from "../components/Navbar";
import { getBusinesses } from "../services/api";

const CATEGORIES = [
  { label: "Food",      emoji: "🍱", color: "#f97316" },
  { label: "Grocery",   emoji: "🛒", color: "#06b6d4" },
  { label: "Tailoring", emoji: "🧵", color: "#8b5cf6" },
  { label: "Services",  emoji: "🔧", color: "#10b981" },
];

// ── Thin sparkline used inside stat cards ──
function Spark({ data, color = "#8b5cf6", h = 40 }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const w = 120;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 6) - 3}`).join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${color.replace("#","")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Category pill ──
function CategoryPill({ label, darkMode }) {
  const cat = CATEGORIES.find(c => c.label === label);
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
      style={{ background: `${cat?.color || "#888"}18`, color: cat?.color || "#888" }}
    >
      {cat?.emoji} {label}
    </span>
  );
}

export default function Admin() {
  const [pendingBusinesses, setPendingBusinesses]   = useState([]);
  const [approvedBusinesses, setApprovedBusinesses] = useState([]);
  const [activeTab,   setActiveTab]   = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [mousePos,    setMousePos]    = useState({ x: 0, y: 0 });

  const approvalChartRef    = useRef(null);
  const categoryChartRef    = useRef(null);
  const statusChartRef      = useRef(null);
  const comparisonChartRef  = useRef(null);
  const chartInstancesRef   = useRef({});

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.style.backgroundColor = darkMode ? "#030303" : "#FAFAFA";
  }, [darkMode]);

  /* ── API ── */
  const fetchPending  = async () => {
    try { const r = await axios.get("http://localhost:8080/api/admin/pending"); setPendingBusinesses(r.data || []); } catch {}
  };
  const fetchApproved = async () => {
    try { const r = await getBusinesses(); setApprovedBusinesses(Array.isArray(r.data) ? r.data : []); } catch {}
  };

  useEffect(() => { fetchPending(); fetchApproved(); }, []);

  const approveBusiness = async (id) => {
    try { await axios.put(`http://localhost:8080/api/admin/approve/${id}`); fetchPending(); fetchApproved(); setActiveTab("approved"); }
    catch { alert("Error approving business"); }
  };
  const rejectBusiness  = (id) => setPendingBusinesses(p => p.filter(b => b.id !== id));
  const deleteBusiness  = async (id) => {
    if (!window.confirm("Permanently delete this business?")) return;
    try { await axios.delete(`http://localhost:8080/api/admin/business/${id}`); fetchApproved(); }
    catch { setApprovedBusinesses(p => p.filter(b => b.id !== id)); }
  };

  /* ── Charts ── */
  useEffect(() => {
    const text  = darkMode ? "#71717a" : "#a1a1aa";
    const grid  = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";

    Object.values(chartInstancesRef.current).forEach(c => c?.destroy());
    chartInstancesRef.current = {};

    const base = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
    };

    // Approval trend
    if (approvalChartRef.current) {
      chartInstancesRef.current.approval = new Chart(approvalChartRef.current, {
        type: "line",
        data: {
          labels: ["Jan","Feb","Mar","Apr","May","Jun"],
          datasets: [
            { label:"Approved", data:[12,19,15,25,22,30], borderColor:"#10b981", backgroundColor:"rgba(16,185,129,0.07)", borderWidth:2.5, fill:true, tension:0.4, pointRadius:4, pointHoverRadius:6, pointBackgroundColor:"#10b981", pointBorderColor: darkMode?"#030303":"#fff", pointBorderWidth:2 },
            { label:"Rejected", data:[2,3,2,1,2,1],       borderColor:"#ef4444", backgroundColor:"rgba(239,68,68,0.06)",   borderWidth:2,   fill:true, tension:0.4, pointRadius:3, pointHoverRadius:5, pointBackgroundColor:"#ef4444", pointBorderColor: darkMode?"#030303":"#fff", pointBorderWidth:2 },
          ],
        },
        options: { ...base, scales: { y:{ beginAtZero:true, ticks:{color:text}, grid:{color:grid}, border:{dash:[4,4]} }, x:{ ticks:{color:text}, grid:{color:grid}, border:{dash:[4,4]} } } },
      });
    }

    // Category donut
    if (categoryChartRef.current) {
      chartInstancesRef.current.category = new Chart(categoryChartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Food","Grocery","Services","Tailoring"],
          datasets: [{ data:[65,45,89,48], backgroundColor:["#f97316","#06b6d4","#10b981","#8b5cf6"], borderColor: darkMode?"#0a0a0a":"#fff", borderWidth:3, hoverOffset:6 }],
        },
        options: { ...base, cutout:"72%", plugins:{ legend:{ display:true, position:"bottom", labels:{ color:text, padding:16, boxWidth:10, font:{size:11, weight:"600"} } } } },
      });
    }

    // Status bar
    if (statusChartRef.current) {
      chartInstancesRef.current.status = new Chart(statusChartRef.current, {
        type:"bar",
        data:{
          labels:["Jan","Feb","Mar","Apr","May","Jun"],
          datasets:[
            { label:"Pending", data:[5,3,8,2,4,6], backgroundColor:"#f59e0b", borderRadius:6, borderSkipped:false },
            { label:"Active",  data:[12,19,15,25,22,30], backgroundColor:"#10b981", borderRadius:6, borderSkipped:false },
            { label:"Suspended", data:[1,0,1,0,2,1], backgroundColor:"#ef4444", borderRadius:6, borderSkipped:false },
          ],
        },
        options:{ ...base, plugins:{ legend:{ display:true, position:"bottom", labels:{ color:text, padding:16, boxWidth:10, font:{size:11,weight:"600"} } } }, scales:{ x:{ ticks:{color:text}, grid:{color:grid} }, y:{ ticks:{color:text}, grid:{color:grid}, border:{dash:[4,4]} } } },
      });
    }

    // Registration comparison
    if (comparisonChartRef.current) {
      chartInstancesRef.current.comparison = new Chart(comparisonChartRef.current, {
        type:"bar",
        data:{
          labels:["Wk 1","Wk 2","Wk 3","Wk 4","Wk 5"],
          datasets:[
            { label:"Registered", data:[8,12,10,15,18], backgroundColor:"#6366f1", borderRadius:6, borderSkipped:false },
            { label:"Approved",   data:[7,10,10,13,16], backgroundColor:"#10b981", borderRadius:6, borderSkipped:false },
            { label:"Rejected",   data:[1,1,0,1,1],     backgroundColor:"#ef4444", borderRadius:6, borderSkipped:false },
          ],
        },
        options:{ ...base, plugins:{ legend:{ display:true, position:"bottom", labels:{ color:text, padding:16, boxWidth:10, font:{size:11,weight:"600"} } } }, scales:{ x:{ ticks:{color:text}, grid:{color:grid} }, y:{ ticks:{color:text}, grid:{color:grid}, border:{dash:[4,4]} } } },
      });
    }

    return () => Object.values(chartInstancesRef.current).forEach(c => c?.destroy());
  }, [darkMode]);

  /* ── Derived data ── */
  const currentList = (activeTab === "pending" ? pendingBusinesses : approvedBusinesses)
    .filter(b => !searchQuery || b.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const stats = [
    { label:"Total Approved", value: approvedBusinesses.length, delta:"+12", up:true,  spark:[20,24,18,28,22,30,26], color:"#10b981", icon: Building2 },
    { label:"Pending Review", value: pendingBusinesses.length,  delta: pendingBusinesses.length > 0 ? "Needs action" : "All clear", up: pendingBusinesses.length === 0, spark:[5,3,8,2,4,6,pendingBusinesses.length], color:"#f59e0b", icon: Hourglass },
    { label:"Approval Rate",  value:"94.3%",   delta:"+2.1%", up:true,  spark:[88,90,91,92,93,94,94], color:"#6366f1", icon: TrendingUp },
    { label:"Avg Response",   value:"2.4h",    delta:"−0.3h", up:true,  spark:[3,2.8,3.1,2.7,2.5,2.4,2.4], color:"#06b6d4", icon: Clock },
  ];

  /* ── Styles ── */
  const dm = darkMode;
  const cardBase = `backdrop-blur-2xl border rounded-[2rem] transition-all duration-300 ${dm ? "bg-white/[0.02] border-white/[0.08]" : "bg-white border-zinc-200 shadow-sm"}`;
  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none focus:ring-2 ${dm ? "bg-white/[0.04] border-white/[0.08] text-white placeholder-zinc-600 focus:ring-violet-500/30" : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:ring-violet-300"}`;

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${dm ? "bg-[#030303] text-white" : "bg-[#FAFAFA] text-zinc-900"}`}
      style={{ fontFamily: "'Inter', sans-serif" }}
      onMouseMove={e => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      {/* ── Backgrounds ── */}
      <div className={`fixed inset-0 -z-50 ${dm ? "bg-[#030303]" : "bg-[#FAFAFA]"}`} />
      <div className={`fixed inset-0 -z-40 bg-[size:40px_40px] ${dm ? "bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" : "bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]"}`} />
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
        {dm && <div className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-20" style={{ background:"radial-gradient(circle, rgba(124,58,237,0.8) 0%, transparent 70%)", left: mousePos.x-300, top: mousePos.y-300 }} />}
        <motion.div animate={{ y:[0,40,0] }} transition={{ duration:10, repeat:Infinity }} className={`absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px] ${dm?"bg-fuchsia-600 opacity-15":"bg-fuchsia-300 opacity-20"}`} />
        <motion.div animate={{ y:[0,-40,0] }} transition={{ duration:12, repeat:Infinity }} className={`absolute bottom-[-200px] right-1/4 w-[600px] h-[600px] rounded-full blur-[160px] ${dm?"bg-cyan-600 opacity-15":"bg-cyan-200 opacity-30"}`} />
      </div>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="max-w-7xl mx-auto pt-10 pb-32 px-6">

        {/* ── Page header ── */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2.5 rounded-2xl border ${dm?"bg-violet-500/10 border-violet-500/20 text-violet-400":"bg-violet-50 border-violet-100 text-violet-600"}`}>
                <ShieldCheck size={22} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${dm?"text-zinc-500":"text-zinc-400"}`}>Admin</span>
            </div>
            <h1 style={{ fontFamily:"'Outfit', sans-serif" }} className="text-5xl font-black tracking-tight leading-none">Command Center</h1>
            <p className={`mt-2 text-sm font-medium ${dm?"text-zinc-500":"text-zinc-400"}`}>Real-time analytics & business management</p>
          </div>
          <button
            onClick={() => { fetchPending(); fetchApproved(); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold border transition-all hover:scale-105 ${dm?"border-white/[0.08] text-zinc-400 hover:bg-white/[0.04] hover:text-white":"border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </motion.div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map(({ label, value, delta, up, spark, color, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}
              className={`${cardBase} p-6 overflow-hidden relative group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl border shrink-0`} style={{ background:`${color}14`, borderColor:`${color}25` }}>
                  <Icon size={17} style={{ color }} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${up ? "text-emerald-500 bg-emerald-500/10":"text-rose-500 bg-rose-500/10"}`}>
                  {up ? <ArrowUpRight size={11}/> : <ArrowDownRight size={11}/>}{delta}
                </span>
              </div>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${dm?"text-zinc-500":"text-zinc-400"}`}>{label}</p>
              <p style={{ fontFamily:"'Outfit', sans-serif" }} className="text-3xl font-bold">{value}</p>
              <div className="mt-3 opacity-60 group-hover:opacity-90 transition-opacity">
                <Spark data={spark} color={color} h={36} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Charts 2-col ── */}
        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          {/* Approval trend */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} className={`${cardBase} p-7`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${dm?"text-zinc-500":"text-zinc-400"}`}>Approval trend</p>
                <p style={{ fontFamily:"'Outfit', sans-serif" }} className="text-xl font-bold">6-Month Overview</p>
              </div>
              <div className="flex gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />Approved</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />Rejected</span>
              </div>
            </div>
            <div className="relative h-[240px]"><canvas ref={approvalChartRef} /></div>
          </motion.div>

          {/* Category donut */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }} className={`${cardBase} p-7`}>
            <div className="mb-6">
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${dm?"text-zinc-500":"text-zinc-400"}`}>By category</p>
              <p style={{ fontFamily:"'Outfit', sans-serif" }} className="text-xl font-bold">Business Mix</p>
            </div>
            <div className="relative h-[240px]"><canvas ref={categoryChartRef} /></div>
          </motion.div>
        </div>

        {/* ── Charts 2-col (bottom) ── */}
        <div className="grid lg:grid-cols-2 gap-5 mb-8">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }} className={`${cardBase} p-7`}>
            <div className="mb-6">
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${dm?"text-zinc-500":"text-zinc-400"}`}>Status breakdown</p>
              <p style={{ fontFamily:"'Outfit', sans-serif" }} className="text-xl font-bold">Monthly Status</p>
            </div>
            <div className="relative h-[220px]"><canvas ref={statusChartRef} /></div>
          </motion.div>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }} className={`${cardBase} p-7`}>
            <div className="mb-6">
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${dm?"text-zinc-500":"text-zinc-400"}`}>Weekly funnel</p>
              <p style={{ fontFamily:"'Outfit', sans-serif" }} className="text-xl font-bold">Registered vs Approved</p>
            </div>
            <div className="relative h-[220px]"><canvas ref={comparisonChartRef} /></div>
          </motion.div>
        </div>

        {/* ── Directory section ── */}
        <div className={`${cardBase} overflow-hidden`}>
          {/* Toolbar */}
          <div className={`px-7 py-5 border-b ${dm?"border-white/[0.06]":"border-zinc-100"}`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-1">
                {[
                  { id:"pending",  label:"Pending",  count: pendingBusinesses.length,  dot:"bg-amber-500"  },
                  { id:"approved", label:"Approved", count: approvedBusinesses.length, dot:"bg-emerald-500"},
                ].map(({ id, label, count, dot }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      activeTab === id
                        ? dm ? "bg-white/[0.08] text-white" : "bg-zinc-900 text-white"
                        : dm ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                    {label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      activeTab === id
                        ? dm ? "bg-white/[0.12] text-zinc-300" : "bg-white/20 text-zinc-200"
                        : dm ? "bg-white/[0.05] text-zinc-600" : "bg-zinc-100 text-zinc-500"
                    }`}>{count}</span>
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <Search size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dm?"text-zinc-500":"text-zinc-400"}`} />
                <input
                  className={`${inputCls} pl-9`}
                  placeholder="Search businesses…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* List */}
          <div className={`divide-y ${dm?"divide-white/[0.04]":"divide-zinc-100"}`}>
            <AnimatePresence mode="popLayout">
              {currentList.length > 0 ? currentList.map((b, i) => (
                <motion.div
                  key={b.id}
                  layout
                  initial={{ opacity:0, y:10 }}
                  animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, x:-20, scale:0.97 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex flex-col md:flex-row md:items-center justify-between gap-5 px-7 py-5 transition-colors ${dm?"hover:bg-white/[0.02]":"hover:bg-zinc-50/80"}`}
                >
                  {/* Left: identity */}
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${dm?"bg-white/[0.04] border-white/[0.06]":"bg-zinc-50 border-zinc-100"}`}>
                      {CATEGORIES.find(c => c.label === b.category)?.emoji || "🏪"}
                    </div>
                    {/* Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap mb-1">
                        <p className="font-bold text-[15px] truncate">{b.name}</p>
                        {b.category && <CategoryPill label={b.category} darkMode={dm} />}
                        {activeTab === "approved" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-500 bg-emerald-500/10">
                            <CheckCircle2 size={10} /> Live
                          </span>
                        )}
                        {activeTab === "pending" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-amber-500 bg-amber-500/10">
                            <Hourglass size={10} /> Awaiting
                          </span>
                        )}
                      </div>
                      <p className={`text-sm truncate max-w-md ${dm?"text-zinc-500":"text-zinc-500"}`}>{b.description || "No description provided"}</p>
                      <p className={`text-xs mt-1 font-medium ${dm?"text-zinc-600":"text-zinc-400"}`}>📞 {b.phone}</p>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    {activeTab === "pending" ? (
                      <>
                        <button
                          onClick={() => rejectBusiness(b.id)}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all hover:scale-105 ${dm?"border-white/[0.08] text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/5":"border-zinc-200 text-zinc-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50"}`}
                        >
                          <X size={15} /> Reject
                        </button>
                        <button
                          onClick={() => approveBusiness(b.id)}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
                        >
                          <Check size={15} /> Approve
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => deleteBusiness(b.id)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all hover:scale-105 ${dm?"border-white/[0.08] text-zinc-500 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/5":"border-zinc-200 text-zinc-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50"}`}
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              )) : (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex flex-col items-center justify-center py-24">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-5 border ${dm?"bg-white/[0.03] border-white/[0.06]":"bg-zinc-50 border-zinc-100"}`}>
                    {activeTab === "pending" ? <CheckCircle2 size={28} className="text-emerald-500" /> : <Building2 size={28} className={dm?"text-zinc-600":"text-zinc-400"} />}
                  </div>
                  <p style={{ fontFamily:"'Outfit', sans-serif" }} className="text-2xl font-bold mb-2">
                    {activeTab === "pending" ? "All caught up" : "No businesses yet"}
                  </p>
                  <p className={`text-sm ${dm?"text-zinc-600":"text-zinc-400"}`}>
                    {activeTab === "pending" ? "No pending submissions at the moment." : "Approved businesses will appear here."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer count */}
          {currentList.length > 0 && (
            <div className={`px-7 py-4 border-t ${dm?"border-white/[0.06]":"border-zinc-100"}`}>
              <p className={`text-xs font-semibold ${dm?"text-zinc-600":"text-zinc-400"}`}>
                Showing {currentList.length} {activeTab === "pending" ? "pending" : "approved"} {currentList.length === 1 ? "business" : "businesses"}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}