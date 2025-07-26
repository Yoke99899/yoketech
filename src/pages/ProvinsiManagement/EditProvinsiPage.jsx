import React from 'react';
import ProvinsiForm from './ProvinsiForm';
import UseProvinsiPage from './useProvinsiPage';

export default function EditProvinsiPage({ data, onClose }) {
  const { updateProvinsi } = UseProvinsiPage();

  return (
    <ProvinsiForm
      initialData={data}
      onSubmit={(updatedData) => updateProvinsi(data.id, updatedData)}
      onCancel={onClose}
      title="Edit Provinsi"
    />
  );
}
