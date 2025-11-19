import { useEffect, useState } from "react";

export default function SettingsProfile({ user, onSave }) {
  const [state, setState] = useState({ name: user?.name || '', email: user?.email || '' });
  useEffect(()=>setState({ name: user?.name||'', email: user?.email||'' }), [user]);
  function submit(e){ e.preventDefault(); onSave(state); }
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Profile</h3>
      <div className="flex flex-col gap-2">
        <input value={state.name} onChange={e=>setState(s=>({...s,name:e.target.value}))} placeholder="Full name" className="border rounded px-3 py-2" />
        <input value={state.email} onChange={e=>setState(s=>({...s,email:e.target.value}))} placeholder="Email" className="border rounded px-3 py-2" />
        <div className="flex justify-end gap-2 mt-2">
          <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded">Save</button>
        </div>
      </div>
    </form>
  );
}
