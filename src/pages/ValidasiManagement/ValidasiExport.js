// utils/exportValidasisToExcel.js
import { ref, get } from "firebase/database";
import { db } from "../../firebaseClient";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Fungsi untuk buat nama file berdasarkan waktu
const generateFileName = () => {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  return `validasi_${date}_${time}.xlsx`;
};

// Alert gaya modern
const stylishAlert = (message) => {
  const container = document.createElement("div");
  container.innerText = message;
  Object.assign(container.style, {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1e40af",
    color: "white",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    zIndex: "9999",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  });
  document.body.appendChild(container);
  setTimeout(() => {
    container.style.transition = "all 0.3s ease";
    container.style.opacity = "0";
    setTimeout(() => container.remove(), 300);
  }, 2500);
};

// Fungsi utama ekspor langsung ke Excel (Excel only)
export const exportValidasisToExcel = async () => {
  try {
    const snapshot = await get(ref(db, "validasi_data"));
    const rawData = snapshot.val();

    if (!rawData) {
      stylishAlert("Tidak ada data ditemukan.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Produk");

    const headers = [
  "Frontliner",
  "Outlet ID",
  "Outlet Name",
  "Address",
  "District",
  "Owner",
  "Telp",
  "Input No Valid",
  "Reason Nomor",
  "Respon"
];


    worksheet.columns = headers.map((header) => ({
      header,
      key: header,
      width: 20,
    }));

    // Style header baris pertama
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "BFDBFE" }, // biru muda
      };
      cell.font = { bold: true, color: { argb: "000000" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    let rowIndex = 2;

    for (const [i, item] of Object.values(rawData).entries()) {
     const dataRow = {
    Frontliner: item.frontliner || "",
  OutletID: item.outlet_id || "",
  OutletName: item.outlet_name || "",
  Address: item.address || "",
  District: item.district || "",
  Owner: item.owner || "",
  Telp: item.telp || "",
  InputNoValid: item.input_no_valid || "",
  ReasonNomor: item.reason_nomor || "",
  Respon: item.respon || ""
};


      worksheet.addRow(dataRow);
      rowIndex++;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, generateFileName());
  } catch (err) {
    console.error("Gagal ekspor:", err);
    stylishAlert("Terjadi kesalahan saat ekspor.");
  }
};
