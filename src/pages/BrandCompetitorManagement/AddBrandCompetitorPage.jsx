import React from 'react';
import BrandCompetitorForm from './BrandCompetitorForm';
import UseBrandCompetitorPage from './UseBrandCompetitorPage';

export default function AddBrandCompetitorPage({ onClose }) {
  const { addBrandCompetitor } = UseBrandCompetitorPage();

  const handleSubmit = async (data) => {
    await addBrandCompetitor(data);
    onClose(); // Tutup form setelah submit
  };

  return (
    <BrandCompetitorForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Tambah BrandCompetitor"
    />
  );
}
