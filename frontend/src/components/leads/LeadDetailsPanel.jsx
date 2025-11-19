export default function LeadDetailsPanel({ lead, onClose, openEditLead, deleteLead, quickAction }) {
  if (!lead) return null;
  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-lg z-50">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Lead details</h3>
        <button onClick={onClose} className="text-gray-600">Close</button>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="text-sm text-gray-500">Name</div>
          <div className="font-medium">{lead.name}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Company</div>
          <div className="font-medium">{lead.company}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Contact</div>
          <div className="font-medium">{lead.contact} — {lead.phone}</div>
          <div className="text-sm text-gray-500">{lead.email}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Status</div>
          <div className="font-medium">{lead.status}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Owner</div>
          <div className="font-medium">{lead.owner}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Notes</div>
          <div className="whitespace-pre-wrap">{lead.notes}</div>
        </div>

        <div className="flex gap-2 pt-2">
          <button onClick={() => quickAction('convert', lead)} className="px-3 py-2 border rounded">Convert</button>
          <button onClick={() => quickAction('ticket', lead)} className="px-3 py-2 border rounded">Create Ticket</button>
          <button onClick={() => quickAction('assign', lead)} className="px-3 py-2 border rounded">Assign Owner</button>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <button onClick={() => openEditLead(lead)} className="px-3 py-2 border rounded">Edit</button>
          <button onClick={() => { if (confirm('Delete this lead?')) deleteLead(lead.id); }} className="px-3 py-2 text-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
}