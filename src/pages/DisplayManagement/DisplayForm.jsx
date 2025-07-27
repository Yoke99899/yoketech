import React, { useState, useEffect } from "react";
import Select from "react-select";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseClient";
import { uploadImageToCloudinary } from "../../utils/cloudinaryUtils";
import { deleteImageFromCloudinary } from "../../utils/cloudinaryUtils";
import { FaEdit, FaTrash, FaEyeSlash, FaEye } from "react-icons/fa";
import { showToast } from "../../utils/toast"; // Pastikan path ini benar


import {
  MapPin,
  Landmark,
  User,
  Phone,
  ClipboardList,
  Store,
  BookText,
  LocateIcon,
  Calendar,
  Globe,
  FileText,
  Info,
  StoreIcon,
} from "lucide-react";

// HOOK untuk ambil data Firebase jadi opsi dropdown
const useFirebaseOptions = (path, fieldName) => {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    const dbRef = ref(db, path);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val() || {};
      const formatted = Object.values(data).map((item) => ({
        label: item[fieldName],
        value: item[fieldName],
        raw: item // simpan seluruh object
      }));
      setOptions(formatted);
    });
  }, [path, fieldName]);
  return options;
};


export default function StoreForm({ initialData = {}, onSubmit, onCancel, title }) {
  const defaultForm = {
  product_code: "",
  product_name: "",
  category: "",
  display_name: "",
  store_id: "",
  store_name: "",
  employee_id: "",
  employee_name: "",
  foto_before: "",     // URL atau base64
  foto_before2: "",    // URL atau base64
  foto_before3: "",    // URL atau base64
  foto_after1: "",     // URL atau base64
  foto_after2: "",     // URL atau base64
  foto_after3: "",     // URL atau base64
  note: ""
};

	



  const [formData, setFormData] = useState({ ...defaultForm, ...initialData });
  const [showConfirm, setShowConfirm] = useState(false);

  const isRequired = (field) => ["display_name", "store_name", "employe_name"].includes(field);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinalSubmit = () => {
	showToast("Berhasil di simpan", "info");
    onSubmit(formData);
    onCancel();
  };

  // Ambil data dropdown dari Firebase
  const employeeOptions = useFirebaseOptions("employee_data", "name");
  const categoryOptions = useFirebaseOptions("category_data", "category");
  const productOptions = useFirebaseOptions("product_data", "name");
  const storeOptions = useFirebaseOptions("store_data", "store_name").map((opt) => ({
  ...opt,
  label: `${opt.raw.store_id} - ${opt.raw.store_name}`,
  	value: `${opt.raw.store_id} - ${opt.raw.store_name}`, // untuk ditampilkan di dropdown
  

}));


  const renderInput = (name, label, Icon, props = {}) => (
  <div className="space-y-1 w-full">
    <label className="text-[11px] text-gray-700 font-medium flex items-center gap-1">
      <Icon className="w-3.5 h-3.5 text-gray-900" />
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={formData[name] || ""}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          [name]: e.target.value,
        }))
      }
      className="w-full border text-[11px] px-2 py-1 rounded focus:outline-none focus:ring"
      {...props}
    />
  </div>
);


const renderImageInput = (field, label, Icon) => (
  <div className="space-y-1 w-full">
    <label className="text-[11px] text-gray-700 font-medium flex items-center gap-1">
      <Icon className="w-3.5 h-3.5 text-gray-500" />
      {label}
    </label>
    <input
      type="file"
      accept="image/*"
      onChange={async (e) => {
        const file = e.target.files[0];
        if (file) {
          setFormData((prev) => ({ ...prev, uploading: true }));
          const url = await uploadImageToCloudinary(file);
          setFormData((prev) => ({ ...prev, [field]: url, uploading: false }));
        }
      }}
      className="w-full border rounded px-2 py-1 text-[11px] bg-white text-gray-800 focus:outline-none"
    />
    {formData.uploading && (
      <p className="text-[10px] text-blue-600 italic">Mengunggah...</p>
    )}
    {formData[field] && (
      <img
        src={formData[field]}
        alt={`Preview ${label}`}
        className="mt-2 w-16 h-16 object-cover rounded border"
      />
    )}
  </div>
);


 const renderSelect = (name, label, Icon, options = []) => (
  <div className="space-y-1 w-full">
    <label className="text-[11px] text-gray-700 font-medium flex items-center gap-1">
      <Icon className="w-3.5 h-3.5 text-gray-900" />
      {label}
    </label>
    <Select
      name={name}
      options={options}
      value={formData[name] ? { label: formData[name], value: formData[name] } : null}



      onChange={(selected) => {
        if (!selected) {
          setFormData((prev) => ({ ...prev, [name]: "" }));
          return;
        }

        const updated = { ...formData, [name]: selected.value };

        // Tambahan logika untuk auto-fill
        if (name === "product_name" && selected.raw?.code) {
          updated.product_code = selected.raw.code;
        }
        if (name === "employee_name" && selected.raw?.nik) {
          updated.employee_id = selected.raw.nik;
        }
        if (name === "store_name" && selected.raw?.store_name) {
          updated.store_id = selected.raw.store_id;
        }
       
        setFormData(updated);
      }}
      placeholder={label}
      isClearable
      isSearchable
      isMulti={false} // ✅ force single select
      classNamePrefix="select"
      styles={{
        control: (base) => ({
          ...base,
          minHeight: "30px",
          height: "30px",
          fontSize: "11px",
        }),
        indicatorsContainer: (base) => ({
          ...base,
          height: "30px",
        }),
        placeholder: (base) => ({
          ...base,
          fontSize: "11px",
        }),
        input: (base) => ({
          ...base,
          fontSize: "11px",
        }),
      }}
    />
  </div>
);
 const [confirmId, setConfirmId] = useState(null);
