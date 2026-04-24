import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div
      className="flex min-h-screen transition-colors duration-300"
      style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "var(--bg-page)" }}
    >
      <Sidebar />
      <div className="flex flex-col flex-1 ml-64">
        <Navbar />
        <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
