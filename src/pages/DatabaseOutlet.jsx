import React, { useEffect, useState } from "react";
import { db, ref, onValue, remove, update } from "../firebaseClient";
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaSpinner } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export default function DatabaseOutlet() {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [confirmSave, setConfirmSave] = useState(false);
  const [showFilter, setShowFilter] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterName, setFilterName] = useState("");
  const [loading, setLoading] = useState(true);

  const rowsPerPage = 25;

  useEffect(() => {
    setLoading(true);
    const dataRef = ref(db, "outlet_data");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, value]) => ({ id, ...value }));
      const filtered = list.filter((item) => {
        const name = item.outlet?.toLowerCase() || "";
        const addr = item.address?.toLowerCase() || "";
        return item.outlet && !name.includes("undintified") && !addr.includes("undintified");
      });
      setDataList(filtered);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (editData && (!editData.latitude || !editData.longitude)) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setEditData((prev) => ({
              ...prev,
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6),
            }));
          },
          (error) => {
            console.warn("Lokasi tidak tersedia:", error.message);
          }
        );
      }
    }
  }, [editData]);

  const visibleKeys = [
    "outlet_id", "district", "category", "account", "outlet", "address",
    "owner", "phone", "created_by", "frontliner_id", "created_at", "updated_at", "status", "last_checkin",
    "latitude", "longitude"
  ];

  const handleDelete = async () => {
    if (deleteId) {
      await remove(ref(db, `outlet_data/${deleteId}`));
      setDeleteId(null);
      setShowPopup("Data berhasil dihapus");
      setTimeout(() => setShowPopup(""), 2000);
    }
  };

  const handleSaveEdit = () => {
    if (editData?.id) {
      update(ref(db, `outlet_data/${editData.id}`), editData)
        .then(() => {
          setEditData(null);
          setConfirmSave(false);
          setShowPopup("Perubahan berhasil disimpan");
          setTimeout(() => setShowPopup(""), 2000);
        });
    }
  };

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

      <button
        onClick={() => setShowFilter(!showFilter)}
        className="mb-2 px-4 py-1 bg-gray-800 text-white rounded"
      >
        {showFilter ? "Sembunyikan Filter" : "Tampilkan Filter"}
      </button>

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
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="animate-spin text-3xl text-blue-600" />
          </div>
        ) : (
          <table className="min-w-full text-xs">
            <thead className="bg-gray-800 text-white sticky top-0 z-50">
              <tr>
                <th className="p-2 text-left sticky left-0 z-30 bg-gray-800 w-24">AKSI</th>
                {visibleKeys.map((key) => (
                  <th key={key} className="p-2 text-left whitespace-nowrap">{key.toUpperCase().replace(/_/g, " ")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedData.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-2 sticky left-0 z-20 bg-white w-24">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-1"
                      onClick={() => setEditData({ ...item })}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      <FaTrash />
                    </button>
                  </td>
                  {visibleKeys.map((key) => (
                    <td key={key} className="p-2 whitespace-nowrap">{item[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && (
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
      )}

      {/* Modal Edit */}
      <AnimatePresence>
        {editData && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-6 rounded shadow max-w-xl w-full">
              <h4 className="text-lg font-bold mb-4">Edit Data</h4>
              <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
                {visibleKeys.map((key) => (
                  <input
                    key={key}
                    className="border p-2 text-sm"
                    placeholder={key}
                    value={editData[key] || ""}
                    readOnly={["latitude", "longitude"].includes(key)}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                  />
                ))}
                <button
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          setEditData((prev) => ({
                            ...prev,
                            latitude: position.coords.latitude.toFixed(6),
                            longitude: position.coords.longitude.toFixed(6),
                          }));
                        },
                        (error) => {
                          alert("Gagal deteksi lokasi: " + error.message);
                        }
                      );
                    }
                  }}
                  className="col-span-2 bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Deteksi Lokasi Sekarang
                </button>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setEditData(null)} className="bg-gray-400 text-white px-4 py-1 rounded">Batal</button>
                <button onClick={() => setConfirmSave(true)} className="bg-green-600 text-white px-4 py-1 rounded">Simpan</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup Konfirmasi Hapus */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-gradient-to-br from-blue-500 to-green-500 text-white p-6 rounded-lg shadow-lg max-w-md w-full">
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

      {/* Konfirmasi Simpan */}
      <AnimatePresence>
        {confirmSave && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
          >
            <div className="bg-gradient-to-br from-blue-500 to-green-500 text-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-bold mb-2">Konfirmasi Simpan</h3>
              <p className="mb-4">Apakah kamu yakin ingin menyimpan perubahan ini?</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setConfirmSave(false)} className="bg-white text-black px-4 py-1 rounded">Batal</button>
                <button onClick={handleSaveEdit} className="bg-black px-4 py-1 rounded">Simpan</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifikasi */}
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