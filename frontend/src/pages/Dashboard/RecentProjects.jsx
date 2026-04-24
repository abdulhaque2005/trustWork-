import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle, AlertCircle, ArrowRight, Wallet } from "lucide-react";

const RecentProjects = ({ projects, loading }) => {
  const navigate = useNavigate();

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-20 bg-slate-50 dark:bg-slate-900/50 animate-pulse rounded-2xl border border-slate-100 dark:border-slate-800" />
      ))}
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Details</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Progress</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Escrow</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {projects.map((project) => (
              <tr 
                key={project.id} 
                onClick={() => navigate(`/workspace/${project.id}`)}
                className="group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                      {project.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{project.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{project.client}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      project.status === 'Active' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 border-indigo-100 dark:border-indigo-500/20' : 
                      project.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-500/20' : 
                      'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="w-32 mx-auto">
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase mb-1.5">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 dark:bg-white transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <p className="text-sm font-black text-slate-900 dark:text-white">${project.totalAmount.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Locked 🔒</p>
                </td>
                <td className="px-6 py-5 text-right">
                  <ArrowRight size={18} className="text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-all translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
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
