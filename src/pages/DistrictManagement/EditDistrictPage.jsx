import React from 'react';
import DistrictForm from './DistrictForm';
import UseDistrictPage from './UseDistrictPage';

export default function EditDistrictPage({ data, onClose }) {
  const { updateDistrict } = UseDistrictPage();

  return (
    <DistrictForm
      initialData={data}
      onSubmit={(updatedData) => updateDistrict(data.id, updatedData)}
      onCancel={onClose}
      title="Edit District"
    />
  );
}
