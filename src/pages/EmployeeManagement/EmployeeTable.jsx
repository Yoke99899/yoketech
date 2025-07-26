import React, { useState } from "react";

export default function EmployeeTable({ data, onEdit, onDelete }) {
  const [confirmId, setConfirmId] = useState(null);
  const [confirmName, setConfirmName] = useState("");

  const handleAskDelete = (emp) => {
    setConfirmId(emp.id);
    setConfirmName(emp.name);
  };

  const handleCancel = () => {
    setConfirmId(null);
    setConfirmName("");
  };

  const handleConfirmDelete = () => {
    if (confirmId) {
      onDelete(confirmId);
      handleCancel();
    }
  };

  return (
    <div className="overflow-auto max-w-full border rounded shadow relative">
      <table className="w-full table-auto text-xs text-gray-800">
        <thead className="bg-gray-800 text-white sticky top-0 z-10">
          <tr>
            <th className="p-2 border whitespace-nowrap">No</th>
            <th className="p-2 border whitespace-nowrap">NIP</th>
            <th className="p-2 border whitespace-nowrap">Nama</th>
            <th className="p-2 border whitespace-nowrap">Posisi</th>
            <th className="p-2 border whitespace-nowrap">Leader</th>
            <th className="p-2 border whitespace-nowrap">Kota</th>
            <th className="p-2 border whitespace-nowrap">Kecamatan</th>
            <th className="p-2 border whitespace-nowrap">Agency</th>
            <th className="p-2 border whitespace-nowrap">Branch Office</th>
            <th className="p-2 border whitespace-nowrap">KTP</th>
            <th className="p-2 border whitespace-nowrap">No. HP</th>
            <th className="p-2 border whitespace-nowrap">Email</th>
            <th className="p-2 border whitespace-nowrap">Bank</th>
            <th className="p-2 border whitespace-nowrap">No. Rekening</th>
            <th className="p-2 border whitespace-nowrap">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((emp, idx) => (
            <tr key={emp.id || idx} className="hover:bg-gray-50">
              <td className="p-2 border text-center">{idx + 1}</td>
              <td className="p-2 border">{emp.nik}</td>
              <td className="p-2 border">{emp.name}</td>
              <td className="p-2 border">{emp.position}</td>
              <td className="p-2 border">{emp.leaderName}</td>
              <td className="p-2 border">{emp.city}</td>
              <td className="p-2 border">{emp.district}</td>
              <td className="p-2 border">{emp.agency}</td>
              <td className="p-2 border">{emp.branchOffice}</td>
              <td className="p-2 border">{emp.ktp}</td>
              <td className="p-2 border">{emp.phone}</td>
              <td className="p-2 border">{emp.email}</td>
              <td className="p-2 border">{emp.bankName}</td>
              <td className="p-2 border">{emp.bankAccountNumber}</td>
              <td className="p-2 border text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(emp)}
                    className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded text-xs transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleAskDelete(emp)}
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
