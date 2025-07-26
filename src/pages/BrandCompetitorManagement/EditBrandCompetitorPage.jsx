import React from 'react';
import BrandCompetitorForm from './BrandCompetitorForm';
import UseBrandCompetitorPage from './UseBrandCompetitorPage';

export default function EditBrandCompetitorPage({ data, onClose }) {
  const { updateBrandCompetitor } = UseBrandCompetitorPage();

  return (
    <BrandCompetitorForm
      initialData={data}
      onSubmit={(updatedData) => updateBrandCompetitor(data.id, updatedData)}
      onCancel={onClose}
      title="Edit BrandCompetitor"
    />
  );
}
