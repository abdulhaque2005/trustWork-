import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import {
  LayoutDashboard, FolderKanban, CreditCard, ShieldAlert, Settings,
  Plus, LogOut, Users, Search, Shield, BarChart3
} from "lucide-react";

const Sidebar = () => {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = (user?.role || localStorage.getItem("role") || "client").toLowerCase();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const links = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["client","freelancer","admin"] },
    { to: "/projects", icon: FolderKanban, label: role === "freelancer" ? "Browse Projects" : "Projects", roles: ["client","freelancer","admin"] },
    { to: "/create-project", icon: Plus, label: "New Project", roles: ["client"] },
    { to: "/payments", icon: CreditCard, label: role === "freelancer" ? "Earnings" : "Payments", roles: ["client","freelancer","admin"] },
    { to: "/disputes", icon: ShieldAlert, label: role === "admin" ? "Manage Disputes" : "Disputes", roles: ["client","freelancer","admin"] },
    { to: "/team", icon: Users, label: "Team Hub", roles: ["client","freelancer","admin"] },
    { to: "/analytics", icon: BarChart3, label: "Analytics", roles: ["client","freelancer","admin"] },
    { to: "/settings", icon: Settings, label: "Settings", roles: ["client","freelancer","admin"] },
  ];

  const filteredLinks = links.filter(l => l.roles.includes(role));

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-30 sidebar-container"
      style={{ backgroundColor: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)" }}>

      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Shield size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-black tracking-tight" style={{ color: "var(--text-main)" }}>EscrowFlow</h1>
          <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{role}</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1 mt-2">
        {filteredLinks.map(link => (
          <NavLink key={link.to} to={link.to}
            className={({ isActive }) => `sidebar-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? "active" : ""}`}
            style={({ isActive }) => ({
              backgroundColor: isActive ? "var(--accent)" : "transparent",
              color: isActive ? "white" : "var(--sidebar-text)",
            })}>
            <link.icon size={18} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-black">
            {(user?.name || "U")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold truncate" style={{ color: "var(--text-main)" }}>{user?.name || "User"}</p>
            <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-red-500/10 text-red-500">
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
