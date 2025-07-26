import React from 'react';
import ChannelForm from './ChannelForm';
import UseChannelPage from './UseChannelPage';

export default function AddChannelPage({ onClose }) {
  const { addChannel } = UseChannelPage();

  const handleSubmit = async (data) => {
    await addChannel(data);
    onClose(); // Tutup form setelah submit
  };

  return (
    <ChannelForm
      onSubmit={handleSubmit}
      onCancel={onClose}
      title="Tambah Channel"
    />
  );
}
