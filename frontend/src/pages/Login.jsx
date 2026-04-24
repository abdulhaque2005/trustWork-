import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../store/slices/authSlice.js";
import { Eye, EyeOff, Mail, Lock, Loader2, ShieldCheck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { registeredUsers } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const userMatch = Array.isArray(registeredUsers) 
        ? registeredUsers.find(u => u.email === formData.email && u.password === formData.password)
        : null;

      if (userMatch) {
        localStorage.setItem("role", userMatch.role);
        dispatch(loginSuccess({
          fullName: userMatch.fullName,
          email: userMatch.email,
          role: userMatch.role,
          plan: "Basic"
        }));
        setLoading(false);
        toast.success(`Welcome back!`);
        navigate("/dashboard");
      } else {
        setLoading(false);
        toast.error("Invalid credentials");
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 transition-colors duration-500" style={{ backgroundColor: "var(--bg-page)" }}>
      <Toaster position="top-center" />
      
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#6C5CE7] opacity-[0.05] rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] rounded-[32px] p-10 shadow-xl relative z-10"
        style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-main)" }}>System Sign In</h1>
          <p className="text-sm mt-1 font-medium" style={{ color: "var(--text-muted)" }}>Verify your credentials to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: "var(--text-muted)" }}>Work Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: "var(--text-muted)" }} />
              <input 
                type="email" 
                placeholder="name@company.com"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl font-semibold text-sm outline-none transition-all"
                style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: "var(--text-muted)" }}>Secure Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: "var(--text-muted)" }} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl font-semibold text-sm outline-none transition-all"
                style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 text-white font-bold rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#6C5CE7]/10"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Sign In Now
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6" style={{ borderTop: "1px solid var(--border-color)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            New user? <button onClick={() => navigate("/signup")} className="font-bold hover:underline" style={{ color: "var(--accent)" }}>Register Account</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
