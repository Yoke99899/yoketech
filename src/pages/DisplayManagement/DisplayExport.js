// utils/exportDisplaysToExcel.js
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
  return `display_${date}_${time}.xlsx`;
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
export const exportDisplaysToExcel = async () => {
  try {
    const snapshot = await get(ref(db, "display_data"));
    const rawData = snapshot.val();

    if (!rawData) {
      stylishAlert("Tidak ada data ditemukan.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Produk");

    const headers = [
  "ProductCode",
  "ProductName",
  "Category",
  "DisplayName",
  "StoreName",
  "StoreID", 
  "NIP",
  "EmployeeName",
  "FotoBefore",
  "FotoBefore2",
  "FotoBefore3",
  "FotoAfter1",
  "FotoAfter2",
  "FotoAfter3",
  "Note"
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
  ProductCode: item.product_code || "",
  ProductName: item.product_name || "",
  Category: item.category || "",
  DisplayName: item.display_name || "",
  StoreID: item.store_id || "",
  StoreName: item.store_name || "",
  NIP: item.employee_id || "",
  EmployeeName: item.employee_name || "",
  FotoBefore: item.foto_before || "",
  FotoBefore2: item.foto_before2 || "",
  FotoBefore3: item.foto_before3 || "",
  FotoAfter1: item.foto_after1 || "",
  FotoAfter2: item.foto_after2 || "",
  FotoAfter3: item.foto_after3 || "",
  Note: item.note || ""
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
