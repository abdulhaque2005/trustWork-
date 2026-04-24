import { useState, useEffect } from "react";
import { AlertTriangle, ShieldAlert, History, MessageSquare, ArrowRight, FileText, CheckCircle2, Lock, Clock, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const initialDisputes = [
  { id: "D-101", project: "E-commerce Website", amount: 15000, reason: "Payment not released", status: "open", date: "Oct 20", description: "The freelancer completed all milestones but the client has not released the final escrow payment for over 2 weeks.", evidence: ["invoice_42.pdf", "chat_log.png"] },
  { id: "D-102", project: "Mobile App", amount: 20000, reason: "Work not complete", status: "review", date: "Oct 18", description: "The deliverables do not match the original scope. Missing payment gateway integration.", evidence: ["scope.pdf", "app_build.apk"] }
];

const Disputes = () => {
  const [disputes, setDisputes] = useState(() => {
    const local = localStorage.getItem("disputes");
    if (local) return JSON.parse(local);
    localStorage.setItem("disputes", JSON.stringify(initialDisputes));
    return initialDisputes;
  });

  const [activeDispute, setActiveDispute] = useState(null);
  const [showRaiseForm, setShowRaiseForm] = useState(false);
  const [formData, setFormData] = useState({ project: "", amount: "", reason: "" });

  useEffect(() => {
    localStorage.setItem("disputes", JSON.stringify(disputes));
  }, [disputes]);

  const handleRaiseDispute = (e) => {
    e.preventDefault();
    if (!formData.project || !formData.amount || !formData.reason) {
      toast.error("Please fill all fields.", { style: { background: "var(--bg-main)", color: "var(--text-main)" } });
      return;
    }
    const newDispute = {
      id: `D-${Date.now().toString().slice(-4)}`,
      project: formData.project,
      amount: Number(formData.amount),
      reason: formData.reason,
      status: "open",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      description: "User raised a dispute via dashboard. Awaiting further evidence.",
      evidence: []
    };
    
    // Auto-update to update connected logic (simulate escrow freezing)
    setDisputes([newDispute, ...disputes]);
    setShowRaiseForm(false);
    setFormData({ project: "", amount: "", reason: "" });
    toast.error("Dispute Raised. Escrow Frozen 🚫", {
      icon: '🚫',
      style: {
        borderRadius: '16px', background: '#EF4444', color: '#fff', fontWeight: '700'
      }
    });
  };

  const statusConfig = {
    open: { bg: "rgba(239, 68, 68, 0.1)", text: "#EF4444", border: "rgba(239, 68, 68, 0.2)", label: "Open Dispute" },
    review: { bg: "rgba(245, 158, 11, 0.1)", text: "#F59E0B", border: "rgba(245, 158, 11, 0.2)", label: "Under Review" },
    resolved: { bg: "rgba(16, 185, 129, 0.1)", text: "#10B981", border: "rgba(16, 185, 129, 0.2)", label: "Resolved" }
  };

  const cardStyle = { backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" };
  const inputStyle = { backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      <Toaster position="top-right" />
      
      {/* HEADER */}
      <div className="p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6" style={cardStyle}>
        <div>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: "var(--text-main)" }}>Resolution Center</h1>
          <p className="font-bold" style={{ color: "var(--text-muted)" }}>Secure mediation for your Escrow contracts.</p>
        </div>
        <button 
          onClick={() => {
            setShowRaiseForm(!showRaiseForm);
            setActiveDispute(null);
          }} 
          className="px-8 py-4 bg-rose-500 text-white font-black rounded-2xl shadow-xl hover:bg-rose-600 transition-all flex items-center gap-2 active:scale-95"
        >
          <AlertTriangle size={20} /> {showRaiseForm ? "Cancel" : "Raise Dispute"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN AREA */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* RAISE DISPUTE FORM */}
            {showRaiseForm && !activeDispute && (
              <motion.form 
                key="form"
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                onSubmit={handleRaiseDispute}
                className="p-8 rounded-[32px] space-y-6 shadow-sm" style={cardStyle}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500"><ShieldAlert size={20} /></div>
                  <h2 className="text-2xl font-black text-rose-500">File a Dispute</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--text-muted)" }}>Project Name</label>
                    <input required type="text" placeholder="e.g. Website Redesign" value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} className="w-full p-4 rounded-xl font-bold text-sm outline-none" style={inputStyle} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--text-muted)" }}>Dispute Amount (₹)</label>
                    <input required type="number" placeholder="10000" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full p-4 rounded-xl font-bold text-sm outline-none" style={inputStyle} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--text-muted)" }}>Reason for Dispute</label>
                  <textarea required rows={3} placeholder="Please explain the issue..." value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full p-4 rounded-xl font-bold text-sm outline-none resize-none" style={inputStyle} />
                </div>
                <button type="submit" className="w-full py-4 bg-rose-500 text-white font-black rounded-xl shadow-xl hover:bg-rose-600 transition-all">Freeze Funds & Submit</button>
              </motion.form>
            )}

            {/* DETAILS VIEW */}
            {!showRaiseForm && activeDispute && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 rounded-[32px] space-y-8 shadow-sm" style={cardStyle}>
                <button onClick={() => setActiveDispute(null)} className="flex items-center gap-2 text-sm font-black transition-all hover:opacity-70" style={{ color: "var(--text-muted)" }}>
                  <ChevronLeft size={16} /> Back to List
                </button>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black" style={{ color: "var(--text-main)" }}>{activeDispute.project}</h2>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ backgroundColor: statusConfig[activeDispute.status].bg, color: statusConfig[activeDispute.status].text, borderColor: statusConfig[activeDispute.status].border }}>
                      {statusConfig[activeDispute.status].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xl font-black" style={{ color: "var(--accent)" }}>₹{activeDispute.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-md text-rose-500 bg-rose-500/10 text-[10px] font-black uppercase tracking-widest">
                      <Lock size={12} /> Funds Frozen
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Description</p>
                  <p className="text-sm font-bold leading-relaxed p-4 rounded-xl" style={{ backgroundColor: "var(--bg-soft)", color: "var(--text-main)" }}>{activeDispute.description}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Evidence Files</p>
                  <div className="flex gap-4">
                    {activeDispute.evidence.length > 0 ? activeDispute.evidence.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 rounded-xl border" style={{ backgroundColor: "var(--bg-soft)", borderColor: "var(--border-color)" }}>
                        <FileText size={16} style={{ color: "var(--accent)" }} />
                        <span className="text-xs font-bold" style={{ color: "var(--text-main)" }}>{file}</span>
                      </div>
                    )) : (
                      <p className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>No files attached.</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>Timeline</p>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" style={{ backgroundColor: "var(--accent)", borderColor: "var(--bg-main)" }}><CheckCircle2 size={16} color="#fff" /></div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl shadow-sm" style={{ backgroundColor: "var(--bg-soft)" }}>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-sm" style={{ color: "var(--text-main)" }}>Dispute Raised</h4>
                          <span className="text-[10px] font-black" style={{ color: "var(--text-muted)" }}>{activeDispute.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DISPUTE LIST VIEW */}
            {!showRaiseForm && !activeDispute && (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <h2 className="text-lg font-black uppercase tracking-widest px-2 mb-4" style={{ color: "var(--text-muted)" }}>Active Cases</h2>
                {disputes.map((d) => (
                  <div key={d.id} onClick={() => setActiveDispute(d)} className="p-6 rounded-[24px] shadow-sm cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md group" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-transform group-hover:scale-110" style={{ backgroundColor: statusConfig[d.status].bg, color: statusConfig[d.status].text }}>
                          {d.project.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-black text-lg" style={{ color: "var(--text-main)" }}>{d.project}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>{d.reason}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-[10px] font-black uppercase" style={{ color: "var(--text-muted)" }}>{d.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-none pt-4 md:pt-0" style={{ borderColor: "var(--border-color)" }}>
                        <p className="font-black text-lg" style={{ color: "var(--text-main)" }}>₹{d.amount.toLocaleString()}</p>
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ backgroundColor: statusConfig[d.status].bg, color: statusConfig[d.status].text, borderColor: statusConfig[d.status].border }}>
                          {statusConfig[d.status].label}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SIDEBAR WIDGETS */}
        <div className="space-y-8">
          <div className="p-8 rounded-[32px] shadow-sm space-y-6" style={cardStyle}>
            <h3 className="text-xl font-black flex items-center gap-3" style={{ color: "var(--text-main)" }}><History size={22} style={{ color: "var(--accent)" }} /> Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Total Disputes</span>
                <span className="font-black text-lg" style={{ color: "var(--text-main)" }}>{disputes.length}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Total Frozen</span>
                <span className="font-black text-lg text-rose-500">₹{disputes.filter(d => d.status !== 'resolved').reduce((acc, d) => acc + d.amount, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[32px] shadow-xl text-white space-y-4 transition-transform hover:scale-105" style={{ backgroundColor: "var(--accent)" }}>
            <MessageSquare size={32} />
            <h3 className="text-xl font-black">Need Support?</h3>
            <p className="text-sm font-bold opacity-80 leading-relaxed">Our mediation team typically resolves active issues within 24-48 hours.</p>
            <button className="w-full py-3.5 bg-white font-black rounded-xl text-xs uppercase tracking-widest transition-all hover:bg-opacity-90 active:scale-95" style={{ color: "var(--accent)" }}>Contact Mediator</button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Disputes;
