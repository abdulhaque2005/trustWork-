import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProject } from "../store/slices/projectSlice.js";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, FileText, CalendarDays, CheckCircle2, IndianRupee, LayoutGrid, Check, Info } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    budget: "",
    deadline: "",
    description: "",
  });

  const handleQuickBudget = (val) => setFormData({ ...formData, budget: val });
  const handleQuickDeadline = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setFormData({ ...formData, deadline: d.toISOString().split("T")[0] });
  };

  const handleNext = () => {
    if (!formData.title || !formData.budget || !formData.deadline) {
      toast.error("Please fill Title, Budget, and Deadline.", {
        style: { borderRadius: "12px", background: "var(--bg-main)", color: "var(--text-main)", border: "1px solid var(--border-color)", fontWeight: "bold" },
      });
      return;
    }
    setStep(2);
  };

  const handleSubmit = () => {
    const project = {
      name: formData.title,
      description: formData.description || "No description provided.",
      category: "General",
      client: user?.fullName || "Client",
      totalAmount: Number(formData.budget),
      status: "Active",
      progress: 0,
      milestones: [
        {
          id: `M1`,
          title: "Project Delivery",
          amount: Number(formData.budget),
          deadline: formData.deadline,
          status: "Locked",
        }
      ],
    };

    dispatch(addProject(project));
    toast.success("Project Created Fast! 🚀", {
      style: {
        borderRadius: "16px",
        background: "var(--bg-main)",
        color: "var(--text-main)",
        border: "1px solid var(--border-color)",
        fontWeight: "700",
      },
    });
    setTimeout(() => navigate("/projects"), 1000);
  };

  const inputStyle = {
    backgroundColor: "var(--bg-main)",
    border: "2px solid var(--border-color)",
    color: "var(--text-main)",
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in duration-700">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3" style={{ color: "var(--text-main)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: "var(--accent)" }}>
              <Rocket size={20} />
            </div>
            Create New Project
          </h1>
          <p className="font-bold mt-2" style={{ color: "var(--text-muted)" }}>Set up your workspace and escrow terms instantly.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR - PROGRESS & TIPS */}
        <div className="lg:w-1/3 space-y-6">
          <div className="p-8 rounded-[32px] shadow-sm relative overflow-hidden" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
            
            {/* Progress Stepper */}
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[var(--accent)] before:via-[var(--border-color)] before:to-transparent">
              
              <div className="relative flex items-center gap-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all shadow-md" style={{ backgroundColor: step >= 1 ? "var(--accent)" : "var(--bg-soft)", color: step >= 1 ? "#fff" : "var(--text-muted)", border: step >= 1 ? "none" : "2px solid var(--border-color)" }}>
                  {step > 1 ? <Check size={20} /> : <span className="font-black">1</span>}
                </div>
                <div>
                  <h4 className="font-black text-sm" style={{ color: step >= 1 ? "var(--text-main)" : "var(--text-muted)" }}>Basic Details</h4>
                  <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>Title, Budget & Timeline</p>
                </div>
              </div>

              <div className="relative flex items-center gap-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all shadow-md" style={{ backgroundColor: step >= 2 ? "var(--accent)" : "var(--bg-soft)", color: step >= 2 ? "#fff" : "var(--text-muted)", border: step >= 2 ? "none" : "2px solid var(--border-color)" }}>
                  <span className="font-black">2</span>
                </div>
                <div>
                  <h4 className="font-black text-sm" style={{ color: step >= 2 ? "var(--text-main)" : "var(--text-muted)" }}>Workspace Setup</h4>
                  <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>Auto-milestone confirmation</p>
                </div>
              </div>
            </div>
            
          </div>

          {/* Quick Tip Widget */}
          <div className="p-6 rounded-[24px] shadow-sm flex gap-4" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)" }}>
            <Info size={24} style={{ color: "var(--accent)" }} className="shrink-0" />
            <div>
              <h4 className="font-black text-sm mb-1" style={{ color: "var(--text-main)" }}>Smart Setup</h4>
              <p className="text-xs font-bold leading-relaxed" style={{ color: "var(--text-muted)" }}>To save time, we will automatically construct a single 100% escrow milestone based on your budget and deadline.</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM AREA */}
        <div className="lg:w-2/3">
          <div className="p-8 md:p-10 rounded-[32px] shadow-sm relative overflow-hidden" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)" }}>
            <AnimatePresence mode="wait">
              
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  
                  {/* Title */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest ml-1 flex items-center gap-2" style={{ color: "var(--text-muted)" }}><LayoutGrid size={14}/> Project Title</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. E-Commerce Redesign" 
                      className="w-full p-5 rounded-2xl font-black text-lg outline-none transition-all focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--accent)]/10 shadow-sm" 
                      style={inputStyle} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Budget */}
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-widest ml-1 flex items-center gap-2" style={{ color: "var(--text-muted)" }}><IndianRupee size={14}/> Escrow Budget</label>
                      <input 
                        type="number" 
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        placeholder="50000" 
                        className="w-full p-5 rounded-2xl font-black text-lg outline-none transition-all focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--accent)]/10 shadow-sm" 
                        style={inputStyle} 
                      />
                      <div className="flex gap-2 flex-wrap">
                        {[10000, 25000, 50000].map(val => (
                          <button key={val} type="button" onClick={() => handleQuickBudget(val)} className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95" style={{ backgroundColor: formData.budget == val ? "var(--accent)" : "var(--bg-main)", color: formData.budget == val ? "#fff" : "var(--text-main)", border: formData.budget == val ? "none" : "1px solid var(--border-color)" }}>
                            ₹{val / 1000}k
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-widest ml-1 flex items-center gap-2" style={{ color: "var(--text-muted)" }}><CalendarDays size={14}/> Final Deadline</label>
                      <input 
                        type="date" 
                        value={formData.deadline}
                        onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                        className="w-full p-5 rounded-2xl font-black text-lg outline-none transition-all focus:border-[color:var(--accent)] focus:ring-4 focus:ring-[color:var(--accent)]/10 shadow-sm" 
                        style={inputStyle} 
                      />
                      <div className="flex gap-2 flex-wrap">
                        {[7, 15, 30].map(days => (
                          <button key={days} type="button" onClick={() => handleQuickDeadline(days)} className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95" style={{ backgroundColor: "var(--bg-main)", color: "var(--text-main)", border: "1px solid var(--border-color)" }}>
                            +{days} Days
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button onClick={handleNext} className="px-10 py-5 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all" style={{ backgroundColor: "var(--accent)" }}>
                      Continue to Details
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  
                  <div className="p-6 rounded-[24px] flex items-center justify-between gap-4 shadow-sm" style={{ backgroundColor: "var(--bg-main)", border: "2px solid var(--accent)" }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-sm" style={{ color: "var(--text-main)" }}>Auto-Milestone Secured</h4>
                        <p className="text-xs font-bold mt-1" style={{ color: "var(--text-muted)" }}>100% of funds will be held in Escrow until delivery.</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Budget Lock</p>
                      <p className="text-xl font-black text-[color:var(--accent)]">₹{Number(formData.budget).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-widest ml-1 flex items-center gap-2" style={{ color: "var(--text-muted)" }}><FileText size={14}/> Internal Notes (Optional)</label>
                    <textarea 
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Add brief instructions or scope details for your team..." 
                      className="w-full p-5 rounded-2xl font-bold text-sm outline-none transition-all resize-none focus:border-[color:var(--accent)] shadow-sm" 
                      style={inputStyle} 
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button onClick={() => setStep(1)} className="px-8 py-5 rounded-2xl font-black text-sm transition-all hover:bg-[color:var(--border-color)]" style={{ backgroundColor: "var(--bg-main)", color: "var(--text-main)", border: "1px solid var(--border-color)" }}>
                      Back
                    </button>
                    <button onClick={handleSubmit} className="flex-1 py-5 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all" style={{ backgroundColor: "var(--accent)" }}>
                      <Rocket size={20} /> Create Project Workspace
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
