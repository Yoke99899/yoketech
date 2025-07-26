import React from 'react';
import CategoryForm from './CategoryForm';
import UseCategoryPage from './UseCategoryPage';

export default function EditCategoryPage({ data, onClose }) {
  const { updateCategory } = UseCategoryPage();

  return (
    <CategoryForm
      initialData={data}
      onSubmit={(updatedData) => updateCategory(data.id, updatedData)}
      onCancel={onClose}
      title="Edit Category"
    />
  );
}
