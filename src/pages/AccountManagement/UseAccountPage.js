import { useEffect, useState } from "react";
import { db, ref, onValue, push, update, remove } from "../../firebaseClient";

export default function useAccountPage() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const accountRef = ref(db, "account_data");
    const unsub = onValue(accountRef, (snapshot) => {
      const val = snapshot.val() || {};
      const data = Object.entries(val).map(([id, value]) => ({ id, ...value }));
      setAccounts(data);
    });
    return () => unsub();
  }, []);

  const addAccount = async (data) => {
    const accountRef = ref(db, "account_data");
    await push(accountRef, data);
  };

  const updateAccount = async (id, data) => {
    const itemRef = ref(db, `account_data/${id}`);
    await update(itemRef, data);
  };

  const deleteAccount = async (id) => {
    const itemRef = ref(db, `account_data/${id}`);
    await remove(itemRef);
  };

  return { accounts, addAccount, updateAccount, deleteAccount };
}
