import { useNavigate } from "react-router-dom";

const ProjectRow = ({ project }) => {
  const navigate = useNavigate();

  const getDeadlineInfo = (project) => {
    if (project.status === "Completed") {
      return { text: `Completed on Oct 20`, color: "text-emerald-600", bg: "bg-emerald-50" };
    }
    const idNum = parseInt(project.id.replace(/\D/g, '')) || 0;
    const diff = (idNum % 7) - 2; 
    if (diff === 0) return { text: "Due today", color: "text-amber-600", bg: "bg-amber-50" };
    if (diff > 0) return { text: `Due in ${diff} days`, color: "text-blue-600", bg: "bg-blue-50" };
    return { text: `Overdue by ${Math.abs(diff)} days ❗`, color: "text-rose-600", bg: "bg-rose-50" };
  };

  const deadline = getDeadlineInfo(project);

  return (
    <div 
      onClick={() => navigate(`/workspace/${project.id}`)}
      className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl mb-4 hover:shadow-xl hover:border-[#6C5CE7]/30 transition-all duration-300 cursor-pointer animate-in slide-in-from-bottom-2"
    >
      <div className="flex items-center gap-4 md:w-1/4">
        <div className="w-11 h-11 rounded-xl bg-[#F8F9FC] border border-gray-100 flex items-center justify-center text-[#6C5CE7] font-extrabold text-[15px] group-hover:bg-[#6C5CE7] group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(108,92,231,0.3)] transition-all">
          {project.name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-gray-900 group-hover:text-[#6C5CE7] transition-colors line-clamp-1">{project.name}</p>
          <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 capitalize">{project.category}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:w-1/4 mt-4 md:mt-0 px-2 lg:px-6">
        <div className="flex items-center justify-between text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
          <span>Progress</span>
          <span className="text-gray-900">{project.progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${project.status === 'Completed' ? 'bg-emerald-500' : 'bg-[#6C5CE7]'}`} 
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-6 md:w-2/5 mt-4 md:mt-0">
        <div className="text-right min-w-[120px]">
          <p className="text-[16px] font-extrabold text-gray-900">${project.totalAmount || 0}</p>
          <p className={`text-[12px] font-bold mt-0.5 ${deadline.color}`}>
            {deadline.text}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all ${
            project.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
            project.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
            'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm shadow-indigo-100'
          }`}>
            {project.status}
          </span>
          <button 
            className="px-5 py-2.5 bg-gray-50 hover:bg-[#6C5CE7] hover:text-white text-[#6C5CE7] text-[13px] font-bold rounded-xl border border-gray-100 transition-all active:scale-95"
          >
            Workspace
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectRow;
