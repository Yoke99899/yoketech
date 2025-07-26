import React from 'react';
import StoreForm from './StoreForm';
import useStorePage from './UseStorePage';

export default function EditStorePage({ data, onClose }) {
  const { updateStore } = useStorePage();

  return (
    <StoreForm
      initialData={data}
      onSubmit={(updatedData) => updateStore(data.id, updatedData)}
      onCancel={onClose}
      title="Edit Toko"
    />
  );
}
