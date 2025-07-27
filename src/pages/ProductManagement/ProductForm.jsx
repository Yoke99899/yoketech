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
      }));
      setOptions(formatted);
    });
  }, [path, fieldName]);
  return options;
};

export default function StoreForm({ initialData = {}, onSubmit, onCancel, title }) {
  const defaultForm = {
  code: "",
  name: "",
  sap_name: "",
  sap_code: "",
  origin: "",
  sub_category2: "",
  category2: "",
  category: "",
  brand: "",
  cluster: "",
  variant: "",
  classification: "",
  packaging: "",
  package_content: "",
  grammage: "",
  hierarchy: "",
  size: "",
  release: "",
  photo: "", // URL atau base64
  enable_status: "",
};

	



  const [formData, setFormData] = useState({ ...defaultForm, ...initialData });
  const [showConfirm, setShowConfirm] = useState(false);

  const isRequired = (field) => ["name", "brand", "category"].includes(field);

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
  const brandOptions = useFirebaseOptions("brand_data", "brand");
  const categoryOptions = useFirebaseOptions("category_data", "category");


  const renderInput = (name, label, Icon, type = "text") => (
    <div className="space-y-1 w-full">
      <label className="text-[11px] text-gray-700 font-medium flex items-center gap-1">
        <Icon className="w-3.5 h-3.5 text-gray-500" />
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={formData[name] || ""}
        onChange={handleChange}
        placeholder={label}
        className="w-full rounded px-2 py-1 text-[11px] bg-white text-gray-800 "
        required={isRequired(name)}
      />
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
        onChange={(selected) =>
          setFormData((prev) => ({ ...prev, [name]: selected?.value || "" }))
        }
        placeholder={label}
        isClearable
        isSearchable
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

//----------------------delete image setelah batal
const imageFields = [
  "photo"
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




//----------------------akhir delete image setelah batal


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
  {renderInput("code", "Kode Produk", ClipboardList)}
  {renderInput("name", "Nama Produk", Store)}
  {renderInput("sap_name", "SAP Name", BookText)}
  {renderInput("sap_code", "SAP Code", ClipboardList)}
  {renderInput("origin", "Origin", MapPin)}
  {renderInput("sub_category2", "Sub Kategori 2", ClipboardList)}
  {renderInput("category2", "Kategori 2", ClipboardList)}
  {renderSelect("category", "Kategori", ClipboardList, categoryOptions)}
  {renderSelect("brand", "Brand", Store, brandOptions)}
  {renderInput("cluster", "Cluster", Landmark)}
  {renderInput("variant", "Varian", BookText)}
  {renderInput("classification", "Klasifikasi", Info)}
  {renderInput("packaging", "Kemasan", FileText)}
  {renderInput("package_content", "Isi Kemasan", FileText)}
  {renderInput("grammage", "Grammage", FileText)}
  {renderInput("hierarchy", "Hierarki", ClipboardList)}
  {renderInput("size", "Ukuran", LocateIcon)}
  {renderInput("release", "Tanggal Rilis", Calendar, "date")}
  {/* Upload Foto dengan preview */}
<div className="space-y-1 w-full">
  <label className="text-[11px] text-gray-700 font-medium flex items-center gap-1">
    <FileText className="w-3.5 h-3.5 text-gray-500" />
    Upload Foto Produk
  </label>
  <input
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, uploading: true }));
        const url = await uploadImageToCloudinary(file);
        setFormData((prev) => ({ ...prev, photo: url, uploading: false }));
      }
    }}
    className="w-full border rounded px-2 py-1 text-[11px] bg-white text-gray-800 focus:outline-none"
  />
  {formData.uploading && (
    <p className="text-[10px] text-blue-600 italic">Mengunggah...</p>
  )}
  {formData.photo && (
    <img
      src={formData.photo}
      alt="Preview"
      className="mt-2 w-16 h-16 object-cover rounded border"
    />
  )}
</div>

  {renderInput("enable_status", "Status Aktif", Info)}
</div>


        <div className="flex justify-end gap-2 mt-4 text-xs">
          <button
            type="button"
            onClick={handleCancelWithImageCleanup}
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
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
