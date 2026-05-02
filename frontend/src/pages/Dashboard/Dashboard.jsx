import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats, fetchProjects } from "../../store/slices/projectSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../../components/common/SEO";
import {
  TrendingUp, Wallet, Briefcase, Activity,
  ArrowUpRight, Clock, CheckCircle2, Plus, Search,
  DollarSign, FolderCheck, AlertTriangle, Users, Shield,
  XCircle, Timer
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import ProjectList from "./ProjectList";
import toast, { Toaster } from "react-hot-toast";

const StatCard = ({ title, value, icon: Icon, trend, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" }}
    className="p-6 rounded-3xl shadow-sm flex flex-col justify-between h-full cursor-default"
    style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-2xl" style={{ backgroundColor: `${color}15`, color }}>
        <Icon size={22} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
          <ArrowUpRight size={11} /> {trend}
        </div>
      )}
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: "var(--text-muted)" }}>{title}</p>
      <h3 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, projects, loading } = useSelector((s) => s.projects);
  const { user } = useSelector((s) => s.auth);

  const role = (user?.role || localStorage.getItem("role") || "client").toLowerCase();
  const isAdmin = role === "admin";
  const isFreelancer = role === "freelancer";
  const isClient = role === "client";
  const userName = user?.name || "User";

  const [dummyProjects, setDummyProjects] = useState([]);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchProjects());
    if (isFreelancer) {
      fetch("https://dummyjson.com/products?limit=8")
        .then(res => res.json())
        .then(data => {
          const transformed = data.products.map(p => ({
            _id: `pub-${p.id}`,
            title: p.title,
            budget: p.price * 10,
            deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
            description: p.description,
            status: "new",
            progress: 0,
            freelancerId: null,
          }));
          setDummyProjects(transformed);
        })
        .catch(() => {});
    }
  }, [dispatch, isFreelancer]);

  const displayProjects = projects;
  const activityFeed = [];

  const chartData = displayProjects.slice(0, 6).map(p => ({
    name: (p.title || "Project").slice(0, 12),
    progress: p.progress || 0,
    budget: ((p.budget || 0) / 1000),
  }));

  const pieData = isAdmin
    ? [
        { name: "Active", value: stats?.activeProjects || 0 },
        { name: "Completed", value: stats?.completedProjects || 0 },
        { name: "Open", value: stats?.openProjects || 0 },
        { name: "Disputed", value: stats?.disputedProjects || 0 },
      ]
    : isFreelancer
    ? [
        { name: "Earned", value: stats?.totalEarned || 0 },
        { name: "Pending", value: stats?.pendingPayments || 0 },
      ]
    : [
        { name: "Locked", value: stats?.lockedAmount || 0 },
        { name: "Released", value: stats?.releasedAmount || 0 },
      ];

  const pieColors = isAdmin ? ["#22C55E", "#8B5CF6", "#3B82F6", "#EF4444"] : isFreelancer ? ["#10B981", "#F59E0B"] : ["#6C5CE7", "#10B981"];

  const seoTitle = isAdmin ? "Admin Dashboard" : isFreelancer ? "Freelancer Dashboard" : "Client Dashboard";

  return (
    <div className="max-w-[1400px] mx-auto pb-24 space-y-8">
      <SEO title={seoTitle} description={`${seoTitle} - Manage your EscrowFlow projects, payments, and team.`} />
      <Toaster position="top-right" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: "var(--text-main)" }}>
            {isAdmin ? "Admin Panel" : isFreelancer ? `Hey, ${userName}` : `Welcome Back, ${userName}`}
          </h1>
          <p className="font-semibold mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {isAdmin ? "Monitor platform activity, resolve disputes, and manage users." : isFreelancer ? "Your work overview and pending tasks." : "Manage your projects, escrow, and team."}
          </p>
        </div>
        {isClient && (
          <button onClick={() => navigate("/create-project")} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-all active:scale-95 text-sm flex items-center gap-2">
            <Plus size={16} /> New Project
          </button>
        )}
        {isFreelancer && (
          <button onClick={() => navigate("/projects")} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all active:scale-95 text-sm flex items-center gap-2">
            <Search size={16} /> Find Projects
          </button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isAdmin ? (
          <>
            <StatCard delay={0.1} title="Total Projects" value={stats?.totalProjects || 0} icon={Briefcase} trend={stats?.totalProjects > 0 ? "+12%" : ""} color="#6C5CE7" />
            <StatCard delay={0.15} title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="#3B82F6" />
            <StatCard delay={0.2} title="Revenue Released" value={`$${(stats?.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} trend={stats?.totalRevenue > 0 ? "+18%" : ""} color="#10B981" />
            <StatCard delay={0.25} title="Open Disputes" value={stats?.openDisputes || 0} icon={AlertTriangle} color="#EF4444" />
          </>
        ) : isFreelancer ? (
          <>
            <StatCard delay={0.1} title="Active Gigs" value={stats?.activeProjects || 0} icon={Briefcase} trend={stats?.activeProjects > 0 ? "+8%" : ""} color="#6C5CE7" />
            <StatCard delay={0.15} title="Total Earned" value={`$${(stats?.totalEarned || 0).toLocaleString()}`} icon={TrendingUp} trend={stats?.totalEarned > 0 ? "+22%" : ""} color="#10B981" />
            <StatCard delay={0.2} title="Pending Payments" value={`$${(stats?.pendingPayments || 0).toLocaleString()}`} icon={Wallet} trend={stats?.pendingPayments > 0 ? "+5%" : ""} color="#F59E0B" />
            <StatCard delay={0.25} title="Completed" value={stats?.completedProjects || 0} icon={CheckCircle2} color="#8B5CF6" />
          </>
        ) : (
          <>
            <StatCard delay={0.1} title="Active Projects" value={stats?.activeProjects || 0} icon={Briefcase} trend={stats?.activeProjects > 0 ? "+12%" : ""} color="#6C5CE7" />
            <StatCard delay={0.15} title="Total Invested" value={`$${(stats?.totalInvested || 0).toLocaleString()}`} icon={DollarSign} trend={stats?.totalInvested > 0 ? "+18%" : ""} color="#10B981" />
            <StatCard delay={0.2} title="Escrow Locked" value={`$${(stats?.lockedAmount || 0).toLocaleString()}`} icon={Wallet} color="#F59E0B" />
            <StatCard delay={0.25} title="Released" value={`$${(stats?.releasedAmount || 0).toLocaleString()}`} icon={FolderCheck} color="#8B5CF6" />
          </>
        )}
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard delay={0.3} title="Active Projects" value={stats?.activeProjects || 0} icon={Activity} color="#22C55E" />
          <StatCard delay={0.35} title="Expired Projects" value={stats?.expiredProjects || 0} icon={Timer} color="#F97316" />
          <StatCard delay={0.4} title="Locked Funds" value={`$${(stats?.lockedFunds || 0).toLocaleString()}`} icon={Wallet} color="#EAB308" />
          <StatCard delay={0.45} title="Disputed Funds" value={`$${(stats?.disputedFunds || 0).toLocaleString()}`} icon={XCircle} color="#DC2626" />
        </div>
      )}

      {isClient && (stats?.expiredProjects > 0) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-2xl border border-orange-300 bg-orange-50 dark:bg-orange-500/10 flex items-center gap-3">
          <AlertTriangle className="text-orange-500 flex-shrink-0" size={20} />
          <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
            You have <span className="font-black">{stats.expiredProjects}</span> expired project(s). Please review and take action.
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="p-7 rounded-3xl shadow-sm" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
            <h3 className="text-lg font-black mb-6" style={{ color: "var(--text-main)" }}>
              {isAdmin ? "Platform Overview" : isFreelancer ? "My Work Progress" : "Project Performance"}
            </h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} />
                  <Bar dataKey="progress" fill={isAdmin ? "#3B82F6" : isFreelancer ? "#10B981" : "#6C5CE7"} radius={[8, 8, 0, 0]} barSize={32} />
                  <Bar dataKey="budget" fill={isAdmin ? "#8B5CF6" : isFreelancer ? "#F59E0B" : "#A78BFA"} radius={[8, 8, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {!isAdmin && <ProjectList projects={displayProjects} dummyProjects={dummyProjects} loading={loading && projects.length === 0 && dummyProjects.length === 0} role={role} />}

          {isAdmin && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="p-7 rounded-3xl shadow-sm" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black" style={{ color: "var(--text-main)" }}>All Projects</h3>
                <button onClick={() => navigate("/projects")} className="text-xs font-bold px-4 py-2 rounded-xl" style={{ backgroundColor: "var(--accent)", color: "white" }}>View All</button>
              </div>
              <div className="space-y-3">
                {displayProjects.slice(0, 6).map((p) => {
                  const sc = statusColor(p.status);
                  return (
                    <div key={p._id} onClick={() => navigate(`/workspace/${p._id}`)} className="flex items-center justify-between p-4 rounded-2xl cursor-pointer hover:shadow-md transition-all" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)" }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: "var(--text-main)" }}>{p.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Budget: ${(p.budget || 0).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${p.progress || 0}%`, backgroundColor: sc.color }}></div>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-7">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="p-6 rounded-3xl shadow-sm" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
            <h3 className="text-base font-black mb-4" style={{ color: "var(--text-main)" }}>Quick Actions</h3>
            <div className="space-y-2.5">
              {isAdmin ? (
                <>
                  <ActionBtn icon={Shield} label="Manage Disputes" color="#EF4444" onClick={() => navigate("/disputes")} />
                  <ActionBtn icon={Users} label="View All Users" color="#3B82F6" onClick={() => navigate("/team")} />
                  <ActionBtn icon={DollarSign} label="Payment Overview" color="#10B981" onClick={() => navigate("/payments")} />
                </>
              ) : isFreelancer ? (
                <>
                  <ActionBtn icon={Search} label="Browse Projects" color="#6C5CE7" onClick={() => navigate("/projects")} />
                  <ActionBtn icon={Wallet} label="View Earnings" color="#10B981" onClick={() => navigate("/payments")} />
                  <ActionBtn icon={AlertTriangle} label="Resolution Center" color="#EF4444" onClick={() => navigate("/disputes")} />
                </>
              ) : (
                <>
                  <ActionBtn icon={Plus} label="Create New Project" color="#6C5CE7" onClick={() => navigate("/create-project")} />
                  <ActionBtn icon={DollarSign} label="Deposit Funds" color="#10B981" onClick={() => navigate("/payments")} />
                  <ActionBtn icon={AlertTriangle} label="Raise Dispute" color="#EF4444" onClick={() => navigate("/disputes")} />
                </>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="p-6 rounded-3xl shadow-sm" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
            <h3 className="text-base font-black mb-4" style={{ color: "var(--text-main)" }}>
              {isAdmin ? "Project Distribution" : isFreelancer ? "Earnings Breakdown" : "Escrow Distribution"}
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={78} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-3 flex-wrap">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                  <span className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>{d.name}: {typeof d.value === 'number' && d.value > 100 ? `$${d.value.toLocaleString()}` : d.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="p-6 rounded-3xl shadow-sm" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
            <h3 className="text-base font-black mb-5" style={{ color: "var(--text-main)" }}>
              {isAdmin ? "Platform Activity" : "Recent Activity"}
            </h3>
            <div className="space-y-5">
              {activityFeed.length > 0 ? activityFeed.slice(0, 5).map((item, i) => (
                <div key={item.id || i} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden">
                    <img src={item.avatar || `https://i.pravatar.cc/80?img=${i + 10}`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold leading-tight" style={{ color: "var(--text-main)" }}>
                      <span style={{ color: "var(--accent)" }}>{item.user || "System"}</span>{" "}{item.action || "performed an action"}
                    </p>
                    <p className="text-[10px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{item.target || ""}</p>
                    <div className="flex items-center gap-1 mt-1" style={{ color: "var(--text-muted)" }}>
                      <Clock size={9} />
                      <span className="text-[9px] font-semibold">{item.time || "Just now"}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-xs font-bold text-center py-4" style={{ color: "var(--text-muted)" }}>No recent activity to show.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ActionBtn = ({ icon: Icon, label, color, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]" style={{ backgroundColor: `${color}12`, color }}>
    <Icon size={16} /> {label}
  </button>
);

const statusColor = (status) => {
  const map = {
    active: { bg: "#22C55E15", color: "#22C55E", label: "Active" },
    "in-progress": { bg: "#3B82F615", color: "#3B82F6", label: "In Progress" },
    open: { bg: "#6C5CE715", color: "#6C5CE7", label: "Open" },
    pending: { bg: "#F59E0B15", color: "#F59E0B", label: "Pending" },
    completed: { bg: "#8B5CF615", color: "#8B5CF6", label: "Completed" },
    disputed: { bg: "#EF444415", color: "#EF4444", label: "Disputed" },
    expired: { bg: "#F9731615", color: "#F97316", label: "Expired" },
  };
  return map[status] || map.pending;
};



export default Dashboard;
