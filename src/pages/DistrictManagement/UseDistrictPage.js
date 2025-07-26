import { useEffect, useState } from "react";
import { db, ref, onValue, push, update, remove } from "../../firebaseClient";

export default function useDistrictPage() {
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const districtRef = ref(db, "district_data");
    const unsub = onValue(districtRef, (snapshot) => {
      const val = snapshot.val() || {};
      const data = Object.entries(val).map(([id, value]) => ({ id, ...value }));
      setDistricts(data);
    });
    return () => unsub();
  }, []);

  const addDistrict = async (data) => {
    const districtRef = ref(db, "district_data");
    await push(districtRef, data);
  };

  const updateDistrict = async (id, data) => {
    const itemRef = ref(db, `district_data/${id}`);
    await update(itemRef, data);
  };

  const deleteDistrict = async (id) => {
    const itemRef = ref(db, `district_data/${id}`);
    await remove(itemRef);
  };

  return { districts, addDistrict, updateDistrict, deleteDistrict };
}
