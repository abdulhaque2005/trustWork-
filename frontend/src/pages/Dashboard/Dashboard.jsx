import { useState, useEffect } from "react";
import { Plus, LayoutGrid, Eye, Loader2, Sparkles, FolderKanban, Briefcase, Clock, CheckCircle } from "lucide-react";
import StatsCard from "./StatsCard";
import RecentProjects from "./RecentProjects";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://dummyjson.com/products");
        if (!response.ok) throw new Error("Failed to fetch project data");
        const data = await response.json();
        
        const mappedData = data.products.map((item, index) => {
          let status = "Completed";
          if (index < 5) status = "Active";
          else if (index < 10) status = "Pending";

          return {
            id: item.id,
            name: item.title,
            amount: `$${item.price.toFixed(2)}`,
            category: item.category,
            status: status
          };
        });

        setProjects(mappedData);
        setFilteredProjects(mappedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilter = (status) => {
    setActiveFilter(status);
    if (status === "All") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.status === status));
    }
  };

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "Active").length,
    pending: projects.filter(p => p.status === "Pending").length,
    completed: projects.filter(p => p.status === "Completed").length,
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 size={40} className="text-[#6C5CE7] animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Fetching your workspace...</p>
    </div>
  );

  if (error) return (
    <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-center font-semibold">
      Error: {error}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-[15px] font-medium mt-1">Welcome back to your project overview.</p>
        </div>
        <button 
          onClick={() => alert("Navigate to Create Project")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C5CE7] text-white font-bold rounded-xl shadow-[0_8px_16px_-4px_rgba(108,92,231,0.3)] hover:scale-[1.02] transition-all active:scale-[0.98]"
        >
          <Plus size={18} strokeWidth={3} />
          Create Project
        </button>
      </div>

      {/* SECTION 1: OVERVIEW */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <LayoutGrid size={18} className="text-[#6C5CE7]" />
          Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Projects" 
            value={stats.total} 
            icon={FolderKanban} 
            isActive={activeFilter === "All"}
            onClick={() => handleFilter("All")}
          />
          <StatsCard 
            title="Active Projects" 
            value={stats.active} 
            icon={Briefcase} 
            isActive={activeFilter === "Active"}
            onClick={() => handleFilter("Active")}
          />
          <StatsCard 
            title="Pending Projects" 
            value={stats.pending} 
            icon={Clock} 
            isActive={activeFilter === "Pending"}
            onClick={() => handleFilter("Pending")}
          />
          <StatsCard 
            title="Completed Projects" 
            value={stats.completed} 
            icon={CheckCircle} 
            isActive={activeFilter === "Completed"}
            onClick={() => handleFilter("Completed")}
          />
        </div>
      </section>

      {/* SECTION 2: RECENT PROJECTS */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Sparkles size={18} className="text-[#6C5CE7]" />
          Recent Projects
        </h2>
        <RecentProjects projects={filteredProjects} />
      </section>

      {/* SECTION 3: QUICK ACTIONS */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => alert("Go to create project")}
            className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-[#6C5CE7] hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-[#6C5CE7] group-hover:text-white transition-colors">
                <Plus size={20} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Create New Project</p>
                <p className="text-xs text-gray-500">Start a new escrow contract now</p>
              </div>
            </div>
            <Plus size={18} className="text-gray-300" />
          </button>
          <button 
            onClick={() => alert("Go to projects page")}
            className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-[#6C5CE7] hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-[#6C5CE7] group-hover:text-white transition-colors">
                <Eye size={20} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">View All Projects</p>
                <p className="text-xs text-gray-500">Manage your entire project list</p>
              </div>
            </div>
            <Eye size={18} className="text-gray-300" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
