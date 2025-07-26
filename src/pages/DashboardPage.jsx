import React, { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import {
  BarChart2,
  CheckCircle,
  ShoppingBag,
  MonitorCheck
} from "lucide-react";
import CheckinPage from "./CheckinPage";
import { db, ref, onValue } from "../firebaseClient";
import { format } from "date-fns";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const menus = [
    { label: "Availability", icon: <CheckCircle size={28} /> },
    { label: "Productivity", icon: <BarChart2 size={28} /> },
    { label: "Sales", icon: <ShoppingBag size={28} /> },
    { label: "Display", icon: <MonitorCheck size={28} /> }
  ];

  useEffect(() => {
    const attendanceRef = ref(db, "attendance_data");
    const productivityRef = ref(db, "productivity_data");
    const today = format(new Date(), "yyyy-MM-dd");

    onValue(attendanceRef, (snapshot) => {
      const attendanceRaw = snapshot.val();
      if (!attendanceRaw) return setHistoryData([]);

      const attendanceToday = Object.entries(attendanceRaw)
        .filter(([_, item]) => item.date === today && item.checkoutTime)
        .map(([key, item]) => {
          const duration = getDuration(item.checkinTime, item.checkoutTime);
          return {
            key,
            outlet: item.outletName || "Unknown",
            duration,
            frontlinerId: item.frontlinerId,
          };
        });

      onValue(productivityRef, (snap) => {
        const prodRaw = snap.val() || {};
        const productivityToday = Object.values(prodRaw).filter(
          (p) => p.date === today
        );

        const merged = attendanceToday.map((att) => {
          const sales = productivityToday
            .filter((p) => p.outlet === att.outlet)
            .reduce((sum, p) => sum + Number(p.sales || 0), 0);
          return { ...att, sales };
        });

        setHistoryData(merged);
      });
    });
  }, []);

  const getDuration = (start, end) => {
    try {
      const s = new Date(start);
      const e = new Date(end);
      const diff = Math.floor((e - s) / 1000);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      return `${h} jam ${m} menit`;
    } catch {
      return "-";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-6 max-w-md mx-auto relative font-sans">
      {/* Avatar */}
      <div className="absolute top-4 right-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-700 to-cyan-500 shadow-lg border-4 border-white" />
      </div>

      {/* Greeting */}
      <h2 className="text-2xl font-semibold mt-8 mb-6 text-gray-800">
        Selamat datang,
      </h2>

      {/* Menu Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow p-4 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Menu</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          {menus.map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-1 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full bg-cyan-700 group-hover:bg-cyan-800 text-white flex items-center justify-center shadow">
                {item.icon}
              </div>
              <span className="text-sm text-gray-700 group-hover:underline">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Check In Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(true)}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white text-lg font-semibold py-3 rounded-xl shadow-lg mb-8 transition-all duration-200"
      >
        Check in
      </motion.button>

      {/* History Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow p-4">
        <p className="text-md mb-3 text-gray-700 font-semibold">
          History Kunjungan Hari Ini
        </p>

        {historyData.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded-md border border-dashed border-gray-300 text-gray-500 italic text-sm">
            Belum ada data kunjungan hari ini.
          </div>
        ) : (
          <div className="grid gap-3">
            {historyData.map((item, index) => (
              <div
                key={item.key || index}
                className="border border-gray-100 rounded-xl bg-blue-50/30 shadow-sm p-3"
              >
                <div className="font-semibold text-gray-800">
                  {item.outlet}
                </div>
                <div className="text-sm text-gray-600">
                  Durasi: <span className="font-medium">{item.duration}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Penjualan:{" "}
                  <span className="font-bold text-green-600">
                    {item.sales}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: Checkin Form */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white border border-gray-300 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-gray-800 mb-4">
                    Form Check In
                  </Dialog.Title>
                  <CheckinPage />
                  <div className="mt-4 flex justify-end">
                    <button
                      className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 rounded"
                      onClick={() => setIsOpen(false)}
                    >
                      Tutup
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
