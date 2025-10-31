import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function ValidasiTable({ data, onEdit, onDelete }) {
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
    <div className="overflow-auto max-h-[70vh] max-w-full border rounded shadow relative">
      <table className="w-full table-auto text-xs text-gray-800">
        <thead className="bg-gray-800 text-white sticky top-0 z-50">
          <tr>
            <th className="p-2 border whitespace-nowrap sticky left-0 z-30 bg-gray-800">
              Aksi
            </th>
            <th className="p-2 border whitespace-nowrap bg-gray-800">No</th>
            <th className="p-2 border whitespace-nowrap">Frontliner</th>
            <th className="p-2 border whitespace-nowrap">Outlet ID</th>
            <th className="p-2 border whitespace-nowrap">Outlet Name</th>
            <th className="p-2 border whitespace-nowrap">Address</th>
            <th className="p-2 border whitespace-nowrap">District</th>
            <th className="p-2 border whitespace-nowrap">Owner</th>
            <th className="p-2 border whitespace-nowrap">No Telp</th>
            <th className="p-2 border whitespace-nowrap">No Telp (Valid)</th>
            <th className="p-2 border whitespace-nowrap">Link Whatsapp</th>
            <th className="p-2 border whitespace-nowrap">Respon</th>
            <th className="p-2 border whitespace-nowrap">Item</th>
            <th className="p-2 border whitespace-nowrap">Tanggal Transaksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((validasis, idx) => (
            <tr key={validasis.id || idx} className="hover:bg-gray-50">
              <td className="p-2 border sticky left-0 bg-white z-30">
                <div className="flex justify-center gap-1">
                  <button
                    onClick={() => onEdit(validasis)}
                    className="p-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition"
                    title="Edit"
                  >
                    <FaEdit size={12} />
                  </button>
                  <button
                    onClick={() => handleConfirm(validasis.id)}
                    className="p-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                    title="Hapus"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </td>

              <td className="p-2 border text-center">{idx + 1}</td>
              <td className="p-2 border">{validasis.frontliner}</td>
              <td className="p-2 border">{validasis.outlet_id}</td>
              <td className="p-2 border">{validasis.outlet_name}</td>
              <td className="p-2 border">{validasis.address}</td>
              <td className="p-2 border">{validasis.district}</td>
              <td className="p-2 border">{validasis.owner}</td>
              <td className="p-2 border">{validasis.telp}</td>
              <td className="p-2 border">{validasis.input_no_valid}</td>
              <td className="p-2 border">{validasis.transaksi}</td>
              <td className="p-2 border">{validasis.tgl_transaksi}</td>

              {/* Reason Nomor jadi hyperlink WhatsApp */}
              <td className="p-2 border text-blue-600 underline">
                {validasis.reason_nomor ? (
                  <a
                    href={validasis.reason_nomor}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-800"
                  >
                    Chat WhatsApp
                  </a>
                ) : (
                  "-"
                )}
              </td>

              <td className="p-2 border">{validasis.respon}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL KONFIRMASI */}
      {confirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-sm p-6 text-center text-sm animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Konfirmasi Hapus
            </h2>
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

