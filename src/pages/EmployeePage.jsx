// EmployeePage.jsx
import React, { useEffect, useState } from "react";
import { db, ref, onValue, set, update, remove } from "../firebaseClient";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(initialForm());
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    const empRef = ref(db, "employee_data");
    onValue(empRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setEmployees(list);
    });
  }, []);

  const handleSave = async () => {
    if (Object.values(uploading).some((val) => val)) return;
    const id = editId || Date.now().toString();
    const refPath = ref(db, `employee_data/${id}`);
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
      const emp = employees.find((e) => e.id === deleteId);
      await deleteAllPhotos(emp);
      await remove(ref(db, `employee_data/${deleteId}`));
      setDeleteId(null);
      setShowPopup("Data berhasil dihapus");
      setTimeout(() => setShowPopup(""), 2000);
    }
  };

  const uploadImage = async (file, field) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [field]: true }));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset");
    formData.append("folder", "employee");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/drxzroofv/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url && data.public_id) {
        setForm((prev) => ({
          ...prev,
          [field]: [...(prev[field] || []), { url: data.secure_url, publicId: data.public_id }],
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    setUploading((prev) => ({ ...prev, [field]: false }));
  };

  const deleteAllPhotos = async (emp) => {
    for (const field of ["profilePhoto", "ktpPhoto", "bankAccountPhoto"]) {
      const photos = emp[field] || [];
      for (const photo of photos) {
        await deleteImageFromCloudinary(photo.publicId);
      }
    }
  };

  async function deleteImageFromCloudinary(publicId) {
    const timestamp = Math.floor(Date.now() / 1000);
    const apiSecret = "9suqfzbi9ffs6vqjTOfqliQFxAc";
    const apiKey = "845319998196363";
    const cloudName = "drxzroofv";
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const sha1 = await sha1Hash(stringToSign);

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", sha1);

    await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      body: formData,
    });
  }

  async function sha1Hash(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-1", buffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  const removePhoto = (field, index) => {
    const removed = form[field][index];
    deleteImageFromCloudinary(removed.publicId);
    const newArr = [...form[field]];
    newArr.splice(index, 1);
    setForm({ ...form, [field]: newArr });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto text-sm">
      <h2 className="text-xl font-bold mb-4 text-[#800000]">Employee Management</h2>
      <button onClick={() => { setForm(initialForm()); setEditId(null); setShowForm(true); }} className="mb-4 bg-[#800000] text-white px-4 py-2 rounded flex items-center gap-2">
        <FaPlus /> Tambah Karyawan
      </button>

      <div className="overflow-auto border rounded">
        <table className="min-w-[1200px] w-full text-xs">
          <thead className="bg-[#800000] text-white">
            <tr>
              <th className="p-2 text-left">Action</th>
              {Object.keys(initialForm()).map((key) => (
                <th key={key} className="p-2 text-left">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="p-2 whitespace-nowrap">
                  <button onClick={() => { setForm(emp); setEditId(emp.id); setShowForm(true); }} className="bg-yellow-500 text-white px-2 py-1 rounded mr-1"><FaEdit /></button>
                  <button onClick={() => setDeleteId(emp.id)} className="bg-red-600 text-white px-2 py-1 rounded"><FaTrash /></button>
                </td>
                {Object.keys(initialForm()).map((key) => (
                  <td key={key} className="p-2 whitespace-nowrap">
                    {Array.isArray(emp[key]) ? emp[key].map((img, i) => (
                      <img key={i} src={img.url} alt="" className="w-10 h-10 inline mr-1 rounded" />
                    )) : emp[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">{editId ? "Edit" : "Tambah"} Karyawan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.keys(initialForm()).map((key) => (
                  Array.isArray(form[key]) ? (
                    <div key={key}>
                      <label className="block text-xs mb-1">{key}</label>
                      <input type="file" onChange={(e) => uploadImage(e.target.files[0], key)} />
                      <div className="flex flex-wrap gap-2 mt-1">
                        {form[key].map((img, idx) => (
                          <div key={idx} className="relative">
                            <img src={img.url} className="w-16 h-16 rounded" />
                            <button type="button" onClick={() => removePhoto(key, idx)} className="absolute top-0 right-0 bg-black/50 text-white p-1 rounded-full text-xs"><FaTimes /></button>
                          </div>
                        ))}
                        {uploading[key] && <FaSpinner className="animate-spin text-gray-500" />}
                      </div>
                    </div>
                  ) : (
                    <input key={key} className="border px-2 py-1 rounded" placeholder={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                  )
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Batal</button>
                <button onClick={handleSave} disabled={Object.values(uploading).some(Boolean)} className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50">Simpan</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
    </div>
  );
}

function initialForm() {
  return {
    nik: "", name: "", code: "", position: "", leaderName: "", city: "", subdistrict: "",
    agency: "", branchOffice: "", city2: "", ktp: "", phone: "", email: "",
    bankName: "", bankAccountNumber: "", joinAt: "", birthDate: "", gender: "",
    education: "", profilePhoto: [], ktpPhoto: [], bankAccountPhoto: []
  };
}
