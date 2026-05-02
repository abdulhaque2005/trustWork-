import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchDisputes, raiseDispute, resolveDispute } from "../store/slices/disputeSlice";
import { motion } from "framer-motion";
import SEO from "../components/common/SEO";
import toast, { Toaster } from "react-hot-toast";
import { AlertTriangle, Shield, Loader2, FileText, Clock } from "lucide-react";

const statusConfig = {
  open:{ bg:"#EF444415", color:"#EF4444", label:"Open" },
  "under-review":{ bg:"#F59E0B15", color:"#F59E0B", label:"Under Review" },
  resolved:{ bg:"#22C55E15", color:"#22C55E", label:"Resolved" },
  dismissed:{ bg:"#64748B15", color:"#64748B", label:"Dismissed" },
};

const Disputes = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { disputes, loading } = useSelector(s => s.disputes);
  const { user } = useSelector(s => s.auth);
  const role = (user?.role || localStorage.getItem("role") || "client").toLowerCase();
  const isAdmin = role === "admin";

  const [showForm, setShowForm] = useState(!!searchParams.get("project"));
  const [form, setForm] = useState({ projectId: searchParams.get("project")||"", reason:"", file:null });
  const [submitting, setSubmitting] = useState(false);
  const [resolveModal, setResolveModal] = useState(null);
  const [resolveForm, setResolveForm] = useState({ resolution:"release", adminNote:"" });

  useEffect(() => { dispatch(fetchDisputes()); }, [dispatch]);

  const handleRaise = async (e) => {
    e.preventDefault();
    if(!form.projectId) return toast.error("Project ID is required");
    if(!form.reason || form.reason.trim().length < 10) return toast.error("Reason must be at least 10 characters");
    if(!form.file) return toast.error("Evidence file is required");

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("projectId", form.projectId);
      fd.append("reason", form.reason);
      fd.append("evidence", form.file);
      await dispatch(raiseDispute(fd)).unwrap();
      toast.success("Dispute raised — funds frozen 🚫");
      setShowForm(false);
      setForm({ projectId:"", reason:"", file:null });
      dispatch(fetchDisputes());
    } catch(err) { toast.error(typeof err==="string"?err:"Failed to raise dispute"); }
    finally { setSubmitting(false); }
  };

  const handleResolve = async () => {
    if(!resolveModal) return;
    try {
      await dispatch(resolveDispute({ disputeId:resolveModal, ...resolveForm })).unwrap();
      toast.success(`Dispute resolved: ${resolveForm.resolution}`);
      setResolveModal(null);
      dispatch(fetchDisputes());
    } catch(err) { toast.error(typeof err==="string"?err:"Failed to resolve"); }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-20">
      <SEO title="Disputes" description="Manage disputes and resolutions on EscrowFlow" />
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black" style={{color:"var(--text-main)"}}>{isAdmin ? "Dispute Management" : "Resolution Center"}</h1>
          <p className="text-sm font-semibold mt-1" style={{color:"var(--text-muted)"}}>{disputes.length} dispute(s)</p>
        </div>
        {!isAdmin && (
          <button onClick={()=>setShowForm(!showForm)} className="px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:-translate-y-0.5 transition-all" style={{backgroundColor:"#EF444410",border:"1px solid #EF444430"}}>
            <AlertTriangle size={14} className="inline mr-1"/> Raise Dispute
          </button>
        )}
      </div>

      {/* Raise Dispute Form */}
      {showForm && !isAdmin && (
        <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} className="mb-8 p-6 rounded-3xl" style={{backgroundColor:"var(--bg-main)",border:"1px solid var(--border-color)"}}>
          <h3 className="text-base font-black mb-4" style={{color:"var(--text-main)"}}>Raise a Dispute</h3>
          <form onSubmit={handleRaise} className="space-y-4">
            <div>
              <label className="text-xs font-bold block mb-1" style={{color:"var(--text-muted)"}}>Project ID *</label>
              <input value={form.projectId} onChange={e=>setForm({...form,projectId:e.target.value})} required placeholder="Enter project ID"
                className="w-full p-3 rounded-xl text-sm outline-none" style={{backgroundColor:"var(--bg-soft)",border:"1px solid var(--border-color)",color:"var(--text-main)"}} />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1" style={{color:"var(--text-muted)"}}>Reason * (min 10 chars)</label>
              <textarea value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} required minLength={10} rows={3} placeholder="Describe the issue..."
                className="w-full p-3 rounded-xl text-sm outline-none resize-none" style={{backgroundColor:"var(--bg-soft)",border:"1px solid var(--border-color)",color:"var(--text-main)"}} />
            </div>
            <div>
              <label className="text-xs font-bold block mb-1" style={{color:"var(--text-muted)"}}>Evidence File *</label>
              <input type="file" onChange={e=>setForm({...form,file:e.target.files[0]||null})} required
                className="w-full p-3 rounded-xl text-sm outline-none" style={{backgroundColor:"var(--bg-soft)",border:"1px solid var(--border-color)",color:"var(--text-main)"}} />
            </div>
            <button type="submit" disabled={submitting} className="px-6 py-3 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition flex items-center gap-2">
              {submitting?<Loader2 className="animate-spin" size={14}/>:<><AlertTriangle size={14}/>Submit Dispute</>}
            </button>
          </form>
        </motion.div>
      )}

      {/* Disputes List */}
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i=><div key={i} className="h-24 rounded-2xl animate-pulse" style={{backgroundColor:"var(--bg-soft)"}}/>)}</div>
      ) : disputes.length === 0 ? (
        <div className="text-center py-20">
          <Shield size={48} className="mx-auto mb-4" style={{color:"var(--text-muted)"}} />
          <p className="text-lg font-bold" style={{color:"var(--text-main)"}}>No disputes</p>
          <p className="text-sm" style={{color:"var(--text-muted)"}}>Everything looks good!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((d,i) => {
            const sc = statusConfig[d.status] || statusConfig.open;
            return (
              <motion.div key={d._id||i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                className="p-5 rounded-2xl" style={{backgroundColor:"var(--bg-main)",border:"1px solid var(--border-color)"}}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{backgroundColor:sc.bg,color:sc.color}}>{sc.label}</span>
                      {d.status==="open" && <span className="text-[10px] font-bold text-red-500">🚫 Funds Frozen</span>}
                    </div>
                    <h4 className="text-sm font-bold" style={{color:"var(--text-main)"}}>{d.projectId?.title || "Project"}</h4>
                  </div>
                  <span className="text-[10px] flex items-center gap-1" style={{color:"var(--text-muted)"}}><Clock size={10}/>{new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs mb-2" style={{color:"var(--text-muted)"}}>Raised by: <b>{d.raisedBy?.name}</b> ({d.raisedBy?.role}) against <b>{d.againstUser?.name}</b></p>
                <p className="text-xs" style={{color:"var(--text-main)"}}>{d.reason}</p>
                {d.evidence?.length>0 && <p className="text-[10px] mt-1 flex items-center gap-1" style={{color:"var(--accent)"}}><FileText size={10}/>{d.evidence.length} evidence file(s)</p>}
                {d.resolution !== "none" && d.resolution && (
                  <div className="mt-2 p-2 rounded-lg" style={{backgroundColor:"#22C55E10"}}>
                    <p className="text-[10px] font-bold text-green-600">Resolution: {d.resolution} {d.adminNote && `— ${d.adminNote}`}</p>
                  </div>
                )}

                {/* Admin Resolve Button */}
                {isAdmin && ["open","under-review"].includes(d.status) && (
                  <div className="mt-3 pt-3 border-t" style={{borderColor:"var(--border-color)"}}>
                    <button onClick={()=>setResolveModal(d._id)} className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      <Shield size={12} className="inline mr-1"/> Resolve Dispute
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Resolve Modal */}
      {resolveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="w-full max-w-md p-6 rounded-3xl" style={{backgroundColor:"var(--bg-main)"}}>
            <h3 className="text-lg font-black mb-4" style={{color:"var(--text-main)"}}>Resolve Dispute</h3>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-bold block mb-1" style={{color:"var(--text-muted)"}}>Resolution</label>
                <select value={resolveForm.resolution} onChange={e=>setResolveForm({...resolveForm,resolution:e.target.value})}
                  className="w-full p-3 rounded-xl text-sm outline-none" style={{backgroundColor:"var(--bg-soft)",border:"1px solid var(--border-color)",color:"var(--text-main)"}}>
                  <option value="release">Release to Freelancer</option>
                  <option value="refund">Refund to Client</option>
                  <option value="split">Split 50/50</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold block mb-1" style={{color:"var(--text-muted)"}}>Admin Note</label>
                <textarea value={resolveForm.adminNote} onChange={e=>setResolveForm({...resolveForm,adminNote:e.target.value})} rows={3}
                  className="w-full p-3 rounded-xl text-sm outline-none resize-none" style={{backgroundColor:"var(--bg-soft)",border:"1px solid var(--border-color)",color:"var(--text-main)"}} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleResolve} className="flex-1 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white">Confirm</button>
              <button onClick={()=>setResolveModal(null)} className="px-4 py-3 rounded-xl text-sm font-bold" style={{backgroundColor:"var(--bg-soft)",color:"var(--text-muted)"}}>Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Disputes;
