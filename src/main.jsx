import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserCircle,
  LogOut,
  Menu,
  ChevronDown
} from "lucide-react";

import UserPage from "./pages/UserPage";
import EmployeePage from "./pages/EmployeePage";
import LoginPage from "./pages/LoginPage";
import DatabaseDona from "./pages/DatabaseDona";
import DatabaseOutlet from "./pages/DatabaseOutlet";
import DatabaseProductivity from "./pages/DatabaseProductivity";

import "./index.css";

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100 text-gray-900">
        {/* Sidebar */}
        {!sidebarCollapsed && (
          <motion.div
            key="sidebar"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#7b0f0f] to-[#a31616] text-white shadow-lg flex flex-col overflow-hidden"
          >
            <Sidebar collapsed={false} setCollapsed={setSidebarCollapsed} />
          </motion.div>
        )}

        {/* Sidebar Toggle Button */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow"
          >
            <Menu />
          </button>
        )}

        {/* Main content */}
        <MainContent sidebarCollapsed={sidebarCollapsed} />
      </div>
    </BrowserRouter>
  );
};

const RequireAuth = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    window.location.href = "/login";
    return null;
  }
  return children;
};

const Sidebar = ({ setCollapsed }) => {
  const [openMenus, setOpenMenus] = useState({ masterData: true });
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isMaster = ["Master Admin", "admin", "Master Admin"].includes(currentUser?.role);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="p-3 flex flex-col h-full overflow-y-auto space-y-2">
      <button
        onClick={() => setCollapsed(true)}
        className="text-white p-2 rounded hover:bg-red-700 transition mx-auto"
      >
        <Menu />
      </button>

      <nav className="space-y-2 mt-6">
        {isMaster && (
          <>
            <button
              onClick={() => toggleMenu("masterData")}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-700 w-full"
            >
              <i className="fas fa-database" />
              <span>Master Data</span>
            </button>

            {openMenus.masterData && (
              <div className="space-y-1 pl-4">
                <Link to="/" className="flex items-center gap-2 px-2 py-1 rounded hover:text-red-200">
                  <UserCircle className="w-5 h-5" />
                  <span>User Management</span>
                </Link>
                <Link to="/employees" className="flex items-center gap-2 px-2 py-1 rounded hover:text-red-200">
                  <UserCircle className="w-5 h-5" />
                  <span>Employee Management</span>
                </Link>
                <Link to="/dona" className="flex items-center gap-2 px-2 py-1 rounded hover:text-red-200">
                  <UserCircle className="w-5 h-5" />
                  <span>Database Dona</span>
                </Link>
                <Link to="/outlet" className="flex items-center gap-2 px-2 py-1 rounded hover:text-red-200">
                  <UserCircle className="w-5 h-5" />
                  <span>Database Outlet</span>
                </Link>
              </div>
            )}
          </>
        )}

        <Link to="/productivity" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-700">
          <UserCircle className="w-5 h-5" />
          <span>Database Productivity</span>
        </Link>
      </nav>
    </div>
  );
};

const TopBar = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#ff007a] to-[#007bff] text-white px-4 py-3 flex justify-end items-center shadow-md z-30 relative">
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 font-semibold hover:text-gray-200"
        >
          <UserCircle className="w-5 h-5" />
          {currentUser?.name?.toUpperCase() || "USER"}
          <ChevronDown className="w-4 h-4" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow rounded z-50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MainContent = ({ sidebarCollapsed }) => (
  <main
    className={`flex-1 overflow-y-auto bg-white relative transition-all duration-300 ${
      sidebarCollapsed ? "ml-0" : "ml-64"
    }`}
  >
    <TopBar />
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RequireAuth><DatabaseProductivity /></RequireAuth>} />
        <Route path="/employees" element={<RequireAuth><EmployeePage /></RequireAuth>} />
        <Route path="/dona" element={<RequireAuth><DatabaseDona /></RequireAuth>} />
        <Route path="/outlet" element={<RequireAuth><DatabaseOutlet /></RequireAuth>} />
        <Route path="/productivity" element={<RequireAuth><DatabaseProductivity /></RequireAuth>} />
      </Routes>
    </motion.div>
  </main>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);