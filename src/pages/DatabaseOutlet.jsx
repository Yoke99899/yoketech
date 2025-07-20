import React, { useEffect, useState } from "react";
import { db, ref, onValue, remove } from "../firebaseClient";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export default function DatabaseOutlet() {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showFilter, setShowFilter] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterName, setFilterName] = useState("");

  const rowsPerPage = 25;

  useEffect(() => {
    const dataRef = ref(db, "outlet_data");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.values(data).filter((item) => {
        const name = item.outlet?.toLowerCase() || "";
        const addr = item.address?.toLowerCase() || "";
        return (
          item.outlet &&
          !name.includes("undintified") &&
          !addr.includes("undintified")
        );
      });
      setDataList(list);
    });
  }, []);

  const visibleKeys = [
    "outlet_id", "district", "category", "account", "outlet", "address",
    "owner", "phone", "created_by", "frontliner_id", "created_at", "updated_at", "status", "last_checkin"
  ];

  const handleDelete = async () => {
    if (deleteId) {
      await remove(ref(db, `outlet_data/${deleteId}`));
      setDeleteId(null);
      setShowPopup("Data berhasil dihapus");
      setTimeout(() => setShowPopup(""), 2000);
    }
  };

  // Filter data
  const filteredData = dataList.filter((item) => {
    const matchCategory = item.category?.toLowerCase().includes(filterCategory.toLowerCase());
    const matchName = item.outlet?.toLowerCase().includes(filterName.toLowerCase());
    return matchCategory && matchName;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const displayedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="p-4 text-xs max-w-[1600px] mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Database Outlet</h2>

      {/* Toggle Filter */}
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="mb-2 px-4 py-1 bg-gray-800 text-white rounded"
      >
        {showFilter ? "Sembunyikan Filter" : "Tampilkan Filter"}
      </button>

      {/* Filter Form */}
      {showFilter && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          <input
            type="text"
            placeholder="Filter by Category"
            className="p-2 border rounded"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by Name"
            className="p-2 border rounded"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto max-h-[70vh] border rounded">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-800 text-white sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left sticky left-0 bg-gray-800 z-20">AKSI</th>
              {visibleKeys.map((key) => (
                <th key={key} className="p-2 text-left whitespace-nowrap">
                  {key.replace(/_/g, " ").toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedData.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-2 sticky left-0 bg-white z-10">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-1"><FaEdit /></button>
                  <button onClick={() => setDeleteId(item.id)} className="bg-red-600 text-white px-2 py-1 rounded"><FaTrash /></button>
                </td>
                {visibleKeys.map((key) => (
                  <td key={key} className="p-2 whitespace-nowrap">{item[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          <FaChevronLeft className="inline" /> Prev
        </button>
        <span className="text-sm">Halaman {currentPage} dari {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next <FaChevronRight className="inline" />
        </button>
      </div>

      {/* Popup Konfirmasi Hapus */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-6 rounded shadow max-w-md w-full">
              <h4 className="text-lg font-bold mb-2">Konfirmasi Hapus</h4>
              <p className="mb-4">Yakin ingin menghapus data ini?</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setDeleteId(null)} className="bg-gray-400 text-white px-4 py-1 rounded">Batal</button>
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-1 rounded">Hapus</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup Notifikasi */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg"
          >
            {showPopup}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
