import React, { useEffect, useState } from 'react';
export default function TicketForm({ value, onCancel, onSave }) {
  const [state, setState] = useState(() => ({ ...value }));
  useEffect(()=>{ setState({...value}); }, [value]);
  function handleChange(k,v){ setState(s=>({...s,[k]:v})); }
  function submit(e){ e.preventDefault(); onSave(state); }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={submit} className="bg-white w-full max-w-2xl p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{state.id ? 'Edit Ticket' : 'New Ticket'}</h2>
          <button type="button" onClick={onCancel} className="text-gray-600">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={state.subject||''} onChange={e=>handleChange('subject', e.target.value)} placeholder="Subject" className="border rounded px-3 py-2" />
          <input value={state.client||''} onChange={e=>handleChange('client', e.target.value)} placeholder="Client" className="border rounded px-3 py-2" />
          <select value={state.priority||'medium'} onChange={e=>handleChange('priority', e.target.value)} className="border rounded px-3 py-2">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input value={state.assignee||''} onChange={e=>handleChange('assignee', e.target.value)} placeholder="Assignee" className="border rounded px-3 py-2" />
        </div>

        <div className="mt-3">
          <textarea value={state.messages ? state.messages.join('\n') : ''} onChange={e=>handleChange('messages', e.target.value.split('\n'))} placeholder="Messages (one per line)" className="w-full border rounded px-3 py-2 h-28" />
        </div>

        <div className="mt-3">
          <textarea value={state.notes||''} onChange={e=>handleChange('notes', e.target.value)} placeholder="Notes" className="w-full border rounded px-3 py-2 h-20" />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}