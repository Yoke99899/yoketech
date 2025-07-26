import React, { useState } from "react";
import {
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaAddressCard
} from "react-icons/fa";

export default function EmployeeForm({ initialData = {}, onSubmit, onCancel, title }) {
  const defaultForm = {
    nik: "",
    name: "",
    position: "",
    leaderName: "",
    city: "",
    district: "",
    agency: "",
    branchOffice: "",
    ktp: "",
    phone: "",
    email: "",
    bankName: "",
    bankAccountNumber: ""
  };

  const [formData, setFormData] = useState({ ...defaultForm, ...initialData });
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isRequired = (field) =>
    ["nik", "name", "leaderName", "email", "phone"].includes(field);

  const renderInput = (name, label, Icon, type = "text") => (
    <div className="space-y-0.5">
      <label className="text-xs text-gray-700 font-medium">{label}</label>
      <div className="flex items-center bg-white border rounded px-2 py-1 text-xs">
        <Icon className="text-gray-600 mr-2 text-sm" />
        <input
          name={name}
          type={type}
          value={formData[name] || ""}
          onChange={handleChange}
          placeholder={label}
          className="w-full bg-white text-gray-800 focus:outline-none text-xs"
          required={isRequired(name)}
        />
      </div>
    </div>
  );

  const handleFinalSubmit = () => {
    onSubmit(formData);
    onCancel();
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {renderInput("nik", "NIP", FaIdCard)}
          {renderInput("name", "Nama", FaUser)}
          {renderInput("position", "Posisi", FaBuilding)}
          {renderInput("leaderName", "Leader", FaUser)}
          {renderInput("city", "Kota", FaMapMarkerAlt)}
          {renderInput("district", "Kecamatan", FaMapMarkerAlt)}
          {renderInput("agency", "Agency", FaBuilding)}
          {renderInput("branchOffice", "Branch Office", FaBuilding)}
          {renderInput("ktp", "KTP", FaAddressCard)}
          {renderInput("phone", "No. HP", FaPhone)}
          {renderInput("email", "Email", FaEnvelope, "email")}
          {renderInput("bankName", "Bank", FaUniversity)}
          {renderInput("bankAccountNumber", "No. Rekening", FaIdCard)}
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

      {/* MODAL KONFIRMASI */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-xl w-[90%] max-w-sm text-center text-xs animate-fadeIn">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Konfirmasi Simpan</h3>
            <p className="text-gray-600 mb-4">
              Apakah kamu yakin ingin menyimpan data ini?
            </p>
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
