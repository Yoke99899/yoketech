import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircle,
  LogOut,
  Menu,
  ChevronDown
} from "lucide-react";

import UserPage from "./pages/UserPage";
import EmployeePage from "./pages/EmployeePage";
import LoginPage from "./pages/LoginPage";
import DatabaseDona from './pages/DatabaseDona';

import "./index.css";

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100 text-gray-900">
        <motion.div
          key="sidebar"
          initial={{ width: 0 }}
          animate={{ width: sidebarCollapsed ? 64 : 256 }}
          exit={{ width: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 left-0 z-50 bg-gradient-to-br from-[#800000] to-red-800 text-white shadow-2xl overflow-hidden"
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
        </motion.div>

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

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [openMenus, setOpenMenus] = useState({ masterData: true });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="p-3 flex flex-col h-full overflow-y-auto space-y-2">
      {/* Tombol toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="text-white p-2 rounded hover:bg-red-700 transition mx-auto"
      >
        <Menu />
      </button>

      {/* Menu utama */}
      <nav className="space-y-2 mt-6">
        <button
          onClick={() => toggleMenu("masterData")}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-700 w-full ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <i className="fas fa-database" />
          {!collapsed && <span>Master Data</span>}
        </button>

        {openMenus.masterData && (
          <div className={`space-y-1 ${collapsed ? "pl-0" : "pl-4"}`}>
            <Link
              to="/"
              className={`flex items-center gap-2 px-2 py-1 rounded hover:text-red-200 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <UserCircle className="w-5 h-5" />
              {!collapsed && <span>User Management</span>}
            </Link>
            <Link
              to="/employees"
              className={`flex items-center gap-2 px-2 py-1 rounded hover:text-red-200 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <UserCircle className="w-5 h-5" />
              {!collapsed && <span>Employee Management</span>}
            </Link>
               <Link
              to="/dona"
              className={`flex items-center gap-2 px-2 py-1 rounded hover:text-red-200 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <UserCircle className="w-5 h-5" />
              {!collapsed && <span>Database Dona</span>}
            </Link>
          </div>
        )}
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
    <div className="w-full bg-red-800 text-white px-4 py-3 flex justify-end items-center shadow-md z-30 relative">
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
      sidebarCollapsed ? "ml-16" : "ml-64"
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
  <Route
    path="/"
    element={
      <RequireAuth>
        <UserPage />
      </RequireAuth>
    }
  />
  <Route
    path="/employees"
    element={
      <RequireAuth>
        <EmployeePage />
      </RequireAuth>
    }
  />
  
<Route path="/dona" element={<DatabaseDona />} />
  </Routes>
    </motion.div>
  </main>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
