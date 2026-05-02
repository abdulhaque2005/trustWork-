import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import SEO from "../components/common/SEO";
import { Users, Shield, Briefcase, Search } from "lucide-react";

const roleConfig = {
  client: { bg: "#6C5CE715", color: "#6C5CE7", label: "Client" },
  freelancer: { bg: "#22C55E15", color: "#22C55E", label: "Freelancer" },
  admin: { bg: "#EF444415", color: "#EF4444", label: "Admin" },
};

const TeamHub = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/auth/users").then(r => { setUsers(r.data.data.users); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => (u.name || "").toLowerCase().includes(search.toLowerCase()) || (u.email || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-[1200px] mx-auto pb-20">
      <SEO title="User Management" description="Manage all platform users" />
      <h1 className="text-3xl font-black mb-2" style={{ color: "var(--text-main)" }}>User Management</h1>
      <p className="text-sm font-semibold mb-6" style={{ color: "var(--text-muted)" }}>{users.length} users on platform</p>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
        <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[{ label: "Clients", count: users.filter(u => u.role === "client").length, icon: Briefcase, color: "#6C5CE7" },
          { label: "Freelancers", count: users.filter(u => u.role === "freelancer").length, icon: Users, color: "#22C55E" },
          { label: "Admins", count: users.filter(u => u.role === "admin").length, icon: Shield, color: "#EF4444" }].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl text-center" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
            <s.icon size={24} className="mx-auto mb-2" style={{ color: s.color }} />
            <p className="text-xl font-black" style={{ color: "var(--text-main)" }}>{s.count}</p>
            <p className="text-[10px] font-bold uppercase" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: "var(--bg-soft)" }} />)}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u, i) => {
            const rc = roleConfig[u.role] || roleConfig.client;
            return (
              <motion.div key={u._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-black">
                    {(u.name || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--text-main)" }}>{u.name}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: rc.bg, color: rc.color }}>{rc.label}</span>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamHub;
