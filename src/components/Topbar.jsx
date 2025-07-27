import React, { useState } from "react";
import { UserCircle, ChevronDown, LogOut, Menu } from "lucide-react";

const Topbar = ({ onToggleSidebar }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  return (
    <header className="w-full bg-white text-gray-800 px-4 py-2 flex justify-between items-center border-b shadow-md fixed top-0 left-0 right-0 z-50 h-[30px]">
      <div className="flex items-center gap-3">
        {/* ✅ Toggle button SELALU terlihat */}
        <button
          onClick={onToggleSidebar}
          className="text-gray-800 hover:text-blue-600 z-[60] relative"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-md font-semibold hidden md:block">Nama Project</h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="flex items-center gap-2 font-semibold hover:text-blue-600 transition"
        >
          <UserCircle className="w-5 h-5" />
          <span className="uppercase">{currentUser?.name || "USER"}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 shadow-lg border rounded text-sm overflow-hidden z-50 animate-fadeIn">
            <div className="border-b px-4 py-2 font-medium text-gray-600">
              Role: {currentUser?.role || "Unknown"}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
