import { Briefcase, Clock, CheckCircle, FolderKanban, Plus, Sparkles } from "lucide-react";
import StatsCard from "./StatsCard";
import RecentProjects from "./RecentProjects";

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#6C5CE7]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100/50 rounded-full mb-4">
            <Sparkles size={14} className="text-[#6C5CE7]" />
            <span className="text-[11px] font-bold text-[#6C5CE7] uppercase tracking-wider">Welcome Back</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-[15px] text-gray-500 mt-2 font-medium">Here's a detailed look at your platform's activity today.</p>
        </div>
        <button className="relative z-10 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#6C5CE7] to-[#8A7DF2] hover:from-[#5b4bc4] hover:to-[#7b6df0] text-white text-[15px] font-bold rounded-xl shadow-[0_8px_16px_-4px_rgba(108,92,231,0.4)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
          <Plus size={20} strokeWidth={2.5} />
          Create Project
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        <StatsCard title="Total Projects" value="24" trend="+12%" icon={FolderKanban} />
        <StatsCard title="Active Projects" value="12" trend="+5%" icon={Briefcase} />
        <StatsCard title="Pending Projects" value="5" trend="-2%" icon={Clock} isNegative />
        <StatsCard title="Completed Projects" value="7" trend="+18%" icon={CheckCircle} />
      </div>

      {/* Recent Projects Table */}
      <div className="mt-8">
        <RecentProjects />
      </div>
    </div>
  );
};

export default Dashboard;
