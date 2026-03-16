import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Check, X, Store, Activity, Sparkles, Clock, Trash2, TrendingUp, PieChart, Users, AlertCircle } from "lucide-react";
import Chart from 'chart.js/auto';
import Navbar from "../components/Navbar";
import { getBusinesses } from "../services/api";

const CATEGORIES = [
  { label: "Food", emoji: "🍱", color: "#FF6B6B" },
  { label: "Grocery", emoji: "🛒", color: "#4ECDC4" },
  { label: "Tailoring", emoji: "🧵", color: "#FFE66D" },
  { label: "Services", emoji: "🔧", color: "#95E1D3" },
];

function Admin() {
  const [pendingBusinesses, setPendingBusinesses] = useState([]);
  const [approvedBusinesses, setApprovedBusinesses] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const approvalChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const statusChartRef = useRef(null);
  const comparisonChartRef = useRef(null);

  const chartInstancesRef = useRef({});

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.style.backgroundColor = darkMode ? "#030303" : "#FAFAFA";
  }, [darkMode]);

  const fetchPending = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/pending");
      setPendingBusinesses(res.data || []);
    } catch (error) {}
  };

  const fetchApproved = async () => {
    try {
      const res = await getBusinesses();
      const data = Array.isArray(res.data) ? res.data : [];
      setApprovedBusinesses(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchPending();
    fetchApproved();
  }, []);

  // Initialize Charts
  useEffect(() => {
    const initCharts = () => {
      const textColor = darkMode ? "#a1a1a1" : "#666";
      const gridColor = darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

      // Destroy existing charts
      Object.values(chartInstancesRef.current).forEach(chart => {
        if (chart) chart.destroy();
      });

      // Approval Line Chart
      if (approvalChartRef.current) {
        const ctx = approvalChartRef.current.getContext('2d');
        chartInstancesRef.current.approval = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Approved',
                data: [12, 19, 15, 25, 22, 30],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
              },
              {
                label: 'Rejected',
                data: [2, 3, 2, 1, 2, 1],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: textColor },
                grid: { color: gridColor }
              },
              x: {
                ticks: { color: textColor },
                grid: { color: gridColor }
              }
            }
          }
        });
      }

      // Category Doughnut Chart
      if (categoryChartRef.current) {
        const ctx = categoryChartRef.current.getContext('2d');
        chartInstancesRef.current.category = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Food', 'Grocery', 'Services', 'Tailoring'],
            datasets: [{
              data: [65, 45, 89, 48],
              backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
              borderColor: darkMode ? '#1f2937' : '#fff',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: { color: textColor, padding: 15, boxWidth: 10, font: { size: 12 } }
              }
            }
          }
        });
      }

      // Status Bar Chart
      if (statusChartRef.current) {
        const ctx = statusChartRef.current.getContext('2d');
        chartInstancesRef.current.status = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Pending',
                data: [5, 3, 8, 2, 4, 6],
                backgroundColor: '#fbbf24',
                borderRadius: 4,
                borderSkipped: false
              },
              {
                label: 'Active',
                data: [12, 19, 15, 25, 22, 30],
                backgroundColor: '#10b981',
                borderRadius: 4,
                borderSkipped: false
              },
              {
                label: 'Suspended',
                data: [1, 0, 1, 0, 2, 1],
                backgroundColor: '#ef4444',
                borderRadius: 4,
                borderSkipped: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: { color: textColor, padding: 15, boxWidth: 10, font: { size: 12 } }
              }
            },
            scales: {
              x: {
                stacked: false,
                ticks: { color: textColor },
                grid: { color: gridColor }
              },
              y: {
                stacked: false,
                ticks: { color: textColor },
                grid: { color: gridColor }
              }
            }
          }
        });
      }

      // Comparison Bar Chart
      if (comparisonChartRef.current) {
        const ctx = comparisonChartRef.current.getContext('2d');
        chartInstancesRef.current.comparison = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            datasets: [
              {
                label: 'Registered',
                data: [8, 12, 10, 15, 18],
                backgroundColor: '#3b82f6',
                borderRadius: 4,
                borderSkipped: false
              },
              {
                label: 'Approved',
                data: [7, 10, 10, 13, 16],
                backgroundColor: '#10b981',
                borderRadius: 4,
                borderSkipped: false
              },
              {
                label: 'Rejected',
                data: [1, 1, 0, 1, 1],
                backgroundColor: '#ef4444',
                borderRadius: 4,
                borderSkipped: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: { color: textColor, padding: 15, boxWidth: 10, font: { size: 12 } }
              }
            },
            scales: {
              x: {
                stacked: false,
                ticks: { color: textColor },
                grid: { color: gridColor }
              },
              y: {
                stacked: false,
                ticks: { color: textColor },
                grid: { color: gridColor }
              }
            }
          }
        });
      }
    };

    initCharts();

    return () => {
      Object.values(chartInstancesRef.current).forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [darkMode]);

  const approveBusiness = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/approve/${id}`);
      fetchPending();
      fetchApproved();
      setActiveTab("approved");
    } catch (error) {
      alert("Error approving business");
    }
  };

  const rejectBusiness = (id) => {
    setPendingBusinesses(prev => prev.filter(b => b.id !== id));
  };

  const deleteBusiness = async (id) => {
    if(!window.confirm("Permanently delete this business?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/business/${id}`);
      fetchApproved();
    } catch (error) {
      setApprovedBusinesses(prev => prev.filter(b => b.id !== id));
    }
  };

  const currentList = activeTab === "pending" ? pendingBusinesses : approvedBusinesses;

  const stats = [
    { title: "Total Businesses", value: approvedBusinesses.length, icon: Store, color: "cyan", subtext: "+12 this month" },
    { title: "Pending Review", value: pendingBusinesses.length, icon: Clock, color: "violet", subtext: "Requires action" },
    { title: "Approval Rate", value: "94.3%", icon: TrendingUp, color: "emerald", subtext: "Healthy" },
    { title: "Avg Response Time", value: "2.4h", icon: Activity, color: "orange", subtext: "Very fast" },
  ];

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"
      }`}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
        {darkMode && (
          <div className="absolute w-[800px] h-[800px] rounded-full blur-[180px] opacity-25" style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.8) 0%, transparent 70%)",
            left: mousePos.x - 400,
            top: mousePos.y - 400,
          }} />
        )}
        <motion.div animate={{ y: [0, 60, 0] }} transition={{ duration: 12, repeat: Infinity }}
          className={`absolute -top-60 left-1/4 w-[700px] h-[700px] rounded-full blur-[180px] ${
            darkMode ? "bg-fuchsia-600 opacity-20" : "bg-fuchsia-300 opacity-25"
          }`} />
        <motion.div animate={{ y: [0, -60, 0] }} transition={{ duration: 14, repeat: Infinity }}
          className={`absolute bottom-[-300px] right-1/4 w-[700px] h-[700px] rounded-full blur-[180px] ${
            darkMode ? "bg-cyan-600 opacity-20" : "bg-cyan-200 opacity-35"
          }`} />
      </div>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="max-w-7xl mx-auto pt-20 pb-32 px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-16">
          <motion.div whileHover={{ scale: 1.05 }} className={`p-4 rounded-2xl border backdrop-blur-xl ${
            darkMode ? "bg-white/[0.08] border-white/20 text-violet-400" : "bg-white/60 border-white shadow-lg text-violet-600"
          }`}>
            <ShieldCheck size={36} />
          </motion.div>
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Command Center</h1>
            <p className={`text-base mt-2 ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>Real-time analytics & business management</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, idx) => (
            <motion.div key={idx} whileHover={{ y: -8 }} className={`backdrop-blur-xl border rounded-[1.5rem] p-6 transition-all ${
              darkMode ? "bg-white/[0.05] border-white/10 hover:border-white/20" : "bg-white/40 border-white/50 hover:bg-white/60"
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>{stat.title}</p>
                  <p className="text-4xl font-bold mt-3">{stat.value}</p>
                  <p className={`text-xs mt-2 ${darkMode ? "text-zinc-500" : "text-zinc-600"}`}>{stat.subtext}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color === 'cyan' ? 'bg-cyan-500/20' : stat.color === 'violet' ? 'bg-violet-500/20' : stat.color === 'emerald' ? 'bg-emerald-500/20' : 'bg-orange-500/20'}`}>
                  <stat.icon size={24} className={`${stat.color === 'cyan' ? 'text-cyan-500' : stat.color === 'violet' ? 'text-violet-500' : stat.color === 'emerald' ? 'text-emerald-500' : 'text-orange-500'}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Approval Line Chart */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`backdrop-blur-xl border rounded-[1.5rem] p-6 ${
            darkMode ? "bg-white/[0.05] border-white/10" : "bg-white/40 border-white/50"
          }`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={20} /> Approvals over time
            </h3>
            <div style={{ position: 'relative', width: '100%', height: '300px' }}>
              <canvas ref={approvalChartRef}></canvas>
            </div>
          </motion.div>

          {/* Category Doughnut Chart */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className={`backdrop-blur-xl border rounded-[1.5rem] p-6 ${
            darkMode ? "bg-white/[0.05] border-white/10" : "bg-white/40 border-white/50"
          }`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <PieChart size={20} /> Businesses by category
            </h3>
            <div style={{ position: 'relative', width: '100%', height: '300px' }}>
              <canvas ref={categoryChartRef}></canvas>
            </div>
          </motion.div>
        </div>

        {/* Status Bar Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className={`backdrop-blur-xl border rounded-[1.5rem] p-6 mb-6 ${
          darkMode ? "bg-white/[0.05] border-white/10" : "bg-white/40 border-white/50"
        }`}>
          <h3 className="text-lg font-bold mb-4">Business registration status</h3>
          <div style={{ position: 'relative', width: '100%', height: '280px' }}>
            <canvas ref={statusChartRef}></canvas>
          </div>
        </motion.div>

        {/* List Header */}
        <div className="mb-8 flex items-center justify-between border-b pb-4 border-white/10">
          <h2 className="text-2xl font-bold">{activeTab === "pending" ? "⏳ Action Required" : "📂 Manage Directory"}</h2>
          <motion.span
            layoutId="tabBadge"
            className="px-4 py-2 rounded-full font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600"
          >
            {currentList.length}
          </motion.span>
        </div>

        {/* Businesses List */}
        <div className="space-y-4">
          <AnimatePresence>
            {currentList.length > 0 ? (
              currentList.map((b) => (
                <motion.div key={b.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  className={`backdrop-blur-xl border rounded-[1.5rem] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                    darkMode ? "bg-white/[0.05] border-white/10 hover:border-white/20" : "bg-white/50 border-white/50 hover:border-white hover:shadow-lg"
                  }`}>
                  <div className="flex items-start gap-5 flex-1">
                    <div className={`w-16 h-16 rounded-[1.2rem] flex items-center justify-center text-3xl border ${
                      darkMode ? "bg-white/[0.1] border-white/20" : "bg-white/60 border-white"
                    }`}>{CATEGORIES.find(c => c.label === b.category)?.emoji || "🏪"}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{b.name}</h3>
                      <span className={`inline-block text-[10px] uppercase font-bold px-3 py-1 rounded-full border mt-2 ${
                        darkMode ? "bg-white/[0.1] border-white/20" : "bg-white/60 border-white"
                      }`}>{b.category}</span>
                      <p className={`text-sm mt-3 line-clamp-2 ${darkMode ? "text-zinc-400" : "text-zinc-700"}`}>{b.description}</p>
                      <p className={`text-sm mt-2 ${darkMode ? "text-zinc-500" : "text-zinc-600"}`}>📞 {b.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {activeTab === "pending" ? (
                      <>
                        <motion.button whileHover={{ scale: 1.05 }} onClick={() => rejectBusiness(b.id)} className={`px-5 py-2.5 rounded-xl font-bold text-sm border ${
                          darkMode ? "border-white/20 text-red-400 hover:bg-red-500/20" : "border-red-300 text-red-600 bg-red-50 hover:bg-red-100"
                        }`}><X className="inline mr-2" size={16} /> Reject</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} onClick={() => approveBusiness(b.id)} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl"><Check className="inline mr-2" size={16} /> Approve</motion.button>
                      </>
                    ) : (
                      <motion.button whileHover={{ scale: 1.05 }} onClick={() => deleteBusiness(b.id)} className={`px-5 py-2.5 rounded-xl font-bold text-sm border ${
                        darkMode ? "border-white/20 text-red-400 hover:bg-red-500/20" : "border-red-300 text-red-600 bg-red-50 hover:bg-red-100"
                      }`}><Trash2 className="inline mr-2" size={16} /> Delete</motion.button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex flex-col items-center justify-center py-32 rounded-[2rem] border-2 border-dashed ${
                darkMode ? "bg-white/[0.02] border-white/20" : "bg-white/30 border-white/60"
              }`}>
                <Sparkles size={48} className="mb-4" />
                <h3 className="text-3xl font-bold mb-2">{activeTab === "pending" ? "You're all caught up! 🎉" : "No businesses yet 📭"}</h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Admin;