const StatsCard = ({ title, value, icon: Icon, onClick, isActive }) => {
  return (
    <div 
      onClick={onClick}
      className={`group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 cursor-pointer shadow-sm
        ${isActive 
          ? 'bg-[#6C5CE7] border-[#6C5CE7] shadow-[#6C5CE7]/20 shadow-lg' 
          : 'bg-white border-gray-100 hover:border-[#6C5CE7]/30 hover:shadow-md'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl transition-colors duration-300
          ${isActive ? 'bg-white/20' : 'bg-indigo-50'}`}>
          <Icon size={22} className={isActive ? 'text-white' : 'text-[#6C5CE7]'} />
        </div>
      </div>
      
      <div>
        <h3 className={`text-3xl font-extrabold tracking-tight mb-0.5 ${isActive ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </h3>
        <p className={`text-[14px] font-semibold ${isActive ? 'text-indigo-100' : 'text-gray-500'}`}>
          {title}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
