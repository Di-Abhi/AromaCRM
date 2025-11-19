import React, { useEffect, useState } from 'react';
export default function InstallationForm({ value, onCancel, onSave }) {
  const [state, setState] = useState(() => ({ ...value }));

  useEffect(() => setState({ ...value }), [value]);

  function handleChange(k, v) { setState(s => ({ ...s, [k]: v })); }

  function submit(e) {
    e.preventDefault();
    onSave(state);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={submit} className="bg-white w-full max-w-2xl p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{state.id ? 'Edit Installation' : 'New Installation'}</h2>
          <button type="button" onClick={onCancel} className="text-gray-600">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={state.accountId || ''} onChange={e => handleChange('accountId', e.target.value)} placeholder="Account name" className="border rounded px-3 py-2" />
          <input value={state.clientId || ''} onChange={e => handleChange('clientId', e.target.value)} placeholder="Client ID" className="border rounded px-3 py-2" />
          <input value={state.address || ''} onChange={e => handleChange('address', e.target.value)} placeholder="Address" className="border rounded px-3 py-2" />
          <input type="datetime-local" value={state.scheduledAt ? new Date(state.scheduledAt).toISOString().slice(0,16) : ''} onChange={e => handleChange('scheduledAt', new Date(e.target.value).getTime())} className="border rounded px-3 py-2" />
          <input value={state.technician || ''} onChange={e => handleChange('technician', e.target.value)} placeholder="Technician" className="border rounded px-3 py-2" />
          <select value={state.status || 'scheduled'} onChange={e => handleChange('status', e.target.value)} className="border rounded px-3 py-2">
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mt-3">
          <textarea value={state.notes || ''} onChange={e => handleChange('notes', e.target.value)} placeholder="Notes" className="w-full border rounded px-3 py-2 h-28" />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}