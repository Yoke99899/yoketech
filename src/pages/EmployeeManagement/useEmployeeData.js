// src/pages/EmployeeManagement/useEmployeeData.js
import { useEffect, useState } from 'react';
import {
  db, ref, push, set, onValue, update, remove
} from '../../firebaseClient';

export default function useEmployeeData() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const empRef = ref(db, 'employee_data');
    onValue(empRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setEmployees(list);
    });
  }, []);

  const addEmployee = async (employeeData) => {
    try {
      const newRef = push(ref(db, 'employee_data'));
      await set(newRef, employeeData);
      console.log('✅ Data berhasil ditambahkan!');
    } catch (err) {
      console.error('❌ Gagal menambahkan data:', err);
    }
  };

  const updateEmployee = async (id, newData) => {
    try {
      await update(ref(db, `employee_data/${id}`), newData);
    } catch (err) {
      console.error('❌ Gagal update:', err);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await remove(ref(db, `employee_data/${id}`));
    } catch (err) {
      console.error('❌ Gagal hapus:', err);
    }
  };

  return { employees, addEmployee, updateEmployee, deleteEmployee };
}
