import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserCircle,
  LogOut,
  Menu,
  ChevronDown,
  MapPin,
  Database,
  Users,
  Map,
  Landmark,
  FolderKanban,
  Store,
  LineChart
} from "lucide-react";

import UserPage from "./pages/UserPage";
import EmployeePage from "./pages/EmployeeManagement/EmployeePage";
import DistrictPage from "./pages/DistrictManagement/DistrictPage";
import ProvinsiPage from "./pages/ProvinsiManagement/ProvinsiPage";
import AccountPage from "./pages/AccountManagement/AccountPage";
import CityPage from "./pages/CityManagement/CityPage";
import ChannelPage from "./pages/ChannelManagement/ChannelPage";
import BrandPage from "./pages/BrandManagement/BrandPage";
import BrandCompetitorPage from "./pages/BrandCompetitorManagement/BrandCompetitorPage";
import CategoryPage from "./pages/CategoryManagement/CategoryPage";
import StorePage from "./pages/StoreManagement/StorePage";
import ProductPage from "./pages/ProductManagement/ProductPage";
import LoginPage from "./pages/LoginPage";
import DatabaseDona from "./pages/DatabaseDona";
import DatabaseOutlet from "./pages/DatabaseOutlet";
import DatabaseProductivity from "./pages/DatabaseProductivity";
import CheckinPage from "./pages/CheckinPage";
import DashboardPage from "./pages/DashboardPage";

import "./index.css";

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100 text-gray-900">
        {!sidebarCollapsed && (
          <motion.div
            key="sidebar"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white shadow-lg flex flex-col overflow-hidden"
          >
            <Sidebar collapsed={false} setCollapsed={setSidebarCollapsed} />
          </motion.div>
        )}

        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow hover:bg-gray-700"
          >
            <Menu />
          </button>
        )}

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
  const isMaster = ["master", "admin", "Master Admin"].includes(currentUser?.role);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="p-4 flex flex-col h-full overflow-y-auto space-y-4 bg-gray-900 text-sm">
      <button
        onClick={() => setCollapsed(true)}
        className="text-white p-2 rounded hover:bg-gray-800 transition mx-auto"
      >
        <Menu />
      </button>

      <nav className="space-y-2 mt-6">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <UserCircle className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        {isMaster && (
          <>
            <button
              onClick={() => toggleMenu("masterData")}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 w-full"
            >
              <Database className="w-5 h-5" />
              <span>Master Data</span>
              <ChevronDown className="w-4 h-4 ml-auto" />
            </button>

            {openMenus.masterData && (
              <div className="space-y-1 pl-6 text-sm">
                <Link to="/user" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
                  <UserCircle className="w-4 h-4" />
                  User Management
                </Link>
                <Link to="/employees" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
                  <Users className="w-4 h-4" />
                  Employee Management
                </Link>
                <Link to="/districts" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
                  <Map className="w-4 h-4" />
                  District Management
                </Link>
                <Link to="/provinsis" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
                  <Landmark className="w-4 h-4" />
                  Provinsi Management
                </Link>
		<Link to="/citys" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
                  <Landmark className="w-4 h-4" />
                  City Management
                </Link>
		<Link to="/channels" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
                  <Landmark className="w-4 h-4" />
                  Channel Management
                </Link>
		<Link to="/accounts" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
                  <Landmark className="w-4 h-4" />
                  Account Management
                </Link>
		<Link to="/brands" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
                  <Landmark className="w-4 h-4" />
                  Brand Management
                </Link>
		<Link to="/brandcompetitors" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
                  <Landmark className="w-4 h-4" />
                  Brand Competitor Management
                </Link>
		<Link to="/categorys" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
                  <Landmark className="w-4 h-4" />
                  Category Management
                </Link>
		<Link to="/stores" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
                  <Landmark className="w-4 h-4" />
                  Store Management
                </Link>
		<Link to="/products" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
                  <Landmark className="w-4 h-4" />
                  Product Management
                </Link>
                <Link to="/dona" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
                  <FolderKanban className="w-4 h-4" />
                  Database Dona
                </Link>
                <Link to="/outlet" className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-800">
                  <Store className="w-4 h-4" />
                  Database Outlet
                </Link>
              </div>
            )}
          </>
        )}

        <Link to="/productivity" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          <LineChart className="w-5 h-5" />
          Productivity
        </Link>

        <Link to="/checkin" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition">
          <MapPin className="w-5 h-5" />
          Check-in Outlet
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
    <div className="w-full bg-gray-800 text-white px-6 py-4 flex justify-end items-center border-b z-30 shadow">
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 font-semibold hover:text-gray-300"
        >
          <UserCircle className="w-5 h-5" />
          {currentUser?.name?.toUpperCase() || "USER"}
          <ChevronDown className="w-4 h-4" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-md rounded z-50">
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
    className={`flex-1 overflow-y-auto bg-white transition-all duration-300 ${
      sidebarCollapsed ? "ml-0" : "ml-64"
    }`}
  >
    <TopBar />
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6"
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/user" element={<RequireAuth><UserPage /></RequireAuth>} />
        <Route path="/employees" element={<RequireAuth><EmployeePage /></RequireAuth>} />
        <Route path="/districts" element={<RequireAuth><DistrictPage /></RequireAuth>} />
	<Route path="/provinsis" element={<RequireAuth><ProvinsiPage /></RequireAuth>} />
	<Route path="/citys" element={<RequireAuth><CityPage /></RequireAuth>} />
	<Route path="/channels" element={<RequireAuth><ChannelPage /></RequireAuth>} />
	<Route path="/accounts" element={<RequireAuth><AccountPage /></RequireAuth>} />
	<Route path="/brands" element={<RequireAuth><BrandPage /></RequireAuth>} />
	<Route path="/brandcompetitors" element={<RequireAuth><BrandCompetitorPage /></RequireAuth>} />
	<Route path="/categorys" element={<RequireAuth><CategoryPage /></RequireAuth>} />
	<Route path="/stores" element={<RequireAuth><StorePage /></RequireAuth>} />
	<Route path="/products" element={<RequireAuth><ProductPage /></RequireAuth>} />
        <Route path="/dona" element={<RequireAuth><DatabaseDona /></RequireAuth>} />
        <Route path="/outlet" element={<RequireAuth><DatabaseOutlet /></RequireAuth>} />
        <Route path="/productivity" element={<RequireAuth><DatabaseProductivity /></RequireAuth>} />
        <Route path="/checkin" element={<RequireAuth><CheckinPage /></RequireAuth>} />
      </Routes>
    </motion.div>
  </main>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
