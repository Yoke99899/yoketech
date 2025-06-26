import React, { useEffect, useState } from "react";
import { db, ref, onValue, set, update, remove } from "../firebaseClient";
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import { AnimatePresence, motion } from "framer-motion";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm());
  const [editId, setEditId] = useState(null);
  const [filters, setFilters] = useState(initialForm());
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(true);
  const [showPopup, setShowPopup] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const usersRef = ref(db, "user_data");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setUsers(list);
    });
  }, []);

  const filtered = users.filter((u) =>
    Object.keys(filters).every(
      (key) => !filters[key] || (u[key] || "").toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSave = async () => {
    const id = editId || Date.now().toString();
    const refPath = ref(db, `user_data/${id}`);
    const data = { ...form };
    if (editId) await update(refPath, data);
    else await set(refPath, data);
    setForm(initialForm());
    setEditId(null);
    setShowForm(false);
    setShowPopup("Data berhasil disimpan");
    setTimeout(() => setShowPopup(""), 2000);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await remove(ref(db, `user_data/${deleteId}`));
      setDeleteId(null);
      setShowPopup("Data berhasil dihapus");
      setTimeout(() => setShowPopup(""), 2000);
    }
  };

  const handleExport = () => {
    const exportData = filtered.map(({ password, id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "user_data.xlsx");
  };

  return (
    <div className="p-4 text-sm max-w-7xl mx-auto">
      <h2 className="text-xl font-bold text-[#800000] mb-4">User Management</h2>

      {/* Filter Panel */}
      <div className="bg-[#800000] text-white font-bold mb-4 rounded p-4 max-w-[1600px] mx-auto text-xs" onClick={() => setShowFilter(!showFilter)}>
        <span className="font-bold flex items-center gap-4">
          {showFilter ? <FaChevronDown /> : <FaChevronUp />} Filters
        </span>
      </div>
      <AnimatePresence>
        {!showFilter && (																												
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border border-[#800000] p-4 rounded-b grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4"
          >
            {Object.keys(initialForm()).filter(field => field !== "password").map((field) => (
              <input
                key={field}
                className="border px-2 py-1 rounded"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={filters[field]}
                onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add + Export Button */}
      <div className="flex gap-2 mb-2">
        <button onClick={() => { setForm(initialForm()); setEditId(null); setShowForm(true); }} className="bg-[#800000] text-white px-4 py-2 rounded flex items-center gap-1">
          <FaPlus /> Add User
        </button>
        <button onClick={handleExport} className="bg-green-700 text-white px-4 py-2 rounded flex items-center gap-1">
          <FaFileExcel /> Export Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-[500px] border rounded">
        <table className="min-w-[1200px] w-full text-xs">
          <thead className="bg-[#800000] text-white font-bold sticky top-0 z-10">
            <tr>
              {["Name", "Email", "Password", "Role", "Cluster", "Agency", "Channel", "Account", "City", "Branch", "Action"].map((h) => (
                <th key={h} className="p-2 text-left sticky top-0 bg-[#800000] text-white">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((u) => (
              <tr key={u.id} className="border-t">
                {["name", "email", "password", "role", "cluster", "agency", "channel", "account", "city", "branch"].map((k) => (
                  <td key={k} className="p-2 whitespace-nowrap">{u[k]}</td>
                ))}
                <td className="p-2 flex gap-1">
                  <button onClick={() => { setForm(u); setEditId(u.id); setShowForm(true); }} className="bg-yellow-500 text-white px-2 py-1 rounded"><FaEdit /></button>
                  <button onClick={() => setDeleteId(u.id)} className="bg-red-600 text-white px-2 py-1 rounded"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries</span>
        <div className="flex gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}>{i + 1}</button>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="formModal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-6 rounded w-full max-w-2xl">
              <h3 className="text-lg font-bold mb-4">{editId ? "Edit User" : "Tambah User"}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.keys(initialForm()).map((key) => (
                  <input
                    key={key}
                    className="border px-2 py-1 rounded"
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Batal</button>
                <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">Simpan</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            key="deleteConfirm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-6 rounded shadow max-w-md w-full">
              <h4 className="text-lg font-bold mb-2">Konfirmasi Hapus</h4>
              <p className="mb-4">Apakah Anda yakin ingin menghapus data ini?</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setDeleteId(null)} className="bg-gray-400 text-white px-4 py-1 rounded">Batal</button>
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-1 rounded">Hapus</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifikasi Sukses */}
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

function initialForm() {
  return {
    name: "", email: "", password: "", role: "",
    cluster: "", agency: "", channel: "", account: "",
    city: "", branch: ""
  };
}