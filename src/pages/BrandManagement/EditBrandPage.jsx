import React from 'react';
import BrandForm from './BrandForm';
import UseBrandPage from './UseBrandPage';

export default function EditBrandPage({ data, onClose }) {
  const { updateBrand } = UseBrandPage();

  return (
    <BrandForm
      initialData={data}
      onSubmit={(updatedData) => updateBrand(data.id, updatedData)}
      onCancel={onClose}
      title="Edit Brand"
    />
  );
}
