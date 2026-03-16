import { Link, useLocation } from "react-router-dom";
import { Infinity, Sun, Moon } from "lucide-react";

function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Premium active state styling: bright for active, dimmed for inactive
  const getLinkClass = (path) => {
    const isActive = currentPath === path;
    return `transition-colors duration-300 text-sm font-medium ${
      isActive
        ? darkMode ? "text-zinc-100" : "text-zinc-900"
        : darkMode ? "text-zinc-500 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-900"
    }`;
  };

  return (
    <nav className={`sticky top-0 z-50 flex justify-between items-center px-10 py-4 backdrop-blur-2xl border-b transition-colors duration-500 ${
      darkMode ? "bg-[#030303]/70 border-white/[0.08]" : "bg-[#FAFAFA]/70 border-zinc-200"
    }`}
    style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── LOGO (Outfit Font + Aurora Gradient) ── */}
      <Link to="/" className="flex items-center gap-2">
        <Infinity className={darkMode ? "text-cyan-400" : "text-violet-600"} size={28} strokeWidth={2.5} />
        <span
          style={{ fontFamily: "'Outfit', sans-serif" }}
          className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent"
        >
          LocalLoop
        </span>
      </Link>

      <div className="flex items-center gap-8">

        {/* ── DESKTOP LINKS ── */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={getLinkClass("/")}>Home</Link>
          <Link to="/explore" className={getLinkClass("/explore")}>Explore</Link>
          <Link to="/register" className={getLinkClass("/register")}>Register</Link>
          <Link to="/admin" className={getLinkClass("/admin")}>Admin</Link>
          <Link to="/dashboard" className={getLinkClass("/dashboard")}>Dashboard</Link>
        </div>

        {/* ── THEME TOGGLE (Sleek Glass Button) ── */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2.5 rounded-xl border backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
            darkMode
              ? "border-white/[0.08] hover:bg-white/[0.03] text-zinc-400 hover:text-white"
              : "border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 bg-white"
          }`}
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;