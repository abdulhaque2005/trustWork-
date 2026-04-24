import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSettings } from "../store/slices/authSlice.js";
import { User, Bell, Shield, Moon, Sun, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const themes = [
  { id: "light", label: "Light Mode", icon: Sun, preview: "#F8F9FC", color: "bg-amber-400" },
  { id: "dark", label: "Dark Mode", icon: Moon, preview: "#0F172A", color: "bg-indigo-500" },
  { id: "nature", label: "Nature Mode", icon: Leaf, preview: "#14532D", color: "bg-emerald-500" },
];

const applyTheme = (theme) => {
  const html = document.documentElement;
  html.classList.remove("dark", "nature");
  if (theme !== "light") html.classList.add(theme);
  localStorage.setItem("theme", theme);
};

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "light");

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
    toast.success(`Theme changed to ${themeId}`, {
      style: { borderRadius: '16px', background: '#1e293b', color: '#fff', fontWeight: '700' }
    });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 animate-in fade-in duration-700">
      <Toaster position="top-right" />
      
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: "var(--text-main)" }}>System Settings</h1>
        <p className="font-bold" style={{ color: "var(--text-muted)" }}>Manage your account, security, and interface preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* SIDEBAR NAVIGATION */}
        <div className="space-y-2">
          {[
            { id: "profile", label: "Profile", icon: <User size={18} /> },
            { id: "appearance", label: "Appearance", icon: <Moon size={18} /> },
            { id: "security", label: "Security", icon: <Shield size={18} /> },
            { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
            { id: "account", label: "Account", icon: <User size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all ${
                activeTab === tab.id ? 'text-white shadow-xl scale-105' : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? "var(--accent)" : "transparent",
                color: activeTab === tab.id ? "#fff" : "var(--text-muted)",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="md:col-span-3">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-10 rounded-[40px] shadow-sm space-y-8"
            style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}
          >
            {activeTab === "profile" && (
              <form onSubmit={handleProfileUpdate} className="space-y-8">
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#6C5CE7] to-[#4834D4] flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                    {user?.fullName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <button type="button" className="px-6 py-2.5 text-white text-xs font-black rounded-xl uppercase tracking-widest hover:opacity-90 transition-all" style={{ backgroundColor: "var(--accent)" }}>Change Avatar</button>
                    <p className="text-[11px] font-bold mt-2" style={{ color: "var(--text-muted)" }}>JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--text-muted)" }}>Full Name</label>
                    <input type="text" defaultValue={user?.fullName} className="w-full p-4 rounded-2xl outline-none font-bold text-sm transition-all" style={{ backgroundColor: "var(--bg-soft)", border: "2px solid transparent", color: "var(--text-main)" }} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--text-muted)" }}>Email Address</label>
                    <input type="email" defaultValue={user?.email} className="w-full p-4 rounded-2xl outline-none font-bold text-sm transition-all" style={{ backgroundColor: "var(--bg-soft)", border: "2px solid transparent", color: "var(--text-main)" }} />
                  </div>
                </div>

                <button type="submit" className="px-10 py-4 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all" style={{ backgroundColor: "var(--accent)" }}>Save Changes</button>
              </form>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-8">
                <h3 className="text-xl font-black" style={{ color: "var(--text-main)" }}>Choose Theme</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {themes.map((t) => {
                    const Icon = t.icon;
                    const isActive = currentTheme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleThemeChange(t.id)}
                        className={`p-6 rounded-[28px] border-2 cursor-pointer transition-all text-center ${isActive ? "scale-105 shadow-lg" : "hover:opacity-80"}`}
                        style={{
                          borderColor: isActive ? "var(--accent)" : "var(--border-color)",
                          backgroundColor: "var(--bg-soft)",
                        }}
                      >
                        <div className="w-full h-20 rounded-2xl mb-4 flex items-center justify-center" style={{ backgroundColor: t.preview }}>
                          <Icon size={32} color="#fff" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest" style={{ color: "var(--text-main)" }}>{t.label}</p>
                        {isActive && <p className="text-[10px] font-bold mt-1" style={{ color: "var(--accent)" }}>✓ Active</p>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="text-xl font-black" style={{ color: "var(--text-main)" }}>Security Settings</h3>
                <p className="font-bold text-sm" style={{ color: "var(--text-muted)" }}>Two-factor authentication and password management coming soon.</p>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-xl font-black" style={{ color: "var(--text-main)" }}>Notification Preferences</h3>
                <p className="font-bold text-sm" style={{ color: "var(--text-muted)" }}>Email and push notification settings coming soon.</p>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-black text-rose-500">Danger Zone</h3>
                  <p className="font-bold text-sm" style={{ color: "var(--text-muted)" }}>Irreversible and destructive actions.</p>
                </div>
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl flex items-center justify-between" style={{ backgroundColor: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                    <div>
                      <h4 className="font-black text-rose-500">Clear All Data</h4>
                      <p className="text-xs font-bold text-rose-400/80">Wipe all projects, payments, and team data from your browser.</p>
                    </div>
                    <button onClick={() => {
                      if (window.confirm("Are you sure? This will delete all local data.")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }} className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg bg-rose-500 hover:bg-rose-600 transition-all">Clear Data</button>
                  </div>
                  
                  <div className="p-6 rounded-2xl flex items-center justify-between" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)" }}>
                    <div>
                      <h4 className="font-black" style={{ color: "var(--text-main)" }}>Log Out</h4>
                      <p className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>End your current session.</p>
                    </div>
                    <button onClick={() => {
                      localStorage.removeItem("isLoggedIn");
                      window.location.href = "/login";
                    }} className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all" style={{ backgroundColor: "var(--border-color)", color: "var(--text-main)" }}>Log Out</button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
