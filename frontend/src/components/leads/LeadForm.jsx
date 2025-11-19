  export default function LeadForm({ value, onCancel, onSave }) {
    const [state, setState] = useState(() => ({ ...value }));
  
    useEffect(() => { setState({ ...value }); }, [value]);
  
    function handleChange(k, v) {
      setState(s => ({ ...s, [k]: v }));
    }
  
    function submit(e) {
      e.preventDefault();
      onSave(state);
    }
  
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <form onSubmit={submit} className="bg-white w-full max-w-2xl p-6 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{state.id ? 'Edit Lead' : 'New Lead'}</h2>
            <button type="button" onClick={onCancel} className="text-gray-600">Close</button>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={state.name || ''} onChange={e => handleChange('name', e.target.value)} placeholder="Lead name" className="border rounded px-3 py-2" />
            <input value={state.company || ''} onChange={e => handleChange('company', e.target.value)} placeholder="Company" className="border rounded px-3 py-2" />
            <input value={state.contact || ''} onChange={e => handleChange('contact', e.target.value)} placeholder="Contact person" className="border rounded px-3 py-2" />
            <input value={state.email || ''} onChange={e => handleChange('email', e.target.value)} placeholder="Email" className="border rounded px-3 py-2" />
            <input value={state.phone || ''} onChange={e => handleChange('phone', e.target.value)} placeholder="Phone" className="border rounded px-3 py-2" />
            <select value={state.status || 'new'} onChange={e => handleChange('status', e.target.value)} className="border rounded px-3 py-2">
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
            <input value={state.owner || ''} onChange={e => handleChange('owner', e.target.value)} placeholder="Owner" className="border rounded px-3 py-2" />
            <input value={state.source || ''} onChange={e => handleChange('source', e.target.value)} placeholder="Source" className="border rounded px-3 py-2" />
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