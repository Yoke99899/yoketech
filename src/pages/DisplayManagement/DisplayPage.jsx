import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DisplayTable from "./DisplayTable";
import AddDisplayPage from "./AddDisplayPage";
import EditDisplayPage from "./EditDisplayPage";
import UseDisplayPage from "./UseDisplayPage";
import { FaPlus, FaUpload, FaDownload, FaEye } from "react-icons/fa";
import { exportDisplaysToExcel } from "./DisplayExport";
export default function DisplayPage() {
  const { displays, deleteDisplay } = UseDisplayPage();
  const [editData, setEditData] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showFilter, setShowFilter] = useState(true);

  const [filters, setFilters] = useState({
    employee_name:"",
    product_name: "",
    store_name: "",
    display_name: ""
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredDisplays = displays.filter((emp) =>
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
      <h1 className="text-md font-bold text-gray-800"> Display Management</h1>

      {isAdding ? (
        <AddDisplayPage onClose={() => setIsAdding(false)} />
      ) : editData ? (
        <EditDisplayPage data={editData} onClose={() => setEditData(null)} />
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
            name="employee_name"
            value={filters.nik}
            onChange={handleFilterChange}
            placeholder="Nama"
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
            name="product_name"
            value={filters.email}
            onChange={handleFilterChange}
            placeholder="product_name"
            className="border p-0.5 rounded focus:ring-2 focus:ring-blue-400 text-[11px]"
          />
          <input
            name="display_name"
            value={filters.leaderName}
            onChange={handleFilterChange}
            placeholder="Display"
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
              <button onClick={exportDisplaysToExcel} className="  flex items-center gap-2 px-2 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 text-[11px]">
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
            <DisplayTable
              data={filteredDisplays}
              onEdit={(row) => setEditData(row)}
              onDelete={deleteDisplay}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}
