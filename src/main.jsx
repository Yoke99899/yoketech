import React, { useState, useContext, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Table, MessageCircle, LogOut, Menu } from "lucide-react";

import DashboardSellout from "./pages/DashboardSellout";
import SelloutTable from "./pages/SelloutTable";
import Data2Table from "./pages/Data2Table";
import FancyTable from "./pages/FancyTable";
import LoginPage from "./pages/LoginPage";

import { GoogleAuthProvider, AuthContext } from "./GoogleAuthProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

// Middleware untuk mengecek otentikasi
const RequireAuth = ({ children }) => {
  const { accessToken } = useContext(AuthContext);
  return accessToken ? children : <Navigate to="/login" replace />;
};

// Komponen utama aplikasi
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef();

  // Menutup sidebar ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <GoogleAuthProvider>
      <BrowserRouter>
        <div className="flex h-screen">
          <AnimatePresence>
            {sidebarOpen && (
              <>
                {/* Overlay */}
                <motion.div
                  key="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                  style={{ WebkitBackdropFilter: "blur(6px)" }}
                />

                {/* Sidebar */}
                <motion.div
                  key="sidebar"
                  ref={sidebarRef}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 100 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.y > 80) setSidebarOpen(false);
                  }}
                  className="fixed bottom-0 left-0 right-0 z-50 w-full md:top-0 md:bottom-0 md:w-64 md:h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl md:rounded-tr-2xl md:rounded-tl-2xl border-t border-blue-700"
                >
                  <Sidebar setSidebarOpen={setSidebarOpen} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <MainContent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
      </BrowserRouter>
    </GoogleAuthProvider>
  );
};

// Komponen Sidebar
const Sidebar = ({ setSidebarOpen }) => {
  const { accessToken, logout, user } = useContext(AuthContext);

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Tombol tutup sidebar */}
      <div className="flex justify-end mb-4">
        <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 relative group focus:outline-none">
          <span className="sr-only">Close</span>
          <span className="absolute block w-6 h-0.5 bg-white transform rotate-45 group-hover:rotate-90 transition duration-300"></span>
          <span className="absolute block w-6 h-0.5 bg-white transform -rotate-45 group-hover:-rotate-90 transition duration-300"></span>
        </button>
      </div>

      {/* Info Pengguna */}
      <div className="flex flex-col items-center text-center mb-6">
        {user && (
          <>
            <img
              src={user.picture}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-white shadow-lg mb-2"
            />
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-blue-200">{user.email}</p>
          </>
        )}
      </div>

      {/* Navigasi */}
      <nav className="w-full space-y-2 text-sm">
        <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 shadow-md">
          <LayoutDashboard className="w-5 h-5 text-cyan-300" />
          <span>Dashboard Sellout</span>
        </Link>
        <Link to="/sellout2" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 shadow-md">
          <Table className="w-5 h-5 text-cyan-300" />
          <span>Sell Out Table</span>
        </Link>
        <Link to="/inbox" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 shadow-md">
          <MessageCircle className="w-5 h-5 text-cyan-300" />
          <span>Pesan WhatsApp</span>
        </Link>
      </nav>

      {/* Logout */}
      {accessToken && (
        <button
          onClick={() => {
            logout();
            setSidebarOpen(false);
          }}
          className="mt-6 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-4 py-2 rounded text-sm w-full shadow-md transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      )}
    </div>
  );
};

// Komponen konten utama
const MainContent = ({ sidebarOpen, setSidebarOpen }) => (
  <main className="flex-1 overflow-y-auto bg-gray-50 relative">
    {!sidebarOpen && (
      <button
        onClick={() => setSidebarOpen(true)}
        className="p-2 m-2 bg-white text-gray-800 rounded-full shadow-lg fixed top-4 left-3 z-50 border border-gray-200 hover:bg-gray-100 transition"
      >
        <Menu className="w-5 h-5" />
      </button>
    )}

    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RequireAuth><DashboardSellout /></RequireAuth>} />
      <Route path="/sellout2" element={<RequireAuth><SelloutTable /></RequireAuth>} />
      <Route path="/data2" element={<RequireAuth><Data2Table /></RequireAuth>} />
      <Route path="/inbox" element={<RequireAuth><FancyTable /></RequireAuth>} />
    </Routes>
  </main>
);

// Render aplikasi ke DOM
ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
