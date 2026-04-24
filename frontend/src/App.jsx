import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/layout/Layout.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Projects from "./pages/Projects/Projects.jsx";
import Workspace from "./pages/Workspace.jsx";
import Payments from "./pages/Payments/Payments.jsx";
import Disputes from "./pages/Disputes.jsx";
import Settings from "./pages/Settings.jsx";
import Pricing from "./pages/Pricing.jsx";
import CreateProject from "./pages/CreateProject.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import TeamHub from "./pages/TeamHub.jsx";

// ROLE GUARD COMPONENT
const RoleGuard = ({ children, allowedRoles }) => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  
  if (!isLoggedIn) return <Navigate to="/login" />;
  
  const rawRole = localStorage.getItem("role") || user?.role || "Client";
  const userRole = rawRole === "Freelancer" ? "Freelancer" : "Client";

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />; // Or an Unauthorized page
  }
  
  return children;
};

const App = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/dashboard" />} /> 

        {/* PROTECTED ROUTES */}
      <Route path="/" element={isLoggedIn ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/dashboard" />} />
        
        {/* ALL ROLES */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="workspace/:id" element={<Workspace />} />
        <Route path="settings" element={<Settings />} />

        {/* SHARED FEATURES (Client & Freelancer) */}
        <Route path="payments" element={
          <RoleGuard allowedRoles={["Client", "Freelancer"]}>
            <Payments />
          </RoleGuard>
        } />
        <Route path="disputes" element={
          <RoleGuard allowedRoles={["Client", "Freelancer"]}>
            <Disputes />
          </RoleGuard>
        } />

        {/* CLIENT ONLY */}
        <Route path="team" element={
          <RoleGuard allowedRoles={["Client"]}>
            <TeamHub />
          </RoleGuard>
        } />
        <Route path="analytics" element={
          <RoleGuard allowedRoles={["Client"]}>
            <div className="p-10"><h1 className="text-3xl font-black" style={{color: "var(--text-main)"}}>Analytics</h1><p style={{color: "var(--text-muted)"}}>Advanced analytics coming soon...</p></div>
          </RoleGuard>
        } />
        <Route path="create-project" element={
          <RoleGuard allowedRoles={["Client"]}>
            <CreateProject />
          </RoleGuard>
        } />
        <Route path="pricing" element={
          <RoleGuard allowedRoles={["Client", "Freelancer"]}>
            <Pricing />
          </RoleGuard>
        } />
      </Route>

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;
