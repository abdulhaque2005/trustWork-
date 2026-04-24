import React from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const statusConfig = {
  active: { label: "Active", bg: "#22C55E15", text: "#22C55E", dot: "#22C55E" },
  pending: { label: "Pending", bg: "#F59E0B15", text: "#F59E0B", dot: "#F59E0B" },
  completed: { label: "Completed", bg: "#6C5CE715", text: "#6C5CE7", dot: "#6C5CE7" },
};

const ProjectRow = ({ project, index }) => {
  const status = statusConfig[project.status] || statusConfig.pending;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer"
      style={{ "--hover-bg": "var(--bg-soft)" }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--bg-soft)"}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C5CE7] to-indigo-400 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-500/20 flex-shrink-0">
        {(project.name || "P").charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold truncate transition-colors" style={{ color: "var(--text-main)" }}>
          {project.name}
        </h4>
        <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
          {project.category} • ${(project.budget || 0).toLocaleString()}
        </p>
      </div>

      {/* Progress */}
      <div className="hidden md:block w-32">
        <div className="flex justify-between text-[10px] font-bold mb-1" style={{ color: "var(--text-muted)" }}>
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-color)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, delay: index * 0.07 }}
            className="h-full rounded-full"
            style={{ backgroundColor: status.dot }}
          />
        </div>
      </div>

      {/* Status Badge */}
      <div
        className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"
        style={{ backgroundColor: status.bg, color: status.text }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.dot }} />
        {status.label}
      </div>

      {/* Link */}
      <button className="p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100" style={{ color: "var(--text-muted)" }}>
        <ExternalLink size={14} />
      </button>
    </motion.div>
  );
};

const ProjectList = ({ projects, loading }) => {
  return (
    <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
      {/* Header */}
      <div className="p-6 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-color)" }}>
        <h3 className="text-lg font-bold" style={{ color: "var(--text-main)" }}>
          Projects Overview
        </h3>
        <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{ backgroundColor: "var(--bg-soft)", color: "var(--text-muted)" }}>
          {projects.length} projects
        </span>
      </div>

      {/* Content */}
      <div className="p-2">
        {loading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: "var(--bg-soft)" }} />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded-full w-1/3" style={{ backgroundColor: "var(--bg-soft)" }} />
                  <div className="h-2 rounded-full w-1/4" style={{ backgroundColor: "var(--bg-soft)", opacity: 0.5 }} />
                </div>
                <div className="h-5 w-16 rounded-full" style={{ backgroundColor: "var(--bg-soft)" }} />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-bold" style={{ color: "var(--text-muted)" }}>No projects found</p>
          </div>
        ) : (
          projects.map((project, i) => (
            <ProjectRow key={project.id} project={project} index={i} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectList;
