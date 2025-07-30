import { useEffect, useState } from "react";
import { db, ref, onValue, push, update, remove } from "../../firebaseClient";

export default function useValidasiPage() {
  const [validasis, setValidasis] = useState([]);

  useEffect(() => {
    const validasiRef = ref(db, "validasi_data");
    const unsub = onValue(validasiRef, (snapshot) => {
      const val = snapshot.val() || {};
      const data = Object.entries(val).map(([id, value]) => ({ id, ...value }));
      setValidasis(data);
    });
    return () => unsub();
  }, []);

  const addValidasi = async (data) => {
    const validasiRef = ref(db, "validasi_data");
    await push(validasiRef, data);
  };

  const updateValidasi = async (id, data) => {
    const itemRef = ref(db, `validasi_data/${id}`);
    await update(itemRef, data);
  };

  const deleteValidasi = async (id) => {
    const itemRef = ref(db, `validasi_data/${id}`);
    await remove(itemRef);
  };

  return { validasis, addValidasi, updateValidasi, deleteValidasi };
}
