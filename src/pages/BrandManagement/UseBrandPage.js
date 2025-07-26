import { useEffect, useState } from "react";
import { db, ref, onValue, push, update, remove } from "../../firebaseClient";

export default function useBrandPage() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const brandRef = ref(db, "brand_data");
    const unsub = onValue(brandRef, (snapshot) => {
      const val = snapshot.val() || {};
      const data = Object.entries(val).map(([id, value]) => ({ id, ...value }));
      setBrands(data);
    });
    return () => unsub();
  }, []);

  const addBrand = async (data) => {
    const brandRef = ref(db, "brand_data");
    await push(brandRef, data);
  };

  const updateBrand = async (id, data) => {
    const itemRef = ref(db, `brand_data/${id}`);
    await update(itemRef, data);
  };

  const deleteBrand = async (id) => {
    const itemRef = ref(db, `brand_data/${id}`);
    await remove(itemRef);
  };

  return { brands, addBrand, updateBrand, deleteBrand };
}
