import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice.js";
import {
  LayoutGrid,
  FolderKanban,
  Wallet,
  ShieldAlert,
  Settings,
  LogOut,
  ShieldCheck,
  Users,
  BarChart3,
  Plus
} from "lucide-react";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const handleThemeChange = () => {
      setCurrentTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("storage", handleThemeChange);
    // Custom event for same-tab changes
    window.addEventListener("themeChange", handleThemeChange);
    return () => {
      window.removeEventListener("storage", handleThemeChange);
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  const rawRole = localStorage.getItem("role") || user?.role || "Client";
  const role = rawRole === "Freelancer" ? "Freelancer" : "Client";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutGrid size={18} />, roles: ["Client", "Freelancer"] },
    { name: "Projects", path: "/projects", icon: <FolderKanban size={18} />, roles: ["Client", "Freelancer"] },
    { name: "Team Hub", path: "/team", icon: <Users size={18} />, roles: ["Client"] },
    { name: "Payments", path: "/payments", icon: <Wallet size={18} />, roles: ["Client", "Freelancer"] },
    { name: "Disputes", path: "/disputes", icon: <ShieldAlert size={18} />, roles: ["Client", "Freelancer"] },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 size={18} />, roles: ["Client"] },
    { name: "Settings", path: "/settings", icon: <Settings size={18} />, roles: ["Client", "Freelancer"] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <div
      className="sidebar-container fixed left-0 top-0 h-screen w-64 flex flex-col p-6 z-50 transition-colors duration-300"
      style={{
        backgroundColor: "var(--sidebar-bg)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--accent)", color: "#fff" }}
        >
          <ShieldCheck size={20} />
        </div>
        <h1 className="text-lg font-bold tracking-tight" style={{ color: currentTheme === "light" ? "var(--text-main)" : "#FFFFFF" }}>
          EscrowFlow
        </h1>
      </div>

      {/* User Card */}
      <div
        className="mb-8 px-3 py-3 rounded-2xl transition-colors duration-300"
        style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C5CE7] to-indigo-400 text-white flex items-center justify-center text-xs font-bold shadow-md">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate" style={{ color: "var(--text-main)" }}>
              {user?.fullName || "User"}
            </p>
            <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: "var(--accent)" }}>
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Create Project CTA */}
      {role === "Client" && (
        <button
          onClick={() => navigate("/create-project")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-6 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-lg"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <Plus size={18} />
          Create Project
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive ? "shadow-sm active" : ""
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? "var(--accent)" : "transparent",
              color: isActive ? "#FFFFFF" : "var(--sidebar-text)",
            })}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="mt-auto pt-6" style={{ borderTop: "1px solid var(--border-color)" }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 font-semibold text-sm text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
