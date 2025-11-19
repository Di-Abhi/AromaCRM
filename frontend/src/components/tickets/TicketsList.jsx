export default function TicketsList({ visibleTickets, selectedIds, toggleSelect, toggleSelectAllVisible, setDetailTicket, openEditTicket, deleteTicket, assignTicket, escalateTicket, closeTicket, page, setPage, totalPages }) {
  function fmtDate(ts){ if(!ts) return '-'; try{ return new Date(ts).toLocaleString(); }catch{return ts; } }
  return (
    <div className="bg-white shadow rounded">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3"><input type="checkbox" onChange={toggleSelectAllVisible} checked={visibleTickets.length>0 && visibleTickets.every(t=>selectedIds.has(t.id))} /></th>
            <th className="p-3 text-left">Ticket</th>
            <th className="p-3 text-left">Client</th>
            <th className="p-3 text-left">Priority</th>
            <th className="p-3 text-left">Assignee</th>
            <th className="p-3 text-left">Created</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visibleTickets.map(t => (
            <tr key={t.id} className="border-t hover:bg-gray-50">
              <td className="p-3"><input type="checkbox" checked={selectedIds.has(t.id)} onChange={()=>toggleSelect(t.id)} /></td>
              <td className="p-3 cursor-pointer" onClick={()=>setDetailTicket(t)}>
                <div className="font-medium">{t.subject}</div>
                <div className="text-sm text-gray-500">{t.id}</div>
              </td>
              <td className="p-3">{t.client}</td>
              <td className="p-3">{t.priority}</td>
              <td className="p-3">{t.assignee}</td>
              <td className="p-3">{fmtDate(t.createdAt)}</td>
              <td className="p-3 flex gap-2">
                <button onClick={()=>assignTicket(t.id)} className="text-sm border px-2 py-1 rounded">Assign</button>
                <button onClick={()=>escalateTicket(t.id)} className="text-sm border px-2 py-1 rounded">Escalate</button>
                <button onClick={()=>closeTicket(t.id)} className="text-sm border px-2 py-1 rounded">Close</button>
                <button onClick={()=>openEditTicket(t)} className="text-sm border px-2 py-1 rounded">Edit</button>
                <button onClick={()=>deleteTicket(t.id)} className="text-sm text-red-600">Delete</button>
              </td>
            </tr>
          ))}
          {visibleTickets.length===0 && (<tr><td colSpan={7} className="p-6 text-center text-gray-500">No tickets found.</td></tr>)}
        </tbody>
      </table>

      <div className="p-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {visibleTickets.length} tickets</div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setPage(Math.max(1,page-1))} className="px-3 py-1 border rounded">Prev</button>
          <div className="px-3">{page} / {totalPages}</div>
          <button onClick={()=>setPage(Math.min(totalPages,page+1))} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}