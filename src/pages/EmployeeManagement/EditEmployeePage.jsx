import React from 'react';
import EmployeeForm from './EmployeeForm';
import useEmployeeData from './useEmployeeData';

export default function EditEmployeePage({ data, onClose }) {
  const { updateEmployee } = useEmployeeData();

  return (
    <EmployeeForm
      initialData={data}
      onSubmit={(updatedData) => updateEmployee(data.id, updatedData)}
      onCancel={onClose}
      title="Edit Karyawan"
    />
  );
}
