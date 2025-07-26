import React, { useState, useEffect } from "react";
import Select from "react-select";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseClient";
import { showToast } from "../../utils/toast"; // <== pastikan ini path-nya sesuai
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


const now = new Date();
const today = now.toISOString().split("T")[0]; // format: YYYY-MM-DD

export default function StoreForm({ initialData = {}, onSubmit, onCancel, title }) {
  const defaultForm = {
    store_id: "",
    store_name: "",
    adress: "",
    account: "",
    channel: "",
    category: "",
    district: "",
    city: "",
    provinsi: "",
    latitude: "",
    longtitude: "",
    creat_at: today,
    owner: "",
    phone: "",
    remarks: "",
    status: "Aktif",
  };



  const [formData, setFormData] = useState({ ...defaultForm, ...initialData });
  const [showConfirm, setShowConfirm] = useState(false);

  const isRequired = (field) => ["store_name", "adress", "city", "district"].includes(field);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinalSubmit = () => {
  const finalData = {
    ...formData,
    creat_at: formData.creat_at || today, // jika belum ada
  };
    onSubmit(formData);
    onCancel();
    showToast("Berhasil di simpan", "info");
  };

  // Ambil data dropdown dari Firebase
  const accountOptions = useFirebaseOptions("account_data", "account");
  const channelOptions = useFirebaseOptions("channel_data", "channel");
  const districtOptions = useFirebaseOptions("district_data", "district");
  const cityOptions = useFirebaseOptions("city_data", "city");
  const provinsiOptions = useFirebaseOptions("provinsi_data", "provinsi");

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
        className="w-full border rounded px-2 py-1 text-[11px] bg-white text-gray-800 focus:outline-none"
        required={isRequired(name)}
      />
    </div>
  );

  const renderSelect = (name, label, Icon, options = []) => (
    <div className="space-y-1 w-full">
      <label className="text-[11px] text-gray-700 font-medium flex items-center gap-1">
        <Icon className="w-3.5 h-3.5 text-gray-500" />
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

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-6xl mx-auto text-xs relative">
      <h2 className="text-lg font-semibold text-gray-900 mb-3 text-center">{title}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowConfirm(true);
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {renderInput("store_id", "Store ID", ClipboardList)}
          {renderInput("store_name", "Nama Toko", Store)}
          {renderInput("adress", "Alamat", MapPin)}
          {renderSelect("account", "Account", User, accountOptions)}
          {renderSelect("channel", "Channel", BookText, channelOptions)}
          {renderInput("category", "Kategori", ClipboardList)}
          {renderSelect("district", "Kecamatan", MapPin, districtOptions)}
          {renderSelect("city", "Kota", Landmark, cityOptions)}
          {renderSelect("provinsi", "Provinsi", Globe, provinsiOptions)}
          {renderInput("latitude", "Latitude", LocateIcon)}
          {renderInput("longtitude", "Longtitude", LocateIcon)}
          {renderInput("creat_at", "Tanggal Dibuat", Calendar, "date")}
          {renderInput("owner", "Pemilik", User)}
          {renderInput("phone", "No. HP", Phone)}
          {renderInput("remarks", "Keterangan", FileText)}
          {renderInput("status", "Status", Info)}
        </div>

        <div className="flex justify-end gap-2 mt-4 text-xs">
          <button
            type="button"
            onClick={onCancel}
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
