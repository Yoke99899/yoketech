import React from 'react';
import BrandForm from './BrandForm';
import UseBrandPage from './UseBrandPage';

export default function AddBrandPage({ onClose }) {
  const { addBrand } = UseBrandPage();

  const handleSubmit = async (data) => {
    await addBrand(data);
    onClose(); // Tutup form setelah submit
  };

  return (
    <BrandForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Tambah Brand"
    />
  );
}
