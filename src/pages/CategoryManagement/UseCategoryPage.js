import { useEffect, useState } from "react";
import { db, ref, onValue, push, update, remove } from "../../firebaseClient";

export default function useCategoryPage() {
  const [categorys, setCategorys] = useState([]);

  useEffect(() => {
    const categoryRef = ref(db, "category_data");
    const unsub = onValue(categoryRef, (snapshot) => {
      const val = snapshot.val() || {};
      const data = Object.entries(val).map(([id, value]) => ({ id, ...value }));
      setCategorys(data);
    });
    return () => unsub();
  }, []);

  const addCategory = async (data) => {
    const categoryRef = ref(db, "category_data");
    await push(categoryRef, data);
  };

  const updateCategory = async (id, data) => {
    const itemRef = ref(db, `category_data/${id}`);
    await update(itemRef, data);
  };

  const deleteCategory = async (id) => {
    const itemRef = ref(db, `category_data/${id}`);
    await remove(itemRef);
  };

  return { categorys, addCategory, updateCategory, deleteCategory };
}
