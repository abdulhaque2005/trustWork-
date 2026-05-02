import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, AlertTriangle } from "lucide-react";

const statusColor = (status) => {
  const map = {
    new: { bg: "#3B82F615", color: "#3B82F6", label: "New" },
    active: { bg: "#F9731615", color: "#F97316", label: "Active" },
    "in-progress": { bg: "#F9731615", color: "#F97316", label: "Active" },
    pending: { bg: "#EAB30815", color: "#EAB308", label: "Pending" },
    completed: { bg: "#22C55E15", color: "#22C55E", label: "Completed" },
    disputed: { bg: "#EF444415", color: "#EF4444", label: "Disputed" },
    expired: { bg: "#6B728015", color: "#6B7280", label: "Expired" },
  };
  return map[status] || map.new;
};

const ProjectSection = ({ title, projects, emptyText, navigate }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    className="p-7 rounded-3xl shadow-sm" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-lg font-black" style={{ color: "var(--text-main)" }}>{title}</h3>
    </div>
    {projects.length === 0 ? (
      <div className="text-center py-8">
        <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>{emptyText || "No projects found"}</p>
      </div>
    ) : (
      <div className="space-y-3">
        {projects.map((project) => {
          const sc = statusColor(project.status);
          const budget = project.budget || 0;
          const progress = project.progress || 0;
          const daysLeft = project.daysLeft ?? (project.deadline ? Math.ceil((new Date(project.deadline).getTime() - Date.now()) / 86400000) : 0);
          const isExpired = daysLeft < 0 || project.status === "expired";

          return (
            <div
              key={project._id}
              onClick={() => navigate(project.status === "new" ? "/projects" : `/workspace/${project._id}`)}
              className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:shadow-md transition-all group"
              style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)" }}
            >
              {project.status !== "new" && (
                <div className="relative w-11 h-11 flex-shrink-0">
                  <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border-color)" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={sc.color} strokeWidth="3" strokeDasharray={`${progress}, 100`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black" style={{ color: "var(--text-main)" }}>{progress}%</span>
                </div>
              )}
              
              {project.status === "new" && (
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
                  <span className="text-xs font-black" style={{ color: "var(--accent)" }}>NEW</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate group-hover:underline" style={{ color: "var(--text-main)" }}>{project.title}</p>
                {project.status === "new" && project.description && (
                  <p className="text-[10px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{project.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>
                    ${budget.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: isExpired && project.status !== "completed" ? "#EF4444" : "var(--text-muted)" }}>
                    <Clock size={10} />
                    {isExpired && project.status !== "completed" ? "Expired" : project.status === "new" ? "Available Now" : `${Math.max(0, daysLeft)}d left`}
                  </span>
                </div>
              </div>

              {project.status === "new" ? (
                <button className="text-[10px] font-bold px-3 py-1.5 rounded-xl hover:-translate-y-0.5 transition-all" style={{ backgroundColor: "var(--accent)", color: "white" }}>
                  Accept Project
                </button>
              ) : (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: sc.bg, color: sc.color }}>
                  {sc.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    )}
  </motion.div>
);

const ProjectList = ({ projects, dummyProjects = [], loading, role }) => {
  const navigate = useNavigate();

  if (loading && projects.length === 0 && dummyProjects.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="p-7 rounded-3xl shadow-sm" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ backgroundColor: "var(--bg-soft)" }} />
          ))}
        </div>
      </motion.div>
    );
  }

  if (role === "freelancer") {
    const activeProjects = projects.filter(p => ["active", "in-progress"].includes(p.status));
    const historyProjects = projects.filter(p => ["completed", "pending"].includes(p.status));
    const newProjects = dummyProjects.slice(0, 4);

    return (
      <div className="space-y-8">
        <ProjectSection title="🟢 NEW PROJECTS (Available Work)" projects={newProjects} emptyText="No new projects available right now." navigate={navigate} />
        <ProjectSection title="🟠 ACTIVE PROJECTS" projects={activeProjects} emptyText="You have no active projects." navigate={navigate} />
        <ProjectSection title="🔵 HISTORY" projects={historyProjects} emptyText="No completed or pending projects in history." navigate={navigate} />
      </div>
    );
  }

  return (
    <ProjectSection title="📁 PROJECT LIST" projects={projects} emptyText="No projects found. Create one!" navigate={navigate} />
  );
};

export default ProjectList;
