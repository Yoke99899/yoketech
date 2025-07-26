import React from 'react';
import ProvinsiForm from './ProvinsiForm';
import UseProvinsiPage from './UseProvinsiPage';

export default function AddProvinsiPage({ onClose }) {
  const { addProvinsi } = UseProvinsiPage();

  const handleSubmit = async (data) => {
    await addProvinsi(data);
    onClose(); // Tutup form setelah submit
  };

  return (
    <ProvinsiForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Tambah Provinsi"
    />
  );
}
