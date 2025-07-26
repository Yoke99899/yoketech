import { useEffect, useState } from "react";
import { db, ref, onValue, push, update, remove } from "../../firebaseClient";

export default function useChannelPage() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const channelRef = ref(db, "channel_data");
    const unsub = onValue(channelRef, (snapshot) => {
      const val = snapshot.val() || {};
      const data = Object.entries(val).map(([id, value]) => ({ id, ...value }));
      setChannels(data);
    });
    return () => unsub();
  }, []);

  const addChannel = async (data) => {
    const channelRef = ref(db, "channel_data");
    await push(channelRef, data);
  };

  const updateChannel = async (id, data) => {
    const itemRef = ref(db, `channel_data/${id}`);
    await update(itemRef, data);
  };

  const deleteChannel = async (id) => {
    const itemRef = ref(db, `channel_data/${id}`);
    await remove(itemRef);
  };

  return { channels, addChannel, updateChannel, deleteChannel };
}