const imageFields = [
  "foto_before",
  "foto_before2",
  "foto_before3",
  "foto_after1",
  "foto_after2",
  "foto_after3"
];

const [initialImages] = useState(() =>
  imageFields.reduce((acc, field) => {
    acc[field] = initialData[field] || "";
    return acc;
  }, {})
);

const handleCancelWithImageCleanup = async () => {
  for (const field of imageFields) {
    const originalUrl = initialImages[field];
    const currentUrl = formData[field];

    if (currentUrl && currentUrl !== originalUrl) {
      try {
        const urlParts = currentUrl.split("/");
        const fileWithExtension = urlParts[urlParts.length - 1];
        const publicId = fileWithExtension.split(".")[0];
        await deleteImageFromCloudinary(publicId);
        console.log(`Berhasil hapus gambar: ${field}`);
      } catch (err) {
        console.error(`Gagal hapus gambar ${field}:`, err);
      }
    }
  }

  onCancel(); // keluar dari form/modal
};


  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-6xl mx-auto text-xs relative">
      <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">{title}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowConfirm(true);
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
{renderInput("product_code", "Kode Produk", ClipboardList, { disabled: true })}
{renderSelect("product_name", "Nama Produk", Store, productOptions)}
{renderSelect("category", "Kategori", ClipboardList, categoryOptions)}
{renderInput("display_name", "Nama Display", BookText)}
{renderInput("store_id", "Store ID", Store, { disabled: true })}
<div className="space-y-1 w-full">
    <label className="text-[11px] text-gray-700 font-medium flex items-center gap-1">
      <StoreIcon className="w-3.5 h-3.5 text-gray-900" />
      Store
    </label>
    <Select
      name="store_name"
      options={storeOptions}
      value={
        storeOptions.find(
          (opt) =>
            opt.raw?.store_id === formData.store_id &&
            opt.raw?.store_name === formData.store_name
        ) || null
      }
      onChange={(selected) => {
        if (!selected) {
          setFormData((prev) => ({
            ...prev,
            store_id: "",
            store_name: "",
          }));
          return;
        }

        const updated = {
          ...formData,
          store_id: selected.raw.store_id,
          store_name: selected.raw.store_name,
        };

        setFormData(updated);
      }}
      isClearable
      isSearchable
      isMulti={false}
      classNamePrefix="select"
      styles={{
        control: (base) => ({
          ...base,
          minHeight: "30px",
          height: "30px",
          fontSize: "11px",
        }),
        indicatorsContainer: (base) => ({
          ...base,
          height: "30px",
        }),
        placeholder: (base) => ({
          ...base,
          fontSize: "11px",
        }),
        input: (base) => ({
          ...base,
          fontSize: "11px",
        }),
      }}
    />
  </div>

{renderInput("employee_id", "ID Karyawan", ClipboardList, { disabled: true })}
{renderSelect("employee_name", "Nama Karyawan", User, employeeOptions)}

{/* Upload Foto Before 1 */}
{renderImageInput("foto_before", "Foto Before 1", FileText)}

{/* Upload Foto Before 2 */}
{renderImageInput("foto_before2", "Foto Before 2", FileText)}

{/* Upload Foto Before 3 */}
{renderImageInput("foto_before3", "Foto Before 3", FileText)}

{/* Upload Foto After 1 */}
{renderImageInput("foto_after1", "Foto After 1", FileText)}

{/* Upload Foto After 2 */}
{renderImageInput("foto_after2", "Foto After 2", FileText)}

{/* Upload Foto After 3 */}
{renderImageInput("foto_after3", "Foto After 3", FileText)}

{renderInput("note", "Catatan", Info)}


</div>


        <div className="flex justify-end gap-2 mt-4 text-xs">
          <button
            type="button"
            onClick={handleCancelWithImageCleanup}
            className="bg-gray-800 text-gray-200 px-3 py-1 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-xl w-[90%] max-w-sm text-center text-xs animate-fadeIn">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Konfirmasi Simpan</h3>
            <p className="text-gray-600 mb-4">Apakah kamu yakin ingin menyimpan data ini?</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 bg-gray-300 rounded text-gray-800 hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
