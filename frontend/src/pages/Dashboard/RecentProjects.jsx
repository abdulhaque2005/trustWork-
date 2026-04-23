import { MoreHorizontal } from "lucide-react";

const projects = [
  { id: 1, name: "Website Redesign", client: "Google Inc.", status: "Active", deadline: "Oct 24, 2026", amount: "$1,200" },
  { id: 2, name: "Mobile App MVP", client: "Startup X", status: "Pending", deadline: "Nov 02, 2026", amount: "$3,500" },
  { id: 3, name: "SEO Optimization", client: "TechFlow", status: "Completed", deadline: "Sep 15, 2026", amount: "$800" },
  { id: 4, name: "Logo & Branding", client: "Design Studio", status: "Active", deadline: "Oct 28, 2026", amount: "$450" },
];

const badgeStyles = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  Pending: "bg-amber-50 text-amber-700 border-amber-200/60",
  Completed: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
};

const RecentProjects = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="px-7 py-6 border-b border-gray-100 flex items-center justify-between bg-white">
        <div>
          <h3 className="text-[19px] font-extrabold text-gray-900 tracking-tight">Recent Projects</h3>
          <p className="text-[14px] font-medium text-gray-500 mt-1">Manage and track your latest escrow contracts.</p>
        </div>
        <button className="text-[14px] font-bold text-[#6C5CE7] hover:text-[#5b4bc4] transition-colors bg-indigo-50/50 hover:bg-indigo-50 px-4 py-2 rounded-lg">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="px-7 py-4 text-[13px] font-bold text-gray-500 uppercase tracking-wider">Project Details</th>
              <th className="px-7 py-4 text-[13px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-7 py-4 text-[13px] font-bold text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="px-7 py-4 text-[13px] font-bold text-gray-500 uppercase tracking-wider text-right">Amount</th>
              <th className="px-7 py-4 text-[13px] font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => (
              <tr key={project.id} className="group hover:bg-indigo-50/30 transition-colors duration-300">
                <td className="px-7 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-extrabold text-[15px] group-hover:bg-[#6C5CE7] group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(108,92,231,0.3)] transition-all duration-300">
                      {project.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[16px] font-bold text-gray-900 leading-tight">{project.name}</p>
                      <p className="text-[14px] font-medium text-gray-500 mt-1">{project.client}</p>
                    </div>
                  </div>
                </td>
                <td className="px-7 py-5">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-bold border ${badgeStyles[project.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${project.status === 'Active' ? 'bg-emerald-500' : project.status === 'Pending' ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                    {project.status}
                  </span>
                </td>
                <td className="px-7 py-5 text-[15px] font-semibold text-gray-600">{project.deadline}</td>
                <td className="px-7 py-5 text-[16px] font-extrabold text-gray-900 text-right">{project.amount}</td>
                <td className="px-7 py-5 text-center">
                  <button className="p-2 text-gray-400 hover:text-[#6C5CE7] hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center justify-center">
                    <MoreHorizontal size={20} strokeWidth={2.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentProjects;
