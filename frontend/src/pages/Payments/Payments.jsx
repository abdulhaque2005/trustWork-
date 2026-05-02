import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments } from "../../store/slices/paymentSlice";
import { motion } from "framer-motion";
import SEO from "../../components/common/SEO";
import { DollarSign, Lock, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const statusConfig = {
  locked:{ bg:"#F59E0B15", color:"#F59E0B", label:"Locked", icon:Lock },
  pending:{ bg:"#3B82F615", color:"#3B82F6", label:"Pending", icon:Clock },
  released:{ bg:"#22C55E15", color:"#22C55E", label:"Released", icon:CheckCircle2 },
  disputed:{ bg:"#EF444415", color:"#EF4444", label:"Disputed", icon:AlertTriangle },
  refunded:{ bg:"#64748B15", color:"#64748B", label:"Refunded", icon:DollarSign },
};

const Payments = () => {
  const dispatch = useDispatch();
  const { payments, summary, loading } = useSelector(s => s.payments);
  const { user } = useSelector(s => s.auth);
  const role = (user?.role || localStorage.getItem("role") || "client").toLowerCase();
  const isFreelancer = role === "freelancer";

  useEffect(() => { dispatch(fetchPayments()); }, [dispatch]);

  const pieData = [
    { name:"Locked", value:summary.locked || 0 },
    { name:"Pending", value:summary.pending || 0 },
    { name:"Released", value:summary.released || 0 },
    { name:"Disputed", value:summary.disputed || 0 },
  ].filter(d => d.value > 0);
  const pieColors = ["#F59E0B","#3B82F6","#22C55E","#EF4444"];

  const stats = isFreelancer ? [
    { label:"Total Earned", value:summary.released, color:"#22C55E", icon:DollarSign },
    { label:"Pending", value:summary.pending, color:"#3B82F6", icon:Clock },
  ] : [
    { label:"Total Invested", value:summary.total, color:"#6C5CE7", icon:DollarSign },
    { label:"Locked", value:summary.locked, color:"#F59E0B", icon:Lock },
    { label:"Released", value:summary.released, color:"#22C55E", icon:CheckCircle2 },
    { label:"Disputed", value:summary.disputed, color:"#EF4444", icon:AlertTriangle },
  ];

  return (
    <div className="max-w-[1200px] mx-auto pb-20">
      <SEO title="Payments" description="Manage your escrow payments on EscrowFlow" />
      <h1 className="text-3xl font-black mb-2" style={{color:"var(--text-main)"}}>{isFreelancer ? "My Earnings" : "Payments & Escrow"}</h1>
      <p className="text-sm font-semibold mb-8" style={{color:"var(--text-muted)"}}>{payments.length} transaction(s)</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s,i) => (
          <motion.div key={s.label} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
            className="p-5 rounded-2xl" style={{backgroundColor:"var(--bg-main)",border:"1px solid var(--border-color)"}}>
            <div className="p-2 rounded-xl w-fit mb-3" style={{backgroundColor:`${s.color}15`,color:s.color}}><s.icon size={18}/></div>
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{color:"var(--text-muted)"}}>{s.label}</p>
            <p className="text-xl font-black" style={{color:"var(--text-main)"}}>${(s.value||0).toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pie Chart */}
        <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
          className="p-6 rounded-3xl" style={{backgroundColor:"var(--bg-main)",border:"1px solid var(--border-color)"}}>
          <h3 className="text-base font-black mb-4" style={{color:"var(--text-main)"}}>Distribution</h3>
          {pieData.length > 0 ? (
            <>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {pieData.map((_,i)=><Cell key={i} fill={pieColors[i]}/>)}</Pie><Tooltip/></PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-3">
                {pieData.map((d,i)=>(
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor:pieColors[i]}}/>
                    <span className="text-[10px] font-bold" style={{color:"var(--text-muted)"}}>{d.name}: ${d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-sm text-center py-8" style={{color:"var(--text-muted)"}}>No payment data yet</p>}
        </motion.div>

        {/* Transaction List */}
        <div className="lg:col-span-2">
          <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
            className="p-6 rounded-3xl" style={{backgroundColor:"var(--bg-main)",border:"1px solid var(--border-color)"}}>
            <h3 className="text-base font-black mb-4" style={{color:"var(--text-main)"}}>Transactions</h3>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 rounded-xl animate-pulse" style={{backgroundColor:"var(--bg-soft)"}}/>)}</div>
            ) : payments.length === 0 ? (
              <p className="text-sm text-center py-8" style={{color:"var(--text-muted)"}}>No transactions yet</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {payments.map((p,i) => {
                  const sc = statusConfig[p.status] || statusConfig.pending;
                  return (
                    <div key={p._id||i} className="flex items-center justify-between p-4 rounded-xl" style={{backgroundColor:"var(--bg-soft)"}}>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate" style={{color:"var(--text-main)"}}>{p.projectId?.title || "Project"}</p>
                        <p className="text-[10px]" style={{color:"var(--text-muted)"}}>{p.milestoneId?.title || "Milestone"} • {new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black" style={{color:"var(--text-main)"}}>${(p.amount||0).toLocaleString()}</span>
                        <span className="text-[9px] font-bold px-2 py-1 rounded-full" style={{backgroundColor:sc.bg,color:sc.color}}>{sc.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
