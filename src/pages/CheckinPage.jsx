// File: CheckinPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { db, ref, onValue, push, set, update } from "../firebaseClient";
import {
  FaSpinner,
  FaMapMarkerAlt,
  FaBuilding,
  FaBoxes,
  FaMoneyBillWave,
  FaListUl,
  FaCheck,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function CheckinPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [outlets, setOutlets] = useState([]);
  const [productivity, setProductivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkinData, setCheckinData] = useState(null);
  const [timer, setTimer] = useState(0);
  const [selectedOutletId, setSelectedOutletId] = useState(null);
  const [radius] = useState(0.5);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAccount, setFilterAccount] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  const rowRefs = useRef({});
  const userId = "user123";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => console.error("Location error:", err)
    );
  }, []);

  useEffect(() => {
    onValue(ref(db, "outlet_data"), (snapshot) => {
      const data = snapshot.val() || {};
      setOutlets(Object.values(data));
    });

    onValue(ref(db, "productivity_data"), (snapshot) => {
      const data = snapshot.val() || {};
      setProductivity(Object.values(data));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const stateRef = ref(db, `state_checkin/${userId}`);
    onValue(stateRef, (snapshot) => {
      const stateData = snapshot.val();
      if (stateData?.state === "checked-in") {
        const { outlet_id, outlet_name, timestamp, firebaseId } = stateData;
        const startTime = new Date(timestamp);
        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 1000);
        setCheckinData({
          outlet_id,
          outlet_name,
          time_checkin: startTime.toTimeString().split(" ")[0],
          date_checkin: startTime.toISOString().split("T")[0],
          firebaseId: firebaseId || null,
        });
        setTimer(elapsed);
      }
    });
  }, []);

  useEffect(() => {
    let interval;
    if (checkinData) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [checkinData]);

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  const handleCheckin = (outlet) => {
    const now = new Date();
    const payload = {
      outlet_id: outlet.outlet_id,
      outlet_name: outlet.outlet,
      date_checkin: now.toISOString().split("T")[0],
      time_checkin: now.toTimeString().split(" ")[0],
      latitude: userLocation.lat,
      longitude: userLocation.lng,
    };

    const newRef = push(ref(db, "Attendance_data"));
    set(newRef, payload);

    set(ref(db, `state_checkin/${userId}`), {
      state: "checked-in",
      timestamp: now.toISOString(),
      outlet_id: outlet.outlet_id,
      outlet_name: outlet.outlet,
      firebaseId: newRef.key,
    });

    setCheckinData({ ...payload, firebaseId: newRef.key });
    setTimer(0);
  };

  const handleCheckout = () => {
    const now = new Date();
    if (checkinData.firebaseId) {
      update(ref(db, `Attendance_data/${checkinData.firebaseId}`), {
        date_checkout: now.toISOString().split("T")[0],
        time_checkout: now.toTimeString().split(" ")[0],
      });
    }
    set(ref(db, `state_checkin/${userId}`), {
      state: "checked-out",
      timestamp: now.toISOString(),
    });
    setCheckinData(null);
    setTimer(0);
  };

  const uniqueCategories = [...new Set(outlets.map((o) => o.category).filter(Boolean))];
  const uniqueAccounts = [...new Set(outlets.map((o) => o.account).filter(Boolean))];

  const enhancedOutlets = outlets
    .map((outlet) => {
      const distance = userLocation
        ? haversineDistance(userLocation.lat, userLocation.lng, outlet.latitude, outlet.longitude)
        : null;
      const related = productivity.filter((p) => p.outlet_id === outlet.outlet_id);
      const totalQty = related.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
      const totalVal = related.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
      return { ...outlet, distance, totalQty, totalVal };
    })
    .filter((o) => {
      const withinRadius = o.distance !== null && o.distance <= radius;
      const matchCategory = filterCategory ? o.category === filterCategory : true;
      const matchAccount = filterAccount ? o.account === filterAccount : true;
      const matchName = searchName ? o.outlet.toLowerCase().includes(searchName.toLowerCase()) : true;
      const matchAddress = searchAddress ? o.address?.toLowerCase().includes(searchAddress.toLowerCase()) : true;
      return withinRadius && matchCategory && matchAccount && matchName && matchAddress;
    })
    .sort((a, b) => a.distance - b.distance);

  return (
    <div className="px-4 py-6 max-w-screen-md mx-auto bg-gray-50 min-h-screen">
      {loading || !userLocation ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin mr-2" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {/* Filter */}
          <div className="grid grid-cols-1 gap-2 mb-4 sm:grid-cols-2">
            <input type="text" placeholder="Search Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="border p-2 rounded-md w-full" />
            <input type="text" placeholder="Search Address" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)} className="border p-2 rounded-md w-full" />
            <select value={filterAccount} onChange={(e) => setFilterAccount(e.target.value)} className="border p-2 rounded-md w-full">
              <option value="">Account</option>
              {uniqueAccounts.map((acc) => <option key={acc}>{acc}</option>)}
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border p-2 rounded-md w-full">
              <option value="">Category</option>
              {uniqueCategories.map((cat) => <option key={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Map */}
          <div className="rounded-xl overflow-hidden mb-6 border shadow">
            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={16} style={{ height: 300, width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[userLocation.lat, userLocation.lng]} icon={greenIcon}>
                <Popup>Lokasi Anda</Popup>
              </Marker>
              {enhancedOutlets.map((outlet) => (
                <Marker
                  key={outlet.outlet_id}
                  position={[outlet.latitude, outlet.longitude]}
                  eventHandlers={{ click: () => setSelectedOutletId(outlet.outlet_id) }}
                >
                  <Popup>
                    <strong>{outlet.outlet}</strong><br />
                    {outlet.category} / {outlet.account}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Info / Cards */}
          {checkinData ? (
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <h2 className="text-green-600 text-xl font-semibold mb-1">Sedang Check-in</h2>
              <p className="text-gray-700 text-sm">Outlet: <strong>{checkinData.outlet_name}</strong></p>
              <p className="text-gray-700 text-sm">Jam: {checkinData.time_checkin}</p>
              <p className="text-gray-700 text-sm mb-3">Durasi: <span className="font-mono">{formatTime(timer)}</span></p>
              <button onClick={handleCheckout} className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md">
                Check Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[65vh] overflow-auto">
              {enhancedOutlets.map((outlet) => (
                <div
                  key={outlet.outlet_id}
                  ref={(el) => (rowRefs.current[outlet.outlet_id] = el)}
                  className="bg-white rounded-xl p-4 shadow flex flex-col justify-between"
                  onClick={() => setSelectedOutletId(outlet.outlet_id)}
                >
                  <div>
                    <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                      <FaBuilding className="text-blue-500" /> {outlet.outlet}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                      <FaListUl className="text-gray-400" /> {outlet.category || "-"} / {outlet.account || "-"}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                      <FaBoxes className="text-green-600" /> Qty: {outlet.totalQty}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                      <FaMoneyBillWave className="text-green-700" /> Rp {outlet.totalVal.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                      <FaMapMarkerAlt className="text-red-500" /> {outlet.distance ? `${(outlet.distance * 1000).toFixed(0)} m` : "-"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckin(outlet);
                    }}
                    className="mt-2 bg-blue-600 text-white py-2 rounded-full shadow-md flex items-center justify-center gap-2"
                  >
                    <FaCheck /> Check In
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
