import React from 'react';
import CityForm from './CityForm';
import UseCityPage from './UseCityPage';

export default function EditCityPage({ data, onClose }) {
  const { updateCity } = UseCityPage();

  return (
    <CityForm
      initialData={data}
      onSubmit={(updatedData) => updateCity(data.id, updatedData)}
      onCancel={onClose}
      title="Edit City"
    />
  );
}
