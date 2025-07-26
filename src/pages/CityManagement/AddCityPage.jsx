import React from 'react';
import CityForm from './CityForm';
import UseCityPage from './UseCityPage';

export default function AddCityPage({ onClose }) {
  const { addCity } = UseCityPage();

  const handleSubmit = async (data) => {
    await addCity(data);
    onClose(); // Tutup form setelah submit
  };

  return (
    <CityForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Tambah City"
    />
  );
}
