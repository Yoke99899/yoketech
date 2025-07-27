// src/pages/DisplayManagement/useDisplayData.js
import { useEffect, useState } from 'react';
import {
  db, ref, push, set, onValue, update, remove
} from '../../firebaseClient';

export default function useDisplayData() {
  const [displays, setDisplays] = useState([]);

  useEffect(() => {
    const empRef = ref(db, 'display_data');
    onValue(empRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setDisplays(list);
    });
  }, []);

  const addDisplay = async (displayData) => {
    try {
      const newRef = push(ref(db, 'display_data'));
      await set(newRef, displayData);
      console.log('✅ Data berhasil ditambahkan!');
    } catch (err) {
      console.error('❌ Gagal menambahkan data:', err);
    }
  };

  const updateDisplay = async (id, newData) => {
    try {
      await update(ref(db, `display_data/${id}`), newData);
    } catch (err) {
      console.error('❌ Gagal update:', err);
    }
  };

  const deleteDisplay = async (id) => {
    try {
      await remove(ref(db, `display_data/${id}`));
    } catch (err) {
      console.error('❌ Gagal hapus:', err);
    }
  };

  return { displays, addDisplay, updateDisplay, deleteDisplay };
}
