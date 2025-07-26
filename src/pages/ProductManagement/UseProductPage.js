// src/pages/ProductManagement/useProductData.js
import { useEffect, useState } from 'react';
import {
  db, ref, push, set, onValue, update, remove
} from '../../firebaseClient';

export default function useProductData() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const empRef = ref(db, 'product_data');
    onValue(empRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setProducts(list);
    });
  }, []);

  const addProduct = async (productData) => {
    try {
      const newRef = push(ref(db, 'product_data'));
      await set(newRef, productData);
      console.log('✅ Data berhasil ditambahkan!');
    } catch (err) {
      console.error('❌ Gagal menambahkan data:', err);
    }
  };

  const updateProduct = async (id, newData) => {
    try {
      await update(ref(db, `product_data/${id}`), newData);
    } catch (err) {
      console.error('❌ Gagal update:', err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await remove(ref(db, `product_data/${id}`));
    } catch (err) {
      console.error('❌ Gagal hapus:', err);
    }
  };

  return { products, addProduct, updateProduct, deleteProduct };
}
