import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#6C5CE7", "#10B981", "#F59E0B"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-4 py-3 rounded-xl shadow-xl text-xs font-bold" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)", color: "var(--text-main)" }}>
        <p style={{ color: "var(--text-muted)" }}>{payload[0].name}</p>
        <p className="text-lg font-black mt-1">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const ChartSection = ({ payments }) => {
  const locked = payments
    .filter(p => (p.status || "").toLowerCase() === "locked")
    .reduce((acc, p) => acc + (p.amount || 0), 0);
  const released = payments
    .filter(p => (p.status || "").toLowerCase() === "released")
    .reduce((acc, p) => acc + (p.amount || 0), 0);
  const pending = payments
    .filter(p => (p.status || "").toLowerCase() === "pending")
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const data = [
    { name: "Locked in Escrow", value: locked },
    { name: "Released", value: released },
    ...(pending > 0 ? [{ name: "Pending", value: pending }] : []),
  ].filter(d => d.value > 0);

  const total = locked + released + pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="p-6 rounded-2xl shadow-sm h-full flex flex-col"
      style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: "var(--text-main)" }}>Escrow Overview</h3>
        <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{ backgroundColor: "var(--bg-soft)", color: "var(--text-muted)" }}>
          ${total.toLocaleString()}
        </span>
      </div>

      <div className="flex-1 min-h-[220px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center font-bold text-sm" style={{ color: "var(--text-muted)" }}>
            No payment data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "11px", fontWeight: "700" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default ChartSection;
