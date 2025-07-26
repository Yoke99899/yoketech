import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductTable from "./ProductTable";
import AddProductPage from "./AddProductPage";
import EditProductPage from "./EditProductPage";
import UseProductPage from "./UseProductPage";
import { FaPlus, FaUpload, FaDownload, FaEye } from "react-icons/fa";
import { exportProductsToExcel } from "./ProductExport";
export default function ProductPage() {
  const { products, deleteProduct } = UseProductPage();
  const [editData, setEditData] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showFilter, setShowFilter] = useState(true);

  const [filters, setFilters] = useState({
    code: "",
    name: "",
    brand: "",
    category: ""
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredProducts = products.filter((emp) =>
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
      <h1 className="text-md font-bold text-gray-800"> Product Management</h1>

      {isAdding ? (
        <AddProductPage onClose={() => setIsAdding(false)} />
      ) : editData ? (
        <EditProductPage data={editData} onClose={() => setEditData(null)} />
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
            name="product_id"
            value={filters.nik}
            onChange={handleFilterChange}
            placeholder="Product Code"
            className="border p-0.5 rounded focus:ring-2 focus:ring-blue-400 text-[11px]"
          />
          <input
            name="prod.name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Product Name"
            className="border p-0.5 rounded focus:ring-2 focus:ring-blue-400 text-[11px]"
          />
          <input
            name="prod.brand"
            value={filters.email}
            onChange={handleFilterChange}
            placeholder="Brand"
            className="border p-0.5 rounded focus:ring-2 focus:ring-blue-400 text-[11px]"
          />
          <input
            name="prod.category"
            value={filters.leaderName}
            onChange={handleFilterChange}
            placeholder="Product Category"
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
              <button onClick={exportProductsToExcel} className="  flex items-center gap-2 px-2 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 text-[11px]">
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
            <ProductTable
              data={filteredProducts}
              onEdit={(row) => setEditData(row)}
              onDelete={deleteProduct}
            />
          </motion.div>
        </>
      )}
    </div>
  );
}
