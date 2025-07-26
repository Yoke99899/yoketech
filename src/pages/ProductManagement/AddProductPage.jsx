import React from 'react';
import ProductForm from './ProductForm';
import useProductPage from './useProductPage';

export default function AddProductPage({ onClose }) {
  const { addProduct } = useProductPage();

  const handleSubmit = async (data) => {
    await addProduct(data);
    onClose(); // Tutup form setelah submit
  };

  return (
    <ProductForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Tambah Product"
    />
  );
}
