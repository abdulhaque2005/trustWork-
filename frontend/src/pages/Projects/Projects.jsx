import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../store/slices/projectSlice";
import { fetchPublicData } from "../../services/publicData";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../../components/common/SEO";
import { Search, Filter, Briefcase, Clock, AlertTriangle, ArrowRight } from "lucide-react";

const statusConfig = {
  open: { bg: "#6C5CE715", color: "#6C5CE7", label: "Open" },
  "in-progress": { bg: "#3B82F615", color: "#3B82F6", label: "In Progress" },
  active: { bg: "#22C55E15", color: "#22C55E", label: "Active" },
  completed: { bg: "#8B5CF615", color: "#8B5CF6", label: "Completed" },
  disputed: { bg: "#EF444415", color: "#EF4444", label: "Disputed" },
  expired: { bg: "#F9731615", color: "#F97316", label: "Expired" },
  pending: { bg: "#F59E0B15", color: "#F59E0B", label: "Pending" },
};

const Projects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, loading } = useSelector((s) => s.projects);
  const { user } = useSelector((s) => s.auth);
  const [publicData, setPublicData] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const role = (user?.role || localStorage.getItem("role") || "client").toLowerCase();

  useEffect(() => {
    dispatch(fetchProjects());
    fetchPublicData().then(d => d && setPublicData(d));
  }, [dispatch]);

  const allProjects = projects.length > 0 ? projects : (publicData?.projects || []);

  const filtered = allProjects.filter(p => {
    const matchSearch = (p.title || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ["all", "open", "in-progress", "completed", "disputed", "expired"];

  return (
    <div className="max-w-[1400px] mx-auto pb-20">
      <SEO title="Projects" description="Browse and manage your EscrowFlow projects" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black" style={{ color: "var(--text-main)" }}>
            {role === "freelancer" ? "Browse Projects" : role === "admin" ? "All Projects" : "My Projects"}
          </h1>
          <p className="text-sm font-semibold mt-1" style={{ color: "var(--text-muted)" }}>
            {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        {role === "client" && (
          <button onClick={() => navigate("/create-project")} className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl text-sm hover:-translate-y-0.5 transition-all">
            + New Project
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all"
            style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === s ? "shadow-md" : "opacity-70 hover:opacity-100"}`}
              style={{
                backgroundColor: statusFilter === s ? (statusConfig[s]?.color || "var(--accent)") : "var(--bg-soft)",
                color: statusFilter === s ? "white" : "var(--text-muted)",
                border: `1px solid ${statusFilter === s ? "transparent" : "var(--border-color)"}`,
              }}
            >
              {s === "all" ? "All" : statusConfig[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {loading && projects.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-52 rounded-3xl animate-pulse" style={{ backgroundColor: "var(--bg-soft)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase size={48} className="mx-auto mb-4" style={{ color: "var(--text-muted)" }} />
          <p className="text-lg font-bold" style={{ color: "var(--text-main)" }}>No projects found</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((p, i) => {
              const sc = statusConfig[p.status] || statusConfig.pending;
              const daysLeft = p.daysLeft ?? (p.deadline ? Math.ceil((new Date(p.deadline).getTime() - Date.now()) / 86400000) : 0);
              const isExpired = daysLeft < 0 || p.status === "expired";

              return (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate(`/workspace/${p._id}`)}
                  className="p-6 rounded-3xl cursor-pointer hover:shadow-lg transition-all group"
                  style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                    {isExpired && <AlertTriangle size={16} className="text-orange-500" />}
                  </div>

                  <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:underline" style={{ color: "var(--text-main)" }}>{p.title}</h3>
                  <p className="text-xs line-clamp-2 mb-4" style={{ color: "var(--text-muted)" }}>{p.description}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] font-bold mb-1.5">
                      <span style={{ color: "var(--text-muted)" }}>Progress</span>
                      <span style={{ color: sc.color }}>{p.progress || 0}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--bg-soft)" }}>
                      <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${p.progress || 0}%`, backgroundColor: sc.color }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black" style={{ color: "var(--text-main)" }}>${(p.budget || 0).toLocaleString()}</span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: isExpired ? "#EF4444" : "var(--text-muted)" }}>
                      <Clock size={10} /> {isExpired ? "Expired" : `${Math.max(0, daysLeft)}d left`}
                    </span>
                  </div>

                  {/* Freelancer info or CTA */}
                  {role === "freelancer" && p.status === "open" && (
                    <div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--border-color)" }}>
                      <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90" style={{ backgroundColor: "#10B98115", color: "#10B981" }}>
                        Accept Project <ArrowRight size={12} />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Projects;
