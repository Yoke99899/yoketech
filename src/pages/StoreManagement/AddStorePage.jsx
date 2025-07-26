import React from 'react';
import StoreForm from './StoreForm';
import useStorePage from './useStorePage';

export default function AddStorePage({ onClose }) {
  const { addStore } = useStorePage();

  const handleSubmit = async (data) => {
    await addStore(data);
    onClose(); // Tutup form setelah submit
  };

  return (
    <StoreForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Tambah Toko"
    />
  );
}
