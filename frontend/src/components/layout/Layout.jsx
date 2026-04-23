import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC]"
      style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
