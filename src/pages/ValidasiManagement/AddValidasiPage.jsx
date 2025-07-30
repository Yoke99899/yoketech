import React from 'react';
import ValidasiForm from './ValidasiForm';
import UseValidasiPage from './UseValidasiPage';

export default function AddValidasiPage({ onClose }) {
  const { addValidasi } = UseValidasiPage();

  const handleSubmit = async (data) => {
    await addValidasi(data);
    onClose(); // Tutup form setelah submit
  };

  return (
    <ValidasiForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Tambah Validasi"
    />
  );
}
