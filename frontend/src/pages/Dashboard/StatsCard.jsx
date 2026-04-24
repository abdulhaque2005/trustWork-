import React from "react";
import { motion } from "framer-motion";

const StatsCard = ({ title, value, subtitle, icon: Icon, color, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl p-6 cursor-pointer group transition-shadow duration-300 hover:shadow-lg"
      style={{
        backgroundColor: "var(--bg-main)",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* Background glow */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
            {title}
          </p>
          <h3 className="text-2xl font-black tracking-tight" style={{ color: "var(--text-main)" }}>
            {value}
          </h3>
          {subtitle && (
            <p className="text-[11px] font-semibold mt-1" style={{ color: "var(--text-muted)", opacity: 0.7 }}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center text-white shadow-lg`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
