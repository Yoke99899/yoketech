import React, { useState } from "react";
import { ref, update } from "firebase/database";
import { db } from "../../firebaseClient";
import { deleteImageFromCloudinary } from "../../utils/cloudinaryUtils"; // Sesuaikan path jika perlu
import { FaEdit, FaTrash, FaEyeSlash, FaEye } from "react-icons/fa";
import { showToast } from "../../utils/toast"; // Pastikan path ini benar
export default function ProductTable({ data, onEdit, onDelete }) {
  const [confirmId, setConfirmId] = useState(null);
  const [confirmName, setConfirmName] = useState("");

  const handleAskDelete = (prod) => {
    setConfirmId(prod.id);
    setConfirmName(prod.name);
  };

  const handleCancel = () => {
    setConfirmId(null);
    setConfirmName("");
  };


const toggleStatus = async (id, currentStatus) => {
    if (!id) return;
    const newStatus = currentStatus === "Aktif" ? "Tidak Aktif" : "Aktif";
    try {
      await update(ref(db, `product_data/${id}`), { enable_status: newStatus });
      showToast(`Status diubah menjadi "${newStatus}"`, "info");
    } catch (err) {
      console.error(err);
      showToast("Gagal update status", "error");
    }
  };

const handleConfirmDelete = async () => {
  if (confirmId) {
    // Cari produk yang akan dihapus
    const productToDelete = data.find((item) => item.id === confirmId);

    // Jika ada foto, ambil public_id dari URL dan hapus dari Cloudinary
    if (productToDelete?.photo) {
      try {
        const urlParts = productToDelete.photo.split("/");
        const fileWithExtension = urlParts[urlParts.length - 1];
        const publicId = fileWithExtension.split(".")[0];

        await deleteImageFromCloudinary(publicId);
      } catch (err) {
        console.error("Gagal menghapus gambar dari Cloudinary:", err);
      }
    }
	
    onDelete(confirmId); // Hapus data dari DB
	showToast("Berhasil di hapus", "info");
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
            <th className="p-2 border whitespace-nowrap sticky left-[75px] bg-gray-800 z-10 shadow-inner">
              No
            </th>
            <th className="p-2 border whitespace-nowrap">Code</th>
            <th className="p-2 border whitespace-nowrap">Name</th>
            <th className="p-2 border whitespace-nowrap">Sap Name</th>
            <th className="p-2 border whitespace-nowrap">Sap Code</th>
            <th className="p-2 border whitespace-nowrap">Origin</th>
            <th className="p-2 border whitespace-nowrap">Sub Category2</th>
            <th className="p-2 border whitespace-nowrap">Category2</th>
            <th className="p-2 border whitespace-nowrap">Category</th>
            <th className="p-2 border whitespace-nowrap">Brand</th>
            <th className="p-2 border whitespace-nowrap">Cluster</th>
            <th className="p-2 border whitespace-nowrap">Variant</th>
            <th className="p-2 border whitespace-nowrap">Classification</th>
            <th className="p-2 border whitespace-nowrap">Packaging</th>
            <th className="p-2 border whitespace-nowrap">Package Content</th>
            <th className="p-2 border whitespace-nowrap">Grammage</th>
            <th className="p-2 border whitespace-nowrap">Hierarchy</th>
            <th className="p-2 border whitespace-nowrap">Size</th>
            <th className="p-2 border whitespace-nowrap">Release</th>
            <th className="p-2 border whitespace-nowrap">Photo</th>
            <th className="p-2 border whitespace-nowrap">Enable Status</th>
            
          </tr>
        </thead>
        <tbody>
          {data.map((prod, idx) => (
            <tr key={prod.id || idx} className="hover:bg-gray-50 text-xs">
              {/* Kolom Aksi (freeze kiri) */}
              <td className="p-2 border sticky left-0 bg-white z-30 shadow-inner">
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(prod)}
                    className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-[11px] transition"
                  >
                    <FaEdit className="w-2 h-2" />
                  </button>
                  <button
                    onClick={() => handleAskDelete(prod)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-[11px] transition"
                  >
                     <FaTrash className="w-2 h-2" />
                  </button>
		<button
                    onClick={() => toggleStatus(prod.id, prod.enable_status)}
                    className={`p-1 ${prod.enable_status === "Aktif" ? "bg-gray-600 hover:bg-gray-700" : "bg-green-600 hover:bg-green-700"} text-white rounded transition`}
                    title={prod.enable_status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                  >
                    {prod.enable_status === "Aktif" ? (
                      <FaEyeSlash className="w-2 h-2" />
                    ) : (
                      <FaEye className="w-2 h-2" />
                    )}
                  </button>	
                </div>
              </td>

              {/* Kolom No (freeze kiri) */}
              <td className="p-2 border sticky left-0 bg-white z-20 shadow-inner">
                {idx + 1}
              </td>

              <td className="p-2 border">{prod.code}</td>
              <td className="p-2 border">{prod.name}</td>
              <td className="p-2 border">{prod.sap_name}</td>
              <td className="p-2 border">{prod.sap_code}</td>
              <td className="p-2 border">{prod.origin}</td>
              <td className="p-2 border">{prod.sub_category2}</td>
              <td className="p-2 border">{prod.category2}</td>
              <td className="p-2 border">{prod.category}</td>
              <td className="p-2 border">{prod.brand}</td>
              <td className="p-2 border">{prod.cluster}</td>
              <td className="p-2 border">{prod.variant}</td>
              <td className="p-2 border">{prod.classification}</td>
              <td className="p-2 border">{prod.packaging}</td>
              <td className="p-2 border">{prod.package_content}</td>
              <td className="p-2 border">{prod.grammage}</td>
              <td className="p-2 border">{prod.hierarchy}</td>
              <td className="p-2 border">{prod.size}</td>
              <td className="p-2 border">{prod.release}</td>
              <td className="p-2 border text-center">
                {prod.photo ? (
                  <img
                    src={prod.photo}
                    alt="Foto"
                    className="w-16 h-16 object-cover mx-auto"
                  />
                ) : (
                  "-"
                )}
              </td>
              <td className="p-2 border">{prod.enable_status}</td>
              
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
