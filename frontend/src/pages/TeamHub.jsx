import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, UserPlus, Clock, MoreVertical, Briefcase, Trash2, CheckCircle2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const initialTeam = [
  { id: 1, name: "Alice Designer", role: "Designer", status: "online", email: "alice@example.com", avatar: "A" },
  { id: 2, name: "Bob Developer", role: "Developer", status: "offline", email: "bob@example.com", avatar: "B" },
  { id: 3, name: "Charlie QA", role: "Tester", status: "online", email: "charlie@example.com", avatar: "C" }
];

const initialTasks = [
  { id: 101, title: "Design wireframes", assignedTo: 1, status: "completed" },
  { id: 102, title: "Implement Auth API", assignedTo: 2, status: "in-progress" },
  { id: 103, title: "Test payment gateway", assignedTo: 3, status: "pending" }
];

const TeamMemberCard = ({ member, tasks, onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle) return;
    onAddTask(member.id, taskTitle);
    setTaskTitle("");
  };

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 flex flex-col rounded-[28px] shadow-sm relative overflow-hidden group transition-all hover:shadow-md" style={{ backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md" style={{ backgroundColor: "var(--accent)" }}>
            {member.avatar}
          </div>
          <div>
            <h4 className="font-black text-lg leading-tight" style={{ color: "var(--text-main)" }}>{member.name}</h4>
            <p className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>{member.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: member.status === 'online' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)' }}>
          <div className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: member.status === 'online' ? '#10B981' : 'var(--text-muted)' }}>{member.status}</span>
        </div>
      </div>

      <div className="space-y-3 mt-4 flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Assigned Tasks</p>
        <div className="space-y-2">
          {tasks.filter(t => t.assignedTo === member.id).length === 0 && (
            <p className="text-xs font-bold italic" style={{ color: "var(--text-muted)" }}>No tasks assigned.</p>
          )}
          {tasks.filter(t => t.assignedTo === member.id).map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ backgroundColor: "var(--bg-soft)", border: "1px solid var(--border-color)" }}>
              <span className="text-xs font-bold truncate pr-4" style={{ color: "var(--text-main)" }}>{task.title}</span>
              {task.status === 'completed' ? (
                <CheckCircle2 size={16} color="#10B981" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
        <input type="text" placeholder="Add new task..." value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="flex-1 p-2.5 rounded-xl outline-none font-bold text-xs transition-colors focus:ring-2 focus:ring-[color:var(--accent)]" style={{ backgroundColor: "var(--bg-soft)", color: "var(--text-main)", border: "1px solid var(--border-color)" }} />
        <button type="submit" className="p-2.5 rounded-xl text-white shadow-sm transition-transform active:scale-95" style={{ backgroundColor: "var(--accent)" }}><Plus size={14} strokeWidth={3} /></button>
      </form>
    </motion.div>
  );
};

