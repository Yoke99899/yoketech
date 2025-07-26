import { useEffect, useState } from "react";
import { db, ref, onValue, push, update, remove } from "../../firebaseClient";

export default function useBrandCompetitorPage() {
  const [brandcompetitors, setBrandCompetitors] = useState([]);

  useEffect(() => {
    const brandcompetitorRef = ref(db, "brandcompetitor_data");
    const unsub = onValue(brandcompetitorRef, (snapshot) => {
      const val = snapshot.val() || {};
      const data = Object.entries(val).map(([id, value]) => ({ id, ...value }));
      setBrandCompetitors(data);
    });
    return () => unsub();
  }, []);

  const addBrandCompetitor = async (data) => {
    const brandcompetitorRef = ref(db, "brandcompetitor_data");
    await push(brandcompetitorRef, data);
  };

  const updateBrandCompetitor = async (id, data) => {
    const itemRef = ref(db, `brandcompetitor_data/${id}`);
    await update(itemRef, data);
  };

  const deleteBrandCompetitor = async (id) => {
    const itemRef = ref(db, `brandcompetitor_data/${id}`);
    await remove(itemRef);
  };

  return { brandcompetitors, addBrandCompetitor, updateBrandCompetitor, deleteBrandCompetitor };
}
