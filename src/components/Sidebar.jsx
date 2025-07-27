import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  ChevronDown,
  UserCircle,
  Database,
  Users,
  Map,
  Landmark,
  FolderKanban,
  Store,
  LineChart,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [openMenus, setOpenMenus] = useState({ masterData: true });
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isMaster = ["master", "admin", "Master Admin"].includes(currentUser?.role);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const isActive = (path) => location.pathname === path;

  const linkClasses = (active) =>
    `flex items-center gap-3 px-4 py-2 rounded-md text-[11px] font-medium hover:bg-gray-800 transition ${
      active ? "bg-gray-800 text-white" : "text-gray-300"
    }`;

  return (
    <AnimatePresence>
      {!collapsed && (
        <motion.aside
          key="sidebar"
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 z-40 w-64 h-full bg-gray-900 text-white shadow-lg border-r border-gray-800 flex flex-col"
        >
          <div className="flex items-center justify-between px-1 py-1 border-b border-gray-700">
            <h2 className="text-xl font-bold tracking-wide">Project Name</h2>
            <button onClick={() => setCollapsed(true)} className="text-white hover:text-gray-300">
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
            <Link to="/" onClick={() => setCollapsed(true)} className={linkClasses(isActive("/"))}>
              <UserCircle className="w-4 h-4" /> Dashboard
            </Link>

            {isMaster && (
              <div>
                <button
                  onClick={() => toggleMenu("masterData")}
                  className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-md hover:bg-gray-800 transition text-[11px] text-gray-300"
                >
                  <Database className="w-4 h-4" /> Master Data
                  <ChevronDown
                    className={`w-4 h-4 ml-auto transition-transform ${
                      openMenus.masterData ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openMenus.masterData && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-6 mt-1 space-y-1"
                    >
                      {[
                        ["/user", "User Management", UserCircle],
                        ["/employees", "Employee Management", Users],
                        ["/districts", "District Management", Map],
                        ["/provinsis", "Provinsi Management", Landmark],
                        ["/citys", "City Management", Landmark],
                        ["/channels", "Channel Management", Landmark],
                        ["/accounts", "Account Management", Landmark],
                        ["/brands", "Brand Management", Landmark],
                        ["/brandcompetitors", "Brand Competitor", Landmark],
                        ["/categorys", "Category Management", Landmark],
                        ["/stores", "Store Management", Store],
                        ["/products", "Product Management", Store],
                        ["/displays", "Display Management", Store],
                        ["/dona", "Database Dona", FolderKanban],
                        ["/outlet", "Database Outlet", Store],
                      ].map(([path, label, Icon]) => (
                        <Link key={path} to={path} onClick={() => setCollapsed(true)} className={linkClasses(isActive(path))}>
                          <Icon className="w-4 h-4" /> {label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <Link to="/productivity" onClick={() => setCollapsed(true)} className={linkClasses(isActive("/productivity"))}>
              <LineChart className="w-4 h-4" /> Productivity
            </Link>

            <Link to="/checkin" onClick={() => setCollapsed(true)} className={linkClasses(isActive("/checkin"))}>
              <MapPin className="w-4 h-4" /> Check-in Outlet
            </Link>
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
