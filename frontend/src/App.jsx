import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

function DashboardPlaceholder() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to EscrowFlow Dashboard</h2>
      <p className="text-gray-500">Your layout and navigation are set up. Select an option from the sidebar to get started.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPlaceholder />} />
          <Route path="*" element={<DashboardPlaceholder />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
