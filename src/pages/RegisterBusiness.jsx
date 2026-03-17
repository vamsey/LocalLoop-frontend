import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Tag, FileText, Phone, Send, Sparkles, CheckCircle2, X } from "lucide-react";
import Navbar from "../components/Navbar"; // ADJUST THIS PATH IF NEEDED

function RegisterBusiness() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    phone: ""
  });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync theme with localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.style.backgroundColor = darkMode ? "#030303" : "#FAFAFA";
  }, [darkMode]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("https://localloop-backend-7317.onrender.com/api/business/register", form);

      // Clear form and show the beautiful success modal instead of an alert!
      setForm({ name: "", category: "", description: "", phone: "" });
      setShowSuccessModal(true);

      // Optional: Auto-close the modal after 4 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 4000);

    } catch (error) {
      console.error(error);
      alert("Error submitting business"); // You can replace this with an error modal later!
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-[#030303] text-white" : "bg-[#FAFAFA] text-zinc-900"
      }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      {/* ── FIXED BACKGROUNDS ── */}
      <div className={`fixed inset-0 -z-50 transition-colors duration-500 ${darkMode ? "bg-[#030303]" : "bg-[#FAFAFA]"}`} />

      {/* ── FIXED TECH GRID ── */}
      <div className={`fixed inset-0 -z-40 bg-[size:40px_40px] ${
        darkMode
          ? "bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"
          : "bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]"
        }`}
      />

      {/* ── CURSOR SPOTLIGHT & GLOWS ── */}
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
          className={`absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[160px] ${
            darkMode ? "bg-fuchsia-600 opacity-15" : "bg-fuchsia-300 opacity-20"
          }`}
        />
        <motion.div
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className={`absolute bottom-[-200px] right-1/4 w-[600px] h-[600px] rounded-full blur-[160px] ${
            darkMode ? "bg-cyan-600 opacity-15" : "bg-cyan-200 opacity-30"
          }`}
        />
      </div>

      {/* ── SHARED NAVBAR ── */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* ── PAGE CONTENT ── */}
      <div className="pt-16 pb-24 px-6 flex flex-col items-center relative z-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border backdrop-blur-md ${
            darkMode ? "bg-white/[0.03] border-white/[0.08] text-zinc-300" : "bg-zinc-900/5 border-zinc-200 text-zinc-700"
          }`}>
            <Sparkles size={14} className={darkMode ? "text-cyan-400" : "text-violet-600"} />
            Join the Network
          </span>

          <h1 style={{ fontFamily: "'Outfit', sans-serif" }} className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
            Register Your{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              Business.
            </span>
          </h1>

          <p className={`mt-4 text-lg max-w-xl mx-auto font-medium ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}>
            Add your shop or service to the local directory and start reaching more customers today. Takes less than 2 minutes.
          </p>
        </motion.div>

        {/* FORM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`w-full max-w-3xl backdrop-blur-2xl border rounded-[2rem] p-8 md:p-12 ${
            darkMode
              ? "bg-white/[0.02] border-white/[0.08] shadow-[0_0_60px_rgba(124,58,237,0.1)]"
              : "bg-white/80 border-zinc-200 shadow-2xl shadow-zinc-200/50"
          }`}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Top Row: Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Business Name */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-1 ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                  Business Name
                </label>
                <div className={`flex items-center rounded-2xl px-5 py-4 transition-all duration-300 border ${
                  darkMode
                    ? "bg-white/[0.02] border-white/[0.08] focus-within:border-violet-500/50 focus-within:bg-white/[0.05]"
                    : "bg-white border-zinc-200 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)] shadow-sm"
                }`}>
                  <Store size={20} className={darkMode ? "text-violet-400 shrink-0 mr-4" : "text-cyan-500 shrink-0 mr-4"} />
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Sharma Groceries"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full bg-transparent outline-none text-base font-medium ${darkMode ? "text-white placeholder-zinc-600" : "text-zinc-900 placeholder-zinc-400"}`}
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-1 ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                  Phone Number
                </label>
                <div className={`flex items-center rounded-2xl px-5 py-4 transition-all duration-300 border ${
                  darkMode
                    ? "bg-white/[0.02] border-white/[0.08] focus-within:border-violet-500/50 focus-within:bg-white/[0.05]"
                    : "bg-white border-zinc-200 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)] shadow-sm"
                }`}>
                  <Phone size={20} className={darkMode ? "text-violet-400 shrink-0 mr-4" : "text-cyan-500 shrink-0 mr-4"} />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full bg-transparent outline-none text-base font-medium ${darkMode ? "text-white placeholder-zinc-600" : "text-zinc-900 placeholder-zinc-400"}`}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-1 ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                Category
              </label>
              <div className={`flex items-center rounded-2xl px-5 py-4 transition-all duration-300 border ${
                darkMode
                  ? "bg-white/[0.02] border-white/[0.08] focus-within:border-violet-500/50 focus-within:bg-white/[0.05]"
                  : "bg-white border-zinc-200 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)] shadow-sm"
              }`}>
                <Tag size={20} className={darkMode ? "text-violet-400 shrink-0 mr-4" : "text-cyan-500 shrink-0 mr-4"} />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full bg-transparent outline-none text-base font-medium appearance-none cursor-pointer ${darkMode ? "text-white" : "text-zinc-900"} ${!form.category && (darkMode ? "text-zinc-600" : "text-zinc-400")}`}
                  required
                >
                  <option value="" disabled className={darkMode ? "bg-zinc-900 text-zinc-500" : "bg-white text-zinc-500"}>Select Category</option>
                  <option value="Food" className={darkMode ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"}>Food & Dining</option>
                  <option value="Grocery" className={darkMode ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"}>Grocery & Essentials</option>
                  <option value="Tailoring" className={darkMode ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"}>Tailoring & Boutique</option>
                  <option value="Services" className={darkMode ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"}>Home Services & Repair</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ml-1 ${darkMode ? "text-zinc-500" : "text-zinc-500"}`}>
                Business Description
              </label>
              <div className={`flex items-start rounded-2xl px-5 py-4 transition-all duration-300 border ${
                darkMode
                  ? "bg-white/[0.02] border-white/[0.08] focus-within:border-violet-500/50 focus-within:bg-white/[0.05]"
                  : "bg-white border-zinc-200 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)] shadow-sm"
              }`}>
                <FileText size={20} className={`shrink-0 mr-4 mt-0.5 ${darkMode ? "text-violet-400" : "text-cyan-500"}`} />
                <textarea
                  name="description"
                  placeholder="Tell customers what makes your business special..."
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full bg-transparent outline-none text-base font-medium resize-none ${darkMode ? "text-white placeholder-zinc-600" : "text-zinc-900 placeholder-zinc-400"}`}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-4 flex items-center justify-center gap-3 text-white font-bold text-lg py-5 rounded-2xl shadow-xl transition-all ${
                isSubmitting
                  ? "bg-zinc-600 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/50"
              }`}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send size={20} />
                  Submit Registration
                </>
              )}
            </motion.button>

          </form>
        </motion.div>
      </div>

      {/* ── SUCCESS MODAL OVERLAY ── */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Dark blur background */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
              onClick={() => setShowSuccessModal(false)}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-sm p-8 text-center rounded-[2rem] border shadow-2xl ${
                darkMode ? "bg-[#0a0a0c] border-white/[0.08]" : "bg-white border-zinc-200"
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  darkMode ? "hover:bg-white/10 text-zinc-500 hover:text-zinc-300" : "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <X size={20} />
              </button>

              {/* Success Icon */}
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-lg border ${
                darkMode ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-500"
              }`}>
                <CheckCircle2 size={40} strokeWidth={2} />
              </div>

              {/* Text */}
              <h2 style={{ fontFamily: "'Outfit', sans-serif" }} className={`text-2xl font-bold mb-3 ${darkMode ? "text-white" : "text-zinc-900"}`}>
                Successfully Registered!
              </h2>
              <p className={`text-base font-medium mb-8 leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                Your business has been submitted to our network and is currently pending admin approval.
              </p>

              {/* Action Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 rounded-xl font-bold bg-zinc-900 dark:bg-white dark:text-black text-white shadow-xl hover:scale-105 transition-transform duration-300"
              >
                Awesome
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default RegisterBusiness;