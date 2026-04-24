import { useNavigate } from "react-router-dom";
const badgeStyles = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Completed: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const RecentProjects = ({ projects = [] }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Project Name</th>
              <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.length > 0 ? (
              projects.slice(0, 5).map((project) => (
                <tr 
                  key={project.id} 
                  onClick={() => navigate(`/workspace/${project.id}`)}
                  className="group hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F8F9FC] flex items-center justify-center text-[#6C5CE7] font-bold text-xs border border-gray-100 group-hover:bg-[#6C5CE7] group-hover:text-white transition-all">
                        {project.name.charAt(0)}
                      </div>
                      <span className="text-[15px] font-bold text-gray-900 line-clamp-1">{project.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badgeStyles[project.status]}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[14px] font-medium text-gray-500 capitalize italic">
                    {project.category}
                  </td>
                  <td className="px-6 py-4 text-[15px] font-extrabold text-gray-900 text-right">
                    ${project.totalAmount || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-400 font-medium italic">
                  No projects matching this status found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentProjects;
