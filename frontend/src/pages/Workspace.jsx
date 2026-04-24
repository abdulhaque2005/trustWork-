import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { releaseMilestone } from "../store/slices/projectSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ShieldCheck, Clock, Wallet, CheckCircle2, MessageSquare, FileText, MoreVertical, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Workspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const project = projects.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState("milestones");

  if (!project) return (
    <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 animate-pulse"><ShieldCheck size={40} /></div>
      <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>Project Not Found</h2>
      <button onClick={() => navigate("/dashboard")} className="btn-primary px-8 py-3 rounded-xl font-bold">Back to Dashboard</button>
    </div>
  );

  const handleRelease = (milestoneId) => {
    dispatch(releaseMilestone({ projectId: project.id, milestoneId }));
    toast.success("Payment Released! 💰", { style: { borderRadius: '16px', background: '#1e293b', color: '#fff' } });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      <Toaster position="top-right" />
      
      {/* HEADER */}
      <div className="p-8 rounded-[40px] shadow-sm relative overflow-hidden" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C5CE7] opacity-[0.03] rounded-full blur-[80px] -mr-32 -mt-32" />
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold hover:text-[#6C5CE7] mb-6 transition-colors" style={{ color: "var(--text-muted)" }}>
          <ChevronLeft size={20} /> Back
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-[#6C5CE7]/10 text-[#6C5CE7] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#6C5CE7]/20">{project.status}</span>
              <span style={{ color: "var(--text-muted)" }} className="text-sm font-bold">{project.category}</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight" style={{ color: "var(--text-main)" }}>{project.name}</h1>
            <div className="flex items-center gap-6">
              <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>{project.client}</p>
              <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}><Clock size={16} /><p className="text-sm font-bold">Updated 2h ago</p></div>
            </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-8 py-4 font-black rounded-2xl transition-all flex items-center justify-center gap-2" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }}>
              <MessageSquare size={20} /> Chat
            </button>
            <button className="flex-1 md:flex-none px-8 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2">
              <ShieldCheck size={20} /> Resolution
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-[32px] shadow-sm overflow-hidden" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
            <div className="flex" style={{ borderBottom: "1px solid var(--border-color)" }}>
              {["milestones", "submissions", "files"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-5 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-[#6C5CE7] border-b-4 border-[#6C5CE7]' : ''}`}
                  style={{ color: activeTab === tab ? undefined : "var(--text-muted)" }}
                >{tab}</button>
              ))}
            </div>
            <div className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === "milestones" && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    {project.milestones?.map((m, idx) => (
                      <div key={m.id} className="group relative flex gap-6">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 ${m.status === 'Released' ? 'bg-emerald-500 text-white' : ''}`}
                            style={m.status !== 'Released' ? { backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-muted)" } : {}}
                          >
                            {m.status === 'Released' ? <CheckCircle2 size={20} /> : <span className="font-black text-sm">{idx + 1}</span>}
                          </div>
                          {idx !== project.milestones.length - 1 && <div className="w-0.5 h-full my-2" style={{ backgroundColor: "var(--border-color)" }} />}
                        </div>
                        <div className="flex-1 p-6 rounded-3xl transition-all" style={{ backgroundColor: m.status === 'Released' ? '#22C55E08' : "var(--bg-main)", border: `1px solid ${m.status === 'Released' ? '#22C55E20' : 'var(--border-color)'}` }}>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-black mb-1" style={{ color: "var(--text-main)" }}>{m.title}</h4>
                              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>${m.amount} • Due Oct 2{idx + 5}</p>
                            </div>
                            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: m.status === 'Released' ? '#22C55E15' : '#F59E0B15', color: m.status === 'Released' ? '#16a34a' : '#d97706' }}>{m.status}</span>
                          </div>
                          {m.status === 'Locked' && (
                            <button onClick={() => handleRelease(m.id)} className="w-full py-3 bg-[#6C5CE7] text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-[#4834D4] shadow-lg transition-all flex items-center justify-center gap-2">
                              Release Payment <ArrowRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-br from-[#6C5CE7] to-[#4834D4] p-8 rounded-[40px] shadow-2xl text-white space-y-6 overflow-hidden relative">
            <Wallet className="absolute top-0 right-0 opacity-10 -mr-4 -mt-4" size={140} />
            <p className="text-indigo-100 text-xs font-black uppercase tracking-widest">Escrow Summary</p>
            <h3 className="text-4xl font-black">${project.totalAmount}</h3>
            <p className="text-indigo-200 text-sm font-bold">Total Budget Locked 🔒</p>
          </div>
          <div className="p-8 rounded-[32px] shadow-sm space-y-6" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
            <h3 className="text-xl font-black flex items-center gap-3" style={{ color: "var(--text-main)" }}><FileText size={22} className="text-[#6C5CE7]" /> Documents</h3>
            {["contract_v2.pdf", "specs_final.docx"].map((file, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)" }}>
                <div className="flex items-center gap-3">
                  <FileText size={18} style={{ color: "var(--text-muted)" }} />
                  <span className="text-xs font-bold" style={{ color: "var(--text-main)" }}>{file}</span>
                </div>
                <MoreVertical size={16} style={{ color: "var(--text-muted)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
