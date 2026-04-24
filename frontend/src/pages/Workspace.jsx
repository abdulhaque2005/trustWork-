import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { releaseMilestone } from "../store/slices/projectSlice";
import toast, { Toaster } from "react-hot-toast";
import { CheckCircle2, Lock, Clock, Send, FileText, History } from "lucide-react";

const Workspace = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.projects.projects.find(p => p.id === id));

  if (!project) {
    return <div className="p-20 text-center font-black text-gray-400">Project Not Found</div>;
  }

  const handleRelease = (milestoneId, title) => {
    dispatch(releaseMilestone({ projectId: project.id, milestoneId }));
    toast.success(`Milestone "${title}" Released! Payment updated in ledger.`, {
      style: { borderRadius: '16px', background: '#1F2937', color: '#fff' }
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 animate-in fade-in duration-700">
      <Toaster position="top-right" />
      
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-indigo-50 text-[#6C5CE7] text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-100">Workspace</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-400 font-bold text-sm">{project.id}</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{project.name}</h1>
          <p className="text-gray-500 font-bold mt-1">Manage deliverables and release escrow funds.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Escrow</p>
            <p className="text-2xl font-black text-gray-900">${project.totalAmount}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
             <CheckCircle2 size={28} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MILESTONES LIST */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-indigo-50 rounded-xl"><History size={20} className="text-[#6C5CE7]" /></div>
            <h2 className="text-2xl font-black text-gray-900">Project Milestones</h2>
          </div>
          
          <div className="space-y-4">
            {project.milestones.map((m) => (
              <div key={m.id} className={`p-6 rounded-[28px] border transition-all ${m.status === 'Released' ? 'bg-emerald-50/30 border-emerald-100' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.status === 'Released' ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400'}`}>
                      {m.status === 'Released' ? <CheckCircle2 size={24} /> : <Lock size={24} />}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900">{m.title}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Due: {m.deadline}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-gray-900">${m.amount}</p>
                    {m.status === 'Released' ? (
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Paid</span>
                    ) : (
                      <button 
                        onClick={() => handleRelease(m.id, m.title)}
                        className="mt-1 px-4 py-1.5 bg-[#6C5CE7] text-white text-[11px] font-black rounded-lg shadow-md shadow-[#6C5CE7]/20 hover:scale-105 transition-all"
                      >
                        Approve & Release
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR: ACTIVITY & SUBMISSION */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <Send size={20} className="text-[#6C5CE7]" /> Submit Work
            </h3>
            <textarea placeholder="Describe your work..." className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:border-[#6C5CE7]" />
            <button className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2">
              <FileText size={18} /> Send for Approval
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
