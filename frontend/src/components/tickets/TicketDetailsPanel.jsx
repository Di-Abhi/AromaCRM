import React from 'react';
export default function TicketDetailsPanel({ ticket, onClose, openEditTicket, deleteTicket, assignTicket, escalateTicket, closeTicket }) {
  if (!ticket) return null;
  function fmtDate(ts){ if(!ts) return '-'; try{ return new Date(ts).toLocaleString(); }catch{return ts; } }
  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-lg z-50">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Ticket details</h3>
        <button onClick={onClose} className="text-gray-600">Close</button>
      </div>

      <div className="p-4 space-y-3">
        <div><div className="text-sm text-gray-500">Subject</div><div className="font-medium">{ticket.subject}</div></div>
        <div><div className="text-sm text-gray-500">Client</div><div className="font-medium">{ticket.client}</div></div>
        <div><div className="text-sm text-gray-500">Status / Priority</div><div className="font-medium">{ticket.status} — {ticket.priority}</div></div>
        <div><div className="text-sm text-gray-500">Assignee</div><div className="font-medium">{ticket.assignee}</div></div>
        <div><div className="text-sm text-gray-500">Messages</div><div className="whitespace-pre-wrap">{(ticket.messages||[]).join('\n')}</div></div>
        <div><div className="text-sm text-gray-500">Notes</div><div className="whitespace-pre-wrap">{ticket.notes}</div></div>
        <div><div className="text-sm text-gray-500">Created</div><div className="font-medium">{fmtDate(ticket.createdAt)}</div></div>

        <div className="flex gap-2 pt-2">
          <button onClick={()=>assignTicket(ticket.id)} className="px-3 py-2 border rounded">Assign</button>
          <button onClick={()=>escalateTicket(ticket.id)} className="px-3 py-2 border rounded">Escalate</button>
          <button onClick={()=>closeTicket(ticket.id)} className="px-3 py-2 border rounded">Close</button>
          <button onClick={()=>openEditTicket(ticket)} className="px-3 py-2 border rounded">Edit</button>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <button onClick={()=>{ if (confirm('Delete ticket?')) deleteTicket(ticket.id); }} className="px-3 py-2 text-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
}