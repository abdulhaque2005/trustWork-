import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderKanban, Activity, Lock, Wallet, Clock, History } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import StatsCard from "./StatsCard.jsx";
import ProjectList from "./ProjectList.jsx";
import ChartSection from "./ChartSection.jsx";

// Initialize payment data in localStorage
const initPayments = () => {
  try {
    const stored = localStorage.getItem("payments");
    if (!stored || JSON.parse(stored).length === 0) {
      const defaultPayments = [
        { amount: 50000, status: "locked" },
        { amount: 20000, status: "released" },
        { amount: 10000, status: "locked" },
      ];
      localStorage.setItem("payments", JSON.stringify(defaultPayments));
      return defaultPayments;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Map API products to project objects
const mapProduct = (item) => {
  const statuses = ["active", "active", "pending", "completed"];
  return {
    id: `api-${item.id}`,
    name: item.title,
    budget: Math.round(item.price * 50),
    category: item.category || "General",
    progress: Math.min(Math.floor(Math.random() * 80 + 20), 100),
    status: statuses[item.id % statuses.length],
  };
};

const recentActivity = [
  { text: "New project 'E-commerce Redesign' created", time: "2 hours ago", type: "create" },
  { text: "Payment of $50,000 locked in escrow", time: "5 hours ago", type: "payment" },
  { text: "Work submitted for 'Mobile App MVP'", time: "1 day ago", type: "work" },
  { text: "Payment of $20,000 released to freelancer", time: "2 days ago", type: "release" },
  { text: "Milestone 2 approved for 'SEO Campaign'", time: "3 days ago", type: "approve" },
];

const activityDots = {
  create: "#6C5CE7",
  payment: "#F59E0B",
  work: "#22C55E",
  release: "#10B981",
  approve: "#3B82F6",
};

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pay = initPayments();
    setPayments(pay);

    fetch("https://dummyjson.com/products?limit=8")
      .then(res => res.json())
      .then(data => {
        const mapped = (data.products || []).map(mapProduct);
        setProjects(mapped);
        setLoading(false);
        toast.success("Dashboard loaded", {
          style: { borderRadius: "12px", background: "var(--bg-main)", color: "var(--text-main)", border: "1px solid var(--border-color)", fontSize: "13px", fontWeight: "700" },
          duration: 2000,
        });
      })
      .catch(() => {
        setProjects([]);
        setLoading(false);
      });
  }, []);

  const lockedAmount = payments
    .filter(p => (p.status || "").toLowerCase() === "locked")
    .reduce((a, b) => a + (b.amount || 0), 0);
  const releasedAmount = payments
    .filter(p => (p.status || "").toLowerCase() === "released")
    .reduce((a, b) => a + (b.amount || 0), 0);

  const stats = [
    { title: "Total Projects", value: projects.length, subtitle: "From marketplace", icon: FolderKanban, color: "bg-[#6C5CE7]" },
    { title: "Active Projects", value: projects.filter(p => p.status === "active").length, subtitle: "In progress", icon: Activity, color: "bg-emerald-500" },
    { title: "Escrow Locked", value: `$${lockedAmount.toLocaleString()}`, subtitle: "Secured funds", icon: Lock, color: "bg-amber-500" },
    { title: "Total Earnings", value: `$${releasedAmount.toLocaleString()}`, subtitle: "Released funds", icon: Wallet, color: "bg-blue-500" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto pb-16">
      <Toaster position="top-right" />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--text-main)" }}>
          Dashboard
        </h1>
        <p className="font-medium mt-1" style={{ color: "var(--text-muted)" }}>
          Track your projects, escrow payments, and activity in one place.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <div key={i} onClick={() => {
            if (stat.title.includes("Project")) navigate("/projects");
            else navigate("/payments");
          }}>
            <StatsCard {...stat} delay={i * 0.1} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectList projects={projects} loading={loading} />
        </div>

        <div className="space-y-6 flex flex-col">
          <ChartSection payments={payments} />

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl shadow-sm flex-1"
            style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}
          >
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2" style={{ color: "var(--text-main)" }}>
              <History size={18} style={{ color: "var(--accent, #6C5CE7)" }} />
              Recent Activity
            </h3>

            <div className="relative pl-6 space-y-6">
              <div className="absolute left-[7px] top-2 bottom-2 w-px" style={{ backgroundColor: "var(--border-color)" }} />

              {recentActivity.map((act, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="relative"
                >
                  <div
                    className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full shadow-sm"
                    style={{
                      backgroundColor: activityDots[act.type] || "#94A3B8",
                      border: "3px solid var(--bg-main)",
                    }}
                  />
                  <p className="text-sm font-bold leading-snug" style={{ color: "var(--text-main)" }}>
                    {act.text}
                  </p>
                  <p className="text-[10px] font-bold mt-1 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                    <Clock size={10} /> {act.time}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
