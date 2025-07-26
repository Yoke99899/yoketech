import React from 'react';
import ChannelForm from './ChannelForm';
import UseChannelPage from './useChannelPage';

export default function EditChannelPage({ data, onClose }) {
  const { updateChannel } = UseChannelPage();

  return (
    <ChannelForm
      initialData={data}
      onSubmit={(updatedData) => updateChannel(data.id, updatedData)}
      onCancel={onClose}
      title="Edit Channel"
    />
  );
}
