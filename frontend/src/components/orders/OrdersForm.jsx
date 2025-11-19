import { useEffect, useState } from "react";

export default function OrderForm({ value, onCancel, onSave }) {
  const [state, setState] = useState(() => ({ ...value }));
  useEffect(()=>{ setState({...value}); },[value]);
  function handleChange(k,v){ setState(s=>({...s,[k]:v})); }

  function submit(e){ e.preventDefault(); onSave(state); }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={submit} className="bg-white w-full max-w-2xl p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{state.id ? 'Edit Order' : 'New Order'}</h2>
          <button type="button" onClick={onCancel} className="text-gray-600">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={state.clientName||''} onChange={e=>handleChange('clientName', e.target.value)} placeholder="Client name" className="border rounded px-3 py-2" />
          <input value={state.total||0} onChange={e=>handleChange('total', Number(e.target.value))} placeholder="Total amount" type="number" className="border rounded px-3 py-2" />
          <input value={state.notes||''} onChange={e=>handleChange('notes', e.target.value)} placeholder="Notes" className="border rounded px-3 py-2 col-span-2" />
          <select value={state.status||'pending'} onChange={e=>handleChange('status', e.target.value)} className="border rounded px-3 py-2">
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}