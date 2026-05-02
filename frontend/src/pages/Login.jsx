import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Loader2, ShieldAlert, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, error, resetError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (error) {
      toast.error(error);
      resetError();
    }
  }, [error, resetError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error("Please fill in all fields");
    }
    setLoading(true);
    try {
      const result = await login(formData).unwrap();
      toast.success(`Welcome back, ${result?.data?.user?.name || "User"}!`);
      navigate("/dashboard");
    } catch (err) {
      const message = typeof err === "string" ? err : err?.message || "Login failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-main-wrapper">
      {/* Premium Video Background */}
      <video autoPlay loop muted playsInline className="auth-bg-video">
        <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connections-background-30048-large.mp4" type="video/mp4" />
      </video>
      <div className="auth-video-overlay"></div>

      <Toaster position="top-center" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="auth-glass-card"
      >
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-purple-500/30 mb-3">
             <ShieldAlert size={40} strokeWidth={1.5} className="text-white absolute" />
             <LockKeyhole size={18} strokeWidth={2.5} className="text-white relative top-0.5" />
          </div>
          <h2 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 uppercase">
            EscrowFlow
          </h2>
          <p className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase mt-1">
            Secure Work. Trusted Payments.
          </p>
        </div>
        
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleLogin}>
          <div className="auth-input-container">
            <label className="auth-label">Email Address</label>
            <input 
              type="email" placeholder="you@example.com" required
              className="auth-input-field"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="auth-input-container">
            <label className="auth-label">Password</label>
            <input 
              type="password" placeholder="••••••••" required
              className="auth-input-field"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="auth-options-row">
             <label className="auth-checkbox-label">
                <input type="checkbox" className="auth-checkbox" />
                <span className="auth-checkbox-text">Remember me</span>
             </label>
             <button type="button" className="auth-forgot-link">Forgot Password?</button>
          </div>

          <button type="submit" disabled={loading} className="auth-primary-btn">
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Sign In"}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account? <button onClick={() => navigate("/signup")} className="auth-switch-link">Sign Up</button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;





