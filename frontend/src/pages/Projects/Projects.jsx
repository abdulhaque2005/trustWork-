import { useState } from "react";
import { useSelector } from "react-redux";
import { Plus, FolderKanban } from "lucide-react";
import ProjectRow from "./ProjectRow.jsx";

const Projects = () => {
  const { projects } = useSelector((state) => state.projects);
  const [activeTab, setActiveTab] = useState("All Projects");

  const filteredProjects = activeTab === "All Projects" 
    ? projects 
    : projects.filter(p => p.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl shadow-sm"
        style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text-main)" }}>System Projects</h1>
          <p className="text-[15px] mt-1.5 font-semibold" style={{ color: "var(--text-muted)" }}>Real-time status of your connected escrow contracts.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#6C5CE7] to-[#8A7DF2] text-white text-[15px] font-extrabold rounded-xl shadow-lg transition-all active:scale-95">
          <Plus size={20} strokeWidth={3} /> Create New Project
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1 px-2 rounded-t-2xl" style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: "var(--bg-soft)" }}>
        {["All Projects", "Active", "Pending", "Completed", "Disputed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4.5 text-[15px] font-extrabold transition-all relative ${activeTab === tab ? "" : "hover:opacity-80"}`}
            style={{ color: activeTab === tab ? "var(--accent)" : "var(--text-muted)" }}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[3.5px] rounded-t-full shadow-md" style={{ backgroundColor: "var(--accent)" }} />}
          </button>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))
        ) : (
          <div className="py-24 text-center rounded-[32px] border-2 border-dashed" style={{ backgroundColor: "var(--bg-main)", borderColor: "var(--border-color)" }}>
            <FolderKanban size={48} className="mx-auto mb-4" style={{ color: "var(--border-color)" }} />
            <h3 className="text-2xl font-black mb-3" style={{ color: "var(--text-main)" }}>No {activeTab} Projects</h3>
            <p className="max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>All project data is synced with your local system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
