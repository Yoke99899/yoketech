import React, { useEffect, useState } from "react";
import { db, ref, onValue } from "../firebaseClient";
import { FaSearch, FaSpinner } from "react-icons/fa";

export default function OutletPicker({ onSelect, onClose }) {
  const [outlets, setOutlets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataRef = ref(db, "outlet_data");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.values(data);
      setOutlets(list);
      setFiltered(list);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const lowerKeyword = keyword.toLowerCase();
    const filteredData = outlets.filter((item) =>
      (item.outlet_id?.toString().toLowerCase().includes(lowerKeyword) ||
        item.outlet?.toLowerCase().includes(lowerKeyword) ||
        item.address?.toLowerCase().includes(lowerKeyword) ||
        item.category?.toLowerCase().includes(lowerKeyword))
    );
    setFiltered(filteredData);
  }, [keyword, outlets]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg text-gray-800">Pilih Outlet</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">&times;</button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Cari Outlet ID / Nama / Alamat / Kategori..."
              className="w-full border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring focus:border-blue-300"
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <FaSpinner className="animate-spin text-3xl text-blue-600" />
            </div>
          ) : (
            <div className="overflow-auto max-h-[60vh] border rounded">
              <table className="min-w-full text-sm">
                <thead className="bg-[#800000] text-white sticky top-0 z-10">
                  <tr>
                    <th className="p-2 text-left">Outlet ID</th>
                    <th className="p-2 text-left">Outlet Name</th>
                    <th className="p-2 text-left">Alamat</th>
                    <th className="p-2 text-left">District</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-500">Data tidak ditemukan</td>
                    </tr>
                  ) : (
                    filtered.map((item, index) => (
                      <tr key={index} className="odd:bg-white even:bg-gray-100">
                        <td className="p-2">{item.outlet_id}</td>
                        <td className="p-2">{item.outlet}</td>
                        <td className="p-2">{item.address}</td>
                        <td className="p-2">{item.district}</td>
                        <td className="p-2">{item.category}</td>
                        <td className="p-2">
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                            onClick={() => onSelect(item)}
                          >
                            Pilih
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-4 border-t text-right">
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
