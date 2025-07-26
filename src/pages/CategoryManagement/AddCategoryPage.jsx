import React from 'react';
import CategoryForm from './CategoryForm';
import UseCategoryPage from './UseCategoryPage';

export default function AddCategoryPage({ onClose }) {
  const { addCategory } = UseCategoryPage();

  const handleSubmit = async (data) => {
    await addCategory(data);
    onClose(); // Tutup form setelah submit
  };

  return (
    <CategoryForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Tambah Category"
    />
  );
}
