import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Projects from "../pages/Projects/Projects.jsx";
import Workspace from "../pages/Workspace.jsx";
import Payments from "../pages/Payments/Payments.jsx";
import Disputes from "../pages/Disputes.jsx";
import Settings from "../pages/Settings.jsx";
import Pricing from "../pages/Pricing.jsx";
import CreateProject from "../pages/CreateProject.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import TeamHub from "../pages/TeamHub.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="workspace/:id" element={<Workspace />} />
        <Route path="settings" element={<Settings />} />

        <Route path="payments" element={
          <ProtectedRoute allowedRoles={["Client", "Freelancer"]}>
            <Payments />
          </ProtectedRoute>
        } />
        <Route path="disputes" element={
          <ProtectedRoute allowedRoles={["Client", "Freelancer"]}>
            <Disputes />
          </ProtectedRoute>
        } />
        <Route path="team" element={
          <ProtectedRoute allowedRoles={["Client"]}>
            <TeamHub />
          </ProtectedRoute>
        } />
        <Route path="analytics" element={
          <ProtectedRoute allowedRoles={["Client"]}>
            <div className="p-10">
              <h1 className="text-3xl font-black" style={{color: "var(--text-main)"}}>Analytics</h1>
              <p style={{color: "var(--text-muted)"}}>Advanced analytics coming soon...</p>
            </div>
          </ProtectedRoute>
        } />
        <Route path="create-project" element={
          <ProtectedRoute allowedRoles={["Client"]}>
            <CreateProject />
          </ProtectedRoute>
        } />
        <Route path="pricing" element={
          <ProtectedRoute allowedRoles={["Client", "Freelancer"]}>
            <Pricing />
          </ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
