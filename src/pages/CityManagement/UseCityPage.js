import { useEffect, useState } from "react";
import { db, ref, onValue, push, update, remove } from "../../firebaseClient";

export default function useCityPage() {
  const [citys, setCitys] = useState([]);

  useEffect(() => {
    const cityRef = ref(db, "city_data");
    const unsub = onValue(cityRef, (snapshot) => {
      const val = snapshot.val() || {};
      const data = Object.entries(val).map(([id, value]) => ({ id, ...value }));
      setCitys(data);
    });
    return () => unsub();
  }, []);

  const addCity = async (data) => {
    const cityRef = ref(db, "city_data");
    await push(cityRef, data);
  };

  const updateCity = async (id, data) => {
    const itemRef = ref(db, `city_data/${id}`);
    await update(itemRef, data);
  };

  const deleteCity = async (id) => {
    const itemRef = ref(db, `city_data/${id}`);
    await remove(itemRef);
  };

  return { citys, addCity, updateCity, deleteCity };
}
