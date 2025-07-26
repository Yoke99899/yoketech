import React from 'react';
import DistrictForm from './DistrictForm';
import UseDistrictPage from './UseDistrictPage';

export default function AddDistrictPage({ onClose }) {
  const { addDistrict } = UseDistrictPage();

  const handleSubmit = async (data) => {
    await addDistrict(data);
    onClose(); // Tutup form setelah submit
  };

  return (
    <DistrictForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Tambah District"
    />
  );
}
