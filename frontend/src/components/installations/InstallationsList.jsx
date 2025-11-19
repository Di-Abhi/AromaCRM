  import React from 'react';
  export default function InstallationsList({ visible, selectedIds, toggleSelect, toggleSelectAll, openEdit, deleteInstallation, setDetailItem, markCompleted, assignTechnician, page, setPage, totalPages }) {
    function fmtDate(ts) { if (!ts) return '-'; try { return new Date(ts).toLocaleString(); } catch { return ts; } }
  
    return (
      <div className="bg-white shadow rounded">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3"><input type="checkbox" onChange={toggleSelectAll} checked={visible.length > 0 && visible.every(i => selectedIds.has(i.id))} /></th>
              <th className="p-3 text-left">Account</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Scheduled</th>
              <th className="p-3 text-left">Technician</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(i => (
              <tr key={i.id} className="border-t hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" checked={selectedIds.has(i.id)} onChange={() => toggleSelect(i.id)} /></td>
                <td className="p-3 cursor-pointer" onClick={() => setDetailItem(i)}>
                  <div className="font-medium">{i.accountId}</div>
                  <div className="text-sm text-gray-500">{i.clientId}</div>
                </td>
                <td className="p-3">{i.address}</td>
                <td className="p-3">{fmtDate(i.scheduledAt)}</td>
                <td className="p-3">{i.technician}</td>
                <td className="p-3"><span className="px-2 py-1 rounded text-sm border">{i.status}</span></td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => markCompleted(i.id)} className="text-sm border px-2 py-1 rounded">Mark Done</button>
                  <button onClick={() => assignTechnician(i.id)} className="text-sm border px-2 py-1 rounded">Assign</button>
                  <button onClick={() => openEdit(i)} className="text-sm border px-2 py-1 rounded">Edit</button>
                  <button onClick={() => deleteInstallation(i.id)} className="text-sm text-red-600">Delete</button>
                </td>
              </tr>
            ))}
  
            {visible.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-gray-500">No installations found.</td></tr>
            )}
          </tbody>
        </table>
  
        <div className="p-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">Showing {visible.length} installations</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} className="px-3 py-1 border rounded">Prev</button>
            <div className="px-3">{page} / {totalPages}</div>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    );
  }