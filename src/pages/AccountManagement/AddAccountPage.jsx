import React from 'react';
import AccountForm from './AccountForm';
import UseAccountPage from './UseAccountPage';

export default function AddAccountPage({ onClose }) {
  const { addAccount } = UseAccountPage();

  const handleSubmit = async (data) => {
    await addAccount(data);
    onClose(); // Tutup form setelah submit
  };

  return (
    <AccountForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Tambah Account"
    />
  );
}
