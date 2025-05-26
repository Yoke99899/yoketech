import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Data2Table() {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetch("/api/data2")
      .then((res) => res.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data)) {
          setData(json.data);
        }
      });
  }, []);

  const openModal = (row, type) => {
    setSelectedRow(row);
    setFormData(row);
    setModalType(type);
    setSuccessMessage("");
    setLoading(false);
  };

  const closeModal = () => {
    setSelectedRow(null);
    setModalType("");
    setSuccessMessage("");
    setLoading(false);
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:3000/postData2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit", id: selectedRow._row, data: formData })
      });
      setData((prev) => prev.map((row) => row["No"] === selectedRow["No"] ? formData : row));
      setSuccessMessage("✅ Data berhasil disimpan!");
      setLoading(false);
      setTimeout(closeModal, 1200);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:3000/postData2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id: selectedRow._row })
      });
      setData(data.filter((row) => row["No"] !== selectedRow["No"]));
      setSuccessMessage("🗑️ Berhasil dihapus!");
      setTimeout(closeModal, 1200);
    } catch (err) {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DATA2");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "data2_export.xlsx");
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (val) => typeof val === "string" && val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center">DATA2 - Penjualan</h2>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Cari nama, area, SKU..."
          className="border rounded p-2 w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={exportToExcel}
        >Export Excel</button>
      </div>

      <div className="overflow-auto max-h-[75vh] border rounded-lg shadow">
        <table className="min-w-full border-separate border-spacing-y-2 text-sm">
          <thead className="sticky top-0 bg-blue-800 text-white">
            <tr>
              {["No","Waktu","Nama","Area","SKU","Nama SKU","Penjualan","Value","Image","Tanggal","Jam","Actions"].map((col) => (
                <th key={col} className="px-2 py-2 text-left">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row["No"]} className="bg-white hover:bg-blue-50">
                {["No", "Waktu", "Nama", "Area", "SKU", "Nama SKU", "Penjualan", "Value", "Image", "Tanggal", "Jam"].map((key) => (
                  <td key={key} className="px-2 py-1 max-w-[150px] truncate" title={row[key]}>
                    {key === "Image" && row[key] ? (
                      <a href={row[key]} className="text-blue-600 underline" target="_blank" rel="noreferrer">Image</a>
                    ) : row[key] || "-"}
                  </td>
                ))}
                <td className="px-2 py-1">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => openModal(row, "edit")}>Edit</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => openModal(row, "delete")}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!modalType} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-xl space-y-4">
            <Dialog.Title className="text-lg font-bold">
              {modalType === "edit" ? "Edit Data Penjualan" : "Konfirmasi Hapus"}
            </Dialog.Title>
            {modalType === "edit" ? (
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(formData).map((key) => (
                  key !== "No" && (
                    <input
                      key={key}
                      className="border rounded p-2"
                      value={formData[key] || ""}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      placeholder={key}
                    />
                  )
                ))}
                {loading && <div className="text-blue-600 col-span-2 animate-pulse">⏳ Menyimpan perubahan...</div>}
                {successMessage && <div className="text-green-600 col-span-2">{successMessage}</div>}
              </div>
            ) : (
              <>
                <p>Yakin ingin menghapus data <b>{selectedRow?.Nama}</b> Tanggal: <b>{selectedRow?.Tanggal}</b>?</p>
                {loading && <div className="text-blue-600 animate-pulse">⏳ Menghapus...</div>}
                {successMessage && <div className="text-green-600">{successMessage}</div>}
              </>
            )}
            {!successMessage && (
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={closeModal}>Batal</button>
                <button
                  className={`px-4 py-2 rounded text-white ${modalType === "edit" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}`}
                  onClick={modalType === "edit" ? handleEdit : handleDelete}
                >{modalType === "edit" ? "Simpan" : "Hapus"}</button>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}