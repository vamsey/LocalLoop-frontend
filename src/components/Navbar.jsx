function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const getLinkClass = (path) => {
    const isActive = currentPath === path;
    return `transition-colors duration-300 text-sm font-medium ${
      isActive
        ? darkMode ? "text-zinc-100" : "text-zinc-900"
        : darkMode ? "text-zinc-500 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-900"
    }`;
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`sticky top-0 z-50 px-6 md:px-10 py-4 backdrop-blur-2xl border-b transition-colors duration-500 ${
          darkMode ? "bg-[#030303]/70 border-white/[0.08]" : "bg-[#FAFAFA]/70 border-zinc-200"
        }`}
      >
        <div className="flex justify-between items-center">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <Infinity className={darkMode ? "text-cyan-400" : "text-violet-600"} size={28} />
            <span
              style={{ fontFamily: "'Outfit', sans-serif" }}
              className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent"
            >
              LocalLoop
            </span>
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-3 md:gap-8">

            {/* DESKTOP LINKS (unchanged) */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={getLinkClass("/")}>Home</Link>
              <Link to="/explore" className={getLinkClass("/explore")}>Explore</Link>
              <Link to="/register" className={getLinkClass("/register")}>Register</Link>
              <Link to="/admin" className={getLinkClass("/admin")}>Admin</Link>
              <Link to="/dashboard" className={getLinkClass("/dashboard")}>Dashboard</Link>
            </div>

            {/* THEME */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
                darkMode
                  ? "border-white/[0.08] hover:bg-white/[0.03] text-zinc-400 hover:text-white"
                  : "border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 bg-white"
              }`}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* HAMBURGER */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            {/* DRAWER */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className={`fixed top-0 right-0 h-full w-[75%] max-w-sm z-50 p-6 flex flex-col ${
                darkMode
                  ? "bg-[#030303] border-l border-white/[0.08]"
                  : "bg-white border-l border-zinc-200"
              }`}
            >
              {/* CLOSE BUTTON */}
              <div className="flex justify-end mb-6">
                <button onClick={() => setMobileOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              {/* LINKS */}
              <div className="flex flex-col gap-6 text-lg font-semibold">
                <Link onClick={() => setMobileOpen(false)} to="/">Home</Link>
                <Link onClick={() => setMobileOpen(false)} to="/explore">Explore</Link>
                <Link onClick={() => setMobileOpen(false)} to="/register">Register</Link>
                <Link onClick={() => setMobileOpen(false)} to="/admin">Admin</Link>
                <Link onClick={() => setMobileOpen(false)} to="/dashboard">Dashboard</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
export default Navbar;