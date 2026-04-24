import { useNavigate } from "react-router-dom";

const ProjectRow = ({ project }) => {
  const navigate = useNavigate();

  const getDeadlineInfo = (project) => {
    if (project.status === "Completed") {
      return { text: `Completed on Oct 20`, color: "#16a34a" };
    }
    const idNum = parseInt(project.id.replace(/\D/g, '')) || 0;
    const diff = (idNum % 7) - 2; 
    if (diff === 0) return { text: "Due today", color: "#d97706" };
    if (diff > 0) return { text: `Due in ${diff} days`, color: "#2563eb" };
    return { text: `Overdue by ${Math.abs(diff)} days ❗`, color: "#dc2626" };
  };

  const deadline = getDeadlineInfo(project);

  const statusColors = {
    Active: { bg: "#22C55E15", text: "#16a34a", border: "#22C55E30" },
    Pending: { bg: "#F59E0B15", text: "#d97706", border: "#F59E0B30" },
    Completed: { bg: "#6C5CE715", text: "#6C5CE7", border: "#6C5CE730" },
    Disputed: { bg: "#EF444415", text: "#dc2626", border: "#EF444430" },
  };
  const sc = statusColors[project.status] || statusColors.Active;

  return (
    <div 
      onClick={() => navigate(`/workspace/${project.id}`)}
      className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl mb-4 hover:shadow-xl transition-all duration-300 cursor-pointer"
      style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}
    >
      <div className="flex items-center gap-4 md:w-1/4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-[15px] transition-all"
          style={{ 
            backgroundColor: "var(--bg-soft)", 
            border: "1px solid var(--border-color)",
            color: "var(--accent)"
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--accent)"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "var(--bg-soft)"; e.currentTarget.style.color = "var(--accent)"; }}
        >
          {(project.name || "P").charAt(0)}
        </div>
        <div>
          <p className="font-bold transition-colors line-clamp-1" 
            style={{ color: "var(--text-main)" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-main)"}
          >{project.name}</p>
          <p className="text-[12px] font-bold uppercase tracking-wider mt-0.5 capitalize" style={{ color: "var(--text-muted)" }}>{project.category}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:w-1/4 mt-4 md:mt-0 px-2 lg:px-6">
        <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          <span>Progress</span>
          <span style={{ color: "var(--text-main)" }}>{project.progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border-color)" }}>
          <div 
            className="h-full transition-all duration-1000 ease-out" 
            style={{ width: `${project.progress}%`, backgroundColor: project.status === 'Completed' ? '#22C55E' : 'var(--accent)' }}
          />
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-6 md:w-2/5 mt-4 md:mt-0">
        <div className="text-right min-w-[120px]">
          <p className="text-[16px] font-extrabold" style={{ color: "var(--text-main)" }}>${project.totalAmount || 0}</p>
          <p className="text-[12px] font-bold mt-0.5" style={{ color: deadline.color }}>{deadline.text}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="px-4 py-1.5 rounded-full text-[12px] font-bold transition-all" style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
            {project.status}
          </span>
          <button 
            className="px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all active:scale-95"
            style={{ 
              backgroundColor: "var(--bg-soft)", 
              border: "1px solid var(--border-color)",
              color: "var(--accent)"
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--accent)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "var(--bg-soft)"; e.currentTarget.style.color = "var(--accent)"; }}
          >
            Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectRow;
