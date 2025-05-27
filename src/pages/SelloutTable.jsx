import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import * as XLSX from "xlsx";
import { AuthContext } from "../GoogleAuthProvider";

const SHEET_ID = "1JNFMxWz-0A7QUKWOcNlxn_Yb4xlyNOlnBRnJd_Bz5qA";
const RANGE = "Sellout!A1:J";
const SHEET_GID = 1432054009; // GID dari sheet Sellout

export default function SelloutTable() {
  const { accessToken, login } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ name: "", region: "", start: "", end: "" });
  const [editItem, setEditItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    if (!accessToken) return;
    fetchData();
  }, [accessToken]);

  const fetchData = async () => {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?majorDimension=ROWS`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const json = await res.json();
    if (!json.values) return;

    const [headers, ...rows] = json.values;
    const parsed = rows.map((row, i) => {
      const obj = { _index: i + 2 };
      headers.forEach((h, j) => {
        obj[h.toLowerCase()] = row[j] || "";
      });
      obj.dateObj = new Date(obj.date);
      return obj;
    });
    setData(parsed);
    setFiltered(parsed);
  };

  const applyFilter = () => {
    const f = data.filter((d) => {
      const matchName = filters.name ? d.name === filters.name : true;
      const matchRegion = filters.region ? d.region === filters.region : true;
      const matchStart = filters.start ? new Date(d.date) >= new Date(filters.start) : true;
      const matchEnd = filters.end ? new Date(d.date) <= new Date(filters.end) : true;
      return matchName && matchRegion && matchStart && matchEnd;
    });
    setFiltered(f);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sellout");
    XLSX.writeFile(wb, "Sellout_Export.xlsx");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const range = `Sellout!A${editItem._index}:J${editItem._index}`;
      const values = [[
        editItem.date, editItem.quarterly, editItem.region, editItem.name,
        editItem.city, editItem.group, editItem.store, editItem.target,
        editItem.actual, editItem.ach
      ]];

      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?valueInputOption=USER_ENTERED`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ range, majorDimension: "ROWS", values }),
        }
      );

      setEditItem(null);
      fetchData();
    } catch (err) {
      alert("Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    const deleteRequest = {
      requests: [
        {
          deleteRange: {
            range: {
              sheetId: SHEET_GID,
              startRowIndex: deleteItem._index - 1,
              endRowIndex: deleteItem._index,
            },
            shiftDimension: "ROWS",
          },
        },
      ],
    };

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteRequest),
    });

    setDeleteItem(null);
    fetchData();
  };

  const names = [...new Set(data.map((d) => d.name))];
  const regions = [...new Set(data.map((d) => d.region))];

  if (!accessToken)
    return (
      <div className="p-6 text-center">
        <button onClick={login} className="bg-blue-600 text-white px-6 py-3 rounded">
          Login dengan Google
        </button>
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-center text-xl font-bold mb-4">DATA2 - Penjualan</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
        <Select options={names.map((n) => ({ value: n, label: n }))} placeholder="Pilih Nama" onChange={(v) => setFilters((f) => ({ ...f, name: v?.value || "" }))} isClearable />
        <Select options={regions.map((a) => ({ value: a, label: a }))} placeholder="Pilih Region" onChange={(v) => setFilters((f) => ({ ...f, region: v?.value || "" }))} isClearable />
        <input type="date" className="border p-2 rounded" onChange={(e) => setFilters((f) => ({ ...f, start: e.target.value }))} />
        <input type="date" className="border p-2 rounded" onChange={(e) => setFilters((f) => ({ ...f, end: e.target.value }))} />
        <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded">Export Excel</button>
      </div>

      <div className="overflow-auto max-h-[600px] border rounded">
        <table className="w-full table-auto">
          <thead className="sticky top-0 z-10 bg-blue-800 text-white">
            <tr>
              <th className="p-2">Date</th>
              <th>Quarterly</th>
              <th>Region</th>
              <th>Name</th>
              <th>City</th>
              <th>Group</th>
              <th>Store</th>
              <th>Target</th>
              <th>Actual</th>
              <th>Ach</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="text-center border-t">
                <td className="p-2 text-xs">{row.date}</td>
                <td>{row.quarterly}</td>
                <td>{row.region}</td>
                <td>{row.name}</td>
                <td>{row.city}</td>
                <td>{row.group}</td>
                <td>{row.store}</td>
                <td>{row.target}</td>
                <td>{row.actual}</td>
                <td>{row.ach}</td>
                <td>
                  <button onClick={() => setEditItem(row)} className="bg-yellow-400 text-black px-2 py-1 rounded mr-1">Edit</button>
                  <button onClick={() => setDeleteItem(row)} className="bg-red-600 text-white px-2 py-1 rounded">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Data Penjualan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Waktu Input", key: "date" },
                { label: "Nama Pelanggan", key: "name" },
                { label: "Area", key: "region" },
                { label: "Kode SKU", key: "store" },
                { label: "Nama Produk", key: "city" },
                { label: "Qty", key: "target" },
                { label: "Total (Rp)", key: "actual" },
                { label: "Link Gambar", key: "group" },
                { label: "Tanggal", key: "ach" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    className="w-full border p-2 rounded"
                    value={editItem[key] || ""}
                    onChange={e => setEditItem(prev => ({ ...prev, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditItem(null)} className="px-4 py-2 bg-gray-300 rounded">Batal</button>
              <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded">
                {isSaving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="text-sm mb-4">
              Yakin ingin menghapus data <strong>{deleteItem.name}</strong> dari <strong>{deleteItem.region}</strong>, toko <strong>{deleteItem.store}</strong> tanggal: <strong>{deleteItem.date}</strong>?<br/>
              Nilai actual: <strong>{deleteItem.actual}</strong>
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setDeleteItem(null)} className="px-4 py-2 bg-gray-300 rounded">Batal</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
