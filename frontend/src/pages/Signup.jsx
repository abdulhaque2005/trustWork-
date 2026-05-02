import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Loader2, ShieldAlert, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const { register, error, resetError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "", role: "client" });

  useEffect(() => {
    if (error) {
      toast.error(error);
      resetError();
    }
  }, [error, resetError]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      return toast.error("Please fill in all fields");
    }
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role.toLowerCase()
      }).unwrap();
      
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      const message = typeof err === "string" ? err : err?.message || "Registration failed. Please try again.";
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
        style={{ maxWidth: "480px" }}
      >
        <div className="flex flex-col items-center justify-center mb-5">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-purple-500/30 mb-2">
             <ShieldAlert size={34} strokeWidth={1.5} className="text-white absolute" />
             <LockKeyhole size={16} strokeWidth={2.5} className="text-white relative top-0.5" />
          </div>
          <h2 className="text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 uppercase">
            EscrowFlow
          </h2>
        </div>

        <h1 className="auth-title">Create an Account</h1>
        <p className="auth-subtitle">Join the most trusted escrow platform today.</p>

        <form onSubmit={handleSignup}>
          <div className="premium-role-selector">
            <button
              type="button"
              onClick={() => setFormData({...formData, role: "client"})}
              className={`role-option ${formData.role === "client" ? "active" : ""}`}
            >
              Join as Client
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, role: "freelancer"})}
              className={`role-option ${formData.role === "freelancer" ? "active" : ""}`}
            >
              Join as Freelancer
            </button>
          </div>

          <div className="auth-input-container">
            <label className="auth-label">Your Full Name</label>
            <input required type="text" placeholder="e.g. John Doe" className="auth-input-field" onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          </div>

          <div className="auth-input-container">
            <label className="auth-label">Email Address</label>
            <input required type="email" placeholder="you@example.com" className="auth-input-field" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="auth-label">Password</label>
              <input required type="password" placeholder="••••••••" className="auth-input-field" onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <div className="flex-1">
              <label className="auth-label">Confirm</label>
              <input required type="password" placeholder="••••••••" className="auth-input-field" onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-primary-btn">
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Sign Up"}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <button onClick={() => navigate("/login")} className="auth-switch-link">Sign In</button>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;





