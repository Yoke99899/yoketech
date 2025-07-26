import React, { useState } from "react";
import { ref, onValue, set } from "../firebaseClient";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "User",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (key, val) => {
    setForm({ ...form, [key]: val });
  };

  const handleLogin = () => {
    const userRef = ref(window.firebaseDB, "user_data");
    onValue(
      userRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        const users = Object.values(data);
        const found = users.find(
          (u) => u.email === form.email && u.password === form.password
        );
        if (found) {
          localStorage.setItem("currentUser", JSON.stringify(found));
          navigate("/");
        } else {
          setError("Email atau password salah!");
        }
      },
      { onlyOnce: true }
    );
  };

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.name) {
      setError("Isi semua data terlebih dahulu");
      return;
    }
    const id = Date.now().toString();
    await set(ref(window.firebaseDB, `user_data/${id}`), { id, ...form });
    alert("✅ Berhasil daftar. Silakan login.");
    setIsRegister(false);
    setForm({ email: "", password: "", name: "", role: "User" });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="bg-gray-100 max-w-md w-full p-8 rounded-xl shadow-xl space-y-5">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isRegister ? "Daftar Pengguna Baru" : "Login ke Sistem"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {isRegister && (
          <input
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nama Lengkap"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        )}

        <input
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <input
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />

        {isRegister && (
          <select
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.role}
            onChange={(e) => handleChange("role", e.target.value)}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Master Admin">Master Admin</option>
          </select>
        )}

        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={isRegister ? handleRegister : handleLogin}
        >
          {isRegister ? "Daftar Sekarang" : "Login"}
        </button>

        <p className="text-center text-sm text-gray-700">
          {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <button
            className="text-blue-600 font-medium hover:underline"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Login di sini" : "Daftar di sini"}
          </button>
        </p>
      </div>
    </div>
  );
}
