import React from 'react';
import AccountForm from './AccountForm';
import UseAccountPage from './useAccountPage';

export default function EditAccountPage({ data, onClose }) {
  const { updateAccount } = UseAccountPage();

  return (
    <AccountForm
      initialData={data}
      onSubmit={(updatedData) => updateAccount(data.id, updatedData)}
      onCancel={onClose}
      title="Edit Account"
    />
  );
}
