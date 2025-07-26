import React from 'react';
import ProductForm from './ProductForm';
import UseProductPage from './UseProductPage';

export default function AddProductPage({ onClose }) {
  const { addProduct } = UseProductPage();

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
