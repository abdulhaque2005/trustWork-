import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProjectDetails } from "../store/slices/projectSlice";
import { depositFunds } from "../store/slices/paymentSlice";
import API from "../services/api";
import { motion } from "framer-motion";
import SEO from "../components/common/SEO";
import toast, { Toaster } from "react-hot-toast";
import {
  Clock, CheckCircle2, AlertTriangle, Upload, Send, DollarSign,
  FileText, Link2, ArrowLeft, Shield, XCircle, Loader2
} from "lucide-react";

const VALID_FILE_TYPES = ["image/png","image/jpeg","image/jpg","application/pdf","application/zip","application/x-zip-compressed"];

const statusColor = (s) => ({
  pending:{bg:"#F59E0B15",color:"#F59E0B",label:"Pending"},
  "in-progress":{bg:"#3B82F615",color:"#3B82F6",label:"In Progress"},
  submitted:{bg:"#8B5CF615",color:"#8B5CF6",label:"Submitted"},
  revision:{bg:"#EF444415",color:"#EF4444",label:"Revision"},
  completed:{bg:"#22C55E15",color:"#22C55E",label:"Completed"},
  open:{bg:"#6C5CE715",color:"#6C5CE7",label:"Open"},
  "in-progress":{bg:"#3B82F615",color:"#3B82F6",label:"In Progress"},
  disputed:{bg:"#EF444415",color:"#EF4444",label:"Disputed"},
  expired:{bg:"#F9731615",color:"#F97316",label:"Expired"},
  locked:{bg:"#F59E0B15",color:"#F59E0B",label:"Locked"},
  released:{bg:"#22C55E15",color:"#22C55E",label:"Released"},
  refunded:{bg:"#64748B15",color:"#64748B",label:"Refunded"},
}[s] || {bg:"#94A3B815",color:"#94A3B8",label:s||"Unknown"});

const Workspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject, loading } = useSelector(s => s.projects);
  const { user } = useSelector(s => s.auth);
  const role = (user?.role || localStorage.getItem("role") || "client").toLowerCase();

  const [submitForm, setSubmitForm] = useState({ milestoneId:"", description:"", demoLink:"", file:null });
  const [submitting, setSubmitting] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("milestones");

  useEffect(() => { if(id) dispatch(getProjectDetails(id)); }, [id, dispatch]);

  const project = currentProject?.project;
  const milestones = currentProject?.milestones || [];
  const payments = currentProject?.payments || [];
  const activities = currentProject?.activities || [];
  const daysLeft = project?.daysLeft ?? (project?.deadline ? Math.ceil((new Date(project.deadline)-Date.now())/86400000) : 0);
  const isExpired = daysLeft < 0 || project?.status === "expired";

  // STRICT FILE VALIDATION
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!submitForm.file) return toast.error("File is required for submission");
    if(!VALID_FILE_TYPES.includes(submitForm.file.type)) return toast.error("Invalid file type. Allowed: PNG, JPG, PDF, ZIP");
    if(!submitForm.description || submitForm.description.trim().length < 20) return toast.error("Description must be at least 20 characters");
    if(!submitForm.milestoneId) return toast.error("Please select a milestone");

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("files", submitForm.file);
      fd.append("milestoneId", submitForm.milestoneId);
      fd.append("description", submitForm.description);
      if(submitForm.demoLink) fd.append("demoLink", submitForm.demoLink);
      await API.post(`/projects/${id}/submit`, fd, { headers:{"Content-Type":"multipart/form-data"} });
      toast.success("Work submitted successfully!");
      setSubmitForm({ milestoneId:"", description:"", demoLink:"", file:null });
      dispatch(getProjectDetails(id));
    } catch(err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally { setSubmitting(false); }
  };

  const handleReview = async (submissionId, action, feedback="") => {
    if(action === "reject" && !feedback) return toast.error("Reason is required when rejecting");
    setReviewLoading(true);
    try {
      await API.put(`/projects/${id}/review`, { submissionId, action, feedback });
      toast.success(`Work ${action}d successfully`);
      dispatch(getProjectDetails(id));
    } catch(err) { toast.error(err.response?.data?.message || "Review failed"); }
    finally { setReviewLoading(false); }
  };

  const handleDeposit = async () => {
    setDepositLoading(true);
    try {
      await dispatch(depositFunds(id)).unwrap();
      toast.success("Funds deposited to escrow!");
      dispatch(getProjectDetails(id));
    } catch(err) { toast.error(typeof err==="string"?err:"Deposit failed"); }
    finally { setDepositLoading(false); }
  };

  const handleAccept = async () => {
    try {
      await API.put(`/projects/${id}/assign`);
      toast.success("Project accepted!");
      dispatch(getProjectDetails(id));
    } catch(err) { toast.error(err.response?.data?.message || "Failed to accept"); }
  };

  if(loading || !project) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="animate-spin" size={32} style={{color:"var(--accent)"}} />
    </div>
  );

  const totalBudget = project.budget || 0;
  const lockedAmt = payments.filter(p=>["locked","pending"].includes(p.status)).reduce((s,p)=>s+p.amount,0);
  const releasedAmt = payments.filter(p=>p.status==="released").reduce((s,p)=>s+p.amount,0);
  const progress = project.progress || 0;
  const psc = statusColor(project.status);

  return (
    <div className="max-w-[1200px] mx-auto pb-20">
      <SEO title={project.title} description={`Workspace for ${project.title}`} />
      <Toaster position="top-right" />

      {/* Back + Header */}
      <button onClick={()=>navigate(-1)} className="flex items-center gap-2 text-sm font-bold mb-6 hover:opacity-70 transition" style={{color:"var(--text-muted)"}}>
        <ArrowLeft size={16}/> Back
      </button>

      <div className="p-6 rounded-3xl mb-6 shadow-sm" style={{backgroundColor:"var(--bg-main)",border:"1px solid var(--border-color)"}}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{backgroundColor:psc.bg,color:psc.color}}>{psc.label}</span>
              {isExpired && <span className="flex items-center gap-1 text-xs font-bold text-orange-500"><AlertTriangle size={12}/>Expired</span>}
            </div>
            <h1 className="text-2xl font-black mb-2" style={{color:"var(--text-main)"}}>{project.title}</h1>
            <p className="text-sm mb-3" style={{color:"var(--text-muted)"}}>{project.description}</p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold" style={{color:"var(--text-muted)"}}>
              <span>💰 Budget: <b className="text-green-500">${totalBudget.toLocaleString()}</b></span>
              <span>📅 Deadline: <b>{new Date(project.deadline).toLocaleDateString()}</b></span>
              <span className={isExpired?"text-red-500":""}><Clock size={12} className="inline"/> {isExpired?"Expired":`${Math.max(0,daysLeft)} days left`}</span>
              {project.freelancerId && <span>👤 Freelancer: <b>{project.freelancerId?.name||"Assigned"}</b></span>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase" style={{color:"var(--text-muted)"}}>Progress</p>
              <p className="text-2xl font-black" style={{color:psc.color}}>{progress}%</p>
            </div>
            <div className="w-32 h-2 rounded-full" style={{backgroundColor:"var(--bg-soft)"}}>
              <div className="h-2 rounded-full transition-all" style={{width:`${progress}%`,backgroundColor:psc.color}}/>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t" style={{borderColor:"var(--border-color)"}}>
          {role==="client" && payments.length===0 && project.status!=="completed" && (
            <button onClick={handleDeposit} disabled={depositLoading} className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:-translate-y-0.5 transition-all">
              {depositLoading?<Loader2 className="animate-spin" size={14}/>:"💰 Deposit Escrow"}
            </button>
          )}
          {role==="freelancer" && project.status==="open" && !project.freelancerId && (
            <button onClick={handleAccept} className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:-translate-y-0.5 transition-all">
              ✅ Accept Project
            </button>
          )}
          {/* DISPUTE: Only via explicit button, NEVER auto */}
          {(role==="client"||role==="freelancer") && project.status!=="completed" && project.status!=="disputed" && project.freelancerId && (
            <button onClick={()=>navigate(`/disputes?project=${id}`)} className="px-4 py-2 rounded-xl text-xs font-bold text-red-500 hover:-translate-y-0.5 transition-all" style={{backgroundColor:"#EF444410",border:"1px solid #EF444430"}}>
              ⚠️ Raise Dispute
            </button>
          )}
        </div>

        {/* Escrow Summary */}
        {payments.length>0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[{label:"Locked",value:lockedAmt,color:"#F59E0B"},{label:"Released",value:releasedAmt,color:"#22C55E"},{label:"Total",value:totalBudget,color:"#6C5CE7"}].map(s=>(
              <div key={s.label} className="p-3 rounded-xl text-center" style={{backgroundColor:`${s.color}10`}}>
                <p className="text-[9px] font-bold uppercase" style={{color:"var(--text-muted)"}}>{s.label}</p>
                <p className="text-base font-black" style={{color:s.color}}>${s.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["milestones","activity",...(role==="freelancer"&&project.freelancerId?["submit"]:[])].map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)} className="px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap"
            style={{backgroundColor:activeTab===t?"var(--accent)":"var(--bg-soft)",color:activeTab===t?"white":"var(--text-muted)",border:`1px solid ${activeTab===t?"transparent":"var(--border-color)"}`}}>
            {t}
          </button>
        ))}
      </div>

      {/* Milestones Tab */}
      {activeTab==="milestones" && (
        <div className="space-y-4">
          {milestones.map((ms,i) => {
            const msc = statusColor(ms.status);
            const pay = payments.find(p=>String(p.milestoneId?._id||p.milestoneId)===String(ms._id));
            return (
              <motion.div key={ms._id||i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                className="p-5 rounded-2xl" style={{backgroundColor:"var(--bg-main)",border:"1px solid var(--border-color)"}}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{backgroundColor:msc.bg,color:msc.color}}>{msc.label}</span>
                      <span className="text-[10px] font-semibold" style={{color:"var(--text-muted)"}}>Milestone {i+1}</span>
                    </div>
                    <h4 className="text-sm font-bold" style={{color:"var(--text-main)"}}>{ms.title}</h4>
                    <p className="text-xs mt-1" style={{color:"var(--text-muted)"}}>{ms.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black" style={{color:"var(--text-main)"}}>${(ms.amount||0).toLocaleString()}</p>
                    {pay && <p className="text-[9px] font-bold mt-0.5" style={{color:statusColor(pay.status).color}}>{statusColor(pay.status).label}</p>}
                  </div>
                </div>

                {/* Submissions */}
                {ms.submissions && ms.submissions.length>0 && (
                  <div className="mt-3 pt-3 border-t space-y-2" style={{borderColor:"var(--border-color)"}}>
                    <p className="text-[10px] font-bold uppercase" style={{color:"var(--text-muted)"}}>Submissions</p>
                    {ms.submissions.map((sub,si)=>(
                      <div key={sub._id||si} className="p-3 rounded-xl" style={{backgroundColor:"var(--bg-soft)"}}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{backgroundColor:statusColor(sub.status).bg,color:statusColor(sub.status).color}}>{statusColor(sub.status).label}</span>
                          <span className="text-[9px]" style={{color:"var(--text-muted)"}}>{new Date(sub.submittedAt||sub.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs mt-1" style={{color:"var(--text-main)"}}>{sub.description}</p>
                        {sub.files?.length>0 && <p className="text-[10px] mt-1 flex items-center gap-1" style={{color:"var(--accent)"}}><FileText size={10}/>{sub.files.length} file(s) attached</p>}
                        {sub.demoLink && <p className="text-[10px] mt-1 flex items-center gap-1" style={{color:"#3B82F6"}}><Link2 size={10}/><a href={sub.demoLink} target="_blank" rel="noreferrer">Demo Link</a></p>}
                        {sub.feedback && <p className="text-[10px] mt-1 italic" style={{color:"var(--text-muted)"}}>Feedback: {sub.feedback}</p>}

                        {/* Client Review Buttons */}
                        {role==="client" && sub.status==="pending" && (
                          <div className="flex gap-2 mt-2">
                            <button onClick={()=>handleReview(sub._id,"approve")} disabled={reviewLoading} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-green-500 text-white hover:bg-green-600 transition">✅ Approve</button>
                            <button onClick={()=>{const r=prompt("Reason for rejection:");if(r)handleReview(sub._id,"reject",r);}} disabled={reviewLoading} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-red-500 text-white hover:bg-red-600 transition">❌ Reject</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Submit Work Tab — STRICT VALIDATION */}
      {activeTab==="submit" && role==="freelancer" && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-6 rounded-3xl" style={{backgroundColor:"var(--bg-main)",border:"1px solid var(--border-color)"}}>
          <h3 className="text-lg font-black mb-5" style={{color:"var(--text-main)"}}>Submit Work</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{color:"var(--text-muted)"}}>Milestone *</label>
              <select value={submitForm.milestoneId} onChange={e=>setSubmitForm({...submitForm,milestoneId:e.target.value})} required
                className="w-full p-3 rounded-xl text-sm font-medium outline-none" style={{backgroundColor:"var(--bg-soft)",border:"1px solid var(--border-color)",color:"var(--text-main)"}}>
                <option value="">Select milestone...</option>
                {milestones.filter(m=>["in-progress","revision"].includes(m.status)).map(m=>(
                  <option key={m._id} value={m._id}>{m.title} (${m.amount})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{color:"var(--text-muted)"}}>Description * (min 20 chars)</label>
              <textarea value={submitForm.description} onChange={e=>setSubmitForm({...submitForm,description:e.target.value})} required minLength={20} rows={4} placeholder="Describe your work in detail (minimum 20 characters)..."
                className="w-full p-3 rounded-xl text-sm font-medium outline-none resize-none" style={{backgroundColor:"var(--bg-soft)",border:"1px solid var(--border-color)",color:"var(--text-main)"}} />
              <p className="text-[10px] mt-1" style={{color:submitForm.description.length>=20?"#22C55E":"var(--text-muted)"}}>{submitForm.description.length}/20 characters</p>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{color:"var(--text-muted)"}}>File * (PNG, JPG, PDF, ZIP)</label>
              <div className="relative">
                <input type="file" accept=".png,.jpg,.jpeg,.pdf,.zip" onChange={e=>{
                  const f=e.target.files[0];
                  if(f && !VALID_FILE_TYPES.includes(f.type)){toast.error("Invalid file type. Allowed: PNG, JPG, PDF, ZIP");e.target.value="";return;}
                  setSubmitForm({...submitForm,file:f||null});
                }} required className="w-full p-3 rounded-xl text-sm font-medium outline-none" style={{backgroundColor:"var(--bg-soft)",border:"1px solid var(--border-color)",color:"var(--text-main)"}} />
              </div>
              {submitForm.file && <p className="text-[10px] mt-1 flex items-center gap-1" style={{color:"#22C55E"}}><CheckCircle2 size={10}/>{submitForm.file.name} ({(submitForm.file.size/1024).toFixed(1)}KB)</p>}
            </div>
            <div>
              <label className="text-xs font-bold block mb-1.5" style={{color:"var(--text-muted)"}}>Demo Link (optional)</label>
              <input type="url" value={submitForm.demoLink} onChange={e=>setSubmitForm({...submitForm,demoLink:e.target.value})} placeholder="https://..."
                className="w-full p-3 rounded-xl text-sm font-medium outline-none" style={{backgroundColor:"var(--bg-soft)",border:"1px solid var(--border-color)",color:"var(--text-main)"}} />
            </div>
            <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              {submitting?<Loader2 className="animate-spin" size={16}/>:<><Send size={14}/>Submit Work</>}
            </button>
          </form>
        </motion.div>
      )}

      {/* Activity Tab */}
      {activeTab==="activity" && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="p-6 rounded-3xl" style={{backgroundColor:"var(--bg-main)",border:"1px solid var(--border-color)"}}>
          <h3 className="text-lg font-black mb-5" style={{color:"var(--text-main)"}}>Activity Timeline</h3>
          {activities.length===0 ? (
            <p className="text-sm text-center py-8" style={{color:"var(--text-muted)"}}>No activity yet</p>
          ) : (
            <div className="space-y-4">
              {activities.map((a,i)=>(
                <div key={a._id||i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{backgroundColor:"var(--accent)"}} />
                  <div>
                    <p className="text-xs font-semibold" style={{color:"var(--text-main)"}}>{a.message}</p>
                    <p className="text-[10px]" style={{color:"var(--text-muted)"}}>{new Date(a.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Workspace;
