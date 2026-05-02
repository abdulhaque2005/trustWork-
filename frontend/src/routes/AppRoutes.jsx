import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Projects from "../pages/Projects/Projects.jsx";
import Workspace from "../pages/Workspace.jsx";
import Payments from "../pages/Payments/Payments.jsx";
import Disputes from "../pages/Disputes.jsx";
import Settings from "../pages/Settings.jsx";
import CreateProject from "../pages/CreateProject.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import TeamHub from "../pages/TeamHub.jsx";
import Analytics from "../pages/Analytics.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="workspace/:id" element={<Workspace />} />
        <Route path="payments" element={<Payments />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="disputes" element={<Disputes />} />
        <Route path="team" element={<TeamHub />} />
        <Route path="settings" element={<Settings />} />
        <Route path="create-project" element={<ProtectedRoute allowedRoles={["client"]}><CreateProject /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
