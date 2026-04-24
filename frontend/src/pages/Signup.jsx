import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../store/slices/authSlice.js";
import { ShieldCheck, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registeredUsers } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    fullName: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    role: "Client"
  });

  const handleSignup = (e) => {
    e.preventDefault();
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
    if (registeredUsers.find(u => u.email === formData.email)) return toast.error("Email already registered");

    setLoading(true);
    setTimeout(() => {
      dispatch(registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      }));
      setLoading(false);
      toast.success("Account created! Please login.");
      navigate("/login");
    }, 1200);
  };

  const inputStyle = { backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 transition-colors duration-500" style={{ backgroundColor: "var(--bg-page)" }}>
      <Toaster position="top-center" />
      
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#6C5CE7] opacity-[0.05] rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] rounded-[32px] p-10 shadow-xl relative z-10"
        style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-main)" }}>Create Account</h1>
          <p className="text-sm mt-1 font-medium" style={{ color: "var(--text-muted)" }}>Join the EscrowFlow network</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
               <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: "var(--text-muted)" }}>Full Name</label>
               <input required type="text" placeholder="John Doe" className="w-full px-5 py-3.5 rounded-2xl font-semibold text-sm outline-none transition-all" style={inputStyle} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            </div>

            <div className="space-y-1.5 md:col-span-2">
               <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: "var(--text-muted)" }}>Work Email</label>
               <input required type="email" placeholder="name@company.com" className="w-full px-5 py-3.5 rounded-2xl font-semibold text-sm outline-none transition-all" style={inputStyle} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="space-y-1.5">
               <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: "var(--text-muted)" }}>Password</label>
               <input required type="password" placeholder="••••••" className="w-full px-5 py-3.5 rounded-2xl font-semibold text-sm outline-none transition-all" style={inputStyle} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>

            <div className="space-y-1.5">
               <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: "var(--text-muted)" }}>Confirm</label>
               <input required type="password" placeholder="••••••" className="w-full px-5 py-3.5 rounded-2xl font-semibold text-sm outline-none transition-all" style={inputStyle} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
            </div>

            <div className="space-y-1.5 md:col-span-2">
               <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: "var(--text-muted)" }}>Role Selection</label>
               <select className="w-full px-5 py-3.5 rounded-2xl font-semibold text-sm outline-none transition-all appearance-none" style={inputStyle} value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} >
                  <option value="Client">Client (Hire Talents)</option>
                  <option value="Freelancer">Freelancer (Find Work)</option>
               </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 text-white font-bold rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-[#6C5CE7]/10"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Create Account
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6" style={{ borderTop: "1px solid var(--border-color)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            Already have an account? <button onClick={() => navigate("/login")} className="font-bold hover:underline" style={{ color: "var(--accent)" }}>Sign In</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
