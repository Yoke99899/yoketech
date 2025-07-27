import React, { useState } from "react";
import { ref, update } from "firebase/database";
import { db } from "../../firebaseClient";
import { deleteImageFromCloudinary } from "../../utils/cloudinaryUtils"; // Sesuaikan path jika perlu
import { FaEdit, FaTrash, FaEyeSlash, FaEye } from "react-icons/fa";
import { showToast } from "../../utils/toast"; // Pastikan path ini benar
export default function DisplayTable({ data, onEdit, onDelete }) {
  const [confirmId, setConfirmId] = useState(null);
  const [confirmName, setConfirmName] = useState("");

  const handleAskDelete = (disp) => {
    setConfirmId(disp.id);
    setConfirmName(disp.name);
  };

  const handleCancel = () => {
    setConfirmId(null);
    setConfirmName("");
  };


const toggleStatus = async (id, currentStatus) => {
    if (!id) return;
    const newStatus = currentStatus === "Aktif" ? "Tidak Aktif" : "Aktif";
    try {
      await update(ref(db, `display_data/${id}`), { enable_status: newStatus });
      showToast(`Status diubah menjadi "${newStatus}"`, "info");
    } catch (err) {
      console.error(err);
      showToast("Gagal update status", "error");
    }
  };

const handleConfirmDelete = async () => {
  if (confirmId) {
    const displayToDelete = data.find((item) => item.id === confirmId);

    // Daftar field gambar
    const imageFields = [
      "foto_before",
      "foto_before2",
      "foto_before3",
      "foto_after1",
      "foto_after2",
      "foto_after3",
    ];

    // Hapus semua foto jika ada
    for (const field of imageFields) {
      const url = displayToDelete?.[field];
      if (url) {
        try {
          const urlParts = url.split("/");
          const fileWithExtension = urlParts[urlParts.length - 1];
          const publicId = fileWithExtension.split(".")[0];
          await deleteImageFromCloudinary(publicId);
        } catch (err) {
          console.error(`Gagal hapus ${field}:`, err);
        }
      }
    }

    onDelete(confirmId); // Hapus data dari DB
    showToast("Berhasil dihapus", "info");
    handleCancel();
  }
};


  return (
    <div className="overflow-auto max-w-full border rounded shadow relative">
      <table className="w-full table-auto text-[11px] text-gray-800">
        <thead className="bg-gray-800 text-white sticky top-0 z-20">
          <tr>
            <th className="p-2 border whitespace-nowrap sticky left-0 bg-gray-800 z-30 shadow-inner">
              Aksi
            </th>
            <th className="p-2 border whitespace-nowrap sticky left-0 bg-gray-800 z-20 shadow-inner">
              No
            </th>
            <th className="p-2 border whitespace-nowrap">Product Code</th>
		<th className="p-2 border whitespace-nowrap">Product Name</th>
		<th className="p-2 border whitespace-nowrap">Category</th>
		<th className="p-2 border whitespace-nowrap">Display Name</th>
		<th className="p-2 border whitespace-nowrap">Store ID</th>
		<th className="p-2 border whitespace-nowrap">Store Name</th>
		<th className="p-2 border whitespace-nowrap">NIP</th>
		<th className="p-2 border whitespace-nowrap">Employee Name</th>
		<th className="p-2 border whitespace-nowrap">Foto Before</th>
		<th className="p-2 border whitespace-nowrap">Foto Before 2</th>
		<th className="p-2 border whitespace-nowrap">Foto Before 3</th>
		<th className="p-2 border whitespace-nowrap">Foto After</th>
		<th className="p-2 border whitespace-nowrap">Foto After 2</th>
		<th className="p-2 border whitespace-nowrap">Foto After 3</th>
		<th className="p-2 border whitespace-nowrap">Note</th>
	
            
          </tr>
        </thead>
        <tbody>
          {data.map((disp, idx) => (
            <tr key={disp.id || idx} className="hover:bg-gray-50 text-xs">
              {/* Kolom Aksi (freeze kiri) */}
              <td className="p-2 border sticky left-0 bg-white z-30 shadow-inner">
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(disp)}
                    className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-[11px] transition"
                  >
                    <FaEdit className="w-2 h-2" />
                  </button>
                  <button
                    onClick={() => handleAskDelete(disp)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[11px] transition"
                  >
                     <FaTrash className="w-2 h-2" />
                  </button>
		<button
                    onClick={() => toggleStatus(disp.id, disp.enable_status)}
                    className={`p-1 ${disp.enable_status === "Aktif" ? "bg-gray-600 hover:bg-gray-700" : "bg-green-600 hover:bg-green-700"} text-white rounded transition`}
                    title={disp.enable_status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                  >
                    {disp.enable_status === "Aktif" ? (
                      <FaEyeSlash className="w-2 h-2" />
                    ) : (
                      <FaEye className="w-2 h-2" />
                    )}
                  </button>	
                </div>
              </td>

              {/* Kolom No (freeze kiri) */}
              <td className="p-2 border sticky left-0 bg-white z-20 shadow-inner ">
                {idx + 1}
              </td>

          	<td className="p-2 border">{disp.product_code}</td>
		<td className="p-2 border">{disp.product_name}</td>
		<td className="p-2 border">{disp.category}</td>
		<td className="p-2 border">{disp.display_name}</td>
		<td className="p-2 border">{disp.store_id}</td>
		<td className="p-2 border">{disp.store_name}</td>
		<td className="p-2 border">{disp.employee_id}</td>
		<td className="p-2 border">{disp.employee_name}</td>
		<td className="p-2 border">
		  {disp.foto_before && (
 		   <img src={disp.foto_before} alt="Before 1" className="w-16 h-16 object-cover" />
 		 )}
		</td>
		<td className="p-2 border">
		  {disp.foto_before2 && (
		    <img src={disp.foto_before2} alt="Before 2" className="w-16 h-16 object-cover" />
		  )}
		</td>
		<td className="p-2 border">
 		 {disp.foto_before3 && (
 		   <img src={disp.foto_before3} alt="Before 3" className="w-16 h-16 object-cover" />
 		 )}
		</td>
		<td className="p-2 border">
		  {disp.foto_after1 && (
		    <img src={disp.foto_after1} alt="After 1" className="w-16 h-16 object-cover" />
 		 )}
		</td>
		<td className="p-2 border">
		  {disp.foto_after2 && (
		    <img src={disp.foto_after2} alt="After 2" className="w-16 h-16 object-cover" />
		  )}
		</td>
		<td className="p-2 border">
		  {disp.foto_after3 && (
		    <img src={disp.foto_after3} alt="After 3" className="w-16 h-16 object-cover" />
		  )}
		</td>
		<td className="p-2 border">{disp.note}</td>

              
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal konfirmasi hapus */}
      {confirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm text-center animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Konfirmasi Hapus
            </h3>
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