const TeamHub = () => {
  const [team, setTeam] = useState(() => JSON.parse(localStorage.getItem("team")) || initialTeam);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || initialTasks);
  const [activities, setActivities] = useState(() => JSON.parse(localStorage.getItem("team_activities")) || [
    { id: 1, text: "Alice completed 'Design wireframes'", time: "2h ago" }
  ]);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    localStorage.setItem("team", JSON.stringify(team));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("team_activities", JSON.stringify(activities));
  }, [team, tasks, activities]);

  const handleInvite = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const role = e.target.role.value;
    
    const newMember = {
      id: Date.now(),
      name: email.split('@')[0],
      role: role,
      status: "offline",
      email: email,
      avatar: email.charAt(0).toUpperCase()
    };

    setTeam([...team, newMember]);
    setActivities([{ id: Date.now(), text: `Invited new ${role}: ${email}`, time: "Just now" }, ...activities]);
    toast.success("Invitation sent successfully!", { style: { background: "var(--bg-main)", color: "var(--text-main)" } });
    setShowInvite(false);
  };

  const handleAddTask = (memberId, title) => {
    const newTask = {
      id: Date.now(),
      title,
      assignedTo: memberId,
      status: "pending"
    };
    setTasks([newTask, ...tasks]);
    
    const member = team.find(t => t.id === memberId);
    setActivities([{ id: Date.now(), text: `Assigned task to ${member.name}: ${title}`, time: "Just now" }, ...activities]);
    toast.success("Task assigned!", { style: { background: "var(--bg-main)", color: "var(--text-main)" } });
  };

  const cardStyle = { backgroundColor: "var(--bg-main)", border: "1px solid var(--border-color)" };

  return (
    <div className="max-w-[1400px] mx-auto pb-24 animate-in fade-in duration-500">
      <Toaster position="top-right" />
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 p-8 rounded-[32px] shadow-sm" style={cardStyle}>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: "var(--accent)" }}>
            <Users size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight" style={{ color: "var(--text-main)" }}>Team Hub</h1>
            <p className="font-bold text-sm mt-1" style={{ color: "var(--text-muted)" }}>Collaborate, assign tasks, and track team progress.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowInvite(!showInvite)}
          className="px-8 py-4 rounded-xl font-black text-white text-sm flex items-center gap-2 shadow-xl transition-all hover:-translate-y-1 active:scale-95"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <UserPlus size={20} /> Invite Member
        </button>
      </div>

      <AnimatePresence>
        {showInvite && (
          <motion.form 
            initial={{ opacity: 0, y: -20, height: 0 }} 
            animate={{ opacity: 1, y: 0, height: "auto" }} 
            exit={{ opacity: 0, y: -20, height: 0 }}
            onSubmit={handleInvite} 
            className="mb-10 p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row items-end gap-6 overflow-hidden"
            style={cardStyle}
          >
            <div className="flex-1 w-full space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--text-muted)" }}>Email Address</label>
              <input name="email" required type="email" placeholder="developer@example.com" className="w-full p-4 rounded-xl outline-none font-bold text-sm focus:border-[color:var(--accent)]" style={{ backgroundColor: "var(--bg-soft)", border: "2px solid var(--border-color)", color: "var(--text-main)" }} />
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest ml-1" style={{ color: "var(--text-muted)" }}>Role</label>
              <select name="role" className="w-full p-4 rounded-xl outline-none font-bold text-sm appearance-none focus:border-[color:var(--accent)]" style={{ backgroundColor: "var(--bg-soft)", border: "2px solid var(--border-color)", color: "var(--text-main)" }}>
                <option>Developer</option>
                <option>Designer</option>
                <option>Tester</option>
                <option>Manager</option>
              </select>
            </div>
            <button type="submit" className="w-full md:w-auto px-10 py-4 rounded-xl font-black text-white text-sm shadow-xl transition-all hover:opacity-90 active:scale-95" style={{ backgroundColor: "var(--accent)" }}>
              Send Invite
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* TEAM MEMBERS GRID */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest pl-2" style={{ color: "var(--text-muted)" }}>Active Members ({team.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member) => (
              <TeamMemberCard key={member.id} member={member} tasks={tasks} onAddTask={handleAddTask} />
            ))}
          </div>
        </div>

        {/* ACTIVITY FEED */}
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest pl-2" style={{ color: "var(--text-muted)" }}>Live Activity</h3>
          <div className="p-8 rounded-[32px] shadow-sm space-y-8 relative overflow-hidden" style={cardStyle}>
            {activities.length === 0 ? (
              <p className="text-center text-sm font-bold" style={{ color: "var(--text-muted)" }}>No activity yet.</p>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[color:var(--accent)] before:via-[color:var(--border-color)] before:to-transparent">
                {activities.map((act, i) => (
                  <motion.div key={act.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-6 relative">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm transition-transform hover:scale-110" style={{ backgroundColor: "var(--bg-main)", border: "2px solid var(--accent)", color: "var(--accent)" }}>
                      <Clock size={12} strokeWidth={3} />
                    </div>
                    <div className="pt-1.5 space-y-1 flex-1">
                      <p className="text-sm font-bold leading-snug" style={{ color: "var(--text-main)" }}>{act.text}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{act.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeamHub;
