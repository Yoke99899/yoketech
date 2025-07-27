import React from 'react';
import DisplayForm from './DisplayForm';
import UseDisplayPage from './UseDisplayPage';

export default function AddDisplayPage({ onClose }) {
  const { addDisplay } = UseDisplayPage();

  const handleSubmit = async (data) => {
    await addDisplay(data);
    onClose(); // Tutup form setelah submit
  };

  return (
    <DisplayForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Tambah Display"
    />
  );
}
