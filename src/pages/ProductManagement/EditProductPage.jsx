import React from 'react';
import ProductForm from './ProductForm';
import useProductPage from './useProductPage';

export default function EditProductPage({ data, onClose }) {
  const { updateProduct } = useProductPage();

  return (
    <ProductForm
      initialData={data}
      onSubmit={(updatedData) => updateProduct(data.id, updatedData)}
      onCancel={onClose}
      title="Edit Product"
    />
  );
}
