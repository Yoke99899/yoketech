import React from 'react';
import DisplayForm from './DisplayForm';
import UseDisplayPage from './UseDisplayPage';

export default function EditDisplayPage({ data, onClose }) {
  const { updateDisplay } = UseDisplayPage();

  return (
    <DisplayForm
      initialData={data}
      onSubmit={(updatedData) => updateDisplay(data.id, updatedData)}
      onCancel={onClose}
      title="Edit Display"
    />
  );
}
