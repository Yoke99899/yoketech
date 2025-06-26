import React, { useEffect, useState } from "react";
import { db, ref, onValue, update, remove } from "../firebaseClient";
import {
  FaEdit, FaTrash, FaSearch, FaChevronDown, FaChevronUp
} from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export default function DatabaseDona() {
  const [dataList, setDataList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showPopup, setShowPopup] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState(initialForm());
  const [showFilter, setShowFilter] = useState(false);
  const [formData, setFormData] = useState(initialForm());
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");

  useEffect(() => {
    const dataRef = ref(db, "dona_data");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setDataList(list);
    });
  }, []);

  const handleSave = async () => {
    const id = formData.id || `dona_${Date.now()}`;
    const refPath = ref(db, `dona_data/${id}`);
    await update(refPath, { ...formData, id });
    setShowForm(false);
    setFormData(initialForm());
    setShowPopup("Data berhasil disimpan");
    setTimeout(() => setShowPopup(""), 2000);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData(initialForm());
    setFormMode("add");
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await remove(ref(db, `dona_data/${deleteId}`));
      setDeleteId(null);
      setShowPopup("Data berhasil dihapus");
      setTimeout(() => setShowPopup(""), 2000);
    }
  };

  const filteredData = dataList.filter((e) =>
    Object.entries(filter).every(([key, val]) =>
      !val || (e[key] || "").toLowerCase().includes(val.toLowerCase())
    )
  );

  return (
    <div className="p-4 max-w-[1600px] mx-auto text-xs">
      <h2 className="text-xl font-bold mb-4 text-[#800000]">Database Dona</h2>

      <div className="flex gap-2 mb-3">
        <button onClick={handleAdd} className="bg-[#800000] text-white px-4 py-2 rounded shadow hover:bg-[#a00000]">
          + Tambah Data
        </button>
        <button onClick={() => setShowFilter(!showFilter)} className="flex items-center gap-2 text-white bg-[#800000] hover:bg-[#a00000] px-4 py-2 rounded">
          <FaSearch /> Filter {showFilter ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      <AnimatePresence>
        {showFilter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white p-4 rounded border">
            {Object.keys(filter).map((key) => (
              <input
                key={key}
                placeholder={key.replace(/_/g, ' ').toUpperCase()}
                value={filter[key]}
                onChange={(e) => setFilter(prev => ({ ...prev, [key]: e.target.value }))}
                className="border px-2 py-1 rounded text-xs"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-auto border rounded mt-4">
        <table className="min-w-[1800px] w-full text-xs">
          <thead className="bg-[#800000] text-white sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left sticky left-0 bg-[#800000] z-20">Aksi</th>
              {Object.keys(initialForm()).map((key) => (
                <th key={key} className="p-2 text-left">{key.replace(/_/g, ' ').toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2 sticky left-0 bg-white z-10">
                  <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-1"><FaEdit /></button>
                  <button onClick={() => setDeleteId(item.id)} className="bg-red-600 text-white px-2 py-1 rounded"><FaTrash /></button>
                </td>
                {Object.keys(initialForm()).map((key) => (
                  <td key={key} className="p-2 whitespace-nowrap">{item[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow max-w-md w-full">
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

      <AnimatePresence>
        {showPopup && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.3 }} className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
            {showPopup}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow max-h-[90vh] overflow-y-auto w-full max-w-3xl">
              <h4 className="text-lg font-bold mb-4">{formMode === "edit" ? "Edit Data" : "Tambah Data"}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(initialForm()).map((key) => (
                  <div key={key} className="flex flex-col text-xs">
                    <label className="mb-1 font-semibold">{key.replace(/_/g, ' ').toUpperCase()}</label>
                    <input
                      value={formData[key] || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                      className="border px-2 py-1 rounded text-xs"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-1 rounded">Batal</button>
                <button onClick={handleSave} className="bg-green-600 text-white px-4 py-1 rounded">Simpan</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function initialForm() {
  return {
    kode_referal: "",
    agency: "",
    region: "",
    area: "",
    kota: "",
    name_store: "",
    name_spg_sesuai_ktp: "",
    type: "",
    quota_of_spg: "",
    nomor_ktp: "",
    npwp: "",
    marital_status: "",
    no_hp_wa: "",
    tanggal_masuk_kerja: "",
    tanggal_resign: "",
    jabatan: "",
    nama_bank: "",
    nomor_rekening: "",
    atas_nama_rekening: "",
    status_mp: "",
    toko_sebelumnya: "",
    tb: "",
    bb: "",
    result: ""
  };
}