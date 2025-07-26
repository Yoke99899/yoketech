import React, { useState } from "react";
import { ref, update } from "firebase/database";
import { db } from "../../firebaseClient";
import { FaEdit, FaTrash, FaEyeSlash, FaEye } from "react-icons/fa";
import { showToast } from "../../utils/toast"; // Pastikan path ini benar

export default function StoreTable({ data, onEdit, onDelete }) {
  const [confirmId, setConfirmId] = useState(null);
  const [confirmName, setConfirmName] = useState("");

  const handleAskDelete = (emp) => {
    setConfirmId(emp.id);
    setConfirmName(emp.store_name);
  };

  const handleCancel = () => {
    setConfirmId(null);
    setConfirmName("");
  };

  const handleConfirmDelete = () => {
    if (confirmId) {
      onDelete(confirmId);
      showToast("Data berhasil dihapus", "success");
      handleCancel();
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    if (!id) return;
    const newStatus = currentStatus === "Aktif" ? "Tidak Aktif" : "Aktif";
    try {
      await update(ref(db, `store_data/${id}`), { status: newStatus });
      showToast(`Status diubah menjadi "${newStatus}"`, "info");
    } catch (err) {
      console.error(err);
      showToast("Gagal update status", "error");
    }
  };

  const handleEdit = (emp) => {
    onEdit(emp);
    showToast("Mode edit dibuka", "info");
  };

  return (
    <div className="overflow-auto max-w-full border rounded shadow relative">
      <table className="w-full table-auto text-[11px] text-gray-800">
        <thead className="bg-gray-800 text-white sticky top-0 z-10">
          <tr>
            <th className="p-2 border">No</th>
            <th className="p-2 border">Store ID</th>
            <th className="p-2 border">Store Name</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Account</th>
            <th className="p-2 border">Channel</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">District</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Provinsi</th>
            <th className="p-2 border">Distribution</th>
            <th className="p-2 border">Latitude</th>
            <th className="p-2 border">Longtitude</th>
            <th className="p-2 border">Creat at</th>
            <th className="p-2 border">Store Owner</th>
            <th className="p-2 border">Store Phone</th>
            <th className="p-2 border">Store Remarks</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Last Visit</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((emp, idx) => (
            <tr key={emp.id || idx} className="hover:bg-gray-50">
              <td className="p-2 border text-center">{idx + 1}</td>
              <td className="p-2 border">{emp.store_id}</td>
              <td className="p-2 border">{emp.store_name}</td>
              <td className="p-2 border">{emp.adress}</td>
              <td className="p-2 border">{emp.account}</td>
              <td className="p-2 border">{emp.channel}</td>
              <td className="p-2 border">{emp.category}</td>
              <td className="p-2 border">{emp.district}</td>
              <td className="p-2 border">{emp.city}</td>
              <td className="p-2 border">{emp.pronvinsi}</td>
              <td className="p-2 border">{emp.distribution}</td>
              <td className="p-2 border">{emp.latitude}</td>
              <td className="p-2 border">{emp.longtitude}</td>
              <td className="p-2 border">{emp.creat_at}</td>
              <td className="p-2 border">{emp.owner}</td>
              <td className="p-2 border">{emp.phone}</td>
              <td className="p-2 border">{emp.remarks}</td>
              <td className="p-2 border">{emp.status}</td>
              <td className="p-2 border">{emp.last_visit}</td>
              <td className="p-2 border text-center">
                <div className="flex justify-center gap-1">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="p-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition"
                    title="Edit"
                  >
                    <FaEdit className="w-2 h-2" />
                  </button>
                  <button
                    onClick={() => handleAskDelete(emp)}
                    className="p-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                    title="Hapus"
                  >
                    <FaTrash className="w-2 h-2" />
                  </button>
                  <button
                    onClick={() => toggleStatus(emp.id, emp.status)}
                    className={`p-1 ${emp.status === "Aktif" ? "bg-gray-600 hover:bg-gray-700" : "bg-green-600 hover:bg-green-700"} text-white rounded transition`}
                    title={emp.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                  >
                    {emp.status === "Aktif" ? (
                      <FaEyeSlash className="w-2 h-2" />
                    ) : (
                      <FaEye className="w-2 h-2" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL KONFIRMASI HAPUS */}
      {confirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm text-center animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus data <span className="font-bold">{confirmName}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
