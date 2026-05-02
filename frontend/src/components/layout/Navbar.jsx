import { useSelector, useDispatch } from "react-redux";
import { updateSettings } from "../../store/slices/authSlice";
import { useEffect, useState } from "react";
import { Sun, Moon, Leaf, Bell, Search, Menu } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, settings } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const role = (user?.role || localStorage.getItem("role") || "client").toLowerCase();
  
  // Keep track of theme. Default to light if not set.
  const [currentTheme, setCurrentTheme] = useState(settings?.theme || (settings?.darkMode ? "dark" : "light"));

  useEffect(() => {
    document.documentElement.classList.remove("dark", "nature");
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (currentTheme === "nature") {
      document.documentElement.classList.add("nature");
    }
    dispatch(updateSettings({ theme: currentTheme, darkMode: currentTheme === "dark" }));
  }, [currentTheme, dispatch]);

  return (
    <div className="sticky top-0 z-20 backdrop-blur-xl px-6 py-4 flex items-center justify-between"
      style={{ backgroundColor: "var(--nav-bg)", borderBottom: "1px solid var(--border-color)" }}>
      
      {/* Left side: Search & Mobile Menu */}
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden p-2 rounded-xl" style={{ color: "var(--text-main)" }}>
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl w-full max-w-md transition-all focus-within:ring-2 focus-within:ring-indigo-500/50"
          style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)" }}>
          <Search size={18} style={{ color: "var(--text-muted)" }} />
          <input 
            type="text" 
            placeholder="Search projects, payments..." 
            className="bg-transparent border-none outline-none w-full text-sm font-medium"
            style={{ color: "var(--text-main)" }}
          />
        </div>
      </div>

      {/* Right side: Tools & Profile */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Theme Picker */}
        <div className="flex items-center p-1 rounded-2xl" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)" }}>
          {[
            { id: "light", icon: Sun, label: "Light" },
            { id: "dark", icon: Moon, label: "Dark" },
            { id: "nature", icon: Leaf, label: "Nature" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setCurrentTheme(t.id)}
              className="relative p-2 rounded-xl transition-all flex items-center justify-center"
              style={{ color: currentTheme === t.id ? "var(--bg-main)" : "var(--text-muted)" }}
              title={t.label}
            >
              {currentTheme === t.id && (
                <motion.div layoutId="theme-bubble" className="absolute inset-0 rounded-xl" style={{ backgroundColor: "var(--text-main)" }} />
              )}
              <t.icon size={16} className="relative z-10" />
            </button>
          ))}
        </div>

        <button className="relative p-2.5 rounded-xl transition-all hover:opacity-80"
          style={{ backgroundColor: "var(--bg-soft)", color: "var(--text-muted)", border: "1px solid var(--border-color)" }}>
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2" style={{ borderColor: "var(--bg-main)" }} />
        </button>

        <div className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l" style={{ borderColor: "var(--border-color)" }}>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-tight" style={{ color: "var(--text-main)" }}>{user?.name || "User"}</p>
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--accent)" }}>{role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white text-sm font-black cursor-pointer hover:scale-105 transition-transform">
            {(user?.name || "U")[0].toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
