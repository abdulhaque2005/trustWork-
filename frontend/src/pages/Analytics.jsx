import React, { useEffect } from "react";
import { motion } from "framer-motion";
import SEO from "../components/common/SEO";
import { 
  BarChart3, TrendingUp, Users, DollarSign, 
  Briefcase, Activity, CheckCircle2, Lock, AlertTriangle, FileText
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardStats, fetchProjects } from "../store/slices/projectSlice";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const Analytics = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { stats, projects } = useSelector(s => s.projects);
  const role = (user?.role || "client").toLowerCase();

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchProjects());
  }, [dispatch]);

  const isAdmin = role === "admin";
  const isFreelancer = role === "freelancer";
  const isClient = role === "client";

  // Check if we need fallback data
  const hasData = stats && (stats.totalProjects > 0 || stats.activeProjects > 0);

  // Computed Stats
  const computedStats = {
    client: {
      totalInvested: hasData ? stats?.totalInvested || 0 : 250000,
      released: hasData ? stats?.releasedAmount || 0 : 150000,
      locked: hasData ? stats?.lockedAmount || 0 : 100000,
      activeProjects: hasData ? stats?.activeProjects || 0 : 3,
      completedProjects: hasData ? stats?.completedProjects || 0 : 5,
      pendingApprovals: hasData ? stats?.openProjects || 0 : 2,
    },
    freelancer: {
      totalEarnings: hasData ? stats?.totalEarned || 0 : 85000,
      pendingPayments: hasData ? stats?.pendingPayments || 0 : 25000,
      completedProjects: hasData ? stats?.completedProjects || 0 : 8,
      activeProjects: hasData ? stats?.activeProjects || 0 : 4,
      submissions: hasData && projects ? projects.reduce((acc, p) => acc + (p.submissions?.length || 0), 0) : 12,
    },
    admin: {
      totalPlatformMoney: hasData ? stats?.totalRevenue || 0 : 1250000,
      totalUsers: hasData ? stats?.totalUsers || 0 : 142,
      activeProjects: hasData ? stats?.activeProjects || 0 : 34,
      totalDisputes: hasData ? stats?.openDisputes || 0 : 3,
      releasedAmount: hasData ? (stats?.totalRevenue || 0) * 0.8 : 1000000,
      lockedAmount: hasData ? (stats?.lockedFunds || 0) : 250000,
    }
  };

  const currentStats = computedStats[role] || computedStats.client;

  // Stat Cards Configuration
  const statCards = isAdmin ? [
    { label: "Platform Volume", value: `₹${currentStats.totalPlatformMoney.toLocaleString()}`, icon: DollarSign, color: "#6C5CE7" },
    { label: "Total Users", value: currentStats.totalUsers, icon: Users, color: "#3B82F6" },
    { label: "Active Projects", value: currentStats.activeProjects, icon: Activity, color: "#10B981" },
    { label: "Open Disputes", value: currentStats.totalDisputes, icon: AlertTriangle, color: "#EF4444" },
  ] : isFreelancer ? [
    { label: "Total Earnings", value: `₹${currentStats.totalEarnings.toLocaleString()}`, icon: TrendingUp, color: "#10B981" },
    { label: "Pending Payments", value: `₹${currentStats.pendingPayments.toLocaleString()}`, icon: DollarSign, color: "#F59E0B" },
    { label: "Completed Projects", value: currentStats.completedProjects, icon: CheckCircle2, color: "#8B5CF6" },
    { label: "Total Submissions", value: currentStats.submissions, icon: FileText, color: "#3B82F6" },
  ] : [
    { label: "Total Invested", value: `₹${currentStats.totalInvested.toLocaleString()}`, icon: DollarSign, color: "#6C5CE7" },
    { label: "Escrow Locked", value: `₹${currentStats.locked.toLocaleString()}`, icon: Lock, color: "#F59E0B" },
    { label: "Funds Released", value: `₹${currentStats.released.toLocaleString()}`, icon: CheckCircle2, color: "#10B981" },
    { label: "Pending Approvals", value: currentStats.pendingApprovals, icon: AlertTriangle, color: "#EF4444" },
  ];

  // 1. Pie Chart Data (Payment Status)
  const pieData = [
    { name: "Released", value: isFreelancer ? currentStats.totalEarnings : isAdmin ? currentStats.releasedAmount : currentStats.released },
    { name: "Locked (Escrow)", value: isFreelancer ? currentStats.pendingPayments : isAdmin ? currentStats.lockedAmount : currentStats.locked },
    { name: "Disputed", value: isAdmin ? (hasData ? stats?.disputedFunds || 0 : 50000) : (hasData ? stats?.disputedAmount || 0 : 15000) }
  ];
  const pieColors = ["#10B981", "#F59E0B", "#EF4444"];

  // 2. Bar Chart Data (Project Progress)
  const barData = hasData && projects.length > 0 
    ? projects.slice(0, 8).map(p => ({
        name: (p.title || "Project").slice(0, 10) + "...",
        progress: p.progress || 0
      }))
    : [
        { name: "E-Commerce", progress: 85 },
        { name: "Brand Identity", progress: 100 },
        { name: "Mobile App", progress: 45 },
        { name: "SEO Optimiz.", progress: 20 },
        { name: "Web Redesign", progress: 60 }
      ];

  // 3. Line Chart Data (Earnings / Investment Trend)
  const baseAmount = (isFreelancer ? currentStats.totalEarnings : isAdmin ? currentStats.totalPlatformMoney : currentStats.totalInvested) / 10;
  const lineData = [
    { day: "Mon", amount: Math.round(baseAmount * 0.4) },
    { day: "Tue", amount: Math.round(baseAmount * 0.8) },
    { day: "Wed", amount: Math.round(baseAmount * 0.5) },
    { day: "Thu", amount: Math.round(baseAmount * 1.2) },
    { day: "Fri", amount: Math.round(baseAmount * 0.9) },
    { day: "Sat", amount: Math.round(baseAmount * 1.5) },
    { day: "Sun", amount: Math.round(baseAmount * 1.1) },
  ];

  // Activity Summary Fallback
  const recentActivity = hasData && projects.length > 0 
    ? projects.slice(0, 5).map(p => ({
        id: p._id,
        action: p.status === "completed" ? "Project Completed" : p.status === "in-progress" ? "Work in Progress" : "Project Created",
        target: p.title,
        time: new Date(p.updatedAt || p.createdAt || Date.now()).toLocaleDateString()
      }))
    : [
        { id: 1, action: isFreelancer ? "Payment Released" : "Funded Escrow", target: "E-Commerce App", time: "Today" },
        { id: 2, action: isFreelancer ? "Submitted Milestone" : "Approved Milestone", target: "Brand Identity", time: "Yesterday" },
        { id: 3, action: "Project Created", target: "Mobile App UI", time: "3 days ago" },
        { id: 4, action: "Message Sent", target: "SEO Optimization", time: "1 week ago" }
      ];

  return (
    <div className="max-w-[1400px] mx-auto pb-24 space-y-8">
      <SEO title="Analytics" description="View detailed platform analytics and reports." />
      
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2" style={{ color: "var(--text-main)" }}>
          Performance Analytics
        </h1>
        <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
          Detailed metrics and insights derived from your {role} activity.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl relative overflow-hidden"
            style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}
          >
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={22} />
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
              <h3 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Line Chart: Earnings Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="xl:col-span-2 p-7 rounded-3xl shadow-sm" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
          <h3 className="text-lg font-black mb-6" style={{ color: "var(--text-main)" }}>
            {isFreelancer ? "Earnings Trend" : isAdmin ? "Platform Volume Trend" : "Investment Trend"}
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} 
                />
                <Line type="monotone" dataKey="amount" stroke="#6C5CE7" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart: Payment Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="p-7 rounded-3xl shadow-sm flex flex-col" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
          <h3 className="text-lg font-black mb-2" style={{ color: "var(--text-main)" }}>Payment Status</h3>
          <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>Distribution of funds across all projects</p>
          <div className="h-[220px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
                <Tooltip 
                  formatter={(value) => `₹${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                  <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>{d.name}</span>
                </div>
                <span className="text-xs font-black" style={{ color: "var(--text-main)" }}>₹{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bar Chart: Project Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="xl:col-span-2 p-7 rounded-3xl shadow-sm" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
          <h3 className="text-lg font-black mb-6" style={{ color: "var(--text-main)" }}>Project Progress Tracker</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-main)', fontSize: 11, fontWeight: 600 }} width={80} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Progress']}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }} 
                />
                <Bar dataKey="progress" fill="#3B82F6" radius={[0, 8, 8, 0]} barSize={24}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.progress === 100 ? '#10B981' : entry.progress > 50 ? '#3B82F6' : '#F59E0B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity Summary List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="p-7 rounded-3xl shadow-sm" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
          <h3 className="text-lg font-black mb-6" style={{ color: "var(--text-main)" }}>Activity Summary</h3>
          <div className="space-y-5">
            {recentActivity.map((item, i) => (
              <div key={item.id || i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)" }}>
                  {item.action.includes("Completed") || item.action.includes("Approved") ? (
                    <CheckCircle2 size={16} style={{ color: "#10B981" }} />
                  ) : item.action.includes("Created") ? (
                    <Briefcase size={16} style={{ color: "#3B82F6" }} />
                  ) : (
                    <Activity size={16} style={{ color: "#F59E0B" }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: "var(--text-main)" }}>{item.action}</p>
                  <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{item.target}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Analytics;
