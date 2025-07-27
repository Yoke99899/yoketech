// App.jsx
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

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
import DisplayPage from "./pages/DisplayManagement/DisplayPage";
import LoginPage from "./pages/LoginPage";
import DatabaseDona from "./pages/DatabaseDona";
import DatabaseOutlet from "./pages/DatabaseOutlet";
import DatabaseProductivity from "./pages/DatabaseProductivity";
import CheckinPage from "./pages/CheckinPage";
import DashboardPage from "./pages/DashboardPage";

import "./index.css";

const RequireAuth = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    window.location.href = "/login";
    return null;
  }
  return children;
};

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100 text-gray-900">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 pt-[20px] ${
    sidebarCollapsed ? "ml-0" : "ml-48"
          }`}
        >
          <Topbar onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)} />
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
              <Route path="/displays" element={<RequireAuth><DisplayPage /></RequireAuth>} />
              <Route path="/dona" element={<RequireAuth><DatabaseDona /></RequireAuth>} />
              <Route path="/outlet" element={<RequireAuth><DatabaseOutlet /></RequireAuth>} />
              <Route path="/productivity" element={<RequireAuth><DatabaseProductivity /></RequireAuth>} />
              <Route path="/checkin" element={<RequireAuth><CheckinPage /></RequireAuth>} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
