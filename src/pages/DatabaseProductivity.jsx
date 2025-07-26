import React, { useEffect, useState } from "react";
import { db, ref, push, update, remove, onValue } from "../firebaseClient";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import OutletPicker from "./OutletPicker";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";

export default function ProductivityPage() {
  const [form, setForm] = useState({
    nama: "",
    tanggal: new Date(),
    pasar: "",
    outlet_id: "",
    outlet_name: "",
    category: "",
    brand: "",
    quantity: "",
    total: ""
  });

  const [dataList, setDataList] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const dataRef = ref(db, "productivity_data");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setDataList(list);
    });
  }, []);

  const resetForm = () => {
    setForm({
      nama: "", tanggal: new Date(), pasar: "",
      outlet_id: "", outlet_name: "", category: "",
      brand: "", quantity: "", total: ""
    });
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    const { nama, tanggal, pasar, outlet_id, outlet_name, category, brand, quantity, total } = form;
    if (!nama || !tanggal || !pasar || !outlet_id || !outlet_name || !category || !brand || !quantity || !total) {
      setError("Semua field wajib diisi.");
      return;
    }

    const payload = {
      nama,
      tanggal: tanggal.toISOString().split("T")[0],
      pasar,
      outlet_id,
      outlet_name,
      category,
      brand,
      quantity,
      total
    };

    setConfirmDialog({
      title: editId ? "Konfirmasi Update" : "Konfirmasi Simpan",
      message: `Apakah Anda yakin ingin ${editId ? "mengupdate" : "menyimpan"} data ini?`,
      onConfirm: async () => {
        if (editId) {
          await update(ref(db, `productivity_data/${editId}`), payload);
        } else {
          await push(ref(db, "productivity_data"), payload);
        }
        resetForm();
        setError("");
        setConfirmDialog(null);
      }
    });
  };

  const handleEdit = (item) => {
    setForm({
      nama: item.nama,
      tanggal: new Date(item.tanggal),
      pasar: item.pasar,
      outlet_id: item.outlet_id,
      outlet_name: item.outlet_name,
      category: item.category,
      brand: item.brand,
      quantity: item.quantity,
      total: item.total
    });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      title: "Konfirmasi Hapus",
      message: "Apakah Anda yakin ingin menghapus data ini?",
      onConfirm: async () => {
        await remove(ref(db, `productivity_data/${id}`));
        setConfirmDialog(null);
      }
    });
  };

  const handleOutletSelect = (outlet) => {
    setForm((prev) => ({
      ...prev,
      outlet_id: outlet.outlet_id,
      outlet_name: outlet.outlet,
      category: outlet.category
    }));
    setShowPicker(false);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Data Productivity</h2>
        <button
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          <FaPlus className="inline mr-2" /> Tambah Data
        </button>
      </div>

      <div className="overflow-auto border rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-white sticky top-0 z-10">
            <tr>
              <th className="p-2">Aksi</th>
              <th className="p-2">Nama</th>
              <th className="p-2">Tanggal</th>
              <th className="p-2">Pasar</th>
              <th className="p-2">Outlet Name</th>
              <th className="p-2">Outlet ID</th>
              <th className="p-2">Category</th>
              <th className="p-2">Brand</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Total Rp</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item) => (
              <tr key={item.id} className="odd:bg-white even:bg-gray-100">
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:underline"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    <FaTrash />
                  </button>
                </td>
                <td className="p-2">{item.nama}</td>
                <td className="p-2">{item.tanggal}</td>
                <td className="p-2">{item.pasar}</td>
                <td className="p-2">{item.outlet_name}</td>
                <td className="p-2">{item.outlet_id}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">{item.brand}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Pop-up */}
      {showForm && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-2xl"
    >
      {/* Header Gradasi */}
      <div className="flex justify-between items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <h3 className="text-lg font-semibold">{editId ? "Edit Data" : "Input Productivity"}</h3>
        <button onClick={resetForm} className="text-white hover:text-gray-200">
          <FaTimes />
        </button>
      </div>

      {/* Form */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white">
        <input
          type="text"
          placeholder="Nama SMD / Motoris"
          className="bg-gray-100 p-2 rounded outline-none"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
        />
        <DatePicker
          selected={form.tanggal}
          onChange={(date) => setForm({ ...form, tanggal: date })}
          className="bg-gray-100 p-2 rounded w-full outline-none"
          dateFormat="yyyy-MM-dd"
        />
        <input
          type="text"
          placeholder="Nama Pasar"
          className="bg-gray-100 p-2 rounded outline-none"
          value={form.pasar}
          onChange={(e) => setForm({ ...form, pasar: e.target.value })}
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Outlet Name"
            className="bg-gray-100 p-2 rounded flex-1 outline-none"
            value={form.outlet_name}
            readOnly
            onClick={() => setShowPicker(true)}
          />
          <button
            className="bg-blue-500 text-white px-3 rounded"
            onClick={() => setShowPicker(true)}
          >
            Pilih
          </button>
        </div>
        <input
          type="text"
          placeholder="Outlet ID"
          className="bg-gray-100 p-2 rounded outline-none"
          value={form.outlet_id}
          readOnly
        />
        <input
          type="text"
          placeholder="Category"
          className="bg-gray-100 p-2 rounded outline-none"
          value={form.category}
          readOnly
        />
        <input
          type="text"
          placeholder="Brand"
          className="bg-gray-100 p-2 rounded outline-none"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="bg-gray-100 p-2 rounded outline-none"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        <input
          type="number"
          placeholder="Total Rp"
          className="bg-gray-100 p-2 rounded outline-none"
          value={form.total}
          onChange={(e) => setForm({ ...form, total: e.target.value })}
        />
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}

      {/* Footer Button */}
      <div className="px-6 py-4 flex justify-end gap-2 bg-white border-t">
        <button
          onClick={resetForm}
          className="px-4 py-2 rounded border hover:bg-gray-100"
        >
          Batal
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 font-semibold text-white rounded bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"
        >
          <FaCheck className="inline mr-1" />
          {editId ? "Update" : "Simpan"}
        </button>
      </div>
    </motion.div>
  </div>
)}
 {showPicker && (
        <OutletPicker
          onSelect={handleOutletSelect}
          onClose={() => setShowPicker(false)}
        />
      )}

 {/* Dialog Konfirmasi */}
      {confirmDialog && (
        <Dialog open={true} onClose={() => setConfirmDialog(null)} className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded shadow max-w-md w-full"
          >
            <Dialog.Title className="text-lg font-semibold">
              {confirmDialog.title}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-600">
              {confirmDialog.message}
            </Dialog.Description>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setConfirmDialog(null)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={confirmDialog.onConfirm}
              >
                Ya
              </button>
            </div>
          </motion.div>
        </Dialog>
      )}

    </div>
  );
}
