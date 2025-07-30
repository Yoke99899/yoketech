import React from 'react';
import ValidasiForm from './ValidasiForm';
import UseValidasiPage from './UseValidasiPage';

export default function EditValidasiPage({ data, onClose }) {
  const { updateValidasi } = UseValidasiPage();

  return (
    <ValidasiForm
      initialData={data}
      onSubmit={(updatedData) => updateValidasi(data.id, updatedData)}
      onCancel={onClose}
      title="Edit Validasi"
    />
  );
}
