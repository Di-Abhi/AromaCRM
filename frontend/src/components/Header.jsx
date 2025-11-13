import React, { useContext } from 'react';
import { StoreContext } from '../store/StoreProvider';

export default function Header() {
  const { state, dispatch } = useContext(StoreContext);
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <div className="text-xl font-semibold">AromaArt CRM</div>
      <div className="text-sm text-gray-600">User: {state.users.currentUser.name}</div>
    </header>
  );
}
