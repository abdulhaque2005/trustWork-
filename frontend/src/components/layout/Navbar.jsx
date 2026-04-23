import { useLocation } from "react-router-dom";
import { Bell, Search, ChevronDown } from "lucide-react";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/payments": "Payments",
  "/disputes": "Disputes",
  "/settings": "Settings",
};

const Navbar = () => {
  const { pathname } = useLocation();

  const currentTitle =
    Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] ||
    "Dashboard";

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200/60"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        <div>
          <h2 className="text-[17px] font-semibold text-gray-900 tracking-tight">
            {currentTitle}
          </h2>
          <p className="text-xs text-gray-400 -mt-0.5">Manage your workflow</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2 gap-2 border border-gray-100 mr-1">
            <Search size={16} className="text-gray-400" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-40"
            />
          </div>

          <button className="relative p-2.5 rounded-xl text-gray-500 hover:text-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-all duration-200">
            <Bell size={19} strokeWidth={1.8} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#6C5CE7] rounded-full ring-2 ring-white" />
          </button>

          <div className="w-px h-8 bg-gray-200 mx-2" />

          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-all duration-200">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#a29bfe] flex items-center justify-center"
              style={{ boxShadow: "0 2px 8px rgba(108,92,231,0.25)" }}>
              <span className="text-white text-xs font-bold">AH</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold text-gray-800 leading-tight">Abdul Haque</span>
              <span className="text-[11px] text-gray-400 leading-tight">Admin</span>
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
