import { Search, Bell, Sun, Moon, Leaf, ChevronDown, Settings, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice.js";
import { setSearchQuery } from "../../store/slices/projectSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const themes = [
  { id: "light", label: "Light", icon: Sun, color: "bg-amber-400" },
  { id: "dark", label: "Dark", icon: Moon, color: "bg-indigo-500" },
  { id: "nature", label: "Nature", icon: Leaf, color: "bg-emerald-500" },
];

const applyTheme = (theme) => {
  const html = document.documentElement;
  html.classList.remove("dark", "nature");
  if (theme !== "light") html.classList.add(theme);
  localStorage.setItem("theme", theme);
  window.dispatchEvent(new Event("themeChange"));
};

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");
  const { user } = useSelector((state) => state.auth);
  const { searchQuery } = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeRef = useRef(null);
  const profileRef = useRef(null);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setCurrentTheme(saved);
    applyTheme(saved);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) setShowTheme(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
    setShowTheme(false);
  };

  const activeTheme = themes.find(t => t.id === currentTheme) || themes[0];
  const ActiveIcon = activeTheme.icon;

  const rawRole = localStorage.getItem("role") || user?.role || "Client";
  const role = rawRole === "Freelancer" ? "Freelancer" : "Client";

  return (
    <nav className="h-20 px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300"
      style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--border-color)" }}
    >
      {/* SEARCH BAR */}
      <div className="flex-1 max-w-lg relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" size={18} style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          placeholder="Search projects, users, or transactions..."
          className="w-full pl-12 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all"
          style={{
            backgroundColor: "var(--bg-soft)",
            border: "1px solid var(--border-color)",
            color: "var(--text-main)",
          }}
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}>⌘</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}>K</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-4">

        {/* THEME SWITCHER */}
        <div ref={themeRef} className="relative">
          <button
            onClick={() => { setShowTheme(!showTheme); setShowProfile(false); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80"
            style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }}
          >
            <ActiveIcon size={16} />
            <span className="hidden sm:inline text-xs">{activeTheme.label}</span>
            <ChevronDown size={12} className={`transition-transform ${showTheme ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showTheme && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-48 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}
              >
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  Choose Theme
                </p>
                {themes.map((t) => {
                  const Icon = t.icon;
                  const isActive = currentTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleThemeChange(t.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive ? "ring-2 ring-offset-1" : "hover:opacity-80"
                      }`}
                      style={{
                        backgroundColor: isActive ? "var(--bg-soft)" : "transparent",
                        color: "var(--text-main)",
                        ...(isActive ? { ringColor: "var(--accent)" } : {}),
                      }}
                    >
                      <div className={`w-7 h-7 ${t.color} rounded-lg flex items-center justify-center text-white`}>
                        <Icon size={14} />
                      </div>
                      {t.label}
                      {isActive && <span className="ml-auto text-[10px]">✓</span>}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NOTIFICATIONS */}
        <button className="relative p-2 rounded-lg transition-colors hover:opacity-80" style={{ color: "var(--text-muted)" }}>
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2" style={{ borderColor: "var(--bg-main)" }} />
        </button>

        <div className="h-8 w-px" style={{ backgroundColor: "var(--border-color)" }} />

        {/* PROFILE */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowTheme(false); }}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl transition-all hover:opacity-80"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C5CE7] to-indigo-400 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold leading-none" style={{ color: "var(--text-main)" }}>{user?.fullName || "User"}</p>
              <p className="text-[10px] font-bold uppercase tracking-tighter mt-1" style={{ color: "var(--text-muted)" }}>{role}</p>
            </div>
            <ChevronDown size={14} className={`transition-transform ${showProfile ? "rotate-180" : ""}`} style={{ color: "var(--text-muted)" }} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl p-2 z-50"
                style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}
              >
                <div className="px-3 py-3 mb-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Signed in as</p>
                  <p className="text-xs font-black truncate mt-0.5" style={{ color: "var(--text-main)" }}>{user?.email || "user@example.com"}</p>
                </div>
                <button onClick={() => navigate("/settings")} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all hover:opacity-80" style={{ color: "var(--text-main)" }}>
                  <Settings size={16} /> Account Settings
                </button>
                <button onClick={() => { dispatch(logout()); navigate("/login"); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all mt-1">
                  <LogOut size={16} /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
