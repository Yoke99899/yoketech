import { useEffect, useState } from "react";
import { db, ref, onValue, push, update, remove } from "../../firebaseClient";

export default function useProvinsiPage() {
  const [provinsis, setProvinsis] = useState([]);

  useEffect(() => {
    const provinsiRef = ref(db, "provinsi_data");
    const unsub = onValue(provinsiRef, (snapshot) => {
      const val = snapshot.val() || {};
      const data = Object.entries(val).map(([id, value]) => ({ id, ...value }));
      setProvinsis(data);
    });
    return () => unsub();
  }, []);

  const addProvinsi = async (data) => {
    const provinsiRef = ref(db, "provinsi_data");
    await push(provinsiRef, data);
  };

  const updateProvinsi = async (id, data) => {
    const itemRef = ref(db, `provinsi_data/${id}`);
    await update(itemRef, data);
  };

  const deleteProvinsi = async (id) => {
    const itemRef = ref(db, `provinsi_data/${id}`);
    await remove(itemRef);
  };

  return { provinsis, addProvinsi, updateProvinsi, deleteProvinsi };
}
