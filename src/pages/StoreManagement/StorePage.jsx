import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StoreTable from "./StoreTable";
import AddStorePage from "./AddStorePage";
import EditStorePage from "./EditStorePage";
import UseStorePage from "./UseStorePage";
import { FaPlus, FaUpload, FaDownload, FaEye } from "react-icons/fa";
import { exportStoresToExcel } from "./storeExport";

export default function StorePage() {
  const { stores, deleteStore } = UseStorePage();
  const [editData, setEditData] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showFilter, setShowFilter] = useState(true);

  const [filters, setFilters] = useState({
    store_id: "",
    store_name: "",
    address: "",
    city: ""
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredStores = stores.filter((emp) =>
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
      <h1 className="text-md font-bold text-gray-800"> Store Management</h1>

      {isAdding ? (
        <AddStorePage onClose={() => setIsAdding(false)} />
      ) : editData ? (
        <EditStorePage data={editData} onClose={() => setEditData(null)} />
      ) : (
        <>
          {/* Filter Header */}
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  className="rounded-md overflow-hidden shadow-md"
>
  <div className="bg-gradient-to-r from-gray-800 to-gray-500 px-4 py-1.5  text-white flex justify-between items-center">
    <span className="font-semibold text-[11px]">Filters</span>
    <button
      onClick={() => setShowFilter((prev) => !prev)}
      className="text-sm flex items-center gap-1 hover:opacity-80"
    >
      {showFilter ? (
        <>
          <span></span>
          <span className="font-semibold text-[11px]">Hide Filter</span>
        </>
      ) : (
        <>
          <span></span>
          <span className="font-semibold text-[11px]">Show Filter</span>
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
        <div className="bg-white p-4 grid grid-cols-3 sm:grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <input
            name="store_id"
            value={filters.nik}
            onChange={handleFilterChange}
            placeholder="Store ID"
            className="border p-0.5 rounded focus:ring-2 focus:ring-blue-400 text-[11px]"
          />
          <input
            name="store_name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Store Name"
            className="border p-0.5 rounded focus:ring-2 focus:ring-blue-400 text-[11px]"
          />
          <input
            name="adress"
            value={filters.email}
            onChange={handleFilterChange}
            placeholder="Alamat"
            className="border p-0.5 rounded focus:ring-2 focus:ring-blue-400 text-[11px]"
          />
          <input
            name="city"
            value={filters.leaderName}
            onChange={handleFilterChange}
            placeholder="City"
            className="border p-0.5 rounded focus:ring-2 focus:ring-blue-400 text-[11px]"
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-[11px]"
              >
                <FaPlus /> Add
              </button>
              <button className="flex items-center gap-2 px-2 py-2 bg-cyan-600 text-white rounded shadow hover:bg-cyan-700 text-[11px]">
                <FaUpload /> Uploads
              </button>
              <button className="flex items-center gap-2 px-2 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 text-[11px]">
                <FaEye /> Upload Status
              </button>
            </div>

            <div className="flex gap-2">
              <button onClick={exportStoresToExcel}  className="flex items-center gap-2 px-2 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 text-[11px]">
                <FaDownload /> Download
              </button>
              <button className="flex items-center gap-2 px-2 py-1 bg-teal-600 text-white rounded shadow hover:bg-teal-700 text-[11px]">
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
            <StoreTable
              data={filteredStores}
              onEdit={(row) => setEditData(row)}
              onDelete={deleteStore}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}
