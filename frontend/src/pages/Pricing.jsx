import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePlan } from "../store/slices/authSlice";
import { Check, Zap, Crown, CreditCard, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Pricing = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { name: "Basic", price: "0", icon: <Zap size={24} />, features: ["5 Projects", "Standard Support", "Basic Analytics"], color: "var(--text-muted)" },
    { name: "Pro", price: "29", icon: <Crown size={24} />, features: ["Unlimited Projects", "Priority Support", "Advanced Logs", "Custom Labels"], color: "var(--accent)", popular: true },
    { name: "Enterprise", price: "99", icon: <Zap size={24} />, features: ["Team Collaboration", "API Access", "Dedicated Manager", "SLA Support"], color: "var(--accent)" }
  ];

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const processPayment = () => {
    setLoadingPlan(selectedPlan.name);
    setShowModal(false);
    setTimeout(() => {
      dispatch(updatePlan(selectedPlan.name));
      toast.success(`Success! You are now on the ${selectedPlan.name} plan.`, {
        style: { borderRadius: '16px', background: '#1e293b', color: '#fff', fontWeight: '700' }
      });
      setLoadingPlan(null);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      <Toaster position="top-right" />
      
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tight" style={{ color: "var(--text-main)" }}>Simple Pricing</h1>
        <p className="font-bold text-lg" style={{ color: "var(--text-muted)" }}>Choose the plan that fits your workflow. Current Plan: <span style={{ color: "var(--accent)" }} className="uppercase tracking-widest text-sm">{user?.plan || "Basic"}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative p-10 rounded-[40px] border-2 transition-all duration-500 ${plan.popular ? 'shadow-2xl scale-105' : 'shadow-sm hover:opacity-90'}`}
            style={{ 
              backgroundColor: "var(--bg-main)", 
              borderColor: plan.popular ? "var(--accent)" : "var(--border-color)"
            }}
          >
            {plan.popular && <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg" style={{ backgroundColor: "var(--accent)" }}>Most Popular</span>}
            
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: "var(--bg-soft)", color: plan.color }}>
              {plan.icon}
            </div>
            
            <h3 className="text-2xl font-black mb-2" style={{ color: "var(--text-main)" }}>{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black" style={{ color: "var(--text-main)" }}>${plan.price}</span>
              <span className="font-bold" style={{ color: "var(--text-muted)" }}>/month</span>
            </div>

            <ul className="space-y-4 mb-10">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm font-bold" style={{ color: "var(--text-main)" }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--bg-soft)", color: "var(--accent)" }}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button 
              disabled={user?.plan === plan.name || loadingPlan}
              onClick={() => handleUpgrade(plan)}
              className={`w-full py-4 font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 ${user?.plan === plan.name ? 'opacity-50 cursor-not-allowed' : 'text-white shadow-xl'}`}
              style={{ backgroundColor: user?.plan === plan.name ? "var(--bg-soft)" : "var(--accent)" }}
            >
              {loadingPlan === plan.name ? <Loader2 className="animate-spin" size={18} /> : user?.plan === plan.name ? "Current Plan" : `Upgrade to ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      {/* PAYMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in">
          <div className="w-full max-w-md rounded-[32px] p-8 shadow-2xl space-y-6" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
            <h3 className="text-xl font-black flex items-center gap-3" style={{ color: "var(--text-main)" }}>
              <CreditCard style={{ color: "var(--accent)" }} /> Secure Checkout
            </h3>
            <p className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>Upgrading to <span style={{ color: "var(--text-main)" }} className="font-black">{selectedPlan.name} Plan</span> for ${selectedPlan.price}/month.</p>
            
            <div className="space-y-4">
              <input type="text" placeholder="Card Number" className="w-full p-4 rounded-2xl font-bold text-sm outline-none transition-all" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }} />
              <div className="flex gap-4">
                <input type="text" placeholder="MM/YY" className="w-full p-4 rounded-2xl font-bold text-sm outline-none transition-all" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }} />
                <input type="password" placeholder="CVV" className="w-full p-4 rounded-2xl font-bold text-sm outline-none transition-all" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)", color: "var(--text-main)" }} />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 font-black" style={{ color: "var(--text-muted)" }}>Cancel</button>
              <button onClick={processPayment} className="flex-[2] py-4 text-white font-black rounded-2xl shadow-lg" style={{ backgroundColor: "var(--accent)" }}>Confirm Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
