import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatsCard = ({ title, value, icon: Icon, trend, isNegative }) => {
  return (
    <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(108,92,231,0.12)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="flex items-start justify-between mb-5">
        <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-white border border-indigo-50/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
          <Icon size={24} className="text-[#6C5CE7]" strokeWidth={2} />
        </div>
        {trend && (
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[13px] font-bold ${isNegative ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {isNegative ? <ArrowDownRight size={16} strokeWidth={2.5} /> : <ArrowUpRight size={16} strokeWidth={2.5} />}
            {trend}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-1.5">{value}</h3>
        <p className="text-[15px] font-semibold text-gray-500">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
