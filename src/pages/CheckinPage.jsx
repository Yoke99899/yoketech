import React, { useEffect, useState, useRef } from "react";
import { db, ref, onValue, push, set, update } from "../firebaseClient";
import { FaSpinner, FaMapMarkerAlt, FaBuilding, FaBoxes, FaMoneyBillWave, FaListUl, FaCheck } from "react-icons/fa";
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

export default function Checkin() {
  const [userLocation, setUserLocation] = useState(null);
  const [outlets, setOutlets] = useState([]);
  const [productivity, setProductivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkinData, setCheckinData] = useState(null);
  const [timer, setTimer] = useState(0);
  const [selectedOutletId, setSelectedOutletId] = useState(null);
  const [radius, setRadius] = useState(0.5);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAccount, setFilterAccount] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  const rowRefs = useRef({});
  const userId = "user123";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Location error:", err);
      }
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
    if (selectedOutletId && rowRefs.current[selectedOutletId]) {
      rowRefs.current[selectedOutletId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedOutletId]);

  useEffect(() => {
    let interval;
    if (checkinData) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [checkinData]);

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

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleCheckin = (outlet) => {
    const now = new Date();
    const checkinPayload = {
      outlet_id: outlet.outlet_id,
      outlet_name: outlet.outlet,
      date_checkin: now.toISOString().split("T")[0],
      time_checkin: now.toTimeString().split(" ")[0],
      latitude: userLocation.lat,
      longitude: userLocation.lng,
    };

    const newRef = push(ref(db, "Attendance_data"));
    set(newRef, checkinPayload);

    set(ref(db, `state_checkin/${userId}`), {
      state: "checked-in",
      timestamp: now.toISOString(),
      outlet_id: outlet.outlet_id,
      outlet_name: outlet.outlet,
      firebaseId: newRef.key,
    });

    setCheckinData({
      ...checkinPayload,
      firebaseId: newRef.key,
    });
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

  const getRowHighlightClass = (outlet) => {
    if (selectedOutletId !== outlet.outlet_id) return "";
    switch (outlet.category?.toLowerCase()) {
      case "retail":
        return "bg-green-100 text-green-800";
      case "enduser":
        return "bg-blue-100 text-blue-800";
      case "umkm":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
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
    <div className="p-4 max-w-6xl mx-auto">
      {loading || !userLocation ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin mr-2" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {/* Filter */}
          <div className="flex flex-wrap gap-4 mb-4">
            <input type="text" placeholder="Search Outlet Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="border px-2 py-1 rounded" />
            <input type="text" placeholder="Search Address" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)} className="border px-2 py-1 rounded" />
            <select value={filterAccount} onChange={(e) => setFilterAccount(e.target.value)} className="border px-2 py-1 rounded">
              <option value="">Dropdown Account</option>
              {uniqueAccounts.map((acc) => <option key={acc}>{acc}</option>)}
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border px-2 py-1 rounded">
              <option value="">Dropdown Category</option>
              {uniqueCategories.map((cat) => <option key={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Map */}
          <div className="mb-4 border rounded shadow overflow-hidden">
            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={16} style={{ height: "300px", width: "100%" }}>
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

          {/* Checkin or Outlet Card List */}
          {checkinData ? (
            <div className="text-center p-4 border rounded shadow bg-white">
              <h2 className="text-lg font-bold text-green-600 mb-2">Checked In</h2>
              <p className="text-sm">Outlet: <strong>{checkinData.outlet_name}</strong></p>
              <p className="text-sm">Check-in Time: {checkinData.time_checkin}</p>
              <p className="text-sm mb-2">Timer: <span className="font-mono">{formatTime(timer)}</span></p>
              <button onClick={handleCheckout} className="bg-red-500 text-white px-4 py-2 rounded shadow">Check Out</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-auto border-t pt-4">
              {enhancedOutlets.map((outlet) => (
                <div
                  key={outlet.outlet_id}
                  ref={(el) => (rowRefs.current[outlet.outlet_id] = el)}
                  className={`border rounded-xl p-4 shadow transition-all hover:shadow-lg cursor-pointer ${getRowHighlightClass(outlet)}`}
                  onClick={() => setSelectedOutletId(outlet.outlet_id)}
                >
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <FaBuilding className="text-blue-600" />
                    {outlet.outlet}
                  </h3>
                  <p className="text-sm flex items-center gap-2 text-gray-600 mb-1">
                    <FaListUl className="text-gray-400" />
                    {outlet.category || "-"} / {outlet.account || "-"}
                  </p>
                  <p className="text-sm flex items-center gap-2 text-gray-600 mb-1">
                    <FaBoxes className="text-green-600" />
                    Qty: {outlet.totalQty}
                  </p>
                  <p className="text-sm flex items-center gap-2 text-gray-600 mb-1">
                    <FaMoneyBillWave className="text-green-700" />
                    Value: Rp {outlet.totalVal.toLocaleString()}
                  </p>
                  <p className="text-sm flex items-center gap-2 text-gray-600 mb-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    {outlet.distance ? `${(outlet.distance * 1000).toFixed(0)} m` : "-"}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckin(outlet);
                    }}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2 w-full justify-center"
                  >
                    <FaCheck />
                    Check In
                  </button>
                </div>
              ))}
              {enhancedOutlets.length === 0 && (
                <div className="text-center col-span-full text-gray-500">
                  Tidak ada outlet yang sesuai filter
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
