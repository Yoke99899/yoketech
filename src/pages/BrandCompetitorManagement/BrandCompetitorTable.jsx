import React, { useState } from "react";

export default function BrandCompetitorTable({ data, onEdit, onDelete }) {
  const [confirmId, setConfirmId] = useState(null);

  const handleConfirm = (id) => {
    setConfirmId(id);
  };

  const handleCancel = () => {
    setConfirmId(null);
  };

  const handleDelete = () => {
    if (confirmId) {
      onDelete(confirmId);
      setConfirmId(null);
    }
  };

  return (
    <div className="overflow-auto max-w-full border rounded shadow relative">
      <table className="w-full table-auto text-xs text-gray-800">
        <thead className="bg-gray-800 text-white sticky top-0 z-10">
          <tr>
            <th className="p-2 border whitespace-nowrap">No</th>
            <th className="p-2 border whitespace-nowrap">Brand Competitor</th>
            <th className="p-2 border whitespace-nowrap">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((brandcompetitors, idx) => (
            <tr key={brandcompetitors.id || idx} className="hover:bg-gray-50">
              <td className="p-2 border text-center">{idx + 1}</td>
              <td className="p-2 border">{brandcompetitors.brandcompetitor}</td>
              <td className="p-2 border text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(brandcompetitors)}
                    className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-xs transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleConfirm(brandcompetitors.id)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL KONFIRMASI */}
      {confirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-sm p-6 text-center text-sm animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Konfirmasi Hapus</h2>
            <p className="text-gray-600 mb-6">
              Apakah kamu yakin ingin menghapus data ini?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-1.5 bg-gray-300 rounded text-gray-800 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
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
