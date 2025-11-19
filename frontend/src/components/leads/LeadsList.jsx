export default function LeadsList({ visibleLeads, selectedIds, toggleSelect, toggleSelectAllVisible, setDetailLead, openEditLead, deleteLead, quickAction, page, setPage, totalPages }) {
  return (
    <div className="bg-white shadow rounded">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3"><input type="checkbox" onChange={toggleSelectAllVisible} checked={visibleLeads.length > 0 && visibleLeads.every(l => selectedIds.has(l.id))} /></th>
            <th className="p-3 text-left">Lead</th>
            <th className="p-3 text-left">Company</th>
            <th className="p-3 text-left">Contact</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Owner</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visibleLeads.map(l => (
            <tr key={l.id} className="border-t hover:bg-gray-50">
              <td className="p-3"><input type="checkbox" checked={selectedIds.has(l.id)} onChange={() => toggleSelect(l.id)} /></td>
              <td className="p-3 cursor-pointer" onClick={() => setDetailLead(l)}>
                <div className="font-medium">{l.name}</div>
                <div className="text-sm text-gray-500">{l.email}</div>
              </td>
              <td className="p-3">{l.company}</td>
              <td className="p-3">{l.contact}<div className="text-sm text-gray-500">{l.phone}</div></td>
              <td className="p-3"><span className="px-2 py-1 rounded text-sm border">{l.status}</span></td>
              <td className="p-3">{l.owner}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => quickAction('convert', l)} className="text-sm border px-2 py-1 rounded">Convert</button>
                <button onClick={() => quickAction('ticket', l)} className="text-sm border px-2 py-1 rounded">Ticket</button>
                <button onClick={() => openEditLead(l)} className="text-sm border px-2 py-1 rounded">Edit</button>
                <button onClick={() => deleteLead(l.id)} className="text-sm text-red-600">Delete</button>
              </td>
            </tr>
          ))}
          {visibleLeads.length === 0 && (
            <tr><td colSpan={7} className="p-6 text-center text-gray-500">No leads found.</td></tr>
          )}
        </tbody>
      </table>

      <div className="p-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {visibleLeads.length} leads</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} className="px-3 py-1 border rounded">Prev</button>
          <div className="px-3">{page} / {totalPages}</div>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}