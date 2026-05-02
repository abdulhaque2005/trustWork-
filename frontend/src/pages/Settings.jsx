import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfileAsync, updateSettings } from "../store/slices/authSlice";
import { motion } from "framer-motion";
import SEO from "../components/common/SEO";
import toast, { Toaster } from "react-hot-toast";
import { User, Mail, FileText, Save, Loader2, Sun, Moon } from "lucide-react";

const Settings = () => {
  const { user, settings } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "", skills: user?.skills?.join(", ") || "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateProfileAsync({ name: form.name, bio: form.bio, skills: form.skills.split(",").map(s => s.trim()).filter(Boolean) })).unwrap();
      toast.success("Profile updated!");
    } catch (err) { toast.error(typeof err === "string" ? err : "Update failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-[800px] mx-auto pb-20">
      <SEO title="Settings" description="Manage your EscrowFlow profile and preferences" />
      <Toaster position="top-right" />
      <h1 className="text-3xl font-black mb-8" style={{ color: "var(--text-main)" }}>Settings</h1>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl mb-6" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
        <h3 className="text-base font-black mb-5" style={{ color: "var(--text-main)" }}>Profile</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-muted)" }}>Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 rounded-xl text-sm outline-none" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }} />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-muted)" }}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3}
              className="w-full p-3 rounded-xl text-sm outline-none resize-none" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }} />
          </div>
          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--text-muted)" }}>Skills (comma-separated)</label>
            <input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })}
              className="w-full p-3 rounded-xl text-sm outline-none" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }} />
          </div>
          <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={14} /> : <><Save size={14} /> Save Changes</>}
          </button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-6 rounded-3xl" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
        <h3 className="text-base font-black mb-5" style={{ color: "var(--text-main)" }}>Preferences</h3>
        <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: "var(--bg-soft)" }}>
          <div className="flex items-center gap-3">
            {settings?.darkMode ? <Moon size={18} style={{ color: "var(--text-muted)" }} /> : <Sun size={18} style={{ color: "var(--text-muted)" }} />}
            <span className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>Dark Mode</span>
          </div>
          <button onClick={() => dispatch(updateSettings({ darkMode: !settings?.darkMode }))}
            className={`w-12 h-6 rounded-full transition-all relative ${settings?.darkMode ? "bg-indigo-500" : "bg-gray-300"}`}>
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings?.darkMode ? "left-6" : "left-0.5"}`} />
          </button>
        </div>
        <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: "var(--bg-soft)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            <b>Email:</b> {user?.email} &nbsp;|&nbsp; <b>Role:</b> {user?.role} &nbsp;|&nbsp; <b>Joined:</b> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
