import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function AccountForm({ initialData = {}, onSubmit, onCancel, title }) {
  const defaultForm = {
    account: ""
  };

  const [formData, setFormData] = useState({ ...defaultForm, ...initialData });
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isRequired = (field) => ["account"].includes(field);

  const handleFinalSubmit = () => {
    onSubmit(formData);
    onCancel();
  };

  return (
    <div className="min-h-screen flex  justify-center bg-white px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-xs relative">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowConfirm(true);
          }}
          className="space-y-4"
        >
          {/* Input Field */}
          <div className="space-y-1">
            <label className="text-xs text-gray-700 font-medium">Account</label>
            <div className="flex items-center border rounded px-2 py-1 text-xs bg-white">
              <FaMapMarkerAlt className="text-gray-600 mr-2 text-sm" />
              <input
                name="account"
                type="text"
                value={formData.account}
                onChange={handleChange}
                placeholder="Account"
                className="w-full bg-white text-gray-800 focus:outline-none text-xs"
                required={isRequired("account")}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-800 px-4 py-1.5 rounded hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>

        {/* Modal Konfirmasi */}
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
                  className="px-4 py-1.5 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Ya, Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
