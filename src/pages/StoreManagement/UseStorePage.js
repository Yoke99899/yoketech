// src/pages/StoreManagement/useStoreData.js
import { useEffect, useState } from 'react';
import {
  db, ref, push, set, onValue, update, remove
} from '../../firebaseClient';

export default function useStoreData() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const empRef = ref(db, 'store_data');
    onValue(empRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setStores(list);
    });
  }, []);

  const addStore = async (storeData) => {
    try {
      const newRef = push(ref(db, 'store_data'));
      await set(newRef, storeData);
      console.log('✅ Data berhasil ditambahkan!');
    } catch (err) {
      console.error('❌ Gagal menambahkan data:', err);
    }
  };

  const updateStore = async (id, newData) => {
    try {
      await update(ref(db, `store_data/${id}`), newData);
    } catch (err) {
      console.error('❌ Gagal update:', err);
    }
  };

  const deleteStore = async (id) => {
    try {
      await remove(ref(db, `store_data/${id}`));
    } catch (err) {
      console.error('❌ Gagal hapus:', err);
    }
  };

  return { stores, addStore, updateStore, deleteStore };
}
