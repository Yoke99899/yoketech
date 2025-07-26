import React from 'react';
import EmployeeForm from './EmployeeForm';
import useEmployeeData from './useEmployeeData';

export default function AddEmployeePage({ onClose }) {
  const { addEmployee } = useEmployeeData();

  const handleSubmit = async (data) => {
    await addEmployee(data);
    onClose(); // Tutup form setelah submit
  };

  return (
    <EmployeeForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Tambah Karyawan"
    />
  );
}
