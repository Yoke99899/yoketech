import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FancyTable from "./pages/FancyTable";
import Data2Table from "./pages/Data2Table";
import "./index.css";
import { GoogleAuthProvider } from "./GoogleAuthProvider"; // ✅ penting

const App = () => (
  <GoogleAuthProvider>
    <BrowserRouter>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-cyan-900 text-white p-4 space-y-4">
          <h1 className="text-xl font-bold mb-4">📊 Yoke Data Analyst</h1>
          <nav className="space-y-2">
            <Link to="/" className="block hover:bg-cyan-700 p-2 rounded">
              Dashboard/Statistik
            </Link>
            <Link to="/inbox" className="block hover:bg-cyan-700 p-2 rounded">
              Pesan WhatsApp
            </Link>
            <Link to="/data2" className="block hover:bg-cyan-700 p-2 rounded">
              Data Penjualan
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inbox" element={<FancyTable />} />
            <Route path="/data2" element={<Data2Table />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  </GoogleAuthProvider>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
