import React from 'react';
import ProductForm from './ProductForm';
import UseProductPage from './UseProductPage';

export default function EditProductPage({ data, onClose }) {
  const { updateProduct } = UseProductPage();

  return (
    <ProductForm
      initialData={data}
      onSubmit={(updatedData) => updateProduct(data.id, updatedData)}
      onCancel={onClose}
      title="Edit Product"
    />
  );
}
