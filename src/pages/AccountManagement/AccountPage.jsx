import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AccountTable from "./AccountTable";
import AddAccountPage from "./AddAccountPage";
import EditAccountPage from "./EditAccountPage";
import UseAccountPage from "./UseAccountPage";
import { FaPlus, FaUpload, FaDownload, FaEye } from "react-icons/fa";

export default function AccountPage() {
  const { accounts, deleteAccount } = UseAccountPage();
  const [editData, setEditData] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showFilter, setShowFilter] = useState(true);

  const [filters, setFilters] = useState({
    account: "",
  
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredAccounts = accounts.filter((emp) =>
    Object.entries(filters).every(([key, val]) =>
      val.trim() === ""
        ? true
        : (emp[key] || "")
            .toString()
            .toLowerCase()
            .includes(val.toLowerCase())
    )
  );

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <h1 className="text-md font-bold text-gray-800"> Account Management</h1>

      {isAdding ? (
        <AddAccountPage onClose={() => setIsAdding(false)} />
      ) : editData ? (
        <EditAccountPage data={editData} onClose={() => setEditData(null)} />
      ) : (
        <>
          {/* Filter Header */}
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  className="rounded-md overflow-hidden shadow-md"
>
  <div className="bg-gradient-to-r from-gray-800 to-gray-500 px-4 py-1.5 text-white flex justify-between items-center">
    <span className="font-semibold text-sm">Filters</span>
    <button
      onClick={() => setShowFilter((prev) => !prev)}
      className="text-sm flex items-center gap-1 hover:opacity-80"
    >
      {showFilter ? (
        <>
          <span></span>
          <span className="font-semibold text-sm">Hide Filter</span>
        </>
      ) : (
        <>
          <span></span>
          <span className="font-semibold text-sm">Show Filter</span>
        </>
      )}
    </button>
  </div>

  <AnimatePresence initial={false}>
    {showFilter && (
      <motion.div
        key="filterbox"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="bg-white p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <input
            name="account"
            value={filters.account}
            onChange={handleFilterChange}
            placeholder="Account"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400 text-sm"
          />
          
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>


          {/* Action Buttons */}
          <div className="flex flex-wrap justify-between items-center gap-4 mt-2">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-sm"
              >
                <FaPlus /> Add
              </button>
              <button className="flex items-center gap-2 px-2 py-2 bg-cyan-600 text-white rounded shadow hover:bg-cyan-700 text-sm">
                <FaUpload /> Uploads
              </button>
              <button className="flex items-center gap-2 px-2 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 text-sm">
                <FaEye /> Upload Status
              </button>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-2 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 text-sm">
                <FaDownload /> Download
              </button>
              <button className="flex items-center gap-2 px-2 py-1 bg-teal-600 text-white rounded shadow hover:bg-teal-700 text-sm">
                <FaEye /> Download Status
              </button>
            </div>
          </div>

          {/* Table Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white mt-6 rounded-xl shadow overflow-hidden"
          >
            <AccountTable
              data={filteredAccounts}
              onEdit={(row) => setEditData(row)}
              onDelete={deleteAccount}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}
