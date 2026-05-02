import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProjectAsync } from "../store/slices/projectSlice";
import { motion } from "framer-motion";
import SEO from "../components/common/SEO";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";

const CreateProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", budget: "", deadline: "", scope: "medium", skills: "",
  });
  const [milestones, setMilestones] = useState([{ title: "", description: "", amount: "", dueDate: "" }]);

  const addMilestone = () => setMilestones([...milestones, { title: "", description: "", amount: "", dueDate: "" }]);
  const removeMilestone = (i) => { if (milestones.length > 1) setMilestones(milestones.filter((_, idx) => idx !== i)); };
  const updateMilestone = (i, field, value) => {
    const updated = [...milestones];
    updated[i][field] = value;
    setMilestones(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.budget || !form.deadline) return toast.error("All fields are required");
    if (!form.deadline) return toast.error("Deadline (expiry date) is REQUIRED");

    const totalMs = milestones.reduce((s, m) => s + Number(m.amount || 0), 0);
    if (totalMs !== Number(form.budget)) return toast.error(`Milestone amounts ($${totalMs}) must equal budget ($${form.budget})`);

    for (const m of milestones) {
      if (!m.title || !m.amount) return toast.error("All milestones need title and amount");
    }

    setLoading(true);
    try {
      await dispatch(createProjectAsync({
        ...form,
        budget: Number(form.budget),
        skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
        milestones: milestones.map(m => ({ ...m, amount: Number(m.amount) })),
      })).unwrap();
      toast.success("Project created!");
      navigate("/projects");
    } catch (err) { toast.error(typeof err === "string" ? err : "Failed to create project"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-[800px] mx-auto pb-20">
      <SEO title="Create Project" description="Create a new project on EscrowFlow" />
      <Toaster position="top-right" />

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold mb-6 hover:opacity-70 transition" style={{ color: "var(--text-muted)" }}>
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-3xl font-black mb-8" style={{ color: "var(--text-main)" }}>Create New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl space-y-4" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
          <h3 className="text-base font-black" style={{ color: "var(--text-main)" }}>Project Details</h3>

          {[
            { label: "Title *", field: "title", type: "text", placeholder: "e.g. E-commerce Website" },
            { label: "Budget ($) *", field: "budget", type: "number", placeholder: "5000" },
            { label: "Deadline (Expiry Date) * ⚠️ REQUIRED", field: "deadline", type: "date" },
            { label: "Skills (comma-separated)", field: "skills", type: "text", placeholder: "React, Node.js, MongoDB" },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-muted)" }}>{label}</label>
              <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} required={field !== "skills"} placeholder={placeholder}
                className="w-full p-3 rounded-xl text-sm outline-none" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }} />
            </div>
          ))}

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-muted)" }}>Description *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={3}
              className="w-full p-3 rounded-xl text-sm outline-none resize-none" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }} />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-muted)" }}>Scope</label>
            <select value={form.scope} onChange={e => setForm({ ...form, scope: e.target.value })}
              className="w-full p-3 rounded-xl text-sm outline-none" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }}>
              {["small", "medium", "large", "enterprise"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl space-y-4" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black" style={{ color: "var(--text-main)" }}>Milestones</h3>
            <button type="button" onClick={addMilestone} className="text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-xl" style={{ backgroundColor: "var(--accent)", color: "white" }}>
              <Plus size={12} /> Add
            </button>
          </div>
          {milestones.map((m, i) => (
            <div key={i} className="p-4 rounded-xl space-y-3" style={{ backgroundColor: "var(--bg-soft)" }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>Milestone {i + 1}</span>
                {milestones.length > 1 && <button type="button" onClick={() => removeMilestone(i)} className="text-red-500 hover:opacity-70"><Trash2 size={14} /></button>}
              </div>
              <input value={m.title} onChange={e => updateMilestone(i, "title", e.target.value)} required placeholder="Milestone title"
                className="w-full p-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)", color: "var(--text-main)" }} />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={m.amount} onChange={e => updateMilestone(i, "amount", e.target.value)} required placeholder="Amount ($)"
                  className="p-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)", color: "var(--text-main)" }} />
                <input type="date" value={m.dueDate} onChange={e => updateMilestone(i, "dueDate", e.target.value)}
                  className="p-2.5 rounded-lg text-sm outline-none" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)", color: "var(--text-main)" }} />
              </div>
            </div>
          ))}
          <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
            Total: ${milestones.reduce((s, m) => s + Number(m.amount || 0), 0)} / Budget: ${form.budget || 0}
          </p>
        </motion.div>

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all">
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Create Project"}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
