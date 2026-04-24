import { useSelector, useDispatch } from "react-redux";
import { CreditCard, Wallet, ArrowUpRight, ShieldCheck, History, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const Payments = () => {
  const { projects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const role = localStorage.getItem("role") || user?.role || "Client";

  // Simulate stats
  const stats = {
    totalLocked: projects.reduce((acc, p) => acc + p.milestones.filter(m => m.status === 'Locked').reduce((sum, m) => sum + m.amount, 0), 0),
    totalReleased: projects.reduce((acc, p) => acc + p.milestones.filter(m => m.status === 'Released').reduce((sum, m) => sum + m.amount, 0), 0),
    pendingApproval: projects.reduce((acc, p) => acc + p.milestones.filter(m => m.status === 'Pending').reduce((sum, m) => sum + m.amount, 0), 0),
  };

  // Compile transaction list from projects
  const transactions = [];
  projects.forEach(p => {
    p.milestones.forEach((m, idx) => {
      transactions.push({
        id: `TX-${p.id}-${idx}`,
        project: p.name,
        desc: m.title,
        amount: m.amount,
        date: m.deadline,
        status: m.status // Locked, Pending, Released, Disputed
      });
    });
  });

  const handleWithdraw = (amount) => {
    toast.success(`Successfully withdrew $${amount}! 💸`, {
      style: {
        borderRadius: "16px",
        background: "var(--bg-main)",
        color: "var(--text-main)",
        border: "1px solid var(--border-color)",
        fontWeight: "700",
      },
    });
  };

  const cardStyle = { backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" };
  const softBg = { backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)" };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <Toaster position="top-right" />
      
      {/* HEADER SECTION */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6" style={cardStyle}>
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tight" style={{ color: "var(--text-main)" }}>Financial Ledger</h1>
          <p className="font-bold" style={{ color: "var(--text-muted)" }}>Manage your escrow balances and transaction history.</p>
        </div>
        <div className="flex gap-4">
          <div className="p-4 rounded-2xl" style={softBg}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Current Role</p>
            <p className="text-lg font-black uppercase" style={{ color: "var(--accent)" }}>{role}</p>
          </div>
          {role === "Client" && (
            <button className="px-8 py-4 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all" style={{ backgroundColor: "var(--accent)" }}>
              Deposit Funds
            </button>
          )}
        </div>
      </motion.div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="p-8 rounded-[32px] space-y-4" style={cardStyle}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: "var(--bg-soft)", color: "var(--accent)", border: "1px solid var(--border-color)" }}>
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>Total Locked (Escrow) 🔒</p>
            <p className="text-3xl font-black" style={{ color: "var(--text-main)" }}>${stats.totalLocked.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="p-8 rounded-[32px] space-y-4" style={cardStyle}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10B981" }}>
            <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>{role === "Client" ? "Total Released 💰" : "Total Earned 💰"}</p>
            <p className="text-3xl font-black" style={{ color: "var(--text-main)" }}>${stats.totalReleased.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="p-8 rounded-[32px] space-y-4" style={cardStyle}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#F59E0B" }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>Pending Approval ⏳</p>
            <p className="text-3xl font-black" style={{ color: "var(--text-main)" }}>${stats.pendingApproval.toLocaleString()}</p>
          </div>
        </motion.div>
      </div>

      {/* TRANSACTIONS SECTION */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-8 rounded-[32px] shadow-sm space-y-8" style={cardStyle}>
        <h3 className="text-2xl font-black flex items-center gap-3" style={{ color: "var(--text-main)" }}>
          <History size={26} style={{ color: "var(--accent)" }} /> Transaction History
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[12px] font-black uppercase tracking-widest border-b" style={{ color: "var(--text-muted)", borderColor: "var(--border-color)" }}>
                <th className="pb-6">ID</th>
                <th className="pb-6">Project & Milestone</th>
                <th className="pb-6">Deadline</th>
                <th className="pb-6">Status</th>
                <th className="pb-6 text-right">Amount</th>
                {role === "Freelancer" && <th className="pb-6 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: "var(--border-color)" }}>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center font-bold" style={{ color: "var(--text-muted)" }}>No transactions found.</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="group transition-all hover:bg-black/5 dark:hover:bg-white/5">
                    <td className="py-6 px-2 font-black" style={{ color: "var(--text-muted)" }}>{tx.id}</td>
                    <td className="py-6 px-2">
                      <p className="font-bold" style={{ color: "var(--text-main)" }}>{tx.project}</p>
                      <p className="text-[10px] font-black uppercase mt-1" style={{ color: "var(--text-muted)" }}>{tx.desc}</p>
                    </td>
                    <td className="py-6 px-2 text-sm font-bold" style={{ color: "var(--text-muted)" }}>{tx.date}</td>
                    <td className="py-6 px-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{
                        backgroundColor: tx.status === 'Released' ? 'rgba(16, 185, 129, 0.1)' : tx.status === 'Disputed' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: tx.status === 'Released' ? '#10B981' : tx.status === 'Disputed' ? '#EF4444' : '#F59E0B',
                        borderColor: tx.status === 'Released' ? 'rgba(16, 185, 129, 0.2)' : tx.status === 'Disputed' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'
                      }}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-6 px-2 text-right font-black" style={{ color: tx.status === 'Released' ? '#10B981' : 'var(--text-main)' }}>
                      ${tx.amount.toLocaleString()}
                    </td>
                    {role === "Freelancer" && (
                      <td className="py-6 px-2 text-right">
                        {tx.status === "Released" ? (
                          <button 
                            onClick={() => handleWithdraw(tx.amount)}
                            className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-white transition-all hover:opacity-90 active:scale-95"
                            style={{ backgroundColor: "#10B981" }}
                          >
                            Withdraw
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Payments;
